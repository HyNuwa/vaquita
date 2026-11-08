import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { parseTransaction } from "viem/celo";
import { POLICY } from "../src/config/policy.js";
import { fakeReader, MAMA, TEST_CODE, testConfig } from "./helpers.js";

function setup() {
  const account = privateKeyToAccount(generatePrivateKey());
  const sign = vi.spyOn(account, "signTransaction");
  const fetchFn = vi.fn<typeof fetch>();
  const fork = { rpcUrl: "http://localhost:8545", attributionCode: TEST_CODE, account, fetchFn };
  const normal = { config: testConfig(), reader: fakeReader(), account, policy: POLICY };
  return { fork, normal, sign, fetchFn };
}

describe("enviador: selección explícita", () => {
  it.each([undefined, "", "0", "true"])("rechaza fork con E2E_FORK=%s", async (flag) => {
    const s = setup();
    const { enviador } = await import("../src/fondo/enviador.js");
    expect(() => enviador({ mode: "fork", env: { E2E_FORK: flag }, deps: s.fork })).toThrow("El fork requiere E2E_FORK=1 y LIVE_PAYMENTS ausente.");
    expect(s.sign).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });

  it.each(["", "no", "si-muevo-plata-real", undefined])("rechaza LIVE_PAYMENTS presente (%s)", async (live) => {
    const s = setup();
    const { enviador } = await import("../src/fondo/enviador.js");
    expect(() => enviador({ mode: "fork", env: { E2E_FORK: "1", LIVE_PAYMENTS: live }, deps: s.fork })).toThrow("El fork requiere E2E_FORK=1 y LIVE_PAYMENTS ausente.");
    expect(s.sign).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });

  it("rechaza un RPC público aunque la bandera sea correcta", async () => {
    const s = setup();
    const { enviador } = await import("../src/fondo/enviador.js");
    expect(() => enviador({ mode: "fork", env: { E2E_FORK: "1" }, deps: { ...s.fork, rpcUrl: "https://forno.celo.org" } })).toThrow("RPC HTTP local");
    expect(s.sign).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });

  it("habilita fork solo con bandera, RPC local y ausencia total de LIVE_PAYMENTS", async () => {
    const s = setup();
    const { enviador } = await import("../src/fondo/enviador.js");
    const sender = enviador({ mode: "fork", env: { E2E_FORK: "1" }, deps: s.fork });
    expect(sender.prepare).toBeTypeOf("function");
    expect(sender.broadcast).toBeTypeOf("function");
    expect(s.sign).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });

  it.each([false, true])("por defecto conserva tagged-sender y su modo live=%s", async (live) => {
    const s = setup();
    s.normal.config.live = live;
    const { enviador } = await import("../src/fondo/enviador.js");
    const sender = enviador({ deps: s.normal });
    const r = await sender.prepare({ to: MAMA, data: "0x1234" });
    if (!r.ok) throw new Error(r.reason);
    expect(parseTransaction(r.signedTx)).toMatchObject({ type: "cip64", chainId: 42220, to: MAMA, feeCurrency: s.normal.config.feeCurrency.feeCurrency.toLowerCase() });
    expect(s.normal.reader.estimateGas).toHaveBeenCalledOnce();
    if (live) {
      expect(await sender.broadcast(r.signedTx)).toMatchObject({ status: "success", attributionCodes: [TEST_CODE] });
      expect(s.normal.reader.sendRaw).toHaveBeenCalledWith(r.signedTx);
    } else {
      await expect(sender.broadcast(r.signedTx)).rejects.toThrow("modo ensayo");
      expect(s.normal.reader.sendRaw).not.toHaveBeenCalled();
    }
    expect(s.fetchFn).not.toHaveBeenCalled();
  });
});

// Incluye configuraciones: un alias también puede apuntar al módulo prohibido.
async function appReferences(dir: string): Promise<string[]> {
  const found: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || ["node_modules", ".next", "dist", "coverage", ".git"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await appReferences(path));
    else if (/\.(?:[cm]?[jt]sx?|json)$/.test(entry.name) && /fork-sender/.test(await readFile(path, "utf8"))) found.push(path);
  }
  return found;
}

it("apps/ no importa fork-sender por ruta relativa, subpath ni alias", async () => {
  expect(await appReferences(fileURLToPath(new URL("../../../apps/", import.meta.url)))).toEqual([]);
});
