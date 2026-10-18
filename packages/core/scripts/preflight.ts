/**
 * Chequeo SOLO LECTURA contra Celo mainnet. No firma ni manda nada.
 *   npm run preflight
 */
import { formatUnits } from "viem";
import { bootstrap } from "../src/bootstrap.js";
import { WFIAT } from "../src/config/tokens.js";
import { CELO_MAINNET, HACKATHON_DEADLINE_UTC } from "../src/config/network.js";
import { formatLocal } from "../src/money/amounts.js";

const deps = bootstrap();
const { reader, account, config } = deps;
let ok = true;
const check = (cond: boolean, label: string, detail = "") => {
  console.log(`${cond ? "✅" : "❌"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!cond) ok = false;
};

const chainId = await reader.chainId();
check(chainId === CELO_MAINNET.chainId, "Red", `chainId ${chainId}`);

for (const t of Object.values(WFIAT)) {
  const meta = await reader.erc20Meta(t.address).catch((e: Error) => ({ symbol: `ERROR ${e.message}`, decimals: -1 }));
  check(
    meta.decimals === 18 && meta.symbol.toLowerCase() === t.symbol.toLowerCase(),
    `${t.symbol} en ${t.address}`,
    `symbol()="${meta.symbol}" decimals()=${meta.decimals}`,
  );
}

const wars = await reader.balanceOf(WFIAT.wARS.address, account.address);
check(wars >= 10n ** 18n, "Saldo de la wallet del agente (wARS)", formatLocal(wars, WFIAT.wARS));

const fee18 = await reader.balanceOf(config.feeCurrency.feeCurrency, account.address);
check(fee18 > 0n, `Saldo para gas (${config.feeCurrency.symbol})`, `${formatUnits(fee18, 18)}`);

check(config.allowlist.size > 0, "Destinatarios permitidos", [...config.allowlist.keys()].join(", ") || "ninguno");

const days = Math.ceil((HACKATHON_DEADLINE_UTC.getTime() - Date.now()) / 86_400_000);
console.log(`ℹ️  Wallet del agente: ${account.address}`);
console.log(`ℹ️  Código de atribución: ${config.attributionCode}`);
console.log(`ℹ️  Faltan ${days} días para el cierre (registro ERC-8004 + entrega).`);
process.exit(ok ? 0 : 1);
