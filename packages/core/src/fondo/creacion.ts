import {
  concat, decodeFunctionResult, encodeFunctionData, isHex, keccak256, pad, toHex,
  type Abi, type Address, type Hex,
} from "viem";
import { assertValidCode } from "../attribution/tag.js";
import { contratosFondo } from "../config/fondo-contratos.js";
import { proxyFactoryAbi, rolesAbi, safeAbi } from "./abis.js";
import { encodeSafeSetup, predictRolesAddress, predictSafeAddress, type CreationConfig } from "./safe.js";
import { crearSafe, desplegarRoles, type TxPersona } from "./transacciones.js";

/** Lecturas inyectadas; el adaptador debe respetar el bloque de cada solicitud. */
export interface CreationReader {
  getChainId(): Promise<number>;
  getBlockNumber(): Promise<bigint>;
  getCode(request: { address: Address; blockNumber: bigint }): Promise<Hex | undefined>;
  getStorageAt(request: { address: Address; slot: Hex; blockNumber: bigint }): Promise<Hex | undefined>;
  call(request: { to: Address; data: Hex; blockNumber: bigint }): Promise<{ data?: Hex }>;
}
export interface CreationPlan {
  readonly safe: Address;
  readonly roles: Address;
  readonly blockNumber: bigint;
  readonly steps: readonly { step: "safe" | "roles"; tx: TxPersona }[];
}
const ZERO_WORD = toHex(0n, { size: 32 });
const SENTINEL = toHex(1n, { size: 20 });
const ERROR = "No pudimos verificar la creación del fondo.";

function occupied(code: Hex | undefined): code is Hex {
  if (code === undefined || code === "0x") return false;
  if (!isHex(code, { strict: true }) || code.length % 2 !== 0) throw new Error(ERROR);
  return true;
}

/**
 * Retoma SOLO los despliegues faltantes; no firma, envía ni configura permisos.
 * Una lista vacía no acredita un fondo activo. El bloque no garantiza finalidad.
 */
export async function planCreation(config: CreationConfig, code: string, reader: CreationReader): Promise<CreationPlan> {
  encodeSafeSetup(config);
  assertValidCode(code, { live: true });
  try {
    if (await reader.getChainId() !== 42220) throw new Error(ERROR);
    const blockNumber = await reader.getBlockNumber();
    const contracts = contratosFondo(42220);
    for (const reference of [contracts.proxyFactory, contracts.safeL2, contracts.fallbackHandler,
      contracts.moduleFactory, contracts.rolesMastercopy]) {
      const deployed = await reader.getCode({ address: reference.address, blockNumber });
      if (!occupied(deployed) || keccak256(deployed) !== reference.codeHash) throw new Error(ERROR);
    }
    const read = async (to: Address, abi: Abi, functionName: string, args: readonly unknown[] = []) => {
      const result = await reader.call({ to, data: encodeFunctionData({ abi, functionName, args }), blockNumber });
      if (!result.data) throw new Error(ERROR);
      return decodeFunctionResult({ abi, functionName, data: result.data });
    };
    const creationCode = await read(contracts.proxyFactory.address, proxyFactoryAbi, "proxyCreationCode") as Hex;
    if (!occupied(creationCode)) throw new Error(ERROR);
    const safe = predictSafeAddress(config, creationCode), roles = predictRolesAddress(config.groupId, safe);
    const safeCode = await reader.getCode({ address: safe, blockNumber });
    const rolesCode = await reader.getCode({ address: roles, blockNumber });
    const safePresent = occupied(safeCode), rolesPresent = occupied(rolesCode);
    if (safePresent) {
      const word = async (slot: Hex) => {
        const value = await reader.getStorageAt({ address: safe, slot, blockNumber });
        if (!value || !isHex(value, { strict: true }) || value.length !== 66) throw new Error(ERROR);
        return value.toLowerCase();
      };
      // El CREATE2 de la fábrica autenticada vincula este proxy; slot 0 fija su implementación actual.
      if (await word(ZERO_WORD) !== pad(contracts.safeL2.address, { size: 32 }).toLowerCase()) throw new Error(ERROR);
      const owners = await read(safe, safeAbi, "getOwners") as readonly Address[];
      const expected = config.owners.map((a) => a.toLowerCase()).sort().join();
      if (owners.length !== 3 || owners.map((a) => a.toLowerCase()).sort().join() !== expected
        || await read(safe, safeAbi, "getThreshold") !== 2n) throw new Error(ERROR);
      if (await word(keccak256(toHex("fallback_manager.handler.address"))) !== pad(contracts.fallbackHandler.address, { size: 32 }).toLowerCase()
        || await word(keccak256(toHex("guard_manager.guard.address"))) !== ZERO_WORD) throw new Error(ERROR);
      const [modules, next] = await read(safe, safeAbi, "getModulesPaginated", [SENTINEL, 2n]) as readonly [readonly Address[], Address];
      if (next.toLowerCase() !== SENTINEL || modules.length > 1
        || modules.some((a) => a.toLowerCase() !== roles.toLowerCase())) throw new Error(ERROR);
    }
    if (rolesPresent) {
      const runtime = concat(["0x363d3d373d3d3d363d73", contracts.rolesMastercopy.address, "0x5af43d82803e903d91602b57fd5bf3"]);
      if (rolesCode.toLowerCase() !== runtime.toLowerCase()) throw new Error(ERROR);
      for (const field of ["owner", "avatar", "target"]) {
        const value = await read(roles, rolesAbi, field) as Address;
        if (value.toLowerCase() !== safe.toLowerCase()) throw new Error(ERROR);
      }
    }
    // Ningún paso se devuelve hasta terminar TODAS las comprobaciones anteriores.
    const steps: { step: "safe" | "roles"; tx: TxPersona }[] = [];
    if (!safePresent) steps.push({ step: "safe", tx: crearSafe(config, code) });
    if (!rolesPresent) steps.push({ step: "roles", tx: desplegarRoles(safe, config.groupId, code) });
    return { safe, roles, blockNumber, steps };
  } catch {
    // No exponer excepciones del transporte, URLs ni detalles externos.
    throw new Error(ERROR);
  }
}
