import { decodeFunctionResult, encodeAbiParameters, encodeFunctionData, erc20Abi, getAddress, keccak256, pad, slice, toHex, type Address, type Hex } from "viem";
import { WFIAT } from "../config/tokens.js";
import { rolesAbi } from "./abis.js";
import { CLAVE_PRESUPUESTO, LIMITE_POR_TRANSFERENCIA, ROL_VAQUI } from "./constantes.js";
import { FondoReadError, type FondoReader, type StateDiff } from "./lectura.js";

export interface EntradaNegativas { safe: Address; roles: Address; walletOperativa: Address; destinatarios: readonly Address[]; blockNumber: bigint }

// Selectores de spec 02-core-fondo: ConditionViolation(uint8,bytes32), NoMembership() y NotAuthorized(address).
const VIOLACION = "0xd0a9bf58";
const NO_MEMBERSHIP = "0xfd8e9f28";
const NOT_AUTHORIZED = "0x4a0bfec1";
// Slot del mapping `allowances` en el runtime permitido de Roles 2.1.1 (protocol/provenance.json).
const SLOT_ALLOWANCES = 5n;
const MASK_64 = (1n << 64n) - 1n;
const MASK_128 = (1n << 128n) - 1n;
const AJENA = getAddress(slice(keccak256(toHex("vaquita-cuenta-ajena")), 12));
const OTRO_ROL = keccak256(toHex("vaquita-otro-rol"));
const PRESUPUESTO_NO_COINCIDE = "El presupuesto leído no es consistente.";

const esViolacion = (status: number) => (data: Hex) =>
  data.length === 138 && data.toLowerCase().startsWith(VIOLACION) && BigInt(`0x${data.slice(10, 74)}`) === BigInt(status);
const esExacto = (expected: Hex) => (data: Hex) => data.toLowerCase() === expected.toLowerCase();

/** Prepara N3: autentica la palabra real contra el getter antes de alterar sólo saldo y fecha. */
async function agotarPresupuesto(reader: FondoReader, { roles, blockNumber }: EntradaNegativas): Promise<StateDiff | string> {
  const base = BigInt(keccak256(encodeAbiParameters([{ type: "bytes32" }, { type: "uint256" }], [CLAVE_PRESUPUESTO, SLOT_ALLOWANCES])));
  const slotSaldo = toHex(base + 1n, { size: 32 });
  const [refillWord, saldoWord, getter, block] = await Promise.all([
    reader.getStorageAt({ address: roles, slot: toHex(base, { size: 32 }), blockNumber }),
    reader.getStorageAt({ address: roles, slot: slotSaldo, blockNumber }),
    reader.call({ to: roles, blockNumber, data: encodeFunctionData({ abi: rolesAbi, functionName: "allowances", args: [CLAVE_PRESUPUESTO] }) }),
    reader.getBlock({ blockNumber }),
  ]);
  if (refillWord === undefined || saldoWord === undefined || !getter.data) return PRESUPUESTO_NO_COINCIDE;
  const [refill, maxRefill, period, balance, timestamp] = decodeFunctionResult({ abi: rolesAbi, functionName: "allowances", data: getter.data }) as
    readonly [bigint, bigint, bigint, bigint, bigint];
  const first = BigInt(refillWord), second = BigInt(saldoWord);
  if ((first & MASK_128) !== refill || first >> 128n !== maxRefill || (second & MASK_64) !== period
    || ((second >> 64n) & MASK_128) !== balance || second >> 192n !== timestamp || block.timestamp > MASK_64) return PRESUPUESTO_NO_COINCIDE;
  return [{ slot: slotSaldo, value: toHex((block.timestamp << 192n) | period, { size: 32 }) }];
}

/**
 * Comprueba N1 a N10 por `eth_call`, una señal exacta por negativa. Devuelve null o el motivo.
 * Sólo un revert con los bytes esperados acredita el rechazo; un error de red o de token nunca.
 */
export async function comprobarNegativas(reader: FondoReader, entrada: EntradaNegativas): Promise<string | null> {
  const { safe, roles, walletOperativa, destinatarios, blockNumber } = entrada;
  const destinatario = destinatarios[0];
  if (!destinatario) return "Faltan los destinatarios esperados.";
  const stateDiff = await agotarPresupuesto(reader, entrada);
  if (typeof stateDiff === "string") return stateDiff;

  const wars = WFIAT.wARS.address;
  const pago = (to: Address, monto: bigint) => encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [to, monto] });
  const uno = pago(destinatario, 1n);
  type Negativa = {
    id: string; to?: Address; value?: bigint; inner?: Hex; operation?: number; rol?: Hex; account?: Address;
    drain?: boolean; valida: (data: Hex) => boolean;
  };
  const negativas: Negativa[] = [
    { id: "N1", inner: pago(AJENA, 1n), valida: esViolacion(5) },
    { id: "N2", inner: pago(destinatario, LIMITE_POR_TRANSFERENCIA + 1n), valida: esViolacion(9) },
    { id: "N3", drain: true, valida: esViolacion(17) },
    { id: "N4", to: WFIAT.wBRL.address, valida: esViolacion(2) },
    { id: "N5", inner: encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [destinatario, 1n] }), valida: esViolacion(3) },
    { id: "N6", inner: encodeFunctionData({ abi: erc20Abi, functionName: "transferFrom", args: [safe, destinatario, 1n] }), valida: esViolacion(3) },
    { id: "N7", operation: 1, valida: esViolacion(1) },
    { id: "N8", value: 1n, valida: esViolacion(4) },
    { id: "N9", rol: OTRO_ROL, valida: esExacto(NO_MEMBERSHIP) },
    { id: "N10", account: AJENA, valida: esExacto(`${NOT_AUTHORIZED}${pad(AJENA, { size: 32 }).slice(2)}`) },
  ];

  for (const n of negativas) {
    const data = encodeFunctionData({ abi: rolesAbi, functionName: "execTransactionWithRole",
      args: [n.to ?? wars, n.value ?? 0n, n.inner ?? uno, n.operation ?? 0, n.rol ?? ROL_VAQUI, true] });
    const motivo = `El control ${n.id} no dio el resultado esperado.`;
    try {
      await reader.call({ account: n.account ?? walletOperativa, to: roles, data, blockNumber,
        ...(n.drain ? { stateOverride: [{ address: roles, stateDiff }] } : {}) });
      return motivo; // La llamada pasó: el permiso no está limitado.
    } catch (error) {
      if (!(error instanceof FondoReadError) || error.kind !== "revert" || !error.data || !n.valida(error.data)) return motivo;
    }
  }
  return null;
}
