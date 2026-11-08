import { describe, expect, expectTypeOf, it } from "vitest";
import { decodeFunctionData, erc20Abi, toHex, type Address, type Hex } from "viem";
import { fromDataSuffix } from "@celo/attribution-tags";
import { assertValidCode, appendTag } from "../src/attribution/tag.js";
import { WFIAT } from "../src/config/tokens.js";
import { safeAbi } from "../src/fondo/abis.js";
import { SAFE_GAS_FIELDS, firmasPreaprobadas, hashTransaccionSafe, type TxSafe } from "../src/fondo/safe.js";
import { aportar, aprobarHash, ejecutarPropuesta, type TxPersona } from "../src/fondo/transacciones.js";
import type { TxComprador } from "../src/compra/firmas.js";

const CODE = "celo_abc123";
const SAFE: Address = "0x0000000000000000000000000000000000000011";
const OWNER: Address = "0x0000000000000000000000000000000000000022";
const HASH = toHex(42n, { size: 32 }); // Hash sintético, no credencial ni vector de fork.
const SIGNATURES = firmasPreaprobadas([OWNER, SAFE]);
const BODY: TxSafe = Object.freeze({ to: OWNER, value: 7n, data: "0x123400", operation: 1, nonce: 9n });

function checkTag(tx: TxPersona, to: Address): void {
  expect(Object.keys(tx).sort()).toEqual(["data", "to"]);
  expect(tx.to).toBe(to);
  expect(fromDataSuffix(tx.data)?.codes).toEqual([CODE]);
}

describe("transacciones del fondo para personas", () => {
  it.each([0n, 1234n, 5_000n * 10n ** 18n + 1n])("aporta %s por transfer, sin tope del agente", (amount) => {
    const tx = aportar(SAFE, amount, CODE);
    checkTag(tx, WFIAT.wARS.address);
    expect(decodeFunctionData({ abi: erc20Abi, data: tx.data })).toEqual({
      functionName: "transfer", args: [SAFE, amount],
    });
  });

  it("aprueba exactamente el hash indicado en el Safe", () => {
    const tx = aprobarHash(SAFE, HASH, CODE);
    checkTag(tx, SAFE);
    expect(decodeFunctionData({ abi: safeAbi, data: tx.data })).toEqual({
      functionName: "approveHash", args: [HASH],
    });
  });

  it.each<Hex>(["0x", "0x123400", appendTag("0xabcd", CODE)])("ejecuta sin alterar los bytes internos %s", (data) => {
    const body = Object.freeze({ ...BODY, data });
    const before = { ...body };
    const hashBefore = hashTransaccionSafe(SAFE, body);
    const tx = ejecutarPropuesta(SAFE, body, SIGNATURES, CODE);
    checkTag(tx, SAFE);
    expect(decodeFunctionData({ abi: safeAbi, data: tx.data })).toEqual({
      functionName: "execTransaction",
      args: [body.to, body.value, data, body.operation,
        SAFE_GAS_FIELDS.safeTxGas, SAFE_GAS_FIELDS.baseGas, SAFE_GAS_FIELDS.gasPrice,
        SAFE_GAS_FIELDS.gasToken, SAFE_GAS_FIELDS.refundReceiver, SIGNATURES],
    });
    expect(body).toEqual(before);
    expect(hashTransaccionSafe(SAFE, body)).toBe(hashBefore);
    // El nonce participa del hash; execTransaction lo lee en cadena, no lo recibe.
    expect(ejecutarPropuesta(SAFE, { ...body, nonce: 10n }, SIGNATURES, CODE)).toEqual(tx);
  });

  for (const [name, build] of [
    ["aportar", (code: string) => aportar(SAFE, 1n, code)],
    ["aprobarHash", (code: string) => aprobarHash(SAFE, HASH, code)],
    ["ejecutarPropuesta", (code: string) => ejecutarPropuesta(SAFE, BODY, SIGNATURES, code)],
  ] as const) {
    it.each(["", "INVALID!", "otro_codigo", "celo_xxxxxxxx", "celo_test1234"])(`${name} rechaza código %s con el error del helper`, (code) => {
      let expected: unknown;
      try { assertValidCode(code, { live: true }); } catch (error) { expected = error; }
      expect(expected).toBeInstanceOf(Error);
      expect(() => build(code)).toThrow(expected as Error);
      expect(BODY).toEqual({ to: OWNER, value: 7n, data: "0x123400", operation: 1, nonce: 9n });
    });
  }

  it("conserva la compatibilidad estructural del tipo comprador de dos campos", () => {
    expectTypeOf<TxPersona>().toEqualTypeOf<{ to: Address; data: Hex }>();
    expectTypeOf<TxComprador>().toEqualTypeOf<TxPersona>();
    const previousShape: TxComprador = { to: SAFE, data: "0x" };
    expectTypeOf(previousShape).toExtend<TxPersona>();
    expect(previousShape).toEqual({ to: SAFE, data: "0x" });
  });
});
