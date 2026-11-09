import type { Address } from "viem";
import { describe, expect, it } from "vitest";
import { esperado, estado } from "../src/fondo/cuotas.js";
import { sugerirReparto } from "../src/fondo/reparto.js";
import { conciliar, resumirMovimientos, type Movimiento } from "../src/fondo/saldos.js";

const a = "0x00000000000000000000000000000000000000aa" as Address;
const b = "0x00000000000000000000000000000000000000bb" as Address;
const c = "0x00000000000000000000000000000000000000cc" as Address;
const movs: Movimiento[] = [
  { tipo: "aporte", monto: 100n, integrante: "ana" },
  { tipo: "aporte", monto: 40n, integrante: null },
  { tipo: "aporte", monto: 10n, integrante: "beto" },
  { tipo: "gasto", monto: 30n },
];

describe("saldos", () => {
  it("separa aportes identificados, sin atribución y gastado", () => {
    expect(resumirMovimientos(movs)).toEqual({ aportesIdentificados: 110n, sinAtribucion: 40n, gastado: 30n });
    expect(resumirMovimientos([])).toEqual({ aportesIdentificados: 0n, sinAtribucion: 0n, gastado: 0n });
  });
  it("concilia cuando ingresos menos gastado es el saldo", () => {
    expect(conciliar(movs, 120n)).toEqual({ ok: true, diferencia: 0n });
  });
  it.each([[121n, -1n], [119n, 1n]])("alerta si el saldo en cadena es %s", (saldo, diferencia) => {
    const result = conciliar(movs, saldo);
    expect(result).toMatchObject({ ok: false, diferencia });
  });
  it("rechaza montos negativos", () => {
    expect(() => resumirMovimientos([{ tipo: "gasto", monto: -1n }])).toThrow();
  });
});

describe("cuotas en hora argentina", () => {
  const cuota = 5n;
  it("cuenta el mes de alta y el actual", () => {
    expect(esperado(cuota, new Date("2026-01-15T12:00:00Z"), new Date("2026-03-10T12:00:00Z"))).toBe(15n);
  });
  it("el cruce de mes usa Buenos Aires, no UTC", () => {
    const alta = new Date("2026-01-15T12:00:00Z");
    expect(esperado(cuota, alta, new Date("2026-02-01T02:59:00Z"))).toBe(5n); // 31/1 23:59 ART
    expect(esperado(cuota, alta, new Date("2026-02-01T03:00:00Z"))).toBe(10n); // 1/2 00:00 ART
  });
  it("cruza el año", () => {
    expect(esperado(cuota, new Date("2025-12-15T12:00:00Z"), new Date("2026-01-15T12:00:00Z"))).toBe(10n);
  });
  it("no espera nada antes del alta", () => {
    expect(esperado(cuota, new Date("2026-03-15T12:00:00Z"), new Date("2026-01-15T12:00:00Z"))).toBe(0n);
  });
  it("rechaza fechas inválidas y cuotas negativas", () => {
    expect(() => esperado(cuota, new Date("x"), new Date())).toThrow();
    expect(() => esperado(-1n, new Date(), new Date())).toThrow();
  });
  const alta = new Date("2026-01-15T12:00:00Z"), fecha = new Date("2026-02-15T12:00:00Z");
  it("informa sin_cuota, al_dia y pendiente", () => {
    expect(estado(0n, alta, fecha, 0n)).toBe("sin_cuota");
    expect(estado(cuota, alta, fecha, 10n)).toBe("al_dia");
    expect(estado(cuota, alta, fecha, 11n)).toBe("al_dia");
    expect(estado(cuota, alta, fecha, 9n)).toBe("pendiente");
  });
});

describe("sugerirReparto", () => {
  const suma = (filas: readonly { monto: bigint }[]) => filas.reduce((t, f) => t + f.monto, 0n);
  it("reparte en proporción", () => {
    expect(sugerirReparto(100n, [{ direccion: a, aporte: 3n }, { direccion: b, aporte: 1n }])).toEqual([{ destino: a, monto: 75n }, { destino: b, monto: 25n }]);
  });
  it("da el resto al mayor aporte", () => {
    expect(sugerirReparto(10n, [{ direccion: a, aporte: 1n }, { direccion: b, aporte: 2n }])).toEqual([{ destino: a, monto: 3n }, { destino: b, monto: 7n }]);
  });
  it("con empate da el resto a la dirección menor", () => {
    expect(sugerirReparto(10n, [{ direccion: b, aporte: 1n }, { direccion: a, aporte: 1n }, { direccion: c, aporte: 1n }]))
      .toEqual([{ destino: a, monto: 4n }, { destino: b, monto: 3n }, { destino: c, monto: 3n }]);
  });
  it("devuelve lista vacía sin aportes identificados", () => {
    expect(sugerirReparto(100n, [])).toEqual([]);
    expect(sugerirReparto(100n, [{ direccion: a, aporte: 0n }])).toEqual([]);
  });
  it("omite las filas en cero sin romper la suma", () => {
    const filas = sugerirReparto(1n, [{ direccion: a, aporte: 1n }, { direccion: b, aporte: 1000n }]);
    expect(filas).toEqual([{ destino: b, monto: 1n }]);
  });
  it("une direcciones repetidas sin importar mayúsculas", () => {
    const upper = `0x${a.slice(2).toUpperCase()}` as Address;
    expect(sugerirReparto(9n, [{ direccion: a, aporte: 1n }, { direccion: upper, aporte: 2n }])).toEqual([{ destino: a, monto: 9n }]);
  });
  it("rechaza saldos o aportes negativos", () => {
    expect(() => sugerirReparto(-1n, [])).toThrow();
    expect(() => sugerirReparto(1n, [{ direccion: a, aporte: -1n }])).toThrow();
  });
  it("mantiene la invariante con entradas aleatorias reproducibles", () => {
    let seed = 0x2f6e2b1;
    const next = (max: number) => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed % max; };
    for (let round = 0; round < 500; round++) {
      const aportes = Array.from({ length: 1 + next(20) }, (_, i) => ({
        direccion: `0x${(i + 1).toString(16).padStart(40, "0")}` as Address, aporte: BigInt(next(1_000_000)) * 10n ** BigInt(next(19)) + 1n }));
      const saldo = BigInt(next(1_000_000_000)) * 10n ** BigInt(next(19));
      const filas = sugerirReparto(saldo, aportes);
      expect(suma(filas)).toBe(saldo);
      expect(filas.every((f) => f.monto > 0n)).toBe(true);
    }
  });
});
