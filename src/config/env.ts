import { z } from "zod";
import type { Hex, Address } from "viem";
import { codeFromRepo } from "@celo/attribution-tags";
import { assertValidCode } from "../attribution/tag.js";
import { parseAllowlist } from "../policy/engine.js";
import { CELO_MAINNET } from "./network.js";
import { FEE_CURRENCIES, type FeeCurrency, type FeeCurrencySymbol } from "./tokens.js";

/** Única frase que activa pagos reales. Cualquier otro valor = modo ensayo. */
export const LIVE_PHRASE = "si-muevo-plata-real";

export interface AppConfig {
  live: boolean;
  attributionCode: string;
  privateKey: Hex;
  rpcUrl: string;
  feeCurrency: FeeCurrency;
  allowlist: ReadonlyMap<string, Address>;
  agentUri: string | undefined;
  githubRepo: string | undefined;
}

const schema = z.object({
  AGENT_PRIVATE_KEY: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "AGENT_PRIVATE_KEY debe ser 0x + 64 hex"),
  ATTRIBUTION_CODE: z.string({ error: "Falta ATTRIBUTION_CODE: sin tag no se firma ninguna transacción" }),
  CELO_RPC_URL: z.string().url().startsWith("https://", "CELO_RPC_URL debe ser https").default(CELO_MAINNET.defaultRpcUrl),
  FEE_CURRENCY: z.enum(Object.keys(FEE_CURRENCIES) as [FeeCurrencySymbol, ...FeeCurrencySymbol[]]).default("USDC"),
  ALLOWED_RECIPIENTS: z.string().default(""),
  LIVE_PAYMENTS: z.string().optional(),
  AGENT_URI: z.string().optional(),
  GITHUB_REPO: z.string().optional(),
});

export function loadConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  const clean = Object.fromEntries(Object.entries(env).filter(([, v]) => v !== undefined && v !== ""));
  const parsed = schema.safeParse(clean);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Configuración inválida → ${msg}`);
  }
  const e = parsed.data;
  const live = e.LIVE_PAYMENTS === LIVE_PHRASE;

  assertValidCode(e.ATTRIBUTION_CODE, { live });

  return Object.freeze({
    live,
    attributionCode: e.ATTRIBUTION_CODE,
    privateKey: e.AGENT_PRIVATE_KEY as Hex,
    rpcUrl: e.CELO_RPC_URL,
    feeCurrency: FEE_CURRENCIES[e.FEE_CURRENCY],
    allowlist: parseAllowlist(e.ALLOWED_RECIPIENTS),
    agentUri: e.AGENT_URI,
    githubRepo: e.GITHUB_REPO,
  });
}

/** Aviso (no bloqueo) si el código no coincide con el derivado del repo. */
export function repoCodeWarning(cfg: Pick<AppConfig, "attributionCode" | "githubRepo">): string | null {
  if (!cfg.githubRepo) return null;
  const derived = codeFromRepo(cfg.githubRepo);
  return derived === cfg.attributionCode
    ? null
    : `Atención: codeFromRepo("${cfg.githubRepo}") = ${derived}, distinto de ATTRIBUTION_CODE (${cfg.attributionCode}). ` +
        "Si Loops House te dio otro código, usá ese; si no, revisá que no sea un código viejo.";
}
