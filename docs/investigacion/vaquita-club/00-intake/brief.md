# Brief — Vaquita Club

**Phase:** 1 Intake (Fast Track)
**Project:** vaquita-club
**Date:** 2026-11-01
**Confidence:** Media (0 entrevistas; comercio y usuarios sin confirmar)

---

## La idea

Grupos de personas, con actividad previa en Celo o nuevas, ahorran wARS para una misma categoría de compra, cada una con su propio saldo. Los comercios financian en un contrato recompensas verificables que mejoran si el grupo alcanza un umbral. Un agente con permisos limitados acompaña al grupo, elige la mejor campaña para cada persona y ejecuta la compra cuando se cumple la meta.

## Objetivo

1. Ganar el track Stable Agents: LatAm (primer puesto US$1.500, segundo US$500) [Data, página oficial].
2. Diseñar el desafío real para que deje datos de validación.

Todo lo que no suma a los cinco criterios del track se recorta: funciona en mainnet con wFIAT real, usa de verdad wFIAT y el stack de Celo, agente autónomo y útil, una persona real puede usarlo, impacto claro para LatAm.

## Decisiones del fundador

| # | Decisión | Nota |
|---|---|---|
| 1 | Se arranca de cero | App, contrato y agente se escriben esta semana. En el repo solo existe `packages/core` |
| 2 | Un solo contrato: `VaquitaClub.sol` | Ahorro, campañas, mandato y canje |
| 3 | Mandato onchain con transacción propia del usuario | Reemplaza la firma EIP-712. El usuario queda como firmante de una transacción etiquetada |
| 4 | Producto digital de entrega inmediata, solo wARS | Usuarios en cualquier país; canje dentro de las 48 horas |
| 5 | 2 o 3 campañas que compiten | El agente elige, reasigna si una se agota y decide cuándo canjear |
| 6 | Usuarios mixtos | Actividad previa en Celo para la métrica; usuarios nuevos para el jurado. Filtro prudente: anterior al 6/10 |

## Ahorro social conectado con la compra (aceptado el 2026-11-01)

1. **Bono obligatorio.** Si hay atraso, se recortan primero el x402 y el chat. El bono grupal no se recorta.
2. **Grupos con meta común.** Cada desafío reúne a personas que ahorran para la misma categoría, cada una con su propio saldo.
3. **Recompensa atada al grupo.** La campaña paga una parte base a quien cumple y un extra si el grupo llega al umbral (ejemplo ficticio: 3% + 2%).
4. **Agente que trabaja con el grupo.** Avisa cuánto falta para el umbral, calcula el aporte que le falta a cada persona y tiene en cuenta el estado del grupo al elegir campaña.
5. **Demanda visible para el comercio.** La página de métricas muestra cuánta gente ahorra para su categoría y con qué presupuesto, sin x402.

## Limitaciones aceptadas

- No se demuestra que ahorrar en grupo funcione mejor que hacerlo solo: 48 horas y unas 15 personas no alcanzan. Se presenta como mecanismo demostrado.
- En 48 horas la gente probablemente deposite casi todo de una vez, así que tampoco se demuestra un hábito de ahorro.
- La recompensa es chica: se demuestra el mecanismo, no la demanda.
- Si el comercio no paga, el plan B no demuestra la tesis, y se declara así.
- No se compite por rendimiento con Naranja X.
- "Sin custodia" sigue siendo una hipótesis; la revisión legal queda para antes de ser startup.

## Criterio para abandonar

Si ningún comercio o creador acepta financiar una recompensa, ni siquiera chica, la tesis central no se sostiene.

## Ajustes al diseño detectados en este intake

1. **El mandato no puede atarse a una sola campaña.** `authorize(campaña, montoMax, vencimiento)` impide reasignar si la campaña se agota. Tiene que autorizar un conjunto: categoría o lista de campañas, monto máximo y vencimiento.
2. **Las campañas tienen que ser sustituibles.** El agente solo elige de verdad si las opciones cubren la misma meta. Eso pide 2 creadores de una misma categoría, o 1 creador más 1 campaña del equipo declarada como tal. Varias campañas inventadas para un mismo comercio se notarían.
3. **Se elimina `reserve()`.** Si la recompensa se paga en el canje, hay menos estados y menos riesgo. Agotarse una campaña pasa a ser el caso real de reasignación.
4. **Depósito y mandato en una sola función.** Quedan 2 transacciones por usuario (approve y `depositAndAuthorize`) en lugar de 3.
5. **Falta definir la entrega.** El pago es onchain y el producto digital se entrega afuera. Hay que decidir cómo recibe la persona el producto después del canje.
6. **El extra grupal se liquida al cierre.** Propuesta: la parte base se aplica en el canje y el extra se paga al cerrar el desafío a quienes cumplieron, para que nadie tenga que esperar al grupo para comprar.

## Hechos verificados

- wARS: dirección de la página oficial igual a `packages/core/src/config/tokens.ts`; 18 decimales [Data].
- El ERC-8004 es obligatorio en todos los tracks y la etiqueta no se puede agregar después [Data].
- Cuentan firmantes y autorizantes; el gas pagado por un relayer no suma como contribución [Data].
- **Cafecito integra wARS en Base, no en Celo**, mediante Amplify de Ripio [Data, iProUP y CriptoNoticias]. No sirve como rieles de pago de la demo: solo como pista para encontrar creadores que ya conozcan wARS. Hay que confirmar que el creador pueda cobrar en una billetera propia en Celo.
- En esta computadora no hay `.env`, así que acá no hay código de atribución. Eso no descarta que esté en otra máquina.

## Pendientes del fundador

- [ ] ¿Ya se registraron en el hackathon? ¿Tienen código `celo_...`? ¿Está registrado el ERC-8004?
- [ ] Nombres de comercios o creadores y si ya hablaron con alguno.
- [ ] Cantidad de personas ajenas al equipo, con actividad en Celo anterior al 6/10, que se pueden nombrar hoy.

---

## Flags

**Red Flags:**
- Comercio y usuarios siguen sin confirmar, a 8 días de la entrega.

**Yellow Flags:**
- App, contrato y agente de cero en una semana, con plata real y sin auditoría.
- 0 entrevistas con clientes.
- Registro y código de atribución sin confirmar.

## Sources
- [Agents on Open Rails, página oficial](https://www.loops.house/agents-on-open-rails/) (Tier 1)
- [iProUP, Cafecito integra el peso cripto de Ripio](https://www.iproup.com/economia-digital/66859-cafecito-integra-el-peso-cripto-de-ripio-aplicacion) (Tier 2)
- [CriptoNoticias, Cafecito integra wARS](https://www.criptonoticias.com/comunidad/cafecito-integra-stablecoin-wars-app/) (Tier 2)
