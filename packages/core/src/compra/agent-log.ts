import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";
import type { LoopAction, SkipCode } from "./loop.js";

/**
 * Bitácora pública del agente (D13.2): qué hizo, qué decidió no hacer y por qué.
 *
 * Se publica, así que no hay campos de texto libre: solo códigos, números y hashes. Sin
 * alias de compradores, direcciones, ni nada que venga de un proveedor o del LLM. La web
 * arma el texto desde el código (`SKIP_TEXT`).
 */

const ACTIONS = [
  "REMIND_SUPPLIER",
  "PUBLISH_COMPARISON",
  "NOTIFY_SHORTFALL",
  "NOTIFY_BUYER_FUNDS",
  "EXECUTE",
  "NOTIFY_EXECUTION_STOPPED",
  "NOTIFY_NO_GAS_BUDGET",
  "NOTIFY_EXPIRED",
  "REQUEST_DELIVERY",
] as const satisfies readonly LoopAction["type"][];

const SKIP_CODES = [
  "STATE_INCONSISTENT",
  "READ_FAILED",
  "BELOW_MINIMUM",
  "OVER_MAXIMUM",
  "WAITING_FINAL_WINDOW",
  "ATTEMPTS_EXHAUSTED",
  "NO_GAS_BUDGET",
] as const satisfies readonly SkipCode[];

/** Un hash real no empieza con 24 ceros: eso es una dirección rellenada a 32 bytes. */
const TX_HASH = /^0x(?!0{24})[0-9a-f]{64}$/;

const entrySchema = z
  .object({
    at: z.iso.datetime(),
    // Un slug, nunca algo con forma de dirección, con o sin prefijo.
    campaignId: z.string().regex(/^(?!0x)(?![0-9a-f]{40}$)[a-z0-9][a-z0-9-]{0,63}$/),
    action: z.enum(ACTIONS),
    outcome: z.enum(["DONE", "SKIPPED", "FAILED", "DRY_RUN"]),
    skipCode: z.enum(SKIP_CODES).optional(),
    /** Unidades ejecutadas o faltantes. */
    units: z.number().int().nonnegative().optional(),
    txHash: z.string().regex(TX_HASH).optional(),
  })
  .strict();

export type AgentLogEntry = z.infer<typeof entrySchema>;

export class AgentLogError extends Error {
  override name = "AgentLogError";
}

export class AgentLog {
  constructor(private readonly file: string) {}

  append(entry: AgentLogEntry): void {
    const parsed = entrySchema.safeParse(entry);
    if (!parsed.success) throw new AgentLogError("Entrada de bitácora inválida: la bitácora es pública.");
    mkdirSync(dirname(this.file), { recursive: true });
    appendFileSync(this.file, `${JSON.stringify(parsed.data)}\n`);
  }

  read(campaignId: string): AgentLogEntry[] {
    if (!existsSync(this.file)) return [];
    return readFileSync(this.file, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => entrySchema.parse(JSON.parse(line)))
      .filter((entry) => entry.campaignId === campaignId);
  }
}
