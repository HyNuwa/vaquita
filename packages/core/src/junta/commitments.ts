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
  const n = BigInt(rules.members.length);
  return rules.members.map((member, i) => {
    const k = BigInt(i + 1);
    return {
      turn: i + 1,
      member,
      receives: (n - 1n) * rules.amount,
      advancedBeforeCollecting: (k - 1n) * rules.amount,
      owedAfterCollecting: (n - k) * rules.amount,
    };
  });
}
