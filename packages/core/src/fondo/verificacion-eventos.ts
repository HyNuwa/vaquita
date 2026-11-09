import { decodeEventLog, type Address, type Hex } from "viem";
import { rolesEventsAbi } from "./abis.js";
import type { FundLog } from "./lectura.js";

export interface RangoEventos { roles: Address; desde: bigint; hasta: bigint }
export interface CondicionPlana { parent: number; paramType: number; operator: number; compValue: Hex }
export type FuncionEfectiva =
  | { tipo: "libre"; options: number }
  | { tipo: "condicionada"; options: number; condiciones: readonly CondicionPlana[] };
export interface Presupuesto { balance: bigint; maxRefill: bigint; refill: bigint; period: bigint; timestamp: bigint }
export interface EstadoEfectivo {
  configuracion: { owner: Address; avatar: Address; target: Address };
  /** módulo -> roles vigentes. Claves de dirección en minúsculas. */
  miembros: Map<string, Set<Hex>>;
  /** `rol|objetivo` */
  objetivos: Map<string, { clearance: "target" | "function"; options: number }>;
  /** `rol|objetivo|selector`. Sobrevive a RevokeTarget: una función latente vuelve al reabrir el objetivo. */
  funciones: Map<string, FuncionEfectiva>;
  defaults: Map<string, Hex>;
  /** `destino|selector` */
  unwrappers: Map<string, Address>;
  presupuestos: Map<Hex, Presupuesto>;
  modulos: Set<string>;
}
export type ResultadoEventos = { ok: true; estado: EstadoEfectivo } | { ok: false; motivo: string };

const ZERO_ROLE = `0x${"0".repeat(64)}`;
const ZERO_ADDRESS = `0x${"0".repeat(40)}`;
const INVALIDO = "El historial de permisos no es válido.";
const INCOMPLETO = "El historial de permisos está incompleto.";
// Sin efecto sobre permisos, o propios de la inicialización, que puede emitirlos antes del setup.
const NO_MUTAN = new Set(["RolesModSetup", "OwnershipTransferred", "AvatarSet", "TargetSet", "Initialized",
  "ConsumeAllowance", "ExecutionFromModuleSuccess", "ExecutionFromModuleFailure", "HashExecuted", "HashInvalidated"]);

const key = (...parts: string[]) => parts.join("|").toLowerCase();
const fail = (motivo: string): ResultadoEventos => ({ ok: false, motivo });

/**
 * Reconstruye permisos aplicando TODO el historial recibido, en orden. Sin el setup dentro del
 * rango no hay prueba de cobertura desde el origen. No puede detectar un log omitido por el RPC.
 */
export function reconstruirPermisos(logs: readonly FundLog[], rango: RangoEventos): ResultadoEventos {
  if (typeof rango.desde !== "bigint" || typeof rango.hasta !== "bigint" || rango.desde > rango.hasta) return fail(INVALIDO);
  const roles = rango.roles.toLowerCase();
  const hashes = new Map<bigint, Hex>();
  for (const log of logs) {
    if (log.removed || log.address.toLowerCase() !== roles || log.blockNumber < rango.desde || log.blockNumber > rango.hasta) return fail(INVALIDO);
    if ((hashes.get(log.blockNumber) ?? log.blockHash) !== log.blockHash) return fail(INVALIDO);
    hashes.set(log.blockNumber, log.blockHash);
  }
  const ordered = [...logs].sort((a, b) =>
    a.blockNumber < b.blockNumber ? -1 : a.blockNumber > b.blockNumber ? 1 : a.logIndex - b.logIndex);
  for (let i = 1; i < ordered.length; i++) {
    const previous = ordered[i - 1]!, current = ordered[i]!;
    if (previous.blockNumber === current.blockNumber
      && (previous.logIndex === current.logIndex || current.transactionIndex < previous.transactionIndex)) return fail(INVALIDO);
  }

  let configuracion: EstadoEfectivo["configuracion"] | undefined;
  const miembros: EstadoEfectivo["miembros"] = new Map(), objetivos: EstadoEfectivo["objetivos"] = new Map();
  const funciones: EstadoEfectivo["funciones"] = new Map(), defaults: EstadoEfectivo["defaults"] = new Map();
  const unwrappers: EstadoEfectivo["unwrappers"] = new Map(), presupuestos: EstadoEfectivo["presupuestos"] = new Map();
  const modulos: EstadoEfectivo["modulos"] = new Set();

  for (const log of ordered) {
    let eventName: string;
    let args: Record<string, never>;
    try {
      const decoded = decodeEventLog({ abi: rolesEventsAbi, topics: [...log.topics] as [Hex, ...Hex[]], data: log.data, strict: true });
      eventName = decoded.eventName;
      args = decoded.args as unknown as Record<string, never>;
    } catch { return fail(INVALIDO); }
    if (!NO_MUTAN.has(eventName) && !configuracion) return fail(INCOMPLETO);
    const a = args as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    switch (eventName) {
      case "RolesModSetup":
        if (configuracion) return fail(INVALIDO);
        configuracion = { owner: a.owner, avatar: a.avatar, target: a.target };
        break;
      // Antes del setup son parte de la inicialización, y el setup fija los mismos valores.
      case "OwnershipTransferred": if (configuracion) configuracion.owner = a.newOwner; break;
      case "AvatarSet": if (configuracion) configuracion.avatar = a.newAvatar; break;
      case "TargetSet": if (configuracion) configuracion.target = a.newTarget; break;
      case "AssignRoles": {
        if (a.roleKeys.length !== a.memberOf.length) return fail(INVALIDO);
        const moduleKey = a.module.toLowerCase();
        const current = miembros.get(moduleKey) ?? new Set<Hex>();
        a.roleKeys.forEach((role: Hex, i: number) => { if (a.memberOf[i]) current.add(role); else current.delete(role); });
        if (current.size) miembros.set(moduleKey, current); else miembros.delete(moduleKey);
        break;
      }
      case "AllowTarget": objetivos.set(key(a.roleKey, a.targetAddress), { clearance: "target", options: a.options }); break;
      case "ScopeTarget": objetivos.set(key(a.roleKey, a.targetAddress), { clearance: "function", options: 0 }); break;
      case "RevokeTarget": objetivos.delete(key(a.roleKey, a.targetAddress)); break;
      case "AllowFunction": funciones.set(key(a.roleKey, a.targetAddress, a.selector), { tipo: "libre", options: a.options }); break;
      case "ScopeFunction":
        funciones.set(key(a.roleKey, a.targetAddress, a.selector), { tipo: "condicionada", options: a.options,
          condiciones: a.conditions.map((c: CondicionPlana) => ({ parent: c.parent, paramType: c.paramType, operator: c.operator, compValue: c.compValue })) });
        break;
      case "RevokeFunction": funciones.delete(key(a.roleKey, a.targetAddress, a.selector)); break;
      case "SetDefaultRole":
        if (a.defaultRoleKey === ZERO_ROLE) defaults.delete(a.module.toLowerCase()); else defaults.set(a.module.toLowerCase(), a.defaultRoleKey);
        break;
      case "SetUnwrapAdapter":
        if (a.adapter.toLowerCase() === ZERO_ADDRESS) unwrappers.delete(key(a.to, a.selector)); else unwrappers.set(key(a.to, a.selector), a.adapter);
        break;
      case "SetAllowance":
        presupuestos.set(a.allowanceKey, { balance: a.balance, maxRefill: a.maxRefill, refill: a.refill, period: a.period, timestamp: a.timestamp });
        break;
      case "EnabledModule": modulos.add(a.module.toLowerCase()); break;
      case "DisabledModule": modulos.delete(a.module.toLowerCase()); break;
      default: break;
    }
  }
  if (!configuracion) return fail(INCOMPLETO);
  return { ok: true, estado: { configuracion, miembros, objetivos, funciones, defaults, unwrappers, presupuestos, modulos } };
}
