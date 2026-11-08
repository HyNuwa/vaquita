import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { homedir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

type TestEnv = Readonly<Record<string, string | undefined>>;
export interface AnvilOptions {
  env?: TestEnv;
  fetchFn?: typeof fetch;
  startupTimeoutMs?: number;
  shutdownTimeoutMs?: number;
  pollIntervalMs?: number;
}

/** No carga archivos de entorno ni busca fuera de las ubicaciones documentadas. */
export function resolveAnvil(env: TestEnv = process.env): string {
  const binary = process.platform === "win32" ? "anvil.exe" : "anvil";
  const candidates = env.ANVIL_BIN !== undefined
    ? [env.ANVIL_BIN]
    : [binary, join(homedir(), ".foundry", "bin", binary)];
  for (const executable of candidates) {
    const result = spawnSync(executable, ["--version"], {
      encoding: "utf8", timeout: 5000, shell: false, windowsHide: true,
    });
    if (result.status === 0 && result.stdout?.startsWith("anvil Version:")) return executable;
  }
  throw new Error("No se pudo ejecutar Anvil. Revisá ANVIL_BIN o instalá Foundry.");
}

async function freePort(): Promise<number> {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close((error) => {
        if (error) reject(error);
        else if (!address || typeof address === "string") reject(new Error("No se pudo reservar un puerto local."));
        else resolve(address.port);
      });
    });
  });
}

/** Solo RPC administrativo del fork y lecturas; los envíos usan el selector de S1. */
export async function startAnvil(options: AnvilOptions = {}) {
  const env = options.env ?? process.env;
  if ("LIVE_PAYMENTS" in env) throw new Error("El arnés de fork requiere LIVE_PAYMENTS ausente.");
  const executable = resolveAnvil(env);
  const port = await freePort();
  const rpcUrl = `http://127.0.0.1:${port}`;
  const child = spawn(executable, [
    "--fork-url", env.CELO_RPC_URL ?? "https://forno.celo.org", "--celo",
    "--host", "127.0.0.1", "--port", String(port), "--silent",
  ], { shell: false, windowsHide: true, stdio: "ignore" });
  let exited = false;
  const closed = new Promise<void>((resolve) => {
    const finish = () => { exited = true; resolve(); };
    child.once("exit", finish);
    child.once("error", finish);
  });
  const shutdownTimeoutMs = options.shutdownTimeoutMs ?? 2000;
  let stopping: Promise<void> | undefined;
  const awaitExit = () => new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => resolve(false), shutdownTimeoutMs);
    void closed.then(() => { clearTimeout(timer); resolve(true); });
  });
  const stop = () => stopping ??= (async () => {
    if (exited) return;
    child.kill("SIGTERM");
    if (await awaitExit()) return;
    child.kill("SIGKILL");
    if (!await awaitExit()) throw new Error("No se pudo confirmar el cierre de Anvil.");
  })();

  async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
    if (exited) throw new Error("Anvil terminó antes de estar listo.");
    const response = await (options.fetchFn ?? fetch)(rpcUrl, {
      method: "POST", headers: { "content-type": "application/json" }, redirect: "error",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: AbortSignal.timeout(Math.min(options.startupTimeoutMs ?? 30000, 1000)),
    });
    if (!response.ok) throw new Error("El fork no respondió correctamente.");
    const body = await response.json() as { result?: T; error?: unknown };
    if (body.error || !("result" in body)) throw new Error("El fork rechazó la consulta local.");
    return body.result as T;
  }

  try {
    const deadline = Date.now() + (options.startupTimeoutMs ?? 30000);
    while (Date.now() < deadline) {
      if (exited) throw new Error("Anvil terminó antes de estar listo.");
      let chainId: string | undefined;
      try { chainId = await rpc<string>("eth_chainId"); } catch { /* Espera acotada del arranque. */ }
      if (exited) throw new Error("Anvil terminó antes de estar listo.");
      if (chainId !== undefined) {
        if (chainId !== "0xa4ec") throw new Error("Anvil debe responder con la red 42220.");
        return { rpcUrl, rpc, stop };
      }
      await delay(options.pollIntervalMs ?? 100);
    }
    throw new Error("Anvil no respondió a tiempo.");
  } catch (error) {
    try { await stop(); } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "Falló el arranque y no se confirmó el cierre de Anvil.");
    }
    throw error;
  }
}

/** Cierra el proceso propio también cuando falla la prueba que lo usa. */
export async function withAnvil<T>(options: AnvilOptions, run: (fork: Awaited<ReturnType<typeof startAnvil>>) => Promise<T>): Promise<T> {
  const fork = await startAnvil(options);
  try { return await run(fork); }
  finally { await fork.stop(); }
}
