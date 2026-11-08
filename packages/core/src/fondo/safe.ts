import {
  concat, encodeAbiParameters, encodeFunctionData, encodePacked, getAddress,
  getCreate2Address, hashTypedData, isAddress, keccak256, pad, size, toHex,
  zeroAddress, type Address, type Hex,
} from "viem";
import { contratosFondo } from "../config/fondo-contratos.js";
import { multiSendCallOnlyAbi, rolesAbi, safeAbi } from "./abis.js";

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

/** Entradas explícitas: sin claves, entorno ni resolución de identidad por RPC. */
export interface CreationConfig {
  readonly groupId: string;
  readonly owners: readonly Address[];
  readonly operatingWallet: Address;
  readonly identityWallet: Address;
}

/** El identificador se usa literalmente; no normaliza espacios ni mayúsculas. */
export function creationSalt(groupId: string): bigint {
  return BigInt(keccak256(toHex(groupId)));
}

/** Safe nuevo: tres responsables ajenos a Vaqui, dos firmas y sin reembolso. */
export function encodeSafeSetup(config: CreationConfig): Hex {
  const { owners, operatingWallet, identityWallet } = config;
  if (owners.length !== 3
    || ![...owners, operatingWallet, identityWallet].every((a) => isAddress(a, { strict: false }))
    || new Set(owners.map((a) => a.toLowerCase())).size !== 3
    || owners.some((a) => [zeroAddress, operatingWallet, identityWallet]
      .some((excluded) => a.toLowerCase() === excluded.toLowerCase()))) {
    throw new Error("Necesitás tres responsables distintos, válidos y ajenos a las cuentas de Vaqui.");
  }
  return encodeFunctionData({
    abi: safeAbi, functionName: "setup",
    args: [owners.map((a) => getAddress(a)), 2n, zeroAddress, "0x",
      contratosFondo(42220).fallbackHandler.address, zeroAddress, 0n, zeroAddress],
  });
}

/** Roles 2.1.1: el Safe es dueño, avatar y target; no habilita permisos todavía. */
export function encodeRolesSetup(safe: Address): Hex {
  return encodeFunctionData({
    abi: rolesAbi, functionName: "setUp",
    args: [encodeAbiParameters([{ type: "address" }, { type: "address" }, { type: "address" }], [safe, safe, safe])],
  });
}

function deploymentSalt(initializer: Hex, groupId: string): Hex {
  return keccak256(concat([keccak256(initializer), toHex(creationSalt(groupId), { size: 32 })]));
}

/** La orquestación obtiene proxyCreationCode de la fábrica verificada, no de memoria. */
export function predictSafeAddress(config: CreationConfig, proxyCreationCode: Hex): Address {
  const contracts = contratosFondo(42220);
  const initializer = encodeSafeSetup(config);
  return getCreate2Address({
    from: contracts.proxyFactory.address,
    salt: deploymentSalt(initializer, config.groupId),
    bytecode: concat([proxyCreationCode, pad(contracts.safeL2.address, { size: 32 })]),
  });
}

/** Proxy EIP-1167 de la ModuleProxyFactory de Zodiac; no es el proxy de Safe. */
export function predictRolesAddress(groupId: string, safe: Address): Address {
  const contracts = contratosFondo(42220);
  return getCreate2Address({
    from: contracts.moduleFactory.address,
    salt: deploymentSalt(encodeRolesSetup(safe), groupId),
    bytecode: concat(["0x602d8060093d393df3363d3d373d3d3d363d73",
      contracts.rolesMastercopy.address, "0x5af43d82803e903d91602b57fd5bf3"]),
  });
}
