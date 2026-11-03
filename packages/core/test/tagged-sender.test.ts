import { describe, expect, it } from "vitest";
import { encodeFunctionData, erc20Abi, toFunctionSelector, type Hex } from "viem";
import { parseTransaction } from "viem/celo";
import { fromDataSuffix } from "@celo/attribution-tags";
import { broadcast, prepareTaggedTx } from "../src/chain/tagged-sender.js";
import { POLICY } from "../src/config/policy.js";
import { MAMA, TEST_CODE, accountFrom, fakeReader, testConfig } from "./helpers.js";

// Con 30 gwei y el margen de 20 %: 2,8 M reservan 0,1008 y 6 M reservan 0,216.
const ENTRE_LOS_TOPES = 2_800_000n;
const SOBRE_LOS_TOPES = 6_000_000n;
const INITCODE = "0x6080604052" as Hex;
const EJECUTAR = toFunctionSelector("ejecutar()") as Hex;
const CREAR = toFunctionSelector("createCampaign((bytes32,address,uint256,uint256,address,uint32,uint32,uint64),address[])") as Hex;

function setup(gas: bigint, live = false) {
  const config = testConfig({ live });
  const reader = fakeReader({ estimateGas: async () => gas });
  return { reader, deps: { config, reader, account: accountFrom(config), policy: POLICY } };
}

describe("prepareTaggedTx: despliegue", () => {
  it("firma una creación de contrato sin destino, con etiqueta y gas en stablecoin", async () => {
    const { deps, reader } = setup(ENTRE_LOS_TOPES);
    const r = await prepareTaggedTx(deps, { deploy: true, data: INITCODE });
    if (!r.ok) throw new Error(r.reason);
    const tx = parseTransaction(r.signedTx) as { type: string; chainId: number; to?: string; data: Hex; feeCurrency: string };
    expect(tx.type).toBe("cip64");
    expect(tx.chainId).toBe(42220);
    expect(tx.to).toBeFalsy();
    expect(tx.data.startsWith(INITCODE)).toBe(true);
    expect(fromDataSuffix(tx.data)?.codes).toEqual([TEST_CODE]);
    expect(tx.feeCurrency).toBeTruthy();
    expect((reader.estimateGas.mock.calls[0]![0] as { to?: string }).to).toBeUndefined();
  });

  it("no pasa el tope de contratos", async () => {
    const { deps } = setup(SOBRE_LOS_TOPES);
    const r = await prepareTaggedTx(deps, { deploy: true, data: INITCODE });
    expect(r).toMatchObject({ ok: false, reason: "GAS_OVER_CAP" });
  });

  it("en ensayo no se puede transmitir", async () => {
    const { deps, reader } = setup(ENTRE_LOS_TOPES);
    const r = await prepareTaggedTx(deps, { deploy: true, data: INITCODE });
    if (!r.ok) throw new Error(r.reason);
    await expect(broadcast(deps, r.signedTx)).rejects.toThrow("modo ensayo");
    expect(reader.sendRaw).not.toHaveBeenCalled();
  });
});

describe("prepareTaggedTx: topes de gas", () => {
  it("una llamada común usa el tope de pagos aunque el gas entre en el de contratos", async () => {
    const { deps } = setup(ENTRE_LOS_TOPES);
    const r = await prepareTaggedTx(deps, { to: MAMA, data: "0x1234" });
    expect(r).toMatchObject({ ok: false, reason: "GAS_OVER_CAP" });
  });

  it("una operación de contrato usa el tope de contratos y conserva su destino", async () => {
    const { deps } = setup(ENTRE_LOS_TOPES);
    for (const data of [EJECUTAR, CREAR]) {
      const r = await prepareTaggedTx(deps, { to: MAMA, data, gasClass: "contract" });
      if (!r.ok) throw new Error(r.reason);
      const tx = parseTransaction(r.signedTx) as { to?: string };
      expect(tx.to?.toLowerCase()).toBe(MAMA);
    }
  });

  it("un transfer no puede pedir el tope de contratos", async () => {
    const { deps, reader } = setup(ENTRE_LOS_TOPES);
    const data = encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [MAMA, 1n] });
    await expect(prepareTaggedTx(deps, { to: MAMA, data, gasClass: "contract" })).rejects.toThrow("tope de gas de contratos");
    expect(reader.estimateGas).not.toHaveBeenCalled();
  });

  it("una operación de contrato tampoco pasa su tope", async () => {
    const { deps } = setup(SOBRE_LOS_TOPES);
    const r = await prepareTaggedTx(deps, { to: MAMA, data: EJECUTAR, gasClass: "contract" });
    expect(r).toMatchObject({ ok: false, reason: "GAS_OVER_CAP" });
  });

  it("un destino faltante no se convierte en despliegue", async () => {
    const { deps } = setup(60_000n);
    const sinDestino = { to: undefined, data: "0x1234" } as never;
    await expect(prepareTaggedTx(deps, sinDestino)).rejects.toThrow("destino");
  });

  it("deploy: false nunca crea un contrato: conserva el destino y el tope de pagos", async () => {
    const { deps } = setup(60_000n);
    const r = await prepareTaggedTx(deps, { to: MAMA, data: "0x1234", deploy: false } as never);
    if (!r.ok) throw new Error(r.reason);
    expect((parseTransaction(r.signedTx) as { to?: string }).to?.toLowerCase()).toBe(MAMA);
    const caro = setup(ENTRE_LOS_TOPES);
    const rechazada = await prepareTaggedTx(caro.deps, { to: MAMA, data: "0x1234", deploy: false } as never);
    expect(rechazada).toMatchObject({ ok: false, reason: "GAS_OVER_CAP" });
  });

  it("deploy: false sin destino se rechaza", async () => {
    const { deps } = setup(60_000n);
    await expect(prepareTaggedTx(deps, { data: "0x1234", deploy: false } as never)).rejects.toThrow("destino");
  });

  it("un despliegue con destino es ambiguo y se rechaza", async () => {
    const { deps } = setup(60_000n);
    await expect(prepareTaggedTx(deps, { to: MAMA, data: INITCODE, deploy: true } as never)).rejects.toThrow("destino");
  });
});
