import type { WFiatToken } from "../config/tokens.js";

/**
 * Montos de cara al usuario y al LLM: SIEMPRE en moneda local (1 wARS = 1 peso).
 *
 * Formato de entrada canónico, sin ambigüedad: dígitos, opcionalmente "." y hasta 2
 * decimales. "1.500" o "1,5" se rechazan a propósito: en LatAm el punto y la coma
 * cambian de significado según el país, y un error acá es un pago 1000 veces mayor.
 */
const CANONICAL = /^(0|[1-9]\d{0,14})(\.\d{1,2})?$/;

export class AmountError extends Error {
  override name = "AmountError";
}

export function parseLocalAmount(input: string, decimals = 18): bigint {
  if (typeof input !== "string" || !CANONICAL.test(input)) {
    throw new AmountError(
      `Monto inválido: ${JSON.stringify(input)}. Usá solo números y punto decimal, por ejemplo "1500.50".`,
    );
  }
  const [whole, frac = ""] = input.split(".") as [string, string?];
  const units = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(frac.padEnd(decimals, "0") || "0");
  if (units <= 0n) throw new AmountError("El monto tiene que ser mayor a cero.");
  return units;
}

/** 1234.5 pesos → "$ 1.234,50" (es-AR). Redondea a 2 decimales hacia abajo. */
export function formatLocal(units: bigint, token: Pick<WFiatToken, "locale" | "fiat" | "decimals">): string {
  const cents = units / 10n ** BigInt(token.decimals - 2);
  const value = Number(cents) / 100;
  return new Intl.NumberFormat(token.locale, {
    style: "currency",
    currency: token.fiat,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Convierte un string de límite ("5000") a unidades de 18 decimales. */
export const limitToUnits = (s: string, decimals = 18) => parseLocalAmount(s, decimals);
