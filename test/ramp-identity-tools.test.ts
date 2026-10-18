import { describe, expect, it } from "vitest";
import { decodeFunctionData, type Hex } from "viem";
import { buildRampUrl } from "../src/ramp/ripio.js";
import { buildRegisterCalldata, IDENTITY_REGISTRY_ABI, buildAgentCard } from "../src/identity/erc8004.js";
import { pagarToolSchema, parsePagarInput } from "../src/agent/tools.js";
import { MAMA } from "./helpers.js";

describe("ramp.ripio.com", () => {
  it("reproduce el ejemplo oficial de on-ramp wARS en Celo", () => {
    const url = buildRampUrl({ mode: "onramp", token: "wARS", amount: "10000", address: MAMA });
    expect(url).toBe(`https://ramp.ripio.com/?country=AR&chain=42220&token=WARS&amount=10000&address=${MAMA}`);
  });

  it("off-ramp usa /offramp", () => {
    expect(buildRampUrl({ mode: "offramp", token: "wARS", amount: "500", address: MAMA })).toMatch(
      /^https:\/\/ramp\.ripio\.com\/offramp\?country=AR&chain=42220/,
    );
  });

  it("valida la dirección", () => {
    expect(() => buildRampUrl({ mode: "onramp", token: "wARS", amount: "1", address: "0x123" as Hex })).toThrow();
  });
});

describe("ERC-8004", () => {
  it("codifica register(agentURI)", () => {
    const data = buildRegisterCalldata("https://ejemplo.com/agent.json");
    const d = decodeFunctionData({ abi: IDENTITY_REGISTRY_ABI, data });
    expect(d.functionName).toBe("register");
    expect(d.args).toEqual(["https://ejemplo.com/agent.json"]);
  });

  it("solo acepta URIs https, ipfs o data", () => {
    expect(() => buildRegisterCalldata("http://inseguro.com/a.json")).toThrow();
    expect(() => buildRegisterCalldata("ipfs://bafy...")).not.toThrow();
  });

  it("arma el agent card con el tipo de registro v1", () => {
    const card = buildAgentCard({ name: "Agente", description: "d", web: "https://x.com" });
    expect(card.type).toBe("https://eips.ethereum.org/EIPS/eip-8004#registration-v1");
    expect(card.active).toBe(true);
  });
});

describe("herramienta 'pagar' para el LLM", () => {
  const aliases = ["mama", "alquiler"];

  it("el schema ofrece solo los alias permitidos, nunca direcciones", () => {
    const s = pagarToolSchema(aliases);
    expect(s.input_schema.properties.destinatario.enum).toEqual(aliases);
    expect(JSON.stringify(s)).not.toMatch(/0x[0-9a-fA-F]{40}/);
  });

  it("rechaza una dirección inyectada como destinatario", () => {
    expect(() => parsePagarInput({ destinatario: MAMA, monto: "1", motivo: "x" }, aliases)).toThrow();
  });

  it("rechaza campos extra (el LLM no puede pasar feeCurrency, to, etc.)", () => {
    expect(() => parsePagarInput({ destinatario: "mama", monto: "1", motivo: "x", to: MAMA }, aliases)).toThrow();
  });

  it("acepta una propuesta válida", () => {
    expect(parsePagarInput({ destinatario: "mama", monto: "1500.50", motivo: "cumple" }, aliases)).toEqual({
      token: "wARS",
      recipient: "mama",
      amount: "1500.50",
      reason: "cumple",
    });
  });
});
