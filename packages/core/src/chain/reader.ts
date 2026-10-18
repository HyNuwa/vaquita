import { createPublicClient, erc20Abi, http, type Address, type Hex } from "viem";
import { celo } from "viem/chains";
import { verifyTx } from "@celo/attribution-tags";

/**
 * Todo lo que el agente necesita leer/mandar a la red, detrás de una interfaz chica.
 * Los tests la reemplazan con un fake; producción usa viem contra forno.celo.org.
 */
export interface ChainReader {
  chainId(): Promise<number>;
  erc20Meta(token: Address): Promise<{ symbol: string; decimals: number }>;
  balanceOf(token: Address, owner: Address): Promise<bigint>;
  nonce(addr: Address): Promise<number>;
  estimateGas(p: { from: Address; to: Address; data: Hex; feeCurrency: Address }): Promise<bigint>;
  /** Precios de gas expresados en la fee currency (18 decimales) */
  feesPerGas(feeCurrency: Address): Promise<{ maxFeePerGas: bigint; maxPriorityFeePerGas: bigint }>;
  sendRaw(serialized: Hex): Promise<Hex>;
  waitForReceipt(hash: Hex): Promise<{ status: "success" | "reverted" }>;
  /** Códigos ERC-8021 leídos on-chain, o null si la tx no tiene tag */
  verifyAttribution(hash: Hex): Promise<string[] | null>;
}

export function viemReader(rpcUrl: string): ChainReader {
  const client = createPublicClient({ chain: celo, transport: http(rpcUrl, { retryCount: 2 }) });

  return {
    chainId: () => client.getChainId(),
    async erc20Meta(token) {
      const [symbol, decimals] = await Promise.all([
        client.readContract({ address: token, abi: erc20Abi, functionName: "symbol" }),
        client.readContract({ address: token, abi: erc20Abi, functionName: "decimals" }),
      ]);
      return { symbol, decimals };
    },
    balanceOf: (token, owner) =>
      client.readContract({ address: token, abi: erc20Abi, functionName: "balanceOf", args: [owner] }),
    nonce: (addr) => client.getTransactionCount({ address: addr, blockTag: "pending" }),
    estimateGas: ({ from, to, data, feeCurrency }) =>
      client.estimateGas({ account: from, to, data, feeCurrency } as Parameters<typeof client.estimateGas>[0]),
    async feesPerGas(feeCurrency) {
      // En Celo, eth_gasPrice / eth_maxPriorityFeePerGas aceptan la fee currency como parámetro
      const [gasPrice, tip] = await Promise.all([
        client.request({ method: "eth_gasPrice", params: [feeCurrency] } as never) as Promise<Hex>,
        client.request({ method: "eth_maxPriorityFeePerGas", params: [feeCurrency] } as never) as Promise<Hex>,
      ]);
      const gp = BigInt(gasPrice);
      const prio = BigInt(tip);
      // gasPrice = baseFee + tip; dejamos margen x2 sobre el baseFee (lo no usado no se cobra)
      return { maxFeePerGas: (gp - prio) * 2n + prio, maxPriorityFeePerGas: prio };
    },
    sendRaw: (serialized) => client.sendRawTransaction({ serializedTransaction: serialized }),
    async waitForReceipt(hash) {
      const r = await client.waitForTransactionReceipt({ hash, timeout: 90_000 });
      return { status: r.status };
    },
    async verifyAttribution(hash) {
      const r = await verifyTx({ client, hash });
      return r?.codes ?? null;
    },
  };
}
