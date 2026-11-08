import {
  concat, encodeFunctionData, encodePacked, hashTypedData, pad, size, toHex,
  zeroAddress, type Address, type Hex,
} from "viem";
import { multiSendCallOnlyAbi } from "./abis.js";

/** Cuerpo portable; sin campos de reembolso configurables. */
export interface TxSafe {
  to: Address;
  value: bigint;
  data: Hex;
  operation: 0 | 1;
  nonce: bigint;
}

// Compartidos por el hash y el futuro constructor de execTransaction.
export const SAFE_GAS_FIELDS = Object.freeze({
  safeTxGas: 0n,
  baseGas: 0n,
  gasPrice: 0n,
  gasToken: zeroAddress,
  refundReceiver: zeroAddress,
});

/** Hash EIP-712 de Safe 1.4.1, siempre para Celo mainnet. Sin lecturas RPC. */
export function hashTransaccionSafe(safe: Address, tx: TxSafe): Hex {
  return hashTypedData({
    domain: { chainId: 42220, verifyingContract: safe },
    types: {
      SafeTx: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "operation", type: "uint8" },
        { name: "safeTxGas", type: "uint256" },
        { name: "baseGas", type: "uint256" },
        { name: "gasPrice", type: "uint256" },
        { name: "gasToken", type: "address" },
        { name: "refundReceiver", type: "address" },
        { name: "nonce", type: "uint256" },
      ],
    },
    primaryType: "SafeTx",
    message: { ...tx, ...SAFE_GAS_FIELDS },
  });
}

/** Dos firmas v=1; no verifica responsables actuales ni approvedHashes en cadena. */
export function firmasPreaprobadas(duenos: readonly [Address, Address]): Hex {
  if (duenos.length !== 2) throw new Error("Necesitás exactamente dos responsables.");
  const [first, second] = duenos;
  if (BigInt(first) === BigInt(second)) throw new Error("Necesitás dos responsables distintos.");
  const sorted = BigInt(first) < BigInt(second) ? [first, second] : [second, first];
  return concat(sorted.map((owner) => concat([
    pad(owner.toLowerCase() as Address, { size: 32 }),
    toHex(0n, { size: 32 }),
    "0x01",
  ])));
}

/**
 * Devuelve calldata ABI completa de multiSend(bytes), NO solo las llamadas packed.
 * Cada llamada interna usa operation=0 y value=0; el delegatecall externo al
 * contrato MultiSendCallOnly pertenece al cuerpo TxSafe, no a estas entradas.
 */
export function encodeMultiSend(calls: readonly { to: Address; data: Hex }[]): Hex {
  const packed = calls.length === 0 ? "0x" : concat(calls.map(({ to, data }) => encodePacked(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [0, to, 0n, BigInt(size(data)), data],
  )));
  return encodeFunctionData({
    abi: multiSendCallOnlyAbi,
    functionName: "multiSend",
    args: [packed],
  });
}
