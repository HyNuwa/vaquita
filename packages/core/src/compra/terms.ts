import { POLICY } from "../config/policy.js";
import { limitToUnits } from "../money/amounts.js";

/**
 * Condiciones de una campaña de compra colectiva (D11). Son las mismas que guarda el
 * contrato `CompraColectiva`: el core no decide nada que el contrato no sepa.
 *
 * Compradores y proveedor se identifican por alias, nunca por dirección: el LLM solo ve
 * alias y la traducción a direcciones vive en otra capa. Montos en unidades de 18 decimales.
 */
export interface CampaignTerms {
  id: string;
  supplier: string;
  unitPrice: bigint;
  /** Cargo fijo por unidad; puede ser cero. */
  fee: bigint;
  feeRecipient?: string;
  minUnits: number;
  maxUnits: number;
  /** Fecha límite en segundos Unix: comprometer y ejecutar solo antes de este instante. */
  deadline: number;
  /** Orden fijo de la lista: define la selección si sobran compradores. */
  buyers: readonly string[];
}

export class CampaignTermsError extends Error {
  override name = "CampaignTermsError";
}

/** Tope por compromiso, incluido el cargo (D11.5): igual al tope por pago de la política. */
export function commitmentCap(): bigint {
  const limits = POLICY.limits.wARS;
  if (!limits) throw new CampaignTermsError("La política no define límites para wARS.");
  return limitToUnits(limits.maxPerPayment);
}

/** Lo que autoriza cada comprador: una unidad más el cargo. */
export const totalPerBuyer = (terms: Pick<CampaignTerms, "unitPrice" | "fee">) => terms.unitPrice + terms.fee;

export function validateTerms(terms: CampaignTerms): void {
  const { id, supplier, unitPrice, fee, feeRecipient, minUnits, maxUnits, deadline, buyers } = terms;
  if (!id) throw new CampaignTermsError("La campaña necesita un id.");
  if (!supplier) throw new CampaignTermsError("La campaña necesita un proveedor.");
  if (unitPrice <= 0n) throw new CampaignTermsError("El precio tiene que ser mayor a cero.");
  if (fee < 0n) throw new CampaignTermsError("El cargo no puede ser negativo.");
  if (fee > 0n && !feeRecipient) throw new CampaignTermsError("Un cargo necesita destinatario.");
  if (fee === 0n && feeRecipient) throw new CampaignTermsError("Hay destinatario de cargo, pero no hay cargo.");
  if (feeRecipient && feeRecipient === supplier) {
    throw new CampaignTermsError("El cargo no puede ir al mismo destino que el pago.");
  }
  if (!Number.isSafeInteger(minUnits) || minUnits < 1) throw new CampaignTermsError("El mínimo tiene que ser 1 o más.");
  if (!Number.isSafeInteger(maxUnits) || maxUnits < minUnits) {
    throw new CampaignTermsError("El máximo no puede ser menor que el mínimo.");
  }
  if (!Number.isSafeInteger(deadline) || deadline <= 0) throw new CampaignTermsError("Fecha límite inválida.");
  if (totalPerBuyer(terms) > commitmentCap()) {
    throw new CampaignTermsError("El compromiso supera el tope por comprador, incluido el cargo.");
  }
  if (buyers.some((b) => !b)) throw new CampaignTermsError("Hay un comprador sin alias.");
  if (new Set(buyers).size !== buyers.length) throw new CampaignTermsError("Hay compradores repetidos.");
  if (buyers.includes(supplier) || (feeRecipient && buyers.includes(feeRecipient))) {
    throw new CampaignTermsError("Un destinatario no puede estar en la lista de compradores.");
  }
  if (buyers.length < minUnits) throw new CampaignTermsError("La lista de compradores no alcanza para el mínimo.");
}
