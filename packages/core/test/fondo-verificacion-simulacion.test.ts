import { decodeFunctionData, toFunctionSelector, toHex, type Address, type Hex } from "viem";
import { describe, expect, it, vi } from "vitest";
import { WFIAT } from "../src/config/tokens.js";
import { rolesAbi } from "../src/fondo/abis.js";
import { LIMITE_POR_TRANSFERENCIA, PERIODO_SEGUNDOS, ROL_VAQUI } from "../src/fondo/constantes.js";
import { FondoReadError, type FondoReader, type FundCall } from "../src/fondo/lectura.js";
import { comprobarNegativas } from "../src/fondo/verificacion-simulacion.js";
import {
  BALANCE, NO_MEMBERSHIP, SLOT_BASE, SLOT_SALDO, TIMESTAMP_BLOQUE, TIMESTAMP_PRESUPUESTO, evaluarNegativa, llamarNegativa, noAutorizado,
  palabraRefill, palabraSaldo, respuestaAllowances, violacion, type Modelo, type NegativaId,
} from "./fondo-negativas-fake.js";

const safe = "0x1111111111111111111111111111111111111111" as const;
const roles = "0x2222222222222222222222222222222222222222" as const;
const wallet = "0x3333333333333333333333333333333333333333" as const;
const recipient = "0x7777777777777777777777777777777777777777" as const;
const BLOCK = 77n;
const IDS: NegativaId[] = ["N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10"];
const entrada = { safe, roles, walletOperativa: wallet as Address, destinatarios: [recipient] as readonly Address[], blockNumber: BLOCK };

function fake(respuestas: Modelo["respuestas"] = {}, storage: Record<string, Hex | undefined> = { [SLOT_BASE]: palabraRefill(), [SLOT_SALDO]: palabraSaldo() }) {
  const modelo: Modelo = { roles, wallet, destinatarios: [recipient], respuestas };
  const negativas: FundCall[] = [];
  const reader = {
    getStorageAt: vi.fn(async ({ slot }: { slot: Hex }) => storage[slot]),
    getBlock: vi.fn(async ({ blockNumber }: { blockNumber: bigint }) => ({ number: blockNumber, hash: `0x${"cd".repeat(32)}` as Hex, timestamp: TIMESTAMP_BLOQUE })),
    call: vi.fn(async (request: FundCall) => {
      if (decodeFunctionData({ abi: rolesAbi, data: request.data }).functionName === "allowances") return { data: respuestaAllowances() };
      negativas.push(request);
      return llamarNegativa(modelo, request);
    }),
  } as unknown as FondoReader;
  return { reader, negativas };
}
const ids = (negativas: FundCall[]) => negativas.map((r) => evaluarNegativa({ roles, wallet, destinatarios: [recipient] }, r).id);
const inner = (request: FundCall) => decodeFunctionData({ abi: rolesAbi, data: request.data }).args as unknown as readonly [Address, bigint, Hex, number, Hex, boolean];

describe("comprobarNegativas", () => {
  it("aprueba sólo con las diez señales exactas, una llamada por negativa", async () => {
    const { reader, negativas } = fake();
    expect(await comprobarNegativas(reader, entrada)).toBeNull();
    expect(ids(negativas)).toEqual(IDS);
  });

  it("simula desde la wallet operativa, contra Roles y en el bloque verificado", async () => {
    const { reader, negativas } = fake();
    await comprobarNegativas(reader, entrada);
    for (const request of negativas.filter((_, i) => IDS[i] !== "N10")) {
      expect(request.account).toBe(wallet);
      expect(request.to).toBe(roles);
      expect(request.blockNumber).toBe(BLOCK);
      expect(inner(request)[5]).toBe(true);
    }
    expect(negativas[9]!.account).not.toBe(wallet);
    expect(negativas[9]!.blockNumber).toBe(BLOCK);
  });

  it("arma cada negativa diferente de un pago válido en una sola dimensión", async () => {
    const { reader, negativas } = fake();
    await comprobarNegativas(reader, entrada);
    const n = (id: NegativaId) => inner(negativas[IDS.indexOf(id)]!);
    expect(BigInt(`0x${n("N2")[2].slice(74)}`)).toBe(LIMITE_POR_TRANSFERENCIA + 1n);
    expect(n("N2")[2].slice(34, 74)).toBe(recipient.slice(2));
    expect(BigInt(`0x${n("N3")[2].slice(74)}`)).toBe(1n);
    expect(n("N4")[0].toLowerCase()).not.toBe(WFIAT.wARS.address.toLowerCase());
    expect(n("N7")[3]).toBe(1);
    expect(n("N8")[1]).toBe(1n);
    expect(n("N9")[4]).not.toBe(ROL_VAQUI);
    expect(n("N1")[4]).toBe(ROL_VAQUI);
  });

  it("agota el presupuesto cambiando sólo saldo y fecha, y conserva el período", async () => {
    const { reader, negativas } = fake();
    await comprobarNegativas(reader, entrada);
    expect(negativas[2]!.stateOverride).toEqual([{ address: roles, stateDiff: [
      { slot: SLOT_SALDO, value: toHex((TIMESTAMP_BLOQUE << 192n) | PERIODO_SEGUNDOS, { size: 32 }) },
    ] }]);
    for (const [i, request] of negativas.entries()) if (i !== 2) expect(request.stateOverride).toBeUndefined();
  });

  const conData = (data: Hex) => () => { throw new FondoReadError("revert", data); };
  const firmas: [NegativaId, Hex, Hex][] = [
    ["N1", violacion(9), `${violacion(5)}00`], ["N2", violacion(5), violacion(9).slice(0, -2) as Hex], ["N3", violacion(9), NO_MEMBERSHIP],
    ["N4", violacion(3), violacion(5)], ["N5", violacion(2), violacion(5)], ["N6", violacion(2), violacion(1)], ["N7", violacion(3), violacion(4)],
    ["N8", violacion(1), violacion(5)], ["N9", violacion(3), noAutorizado(wallet)], ["N10", NO_MEMBERSHIP, noAutorizado(wallet)],
  ];
  it.each(firmas)("%s rechaza otra señal de revert", async (id, otra, tambien) => {
    for (const signal of [otra, tambien]) {
      expect(typeof await comprobarNegativas(fake({ [id]: conData(signal) }).reader, entrada)).toBe("string");
    }
  });
  it.each(IDS)("%s rechaza que la llamada pase", async (id) => {
    expect(typeof await comprobarNegativas(fake({ [id]: () => ({ data: "0x" }) }).reader, entrada)).toBe("string");
  });
  it.each(IDS)("%s no cuenta un revert sin datos ni un error de red como prueba", async (id) => {
    for (const error of [new FondoReadError("revert"), new FondoReadError("transport"), new FondoReadError("unsupported"), new Error("revert 0xd0a9bf58")]) {
      expect(typeof await comprobarNegativas(fake({ [id]: () => { throw error; } }).reader, entrada)).toBe("string");
    }
  });

  it("exige selectores de error correctos", () => {
    expect(toFunctionSelector("ConditionViolation(uint8,bytes32)")).toBe("0xd0a9bf58");
    expect(toFunctionSelector("NoMembership()")).toBe("0xfd8e9f28");
    expect(toFunctionSelector("NotAuthorized(address)")).toBe("0x4a0bfec1");
  });

  describe("N3: el almacenamiento se autentica antes de alterarlo", () => {
    const expectNoN3 = async (storage: Record<string, Hex | undefined>) => {
      const { reader, negativas } = fake({}, storage);
      expect(typeof await comprobarNegativas(reader, entrada)).toBe("string");
      expect(negativas.some((r) => r.stateOverride)).toBe(false);
    };
    it.each([
      ["sin palabra de refill", { [SLOT_SALDO]: palabraSaldo() }],
      ["sin palabra de saldo", { [SLOT_BASE]: palabraRefill() }],
      ["con refill que no coincide", { [SLOT_BASE]: toHex(1n, { size: 32 }), [SLOT_SALDO]: palabraSaldo() }],
      ["con saldo que no coincide", { [SLOT_BASE]: palabraRefill(), [SLOT_SALDO]: palabraSaldo(BALANCE + 1n) }],
      ["con fecha que no coincide", { [SLOT_BASE]: palabraRefill(), [SLOT_SALDO]: palabraSaldo(BALANCE, TIMESTAMP_PRESUPUESTO + 1n) }],
    ] as [string, Record<string, Hex | undefined>][])("falla %s", async (_name, storage) => { await expectNoN3(storage); });
    it("falla si no se puede leer el bloque", async () => {
      const { reader, negativas } = fake();
      (reader.getBlock as ReturnType<typeof vi.fn>).mockRejectedValue(new FondoReadError("transport"));
      await expect(comprobarNegativas(reader, entrada)).rejects.toBeInstanceOf(FondoReadError);
      expect(negativas.some((r) => r.stateOverride)).toBe(false);
    });
  });

  it("no expone cuentas ni datos crudos en el motivo", async () => {
    const motivo = await comprobarNegativas(fake({ N1: conData(violacion(9)) }).reader, entrada);
    expect(motivo).not.toMatch(/0x/);
  });
});
