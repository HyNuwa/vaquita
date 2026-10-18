import { describe, expect, it } from "vitest";
import { generatePrivateKey } from "viem/accounts";
import { loadConfig, LIVE_PHRASE } from "../src/config/env.js";
import { MAMA } from "./helpers.js";

const base = () => ({
  AGENT_PRIVATE_KEY: generatePrivateKey(),
  ATTRIBUTION_CODE: "celo_ab12cd34",
  ALLOWED_RECIPIENTS: `mama:${MAMA}`,
});

describe("loadConfig", () => {
  it("por defecto es modo ensayo", () => {
    expect(loadConfig(base()).live).toBe(false);
  });

  it.each(["true", "1", "yes", "si", " si-muevo-plata-real", "SI-MUEVO-PLATA-REAL"])(
    "LIVE_PAYMENTS=%j NO activa pagos reales",
    (v) => {
      expect(loadConfig({ ...base(), LIVE_PAYMENTS: v }).live).toBe(false);
    },
  );

  it("solo la frase exacta activa pagos reales", () => {
    expect(loadConfig({ ...base(), LIVE_PAYMENTS: LIVE_PHRASE }).live).toBe(true);
  });

  it("en modo real, un código placeholder hace fallar el arranque", () => {
    expect(() => loadConfig({ ...base(), ATTRIBUTION_CODE: "celo_xxxxxxxx", LIVE_PAYMENTS: LIVE_PHRASE })).toThrow();
  });

  it("sin código de atribución no arranca, ni siquiera en ensayo", () => {
    const { ATTRIBUTION_CODE: _omit, ...rest } = base();
    expect(() => loadConfig(rest)).toThrow(/ATTRIBUTION_CODE/);
  });

  it("rechaza claves privadas mal formadas", () => {
    expect(() => loadConfig({ ...base(), AGENT_PRIVATE_KEY: "0x1234" })).toThrow(/AGENT_PRIVATE_KEY/);
  });

  it("usa forno.celo.org y USDC por defecto", () => {
    const c = loadConfig(base());
    expect(c.rpcUrl).toBe("https://forno.celo.org");
    expect(c.feeCurrency.symbol).toBe("USDC");
  });

  it("rechaza fee currencies que no están en la allowlist (p.ej. wARS)", () => {
    expect(() => loadConfig({ ...base(), FEE_CURRENCY: "wARS" })).toThrow();
  });

  it("rechaza RPC sin https", () => {
    expect(() => loadConfig({ ...base(), CELO_RPC_URL: "http://forno.celo.org" })).toThrow();
  });
});
