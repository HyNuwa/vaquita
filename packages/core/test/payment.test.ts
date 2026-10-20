import { describe, expect, it, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { decodeFunctionData, erc20Abi, type Hex } from "viem";
import { parseTransaction } from "viem/celo";
import { fromDataSuffix } from "@celo/attribution-tags";
import { pay } from "../src/payments/pay.js";
import { MissingAttributionError } from "../src/attribution/tag.js";
import { JsonLedger } from "../src/policy/ledger.js";
import { POLICY } from "../src/config/policy.js";
import { FEE_CURRENCIES, WFIAT } from "../src/config/tokens.js";
import { MAMA, ONE, TEST_CODE, accountFrom, fakeReader, testConfig } from "./helpers.js";

function setup(over: { live?: boolean; reader?: Parameters<typeof fakeReader>[0] } = {}) {
  const config = testConfig({ live: over.live ?? false });
  const reader = fakeReader(over.reader);
  const ledger = new JsonLedger(join(mkdtempSync(join(tmpdir(), "pay-")), "l.json"), POLICY.timeZone, () => new Date("2026-10-17T15:00:00Z"));
  const deps = { config, reader, account: accountFrom(config), ledger, policy: POLICY };
  return { config, reader, ledger, deps };
}

const oneWars = { token: "wARS" as const, amount: "1", recipient: "mama", reason: "prueba" };

describe("pay() — modo ensayo (por defecto)", () => {
  it("firma la transacción completa pero NO la transmite", async () => {
    const { deps, reader } = setup();
    const r = await pay(deps, oneWars);
    expect(r.mode).toBe("dry-run");
    expect(r.status).toBe("simulated");
    expect(reader.sendRaw).not.toHaveBeenCalled();
    expect(r.signedTx).toMatch(/^0x7b/); // CIP-64
  });

  it("la tx firmada lleva: transfer correcto + tag al final + feeCurrency USDC + chainId 42220", async () => {
    const { deps } = setup();
    const r = await pay(deps, oneWars);
    const tx = parseTransaction(r.signedTx as Hex) as {
      to: string; data: Hex; chainId: number; feeCurrency: string; type: string; value?: bigint;
    };
    expect(tx.type).toBe("cip64");
    expect(tx.chainId).toBe(42220);
    expect(tx.to.toLowerCase()).toBe(WFIAT.wARS.address.toLowerCase());
    expect(tx.feeCurrency.toLowerCase()).toBe(FEE_CURRENCIES.USDC.feeCurrency.toLowerCase());
    expect(fromDataSuffix(tx.data)?.codes).toEqual([TEST_CODE]);
    const decoded = decodeFunctionData({ abi: erc20Abi, data: tx.data });
    expect(decoded.functionName).toBe("transfer");
    expect(decoded.args).toEqual([MAMA, 1n * ONE]);
  });

  it("estima el gas con el calldata YA taggeado y con feeCurrency", async () => {
    const { deps, reader } = setup();
    await pay(deps, oneWars);
    const arg = reader.estimateGas.mock.calls[0]![0] as { data: Hex; feeCurrency: string };
    expect(fromDataSuffix(arg.data)?.codes).toContain(TEST_CODE);
    expect(arg.feeCurrency).toBe(FEE_CURRENCIES.USDC.feeCurrency);
  });

  it("no consume presupuesto diario", async () => {
    const { deps, ledger } = setup();
    await pay(deps, oneWars);
    expect(ledger.today("wARS").spent).toBe(0n);
  });

  it("el mensaje al usuario habla en pesos, sin jerga cripto", async () => {
    const { deps } = setup();
    const r = await pay(deps, oneWars);
    expect(r.message.replace(/\s/g, " ")).toMatch(/\$ 1,00/);
    expect(r.message).toMatch(/ensayo/i);
    expect(r.message).not.toMatch(/wei|calldata|gwei|0x[0-9a-f]{40}/i);
  });
});

describe("pay() — barreras que frenan antes de firmar", () => {
  it("chainId distinto de 42220 → no firma", async () => {
    const { deps, reader } = setup({ reader: { chainId: async () => 11142220 } });
    await expect(pay(deps, oneWars)).rejects.toThrow(/42220/);
    expect(reader.estimateGas).not.toHaveBeenCalled();
  });

  it("política rechaza → ni siquiera consulta la red", async () => {
    const { deps, reader } = setup();
    const r = await pay(deps, { ...oneWars, amount: "999999" });
    expect(r.status).toBe("rejected");
    expect(reader.chainId).not.toHaveBeenCalled();
  });

  it("token on-chain no coincide con la tabla (decimals) → aborta", async () => {
    const { deps } = setup({ reader: { erc20Meta: async () => ({ symbol: "wARS", decimals: 6 }) } });
    await expect(pay(deps, oneWars)).rejects.toThrow(/decimal/i);
  });

  it("token on-chain no coincide con la tabla (symbol) → aborta", async () => {
    const { deps } = setup({ reader: { erc20Meta: async () => ({ symbol: "FAKE", decimals: 18 }) } });
    await expect(pay(deps, oneWars)).rejects.toThrow(/símbolo/i);
  });

  it("saldo insuficiente de pesos → rechaza con mensaje claro", async () => {
    const { deps, reader } = setup({ reader: { balanceOf: async (token: string) => (token === WFIAT.wARS.address ? 0n : 10n * ONE) } });
    const r = await pay(deps, oneWars);
    expect(r.status).toBe("rejected");
    expect(r.message).toMatch(/saldo/i);
    expect(reader.sendRaw).not.toHaveBeenCalled();
  });

  it("sin saldo para el costo de red → rechaza", async () => {
    const { deps } = setup({ reader: { balanceOf: async (token: string) => (token === WFIAT.wARS.address ? 10n * ONE : 0n) } });
    const r = await pay(deps, oneWars);
    expect(r.status).toBe("rejected");
    expect(r.message).toMatch(/costo de red/i);
  });

  it("gas por encima del tope de la política → rechaza", async () => {
    const { deps } = setup({ reader: { estimateGas: async () => 10_000_000_000n } });
    const r = await pay(deps, oneWars);
    expect(r.status).toBe("rejected");
    expect(r.message).toMatch(/costo de red/i);
  });

  it("si la tx firmada no tiene tag (bug en el firmante) → NO se manda", async () => {
    const { deps, reader } = setup({ live: true });
    // Firmante defectuoso: firma la tx pero le saca el sufijo de atribución
    const account = deps.account;
    const buggy = {
      ...account,
      signTransaction: vi.fn(async (tx: { data?: Hex }, opts?: unknown) =>
        account.signTransaction({ ...tx, data: tx.data!.slice(0, 2 + 68 * 2) as Hex } as never, opts as never),
      ),
    };
    await expect(pay({ ...deps, account: buggy as never }, oneWars)).rejects.toThrow(MissingAttributionError);
    expect(reader.sendRaw).not.toHaveBeenCalled();
  });
});

describe("pay() — modo real", () => {
  it("transmite, espera el recibo, verifica el tag on-chain y registra el gasto", async () => {
    const { deps, reader, ledger } = setup({ live: true });
    const r = await pay(deps, oneWars);
    expect(r.mode).toBe("live");
    expect(r.status).toBe("confirmed");
    expect(reader.sendRaw).toHaveBeenCalledOnce();
    expect(reader.verifyAttribution).toHaveBeenCalledWith(r.txHash);
    expect(r.attributionVerified).toBe(true);
    expect(ledger.today("wARS")).toEqual({ spent: ONE, count: 1 });
    expect(r.explorerUrl).toMatch(/^https:\/\/celoscan\.io\/tx\/0x/);
  });

  it("si la tx revierte, libera el presupuesto", async () => {
    const { deps, ledger } = setup({ live: true, reader: { waitForReceipt: async () => ({ status: "reverted" as const }) } });
    const r = await pay(deps, oneWars);
    expect(r.status).toBe("failed");
    expect(ledger.today("wARS").spent).toBe(0n);
  });

  it("si el envío falla por red, libera el presupuesto y propaga el error", async () => {
    const { deps, ledger } = setup({ live: true, reader: { sendRaw: async () => { throw new Error("rpc down"); } } });
    await expect(pay(deps, oneWars)).rejects.toThrow(/rpc down/);
    expect(ledger.today("wARS").spent).toBe(0n);
  });

  it("si el tag no aparece on-chain, lo marca (la plata ya se movió, no se reintenta)", async () => {
    const { deps } = setup({ live: true, reader: { verifyAttribution: async () => null } });
    const r = await pay(deps, oneWars);
    expect(r.status).toBe("confirmed");
    expect(r.attributionVerified).toBe(false);
  });
});
