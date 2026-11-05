// Spike de viabilidad, no es codigo de producto. Habla con anvil en 127.0.0.1:18545 y solo lee el precio de gas de forno.
// Nada se transmite a mainnet. Las claves se generan en cada corrida.
//   anvil --fork-url https://forno.celo.org --celo --port 18545 --silent
//   node docs/pruebas/spike-fondo-fork.cjs
const { createRequire } = require("node:module");
const req = createRequire(process.cwd() + "/package.json"); // correr desde la raiz del repo
const v = req("viem");
const { privateKeyToAccount } = req("viem/accounts");
const { celo } = req("viem/chains");
const celoV = req("viem/celo");
const { toDataSuffix, fromDataSuffix } = req("@celo/attribution-tags");

const RPC = "http://127.0.0.1:18545";
const TAG = "celo_ab12cd34";
const WARS = v.getAddress("0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d");
const USDC = v.getAddress("0xcebA9300f2b948710d2653dD7B07f33A8B32118C");
const ADAPTER = v.getAddress("0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B");
const SAFE_L2 = "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762";
const FACTORY = "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67";
const HANDLER = "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99";
const MULTI = "0x9641d764fc13c8B624c04430C7356C1C7C8102e2";
const ROLES = "0xF2964CE6161ce0e75964Fe7927cE114cb0B283D5";
const MODF = "0x000000000000aDdB49795b0f9bA5BC298cDda236";
const ONE = 10n ** 18n;
const ZERO = v.zeroAddress;

const { generatePrivateKey } = req("viem/accounts");
const keys = [...Array(8)].map(() => generatePrivateKey());
const accs = keys.map((k) => privateKeyToAccount(k));
const [A, B, C, VAQ, CREATOR, R1, R2, OUT] = accs;
const pub = v.createPublicClient({ chain: celo, transport: v.http(RPC) });
const wallet = (a) => v.createWalletClient({ account: a, chain: celo, transport: v.http(RPC) });
const tag = (d) => v.concat([d, toDataSuffix(TAG)]);

const SAFE = v.parseAbi([
  "function setup(address[] _owners,uint256 _threshold,address to,bytes data,address fallbackHandler,address paymentToken,uint256 payment,address paymentReceiver)",
  "function nonce() view returns (uint256)",
  "function getOwners() view returns (address[])",
  "function getThreshold() view returns (uint256)",
  "function isModuleEnabled(address) view returns (bool)",
  "function getStorageAt(uint256,uint256) view returns (bytes)",
  "function approveHash(bytes32)",
  "function approvedHashes(address,bytes32) view returns (uint256)",
  "function enableModule(address)",
  "function disableModule(address,address)",
  "function swapOwner(address,address,address)",
  "function getTransactionHash(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 _nonce) view returns (bytes32)",
  "function execTransaction(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,bytes signatures) payable returns (bool)",
  "event ExecutionSuccess(bytes32 indexed txHash, uint256 payment)",
  "event ExecutionFailure(bytes32 indexed txHash, uint256 payment)",
  "event ExecutionFromModuleSuccess(address indexed module)",
  "event ProxyCreation(address indexed proxy, address singleton)",
]);
const FAC = v.parseAbi(["function createProxyWithNonce(address _singleton,bytes initializer,uint256 saltNonce) returns (address)", "event ProxyCreation(address indexed proxy, address singleton)"]);
const MF = v.parseAbi(["function deployModule(address masterCopy,bytes initializer,uint256 saltNonce) returns (address)", "event ModuleProxyCreation(address indexed proxy, address indexed masterCopy)"]);
const RL = v.parseAbi([
  "function setUp(bytes)",
  "function owner() view returns (address)", "function avatar() view returns (address)", "function target() view returns (address)",
  "function allowances(bytes32) view returns (uint128 refill,uint128 maxRefill,uint64 period,uint128 balance,uint64 timestamp)",
  "function setAllowance(bytes32 key,uint128 balance,uint128 maxRefill,uint128 refill,uint64 period,uint64 timestamp)",
  "function scopeTarget(bytes32 roleKey,address targetAddress)",
  "struct ConditionFlat {uint8 parent;uint8 paramType;uint8 operator;bytes compValue;}",
  "function scopeFunction(bytes32 roleKey,address targetAddress,bytes4 selector,ConditionFlat[] conditions,uint8 options)",
  "function assignRoles(address module,bytes32[] roleKeys,bool[] memberOf)",
  "function isModuleEnabled(address) view returns (bool)",
  "function execTransactionWithRole(address to,uint256 value,bytes data,uint8 operation,bytes32 roleKey,bool shouldRevert) returns (bool)",
]);
const MS = v.parseAbi(["function multiSend(bytes transactions) payable"]);

const out = {};
const gasRows = [];
async function send(a, to, data, label) {
  const hash = await wallet(a).sendTransaction({ to, data: tag(data) });
  const r = await pub.waitForTransactionReceipt({ hash });
  gasRows.push([label, r.gasUsed, r.status]);
  const tx = await pub.getTransaction({ hash });
  const t = fromDataSuffix(tx.input);
  if (!t || !t.codes.includes(TAG)) throw new Error("sin etiqueta " + label);
  return r;
}
const multi = (calls) => v.encodeFunctionData({ abi: MS, functionName: "multiSend", args: [v.concat(calls.flatMap((c) => [
  v.encodePacked(["uint8", "address", "uint256", "uint256", "bytes"], [0, c.to, 0n, BigInt(v.size(c.data)), c.data]),
]))] });

async function main() {
  const chainId = await pub.getChainId();
  for (const a of accs) await pub.request({ method: "anvil_setBalance", params: [a.address, v.toHex(1000n * ONE)] });
  console.log("chainId", chainId, "block", await pub.getBlockNumber());
  // 1. Safe
  const init = v.encodeFunctionData({ abi: SAFE, functionName: "setup", args: [[A.address, B.address, C.address], 2n, ZERO, "0x", HANDLER, ZERO, 0n, ZERO] });
  let r = await send(CREATOR, FACTORY, v.encodeFunctionData({ abi: FAC, functionName: "createProxyWithNonce", args: [SAFE_L2, init, 777n] }), "crear Safe");
  const safe = v.parseEventLogs({ abi: FAC, logs: r.logs, eventName: "ProxyCreation" })[0].args.proxy;
  // 2. Roles
  const rinit = v.encodeFunctionData({ abi: RL, functionName: "setUp", args: [v.encodeAbiParameters([{ type: "address" }, { type: "address" }, { type: "address" }], [safe, safe, safe])] });
  r = await send(CREATOR, MODF, v.encodeFunctionData({ abi: MF, functionName: "deployModule", args: [ROLES, rinit, 777n] }), "desplegar Roles");
  const roles = v.parseEventLogs({ abi: MF, logs: r.logs, eventName: "ModuleProxyCreation" })[0].args.proxy;
  const code = await pub.getCode({ address: roles });
  console.log("roles proxy code", code);
  console.log("owner/avatar/target", await Promise.all(["owner", "avatar", "target"].map((f) => pub.readContract({ address: roles, abi: RL, functionName: f }))), "safe", safe);
  await pub.request({ method: "anvil_dealERC20", params: [safe, WARS, v.toHex(200000n * ONE)] }).catch(async (e) => { console.log("dealERC20 falla", e.shortMessage); });
  console.log("saldo safe", await pub.readContract({ address: WARS, abi: v.erc20Abi, functionName: "balanceOf", args: [safe] }));

  const execSafe = async (to, data, operation, signers, label, value = 0n) => {
    const n = await pub.readContract({ address: safe, abi: SAFE, functionName: "nonce" });
    const h = await pub.readContract({ address: safe, abi: SAFE, functionName: "getTransactionHash", args: [to, value, data, operation, 0n, 0n, 0n, ZERO, ZERO, n] });
    const [first, last] = signers;
    await send(first, safe, v.encodeFunctionData({ abi: SAFE, functionName: "approveHash", args: [h] }), "approveHash");
    const sigs = [first.address, last.address].sort((x, y) => (BigInt(x) < BigInt(y) ? -1 : 1)).map((o) => v.concat([v.pad(o, { size: 32 }), v.pad("0x0", { size: 32 }), "0x01"]));
    const rc = await send(last, safe, v.encodeFunctionData({ abi: SAFE, functionName: "execTransaction", args: [to, value, data, operation, 0n, 0n, 0n, ZERO, ZERO, v.concat(sigs)] }), label);
    return { rc, h, n, evs: v.parseEventLogs({ abi: SAFE, logs: rc.logs }).map((e) => e.eventName) };
  };

  // Creador no puede activar solo
  const roleKey = v.keccak256(v.toHex("vaqui"));
  const allowKey = v.keccak256(v.toHex("vaqui-mensual"));
  const P = 30n * 86400n;
  const conds = (recips) => {
    const c = [
      { parent: 0, paramType: 5, operator: 5, compValue: "0x" },
      { parent: 0, paramType: 0, operator: 2, compValue: "0x" },
      { parent: 0, paramType: 0, operator: 1, compValue: "0x" },
    ];
    for (const x of recips) c.push({ parent: 1, paramType: 1, operator: 16, compValue: v.pad(x, { size: 32 }) });
    c.push({ parent: 2, paramType: 1, operator: 18, compValue: v.toHex(5000n * ONE + 1n, { size: 32 }) });
    c.push({ parent: 2, paramType: 1, operator: 28, compValue: allowKey });
    return c;
  };
  const TRANSFER = v.toFunctionSelector("transfer(address,uint256)");
  const batch = multi([
    { to: safe, data: v.encodeFunctionData({ abi: SAFE, functionName: "enableModule", args: [roles] }) },
    { to: roles, data: v.encodeFunctionData({ abi: RL, functionName: "setAllowance", args: [allowKey, 20000n * ONE, 20000n * ONE, 20000n * ONE, P, 0n] }) },
    { to: roles, data: v.encodeFunctionData({ abi: RL, functionName: "scopeTarget", args: [roleKey, WARS] }) },
    { to: roles, data: v.encodeFunctionData({ abi: RL, functionName: "scopeFunction", args: [roleKey, WARS, TRANSFER, conds([R1.address]), 0] }) },
    { to: roles, data: v.encodeFunctionData({ abi: RL, functionName: "assignRoles", args: [VAQ.address, [roleKey], [true]] }) },
  ]);
  // Una sola firma
  const oneSig = await (async () => {
    const n = await pub.readContract({ address: safe, abi: SAFE, functionName: "nonce" });
    const sig = v.concat([v.pad(A.address, { size: 32 }), v.pad("0x0", { size: 32 }), "0x01"]);
    try { await pub.simulateContract({ account: A, address: safe, abi: SAFE, functionName: "execTransaction", args: [MULTI, 0n, batch, 1, 0n, 0n, 0n, ZERO, ZERO, sig] }); return "PASA"; } catch (e) { return e.shortMessage + " | " + (e.cause?.reason ?? e.cause?.data?.errorName ?? ""); }
  })();
  console.log("una firma:", oneSig);
  const setupRes = await execSafe(MULTI, batch, 1, [A, B], "lote de reglas (1 destinatario)");
  console.log("lote:", setupRes.evs, "modulo", await pub.readContract({ address: safe, abi: SAFE, functionName: "isModuleEnabled", args: [roles] }));
  console.log("allowance", await pub.readContract({ address: roles, abi: RL, functionName: "allowances", args: [allowKey] }));

  // Vaqui
  const vcall = (to, inner, op = 0, value = 0n, key = roleKey) => v.encodeFunctionData({ abi: RL, functionName: "execTransactionWithRole", args: [to, value, inner, op, key, true] });
  const tf = (to, amt) => v.encodeFunctionData({ abi: v.erc20Abi, functionName: "transfer", args: [to, amt] });
  const sim = async (label, data, from = VAQ) => {
    try { await pub.call({ account: from, to: roles, data: tag(data) }); console.log("NEG", label, "=> PASA"); return true; }
    catch (e) { const d = e.cause?.data ?? e.walk?.()?.data; console.log("NEG", label, "=> rechazo", String(e.shortMessage).slice(0, 100), String(d ?? "").slice(0, 80)); return false; }
  };
  r = await send(VAQ, roles, vcall(WARS, tf(R1.address, 1000n * ONE)), "pago Vaqui (permitido)");
  console.log("pago ok", r.status, await pub.readContract({ address: WARS, abi: v.erc20Abi, functionName: "balanceOf", args: [R1.address] }), v.parseEventLogs({ abi: SAFE, logs: r.logs }).map((e) => e.eventName));

  await sim("no autorizado", vcall(WARS, tf(R2.address, ONE)));
  await sim("exacto 5000", vcall(WARS, tf(R1.address, 5000n * ONE)));
  await sim("5000+1wei", vcall(WARS, tf(R1.address, 5000n * ONE + 1n)));
  await sim("otro token", vcall(USDC, tf(R1.address, 1n)));
  await sim("approve", vcall(WARS, v.encodeFunctionData({ abi: v.erc20Abi, functionName: "approve", args: [R1.address, ONE] })));
  await sim("transferFrom", vcall(WARS, v.encodeFunctionData({ abi: v.erc20Abi, functionName: "transferFrom", args: [safe, R1.address, ONE] })));
  await sim("delegatecall", vcall(WARS, tf(R1.address, ONE), 1));
  await sim("con valor", vcall(WARS, tf(R1.address, ONE), 0, 1n));
  await sim("rol ajeno", vcall(WARS, tf(R1.address, ONE), 0, 0n, v.keccak256(v.toHex("otro"))));
  await sim("otra cuenta", vcall(WARS, tf(R1.address, ONE)), OUT);

  // Agotar presupuesto: 1000 ya gastados; 5000x3 + 4000
  for (const m of [5000n, 5000n, 5000n, 4000n]) await send(VAQ, roles, vcall(WARS, tf(R1.address, m * ONE)), "pago Vaqui");
  console.log("allowance tras 20000", await pub.readContract({ address: roles, abi: RL, functionName: "allowances", args: [allowKey] }));
  await sim("presupuesto excedido (1 wei)", vcall(WARS, tf(R1.address, 1n)));
  // Renovación
  await pub.request({ method: "evm_increaseTime", params: [Number(P) + 1] });
  await pub.request({ method: "evm_mine", params: [] });
  for (const m of [5000n, 5000n, 5000n, 5000n]) await send(VAQ, roles, vcall(WARS, tf(R1.address, m * ONE)), "pago Vaqui");
  console.log("R1 tras cruzar la renovación", (await pub.readContract({ address: WARS, abi: v.erc20Abi, functionName: "balanceOf", args: [R1.address] })) / ONE);
  await sim("excedido tras renovar", vcall(WARS, tf(R1.address, 1n)));

  // Llamada interna fallida con todo en cero
  const huge = tf(OUT.address, 10n ** 30n);
  try {
    const f = await execSafe(WARS, huge, 0, [A, B], "gasto que falla");
    console.log("falla interna:", f.rc.status, f.evs, "nonce", await pub.readContract({ address: safe, abi: SAFE, functionName: "nonce" }));
  } catch (e) { console.log("falla interna: envío rechazado", e.shortMessage?.slice(0, 200), "nonce", await pub.readContract({ address: safe, abi: SAFE, functionName: "nonce" })); }

  // Cancelar con reemplazo
  const n0 = await pub.readContract({ address: safe, abi: SAFE, functionName: "nonce" });
  const oldH = await pub.readContract({ address: safe, abi: SAFE, functionName: "getTransactionHash", args: [WARS, 0n, tf(OUT.address, ONE), 0, 0n, 0n, 0n, ZERO, ZERO, n0] });
  await send(A, safe, v.encodeFunctionData({ abi: SAFE, functionName: "approveHash", args: [oldH] }), "approveHash");
  const rep = await execSafe(safe, "0x", 0, [A, B], "reemplazo vacío");
  console.log("reemplazo:", rep.evs, "nonce", n0, "->", await pub.readContract({ address: safe, abi: SAFE, functionName: "nonce" }));
  const sigsOld = [A.address, B.address].sort((x, y) => (BigInt(x) < BigInt(y) ? -1 : 1)).map((o) => v.concat([v.pad(o, { size: 32 }), v.pad("0x0", { size: 32 }), "0x01"]));
  try { await pub.simulateContract({ account: B, address: safe, abi: SAFE, functionName: "execTransaction", args: [WARS, 0n, tf(OUT.address, ONE), 0, 0n, 0n, 0n, ZERO, ZERO, v.concat(sigsOld)] }); console.log("vieja: PASA"); } catch (e) { console.log("vieja:", (e.cause?.reason ?? e.shortMessage ?? "").slice(0, 120)); }

  // Sumar destinatario, swap de dueño, revocar (lote)
  await execSafe(roles, v.encodeFunctionData({ abi: RL, functionName: "scopeFunction", args: [roleKey, WARS, TRANSFER, conds([R1.address, R2.address]), 0] }), 0, [A, C], "cambiar destinatarios");
  await sim("R2 ya autorizado (sin presupuesto => debe rechazar por presupuesto)", vcall(WARS, tf(R2.address, 1n)));
  const owners = await pub.readContract({ address: safe, abi: SAFE, functionName: "getOwners" });
  const idx = owners.findIndex((o) => o === C.address);
  const prev = idx === 0 ? "0x0000000000000000000000000000000000000001" : owners[idx - 1];
  await execSafe(safe, v.encodeFunctionData({ abi: SAFE, functionName: "swapOwner", args: [prev, C.address, OUT.address] }), 0, [A, B], "cambiar responsable (sin el tercero)");
  console.log("dueños", await pub.readContract({ address: safe, abi: SAFE, functionName: "getOwners" }));
  await pub.request({ method: "evm_increaseTime", params: [Number(P) + 1] });
  await pub.request({ method: "evm_mine", params: [] });
  await sim("antes de revocar", vcall(WARS, tf(R1.address, ONE)));
  await execSafe(roles, v.encodeFunctionData({ abi: RL, functionName: "assignRoles", args: [VAQ.address, [roleKey], [false]] }), 0, [A, B], "revocar");
  await sim("después de revocar", vcall(WARS, tf(R1.address, ONE)));

  // Etiqueta en una transferencia directa (aporte)
  await pub.request({ method: "anvil_dealERC20", params: [A.address, WARS, v.toHex(10n * ONE)] });
  await send(A, WARS, tf(safe, ONE), "aporte");

  // CIP-64 en el fork
  await pub.request({ method: "anvil_dealERC20", params: [VAQ.address, USDC, v.toHex(10_000_000n)] }).catch((e) => console.log("deal USDC", e.shortMessage));
  try {
    const nonce = await pub.getTransactionCount({ address: VAQ.address });
    const fees = await pub.estimateFeesPerGas().catch(() => null);
    const signer = VAQ;
    const signed = await signer.signTransaction({ type: "cip64", chainId, nonce, to: WARS, data: tag(tf(R1.address, 0n)), value: 0n, gas: 300000n, maxFeePerGas: 200000000000n, maxPriorityFeePerGas: 1000000n, feeCurrency: ADAPTER }, { serializer: celoV.serializeTransaction });
    const h = await pub.sendRawTransaction({ serializedTransaction: signed });
    const rc = await pub.waitForTransactionReceipt({ hash: h, timeout: 15000 });
    console.log("CIP-64 fork:", rc.status, rc.type, "gas", rc.gasUsed);
  } catch (e) { console.log("CIP-64 fork falla:", (e.shortMessage ?? e.message).slice(0, 300)); }

  const seen = new Map();
  for (const [l, g, s] of gasRows) { if (!seen.has(l)) seen.set(l, [g, s]); }
  const mainnet = v.createPublicClient({ chain: celo, transport: v.http("https://forno.celo.org") });
  const gpCelo = await mainnet.getGasPrice();
  const gpUsd = BigInt(await mainnet.request({ method: "eth_gasPrice", params: [ADAPTER] }));
  console.log("gasPrice CELO(wei)", gpCelo, "en USDC(18)", gpUsd);
  for (const [l, [g, s]] of seen) console.log(l.padEnd(42), String(g).padStart(9), s, "CELO", v.formatEther(g * gpCelo).slice(0, 10), "USD", v.formatEther(g * gpUsd).slice(0, 9));
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
