import { concat, decodeFunctionResult, encodeFunctionData, isAddress, keccak256, pad, toHex, type Abi, type Address, type Hex } from "viem";
import { contratosFondo } from "../config/fondo-contratos.js";
import { rolesAbi, safeAbi } from "./abis.js";
import { CLAVE_PRESUPUESTO, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO } from "./constantes.js";
import type { FondoReader } from "./lectura.js";
import { reconstruirPermisos } from "./verificacion-eventos.js";
import { compararPermisos } from "./verificacion-politica.js";
import { comprobarNegativas } from "./verificacion-simulacion.js";

// Runtime oficial de SafeProxy 1.4.1 (171 bytes); rechaza impostores con getters falsos.
const SAFE_PROXY_CODE_HASH = "0xd7d408ebcd99b2b70be43e20253d6d92a8ea8fab29bd3be7f55b10032331fb4c"; // Hash público de bytecode; secret-scan: allow
const SENTINEL = "0x0000000000000000000000000000000000000001";
const ZERO_WORD = pad("0x", { size: 32 });
const SLOT_HANDLER = keccak256(toHex("fallback_manager.handler.address"));
const SLOT_GUARD = keccak256(toHex("guard_manager.guard.address"));

const CONTROLES = ["contratos", "safe-proxy", "safe-config", "safe-handler", "safe-modulos", "roles-mastercopy",
  "roles-config", "presupuesto", "eventos", "simulacion"] as const;
type ControlId = (typeof CONTROLES)[number];

export interface Control { id: ControlId; ok: boolean; detalle: string }
export interface ResultadoVerificacion { ok: boolean; controles: Control[] }
/** Política pública esperada, explícita y separada de SQL y de los dueños iniciales. */
export interface PoliticaEsperada { duenos: readonly Address[]; walletOperativa?: Address; destinatarios?: readonly Address[] }
export interface GrupoVerificable {
  chainId: number; safe: Address; roles: Address; bloqueInicio?: bigint;
  esperado?: PoliticaEsperada;
}

const LECTURA = "No pudimos leer este dato de la red.";
const DEPENDENCIA = "No se comprobó porque falló un control previo.";
const ENTRADA = "Los datos del grupo no son válidos.";

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const address = (value: unknown): value is Address => typeof value === "string" && isAddress(value, { strict: false });
const occupied = (code: Hex | undefined): code is Hex => code !== undefined && code !== "0x";

function duenosEsperados(esperado: PoliticaEsperada | undefined): string[] | undefined {
  const list = esperado && Object.hasOwn(esperado, "duenos") ? esperado.duenos : undefined;
  if (!Array.isArray(list) || list.length !== 3 || !list.every(address)) return undefined;
  const normalized = list.map((a: Address) => a.toLowerCase()).sort();
  return new Set(normalized).size === 3 ? normalized : undefined;
}

function permisosEsperados(esperado: PoliticaEsperada | undefined) {
  if (!esperado || !Object.hasOwn(esperado, "walletOperativa") || !Object.hasOwn(esperado, "destinatarios")) return undefined;
  const { walletOperativa, destinatarios } = esperado;
  return address(walletOperativa) && Array.isArray(destinatarios) ? { walletOperativa, destinatarios } : undefined;
}

function todosFallan(detalle: string): ResultadoVerificacion {
  return { ok: false, controles: CONTROLES.map((id) => ({ id, ok: false, detalle })) };
}

/**
 * Verificación por lecturas inyectadas, en un solo bloque. Un dato ausente nunca aprueba.
 * El resultado global sólo es `ok` si pasan los diez controles, con eventos y negativas incluidos.
 */
export async function verificarGrupo(reader: FondoReader, grupo: GrupoVerificable): Promise<ResultadoVerificacion> {
  if (!grupo || grupo.chainId !== 42220 || !address(grupo.safe) || !address(grupo.roles) || same(grupo.safe, grupo.roles)) {
    return todosFallan(ENTRADA);
  }
  let blockNumber: bigint;
  try {
    if (await reader.getChainId() !== 42220) return todosFallan(ENTRADA);
    blockNumber = await reader.getBlockNumber();
    if (typeof blockNumber !== "bigint" || blockNumber < 0n) return todosFallan(LECTURA);
  } catch { return todosFallan(LECTURA); }

  const { safe, roles } = grupo;
  const contracts = contratosFondo(42220);
  const code = (target: Address) => reader.getCode({ address: target, blockNumber });
  const word = async (slot: Hex) => {
    const value = await reader.getStorageAt({ address: safe, slot, blockNumber });
    if (value === undefined) throw new Error(LECTURA);
    return value;
  };
  const read = async (to: Address, abi: Abi, functionName: string, args: readonly unknown[] = []) => {
    const result = await reader.call({ to, data: encodeFunctionData({ abi, functionName, args }), blockNumber });
    if (!result.data) throw new Error(LECTURA);
    return decodeFunctionResult({ abi, functionName, data: result.data });
  };
  const wordOf = (target: Address) => pad(target, { size: 32 }).toLowerCase();

  const results = new Map<ControlId, Control>();
  const passed = (id: ControlId) => results.get(id)?.ok === true;
  // Cada prueba devuelve null si pasa, o el motivo; una lectura fallida nunca aprueba.
  const control = async (id: ControlId, depends: readonly ControlId[], test: () => Promise<string | null>) => {
    if (!depends.every(passed)) { results.set(id, { id, ok: false, detalle: DEPENDENCIA }); return; }
    try {
      const failure = await test();
      results.set(id, failure === null ? { id, ok: true, detalle: "Comprobado." } : { id, ok: false, detalle: failure });
    } catch { results.set(id, { id, ok: false, detalle: LECTURA }); }
  };

  await control("contratos", [], async () => {
    for (const reference of Object.values(contracts)) {
      const deployed = await code(reference.address);
      if (!occupied(deployed) || keccak256(deployed) !== reference.codeHash) return "Un contrato de referencia no coincide.";
    }
    return null;
  });
  await control("safe-proxy", ["contratos"], async () => {
    const deployed = await code(safe);
    if (!occupied(deployed) || keccak256(deployed) !== SAFE_PROXY_CODE_HASH) return "El fondo no tiene el código esperado.";
    return (await word(ZERO_WORD)).toLowerCase() === wordOf(contracts.safeL2.address) ? null : "El fondo usa otra implementación.";
  });
  await control("safe-config", ["safe-proxy"], async () => {
    const expected = duenosEsperados(grupo.esperado);
    if (!expected) return "Faltan los responsables esperados.";
    const owners = await read(safe, safeAbi, "getOwners") as readonly Address[];
    if (owners.map((a) => a.toLowerCase()).sort().join() !== expected.join()) return "Los responsables no coinciden.";
    if (await read(safe, safeAbi, "getThreshold") !== 2n) return "La cantidad de firmas no es la esperada.";
    return (await word(SLOT_GUARD)).toLowerCase() === ZERO_WORD ? null : "El fondo tiene un control adicional no esperado.";
  });
  await control("safe-handler", ["safe-proxy"], async () =>
    (await word(SLOT_HANDLER)).toLowerCase() === wordOf(contracts.fallbackHandler.address) ? null : "El fondo tiene otro manejador.");
  await control("safe-modulos", ["safe-proxy"], async () => {
    const [modules, next] = await read(safe, safeAbi, "getModulesPaginated", [SENTINEL, 2n]) as readonly [readonly Address[], Address];
    return same(next, SENTINEL) && modules.length === 1 && same(modules[0]!, roles) ? null : "Los permisos del fondo no son exactamente los esperados.";
  });
  await control("roles-mastercopy", ["contratos"], async () => {
    const runtime = concat(["0x363d3d373d3d3d363d73", contracts.rolesMastercopy.address, "0x5af43d82803e903d91602b57fd5bf3"]);
    const deployed = await code(roles);
    return occupied(deployed) && same(deployed, runtime) ? null : "El módulo de permisos no es la versión permitida.";
  });
  await control("roles-config", ["roles-mastercopy"], async () => {
    for (const field of ["owner", "avatar", "target"]) {
      if (!same(await read(roles, rolesAbi, field) as Address, safe)) return "El módulo de permisos no pertenece a este fondo.";
    }
    return null;
  });
  await control("presupuesto", ["roles-mastercopy"], async () => {
    const [refill, maxRefill, period, balance] = await read(roles, rolesAbi, "allowances", [CLAVE_PRESUPUESTO]) as
      readonly [bigint, bigint, bigint, bigint, bigint];
    return refill === PRESUPUESTO_PERIODO && maxRefill === PRESUPUESTO_PERIODO && period === PERIODO_SEGUNDOS
      && balance <= PRESUPUESTO_PERIODO ? null : "El presupuesto no es el esperado.";
  });
  await control("eventos", ["roles-config"], async () => {
    const politica = permisosEsperados(grupo.esperado);
    if (!politica) return "Faltan los permisos esperados.";
    const desde = grupo.bloqueInicio ?? 0n;
    if (typeof desde !== "bigint" || desde < 0n || desde > blockNumber) return ENTRADA;
    // `hasta` es el bloque de las demás lecturas. El replay no detecta un log que el RPC haya omitido.
    const logs = await reader.getLogs({ address: roles, fromBlock: desde, toBlock: blockNumber });
    const replay = reconstruirPermisos(logs, { roles, desde, hasta: blockNumber });
    return replay.ok ? compararPermisos(replay.estado, { safe, ...politica }) : replay.motivo;
  });
  await control("simulacion", ["eventos", "presupuesto"], async () => {
    const politica = permisosEsperados(grupo.esperado);
    return politica ? comprobarNegativas(reader, { safe, roles, ...politica, blockNumber }) : "Faltan los permisos esperados.";
  });

  const controles = CONTROLES.map((id) => results.get(id)!);
  return { ok: controles.every((c) => c.ok), controles };
}
