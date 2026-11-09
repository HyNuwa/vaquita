import { encodeAbiParameters, encodeEventTopics, getAbiItem, pad, toHex, type Address, type Hex } from "viem";
import { describe, expect, it } from "vitest";
import { rolesEventsAbi } from "../src/fondo/abis.js";
import type { FundLog } from "../src/fondo/lectura.js";
import { reconstruirPermisos } from "../src/fondo/verificacion-eventos.js";

const roles = "0x2222222222222222222222222222222222222222" as const;
const safe = "0x1111111111111111111111111111111111111111" as const;
const moduleA = "0x3333333333333333333333333333333333333333" as const;
const token = "0x4444444444444444444444444444444444444444" as const;
const other = "0x5555555555555555555555555555555555555555" as const;
const ROLE = pad("0x01", { size: 32 });
const ROLE2 = pad("0x02", { size: 32 });
const SELECTOR = "0xa9059cbb" as const;
const ZERO32 = pad("0x", { size: 32 });
const ZERO = "0x0000000000000000000000000000000000000000" as const;
const range = { roles, desde: 1n, hasta: 100n };
const condition = { parent: 0, paramType: 5, operator: 5, compValue: "0x" as Hex };

let position = 0;
/** Arma un log minado con el ABI real; cada llamada ocupa la posición siguiente. */
function log(eventName: string, args: Record<string, unknown>, extra: Partial<FundLog> = {}): FundLog {
  const item = getAbiItem({ abi: rolesEventsAbi, name: eventName } as never) as unknown as
    { inputs: readonly { name: string; type: string; indexed?: boolean; components?: unknown }[] };
  const topics = encodeEventTopics({ abi: rolesEventsAbi, eventName, args } as never) as Hex[];
  const plain = item.inputs.filter((input) => !input.indexed);
  const data = encodeAbiParameters(plain as never, plain.map((input) => args[input.name]) as never);
  position += 1;
  const blockNumber = extra.blockNumber ?? 10n;
  return { address: roles, topics, data, blockNumber, blockHash: pad(toHex(blockNumber), { size: 32 }),
    transactionHash: pad(toHex(position), { size: 32 }), transactionIndex: position, logIndex: position, removed: false, ...extra };
}
// El setup va en un bloque anterior: el orden de construcción de los logs no decide el orden en cadena.
const setup = () => log("RolesModSetup", { initiator: other, owner: safe, avatar: safe, target: safe }, { blockNumber: 5n });
const assign = (memberOf: boolean, roleKeys: readonly Hex[] = [ROLE]) =>
  log("AssignRoles", { module: moduleA, roleKeys, memberOf: roleKeys.map(() => memberOf) });
const scopeFn = (conditions: readonly (typeof condition)[] = [condition], options = 0) =>
  log("ScopeFunction", { roleKey: ROLE, targetAddress: token, selector: SELECTOR, conditions, options });
function ok(logs: readonly FundLog[]) {
  const result = reconstruirPermisos(logs, range);
  if (!result.ok) throw new Error(`expected replay to pass: ${result.motivo}`);
  return result.estado;
}
function rejected(logs: readonly FundLog[], options = range) {
  const result = reconstruirPermisos(logs, options);
  expect(result.ok).toBe(false);
  return result;
}
const fnKey = `${ROLE}|${token}|${SELECTOR}`.toLowerCase();
const targetKey = `${ROLE}|${token}`.toLowerCase();

describe("reconstruirPermisos: estado efectivo", () => {
  it("toma la configuración del setup", () => {
    expect(ok([setup()]).configuracion).toEqual({ owner: safe, avatar: safe, target: safe });
  });

  it("ordena por bloque y posición antes de aplicar", () => {
    const first = setup(), grant = assign(true), revoke = assign(false);
    expect(ok([revoke, grant, first]).miembros.get(moduleA)?.has(ROLE)).toBeFalsy();
  });

  it("revoca sólo el rol indicado y permite volver a asignarlo", () => {
    const state = ok([setup(), assign(true, [ROLE, ROLE2]), assign(false, [ROLE])]);
    expect([...(state.miembros.get(moduleA) ?? [])]).toEqual([ROLE2]);
    expect(ok([setup(), assign(true), assign(false), assign(true)]).miembros.get(moduleA)?.has(ROLE)).toBe(true);
  });

  it("registra cada tipo de habilitación de objetivo y su revocación", () => {
    const allow = log("AllowTarget", { roleKey: ROLE, targetAddress: token, options: 2 });
    expect(ok([setup(), allow]).objetivos.get(targetKey)).toEqual({ clearance: "target", options: 2 });
    const scope = log("ScopeTarget", { roleKey: ROLE, targetAddress: token });
    expect(ok([setup(), allow, scope]).objetivos.get(targetKey)).toEqual({ clearance: "function", options: 0 });
    const revoke = log("RevokeTarget", { roleKey: ROLE, targetAddress: token });
    expect(ok([setup(), scope, revoke]).objetivos.has(targetKey)).toBe(false);
  });

  it("conserva una función latente aunque se revoque el objetivo", () => {
    const allow = log("AllowFunction", { roleKey: ROLE, targetAddress: token, selector: SELECTOR, options: 1 });
    const revokeTarget = log("RevokeTarget", { roleKey: ROLE, targetAddress: token });
    const scopeTarget = log("ScopeTarget", { roleKey: ROLE, targetAddress: token });
    const state = ok([setup(), allow, revokeTarget, scopeTarget]);
    expect(state.funciones.get(fnKey)).toEqual({ tipo: "libre", options: 1 });
  });

  it("revokeFunction elimina la función y la última definición gana", () => {
    const allow = log("AllowFunction", { roleKey: ROLE, targetAddress: token, selector: SELECTOR, options: 1 });
    const scoped = scopeFn();
    expect(ok([setup(), allow, scoped]).funciones.get(fnKey)).toEqual({ tipo: "condicionada", options: 0, condiciones: [condition] });
    const revoke = log("RevokeFunction", { roleKey: ROLE, targetAddress: token, selector: SELECTOR });
    expect(ok([setup(), scoped, revoke]).funciones.has(fnKey)).toBe(false);
  });

  it("registra rol por defecto y lo limpia con cero", () => {
    const set = log("SetDefaultRole", { module: moduleA, defaultRoleKey: ROLE });
    expect(ok([setup(), set]).defaults.get(moduleA.toLowerCase())).toBe(ROLE);
    const clear = log("SetDefaultRole", { module: moduleA, defaultRoleKey: ZERO32 });
    expect(ok([setup(), set, clear]).defaults.has(moduleA.toLowerCase())).toBe(false);
  });

  it("registra adaptadores de unwrap y los limpia con cero", () => {
    const key = `${token}|${SELECTOR}`.toLowerCase();
    const set = log("SetUnwrapAdapter", { to: token, selector: SELECTOR, adapter: other });
    expect(ok([setup(), set]).unwrappers.get(key)).toBe(other);
    const clear = log("SetUnwrapAdapter", { to: token, selector: SELECTOR, adapter: ZERO });
    expect(ok([setup(), set, clear]).unwrappers.has(key)).toBe(false);
  });

  it("conserva la última configuración de presupuesto", () => {
    const first = log("SetAllowance", { allowanceKey: ROLE, balance: 1n, maxRefill: 2n, refill: 3n, period: 4n, timestamp: 5n });
    const last = log("SetAllowance", { allowanceKey: ROLE, balance: 6n, maxRefill: 7n, refill: 8n, period: 9n, timestamp: 0n });
    expect(ok([setup(), first, last]).presupuestos.get(ROLE)).toEqual({ balance: 6n, maxRefill: 7n, refill: 8n, period: 9n, timestamp: 0n });
  });

  it("actualiza dueño, avatar y target, y registra módulos habilitados", () => {
    const state = ok([setup(),
      log("OwnershipTransferred", { previousOwner: safe, newOwner: other }),
      log("AvatarSet", { previousAvatar: safe, newAvatar: other }),
      log("TargetSet", { previousTarget: safe, newTarget: other }),
      log("EnabledModule", { module: moduleA })]);
    expect(state.configuracion).toEqual({ owner: other, avatar: other, target: other });
    expect(state.modulos.has(moduleA.toLowerCase())).toBe(true);
    expect(ok([setup(), log("EnabledModule", { module: moduleA }), log("DisabledModule", { module: moduleA })]).modulos.size).toBe(0);
  });

  it("no cambia permisos con eventos de uso", () => {
    const state = ok([setup(), log("ConsumeAllowance", { allowanceKey: ROLE, consumed: 1n, newBalance: 2n }),
      log("ExecutionFromModuleSuccess", { module: moduleA })]);
    expect(state.miembros.size + state.funciones.size + state.presupuestos.size).toBe(0);
  });
});

describe("reconstruirPermisos: historia incompleta o inválida falla cerrado", () => {
  it("rechaza una historia sin setup", () => { rejected([]); rejected([assign(true)]); });
  it("rechaza dos setups", () => { rejected([setup(), setup()]); });
  it("rechaza una mutación anterior al setup", () => {
    rejected([setup(), log("AssignRoles", { module: moduleA, roleKeys: [ROLE], memberOf: [true] }, { blockNumber: 3n })]);
  });
  it("rechaza un log removido", () => { rejected([setup(), assign(true), { ...assign(true), removed: true }]); });
  it("rechaza un log de otro contrato", () => { rejected([setup(), { ...assign(true), address: other as Address }]); });
  it("rechaza un log fuera del rango", () => {
    rejected([setup(), log("AssignRoles", { module: moduleA, roleKeys: [ROLE], memberOf: [true] }, { blockNumber: 101n })]);
  });
  it("rechaza dos logs en la misma posición", () => {
    const a = assign(true); const b = assign(true);
    rejected([setup(), a, { ...b, logIndex: a.logIndex }]);
  });
  it("rechaza hashes distintos para un mismo bloque", () => {
    rejected([setup(), assign(true), { ...assign(true), blockHash: pad("0x99", { size: 32 }) }]);
  });
  it("rechaza una transacción que retrocede dentro del bloque", () => {
    const a = assign(true); const b = assign(true);
    rejected([setup(), a, { ...b, transactionIndex: a.transactionIndex - 1 }]);
  });
  it("rechaza un evento desconocido", () => { rejected([setup(), { ...assign(true), topics: [pad("0xbeef", { size: 32 })] }]); });
  it("rechaza datos malformados", () => { rejected([setup(), { ...assign(true), data: "0x01" }]); });
  it("rechaza listas de distinto largo", () => {
    rejected([setup(), log("AssignRoles", { module: moduleA, roleKeys: [ROLE, ROLE2], memberOf: [true] })]);
  });
  it("rechaza un rango invertido o no bigint", () => {
    rejected([setup()], { roles, desde: 5n, hasta: 4n });
    rejected([setup()], { roles, desde: "1" as never, hasta: 100n });
  });
  it("no filtra direcciones en el motivo", () => {
    const result = rejected([setup(), { ...assign(true), address: other as Address }]);
    expect(JSON.stringify(result)).not.toMatch(/0x[0-9a-fA-F]{6}/);
  });
});
