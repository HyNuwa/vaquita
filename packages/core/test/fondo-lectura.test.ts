import { BaseError, RpcRequestError, createPublicClient, custom, encodeErrorResult, parseAbi, toHex } from "viem";
import { celo } from "viem/chains";
import { describe, expect, it, vi } from "vitest";
import type { CreationReader } from "../src/fondo/creacion.js";
import { createFondoReader, FondoReadError, type FondoReader } from "../src/fondo/lectura.js";

const address = "0x1111111111111111111111111111111111111111" as const;
const account = "0x2222222222222222222222222222222222222222" as const;
const hash = toHex(1n, { size: 32 });
const word = toHex(2n, { size: 32 });
const block = { number: 23n, hash, timestamp: 100n };
const log = { address, topics: [hash], data: "0x01" as const, blockNumber: 23n, blockHash: hash,
  transactionHash: word, transactionIndex: 0, logIndex: 1, removed: false };
const call = { to: address, data: "0x01" as const, blockNumber: 23n };
const override = [{ address, stateDiff: [{ slot: hash, value: word }] }];
const revert = encodeErrorResult({ abi: parseAbi(["error ConditionViolation(uint8 status, bytes32 info)"]),
  errorName: "ConditionViolation", args: [17, hash] });
function client() {
  return {
    ccipRead: false as const,
    getChainId: vi.fn().mockResolvedValue(42220), getBlockNumber: vi.fn().mockResolvedValue(23n),
    getCode: vi.fn().mockResolvedValue("0x6000"), getStorageAt: vi.fn().mockResolvedValue(word),
    getBlock: vi.fn().mockResolvedValue(block), getLogs: vi.fn().mockResolvedValue([log]),
    call: vi.fn().mockResolvedValue({ data: "0x01" }),
  };
}
function rpc(code: number, data?: unknown) {
  return new RpcRequestError({ body: { method: "eth_call" }, url: "https://provider-private.invalid/internal",
    error: { code, data, message: "provider-private diagnostic: execution reverted" } });
}
async function failure(action: Promise<unknown>, kind: string, data?: string) {
  const error = await action.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(FondoReadError);
  if (!(error instanceof FondoReadError)) throw new Error("Expected the public sanitized error");
  expect(error).toMatchObject({ kind, message: "No pudimos leer los datos del grupo." });
  expect(error.data).toBe(data);
  expect(error).not.toHaveProperty("cause");
  expect(error).not.toHaveProperty("url");
  expect(String(error) + JSON.stringify(error)).not.toContain("provider-private");
}

describe("offchain lookups", () => {
  it.each([
    ["omitted", undefined],
    ["custom", { request: async () => "0x" as const }],
  ])("refuses a client whose offchain lookup is %s, before any read", (_name, ccipRead) => {
    const c = { ...client(), ccipRead };
    let thrown: unknown;
    try { createFondoReader(c as Parameters<typeof createFondoReader>[0]); } catch (error) { thrown = error; }
    expect(thrown).toBeInstanceOf(FondoReadError);
    expect(thrown).toMatchObject({ kind: "invalid-request" });
    expect(c.call).not.toHaveBeenCalled();
    expect(c.getChainId).not.toHaveBeenCalled();
  });

  it("refuses a real client built with viem defaults", () => {
    const real = createPublicClient({ chain: celo, transport: custom({ request: vi.fn() }, { retryCount: 0 }) });
    expect(() => createFondoReader(real)).toThrow(FondoReadError);
  });

  it("keeps an OffchainLookup revert as bytes and never contacts its gateway", async () => {
    const lookup = encodeErrorResult({
      abi: parseAbi(["error OffchainLookup(address sender, string[] urls, bytes callData, bytes4 callbackFunction, bytes extraData)"]),
      errorName: "OffchainLookup",
      args: [address, ["https://gateway.invalid/{sender}/{data}.json"], "0x01", "0x12345678", "0x"],
    });
    const fetchSpy = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchSpy);
    try {
      const request = vi.fn(async () => { throw rpc(3, lookup); });
      const reader = createFondoReader(createPublicClient({ ccipRead: false, chain: celo, transport: custom({ request }, { retryCount: 0 }) }));
      await failure(reader.call(call), "revert", lookup);
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(request).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("injected fund reader", () => {
  it.each([
    ["getChainId", (r: FondoReader) => r.getChainId(), [], 42220],
    ["getBlockNumber", (r: FondoReader) => r.getBlockNumber(), [{ cacheTime: 0 }], 23n],
    ["getCode", (r: FondoReader) => r.getCode({ address, blockNumber: 23n }), [{ address, blockNumber: 23n }], "0x6000"],
    ["getStorageAt", (r: FondoReader) => r.getStorageAt({ address, slot: hash, blockNumber: 23n }), [{ address, slot: hash, blockNumber: 23n }], word],
    ["getBlock", (r: FondoReader) => r.getBlock({ blockNumber: 23n }), [{ blockNumber: 23n }], block],
    ["getLogs", (r: FondoReader) => r.getLogs({ address, fromBlock: 1n, toBlock: 23n }), [{ address, fromBlock: 1n, toBlock: 23n }], [log]],
    ["call", (r: FondoReader) => r.call(call), [call], { data: "0x01" }],
  ] as const)("forwards %s without implicit reads or retries", async (method, invoke, args, expected) => {
    const c = client(); const reader = createFondoReader(c);
    const compatible: CreationReader = reader;
    expect(compatible).toBe(reader);
    expect(Object.values(c).every((fn) => fn === false || fn.mock.calls.length === 0)).toBe(true);
    expect(await invoke(reader)).toEqual(expected);
    expect(c[method].mock.calls).toEqual([args]);
    expect(Object.values(c).reduce((sum, fn) => sum + (fn === false ? 0 : fn.mock.calls.length), 0)).toBe(1);
  });

  it("serializes only stateDiff through a real Celo public client, without network", async () => {
    const request = vi.fn().mockResolvedValue("0x01");
    const reader = createFondoReader(createPublicClient({ ccipRead: false, chain: celo, transport: custom({ request }, { retryCount: 0 }) }));
    expect(request).not.toHaveBeenCalled();
    const input = { ...call, account, value: 1n, stateOverride: override };
    expect(await reader.call(input)).toEqual({ data: "0x01" });
    expect(request.mock.calls).toEqual([[{ method: "eth_call", params: [
      { to: address, from: account, data: "0x01", value: "0x1" }, "0x17",
      { [address]: { stateDiff: { [hash]: word } } },
    ] }, undefined]]);
    expect(input.stateOverride).toEqual(override);
  });

  it("preserves empty results and removed logs for fail-closed callers", async () => {
    const c = client(); c.getCode.mockResolvedValue(undefined); c.getStorageAt.mockResolvedValue(undefined);
    c.call.mockResolvedValue({}); c.getLogs.mockResolvedValue([{ ...log, removed: true }]);
    const r = createFondoReader(c);
    expect(await r.getCode({ address, blockNumber: 23n })).toBeUndefined();
    expect(await r.getStorageAt({ address, slot: hash, blockNumber: 23n })).toBeUndefined();
    expect(await r.call(call)).toEqual({});
    expect((await r.getLogs({ address, fromBlock: 1n, toBlock: 23n }))[0]?.removed).toBe(true);
  });

  it("retains exact structured revert bytes through viem wrapping", async () => {
    const request = vi.fn().mockRejectedValue(rpc(3, revert));
    const reader = createFondoReader(createPublicClient({ ccipRead: false, chain: celo, transport: custom({ request }, { retryCount: 0 }) }));
    await failure(reader.call(call), "revert", revert);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it.each([
    [rpc(3), "revert", undefined], [rpc(3, "not-hex"), "invalid-response", undefined],
    [rpc(-32601), "unsupported", undefined], [rpc(-32602), "unsupported", undefined],
    [new BaseError("provider-private", { cause: rpc(3, revert) }), "revert", revert],
    [new Error("provider-private timeout execution reverted " + revert), "transport", undefined],
    [{ code: 3, data: revert, message: "provider-private" }, "transport", undefined],
    [rpc(-32000, revert), "transport", undefined],
  ] as const)("sanitizes failure %# without message-based proof", async (error, kind, data) => {
    const c = client(); c.call.mockRejectedValue(error);
    await failure(createFondoReader(c).call({ ...call, stateOverride: override }), kind, data);
    expect(c.call).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["getChainId", Number.NaN], ["getBlockNumber", -1n], ["getCode", "0x1"],
    ["getStorageAt", "0x01"], ["getBlock", { ...block, number: 24n }],
    ["getBlock", { ...block, hash: null }], ["getBlock", null], ["call", []], ["call", { data: "not-hex" }],
    ["getLogs", [{ ...log, blockNumber: null }]], ["getLogs", [{ ...log, blockHash: null }]],
    ["getLogs", [null]], ["getLogs", [{ ...log, logIndex: null }]], ["getLogs", [{ ...log, transactionHash: null }]],
    ["getLogs", [{ ...log, transactionIndex: -1 }]], ["getLogs", [{ ...log, blockNumber: 24n }]],
    ["getLogs", [{ ...log, address: account }]],
  ] as const)("rejects invalid %s response %# without retries", async (method, value) => {
    const c = client(); c[method].mockResolvedValue(value); const r = createFondoReader(c);
    const invoke = { getChainId: () => r.getChainId(), getBlockNumber: () => r.getBlockNumber(),
      getCode: () => r.getCode({ address, blockNumber: 23n }), getStorageAt: () => r.getStorageAt({ address, slot: hash, blockNumber: 23n }),
      getBlock: () => r.getBlock({ blockNumber: 23n }), call: () => r.call(call),
      getLogs: () => r.getLogs({ address, fromBlock: 1n, toBlock: 23n }) };
    await failure(invoke[method](), "invalid-response");
    expect(c[method]).toHaveBeenCalledTimes(1);
  });

  it.each([
    [{ address, stateDiff: [{ slot: "0x01", value: word }] }],
    [{ address, stateDiff: override[0]!.stateDiff, code: "0x6000" }],
    [{ address, stateDiff: override[0]!.stateDiff, state: {} }],
    [{ address, stateDiff: override[0]!.stateDiff, balance: 1n }],
    [{ address, stateDiff: override[0]!.stateDiff, nonce: 1 }],
  ])("rejects invalid or broader overrides before requesting RPC %#", async (entry) => {
    const c = client(); const stateOverride = [entry] as unknown as NonNullable<Parameters<FondoReader["call"]>[0]["stateOverride"]>;
    await failure(createFondoReader(c).call({ ...call, stateOverride }), "invalid-request");
    expect(c.call).not.toHaveBeenCalled();
  });
});
