import { describe, expect, it } from "vitest";
import { formatLocal, parseLocalAmount } from "../src/money/amounts.js";
import { WFIAT } from "../src/config/tokens.js";

const norm = (s: string) => s.replace(/\s/g, " ");

describe("parseLocalAmount", () => {
  it("1 peso = 1e18 unidades (18 decimales)", () => {
    expect(parseLocalAmount("1")).toBe(10n ** 18n);
  });

  it("acepta hasta 2 decimales con punto", () => {
    expect(parseLocalAmount("1500.25")).toBe(1500_250000000000000000n);
    expect(parseLocalAmount("0.5")).toBe(5n * 10n ** 17n);
  });

  it.each(["", "0", "-1", "1,5", "1.500,25", "1.234", "abc", "1e3", " 1", "NaN"])(
    "rechaza %j (sin ambigüedad de formato)",
    (bad) => {
      expect(() => parseLocalAmount(bad)).toThrow();
    },
  );
});

describe("formatLocal", () => {
  it("muestra pesos argentinos como los ve un usuario", () => {
    expect(norm(formatLocal(10n ** 18n, WFIAT.wARS))).toBe("$ 1,00");
    expect(norm(formatLocal(1_234_567n * 10n ** 16n, WFIAT.wARS))).toBe("$ 12.345,67");
  });

  it("nunca muestra 'wARS' ni unidades crudas", () => {
    const s = formatLocal(5n * 10n ** 18n, WFIAT.wARS);
    expect(s).not.toMatch(/wARS|e\+|000000/);
  });
});
