import { createPublicClient, getAddress, http, keccak256, parseTransaction, type Hex, type LocalAccount } from "viem";
import { appendTag, assertTagged, assertValidCode } from "../attribution/tag.js";
import { CELO_MAINNET } from "../config/network.js";
import { WrongChainError, type Broadcasted, type Call, type Prepared } from "./tagged-sender.js";

export interface ForkSenderDeps {
  rpcUrl: string;
  account: LocalAccount;
  attributionCode: string;
  /** Solo para reemplazar el transporte en pruebas sin red. */
  fetchFn?: typeof fetch;
}

/** Camino exclusivo del arnés: cuenta generada en la prueba, nunca claves reales. */
export function forkSender(deps: ForkSenderDeps) {
  // Validar el texto original evita que URL normalice IPs abreviadas o credenciales.
  const { rpcUrl, account, attributionCode: code, fetchFn } = deps;
  const local = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::[0-9]+)?(?:\/[^?#\\]*)?$/i;
  const invalidRpc = () => new Error("El fork requiere un RPC HTTP local sin credenciales, consulta ni fragmento.");
  if (!local.test(rpcUrl)) throw invalidRpc();
  try {
    const url = new URL(rpcUrl);
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) throw invalidRpc();
  } catch {
    throw invalidRpc();
  }
  assertValidCode(code, { live: false });

  // Sin chain Celo: no activar el serializador CIP-64 ni feeCurrency.
  // Un endpoint local no puede redirigir solicitudes a otra red.
  const client = createPublicClient({
    transport: http(rpcUrl, { retryCount: 0, fetchFn, fetchOptions: { redirect: "error" } }),
  });

  function validateSigned(signedTx: Hex) {
    const tx = parseTransaction(signedTx);
    assertTagged(tx.data, code);
    if (tx.type !== "legacy" || tx.chainId !== CELO_MAINNET.chainId) {
      throw new WrongChainError("La transacción de prueba debe ser común y para la red 42220.");
    }
    return tx;
  }

  return {
    async prepare(call: Call): Promise<Prepared> {
      const deploy = call.deploy === true;
      if (deploy ? call.to !== undefined : !call.to) {
        throw new Error("El destino no coincide con lo pedido: despliegue sin destino, llamada con destino.");
      }
      const data = appendTag(call.data, code);
      assertTagged(data, code);
      const chainId = await client.getChainId();
      if (chainId !== CELO_MAINNET.chainId) throw new WrongChainError("La red de prueba debe responder 42220.");
      const estimated = await client.estimateGas({ account: account.address, to: call.to, data, value: 0n });
      const gas = estimated * 12n / 10n;
      const gasPrice = await client.getGasPrice();
      const nonce = await client.getTransactionCount({ address: account.address, blockTag: "pending" });
      const signedTx = await account.signTransaction({
        type: "legacy", chainId, to: call.to, data, value: 0n, gas, gasPrice, nonce,
      });
      const tx = validateSigned(signedTx);
      if (tx.data !== data || (call.to ? !tx.to || getAddress(tx.to) !== getAddress(call.to) : !!tx.to)) {
        throw new Error("La transacción firmada no coincide con el destino y los datos pedidos.");
      }
      // En el fork este costo está en moneda nativa, no en dólares ni stablecoin.
      return { ok: true, signedTx, txHash: keccak256(signedTx), gas, maxGasCost18: gas * gasPrice };
    },
    async broadcast(signedTx: Hex): Promise<Broadcasted> {
      validateSigned(signedTx);
      const txHash = await client.sendRawTransaction({ serializedTransaction: signedTx });
      const { status } = await client.waitForTransactionReceipt({ hash: txHash, timeout: 90_000 });
      // El fork no acredita verificación de atribución en mainnet.
      return { txHash, status, attributionCodes: null };
    },
  };
}
