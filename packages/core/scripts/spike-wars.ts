/**
 * Spike de wARS, parte SOLO LECTURA: no transmite nada, no gasta gas ni necesita saldo.
 *   npm run spike:lectura
 *
 * Responde lo que se puede saber sin plata antes de escribir el contrato: si wARS es un
 * proxy, si está pausado, si acepta `permit`, y si ignora el tag al final del calldata.
 * Las simulaciones son `eth_call`. No usa la clave del agente: firma con una descartable,
 * generada en memoria, de una wallet sin fondos.
 *
 * Lo que requiere fondos o un celular (`transferFrom` real, tag desde la wallet móvil,
 * peor caso de gas) sigue pendiente y va a `docs/pruebas/spike.md`.
 */
import { createPublicClient, encodeFunctionData, erc20Abi, hashDomain, http, keccak256, parseAbi, parseSignature, toHex, type Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { appendTag } from "../src/attribution/tag.js";
import "../src/config/load-env.js";
import { CELO_MAINNET } from "../src/config/network.js";
import { WFIAT } from "../src/config/tokens.js";
import { describeError } from "../src/compra/runner.js";

const rpcUrl = process.env.CELO_RPC_URL;
const attributionCode = process.env.ATTRIBUTION_CODE;
if (!rpcUrl || !attributionCode) throw new Error("Faltan CELO_RPC_URL o ATTRIBUTION_CODE en .env");

const account = privateKeyToAccount(generatePrivateKey());
const client = createPublicClient({ transport: http(rpcUrl) });
const token = WFIAT.wARS.address;

const permitAbi = parseAbi([
  "function DOMAIN_SEPARATOR() view returns (bytes32)",
  "function nonces(address) view returns (uint256)",
  "function name() view returns (string)",
  "function eip712Domain() view returns (bytes1, string name, string version, uint256, address, bytes32, uint256[])",
  "function paused() view returns (bool)",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
]);

const firstLine = (error: unknown) => describeError(error).split("\n")[0]?.slice(0, 140) ?? "";

async function step(label: string, run: () => Promise<string>): Promise<string | undefined> {
  try {
    const detail = await run();
    console.log(`✅ ${label}: ${detail}`);
    return detail;
  } catch (error) {
    console.log(`❌ ${label}: ${firstLine(error)}`);
    return undefined;
  }
}

/** Slot de implementación de EIP-1967, calculado para no escribirlo de memoria. */
const implementationSlot = toHex(BigInt(keccak256(toHex("eip1967.proxy.implementation"))) - 1n, { size: 32 });

const read = <T>(functionName: "DOMAIN_SEPARATOR" | "name" | "paused") =>
  client.readContract({ address: token, abi: permitAbi, functionName }) as Promise<T>;

console.log(`wARS en ${token}, wallet descartable ${account.address}\n`);

const chainId = await client.getChainId();
if (chainId !== CELO_MAINNET.chainId) throw new Error(`Red inesperada: ${chainId}`);

await step("Código del token", async () => `${((await client.getCode({ address: token }))?.length ?? 2) / 2 - 1} bytes`);
await step("Implementación (proxy EIP-1967)", async () => {
  const slot = await client.getStorageAt({ address: token, slot: implementationSlot });
  return BigInt(slot ?? "0x0") === 0n ? "no es proxy EIP-1967" : `0x${slot?.slice(-40)}`;
});
await step("Pausado", async () => String(await read<boolean>("paused")));

// --- permit ---
const separator = await step("DOMAIN_SEPARATOR", () => read<Hex>("DOMAIN_SEPARATOR"));
const name = await step("name", () => read<string>("name"));
await step("eip712Domain", async () => {
  const domain = await client.readContract({ address: token, abi: permitAbi, functionName: "eip712Domain" });
  return `name "${domain[1]}", version "${domain[2]}"`;
});
// wARS puede no exponer `version()`: se confirma contra su separador, sin adivinar.
const version = await step("Versión que reproduce el separador", async () => {
  const types = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
  } as const;
  const match = ["1", "2", "3", "4", "5"].find(
    (candidate) => hashDomain({ domain: { name: name ?? "", version: candidate, chainId: BigInt(chainId), verifyingContract: token }, types }) === separator,
  );
  if (!match) throw new Error("Ninguna versión conocida reproduce el separador.");
  return match;
});
await step("Permit simulado con firma real", async () => {
  if (!name || !version) throw new Error("Sin name o version no se puede armar la firma.");
  const nonce = await client.readContract({ address: token, abi: permitAbi, functionName: "nonces", args: [account.address] });
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60);
  const signature = await account.signTypedData({
    domain: { name, version, chainId, verifyingContract: token },
    types: {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Permit",
    message: { owner: account.address, spender: account.address, value: 1n, nonce, deadline },
  });
  const { r, s, v, yParity } = parseSignature(signature);
  await client.simulateContract({
    account: account.address,
    address: token,
    abi: permitAbi,
    functionName: "permit",
    args: [account.address, account.address, 1n, deadline, Number(v ?? BigInt(27 + yParity)), r, s],
  });
  return "aceptada";
});

// --- tag al final del calldata ---
const approve = encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [account.address, 1n] });
await step("approve sin tag (simulado)", async () => (await client.call({ account: account.address, to: token, data: approve })).data ?? "sin retorno");
await step("approve con tag (simulado)", async () => (await client.call({ account: account.address, to: token, data: appendTag(approve, attributionCode) })).data ?? "sin retorno");

// --- cómo falla: D11.4 solo saltea a un comprador por falta de saldo comprobada ---
const failing = encodeFunctionData({ abi: erc20Abi, functionName: "transferFrom", args: [account.address, token, 1n] });
try {
  await client.call({ account: token, to: token, data: failing });
  console.log("⚠️  transferFrom sin autorización no revirtió: revisar antes de seguir.");
} catch (error) {
  console.log(`ℹ️  transferFrom sin autorización revierte: ${firstLine(error)}`);
}
