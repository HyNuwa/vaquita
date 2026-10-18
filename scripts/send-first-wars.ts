/**
 * PRIMER PASO: mover 1 wARS (= $1 ARS) real, con tag ERC-8021 y gas en stablecoin.
 *
 *   npm run pago:primero -- <alias>          → modo ensayo (por defecto)
 *   LIVE_PAYMENTS=si-muevo-plata-real npm run pago:primero -- <alias>   → real
 *
 * El alias tiene que estar en ALLOWED_RECIPIENTS. Para la primera prueba conviene una
 * segunda wallet tuya (después, para el hackathon, cuentan usuarios independientes).
 */
import { bootstrap } from "../src/bootstrap.js";
import { pay } from "../src/payments/pay.js";

const alias = process.argv[2];
if (!alias) {
  console.error("Uso: npm run pago:primero -- <alias-del-destinatario>");
  process.exit(1);
}

const deps = bootstrap();
const result = await pay(deps, { token: "wARS", amount: "1", recipient: alias, reason: "primer pago de prueba" });

console.log("\n" + result.message);
if (result.mode === "dry-run" && result.status === "simulated") {
  console.log("\n(Tx firmada, sin transmitir. Para enviarla de verdad, activá LIVE_PAYMENTS.)");
}
if (result.mode === "live" && result.status === "confirmed") {
  console.log(
    result.attributionVerified
      ? `✅ Tag ${deps.config.attributionCode} verificado on-chain con verifyTx.`
      : "⚠️  La tx se confirmó pero verifyTx no encontró el tag. NO sigas mandando: revisá antes.",
  );
}
process.exit(result.status === "confirmed" || result.status === "simulated" ? 0 : 1);
