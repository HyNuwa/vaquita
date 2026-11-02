import { closeSync, existsSync, fsyncSync, linkSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import type { AgentLogEntry } from "./agent-log.js";
import type { FundsRecord, LoopPhase, SkipCode } from "./loop.js";
import type { CampaignTerms } from "./terms.js";

/**
 * Lo que el loop tiene que recordar entre reinicios: sin esto repetiría avisos o gastaría
 * intentos de más. Vive en `data/`, fuera del repo. Solo guarda alias, salvo la tx firmada
 * de una ejecución en curso, que es pública desde que se transmite.
 */
export interface CampaignRecord {
  terms: CampaignTerms;
  phase: LoopPhase;
  pendingSuppliers: { supplier: string; requestedAt: number }[];
  offersCloseAt?: number;
  /** Veces que se hizo cada acción, por clave. */
  done: Record<string, number>;
  funds: Record<string, FundsRecord>;
  /** Último motivo por el que no se ejecutó: se registra solo cuando cambia. */
  lastSkip?: SkipCode;
  /**
   * Tx firmada y anotada ANTES de transmitirse. Mientras exista no se firma otra: se
   * retransmiten estos mismos bytes, que solo pueden entrar una vez.
   */
  pendingExecution?: PendingExecution;
  /** Entradas de la bitácora pública que todavía no se pudieron escribir. */
  pendingLog?: AgentLogEntry[];
}

export interface PendingExecution {
  txHash: string;
  signedTx: string;
  at: number;
  units: number;
}

/**
 * Un solo dueño escribe: el proceso del loop, que es también el que da de alta campañas.
 * Quien no tomó el archivo con `acquire` no puede guardar.
 */
export interface CampaignStore {
  list(): CampaignRecord[];
  save(record: CampaignRecord): void;
  /** Toma el archivo, o devuelve false si tiene otro dueño vivo. Repetirlo no cambia nada. */
  acquire(): boolean;
  release(): void;
}

type StoredTerms = Omit<CampaignTerms, "unitPrice" | "fee"> & { unitPrice: string; fee: string };
type StoredRecord = Omit<CampaignRecord, "terms"> & { terms: StoredTerms };

const toStored = (r: CampaignRecord): StoredRecord => ({
  ...r,
  terms: { ...r.terms, unitPrice: r.terms.unitPrice.toString(), fee: r.terms.fee.toString() },
});

// Los montos se convierten campo por campo: un alias nunca puede pasar por un monto.
const fromStored = (r: StoredRecord): CampaignRecord => ({
  ...r,
  terms: { ...r.terms, unitPrice: BigInt(r.terms.unitPrice), fee: BigInt(r.terms.fee) },
});

interface Owner {
  pid: number;
  token: string;
}

/** Dueños vivos de este proceso: un pid reciclado o repetido no alcanza para darlos por vivos. */
const liveTokens = new Set<string>();

function isAlive(owner: Owner): boolean {
  if (owner.pid === process.pid) return liveTokens.has(owner.token);
  try {
    process.kill(owner.pid, 0);
    return true;
  } catch (error) {
    // Ante la duda se considera vivo: mejor frenar que tener dos dueños.
    return (error as NodeJS.ErrnoException).code !== "ESRCH";
  }
}

/** Escribe y baja a disco: un corte de luz no puede dejar el archivo vacío. */
function writeDurable(path: string, content: string): void {
  const fd = openSync(path, "wx");
  try {
    // Con un descriptor, escribe hasta terminar: una escritura parcial no pasa por completa.
    writeFileSync(fd, content);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

export class JsonCampaignStore implements CampaignStore {
  private token: string | undefined;

  constructor(private readonly file: string) {}

  private get ownerFile(): string {
    return `${this.file}.owner`;
  }

  private readOwner(): Owner {
    return JSON.parse(readFileSync(this.ownerFile, "utf8")) as Owner;
  }

  acquire(): boolean {
    if (this.token) return true;
    mkdirSync(dirname(this.file), { recursive: true });
    const token = randomUUID();
    const tmp = `${this.ownerFile}.${token}.tmp`;
    writeDurable(tmp, JSON.stringify({ pid: process.pid, token } satisfies Owner));
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          // Crear un enlace falla si el destino existe: el archivo aparece completo o no aparece.
          linkSync(tmp, this.ownerFile);
          this.token = token;
          liveTokens.add(token);
          return true;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        }
        if (isAlive(this.readOwner()) || !this.removeDeadOwner()) return false;
      }
      return false;
    } finally {
      rmSync(tmp, { force: true });
    }
  }

  /**
   * Dos procesos pueden ver al mismo dueño muerto: uno solo lo saca, y vuelve a mirar antes
   * de hacerlo para no borrar al que recién tomó el archivo. Si un corte deja la carpeta
   * `.takeover`, el loop se frena hasta que alguien la borre: es lo seguro.
   */
  private removeDeadOwner(): boolean {
    const mutex = `${this.ownerFile}.takeover`;
    try {
      mkdirSync(mutex);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") return false;
      throw error;
    }
    try {
      if (existsSync(this.ownerFile) && !isAlive(this.readOwner())) rmSync(this.ownerFile, { force: true });
      return true;
    } finally {
      rmSync(mutex, { recursive: true, force: true });
    }
  }

  release(): void {
    if (!this.token) return;
    if (existsSync(this.ownerFile) && this.readOwner().token === this.token) rmSync(this.ownerFile, { force: true });
    liveTokens.delete(this.token);
    this.token = undefined;
  }

  list(): CampaignRecord[] {
    if (!existsSync(this.file)) return [];
    return (JSON.parse(readFileSync(this.file, "utf8")) as StoredRecord[]).map(fromStored);
  }

  save(record: CampaignRecord): void {
    // Se comprueba en cada guardado: lo que se guarda antes de transmitir también frena el envío.
    if (!this.token || !existsSync(this.ownerFile) || this.readOwner().token !== this.token) {
      throw new Error("Este proceso no está a cargo del archivo de campañas.");
    }
    const others = this.list().filter((r) => r.terms.id !== record.terms.id);
    const tmp = `${this.file}.${randomUUID()}.tmp`;
    try {
      writeDurable(tmp, JSON.stringify([...others, record].map(toStored), null, 2));
      renameSync(tmp, this.file);
    } catch (error) {
      rmSync(tmp, { force: true });
      throw error;
    }
  }
}
