/**
 * Reglas de una junta clásica, fijas desde que se crea (docs/proyecto/plan-junta-contrato.md).
 * Son las mismas que guarda el contrato `JuntaReglas`: el motor no inventa nada que el
 * contrato no sepa.
 *
 * Los miembros se identifican por un id interno (alias), nunca por su dirección: el LLM
 * solo ve aliases y la traducción a direcciones vive en otra capa.
 */

export type MemberId = string;

export interface JuntaRules {
  id: string;
  /** En orden de turno: members[k - 1] cobra la ronda k. */
  members: readonly MemberId[];
  /** Aporte de cada miembro por ronda, en unidades de 18 decimales. */
  amount: bigint;
  /** Apertura de la ronda 1, en segundos Unix. */
  startsAt: number;
  periodSeconds: number;
  /** Plazo después de la apertura de cada ronda para pagar sin atraso. */
  graceSeconds: number;
}

export class JuntaRulesError extends Error {
  override name = "JuntaRulesError";
}

export function validateRules(rules: JuntaRules): void {
  const { id, members, amount, startsAt, periodSeconds, graceSeconds } = rules;
  if (!id) throw new JuntaRulesError("La junta necesita un id.");
  // Sin máximo universal (decisión A6): el tamaño lo limita la exposición, no el código.
  if (members.length < 2) throw new JuntaRulesError("Una junta necesita al menos 2 miembros.");
  if (members.some((m) => !m)) throw new JuntaRulesError("Hay un miembro sin id.");
  if (new Set(members).size !== members.length) throw new JuntaRulesError("Hay miembros repetidos.");
  if (amount <= 0n) throw new JuntaRulesError("El aporte tiene que ser mayor a cero.");
  if (!Number.isSafeInteger(startsAt) || startsAt < 0) throw new JuntaRulesError("Fecha de inicio inválida.");
  if (!Number.isSafeInteger(periodSeconds) || periodSeconds <= 0) {
    throw new JuntaRulesError("El período tiene que ser un número entero de segundos mayor a cero.");
  }
  // La gracia puede superar el período: las rondas se superponen y eso está permitido.
  if (!Number.isSafeInteger(graceSeconds) || graceSeconds < 0) {
    throw new JuntaRulesError("La gracia tiene que ser un número entero de segundos, cero o más.");
  }
}

export const roundCount = (rules: JuntaRules) => rules.members.length;

/** Quién cobra la ronda k (1..N). */
export function recipientOf(rules: JuntaRules, round: number): MemberId {
  const m = rules.members[round - 1];
  if (m === undefined) throw new JuntaRulesError(`La ronda ${round} no existe en esta junta.`);
  return m;
}

export const roundOpensAt = (rules: JuntaRules, round: number) => rules.startsAt + (round - 1) * rules.periodSeconds;

export const roundDueAt = (rules: JuntaRules, round: number) => roundOpensAt(rules, round) + rules.graceSeconds;
