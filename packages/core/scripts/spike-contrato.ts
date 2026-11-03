/**
 * Parte con fondos del spike (D14.1): recorre una compra real de $ 1 contra wARS.
 * La wallet del agente es la única compradora y el proveedor sale de la allowlist.
 *
 *   npm run spike:contrato -- <alias>      → ensayo: firma el próximo paso, sin transmitir
 *   LIVE_PAYMENTS=si-muevo-plata-real npm run spike:contrato -- <alias>   → real
 *   LIVE_PAYMENTS=si-muevo-plata-real npm run spike:contrato -- <alias> revocar
 *        → deja en cero la autorización de una campaña sin ejecutar y libera su reserva
 *
 * Fábrica → campaña → reserva → autorización exacta → compromiso → ejecución → conciliación.
 * Se puede volver a correr: las direcciones y lo transmitido quedan en data/ y el resto se lee
 * de la cadena. El spike termina recién cuando la conciliación cierra.
 * Requiere `forge build` en contracts/.
 */
import { closeSync, existsSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  createPublicClient,
  decodeEventLog,
  encodeDeployData,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  getAddress,
  http,
  keccak256,
  stringToHex,
  type Abi,
  type Address,
  type Hex,
  type TransactionReceipt,
} from "viem";
import { celo } from "viem/chains";
import { parseTransaction } from "viem/celo";
import { bootstrap } from "../src/bootstrap.js";
import { broadcast, prepareTaggedTx, type Call } from "../src/chain/tagged-sender.js";
import { CELO_MAINNET } from "../src/config/network.js";
import { REPO_ROOT } from "../src/config/paths.js";
import { WFIAT } from "../src/config/tokens.js";
import { evaluatePayment } from "../src/policy/engine.js";

const PRECIO = 10n ** 18n; // $ 1
const PLAZO_SEGUNDOS = 6 * 60 * 60;
const ESTADO_FILE = join(REPO_ROOT, "data", "spike-contrato.json");
const BLOQUEO_FILE = `${ESTADO_FILE}.lock`;
const ESTADO = ["Abierta", "Ejecutada", "Vencida"] as const;
const ADHESION = ["Ninguna", "Activa", "Cancelada"] as const;
const FABRICA = "Desplegar fábrica";
const CAMPANA = "Crear campaña";
// El RPC balancea entre nodos: justo después de confirmar, uno atrasado todavía no ve el cambio.
const ESPERA_RPC_MS = 8_000;

interface Paso {
  paso: string;
  txHash: Hex;
  gas: string;
}
interface EstadoSpike {
  fabrica?: Address;
  campana?: Address;
  bloqueCampana?: string;
  /** Transmitida o a punto de transmitirse: hasta resolverla no se firma otra. */
  enviado?: { paso: string; txHash: Hex; signedTx: Hex };
  /** Reserva del presupuesto diario, abierta desde antes de habilitar el cobro. */
  reserva?: string;
  conciliada?: boolean;
  pasos: Paso[];
}

function artefacto(contrato: string): { abi: Abi; bytecode: Hex } {
  const file = join(REPO_ROOT, "contracts", "out", `${contrato}.sol`, `${contrato}.json`);
  if (!existsSync(file)) throw new Error("Falta compilar: corré `forge build` en contracts/.");
  const a = JSON.parse(readFileSync(file, "utf8")) as { abi: Abi; bytecode: { object: Hex } };
  return { abi: a.abi, bytecode: a.bytecode.object };
}

const alias = process.argv[2];
const modo = process.argv[3];
if (!alias || (modo !== undefined && modo !== "revocar")) {
  console.error("Uso: npm run spike:contrato -- <alias-del-proveedor> [revocar]");
  process.exit(1);
}

const deps = bootstrap();
const { config, reader, account, ledger } = deps;
const client = createPublicClient({ chain: celo, transport: http(config.rpcUrl) });
const token = WFIAT.wARS;
const comprador = account.address;
const feeCurrency = config.feeCurrency.feeCurrency;
const fabricaArt = artefacto("FabricaCompraColectiva");
const campanaArt = artefacto("CompraColectiva");

// Dos corridas reales a la vez crearían dos campañas y cobrarían dos veces.
if (config.live) {
  try {
    closeSync(openSync(BLOQUEO_FILE, "wx"));
  } catch {
    console.error(`⛔ Hay otra corrida en curso. Si no es así, borrá ${BLOQUEO_FILE}.`);
    process.exit(1);
  }
  process.on("exit", () => rmSync(BLOQUEO_FILE, { force: true }));
}

const estado: EstadoSpike = existsSync(ESTADO_FILE)
  ? (JSON.parse(readFileSync(ESTADO_FILE, "utf8")) as EstadoSpike)
  : { pasos: [] };
function guardar(): void {
  const tmp = `${ESTADO_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(estado, null, 2) + "\n");
  renameSync(tmp, ESTADO_FILE);
}

function reporte(): void {
  console.log(`\nFábrica: ${estado.fabrica ?? "-"}\nCampaña: ${estado.campana ?? "-"}`);
  for (const p of estado.pasos) console.log(`${p.paso}: ${CELO_MAINNET.explorerTx(p.txHash)} (gas ${p.gas})`);
}

function eventos(receipt: TransactionReceipt, abi: Abi, emisor: Address): { eventName: string; args: unknown }[] {
  return receipt.logs
    .filter((l) => getAddress(l.address) === getAddress(emisor))
    .map((l) => decodeEventLog({ abi, data: l.data, topics: l.topics }) as { eventName: string; args: unknown });
}

/** Resuelve lo transmitido, también al retomar después de un corte. */
async function resolverEnviado(): Promise<TransactionReceipt> {
  const { paso, txHash, signedTx } = estado.enviado!;
  const url = CELO_MAINNET.explorerTx(txHash);
  const comprobante = () => client.getTransactionReceipt({ hash: txHash }).catch(() => null);
  let receipt = await comprobante();
  if (!receipt) {
    // Que no aparezca no prueba que no vaya a entrar. Solo otra tx con su nonce la descarta.
    const { nonce } = parseTransaction(signedTx) as { nonce?: number };
    const confirmadas = await client.getTransactionCount({ address: comprador, blockTag: "latest" });
    if (nonce === undefined) throw new Error(`"${paso}" guardada sin nonce: ${url}. Revisá a mano.`);
    if (confirmadas > nonce) {
      delete estado.enviado;
      guardar();
      throw new Error(`"${paso}" no entró: otra transacción usó su lugar. Volvé a correr el script.`);
    }
    // Siempre los mismos bytes: nunca una segunda firma mientras esta pueda entrar.
    await broadcast(deps, signedTx).catch(() => null);
    receipt = await comprobante();
    if (!receipt) throw new Error(`"${paso}" sigue sin confirmar: ${url}. Volvé a correr el script más tarde.`);
  }
  if (receipt.status !== "success") {
    delete estado.enviado;
    guardar();
    throw new Error(`"${paso}" revirtió: ${url}.`);
  }
  const codigos = await reader.verifyAttribution(txHash);
  if (!codigos?.includes(config.attributionCode)) throw new Error(`"${paso}" no tiene la etiqueta en la cadena: ${url}. Revisá antes de seguir.`);

  if (paso === FABRICA) {
    if (!receipt.contractAddress) throw new Error("El comprobante no trae la dirección de la fábrica.");
    estado.fabrica = getAddress(receipt.contractAddress);
  }
  if (paso === CAMPANA) {
    const creada = eventos(receipt, fabricaArt.abi, estado.fabrica!).find((e) => e.eventName === "CampanaCreada");
    if (!creada) throw new Error("El comprobante no trae el evento CampanaCreada.");
    estado.campana = getAddress((creada.args as { campana: Address }).campana);
    estado.bloqueCampana = receipt.blockNumber.toString();
  }
  estado.pasos.push({ paso, txHash, gas: receipt.gasUsed.toString() });
  delete estado.enviado;
  guardar();
  console.log(`${paso}: ${url}`);
  await new Promise((r) => setTimeout(r, ESPERA_RPC_MS));
  return receipt;
}

/** Ensayo: firma el paso, lo informa y termina acá, porque el siguiente depende de este. */
async function enviar(paso: string, call: Call): Promise<TransactionReceipt> {
  const prepared = await prepareTaggedTx(deps, call);
  if (!prepared.ok) {
    const costo = formatUnits(prepared.maxGasCost18, 18);
    throw new Error(`${paso}: ${prepared.reason === "GAS_OVER_CAP" ? "supera el tope de gas" : "falta saldo para el gas"} (reserva ${costo}).`);
  }
  if (!config.live) {
    console.log(`Ensayo, próximo paso "${paso}": firmado y verificado, sin transmitir.`);
    console.log(`Gas ${prepared.gas}, reserva ${formatUnits(prepared.maxGasCost18, 18)} en ${config.feeCurrency.symbol}.`);
    reporte();
    process.exit(0);
  }
  estado.enviado = { paso, txHash: prepared.txHash, signedTx: prepared.signedTx };
  guardar();
  // Si falla o vence la espera, resolverEnviado decide con lo que dice la cadena.
  await broadcast(deps, prepared.signedTx).catch(() => null);
  return resolverEnviado();
}

const autorizado = (campana: Address, blockNumber?: bigint) =>
  client.readContract({ address: token.address, abi: erc20Abi, functionName: "allowance", args: [comprador, campana], blockNumber });
const saldo = (cuenta: Address, blockNumber: bigint) =>
  client.readContract({ address: token.address, abi: erc20Abi, functionName: "balanceOf", args: [cuenta], blockNumber });
const leerCampana = (campana: Address, functionName: string, args: unknown[] = []) =>
  client.readContract({ address: campana, abi: campanaArt.abi, functionName, args });

/**
 * Parte del evento on-chain, no de lo que hizo esta corrida: `ejecutar()` es pública y
 * pudo llamarla otro. Eventos y saldos del bloque tienen que contar la misma historia.
 */
async function conciliar(campana: Address, proveedor: Address): Promise<void> {
  const logs = await client.getContractEvents({
    address: campana,
    abi: campanaArt.abi,
    eventName: "CampanaEjecutada",
    fromBlock: BigInt(estado.bloqueCampana!),
  });
  const txHash = logs[0]?.transactionHash;
  if (logs.length !== 1 || !txHash) throw new Error(`Se esperaba una ejecución en la cadena y hay ${logs.length}.`);
  const receipt = await client.getTransactionReceipt({ hash: txHash });

  // La plata ya se movió: el presupuesto se descuenta aunque algo de abajo no cierre.
  if (estado.reserva) {
    ledger.settle(estado.reserva, { status: "confirmed", txHash });
    delete estado.reserva;
    guardar();
  }
  if (!estado.pasos.some((p) => p.txHash === txHash)) {
    estado.pasos.push({ paso: "Ejecutada por un tercero", txHash, gas: receipt.gasUsed.toString() });
    guardar();
  }

  const nombres = eventos(receipt, campanaArt.abi, campana).map((e) => e.eventName);
  const antes = receipt.blockNumber - 1n;
  const despues = receipt.blockNumber;
  const pago = (await saldo(comprador, antes)) - (await saldo(comprador, despues));
  const cobro = (await saldo(proveedor, despues)) - (await saldo(proveedor, antes));
  const restante = await autorizado(campana, despues);
  const problemas = [
    !nombres.includes("CompraConfirmada") && "falta el evento CompraConfirmada",
    pago !== PRECIO && `el comprador pagó ${formatUnits(pago, 18)}`,
    cobro !== PRECIO && `el proveedor cobró ${formatUnits(cobro, 18)}`,
    restante !== 0n && `quedó autorización sin usar: ${formatUnits(restante, 18)}`,
  ].filter(Boolean);
  if (problemas.length > 0) throw new Error(`La conciliación no cierra: ${problemas.join("; ")}.`);

  estado.conciliada = true;
  guardar();
  console.log("\n✅ Compra real conciliada: el comprador pagó $ 1, el proveedor cobró $ 1 y no quedó autorización.");
  reporte();
}

async function revocar(): Promise<void> {
  const campana = estado.campana;
  if (!campana) {
    console.log("No hay campaña guardada: no hay nada para revocar.");
    return;
  }
  if (ESTADO[Number(await leerCampana(campana, "estadoActual"))] === "Ejecutada") {
    throw new Error("La campaña ya está ejecutada: corré el script sin `revocar` para conciliarla.");
  }
  let bloque: bigint | undefined;
  if ((await autorizado(campana)) !== 0n) {
    const data = encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [campana, 0n] });
    bloque = (await enviar("Revocar autorización", { to: token.address, data })).blockNumber;
  }
  if (!config.live) {
    console.log("Ensayo: la autorización ya está en cero; en real se libera la reserva y se olvida la campaña.");
    return;
  }
  if ((await autorizado(campana, bloque)) !== 0n) throw new Error("La autorización no quedó en cero. Revisá antes de seguir.");
  // Un tercero pudo ejecutar justo antes: en cero también queda después de un cobro.
  if (ESTADO[Number(await leerCampana(campana, "estadoActual"))] === "Ejecutada") {
    throw new Error("La campaña se ejecutó mientras se revocaba: corré el script sin `revocar` para conciliarla.");
  }
  // Sin autorización ya no se le puede cobrar, y la reserva se libera recién ahora.
  if (estado.reserva) ledger.settle(estado.reserva, { status: "failed" });
  delete estado.reserva;
  delete estado.campana;
  delete estado.bloqueCampana;
  guardar();
  console.log("Autorización en cero y reserva liberada. La próxima corrida crea otra campaña.");
}

try {
  if (estado.enviado) {
    if (!config.live) throw new Error(`Hay una transacción sin resolver (${estado.enviado.txHash}): corré en real para retomar.`);
    await resolverEnviado();
  }
  if (modo === "revocar") {
    await revocar();
    reporte();
    process.exit(0);
  }
  if (estado.conciliada) {
    console.log("El spike ya está conciliado: no se cobra de nuevo.");
    reporte();
    process.exit(0);
  }

  // La política decide el proveedor y si el monto entra en el presupuesto de hoy.
  const hoy = ledger.today("wARS");
  const decision = evaluatePayment(
    { token: "wARS", amount: PRECIO, recipient: alias },
    { policy: deps.policy, allowlist: config.allowlist, spentToday: hoy.spent, countToday: hoy.count },
  );
  if (!decision.ok) throw new Error(decision.message);
  const proveedor = getAddress(decision.to);

  if (!estado.fabrica) {
    const data = encodeDeployData({ abi: fabricaArt.abi, bytecode: fabricaArt.bytecode, args: [token.address] });
    await enviar(FABRICA, { deploy: true, data });
  }
  const fabrica = estado.fabrica!;
  const tokenFabrica = await client.readContract({ address: fabrica, abi: fabricaArt.abi, functionName: "token" });
  if (getAddress(tokenFabrica as Address) !== token.address) throw new Error("La fábrica apunta a otro token. Abortado.");

  if (!estado.campana) {
    const terminos = {
      referencia: keccak256(stringToHex("spike-contrato")),
      proveedor,
      precio: PRECIO,
      cargo: 0n,
      destinatarioCargo: "0x0000000000000000000000000000000000000000" as Address,
      minimo: 1,
      maximo: 1,
      fechaLimite: BigInt(Math.floor(Date.now() / 1000) + PLAZO_SEGUNDOS),
    };
    const data = encodeFunctionData({ abi: fabricaArt.abi, functionName: "createCampaign", args: [terminos, [comprador]] });
    await enviar(CAMPANA, { to: fabrica, data, gasClass: "contract" });
  }
  const campana = estado.campana!;

  if ((await client.readContract({ address: fabrica, abi: fabricaArt.abi, functionName: "esCampana", args: [campana] })) !== true) {
    throw new Error("La campaña no salió de esta fábrica. Abortado.");
  }
  if (getAddress((await leerCampana(campana, "proveedor")) as Address) !== proveedor) {
    throw new Error("La campaña guardada le paga a otro proveedor. Abortado.");
  }

  const estadoCampana = ESTADO[Number(await leerCampana(campana, "estadoActual"))];
  if (estadoCampana === "Ejecutada") {
    await conciliar(campana, proveedor);
    process.exit(0);
  }
  if (estadoCampana !== "Abierta") throw new Error(`La campaña está ${estadoCampana}: corré el script con \`revocar\`.`);

  const adhesion = ADHESION[Number(await leerCampana(campana, "adhesion", [comprador]))];
  if (adhesion === "Cancelada") throw new Error("El compromiso está cancelado: corré el script con `revocar`.");
  if ((await reader.balanceOf(token.address, comprador)) < PRECIO) throw new Error("No alcanza el saldo de wARS para la compra.");

  // Desde comprometer() cualquiera puede ejecutar: el presupuesto se reserva antes de habilitarlo.
  if (config.live && !estado.reserva) {
    estado.reserva = ledger.reserve({ token: "wARS", amount: PRECIO, to: proveedor });
    guardar();
  }

  if (adhesion === "Ninguna") {
    if ((await autorizado(campana)) !== PRECIO) {
      const data = encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [campana, PRECIO] });
      await enviar("Autorizar importe exacto", { to: token.address, data });
    }
    await enviar("Comprometerse", { to: campana, data: encodeFunctionData({ abi: campanaArt.abi, functionName: "comprometer" }) });
  } else if ((await autorizado(campana)) !== PRECIO) {
    throw new Error("La autorización ya no es el importe exacto: corré el script con `revocar`.");
  }

  await enviar("Ejecutar compra", {
    to: campana,
    data: encodeFunctionData({ abi: campanaArt.abi, functionName: "ejecutar" }),
    gasClass: "contract",
  });
  await conciliar(campana, proveedor);
  process.exit(0);
} catch (err) {
  // shortMessage evita volcar la URL del RPC, que puede llevar una clave.
  const e = err as { shortMessage?: string; message?: string };
  console.error(`\n⛔ ${e.shortMessage ?? e.message ?? "Error desconocido"}`);
  console.error("Lo ya confirmado queda guardado: revisá la causa y volvé a correr el script para retomar.");
  reporte();
  process.exit(1);
}
