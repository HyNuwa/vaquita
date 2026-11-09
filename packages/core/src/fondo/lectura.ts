import { BaseError, RpcRequestError, isAddress, type Address, type Hex, type PublicClient } from "viem";
import type { CreationReader } from "./creacion.js";

// Solo los campos usados: los bloques Celo incluyen transacciones que no son del tipo Ethereum.
export type FondoPublicClient = Pick<PublicClient,
  "ccipRead" | "getChainId" | "getBlockNumber" | "getCode" | "getStorageAt" | "getLogs"> & {
  getBlock(request: { blockNumber: bigint }): Promise<{ number: bigint | null; hash: Hex | null; timestamp: bigint }>;
  call(request: Omit<FundCall, "stateOverride"> & {
    stateOverride?: { address: Address; stateDiff: { slot: Hex; value: Hex }[] }[];
  }): Promise<{ data?: Hex }>;
};
export type StateDiff = readonly { slot: Hex; value: Hex }[];
export type FundCall = Parameters<CreationReader["call"]>[0] & {
  account?: Address; value?: bigint;
  stateOverride?: readonly { address: Address; stateDiff: StateDiff }[];
};
export interface FundBlock { number: bigint; hash: Hex; timestamp: bigint }
export interface FundLog {
  address: Address; topics: readonly Hex[]; data: Hex;
  blockNumber: bigint; blockHash: Hex; transactionHash: Hex;
  transactionIndex: number; logIndex: number; removed: boolean;
}
export interface FondoReader extends CreationReader {
  getBlock(request: { blockNumber: bigint }): Promise<FundBlock>;
  getLogs(request: { address: Address; fromBlock: bigint; toBlock: bigint }): Promise<readonly FundLog[]>;
  call(request: FundCall): Promise<{ data?: Hex }>;
}
export type FundReadErrorKind = "revert" | "transport" | "unsupported" | "invalid-response" | "invalid-request";
export class FondoReadError extends Error {
  readonly kind: FundReadErrorKind;
  readonly data?: Hex;
  constructor(kind: FundReadErrorKind, data?: Hex) {
    super("No pudimos leer los datos del grupo.");
    this.name = "FondoReadError";
    this.kind = kind;
    this.data = data;
  }
}

function bytes(value: unknown, size?: number): value is Hex {
  return typeof value === "string" && /^0x(?:[0-9a-fA-F]{2})*$/.test(value)
    && (size === undefined || value.length === 2 + size * 2);
}
function response(valid: unknown): asserts valid {
  if (!valid) throw new FondoReadError("invalid-response");
}
function normalize(error: unknown, isCall: boolean, hasOverride: boolean): FondoReadError {
  if (error instanceof FondoReadError) return error;
  let current = error;
  // Solo errores RPC estructurados; ni mensajes ni objetos sueltos acreditan una negativa.
  for (let depth = 0; depth < 16 && current instanceof BaseError; depth++) {
    if (current instanceof RpcRequestError) {
      if (isCall && current.code === 3) {
        if (current.data === undefined) return new FondoReadError("revert");
        return bytes(current.data) ? new FondoReadError("revert", current.data) : new FondoReadError("invalid-response");
      }
      if (current.code === -32601 || (hasOverride && current.code === -32602)) return new FondoReadError("unsupported");
      break;
    }
    current = current.cause;
  }
  return new FondoReadError("transport");
}
async function read<T>(action: () => Promise<T>, isCall = false, hasOverride = false): Promise<T> {
  try { return await action(); }
  catch (error) { throw normalize(error, isCall, hasOverride); }
}
function callParameters(request: FundCall) {
  const stateOverride = request.stateOverride;
  if (stateOverride !== undefined) {
    if (!Array.isArray(stateOverride) || !stateOverride.every((entry) => entry && isAddress(entry.address, { strict: false })
      && Object.keys(entry).every((key) => key === "address" || key === "stateDiff") && Array.isArray(entry.stateDiff)
      && entry.stateDiff.every((item: StateDiff[number]) => item && bytes(item.slot, 32) && bytes(item.value, 32)
        && Object.keys(item).every((key) => key === "slot" || key === "value")))) throw new FondoReadError("invalid-request");
  }
  return { to: request.to, data: request.data, blockNumber: request.blockNumber,
    ...(request.account === undefined ? {} : { account: request.account }),
    ...(request.value === undefined ? {} : { value: request.value }),
    ...(stateOverride === undefined ? {} : { stateOverride: stateOverride.map(({ address, stateDiff }: NonNullable<FundCall["stateOverride"]>[number]) => ({ address,
      stateDiff: stateDiff.map(({ slot, value }: StateDiff[number]) => ({ slot, value })) })) }) };
}

/** Solo lectura por cliente inyectado; no crea transportes, firma, reintenta ni activa fondos. */
export function createFondoReader(client: FondoPublicClient): FondoReader {
  // Con CCIP activo, un revert de un contrato no confiable elegiría una URL a contactar y reemplazaría la negativa.
  if (client.ccipRead !== false) throw new FondoReadError("invalid-request");
  return {
    getChainId: () => read(async () => {
      const value = await client.getChainId(); response(Number.isSafeInteger(value) && value >= 0); return value;
    }),
    getBlockNumber: () => read(async () => {
      const value = await client.getBlockNumber({ cacheTime: 0 }); response(typeof value === "bigint" && value >= 0n); return value;
    }),
    getCode: ({ address, blockNumber }) => read(async () => {
      const value = await client.getCode({ address, blockNumber }); response(value === undefined || bytes(value)); return value;
    }),
    getStorageAt: ({ address, slot, blockNumber }) => read(async () => {
      const value = await client.getStorageAt({ address, slot, blockNumber }); response(value === undefined || bytes(value, 32)); return value;
    }),
    getBlock: ({ blockNumber }) => read(async () => {
      const value = await client.getBlock({ blockNumber });
      response(value && typeof value === "object" && !Array.isArray(value));
      response(value.number === blockNumber && bytes(value.hash, 32) && typeof value.timestamp === "bigint" && value.timestamp >= 0n);
      return { number: value.number, hash: value.hash, timestamp: value.timestamp };
    }),
    getLogs: ({ address, fromBlock, toBlock }) => read(async () => {
      const values = await client.getLogs({ address, fromBlock, toBlock }); response(Array.isArray(values));
      return values.map((value): FundLog => {
        response(value && typeof value === "object" && !Array.isArray(value));
        response(isAddress(value.address, { strict: false }) && value.address.toLowerCase() === address.toLowerCase()
          && typeof value.blockNumber === "bigint" && value.blockNumber >= fromBlock && value.blockNumber <= toBlock
          && bytes(value.blockHash, 32) && bytes(value.transactionHash, 32) && bytes(value.data)
          && Array.isArray(value.topics) && value.topics.every((topic) => bytes(topic, 32))
          && typeof value.logIndex === "number" && Number.isSafeInteger(value.logIndex) && value.logIndex >= 0
          && typeof value.transactionIndex === "number" && Number.isSafeInteger(value.transactionIndex) && value.transactionIndex >= 0
          && typeof value.removed === "boolean");
        return { address: value.address, topics: [...value.topics], data: value.data, blockNumber: value.blockNumber,
          blockHash: value.blockHash, transactionHash: value.transactionHash, transactionIndex: value.transactionIndex,
          logIndex: value.logIndex, removed: value.removed };
      });
    }),
    call: (request) => read(async () => {
      const value = await client.call(callParameters(request));
      response(value && typeof value === "object" && !Array.isArray(value) && (value.data === undefined || bytes(value.data)));
      return value.data === undefined ? {} : { data: value.data };
    }, true, request.stateOverride !== undefined),
  };
}
