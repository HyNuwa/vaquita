import { describe, expect, it } from "vitest";
import type { Hex } from "viem";
import { afterCollectingScenarios, juntaPosition, stopPayingScenario } from "../src/junta/defaults.js";
import { ObligationBook } from "../src/junta/obligations.js";
import { type JuntaRules, JuntaRulesError } from "../src/junta/rules.js";
import { parseLocalAmount } from "../src/money/amounts.js";

const DAY = 86_400;
const T0 = Date.UTC(2026, 10, 2) / 1000;
const A = parseLocalAmount("20000");
const pesos = (x: bigint) => x / 10n ** 18n;

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

describe("afterCollectingScenarios", () => {
  it("si cada turno deja de pagar justo después de cobrar, se lleva lo que el grupo le confió", () => {
    const rows = afterCollectingScenarios(rules).map((s) => [s.turn, pesos(s.net), pesos(s.unpaid), s.affected.length]);
    expect(rows).toEqual([
      [1, 100_000n, 100_000n, 5],
      [2, 80_000n, 80_000n, 4],
      [3, 60_000n, 60_000n, 3],
      [4, 40_000n, 40_000n, 2],
      [5, 20_000n, 20_000n, 1],
      [6, 0n, 0n, 0],
    ]);
  });

  it("sin garantías, lo impago es exactamente lo que les falta a los turnos siguientes", () => {
    const s = stopPayingScenario(rules, "marta");
    expect(s.affected.map((a) => a.creditor)).toEqual(["juan", "ana", "bruno", "luz"]);
    expect(s.affected.every((a) => a.amount === A)).toBe(true);
    expect(s.net).toBe(s.unpaid);
  });
});

describe("stopPayingScenario", () => {
  it("si deja de pagar antes de cobrar, el que adelantó es él: el grupo le debe su pozo", () => {
    const s = stopPayingScenario(rules, "ana", 2); // turno 4, pagó solo la ronda 1
    expect(s).toMatchObject({ turn: 4, collectedBefore: false, received: 0n, paid: A });
    expect(s.net).toBe(-A);
    expect(s.affected.map((a) => a.round)).toEqual([2, 3, 5, 6]); // su propia ronda no cuenta
  });

  it("desde la ronda 1 no aportó nada, y después de la última ya no debe nada", () => {
    expect(stopPayingScenario(rules, "luz", 1)).toMatchObject({ paid: 0n, net: 0n, unpaid: 5n * A });
    expect(stopPayingScenario(rules, "rosa", 7)).toMatchObject({ unpaid: 0n, net: 0n, affected: [] });
  });

  it.each<[string, string, number | undefined]>([
    ["un miembro desconocido", "pepe", undefined],
    ["una ronda que no existe", "rosa", 8],
    ["la ronda 0", "rosa", 0],
  ])("rechaza %s", (_, member, from) => {
    expect(() => stopPayingScenario(rules, member, from)).toThrow(JuntaRulesError);
  });
});

describe("juntaPosition", () => {
  const pay = (book: ObligationBook, round: number, debtor: string, paidAt: number) =>
    book.record({
      juntaId: "j1",
      round,
      debtor,
      creditor: rules.members[round - 1]!,
      amount: A,
      paidAt,
      txHash: tx(),
      logIndex: 0,
    });

  it("al principio nadie debe nada vencido y todo está por pagar", () => {
    const p = juntaPosition(new ObligationBook(rules), T0 - 1);
    expect(p.totalOverdue).toBe(0n);
    expect(p.members.every((m) => m.upcoming === 5n * A && m.net === 0n)).toBe(true);
  });

  it("distingue lo vencido de quien ya cobró, que es el riesgo de D2", () => {
    const book = new ObligationBook(rules);
    // Ronda 1: todos le pagan a rosa. Ronda 2: rosa no le paga a marta; juan tampoco.
    for (const d of ["marta", "juan", "ana", "bruno", "luz"]) pay(book, 1, d, T0);
    for (const d of ["ana", "bruno", "luz"]) pay(book, 2, d, T0 + 7 * DAY);
    const now = T0 + 9 * DAY;
    const p = juntaPosition(book, now);
    const rosa = p.members.find((m) => m.member === "rosa")!;
    const marta = p.members.find((m) => m.member === "marta")!;

    expect(rosa).toMatchObject({ received: 5n * A, paid: 0n, net: 5n * A, overdue: A });
    expect(marta).toMatchObject({ received: 3n * A, paid: A, overdueToThem: 2n * A });
    expect(p.totalOverdue).toBe(2n * A);
    expect(p.overdueAfterCollecting).toBe(A); // solo lo de rosa: juan todavía no cobró
  });

  it("lo que se paga tarde deja de figurar como vencido", () => {
    const book = new ObligationBook(rules);
    pay(book, 1, "juan", T0 + 5 * DAY);
    const juan = juntaPosition(book, T0 + 5 * DAY).members.find((m) => m.member === "juan")!;
    expect(juan).toMatchObject({ paid: A, overdue: 0n });
  });

  it("si el grupo suspende la junta, las rondas anuladas no se cuentan como deuda", () => {
    const book = new ObligationBook(rules);
    book.suspend(T0 + DAY);
    const p = juntaPosition(book, T0 + 30 * DAY);
    const juan = p.members.find((m) => m.member === "juan")!;
    expect(juan).toMatchObject({ overdue: A, upcoming: 0n }); // solo la ronda 1, que ya había abierto
    expect(p.totalOverdue).toBe(5n * A);
  });
});
