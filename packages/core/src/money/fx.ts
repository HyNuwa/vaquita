import { WFIAT, type WFiatSymbol } from "../config/tokens.js";

/**
 * Cotización SOLO para mostrar el costo de gas en moneda local.
 * Nunca se usa para decidir pagos ni límites (eso es 1 wARS = 1 peso, sin conversión).
 * Fuente: CoinGecko simple/price con los ids que publica la organización del hackathon.
 */
export function coingeckoGasToLocal(fetchImpl: typeof fetch = fetch) {
  const cache = new Map<WFiatSymbol, { usdPerLocal: number; at: number }>();
  return async (usd18: bigint, token: WFiatSymbol): Promise<bigint | null> => {
    const hit = cache.get(token);
    let usdPerLocal = hit && Date.now() - hit.at < 10 * 60_000 ? hit.usdPerLocal : undefined;
    if (usdPerLocal === undefined) {
      const id = WFIAT[token].coingeckoId;
      const res = await fetchImpl(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`, {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return null;
      const body = (await res.json()) as Record<string, { usd?: number }>;
      usdPerLocal = body[id]?.usd;
      if (!usdPerLocal || !(usdPerLocal > 0)) return null;
      cache.set(token, { usdPerLocal, at: Date.now() });
    }
    // local = usd / usdPerLocal, con el precio escalado a 1e12 para operar en bigint
    const p = BigInt(Math.round(usdPerLocal * 1e12));
    return (usd18 * 10n ** 12n) / p;
  };
}
