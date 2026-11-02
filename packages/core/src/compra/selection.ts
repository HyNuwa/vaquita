import { totalPerBuyer, type CampaignTerms } from "./terms.js";

/**
 * Selección determinística de compradores: reproduce lo que hará `ejecutar()` en el
 * contrato para mostrar "compromisos con fondos ahora" y decidir si conviene ejecutar.
 *
 * NO es una reserva: el mismo saldo puede respaldar otras campañas y cambiar antes de la
 * ejecución. Todas las lecturas tienen que venir del mismo bloque.
 */

/** Lectura de un comprador en un bloque. `null` = la lectura falló: no prueba nada. */
export interface BuyerFunds {
  balance: bigint | null;
  allowance: bigint | null;
}

export type ExclusionReason = "INSUFFICIENT_BALANCE" | "INSUFFICIENT_ALLOWANCE" | "OVER_QUOTA";

export interface Selection {
  selected: string[];
  excluded: { buyer: string; reason: ExclusionReason }[];
  /** Compradores cuya lectura falló. Si hay alguno, el resultado no sirve para ejecutar. */
  unknown: string[];
  /** Se llegó al mínimo, sin dudas de lectura. */
  meetsMinimum: boolean;
}

export function selectBuyers(
  terms: Pick<CampaignTerms, "buyers" | "unitPrice" | "fee" | "minUnits" | "maxUnits">,
  active: ReadonlySet<string>,
  funds: ReadonlyMap<string, BuyerFunds>,
): Selection {
  const total = totalPerBuyer(terms);
  const selected: string[] = [];
  const excluded: Selection["excluded"] = [];
  const unknown: string[] = [];

  for (const buyer of terms.buyers) {
    if (!active.has(buyer)) continue;

    // Con el cupo lleno el contrato deja de seleccionar: lo que pase con los siguientes,
    // incluida una lectura fallida, no cambia el resultado.
    if (selected.length >= terms.maxUnits) {
      excluded.push({ buyer, reason: "OVER_QUOTA" });
      continue;
    }

    const read = funds.get(buyer);
    if (!read || read.balance === null || read.allowance === null) {
      unknown.push(buyer);
      continue;
    }
    if (read.balance < total) {
      excluded.push({ buyer, reason: "INSUFFICIENT_BALANCE" });
    } else if (read.allowance < total) {
      excluded.push({ buyer, reason: "INSUFFICIENT_ALLOWANCE" });
    } else {
      selected.push(buyer);
    }
  }

  return { selected, excluded, unknown, meetsMinimum: unknown.length === 0 && selected.length >= terms.minUnits };
}
