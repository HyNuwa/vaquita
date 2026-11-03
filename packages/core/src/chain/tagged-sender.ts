import { getAddress, keccak256, toFunctionSelector, type Address, type Hex, type LocalAccount } from "viem";
import { parseTransaction, serializeTransaction } from "viem/celo";
import { appendTag, assertTagged } from "../attribution/tag.js";
import type { AppConfig } from "../config/env.js";
import { CELO_MAINNET } from "../config/network.js";
import type { Policy } from "../config/policy.js";
import type { ChainReader } from "./reader.js";

/**
 * EL ÚNICO camino para mandar una transacción. Nada en el repo llama a
 * sendTransaction/writeContract de viem directamente.
 *
 *   1. chainId === 42220, o no se sigue
 *   2. calldata + sufijo ERC-8021 (@celo/attribution-tags), verificado
 *   3. estimateGas con el calldata YA taggeado y con feeCurrency
 *   4. costo máximo de gas ≤ tope de la política y ≤ saldo de la fee currency
 *   5. firma local de una tx CIP-64 (type 0x7b) con feeCurrency
 *   6. se PARSEA la tx firmada y se vuelve a verificar tag, chainId, feeCurrency y destino:
 *      lo que se valida es exactamente lo que se transmitiría
 *
 * Un despliegue se pide de forma explícita con `{ deploy: true }`: si faltar el destino
 * bastara para desplegar, un pago con un error crearía un contrato en vez de pagar.
 *   7. ensayo → se devuelve la tx firmada sin transmitir; real → sendRawTransaction
 */

export class WrongChainError extends Error {
  override name = "WrongChainError";
}

export interface SenderDeps {
  config: Pick<AppConfig, "attributionCode" | "feeCurrency" | "live">;
  reader: ChainReader;
  account: LocalAccount;
  policy: Readonly<Pick<Policy, "maxGasPerTx18" | "maxGasPerContractTx18">>;
}

/** "contract" solo para crear campañas y ejecutarlas; por defecto rige el tope de pagos. */
export type GasClass = "payment" | "contract";

export type Call =
  | { to: Address; data: Hex; gasClass?: GasClass; deploy?: never }
  | { deploy: true; data: Hex; to?: never; gasClass?: never };

/** D14.5: solo estas llamadas pueden pedir el tope de contratos. */
const CONTRACT_GAS_SELECTORS: readonly string[] = [
  toFunctionSelector("createCampaign((bytes32,address,uint256,uint256,address,uint32,uint32,uint64),address[])"),
  toFunctionSelector("ejecutar()"),
];

export type Prepared =
  | { ok: true; signedTx: Hex; txHash: Hex; maxGasCost18: bigint; gas: bigint }
  | { ok: false; reason: "GAS_OVER_CAP" | "NO_GAS_FUNDS"; maxGasCost18: bigint };

const GAS_MARGIN_NUM = 12n; // +20 % sobre la estimación
const GAS_MARGIN_DEN = 10n;

export async function assertMainnet(reader: ChainReader): Promise<void> {
  const id = await reader.chainId();
  if (id !== CELO_MAINNET.chainId) {
    throw new WrongChainError(`El RPC responde chainId ${id}; este agente solo opera en Celo mainnet (42220).`);
  }
}

export async function prepareTaggedTx(deps: SenderDeps, call: Call): Promise<Prepared> {
  const { reader, account, config, policy } = deps;
  const code = config.attributionCode;
  const feeCurrency = config.feeCurrency.feeCurrency;
  const deploy = call.deploy === true;
  const to = call.to;
  if (deploy ? to !== undefined : !to) throw new Error("El destino no coincide con lo pedido: despliegue sin destino, llamada con destino.");
  const contractGas = call.gasClass === "contract";
  if (contractGas && !CONTRACT_GAS_SELECTORS.includes(call.data.slice(0, 10))) {
    throw new Error("Esta llamada no puede usar el tope de gas de contratos.");
  }
  const cap = deploy || contractGas ? policy.maxGasPerContractTx18 : policy.maxGasPerTx18;

  await assertMainnet(reader);

  const data = appendTag(call.data, code);
  assertTagged(data, code);

  const estimated = await reader.estimateGas({ from: account.address, to, data, feeCurrency });
  const gas = (estimated * GAS_MARGIN_NUM) / GAS_MARGIN_DEN;
  const fees = await reader.feesPerGas(feeCurrency);
  const maxGasCost18 = gas * fees.maxFeePerGas;

  if (maxGasCost18 > cap) return { ok: false, reason: "GAS_OVER_CAP", maxGasCost18 };

  // balanceOf en el adapter devuelve 18 decimales, igual que los precios de gas
  const feeBalance18 = await reader.balanceOf(feeCurrency, account.address);
  if (feeBalance18 < maxGasCost18) return { ok: false, reason: "NO_GAS_FUNDS", maxGasCost18 };

  const nonce = await reader.nonce(account.address);

  const signedTx = (await account.signTransaction(
    {
      type: "cip64",
      chainId: CELO_MAINNET.chainId,
      nonce,
      to,
      data,
      value: 0n,
      gas,
      maxFeePerGas: fees.maxFeePerGas,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      feeCurrency,
    } as never,
    { serializer: serializeTransaction as never },
  )) as Hex;

  // Verificación sobre los bytes firmados, no sobre nuestras intenciones
  const parsed = parseTransaction(signedTx) as {
    type?: string; chainId?: number; to?: Address; data?: Hex; feeCurrency?: Address;
  };
  assertTagged(parsed.data, code);
  if (parsed.type !== "cip64") throw new Error("La tx firmada no es CIP-64: el gas no se pagaría en stablecoin.");
  if (parsed.chainId !== CELO_MAINNET.chainId) throw new WrongChainError("La tx firmada no es para chainId 42220.");
  if (!parsed.feeCurrency || getAddress(parsed.feeCurrency) !== getAddress(feeCurrency)) {
    throw new Error("La tx firmada no tiene la feeCurrency esperada.");
  }
  if (to) {
    if (!parsed.to || getAddress(parsed.to) !== getAddress(to)) throw new Error("La tx firmada apunta a otro contrato.");
  } else if (parsed.to) {
    throw new Error("La tx de despliegue firmada tiene un destino.");
  }

  return { ok: true, signedTx, txHash: keccak256(signedTx), maxGasCost18, gas };
}

export interface Broadcasted {
  txHash: Hex;
  status: "success" | "reverted";
  attributionCodes: string[] | null;
}

export async function broadcast(deps: SenderDeps, signedTx: Hex): Promise<Broadcasted> {
  if (!deps.config.live) throw new Error("broadcast() llamado en modo ensayo: bloqueado.");
  const txHash = await deps.reader.sendRaw(signedTx);
  const { status } = await deps.reader.waitForReceipt(txHash);
  let attributionCodes: string[] | null = null;
  try {
    attributionCodes = await deps.reader.verifyAttribution(txHash);
  } catch {
    attributionCodes = null;
  }
  return { txHash, status, attributionCodes };
}
