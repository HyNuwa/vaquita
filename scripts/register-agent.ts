/**
 * Registro de identidad ERC-8004 DESDE LA WALLET DEL AGENTE (antes del 9/11 09:00 GMT).
 *   1. Publicá public/agent.json en una URL https y poné esa URL en AGENT_URI
 *   2. npm run identidad:registrar                       → ensayo
 *   3. LIVE_PAYMENTS=si-muevo-plata-real npm run identidad:registrar → real
 *   4. Agregá el agentId a "registrations" en agent.json y volvé a publicarlo
 * Misma tubería que los pagos: tag ERC-8021 + gas en stablecoin + chainId 42220.
 */
import { createPublicClient, http } from "viem";
import { celo } from "viem/chains";
import { bootstrap } from "../src/bootstrap.js";
import { broadcast, prepareTaggedTx } from "../src/chain/tagged-sender.js";
import { agentIdFromLogs, buildRegisterCalldata, IDENTITY_REGISTRY } from "../src/identity/erc8004.js";
import { CELO_MAINNET } from "../src/config/network.js";

const deps = bootstrap();
const uri = deps.config.agentUri;
if (!uri) {
  console.error("Falta AGENT_URI en .env (URL pública de tu agent.json).");
  process.exit(1);
}

console.log(`Registrando ${deps.account.address} con agentURI ${uri}`);
const prepared = await prepareTaggedTx(deps, { to: IDENTITY_REGISTRY, data: buildRegisterCalldata(uri) });
if (!prepared.ok) {
  console.error(prepared.reason === "NO_GAS_FUNDS" ? "Falta saldo para el gas." : "Gas por encima del tope.");
  process.exit(1);
}
if (!deps.config.live) {
  console.log("Modo ensayo: tx de registro firmada y verificada (tag + CIP-64), sin transmitir.");
  process.exit(0);
}

const sent = await broadcast(deps, prepared.signedTx);
console.log(`Tx: ${CELO_MAINNET.explorerTx(sent.txHash)} — estado ${sent.status}`);
const receipt = await createPublicClient({ chain: celo, transport: http(deps.config.rpcUrl) }).getTransactionReceipt({ hash: sent.txHash });
const agentId = agentIdFromLogs(receipt.logs);
console.log(`agentId: ${agentId ?? "no encontrado en los logs"}`);
console.log(`Tag on-chain: ${sent.attributionCodes?.join(",") ?? "NO ENCONTRADO"}`);
console.log("Siguiente: sumá { agentId, agentRegistry: \"eip155:42220:" + IDENTITY_REGISTRY + "\" } a registrations en agent.json.");
