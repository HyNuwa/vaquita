import {
  encodeFunctionData, getAddress, isAddress, pad, toFunctionSelector, toHex,
  type Address, type Hex,
} from "viem";
import { contratosFondo } from "../config/fondo-contratos.js";
import { WFIAT } from "../config/tokens.js";
import { rolesAbi, safeAbi } from "./abis.js";
import {
  CLAVE_PRESUPUESTO, LIMITE_POR_TRANSFERENCIA, MAX_DESTINATARIOS,
  PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO, ROL_VAQUI,
} from "./constantes.js";
import { encodeMultiSend, type TxSafe } from "./safe.js";

type Condition = { parent: number; paramType: number; operator: number; compValue: Hex };
export interface InitialRulesConfig {
  readonly safe: Address;
  readonly roles: Address;
  readonly operatingWallet: Address;
  readonly recipients: readonly Address[];
  readonly nonce: bigint;
}

/** BFS de Roles 2.1.1: destinatario OR, monto AND (tope inclusivo + presupuesto). */
export function condicionesVaqui(recipients: readonly Address[]): readonly Condition[] {
  const error = `Elegí entre 1 y ${MAX_DESTINATARIOS} destinatarios con cuentas válidas.`;
  if (!recipients.every((a) => isAddress(a, { strict: false }))) throw new Error(error);
  const sorted = [...new Set(recipients.map((a) => getAddress(a)))].sort((a, b) => BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0);
  if (sorted.length === 0 || sorted.length > MAX_DESTINATARIOS) throw new Error(error);
  // Enums del pin 557b17d5f0; no usar los operadores de Roles v3.
  const conditions: Condition[] = [
    { parent: 0, paramType: 5, operator: 5, compValue: "0x" },
    { parent: 0, paramType: 0, operator: 2, compValue: "0x" },
    { parent: 0, paramType: 0, operator: 1, compValue: "0x" },
  ];
  for (const recipient of sorted) {
    conditions.push({ parent: 1, paramType: 1, operator: 16, compValue: pad(recipient, { size: 32 }) });
  }
  conditions.push(
    { parent: 2, paramType: 1, operator: 18, compValue: toHex(LIMITE_POR_TRANSFERENCIA + 1n, { size: 32 }) },
    { parent: 2, paramType: 1, operator: 28, compValue: CLAVE_PRESUPUESTO },
  );
  return conditions;
}

/** Solo para configuración inicial: no es un plan de recuperación ni un reinicio de presupuesto. */
export function buildInitialRules(config: InitialRulesConfig): TxSafe {
  const { safe, roles, operatingWallet, recipients, nonce } = config;
  if (![safe, roles, operatingWallet].every((a) => isAddress(a, { strict: false }))
    || typeof nonce !== "bigint" || nonce < 0n || nonce >= (1n << 256n)) {
    throw new Error("Revisá las cuentas del grupo y el número de operación.");
  }
  const conditions = condicionesVaqui(recipients);
  const token = WFIAT.wARS.address;
  const calls = [
    { to: safe, data: encodeFunctionData({ abi: safeAbi, functionName: "enableModule", args: [roles] }) },
    { to: roles, data: encodeFunctionData({ abi: rolesAbi, functionName: "setAllowance", args: [
      CLAVE_PRESUPUESTO, PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, 0n,
    ] }) },
    { to: roles, data: encodeFunctionData({ abi: rolesAbi, functionName: "scopeTarget", args: [ROL_VAQUI, token] }) },
    { to: roles, data: encodeFunctionData({ abi: rolesAbi, functionName: "scopeFunction", args: [
      ROL_VAQUI, token, toFunctionSelector("transfer(address,uint256)"), conditions, 0,
    ] }) },
    { to: roles, data: encodeFunctionData({ abi: rolesAbi, functionName: "assignRoles", args: [operatingWallet, [ROL_VAQUI], [true]] }) },
  ];
  return { to: contratosFondo(42220).multiSendCallOnly.address, value: 0n, data: encodeMultiSend(calls), operation: 1, nonce };
}
