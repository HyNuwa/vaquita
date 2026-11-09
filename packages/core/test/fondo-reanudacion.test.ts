import { describe, expect, it, vi } from "vitest";
import { concat, decodeFunctionData, encodeFunctionResult, getAddress, keccak256, pad, toHex, type Abi, type Address, type Hex } from "viem";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { proxyFactoryAbi, rolesAbi, safeAbi } from "../src/fondo/abis.js";
import { predictRolesAddress, predictSafeAddress } from "../src/fondo/safe.js";
import { crearSafe, desplegarRoles } from "../src/fondo/transacciones.js";
import { planCreation, type CreationReader } from "@vaquita/core/fondo/creacion";

// Referencias sintéticas SOLO en este fake: no acreditan bytecode de Celo.
vi.mock("../src/config/fondo-contratos.js", async () => {
  const actual = await vi.importActual<typeof import("../src/config/fondo-contratos.js")>("../src/config/fondo-contratos.js");
  const { keccak256 } = await vi.importActual<typeof import("viem")>("viem");
  return { ...actual, contratosFondo: (chainId: number) => Object.fromEntries(
    Object.entries(actual.contratosFondo(chainId)).map(([key, contract]) => [key, { ...contract, codeHash: keccak256("0x6001") }]),
  ) };
});
const address = (n: bigint): Address => getAddress(toHex(n, { size: 20 }));
const config = Object.freeze({ groupId: "retomar", owners: Object.freeze([address(10n), address(11n), address(12n)]), operatingWallet: address(13n), identityWallet: address(14n) });
const contracts = contratosFondo(42220), CODE = "celo_abc123", BLOCK = 42n;
const creationCode: Hex = "0x6001600055";
const safe = predictSafeAddress(config, creationCode), roles = predictRolesAddress(config.groupId, safe);
const sentinel = address(1n), zero = toHex(0n, { size: 32 });
const runtime = concat(["0x363d3d373d3d3d363d73", contracts.rolesMastercopy.address, "0x5af43d82803e903d91602b57fd5bf3"]);
const abi: Abi = [...safeAbi, ...rolesAbi, ...proxyFactoryAbi];
const ERROR = "No pudimos verificar la creación del fondo.";

function fixture(safePresent = true, rolesPresent = true, fault = "") {
  const reads: bigint[] = [];
  const state = Object.freeze({ owners: config.owners, nonce: 0n, budget: 0n });
  const before = JSON.stringify(state, (_, v) => typeof v === "bigint" ? String(v) : v);
  const reader: CreationReader = {
    getChainId: async () => fault === "chain" ? 1 : 42220,
    getBlockNumber: async () => BLOCK,
    getCode: async ({ address: target, blockNumber }) => {
      reads.push(blockNumber);
      if (fault === "transport") throw new Error("untrusted transport detail");
      if (target === safe) return safePresent ? "0x60aa" : undefined;
      if (target === roles) return rolesPresent ? (fault === "runtime" ? "0x60" : runtime) : "0x";
      if (fault === `reference:${target}`) return "0x6002";
      if (fault === "empty-reference") return "0x";
      return "0x6001";
    },
    getStorageAt: async ({ slot, blockNumber }) => {
      reads.push(blockNumber);
      const key = slot === zero ? "singleton" : slot === keccak256(toHex("fallback_manager.handler.address")) ? "handler" : "guard";
      if (fault === key) return pad(address(99n), { size: 32 });
      if (fault === "missing-storage") return undefined;
      return key === "singleton" ? pad(contracts.safeL2.address, { size: 32 }) : key === "handler" ? pad(contracts.fallbackHandler.address, { size: 32 }) : zero;
    },
    call: async ({ data, blockNumber }) => {
      reads.push(blockNumber);
      if (fault === "decode") return { data: "0x1234" };
      const { functionName } = decodeFunctionData({ abi, data });
      const values: Record<string, unknown> = {
        proxyCreationCode: fault === "creation" ? "0x" : creationCode,
        getOwners: fault === "owners" ? [address(99n), ...config.owners.slice(1)] : [...config.owners].reverse(),
        getThreshold: fault === "threshold" ? 1n : 2n,
        getModulesPaginated: [fault === "modules" ? [address(99n)] : fault === "configured" ? [roles] : [], fault === "page" ? address(99n) : sentinel],
        owner: fault === "owner" ? address(99n) : safe,
        avatar: fault === "avatar" ? address(99n) : safe,
        target: fault === "target" ? address(99n) : safe,
      };
      return { data: encodeFunctionResult({ abi, functionName, result: values[functionName] }) };
    },
  };
  return { reader, reads, unchanged: () => expect(JSON.stringify(state, (_, v) => typeof v === "bigint" ? String(v) : v)).toBe(before) };
}

describe("reanudación de los dos despliegues, no activación de permisos", () => {
  it.each([[false, false], [true, false], [false, true], [true, true]])("retoma Safe=%s Roles=%s sin repetir pasos", async (safePresent, rolesPresent) => {
    const f = fixture(safePresent, rolesPresent);
    const result = await planCreation(config, CODE, f.reader);
    expect(result).toEqual({ safe, roles, blockNumber: BLOCK, steps: [
      ...(!safePresent ? [{ step: "safe", tx: crearSafe(config, CODE) }] : []),
      ...(!rolesPresent ? [{ step: "roles", tx: desplegarRoles(safe, config.groupId, CODE) }] : []),
    ] });
    expect(f.reads.length).toBeGreaterThan(0);
    expect(f.reads.every((n) => n === BLOCK)).toBe(true);
    f.unchanged();
  });

  it("acepta solo Roles como módulo ya habilitado sin declarar permisos verificados", async () => {
    const f = fixture(true, true, "configured");
    expect((await planCreation(config, CODE, f.reader)).steps).toEqual([]);
    f.unchanged();
  });

  it.each([
    "chain", "empty-reference", "creation", "decode", "transport", "missing-storage",
    "singleton", "handler", "guard", "owners", "threshold", "modules", "page",
    "runtime", "owner", "avatar", "target",
    ...[contracts.proxyFactory, contracts.safeL2, contracts.fallbackHandler, contracts.moduleFactory, contracts.rolesMastercopy].map((c) => `reference:${c.address}`),
  ])("rechaza %s sin devolver un plan parcial ni detalles del transporte", async (fault) => {
    const f = fixture(true, true, fault);
    await expect(planCreation(config, CODE, f.reader)).rejects.toEqual(new Error(ERROR));
    if (fault === "chain") expect(f.reads).toEqual([]);
    f.unchanged();
  });

  it("rechaza responsables o código antes de cualquier lectura", async () => {
    const f = fixture();
    await expect(planCreation({ ...config, owners: [config.operatingWallet, ...config.owners.slice(1)] }, CODE, f.reader)).rejects.toThrow("Necesitás tres responsables");
    await expect(planCreation(config, "", f.reader)).rejects.toThrow("ATTRIBUTION_CODE");
    expect(f.reads).toEqual([]);
    f.unchanged();
  });
});
