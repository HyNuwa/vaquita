import { describe, expect, it } from "vitest";
import {
  decodeAbiParameters, decodeEventLog, decodeFunctionData, decodeFunctionResult,
  encodeAbiParameters, encodeFunctionData, encodeFunctionResult,
  getAbiItem, pad, parseAbiParameters, toEventSelector, toFunctionSelector, zeroAddress, type Abi, type Hex,
} from "viem";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { moduleFactoryAbi, multiSendCallOnlyAbi, proxyFactoryAbi, rolesAbi, safeAbi } from "../src/fondo/abis.js";

const contracts = contratosFondo(42220);
// Direcciones sintéticas: no hay cuentas ni claves reales en estas pruebas.
const safe = "0x0000000000000000000000000000000000000011";
const owners = [safe, "0x0000000000000000000000000000000000000022", "0x0000000000000000000000000000000000000033"] as const;
const key = `0x${"11".repeat(32)}` as const;

function roundTrip(abi: Abi, functionName: string, args: readonly unknown[]) {
  const data = encodeFunctionData({ abi, functionName, args });
  expect(decodeFunctionData({ abi, data })).toEqual({ functionName, args });
  return data;
}

describe("ABI de inicialización del fondo", () => {
  it("codifica Safe 2 de 3 y su despliegue con nonce", () => {
    const initializer = roundTrip(safeAbi, "setup", [owners, 2n, zeroAddress, "0x", contracts.fallbackHandler.address, zeroAddress, 0n, zeroAddress]);
    expect(initializer.slice(0, 10)).toBe(toFunctionSelector("setup(address[],uint256,address,bytes,address,address,uint256,address)"));
    roundTrip(proxyFactoryAbi, "createProxyWithNonce", [contracts.safeL2.address, initializer, 777n]);
  });

  it("codifica Roles con dueño, avatar y target iguales al fondo y lo despliega", () => {
    const parameters = parseAbiParameters("address owner, address avatar, address target");
    const setup = encodeAbiParameters(parameters, [safe, safe, safe]);
    const initializer = roundTrip(rolesAbi, "setUp", [setup]);
    expect(decodeAbiParameters(parameters, setup)).toEqual([safe, safe, safe]);
    roundTrip(moduleFactoryAbi, "deployModule", [contracts.rolesMastercopy.address, initializer, 777n]);
  });

  it.each(["owner", "avatar", "target"] as const)("lee %s de Roles 2.1.1", (functionName) => {
    expect(encodeFunctionData({ abi: rolesAbi, functionName })).toBe(toFunctionSelector(`${functionName}()`));
    const data = encodeFunctionResult({ abi: rolesAbi, functionName, result: safe });
    expect(decodeFunctionResult({ abi: rolesAbi, functionName, data })).toBe(safe);
  });

  it("lee responsables y umbral de Safe", () => {
    const ownerData = encodeFunctionResult({ abi: safeAbi, functionName: "getOwners", result: owners });
    expect(decodeFunctionResult({ abi: safeAbi, functionName: "getOwners", data: ownerData })).toEqual(owners);
    const thresholdData = encodeFunctionResult({ abi: safeAbi, functionName: "getThreshold", result: 2n });
    expect(decodeFunctionResult({ abi: safeAbi, functionName: "getThreshold", data: thresholdData })).toBe(2n);
  });

  it.each([
    [proxyFactoryAbi, "ProxyCreation", false],
    [moduleFactoryAbi, "ModuleProxyCreation", true],
  ] as const)("decodifica el evento de despliegue %s / %s", (abi, eventName, indexedMastercopy) => {
    const mastercopy = indexedMastercopy ? contracts.rolesMastercopy.address : contracts.safeL2.address;
    const args = indexedMastercopy ? { proxy: safe, masterCopy: mastercopy } : { proxy: safe, singleton: mastercopy };
    const topics: [Hex, ...Hex[]] = [
      toEventSelector(`${eventName}(address,address)`),
      pad(safe),
      ...(indexedMastercopy ? [pad(mastercopy)] : []),
    ];
    const data = indexedMastercopy ? "0x" : encodeAbiParameters(parseAbiParameters("address"), [mastercopy]);
    expect(decodeEventLog({ abi, topics, data })).toEqual({ eventName, args });
  });

  it("codifica la habilitación del módulo en un lote de MultiSendCallOnly", () => {
    const enable = roundTrip(safeAbi, "enableModule", [safe]);
    roundTrip(multiSendCallOnlyAbi, "multiSend", [enable]);
    const data = encodeFunctionResult({ abi: safeAbi, functionName: "isModuleEnabled", result: true });
    expect(decodeFunctionResult({ abi: safeAbi, functionName: "isModuleEnabled", data })).toBe(true);
  });
});

describe("ABI de Roles 2.1.1, no v3", () => {
  it("codifica allowance con el orden y anchos de 2.1.1", () => {
    const data = roundTrip(rolesAbi, "setAllowance", [key, 20_000n, 30_000n, 10_000n, 2_592_000n, 0n]);
    expect(data.slice(0, 10)).toBe(toFunctionSelector("setAllowance(bytes32,uint128,uint128,uint128,uint64,uint64)"));
    const result = [10_000n, 30_000n, 2_592_000n, 20_000n, 0n] as const;
    const encoded = encodeFunctionResult({ abi: rolesAbi, functionName: "allowances", result });
    expect(decodeFunctionResult({ abi: rolesAbi, functionName: "allowances", data: encoded })).toEqual(result);
    const item = getAbiItem({ abi: rolesAbi, name: "allowances" });
    expect(item.outputs.map(({ name, type }) => [name, type])).toEqual([
      ["refill", "uint128"], ["maxRefill", "uint128"], ["period", "uint64"], ["balance", "uint128"], ["timestamp", "uint64"],
    ]);
  });

  it("codifica scopeTarget y scopeFunction con ConditionFlat de 2.1.1", () => {
    roundTrip(rolesAbi, "scopeTarget", [key, safe]);
    const conditions = [{ parent: 0, paramType: 5, operator: 5, compValue: "0x" }];
    const data = roundTrip(rolesAbi, "scopeFunction", [key, safe, "0xa9059cbb", conditions, 0]);
    expect(data.slice(0, 10)).toBe(toFunctionSelector("scopeFunction(bytes32,address,bytes4,(uint8,uint8,uint8,bytes)[],uint8)"));
  });

  it("codifica asignación y revocación de roles sin isMember de v3", () => {
    roundTrip(rolesAbi, "assignRoles", [safe, [key], [true]]);
    roundTrip(rolesAbi, "assignRoles", [safe, [key], [false]]);
    expect(rolesAbi.some((item) => String(item.name) === "isMember")).toBe(false);
  });

  it("codifica ejecución con rol y decodifica su resultado", () => {
    roundTrip(rolesAbi, "execTransactionWithRole", [safe, 0n, "0x", 0, key, true]);
    const data = encodeFunctionResult({ abi: rolesAbi, functionName: "execTransactionWithRole", result: true });
    expect(decodeFunctionResult({ abi: rolesAbi, functionName: "execTransactionWithRole", data })).toBe(true);
  });
});
