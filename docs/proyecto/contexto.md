# La Vaquita — Contexto para agentes de IA

> Leé esto antes de tocar código o responder sobre el proyecto. Es la fuente de verdad resumida.
> El detalle está en [`docs/investigacion/`](../investigacion/README.md). Si algo acá contradice a otro documento, gana este.
> Las reglas de trabajo del equipo están en [`AGENTS.md`](../../AGENTS.md).
> Estado al 17/10/2026. Rutas de código relativas a `packages/core/src/` salvo que se diga otra cosa.

## 1. Qué es
**La Vaquita** es un agente de IA que organiza juntas, tandas y vacas de grupo en **pesos
digitales (wARS de Ripio) sobre Celo mainnet**. Vive en el chat del grupo (Telegram). Su trabajo:
- cobra los aportes;
- concilia los pagos;
- paga el pozo a quien le toca;
- aplica reglas fijas de mora y de reparto justo frente a la inflación.

Pitch: *"Crédito entre conocidos a la mitad del costo del banco, sin que nadie pierda contra la inflación."*

Hackathon: **Agents on Open Rails** (Celo × Ripio), Track 1 **Stable Agents LatAm**.
**Entrega: lunes 9/11/2026, 09:00 GMT (06:00 ART).** Ganadores: 13/11.

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
Monorepo con npm workspaces: `packages/core` (el scaffold `stable-agent-latam`), `apps/bot` y `apps/web` (vacías).
TypeScript + viem 2.57 + `@celo/attribution-tags@0.5.0` + zod + vitest. **87 tests en verde, sin red.**

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
- Scripts (se corren desde la raíz): `preflight`, `pago:primero` (1 wARS), `identidad:registrar`, `ramp:link`, `tx:verificar`.

**Falta (en orden):**
1. Primer pago real de 1 wARS + `verifyTx` OK. Lo hace el humano con su `.env`.
2. Registro ERC-8004.
3. **Recepción y conciliación de aportes.** Leer eventos `Transfer` de wARS hacia la wallet del agente y asignarlos a miembro y ronda.
4. **Motor de vaquita**: modelo de datos (vaquita, miembros, rondas, aportes, pagos), la fórmula de la junta justa (sección 5) y las reglas de mora.
5. Bot de Telegram + loop del LLM con tool use (`estado`, `cobrar`, `pagar_pozo`, `link_para_cargar`).
6. Página web pública de estado por vaquita.
7. Calificación del agente en la Reputation Registry de ERC-8004 al cerrar el ciclo.

Quién hace qué: [`docs/tareas/`](../tareas/README.md).

## 5. Reglas de negocio (implementar en código, con tests)

### Junta justa (decidido)
Grupo de N miembros, aporte A por ronda, tasa r congelada al crear la vaquita (por defecto, la
última inflación mensual del INDEC, que fue 1,9 % en septiembre de 2026).

```
w_k = (1+r)^(k-1),  k = 1..N
c   = N·A / Σ w_k
pozo_k = c · w_k
```

- Calcular en `bigint` (unidades de 18 decimales). El residuo de redondeo va al último turno.
- **Invariante:** Σ pozo_k = N·A.
- **Fee de La Vaquita:** 1 % del pozo **solo** a los turnos k ≤ floor(N/2). Los demás no pagan.
- Ejemplo (N=10, A=$20.000, r=1,9 %): turno 1 cobra $183.490; turno 10 cobra $217.360. El costo implícito del turno 1 es ≈ 26 % anual, contra un CFT bancario de 58,9 % a 320 %.

### Mora (propuesta, falta confirmar)
- **A. Pozo completo o devolución.** El pozo se paga solo con todos los aportes; si vence el plazo, se devuelve a los que pagaron.
- **B. Fondo de garantía.** Depósito de un aporte al entrar. Cubre faltas; se devuelve al cerrar a quien cumplió. Quien ya cobró y deja de pagar pierde su depósito.
- MVP recomendado: **A + B**.

### Política del agente por vaquita
- Allowlist = miembros de esa vaquita.
- El agente solo puede pagar `pozo_k` al miembro del turno k, en la fecha de la ronda.
- También puede hacer devoluciones (regla A) y devolver garantías al cierre.
- Cualquier otro pago se rechaza.

## 6. Decisiones de producto tomadas
- **Canal: Telegram + web pública.** WhatsApp limita a los asistentes de IA externos desde 01/2026; Zapia tuvo que salir de AR, CO y MX.
- **Moneda inicial: wARS.** wBRL, wCOP y wMXN después.
- **Modos:** junta rotativa + vaca de objetivo en el MVP. Gastos compartidos después.
- **Custodia:** wallet del agente con topes bajos en el MVP. v2: escrow en contrato con el agente como operador.
- **Onboarding:** link de `ramp.ripio.com` con `country=AR&chain=42220&token=WARS&amount=…&address=…`.

Las decisiones nuevas van en [`decisiones.md`](decisiones.md).

## 7. Modelo de negocio (resumen)
- **Usuarios comunes:** usar La Vaquita es gratis. Paga solo quien cobra en la primera mitad (1 % de su pozo), porque obtiene liquidez antes y más barata que un crédito. El organizador no paga.
- **Organizaciones** (cooperativas, mutuales, clubes, empleadores): abono por miembro activo (supuesto: $1.500 por mes). Es el ingreso que sostiene el negocio.
- **Socios:** Ripio (volumen de ramps), marca blanca. Sin ingresos asumidos todavía.

## 8. Restricciones externas
- **Leaderboard:** cuentan **firmantes independientes**, es decir, wallets ajenas, no fondeadas por nosotros y con actividad previa en Celo. Diseñar para que los miembros **firmen** sus aportes.
- **Regulación AR:** custodiar o transferir activos virtuales de terceros cae en la categoría PSAV (RG CNV 1058/2025). Hay una exención de hasta 35.000 UVA por mes (≈ US$44K). Con pozos de $200.000 se alcanza con ~310 grupos. Antes de escalar: escrow no custodial o socio regulado, más asesoramiento legal.
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

En [`docs/proyecto/`](.): este resumen, [stack](stack.md) y [decisiones](decisiones.md).
