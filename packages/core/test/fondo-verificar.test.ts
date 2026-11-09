import { concat, decodeFunctionData, encodeAbiParameters, encodeEventTopics, encodeFunctionResult, getAbiItem, keccak256, pad, toHex, type Address, type Hex } from "viem";
import { describe, expect, it, vi } from "vitest";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { WFIAT } from "../src/config/tokens.js";
import { rolesAbi, rolesEventsAbi, safeAbi } from "../src/fondo/abis.js";
import { CLAVE_PRESUPUESTO, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO, ROL_VAQUI } from "../src/fondo/constantes.js";
import { FondoReadError, type FondoReader, type FundCall, type FundLog } from "../src/fondo/lectura.js";
import { condicionesVaqui } from "../src/fondo/roles.js";
import { verificarGrupo, type GrupoVerificable } from "../src/fondo/verificar.js";
import { BALANCE, SLOT_BASE, SLOT_SALDO, TIMESTAMP_BLOQUE, TIMESTAMP_PRESUPUESTO, llamarNegativa, palabraRefill, palabraSaldo, type Modelo } from "./fondo-negativas-fake.js";

// Los bytes reales de referencia no están en el repo: cada contrato se reemplaza por bytes propios con su hash real.
vi.mock("../src/config/fondo-contratos.js", async (original) => {
  const real = await original<typeof import("../src/config/fondo-contratos.js")>();
  const viem = await import("viem");
  const table = Object.fromEntries(Object.entries(real.contratosFondo(42220)).map(([name, reference]) =>
    [name, { address: reference.address, codeHash: viem.keccak256(viem.toHex(name)) }]));
  return { ...real, contratosFondo: () => table };
});

const contracts = contratosFondo(42220);
const safe = "0x1111111111111111111111111111111111111111" as const;
const roles = "0x2222222222222222222222222222222222222222" as const;
const owners = ["0x3333333333333333333333333333333333333333", "0x4444444444444444444444444444444444444444",
  "0x5555555555555555555555555555555555555555"] as const;
const other = "0x6666666666666666666666666666666666666666" as const;
const SENTINEL = "0x0000000000000000000000000000000000000001" as const;
const ZERO = pad("0x", { size: 32 });
const HANDLER_SLOT = keccak256(toHex("fallback_manager.handler.address"));
const GUARD_SLOT = keccak256(toHex("guard_manager.guard.address"));
// Runtime canónico de SafeProxy 1.4.1, 171 bytes, del artefacto oficial.
const SAFE_PROXY = "0x608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea264697066735822122003d1488ee65e08fa41e58e888a9865554c535f2c77126a82cb4c0f917f31441364736f6c63430007060033" as const;
const ROLES_PROXY = concat(["0x363d3d373d3d3d363d73", contracts.rolesMastercopy.address, "0x5af43d82803e903d91602b57fd5bf3"]);
const BLOCK = 77n;
const IDS = ["contratos", "safe-proxy", "safe-config", "safe-handler", "safe-modulos", "roles-mastercopy", "roles-config",
  "presupuesto", "eventos", "simulacion"];
const grupo: GrupoVerificable = { chainId: 42220, safe, roles, esperado: { duenos: owners } };

/** Estado sano que cada caso altera en un solo campo. Los códigos de referencia se simulan por su hash. */
function chain() {
  const state = {
    code: new Map<string, Hex | undefined>([[safe, SAFE_PROXY], [roles, ROLES_PROXY],
      ...Object.entries(contracts).map(([name, c]): [string, Hex] => [c.address.toLowerCase(), toHex(name)])]),
    storage: new Map<string, Hex | undefined>([
      [ZERO, pad(contracts.safeL2.address, { size: 32 })],
      [HANDLER_SLOT, pad(contracts.fallbackHandler.address, { size: 32 })],
      [GUARD_SLOT, ZERO],
    ]),
    owners: [...owners] as readonly Address[],
    threshold: 2n,
    modules: [roles] as readonly Address[],
    next: SENTINEL as Address,
    owner: safe as Address, avatar: safe as Address, target: safe as Address,
    allowance: [PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO, 5n] as
      readonly [bigint, bigint, bigint, bigint, bigint],
    allowanceKey: undefined as Hex | undefined,
    chainId: 42220,
    blocks: [] as bigint[],
  };
  const calls = (request: FundCall): { data?: Hex } => {
    state.blocks.push(request.blockNumber);
    const abi = request.to === roles ? rolesAbi : safeAbi;
    const decoded = decodeFunctionData({ abi, data: request.data }) as { functionName: string; args?: readonly unknown[] };
    const encode = (functionName: string, result: unknown) =>
      ({ data: encodeFunctionResult({ abi, functionName, result } as never) as Hex });
    switch (decoded.functionName) {
      case "getOwners": return encode("getOwners", state.owners);
      case "getThreshold": return encode("getThreshold", state.threshold);
      case "getModulesPaginated": return encode("getModulesPaginated", [state.modules, state.next]);
      case "owner": return encode("owner", state.owner);
      case "avatar": return encode("avatar", state.avatar);
      case "target": return encode("target", state.target);
      case "allowances": state.allowanceKey = decoded.args?.[0] as Hex; return encode("allowances", state.allowance);
      default: throw new Error(`unexpected ${decoded.functionName}`);
    }
  };
  const reader: FondoReader = {
    getChainId: vi.fn(async () => state.chainId),
    getBlockNumber: vi.fn(async () => BLOCK),
    getCode: vi.fn(async ({ address, blockNumber }) => {
      state.blocks.push(blockNumber);
      return state.code.get(address.toLowerCase());
    }),
    getStorageAt: vi.fn(async ({ slot, blockNumber }) => { state.blocks.push(blockNumber); return state.storage.get(slot); }),
    getBlock: vi.fn(), getLogs: vi.fn(),
    call: vi.fn(async (request: FundCall) => calls(request)),
  };
  return { state, reader };
}

const control = (result: Awaited<ReturnType<typeof verificarGrupo>>, id: string) => result.controles.find((c) => c.id === id)!;
async function run(change: (state: ReturnType<typeof chain>["state"]) => void, input: GrupoVerificable = grupo) {
  const { state, reader } = chain();
  change(state);
  return verificarGrupo(reader, input);
}

describe("verificarGrupo: control eventos", () => {
  const wallet = "0x7777777777777777777777777777777777777777" as const;
  const recipient = "0x8888888888888888888888888888888888888888" as const;
  const token = WFIAT.wARS.address;
  const conPolitica: GrupoVerificable = { ...grupo, esperado: { duenos: owners, walletOperativa: wallet, destinatarios: [recipient] } };
  let position = 0;
  function log(eventName: string, args: Record<string, unknown>, blockNumber = 10n): FundLog {
    const item = getAbiItem({ abi: rolesEventsAbi, name: eventName } as never) as unknown as { inputs: readonly { name: string; indexed?: boolean }[] };
    const plain = item.inputs.filter((input) => !input.indexed);
    position += 1;
    return { address: roles, topics: encodeEventTopics({ abi: rolesEventsAbi, eventName, args } as never) as Hex[],
      data: encodeAbiParameters(plain as never, plain.map((input) => args[input.name]) as never), blockNumber,
      blockHash: pad(toHex(blockNumber), { size: 32 }), transactionHash: pad(toHex(position), { size: 32 }),
      transactionIndex: position, logIndex: position, removed: false };
  }
  const historia = () => [
    log("RolesModSetup", { initiator: other, owner: safe, avatar: safe, target: safe }, 5n),
    log("SetAllowance", { allowanceKey: CLAVE_PRESUPUESTO, balance: PRESUPUESTO_PERIODO, maxRefill: PRESUPUESTO_PERIODO,
      refill: PRESUPUESTO_PERIODO, period: PERIODO_SEGUNDOS, timestamp: 0n }),
    log("ScopeTarget", { roleKey: ROL_VAQUI, targetAddress: token }),
    log("ScopeFunction", { roleKey: ROL_VAQUI, targetAddress: token, selector: "0xa9059cbb", conditions: condicionesVaqui([recipient]), options: 0 }),
    log("AssignRoles", { module: wallet, roleKeys: [ROL_VAQUI], memberOf: [true] }),
  ];
  async function evaluar(logs: readonly FundLog[] | Error, input: GrupoVerificable = conPolitica, change?: (s: ReturnType<typeof chain>["state"]) => void) {
    const { state, reader } = chain();
    change?.(state);
    reader.getLogs = vi.fn(async () => { if (logs instanceof Error) throw logs; return logs; });
    return { result: await verificarGrupo(reader, input), getLogs: reader.getLogs as ReturnType<typeof vi.fn> };
  }

  it("aprueba el historial esperado, pero el grupo sigue sin pasar por la simulación", async () => {
    const { result } = await evaluar(historia());
    expect(control(result, "eventos").ok).toBe(true);
    expect(control(result, "simulacion").ok).toBe(false);
    expect(result.ok).toBe(false);
  });
  describe("control simulacion", () => {
    function completo(respuestas: Modelo["respuestas"] = {}) {
      const { state, reader } = chain();
      state.allowance = [PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, BALANCE, TIMESTAMP_PRESUPUESTO];
      state.storage.set(SLOT_BASE, palabraRefill());
      state.storage.set(SLOT_SALDO, palabraSaldo());
      const modelo: Modelo = { roles, wallet, destinatarios: [recipient], respuestas };
      const base = reader.call, negativas: FundCall[] = [];
      reader.call = vi.fn(async (request: FundCall) => {
        if (request.to !== roles || decodeFunctionData({ abi: rolesAbi, data: request.data }).functionName !== "execTransactionWithRole") return base(request);
        negativas.push(request);
        return llamarNegativa(modelo, request);
      });
      reader.getLogs = vi.fn(async () => historia());
      reader.getBlock = vi.fn(async ({ blockNumber }) => ({ number: blockNumber, hash: pad("0x01", { size: 32 }), timestamp: TIMESTAMP_BLOQUE }));
      return { reader, negativas };
    }
    it("aprueba el grupo sólo con los diez controles", async () => {
      const { reader, negativas } = completo();
      const result = await verificarGrupo(reader, conPolitica);
      expect(result.controles.filter((c) => !c.ok)).toEqual([]);
      expect(result.ok).toBe(true);
      expect(negativas).toHaveLength(10);
    });
    it("deja el grupo sin aprobar si una negativa pasa", async () => {
      const { reader } = completo({ N3: () => ({ data: "0x" }) });
      const result = await verificarGrupo(reader, conPolitica);
      expect(control(result, "eventos").ok).toBe(true);
      expect(control(result, "simulacion").ok).toBe(false);
      expect(result.ok).toBe(false);
    });
    it("no simula si eventos falló", async () => {
      const { reader, negativas } = completo();
      reader.getLogs = vi.fn(async () => historia().slice(1));
      const result = await verificarGrupo(reader, conPolitica);
      expect(control(result, "simulacion").ok).toBe(false);
      expect(negativas).toHaveLength(0);
    });
    it("no simula si el presupuesto falló", async () => {
      const { reader, negativas } = completo();
      const original = reader.call;
      reader.call = vi.fn(async (request: FundCall) => {
        if (request.to === roles && decodeFunctionData({ abi: rolesAbi, data: request.data }).functionName === "allowances") throw new FondoReadError("transport");
        return original(request);
      });
      const result = await verificarGrupo(reader, conPolitica);
      expect(control(result, "presupuesto").ok).toBe(false);
      expect(control(result, "simulacion").ok).toBe(false);
      expect(negativas).toHaveLength(0);
    });
  });

  it("consulta desde bloqueInicio hasta el mismo bloque de las demás lecturas", async () => {
    const { getLogs } = await evaluar(historia(), { ...conPolitica, bloqueInicio: 3n });
    expect(getLogs).toHaveBeenCalledExactlyOnceWith({ address: roles, fromBlock: 3n, toBlock: BLOCK });
  });
  it("sin bloqueInicio consulta desde el origen", async () => {
    const { getLogs } = await evaluar(historia());
    expect(getLogs).toHaveBeenCalledExactlyOnceWith({ address: roles, fromBlock: 0n, toBlock: BLOCK });
  });
  it.each([
    ["sin wallet operativa", { ...grupo, esperado: { duenos: owners, destinatarios: [recipient] } }],
    ["sin destinatarios", { ...grupo, esperado: { duenos: owners, walletOperativa: wallet } }],
    ["con wallet inválida", { ...grupo, esperado: { duenos: owners, walletOperativa: "0x12" as Address, destinatarios: [recipient] } }],
    ["con destinatarios que no son lista", { ...grupo, esperado: { duenos: owners, walletOperativa: wallet, destinatarios: recipient as never } }],
    ["con bloqueInicio negativo", { ...conPolitica, bloqueInicio: -1n }],
    ["con bloqueInicio futuro", { ...conPolitica, bloqueInicio: BLOCK + 1n }],
    ["con bloqueInicio numérico", { ...conPolitica, bloqueInicio: 3 as never }],
  ] as [string, GrupoVerificable][])("falla sin consultar la red %s", async (_name, input) => {
    const { result, getLogs } = await evaluar(historia(), input);
    expect(control(result, "eventos").ok).toBe(false);
    expect(getLogs).not.toHaveBeenCalled();
  });
  it("no acepta la política heredada del prototipo", async () => {
    const esperado = Object.assign(Object.create({ walletOperativa: wallet, destinatarios: [recipient] }), { duenos: owners });
    const { result, getLogs } = await evaluar(historia(), { ...grupo, esperado });
    expect(control(result, "eventos").ok).toBe(false);
    expect(getLogs).not.toHaveBeenCalled();
  });
  it("falla si la lectura de eventos falla", async () => {
    const { result } = await evaluar(new FondoReadError("transport"));
    expect(control(result, "eventos").ok).toBe(false);
  });
  it("falla sin el setup en el rango", async () => {
    const { result } = await evaluar(historia().slice(1));
    expect(control(result, "eventos").ok).toBe(false);
  });
  it("falla con un permiso adicional", async () => {
    const { result } = await evaluar([...historia(), log("AllowTarget", { roleKey: ROL_VAQUI, targetAddress: other, options: 0 })]);
    expect(control(result, "eventos").ok).toBe(false);
  });
  it("falla si los destinatarios vigentes no son los esperados", async () => {
    const { result } = await evaluar(historia(), { ...conPolitica, esperado: { duenos: owners, walletOperativa: wallet, destinatarios: [other] } });
    expect(control(result, "eventos").ok).toBe(false);
  });
  it("no consulta eventos si falló la configuración de permisos", async () => {
    const { result, getLogs } = await evaluar(historia(), conPolitica, (s) => { s.owner = other; });
    expect(control(result, "eventos").ok).toBe(false);
    expect(getLogs).not.toHaveBeenCalled();
  });
});

describe("verificarGrupo: controles estructurales", () => {
  it("pasa los ocho estructurales en un grupo sano y no aprueba sin eventos ni simulación", async () => {
    const result = await run(() => {});
    expect(result.controles.map((c) => c.id)).toEqual(IDS);
    expect(result.controles.slice(0, 8).every((c) => c.ok)).toBe(true);
    expect(control(result, "eventos").ok).toBe(false);
    expect(control(result, "simulacion").ok).toBe(false);
    expect(result.ok).toBe(false);
  });

  it("lee todo en un solo bloque y pide el presupuesto con su clave", async () => {
    const { state, reader } = chain();
    await verificarGrupo(reader, grupo);
    expect(new Set(state.blocks)).toEqual(new Set([BLOCK]));
    expect(state.allowanceKey).toBe(CLAVE_PRESUPUESTO);
  });

  it("acepta dueños en otro orden y otras mayúsculas", async () => {
    const result = await run((s) => { s.owners = [owners[2], owners[0], owners[1]]; },
      { ...grupo, esperado: { duenos: owners.map((o) => o.toUpperCase().replace("0X", "0x")) as Address[] } });
    expect(control(result, "safe-config").ok).toBe(true);
  });

  it.each([
    ["la red leída no es Celo", (s: ReturnType<typeof chain>["state"]) => { s.chainId = 1; }, grupo],
    ["la red pedida no es Celo", () => {}, { ...grupo, chainId: 1 }],
    ["la dirección de entrada es inválida", () => {}, { ...grupo, safe: "0x12" as Address }],
    ["el fondo y el módulo son la misma dirección", () => {}, { ...grupo, roles: safe }],
  ] as const)("falla todos los controles si %s", async (_name, change, input) => {
    const result = await run(change, input as GrupoVerificable);
    expect(result.ok).toBe(false);
    expect(result.controles.map((c) => c.id)).toEqual(IDS);
    expect(result.controles.every((c) => !c.ok)).toBe(true);
  });

  it.each(Object.keys(contracts))("contratos falla si cambia el código de %s, y sus dependientes también", async (name) => {
    const reference = contracts[name as keyof typeof contracts];
    const result = await run((s) => { s.code.set(reference.address.toLowerCase(), "0xdead"); });
    expect(control(result, "contratos").ok).toBe(false);
    expect(result.controles.every((c) => !c.ok)).toBe(true);
  });

  it.each([
    ["un runtime impostor", (s: ReturnType<typeof chain>["state"]) => { s.code.set(safe, "0x6000"); }],
    ["sin código", (s: ReturnType<typeof chain>["state"]) => { s.code.set(safe, undefined); }],
    ["otro singleton", (s: ReturnType<typeof chain>["state"]) => { s.storage.set(ZERO, pad(other, { size: 32 })); }],
    ["slot 0 ausente", (s: ReturnType<typeof chain>["state"]) => { s.storage.delete(ZERO); }],
  ])("safe-proxy falla con %s y no confía en los getters", async (_name, change) => {
    const result = await run(change);
    for (const id of ["safe-proxy", "safe-config", "safe-handler", "safe-modulos"]) expect(control(result, id).ok).toBe(false);
    expect(control(result, "contratos").ok).toBe(true);
  });

  it.each([
    ["un dueño extra", (s: ReturnType<typeof chain>["state"]) => { s.owners = [...owners, other]; }],
    ["un dueño distinto", (s: ReturnType<typeof chain>["state"]) => { s.owners = [owners[0], owners[1], other]; }],
    ["un dueño de menos", (s: ReturnType<typeof chain>["state"]) => { s.owners = [owners[0], owners[1]]; }],
    ["umbral 1", (s: ReturnType<typeof chain>["state"]) => { s.threshold = 1n; }],
    ["umbral 3", (s: ReturnType<typeof chain>["state"]) => { s.threshold = 3n; }],
    ["un guard activo", (s: ReturnType<typeof chain>["state"]) => { s.storage.set(GUARD_SLOT, pad(other, { size: 32 })); }],
    ["guard ilegible", (s: ReturnType<typeof chain>["state"]) => { s.storage.delete(GUARD_SLOT); }],
  ])("safe-config falla con %s", async (_name, change) => {
    expect(control(await run(change), "safe-config").ok).toBe(false);
  });

  it.each([
    ["sin dueños esperados", { chainId: 42220, safe, roles }],
    ["con dos dueños esperados", { ...grupo, esperado: { duenos: owners.slice(0, 2) } }],
    ["con dueños repetidos", { ...grupo, esperado: { duenos: [owners[0], owners[0], owners[1]] } }],
    ["con un dueño inválido", { ...grupo, esperado: { duenos: [owners[0], owners[1], "0x12"] } }],
  ])("safe-config falla cerrado %s, sin tomar la lista de la cadena", async (_name, input) => {
    const result = await run(() => {}, input as GrupoVerificable);
    expect(control(result, "safe-config").ok).toBe(false);
    expect(control(result, "safe-handler").ok).toBe(true);
  });

  it("safe-handler falla con otro handler", async () => {
    const result = await run((s) => { s.storage.set(HANDLER_SLOT, pad(other, { size: 32 })); });
    expect(control(result, "safe-handler").ok).toBe(false);
  });

  it.each([
    ["otro módulo", (s: ReturnType<typeof chain>["state"]) => { s.modules = [other]; }],
    ["un módulo extra", (s: ReturnType<typeof chain>["state"]) => { s.modules = [roles, other]; }],
    ["sin módulos", (s: ReturnType<typeof chain>["state"]) => { s.modules = []; }],
    ["más páginas", (s: ReturnType<typeof chain>["state"]) => { s.next = other; }],
  ])("safe-modulos falla con %s", async (_name, change) => {
    expect(control(await run(change), "safe-modulos").ok).toBe(false);
  });

  it.each([
    ["otra mastercopy", (s: ReturnType<typeof chain>["state"]) => {
      s.code.set(roles, concat(["0x363d3d373d3d3d363d73", other, "0x5af43d82803e903d91602b57fd5bf3"])); }],
    ["sin código", (s: ReturnType<typeof chain>["state"]) => { s.code.set(roles, undefined); }],
  ])("roles-mastercopy falla con %s y arrastra config y presupuesto", async (_name, change) => {
    const result = await run(change);
    for (const id of ["roles-mastercopy", "roles-config", "presupuesto"]) expect(control(result, id).ok).toBe(false);
  });

  it.each(["owner", "avatar", "target"] as const)("roles-config falla si %s no es el fondo", async (field) => {
    expect(control(await run((s) => { s[field] = other; }), "roles-config").ok).toBe(false);
  });

  it.each([
    ["refill", [1n, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, 0n, 0n]],
    ["maxRefill", [PRESUPUESTO_PERIODO, 1n, PERIODO_SEGUNDOS, 0n, 0n]],
    ["period", [PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, 1n, 0n, 0n]],
    ["balance excedido", [PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, PRESUPUESTO_PERIODO + 1n, 0n]],
  ] as const)("presupuesto falla con %s", async (_name, allowance) => {
    expect(control(await run((s) => { s.allowance = allowance; }), "presupuesto").ok).toBe(false);
  });

  it("presupuesto acepta un saldo gastado parcialmente", async () => {
    const result = await run((s) => { s.allowance = [PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, 1n, 9n]; });
    expect(control(result, "presupuesto").ok).toBe(true);
  });

  it("una lectura fallida deja el control en falso, sin lanzar ni filtrar detalles", async () => {
    const { reader } = chain();
    reader.getStorageAt = vi.fn(async () => { throw new FondoReadError("transport"); });
    const result = await verificarGrupo(reader, grupo);
    expect(control(result, "safe-proxy").ok).toBe(false);
    expect(control(result, "contratos").ok).toBe(true);
    expect(result.ok).toBe(false);
  });

  it.each([undefined, null, -1n, "77", 77])("falla todos los controles con la altura de bloque %s", async (height) => {
    const { reader } = chain();
    reader.getBlockNumber = vi.fn(async () => height as bigint);
    const result = await verificarGrupo(reader, grupo);
    expect(result.controles.every((c) => !c.ok)).toBe(true);
  });

  it("no acepta dueños esperados heredados del prototipo", async () => {
    const result = await run(() => {}, { ...grupo, esperado: Object.create({ duenos: owners }) });
    expect(control(result, "safe-config").ok).toBe(false);
  });

  it("comprueba las seis referencias", async () => {
    const { reader } = chain();
    await verificarGrupo(reader, grupo);
    expect(Object.keys(contracts)).toHaveLength(6);
    for (const reference of Object.values(contracts)) {
      expect(reader.getCode).toHaveBeenCalledWith({ address: reference.address, blockNumber: BLOCK });
    }
  });

  it("no expone direcciones ni causas en los detalles", async () => {
    const { reader } = chain();
    reader.getChainId = vi.fn(async () => { throw new Error("https://provider-private.invalid"); });
    const result = await verificarGrupo(reader, grupo);
    expect(result.controles.every((c) => !c.ok)).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/0x[0-9a-fA-F]{6}|provider-private/);
  });
});
