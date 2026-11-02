import { randomUUID } from "node:crypto";
import { AgentLogError, type AgentLogEntry } from "./agent-log.js";
import { LOOP_RULES, decide, fundsEpisodes, trackFunds, type LoopAction } from "./loop.js";
import { selectBuyers, type BuyerFunds, type Selection } from "./selection.js";
import { buildState, isConsistent, isOpenAt, type CampaignEvent, type CampaignStatus } from "./state.js";
import type { CampaignRecord, CampaignStore } from "./store.js";
import { validateTerms, type CampaignTerms } from "./terms.js";

/**
 * El proceso que hace correr el loop propio (D13.1): observa, aplica `decide()`, actúa y lo
 * deja registrado. No conoce la cadena ni los canales: los recibe de afuera, así se prueba
 * sin red. La ejecución real sigue pasando por `tagged-sender.ts`, con dry-run por defecto.
 *
 * Cada paso que no se puede deshacer se guarda antes de hacerlo: un corte en cualquier punto
 * no puede reenviar una compra a ciegas ni afirmar algo falso.
 *
 * Los avisos y la bitácora se entregan al menos una vez: un corte justo después de avisar
 * puede repetir un aviso, pero nunca lo pierde. `action.key` identifica a cada uno.
 */

export interface CampaignChain {
  events(terms: CampaignTerms): Promise<readonly CampaignEvent[]>;
  /** Saldos y autorizaciones de un mismo bloque. Una lectura fallida va en null. */
  funds(terms: CampaignTerms, buyers: readonly string[]): Promise<ReadonlyMap<string, BuyerFunds>>;
}

export type PreparedExecution = { status: "DRY_RUN" } | { status: "READY"; txHash: string; signedTx: string };

/** `DROPPED`: su lugar en la cola de la cuenta ya lo usó otra tx, así que nunca va a entrar. */
export type TxStatus = "CONFIRMED" | "REVERTED" | "PENDING" | "NOT_FOUND" | "DROPPED";

/** Implementación real sobre `prepareTaggedTx` y `broadcast`. */
export interface ExecutionPort {
  /** Simula y firma `ejecutar()`, sin transmitir. Tira un error si la simulación falla. */
  prepare(terms: CampaignTerms, units: number): Promise<PreparedExecution>;
  /** Transmite. Si tira un error, la tx puede haber salido igual: se concilia por hash. */
  broadcast(signedTx: string): Promise<void>;
  status(txHash: string, signedTx: string): Promise<TxStatus>;
  /** Hay plata real en juego: un ensayo anterior no frena la ejecución de verdad. */
  isLive(): boolean;
}

type Notice = Exclude<LoopAction, { type: "EXECUTE" }>;
type LogWrite = (entry: Omit<AgentLogEntry, "at" | "campaignId" | "id">) => void;

export interface LoopDeps {
  store: CampaignStore;
  chain: CampaignChain;
  /** Avisa y reclama por los canales habilitados; el texto se arma ahí. */
  notify(campaignId: string, action: Notice): Promise<void>;
  execution: ExecutionPort;
  /** Los pedidos automáticos solo salen hacia proveedores de la lista permitida. */
  isAllowedSupplier(supplier: string): boolean;
  gasBudgetOk(): Promise<boolean>;
  log: { append(entry: AgentLogEntry): void };
  /** Segundos Unix. */
  now(): number;
}

export interface TickReport {
  campaigns: number;
  /** Solo para quien opera el proceso: no se publica. */
  errors: string[];
}

const EMPTY_SELECTION: Selection = { selected: [], excluded: [], unknown: [], meetsMinimum: false };

/** La compra ya se confirmó: su evento puede tardar y no hay que reenviarla. */
const SENT_KEY = "execute-sent";
const LOGGED_KEY = "execute-logged";
const DRY_RUN_KEY = "execute-dry-run";

const running = new WeakSet<object>();

/**
 * Avisos que salieron pero no se pudieron guardar como hechos. Viven en memoria hasta que
 * el disco vuelva: sin esto, cada reintento mandaría el mismo aviso otra vez.
 */
interface UnsavedNotice {
  key: string;
  entry: AgentLogEntry;
}
const unsavedNotices = new WeakMap<object, Map<string, UnsavedNotice[]>>();

function unsavedFor(store: object, campaignId: string): UnsavedNotice[] {
  const byCampaign = unsavedNotices.get(store) ?? new Map<string, UnsavedNotice[]>();
  unsavedNotices.set(store, byCampaign);
  const list = byCampaign.get(campaignId) ?? [];
  byCampaign.set(campaignId, list);
  return list;
}

/** Los errores de un nodo traen su URL, y la URL del RPC puede llevar una clave (regla 8). */
export function describeError(error: unknown): string {
  return String(error).replace(/\b(?:https?|wss?):\/\/\S+/gi, "[url oculta]");
}

export async function runTick(deps: LoopDeps): Promise<TickReport> {
  if (running.has(deps.store)) return { campaigns: 0, errors: ["Ya hay una vuelta en curso."] };
  running.add(deps.store);
  try {
    if (!deps.store.acquire()) return { campaigns: 0, errors: ["Otro proceso tiene el loop a cargo."] };
    const records = deps.store.list();
    const errors: string[] = [];
    for (const record of records) {
      try {
        await runCampaign(deps, record, errors);
      } catch (error) {
        errors.push(`${record.terms.id}: ${describeError(error)}`);
      }
    }
    return { campaigns: records.length, errors };
  } finally {
    running.delete(deps.store);
  }
}

async function runCampaign(deps: LoopDeps, record: CampaignRecord, errors: string[]): Promise<void> {
  const { terms } = record;
  // Condiciones inválidas: la campaña no hace nada, ni siquiera mirar.
  validateTerms(terms);

  const now = deps.now();
  const at = new Date(now * 1000).toISOString();
  const queue = (record.pendingLog ??= []);

  const write: LogWrite = (entry) => queue.push({ id: randomUUID(), at, campaignId: terms.id, ...entry });

  const flushLog = () => {
    if (queue.length === 0) return;
    while (queue.length > 0) {
      const [next] = queue;
      if (!next) break;
      try {
        deps.log.append(next);
      } catch (error) {
        errors.push(`${terms.id}: bitácora: ${describeError(error)}`);
        // Una entrada inválida nunca va a entrar y no puede trabar a las demás.
        if (!(error instanceof AgentLogError)) break;
      }
      queue.shift();
    }
    deps.store.save(record);
  };

  const mark = (key: string) => {
    record.done[key] = (record.done[key] ?? 0) + 1;
    deps.store.save(record);
  };

  const unsaved = unsavedFor(deps.store, terms.id);
  if (unsaved.length > 0) {
    for (const { key, entry } of unsaved) {
      record.done[key] = (record.done[key] ?? 0) + 1;
      queue.push(entry);
    }
    // Si sigue sin poder guardar, la campaña no sigue: nada se repite.
    deps.store.save(record);
    unsaved.length = 0;
  }

  flushLog();
  await reconcile(deps, record, now, write, mark, errors);

  let status: CampaignStatus = "OPEN";
  let selection = EMPTY_SELECTION;
  let stateConsistent = true;
  let gasBudgetOk = true;

  if (record.phase === "COMMITMENTS") {
    const events = await deps.chain.events(terms);
    const state = buildState(terms.id, events);
    status = state.status;
    stateConsistent = isConsistent(state);

    // Mientras la compra está en curso los saldos ya no dicen nada: se espera su evento.
    if (status === "OPEN" && (record.pendingExecution || (record.done[SENT_KEY] ?? 0) > 0)) {
      flushLog();
      return;
    }
    // La bitácora afirma lo que dice la cadena: el hash y las unidades salen de los eventos,
    // no de lo que este proceso pensaba ejecutar. Vale también si ejecutó otra tx.
    if (status === "EXECUTED" && (record.done[LOGGED_KEY] ?? 0) === 0) {
      const txHash = events.find((e) => e.type === "EXECUTED" && e.campaignId === terms.id)?.txHash.toLowerCase();
      const units = state.purchased.size;
      record.pendingExecution = undefined;
      write({ action: "EXECUTE", outcome: "DONE", ...(units > 0 ? { units } : {}), ...(txHash ? { txHash } : {}) });
      mark(LOGGED_KEY);
    }

    if (isOpenAt(status, terms.deadline, now)) {
      const funds = await deps.chain.funds(terms, [...state.active]);
      selection = selectBuyers(terms, state.active, funds);
      record.funds = Object.fromEntries(trackFunds(new Map(Object.entries(record.funds)), selection));
      gasBudgetOk = await deps.gasBudgetOk();
    }
  }

  const decision = decide({
    campaignId: terms.id,
    now,
    phase: record.phase,
    status,
    deadline: terms.deadline,
    minUnits: terms.minUnits,
    maxUnits: terms.maxUnits,
    selection,
    stateConsistent,
    pendingSuppliers: record.pendingSuppliers,
    offersCloseAt: record.offersCloseAt,
    gasBudgetOk,
    done: record.done,
    fundsEpisodes: fundsEpisodes(new Map(Object.entries(record.funds))),
  });

  const skip = decision.skipped[0]?.code;
  if (skip && skip !== record.lastSkip) write({ action: "EXECUTE", outcome: "SKIPPED", skipCode: skip });
  record.lastSkip = skip;
  deps.store.save(record);

  /** Un aviso que falla se reintenta en la próxima vuelta, pero se registra una sola vez. */
  const failOnce = (action: LoopAction) => {
    const key = `failed:${action.key}`;
    if ((record.done[key] ?? 0) === 0) {
      write({ action: action.type, outcome: "FAILED" });
      mark(key);
    }
  };

  for (const action of decision.actions) {
    if (action.type === "EXECUTE") {
      await runExecution(deps, record, action.units, write, mark, errors);
      continue;
    }
    if (action.type === "REMIND_SUPPLIER" && !deps.isAllowedSupplier(action.supplier)) {
      failOnce(action);
      continue;
    }
    // El intento se guarda antes de avisar: si guardar falla, no sale el aviso. Nunca se
    // abandona: un pedido de entrega no se puede perder porque el canal estuvo caído.
    const attemptKey = `attempt:${action.key}`;
    const retryKey = `retry:${action.key}`;
    if ((record.done[retryKey] ?? 0) > now) continue;
    const attempts = record.done[attemptKey] ?? 0;
    record.done[attemptKey] = attempts + 1;
    record.done[retryKey] = now + Math.min(LOOP_RULES.tickSeconds * 2 ** attempts, LOOP_RULES.noticeRetryMaxSeconds);
    deps.store.save(record);
    try {
      await deps.notify(terms.id, action);
    } catch (error) {
      errors.push(`${terms.id}: ${action.type}: ${describeError(error)}`);
      failOnce(action);
      continue;
    }
    write({
      action: action.type,
      outcome: "DONE",
      ...(action.type === "NOTIFY_SHORTFALL" ? { units: action.missing } : {}),
    });
    const entry = queue[queue.length - 1];
    if (entry) unsaved.push({ key: action.key, entry });
    mark(action.key);
    unsaved.pop();
  }

  flushLog();
}

/** Resuelve una ejecución anotada antes de hacer cualquier otra cosa con la campaña. */
async function reconcile(
  deps: LoopDeps,
  record: CampaignRecord,
  now: number,
  write: LogWrite,
  mark: (key: string) => void,
  errors: string[],
): Promise<void> {
  const pending = record.pendingExecution;
  if (!pending) return;
  const { txHash, signedTx, units } = pending;
  const hash = txHash.toLowerCase();

  // Si esta consulta falla, la campaña no sigue en esta vuelta: no se decide a ciegas.
  const status = await deps.execution.status(txHash, signedTx);

  if (status === "CONFIRMED") {
    // Se registra al llegar el evento, con lo que realmente se compró.
    record.pendingExecution = undefined;
    mark(SENT_KEY);
  } else if (status === "REVERTED") {
    record.pendingExecution = undefined;
    write({ action: "EXECUTE", outcome: "FAILED", units, txHash: hash });
    deps.store.save(record);
  } else if (status === "DROPPED") {
    // Es lo único que habilita firmar otra: esta ya no puede entrar.
    record.pendingExecution = undefined;
    write({ action: "EXECUTE", outcome: "FAILED", units });
    deps.store.save(record);
  } else if (status === "NOT_FOUND" && now >= record.terms.deadline + LOOP_RULES.executionTimeoutSeconds) {
    // Si hubiera entrado a tiempo ya se vería, y de acá en más solo podría revertir.
    record.pendingExecution = undefined;
    write({ action: "EXECUTE", outcome: "FAILED", units });
    deps.store.save(record);
  } else {
    // Sin rastro no significa perdida: se retransmiten los mismos bytes, nunca otra tx.
    // Pasado el límite solo se espera: transmitir gastaría gas en una tx que va a revertir.
    if (status === "NOT_FOUND" && now < record.terms.deadline) {
      try {
        await deps.execution.broadcast(signedTx);
      } catch (error) {
        errors.push(`${record.terms.id}: EXECUTE: ${describeError(error)}`);
      }
    }
    if (now - pending.at >= LOOP_RULES.executionTimeoutSeconds) {
      errors.push(`${record.terms.id}: la compra ${hash} sigue sin confirmarse.`);
    }
  }
}

async function runExecution(
  deps: LoopDeps,
  record: CampaignRecord,
  units: number,
  write: LogWrite,
  mark: (key: string) => void,
  errors: string[],
): Promise<void> {
  const { terms, done } = record;
  // En ensayo se ejecuta una sola vez; al pasar a real, la campaña sigue su curso.
  if (!deps.execution.isLive() && (done[DRY_RUN_KEY] ?? 0) > 0) return;

  // Las esperas de esta vuelta pueden haber cruzado el límite: no se gasta un intento.
  const now = deps.now();
  if (now >= terms.deadline) return;

  // El intento se guarda antes de firmar: si el proceso se corta, no se pierde la cuenta.
  mark("execute");

  let prepared: PreparedExecution;
  try {
    prepared = await deps.execution.prepare(terms, units);
  } catch (error) {
    errors.push(`${terms.id}: EXECUTE: ${describeError(error)}`);
    write({ action: "EXECUTE", outcome: "FAILED", units });
    deps.store.save(record);
    return;
  }

  if (prepared.status === "DRY_RUN") {
    // El ensayo no es un intento fallido: se hace una vez y no agota los reintentos.
    done.execute = (done.execute ?? 1) - 1;
    write({ action: "EXECUTE", outcome: "DRY_RUN", units });
    mark(DRY_RUN_KEY);
    return;
  }

  // Preparar también lleva tiempo: pasado el límite, la tx solo gastaría gas en revertir.
  if (deps.now() >= terms.deadline) return;

  // Primero se guarda el hash. Si guardar falla, esto corta acá y la tx no sale.
  record.pendingExecution = { txHash: prepared.txHash, signedTx: prepared.signedTx, at: now, units };
  deps.store.save(record);

  try {
    await deps.execution.broadcast(prepared.signedTx);
  } catch (error) {
    // Pudo haber salido igual: la próxima vuelta lo resuelve por hash.
    errors.push(`${terms.id}: EXECUTE: ${describeError(error)}`);
  }
}

export interface LoopOptions {
  intervalSeconds?: number;
  onReport?(report: TickReport): void;
}

/** Vuelve a correr recién cuando terminó la vuelta anterior: nunca hay dos a la vez. */
export function startLoop(deps: LoopDeps, options: LoopOptions = {}): () => void {
  const delay = (options.intervalSeconds ?? LOOP_RULES.tickSeconds) * 1000;
  let stopped = false;
  let busy = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const release = () => {
    try {
      deps.store.release();
    } catch {
      /* si no se puede soltar, lo libera el fin del proceso */
    }
  };

  const report = (value: TickReport) => {
    // Un problema de quien observa nunca puede frenar el loop.
    try {
      options.onReport?.(value);
    } catch {
      /* se ignora a propósito */
    }
  };

  const run = async () => {
    if (stopped) return;
    busy = true;
    try {
      report(await runTick(deps));
    } catch (error) {
      report({ campaigns: 0, errors: [describeError(error)] });
    }
    busy = false;
    if (stopped) release();
    else timer = setTimeout(() => void run(), delay);
  };
  void run();

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    if (!busy) release();
  };
}
