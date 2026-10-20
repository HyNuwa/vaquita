import { describe, expect, it } from "vitest";
import { encodeFunctionData, erc20Abi } from "viem";
import { fromDataSuffix } from "@celo/attribution-tags";
import {
  appendTag,
  assertTagged,
  assertValidCode,
  hasTag,
  MissingAttributionError,
} from "../src/attribution/tag.js";
import { MAMA, TEST_CODE } from "./helpers.js";

const transferData = encodeFunctionData({
  abi: erc20Abi,
  functionName: "transfer",
  args: [MAMA, 10n ** 18n],
});

describe("código de atribución", () => {
  it("acepta el formato celo_xxxxxxxx", () => {
    expect(() => assertValidCode(TEST_CODE, { live: true })).not.toThrow();
  });

  it.each(["", "CELO_ABC", "celo abc", "celo_ñ", "x".repeat(33)])("rechaza %j", (bad) => {
    expect(() => assertValidCode(bad, { live: false })).toThrow();
  });

  it("en modo real rechaza placeholders y códigos de prueba", () => {
    for (const c of ["celo_xxxxxxxx", "celo_test1234"]) {
      expect(() => assertValidCode(c, { live: true })).toThrow(/real/i);
      expect(() => assertValidCode(c, { live: false })).not.toThrow();
    }
  });

  it("en modo real exige el prefijo celo_", () => {
    expect(() => assertValidCode("miapp", { live: true })).toThrow();
  });
});

describe("tag en el calldata", () => {
  it("el sufijo va AL FINAL y no cambia el calldata original", () => {
    const tagged = appendTag(transferData, TEST_CODE);
    expect(tagged.startsWith(transferData)).toBe(true);
    expect(tagged.length).toBeGreaterThan(transferData.length);
    expect(fromDataSuffix(tagged)?.codes).toContain(TEST_CODE);
  });

  it("hasTag distingue datos con y sin tag", () => {
    expect(hasTag(transferData, TEST_CODE)).toBe(false);
    expect(hasTag(appendTag(transferData, TEST_CODE), TEST_CODE)).toBe(true);
    expect(hasTag(appendTag(transferData, "celo_otro0000"), TEST_CODE)).toBe(false);
  });

  it("assertTagged frena calldata sin tag", () => {
    expect(() => assertTagged(transferData, TEST_CODE)).toThrow(MissingAttributionError);
    expect(() => assertTagged(undefined, TEST_CODE)).toThrow(MissingAttributionError);
    expect(() => assertTagged(appendTag(transferData, TEST_CODE), TEST_CODE)).not.toThrow();
  });

  it("no duplica el tag si ya estaba", () => {
    const once = appendTag(transferData, TEST_CODE);
    expect(appendTag(once, TEST_CODE)).toBe(once);
  });
});
