import { describe, expect, it } from "vitest";
import {
  concat, decodeFunctionData, encodeAbiParameters, encodeFunctionData, getAddress,
  keccak256, pad, toHex, zeroAddress, type Address, type Hex,
} from "viem";
import { fromDataSuffix } from "@celo/attribution-tags";
import { assertValidCode } from "../src/attribution/tag.js";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { moduleFactoryAbi, proxyFactoryAbi, rolesAbi, safeAbi } from "../src/fondo/abis.js";
import * as safe from "@vaquita/core/fondo/safe";
import * as transactions from "@vaquita/core/fondo/transacciones";

const address = (n: bigint): Address => getAddress(toHex(n, { size: 20 }));
const contracts = contratosFondo(42220);
const CODE = "celo_abc123";
const config = Object.freeze({
  groupId: "grupo-prueba",
  owners: Object.freeze([address(3n), address(1n), address(2n)]),
  operatingWallet: address(4n), identityWallet: address(5n),
});
const initializer = encodeFunctionData({
  abi: safeAbi, functionName: "setup",
  args: [config.owners, 2n, zeroAddress, "0x", contracts.fallbackHandler.address, zeroAddress, 0n, zeroAddress],
});
// Bytecode sintético: demuestra la fórmula, no procedencia ni despliegue en fork.
const proxyCode: Hex = "0x6001600055";

/** Referencia CREATE2 ensamblada explícitamente, sin el helper de producción. */
function reference(factory: Address, init: Hex, code: Hex, group: string): Address {
  const salt = keccak256(concat([keccak256(init), toHex(BigInt(keccak256(toHex(group))), { size: 32 })]));
  return getAddress(`0x${keccak256(concat(["0xff", factory, salt, keccak256(code)])).slice(-40)}`);
}

describe("creación determinista del fondo, sin RPC", () => {
  it("conserva el grupo exacto y prepara tres responsables con umbral dos y sin reembolsos", () => {
    const before = structuredClone(config);
    expect(safe.creationSalt(config.groupId)).toBe(BigInt(keccak256(toHex(config.groupId))));
    expect(safe.encodeSafeSetup(config)).toBe(initializer);
    expect(decodeFunctionData({ abi: safeAbi, data: safe.encodeSafeSetup(config) })).toEqual({
      functionName: "setup",
      args: [config.owners, 2n, zeroAddress, "0x", contracts.fallbackHandler.address, zeroAddress, 0n, zeroAddress],
    });
    expect(config).toEqual(before);
  });

  it.each([
    [address(1n), address(2n)],
    [address(1n), address(2n), address(3n), address(6n)],
    [address(1n), address(1n), address(2n)],
    [zeroAddress, address(1n), address(2n)],
    [config.operatingWallet, address(1n), address(2n)],
    [config.identityWallet, address(1n), address(2n)],
  ])("rechaza responsables incompatibles con la creación: %j", (...owners) => {
    const input = Object.freeze({ ...config, owners: Object.freeze(owners) });
    const before = structuredClone(input);
    expect(() => safe.encodeSafeSetup(input)).toThrow("Necesitás tres responsables distintos, válidos y ajenos a las cuentas de Vaqui.");
    expect(() => transactions.crearSafe(input, CODE)).toThrow("Necesitás tres responsables distintos, válidos y ajenos a las cuentas de Vaqui.");
    expect(input).toEqual(before);
  });

  it("predice Safe con el initializer, singleton y código de la fábrica, no con el nonce solo", () => {
    const expected = reference(contracts.proxyFactory.address, initializer,
      concat([proxyCode, pad(contracts.safeL2.address, { size: 32 })]), config.groupId);
    expect(safe.predictSafeAddress(config, proxyCode)).toBe(expected);
    expect(safe.predictSafeAddress(config, proxyCode)).toBe(expected);
    expect(safe.predictSafeAddress({ ...config, groupId: "otro-grupo" }, proxyCode)).not.toBe(expected);
    expect(safe.predictSafeAddress({ ...config, owners: [...config.owners].reverse() }, proxyCode)).not.toBe(expected);
  });

  it("predice Roles con el Safe esperado como dueño, avatar y target", () => {
    const predictedSafe = reference(contracts.proxyFactory.address, initializer,
      concat([proxyCode, pad(contracts.safeL2.address, { size: 32 })]), config.groupId);
    const rolesInit = encodeFunctionData({ abi: rolesAbi, functionName: "setUp", args: [
      encodeAbiParameters([{ type: "address" }, { type: "address" }, { type: "address" }],
        [predictedSafe, predictedSafe, predictedSafe]),
    ] });
    const code = concat(["0x602d8060093d393df3363d3d373d3d3d363d73", contracts.rolesMastercopy.address, "0x5af43d82803e903d91602b57fd5bf3"]);
    expect(safe.encodeRolesSetup(predictedSafe)).toBe(rolesInit);
    expect(safe.predictRolesAddress(config.groupId, predictedSafe)).toBe(reference(contracts.moduleFactory.address, rolesInit, code, config.groupId));
  });

  it("construye ambas creaciones con las referencias oficiales y etiqueta solo el calldata exterior", () => {
    const predictedSafe = reference(contracts.proxyFactory.address, initializer,
      concat([proxyCode, pad(contracts.safeL2.address, { size: 32 })]), config.groupId);
    const create = transactions.crearSafe(config, CODE);
    const deploy = transactions.desplegarRoles(predictedSafe, config.groupId, CODE);
    for (const tx of [create, deploy]) {
      expect(Object.keys(tx).sort()).toEqual(["data", "to"]);
      expect(fromDataSuffix(tx.data)?.codes).toEqual([CODE]);
    }
    expect(create.to).toBe(contracts.proxyFactory.address);
    expect(decodeFunctionData({ abi: proxyFactoryAbi, data: create.data })).toEqual({
      functionName: "createProxyWithNonce", args: [contracts.safeL2.address, initializer, BigInt(keccak256(toHex(config.groupId)))],
    });
    expect(deploy.to).toBe(contracts.moduleFactory.address);
    expect(decodeFunctionData({ abi: moduleFactoryAbi, data: deploy.data })).toEqual({
      functionName: "deployModule", args: [contracts.rolesMastercopy.address, safe.encodeRolesSetup(predictedSafe), BigInt(keccak256(toHex(config.groupId)))],
    });
  });

  for (const [name, build] of [
    ["crearSafe", (code: string) => transactions.crearSafe(config, code)],
    ["desplegarRoles", (code: string) => transactions.desplegarRoles(address(1n), config.groupId, code)],
  ] as const) {
    it.each(["", "INVALID!", "otro_codigo", "celo_xxxxxxxx", "celo_test1234"])(`${name} conserva el rechazo del helper para %s`, (code) => {
      let expected: unknown;
      try { assertValidCode(code, { live: true }); } catch (error) { expected = error; }
      expect(expected).toBeInstanceOf(Error);
      const before = structuredClone(config);
      expect(() => build(code)).toThrow(expected as Error);
      expect(config).toEqual(before);
    });
  }
});
