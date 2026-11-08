import { getAddress, isAddress, type Hex } from "viem";

// Fuente: docs/proyecto/specs/01-contratos-y-fork.md (4/11/2026).
const contract = (address: string, codeHash: Hex) =>
  Object.freeze({ address: getAddress(address), codeHash });

/**
 * Safe 1.4.1 L2 y Zodiac Roles 2.1.1 en Celo mainnet.
 * Los hashes de Safe coinciden con los publicados por Safe. Para Roles y su
 * fábrica se comparó el código en tres redes, no una compilación propia.
 * Esta tabla no verifica por sí sola el código desplegado: requiere lectura RPC.
 */
const contracts = Object.freeze({
  safeL2: contract(
    "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
    "0xb1f926978a0f44a2c0ec8fe822418ae969bd8c3f18d61e5103100339894f81ff", // Hash público de bytecode; secret-scan: allow
  ),
  proxyFactory: contract(
    "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
    "0x50c3cdc4074750a7a974204a716c999edd37482f907608d960b2b025ee0b3317", // Hash público de bytecode; secret-scan: allow
  ),
  fallbackHandler: contract(
    "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99",
    "0x7c6007a5d711cea8dfd5d91f5940ec29c7f200fe511eb1fc1397b367af3c42f9", // Hash público de bytecode; secret-scan: allow
  ),
  multiSendCallOnly: contract(
    "0x9641d764fc13c8B624c04430C7356C1C7C8102e2",
    "0xecd5bd14a08c5d2122379900b2f272bdf107a7e92423c10dd5fe3254386c9939", // Hash público de bytecode; secret-scan: allow
  ),
  rolesMastercopy: contract(
    "0xF2964CE6161ce0e75964Fe7927cE114cb0B283D5",
    "0x471d8b3b419f1eb955230c0326c8812176df49bf3c7b414a563fda5a3c6c10b6", // Hash público de bytecode; secret-scan: allow
  ),
  moduleFactory: contract(
    "0x000000000000aDdB49795b0f9bA5BC298cDda236",
    "0x01623cbcf010a1c326230f1b2d5f48a66b440232ee49096102bc84967dc5f21e", // Hash público de bytecode; secret-scan: allow
  ),
});

/** Roles 2.1.0 y Delay 1.1.0: versiones afectadas, nunca habilitadas. */
export const DIRECCIONES_PROHIBIDAS = Object.freeze([
  getAddress("0x9646fDAD06d3e24444381f44362a3B0eB343D337"),
  getAddress("0x01F8cabB808D7dE0dF4202D4B60C8310d2f1339b"),
]);

export function contratosFondo(chainId: number) {
  if (chainId !== 42220) throw new Error("El fondo solo está disponible en Celo mainnet.");
  return contracts;
}

/** Rechaza direcciones conocidas; no reemplaza verificar mastercopy y bytecode. */
export function assertModuloPermitido(address: string): void {
  // La comparación ignora el uso de mayúsculas, incluso para versiones prohibidas.
  if (!isAddress(address, { strict: false })) throw new Error("Dirección de módulo inválida.");
  if (DIRECCIONES_PROHIBIDAS.includes(getAddress(address))) {
    throw new Error("Esta versión del módulo está prohibida.");
  }
}
