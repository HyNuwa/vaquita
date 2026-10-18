import { encodeFunctionData, parseEventLogs, type Hex, type Log } from "viem";
import { ERC8004_MAINNET } from "../config/network.js";

/**
 * ERC-8004 Identity Registry en Celo mainnet.
 * register(agentURI) mintea un NFT a msg.sender y fija agentWallet = msg.sender:
 * por eso se registra DESDE LA WALLET DEL AGENTE (AGENT_PRIVATE_KEY), no desde la tuya.
 * La tx pasa por el mismo tagged-sender que los pagos: lleva tag ERC-8021 y gas en USDC.
 */
export const IDENTITY_REGISTRY = ERC8004_MAINNET.identityRegistry;

export const IDENTITY_REGISTRY_ABI = [
  {
    type: "function",
    name: "register",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentURI", type: "string" }],
    outputs: [{ name: "agentId", type: "uint256" }],
  },
  {
    type: "function",
    name: "setAgentURI",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "newURI", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "event",
    name: "Registered",
    inputs: [
      { name: "agentId", type: "uint256", indexed: true },
      { name: "agentURI", type: "string", indexed: false },
      { name: "owner", type: "address", indexed: true },
    ],
  },
] as const;

const URI_RE = /^(https:\/\/|ipfs:\/\/|data:application\/json)/;

export function buildRegisterCalldata(agentURI: string): Hex {
  if (!URI_RE.test(agentURI)) throw new Error("AGENT_URI debe empezar con https://, ipfs:// o data:application/json");
  return encodeFunctionData({ abi: IDENTITY_REGISTRY_ABI, functionName: "register", args: [agentURI] });
}

export function buildSetUriCalldata(agentId: bigint, uri: string): Hex {
  if (!URI_RE.test(uri)) throw new Error("URI inválida");
  return encodeFunctionData({ abi: IDENTITY_REGISTRY_ABI, functionName: "setAgentURI", args: [agentId, uri] });
}

/** Leer el agentId del evento Registered (no del valor de retorno simulado). */
export function agentIdFromLogs(logs: Log[]): bigint | null {
  const [ev] = parseEventLogs({ abi: IDENTITY_REGISTRY_ABI, eventName: "Registered", logs });
  return ev?.args.agentId ?? null;
}

export interface AgentCard {
  type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1";
  name: string;
  description: string;
  image?: string;
  services: { name: string; endpoint: string; version?: string }[];
  x402Support: boolean;
  active: boolean;
  supportedTrust: string[];
  registrations?: { agentId: number; agentRegistry: string }[];
}

export function buildAgentCard(x: { name: string; description: string; web: string; image?: string }): AgentCard {
  return {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name: x.name,
    description: x.description,
    ...(x.image ? { image: x.image } : {}),
    services: [{ name: "web", endpoint: x.web }],
    x402Support: false,
    active: true,
    supportedTrust: ["reputation"],
  };
}
