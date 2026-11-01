# La Vaquita — Contexto para agentes de IA

> Leé esto antes de tocar código o responder sobre el proyecto. Es la fuente de verdad resumida.
> El detalle está en [`docs/investigacion/`](../investigacion/README.md). Si algo acá contradice a otro documento, gana este.
> Las reglas de trabajo del equipo están en [`AGENTS.md`](../../AGENTS.md).
> Estado al 25/10/2026. Rutas de código relativas a `packages/core/src/` salvo que se diga otra cosa.

## 1. Qué es
**La Vaquita** (nombre de trabajo) es un agente de IA que organiza **compras colectivas por intención**, en pesos digitales **wARS de Ripio sobre Celo mainnet**. Vive en Telegram y tiene una web por campaña.
- Una comunidad de desarrolladores de Jujuy publica una necesidad de bienes digitales o servicios; el agente prepara y compara cotizaciones y la comunidad vota una oferta.
- Cada comprador firma su compromiso en cadena y autoriza el importe exacto. La plata queda en su wallet hasta la ejecución.
- Si se alcanza el cupo, el contrato cobra y transfiere directo al proveedor en una sola transacción. Si no alcanza el mínimo, revierte todo. Registra compras y cancelaciones; nunca guarda aportes.

Promesa (D11): *"Un agente que junta la demanda de comunidades tech de LatAm, consigue que los proveedores compitan y ejecuta la compra en wARS sin custodiar la plata."* El compromiso no reserva fondos y el pago no garantiza entrega. wARS es pausable, tiene lista de bloqueo y es actualizable por Ripio.

Hackathon: **Agents on Open Rails** (Celo × Ripio), Track 1 **Stable Agents LatAm**.
**Entrega: lunes 9/11/2026, 09:00 GMT (06:00 ART).** Ganadores: 13/11.

Diseño completo: [plan-compra-colectiva.md](plan-compra-colectiva.md). Especificación: [D11 del 25/10](decisiones.md). El motor de juntas queda en pausa (D11.7).

## 2. Reglas duras (nunca romper)
1. **Solo Celo mainnet** (chainId 42220, RPC `https://forno.celo.org`). Testnet solo en pruebas locales.
2. **wFIAT real de Ripio.** Las direcciones salen de `packages/core/src/config/tokens.ts`; **jamás** se inventan ni se escriben de memoria.
3. **Cada tx lleva el tag ERC-8021** (`ATTRIBUTION_CODE`, formato `celo_xxxxxxxx`), agregado en el cliente con `@celo/attribution-tags`. Si falta, la tx no se transmite.
4. **Identidad ERC-8004** registrada desde la wallet del agente, antes del 9/11.
5. **Gas en stablecoin** con fee abstraction: tx CIP-64 con `feeCurrency` = adapter de USDC. **wARS no es fee currency.**
6. **El LLM propone, el código dispone.** Topes, presupuestos, destinatarios, montos de pozo, orden de turnos, reglas de mora y reglas de campaña (cupo, selección, topes, ejecución) son código determinístico. El LLM nunca ve direcciones: solo alias.
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

El motor `junta/` y sus tests se conservan **en pausa por D11.7**; salen del recorrido de la demo. Los 131 tests son el estado registrado, no una validación del contrato de compra, que todavía falta crear.

**Falta (en orden, desde D12 todo a cargo de Maxi):** las puertas P0 a P6 de [control-entrega.md](../tareas/control-entrega.md).
1. **P0, 2/11:** producto final, inscripción, código de atribución y `.env`.
2. **P1, 3/11:** primer pago con `verifyTx`, registro ERC-8004 y spike: wARS, autorización exacta, `transferFrom`, etiqueta desde el celular y conciliación.
3. **P2, 4/11:** `CompraColectiva` y fábrica, si pasa el spike; Foundry con fuzzing e invariantes; segunda revisión; pedidos de E1 enviados.
4. **P3, 5/11:** módulo `compra/`, lector de eventos y web `/c/:slug`. E1 corta a las 12:00.
5. **P4, 6/11:** despliegue en mainnet, agente mínimo y campaña del equipo con plata real.
6. **P5, 7/11:** campaña chica con terceros bajo D11.5 y código congelado. Sin ofertas en E1, campaña del equipo con proveedor amigo; se declara en el pitch.
7. **P6, 8/11:** evidencias, pitch, video y formulario; envío antes de las 20:00 ART. Cierre: 9/11, 09:00 GMT.

Si falla el spike: compromisos y transferencias P2P directas registrados por el agente, sin ejecución atómica. Este plan B pierde la prueba del profesor; no se presenta como equivalente. Detalle en el [plan vigente](plan-compra-colectiva.md).

Quién hace qué: [`docs/tareas/`](../tareas/README.md).

## 5. Reglas de negocio (implementar en código, con tests)

### Campañas de compra colectiva (D11)
- Solo bienes digitales y servicios para comunidades dev de Jujuy. Oferta escrita, voto de la comunidad y proveedor verificado antes de crear; el agente no elige proveedor.
- Token, proveedor, precio unitario, mínimo y máximo de unidades, fecha límite, tope por comprador, cargo opcional y su destinatario, y lista acotada de compradores quedan fijados al crear. Fábrica y campañas sin admin ni actualizaciones.
- Una unidad y una adhesión por comprador en el MVP. La fábrica fija **$ 5.000 por compromiso**, incluido cargo (D11.5); subirlo requiere nueva decisión. Montos en `bigint`, con 18 decimales.
- Cada comprador firma `comprometer()` con `approve` exacto previo o `permit` en la misma tx. Nunca alcanza un `permit` fuera de cadena. La autorización no reserva fondos.
- `cancelarCompromiso()` es irreversible para esa adhesión. Gastar saldo o revocar autorización no cancela; recargar puede volver a habilitar el cobro si no se canceló.
- `ejecutar()` es pública, antes del límite y una sola vez: selección por orden inmutable de la lista hasta el máximo; solo se saltea cancelación o insuficiencia comprobada de saldo o autorización. Cualquier otro error del token revierte todo, incluido el cargo. La autorización insuficiente es la aclaración del pedido y del debate §1 sobre D11.4.
- Transferencia directa comprador→proveedor y, si corresponde, al destinatario del cargo; el contrato no acumula aportes. Sin mínimo, no paga nadie. Estados: abierta, ejecutada y vencida; `vencer()` desde el límite, sin reembolsos porque no hubo depósito.
- Foundry, `SafeERC20`, `nonReentrant`, segunda revisión (D12.3) y peor caso de gas medido antes de mainnet. El progreso informa compromisos con fondos **ahora**, no reservas ni entrega garantizada.

### Juntas (en pausa, D11.7)
- Se conserva el motor y sus tests. D10: junta clásica con cuota fija A, N miembros, **pozo = (N − 1) · A**; turnos acordados según cuánto puede adelantar cada miembro.
- Obligaciones por miembro y ronda, pagos tardíos asignados a la deuda original, rondas superpuestas y revisión de pagos que no coinciden. Sin doble conteo.
- D2: sin garantías ni compensación automática; el grupo decide continuar, suspender o terminar. Al suspender se anulan rondas futuras; la compensación queda en simulación.
- Precio por turno y licitaciones siguen fuera, sujetos a revisión legal. Solo se muestra si sobra tiempo, sin usuarios reales; no integra la demo principal.

## 6. Decisiones de producto tomadas
- **Canal: Telegram + web por campaña.** WhatsApp limita a los asistentes de IA externos desde 01/2026; Zapia tuvo que salir de AR, CO y MX.
- **Moneda inicial: wARS.** wBRL, wCOP y wMXN después.
- **Alcance (D11.1–2): compra colectiva por intención**, solo digital y servicios. Juntas en pausa; bienes físicos, tesorerías y gastos compartidos fuera del MVP.
- **Sin custodia (D11.3, reemplaza D7):** compromiso sin depósito y compra atómica; cobra directo de compradores al proveedor. El agente solo envía `ejecutar()` y registro ERC-8004, por `tagged-sender.ts`; nunca firma por un comprador. Sigue vigente el spike original.
- **Aportes de personas ajenas al equipo (D11.5):** contrato con tests y revisión, montos chicos y riesgos explicados por escrito. No equivale a una exclusión regulatoria; las preguntas legales siguen abiertas.
- **Nombre (D6 reabierta):** se recomienda cambiar el comercial por colisiones; se decide el **27/10**. Hasta entonces La Vaquita es nombre de trabajo. `@vaquita/*` no se renombra antes del 9/11.
- **Onboarding:** link de `ramp.ripio.com` con `country=AR&chain=42220&token=WARS&amount=…&address=…`.

Las decisiones nuevas van en [`decisiones.md`](decisiones.md).

## 7. Modelo de negocio (hipótesis)
- **D11.8:** comisión del proveedor por la demanda acercada; hipótesis de **10–15% en digital**, a validar en E1.
- **Alternativa:** cargo visible, opcional, fijado al crear la campaña e inmutable, con destinatario y total aceptados por los compradores.
- No hay ingresos validados. Medir aceptación del proveedor y ahorro neto frente a compra directa. El abono por miembro y el precio por turno dejan de ser el modelo del MVP.

## 8. Restricciones externas
- **Leaderboard:** cuentan **firmantes independientes**, es decir, wallets ajenas, no fondeadas por nosotros y con actividad previa en Celo. Cada comprador **firma su propio `comprometer()` en cadena**, con tag, para contar como firmante independiente si cumple esos criterios. Firmar solo un `permit` fuera de cadena no alcanza; N wallets no prueban N personas.
- **Regulación AR:** no depositar fondos no excluye automáticamente transferencia o administración por cuenta de terceros. La consulta CNV, IGJ, consumo y entrega queda abierta; el [debate jurídico](../investigacion/la-vaquita-2/fast-track/debate-ronda-3.md#2-jurídico-mejor-argumento-ninguna-exclusión-automática) reemplaza la extrapolación anterior por pozos de juntas, sin afirmar una exención aplicable al producto.
- **MiniPay no soporta wFIAT.** MetaMask ignora `feeCurrency`. Valora elige la moneda del gas por su cuenta.
- **x402:** el facilitador de Celo acepta wARS, wBRL y wCOP vía Permit2. Esas tx no llevan tag; se informa la wallet PayTo.

## 9. Verificar antes de asumir
- [x] ¿wARS implementa `permit` (EIP-2612)? El ABI verificado expone `permit`, pausa y lista de bloqueo, según [debate, ronda 3 §1](../investigacion/la-vaquita-2/fast-track/debate-ronda-3.md#1-técnico-atomicidad-no-garantiza-ejecución); el token es actualizable. Respondido a nivel de interfaz, no de funcionamiento real.
- [ ] Probar `permit` con una firma real: dominio, nonce, vencimiento y autorización exacta en el spike.
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
[15 qué cambia + junta justa](../investigacion/15-que-cambia-con-la-vaquita.md) ·
[La Vaquita 2: investigación y versiones](../investigacion/la-vaquita-2/README.md) (antecedentes; el alcance vigente es D11).

En [`docs/proyecto/`](.): este resumen, [plan de compra colectiva (vigente)](plan-compra-colectiva.md), [stack](stack.md), [decisiones](decisiones.md), [plan del equipo](plan-del-equipo.md), [plan técnico](plan-tecnico.md), [repositorio y entrega](repositorio-y-entrega.md) y [plan de la junta con contrato de reglas (en pausa)](plan-junta-contrato.md). Los planes anteriores conservan su cuerpo como antecedente; sus avisos D11 indican qué sigue vigente.
