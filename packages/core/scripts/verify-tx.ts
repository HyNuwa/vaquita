/**
 * Verifica el tag ERC-8021 de cualquier tx de mainnet.
 *   npm run tx:verificar -- 0x<hash>
 */
import { createPublicClient, http, type Hex } from "viem";
import { celo } from "viem/chains";
import { verifyTx } from "@celo/attribution-tags";
import "../src/config/load-env.js";

const hash = process.argv[2] as Hex | undefined;
if (!hash?.match(/^0x[0-9a-fA-F]{64}$/)) throw new Error("Uso: npm run tx:verificar -- 0x<hash>");
const client = createPublicClient({ chain: celo, transport: http(process.env.CELO_RPC_URL ?? "https://forno.celo.org") });
console.log((await verifyTx({ client, hash })) ?? "Sin tag ERC-8021");
