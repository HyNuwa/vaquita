import type { Address } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { WFIAT } from "../src/config/tokens.js";
import type { FondoReader } from "../src/fondo/lectura.js";
import { exportarManifiesto, importarManifiesto, revalidarManifiesto, type DatosManifiesto } from "../src/fondo/manifiesto.js";
import { creationSalt, predictRolesAddress } from "../src/fondo/safe.js";
import { verificarGrupo } from "../src/fondo/verificar.js";

vi.mock("../src/fondo/verificar.js", () => ({ verificarGrupo: vi.fn(async () => ({ ok: false, controles: [] })) }));

const safe = "0x1111111111111111111111111111111111111111" as Address;
const wallet = "0x3333333333333333333333333333333333333333" as Address;
const other = "0x9999999999999999999999999999999999999999" as Address;
const grupoId = "grupo-tecnico-1";
const roles = predictRolesAddress(grupoId, safe);
const datos: DatosManifiesto = { grupoId, safe, roles, walletOperativa: wallet, bloqueDespliegue: 123n, transacciones: [`0x${"ab".repeat(32)}`] };
const parsed = () => JSON.parse(exportarManifiesto(datos)) as Record<string, unknown>;
const importar = (cambio: (m: Record<string, unknown>) => void) => { const m = parsed(); cambio(m); return importarManifiesto(JSON.stringify(m)); };

beforeEach(() => { vi.mocked(verificarGrupo).mockClear(); });

describe("exportarManifiesto", () => {
  it("emite sólo campos públicos y referencias del core", () => {
    expect(parsed()).toEqual({ version: 1, chainId: 42220, grupoId, safe, roles, wARS: WFIAT.wARS.address, walletOperativa: wallet,
      contratos: Object.fromEntries(Object.entries(contratosFondo(42220)).map(([n, c]) => [n, c.address])),
      saltNonce: creationSalt(grupoId).toString(), bloqueDespliegue: "123", transacciones: datos.transacciones });
  });
  it("ida y vuelta", () => {
    const result = importarManifiesto(exportarManifiesto(datos));
    expect(result).toMatchObject({ ok: true, manifiesto: { safe, roles, grupoId } });
  });
});

describe("importarManifiesto", () => {
  it.each([
    ["no es JSON", "{"], ["no es objeto", "[]"], ["es nulo", "null"], ["es enorme", `"${"x".repeat(70_000)}"`],
  ])("rechaza un archivo que %s", (_n, text) => { expect(importarManifiesto(text).ok).toBe(false); });

  it.each([
    ["otra red", (m) => { m.chainId = 1; }],
    ["otra versión", (m) => { m.version = 2; }],
    ["otro token", (m) => { m.wARS = other; }],
    ["otra referencia", (m) => { (m.contratos as Record<string, string>).safeL2 = other; }],
    ["una referencia de menos", (m) => { delete (m.contratos as Record<string, string>).safeL2; }],
    ["una referencia de más", (m) => { (m.contratos as Record<string, string>).extra = other; }],
    ["otro módulo", (m) => { m.roles = other; }],
    ["un fondo que no deriva en ese módulo", (m) => { m.safe = other; }],
    ["otro salt", (m) => { m.saltNonce = "1"; }],
    ["campo privado adicional", (m) => { m.telegram = "x"; }],
    ["campo faltante", (m) => { delete m.walletOperativa; }],
    ["wallet inválida", (m) => { m.walletOperativa = "0x12"; }],
    ["bloque no decimal", (m) => { m.bloqueDespliegue = "0x10"; }],
    ["bloque numérico", (m) => { m.bloqueDespliegue = 10; }],
    ["hash inválido", (m) => { m.transacciones = ["0x12"]; }],
    ["transacciones que no son lista", (m) => { m.transacciones = "x"; }],
    ["grupo vacío", (m) => { m.grupoId = ""; }],
  ] as [string, (m: Record<string, unknown>) => void][])("rechaza %s", (_n, cambio) => {
    const result = importar(cambio);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.motivo).not.toMatch(/0x/);
  });
});

describe("revalidarManifiesto", () => {
  const duenos = [other, wallet, safe] as readonly Address[];
  const destinatarios = [other] as readonly Address[];
  const reader = {} as FondoReader;
  it("delega en verificarGrupo con responsables externos, nunca del archivo", async () => {
    const result = importarManifiesto(exportarManifiesto(datos));
    if (!result.ok) throw new Error(result.motivo);
    const veredicto = await revalidarManifiesto(reader, result.manifiesto, { duenos, destinatarios });
    expect(veredicto).toEqual({ ok: false, controles: [] });
    expect(verificarGrupo).toHaveBeenCalledExactlyOnceWith(reader, {
      chainId: 42220, safe, roles, bloqueInicio: 123n, esperado: { duenos, walletOperativa: wallet, destinatarios } });
  });
  it("el manifiesto no aporta dueños propios", () => {
    expect(Object.keys(parsed())).not.toContain("duenos");
  });
});
