/**
 * Link para cargar pesos en la wallet del agente vía Ripio (sin credenciales).
 *   npm run ramp:link -- 1000
 */
import "../src/config/load-env.js";
import { privateKeyToAccount } from "viem/accounts";
import { buildRampUrl } from "../src/ramp/ripio.js";

const amount = process.argv[2] ?? "1000";
const key = process.env.AGENT_PRIVATE_KEY as `0x${string}` | undefined;
if (!key) throw new Error("Falta AGENT_PRIVATE_KEY");
const address = privateKeyToAccount(key).address;
console.log(buildRampUrl({ mode: "onramp", token: "wARS", amount, address }));
