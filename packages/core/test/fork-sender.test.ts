import { createServer } from "node:http";
import { describe, expect, it, vi } from "vitest";
import { keccak256, parseTransaction, recoverTransactionAddress, type Hex, type TransactionSerializedLegacy } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { appendTag, hasTag } from "../src/attribution/tag.js";
import { MAMA, TEST_CODE } from "./helpers.js";

function setup(rpcUrl = "http://127.0.0.1:8545") {
  const account = privateKeyToAccount(generatePrivateKey());
  const sign = vi.spyOn(account, "signTransaction");
  const requests: { url: string; method: string; params: unknown[] }[] = [];
  const fetchFn = vi.fn<typeof fetch>(async (input, init) => {
    expect(init?.redirect).toBe("error");
    const body = JSON.parse(String(init?.body));
    requests.push({ url: String(input), method: body.method, params: body.params });
    const results: Record<string, unknown> = {
      eth_chainId: "0xa4ec", eth_estimateGas: "0x186a0", eth_gasPrice: "0x2",
      eth_getTransactionCount: "0x7",
    };
    if (body.method === ["eth_send", "RawTransaction"].join("")) {
      results[body.method] = keccak256(body.params[0]);
    }
    if (body.method === "eth_getTransactionReceipt") {
      results[body.method] = { status: "0x1", transactionHash: body.params[0], logs: [] };
    }
    return Response.json({ jsonrpc: "2.0", id: body.id, result: results[body.method] });
  });
  return { deps: { rpcUrl, account, attributionCode: TEST_CODE, fetchFn }, sign, fetchFn, requests };
}

const invalidUrls = [
  "https://forno.celo.org", "http://localhost.evil.test", "http://evil.localhost",
  "http://127.0.0.1.evil.test", "http://localhost@evil.test", "http://evil@localhost",
  "http://user:password@127.0.0.1", "ws://localhost:8545", "file:///localhost",
  "not a URL", "http://[::1]:8545", "http://127.1", "http://2130706433",
  "http://0x7f000001", "http://localhost.", "http://localhost\\@evil.test",
  " http://localhost", "http://localhost/#https://evil.test", "http://localhost?url=https://evil.test",
];

describe("fork-sender: aislamiento local", () => {
  it.each(invalidUrls)("rechaza %s antes de firmar o consultar", async (url) => {
    const s = setup(url);
    const { forkSender } = await import("../src/chain/fork-sender.js");
    expect(() => forkSender(s.deps)).toThrow("El fork requiere un RPC HTTP local sin credenciales, consulta ni fragmento.");
    expect(s.sign).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });

  it.each(["http://localhost:8545", "https://127.0.0.1:8545/rpc"])("firma una transacción común etiquetada en %s", async (url) => {
    const s = setup(url);
    const { forkSender } = await import("../src/chain/fork-sender.js");
    const sender = forkSender(s.deps);
    const r = await sender.prepare({ to: MAMA, data: "0x1234" });
    if (!r.ok) throw new Error(r.reason);
    const tx = parseTransaction(r.signedTx);
    expect(tx).toMatchObject({ type: "legacy", chainId: 42220, to: MAMA, nonce: 7, gasPrice: 2n });
    expect(tx.value ?? 0n).toBe(0n);
    expect("feeCurrency" in tx).toBe(false);
    expect(tx.data).toBe(appendTag("0x1234", TEST_CODE));
    expect(hasTag(tx.data, TEST_CODE)).toBe(true);
    expect(await recoverTransactionAddress({ serializedTransaction: r.signedTx as TransactionSerializedLegacy })).toBe(s.deps.account.address);
    expect(r.txHash).toBe(keccak256(r.signedTx));
    expect(s.sign).toHaveBeenCalledTimes(1);
    expect(s.requests.every((request) => new URL(request.url).href === new URL(url).href)).toBe(true);
    const estimate = s.requests.find((request) => request.method === "eth_estimateGas")!;
    expect(estimate.params[0]).toMatchObject({ to: MAMA, data: tx.data });
    expect(estimate.params[0]).not.toHaveProperty("feeCurrency");
    expect(await sender.broadcast(r.signedTx)).toEqual({ txHash: r.txHash, status: "success", attributionCodes: null });
  });

  it("conserva despliegues explícitos y no duplica la etiqueta", async () => {
    const s = setup();
    const { forkSender } = await import("../src/chain/fork-sender.js");
    const sender = forkSender(s.deps);
    const data = appendTag("0x6080", TEST_CODE);
    const r = await sender.prepare({ deploy: true, data });
    if (!r.ok) throw new Error(r.reason);
    expect(parseTransaction(r.signedTx).to).toBeFalsy();
    expect(parseTransaction(r.signedTx).data).toBe(data);
  });

  it("rechaza destinos ambiguos antes de cualquier efecto", async () => {
    const s = setup();
    const { forkSender } = await import("../src/chain/fork-sender.js");
    const sender = forkSender(s.deps);
    for (const call of [{ data: "0x" }, { to: MAMA, deploy: true, data: "0x" }]) {
      await expect(sender.prepare(call as never)).rejects.toThrow("destino");
    }
    await expect(sender.broadcast("0x" as Hex)).rejects.toThrow();
    expect(s.sign).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });

  it("rechaza otra red antes de firmar", async () => {
    const s = setup();
    s.fetchFn.mockImplementation(async () => Response.json({ jsonrpc: "2.0", id: 1, result: "0x1" }));
    const { forkSender } = await import("../src/chain/fork-sender.js");
    await expect(forkSender(s.deps).prepare({ to: MAMA, data: "0x" })).rejects.toThrow("42220");
    expect(s.sign).not.toHaveBeenCalled();
    expect(s.fetchFn).toHaveBeenCalledTimes(1);
  });

  it("no sigue redirecciones del RPC local", async () => {
    let hits = 0;
    const server = createServer((_req, res) => {
      hits++;
      res.writeHead(302, { Location: "https://example.invalid" });
      res.end();
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const addr = server.address();
      if (!addr || typeof addr === "string") throw new Error("Puerto no disponible");
      const s = setup(`http://127.0.0.1:${addr.port}`);
      const { forkSender } = await import("../src/chain/fork-sender.js");
      const { fetchFn: _fake, ...deps } = s.deps;
      await expect(forkSender(deps).prepare({ to: MAMA, data: "0x" })).rejects.toThrow();
      expect(hits).toBe(1);
      expect(s.sign).not.toHaveBeenCalled();
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
