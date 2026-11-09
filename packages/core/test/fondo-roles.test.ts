import { describe, expect, it } from "vitest";
import { decodeFunctionData, getAddress, keccak256, pad, toHex, zeroAddress, type Address, type Hex } from "viem";
import { condicionesVaqui, buildInitialRules } from "@vaquita/core/fondo/roles";
import { multiSendCallOnlyAbi, rolesAbi, safeAbi } from "@vaquita/core/fondo/abis";
import { contratosFondo } from "@vaquita/core/config/fondo-contratos";
import { WFIAT } from "@vaquita/core/config/tokens";

const address = (n: bigint) => getAddress(toHex(n, { size: 20 }));
const recipients = Object.freeze([address(22n), address(10n), address(22n)]);
const config = Object.freeze({ safe: address(100n), roles: address(101n), operatingWallet: address(102n), recipients, nonce: 7n });
const role = keccak256(toHex("vaqui")), key = keccak256(toHex("vaqui-mensual"));
const budget = 20_000n * 10n ** 18n;
const RECIPIENT_ERROR = "Elegí entre 1 y 20 destinatarios con cuentas válidas.";
const CONFIG_ERROR = "Revisá las cuentas del grupo y el número de operación.";

// Decoder independiente del helper de producción: cabecera packed de 85 bytes.
function unpack(packed: Hex) {
  const calls: { operation: number; to: Address; value: bigint; data: Hex }[] = [];
  let rest = packed.slice(2);
  while (rest.length) {
    expect(rest.length).toBeGreaterThanOrEqual(170);
    const length = Number(BigInt(`0x${rest.slice(106, 170)}`));
    const data = `0x${rest.slice(170, 170 + length * 2)}` as Hex;
    expect(data.length).toBe(2 + length * 2);
    calls.push({ operation: Number.parseInt(rest.slice(0, 2), 16), to: getAddress(`0x${rest.slice(2, 42)}`), value: BigInt(`0x${rest.slice(42, 106)}`), data });
    rest = rest.slice(170 + length * 2);
  }
  return calls;
}

describe("condiciones Vaqui: BFS Roles 2.1.1", () => {
  it("ordena/deduplica sin mutar y fija ambos límites del monto en palabras de 32 bytes", () => {
    const before = [...recipients];
    expect(condicionesVaqui(recipients)).toEqual([
      { parent: 0, paramType: 5, operator: 5, compValue: "0x" },
      { parent: 0, paramType: 0, operator: 2, compValue: "0x" },
      { parent: 0, paramType: 0, operator: 1, compValue: "0x" },
      { parent: 1, paramType: 1, operator: 16, compValue: pad(address(10n), { size: 32 }) },
      { parent: 1, paramType: 1, operator: 16, compValue: pad(address(22n), { size: 32 }) },
      { parent: 2, paramType: 1, operator: 18, compValue: toHex(5_000n * 10n ** 18n + 1n, { size: 32 }) },
      { parent: 2, paramType: 1, operator: 28, compValue: key },
    ]);
    expect(recipients).toEqual(before);
  });
  it.each([1, 20])("admite %i destinatarios únicos con m+5 nodos BFS", (count) => {
    const list = Object.freeze(Array.from({ length: count }, (_, i) => address(BigInt(i + 1))));
    const nodes = condicionesVaqui(list);
    expect(nodes).toHaveLength(count + 5);
    expect(nodes.slice(3, count + 3)).toEqual(list.map((a) => ({ parent: 1, paramType: 1, operator: 16, compValue: pad(a, { size: 32 }) })));
    expect(nodes.slice(-2).map((n) => n.parent)).toEqual([2, 2]);
  });
  it("deduplica casing y aplica el máximo a la lista efectiva", () => {
    const a = address(171n);
    expect(condicionesVaqui([a, a.toLowerCase() as Address])).toHaveLength(6);
    const list = Array.from({ length: 20 }, (_, i) => address(BigInt(i + 1)));
    expect(condicionesVaqui([...list, list[0]!])).toHaveLength(25);
  });
  it("no traslada las exclusiones de responsables a los destinatarios", () => {
    expect(condicionesVaqui([zeroAddress, config.safe, config.operatingWallet])).toHaveLength(8);
  });
  it.each([[], Array.from({ length: 21 }, (_, i) => address(BigInt(i + 1))), ["0x12" as Address]].map((list) => ({ list })))("rechaza lista inválida sin modificarla: $list", ({ list }) => {
    const original = [...list];
    expect(() => condicionesVaqui(Object.freeze(list))).toThrow(new Error(RECIPIENT_ERROR));
    expect(list).toEqual(original);
  });
});

describe("lote inicial portable: cinco llamadas sin permisos extra", () => {
  it("decodifica cuerpo, orden, destinos, valores y argumentos exactos sin doble envolver", () => {
    const tx = buildInitialRules(config);
    expect(tx).toMatchObject({ to: contratosFondo(42220).multiSendCallOnly.address, value: 0n, operation: 1, nonce: 7n });
    expect(Object.keys(tx).sort()).toEqual(["data", "nonce", "operation", "to", "value"]);
    const outer = decodeFunctionData({ abi: multiSendCallOnlyAbi, data: tx.data });
    expect(outer.functionName).toBe("multiSend");
    const calls = unpack(outer.args[0]);
    expect(calls).toHaveLength(5);
    expect(calls.map(({ operation, to, value }) => ({ operation, to, value }))).toEqual([config.safe, ...Array<Address>(4).fill(config.roles)].map((to) => ({ operation: 0, to, value: 0n })));
    expect(decodeFunctionData({ abi: safeAbi, data: calls[0]!.data })).toEqual({ functionName: "enableModule", args: [config.roles] });
    expect(calls.slice(1).map((c) => decodeFunctionData({ abi: rolesAbi, data: c.data }))).toEqual([
      { functionName: "setAllowance", args: [key, budget, budget, budget, 2_592_000n, 0n] },
      { functionName: "scopeTarget", args: [role, WFIAT.wARS.address] },
      { functionName: "scopeFunction", args: [role, WFIAT.wARS.address, "0xa9059cbb", condicionesVaqui(recipients).map((n) => ({ ...n, compValue: n.compValue.toLowerCase() })), 0] },
      { functionName: "assignRoles", args: [config.operatingWallet, [role], [true]] },
    ]);
    expect(config).toEqual({ safe: address(100n), roles: address(101n), operatingWallet: address(102n), recipients: [address(22n), address(10n), address(22n)], nonce: 7n });
  });
  it.each(["safe", "roles", "operatingWallet"] as const)("valida %s antes de armar el lote", (field) => {
    expect(() => buildInitialRules({ ...config, [field]: "0x12" as Address })).toThrow(new Error(CONFIG_ERROR));
  });
  it.each([-1n, 1n << 256n])("rechaza número de operación fuera de rango: %s", (nonce) => {
    expect(() => buildInitialRules({ ...config, nonce })).toThrow(new Error(CONFIG_ERROR));
    expect(config.nonce).toBe(7n);
  });
  it("propaga la validación de destinatarios sin devolver un cuerpo parcial", () => {
    expect(() => buildInitialRules({ ...config, recipients: [] })).toThrow(new Error(RECIPIENT_ERROR));
    expect(config.recipients).toBe(recipients);
  });
});
