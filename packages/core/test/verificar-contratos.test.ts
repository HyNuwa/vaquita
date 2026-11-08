import { describe, expect, it, vi } from "vitest";
import { keccak256, type Address, type Hex } from "viem";
import { contratosFondo, DIRECCIONES_PROHIBIDAS } from "../src/config/fondo-contratos.js";
import { runContractCheck } from "../scripts/verificar-contratos.js";

const code = "0x60016000" as Hex;
const config = Object.fromEntries(Object.entries(contratosFondo(42220)).map(([name, entry]) =>
  [name, { ...entry, codeHash: keccak256(code) }],
));
const pending = "Pendiente humano: sanityCheckZodiacModuleAddress (Zodiac 5.0.1 retirado por alertas de seguridad).";
const header = "Contrato | Dirección | Hash esperado | Hash observado | Resultado";
const row = (name: string, observed: string, result: string) => {
  const entry = config[name]!;
  return `${name} | ${entry.address} | ${entry.codeHash} | ${observed} | ${result}`;
};
function setup() {
  const out: string[] = [], err: string[] = [];
  const reader = { getChainId: vi.fn(async () => 42220), getCode: vi.fn(async (_args: { address: Address }) => code as Hex | undefined) };
  const deps = { reader, contracts: config, stdout: (line: string) => out.push(line), stderr: (line: string) => err.push(line) };
  return { reader, deps, out, err };
}

describe("verificador de contratos de solo lectura", () => {
  it("imprime seis hashes y distingue el checker humano pendiente del éxito obligatorio", async () => {
    const s = setup();
    expect(await runContractCheck(s.deps)).toBe(0);
    expect(s.out).toEqual([header, ...Object.keys(config).map(name => row(name, keccak256(code), "OK"))]);
    expect(s.err).toEqual([pending]);
    expect(s.reader.getChainId).toHaveBeenCalledOnce();
    expect(s.reader.getCode.mock.calls).toEqual(Object.values(config).map(entry => [{ address: entry.address }]));
  });
  it("rechaza otra red antes de consultar código", async () => {
    const s = setup(); s.reader.getChainId.mockResolvedValue(1);
    expect(await runContractCheck(s.deps)).toBe(1);
    expect(s.out).toEqual([]); expect(s.err).toEqual(["Error: el RPC debe responder con chainId 42220."]);
    expect(s.reader.getCode).not.toHaveBeenCalled();
  });
  it.each(Object.keys(config))("rechaza un hash distinto en %s conservando las seis filas", async name => {
    const s = setup(); const other = "0x6002" as Hex;
    s.reader.getCode.mockImplementation(async ({ address }) =>
      address === config[name]!.address ? other : code);
    expect(await runContractCheck(s.deps)).toBe(1);
    expect(s.out).toEqual([header, ...Object.keys(config).map(key =>
      row(key, keccak256(key === name ? other : code), key === name ? "NO COINCIDE" : "OK"))]);
    expect(s.err).toEqual([pending]);
    expect(s.reader.getCode).toHaveBeenCalledTimes(6);
  });
  it.each([undefined, "0x"])("rechaza ausencia de código (%s)", async missing => {
    const s = setup(); s.reader.getCode.mockResolvedValue(missing as Hex | undefined);
    expect(await runContractCheck(s.deps)).toBe(1);
    expect(s.out).toEqual([header, ...Object.keys(config).map(name => row(name, "sin código", "NO COINCIDE"))]);
    expect(s.err).toEqual([pending]);
  });
  it.each(DIRECCIONES_PROHIBIDAS)("rechaza configuración prohibida antes de consultar RPC (%s)", async address => {
    const s = setup(); s.deps.contracts = { ...config, safeL2: { ...config.safeL2!, address } };
    expect(await runContractCheck(s.deps)).toBe(1);
    expect(s.out).toEqual([]); expect(s.err).toEqual(["Error: la configuración contiene una dirección inválida o prohibida."]);
    expect(s.reader.getChainId).not.toHaveBeenCalled(); expect(s.reader.getCode).not.toHaveBeenCalled();
  });
  it("sanea errores de lectura sin imprimir URL, credenciales ni causa externa", async () => {
    const s = setup(); s.reader.getCode.mockRejectedValue(new Error("https://usuario:privado@rpc.invalid"));
    expect(await runContractCheck(s.deps)).toBe(1);
    expect(s.out).toEqual([header, ...Object.keys(config).map(name => row(name, "error de lectura", "ERROR"))]);
    expect(s.err).toEqual([pending]);
  });
  it("sanea error de chainId sin continuar", async () => {
    const s = setup(); s.reader.getChainId.mockRejectedValue(new Error("detalle externo"));
    expect(await runContractCheck(s.deps)).toBe(1);
    expect(s.out).toEqual([]); expect(s.err).toEqual(["Error: no se pudo consultar la red del RPC."]);
    expect(s.reader.getCode).not.toHaveBeenCalled();
  });
});
