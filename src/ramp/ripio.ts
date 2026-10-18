import { getAddress, isAddress, type Address } from "viem";
import { CELO_MAINNET } from "../config/network.js";
import { WFIAT, type WFiatSymbol } from "../config/tokens.js";

/**
 * Links a ramp.ripio.com (sin credenciales): el usuario carga pesos con transferencia y
 * recibe wARS en la wallet indicada, o al revés. Si van country+chain+token+amount, el
 * usuario saltea el formulario. La disponibilidad de redes/tokens depende del país.
 */
export function buildRampUrl(x: {
  mode: "onramp" | "offramp";
  token: WFiatSymbol;
  amount: string;
  address: Address;
}): string {
  if (!isAddress(x.address)) throw new Error("Dirección inválida para el ramp.");
  if (!/^\d+(\.\d{1,2})?$/.test(x.amount)) throw new Error("Monto inválido para el ramp.");
  const t = WFIAT[x.token];
  const base = x.mode === "onramp" ? "https://ramp.ripio.com/" : "https://ramp.ripio.com/offramp";
  const qs = new URLSearchParams({
    country: t.country,
    chain: String(CELO_MAINNET.chainId),
    token: t.rampToken,
    amount: x.amount,
    address: getAddress(x.address),
  });
  return `${base}?${qs.toString()}`;
}
