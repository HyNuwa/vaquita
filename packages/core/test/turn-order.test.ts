import { describe, expect, it } from "vitest";
import { JuntaRulesError } from "../src/junta/rules.js";
import { findTurnOrders, type TurnOrderInput } from "../src/junta/turn-order.js";
import { parseLocalAmount } from "../src/money/amounts.js";

const $ = (s: string) => parseLocalAmount(s);
const A = $("20000");
const members = ["rosa", "marta", "juan", "ana", "bruno", "luz"];
const unlimited = Object.fromEntries(members.map((m) => [m, $("1000000")]));

const factorial = (n: number): bigint => (n <= 1 ? 1n : BigInt(n) * factorial(n - 1));

describe("findTurnOrders", () => {
  it("sin límites cualquier orden sirve: 6! órdenes", () => {
    const r = findTurnOrders({ members, amount: A, maxAdvance: unlimited }, { limit: 1000 });
    expect(r).toMatchObject({ viable: true, total: 720n, exhaustive: true });
    if (r.viable) expect(r.options).toHaveLength(720);
  });

  it("cada orden respeta lo que cada miembro puede adelantar", () => {
    // rosa solo puede ir 1.a, marta hasta 2.a, juan hasta 3.o: queda un lugar para cada uno y 3! para el resto.
    const input: TurnOrderInput = {
      members,
      amount: A,
      maxAdvance: { ...unlimited, rosa: 0n, marta: $("20000"), juan: $("40000") },
    };
    const r = findTurnOrders(input, { limit: 1000 });
    if (!r.viable) throw new Error("debería ser viable");
    expect(r.total).toBe(6n);
    expect(BigInt(r.options.length)).toBe(r.total);
    for (const o of r.options) {
      for (const c of o.commitments) expect(c.advancedBeforeCollecting).toBeLessThanOrEqual(input.maxAdvance[c.member]!);
    }
  });

  it("un centavo menos de lo que pide el turno ya no alcanza", () => {
    const maxAdvance = { ...unlimited, rosa: 0n, marta: $("20000"), juan: $("39999.99") };
    expect(findTurnOrders({ members, amount: A, maxAdvance }).viable).toBe(false);
  });

  it("el total coincide con la cuenta por fuerza bruta", () => {
    const maxAdvance = { rosa: 0n, marta: $("20000"), juan: $("60000"), ana: $("40000"), bruno: $("100000"), luz: $("80000") };
    const r = findTurnOrders({ members, amount: A, maxAdvance }, { limit: 1000 });
    if (!r.viable) throw new Error("debería ser viable");
    expect(r.total).toBe(1n); // cada uno tiene un solo lugar: rosa, marta, ana, juan, luz, bruno
    expect(r.options.map((o) => o.order)).toEqual([["rosa", "marta", "ana", "juan", "luz", "bruno"]]);
    expect(r.options[0]!.minMargin).toBe(0n);
  });

  it("muestra cuánto siguen debiendo los primeros turnos", () => {
    const r = findTurnOrders({ members, amount: A, maxAdvance: unlimited });
    if (!r.viable) throw new Error("debería ser viable");
    expect(r.options[0]!.commitments[0]).toMatchObject({ turn: 1, advancedBeforeCollecting: 0n, owedAfterCollecting: 5n * A });
  });

  it("recomienda primero el orden de mayor margen: quien menos puede adelantar, antes", () => {
    const maxAdvance = { rosa: $("100000"), marta: $("100000"), juan: 0n, ana: $("50000"), bruno: $("100000"), luz: $("30000") };
    const r = findTurnOrders({ members, amount: A, maxAdvance }, { limit: 1000 });
    if (!r.viable) throw new Error("debería ser viable");
    expect(r.options[0]!.order.slice(0, 3)).toEqual(["juan", "luz", "ana"]);
    expect(r.options[0]!.minMargin).toBe(0n); // juan, primero, no adelanta nada y no puede más
    const margins = r.options.map((o) => o.minMargin);
    expect(margins).toEqual([...margins].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)));
  });

  it("devuelve 5 opciones por defecto", () => {
    const r = findTurnOrders({ members, amount: A, maxAdvance: unlimited });
    if (r.viable) expect(r.options).toHaveLength(5);
  });

  describe("cuando ningún orden cumple", () => {
    it("dice quiénes no entran y que bajar el monto no alcanza", () => {
      const r = findTurnOrders({ members, amount: A, maxAdvance: { ...unlimited, ana: 0n, luz: 0n } });
      expect(r).toEqual({ viable: false, crowded: { members: ["ana", "luz"], firstTurns: 1 }, maxViableAmount: 0n });
    });

    it("propone el mayor aporte con el que sí es viable", () => {
      const three = ["rosa", "marta", "juan"];
      const maxAdvance = { rosa: 0n, marta: $("10000"), juan: $("30000") };
      const r = findTurnOrders({ members: three, amount: A, maxAdvance });
      expect(r).toMatchObject({ viable: false, crowded: { members: ["rosa", "marta"], firstTurns: 1 }, maxViableAmount: $("10000") });
      if (r.viable) return;

      expect(findTurnOrders({ members: three, amount: r.maxViableAmount, maxAdvance }).viable).toBe(true);
      expect(findTurnOrders({ members: three, amount: r.maxViableAmount + 1n, maxAdvance }).viable).toBe(false);
    });
  });

  it("con más de 8 miembros no prueba todos: cuenta exacta y el orden de mayor margen", () => {
    const many = Array.from({ length: 12 }, (_, i) => `m${i}`);
    const maxAdvance = Object.fromEntries(many.map((m, i) => [m, BigInt(11 - i) * A]));
    const r = findTurnOrders({ members: many, amount: A, maxAdvance });
    expect(r).toMatchObject({ viable: true, exhaustive: false });
    if (!r.viable) return;
    expect(r.total).toBe(1n);
    expect(r.options).toHaveLength(1);
    expect(r.options[0]!.order).toEqual([...many].reverse());

    const free = findTurnOrders({ members: many, amount: A, maxAdvance: Object.fromEntries(many.map((m) => [m, 11n * A])) });
    if (free.viable) expect(free.total).toBe(factorial(12));
  });

  it.each<[string, Partial<TurnOrderInput>]>([
    ["un solo miembro", { members: ["rosa"] }],
    ["miembros repetidos", { members: ["rosa", "rosa"] }],
    ["aporte en cero", { amount: 0n }],
    ["un miembro sin límite declarado", { maxAdvance: { rosa: 0n } }],
    ["un límite negativo", { maxAdvance: { ...unlimited, rosa: -1n } }],
  ])("rechaza %s", (_, bad) => {
    expect(() => findTurnOrders({ members, amount: A, maxAdvance: unlimited, ...bad })).toThrow(JuntaRulesError);
  });
});
