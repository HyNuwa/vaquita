# La Vaquita — Contexto para agentes de IA

> Leé esto antes de tocar código o responder sobre el proyecto. Es la fuente de verdad resumida.
> Producto: [spec.md](spec.md). Técnica y estado de cada pieza: [plan-fondo-compartido.md](plan-fondo-compartido.md). Glosario: [`CONTEXT.md`](../../CONTEXT.md).
> Las reglas de trabajo del equipo están en [`AGENTS.md`](../../AGENTS.md). Si algo acá contradice a otro documento, gana este.
> Estado al 4/11/2026, tras [D16](decisiones.md). Rutas de código relativas a `packages/core/src/` salvo que se diga otra cosa.

## 1. Qué es

**La Vaquita** permite que grupos y comunidades administren dinero compartido mediante reglas transparentes, sin depender de una sola persona. Vaqui automatiza operaciones dentro de los permisos que el grupo le concede.

- **Safe** establece el control compartido: tres responsables, dos firmas.
- **Zodiac Roles** limita a Vaqui en cadena.
- **Vaqui** ejecuta pagos programados y prepara propuestas. Nunca es responsable ni dueño del fondo.
- El fondo está en pesos digitales: **wARS de Ripio sobre Celo mainnet**.

No es un banco, un protocolo de inversiones ni un clon de Splitwise. Tampoco un producto de ahorro: un aporte es del grupo.

Es un **prototipo experimental**. Lo que se puede y no se puede afirmar está en [spec.md §6](spec.md#6-qué-garantizamos-y-qué-no).

Hackathon: **Agents on Open Rails** (Celo × Ripio), Track 1 **Stable Agents LatAm**.
**Entrega: lunes 9/11/2026, 09:00 GMT (06:00 ART).** Ganadores: 13/11.

## 2. Reglas duras (nunca romper)

1. **Solo Celo mainnet** (chainId 42220, RPC `https://forno.celo.org`). Testnet solo en pruebas locales.
2. **wFIAT real de Ripio.** Las direcciones salen de `packages/core/src/config/`; **jamás** se inventan ni se escriben de memoria.
3. **Cada tx lleva el tag ERC-8021** (`ATTRIBUTION_CODE`, formato `celo_xxxxxxxx`), agregado en el cliente con `@celo/attribution-tags`. Si falta, la tx no se transmite.
4. **Identidad ERC-8004:** Vaqui, `agentId` 10026.
5. **Gas en stablecoin** con fee abstraction: tx CIP-64 con `feeCurrency`. **wARS no es fee currency.** Vale para la wallet de Vaqui; las personas pagan la comisión desde su billetera (D15.4).
6. **El LLM propone, el código dispone.** Topes, destinatarios, pagos programados y reglas del fondo son código, y los límites de Vaqui se aplican en cadena. El LLM no elige destinatarios ni montos, no paga con una herramienta y no ve direcciones ni claves.
7. **Modo ensayo por defecto.** Plata real solo con `LIVE_PAYMENTS=si-muevo-plata-real`.
8. **Claves solo en `.env` o en secretos del entorno de ejecución**, nunca en el repo, el frontend ni los logs.
9. **Pruebas antes de mainnet.** Toda tx de Vaqui pasa por `chain/tagged-sender.ts`. Excepción (D15.5): las firmas de las personas salen de `apps/web/src/lib/firmar.ts`, con la transacción que arma el core.
10. **UX para no-cripto.** Montos como `$ 1.234,50`, sin "wei", "gas", "calldata", "Safe" ni direcciones en los mensajes. Español rioplatense.
11. **Solo versiones corregidas de Zodiac.** Roles 2.1.0 y Delay 1.1.0 están prohibidas. Antes de conectar fondos se verifican bytecode, mastercopy, Safe y permisos efectivos.
12. **Lo que se comunica coincide con lo implementado.** Un límite fuera de cadena nunca se presenta como garantía en cadena.

## 3. Direcciones verificadas (Celo mainnet)

| Qué | Dirección |
|---|---|
| wARS (18 dec) | `0x0DC4F92879B7670e5f4e4e6e3c801D229129D90D` |
| wBRL / wMXN / wCOP / wPEN / wCLP | ver `packages/core/src/config/tokens.ts` |
| USDC token (6 dec) | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` |
| **USDC adapter (`feeCurrency`)** | `0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B` |
| ERC-8004 Identity Registry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| ERC-8004 Reputation Registry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

Safe y Zodiac: [plan técnico §2](plan-fondo-compartido.md#2-contratos-oficiales), con el estado de su verificación.

En el código, las direcciones se leen **siempre** de `config/`; esta tabla es para leer, no para copiar.

## 4. Estado del repo

Monorepo con npm workspaces: `packages/core`, `apps/web`, `apps/bot` y `contracts`.

**Reutilizable y probado en mainnet:** `chain/tagged-sender.ts` (etiqueta y CIP-64), `attribution/`, `identity/` y la firma desde el celular con MetaMask (`apps/web/src/lib/firmar.ts`).

**Existe, sin probar en este producto:** `policy/`, `ramp/ripio.ts` y la conexión de billetera en `apps/web`.

**En pausa:** `compra/` y `contracts/` (compra colectiva, D16.1) y `junta/` (D11.7). Su evidencia en mainnet está en [`docs/pruebas/spike.md`](../pruebas/spike.md), y no prueba nada de Safe ni de Roles.

**Por hacer:** todo `fondo/`, la web del fondo, el bot y el proceso de Vaqui. Orden y fechas en [control-entrega.md](../tareas/control-entrega.md).

## 5. Reglas de negocio

Completas en [spec.md](spec.md) y [D16](decisiones.md). Las que más condicionan el código:

- **Aprobar:** dos de tres responsables. Dos pueden reemplazar al tercero. Una propuesta pendiente por grupo, como límite de nuestro backend.
- **Cancelar una propuesta:** reemplazo en cadena con el mismo `nonce`. Borrar un registro no cancela nada.
- **Vaqui:** solo `transfer` de wARS a destinatarios definidos, con $ 5.000 por transferencia y $ 20.000 cada 30 días **en cadena**. Peor caso declarado: hasta dos presupuestos seguidos al cruzar la renovación.
- **Pagos programados:** los aprueban dos responsables. La fecha la aplica el scheduler y no es una garantía en cadena.
- **Saldos:** total en cadena, aportes identificados y fondos sin atribución. La cadena es la fuente de verdad.
- **Cuotas:** son una expectativa. Sin cargos, multas ni expulsiones.
- **Salida y disolución:** sin retiro automático. El reparto proporcional es una sugerencia.
- **Límites operativos, no en cadena:** $ 5.000 por aporte desde la interfaz y objetivo de $ 100.000 por grupo.
- **Rechazos de wARS:** no se esquivan y no se reintenta lo que no es transitorio.

## 6. Decisiones de producto tomadas

- **Producto (D16.1):** fondo compartido. Fuera: compras grupales, juntas, Splitwise completo, crédito, reputación, gobernanza general y rendimiento.
- **Piloto (D16.2):** comunidades dev o web3. No es el nicho definitivo.
- **Fondos (D16.19):** primero solo del equipo; después pocas personas invitadas, con su wallet y hasta $ 5.000.
- **Canal:** Telegram + web. WhatsApp limita a los asistentes de IA externos desde 01/2026.
- **Moneda:** wARS.
- **Billetera (D15.2):** RainbowKit y WalletConnect, con Valora primero y MetaMask de respaldo técnico. La billetera invisible queda como aspiración.
- **Nombres (D16.6):** La Vaquita y Vaqui. `@vaquita/*` no se renombra.
- **Onboarding:** link de `ramp.ripio.com` con `country=AR&chain=42220&token=WARS&amount=…&address=…`.

Las decisiones nuevas van en [`decisiones.md`](decisiones.md).

## 7. Modelo de negocio

Sin monetización en la primera versión y sin comisiones artificiales para el pitch (D16.17). Hipótesis futura: suscripción por grupo; falta saber quién pagaría y por qué. Se pregunta en las [entrevistas](../usuarios/guion-entrevistas.md).

## 8. Restricciones externas

- **Puntaje:** según la [página oficial](https://www.loops.house/agents-on-open-rails), se cuenta a quien firma y autoriza, no solo a quien paga el gas. Un usuario independiente es una wallet ajena, no fondeada por nosotros y con actividad en Celo previa al hackathon. Las wallets del equipo no cuentan. La página no menciona multifirmas. El track evalúa: mainnet con wFiat real, uso real de wFiat y de Celo, agente autónomo y útil, UX usable por una persona real, e impacto claro en LatAm.
- **Regulación:** se evalúa antes de operar comercialmente, no en esta etapa (D16.18). No se afirma ninguna exención, y el pitch no promete evitar impuestos.
- **Billeteras:** MiniPay no soporta wFIAT. MetaMask ignora `feeCurrency`. Valora elige la moneda del gas por su cuenta.
- **wARS:** se puede pausar, tiene lista de bloqueo y Ripio lo puede actualizar.

## 9. Verificar antes de asumir

Lista completa y estados en el [plan técnico](plan-fondo-compartido.md). Lo principal:

- [ ] Versiones oficiales de Safe y Roles en Celo: bytecode, mastercopy y checker.
- [ ] `approveHash` y `execTransaction` con etiqueta en un Safe real.
- [ ] Permisos de Roles y todas las pruebas negativas, incluido el cruce de la renovación.
- [ ] ¿Cómo consigue moneda para la comisión quien solo cargó wARS por Ripio?
- [ ] ¿Cómo cobra y retira pesos un destinatario?
- [ ] Etiqueta, wARS y comisión en Valora con WalletConnect.
- [ ] ¿Los grupos reales lo quieren en lugar de una cuenta común?

## 10. Índice de documentos

[`docs/README.md`](../README.md) tiene el mapa completo. Antecedentes: [spec de la compra colectiva](spec-compra-colectiva.md), [plan de la compra colectiva](plan-compra-colectiva.md), [plan de la junta](plan-junta-contrato.md) e [investigación](../investigacion/README.md). Investigación que llevó a D16: [relevamiento del 4/11](../miembros/maximiliano/relevamientos/2026-11-04-fondos-compartidos.md).
