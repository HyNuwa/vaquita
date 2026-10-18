import { getAddress, type Address } from "viem";

/**
 * Tokens wFIAT de Ripio en Celo mainnet. 18 decimales, respaldo 1:1 en moneda local.
 *
 * Fuentes cruzadas (2026-10-17), las tres coinciden:
 *  - Página oficial del hackathon (loops.house/agents-on-open-rails, sección Ripio)
 *  - Celopedia skill (celo-org/celopedia-skills → references/contracts.md),
 *    que las marca como "confirmadas on-chain"
 *  - Brief del track entregado por la organización
 * Nota: docs.ripio.com/llms.txt NO publica direcciones de tokens (solo la API B2B).
 *
 * No editar a mano sin volver a verificar. `npm run preflight` lee decimals() y symbol()
 * on-chain y aborta si no coinciden con esta tabla.
 */
export type WFiatSymbol = "wARS" | "wBRL" | "wMXN" | "wCOP" | "wPEN" | "wCLP";

export interface WFiatToken {
  symbol: WFiatSymbol;
  address: Address;
  decimals: 18;
  /** Moneda local ISO 4217 que representa 1:1 */
  fiat: "ARS" | "BRL" | "MXN" | "COP" | "PEN" | "CLP";
  /** Locale para mostrar montos al usuario */
  locale: string;
  /** País para ramp.ripio.com (ISO 3166-1 alfa-2) */
  country: "AR" | "BR" | "MX" | "CO" | "PE" | "CL";
  /**
   * Valor del parámetro `token` en ramp.ripio.com. Solo WARS está confirmado por el
   * ejemplo oficial; el resto sigue el mismo patrón y hay que probarlo antes de usarlo.
   */
  rampToken: string;
  /** id de CoinGecko, solo para mostrar el costo del gas en moneda local */
  coingeckoId: string;
}

const t = (x: Omit<WFiatToken, "decimals" | "address"> & { address: string }): WFiatToken =>
  Object.freeze({ ...x, address: getAddress(x.address), decimals: 18 as const });

export const WFIAT: Readonly<Record<WFiatSymbol, WFiatToken>> = Object.freeze({
  wARS: t({ symbol: "wARS", address: "0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d", fiat: "ARS", locale: "es-AR", country: "AR", rampToken: "WARS", coingeckoId: "argentine-peso" }),
  wBRL: t({ symbol: "wBRL", address: "0xd76f5faf6888e24d9f04bf92a0c8b921fe4390e0", fiat: "BRL", locale: "pt-BR", country: "BR", rampToken: "WBRL", coingeckoId: "brazilian-real" }),
  wMXN: t({ symbol: "wMXN", address: "0x337e7456b420bd3481e7fa61fa9850343d610d34", fiat: "MXN", locale: "es-MX", country: "MX", rampToken: "WMXN", coingeckoId: "mexican-peso" }),
  wCOP: t({ symbol: "wCOP", address: "0x8a1d45e102e886510e891d2ec656a708991e2d76", fiat: "COP", locale: "es-CO", country: "CO", rampToken: "WCOP", coingeckoId: "colombian-peso" }),
  wPEN: t({ symbol: "wPEN", address: "0x4F34c8b3b5FB6D98Da888F0feA543d4d9C9F2eBE", fiat: "PEN", locale: "es-PE", country: "PE", rampToken: "WPEN", coingeckoId: "peruvian-sol" }),
  wCLP: t({ symbol: "wCLP", address: "0x61D450a098b6a7f69fC4b98CE68198fe59768651", fiat: "CLP", locale: "es-CL", country: "CL", rampToken: "WCLP", coingeckoId: "chilean-peso" }),
});

/**
 * Fee currencies (fee abstraction, CIP-64) en Celo mainnet.
 * Fuente: docs.celo.org/build/tools/contracts/fee-currencies (2026-10-17).
 *
 * IMPORTANTE: los wFIAT NO están en la allowlist de fee currencies.
 * Para tokens de 6 decimales (USDC, USDT, USA₮) el campo `feeCurrency` lleva la
 * dirección del ADAPTER, no la del token. balanceOf() en el adapter devuelve 18 decimales.
 */
export type FeeCurrencySymbol = "USDC" | "USDT" | "USAT" | "USDm";

export interface FeeCurrency {
  symbol: FeeCurrencySymbol;
  token: Address;
  /** Valor para el campo `feeCurrency` de la transacción */
  feeCurrency: Address;
  tokenDecimals: 6 | 18;
}

const f = (x: { symbol: FeeCurrencySymbol; token: string; feeCurrency: string; tokenDecimals: 6 | 18 }): FeeCurrency =>
  Object.freeze({ ...x, token: getAddress(x.token), feeCurrency: getAddress(x.feeCurrency) });

export const FEE_CURRENCIES: Readonly<Record<FeeCurrencySymbol, FeeCurrency>> = Object.freeze({
  USDC: f({ symbol: "USDC", token: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", feeCurrency: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B", tokenDecimals: 6 }),
  USDT: f({ symbol: "USDT", token: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e", feeCurrency: "0x0E2A3e05bc9A16F5292A6170456A710cb89C6f72", tokenDecimals: 6 }),
  USAT: f({ symbol: "USAT", token: "0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771", feeCurrency: "0x0357EE22278c922e1D36cFe6b899269b161880C4", tokenDecimals: 6 }),
  USDm: f({ symbol: "USDm", token: "0x765DE816845861e75A25fCA122bb6898B8B1282a", feeCurrency: "0x765DE816845861e75A25fCA122bb6898B8B1282a", tokenDecimals: 18 }),
});
