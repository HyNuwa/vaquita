import { decodeFunctionData, encodeFunctionData, erc20Abi, toFunctionSelector, zeroAddress, type Address } from "viem";
import { describe, expect, it } from "vitest";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { WFIAT } from "../src/config/tokens.js";
import { rolesAbi, safeAbi } from "../src/fondo/abis.js";
import { ROL_VAQUI } from "../src/fondo/constantes.js";
import { condicionesVaqui, txCambiarDestinatarios, txCerrarVaqui, txRevocar } from "../src/fondo/roles.js";
import { encodeMultiSend, txCambiarResponsable, txCancelar, txGasto, txReparto } from "../src/fondo/safe.js";

const safe = "0x1111111111111111111111111111111111111111" as const;
const roles = "0x2222222222222222222222222222222222222222" as const;
const a = "0x3333333333333333333333333333333333333333" as const;
const b = "0x4444444444444444444444444444444444444444" as const;
const c = "0x5555555555555555555555555555555555555555" as const;
const d = "0x6666666666666666666666666666666666666666" as const;
const SENTINEL = "0x0000000000000000000000000000000000000001" as const;
const wars = WFIAT.wARS.address;
const multi = contratosFondo(42220).multiSendCallOnly.address;
const transfer = (to: Address, amount: bigint) => encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [to, amount] });

describe("txGasto", () => {
  it("transfiere wARS con una llamada simple", () => {
    expect(txGasto(a, 5n)).toEqual({ to: wars, value: 0n, data: transfer(a, 5n), operation: 0 });
  });
  it.each([["cero", a, 0n], ["negativo", a, -1n], ["dirección cero", zeroAddress, 1n], ["dirección inválida", "0x12" as Address, 1n], ["centinela", SENTINEL as Address, 1n]])(
    "rechaza %s", (_n, to, amount) => { expect(() => txGasto(to as Address, amount as bigint)).toThrow(); });
});

describe("txCancelar", () => {
  it("es una llamada vacía al propio fondo", () => {
    expect(txCancelar(safe)).toEqual({ to: safe, value: 0n, data: "0x", operation: 0 });
  });
  it("rechaza una dirección inválida", () => { expect(() => txCancelar("0x12" as Address)).toThrow(); });
});

describe("txCambiarResponsable", () => {
  const args = (body: { data: `0x${string}` }) => decodeFunctionData({ abi: safeAbi, data: body.data }).args;
  it("usa el centinela para el primero", () => { expect(args(txCambiarResponsable(safe, [a, b, c], a, d))).toEqual([SENTINEL, a, d]); });
  it("usa el anterior para los demás", () => { expect(args(txCambiarResponsable(safe, [a, b, c], c, d))).toEqual([b, c, d]); });
  it("apunta al fondo, sin delegatecall", () => { expect(txCambiarResponsable(safe, [a, b, c], a, d)).toMatchObject({ to: safe, value: 0n, operation: 0 }); });
  it("no distingue mayúsculas al buscar", () => {
    expect(args(txCambiarResponsable(safe, [a, b, c], `0x${b.slice(2).toUpperCase()}` as Address, d))[0]).toBe(a);
  });
  it.each([["sale ajeno", d, c], ["entra repetido", a, b], ["entra cero", a, zeroAddress], ["entra centinela", a, SENTINEL], ["entra el fondo", a, safe]] as [string, Address, Address][])(
    "rechaza %s", (_n, sale, entra) => { expect(() => txCambiarResponsable(safe, [a, b, c], sale, entra)).toThrow(); });
});

describe("txReparto", () => {
  it("agrupa un transfer por fila con MultiSend", () => {
    expect(txReparto([{ destino: a, monto: 1n }, { destino: b, monto: 2n }])).toEqual({
      to: multi, value: 0n, operation: 1, data: encodeMultiSend([{ to: wars, data: transfer(a, 1n) }, { to: wars, data: transfer(b, 2n) }]) });
  });
  it.each([["vacío", []], ["monto cero", [{ destino: a, monto: 0n }]], ["destino cero", [{ destino: zeroAddress, monto: 1n }]]] as [string, { destino: Address; monto: bigint }[]][])(
    "rechaza %s", (_n, filas) => { expect(() => txReparto(filas)).toThrow(); });
});

describe("cuerpos sobre Roles", () => {
  it("txCambiarDestinatarios reemplaza el scope completo", () => {
    expect(txCambiarDestinatarios(roles, [b, a])).toEqual({ to: roles, value: 0n, operation: 0, data: encodeFunctionData({ abi: rolesAbi, functionName: "scopeFunction",
      args: [ROL_VAQUI, wars, toFunctionSelector("transfer(address,uint256)"), condicionesVaqui([a, b]), 0] }) });
  });
  it("txCambiarDestinatarios rechaza una lista vacía", () => { expect(() => txCambiarDestinatarios(roles, [])).toThrow(); });
  const revoke = encodeFunctionData({ abi: rolesAbi, functionName: "assignRoles", args: [a, [ROL_VAQUI], [false]] });
  it("txRevocar quita sólo el rol de Vaqui", () => {
    expect(txRevocar(roles, a)).toEqual({ to: roles, value: 0n, operation: 0, data: revoke });
  });
  it.each([[[roles], SENTINEL], [[b, roles], b]] as [Address[], Address][])("txCerrarVaqui revoca y deshabilita con el previo correcto", (modulos, prev) => {
    expect(txCerrarVaqui(safe, roles, a, modulos)).toEqual({ to: multi, value: 0n, operation: 1, data: encodeMultiSend([
      { to: roles, data: revoke }, { to: safe, data: encodeFunctionData({ abi: safeAbi, functionName: "disableModule", args: [prev, roles] }) }]) });
  });
  it("txCerrarVaqui falla si Roles no figura entre los módulos", () => { expect(() => txCerrarVaqui(safe, roles, a, [b])).toThrow(); });
});
