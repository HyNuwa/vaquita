import { getAddress, isAddress, zeroAddress, type Address } from "viem";
import type { Policy } from "../config/policy.js";
import { WFIAT, type WFiatSymbol } from "../config/tokens.js";
import { formatLocal, limitToUnits } from "../money/amounts.js";

/**
 * Motor de políticas: funciones puras, sin I/O, sin LLM.
 * Recibe una PROPUESTA del agente y devuelve aprobada (con la dirección resuelta) o
 * rechazada (con un mensaje que entiende alguien que nunca usó cripto).
 */

export type Allowlist = ReadonlyMap<string, Address>;

export interface PaymentProposal {
  token: WFiatSymbol;
  amount: bigint;
  /** Alias de la allowlist. Nunca una dirección. */
  recipient: string;
}

export interface PolicyContext {
  policy: Readonly<Policy>;
  allowlist: Allowlist;
  spentToday: bigint;
  countToday: number;
}

export type RejectionCode =
  | "TOKEN_NOT_ENABLED"
  | "RECIPIENT_NOT_ALLOWED"
  | "NON_POSITIVE"
  | "OVER_PER_PAYMENT"
  | "OVER_DAILY_BUDGET"
  | "TOO_MANY_PAYMENTS";

export type PolicyDecision =
  | { ok: true; to: Address }
  | { ok: false; code: RejectionCode; message: string };

const reject = (code: RejectionCode, message: string): PolicyDecision => ({ ok: false, code, message });

export function evaluatePayment(p: PaymentProposal, ctx: PolicyContext): PolicyDecision {
  const limits = ctx.policy.limits[p.token];
  const token = WFIAT[p.token];
  if (!limits || !token) return reject("TOKEN_NOT_ENABLED", "Esta moneda todavía no está habilitada para pagos.");

  const to = ctx.allowlist.get(p.recipient);
  if (!to) {
    return reject("RECIPIENT_NOT_ALLOWED", `"${p.recipient}" no está en tu lista de destinatarios. Agregalo primero.`);
  }

  if (p.amount <= 0n) return reject("NON_POSITIVE", "El monto tiene que ser mayor a cero.");

  const max = limitToUnits(limits.maxPerPayment);
  if (p.amount > max) {
    return reject("OVER_PER_PAYMENT", `El máximo por pago es ${formatLocal(max, token)}.`);
  }

  if (ctx.countToday >= limits.maxPaymentsPerDay) {
    return reject("TOO_MANY_PAYMENTS", `Ya hiciste ${ctx.countToday} pagos hoy, que es el máximo diario.`);
  }

  const budget = limitToUnits(limits.dailyBudget);
  if (ctx.spentToday + p.amount > budget) {
    const left = budget > ctx.spentToday ? budget - ctx.spentToday : 0n;
    return reject(
      "OVER_DAILY_BUDGET",
      `Superás tu presupuesto de hoy (${formatLocal(budget, token)}). Te quedan ${formatLocal(left, token)}.`,
    );
  }

  return { ok: true, to };
}

const ALIAS_RE = /^[a-z0-9_-]{1,32}$/;

/** "mama:0xabc...,alquiler:0xdef..." → Map. Estricto: cualquier error aborta el arranque. */
export function parseAllowlist(raw: string): Allowlist {
  const out = new Map<string, Address>();
  for (const entry of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    const [alias, addr, ...rest] = entry.split(":");
    if (!alias || !addr || rest.length) throw new Error(`ALLOWED_RECIPIENTS: entrada inválida "${entry}" (usá alias:0x…).`);
    if (!ALIAS_RE.test(alias)) throw new Error(`ALLOWED_RECIPIENTS: alias "${alias}" inválido (minúsculas, números, - o _).`);
    if (!isAddress(addr)) throw new Error(`ALLOWED_RECIPIENTS: dirección inválida para "${alias}".`);
    const a = getAddress(addr);
    if (a === zeroAddress) throw new Error(`ALLOWED_RECIPIENTS: "${alias}" apunta a la dirección cero.`);
    if (out.has(alias)) throw new Error(`ALLOWED_RECIPIENTS: alias duplicado "${alias}".`);
    out.set(alias, a);
  }
  return out;
}
