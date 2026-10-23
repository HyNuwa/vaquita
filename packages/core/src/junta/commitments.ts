import { type JuntaRules, type MemberId, validateRules } from "./rules.js";

/**
 * Qué compromete cada turno en una junta clásica (cuota fija, mismo pozo en cada ronda).
 * Son compromisos nominales programados, no predicciones de pérdida: lo aportado antes de
 * cobrar es lo que ese turno le adelanta al grupo; lo que debe después es lo que el grupo
 * le confía a ese miembro.
 */
export interface TurnCommitment {
  turn: number;
  member: MemberId;
  /** Lo que recibe en su ronda: un aporte de cada uno de los otros miembros. */
  receives: bigint;
  advancedBeforeCollecting: bigint;
  owedAfterCollecting: bigint;
}

export function turnCommitments(rules: JuntaRules): TurnCommitment[] {
  validateRules(rules);
  return commitmentsFor(rules.members, rules.amount);
}

/** Lo mismo para un orden candidato, antes de que exista la junta. */
export function commitmentsFor(order: readonly MemberId[], amount: bigint): TurnCommitment[] {
  const n = BigInt(order.length);
  return order.map((member, i) => {
    const k = BigInt(i + 1);
    return {
      turn: i + 1,
      member,
      receives: (n - 1n) * amount,
      advancedBeforeCollecting: (k - 1n) * amount,
      owedAfterCollecting: (n - k) * amount,
    };
  });
}
