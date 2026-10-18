# 11 · Ideas para el Track 1 (Stable Agents: LatAm)

Sesión del 17/10/2026. Track elegido: **T1 · Stable Agents: LatAm**.

> **Decisión:** el equipo eligió la **idea E · Mesada**. Desarrollo completo en [12-idea-mesada.md](12-idea-mesada.md).

## Restricciones que filtran las ideas

Salen de Celopedia (`.claude/skills/celopedia-skill/references/`) y de la página del hackathon:

| Hecho | Consecuencia para la idea |
| --- | --- |
| **MiniPay no soporta wFIAT** (solo USDT, USDC, USDm) | No construir la idea sobre MiniPay. El canal tiene que ser Telegram, WhatsApp o web |
| **x402 en Celo** liquida wARS, wBRL y wCOP (vía Permit2). wMXN y wPEN todavía no | x402 sirve con pesos y reales; no con soles ni pesos mexicanos |
| **Las liquidaciones x402 no llevan tag ERC-8021** (en su lugar se declara la wallet PayTo) | El volumen que "cuenta" tiene que salir de transferencias propias con tag. x402 suma como complemento, no como núcleo |
| **Cruce entre monedas:** Textile FX tiene wARS y wBRL contra USD₮ (~US$ 860K TVL). La profundidad de los pools en Uniswap es variable | wARS→wBRL pasa por USD₮ onchain. Hay riesgo de liquidez: cotizar contra una referencia externa antes de ejecutar |
| **Ripio Ramp por URL** pone wFIAT en cualquier dirección sin credenciales nuestras | El que paga no necesita saber de cripto: paga con transferencia en Ripio y el wFIAT llega a la wallet indicada |
| El scaffold ya resuelve pagos wARS con tag, límites y dry-run | Conviene una idea cuyo núcleo sea **mover wARS entre partes conocidas** |
| Criterios: mainnet, stack, **autonomía**, UX, impacto + usuarios reales antes del 9/11 | El agente tiene que actuar solo ante un disparador (entra un pago, llega una fecha), no solo cuando le escriben |

### Ideas que sugiere Ripio para este track

Pay-per-call en pesos o reales con x402 · nómina, pagos a freelancers y suscripciones en moneda local · transferencias entre monedas LatAm (wBRL↔wARS) · agentes de comercio que facturan, cobran y concilian · ahorro y presupuesto para hogares · flujos de pago de consumo.

---

## Idea A · "Cobrador" para comercios chicos y artesanos

**Para quién:** artesano de feria en Purmamarca, dueño de un kiosco o alguien que cobra alquileres o cuotas (club, cooperativa, profe particular).

**Dolor:** perseguir pagos por WhatsApp, anotar quién pagó, conciliar a mano y pagar comisiones de QR o POS.

**Qué hace el agente solo:**
1. El comerciante le dice por Telegram "cobrale $8.000 a Juan por la cuota de octubre".
2. El agente arma el link de Ripio Ramp (`amount`, `address` = wallet del comercio) y se lo manda a Juan.
3. Vigila la wallet. Cuando entra el pago, **concilia**: marca la cuota como pagada y le avisa a los dos.
4. Si no entra a tiempo, **manda recordatorios** con su propio criterio (tono, frecuencia).
5. Apenas entra un cobro, **reparte** según reglas del comercio, con tx propias con tag: un % a una wallet de ahorro, la parte del socio, el pago al proveedor.

**wFIAT y stack:** wARS (wBRL/wCOP para extender). Tag en cada reparto. ERC-8004. Gas en USDC. x402 opcional: exponer "estado de cuenta" como API paga.

**Riesgos:**
- El pagador tiene que hacer el flujo de Ripio (posible KYC del lado de Ripio): **verificar la fricción real**.
- El pago entrante lo hace Ripio, no lleva nuestro tag. Las tx con tag son los repartos.

**Usuarios reales antes del 9/11:** 2 o 3 comerciantes o un club conocido, con cobros chicos.

---

## Idea B · "Pagador" para cooperativas y pymes

**Para quién:** cooperativa de productores, emprendimiento con freelancers o comercio con proveedores fijos.

**Dolor:** pagar a muchos, todos los meses, controlando que no se pase nadie. Hoy es planilla + home banking + comprobantes por WhatsApp.

**Qué hace el agente solo:**
1. Lee una lista de pagos recurrentes (proveedor, monto, día) y facturas que le reenvían por Telegram (foto o PDF → el LLM extrae monto y proveedor).
2. En la fecha, **paga solo** lo que está dentro de los límites (tope por pago, presupuesto diario, proveedor en la allowlist).
3. Lo que se sale de los límites lo **pide aprobar** con un botón. El resto no molesta.
4. Manda el comprobante (link a celoscan) y, si el proveedor quiere pesos en banco, el link de off-ramp de Ripio.

**wFIAT y stack:** wARS; wCLP o wPEN para proveedores de Chile o Perú (comercio de frontera). Tag en cada pago. ERC-8004. Gas en USDC.

**Encaje con el scaffold:** el más alto. Allowlist = proveedores, política = límites, `pagar` ya existe. Falta: agenda, lectura de facturas y el bot.

**Riesgos:** necesita que el proveedor acepte wARS (o use el off-ramp). Con menos dinero real en juego, la demo es fácil.

---

## Idea C · "Cobrá en su moneda": turismo de frontera

**Para quién:** artesanos, guías y hospedajes de la Quebrada que reciben turistas de Brasil y Chile.

**Dolor:** el turista no tiene pesos, el cambio es malo y el comerciante pierde la venta o cobra en dólares o reales en efectivo.

**Qué hace el agente solo:**
1. El comerciante pide "cobrale $20.000 a esta turista brasileña".
2. El agente **cotiza** en reales (referencia externa + profundidad del pool) y arma el link de Ripio Ramp de Brasil (PIX → wBRL a la wallet del agente).
3. Cuando entra el wBRL, lo **convierte a wARS** (vía Textile o Uniswap, con control de slippage contra la referencia) y se lo **transfiere al comerciante** con tag.
4. Le avisa a los dos en su idioma (español y portugués).

**wFIAT y stack:** wBRL → wARS (wCLP si hay liquidez). Toca también Open Corridors (FX). Tag, ERC-8004, gas en USDC.

**Riesgos:** liquidez real de wBRL/wARS y wCLP onchain. Que el turista complete el ramp de Ripio en Brasil. Es la más vistosa y la más arriesgada técnicamente.

---

## Idea D · "Caja del grupo": gastos compartidos en Telegram

**Para quién:** grupos de amigos que viajan, departamentos compartidos, equipos de fútbol.

**Qué hace el agente solo:** en el grupo de Telegram anota gastos ("pagué $12.000 de nafta"), calcula quién le debe a quién, propone liquidar con el menor número de transferencias, manda a cada uno su link de Ripio para poner su parte y, cuando junta, paga al que adelantó. Sirve con integrantes de países distintos (cada uno en su moneda).

**Riesgos:** cada miembro tiene que pasar por Ripio. El agente custodia plata del grupo por un rato. Es divertida para la demo, pero la autonomía real es menor (casi todo lo dispara un humano).

---

## Idea E · "Mesada": presupuesto familiar con límites

**Para quién:** familias que mandan plata a un hijo que estudia en otra ciudad (San Salvador → Córdoba) o a un adulto mayor.

**Qué hace el agente solo:** el familiar carga wARS una vez. El agente libera la mesada semanal, paga gastos fijos (alquiler, servicios) a destinatarios aprobados, avisa cuando se gasta rápido y nunca se pasa del tope que fijó el adulto. El "presupuesto determinístico" del scaffold es literalmente el producto.

**Riesgos:** wARS no protege de la inflación (es 1:1 con el peso). El valor está en el control y la automatización, no en el ahorro.

---

## Comparación

Puntaje 1–5 por criterio (Mainnet, Stack, Autonomía, UX, Impacto) + facilidad de conseguir usuarios reales y de construir antes del 9/11 sobre el scaffold.

| Idea | Mainnet | Stack | Autonomía | UX | Impacto | Usuarios reales | Construible | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A · Cobrador | 5 | 4 | 4 | 4 | 4 | 4 | 4 | **29** |
| B · Pagador | 5 | 3 | 5 | 4 | 4 | 3 | 5 | **29** |
| C · Turismo FX | 4 | 5 | 4 | 3 | 5 | 2 | 2 | 25 |
| D · Caja del grupo | 4 | 3 | 2 | 4 | 3 | 4 | 3 | 23 |
| E · Mesada | 5 | 3 | 4 | 4 | 3 | 3 | 5 | 27 |

## Recomendación

**A + B como un solo agente: "el administrativo del pequeño comercio"**, que cobra (A) y paga (B) en pesos por Telegram.

- Cubre los dos lados del flujo de caja con la misma wallet y la misma política.
- Cada cobro que entra dispara repartos con tag (ahorro, socio, proveedor): **volumen con tag + autonomía real**.
- Reutiliza casi todo el scaffold. Lo nuevo es el bot de Telegram, el monitor de pagos entrantes y la agenda.
- **Camino de crecimiento:** cooperativas, clubes y comercios de la región. x402 (wARS) para que otros agentes consulten el estado de cuenta. Más adelante, wBRL o wCLP para turistas (idea C) como extensión.

Si se quiere apostar a algo más vistoso (y a un posible segundo track), C es la candidata, pero solo después de confirmar la liquidez wBRL/wARS onchain.

## Preguntas abiertas para cerrar la idea

- [ ] ¿Qué comerciante, club o cooperativa concreta lo probaría antes del 9/11?
- [ ] ¿El pagador puede completar Ripio Ramp sin cuenta previa? ¿Cuánta fricción tiene (KYC)?
- [ ] ¿Telegram alcanza o el usuario solo usa WhatsApp? (WhatsApp Business API requiere aprobación de Meta y lleva más tiempo)
- [ ] Custodia: ¿una wallet de agente por comercio, administrada por nosotros? ¿Cómo retira el comercio (off-ramp)?
- [ ] Para C: profundidad real de los pools wBRL/USD₮ y wARS/USD₮ en Textile y Uniswap.
