import { describe, expect, it } from "vitest";
import type { Hex } from "viem";
import { turnCommitments } from "../src/junta/commitments.js";
import { buildObligations, ObligationBook, obligationId, type PaymentEvent } from "../src/junta/obligations.js";
import { type JuntaRules, JuntaRulesError, validateRules } from "../src/junta/rules.js";
import { parseLocalAmount } from "../src/money/amounts.js";

const DAY = 86_400;
const T0 = Date.UTC(2026, 10, 2) / 1000; // lunes 2/11/2026, 00:00 UTC
const A = parseLocalAmount("20000");

/** La junta del plan: 6 personas, $20.000 por semana, 1 día de gracia. */
const rules: JuntaRules = {
  id: "j1",
  members: ["rosa", "marta", "juan", "ana", "bruno", "luz"],
  amount: A,
  startsAt: T0,
  periodSeconds: 7 * DAY,
  graceSeconds: DAY,
};

let n = 0;
const tx = (): Hex => `0x${(++n).toString(16).padStart(64, "0")}`;

function pay(p: Partial<PaymentEvent> & Pick<PaymentEvent, "round" | "debtor">): PaymentEvent {
  const creditor = rules.members[p.round - 1]!;
  return { juntaId: "j1", creditor, amount: A, paidAt: T0 + (p.round - 1) * 7 * DAY, txHash: tx(), logIndex: 0, ...p };
}

describe("validateRules", () => {
  it("acepta la junta del plan", () => {
    expect(() => validateRules(rules)).not.toThrow();
  });

  it.each<[string, Partial<JuntaRules>]>([
    ["un solo miembro", { members: ["rosa"] }],
    ["miembros repetidos", { members: ["rosa", "juan", "rosa"] }],
    ["aporte en cero", { amount: 0n }],
    ["período en cero", { periodSeconds: 0 }],
    ["gracia negativa", { graceSeconds: -1 }],
    ["período con decimales", { periodSeconds: 1.5 }],
  ])("rechaza %s", (_, bad) => {
    expect(() => validateRules({ ...rules, ...bad })).toThrow(JuntaRulesError);
  });

  it("no tiene un máximo de miembros (decisión A6)", () => {
    const members = Array.from({ length: 40 }, (_, i) => `m${i}`);
    expect(() => validateRules({ ...rules, members })).not.toThrow();
  });
});

describe("turnCommitments", () => {
  it("reproduce la tabla del plan: aportado antes y adeudado después de cobrar", () => {
    const rows = turnCommitments(rules).map((r) => [r.advancedBeforeCollecting / 10n ** 18n, r.owedAfterCollecting / 10n ** 18n]);
    expect(rows).toEqual([
      [0n, 100_000n],
      [20_000n, 80_000n],
      [40_000n, 60_000n],
      [60_000n, 40_000n],
      [80_000n, 20_000n],
      [100_000n, 0n],
    ]);
  });

  it("cada turno recibe un aporte de cada uno de los otros, y aporta lo mismo que recibe", () => {
    for (const r of turnCommitments(rules)) {
      expect(r.receives).toBe(5n * A);
      expect(r.advancedBeforeCollecting + r.owedAfterCollecting).toBe(r.receives);
    }
  });
});

describe("buildObligations", () => {
  const all = buildObligations(rules);

  it("N·(N−1) obligaciones: nadie se paga a sí mismo", () => {
    expect(all).toHaveLength(30);
    expect(all.every((o) => o.debtor !== o.creditor)).toBe(true);
  });

  it("cada ronda le paga a quien tiene ese turno, con vencimiento = apertura + gracia", () => {
    const r3 = all.filter((o) => o.round === 3);
    expect(new Set(r3.map((o) => o.creditor))).toEqual(new Set(["juan"]));
    expect(r3[0]!.opensAt).toBe(T0 + 14 * DAY);
    expect(r3[0]!.dueAt).toBe(T0 + 15 * DAY);
  });

  it("los ids son únicos", () => {
    expect(new Set(all.map((o) => o.id)).size).toBe(all.length);
  });
});

describe("ObligationBook", () => {
  it("un pago a tiempo cumple la obligación sin atraso", () => {
    const book = new ObligationBook(rules);
    expect(book.record(pay({ round: 1, debtor: "juan" }))).toEqual({
      kind: "paid",
      obligationId: "j1:1:juan",
      daysLate: 0,
    });
  });

  it("pago tardío: cumple la obligación original y guarda 2 días de atraso", () => {
    const book = new ObligationBook(rules);
    const id = obligationId("j1", 2, "juan");
    const due = T0 + 7 * DAY + DAY;
    expect(book.status(id, due + 1)).toEqual({ kind: "overdue", daysLate: 1 });

    const out = book.record(pay({ round: 2, debtor: "juan", paidAt: due + 2 * DAY }));
    expect(out).toMatchObject({ kind: "paid", obligationId: id, daysLate: 2 });
    expect(book.status(id, due + 10 * DAY)).toMatchObject({ kind: "paid", daysLate: 2 });
    expect(book.list()).toHaveLength(30); // no se creó una deuda nueva
  });

  it("el mismo evento dos veces no suma dos pagos", () => {
    const book = new ObligationBook(rules);
    const e = pay({ round: 1, debtor: "ana" });
    book.record(e);
    expect(book.record({ ...e, txHash: e.txHash.toUpperCase() as Hex })).toEqual({ kind: "duplicate" });
    expect(book.pendingReview()).toHaveLength(0);
  });

  it("un segundo pago de la misma deuda con otra tx va a revisión, no se cuenta", () => {
    const book = new ObligationBook(rules);
    book.record(pay({ round: 1, debtor: "ana" }));
    expect(book.record(pay({ round: 1, debtor: "ana" }))).toEqual({ kind: "review", reason: "ya_pagada" });
    expect(book.pendingReview()).toHaveLength(1);
  });

  it.each<[string, Partial<PaymentEvent> & Pick<PaymentEvent, "round" | "debtor">, string]>([
    ["otra junta", { round: 1, debtor: "juan", juntaId: "j2" }, "otra_junta"],
    ["quien cobra se paga a sí mismo", { round: 1, debtor: "rosa" }, "sin_obligacion"],
    ["una ronda que no existe", { round: 7, debtor: "juan", creditor: "rosa" }, "sin_obligacion"],
    ["un miembro desconocido", { round: 1, debtor: "pepe" }, "sin_obligacion"],
    ["antes de que abra la ronda", { round: 2, debtor: "juan", paidAt: T0 }, "ronda_no_empezo"],
    ["a otro acreedor", { round: 1, debtor: "juan", creditor: "marta" }, "acreedor_distinto"],
    ["por otro monto", { round: 1, debtor: "juan", amount: A - 1n }, "monto_distinto"],
  ])("no adivina: %s va a revisión", (_, e, reason) => {
    const book = new ObligationBook(rules);
    expect(book.record(pay(e))).toEqual({ kind: "review", reason });
  });

  it("rondas superpuestas: con la ronda 3 abierta todavía se puede pagar la 2", () => {
    const book = new ObligationBook(rules);
    const now = T0 + 14 * DAY + 3600;
    expect(book.record(pay({ round: 2, debtor: "ana", paidAt: now }))).toMatchObject({ kind: "paid" });
    expect(book.record(pay({ round: 3, debtor: "ana", paidAt: now }))).toMatchObject({ kind: "paid", daysLate: 0 });
  });

  it("una ronda puede cerrar por fecha sin estar saldada", () => {
    const book = new ObligationBook(rules);
    for (const debtor of ["marta", "juan", "ana", "bruno"]) book.record(pay({ round: 1, debtor }));
    const s = book.roundStatus(1, T0 + 3 * DAY);
    expect(s).toMatchObject({ recipient: "rosa", closedByDate: true, settled: false, outstanding: ["luz"], overdue: ["luz"] });

    book.record(pay({ round: 1, debtor: "luz", paidAt: T0 + 3 * DAY }));
    expect(book.roundStatus(1, T0 + 3 * DAY)).toMatchObject({ settled: true, outstanding: [], overdue: [] });
  });

  it("antes del vencimiento no hay atraso, ni siquiera en el segundo exacto", () => {
    const book = new ObligationBook(rules);
    const id = obligationId("j1", 1, "juan");
    expect(book.status(id, T0 - 1)).toEqual({ kind: "upcoming" });
    expect(book.status(id, T0 + DAY)).toEqual({ kind: "pending" });
    expect(book.roundStatus(1, T0 + DAY).closedByDate).toBe(false);
  });

  describe("junta suspendida", () => {
    const at = T0 + 8 * DAY; // durante la ronda 2

    it("anula las rondas futuras, pero las deudas vencidas se pueden pagar siempre", () => {
      const book = new ObligationBook(rules);
      book.suspend(at);
      expect(book.status(obligationId("j1", 3, "ana"), at)).toEqual({ kind: "cancelled" });
      expect(book.roundStatus(3, at)).toMatchObject({ cancelled: true, settled: false, outstanding: [] });

      const late = book.record(pay({ round: 1, debtor: "juan", paidAt: at + 30 * DAY }));
      expect(late).toMatchObject({ kind: "paid", daysLate: 37 });
    });

    it("un pago a una ronda anulada va a revisión", () => {
      const book = new ObligationBook(rules);
      book.suspend(at);
      expect(book.record(pay({ round: 4, debtor: "juan" }))).toEqual({ kind: "review", reason: "ronda_anulada" });
    });
  });
});
