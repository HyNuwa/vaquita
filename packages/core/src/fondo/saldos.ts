export type Movimiento =
  | { tipo: "aporte"; monto: bigint; integrante: string | null }
  | { tipo: "gasto"; monto: bigint };
export interface ResumenSaldos { aportesIdentificados: bigint; sinAtribucion: bigint; gastado: bigint }
export interface Conciliacion { ok: boolean; diferencia: bigint }

export function resumirMovimientos(movimientos: readonly Movimiento[]): ResumenSaldos {
  const resumen: ResumenSaldos = { aportesIdentificados: 0n, sinAtribucion: 0n, gastado: 0n };
  for (const m of movimientos) {
    if (m.monto < 0n) throw new Error("El monto de un movimiento no puede ser negativo.");
    if (m.tipo === "gasto") resumen.gastado += m.monto;
    else if (m.integrante === null) resumen.sinAtribucion += m.monto;
    else resumen.aportesIdentificados += m.monto;
  }
  return resumen;
}

/** Compara con el saldo en cadena al mismo bloque. `diferencia` es lo calculado menos lo leído. */
export function conciliar(movimientos: readonly Movimiento[], saldoEnCadena: bigint): Conciliacion {
  const { aportesIdentificados, sinAtribucion, gastado } = resumirMovimientos(movimientos);
  const diferencia = aportesIdentificados + sinAtribucion - gastado - saldoEnCadena;
  return { ok: diferencia === 0n, diferencia };
}
