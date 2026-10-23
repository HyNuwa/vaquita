import { commitmentsFor, type TurnCommitment } from "./commitments.js";
import { JuntaRulesError, type MemberId } from "./rules.js";

/**
 * Orden de turnos (docs/proyecto/plan-junta-contrato.md, sección 3). Cada miembro dice cuánto
 * puede adelantar antes de cobrar; el turno k adelanta (k − 1) aportes, así que su límite fija
 * el último turno que puede tomar. El motor lista los órdenes que respetan todos los límites y
 * muestra cuánto adelanta y cuánto sigue debiendo cada turno.
 *
 * El motor recomienda, no decide: el grupo aprueba el orden y todos lo aceptan. Tampoco juzga
 * quién es confiable; solo ordena por margen, que es aritmética.
 */

/** Con 8 personas o menos se prueban todos los órdenes (8! = 40.320). */
export const EXHAUSTIVE_MAX_MEMBERS = 8;

export interface TurnOrderInput {
  members: readonly MemberId[];
  /** Aporte por ronda, en unidades de 18 decimales. */
  amount: bigint;
  /** Cuánto puede adelantar cada miembro antes de cobrar, en las mismas unidades. */
  maxAdvance: Readonly<Record<MemberId, bigint>>;
}

export interface TurnOrderOption {
  order: MemberId[];
  commitments: TurnCommitment[];
  /** El menor sobrante entre lo que cada uno puede adelantar y lo que adelanta en este orden. */
  minMargin: bigint;
}

export type TurnOrderResult =
  | {
      viable: true;
      /** Cuántos órdenes respetan los límites, aunque no se listen todos. */
      total: bigint;
      /** true si se probaron todos los órdenes; si no, `options` trae solo el de mayor margen. */
      exhaustive: boolean;
      /** De mayor a menor margen. */
      options: TurnOrderOption[];
    }
  | {
      viable: false;
      /** Estos miembros solo pueden ir en los primeros `firstTurns` turnos, y no entran todos. */
      crowded: { members: MemberId[]; firstTurns: number };
      /** El mayor aporte con el que la junta sería viable; 0n si bajar el monto no alcanza. */
      maxViableAmount: bigint;
    };

/**
 * Busca los órdenes de turno posibles. Con más de `EXHAUSTIVE_MAX_MEMBERS` miembros no los
 * prueba todos: devuelve el de mayor margen, que es ordenar por límite de menor a mayor.
 */
export function findTurnOrders(input: TurnOrderInput, opts: { limit?: number } = {}): TurnOrderResult {
  const { members, amount } = input;
  const limit = validate(input);
  const n = members.length;
  const maxTurn = new Map(members.map((m) => [m, lastTurnFor(limit(m), amount, n)]));

  // Quien menos puede adelantar va primero. Ese orden existe si y solo si hay algún orden
  // posible, y es el de mayor margen: cambiar a dos de lugar nunca sube el mínimo.
  const byLimit = [...members].sort((a, b) => cmp(limit(a), limit(b)));
  let total = 1n;
  for (let i = 0; i < n; i++) {
    const free = maxTurn.get(byLimit[i]!)! - i;
    if (free <= 0) {
      return {
        viable: false,
        crowded: { members: byLimit.slice(0, i + 1), firstTurns: maxTurn.get(byLimit[i]!)! },
        maxViableAmount: maxViableAmount(byLimit.map(limit)),
      };
    }
    total *= BigInt(free);
  }

  const option = (order: MemberId[]): TurnOrderOption => ({
    order,
    commitments: commitmentsFor(order, amount),
    minMargin: order.reduce((min, m, i) => {
      const margin = limit(m) - BigInt(i) * amount;
      return margin < min ? margin : min;
    }, limit(order[0]!)),
  });

  if (n > EXHAUSTIVE_MAX_MEMBERS) return { viable: true, total, exhaustive: false, options: [option(byLimit)] };

  const all: TurnOrderOption[] = [];
  const order: MemberId[] = [];
  const used = new Set<MemberId>();
  const place = () => {
    if (order.length === n) return void all.push(option([...order]));
    const turn = order.length + 1;
    for (const m of members) {
      if (used.has(m) || maxTurn.get(m)! < turn) continue;
      used.add(m);
      order.push(m);
      place();
      order.pop();
      used.delete(m);
    }
  };
  place();
  // Orden estable: a igual margen queda el que sigue el orden en que se anotaron.
  all.sort((a, b) => cmp(b.minMargin, a.minMargin));
  return { viable: true, total, exhaustive: true, options: all.slice(0, opts.limit ?? 5) };
}

function validate({ members, amount, maxAdvance }: TurnOrderInput): (m: MemberId) => bigint {
  if (members.length < 2) throw new JuntaRulesError("Una junta necesita al menos 2 miembros.");
  if (members.some((m) => !m)) throw new JuntaRulesError("Hay un miembro sin id.");
  if (new Set(members).size !== members.length) throw new JuntaRulesError("Hay miembros repetidos.");
  if (amount <= 0n) throw new JuntaRulesError("El aporte tiene que ser mayor a cero.");
  for (const m of members) {
    if (!Object.hasOwn(maxAdvance, m)) throw new JuntaRulesError(`Falta cuánto puede adelantar ${m}.`);
    if (maxAdvance[m]! < 0n) throw new JuntaRulesError(`Lo que puede adelantar ${m} no puede ser negativo.`);
  }
  return (m) => maxAdvance[m]!;
}

/** El turno k adelanta (k − 1) aportes: con límite L, el último turno posible es ⌊L / aporte⌋ + 1. */
function lastTurnFor(limit: bigint, amount: bigint, n: number): number {
  const turns = limit / amount + 1n;
  return turns > BigInt(n) ? n : Number(turns);
}

/** Con los límites de menor a mayor, el i-ésimo (desde 0) tiene que poder adelantar i aportes. */
function maxViableAmount(sortedLimits: bigint[]): bigint {
  let best: bigint | undefined;
  for (let i = 1; i < sortedLimits.length; i++) {
    const a = sortedLimits[i]! / BigInt(i);
    if (best === undefined || a < best) best = a;
  }
  return best ?? 0n;
}

const cmp = (a: bigint, b: bigint) => (a < b ? -1 : a > b ? 1 : 0);
