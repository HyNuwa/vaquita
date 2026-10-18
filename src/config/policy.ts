import type { WFiatSymbol } from "./tokens.js";

/**
 * LÍMITES DEL AGENTE — código determinístico.
 *
 * El LLM nunca ve ni recibe este objeto: solo puede PROPONER pagos a través de las
 * herramientas de src/agent/tools.ts, y cada propuesta pasa por src/policy/engine.ts.
 * Cambiar un límite = cambiar este archivo + commit + reiniciar el proceso.
 *
 * Montos en unidades de moneda local, como string decimal (ej: "5000" = $5.000 ARS).
 */
export interface TokenLimits {
  maxPerPayment: string;
  dailyBudget: string;
  maxPaymentsPerDay: number;
}

export interface Policy {
  /** Zona horaria que define "el día" del presupuesto diario */
  timeZone: string;
  limits: Partial<Record<WFiatSymbol, TokenLimits>>;
  /**
   * Tope de gas por transacción, en unidades de 18 decimales de la fee currency
   * (para USDC/USDT/USDm ≈ dólares). 0.05 = cinco centavos de dólar.
   */
  maxGasPerTx18: bigint;
}

const deepFreeze = <T>(o: T): T => {
  for (const v of Object.values(o as object)) if (v && typeof v === "object") deepFreeze(v);
  return Object.freeze(o);
};

export const POLICY: Readonly<Policy> = deepFreeze({
  timeZone: "America/Argentina/Buenos_Aires",
  limits: {
    wARS: { maxPerPayment: "5000", dailyBudget: "20000", maxPaymentsPerDay: 20 },
  },
  maxGasPerTx18: 50_000_000_000_000_000n, // 0.05
});
