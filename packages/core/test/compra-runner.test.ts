import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";
import { AgentLog, type AgentLogEntry } from "../src/compra/agent-log.js";
import { HttpRequestError } from "viem";
import { LOOP_RULES, type LoopAction } from "../src/compra/loop.js";
import { describeError, runTick, startLoop, type LoopDeps, type PreparedExecution, type TxStatus } from "../src/compra/runner.js";
import type { BuyerFunds } from "../src/compra/selection.js";
import type { CampaignEvent } from "../src/compra/state.js";
import { JsonCampaignStore, type CampaignRecord, type CampaignStore } from "../src/compra/store.js";
import type { CampaignTerms } from "../src/compra/terms.js";
import { ONE } from "./helpers.js";

type Notice = Exclude<LoopAction, { type: "EXECUTE" }>;

const NOW = 1_000_000;
const HASH = `0x${"a".repeat(64)}`;

const record = (over: Partial<CampaignRecord> = {}): CampaignRecord => ({
  terms: {
    id: "c1",
    supplier: "proveedor",
    unitPrice: 1000n * ONE,
    fee: 0n,
    minUnits: 2,
    maxUnits: 2,
    deadline: NOW + 100 * 3600,
    buyers: ["ana", "beto", "caro"],
  },
  phase: "COMMITMENTS",
  pendingSuppliers: [],
  done: {},
  funds: {},
  ...over,
});

const memoryStore = (records: CampaignRecord[]): CampaignStore => ({
  list: () => structuredClone(records),
  save: (r) => {
    const i = records.findIndex((x) => x.terms.id === r.terms.id);
    records[i] = structuredClone(r);
  },
  acquire: () => true,
  release: () => {},
});

const commit = (buyer: string, n: number): CampaignEvent => ({
  type: "COMMITTED",
  campaignId: "c1",
  buyer,
  txHash: `0x${n}`,
  logIndex: 0,
  blockNumber: n,
});

const OTHER_HASH = `0x${"b".repeat(64)}`;
const executed: CampaignEvent = { type: "EXECUTED", campaignId: "c1", txHash: OTHER_HASH, logIndex: 2, blockNumber: 3 };
const purchase = (buyer: string, logIndex: number): CampaignEvent => ({ type: "PURCHASE_CONFIRMED", campaignId: "c1", buyer, txHash: OTHER_HASH, logIndex, blockNumber: 3 });
/** La cadena después de una compra de dos unidades. */
const landed = [commit("ana", 1), commit("beto", 2), purchase("ana", 0), purchase("beto", 1), executed];

const rich: BuyerFunds = { balance: 2000n * ONE, allowance: 1000n * ONE };

function setup(records: CampaignRecord[], over: Partial<LoopDeps> = {}) {
  const entries: AgentLogEntry[] = [];
  const base = {
    store: memoryStore(records),
    chain: {
      events: vi.fn(async (_terms: CampaignTerms): Promise<CampaignEvent[]> => [commit("ana", 1), commit("beto", 2)]),
      funds: vi.fn(async (_terms: CampaignTerms, _buyers: readonly string[]): Promise<Map<string, BuyerFunds>> =>
        new Map([["ana", rich], ["beto", rich]])),
    },
    notify: vi.fn(async (_id: string, _action: Notice) => {}),
    execution: {
      prepare: vi.fn(async (_terms: CampaignTerms, _units: number): Promise<PreparedExecution> => ({
        status: "READY",
        txHash: HASH,
        signedTx: "0xsigned",
      })),
      broadcast: vi.fn(async (_signedTx: string) => {}),
      status: vi.fn(async (_txHash: string, _signedTx: string): Promise<TxStatus> => "CONFIRMED"),
      isLive: () => true,
    },
    isAllowedSupplier: (_supplier: string) => true,
    gasBudgetOk: async () => true,
    log: { append: (entry: AgentLogEntry) => void entries.push(entry) },
    now: () => NOW,
  };
  // `over` reemplaza piezas por otros dobles: los tests siguen viéndolos como mocks.
  const deps = { ...base, ...over } as typeof base;
  return { deps, entries, records };
}

const pending = { txHash: HASH, signedTx: "0xsigned", at: NOW, units: 2 };
const noticeTypes = (notify: { mock: { calls: [string, Notice][] } }) => notify.mock.calls.map(([, a]) => a.type);

describe("runTick: ejecución", () => {
  it("ejecuta con el cupo lleno, sin que nadie se lo pida, y lo registra al confirmarse", async () => {
    const { deps, entries } = setup([record()]);
    expect(await runTick(deps)).toEqual({ campaigns: 1, errors: [] });
    expect(deps.execution.prepare).toHaveBeenCalledWith(expect.objectContaining({ id: "c1" }), 2);
    expect(deps.execution.broadcast).toHaveBeenCalledWith("0xsigned");
    expect(entries).toEqual([]);

    await runTick(deps);
    expect(entries).toEqual([]);

    deps.chain.events.mockResolvedValue(landed);
    await runTick(deps);
    expect(entries[0]).toEqual({ id: expect.any(String), at: expect.any(String), campaignId: "c1", action: "EXECUTE", outcome: "DONE", units: 2, txHash: OTHER_HASH });
  });

  it("guarda el hash antes de transmitir", async () => {
    const records = [record()];
    const { deps } = setup(records);
    deps.execution.broadcast.mockImplementation(async () => {
      expect(records[0]?.pendingExecution?.txHash).toBe(HASH);
      expect(records[0]?.done.execute).toBe(1);
    });
    await runTick(deps);
    expect(deps.execution.broadcast).toHaveBeenCalled();
  });

  it("si no puede guardar el hash, no transmite", async () => {
    const records = [record()];
    const store = memoryStore(records);
    const { deps } = setup(records, {
      store: {
        ...store,
        save: (r) => {
          if (r.pendingExecution) throw new Error("disco lleno");
          store.save(r);
        },
      },
    });
    const report = await runTick(deps);
    expect(deps.execution.broadcast).not.toHaveBeenCalled();
    expect(report.errors[0]).toMatch(/disco lleno/);
  });

  it("tras un corte después de enviar, no reenvía: concilia por hash", async () => {
    const { deps } = setup([record({ done: { execute: 1 }, pendingExecution: pending })]);
    deps.execution.status.mockResolvedValue("PENDING");
    await runTick(deps);
    await runTick(deps);
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it("si la transmisión da error pero la tx salió, no reenvía", async () => {
    const { deps, entries } = setup([record()]);
    deps.execution.broadcast.mockRejectedValueOnce(new Error("timeout"));
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/EXECUTE: .*timeout/);
    await runTick(deps);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
    expect(deps.execution.broadcast).toHaveBeenCalledTimes(1);
    expect(entries).toEqual([]);
  });

  it("no dice que nadie pagó, ni que se detuvo, ni pide fondos con la compra en curso", async () => {
    const deadline = record().terms.deadline;
    const expired = setup([record({ done: { execute: 1 }, pendingExecution: pending })], { now: () => deadline });
    expired.deps.execution.status.mockResolvedValue("PENDING");
    await runTick(expired.deps);
    expect(expired.deps.notify).not.toHaveBeenCalled();

    // Tercer intento confirmado, con el evento todavía sin llegar y los saldos ya en cero.
    const confirmed = setup([record({ done: { execute: 3 }, pendingExecution: pending })]);
    confirmed.deps.chain.funds.mockResolvedValue(new Map([["ana", { balance: 0n, allowance: 0n }], ["beto", { balance: 0n, allowance: 0n }]]));
    await runTick(confirmed.deps);
    await runTick(confirmed.deps);
    expect(confirmed.deps.notify).not.toHaveBeenCalled();
    expect(confirmed.deps.execution.prepare).not.toHaveBeenCalled();

    const late = setup([record({ done: { execute: 1, "execute-sent": 1 } })], { now: () => deadline });
    await runTick(late.deps);
    expect(late.deps.notify).not.toHaveBeenCalled();
  });

  it("una tx sin rastro se retransmite igual, nunca se firma otra, y se avisa a quien opera", async () => {
    const records = [record({ done: { execute: 1 }, pendingExecution: pending })];
    let now = NOW + 1;
    const { deps } = setup(records, { now: () => now });
    deps.execution.status.mockResolvedValue("NOT_FOUND");
    expect((await runTick(deps)).errors).toEqual([]);

    now = NOW + LOOP_RULES.executionTimeoutSeconds * 100;
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/sigue sin confirmarse/);
    expect(deps.execution.broadcast).toHaveBeenCalledTimes(2);
    expect(deps.execution.broadcast).toHaveBeenCalledWith("0xsigned");
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(records[0]?.pendingExecution?.txHash).toBe(HASH);
  });

  it("pasado el límite no retransmite, y solo después de esperar dice que venció", async () => {
    const deadline = record().terms.deadline;
    let now = deadline + 1;
    const records = [record({ done: { execute: 1 }, pendingExecution: pending })];
    const { deps, entries } = setup(records, { now: () => now });
    deps.execution.status.mockResolvedValue("NOT_FOUND");
    await runTick(deps);
    expect(deps.execution.broadcast).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();

    now = deadline + LOOP_RULES.executionTimeoutSeconds;
    await runTick(deps);
    expect(deps.execution.broadcast).not.toHaveBeenCalled();
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(records[0]?.pendingExecution).toBeUndefined();
    expect(noticeTypes(deps.notify)).toEqual(["NOTIFY_EXPIRED"]);
    expect(entries.map((e) => e.outcome)).toContain("FAILED");
  });

  it("no dice que venció si el historial de la cadena es inconsistente", async () => {
    const deadline = record().terms.deadline;
    const { deps, entries } = setup([record()], { now: () => deadline + 1 });
    deps.chain.events.mockResolvedValue([commit("ana", 1), executed, { ...executed, blockNumber: 4 }]);
    await runTick(deps);
    expect(deps.notify).not.toHaveBeenCalled();
    expect(entries.map((e) => e.skipCode)).toEqual(["STATE_INCONSISTENT"]);

    deps.chain.events.mockResolvedValue([commit("ana", 1)]);
    await runTick(deps);
    expect(noticeTypes(deps.notify)).toEqual(["NOTIFY_EXPIRED"]);
  });

  it("solo firma otra cuando la anterior ya no puede entrar", async () => {
    const records = [record({ done: { execute: 1 }, pendingExecution: pending })];
    const { deps, entries } = setup(records);
    deps.execution.status.mockResolvedValueOnce("DROPPED");
    await runTick(deps);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
    expect(records[0]?.done.execute).toBe(2);
    expect(entries.map((e) => e.outcome)).toEqual(["FAILED"]);
  });

  it("no transmite si el límite pasó mientras preparaba", async () => {
    const deadline = record().terms.deadline;
    const records = [record()];
    let now = deadline - 1;
    const { deps } = setup(records, { now: () => now });
    deps.execution.prepare.mockImplementation(async () => {
      now = deadline;
      return { status: "READY", txHash: HASH, signedTx: "0xsigned" };
    });
    await runTick(deps);
    expect(deps.execution.broadcast).not.toHaveBeenCalled();
    expect(records[0]?.pendingExecution).toBeUndefined();
  });

  it("si el evento llega con la tx aún pendiente, registra la compra y su hash", async () => {
    const records = [record({ done: { execute: 1 }, pendingExecution: pending })];
    const { deps, entries } = setup(records);
    deps.execution.status.mockResolvedValue("PENDING");
    deps.chain.events.mockResolvedValue(landed);
    await runTick(deps);
    await runTick(deps);
    expect(records[0]?.pendingExecution).toBeUndefined();
    const buys = entries.filter((e) => e.action === "EXECUTE");
    expect(buys.map((e) => [e.outcome, e.txHash, e.units])).toEqual([["DONE", OTHER_HASH, 2]]);
    expect(noticeTypes(deps.notify)).toEqual(["REQUEST_DELIVERY"]);
  });

  it("si no puede consultar la tx, no decide nada en esa vuelta", async () => {
    const { deps } = setup([record({ done: { execute: 1 }, pendingExecution: pending })]);
    deps.execution.status.mockRejectedValue(new Error("nodo caído"));
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/nodo caído/);
    expect(deps.chain.events).not.toHaveBeenCalled();
    expect(deps.execution.prepare).not.toHaveBeenCalled();
  });

  it("si otro ejecutó la campaña, deja de esperar y pide la entrega", async () => {
    const records = [record({ done: { execute: 1 }, pendingExecution: pending })];
    const { deps } = setup(records);
    deps.execution.status.mockResolvedValue("NOT_FOUND");
    deps.chain.events.mockResolvedValue([commit("ana", 1), executed]);
    await runTick(deps);
    expect(records[0]?.pendingExecution).toBeUndefined();
    expect(noticeTypes(deps.notify)).toEqual(["REQUEST_DELIVERY"]);
  });

  it("no reenvía la ejecución mientras el evento todavía no llegó", async () => {
    const { deps } = setup([record()]);
    for (let i = 0; i < 4; i++) await runTick(deps);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it("al llegar el evento pide la entrega una vez", async () => {
    const { deps, entries } = setup([record({ done: { execute: 1, "execute-sent": 1 } })]);
    deps.chain.events.mockResolvedValue([commit("ana", 1), executed]);
    await runTick(deps);
    await runTick(deps);
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(deps.notify).toHaveBeenCalledTimes(1);
    expect(entries.map((e) => e.action)).toEqual(["EXECUTE", "REQUEST_DELIVERY"]);
  });

  it("en modo ensayo ejecuta una sola vez, sin gastar intentos ni avisar que se detuvo", async () => {
    const { deps, entries, records } = setup([record()]);
    deps.execution.isLive = () => false;
    deps.execution.prepare.mockResolvedValue({ status: "DRY_RUN" });
    for (let i = 0; i < 5; i++) await runTick(deps);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
    expect(deps.execution.broadcast).not.toHaveBeenCalled();
    expect(records[0]?.done.execute).toBe(0);
    expect(deps.notify).not.toHaveBeenCalled();
    expect(entries.map((e) => e.outcome)).toEqual(["DRY_RUN"]);
  });

  it("una campaña ensayada ejecuta de verdad al pasar a real", async () => {
    const { deps } = setup([record()]);
    let live = false;
    deps.execution.isLive = () => live;
    deps.execution.prepare.mockResolvedValueOnce({ status: "DRY_RUN" });
    await runTick(deps);
    await runTick(deps);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);

    live = true;
    await runTick(deps);
    expect(deps.execution.broadcast).toHaveBeenCalledTimes(1);
  });

  it("si la tx revierte, reintenta hasta el límite, avisa y se detiene", async () => {
    const { deps, entries } = setup([record()]);
    deps.execution.status.mockResolvedValue("REVERTED");
    for (let i = 0; i < 6; i++) await runTick(deps);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(3);
    expect(noticeTypes(deps.notify)).toEqual(["NOTIFY_EXECUTION_STOPPED"]);
    expect(entries.filter((e) => e.outcome === "FAILED")).toHaveLength(3);
  });

  it("si la simulación falla, cuenta el intento y se lo informa a quien opera", async () => {
    const { deps, entries, records } = setup([record()]);
    deps.execution.prepare.mockRejectedValue(new Error("revertiría"));
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/^c1: EXECUTE: .*revertiría/);
    expect(records[0]?.done.execute).toBe(1);
    expect(deps.execution.broadcast).not.toHaveBeenCalled();
    expect(entries.map((e) => e.outcome)).toEqual(["FAILED"]);
  });

  it("no gasta un intento si las esperas cruzaron el límite", async () => {
    const deadline = record().terms.deadline;
    const times = [deadline - 1, deadline];
    const records = [record()];
    const { deps } = setup(records, { now: () => times.shift() ?? deadline });
    await runTick(deps);
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(records[0]?.done.execute).toBeUndefined();
  });

  it("no ejecuta sin presupuesto de gas y avisa una vez", async () => {
    const { deps } = setup([record()], { gasBudgetOk: async () => false });
    await runTick(deps);
    await runTick(deps);
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(deps.notify).toHaveBeenCalledTimes(1);
  });

  it("no toca una campaña con condiciones inválidas", async () => {
    const bad = record({ terms: { ...record().terms, unitPrice: 0n } });
    const { deps } = setup([bad]);
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/precio/);
    expect(deps.chain.events).not.toHaveBeenCalled();
    expect(deps.execution.prepare).not.toHaveBeenCalled();
  });
});

describe("runTick: avisos y bitácora", () => {
  const sinFondos = () => ({
    chain: {
      events: vi.fn(async () => [commit("ana", 1)]),
      funds: vi.fn(async () => new Map([["ana", { balance: 0n, allowance: 0n }]]) as Map<string, BuyerFunds>),
    },
  });

  it("registra el motivo de no ejecutar solo cuando cambia", async () => {
    const { deps, entries } = setup([record({ terms: { ...record().terms, maxUnits: 3 } })]);
    await runTick(deps);
    await runTick(deps);
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(entries).toEqual([
      { id: expect.any(String), at: expect.any(String), campaignId: "c1", action: "EXECUTE", outcome: "SKIPPED", skipCode: "WAITING_FINAL_WINDOW" },
    ]);
  });

  it("un aviso que falla se reintenta, se registra una vez y queda hecho al salir bien", async () => {
    let now = NOW;
    const { deps, entries } = setup([record()], { ...sinFondos(), now: () => now });
    deps.notify.mockRejectedValueOnce(new Error("telegram caído")).mockRejectedValueOnce(new Error("telegram caído"));
    const first = await runTick(deps);
    expect(first.errors[0]).toMatch(/NOTIFY_BUYER_FUNDS/);
    for (let i = 0; i < 3; i++) {
      now += LOOP_RULES.noticeRetryMaxSeconds;
      await runTick(deps);
    }
    expect(deps.notify).toHaveBeenCalledTimes(3);
    const funds = entries.filter((e) => e.action === "NOTIFY_BUYER_FUNDS").map((e) => e.outcome);
    expect(funds).toEqual(["FAILED", "DONE"]);
  });

  it("un aviso que falla se espacia cada vez más, y no se abandona nunca", async () => {
    let now = NOW;
    const { deps } = setup([record({ terms: { ...record().terms, maxUnits: 3, deadline: NOW + 1000 * 3600 } })], { ...sinFondos(), now: () => now });
    deps.notify.mockRejectedValue(new Error("telegram caído"));
    await runTick(deps);
    await runTick(deps);
    expect(deps.notify).toHaveBeenCalledTimes(1);

    now += LOOP_RULES.tickSeconds;
    await runTick(deps);
    await runTick(deps);
    expect(deps.notify).toHaveBeenCalledTimes(2);

    for (let i = 0; i < 40; i++) {
      now += LOOP_RULES.noticeRetryMaxSeconds;
      await runTick(deps);
    }
    expect(deps.notify).toHaveBeenCalledTimes(42);
  });

  it("el pedido de entrega sobrevive a una caída larga del canal", async () => {
    let now = NOW;
    const { deps } = setup([record({ done: { execute: 1, "execute-sent": 1 } })], { now: () => now });
    deps.chain.events.mockResolvedValue([commit("ana", 1), executed]);
    deps.notify.mockRejectedValue(new Error("telegram caído"));
    for (let i = 0; i < 30; i++) {
      await runTick(deps);
      now += LOOP_RULES.noticeRetryMaxSeconds;
    }
    deps.notify.mockReset();
    deps.notify.mockResolvedValue(undefined);
    await runTick(deps);
    await runTick(deps);
    expect(noticeTypes(deps.notify)).toEqual(["REQUEST_DELIVERY"]);
  });

  it("un aviso que salió pero no se pudo guardar no se repite", async () => {
    let now = NOW;
    const records = [record({ done: { execute: 1, "execute-sent": 1 } })];
    const store = memoryStore(records);
    let broken = true;
    const { deps, entries } = setup(records, {
      now: () => now,
      store: {
        ...store,
        save: (r) => {
          if (broken && r.done["request-delivery"]) throw new Error("disco lleno");
          store.save(r);
        },
      },
    });
    deps.chain.events.mockResolvedValue(landed);
    for (let i = 0; i < 5; i++) {
      await runTick(deps);
      now += LOOP_RULES.noticeRetryMaxSeconds;
    }
    expect(deps.notify).toHaveBeenCalledTimes(1);

    broken = false;
    await runTick(deps);
    expect(deps.notify).toHaveBeenCalledTimes(1);
    expect(records[0]?.done["request-delivery"]).toBe(1);
    expect(entries.map((e) => e.action)).toEqual(["EXECUTE", "REQUEST_DELIVERY"]);
  });

  it("los errores que ve quien opera no traen la URL del nodo", async () => {
    const url = "https://nodo.invalid/clave-de-prueba";
    const { deps } = setup([record()]);
    deps.chain.events.mockRejectedValue(new HttpRequestError({ url, status: 500, details: "caído" }));
    const report = await runTick(deps);
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0]).not.toContain("clave-de-prueba");
    expect(describeError(new Error(`fallo en ${url}/ruta y wss://otro.invalid/clave`))).toBe("Error: fallo en [url oculta] y [url oculta]");
  });

  it("si no se puede guardar, el aviso no se repite sin límite", async () => {
    const records = [record()];
    const store = memoryStore(records);
    let broken = false;
    const { deps } = setup(records, {
      ...sinFondos(),
      store: {
        ...store,
        save: (r) => {
          if (broken) throw new Error("disco lleno");
          store.save(r);
        },
      },
    });
    broken = true;
    for (let i = 0; i < 5; i++) await runTick(deps);
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it("vuelve a avisar si un comprador recupera fondos y los pierde otra vez", async () => {
    const { deps } = setup([record()], sinFondos());
    await runTick(deps);
    deps.chain.funds.mockResolvedValueOnce(new Map([["ana", rich]]));
    await runTick(deps);
    await runTick(deps);
    expect(deps.notify).toHaveBeenCalledTimes(2);
  });

  it("no le reclama a un proveedor fuera de la lista permitida", async () => {
    const pendingSuppliers = [{ supplier: "ajeno", requestedAt: NOW - 25 * 3600 }];
    const { deps, entries } = setup([record({ phase: "QUOTES", pendingSuppliers })], { isAllowedSupplier: () => false });
    await runTick(deps);
    await runTick(deps);
    expect(deps.notify).not.toHaveBeenCalled();
    expect(entries.map((e) => [e.action, e.outcome])).toEqual([["REMIND_SUPPLIER", "FAILED"]]);
  });

  it("mientras se cotiza no lee la cadena ni avisa faltantes", async () => {
    const terms = { ...record().terms, deadline: NOW + 3600 };
    const { deps } = setup([record({ terms, phase: "QUOTES", offersCloseAt: NOW })]);
    await runTick(deps);
    expect(deps.chain.events).not.toHaveBeenCalled();
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(noticeTypes(deps.notify)).toEqual(["PUBLISH_COMPARISON"]);
  });

  it("si falla la lectura de una campaña, sigue con las demás e informa", async () => {
    const other = record({ terms: { ...record().terms, id: "c2" } });
    const { deps } = setup([record(), other]);
    deps.chain.events.mockImplementation(async (terms: CampaignTerms) => {
      if (terms.id === "c1") throw new Error("nodo caído");
      return [{ ...commit("ana", 1), campaignId: "c2" }, { ...commit("beto", 2), campaignId: "c2" }];
    });
    const report = await runTick(deps);
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0]).toMatch(/^c1:/);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
  });

  it("no consulta fondos de una campaña vencida", async () => {
    const { deps } = setup([record()], { now: () => record().terms.deadline });
    await runTick(deps);
    expect(deps.chain.funds).not.toHaveBeenCalled();
    expect(deps.execution.prepare).not.toHaveBeenCalled();
    expect(noticeTypes(deps.notify)).toEqual(["NOTIFY_EXPIRED"]);
  });

  it("si la bitácora falla, no repite la operación y escribe la entrada al volver", async () => {
    const written: AgentLogEntry[] = [];
    let broken = true;
    const { deps } = setup([record()], {
      log: {
        append: (entry) => {
          if (broken) throw new Error("disco lleno");
          written.push(entry);
        },
      },
    });
    await runTick(deps);
    deps.chain.events.mockResolvedValue(landed);
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/bitácora/);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
    expect(written).toEqual([]);

    broken = false;
    await runTick(deps);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
    expect(written.map((e) => e.action)).toEqual(["EXECUTE", "REQUEST_DELIVERY"]);
  });

  it("una entrada inválida no traba a las demás", async () => {
    const invalid = { at: "x", campaignId: "c1", action: "EXECUTE", outcome: "DONE" } as AgentLogEntry;
    const file = join(mkdtempSync(join(tmpdir(), "vaquita-log-")), "log.jsonl");
    const { deps } = setup([record({ pendingLog: [invalid], terms: { ...record().terms, maxUnits: 3 } })], { log: new AgentLog(file) });
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/bitácora/);
    expect(new AgentLog(file).read("c1").map((e) => e.skipCode)).toEqual(["WAITING_FINAL_WINDOW"]);
  });
});

describe("concurrencia", () => {
  it("dos vueltas simultáneas no envían dos veces", async () => {
    const { deps } = setup([record()]);
    const [a, b] = await Promise.all([runTick(deps), runTick(deps)]);
    expect(deps.execution.prepare).toHaveBeenCalledTimes(1);
    expect([a.errors, b.errors].flat()).toEqual(["Ya hay una vuelta en curso."]);
  });

  it("si otro proceso tiene el loop, no hace nada", async () => {
    const records = [record()];
    const { deps } = setup(records, { store: { ...memoryStore(records), acquire: () => false } });
    const report = await runTick(deps);
    expect(report.errors[0]).toMatch(/Otro proceso/);
    expect(deps.chain.events).not.toHaveBeenCalled();
  });
});

describe("startLoop", () => {
  it("corre sin callback", async () => {
    vi.useFakeTimers();
    try {
      const { deps } = setup([record()]);
      const stop = startLoop(deps, { intervalSeconds: 1 });
      await vi.advanceTimersByTimeAsync(0);
      expect(deps.chain.events).toHaveBeenCalled();
      stop();
    } finally {
      vi.useRealTimers();
    }
  });

  it("no arranca otra vuelta mientras una sigue en curso, y al parar no agenda más", async () => {
    vi.useFakeTimers();
    try {
      const { deps } = setup([record()]);
      let release = (_events: CampaignEvent[]) => {};
      deps.chain.events.mockImplementationOnce(() => new Promise((resolve) => (release = resolve)));
      const stop = startLoop(deps, { intervalSeconds: 1 });
      await vi.advanceTimersByTimeAsync(5000);
      expect(deps.chain.events).toHaveBeenCalledTimes(1);

      release([]);
      await vi.advanceTimersByTimeAsync(1000);
      expect(deps.chain.events).toHaveBeenCalledTimes(2);

      stop();
      await vi.advanceTimersByTimeAsync(5000);
      expect(deps.chain.events).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("un error de quien observa no frena el loop", async () => {
    vi.useFakeTimers();
    try {
      const { deps } = setup([record()]);
      const onReport = vi.fn(() => {
        throw new Error("observador roto");
      });
      const stop = startLoop(deps, { intervalSeconds: 1, onReport });
      await vi.advanceTimersByTimeAsync(2500);
      expect(onReport.mock.calls.length).toBeGreaterThanOrEqual(3);
      stop();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("JsonCampaignStore", () => {
  const dir = mkdtempSync(join(tmpdir(), "vaquita-store-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  /** Toma el archivo, guarda y lo suelta, como un proceso que arranca y termina. */
  const saveAs = (file: string, r: CampaignRecord) => {
    const store = new JsonCampaignStore(file);
    expect(store.acquire()).toBe(true);
    store.save(r);
    store.release();
  };

  it("sobrevive a un reinicio, con los montos intactos", () => {
    const file = join(dir, "sub", "compra.json");
    const a = record();
    const b = record({ terms: { ...record().terms, id: "c2" } });
    saveAs(file, a);
    saveAs(file, b);
    saveAs(file, { ...a, done: { execute: 2 }, pendingExecution: pending });

    const loaded = new JsonCampaignStore(file).list();
    expect(loaded.map((r) => r.terms.id).sort()).toEqual(["c1", "c2"]);
    const c1 = loaded.find((r) => r.terms.id === "c1");
    expect(c1?.terms.unitPrice).toBe(1000n * ONE);
    expect(c1?.done.execute).toBe(2);
    expect(c1?.pendingExecution).toEqual(pending);
  });

  it.each(["$bigint", "__proto__", "constructor"])("un alias llamado %s no rompe el archivo", (alias) => {
    const file = join(dir, `alias-${alias.replace(/\W/g, "")}.json`);
    const funds = Object.fromEntries([[alias, { reason: null, episode: 0 }]]);
    saveAs(file, record({ funds }));
    const [loaded] = new JsonCampaignStore(file).list();
    expect(Object.keys(loaded?.funds ?? {})).toEqual([alias]);
    expect(loaded?.terms.unitPrice).toBe(1000n * ONE);
  });

  it("sin archivo no hay campañas", () => {
    expect(new JsonCampaignStore(join(dir, "nada.json")).list()).toEqual([]);
  });

  it("un archivo corrupto falla, no arranca de cero", () => {
    const file = join(dir, "roto.json");
    writeFileSync(file, "{no es json");
    expect(() => new JsonCampaignStore(file).list()).toThrow();
  });

  it("no guarda sin ser dueño", () => {
    expect(() => new JsonCampaignStore(join(dir, "ajeno.json")).save(record())).toThrow(/a cargo/);
  });

  it("dos instancias sobre el mismo archivo no pueden ser dueñas, por más que pase el tiempo", () => {
    const file = join(dir, "dos.json");
    const a = new JsonCampaignStore(file);
    const b = new JsonCampaignStore(file);
    expect(a.acquire()).toBe(true);
    expect(a.acquire()).toBe(true);
    expect(b.acquire()).toBe(false);
    a.release();
    expect(b.acquire()).toBe(true);
    b.release();
  });

  it("toma el archivo de un dueño muerto, y el dueño anterior ya no puede guardar", () => {
    const file = join(dir, "muerto.json");
    const { pid } = spawnSync(process.execPath, ["-e", ""]);
    writeFileSync(`${file}.owner`, JSON.stringify({ pid, token: "viejo" }));
    const store = new JsonCampaignStore(file);
    expect(store.acquire()).toBe(true);
    store.save(record());

    writeFileSync(`${file}.owner`, JSON.stringify({ pid: process.pid, token: "otro" }));
    expect(() => store.save(record())).toThrow(/a cargo/);
  });

  it("si otro proceso está sacando al dueño muerto, espera", () => {
    const file = join(dir, "carrera.json");
    const { pid } = spawnSync(process.execPath, ["-e", ""]);
    writeFileSync(`${file}.owner`, JSON.stringify({ pid, token: "viejo" }));
    mkdirSync(`${file}.owner.takeover`);
    expect(new JsonCampaignStore(file).acquire()).toBe(false);
    rmSync(`${file}.owner.takeover`, { recursive: true });
    expect(new JsonCampaignStore(file).acquire()).toBe(true);
  });

  it("una línea cortada de la bitácora se repara y la entrada se reintenta", () => {
    const file = join(dir, "log-cortado.jsonl");
    const log = new AgentLog(file);
    const entry: AgentLogEntry = { id: "00000000-0000-4000-8000-000000000001", at: new Date(NOW * 1000).toISOString(), campaignId: "c1", action: "EXECUTE", outcome: "DRY_RUN" };
    writeFileSync(file, JSON.stringify(entry).slice(0, 60));
    expect(log.read("c1")).toEqual([]);
    log.append(entry);
    log.append(entry);
    expect(log.read("c1")).toEqual([entry]);
  });

  it("no le saca el archivo a un dueño vivo de otro proceso", () => {
    const file = join(dir, "vivo.json");
    writeFileSync(`${file}.owner`, JSON.stringify({ pid: process.ppid, token: "padre" }));
    expect(new JsonCampaignStore(file).acquire()).toBe(false);
  });

  it("un corte después de escribir en la bitácora no duplica la entrada", async () => {
    const file = join(dir, "log-corte.jsonl");
    const records = [record()];
    const store = memoryStore(records);
    let broken = false;
    const { deps } = setup(records, {
      log: new AgentLog(file),
      store: {
        ...store,
        save: (r) => {
          if (broken) throw new Error("disco lleno");
          store.save(r);
        },
      },
    });
    await runTick(deps);
    deps.chain.events.mockResolvedValue(landed);
    const log = new AgentLog(file);
    const failing = { append: (e: AgentLogEntry) => { log.append(e); broken = true; } };
    await runTick({ ...deps, log: failing });
    broken = false;
    await runTick(deps);
    expect(log.read("c1").map((e) => e.action)).toEqual(["EXECUTE", "REQUEST_DELIVERY"]);
  });

  it("la bitácora real acepta lo que escribe el proceso", async () => {
    const file = join(dir, "log.jsonl");
    const { deps } = setup([record()], { log: new AgentLog(file) });
    expect((await runTick(deps)).errors).toEqual([]);
    deps.chain.events.mockResolvedValue(landed);
    expect((await runTick(deps)).errors).toEqual([]);
    expect(new AgentLog(file).read("c1").map((e) => e.txHash)).toEqual([OTHER_HASH, undefined]);
  });

  it("al parar suelta el archivo", async () => {
    vi.useFakeTimers();
    try {
      const file = join(dir, "parar.json");
      const store = new JsonCampaignStore(file);
      const { deps } = setup([], { store });
      const stop = startLoop(deps, { intervalSeconds: 1 });
      await vi.advanceTimersByTimeAsync(0);
      expect(new JsonCampaignStore(file).acquire()).toBe(false);
      stop();
      const next = new JsonCampaignStore(file);
      expect(next.acquire()).toBe(true);
      next.release();
    } finally {
      vi.useRealTimers();
    }
  });
});
