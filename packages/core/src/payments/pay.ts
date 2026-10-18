import { encodeFunctionData, erc20Abi, type Hex, type LocalAccount } from "viem";
import type { AppConfig } from "../config/env.js";
import { CELO_MAINNET } from "../config/network.js";
import type { Policy } from "../config/policy.js";
import { WFIAT, type WFiatSymbol } from "../config/tokens.js";
import { formatLocal, parseLocalAmount } from "../money/amounts.js";
import { evaluatePayment } from "../policy/engine.js";
import type { JsonLedger } from "../policy/ledger.js";
import type { ChainReader } from "../chain/reader.js";
import { assertMainnet, broadcast, prepareTaggedTx } from "../chain/tagged-sender.js";
import { gasLine } from "./messages.js";

export interface PayDeps {
  config: AppConfig;
  reader: ChainReader;
  account: LocalAccount;
  ledger: JsonLedger;
  policy: Readonly<Policy>;
  /** Opcional: convierte un costo de gas (USD, 18 dec) a unidades locales para mostrarlo */
  gasToLocal?: (usd18: bigint, token: WFiatSymbol) => Promise<bigint | null>;
}

export interface PayRequest {
  token: WFiatSymbol;
  /** Monto en moneda local, formato canónico "1500.50" */
  amount: string;
  /** Alias de la allowlist */
  recipient: string;
  reason: string;
}

export interface PayResult {
  mode: "dry-run" | "live";
  status: "simulated" | "rejected" | "confirmed" | "failed";
  message: string;
  signedTx?: Hex;
  txHash?: Hex;
  explorerUrl?: string;
  attributionVerified?: boolean;
}

export async function pay(deps: PayDeps, req: PayRequest): Promise<PayResult> {
  const { config, reader, account, ledger, policy } = deps;
  const mode = config.live ? "live" : "dry-run";
  const token = WFIAT[req.token];
  const amount = parseLocalAmount(req.amount, token.decimals);
  const shown = formatLocal(amount, token);

  // 1) Política: puro código, antes de tocar la red
  const today = ledger.today(req.token);
  const decision = evaluatePayment(
    { token: req.token, amount, recipient: req.recipient },
    { policy, allowlist: config.allowlist, spentToday: today.spent, countToday: today.count },
  );
  if (!decision.ok) return { mode, status: "rejected", message: decision.message };

  // 2) Red y token: ¿es realmente el wARS de Ripio en Celo mainnet?
  await assertMainnet(reader);
  const meta = await reader.erc20Meta(token.address);
  if (meta.decimals !== token.decimals) {
    throw new Error(`El contrato ${token.symbol} reporta ${meta.decimals} decimales (esperado ${token.decimals}). Abortado.`);
  }
  if (meta.symbol.toLowerCase() !== token.symbol.toLowerCase()) {
    throw new Error(`El contrato reporta el símbolo "${meta.symbol}" y se esperaba "${token.symbol}". Abortado.`);
  }

  // 3) Saldo en pesos
  const balance = await reader.balanceOf(token.address, account.address);
  if (balance < amount) {
    return {
      mode,
      status: "rejected",
      message: `No te alcanza el saldo: tenés ${formatLocal(balance, token)} y querés enviar ${shown}.`,
    };
  }

  // 4) Construir, taggear, estimar, firmar y verificar
  const data = encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [decision.to, amount] });
  const prepared = await prepareTaggedTx({ config, reader, account, policy }, { to: token.address, data });
  if (!prepared.ok) {
    return {
      mode,
      status: "rejected",
      message:
        prepared.reason === "GAS_OVER_CAP"
          ? "El costo de red está inusualmente alto ahora. No envié nada; probá de nuevo en unos minutos."
          : "Falta saldo para pagar el costo de red de la transferencia. No envié nada.",
    };
  }

  const gasMsg = await gasLine(prepared.maxGasCost18, req.token, deps.gasToLocal);

  if (!config.live) {
    return {
      mode,
      status: "simulated",
      signedTx: prepared.signedTx,
      message: `Modo ensayo: así quedaría el envío de ${shown} a "${req.recipient}". ${gasMsg} No se movió dinero.`,
    };
  }

  // 5) Real: reservar presupuesto → transmitir → confirmar → verificar tag on-chain
  const reservation = ledger.reserve({ token: req.token, amount, to: decision.to });
  let sent;
  try {
    sent = await broadcast({ config, reader, account, policy }, prepared.signedTx);
  } catch (err) {
    ledger.settle(reservation, { status: "failed" });
    throw err;
  }

  const explorerUrl = CELO_MAINNET.explorerTx(sent.txHash);
  if (sent.status !== "success") {
    ledger.settle(reservation, { status: "failed", txHash: sent.txHash });
    return { mode, status: "failed", txHash: sent.txHash, explorerUrl, message: `El envío de ${shown} no se completó. No se descontó de tu saldo.` };
  }

  ledger.settle(reservation, { status: "confirmed", txHash: sent.txHash });
  const attributionVerified = sent.attributionCodes?.includes(config.attributionCode) ?? false;
  return {
    mode,
    status: "confirmed",
    txHash: sent.txHash,
    explorerUrl,
    attributionVerified,
    message: `Listo: enviaste ${shown} a "${req.recipient}". ${gasMsg} Comprobante: ${explorerUrl}`,
  };
}
