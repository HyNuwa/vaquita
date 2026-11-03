import type { TxComprador } from "@vaquita/core/compra/firmas";
import type { Hex } from "viem";
import { sendTransaction, switchChain, waitForTransactionReceipt } from "wagmi/actions";
import { celo } from "wagmi/chains";
import { wagmiConfig } from "./wagmi";

/**
 * Único archivo de las apps que envía transacciones (D15.5, exceptuado en la guarda de la CI).
 * Solo pasa a la billetera del comprador lo que armó el core. Nunca maneja claves.
 */
export async function firmarYEsperar(tx: TxComprador): Promise<{ hash: Hex; ok: boolean }> {
  await switchChain(wagmiConfig, { chainId: celo.id });
  const hash = await sendTransaction(wagmiConfig, { chainId: celo.id, to: tx.to, data: tx.data });
  const recibo = await waitForTransactionReceipt(wagmiConfig, { chainId: celo.id, hash });
  return { hash, ok: recibo.status === "success" };
}
