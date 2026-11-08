import { expect, it } from "vitest";
import { forkStep } from "./helpers/fork-step.js";

it("informa la fase fallida sin exponer errores externos", async () => {
  await expect(forkStep("contratos de referencia", async () => {
    throw new DOMException("private URL and data", "TimeoutError");
  })).rejects.toThrow("Falló la fase de fork: contratos de referencia (timeout).");
});

it("conserva el resultado de una fase exitosa", async () => {
  expect(await forkStep("contratos de referencia", async () => 42)).toBe(42);
});
