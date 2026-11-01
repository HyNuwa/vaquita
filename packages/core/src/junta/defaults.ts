import type { ObligationBook } from "./obligations.js";
import { type JuntaRules, JuntaRulesError, type MemberId, roundCount, validateRules } from "./rules.js";

/**
 * Escenarios de incumplimiento (D2, docs/proyecto/plan-junta-contrato.md, "Cuando alguien no
 * paga"). Sin garantías ni compensación automática: el motor no cubre ni reparte pérdidas,
 * solo muestra qué queda impago y a quién afecta. Qué hace el grupo lo decide la política que
 * aceptó al crear la junta.
 */

export interface StopPayingScenario {
  member: MemberId;
  turn: number;
  /** Primera ronda que deja de pagar. */
  fromRound: number;
  /** Si ya cobró su pozo antes de dejar de pagar. */
  collectedBefore: boolean;
  /** Lo que recibió (su pozo, si ya cobró). */
  received: bigint;
  /** Lo que aportó a los demás antes de dejar de pagar. */
  paid: bigint;
  /**
   * received − paid. Positivo: se lleva plata del grupo y es lo que queda impago para los que
   * siguen. Negativo: adelantó más de lo que recibió y el grupo le debe su pozo.
   */
  net: bigint;
  /** Total de aportes que no va a hacer. */
  unpaid: bigint;
  /** A quién le falta cada aporte impago, en orden de ronda. */
  affected: { round: number; creditor: MemberId; amount: bigint }[];
}

/**
 * Qué pasa si `member` deja de pagar desde `fromRound`, suponiendo que pagó todo lo anterior
 * y que los demás siguen pagando. Por defecto, justo después de cobrar.
 */
export function stopPayingScenario(rules: JuntaRules, member: MemberId, fromRound?: number): StopPayingScenario {
  validateRules(rules);
  const n = roundCount(rules);
  const turn = rules.members.indexOf(member) + 1;
  if (turn === 0) throw new JuntaRulesError(`${member} no es miembro de esta junta.`);
  const from = fromRound ?? turn + 1;
  if (!Number.isInteger(from) || from < 1 || from > n + 1) {
    throw new JuntaRulesError(`La ronda ${from} no existe en esta junta.`);
  }

  const collectedBefore = turn < from;
  const roundsPaid = from - 1 - (collectedBefore ? 1 : 0);
  const received = collectedBefore ? BigInt(n - 1) * rules.amount : 0n;
  const paid = BigInt(roundsPaid) * rules.amount;
  const affected: StopPayingScenario["affected"] = [];
  for (let round = from; round <= n; round++) {
    if (round !== turn) affected.push({ round, creditor: rules.members[round - 1]!, amount: rules.amount });
  }
  return {
    member,
    turn,
    fromRound: from,
    collectedBefore,
    received,
    paid,
    net: received - paid,
    unpaid: BigInt(affected.length) * rules.amount,
    affected,
  };
}

/** La tabla para mostrar antes de entrar: cada turno deja de pagar justo después de cobrar. */
export function afterCollectingScenarios(rules: JuntaRules): StopPayingScenario[] {
  return rules.members.map((m) => stopPayingScenario(rules, m));
}

export interface MemberPosition {
  member: MemberId;
  turn: number;
  /** Aportes que le llegaron. */
  received: bigint;
  /** Aportes que hizo. */
  paid: bigint;
  /** received − paid: cuánto le confió el grupo hasta ahora (negativo si es al revés). */
  net: bigint;
  /** Lo que debe y ya venció. */
  overdue: bigint;
  /** Lo que le deben y ya venció. */
  overdueToThem: bigint;
  /** Lo que todavía le falta pagar sin vencer, sin contar rondas anuladas. */
  upcoming: bigint;
}

export interface JuntaPosition {
  members: MemberPosition[];
  totalOverdue: bigint;
  /**
   * La parte de lo vencido que deben miembros que ya cobraron. Es el riesgo de D2: plata que
   * el grupo ya les adelantó y que nadie cubre.
   */
  overdueAfterCollecting: bigint;
}

/** Posición real de cada miembro en un momento dado, a partir de las obligaciones y los pagos. */
export function juntaPosition(book: ObligationBook, now: number): JuntaPosition {
  const { members } = book.rules;
  const pos = new Map<MemberId, MemberPosition>(
    members.map((member, i) => [
      member,
      { member, turn: i + 1, received: 0n, paid: 0n, net: 0n, overdue: 0n, overdueToThem: 0n, upcoming: 0n },
    ]),
  );
  for (const o of book.list()) {
    const debtor = pos.get(o.debtor)!;
    const creditor = pos.get(o.creditor)!;
    const s = book.status(o.id, now);
    if (s.kind === "paid") {
      debtor.paid += o.amount;
      creditor.received += o.amount;
    } else if (s.kind === "overdue") {
      debtor.overdue += o.amount;
      creditor.overdueToThem += o.amount;
    } else if (s.kind !== "cancelled") {
      debtor.upcoming += o.amount;
    }
  }

  let totalOverdue = 0n;
  let overdueAfterCollecting = 0n;
  for (const p of pos.values()) {
    p.net = p.received - p.paid;
    totalOverdue += p.overdue;
    if (p.received > 0n) overdueAfterCollecting += p.overdue;
  }
  return { members: [...pos.values()], totalOverdue, overdueAfterCollecting };
}
