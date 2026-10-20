import "./config/load-env.js";
import { privateKeyToAccount } from "viem/accounts";
import { loadConfig, repoCodeWarning } from "./config/env.js";
import { LEDGER_FILE } from "./config/paths.js";
import { POLICY } from "./config/policy.js";
import { viemReader } from "./chain/reader.js";
import { JsonLedger } from "./policy/ledger.js";
import { coingeckoGasToLocal } from "./money/fx.js";
import type { PayDeps } from "./payments/pay.js";

/** Arma todas las dependencias desde .env. Falla fuerte ante cualquier config dudosa. */
export function bootstrap(): PayDeps {
  const config = loadConfig();
  const warn = repoCodeWarning(config);
  if (warn) console.warn(`⚠️  ${warn}`);

  const banner = config.live
    ? "🔴 MODO REAL — las transacciones mueven dinero en Celo mainnet"
    : "🟢 MODO ENSAYO — se firma todo pero no se transmite nada";
  console.log(banner);

  return {
    config,
    reader: viemReader(config.rpcUrl),
    account: privateKeyToAccount(config.privateKey),
    ledger: new JsonLedger(LEDGER_FILE, POLICY.timeZone),
    policy: POLICY,
    gasToLocal: coingeckoGasToLocal(),
  };
}
