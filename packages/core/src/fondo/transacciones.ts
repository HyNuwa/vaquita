import { encodeFunctionData, erc20Abi, type Address, type Hex } from "viem";
import { appendTag, assertTagged, assertValidCode } from "../attribution/tag.js";
import { WFIAT } from "../config/tokens.js";
import { safeAbi } from "./abis.js";
import { SAFE_GAS_FIELDS, type TxSafe } from "./safe.js";

/** Transacción etiquetada que firma una persona desde su propia billetera. */
export interface TxPersona {
  to: Address;
  data: Hex;
}

function etiquetar(to: Address, data: Hex, code: string): TxPersona {
  assertValidCode(code, { live: true });
  const tagged = appendTag(data, code);
  assertTagged(tagged, code);
  return { to, data: tagged };
}

/** Transfiere wARS al fondo; no autoriza cobros ni aplica límites del agente. */
export function aportar(safe: Address, monto: bigint, code: string): TxPersona {
  return etiquetar(WFIAT.wARS.address, encodeFunctionData({
    abi: erc20Abi, functionName: "transfer", args: [safe, monto],
  }), code);
}

/** Construye la aprobación; no comprueba responsables ni aprobaciones en cadena. */
export function aprobarHash(safe: Address, hash: Hex, code: string): TxPersona {
  return etiquetar(safe, encodeFunctionData({
    abi: safeAbi, functionName: "approveHash", args: [hash],
  }), code);
}

/**
 * Conserva el cuerpo y las firmas sin etiquetar los bytes internos.
 * Comparte los ceros del hash: el nonce se lee en cadena, no es argumento ABI.
 * La orquestación debe comparar el hash actual y simular antes de pedir la firma.
 */
export function ejecutarPropuesta(safe: Address, txSafe: TxSafe, firmas: Hex, code: string): TxPersona {
  const { safeTxGas, baseGas, gasPrice, gasToken, refundReceiver } = SAFE_GAS_FIELDS;
  return etiquetar(safe, encodeFunctionData({
    abi: safeAbi,
    functionName: "execTransaction",
    args: [txSafe.to, txSafe.value, txSafe.data, txSafe.operation,
      safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, firmas],
  }), code);
}
