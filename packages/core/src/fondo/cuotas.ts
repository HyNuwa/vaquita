export type EstadoCuota = "al_dia" | "pendiente" | "sin_cuota";

const formato = new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "numeric" });

function mesAbsoluto(fecha: Date): number {
  if (Number.isNaN(fecha.getTime())) throw new Error("La fecha no es válida.");
  const parts = formato.formatToParts(fecha);
  const value = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return value("year") * 12 + value("month");
}

/** Monto esperado desde el mes de alta hasta el de `fecha`, ambos incluidos, en hora argentina. */
export function esperado(cuota: bigint, altaIntegrante: Date, fecha: Date): bigint {
  if (cuota < 0n) throw new Error("La cuota no puede ser negativa.");
  const meses = mesAbsoluto(fecha) - mesAbsoluto(altaIntegrante);
  return fecha < altaIntegrante || meses < 0 ? 0n : BigInt(meses + 1) * cuota;
}

/** `aportado` sólo incluye aportes identificados: lo sin atribución nunca cuenta para una cuota. */
export function estado(cuota: bigint, altaIntegrante: Date, fecha: Date, aportado: bigint): EstadoCuota {
  if (cuota === 0n) return "sin_cuota";
  return aportado >= esperado(cuota, altaIntegrante, fecha) ? "al_dia" : "pendiente";
}
