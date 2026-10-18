import { vi } from "vitest";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { Hex } from "viem";
import type { ChainReader } from "../src/chain/reader.js";
import type { AppConfig } from "../src/config/env.js";
import { FEE_CURRENCIES, WFIAT } from "../src/config/tokens.js";

export const TEST_CODE = "celo_ab12cd34";
export const MAMA = "0x1111111111111111111111111111111111111111" as const;
export const ALQUILER = "0x2222222222222222222222222222222222222222" as const;

export const ONE = 10n ** 18n;

export function testConfig(over: Partial<AppConfig> = {}): AppConfig {
  return {
    live: false,
    attributionCode: TEST_CODE,
    privateKey: generatePrivateKey(),
    rpcUrl: "https://forno.celo.org",
    feeCurrency: FEE_CURRENCIES.USDC,
    allowlist: new Map([
      ["mama", MAMA],
      ["alquiler", ALQUILER],
    ]),
    agentUri: undefined,
    githubRepo: undefined,
    ...over,
  };
}

/** RPC falso: mainnet sano, con saldo de sobra. Cada test pisa lo que necesita. */
export function fakeReader(over: Partial<ChainReader> = {}): ChainReader & {
  [K in keyof ChainReader]: ReturnType<typeof vi.fn>;
} {
  const base: ChainReader = {
    chainId: async () => 42220,
    erc20Meta: async (token) =>
      token.toLowerCase() === WFIAT.wARS.address.toLowerCase()
        ? { symbol: "wARS", decimals: 18 }
        : { symbol: "USDC", decimals: 6 },
    balanceOf: async () => 1_000_000n * ONE,
    nonce: async () => 7,
    estimateGas: async () => 60_000n,
    feesPerGas: async () => ({ maxFeePerGas: 30_000_000_000n, maxPriorityFeePerGas: 1_000_000_000n }),
    sendRaw: async () => ("0x" + "ab".repeat(32)) as Hex,
    waitForReceipt: async () => ({ status: "success" as const }),
    verifyAttribution: async () => [TEST_CODE],
  };
  const merged = { ...base, ...over };
  const out: Record<string, unknown> = {};
  for (const [k, fn] of Object.entries(merged)) out[k] = vi.fn(fn as (...a: unknown[]) => unknown);
  return out as never;
}

export function accountFrom(cfg: AppConfig) {
  return privateKeyToAccount(cfg.privateKey);
}
