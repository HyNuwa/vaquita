import { toFunctionSelector, type Address } from "viem";
import { WFIAT } from "../config/tokens.js";
import { CLAVE_PRESUPUESTO, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO, ROL_VAQUI } from "./constantes.js";
import { condicionesVaqui } from "./roles.js";
import type { EstadoEfectivo } from "./verificacion-eventos.js";

export interface PoliticaPermisos { safe: Address; walletOperativa: Address; destinatarios: readonly Address[] }

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const key = (...parts: string[]) => parts.join("|").toLowerCase();
const AJENA = "Los permisos del fondo tienen algo que no esperábamos.";

/**
 * Compara el replay con la política fija. Devuelve null si coincide exactamente, o el motivo.
 * Cuenta las funciones latentes: un permiso que sobrevive a RevokeTarget también rechaza.
 * El saldo de presupuesto del replay es el último fijado, no el vigente; ese lo lee el control `presupuesto`.
 */
export function compararPermisos(estado: EstadoEfectivo, politica: PoliticaPermisos): string | null {
  const { safe, walletOperativa, destinatarios } = politica;
  const { configuracion, miembros, objetivos, funciones, defaults, unwrappers, presupuestos, modulos } = estado;
  let condiciones;
  try { condiciones = condicionesVaqui(destinatarios); } catch { return "Faltan los destinatarios esperados."; }

  if (![configuracion.owner, configuracion.avatar, configuracion.target].every((a) => same(a, safe))) {
    return "El módulo de permisos no pertenece a este fondo.";
  }
  const roles = miembros.get(walletOperativa.toLowerCase());
  if (miembros.size !== 1 || roles?.size !== 1 || !roles.has(ROL_VAQUI)) return "Las cuentas autorizadas no son las esperadas.";

  const token = WFIAT.wARS.address;
  const objetivo = objetivos.get(key(ROL_VAQUI, token));
  if (objetivos.size !== 1 || objetivo?.clearance !== "function" || objetivo.options !== 0) return AJENA;

  const funcion = funciones.get(key(ROL_VAQUI, token, toFunctionSelector("transfer(address,uint256)")));
  if (funciones.size !== 1 || funcion?.tipo !== "condicionada" || funcion.options !== 0) return AJENA;
  const iguales = funcion.condiciones.length === condiciones.length && condiciones.every((c, i) => {
    const actual = funcion.condiciones[i]!;
    return actual.parent === c.parent && actual.paramType === c.paramType && actual.operator === c.operator && same(actual.compValue, c.compValue);
  });
  if (!iguales) return "Los destinatarios o los límites no son los esperados.";

  if (defaults.size !== 0 || unwrappers.size !== 0) return AJENA;
  const presupuesto = presupuestos.get(CLAVE_PRESUPUESTO);
  if (presupuestos.size !== 1 || presupuesto?.refill !== PRESUPUESTO_PERIODO || presupuesto.maxRefill !== PRESUPUESTO_PERIODO
    || presupuesto.period !== PERIODO_SEGUNDOS || presupuesto.balance > PRESUPUESTO_PERIODO) return "El presupuesto no es el esperado.";
  // Sólo acepta la wallet operativa: no asume si asignar el rol también habilita el módulo.
  if ([...modulos].some((m) => !same(m, walletOperativa))) return AJENA;
  return null;
}
