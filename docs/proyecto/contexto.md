# La Vaquita — Contexto para agentes de IA

> Leé esto antes de tocar código o responder sobre el proyecto. Es la fuente de verdad resumida.
> El detalle está en [`docs/investigacion/`](../investigacion/README.md). Si algo acá contradice a otro documento, gana este.
> Las reglas de trabajo del equipo están en [`AGENTS.md`](../../AGENTS.md).
> Estado al 24/10/2026. Rutas de código relativas a `packages/core/src/` salvo que se diga otra cosa.

## 1. Qué es
**La Vaquita** es un agente de IA que organiza juntas (tandas, ruedas) en **pesos digitales
(wARS de Ripio) sobre Celo mainnet**. Vive en el chat del grupo (Telegram) y tiene una web por junta.
- Ayuda al grupo a acordar las reglas y el orden de turnos, y explica qué compromete cada turno.
- Cada miembro le paga directo al que cobra esa ronda, a través de un contrato de reglas que **nunca guarda plata**.
- Registra cada obligación y cada pago, avisa los atrasos y muestra qué se pagó y qué sigue pendiente.

Promesa: *"Reglas claras, turnos justos y riesgos transparentes"* (provisional). No prometemos que nadie pierda: una junta es un crédito entre conocidos y tiene riesgo.

Hackathon: **Agents on Open Rails** (Celo × Ripio), Track 1 **Stable Agents LatAm**.
**Entrega: lunes 9/11/2026, 09:00 GMT (06:00 ART).** Ganadores: 13/11.

Diseño completo: [plan-junta-contrato.md](plan-junta-contrato.md). Decisiones del 24/10: [decisiones.md](decisiones.md).

## 2. Reglas duras (nunca romper)
1. **Solo Celo mainnet** (chainId 42220, RPC `https://forno.celo.org`). Testnet solo en pruebas locales.
2. **wFIAT real de Ripio.** Las direcciones salen de `packages/core/src/config/tokens.ts`; **jamás** se inventan ni se escriben de memoria.
3. **Cada tx lleva el tag ERC-8021** (`ATTRIBUTION_CODE`, formato `celo_xxxxxxxx`), agregado en el cliente con `@celo/attribution-tags`. Si falta, la tx no se transmite.
4. **Identidad ERC-8004** registrada desde la wallet del agente, antes del 9/11.
5. **Gas en stablecoin** con fee abstraction: tx CIP-64 con `feeCurrency` = adapter de USDC. **wARS no es fee currency.**
6. **El LLM propone, el código dispone.** Topes, presupuestos, destinatarios, montos de pozo, orden de turnos y reglas de mora son código determinístico. El LLM nunca ve direcciones: solo alias.
7. **Modo ensayo por defecto.** Plata real solo con `LIVE_PAYMENTS=si-muevo-plata-real`.
8. **Claves solo en `.env`**, nunca en el repo ni en logs.
9. **Tests antes de mainnet.** Toda tx pasa por `packages/core/src/chain/tagged-sender.ts`; no llamar `sendTransaction` ni `writeContract` directo.
10. **UX para no-cripto.** Montos en moneda local (`$ 1.234,50`), sin "wei", "gas", "calldata" ni direcciones en los mensajes al usuario. Español rioplatense.

## 3. Direcciones verificadas (Celo mainnet)
| Qué | Dirección |
|---|---|
| wARS (18 dec) | `0x0DC4F92879B7670e5f4e4e6e3c801D229129D90D` |
| wBRL / wMXN / wCOP / wPEN / wCLP | ver `packages/core/src/config/tokens.ts` |
| USDC token (6 dec) | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` |
| **USDC adapter (`feeCurrency`)** | `0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B` |
| ERC-8004 Identity Registry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| ERC-8004 Reputation Registry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

En el código, las direcciones se leen **siempre** de `tokens.ts` y `network.ts`; esta tabla es para leer, no para copiar.

## 4. Estado del repo
Monorepo con npm workspaces: `packages/core` (el scaffold `stable-agent-latam` más el motor de la junta), `apps/bot` y `apps/web` (vacías). `apps/api` se suma como capa fina (HTTP, base y jobs) que importa del core.
TypeScript + viem 2.57 + `@celo/attribution-tags@0.5.0` + zod + vitest. **131 tests en verde, sin red.**

**Ya hecho** (en `packages/core/src/`):
- `chain/tagged-sender.ts`: el único camino a la red.
  1. Verifica chainId.
  2. Agrega el tag al calldata.
  3. Estima gas con `feeCurrency`.
  4. Controla tope y saldo de gas.
  5. Firma CIP-64.
  6. **Parsea la tx firmada** y re-verifica tag, chainId, `feeCurrency` y destino.
  7. En ensayo, devuelve la tx firmada; en real, la transmite, espera el recibo y la verifica con `verifyTx`.
- `payments/pay.ts`: pago wARS de punta a punta, con política, chequeo de `symbol()`/`decimals()` on-chain y saldo.
- `policy/engine.ts` (puro) + `policy/ledger.ts`: presupuesto diario en hora de Buenos Aires; reserva antes de transmitir.
- `config/policy.ts`: límites congelados (wARS: $5.000 por pago, $20.000 por día, 20 pagos por día; gas ≤ 0,05 USD por tx).
- `config/paths.ts`: `.env` y ledger únicos en la raíz del repo, para todas las apps y scripts.
- `agent/tools.ts`: herramienta `pagar` para el LLM, con destinatario como enum de alias y zod `.strict()`.
- `identity/erc8004.ts` + `packages/core/scripts/register-agent.ts`. `ramp/ripio.ts` arma links de `ramp.ripio.com`.
- `junta/`: el motor. Reglas de la junta clásica, una obligación por miembro y ronda, pagos idempotentes por hash + índice de log, pagos tardíos, estado de ronda (cerrada por fecha y saldada), suspensión, compromisos por turno y buscador de órdenes de turno.
- Scripts (se corren desde la raíz): `preflight`, `pago:primero` (1 wARS), `identidad:registrar`, `ramp:link`, `tx:verificar`.

**Falta (en orden):**
1. Primer pago real de 1 wARS + `verifyTx` OK, y registro ERC-8004.
2. **Spike del contrato de reglas** (condición de D7): pagos en wARS, autorización por aporte, `transferFrom`, tag desde el móvil y conciliación. Si falla, `DIRECT_P2P`.
3. Contrato `JuntaReglas` (o `DIRECT_P2P`) y **lector de eventos** que le pasa cada pago al motor.
4. Escenarios de incumplimiento y persistencia del motor.
5. Bot de Telegram + loop del LLM con tool use (`estado`, `explicar_reglas`, `proponer_junta`, `negociar_turnos`, `alertar_atraso`).
6. Web de la junta (`/j/:slug`): turnos, obligaciones y estado de cada ronda.
7. Calificación del agente en la Reputation Registry de ERC-8004 al cerrar el ciclo.

Quién hace qué: [`docs/tareas/`](../tareas/README.md).

## 5. Reglas de negocio (implementar en código, con tests)

### Junta clásica con cuota fija (D10, decidido)
Grupo de N miembros (sin máximo en el código; el piloto usa de 4 a 8), aporte A por ronda. En la ronda k cobra el miembro del turno k y le paga cada uno de los otros: **pozo = (N − 1) · A**. Montos en `bigint` (unidades de 18 decimales).

- El turno k adelanta (k − 1)·A antes de cobrar y sigue debiendo (N − k)·A después. Son compromisos nominales, no predicciones de pérdida.
- **Orden de turnos:** cada miembro dice cuánto puede adelantar; el motor lista los órdenes que respetan esos límites y el grupo aprueba uno. Si ninguno sirve, propone el mayor aporte viable.
- Precio por turno, comisión y licitaciones: **fuera del MVP**, después de la revisión legal (RG IGJ 8/2015). La fórmula de la "junta justa" queda en [investigación 15](../investigacion/15-que-cambia-con-la-vaquita.md) como antecedente.

### Obligaciones y pagos
- El motor registra deudas, no solo pagos: un pago cumple una obligación (junta, ronda, deudor). Así una deuda vencida nunca se confunde con un pago.
- Un pago tardío cumple la obligación original y guarda los días de atraso. Las rondas se pueden superponer.
- Todo pago que no coincide exacto con una obligación va a revisión; nada se reparte ni se adivina.

### Mora (D2, decidido)
- **Sin garantías ni compensación automática en el MVP.** Obligaciones registradas, pagos verificables y escenarios de incumplimiento explicados antes de entrar.
- Continuar, suspender o terminar con deudas pendientes lo decide el grupo con la política que aceptó al crear la junta. Si se suspende, se anulan las rondas futuras.
- La compensación queda como prototipo en simulación.

## 6. Decisiones de producto tomadas
- **Canal: Telegram + web por junta.** WhatsApp limita a los asistentes de IA externos desde 01/2026; Zapia tuvo que salir de AR, CO y MX.
- **Moneda inicial: wARS.** wBRL, wCOP y wMXN después.
- **Alcance: solo juntas.** La vaca de objetivo y los gastos compartidos van a la hoja de ruta.
- **Sin custodia (D7):** contrato de reglas que nunca guarda plata; cada aporte va del miembro al que cobra en la misma tx. La wallet del agente solo firma pagos técnicos y el registro ERC-8004. Plan B: `DIRECT_P2P`.
- **Aportes de personas ajenas al equipo:** solo después de resolver lo financiero, la seguridad y lo legal pendiente; hasta entonces, la junta exprés del equipo.
- **Nombre:** La Vaquita (D6), aclarando en el pitch la diferencia con vaquita.fi y VaquitaAI.
- **Onboarding:** link de `ramp.ripio.com` con `country=AR&chain=42220&token=WARS&amount=…&address=…`.

Las decisiones nuevas van en [`decisiones.md`](decisiones.md).

## 7. Modelo de negocio (hipótesis)
- **Usuarios comunes:** gratis.
- **Organizaciones** (cooperativas, mutuales, clubes, empleadores): abono por miembro activo (supuesto: $1.500 por mes).
- **Precio por turno temprano:** bloqueado por revisión legal (D10); no está en el MVP.
- **Socios:** Ripio (volumen de ramps), marca blanca. Sin ingresos asumidos todavía.

## 8. Restricciones externas
- **Leaderboard:** cuentan **firmantes independientes**, es decir, wallets ajenas, no fondeadas por nosotros y con actividad previa en Celo. Por eso cada miembro **firma** su propio aporte.
- **Regulación AR:** custodiar o transferir activos virtuales de terceros cae en la categoría PSAV (RG CNV 1058/2025). Hay una exención de hasta 35.000 UVA por mes (≈ US$44K). Con pozos de $200.000 se alcanza con ~310 grupos. El contrato de reglas no custodia, pero antes de escalar hace falta asesoramiento legal.
- **MiniPay no soporta wFIAT.** MetaMask ignora `feeCurrency`. Valora elige la moneda del gas por su cuenta.
- **x402:** el facilitador de Celo acepta wARS, wBRL y wCOP vía Permit2. Esas tx no llevan tag; se informa la wallet PayTo.

## 9. Verificar antes de asumir
- [ ] ¿wARS implementa `permit` (EIP-2612)? Afecta cómo firman los miembros.
- [ ] ¿Qué wallet para no-cripto firma CIP-64 con wARS? Probar Valora y Para.
- [ ] ¿El tag sobrevive con wallets embebidas o smart accounts? Comprobar con `verifyTx`.
- [ ] Parámetro `token` de ramp.ripio.com distinto de WARS.

## 10. Índice de documentos
En [`docs/investigacion/`](../investigacion/README.md):
[01 hackathon](../investigacion/01-hackathon.md) · [02 requisitos](../investigacion/02-requisitos.md) ·
[03 Celo](../investigacion/03-celo.md) · [04 Ripio y wFIAT](../investigacion/04-ripio-wfiat.md) ·
[05 stack y recursos](../investigacion/05-stack-recursos.md) · [06 principios de diseño](../investigacion/06-principios-diseno.md) ·
[07 prompt base](../investigacion/07-prompt-base.md) · [08 brainstorming](../investigacion/08-brainstorming.md) ·
[09 próximos pasos](../investigacion/09-proximos-pasos.md) · [10 scaffold](../investigacion/10-scaffold-stable-agent.md) ·
[11 ideas](../investigacion/11-ideas.md) · [12 Mesada](../investigacion/12-idea-mesada.md) ·
[13 benchmark](../investigacion/13-vaquita-benchmark-y-mejoras.md) · [14 modelo de negocio](../investigacion/14-vaquita-modelo-de-negocio.md) ·
[15 qué cambia + junta justa](../investigacion/15-que-cambia-con-la-vaquita.md).

En [`docs/proyecto/`](.): este resumen, [stack](stack.md), [decisiones](decisiones.md), [plan del equipo](plan-del-equipo.md), [plan técnico](plan-tecnico.md), [repositorio y entrega](repositorio-y-entrega.md) y [plan de la junta con contrato de reglas](plan-junta-contrato.md).
