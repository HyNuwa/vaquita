import { EventEmitter } from "node:events";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveAnvil, startAnvil, withAnvil } from "./helpers/anvil.js";

vi.mock("node:child_process", () => ({ spawn: vi.fn(), spawnSync: vi.fn() }));
vi.mock("node:net", () => ({ createServer: vi.fn() }));

class TestChild extends EventEmitter {
  pid = 1234;
  kill = vi.fn((_signal?: string) => {
    queueMicrotask(() => this.emit("exit", 0, null));
    return true;
  });
}

function setup() {
  const child = new TestChild();
  const server = Object.assign(new EventEmitter(), {
    listen: vi.fn((_port: number, _host: string, ready: () => void) => queueMicrotask(ready)),
    address: () => ({ port: 18901 }),
    close: vi.fn((done: (error?: Error) => void) => done()),
  });
  vi.mocked(createServer).mockReturnValue(server as unknown as ReturnType<typeof createServer>);
  vi.mocked(spawn).mockReturnValue(child as unknown as ReturnType<typeof spawn>);
  vi.mocked(spawnSync).mockReturnValue({ status: 0, stdout: "anvil Version: 1.8.7\n", stderr: "" } as ReturnType<typeof spawnSync>);
  const fetchFn = vi.fn<typeof fetch>(async () => Response.json({ jsonrpc: "2.0", id: 1, result: "0xa4ec" }));
  const options = { env: {}, fetchFn, startupTimeoutMs: 30, shutdownTimeoutMs: 20, pollIntervalMs: 1 };
  return { child, server, fetchFn, options };
}

beforeEach(() => vi.resetAllMocks());
afterEach(() => vi.restoreAllMocks());

describe("anvil: resolución y aislamiento", () => {
  it("prioriza ANVIL_BIN sin ejecutar un shell", () => {
    setup();
    expect(resolveAnvil({ ANVIL_BIN: "custom anvil.exe" })).toBe("custom anvil.exe");
    expect(spawnSync).toHaveBeenCalledOnce();
    expect(spawnSync).toHaveBeenCalledWith("custom anvil.exe", ["--version"], expect.objectContaining({ shell: false, timeout: 5000 }));
  });

  it("busca en PATH y luego en el fallback documentado", () => {
    setup();
    vi.mocked(spawnSync).mockReturnValueOnce({ status: null, error: new Error("ENOENT") } as ReturnType<typeof spawnSync>);
    expect(resolveAnvil({})).toMatch(/[\\/]\.foundry[\\/]bin[\\/]anvil(?:\.exe)?$/);
    expect(spawnSync).toHaveBeenCalledTimes(2);
  });

  it("no oculta un ANVIL_BIN inválido con otro ejecutable", () => {
    setup();
    vi.mocked(spawnSync).mockReturnValue({ status: 1, stdout: "", stderr: "hidden" } as ReturnType<typeof spawnSync>);
    expect(() => resolveAnvil({ ANVIL_BIN: "invalid" })).toThrow("No se pudo ejecutar Anvil. Revisá ANVIL_BIN o instalá Foundry.");
    expect(spawnSync).toHaveBeenCalledOnce();
  });

  it("rechaza LIVE_PAYMENTS incluso vacío antes de resolver o lanzar", async () => {
    const s = setup();
    await expect(startAnvil({ ...s.options, env: { LIVE_PAYMENTS: "" } })).rejects.toThrow("El arnés de fork requiere LIVE_PAYMENTS ausente.");
    expect(spawnSync).not.toHaveBeenCalled();
    expect(createServer).not.toHaveBeenCalled();
    expect(spawn).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });
});

describe("anvil: ciclo de vida", () => {
  it("reserva puerto local, espera 42220 y cierra solo su hijo una vez", async () => {
    const s = setup();
    const fork = await startAnvil({ ...s.options, env: { CELO_RPC_URL: "https://rpc.example.invalid" } });
    expect(s.server.listen).toHaveBeenCalledWith(0, "127.0.0.1", expect.any(Function));
    expect(s.server.close).toHaveBeenCalledOnce();
    expect(spawn).toHaveBeenCalledWith(expect.any(String), ["--fork-url", "https://rpc.example.invalid", "--celo", "--host", "127.0.0.1", "--port", "18901", "--silent"], expect.objectContaining({ shell: false, windowsHide: true, stdio: "ignore" }));
    expect(fork.rpcUrl).toBe("http://127.0.0.1:18901");
    expect(s.fetchFn).toHaveBeenCalledWith(fork.rpcUrl, expect.objectContaining({ redirect: "error", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }) }));
    await Promise.all([fork.stop(), fork.stop()]);
    expect(s.child.kill).toHaveBeenCalledExactlyOnceWith("SIGTERM");
  });

  it("usa forno por defecto y limpia aunque falle la prueba", async () => {
    const s = setup();
    await expect(withAnvil(s.options, async () => { throw new Error("test failed"); })).rejects.toThrow("test failed");
    expect(vi.mocked(spawn).mock.calls[0]?.[1]).toContain("https://forno.celo.org");
    expect(s.child.kill).toHaveBeenCalledExactlyOnceWith("SIGTERM");
  });

  it("limpia al agotar la espera de arranque", async () => {
    const s = setup();
    s.fetchFn.mockRejectedValue(new Error("not ready"));
    await expect(startAnvil(s.options)).rejects.toThrow("Anvil no respondió a tiempo.");
    expect(s.child.kill).toHaveBeenCalledExactlyOnceWith("SIGTERM");
  });

  it("rechaza otra cadena y limpia el hijo", async () => {
    const s = setup();
    s.fetchFn.mockResolvedValue(Response.json({ result: "0x1" }));
    await expect(startAnvil(s.options)).rejects.toThrow("Anvil debe responder con la red 42220.");
    expect(s.child.kill).toHaveBeenCalledExactlyOnceWith("SIGTERM");
  });

  it.each(["error", "exit"])("detecta %s de arranque sin esperar al timeout ni matar otro proceso", async (event) => {
    const s = setup();
    vi.mocked(spawn).mockImplementationOnce(() => {
      queueMicrotask(() => event === "error" ? s.child.emit("error", new Error("private detail")) : s.child.emit("exit", 1, null));
      return s.child as unknown as ReturnType<typeof spawn>;
    });
    await expect(startAnvil(s.options)).rejects.toThrow("Anvil terminó antes de estar listo.");
    expect(s.child.kill).not.toHaveBeenCalled();
  });

  it("no lanza un proceso si no pudo reservar el puerto", async () => {
    const s = setup();
    s.server.listen.mockImplementationOnce(() => queueMicrotask(() => s.server.emit("error", new Error("bind failed"))));
    await expect(startAnvil(s.options)).rejects.toThrow("bind failed");
    expect(spawn).not.toHaveBeenCalled();
    expect(s.fetchFn).not.toHaveBeenCalled();
  });

  it("escala el cierre al mismo hijo y espera su salida", async () => {
    const s = setup();
    s.child.kill.mockImplementation((signal) => {
      if (signal === "SIGKILL") queueMicrotask(() => s.child.emit("exit", null, "SIGKILL"));
      return true;
    });
    const fork = await startAnvil(s.options);
    await fork.stop();
    expect(s.child.kill.mock.calls).toEqual([["SIGTERM"], ["SIGKILL"]]);
  });

  it("informa si el cierre no se confirmó, sin matar por nombre ni PID ajeno", async () => {
    const s = setup();
    s.child.kill.mockImplementation(() => true);
    const fork = await startAnvil(s.options);
    await expect(fork.stop()).rejects.toThrow("No se pudo confirmar el cierre de Anvil.");
    expect(s.child.kill.mock.calls).toEqual([["SIGTERM"], ["SIGKILL"]]);
  });
});
