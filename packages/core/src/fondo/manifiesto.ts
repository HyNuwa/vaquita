import { isAddress, type Address, type Hex } from "viem";
import { contratosFondo } from "../config/fondo-contratos.js";
import { WFIAT } from "../config/tokens.js";
import type { FondoReader } from "./lectura.js";
import { creationSalt, predictRolesAddress } from "./safe.js";
import { verificarGrupo, type ResultadoVerificacion } from "./verificar.js";

export interface DatosManifiesto {
  grupoId: string; safe: Address; roles: Address; walletOperativa: Address;
  bloqueDespliegue: bigint; transacciones: readonly Hex[];
}
export interface Manifiesto {
  version: 1; chainId: 42220; grupoId: string; safe: Address; roles: Address; wARS: Address; walletOperativa: Address;
  contratos: Record<string, Address>; saltNonce: string; bloqueDespliegue: string; transacciones: readonly Hex[];
}
export type ResultadoImportacion = { ok: true; manifiesto: Manifiesto } | { ok: false; motivo: string };

const CAMPOS = ["version", "chainId", "grupoId", "safe", "roles", "wARS", "walletOperativa", "contratos", "saltNonce", "bloqueDespliegue", "transacciones"];
const MAX_BYTES = 65_536;
const MAX_GRUPO = 200;
const INVALIDO = "El archivo de recuperación no es válido.";
const DIVERGENTE = "El archivo de recuperación no coincide con los contratos de La Vaquita.";

const referencias = () => Object.fromEntries(Object.entries(contratosFondo(42220)).map(([name, c]) => [name, c.address]));
const same = (a: unknown, b: string) => typeof a === "string" && a.toLowerCase() === b.toLowerCase();
const direccion = (value: unknown): value is Address => typeof value === "string" && isAddress(value, { strict: false });
const fail = (motivo: string): ResultadoImportacion => ({ ok: false, motivo });

/** Sólo datos públicos: sin claves, nombres, Telegram ni comprobantes, y sin responsables. */
export function exportarManifiesto(datos: DatosManifiesto): string {
  const manifiesto: Manifiesto = {
    version: 1, chainId: 42220, grupoId: datos.grupoId, safe: datos.safe, roles: datos.roles, wARS: WFIAT.wARS.address,
    walletOperativa: datos.walletOperativa, contratos: referencias(), saltNonce: creationSalt(datos.grupoId).toString(),
    bloqueDespliegue: datos.bloqueDespliegue.toString(), transacciones: datos.transacciones,
  };
  return JSON.stringify(manifiesto, null, 2);
}

/** Valida la forma y la derivación. Aprobarlo no prueba nada sobre la cadena: falta `revalidarManifiesto`. */
export function importarManifiesto(texto: string): ResultadoImportacion {
  if (texto.length > MAX_BYTES) return fail(INVALIDO);
  let m: Record<string, unknown>;
  try {
    const value: unknown = JSON.parse(texto);
    if (!value || typeof value !== "object" || Array.isArray(value)) return fail(INVALIDO);
    m = value as Record<string, unknown>;
  } catch { return fail(INVALIDO); }

  const keys = Object.keys(m);
  if (keys.length !== CAMPOS.length || !CAMPOS.every((k) => Object.hasOwn(m, k))) return fail(INVALIDO);
  if (m.version !== 1 || m.chainId !== 42220) return fail(DIVERGENTE);
  if (typeof m.grupoId !== "string" || !m.grupoId || m.grupoId.length > MAX_GRUPO
    || !direccion(m.safe) || !direccion(m.roles) || !direccion(m.walletOperativa)) return fail(INVALIDO);
  if (typeof m.bloqueDespliegue !== "string" || !/^\d{1,20}$/.test(m.bloqueDespliegue)) return fail(INVALIDO);
  if (!Array.isArray(m.transacciones) || !m.transacciones.every((h) => typeof h === "string" && /^0x[0-9a-fA-F]{64}$/.test(h))) return fail(INVALIDO);

  const esperadas = referencias();
  const contratos = m.contratos;
  if (!contratos || typeof contratos !== "object" || Array.isArray(contratos)) return fail(INVALIDO);
  const nombres = Object.keys(contratos);
  if (nombres.length !== Object.keys(esperadas).length
    || !nombres.every((n) => Object.hasOwn(esperadas, n) && same((contratos as Record<string, unknown>)[n], esperadas[n]!))) return fail(DIVERGENTE);
  if (!same(m.wARS, WFIAT.wARS.address) || m.saltNonce !== creationSalt(m.grupoId).toString()
    || !same(predictRolesAddress(m.grupoId, m.safe), m.roles)) return fail(DIVERGENTE);
  return { ok: true, manifiesto: m as unknown as Manifiesto };
}

/** La cadena manda: los responsables vienen de quien verifica y `verificarGrupo` los coteja en Celo. */
export function revalidarManifiesto(reader: FondoReader, manifiesto: Manifiesto,
  esperado: { duenos: readonly Address[]; destinatarios: readonly Address[] }): Promise<ResultadoVerificacion> {
  const { safe, roles, walletOperativa, bloqueDespliegue } = manifiesto;
  return verificarGrupo(reader, { chainId: 42220, safe, roles, bloqueInicio: BigInt(bloqueDespliegue),
    esperado: { duenos: esperado.duenos, walletOperativa, destinatarios: esperado.destinatarios } });
}
