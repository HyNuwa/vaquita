import { decodeErrorResult, parseAbi, type Hex } from "viem";

export type CodigoError = "OPERACION_NO_PERMITIDA" | "DESTINATARIO_NO_AUTORIZADO" | "SUPERA_TOPE_POR_PAGO" | "PRESUPUESTO_AGOTADO"
  | "VAQUI_REVOCADO" | "CUENTA_NO_AUTORIZADA" | "FALTAN_FIRMAS" | "FIRMA_NO_VALIDA" | "GASTO_RECHAZADO"
  | "RED_NO_DISPONIBLE" | "SIN_SALDO_COMISION" | "ERROR_DESCONOCIDO";
export interface ErrorClasificado { codigo: CodigoError; mensaje: string; transitorio: boolean }

const MENSAJES: Record<CodigoError, string> = {
  OPERACION_NO_PERMITIDA: "Esta operación no está permitida para Vaqui.",
  DESTINATARIO_NO_AUTORIZADO: "Ese destinatario no está autorizado en este fondo.",
  SUPERA_TOPE_POR_PAGO: "El monto supera el tope por pago.",
  PRESUPUESTO_AGOTADO: "Se agotó el presupuesto del período.",
  VAQUI_REVOCADO: "Vaqui ya no tiene permiso para operar en este fondo.",
  CUENTA_NO_AUTORIZADA: "Esta cuenta no está autorizada para operar.",
  FALTAN_FIRMAS: "Faltan aprobaciones de los responsables.",
  FIRMA_NO_VALIDA: "Una de las aprobaciones no es válida.",
  GASTO_RECHAZADO: "El pago fue rechazado y sigue pendiente.",
  RED_NO_DISPONIBLE: "La red no responde. Probá de nuevo en un rato.",
  SIN_SALDO_COMISION: "No hay saldo para pagar la comisión de la operación.",
  ERROR_DESCONOCIDO: "No pudimos completar la operación.",
};
const POR_STATUS: Readonly<Record<string, CodigoError>> = { "5": "DESTINATARIO_NO_AUTORIZADO", "9": "SUPERA_TOPE_POR_PAGO", "17": "PRESUPUESTO_AGOTADO" };
const POR_RAZON: Readonly<Record<string, CodigoError>> = { GS020: "FALTAN_FIRMAS", GS025: "FIRMA_NO_VALIDA", GS013: "GASTO_RECHAZADO" };
const errorStringAbi = parseAbi(["error Error(string)"]);
const HEX = /^0x(?:[0-9a-fA-F]{2})*$/;
const LIMITE_CAUSAS = 16;

const resultado = (codigo: CodigoError): ErrorClasificado => ({ codigo, mensaje: MENSAJES[codigo], transitorio: codigo === "RED_NO_DISPONIBLE" });

/** Recorre el error y sus causas con tope, para tolerar cadenas largas o circulares. */
function cadena(error: unknown): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  const seen = new Set<unknown>();
  let current = error;
  while (current && typeof current === "object" && !seen.has(current) && nodes.length < LIMITE_CAUSAS) {
    seen.add(current);
    nodes.push(current as Record<string, unknown>);
    current = (current as Record<string, unknown>).cause;
  }
  return nodes;
}

function porRevert(data: Hex): CodigoError | undefined {
  const lower = data.toLowerCase();
  if (lower === "0xfd8e9f28") return "VAQUI_REVOCADO";
  if (lower.startsWith("0x4a0bfec1") && lower.length === 74) return "CUENTA_NO_AUTORIZADA";
  if (lower.startsWith("0xd0a9bf58") && lower.length === 138) {
    return POR_STATUS[BigInt(`0x${lower.slice(10, 74)}`).toString()] ?? "OPERACION_NO_PERMITIDA";
  }
  try {
    const { args } = decodeErrorResult({ abi: errorStringAbi, data });
    return POR_RAZON[args[0]];
  } catch { return undefined; }
}

/** Sólo clasifica señales estructuradas: el texto libre de un error nunca decide el código. */
export function clasificarError(error: unknown): ErrorClasificado {
  const nodes = cadena(error);
  for (const node of nodes) {
    if (typeof node.data === "string" && HEX.test(node.data)) {
      const codigo = porRevert(node.data as Hex);
      if (codigo) return resultado(codigo);
    }
  }
  if (nodes.some((n) => n.name === "InsufficientFundsError")) return resultado("SIN_SALDO_COMISION");
  const red = nodes.some((n) => n.name === "TimeoutError" || (n.name === "FondoReadError" && n.kind === "transport")
    || (typeof n.status === "number" && (n.status === 429 || n.status >= 500)));
  return resultado(red ? "RED_NO_DISPONIBLE" : "ERROR_DESCONOCIDO");
}
