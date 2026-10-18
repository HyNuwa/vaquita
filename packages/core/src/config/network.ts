/**
 * Red: SOLO Celo mainnet.
 * El agente se niega a firmar si el RPC responde otro chainId.
 */
export const CELO_MAINNET = Object.freeze({
  chainId: 42220,
  name: "Celo Mainnet",
  defaultRpcUrl: "https://forno.celo.org",
  explorerTx: (hash: string) => `https://celoscan.io/tx/${hash}`,
  explorerAddress: (addr: string) => `https://celoscan.io/address/${addr}`,
});

/**
 * ERC-8004 en Celo mainnet (docs.celo.org/build/agents/8004).
 * Verificado 2026-10-17.
 */
export const ERC8004_MAINNET = Object.freeze({
  identityRegistry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  reputationRegistry: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63",
} as const);

/** Fecha límite del hackathon: registro + entrega (Mon 9 Nov 2026, 09:00 GMT). */
export const HACKATHON_DEADLINE_UTC = new Date("2026-11-09T09:00:00Z");
