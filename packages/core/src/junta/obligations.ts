import type { Hex } from "viem";
import {
  type JuntaRules,
  type MemberId,
  recipientOf,
  roundCount,
  roundDueAt,
  roundOpensAt,
  validateRules,
} from "./rules.js";

/**
 * Contabilidad de obligaciones de una junta (docs/proyecto/plan-junta-contrato.md, "La parte
 * financiera"). El motor registra deudas, no solo pagos: un pago es una forma de cumplir una
 * obligación, así una deuda vencida nunca se confunde con un pago.
 *
 * No depende de cómo llega la plata: el contrato (`CONTRACT_P2P`) y las transferencias
 * directas (`DIRECT_P2P`) entregan el mismo `PaymentEvent`. Ningún pago se reparte entre
 * deudas ni se adivina: lo que no coincide exacto con una obligación va a revisión.
 */

const DAY = 86_400;

export interface Obligation {
  /** Único por junta, ronda y deudor: cada miembro paga como mucho una vez por ronda. */
  id: string;
  juntaId: string;
  round: number;
  debtor: MemberId;
  creditor: MemberId;
  amount: bigint;
  opensAt: number;
  dueAt: number;
}

export const obligationId = (juntaId: string, round: number, debtor: MemberId) => `${juntaId}:${round}:${debtor}`;

/** Una obligación por miembro y ronda, salvo para quien cobra esa ronda. */
export function buildObligations(rules: JuntaRules): Obligation[] {
  validateRules(rules);
  const out: Obligation[] = [];
  for (let round = 1; round <= roundCount(rules); round++) {
    const creditor = recipientOf(rules, round);
    for (const debtor of rules.members) {
      if (debtor === creditor) continue;
      out.push({
        id: obligationId(rules.id, round, debtor),
        juntaId: rules.id,
        round,
        debtor,
        creditor,
        amount: rules.amount,
        opensAt: roundOpensAt(rules, round),
        dueAt: roundDueAt(rules, round),
      });
    }
  }
  return out;
}

/** Un pago ya verificado en la cadena y traducido a miembros (sin direcciones). */
export interface PaymentEvent {
  juntaId: string;
  round: number;
  debtor: MemberId;
  creditor: MemberId;
  amount: bigint;
  paidAt: number;
  txHash: Hex;
  logIndex: number;
}

export type ReviewReason =
  | "otra_junta"
  | "sin_obligacion"
  | "ronda_no_empezo"
  | "ronda_anulada"
  | "acreedor_distinto"
  | "monto_distinto"
  | "ya_pagada";

export type RecordOutcome =
  | { kind: "paid"; obligationId: string; daysLate: number }
  | { kind: "duplicate" }
  | { kind: "review"; reason: ReviewReason };

export type ObligationStatus =
  | { kind: "upcoming" }
  | { kind: "pending" }
  | { kind: "overdue"; daysLate: number }
  | { kind: "paid"; paidAt: number; daysLate: number; txHash: Hex }
  | { kind: "cancelled" };

export interface RoundStatus {
  round: number;
  recipient: MemberId;
  opensAt: number;
  dueAt: number;
  /** Pasó el vencimiento con la gracia. No dice nada de si se pagó. */
  closedByDate: boolean;
  /** Todas sus obligaciones están pagadas. Una ronda puede cerrar por fecha sin saldarse. */
  settled: boolean;
  cancelled: boolean;
  paid: MemberId[];
  outstanding: MemberId[];
  overdue: MemberId[];
}

interface Paid {
  paidAt: number;
  txHash: Hex;
}

/** Días o fracción: un segundo tarde ya es un día de atraso. */
const daysLate = (dueAt: number, at: number) => (at > dueAt ? Math.ceil((at - dueAt) / DAY) : 0);

export class ObligationBook {
  private readonly obligations = new Map<string, Obligation>();
  private readonly paid = new Map<string, Paid>();
  private readonly seen = new Set<string>();
  private readonly toReview: { event: PaymentEvent; reason: ReviewReason }[] = [];
  private suspendedAt: number | undefined;

  constructor(readonly rules: JuntaRules) {
    for (const o of buildObligations(rules)) this.obligations.set(o.id, o);
  }

  /**
   * Aplica un pago. Idempotente por hash + índice de log: el mismo evento dos veces no suma
   * dos pagos. Un pago tardío cumple la obligación original y guarda su atraso.
   */
  record(event: PaymentEvent): RecordOutcome {
    const key = `${event.txHash.toLowerCase()}:${event.logIndex}`;
    if (this.seen.has(key)) return { kind: "duplicate" };
    this.seen.add(key);

    const reason = this.mismatch(event);
    if (reason) {
      this.toReview.push({ event, reason });
      return { kind: "review", reason };
    }
    const id = obligationId(event.juntaId, event.round, event.debtor);
    const o = this.obligations.get(id)!;
    this.paid.set(id, { paidAt: event.paidAt, txHash: event.txHash });
    return { kind: "paid", obligationId: id, daysLate: daysLate(o.dueAt, event.paidAt) };
  }

  private mismatch(e: PaymentEvent): ReviewReason | undefined {
    if (e.juntaId !== this.rules.id) return "otra_junta";
    const id = obligationId(e.juntaId, e.round, e.debtor);
    const o = this.obligations.get(id);
    if (!o) return "sin_obligacion";
    if (this.isCancelled(o)) return "ronda_anulada";
    if (e.paidAt < o.opensAt) return "ronda_no_empezo";
    if (e.creditor !== o.creditor) return "acreedor_distinto";
    if (e.amount !== o.amount) return "monto_distinto";
    // Un segundo pago de la misma deuda con otra tx: no se cuenta, se revisa.
    if (this.paid.has(id)) return "ya_pagada";
    return undefined;
  }

  /**
   * El grupo suspende o termina la junta (en el MVP se registra fuera de la cadena). Las rondas
   * que abren después quedan anuladas; las deudas de rondas ya abiertas se pueden pagar siempre.
   */
  suspend(at: number): void {
    if (this.suspendedAt === undefined || at < this.suspendedAt) this.suspendedAt = at;
  }

  private isCancelled(o: Obligation): boolean {
    return this.suspendedAt !== undefined && o.opensAt > this.suspendedAt;
  }

  status(id: string, now: number): ObligationStatus {
    const o = this.obligations.get(id);
    if (!o) throw new Error(`No existe la obligación ${id}`);
    const p = this.paid.get(id);
    if (p) return { kind: "paid", paidAt: p.paidAt, daysLate: daysLate(o.dueAt, p.paidAt), txHash: p.txHash };
    if (this.isCancelled(o)) return { kind: "cancelled" };
    if (now < o.opensAt) return { kind: "upcoming" };
    if (now > o.dueAt) return { kind: "overdue", daysLate: daysLate(o.dueAt, now) };
    return { kind: "pending" };
  }

  roundStatus(round: number, now: number): RoundStatus {
    const recipient = recipientOf(this.rules, round);
    const ofRound = this.list().filter((o) => o.round === round);
    const paid: MemberId[] = [];
    const outstanding: MemberId[] = [];
    const overdue: MemberId[] = [];
    let cancelled = false;
    for (const o of ofRound) {
      const s = this.status(o.id, now);
      if (s.kind === "paid") paid.push(o.debtor);
      else if (s.kind === "cancelled") cancelled = true;
      else {
        outstanding.push(o.debtor);
        if (s.kind === "overdue") overdue.push(o.debtor);
      }
    }
    const dueAt = roundDueAt(this.rules, round);
    return {
      round,
      recipient,
      opensAt: roundOpensAt(this.rules, round),
      dueAt,
      closedByDate: now > dueAt,
      settled: !cancelled && outstanding.length === 0,
      cancelled,
      paid,
      outstanding,
      overdue,
    };
  }

  list(): Obligation[] {
    return [...this.obligations.values()];
  }

  /** Pagos que no se pudieron asignar a una obligación: los revisa una persona. */
  pendingReview(): readonly { event: PaymentEvent; reason: ReviewReason }[] {
    return this.toReview;
  }
}
