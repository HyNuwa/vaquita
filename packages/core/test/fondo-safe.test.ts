import { describe, expect, it } from "vitest";
import {
  concat, encodeAbiParameters, keccak256, parseAbiParameters, toHex,
  type Address, type Hex,
} from "viem";

// Fixtures sintéticos offline: no provienen de un fork ni acreditan S2-11.
const safe = "0x0000000000000000000000000000000000000011";
const target = "0x0000000000000000000000000000000000000022";
const tx = { to: target, value: 123n, data: "0x123456", operation: 0, nonce: 7n } as const;
const zero = "0x0000000000000000000000000000000000000000";
const syntheticHash = "0xa9d2139b491153eaee4aa0a906f12d4c0e8ec7d93ef0a7fb5fbe8f1df77b006c"; // Digest EIP-712 sintético, no una clave: secret-scan: allow

// Referencia independiente: fórmula EIP-712 de Safe 1.4.1, sin hashTypedData
// ni imports del módulo bajo prueba. Entradas fijas; sin RPC.
function referenceHash(): Hex {
  const domain = keccak256(encodeAbiParameters(
    parseAbiParameters("bytes32,uint256,address"),
    [keccak256(toHex("EIP712Domain(uint256 chainId,address verifyingContract)")), 42220n, safe],
  ));
  const body = keccak256(encodeAbiParameters(
    parseAbiParameters("bytes32,address,uint256,bytes32,uint8,uint256,uint256,uint256,address,address,uint256"),
    [keccak256(toHex("SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)")),
      target, 123n, keccak256("0x123456"), 0, 0n, 0n, 0n, zero, zero, 7n],
  ));
  return keccak256(concat(["0x1901", domain, body]));
}

describe("primitivas Safe sin red", () => {
  it("S3: conserva la tabla exacta de constantes", async () => {
    const c = await import("../src/fondo/constantes.js");
    expect({ ...c }).toEqual({
      LIMITE_POR_TRANSFERENCIA: 5_000n * 10n ** 18n,
      PRESUPUESTO_PERIODO: 20_000n * 10n ** 18n,
      PERIODO_SEGUNDOS: 2_592_000n,
      APORTE_MAXIMO_UI: 5_000n * 10n ** 18n,
      OBJETIVO_GRUPO: 100_000n * 10n ** 18n,
      MAX_DESTINATARIOS: 20,
      ROL_VAQUI: keccak256(toHex("vaqui")),
      CLAVE_PRESUPUESTO: keccak256(toHex("vaqui-mensual")),
    });
  });

  it("S8: calcula la referencia sintética independiente (no fork)", () => {
    expect(referenceHash()).toBe(syntheticHash);
  });

  it("S3/S8: liga dominio Celo, Safe, cuerpo y nonce al hash", async () => {
    const { hashTransaccionSafe, SAFE_GAS_FIELDS } = await import("../src/fondo/safe.js");
    expect(SAFE_GAS_FIELDS).toEqual({
      safeTxGas: 0n, baseGas: 0n, gasPrice: 0n, gasToken: zero, refundReceiver: zero,
    });
    expect(Object.isFrozen(SAFE_GAS_FIELDS)).toBe(true);
    const hash = hashTransaccionSafe(safe, tx);
    expect(hash).toBe(syntheticHash);
    expect(hashTransaccionSafe(target, tx)).not.toBe(hash);
    for (const change of [
      { to: safe }, { value: 124n }, { data: "0x" as Hex },
      { operation: 1 as const }, { nonce: 8n },
    ] as const) {
      expect(hashTransaccionSafe(safe, { ...tx, ...change })).not.toBe(hash);
    }
    expect(tx).toEqual({ to: target, value: 123n, data: "0x123456", operation: 0, nonce: 7n });
  });

  it("S2-11: coincide con el vector que calculó getTransactionHash en el fork", async () => {
    const { hashTransaccionSafe } = await import("../src/fondo/safe.js");
    const { WFIAT } = await import("../src/config/tokens.js");
    expect(hashTransaccionSafe("0x34B0b659358A43a5636a0279407474DFe2EDC020", {
      to: WFIAT.wARS.address, value: 0n, data: "0xa9059cbb", operation: 0, nonce: 7n,
    })).toBe("0x72dd3b1a0246ea09001c4cb84bd981b9cb6882efee55ad7b08b040d7bad2442e"); // Hash público de la transacción; secret-scan: allow
  });

  it("S4: dos entradas exactas de 65 bytes en orden numérico, no por mayúsculas", async () => {
    const { firmasPreaprobadas } = await import("../src/fondo/safe.js");
    const low = "0x000000000000000000000000000000000000000a";
    const high = "0x000000000000000000000000000000000000000B";
    const owners = [high, low] as const;
    const lowSignature = `${"0".repeat(24)}${low.slice(2)}${"0".repeat(64)}01`;
    const highSignature = `${"0".repeat(24)}${high.slice(2).toLowerCase()}${"0".repeat(64)}01`;
    expect(lowSignature).toHaveLength(130);
    expect(highSignature).toHaveLength(130);
    const expected = `0x${lowSignature}${highSignature}`;
    expect(firmasPreaprobadas(owners)).toBe(expected);
    expect(firmasPreaprobadas([low, high])).toBe(expected);
    expect(owners).toEqual([high, low]);
    expect(() => firmasPreaprobadas([low, low.toUpperCase().replace("0X", "0x") as Address]))
      .toThrow("Necesitás dos responsables distintos.");
    for (const invalid of [[], [low], [low, high, safe]]) {
      expect(() => firmasPreaprobadas(invalid as unknown as readonly [Address, Address]))
        .toThrow("Necesitás exactamente dos responsables.");
    }
  });

  it("S5: codifica una lista vacía como multiSend(bytes) con bytes vacíos", async () => {
    const { encodeMultiSend } = await import("../src/fondo/safe.js");
    expect(encodeMultiSend([])).toBe(
      "0x8d80ff0a" +
      "0000000000000000000000000000000000000000000000000000000000000020" +
      "0000000000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("S5: devuelve multiSend(bytes) completo contra un vector fijo de dos llamadas", async () => {
    const { encodeMultiSend } = await import("../src/fondo/safe.js");
    const calls = [{ to: safe, data: "0x1234" }, { to: target, data: "0x" }] as const;
    // Selector, offset, longitud 172; cada entrada: op(1), to(20),
    // value(32), longitud(32), data. Padding ABI externo: 20 bytes.
    const expected = (
      "0x8d80ff0a" +
      "0000000000000000000000000000000000000000000000000000000000000020" +
      "00000000000000000000000000000000000000000000000000000000000000ac" +
      "00" + "0000000000000000000000000000000000000011" +
      "0000000000000000000000000000000000000000000000000000000000000000" +
      "0000000000000000000000000000000000000000000000000000000000000002" + "1234" +
      "00" + "0000000000000000000000000000000000000022" +
      "0000000000000000000000000000000000000000000000000000000000000000" +
      "0000000000000000000000000000000000000000000000000000000000000000" +
      "0000000000000000000000000000000000000000"
    );
    expect(encodeMultiSend(calls)).toBe(expected);
    expect(calls).toEqual([{ to: safe, data: "0x1234" }, { to: target, data: "0x" }]);
  });
});
