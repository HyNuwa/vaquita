import type { TxPersona } from "@vaquita/core/fondo/transacciones";
import type { Hex } from "viem";
import { getTransactionReceipt, sendTransaction, switchChain, waitForTransactionReceipt } from "wagmi/actions";
import { celo } from "wagmi/chains";
import { wagmiConfig } from "./wagmi";

const ESPERA_MS = 120_000;

export type ResultadoFirma =
  | { estado: "confirmada" | "fallida" | "reemplazada" | "pendiente"; hash: Hex }
  | { estado: "rechazada" }
  | { estado: "sin-enviar" };

/** La billetera avisa que la persona rechazó con el código 4001, a veces dentro de la causa. */
function fueRechazada(e: unknown): boolean {
  for (let actual = e as { code?: number; cause?: unknown } | undefined; actual; actual = actual.cause as typeof actual) {
    if (actual.code === 4001) return true;
  }
  return false;
}

/**
 * Único archivo de las apps que envía transacciones (D15.5, exceptuado en la guarda de la CI).
 * Solo pasa a la billetera del comprador lo que armó el core. Nunca maneja claves.
 */
export async function firmarYEsperar(tx: TxPersona): Promise<ResultadoFirma> {
  let hash: Hex;
  try {
    await switchChain(wagmiConfig, { chainId: celo.id });
    hash = await sendTransaction(wagmiConfig, { chainId: celo.id, to: tx.to, data: tx.data });
  } catch (e) {
    return { estado: fueRechazada(e) ? "rechazada" : "sin-enviar" };
  }

  // Cancelar o cambiar la transacción desde la billetera también deja un recibo exitoso.
  // Solo acelerarla ("repriced") conserva lo que armó el core.
  let reemplazada: Hex | undefined;
  let vigente = hash;
  try {
    const recibo = await waitForTransactionReceipt(wagmiConfig, {
      chainId: celo.id,
      hash,
      timeout: ESPERA_MS,
      onReplaced: ({ reason, transaction }) => {
        if (reason === "repriced") vigente = transaction.hash;
        else reemplazada = transaction.hash;
      },
    });
    if (reemplazada) return { estado: "reemplazada", hash: reemplazada };
    return { estado: recibo.status === "success" ? "confirmada" : "fallida", hash: recibo.transactionHash };
  } catch {
    if (reemplazada) return { estado: "reemplazada", hash: reemplazada };
    // wagmi también lanza cuando la transacción revirtió: solo el recibo distingue eso de una demora.
    const recibo = await getTransactionReceipt(wagmiConfig, { chainId: celo.id, hash: vigente }).catch(() => null);
    if (recibo?.status === "reverted") return { estado: "fallida", hash: vigente };
    if (recibo?.status === "success") return { estado: "confirmada", hash: vigente };
    // Ya salió: que no aparezca a tiempo no prueba que no vaya a entrar.
    return { estado: "pendiente", hash: vigente };
  }
}
