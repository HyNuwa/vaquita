import {
  concat, encodeAbiParameters, encodeFunctionData, encodePacked, erc20Abi, getAddress,
  getCreate2Address, hashTypedData, isAddress, keccak256, pad, size, toHex,
  zeroAddress, type Address, type Hex,
} from "viem";
import { contratosFondo } from "../config/fondo-contratos.js";
import { WFIAT } from "../config/tokens.js";
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

/** Cuerpo sin `nonce`: quien arma la propuesta lo lee en cadena. */
export type CuerpoSafe = Omit<TxSafe, "nonce">;

const SENTINEL = "0x0000000000000000000000000000000000000001";
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const cuentaReal = (a: Address) => isAddress(a, { strict: false }) && !same(a, zeroAddress) && !same(a, SENTINEL);
const transferencia = (destino: Address, monto: bigint): Hex => {
  if (!cuentaReal(destino) || monto <= 0n) throw new Error("Revisá el destinatario y el monto.");
  return encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [destino, monto] });
};

/** Previo en una lista enlazada de Safe, en el orden leído de la cadena. */
export function anteriorEnLista(lista: readonly Address[], elemento: Address): Address {
  const index = lista.findIndex((a) => same(a, elemento));
  if (index < 0) throw new Error("No encontramos esa cuenta en el fondo.");
  return index === 0 ? SENTINEL : lista[index - 1]!;
}

export function txGasto(destino: Address, monto: bigint): CuerpoSafe {
  return { to: WFIAT.wARS.address, value: 0n, data: transferencia(destino, monto), operation: 0 };
}

/** Se propone con el mismo `nonce` de la propuesta que reemplaza. */
export function txCancelar(safe: Address): CuerpoSafe {
  if (!cuentaReal(safe)) throw new Error("Revisá la cuenta del fondo.");
  return { to: safe, value: 0n, data: "0x", operation: 0 };
}

/** `duenos` es la lista leída de `getOwners`, en su orden, para calcular el previo. */
export function txCambiarResponsable(safe: Address, duenos: readonly Address[], sale: Address, entra: Address): CuerpoSafe {
  if (!cuentaReal(entra) || same(entra, safe) || duenos.some((a) => same(a, entra))) throw new Error("Revisá la cuenta del nuevo responsable.");
  const prev = anteriorEnLista(duenos, sale);
  return { to: safe, value: 0n, operation: 0, data: encodeFunctionData({ abi: safeAbi, functionName: "swapOwner", args: [prev, sale, entra] }) };
}

export function txReparto(filas: readonly { destino: Address; monto: bigint }[]): CuerpoSafe {
  if (filas.length === 0) throw new Error("El reparto no tiene destinatarios.");
  const token = WFIAT.wARS.address;
  return { to: contratosFondo(42220).multiSendCallOnly.address, value: 0n, operation: 1,
    data: encodeMultiSend(filas.map((f) => ({ to: token, data: transferencia(f.destino, f.monto) }))) };
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
