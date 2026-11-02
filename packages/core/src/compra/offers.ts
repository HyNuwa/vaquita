/**
 * Ofertas y voto. El código ordena y cuenta; **nunca elige proveedor**: decide la comunidad.
 * Las ofertas son datos de terceros, no instrucciones.
 */

export interface Need {
  units: number;
  /** Presupuesto máximo por unidad, con impuestos. */
  maxUnitPrice: bigint;
}

export interface Offer {
  id: string;
  supplier: string;
  /** Precio final por unidad, con impuestos, en 18 decimales. */
  unitPrice: bigint;
  minUnits: number;
  maxUnits: number;
  /** Vigencia en segundos Unix. */
  validUntil: number;
}

export type OfferRejection = "INVALID" | "DUPLICATE_ID" | "EXPIRED" | "OVER_BUDGET" | "UNITS_NOT_COVERED";

export interface OfferComparison {
  /** Del menor al mayor precio. Es un orden para leer, no una elección. */
  ranking: Offer[];
  rejected: { offerId: string; reason: OfferRejection }[];
}

function isWellFormed(o: Offer): boolean {
  return (
    Boolean(o.id) &&
    Boolean(o.supplier) &&
    o.unitPrice > 0n &&
    Number.isSafeInteger(o.minUnits) &&
    o.minUnits >= 1 &&
    Number.isSafeInteger(o.maxUnits) &&
    o.maxUnits >= o.minUnits &&
    Number.isSafeInteger(o.validUntil)
  );
}

export function compareOffers(need: Need, offers: readonly Offer[], now: number): OfferComparison {
  const valid: Offer[] = [];
  const rejected: OfferComparison["rejected"] = [];

  // Un voto tiene que apuntar a una sola oferta: un id repetido descarta todas las que lo usan.
  const uses = new Map<string, number>();
  for (const { id } of offers) uses.set(id, (uses.get(id) ?? 0) + 1);

  for (const offer of offers) {
    if (!isWellFormed(offer)) rejected.push({ offerId: offer.id, reason: "INVALID" });
    else if ((uses.get(offer.id) ?? 0) > 1) rejected.push({ offerId: offer.id, reason: "DUPLICATE_ID" });
    else if (offer.validUntil <= now) rejected.push({ offerId: offer.id, reason: "EXPIRED" });
    else if (offer.unitPrice > need.maxUnitPrice) rejected.push({ offerId: offer.id, reason: "OVER_BUDGET" });
    else if (need.units < offer.minUnits || need.units > offer.maxUnits) {
      rejected.push({ offerId: offer.id, reason: "UNITS_NOT_COVERED" });
    } else valid.push(offer);
  }

  valid.sort(
    (a, b) =>
      (a.unitPrice < b.unitPrice ? -1 : a.unitPrice > b.unitPrice ? 1 : 0) ||
      b.validUntil - a.validUntil ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  return { ranking: valid, rejected };
}

export interface Ballot {
  member: string;
  offerId: string;
  /** Segundos Unix. */
  castAt: number;
}

export type VoteResult =
  | { status: "OPEN" }
  | { status: "WINNER"; offerId: string; counts: ReadonlyMap<string, number> }
  /**
   * Empate, sin votos o votos contradictorios: vuelve a la comunidad, el código no desempata.
   * `conflicted` son los miembros con dos opciones distintas en el mismo instante.
   */
  | { status: "NO_DECISION"; counts: ReadonlyMap<string, number>; conflicted: string[] };

/** Un voto por miembro habilitado: vale el primero. Fuera de plazo o de lista no cuenta. */
export function tallyVotes(
  eligible: ReadonlySet<string>,
  offerIds: ReadonlySet<string>,
  ballots: readonly Ballot[],
  closesAt: number,
  now: number,
): VoteResult {
  if (now < closesAt) return { status: "OPEN" };

  const byMember = new Map<string, Ballot[]>();
  for (const ballot of ballots) {
    if (ballot.castAt >= closesAt || !eligible.has(ballot.member) || !offerIds.has(ballot.offerId)) continue;
    byMember.set(ballot.member, [...(byMember.get(ballot.member) ?? []), ballot]);
  }

  const counts = new Map<string, number>();
  const conflicted: string[] = [];
  for (const [member, own] of byMember) {
    const first = Math.min(...own.map((b) => b.castAt));
    const options = new Set(own.filter((b) => b.castAt === first).map((b) => b.offerId));
    const [option] = options;
    if (options.size > 1 || option === undefined) conflicted.push(member);
    else counts.set(option, (counts.get(option) ?? 0) + 1);
  }
  conflicted.sort();

  const top = Math.max(0, ...counts.values());
  const leaders = [...counts].filter(([, n]) => n === top);
  const winner = leaders[0];
  if (conflicted.length > 0 || leaders.length !== 1 || !winner) return { status: "NO_DECISION", counts, conflicted };
  return { status: "WINNER", offerId: winner[0], counts };
}
