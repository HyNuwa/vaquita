type Phase = "contratos de referencia" | "financiar cuentas" | "crear fondo" | "crear módulo" | "financiar token" | "avanzar tiempo";

/** Solo muestra etiquetas controladas; errores externos pueden contener datos sensibles. */
export async function forkStep<T>(phase: Phase, run: () => Promise<T>): Promise<T> {
  try { return await run(); }
  catch (error) {
    const timeout = error instanceof Error && (error.name === "TimeoutError" || error.cause instanceof Error && error.cause.name === "TimeoutError");
    throw new Error(`Falló la fase de fork: ${phase}${timeout ? " (timeout)" : ""}.`);
  }
}
