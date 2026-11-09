import { pad, type Address, type Hex } from "viem";
import { describe, expect, it } from "vitest";
import { WFIAT } from "../src/config/tokens.js";
import { CLAVE_PRESUPUESTO, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO, ROL_VAQUI } from "../src/fondo/constantes.js";
import { condicionesVaqui } from "../src/fondo/roles.js";
import type { EstadoEfectivo } from "../src/fondo/verificacion-eventos.js";
import { compararPermisos } from "../src/fondo/verificacion-politica.js";

const safe = "0x1111111111111111111111111111111111111111" as const;
const wallet = "0x3333333333333333333333333333333333333333" as const;
const r1 = "0x7777777777777777777777777777777777777777" as const;
const r2 = "0x8888888888888888888888888888888888888888" as const;
const stranger = "0x9999999999999999999999999999999999999999" as const;
const token = WFIAT.wARS.address;
const TRANSFER = "0xa9059cbb" as const;
const APPROVE = "0x095ea7b3" as const;
const OTHER_ROLE = pad("0x02", { size: 32 });
const k = (...parts: string[]) => parts.join("|").toLowerCase();
const politica = { safe, walletOperativa: wallet as Address, destinatarios: [r1, r2] as readonly Address[] };
const budget = { balance: PRESUPUESTO_PERIODO, maxRefill: PRESUPUESTO_PERIODO, refill: PRESUPUESTO_PERIODO, period: PERIODO_SEGUNDOS, timestamp: 0n };

function estado(): EstadoEfectivo {
  return {
    configuracion: { owner: safe, avatar: safe, target: safe },
    miembros: new Map([[wallet.toLowerCase(), new Set<Hex>([ROL_VAQUI])]]),
    objetivos: new Map([[k(ROL_VAQUI, token), { clearance: "function", options: 0 }]]),
    funciones: new Map([[k(ROL_VAQUI, token, TRANSFER), { tipo: "condicionada", options: 0, condiciones: condicionesVaqui([r1, r2]) }]]),
    defaults: new Map(),
    unwrappers: new Map(),
    presupuestos: new Map([[CLAVE_PRESUPUESTO, { ...budget }]]),
    modulos: new Set([wallet.toLowerCase()]),
  };
}
const fn = (e: EstadoEfectivo) => e.funciones.get(k(ROL_VAQUI, token, TRANSFER)) as Extract<ReturnType<EstadoEfectivo["funciones"]["get"]>, { tipo: "condicionada" }>;

describe("compararPermisos", () => {
  it("aprueba exactamente la política esperada", () => {
    expect(compararPermisos(estado(), politica)).toBeNull();
  });

  it("no depende del orden de los destinatarios", () => {
    expect(compararPermisos(estado(), { ...politica, destinatarios: [r2, r1] })).toBeNull();
  });

  it("acepta que la wallet operativa no figure entre los módulos, sin depender de ese evento", () => {
    const e = estado();
    e.modulos.clear();
    expect(compararPermisos(e, politica)).toBeNull();
  });

  const casos: [string, (e: EstadoEfectivo) => void][] = [
    ["owner ajeno", (e) => { e.configuracion.owner = stranger; }],
    ["avatar ajeno", (e) => { e.configuracion.avatar = stranger; }],
    ["target ajeno", (e) => { e.configuracion.target = stranger; }],
    ["wallet operativa sin rol", (e) => { e.miembros.clear(); }],
    ["otro miembro con el rol", (e) => { e.miembros.set(stranger.toLowerCase(), new Set<Hex>([ROL_VAQUI])); }],
    ["rol adicional en la wallet", (e) => { e.miembros.get(wallet.toLowerCase())!.add(OTHER_ROLE); }],
    ["otra wallet en lugar de la operativa", (e) => { e.miembros = new Map([[stranger.toLowerCase(), new Set<Hex>([ROL_VAQUI])]]); }],
    ["objetivo ausente", (e) => { e.objetivos.clear(); }],
    ["objetivo con acceso total", (e) => { e.objetivos.set(k(ROL_VAQUI, token), { clearance: "target", options: 0 }); }],
    ["objetivo adicional", (e) => { e.objetivos.set(k(ROL_VAQUI, stranger), { clearance: "function", options: 0 }); }],
    ["objetivo en otro rol", (e) => { e.objetivos.set(k(OTHER_ROLE, token), { clearance: "function", options: 0 }); }],
    ["función ausente", (e) => { e.funciones.clear(); }],
    ["función latente adicional", (e) => { e.funciones.set(k(ROL_VAQUI, token, APPROVE), { tipo: "libre", options: 0 }); }],
    ["función libre en lugar de condicionada", (e) => { e.funciones.set(k(ROL_VAQUI, token, TRANSFER), { tipo: "libre", options: 0 }); }],
    ["función con opciones de ejecución", (e) => { fn(e).options = 1 as never; }],
    ["destinatario agregado", (e) => { e.funciones.set(k(ROL_VAQUI, token, TRANSFER), { tipo: "condicionada", options: 0, condiciones: condicionesVaqui([r1, r2, stranger]) }); }],
    ["destinatario quitado", (e) => { e.funciones.set(k(ROL_VAQUI, token, TRANSFER), { tipo: "condicionada", options: 0, condiciones: condicionesVaqui([r1]) }); }],
    ["tope por transferencia distinto", (e) => {
      const condiciones = condicionesVaqui([r1, r2]).map((c) => c.operator === 18 ? { ...c, compValue: pad("0x01", { size: 32 }) } : c);
      e.funciones.set(k(ROL_VAQUI, token, TRANSFER), { tipo: "condicionada", options: 0, condiciones });
    }],
    ["condiciones en otro orden", (e) => {
      e.funciones.set(k(ROL_VAQUI, token, TRANSFER), { tipo: "condicionada", options: 0, condiciones: [...condicionesVaqui([r1, r2])].reverse() });
    }],
    ["rol por defecto", (e) => { e.defaults.set(stranger.toLowerCase(), ROL_VAQUI); }],
    ["adaptador de unwrap", (e) => { e.unwrappers.set(k(token, TRANSFER), stranger); }],
    ["presupuesto ausente", (e) => { e.presupuestos.clear(); }],
    ["presupuesto adicional", (e) => { e.presupuestos.set(OTHER_ROLE, { ...budget }); }],
    ["refill distinto", (e) => { e.presupuestos.set(CLAVE_PRESUPUESTO, { ...budget, refill: 1n }); }],
    ["maxRefill distinto", (e) => { e.presupuestos.set(CLAVE_PRESUPUESTO, { ...budget, maxRefill: PRESUPUESTO_PERIODO + 1n }); }],
    ["período distinto", (e) => { e.presupuestos.set(CLAVE_PRESUPUESTO, { ...budget, period: 1n }); }],
    ["saldo fijado sobre el presupuesto", (e) => { e.presupuestos.set(CLAVE_PRESUPUESTO, { ...budget, balance: PRESUPUESTO_PERIODO + 1n }); }],
    ["módulo ajeno habilitado", (e) => { e.modulos.add(stranger.toLowerCase()); }],
  ];
  it.each(casos)("rechaza %s", (_name, change) => {
    const e = estado();
    change(e);
    expect(typeof compararPermisos(e, politica)).toBe("string");
  });

  it.each([
    ["sin destinatarios", { ...politica, destinatarios: [] }],
    ["con un destinatario inválido", { ...politica, destinatarios: ["0x12" as Address] }],
    ["con más destinatarios que el máximo", { ...politica, destinatarios: Array.from({ length: 21 }, (_, i) => pad(`0x${(i + 1).toString(16).padStart(2, "0")}`, { size: 20 })) as Address[] }],
  ])("rechaza una política %s", (_name, invalid) => {
    expect(typeof compararPermisos(estado(), invalid)).toBe("string");
  });

  it("no expone cuentas en el detalle", () => {
    const e = estado();
    e.miembros.clear();
    expect(compararPermisos(e, politica)).not.toMatch(/0x/);
  });
});
