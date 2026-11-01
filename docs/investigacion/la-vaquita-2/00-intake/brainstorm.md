# Brainstorm — variantes de La Vaquita 2.0

**Fase:** 2 — Brainstorm
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-24
**Confianza:** Media-baja (ideas para explorar, no validadas)

---

## Hallazgo que condiciona todas las variantes

**El híbrido "ROSCA + compra de un bien" ya existe en Argentina y está regulado: son los planes de ahorro por círculos cerrados** (autos, motos, inmuebles).
- Los regula la IGJ con la RG 8/2015, por el art. 21 de la Ley 22.315 y el art. 174 de la Ley 11.672.
- La RG 1/2025 exige un capital mínimo de $100.000.000. **[Data, Tier 1–2; verificar en el Boletín Oficial]**
- **Lo bueno:** el modelo está probado a gran escala en el país, y el público ya entiende "cuota + adjudicación + bien". **[Opinion]**
- **Lo malo:** una vaquita abierta al público, cuyo pozo financia un bien de un comercio, puede encuadrarse como "ahorro para fines determinados", que requiere autorización y capital. **[Assumption; necesita análisis legal]** Probablemente no aplique a grupos privados entre conocidos sin oferta pública, pero hay que confirmarlo. Pasa a la Ola 1 (agente A3, regulación).
- **Lección conocida:** en esos planes la cuota sigue el precio del bien ("valor móvil"). Eso traslada la inflación al suscriptor. Las devaluaciones de 2018–2019 generaron reclamos masivos por ese motivo. **[Knowledge-Based, verificar]**

---

## V0 — Base: Social ROSCA Commerce
Junta por turnos. El pozo de cada turno puede ir a una compra con descuento con entrega escalonada. Comisión del comercio.
- **Lo atractivo:** identidad clara. Cada turno puede terminar en una venta, lo que da un ingreso por evento.
- **Lo riesgoso:** el comercio fija el precio en pesos por todo el ciclo y absorbe la inflación. Además, si alguien deja de pagar, la compra del último turno puede caerse.
- **Competencia:** juntas informales, Mercado Pago (Reservas) y los planes de ahorro.

## V1 — "Plan de ahorro 2.0": el comercio arma la vaquita
El comercio o la marca crea círculos para su propio producto: motos, electrodomésticos, notebooks, cursos. La Vaquita le da la infraestructura (agente, contratos, cobro). La cuota puede seguir el precio del producto.
- **Lo atractivo:** el comercio trae a los usuarios, así que el CAC baja y el arranque en frío se reduce a un solo lado. El comercio asume el riesgo de entrega y puede pedir garantía sobre el bien, como hacen los planes de ahorro con la prenda. El ingreso es SaaS más comisión.
- **Lo riesgoso:** es el núcleo de lo que regula la IGJ. Se pierde la capa de "comunidad". Es un B2B con ventas lentas, y el equipo no tiene a nadie comercial.
- **Competencia:** las administradoras de planes de ahorro y las cuotas sin interés de los bancos.

## V2 — Garantía revocable: ofertas de bienes digitales y servicios
Se mantienen las metas libres, pero las ofertas comerciales arrancan con cursos, software, suscripciones, gimnasios o internet. Si quien ya cobró deja de aportar, **se suspende el acceso** al servicio. El producto funciona como garantía.
- **Lo atractivo:** ataca de raíz el problema principal (el riesgo de impago) sin capital propio. El costo marginal del comercio es casi cero, así que puede dar descuentos del 20–40% y pagar comisión. **[Assumption]** No hay logística ni stock.
- **Lo riesgoso:** suspender el acceso tiene límites legales de protección al consumidor. No sirve para bienes físicos. La garantía cubre al comercio, no a los demás miembros de la junta, salvo que el contrato lo resuelva.
- **Competencia:** las suscripciones en cuotas y las becas.

## V3 — Precio en dólares digitales
La oferta se fija en USDC. Los miembros aportan en wARS y el agente convierte en el momento del pago con las herramientas de Ripio.
- **Lo atractivo:** el comercio queda sin riesgo inflacionario, y los argentinos ya piensan la electrónica en dólares. Encaja bien con Celo y Ripio.
- **Lo riesgoso:** el riesgo cambiario pasa al miembro, que cobra en pesos. Suma costo de conversión. Es más "cripto" de explicar.
- **Competencia:** comprar en cuotas con tarjeta, y comprar en dólares directamente.

## V4 — Turno licitado
Los turnos tempranos se ofertan: quien quiere cobrar antes paga un premio que se reparte entre los últimos turnos. La Vaquita puede quedarse con una parte.
- **Lo atractivo:** resuelve el problema del turno 5 con un precio de mercado. Los planes de ahorro ya usan licitación.
- **Lo riesgoso:** el premio se parece a un interés, y eso acerca el producto a la regulación de crédito. Además, a la gente le resulta más complejo de entender.
- **Competencia:** Money Fellows (cobra por elegir turno).

## V5 — Comunidad institucional con descuento por recibo de sueldo
Mutuales, cooperativas, sindicatos o empresas ofrecen vaquitas a sus miembros, y el aporte se descuenta del sueldo.
- **Lo atractivo:** el descuento por recibo casi elimina el impago. La institución trae a los usuarios y puede pagar una licencia.
- **Lo riesgoso:** ventas lentas e institucionales. Las mutuales ya ofrecen "ayudas económicas" (crédito) y pueden ver a La Vaquita como competencia. No requiere blockchain.
- **Competencia:** las ayudas económicas de las mutuales y los préstamos por recibo de sueldo.

## V6 — DeFi solo sobre las garantías
La ROSCA sigue sin dinero retenido, porque el pozo se reparte en cada ronda. Lo que queda quieto todo el ciclo es el **depósito de garantía**, y ese depósito genera rendimiento que vuelve al que lo puso.
- **Lo atractivo:** es el único lugar donde DeFi tiene números a favor, porque hay plata quieta todo el ciclo. Abarata la garantía y hace más tolerable exigirla.
- **Lo riesgoso:** el depósito requiere custodia, y eso puede sacar al producto de la exclusión de autocustodia de la RG 1172. Suma riesgo de contrato inteligente. El rendimiento en wARS es dudoso, porque no está claro que haya liquidez para prestar wARS en Celo.
- **Competencia:** las cuentas que pagan interés (Mercado Pago, YPF).

## V7 — Versión mínima: microvaquitas por Telegram
Ciclos de 4 semanas, ticket chico, **un comercio con precio cerrado** y un solo producto o servicio. El agente coordina por Telegram y la web muestra el estado.
- **Lo atractivo:** se puede construir para el 9/11. El ciclo corto limita la inflación y el riesgo. Demuestra el circuito completo con plata real.
- **Lo riesgoso:** no valida la red social ni la escala.
- **Competencia:** las juntas por WhatsApp.

---

## Mi lectura de convergencia **[Opinion]**
- **Núcleo:** V0, con la ROSCA por turnos y las metas libres.
- **Para el riesgo de impago:** V2. Las primeras ofertas, bienes digitales y servicios con garantía revocable, convierten el comercio en parte de la protección y no en una exposición extra.
- **Para la inflación del comercio:** ciclos cortos (V7) y precio cerrado por pocas semanas. V3 queda como opción por oferta.
- **Para DeFi:** solo como V6, más adelante, si se resuelve la custodia.
- **Para el hackathon:** V7.
- **Para después:** V1 y V5 son caminos de distribución B2B2C a explorar luego del piloto. V4 queda en reserva por riesgo regulatorio.
- **Antes que todo:** el análisis IGJ / ahorro para fines determinados.

---

## Decisión del fundador (2026-10-24)

| Variante | Estado |
|---|---|
| **V0 — Base** | ✅ Núcleo: ROSCA por turnos y metas libres |
| **V2 — Garantía revocable** | ✅ Primeras ofertas: bienes digitales y servicios |
| **V3 — Precio en USDC** | ✅ Opción por oferta, cuando el comercio la pida |
| Ciclos cortos | ✅ Parámetro de diseño (se separa de V7) |
| V5 — Mutuales o empresas con descuento por recibo | ⏸ Distribución B2B2C para después del piloto |
| V6 — DeFi sobre las garantías | ⏸ Fuera del piloto; no se descarta como idea |
| V1 — El comercio arma la vaquita | ❌ Descartada: es el núcleo de lo que regula la IGJ |
| V4 — Turno licitado | ❌ Descartada: el premio se parece a un interés |
| V7 — Versión mínima por Telegram | ❌ Descartada por el fundador: "no suma" |

**Idea refinada:** juntas por turnos con metas libres. Las ofertas comerciales arrancan con bienes digitales y servicios, donde el acceso se suspende si quien ya cobró deja de aportar. Los ciclos son cortos, el precio puede fijarse en USDC cuando el comercio lo pida y el diseño es non-custodial sobre Celo con wARS.

**Pendiente para la Fase 6:** con V7 descartada, falta definir el canal y el alcance del MVP del 9/11.

**Supuestos a verificar, no aceptados como hechos:**
- Que vender servicios o acceso "aleja" el encuadre IGJ. **[Assumption]** El ahorro para fines determinados podría incluir servicios. Lo investiga la Ola 1, agente A3.
- **Desajuste:** los dos comercios reales (una distribuidora de limpieza y un servicio técnico con accesorios de PC) venden bienes físicos. Ninguno encaja con V2. Sirven para entrevistas de práctica, no para validar la idea refinada.

---

## Flags

**Red Flags:**
- Posible encuadre como "ahorro para fines determinados" (IGJ), que pide autorización y un capital mínimo de $100M. Puede definir qué se puede ofrecer al público. **Requiere análisis legal.**

**Yellow Flags:**
- Suspender el acceso como garantía (V2) tiene límites de protección al consumidor.
- No está claro que haya rendimiento en wARS dentro de Celo (V6).

## Fuentes
- [IGJ RG 8/2015 — Colegio de Escribanos](https://www.colegio-escribanos.org.ar/noticias/2015_10_15_IGJ-Res-Gral-8-15.pdf) (Tier 1)
- [Consejo Salta — novedades RG IGJ 8](https://www.consejosalta.org.ar/wp-content/uploads/Nov.-Nac.-IGJ-8.pdf) (Tier 2)
- [Contadores en Red — RG IGJ 1/2025](https://contadoresenred.com/resolucion-general-1-2025/) (Tier 2)
- `00-intake/brief.md`, `00-intake/preflight.md`
