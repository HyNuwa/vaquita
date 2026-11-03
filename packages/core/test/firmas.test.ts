import { describe, expect, it } from "vitest";
import { decodeFunctionData, erc20Abi, getAddress, toFunctionSelector, type Address } from "viem";
import { fromDataSuffix } from "@celo/attribution-tags";
import { autorizarCampana, cancelarCompromiso, comprometerse } from "../src/compra/firmas.js";
import { WFIAT } from "../src/config/tokens.js";

const CODE = "celo_abc123";
const CAMPANA = getAddress("0x00000000000000000000000000000000000000c1") as Address;

describe("transacciones del comprador", () => {
  it("la autorización va a wARS, por el importe exacto y con etiqueta", () => {
    const tx = autorizarCampana(CAMPANA, 1234n, CODE);
    expect(tx.to).toBe(WFIAT.wARS.address);
    expect(fromDataSuffix(tx.data)?.codes).toEqual([CODE]);
    const { functionName, args } = decodeFunctionData({ abi: erc20Abi, data: tx.data });
    expect(functionName).toBe("approve");
    expect(args).toEqual([CAMPANA, 1234n]);
  });

  it("una autorización en cero también lleva etiqueta", () => {
    expect(fromDataSuffix(autorizarCampana(CAMPANA, 0n, CODE).data)?.codes).toEqual([CODE]);
  });

  it("comprometerse y cancelar van a la campaña con su función y etiqueta", () => {
    for (const [tx, firma] of [
      [comprometerse(CAMPANA, CODE), "comprometer()"],
      [cancelarCompromiso(CAMPANA, CODE), "cancelarCompromiso()"],
    ] as const) {
      expect(tx.to).toBe(CAMPANA);
      expect(tx.data.startsWith(toFunctionSelector(firma))).toBe(true);
      expect(fromDataSuffix(tx.data)?.codes).toEqual([CODE]);
    }
  });

  it("no arma nada con un código de ejemplo ni con un importe negativo", () => {
    expect(() => autorizarCampana(CAMPANA, 1n, "celo_xxxxxxxx")).toThrow("código de ejemplo");
    expect(() => comprometerse(CAMPANA, "otro_codigo")).toThrow("celo_");
    expect(() => autorizarCampana(CAMPANA, -1n, CODE)).toThrow("negativo");
  });
});
