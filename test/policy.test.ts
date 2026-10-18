import { describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { evaluatePayment, parseAllowlist } from "../src/policy/engine.js";
import { JsonLedger, dayKey } from "../src/policy/ledger.js";
import { POLICY } from "../src/config/policy.js";
import { ALQUILER, MAMA, ONE } from "./helpers.js";

const allowlist = new Map([
  ["mama", MAMA],
  ["alquiler", ALQUILER],
] as const);

const ctx = (spentToday = 0n, countToday = 0) => ({ policy: POLICY, allowlist, spentToday, countToday });

describe("evaluatePayment", () => {
  it("aprueba un pago chico a un destinatario permitido", () => {
    const r = evaluatePayment({ token: "wARS", amount: 1n * ONE, recipient: "mama" }, ctx());
    expect(r).toEqual({ ok: true, to: MAMA });
  });

  it("rechaza destinatarios fuera de la lista", () => {
    const r = evaluatePayment({ token: "wARS", amount: ONE, recipient: "desconocido" }, ctx());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("RECIPIENT_NOT_ALLOWED");
  });

  it("rechaza una dirección cruda aunque esté en la lista (el LLM solo usa alias)", () => {
    const r = evaluatePayment({ token: "wARS", amount: ONE, recipient: MAMA }, ctx());
    expect(r.ok).toBe(false);
  });

  it("rechaza montos por encima del tope por pago", () => {
    const r = evaluatePayment({ token: "wARS", amount: 5001n * ONE, recipient: "mama" }, ctx());
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe("OVER_PER_PAYMENT");
      expect(r.message).toMatch(/\$\s?5\.000/);
    }
  });

  it("acepta exactamente el tope por pago", () => {
    expect(evaluatePayment({ token: "wARS", amount: 5000n * ONE, recipient: "mama" }, ctx()).ok).toBe(true);
  });

  it("rechaza si se pasa del presupuesto diario", () => {
    const r = evaluatePayment({ token: "wARS", amount: 2000n * ONE, recipient: "mama" }, ctx(19_000n * ONE, 3));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("OVER_DAILY_BUDGET");
  });

  it("rechaza si se pasa de la cantidad de pagos por día", () => {
    const r = evaluatePayment({ token: "wARS", amount: ONE, recipient: "mama" }, ctx(0n, 20));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("TOO_MANY_PAYMENTS");
  });

  it("rechaza tokens sin límites configurados", () => {
    const r = evaluatePayment({ token: "wBRL", amount: ONE, recipient: "mama" }, ctx());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("TOKEN_NOT_ENABLED");
  });

  it("rechaza montos no positivos", () => {
    expect(evaluatePayment({ token: "wARS", amount: 0n, recipient: "mama" }, ctx()).ok).toBe(false);
  });

  it("la política está congelada: el agente no la puede modificar en runtime", () => {
    expect(() => {
      (POLICY.limits.wARS as { maxPerPayment: string }).maxPerPayment = "999999999";
    }).toThrow();
    expect(POLICY.limits.wARS?.maxPerPayment).toBe("5000");
  });
});

describe("parseAllowlist", () => {
  it("parsea alias:direccion", () => {
    const m = parseAllowlist(`mama:${MAMA}, alquiler:${ALQUILER}`);
    expect(m.get("mama")).toBe(MAMA);
    expect(m.size).toBe(2);
  });

  it.each([
    "mama",
    "mama:0x123",
    `mama:${MAMA},mama:${ALQUILER}`,
    "Mamá Querida:0x1111111111111111111111111111111111111111",
  ])("rechaza %j", (bad) => {
    expect(() => parseAllowlist(bad)).toThrow();
  });

  it("rechaza la dirección cero", () => {
    expect(() => parseAllowlist("x:0x0000000000000000000000000000000000000000")).toThrow();
  });
});

describe("JsonLedger", () => {
  const dir = () => mkdtempSync(join(tmpdir(), "ledger-"));

  it("el día se corta en hora de Buenos Aires, no UTC", () => {
    // 02:00 UTC del 18/10 = 23:00 del 17/10 en Buenos Aires
    expect(dayKey(new Date("2026-10-18T02:00:00Z"), "America/Argentina/Buenos_Aires")).toBe("2026-10-17");
  });

  it("suma reservas pendientes y confirmadas, libera las fallidas", () => {
    const now = new Date("2026-10-17T15:00:00Z");
    const l = new JsonLedger(join(dir(), "l.json"), POLICY.timeZone, () => now);
    const a = l.reserve({ token: "wARS", amount: 100n * ONE, to: MAMA });
    l.reserve({ token: "wARS", amount: 50n * ONE, to: MAMA });
    expect(l.today("wARS")).toEqual({ spent: 150n * ONE, count: 2 });
    l.settle(a, { status: "failed" });
    expect(l.today("wARS")).toEqual({ spent: 50n * ONE, count: 1 });
  });

  it("persiste en disco entre reinicios", () => {
    const now = new Date("2026-10-17T15:00:00Z");
    const file = join(dir(), "l.json");
    new JsonLedger(file, POLICY.timeZone, () => now).reserve({ token: "wARS", amount: 7n * ONE, to: MAMA });
    expect(new JsonLedger(file, POLICY.timeZone, () => now).today("wARS").spent).toBe(7n * ONE);
  });

  it("no cuenta gastos de otro día", () => {
    const file = join(dir(), "l.json");
    new JsonLedger(file, POLICY.timeZone, () => new Date("2026-10-16T15:00:00Z")).reserve({ token: "wARS", amount: 7n * ONE, to: MAMA });
    expect(new JsonLedger(file, POLICY.timeZone, () => new Date("2026-10-17T15:00:00Z")).today("wARS").spent).toBe(0n);
  });
});
