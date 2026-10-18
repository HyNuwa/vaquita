# La Vaquita — referentes y mejoras a la idea

Investigación del 17/10/2026. Datos resumidos de las fuentes enlazadas al final. Cifras
autodeclaradas por las empresas salvo que se indique.

---

## 1. Referentes

### Círculos de ahorro digitalizados (fintech tradicional)

| Startup | Qué hace | Escala | Lección para nosotros |
|---|---|---|---|
| **MoneyFellows** (Egipto) | ROSCA digital. El **orden de cobro es el producto**: los que cobran primero funcionan como "tomadores de crédito" y los últimos como "ahorristas". Ordena por datos de comportamiento e ingresos. Si falta alguien para completar un círculo, **la empresa financia ese lugar**. | +8,5 M usuarios, ~US$60 M levantados, rentable en Egipto | El turno vale plata: hay que cobrarlo o premiarlo. El riesgo central no es la tecnología, es el lugar vacío y el que deja de pagar. |
| **Tanda** (Yahoo Finance, EE.UU., 2018) | Tandas en app, públicas o privadas. Cobra **solo a los dos primeros turnos**, descontado del pozo. Si alguien deja de pagar, **Tanda cubre el aporte**. | Producto de Yahoo, discontinuado | Cobrar el adelanto a quien cobra primero es intuitivo. Cubrir a los morosos requiere capital propio, cosa que no tenemos. |
| **Esusu** (EE.UU.) | Arrancó como app de ahorro rotativo. **Pivoteó**: el modelo uno-a-uno era caro y el costo caía en los usuarios. Se dieron cuenta de que lo primero que les faltaba era **historial crediticio**. Hoy reporta pagos de alquiler a los burós y le cobra al propietario, no al inquilino. | +1 M inquilinos, valuación ~US$1.000 M | El historial de cumplimiento vale más que el pozo. Que pague el que más gana con el producto. |
| **Chamasoft** (Kenia) | Gestión de "chamas": registro de aportes, multas, préstamos internos, avisos y reportes. **Los bancos pagan** la herramienta para que los grupos operen con ellos. | +1 M usuarios declarados | Los grupos no solo rotan: también multan, prestan y quieren reportes. Y el canal B2B (bancos, ONGs) financia a los usuarios de menores ingresos. |
| **BX Smart Labs** (México, UNICEF Venture Fund) | Dapp de tandas abierta, con contratos para aportes y pagos. Busca resolver recordatorios, verificación de pagos y registros, que es donde nacen las peleas. | Financiada con US$60K, sin resultados publicados | El dolor real es **administrativo**: quién pagó, quién debe, cuándo toca. Justo lo que hace bien un agente. |

### "Vaquitas" y gastos compartidos

| Startup | Qué hace | Lección |
|---|---|---|
| **Vaki** (Colombia → México) | Digitalizó "hacer una vaca". Creció con campañas grandes y compartibles. | +US$14 M para 60.000 causas. El **nombre cultural** y el **link compartible** son el motor de crecimiento. |
| **Tricount** (Bélgica) | Gastos de grupo. Se usa **sin registrarse**, funciona offline, minimiza la cantidad de transferencias para saldar. | La simplicidad le gana a las funciones. Entrar con un link y sin cuenta. |

### Finanzas por chat (el canal)

| Startup | Qué hace | Lección |
|---|---|---|
| **Magie** (Brasil) | Asistente financiero con IA en WhatsApp: Pix por audio, texto o foto, boletos y recordatorios. | +400K usuarios, +R$2.000 M procesados. Pagar hablando funciona en LatAm. |
| **Zapia** (Uruguay/LatAm) | Asistente de IA en WhatsApp con ~6 M usuarios. Desde **enero de 2026** Meta limitó a los asistentes de IA externos en WhatsApp a funciones puntuales de atención. Zapia **dejó de operar en WhatsApp en Argentina, Colombia y México** el 15/1. | ⚠️ **Riesgo de plataforma.** No construir el MVP sobre WhatsApp. |

### On-chain en Celo: la competencia directa

| Proyecto | Qué hace | Lo que no resolvió |
|---|---|---|
| **Ronda** (ETHGlobal Buenos Aires) | ROSCA en Celo como mini-app de Farcaster, con verificación opcional por Self y contrato por grupo. 3.er puesto en categorías de Celo y Self. | Farcaster no es donde está la gente del barrio. No describe qué pasa si alguien no paga. |
| **CeloSusu** | Círculos de 3 a 12 personas en cUSD/cEUR, Self, rendimiento opcional en Aave. Fee pensado de 0,5–1 % por ciclo. | Sin tracción publicada. No resuelve la mora. En dólares. |
| **ChamaPay** | Chamas en cUSD con escrow en contrato. Si en la ronda falta alguien, **devuelve los aportes** a los que pagaron. | Sin tracción publicada. En dólares. |

**Conclusión del benchmark.** Hacer un ROSCA on-chain ya está visto en Celo; los jueces van a
reconocer el patrón. Ninguno de estos proyectos:
- opera en **moneda local**,
- tiene un **agente** que haga la cobranza y la administración en el chat del grupo,
- resuelve el onboarding de alguien sin cripto,
- muestra usuarios reales.

Ahí está nuestro espacio.

---

## 2. Qué cambia en La Vaquita

### Mejora 1 — El turno tiene precio, y eso compensa la inflación
*Inspirado en MoneyFellows y Tanda.*

En Argentina, cobrar el pozo en el mes 1 o en el mes 10 no es lo mismo: el último recibe pesos que
compran menos. Lo dicen hasta los bancos al hablar de las tandas: la plata guardada meses sin
rendimiento pierde poder de compra.

**Regla:** el que elige cobrar antes paga un **premio** chico, descontado de su pozo. Ese premio se
reparte entre los turnos finales. La fórmula es fija, pública y la calcula el código, no el LLM.

Ejemplo:
- 10 personas ponen $10.000 por mes, así que el pozo es de $100.000.
- Turnos 1 y 2: cobran $97.000.
- Turnos 9 y 10: cobran $103.000.

**Por qué suma:** es un diferencial local claro (impacto LatAm), le da sentido a usar el agente y
no requiere capital propio.

### Mejora 2 — Mora resuelta por reglas, no por confianza
*Inspirado en Tanda, MoneyFellows y ChamaPay.*

No tenemos capital para cubrir morosos. Hay tres mecanismos para elegir en la sesión; se pueden combinar:

| Mecanismo | Cómo funciona | Pro | Contra |
|---|---|---|---|
| **A. Pozo completo o nada** | El agente paga solo cuando están todos los aportes. Si vence el plazo, devuelve a los que pagaron (como ChamaPay). | Simple, sin pérdidas | La ronda se traba por uno |
| **B. Fondo de garantía** | Al entrar, cada uno deja un aporte extra como depósito. Si alguien falla, el agente cubre con ese fondo, y al final se devuelve a los que cumplieron. | El grupo sigue funcionando | Más plata inicial |
| **C. El que ya cobró, garantiza** | Quien ya cobró y deja de pagar pierde su depósito y queda marcado en el historial del grupo. | Ataca el caso de fraude más típico | Necesita el depósito de B |

**Recomendación MVP:** A + B con un depósito de un aporte. Es determinístico, auditable y cabe
en el motor de políticas que ya tenemos.

### Mejora 3 — Historial de cumplimiento como activo
*Inspirado en Esusu.*

Cada aporte puntual queda on-chain y con tag. Al cerrar el ciclo, el agente le da a cada miembro
un **resumen verificable**: cuántos aportes hizo, cuántos a tiempo y los links al explorador. Es
el embrión de una "reputación financiera" para gente sin historial bancario.

Bonus de stack: al terminar el ciclo, los miembros pueden **calificar al agente** en la Reputation
Registry de ERC-8004. Cada calificación la firma un miembro, así que también suma firmantes reales.
(El contrato bloquea el auto-feedback, y eso hace que sean miembros reales.)

### Mejora 4 — Tres modos con el mismo motor
*Inspirado en Chamasoft, Vaki y Tricount.*

| Modo | Para qué | Regla de pago del agente |
|---|---|---|
| **Junta / tanda** (rotativo) | Ahorro grupal | Paga el pozo al turno que corresponde, con premio por turno |
| **Vaca de objetivo** | Regalo, viaje, cumple, causa del barrio | Paga al destinatario cuando se llega al monto o a la fecha |
| **Gastos compartidos** | Viaje, departamento compartido | Calcula los netos y propone la menor cantidad de transferencias |

El MVP de hackathon hace **Junta + Vaca de objetivo**. El modo gastos queda para después.

### Mejora 5 — Canal: Telegram primero
*Lección de Zapia y Magie.*

Pagar hablando funciona (Magie), pero WhatsApp restringe a los asistentes de IA desde enero de
2026 y una startup grande tuvo que irse de Argentina, Colombia y México. Para el hackathon:
- **Bot de grupo en Telegram.** API abierta, bots en grupos, botones inline y links.
- Una **página web chica** por vaquita con el estado público: quién pagó, cuándo toca y los links a Celoscan.
- WhatsApp solo más adelante, como bot de tarea puntual, después de verificar la política vigente.

### Mejora 6 — Entrar con un link, sin cuenta
*Inspirado en Tricount y Vaki.*

El organizador crea la vaquita con un mensaje y el agente devuelve un link para invitar. Cada
miembro sigue cuatro pasos:
1. Abre el link.
2. Conecta o crea su wallet.
3. Si no tiene pesos digitales, el agente le arma el link de **ramp.ripio.com** con monto y dirección cargados.
4. Paga su parte.

---

## 3. La idea, mejorada

> **La Vaquita** es un agente que organiza la junta, la tanda o la vaca de tu grupo en pesos
> digitales: cobra a cada uno, paga el pozo a quien le toca y premia a los que esperan,
> con reglas que nadie, ni el agente, puede romper.

### Lo que hace el agente (autónomo)
- Abre el ciclo, manda los recordatorios y persigue a quien se atrasa, con tono humano.
- Detecta los aportes on-chain y los concilia contra cada miembro.
- Paga el pozo en fecha si se cumplen las reglas, o activa la regla de mora.
- Responde en el grupo preguntas como "¿cuánto falta?", "¿cuándo me toca?" o "¿quién no pagó?".
- Cierra el ciclo con un resumen y el historial de cada uno.

### Lo que decide el código (no el LLM)
- Miembros = allowlist del ciclo.
- Monto del aporte, calendario, orden y premio por turno.
- Regla de mora y fondo de garantía.
- Topes por pago y por ciclo.

### Cómo queda en el stack
| Pieza | Uso |
|---|---|
| wARS (después wBRL/wCOP/wMXN) | Aportes y pozos |
| Tag ERC-8021 | Cada pago del agente y cada aporte que el agente arme para el usuario |
| Fee abstraction | El agente paga gas en USDC; el miembro, según su wallet |
| ERC-8004 | Identidad del agente + calificación de los miembros al cerrar el ciclo |
| ramp.ripio.com | Carga de pesos y retiro del pozo a CVU/CBU |
| x402 (opcional) | Cobro de un premium en pesos: vaquitas grandes, reportes |

### Firmantes independientes por ciclo
Una junta de 10 personas genera, por ciclo:
- 10 aportes por ronda;
- 10 depósitos de garantía;
- hasta 10 calificaciones al agente.

Todo lo firman miembros reales. Es el número que mira el leaderboard.

---

## 4. Riesgos nuevos que trajo la investigación

| Riesgo | Mitigación |
|---|---|
| **Custodia.** El pozo está en la wallet del agente. | Topes bajos en el hackathon. Estado público por vaquita. v2: escrow en contrato (como Ronda/ChamaPay), con el agente solo como operador. |
| **Regulatorio.** Administrar plata de terceros. | Para el hackathon, grupos chicos y montos bajos. Mencionarlo en la entrega como trabajo futuro (Ripio B2B y KYB). |
| **Ya hay ROSCAs en Celo.** | Diferenciarnos explícitamente en el pitch: moneda local, agente cobrador, premio por turno, onboarding sin cripto, usuarios reales. |
| **WhatsApp.** | Telegram + web. |
| **Wallets del usuario.** | Probar qué wallet firma bien CIP-64 con wARS; tener plan B con gas en CELO para el usuario. |

---

## 5. Para decidir en la próxima sesión
1. ¿Premio por turno sí o no? ¿Con qué fórmula (fija o porcentual)?
2. ¿Mecanismo de mora: A, A+B o B+C?
3. ¿Custodia en la wallet del agente (rápido) o escrow en contrato (más confiable, más trabajo)?
4. ¿Qué tres grupos reales arrancan el primer ciclo antes del 1/11? (con nombres)
5. ¿Ciclo de prueba corto, por ejemplo diario o cada dos días, para mostrar varias rondas antes del 9/11?

---

## Fuentes
- MoneyFellows — TechCrunch (2025): https://techcrunch.com/2025/05/04/moneyfellows-raises-13m-to-take-its-group-savings-model-outside-egypt
- Esusu — Pulse 2.0: https://pulse2.com/esusu-samir-goel-profile/
- Tanda de Yahoo — Expansión (2018): https://expansion.mx/tecnologia/2018/01/19/yahoo-replicara-las-tandas-en-una-app-llamada-tanda
- Chamasoft — MIT Solve: https://solve.mit.edu/solutions/85265
- BX Smart Labs — UNICEF Venture Fund: https://www.unicefventurefund.org/story/bx-smart-labs-developing-decentralized-app-saving-circles
- Vaki — Descubre.vc (2026): https://www.descubre.vc/noticia/vaki-la-historia-de-la-plataforma-que-transform-el-crowdfunding-en-colombia-2026-06-12
- Tricount — TechCrunch (2016): https://techcrunch.com/2016/04/21/tricount/
- Magie — Startups.com.br: https://startups.com.br/negocios/fintech/magie-capta-us-5-milhoes-e-cria-vertical-b2b-para-pagamentos-via-whatsapp/
- Zapia y reglas de WhatsApp — Startups.com.br: https://startups.com.br/negocios/zapia-segue-no-whatsapp-e-critica-regras-da-meta-apos-intervencao-do-cade/
- Ronda — ETHGlobal: https://ethglobal.com/showcase/ronda-7ck82
- CeloSusu — Karma: https://www.karmahq.org/project/celosusu/about
- ChamaPay — Karma: https://www.karmahq.org/project/chamapay/about
- Riesgos de las tandas — BBVA México (2026): https://www.bbva.com/es/mx/salud-financiera/mitos-y-realidades-de-las-tandas-de-ahorro-son-tan-buenas/ · Récord (2026): https://www.record.com.mx/historia/ahorras-en-tandas-especialistas-advierten-por-que-podrias-perder-dinero-2026090818380892321
