import type { Selection } from "./selection.js";
import { isOpenAt, type CampaignStatus } from "./state.js";

/**
 * Las reglas del loop propio del agente (D13.1): dado lo observado, qué hacer ahora.
 * Es código puro y sin LLM: el LLM solo redacta los mensajes, y los envíos los hace otra
 * capa. Devuelve también lo que decidió NO hacer, para la bitácora pública (D13.2).
 *
 * Cada acción tiene una clave. Quien la ejecuta guarda cuántas veces la hizo y las pasa en
 * `done`: así un reinicio no repite avisos.
 */

export const LOOP_RULES = {
  /** Espera antes de reclamarle a un proveedor que no respondió. */
  supplierReminderAfterSeconds: 24 * 3600,
  /** Antes del límite, avisar al grupo si no se llegó al mínimo. */
  shortfallNoticeBeforeSeconds: [48 * 3600, 24 * 3600],
  /** Con el mínimo cubierto, ejecutar dentro de esta ventana final. */
  executionWindowSeconds: 2 * 3600,
  maxExecutionAttempts: 3,
} as const;

type FundsReason = "INSUFFICIENT_BALANCE" | "INSUFFICIENT_ALLOWANCE";

export interface LoopSnapshot {
  campaignId: string;
  now: number;
  status: CampaignStatus;
  deadline: number;
  minUnits: number;
  maxUnits: number;
  /** Selección calculada con lecturas del mismo bloque. */
  selection: Selection;
  /** Los eventos de la campaña cierran (`isConsistent`). */
  stateConsistent: boolean;
  /** Proveedores contactados que no respondieron, con la fecha del pedido. */
  pendingSuppliers: readonly { supplier: string; requestedAt: number }[];
  /** Cierre del plazo de ofertas; ausente si ya hay campaña creada. */
  offersCloseAt?: number;
  /** Quedan fondos para pagar el gas de la ejecución. */
  gasBudgetOk: boolean;
  /** Veces que ya se hizo cada acción, por clave. */
  done: Readonly<Record<string, number>>;
  /** Episodio actual de falta de fondos por comprador (`trackFunds`). Sin dato vale 0. */
  fundsEpisodes?: ReadonlyMap<string, number>;
}

export type LoopAction =
  | { type: "REMIND_SUPPLIER"; key: string; supplier: string }
  | { type: "PUBLISH_COMPARISON"; key: string }
  | { type: "NOTIFY_SHORTFALL"; key: string; missing: number }
  | { type: "NOTIFY_BUYER_FUNDS"; key: string; buyer: string; reason: FundsReason }
  | { type: "EXECUTE"; key: string; units: number }
  | { type: "NOTIFY_EXECUTION_STOPPED"; key: string }
  | { type: "NOTIFY_NO_GAS_BUDGET"; key: string }
  | { type: "NOTIFY_EXPIRED"; key: string }
  | { type: "REQUEST_DELIVERY"; key: string };

export type SkipCode =
  | "STATE_INCONSISTENT"
  | "READ_FAILED"
  | "BELOW_MINIMUM"
  | "OVER_MAXIMUM"
  | "WAITING_FINAL_WINDOW"
  | "ATTEMPTS_EXHAUSTED"
  | "NO_GAS_BUDGET";

/** Texto público de cada motivo. Sale de acá para que la bitácora nunca lleve texto libre. */
export const SKIP_TEXT: Readonly<Record<SkipCode, string>> = {
  STATE_INCONSISTENT: "El historial de la campaña no cierra: no se ejecuta hasta revisarlo.",
  READ_FAILED: "No se pudo leer el saldo de algún comprador: una lectura fallida no prueba nada.",
  BELOW_MINIMUM: "Todavía no hay suficientes compromisos con fondos para llegar al mínimo.",
  OVER_MAXIMUM: "La selección supera el máximo de la campaña: el contrato la rechazaría.",
  WAITING_FINAL_WINDOW: "Llegó al mínimo pero no al máximo: se espera la ventana final para sumar más gente.",
  ATTEMPTS_EXHAUSTED: "Se agotaron los intentos de ejecución: no se insiste.",
  NO_GAS_BUDGET: "Al agente no le queda saldo para pagar el costo de la operación.",
};

export interface LoopSkip {
  rule: "EXECUTE";
  code: SkipCode;
}

export interface LoopDecision {
  actions: LoopAction[];
  skipped: LoopSkip[];
}

const EXECUTE_KEY = "execute";

export function decide(s: LoopSnapshot): LoopDecision {
  const actions: LoopAction[] = [];
  const skipped: LoopSkip[] = [];
  const times = (key: string) => s.done[key] ?? 0;
  const once = (action: LoopAction) => {
    if (times(action.key) === 0) actions.push(action);
  };

  if (s.status === "EXECUTED") {
    once({ type: "REQUEST_DELIVERY", key: "request-delivery" });
    return { actions, skipped };
  }

  if (!isOpenAt(s.status, s.deadline, s.now)) {
    once({ type: "NOTIFY_EXPIRED", key: "notify-expired" });
    return { actions, skipped };
  }

  for (const { supplier, requestedAt } of s.pendingSuppliers) {
    if (s.now - requestedAt >= LOOP_RULES.supplierReminderAfterSeconds) {
      once({ type: "REMIND_SUPPLIER", key: `remind-supplier:${supplier}`, supplier });
    }
  }

  if (s.offersCloseAt !== undefined && s.now >= s.offersCloseAt) {
    once({ type: "PUBLISH_COMPARISON", key: "publish-comparison" });
  }

  for (const { buyer, reason } of s.selection.excluded) {
    if (reason === "OVER_QUOTA") continue;
    const episode = s.fundsEpisodes?.get(buyer) ?? 0;
    once({ type: "NOTIFY_BUYER_FUNDS", key: `notify-funds:${buyer}:${reason}:${episode}`, buyer, reason });
  }

  const units = s.selection.selected.length;
  const remaining = s.deadline - s.now;

  if (units < s.minUnits) {
    // Solo el umbral más urgente alcanzado: si el loop arranca tarde, no manda dos avisos juntos.
    const reached = LOOP_RULES.shortfallNoticeBeforeSeconds.filter((before) => remaining <= before).length;
    if (reached > 0) {
      once({ type: "NOTIFY_SHORTFALL", key: `notify-shortfall:${reached - 1}`, missing: s.minUnits - units });
    }
  }

  const skip = executionBlock(s, units, remaining);
  if (skip) {
    skipped.push({ rule: "EXECUTE", code: skip });
    if (skip === "ATTEMPTS_EXHAUSTED") once({ type: "NOTIFY_EXECUTION_STOPPED", key: "notify-execution-stopped" });
    if (skip === "NO_GAS_BUDGET") once({ type: "NOTIFY_NO_GAS_BUDGET", key: "notify-no-gas-budget" });
  } else {
    actions.push({ type: "EXECUTE", key: EXECUTE_KEY, units });
  }
  return { actions, skipped };
}

/** Por qué no se ejecuta ahora, o null si corresponde. Comprueba todo, sin confiar en un solo dato. */
function executionBlock(s: LoopSnapshot, units: number, remaining: number): SkipCode | null {
  if (!s.stateConsistent) return "STATE_INCONSISTENT";
  if (s.selection.unknown.length > 0) return "READ_FAILED";
  if (units < s.minUnits || !s.selection.meetsMinimum) return "BELOW_MINIMUM";
  if (units > s.maxUnits) return "OVER_MAXIMUM";
  if (units < s.maxUnits && remaining > LOOP_RULES.executionWindowSeconds) return "WAITING_FINAL_WINDOW";
  if ((s.done[EXECUTE_KEY] ?? 0) >= LOOP_RULES.maxExecutionAttempts) return "ATTEMPTS_EXHAUSTED";
  if (!s.gasBudgetOk) return "NO_GAS_BUDGET";
  return null;
}

export interface FundsRecord {
  reason: FundsReason | null;
  episode: number;
}

/**
 * Un aviso por cambio de estado (D13.1): cuando un comprador pasa a no tener fondos, o cambia
 * el motivo, empieza un episodio nuevo. Sin dato nuevo (fuera de cupo o lectura fallida) se
 * conserva lo anterior.
 */
export function trackFunds(
  previous: ReadonlyMap<string, FundsRecord>,
  selection: Pick<Selection, "selected" | "excluded">,
): Map<string, FundsRecord> {
  const next = new Map(previous);
  for (const buyer of selection.selected) {
    next.set(buyer, { reason: null, episode: previous.get(buyer)?.episode ?? 0 });
  }
  for (const { buyer, reason } of selection.excluded) {
    if (reason === "OVER_QUOTA") continue;
    const before = previous.get(buyer);
    if (!before) next.set(buyer, { reason, episode: 0 });
    else if (before.reason !== reason) next.set(buyer, { reason, episode: before.episode + 1 });
  }
  return next;
}

export const fundsEpisodes = (records: ReadonlyMap<string, FundsRecord>) =>
  new Map([...records].map(([buyer, record]) => [buyer, record.episode]));
