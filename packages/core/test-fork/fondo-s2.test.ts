import { concat, createPublicClient, encodeFunctionData, erc20Abi, http, pad, parseAbi, parseEventLogs, toHex, zeroAddress, type Address, type Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { hasTag } from "../src/attribution/tag.js";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { WFIAT } from "../src/config/tokens.js";
import { proxyFactoryAbi, rolesAbi, safeAbi } from "../src/fondo/abis.js";
import { LIMITE_POR_TRANSFERENCIA, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO, ROL_VAQUI } from "../src/fondo/constantes.js";
import { enviador } from "../src/fondo/enviador.js";
import { clasificarError } from "../src/fondo/errores.js";
import { createFondoReader, FondoReadError, type FondoPublicClient, type FondoReader } from "../src/fondo/lectura.js";
import { exportarManifiesto, importarManifiesto, revalidarManifiesto } from "../src/fondo/manifiesto.js";
import { sugerirReparto } from "../src/fondo/reparto.js";
import { buildInitialRules, txCambiarDestinatarios, txCerrarVaqui } from "../src/fondo/roles.js";
import { firmasPreaprobadas, hashTransaccionSafe, predictRolesAddress, predictSafeAddress, txCambiarResponsable, txCancelar, txGasto, txReparto, type CuerpoSafe, type TxSafe } from "../src/fondo/safe.js";
import { aportar, aprobarHash, crearSafe, desplegarRoles, ejecutarPropuesta } from "../src/fondo/transacciones.js";
import { verificarGrupo, type GrupoVerificable, type ResultadoVerificacion } from "../src/fondo/verificar.js";
import { startAnvil } from "../test/helpers/anvil.js";

const CODE = "celo_ab12cd34";
const ONE = 10n ** 18n;
const wars = WFIAT.wARS.address;
const contracts = contratosFondo(42220);
const extraAbi = parseAbi([
  "function proxyCreationCode() pure returns (bytes)",
  "function getTransactionHash(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,uint256) view returns (bytes32)",
  "function nonce() view returns (uint256)",
  "function approvedHashes(address,bytes32) view returns (uint256)",
  "function enableModule(address)",
  "function addOwnerWithThreshold(address,uint256)",
  "function getOwners() view returns (address[])",
]);
const cuenta = () => privateKeyToAccount(generatePrivateKey());
const fijo = (n: number) => pad(toHex(n + 0x1000), { size: 20 }) as Address;
const SLOT_GUARD = "0x4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c8" as const; // Slot público de Safe; secret-scan: allow

const SLOT_PAUSA = "0xcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300" as const; // Slot ERC-7201 público de Pausable; secret-scan: allow

type Fork = Awaited<ReturnType<typeof startAnvil>>;
interface Grupo { grupoId: string; safe: Address; roles: Address; bloque: bigint }

describe("S2 en fork local", () => {
  let fork: Fork;
  let client: ReturnType<typeof createPublicClient>;
  let reader: FondoReader;
  const creator = cuenta(), vaqui = cuenta(), identidad = cuenta();
  const duenos = [cuenta(), cuenta(), cuenta()] as const;
  const [r1, r2, r3] = [fijo(1), fijo(2), fijo(3)];
  const enviadas: Hex[] = [];
  let g: Grupo;

  async function enviar(account: PrivateKeyAccount, tx: { to: Address; data: Hex }) {
    const sender = enviador({ mode: "fork", env: { E2E_FORK: "1" }, deps: { rpcUrl: fork.rpcUrl, account, attributionCode: CODE } });
    const prepared = await sender.prepare(tx);
    if (!prepared.ok) throw new Error("No se pudo preparar la transacción de prueba.");
    const result = await sender.broadcast(prepared.signedTx);
    expect(result.status).toBe("success");
    enviadas.push(result.txHash);
    return client.getTransactionReceipt({ hash: result.txHash });
  }
  const saldo = (who: Address) => client.readContract({ address: wars, abi: erc20Abi, functionName: "balanceOf", args: [who] });
  const nonce = (safe: Address) => client.readContract({ address: safe, abi: extraAbi, functionName: "nonce" });
  const leerDuenos = (safe: Address) => client.readContract({ address: safe, abi: extraAbi, functionName: "getOwners" });
  const armar = async (safe: Address, cuerpo: CuerpoSafe, n?: bigint): Promise<TxSafe> => ({ ...cuerpo, nonce: n ?? await nonce(safe) });

  async function aprobarYEjecutar(grupo: Grupo, tx: TxSafe, a = duenos[0], b = duenos[1]) {
    await enviar(a, aprobarHash(grupo.safe, hashTransaccionSafe(grupo.safe, tx), CODE));
    return enviar(b, ejecutarPropuesta(grupo.safe, tx, firmasPreaprobadas([a.address, b.address]), CODE));
  }

  async function desplegar(grupoId: string, owners: readonly Address[]): Promise<Grupo & { recibos: Awaited<ReturnType<typeof enviar>>[] }> {
    const config = { groupId: grupoId, owners, operatingWallet: vaqui.address, identityWallet: identidad.address };
    const proxyCode = await client.readContract({ address: contracts.proxyFactory.address, abi: extraAbi, functionName: "proxyCreationCode" });
    const safe = predictSafeAddress(config, proxyCode);
    const roles = predictRolesAddress(grupoId, safe);
    const first = await enviar(creator, crearSafe(config, CODE));
    const second = await enviar(creator, desplegarRoles(safe, grupoId, CODE));
    return { grupoId, safe, roles, bloque: first.blockNumber, recibos: [first, second] };
  }
  async function configurar(grupo: Grupo, recipients: readonly Address[]) {
    await aprobarYEjecutar(grupo, buildInitialRules({ safe: grupo.safe, roles: grupo.roles, operatingWallet: vaqui.address, recipients, nonce: await nonce(grupo.safe) }));
  }
  const entrada = (grupo: Grupo, destinatarios: readonly Address[], owners: readonly Address[] = duenos.map((d) => d.address)): GrupoVerificable =>
    ({ chainId: 42220, safe: grupo.safe, roles: grupo.roles, bloqueInicio: grupo.bloque, esperado: { duenos: owners, walletOperativa: vaqui.address, destinatarios } });
  const fallas = (result: ResultadoVerificacion) => result.controles.filter((c) => !c.ok).map((c) => `${c.id}: ${c.detalle}`);

  const pago = (grupo: Grupo, to: Address, monto: bigint) => ({ to: grupo.roles, data: encodeFunctionData({ abi: rolesAbi, functionName: "execTransactionWithRole",
    args: [wars, 0n, encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [to, monto] }), 0, ROL_VAQUI, true] }) });
  async function codigoRechazo(request: { to: Address; data: Hex; account?: Address }) {
    const blockNumber = await client.getBlockNumber({ cacheTime: 0 });
    try { await reader.call({ ...request, blockNumber }); return "PASA"; }
    catch (error) { expect(error).toBeInstanceOf(FondoReadError); return clasificarError(error).codigo; }
  }
  const pagoRechazo = (grupo: Grupo, to: Address, monto: bigint) => codigoRechazo({ ...pago(grupo, to, monto), account: vaqui.address });
  const conSnapshot = async (run: () => Promise<void>) => {
    const id = await fork.rpc<Hex>("evm_snapshot");
    const antes = enviadas.length;
    try { await run(); } finally {
      await fork.rpc("evm_revert", [id]);
      enviadas.length = antes; // Esas transacciones ya no existen en el fork.
    }
  };
  // evm_mine puede traer estado remoto y superar el límite de 1 s de fork.rpc.
  const minar = () => (client as unknown as { request(args: { method: string }): Promise<unknown> }).request({ method: "evm_mine" });
  const avanzarPeriodo = async () => { await fork.rpc("evm_increaseTime", [Number(PERIODO_SEGUNDOS) + 1]); await minar(); };

  beforeAll(async () => {
    fork = await startAnvil({ env: { CELO_RPC_URL: "https://forno.celo.org" }, startupTimeoutMs: 60000 });
    client = createPublicClient({ ccipRead: false, transport: http(fork.rpcUrl, { retryCount: 0, timeout: 60000, fetchOptions: { redirect: "error" } }) });
    reader = createFondoReader(client as unknown as FondoPublicClient);
    for (const account of [creator, vaqui, ...duenos]) await fork.rpc("anvil_setBalance", [account.address, toHex(1000n * ONE)]);
  });
  afterAll(async () => { await fork?.stop(); });

  it("S2-4: las direcciones calculadas coinciden con los eventos", async () => {
    const deployed = await desplegar("fork-grupo-principal", duenos.map((d) => d.address));
    g = deployed;
    const [creation] = parseEventLogs({ abi: proxyFactoryAbi, eventName: "ProxyCreation", logs: deployed.recibos[0]!.logs });
    expect(creation!.args.proxy.toLowerCase()).toBe(g.safe.toLowerCase());
    expect(await client.getCode({ address: g.roles })).toBeTruthy();
  });

  it("S2-10 y N1 a N10: un grupo sano pasa los diez controles contra el contrato real", async () => {
    await configurar(g, [r1, r3]);
    const result = await verificarGrupo(reader, entrada(g, [r1, r3]));
    expect(fallas(result)).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("S2-20: el manifiesto se revalida contra la cadena y detecta responsables divergentes", async () => {
    const texto = exportarManifiesto({ grupoId: g.grupoId, safe: g.safe, roles: g.roles, walletOperativa: vaqui.address, bloqueDespliegue: g.bloque, transacciones: [] });
    const importado = importarManifiesto(texto);
    if (!importado.ok) throw new Error(importado.motivo);
    const owners = duenos.map((d) => d.address);
    expect((await revalidarManifiesto(reader, importado.manifiesto, { duenos: owners, destinatarios: [r1, r3] })).ok).toBe(true);
    const ajenos = await revalidarManifiesto(reader, importado.manifiesto, { duenos: [owners[0]!, owners[1]!, r2], destinatarios: [r1, r3] });
    expect(ajenos.controles.find((c) => c.id === "safe-config")!.ok).toBe(false);
    expect(ajenos.ok).toBe(false);
    await conSnapshot(async () => {
      await fork.rpc("anvil_setCode", [g.safe, "0x60006000fd"]);
      const result = await revalidarManifiesto(reader, importado.manifiesto, { duenos: owners, destinatarios: [r1, r3] });
      expect(result.controles.find((c) => c.id === "safe-proxy")!.ok).toBe(false);
    });
    await conSnapshot(async () => {
      await aprobarYEjecutar(g, await armar(g.safe, { to: g.safe, value: 0n, operation: 0, data: encodeFunctionData({ abi: extraAbi, functionName: "enableModule", args: [r2] }) }));
      const result = await revalidarManifiesto(reader, importado.manifiesto, { duenos: owners, destinatarios: [r1, r3] });
      expect(result.controles.find((c) => c.id === "safe-modulos")!.ok).toBe(false);
      expect(result.ok).toBe(false);
    });
  });

  describe("S2-10: controles que deben fallar", () => {
    const control = (result: ResultadoVerificacion, id: string) => result.controles.find((c) => c.id === id)!.ok;
    it("con guard", async () => {
      await conSnapshot(async () => {
        await fork.rpc("anvil_setStorageAt", [g.safe, SLOT_GUARD, pad(r2, { size: 32 })]);
        const result = await verificarGrupo(reader, entrada(g, [r1, r3]));
        expect(control(result, "safe-config")).toBe(false);
        expect(result.ok).toBe(false);
      });
    });
    it("con otro módulo", async () => {
      await conSnapshot(async () => {
        await aprobarYEjecutar(g, await armar(g.safe, { to: g.safe, value: 0n, operation: 0, data: encodeFunctionData({ abi: extraAbi, functionName: "enableModule", args: [r2] }) }));
        const result = await verificarGrupo(reader, entrada(g, [r1, r3]));
        expect(control(result, "safe-modulos")).toBe(false);
        expect(result.ok).toBe(false);
      });
    });
    it("con Roles simulado por un proxy a otra mastercopy", async () => {
      await conSnapshot(async () => {
        await fork.rpc("anvil_setCode", [g.roles, concat(["0x363d3d373d3d3d363d73", r2, "0x5af43d82803e903d91602b57fd5bf3"])]);
        const result = await verificarGrupo(reader, entrada(g, [r1, r3]));
        expect(control(result, "roles-mastercopy")).toBe(false);
        expect(result.ok).toBe(false);
      });
    });
    it("con un dueño extra", async () => {
      await conSnapshot(async () => {
        await aprobarYEjecutar(g, await armar(g.safe, { to: g.safe, value: 0n, operation: 0, data: encodeFunctionData({ abi: extraAbi, functionName: "addOwnerWithThreshold", args: [r2, 2n] }) }));
        const result = await verificarGrupo(reader, entrada(g, [r1, r3]));
        expect(control(result, "safe-config")).toBe(false);
        expect(result.ok).toBe(false);
      });
    });
  });

  it("S2-19 y aportes: sin backend se lee el fondo y se construye una propuesta firmable", async () => {
    await fork.rpc("anvil_dealERC20", [duenos[0].address, wars, toHex(200_000n * ONE)]);
    await enviar(duenos[0], aportar(g.safe, 100_000n * ONE, CODE));
    expect(await saldo(g.safe)).toBe(100_000n * ONE);
    expect(await client.readContract({ address: g.safe, abi: safeAbi, functionName: "getThreshold" })).toBe(2n);
    expect((await leerDuenos(g.safe)).length).toBe(3);
    const tx = await armar(g.safe, txGasto(r2, ONE));
    const onChain = await client.readContract({ address: g.safe, abi: extraAbi, functionName: "getTransactionHash",
      args: [tx.to, tx.value, tx.data, tx.operation, 0n, 0n, 0n, zeroAddress, zeroAddress, tx.nonce] });
    expect(hashTransaccionSafe(g.safe, tx)).toBe(onChain);
  });

  it("S2-16: con wARS en pausa, cada camino da la señal que se observa en cadena", async () => {
    await conSnapshot(async () => {
      await fork.rpc("anvil_setStorageAt", [wars, SLOT_PAUSA, pad("0x01", { size: 32 })]);
      expect(await client.readContract({ address: wars, abi: parseAbi(["function paused() view returns (bool)"]), functionName: "paused" })).toBe(true);
      expect(await codigoRechazo({ ...aportar(g.safe, ONE, CODE), account: duenos[0].address })).toBe("TOKEN_RESTRINGIDO");
      // Roles y Safe no reenvían el error interno: la señal de pausa sólo llega en la llamada directa.
      expect(await pagoRechazo(g, r1, ONE)).toBe("ERROR_DESCONOCIDO");
      const tx = await armar(g.safe, txGasto(r2, ONE));
      await enviar(duenos[0], aprobarHash(g.safe, hashTransaccionSafe(g.safe, tx), CODE));
      expect(await codigoRechazo({ ...ejecutarPropuesta(g.safe, tx, firmasPreaprobadas([duenos[0].address, duenos[1].address]), CODE), account: duenos[1].address })).toBe("GASTO_RECHAZADO");
    });
  });

  it("S2-1: pasa un pago de $ 5.000 exactos", async () => {
    await enviar(vaqui, pago(g, r1, LIMITE_POR_TRANSFERENCIA));
    expect(await saldo(r1)).toBe(LIMITE_POR_TRANSFERENCIA);
  });

  it("S2-2: 20.000 en cuatro pagos; renovar; otros 20.000", async () => {
    for (let i = 0; i < 3; i++) await enviar(vaqui, pago(g, r1, LIMITE_POR_TRANSFERENCIA));
    expect(await saldo(r1)).toBe(PRESUPUESTO_PERIODO);
    expect(await pagoRechazo(g, r1, 1n)).toBe("PRESUPUESTO_AGOTADO");
    await avanzarPeriodo();
    for (let i = 0; i < 4; i++) await enviar(vaqui, pago(g, r1, LIMITE_POR_TRANSFERENCIA));
    expect(await saldo(r1)).toBe(2n * PRESUPUESTO_PERIODO);
    expect(await pagoRechazo(g, r1, 1n)).toBe("PRESUPUESTO_AGOTADO");
  }, 300000);

  it("S2-6: un gasto interno que falla da GS013 y no cambia el nonce", async () => {
    const before = await nonce(g.safe);
    const tx = await armar(g.safe, txGasto(r2, 10n ** 30n));
    await enviar(duenos[0], aprobarHash(g.safe, hashTransaccionSafe(g.safe, tx), CODE));
    const rechazo = await codigoRechazo({ ...ejecutarPropuesta(g.safe, tx, firmasPreaprobadas([duenos[0].address, duenos[1].address]), CODE), account: duenos[1].address });
    expect(rechazo).toBe("GASTO_RECHAZADO");
    expect(await nonce(g.safe)).toBe(before);
  });

  it("N12: una sola firma da GS020", async () => {
    const tx = await armar(g.safe, txGasto(r2, ONE));
    const firma = concat([pad(duenos[1].address, { size: 32 }), toHex(0n, { size: 32 }), "0x01"]);
    expect(await codigoRechazo({ ...ejecutarPropuesta(g.safe, tx, firma, CODE), account: duenos[1].address })).toBe("FALTAN_FIRMAS");
  });

  it("S2-21: dos responsables aprueban y ejecutan solo con RPC; hashes y saldos se comprueban en cadena", async () => {
    const destino = fijo(20);
    const fondoAntes = await saldo(g.safe);
    const tx = await armar(g.safe, txGasto(destino, 7n * ONE));
    const hash = hashTransaccionSafe(g.safe, tx);
    expect(await client.readContract({ address: g.safe, abi: extraAbi, functionName: "getTransactionHash",
      args: [tx.to, tx.value, tx.data, tx.operation, 0n, 0n, 0n, zeroAddress, zeroAddress, tx.nonce] })).toBe(hash);
    await enviar(duenos[0], aprobarHash(g.safe, hash, CODE));
    expect(await client.readContract({ address: g.safe, abi: extraAbi, functionName: "approvedHashes", args: [duenos[0].address, hash] })).toBe(1n);
    await enviar(duenos[1], ejecutarPropuesta(g.safe, tx, firmasPreaprobadas([duenos[0].address, duenos[1].address]), CODE));
    expect(await saldo(destino)).toBe(7n * ONE);
    expect(await saldo(g.safe)).toBe(fondoAntes - 7n * ONE);
    expect(await nonce(g.safe)).toBe(tx.nonce + 1n);
  });

  it("S2-5 y N13: cancelar por reemplazo invalida la propuesta vieja con GS025", async () => {
    const vieja = await armar(g.safe, txGasto(r2, ONE));
    await enviar(duenos[0], aprobarHash(g.safe, hashTransaccionSafe(g.safe, vieja), CODE));
    await aprobarYEjecutar(g, { ...txCancelar(g.safe), nonce: vieja.nonce }, duenos[1], duenos[2]);
    expect(await nonce(g.safe)).toBe(vieja.nonce + 1n);
    const rechazo = await codigoRechazo({ ...ejecutarPropuesta(g.safe, vieja, firmasPreaprobadas([duenos[0].address, duenos[1].address]), CODE), account: duenos[1].address });
    expect(rechazo).toBe("FIRMA_NO_VALIDA");
    expect(await saldo(r2)).toBe(0n);
  });

  it("N14: alguien que no es responsable no puede habilitar un módulo", async () => {
    const data = encodeFunctionData({ abi: extraAbi, functionName: "enableModule", args: [r2] });
    const blockNumber = await client.getBlockNumber({ cacheTime: 0 });
    await expect(reader.call({ to: g.safe, data, account: creator.address, blockNumber })).rejects.toMatchObject({ kind: "revert" });
  });

  it("S2-7: sumar un destinatario y quitar otro tiene los dos efectos", async () => {
    await avanzarPeriodo();
    await aprobarYEjecutar(g, await armar(g.safe, txCambiarDestinatarios(g.roles, [r3, r2])));
    expect(await pagoRechazo(g, r1, ONE)).toBe("DESTINATARIO_NO_AUTORIZADO");
    expect(await pagoRechazo(g, r2, ONE)).toBe("PASA");
    const result = await verificarGrupo(reader, entrada(g, [r2, r3]));
    expect(fallas(result)).toEqual([]);
    expect((await verificarGrupo(reader, entrada(g, [r1, r3]))).ok).toBe(false);
  });

  it("S2-8: se cambia un responsable con dos firmas, sin el tercero", async () => {
    const nuevo = fijo(9);
    const owners = await leerDuenos(g.safe);
    await aprobarYEjecutar(g, await armar(g.safe, txCambiarResponsable(g.safe, owners, duenos[2].address, nuevo)));
    const after = (await leerDuenos(g.safe)).map((a) => a.toLowerCase());
    expect(after).toContain(nuevo.toLowerCase());
    expect(after).not.toContain(duenos[2].address.toLowerCase());
    expect(after).toHaveLength(3);
  });

  it("S2-9 y N11: disolver revoca, deshabilita y reparte según lo aprobado", async () => {
    const [modulos] = await client.readContract({ address: g.safe, abi: safeAbi, functionName: "getModulesPaginated", args: ["0x0000000000000000000000000000000000000001", 10n] });
    await aprobarYEjecutar(g, await armar(g.safe, txCerrarVaqui(g.safe, g.roles, vaqui.address, modulos)));
    const [despues] = await client.readContract({ address: g.safe, abi: safeAbi, functionName: "getModulesPaginated", args: ["0x0000000000000000000000000000000000000001", 10n] });
    expect(despues).toEqual([]);
    expect(await pagoRechazo(g, r2, ONE)).toBe("VAQUI_REVOCADO");
    const balance = await saldo(g.safe);
    const filas = sugerirReparto(balance, [{ direccion: r2, aporte: 3n }, { direccion: r3, aporte: 1n }]);
    await aprobarYEjecutar(g, await armar(g.safe, txReparto(filas)));
    expect(await saldo(g.safe)).toBe(0n);
    expect(await saldo(r2) + await saldo(r3)).toBe(balance);
  });

  it("S2-11: el hash coincide con el contrato para un vector de direcciones fijas", async () => {
    const vector = await desplegar("vector-s2-11", [fijo(11), fijo(12), fijo(13)]);
    const tx: TxSafe = { to: wars, value: 0n, data: "0xa9059cbb", operation: 0, nonce: 7n };
    const onChain = await client.readContract({ address: vector.safe, abi: extraAbi, functionName: "getTransactionHash",
      args: [tx.to, tx.value, tx.data, tx.operation, 0n, 0n, 0n, zeroAddress, zeroAddress, tx.nonce] });
    console.log("VECTOR_S2_11", JSON.stringify({ safe: vector.safe, hash: onChain }));
    expect(hashTransaccionSafe(vector.safe, tx)).toBe(onChain);
  });

  it("S2-3: cada transacción enviada lleva la etiqueta en el input minado", async () => {
    expect(enviadas.length).toBeGreaterThan(20);
    for (const hash of enviadas) {
      const { input } = await client.getTransaction({ hash });
      expect(hasTag(input, CODE)).toBe(true);
    }
  }, 300000);
});
