import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { AgentLog, AgentLogError } from "../src/compra/agent-log.js";
import { LOOP_RULES, decide, fundsEpisodes, trackFunds, type FundsRecord, type LoopSnapshot } from "../src/compra/loop.js";
import { compareOffers, tallyVotes, type Offer } from "../src/compra/offers.js";
import { selectBuyers, type BuyerFunds } from "../src/compra/selection.js";
import { buildState, isConsistent, isOpenAt, type CampaignEvent } from "../src/compra/state.js";
import { CampaignTermsError, commitmentCap, validateTerms, type CampaignTerms } from "../src/compra/terms.js";
import { ONE } from "./helpers.js";

const terms = (over: Partial<CampaignTerms> = {}): CampaignTerms => ({
  id: "c1",
  supplier: "proveedor",
  unitPrice: 1000n * ONE,
  fee: 0n,
  minUnits: 2,
  maxUnits: 3,
  deadline: 1_000_000,
  buyers: ["ana", "beto", "caro", "dani"],
  ...over,
});

const rich: BuyerFunds = { balance: 2000n * ONE, allowance: 1000n * ONE };
const fundsOf = (entries: Record<string, BuyerFunds>) => new Map(Object.entries(entries));

describe("validateTerms", () => {
  it("acepta condiciones válidas", () => {
    expect(() => validateTerms(terms())).not.toThrow();
  });

  it("acepta justo el tope e impide pasarlo, incluido el cargo", () => {
    const cap = commitmentCap();
    expect(() => validateTerms(terms({ unitPrice: cap }))).not.toThrow();
    expect(() => validateTerms(terms({ unitPrice: cap + 1n }))).toThrow(CampaignTermsError);
    expect(() => validateTerms(terms({ unitPrice: cap, fee: 1n, feeRecipient: "agente" }))).toThrow(/tope/);
  });

  it.each<[string, Partial<CampaignTerms>]>([
    ["precio cero", { unitPrice: 0n }],
    ["cargo sin destinatario", { fee: ONE }],
    ["destinatario sin cargo", { feeRecipient: "agente" }],
    ["cargo al mismo destino", { fee: ONE, feeRecipient: "proveedor" }],
    ["mínimo cero", { minUnits: 0 }],
    ["máximo menor al mínimo", { minUnits: 3, maxUnits: 2 }],
    ["compradores repetidos", { buyers: ["ana", "ana", "beto"] }],
    ["proveedor en la lista", { buyers: ["ana", "proveedor"] }],
    ["destinatario del cargo en la lista", { fee: ONE, feeRecipient: "ana" }],
    ["lista menor al mínimo", { buyers: ["ana"] }],
    ["fecha inválida", { deadline: 0 }],
  ])("rechaza %s", (_name, over) => {
    expect(() => validateTerms(terms(over))).toThrow(CampaignTermsError);
  });
});

describe("selectBuyers", () => {
  const active = new Set(["ana", "beto", "caro", "dani"]);

  it("selecciona en el orden fijo de la lista y corta en el máximo", () => {
    const r = selectBuyers(terms(), active, fundsOf({ dani: rich, caro: rich, beto: rich, ana: rich }));
    expect(r.selected).toEqual(["ana", "beto", "caro"]);
    expect(r.excluded).toEqual([{ buyer: "dani", reason: "OVER_QUOTA" }]);
    expect(r.meetsMinimum).toBe(true);
  });

  it("saltea sin fondos o sin autorización, y el siguiente ocupa su lugar", () => {
    const r = selectBuyers(
      terms(),
      active,
      fundsOf({
        ana: { balance: 999n * ONE, allowance: 1000n * ONE },
        beto: { balance: 2000n * ONE, allowance: 999n * ONE },
        caro: rich,
        dani: rich,
      }),
    );
    expect(r.selected).toEqual(["caro", "dani"]);
    expect(r.excluded).toEqual([
      { buyer: "ana", reason: "INSUFFICIENT_BALANCE" },
      { buyer: "beto", reason: "INSUFFICIENT_ALLOWANCE" },
    ]);
  });

  it("cuenta el cargo en lo que hace falta", () => {
    const r = selectBuyers(terms({ fee: ONE, feeRecipient: "agente" }), new Set(["ana"]), fundsOf({ ana: rich }));
    expect(r.selected).toEqual([]);
    expect(r.excluded).toEqual([{ buyer: "ana", reason: "INSUFFICIENT_ALLOWANCE" }]);
  });

  it("no considera a quien no está activo", () => {
    const r = selectBuyers(terms(), new Set(["beto"]), fundsOf({ ana: rich, beto: rich }));
    expect(r.selected).toEqual(["beto"]);
    expect(r.meetsMinimum).toBe(false);
  });

  it("con el cupo lleno, una lectura fallida posterior no bloquea", () => {
    const r = selectBuyers(terms({ minUnits: 1, maxUnits: 1 }), active, fundsOf({ ana: rich, beto: { balance: null, allowance: null } }));
    expect(r.selected).toEqual(["ana"]);
    expect(r.unknown).toEqual([]);
    expect(r.excluded.map((e) => e.reason)).toEqual(["OVER_QUOTA", "OVER_QUOTA", "OVER_QUOTA"]);
    expect(r.meetsMinimum).toBe(true);
  });

  it("una lectura fallida no excluye ni deja ejecutar, aunque se cubra el mínimo", () => {
    const r = selectBuyers(
      terms(),
      active,
      fundsOf({ ana: { balance: null, allowance: 1000n * ONE }, beto: rich, caro: rich }),
    );
    expect(r.unknown).toEqual(["ana", "dani"]);
    expect(r.excluded).toEqual([]);
    expect(r.selected).toEqual(["beto", "caro"]);
    expect(r.meetsMinimum).toBe(false);
  });
});

describe("buildState", () => {
  let n = 0;
  const ev = (type: CampaignEvent["type"], buyer: string | undefined, blockNumber: number): CampaignEvent => ({
    type,
    buyer,
    blockNumber,
    campaignId: "c1",
    txHash: `0x${++n}`,
    logIndex: 0,
  });

  it("no cambia si un evento llega repetido o desordenado", () => {
    const commit = ev("COMMITTED", "ana", 10);
    const cancel = ev("CANCELLED", "ana", 11);
    const s = buildState("c1", [cancel, commit, commit, cancel]);
    expect([...s.active]).toEqual([]);
    expect([...s.cancelled]).toEqual(["ana"]);
    expect(s.anomalies).toEqual([]);
  });

  it("cancelar es irreversible", () => {
    const s = buildState("c1", [ev("COMMITTED", "ana", 1), ev("CANCELLED", "ana", 2), ev("COMMITTED", "ana", 3)]);
    expect(s.active.has("ana")).toBe(false);
    expect(s.anomalies).toHaveLength(1);
  });

  const inTx = (txHash: string, logIndex: number, type: CampaignEvent["type"], buyer?: string): CampaignEvent => ({
    type, buyer, txHash, logIndex, blockNumber: 5, campaignId: "c1",
  });

  it("registra cada compra una sola vez y solo de activos, dentro de la tx de ejecución", () => {
    const s = buildState("c1", [
      ev("COMMITTED", "ana", 1),
      inTx("0xexec", 0, "PURCHASE_CONFIRMED", "ana"),
      inTx("0xexec", 1, "PURCHASE_CONFIRMED", "ana"),
      inTx("0xexec", 2, "PURCHASE_CONFIRMED", "beto"),
      inTx("0xexec", 3, "EXECUTED"),
    ]);
    expect([...s.purchased]).toEqual(["ana"]);
    expect(s.status).toBe("EXECUTED");
    expect(s.anomalies).toHaveLength(2);
    expect(isConsistent(s)).toBe(false);
  });

  it("no acepta una compra sin cierre en la misma tx ni después de cerrar", () => {
    const sinCierre = buildState("c1", [ev("COMMITTED", "ana", 1), ev("PURCHASE_CONFIRMED", "ana", 2), ev("EXECUTED", undefined, 3)]);
    expect(sinCierre.purchased.size).toBe(0);
    expect(sinCierre.anomalies).toHaveLength(1);

    const vencida = buildState("c1", [ev("COMMITTED", "ana", 1), ev("EXPIRED", undefined, 2), ev("PURCHASE_CONFIRMED", "ana", 3)]);
    expect(vencida.purchased.size).toBe(0);
    expect(vencida.anomalies).toHaveLength(1);
  });

  it("no elige por orden de llegada entre versiones contradictorias de un evento", () => {
    const base = { campaignId: "c1", txHash: "0xdup", logIndex: 0, blockNumber: 5 };
    const a: CampaignEvent = { ...base, type: "COMMITTED", buyer: "ana" };
    const b: CampaignEvent = { ...base, type: "COMMITTED", buyer: "beto" };
    for (const events of [[a, b], [b, a]]) {
      const s = buildState("c1", events);
      expect(s.active.size).toBe(0);
      expect(s.conflicts).toEqual(["0xdup:0"]);
      expect(isConsistent(s)).toBe(false);
    }
  });

  it("ignora otras campañas y lo posterior a una reorganización", () => {
    const other = { ...ev("COMMITTED", "zoe", 1), campaignId: "c2" };
    const s = buildState("c1", [other, ev("COMMITTED", "ana", 5), ev("EXECUTED", undefined, 9)], { upToBlock: 5 });
    expect([...s.active]).toEqual(["ana"]);
    expect(s.status).toBe("OPEN");
  });

  it("no acepta compromisos con la campaña cerrada", () => {
    const s = buildState("c1", [ev("EXPIRED", undefined, 1), ev("COMMITTED", "ana", 2), ev("EXECUTED", undefined, 3)]);
    expect(s.status).toBe("EXPIRED");
    expect(s.active.size).toBe(0);
    expect(s.anomalies).toHaveLength(2);
  });

  it("después del límite ya no está abierta, aunque nadie la haya vencido", () => {
    expect(isOpenAt("OPEN", 100, 99)).toBe(true);
    expect(isOpenAt("OPEN", 100, 100)).toBe(false);
    expect(isOpenAt("EXECUTED", 100, 1)).toBe(false);
  });
});

describe("compareOffers", () => {
  const offer = (id: string, price: bigint, over: Partial<Offer> = {}): Offer => ({
    id,
    supplier: `s-${id}`,
    unitPrice: price * ONE,
    minUnits: 1,
    maxUnits: 100,
    validUntil: 500,
    ...over,
  });

  it("ordena por precio y rechaza con motivo", () => {
    const r = compareOffers({ units: 10, maxUnitPrice: 1000n * ONE }, [
      offer("cara", 900n),
      offer("barata", 800n),
      offer("vencida", 100n, { validUntil: 100 }),
      offer("fuera", 1001n),
      offer("chica", 100n, { maxUnits: 5 }),
    ], 100);
    expect(r.ranking.map((o) => o.id)).toEqual(["barata", "cara"]);
    expect(r.rejected).toEqual([
      { offerId: "vencida", reason: "EXPIRED" },
      { offerId: "fuera", reason: "OVER_BUDGET" },
      { offerId: "chica", reason: "UNITS_NOT_COVERED" },
    ]);
  });

  it("rechaza ofertas mal formadas e ids repetidos, sin importar el precio", () => {
    const r = compareOffers({ units: 1, maxUnitPrice: 1000n * ONE }, [
      offer("negativa", -1n),
      offer("cero", 0n),
      offer("rango", 10n, { minUnits: 5, maxUnits: 2 }),
      offer("doble", 10n),
      offer("doble", 20n),
      offer("buena", 500n),
    ], 0);
    expect(r.ranking.map((o) => o.id)).toEqual(["buena"]);
    expect(r.rejected.map((x) => x.reason)).toEqual(["INVALID", "INVALID", "INVALID", "DUPLICATE_ID", "DUPLICATE_ID"]);
  });

  it("con igual precio, el orden no depende de cómo llegaron", () => {
    const a = offer("a", 800n);
    const b = offer("b", 800n, { validUntil: 900 });
    const need = { units: 1, maxUnitPrice: 1000n * ONE };
    expect(compareOffers(need, [a, b], 0).ranking.map((o) => o.id)).toEqual(["b", "a"]);
    expect(compareOffers(need, [b, a], 0).ranking.map((o) => o.id)).toEqual(["b", "a"]);
  });
});

describe("tallyVotes", () => {
  const eligible = new Set(["ana", "beto", "caro"]);
  const offers = new Set(["x", "y"]);

  it("no da resultado antes del cierre", () => {
    expect(tallyVotes(eligible, offers, [], 100, 99)).toEqual({ status: "OPEN" });
  });

  it("vale el primer voto de cada miembro; lo ajeno o tardío no cuenta", () => {
    const r = tallyVotes(eligible, offers, [
      { member: "ana", offerId: "y", castAt: 2 },
      { member: "ana", offerId: "x", castAt: 1 },
      { member: "beto", offerId: "x", castAt: 3 },
      { member: "zoe", offerId: "y", castAt: 4 },
      { member: "caro", offerId: "y", castAt: 100 },
      { member: "caro", offerId: "z", castAt: 5 },
    ], 100, 100);
    expect(r).toEqual({ status: "WINNER", offerId: "x", counts: new Map([["x", 2]]) });
  });

  it("dos opciones del mismo miembro en el mismo instante vuelven a la comunidad, en cualquier orden", () => {
    const ballots = [
      { member: "ana", offerId: "x", castAt: 1 },
      { member: "ana", offerId: "y", castAt: 1 },
      { member: "beto", offerId: "x", castAt: 2 },
      { member: "caro", offerId: "y", castAt: 2 },
    ];
    for (const list of [ballots, [...ballots].reverse()]) {
      const r = tallyVotes(eligible, offers, list, 100, 100);
      expect(r.status).toBe("NO_DECISION");
      if (r.status === "NO_DECISION") expect(r.conflicted).toEqual(["ana"]);
    }
  });

  it.each(["__proto__", "constructor", "toString"])("cuenta bien una oferta llamada %s", (id) => {
    const r = tallyVotes(eligible, new Set([id, "y"]), [
      { member: "ana", offerId: id, castAt: 1 },
      { member: "beto", offerId: id, castAt: 2 },
      { member: "caro", offerId: "y", castAt: 3 },
    ], 100, 100);
    expect(r.status === "WINNER" && r.offerId).toBe(id);
  });

  it("el empate y la falta de votos vuelven a la comunidad", () => {
    expect(tallyVotes(eligible, offers, [
      { member: "ana", offerId: "x", castAt: 1 },
      { member: "beto", offerId: "y", castAt: 2 },
    ], 100, 100).status).toBe("NO_DECISION");
    expect(tallyVotes(eligible, offers, [], 100, 100).status).toBe("NO_DECISION");
  });
});

describe("decide", () => {
  const deadline = 1_000_000;
  const farFromDeadline = deadline - 100 * 3600;

  const snapshot = (over: Partial<LoopSnapshot> = {}): LoopSnapshot => ({
    campaignId: "c1",
    now: farFromDeadline,
    status: "OPEN",
    deadline,
    minUnits: 2,
    maxUnits: 3,
    selection: { selected: [], excluded: [], unknown: [], meetsMinimum: false },
    stateConsistent: true,
    pendingSuppliers: [],
    gasBudgetOk: true,
    done: {},
    ...over,
  });
  const selected = (buyers: string[], minUnits = 2) => ({
    selected: buyers,
    excluded: [],
    unknown: [],
    meetsMinimum: buyers.length >= minUnits,
  });
  const types = (s: LoopSnapshot) => decide(s).actions.map((a) => a.type);

  it("ejecuta sin esperar cuando se llena el cupo", () => {
    expect(decide(snapshot({ selection: selected(["a", "b", "c"]) })).actions).toEqual([
      { type: "EXECUTE", key: "execute", units: 3 },
    ]);
  });

  it("con el mínimo, espera la ventana final y deja el motivo", () => {
    const early = decide(snapshot({ selection: selected(["a", "b"]) }));
    expect(early.actions).toEqual([]);
    expect(early.skipped).toEqual([{ rule: "EXECUTE", code: "WAITING_FINAL_WINDOW" }]);

    const late = snapshot({ selection: selected(["a", "b"]), now: deadline - LOOP_RULES.executionWindowSeconds });
    expect(types(late)).toEqual(["EXECUTE"]);
  });

  it("no ejecuta en el instante límite ni después", () => {
    const s = snapshot({ selection: selected(["a", "b", "c"]), now: deadline });
    expect(types(s)).toEqual(["NOTIFY_EXPIRED"]);
  });

  it("no ejecuta si una lectura falló, aunque haya cupo", () => {
    const d = decide(snapshot({ selection: { ...selected(["a", "b", "c"]), unknown: ["d"], meetsMinimum: false } }));
    expect(d.actions).toEqual([]);
    expect(d.skipped[0]?.code).toBe("READ_FAILED");
  });

  it("no ejecuta sin presupuesto de gas", () => {
    const d = decide(snapshot({ selection: selected(["a", "b", "c"]), gasBudgetOk: false }));
    expect(d.actions.map((a) => a.type)).toEqual(["NOTIFY_NO_GAS_BUDGET"]);
    expect(d.skipped[0]?.code).toBe("NO_GAS_BUDGET");
    expect(types(snapshot({ selection: selected(["a", "b", "c"]), gasBudgetOk: false, done: { "notify-no-gas-budget": 1 } }))).toEqual([]);
  });

  it("no ejecuta fuera del mínimo y el máximo, aunque la selección diga otra cosa", () => {
    const window = deadline - LOOP_RULES.executionWindowSeconds;
    const bajo = decide(snapshot({ now: window, minUnits: 3, selection: { ...selected(["a", "b"]), meetsMinimum: true } }));
    expect(bajo.actions.map((a) => a.type)).not.toContain("EXECUTE");
    expect(bajo.skipped[0]?.code).toBe("BELOW_MINIMUM");

    const alto = decide(snapshot({ now: window, minUnits: 1, maxUnits: 1, selection: selected(["a", "b"], 1) }));
    expect(alto.actions).toEqual([]);
    expect(alto.skipped[0]?.code).toBe("OVER_MAXIMUM");
  });

  it("no ejecuta si los eventos de la campaña no cierran", () => {
    const d = decide(snapshot({ selection: selected(["a", "b", "c"]), stateConsistent: false }));
    expect(d.actions).toEqual([]);
    expect(d.skipped[0]?.code).toBe("STATE_INCONSISTENT");
  });

  it("reintenta hasta el límite, avisa una vez y se detiene", () => {
    const base = { selection: selected(["a", "b", "c"]) };
    expect(types(snapshot({ ...base, done: { execute: 2 } }))).toEqual(["EXECUTE"]);
    expect(types(snapshot({ ...base, done: { execute: 3 } }))).toEqual(["NOTIFY_EXECUTION_STOPPED"]);
    expect(types(snapshot({ ...base, done: { execute: 3, "notify-execution-stopped": 1 } }))).toEqual([]);
  });

  it("avisa el faltante en cada umbral, una sola vez", () => {
    const at48 = snapshot({ now: deadline - 48 * 3600, selection: selected(["a"]) });
    expect(decide(at48).actions).toEqual([{ type: "NOTIFY_SHORTFALL", key: "notify-shortfall:0", missing: 1 }]);
    expect(types({ ...at48, done: { "notify-shortfall:0": 1 } })).toEqual([]);

    const at24 = { ...at48, now: deadline - 24 * 3600, done: { "notify-shortfall:0": 1 } };
    expect(decide(at24).actions.map((a) => a.key)).toEqual(["notify-shortfall:1"]);
  });

  it("si arranca tarde, manda un solo aviso de faltante", () => {
    const late = snapshot({ now: deadline - 3600 * 10, selection: selected(["a"]) });
    expect(decide(late).actions.map((a) => a.key)).toEqual(["notify-shortfall:1"]);
  });

  it("le reclama una vez al proveedor, recién pasado el plazo", () => {
    const requestedAt = farFromDeadline - LOOP_RULES.supplierReminderAfterSeconds;
    const pendingSuppliers = [
      { supplier: "viejo", requestedAt },
      { supplier: "nuevo", requestedAt: requestedAt + 1 },
    ];
    expect(decide(snapshot({ pendingSuppliers })).actions).toEqual([
      { type: "REMIND_SUPPLIER", key: "remind-supplier:viejo", supplier: "viejo" },
    ]);
    expect(types(snapshot({ pendingSuppliers, done: { "remind-supplier:viejo": 1 } }))).toEqual([]);
  });

  it("publica la comparación al cerrar las ofertas, sin elegir", () => {
    expect(types(snapshot({ offersCloseAt: farFromDeadline }))).toEqual(["PUBLISH_COMPARISON"]);
    expect(types(snapshot({ offersCloseAt: farFromDeadline + 1 }))).toEqual([]);
  });

  it("avisa solo al comprador sin fondos, no al que quedó fuera de cupo", () => {
    const selection = {
      ...selected([]),
      excluded: [
        { buyer: "ana", reason: "INSUFFICIENT_BALANCE" as const },
        { buyer: "beto", reason: "OVER_QUOTA" as const },
      ],
    };
    expect(decide(snapshot({ selection })).actions).toEqual([
      { type: "NOTIFY_BUYER_FUNDS", key: "notify-funds:ana:INSUFFICIENT_BALANCE:0", buyer: "ana", reason: "INSUFFICIENT_BALANCE" },
    ]);
  });

  it("al ejecutarse pide la entrega una vez y no hace nada más", () => {
    const s = snapshot({ status: "EXECUTED", selection: selected(["a", "b", "c"]) });
    expect(types(s)).toEqual(["REQUEST_DELIVERY"]);
    expect(types({ ...s, done: { "request-delivery": 1 } })).toEqual([]);
  });

  it("al vencer avisa una vez", () => {
    const s = snapshot({ status: "EXPIRED" });
    expect(types(s)).toEqual(["NOTIFY_EXPIRED"]);
    expect(types({ ...s, done: { "notify-expired": 1 } })).toEqual([]);
  });
});

describe("trackFunds", () => {
  const sinSaldo = { selected: [], excluded: [{ buyer: "ana", reason: "INSUFFICIENT_BALANCE" as const }] };
  const conFondos = { selected: ["ana"], excluded: [] };

  it("avisa de nuevo si pierde fondos, los recupera y los vuelve a perder", () => {
    let records: Map<string, FundsRecord> = new Map();
    records = trackFunds(records, sinSaldo);
    expect(fundsEpisodes(records).get("ana")).toBe(0);
    records = trackFunds(records, sinSaldo);
    expect(fundsEpisodes(records).get("ana")).toBe(0);
    records = trackFunds(records, conFondos);
    records = trackFunds(records, sinSaldo);
    expect(fundsEpisodes(records).get("ana")).toBe(1);
  });

  it("sin dato nuevo no cambia el episodio", () => {
    const records = trackFunds(new Map(), sinSaldo);
    const later = trackFunds(records, { selected: [], excluded: [{ buyer: "ana", reason: "OVER_QUOTA" }] });
    expect(later.get("ana")).toEqual({ reason: "INSUFFICIENT_BALANCE", episode: 0 });
  });
});

describe("AgentLog", () => {
  const dir = mkdtempSync(join(tmpdir(), "vaquita-log-"));
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  const entry = { at: "2026-11-02T00:00:00Z", campaignId: "c1", action: "EXECUTE" as const, outcome: "DONE" as const };

  it("agrega, filtra por campaña y acepta hashes", () => {
    const log = new AgentLog(join(dir, "sub", "log.jsonl"));
    log.append({ ...entry, txHash: `0x${"a".repeat(64)}` });
    log.append({ ...entry, campaignId: "c2" });
    expect(log.read("c1")).toHaveLength(1);
    expect(log.read("nada")).toEqual([]);
  });

  it.each<[string, object]>([
    ["texto libre", { detail: "pago a ana" }],
    ["un correo como campaña", { campaignId: "ana@correo.com" }],
    ["una dirección como campaña", { campaignId: `0x${"1".repeat(40)}` }],
    ["una dirección como hash", { txHash: `0x${"1".repeat(40)}` }],
    ["una dirección rellenada a 32 bytes", { txHash: `0x${"0".repeat(24)}${"1".repeat(40)}` }],
    ["un hash con mayúsculas", { txHash: `0X${"A".repeat(64)}` }],
    ["una acción desconocida", { action: "OTRA" }],
  ])("rechaza %s", (_name, over) => {
    const log = new AgentLog(join(dir, "log2.jsonl"));
    expect(() => log.append({ ...entry, ...over } as never)).toThrow(AgentLogError);
    expect(log.read("c1")).toEqual([]);
  });
});
