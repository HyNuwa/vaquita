import { WFIAT, type WFiatSymbol } from "../config/tokens.js";
import { formatLocal } from "../money/amounts.js";

/**
 * Línea de costo de red para el usuario, en su moneda.
 * Si no hay cotización disponible no inventamos un número.
 */
export async function gasLine(
  maxGasCost18: bigint,
  token: WFiatSymbol,
  gasToLocal?: (usd18: bigint, token: WFiatSymbol) => Promise<bigint | null>,
): Promise<string> {
  const local = gasToLocal ? await gasToLocal(maxGasCost18, token).catch(() => null) : null;
  if (local !== null) {
    const shown = formatLocal(local, WFIAT[token]);
    return `Costo de red: hasta ${shown} (se cobra aparte, no del monto enviado).`;
  }
  return "Costo de red: unos centavos, se cobra aparte del monto enviado.";
}
