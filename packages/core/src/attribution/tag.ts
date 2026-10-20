import { concat, type Hex } from "viem";
import { fromDataSuffix, toDataSuffix } from "@celo/attribution-tags";

/**
 * Atribución ERC-8021 con @celo/attribution-tags.
 *
 * El sufijo se agrega en el CLIENTE de la wallet (src/chain/signer.ts), nunca en un
 * contrato. La EVM ignora los bytes extra al final del calldata, así que el contrato
 * de wARS ejecuta el transfer igual; los indexers del hackathon leen el sufijo.
 *
 * Regla: si el calldata firmado no decodifica con nuestro código, la tx no sale.
 */

export class MissingAttributionError extends Error {
  override name = "MissingAttributionError";
  constructor(detail: string) {
    super(`Transacción bloqueada: falta el tag de atribución ERC-8021 (${detail}).`);
  }
}

const SDK_CODE_RE = /^[a-z0-9_]{1,32}$/;
const PLACEHOLDERS = new Set(["celo_xxxxxxxx", "celo_test1234"]);

export function assertValidCode(code: string, opts: { live: boolean }): void {
  if (!SDK_CODE_RE.test(code)) {
    throw new Error(`ATTRIBUTION_CODE inválido (${JSON.stringify(code)}): debe cumplir /^[a-z0-9_]{1,32}$/.`);
  }
  if (opts.live) {
    if (!code.startsWith("celo_")) {
      throw new Error("En modo real, ATTRIBUTION_CODE tiene que ser el código celo_… que te asignó Loops House.");
    }
    if (PLACEHOLDERS.has(code)) {
      throw new Error("En modo real no se permite un código de ejemplo: poné tu código de atribución real.");
    }
  }
}

export function hasTag(data: Hex | undefined, code: string): boolean {
  if (!data || data === "0x") return false;
  return fromDataSuffix(data)?.codes.includes(code) ?? false;
}

/** Agrega el sufijo al final. Idempotente: si ya está nuestro código, no lo duplica. */
export function appendTag(data: Hex, code: string): Hex {
  if (hasTag(data, code)) return data;
  return concat([data, toDataSuffix(code) as Hex]);
}

export function assertTagged(data: Hex | undefined, code: string): asserts data is Hex {
  if (!data || data === "0x") throw new MissingAttributionError("calldata vacío");
  const decoded = fromDataSuffix(data);
  if (!decoded) throw new MissingAttributionError("no hay sufijo ERC-8021");
  if (!decoded.codes.includes(code)) {
    throw new MissingAttributionError(`el sufijo tiene ${decoded.codes.join(",")} y se esperaba ${code}`);
  }
}
