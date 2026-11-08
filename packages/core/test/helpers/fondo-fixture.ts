import { randomBytes } from "node:crypto";
import { createPublicClient, encodeAbiParameters, encodeFunctionData, getAddress, http, keccak256, parseEventLogs, toHex, zeroAddress, type Address, type Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { contratosFondo } from "../../src/config/fondo-contratos.js";
import { moduleFactoryAbi, proxyFactoryAbi, rolesAbi, safeAbi } from "../../src/fondo/abis.js";
import { enviador } from "../../src/fondo/enviador.js";
import type { startAnvil } from "./anvil.js";
import { forkStep } from "./fork-step.js";

type Fork = Awaited<ReturnType<typeof startAnvil>>;

/** Fixture sin claves persistidas; todo estado y envío queda en el proceso local. */
export async function fundFixture(fork: Fork) {
  const creator = privateKeyToAccount(generatePrivateKey());
  const owners = [privateKeyToAccount(generatePrivateKey()), privateKeyToAccount(generatePrivateKey()), privateKeyToAccount(generatePrivateKey())];
  const client = createPublicClient({ transport: http(fork.rpcUrl, { retryCount: 0, fetchOptions: { redirect: "error" } }) });
  const contracts = await forkStep("contratos de referencia", async () => contratosFondo(await client.getChainId()));
  // Se verifica el código fuente del despliegue antes de financiar o firmar.
  for (const { address, codeHash } of Object.values(contracts)) {
    const code = await forkStep("contratos de referencia", () => client.getCode({ address }));
    if (!code || keccak256(code) !== codeHash) throw new Error("El código del contrato de referencia no coincide.");
  }
  for (const account of [creator, ...owners]) {
    await forkStep("financiar cuentas", () => fork.rpc("anvil_setBalance", [account.address, toHex(1000n * 10n ** 18n)]));
  }
  const sender = enviador({ mode: "fork", env: { E2E_FORK: "1" }, deps: {
    rpcUrl: fork.rpcUrl, account: creator, attributionCode: "celo_ab12cd34",
  } });
  const send = (to: Address, data: Hex) => forkStep(to === contracts.proxyFactory.address ? "crear fondo" : "crear módulo", async () => {
    const prepared = await sender.prepare({ to, data });
    if (!prepared.ok) throw new Error("No se pudo preparar el despliegue de prueba.");
    const result = await sender.broadcast(prepared.signedTx);
    if (result.status !== "success") throw new Error("El despliegue de prueba falló.");
    return client.getTransactionReceipt({ hash: result.txHash });
  });
  const salt = () => BigInt(`0x${randomBytes(16).toString("hex")}`);
  const initializer = encodeFunctionData({ abi: safeAbi, functionName: "setup", args: [
    owners.map((account) => account.address), 2n, zeroAddress, "0x", contracts.fallbackHandler.address, zeroAddress, 0n, zeroAddress,
  ] });
  const safeReceipt = await send(contracts.proxyFactory.address, encodeFunctionData({ abi: proxyFactoryAbi, functionName: "createProxyWithNonce", args: [contracts.safeL2.address, initializer, salt()] }));
  const safeEvents = parseEventLogs({ abi: proxyFactoryAbi, eventName: "ProxyCreation", logs: safeReceipt.logs.filter((log) => getAddress(log.address) === contracts.proxyFactory.address) });
  if (safeEvents.length !== 1) throw new Error("No se encontró un único despliegue del fondo.");
  const safe = getAddress(safeEvents[0]!.args.proxy);
  const rolesInit = encodeFunctionData({ abi: rolesAbi, functionName: "setUp", args: [encodeAbiParameters(
    [{ type: "address" }, { type: "address" }, { type: "address" }], [safe, safe, safe],
  )] });
  const rolesReceipt = await send(contracts.moduleFactory.address, encodeFunctionData({ abi: moduleFactoryAbi, functionName: "deployModule", args: [contracts.rolesMastercopy.address, rolesInit, salt()] }));
  const rolesEvents = parseEventLogs({ abi: moduleFactoryAbi, eventName: "ModuleProxyCreation", logs: rolesReceipt.logs.filter((log) => getAddress(log.address) === contracts.moduleFactory.address) });
  if (rolesEvents.length !== 1 || getAddress(rolesEvents[0]!.args.masterCopy) !== contracts.rolesMastercopy.address) throw new Error("No se encontró un único despliegue del módulo esperado.");
  const roles = getAddress(rolesEvents[0]!.args.proxy);
  return {
    client, safe, roles, creator, owners,
    async fundToken(token: Address, holder: Address, amount: bigint) {
      if (amount < 0n) throw new Error("El saldo de prueba no puede ser negativo.");
      await forkStep("financiar token", () => fork.rpc("anvil_dealERC20", [holder, token, toHex(amount)]));
    },
    async advanceTime(seconds: number) {
      if (!Number.isSafeInteger(seconds) || seconds < 0) throw new Error("El tiempo de prueba debe ser un entero no negativo.");
      await forkStep("avanzar tiempo", async () => {
        await fork.rpc("evm_increaseTime", [seconds]);
        await fork.rpc("evm_mine");
      });
    },
  };
}
