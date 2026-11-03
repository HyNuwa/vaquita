import { encodeFunctionData, erc20Abi, parseAbi, type Address, type Hex } from "viem";
import { appendTag, assertTagged, assertValidCode } from "../attribution/tag.js";
import { WFIAT } from "../config/tokens.js";

/**
 * Transacciones que firma el comprador en SU billetera (D15.5).
 *
 * El core las arma con la etiqueta y la web solo las pasa a la billetera. Este módulo
 * llega al navegador: no puede importar `.env`, claves ni clientes de wallet.
 */
export interface TxComprador {
  to: Address;
  data: Hex;
}

const CAMPANA_ABI = parseAbi(["function comprometer()", "function cancelarCompromiso()"]);

function etiquetar(to: Address, data: Hex, code: string): TxComprador {
  assertValidCode(code, { live: true });
  const tagged = appendTag(data, code);
  assertTagged(tagged, code);
  return { to, data: tagged };
}

/** Autoriza a la campaña a cobrar exactamente `importe` en wARS. Cero revoca. */
export function autorizarCampana(campana: Address, importe: bigint, code: string): TxComprador {
  if (importe < 0n) throw new Error("El importe no puede ser negativo.");
  const data = encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [campana, importe] });
  return etiquetar(WFIAT.wARS.address, data, code);
}

export function comprometerse(campana: Address, code: string): TxComprador {
  return etiquetar(campana, encodeFunctionData({ abi: CAMPANA_ABI, functionName: "comprometer" }), code);
}

export function cancelarCompromiso(campana: Address, code: string): TxComprador {
  return etiquetar(campana, encodeFunctionData({ abi: CAMPANA_ABI, functionName: "cancelarCompromiso" }), code);
}
