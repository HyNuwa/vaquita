import { fileURLToPath } from "node:url";
import { join } from "node:path";

/**
 * Raíz del monorepo, calculada desde este archivo y no desde process.cwd():
 * `npm run -w` y cada app arrancan en su propia carpeta, pero el .env y el
 * ledger son uno solo para todo el repo.
 */
export const REPO_ROOT = fileURLToPath(new URL("../../../../", import.meta.url));

export const ENV_FILE = join(REPO_ROOT, ".env");

/**
 * Estado local del agente (gasto diario, recibos). Compartido a propósito: si el bot
 * y los scripts usaran ledgers distintos, el presupuesto diario se podría gastar dos veces.
 */
export const LEDGER_FILE = join(REPO_ROOT, "data", "ledger.json");
