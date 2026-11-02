/**
 * Estado de una campaña reconstruido desde los eventos del contrato.
 *
 * Idempotente por hash + índice de log: reprocesar o recibir eventos desordenados da el
 * mismo resultado. Si cambia la cadena canónica, se recalcula con `upToBlock`.
 */

export type CampaignEventType = "COMMITTED" | "CANCELLED" | "PURCHASE_CONFIRMED" | "EXECUTED" | "EXPIRED";

export interface CampaignEvent {
  type: CampaignEventType;
  campaignId: string;
  txHash: string;
  logIndex: number;
  blockNumber: number;
  /** Comprador, en COMMITTED, CANCELLED y PURCHASE_CONFIRMED. */
  buyer?: string;
}

export type CampaignStatus = "OPEN" | "EXECUTED" | "EXPIRED";

export interface CampaignState {
  status: CampaignStatus;
  /** Comprometidos y sin cancelar. */
  active: Set<string>;
  /** Cancelar es irreversible: no pueden volver a sumarse. */
  cancelled: Set<string>;
  purchased: Set<string>;
  /** Eventos que el contrato no debería permitir. Se informan, nunca se aplican. */
  anomalies: string[];
  /**
   * Un mismo hash + índice llegó con contenidos distintos (rama huérfana). No se elige
   * por orden de llegada: se descartan y hay que reprocesar desde un bloque válido.
   */
  conflicts: string[];
}

export interface StateOptions {
  /** Ignora eventos posteriores a este bloque (último bloque válido tras una reorganización). */
  upToBlock?: number;
}

const contentOf = (e: CampaignEvent) => `${e.type}|${e.buyer ?? ""}|${e.blockNumber}`;

export function buildState(
  campaignId: string,
  events: readonly CampaignEvent[],
  options: StateOptions = {},
): CampaignState {
  const state: CampaignState = {
    status: "OPEN",
    active: new Set(),
    cancelled: new Set(),
    purchased: new Set(),
    anomalies: [],
    conflicts: [],
  };

  const unique = new Map<string, CampaignEvent>();
  const conflicted = new Set<string>();
  for (const event of events) {
    if (event.campaignId !== campaignId) continue;
    if (options.upToBlock !== undefined && event.blockNumber > options.upToBlock) continue;
    const key = `${event.txHash}:${event.logIndex}`;
    const seen = unique.get(key);
    if (seen && contentOf(seen) !== contentOf(event)) conflicted.add(key);
    unique.set(key, event);
  }
  for (const key of [...conflicted].sort()) {
    unique.delete(key);
    state.conflicts.push(key);
  }

  const ordered = [...unique.values()].sort((a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex);
  // La ejecución es atómica: una compra solo vale en la misma tx que cierra la campaña.
  const executionTxs = new Set(ordered.filter((e) => e.type === "EXECUTED").map((e) => e.txHash));

  for (const event of ordered) apply(state, event, executionTxs);
  return state;
}

function apply(state: CampaignState, event: CampaignEvent, executionTxs: ReadonlySet<string>): void {
  const { type, buyer } = event;
  const ref = `${type} en ${event.txHash}:${event.logIndex}`;

  if (state.status !== "OPEN") return void state.anomalies.push(`${ref}: la campaña ya estaba cerrada`);

  if (type === "EXECUTED" || type === "EXPIRED") {
    state.status = type;
    return;
  }

  if (!buyer) return void state.anomalies.push(`${ref}: sin comprador`);

  if (type === "PURCHASE_CONFIRMED") {
    if (!executionTxs.has(event.txHash)) return void state.anomalies.push(`${ref}: sin cierre en la misma tx`);
    if (!state.active.has(buyer)) return void state.anomalies.push(`${ref}: el comprador no estaba activo`);
    if (state.purchased.has(buyer)) return void state.anomalies.push(`${ref}: cobro repetido`);
    state.purchased.add(buyer);
    return;
  }

  if (type === "COMMITTED") {
    if (state.cancelled.has(buyer) || state.active.has(buyer)) {
      return void state.anomalies.push(`${ref}: el comprador no podía comprometerse`);
    }
    state.active.add(buyer);
    return;
  }

  // CANCELLED
  if (!state.active.has(buyer)) return void state.anomalies.push(`${ref}: el comprador no estaba activo`);
  state.active.delete(buyer);
  state.cancelled.add(buyer);
}

/** Después del límite no se puede ejecutar aunque nadie haya llamado a `vencer()`. */
export function isOpenAt(status: CampaignStatus, deadline: number, now: number): boolean {
  return status === "OPEN" && now < deadline;
}

/** Si los eventos no cierran, el agente no ejecuta hasta que alguien lo revise. */
export const isConsistent = (state: CampaignState) => state.anomalies.length === 0 && state.conflicts.length === 0;
