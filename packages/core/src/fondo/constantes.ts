import { keccak256, toHex } from "viem";

// wARS usa 18 decimales. Los montos nunca pasan por number.
export const LIMITE_POR_TRANSFERENCIA = 5_000n * 10n ** 18n;
export const PRESUPUESTO_PERIODO = 20_000n * 10n ** 18n;
export const PERIODO_SEGUNDOS = 2_592_000n;
// Límites operativos de la interfaz, no restricciones en cadena.
export const APORTE_MAXIMO_UI = 5_000n * 10n ** 18n;
export const OBJETIVO_GRUPO = 100_000n * 10n ** 18n;
export const MAX_DESTINATARIOS = 20;
export const ROL_VAQUI = keccak256(toHex("vaqui"));
export const CLAVE_PRESUPUESTO = keccak256(toHex("vaqui-mensual"));
