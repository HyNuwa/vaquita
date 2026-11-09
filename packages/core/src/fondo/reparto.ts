import { isAddress, type Address } from "viem";

export interface AporteIntegrante { direccion: Address; aporte: bigint }
export interface FilaReparto { destino: Address; monto: bigint }

/**
 * Reparto proporcional en bigint. La suma de las filas es igual a `saldo`.
 * El resto va al mayor aporte y, si empatan, a la dirección menor. Es una sugerencia: la aprueban los responsables.
 */
export function sugerirReparto(saldo: bigint, aportes: readonly AporteIntegrante[]): FilaReparto[] {
  if (saldo < 0n) throw new Error("El saldo no puede ser negativo.");
  const unidos = new Map<string, AporteIntegrante>();
  for (const { direccion, aporte } of aportes) {
    if (aporte < 0n || !isAddress(direccion, { strict: false })) throw new Error("Revisá los aportes del reparto.");
    const key = direccion.toLowerCase();
    const previo = unidos.get(key);
    unidos.set(key, { direccion: previo?.direccion ?? direccion, aporte: (previo?.aporte ?? 0n) + aporte });
  }
  const filas = [...unidos.values()].filter((f) => f.aporte > 0n)
    .sort((x, y) => BigInt(x.direccion) < BigInt(y.direccion) ? -1 : 1);
  const total = filas.reduce((t, f) => t + f.aporte, 0n);
  if (total === 0n) return [];

  const montos = filas.map((f) => saldo * f.aporte / total);
  const repartido = montos.reduce((t, m) => t + m, 0n);
  // Están ordenadas por dirección: el primer máximo ya es el de dirección menor.
  const mayor = filas.reduce((best, f, i) => f.aporte > filas[best]!.aporte ? i : best, 0);
  montos[mayor]! += saldo - repartido;
  return filas.map((f, i) => ({ destino: f.direccion, monto: montos[i]! })).filter((f) => f.monto > 0n);
}
