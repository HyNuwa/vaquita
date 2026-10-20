import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import type { Address, Hex } from "viem";
import type { WFiatSymbol } from "../config/tokens.js";

/**
 * Registro local de gastos para el presupuesto diario.
 * Se RESERVA antes de transmitir (así un crash no deja gastar dos veces el cupo) y se
 * libera si la tx falla. Los ensayos no se registran.
 */

export type EntryStatus = "pending" | "confirmed" | "failed";

interface Entry {
  id: string;
  day: string;
  token: WFiatSymbol;
  amount: string; // bigint serializado
  to: Address;
  status: EntryStatus;
  txHash?: Hex;
  createdAt: string;
}

export function dayKey(d: Date, timeZone: string): string {
  // en-CA formatea como YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export class JsonLedger {
  constructor(
    private readonly file: string,
    private readonly timeZone: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  private load(): Entry[] {
    if (!existsSync(this.file)) return [];
    return JSON.parse(readFileSync(this.file, "utf8")) as Entry[];
  }

  private save(entries: Entry[]): void {
    mkdirSync(dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    writeFileSync(tmp, JSON.stringify(entries, null, 2));
    renameSync(tmp, this.file); // escritura atómica
  }

  today(token: WFiatSymbol): { spent: bigint; count: number } {
    const day = dayKey(this.now(), this.timeZone);
    const live = this.load().filter((e) => e.day === day && e.token === token && e.status !== "failed");
    return { spent: live.reduce((s, e) => s + BigInt(e.amount), 0n), count: live.length };
  }

  reserve(x: { token: WFiatSymbol; amount: bigint; to: Address }): string {
    const entries = this.load();
    const id = randomUUID();
    entries.push({
      id,
      day: dayKey(this.now(), this.timeZone),
      token: x.token,
      amount: x.amount.toString(),
      to: x.to,
      status: "pending",
      createdAt: this.now().toISOString(),
    });
    this.save(entries);
    return id;
  }

  settle(id: string, x: { status: Exclude<EntryStatus, "pending">; txHash?: Hex }): void {
    const entries = this.load();
    const e = entries.find((y) => y.id === id);
    if (!e) throw new Error(`Ledger: no existe la reserva ${id}`);
    e.status = x.status;
    if (x.txHash) e.txHash = x.txHash;
    this.save(entries);
  }
}
