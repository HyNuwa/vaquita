import { decodeFunctionData, encodeAbiParameters, encodeFunctionResult, keccak256, pad, toHex, type Address, type Hex } from "viem";
import { WFIAT } from "../src/config/tokens.js";
import { rolesAbi } from "../src/fondo/abis.js";
import { CLAVE_PRESUPUESTO, LIMITE_POR_TRANSFERENCIA, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO, ROL_VAQUI } from "../src/fondo/constantes.js";
import { FondoReadError, type FundCall } from "../src/fondo/lectura.js";

export type NegativaId = `N${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`;
export const BALANCE = 7n * 10n ** 18n;
export const TIMESTAMP_PRESUPUESTO = 1_000n;
export const TIMESTAMP_BLOQUE = 5_000n;
export const SLOT_BASE = keccak256(encodeAbiParameters([{ type: "bytes32" }, { type: "uint256" }], [CLAVE_PRESUPUESTO, 5n]));
export const SLOT_SALDO = toHex(BigInt(SLOT_BASE) + 1n, { size: 32 });
export const palabraRefill = () => toHex((PRESUPUESTO_PERIODO << 128n) | PRESUPUESTO_PERIODO, { size: 32 });
export const palabraSaldo = (balance = BALANCE, timestamp = TIMESTAMP_PRESUPUESTO) =>
  toHex((timestamp << 192n) | (balance << 64n) | PERIODO_SEGUNDOS, { size: 32 });

export const violacion = (status: number): Hex => `0xd0a9bf58${status.toString(16).padStart(64, "0")}${"ab".repeat(32)}`;
export const NO_MEMBERSHIP: Hex = "0xfd8e9f28";
export const noAutorizado = (account: Address): Hex => `0x4a0bfec1${pad(account, { size: 32 }).slice(2).toLowerCase()}`;

export interface Modelo {
  roles: Address; wallet: Address; destinatarios: readonly Address[];
  /** Reemplaza la respuesta de una negativa: devolver datos simula que la llamada pasó. */
  respuestas?: Partial<Record<NegativaId, () => { data?: Hex }>>;
}

/** Roles modelado sólo para estas pruebas: cada entrada difiere de un pago válido en una dimensión. */
export function evaluarNegativa(modelo: Modelo, request: FundCall): { id: NegativaId; signal: Hex | null } {
  const decoded = decodeFunctionData({ abi: rolesAbi, data: request.data }) as unknown as { functionName: string; args: readonly [Address, bigint, Hex, number, Hex, boolean] };
  if (decoded.functionName !== "execTransactionWithRole") throw new Error(`unexpected ${decoded.functionName}`);
  const [to, value, inner, operation, role] = decoded.args;
  if (!request.account || request.account.toLowerCase() !== modelo.wallet.toLowerCase()) return { id: "N10", signal: noAutorizado(request.account!) };
  if (role !== ROL_VAQUI) return { id: "N9", signal: NO_MEMBERSHIP };
  if (to.toLowerCase() !== WFIAT.wARS.address.toLowerCase()) return { id: "N4", signal: violacion(2) };
  if (inner.startsWith("0x095ea7b3")) return { id: "N5", signal: violacion(3) };
  if (inner.startsWith("0x23b872dd")) return { id: "N6", signal: violacion(3) };
  if (operation !== 0) return { id: "N7", signal: violacion(1) };
  if (value !== 0n) return { id: "N8", signal: violacion(4) };
  const recipient = `0x${inner.slice(34, 74)}`;
  if (!modelo.destinatarios.some((a) => a.toLowerCase() === recipient.toLowerCase())) return { id: "N1", signal: violacion(5) };
  if (BigInt(`0x${inner.slice(74)}`) > LIMITE_POR_TRANSFERENCIA) return { id: "N2", signal: violacion(9) };
  return { id: "N3", signal: request.stateOverride?.some((o) => o.stateDiff.some((d) => d.slot === SLOT_SALDO)) ? violacion(17) : null };
}

export function llamarNegativa(modelo: Modelo, request: FundCall): { data?: Hex } {
  const { id, signal } = evaluarNegativa(modelo, request);
  const respuesta = modelo.respuestas?.[id];
  if (respuesta) return respuesta();
  if (signal === null) return { data: pad("0x01", { size: 32 }) };
  throw new FondoReadError("revert", signal);
}

export const respuestaAllowances = (): Hex => encodeFunctionResult({ abi: rolesAbi, functionName: "allowances",
  result: [PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, BALANCE, TIMESTAMP_PRESUPUESTO] } as never) as Hex;
