import { encodeErrorResult, pad, parseAbi, type Hex } from "viem";
import { describe, expect, it } from "vitest";
import { clasificarError } from "../src/fondo/errores.js";
import { FondoReadError } from "../src/fondo/lectura.js";

const viol = (status: number): Hex => `0xd0a9bf58${status.toString(16).padStart(64, "0")}${"ab".repeat(32)}`;
const revert = (data: Hex) => new FondoReadError("revert", data);
const reason = (text: string) => encodeErrorResult({ abi: parseAbi(["error Error(string)"]), errorName: "Error", args: [text] });
const notAuth: Hex = `0x4a0bfec1${pad("0x12", { size: 32 }).slice(2)}`;

describe("clasificarError", () => {
  it.each([
    [viol(1), "OPERACION_NO_PERMITIDA"], [viol(2), "OPERACION_NO_PERMITIDA"], [viol(3), "OPERACION_NO_PERMITIDA"], [viol(4), "OPERACION_NO_PERMITIDA"],
    [viol(5), "DESTINATARIO_NO_AUTORIZADO"], [viol(9), "SUPERA_TOPE_POR_PAGO"], [viol(17), "PRESUPUESTO_AGOTADO"],
    ["0xfd8e9f28", "VAQUI_REVOCADO"], [notAuth, "CUENTA_NO_AUTORIZADA"],
    [reason("GS020"), "FALTAN_FIRMAS"], [reason("GS025"), "FIRMA_NO_VALIDA"], [reason("GS013"), "GASTO_RECHAZADO"],
  ] as [Hex, string][])("clasifica %s", (data, codigo) => {
    const result = clasificarError(revert(data));
    expect(result.codigo).toBe(codigo);
    expect(result.transitorio).toBe(false);
  });

  it("encuentra los datos del revert anidados en la causa", () => {
    const error = Object.assign(new Error("x"), { cause: { cause: { data: viol(5) } } });
    expect(clasificarError(error).codigo).toBe("DESTINATARIO_NO_AUTORIZADO");
  });
  it("no se cuelga con una causa circular", () => {
    const error: { cause?: unknown } = {};
    error.cause = error;
    expect(clasificarError(error).codigo).toBe("ERROR_DESCONOCIDO");
  });

  it.each([
    [new FondoReadError("transport")], [{ name: "TimeoutError" }], [{ status: 429 }], [{ status: 500 }], [{ status: 503 }], [{ cause: { status: 502 } }],
  ])("marca como transitorio el fallo de red %#", (error) => {
    expect(clasificarError(error)).toMatchObject({ codigo: "RED_NO_DISPONIBLE", transitorio: true });
  });
  it.each([[{ status: 400 }], [{ status: 404 }]])("no reintenta otro estado HTTP %#", (error) => {
    expect(clasificarError(error)).toMatchObject({ codigo: "ERROR_DESCONOCIDO", transitorio: false });
  });

  it("reconoce los fondos insuficientes para la comisión", () => {
    expect(clasificarError({ name: "InsufficientFundsError" })).toMatchObject({ codigo: "SIN_SALDO_COMISION", transitorio: false });
  });

  it.each([
    [revert(`${viol(5)}00`)], [revert("0xd0a9bf58")], [revert("0xdeadbeef")], [revert(`${"0xfd8e9f28"}00`)],
    [new FondoReadError("revert")], [new Error("GS020")], [undefined], [null], ["GS020"],
  ])("no adivina con una señal inexacta %#", (error) => {
    expect(clasificarError(error)).toMatchObject({ codigo: "ERROR_DESCONOCIDO", transitorio: false });
  });

  it("escribe para personas: sin jerga ni direcciones", () => {
    for (const data of [viol(1), viol(5), viol(9), viol(17), "0xfd8e9f28", notAuth, reason("GS020"), reason("GS025"), reason("GS013")] as Hex[]) {
      expect(clasificarError(revert(data)).mensaje).not.toMatch(/0x|wei|gas|calldata|safe|revert/i);
    }
    expect(clasificarError(new Error("0xsecreto")).mensaje).not.toMatch(/0x/);
  });
});
