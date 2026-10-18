import { z } from "zod";
import type { PayRequest } from "../payments/pay.js";

/**
 * Superficie que ve el LLM. Decide QUÉ hacer, pero:
 *  - el destinatario es un alias de un enum cerrado (nunca una dirección),
 *  - el monto es un string canónico en moneda local,
 *  - no hay campos de red, gas, token address ni límites,
 *  - el resultado siempre pasa por pay() → policy → tagged-sender.
 *
 * Formato compatible con tool use de la API de Claude (name/description/input_schema).
 */

export function pagarToolSchema(aliases: readonly string[]) {
  return {
    name: "pagar",
    description:
      "Propone enviar pesos argentinos (wARS) a un contacto guardado. El sistema valida límites " +
      "y destinatarios; si algo no cumple, el pago se rechaza y recibís el motivo. " +
      "Por defecto corre en modo ensayo y no mueve dinero.",
    input_schema: {
      type: "object" as const,
      properties: {
        destinatario: { type: "string" as const, enum: [...aliases], description: "Alias del contacto" },
        monto: {
          type: "string" as const,
          pattern: "^(0|[1-9]\\d{0,14})(\\.\\d{1,2})?$",
          description: 'Monto en pesos, con punto decimal. Ej: "1500.50"',
        },
        motivo: { type: "string" as const, maxLength: 140, description: "Para qué es el pago" },
      },
      required: ["destinatario", "monto", "motivo"],
      additionalProperties: false,
    },
  };
}

export function parsePagarInput(input: unknown, aliases: readonly string[]): PayRequest {
  if (aliases.length === 0) throw new Error("No hay destinatarios configurados.");
  const schema = z
    .object({
      destinatario: z.enum(aliases as [string, ...string[]]),
      monto: z.string().regex(/^(0|[1-9]\d{0,14})(\.\d{1,2})?$/),
      motivo: z.string().max(140),
    })
    .strict();
  const p = schema.parse(input);
  return { token: "wARS", recipient: p.destinatario, amount: p.monto, reason: p.motivo };
}
