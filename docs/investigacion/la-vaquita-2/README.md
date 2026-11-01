# La Vaquita 2.0 — resumen ejecutivo

**Proyecto:** la-vaquita-2 · **Fecha:** 2026-10-25 · **Proceso:** startup-design, modo completo, investigación Deep
**Veredicto: 4,0/10 — preocupaciones significativas. Validar antes de comprometer inversión; demo honesta para el hackathon.**

> **Pivote 2 (25/10, después del 4,0/10):** la hipótesis central pasa a ser *«pagan por la coordinación»*: La Vaquita ayuda a organizadores y comunidades a administrar juntas, y las ofertas comerciales quedan como opcionales. Se investigan tres pagadores en este orden: el organizador, las instituciones y el comercio (K1 sin cambios). La decisión es el 24/11. Ver [brief, "Notas de pivote 2"](00-intake/brief.md), el [plan de 30 días v2](action-plan-30-days.md) y los [guiones de discovery v2](06-validation/discovery-v2.md). **Fast-track v3** sobre el organizador que paga: [`fast-track/04-scorecard.md`](fast-track/04-scorecard.md) da **4,0/10** (la misma nota, por otras razones). La comparación con la exploración 3.0 (layaway sincronizado) está en [`comparacion-versiones.md`](comparacion-versiones.md), y la v4 (comunidades dueñas de sus acuerdos, con compromiso sin depósito), en [`v4-comunidades-propietarias.md`](v4-comunidades-propietarias.md). El resto de este resumen describe el modelo anterior, el de la comisión del comercio, que sigue vigente como pagador A.

---

## La idea en un párrafo
La Vaquita organiza **juntas de ahorro por turnos entre conocidos**, con metas libres, en pesos digitales (wARS de Ripio) sobre Celo. Cada miembro firma su aporte, nadie custodia la plata y un agente de IA coordina recordatorios, estados y consultas. Cuando a alguien le toca cobrar, recibe su turno en dinero y **puede**, si quiere, comprar aparte una oferta con descuento de un comercio asociado (primero servicios y bienes digitales). **El comercio paga una comisión por venta confirmada (CPA de 10–15% en digital); el ahorrista no paga nada a La Vaquita.** El piloto es en Jujuy y la visión, comunidades en Argentina y LatAm.

## Hallazgos clave de la investigación
- **Espacio libre real:** ninguno de los competidores relevados combina el turno de la junta con una oferta comercial con descuento (`01-discovery/competitor-landscape.md`).
- **El comercio tiene un motivo para pagar:** hoy cede entre 20% y 40% en cuotas, descuentos y captación. Una venta de contado ya fondeada le ahorra parte de eso (`01-discovery/raw/pricing-deep-dive.md`).
- **Mercado de nicho en Argentina:** 5,6% sin ponderar ahorra en club o con otras personas (Findex). La categoría escala afuera (consórcios en Brasil, Money Fellows en Egipto con 8 M de usuarios) (`01-discovery/market-analysis.md`).
- **Regulación:** la IGJ RG 8/2015 alcanza los grupos cerrados para comprar bienes **o servicios**. Separar la junta de la compra baja el riesgo, pero no da una exención acreditada. La CNV RG 1172/2026 se cumple si firma cada miembro.
- **Modelo sin precedente vivo:** Hacé Una Vaquita (Argentina, mismo modelo) parece cerrada, y Money Fellows vive de cobrarle al usuario.
- **Competencia en el track:** TesorerIA (fondo grupal en wARS), AjoAI y Ajo Circle. "Junta + IA" ya no diferencia.

## Posicionamiento
Categoría conocida: **"juntas de ahorro por turnos, con ofertas opcionales para cuando cobrás"**. Mensaje: *«Cobrás tu turno. Elegís qué hacer con tu plata. Y si encontrás una oferta que te conviene, podés comprar con descuento.»* Misión: *«Conectamos el ahorro por turnos con compras convenientes para las personas y ventas sostenibles para los comercios.»* Canal del MVP: web app más links por WhatsApp; el organizador es el canal de adquisición.

## Top 3 riesgos y mitigación
| Riesgo | Mitigación | Corte |
|---|---|---|
| **El modelo no cierra:** contribución de $1.037,50 por círculo contra un CAC completo de $8.000 por miembro; equilibrio de caja con 26 círculos y 39 compras por mes; veredicto financiero **Riesgoso** | Medir el soporte humano por círculo (el agente lo baja), la conversión sobre varios círculos y el CAC por organizador | K6 y K7 (`06-validation/kill-criteria.md`) |
| **El comercio no acepta** | 10 entrevistas, con al menos 8 comercios sin relación familiar | **K1: menos de 3/10 → abandonar el híbrido** |
| **Encuadre IGJ e impago sin cobertura** | Revisión jurídica del flujo concreto antes de captar fondos de terceros; grupos privados; deuda posterior visible | K4 y K5 |

Además: **puerta técnica de firma el 27/10** (K2) y riesgo de nombre (**«Vaqi» suena igual que Vaki**, CO/MX).

## Lo que sabemos y lo que suponemos
- **Sólido:** el marco regulatorio citado, la existencia y las métricas públicas de los competidores, la macro de octubre de 2026 y los benchmarks de comisiones de afiliación.
- **Débil:** la demanda propia (0 entrevistas), la conversión a compra, el CAC, el costo de soporte, la disposición del comercio a pagar y el volumen de wARS. Las finanzas están en **Etapa A** (supuestos). Detalle en `01-discovery/confidence-dashboard.md`.

## Anti-patrones detectados
- **Construir sin hablar con clientes:** se está desarrollando con 0 entrevistas, que se pospusieron. Son el experimento #1.
- **Solución buscando problema (parcial):** el punto de partida fue Celo, el agente y el hackathon. El dolor del organizador y el pagador todavía no están confirmados.
- **Querer hacer todo a la vez (corregido):** la visión original (red social, gamificación, DeFi, marketplace) se recortó a junta + oferta opcional.
- **Ignorar la economía por unidad (en revisión):** el modelo de una sola fuente de ingreso no recupera el CAC con los supuestos base. Está documentado, no resuelto.

## Documentos
| Fase | Archivos |
|---|---|
| Progreso | [PROGRESS.md](PROGRESS.md) · [plan de 30 días](action-plan-30-days.md) |
| 0.5–2 Intake | [preflight](00-intake/preflight.md) · [brief](00-intake/brief.md) · [brainstorm](00-intake/brainstorm.md) |
| 3 Investigación | [mercado](01-discovery/market-analysis.md) · [competencia](01-discovery/competitor-landscape.md) · [público](01-discovery/target-audience.md) · [tendencias](01-discovery/industry-trends.md) · [confianza](01-discovery/confidence-dashboard.md) · [verificación](01-discovery/verification-report.md) · [research gate](01-discovery/research-gate.md) · [raw/](01-discovery/raw/) (15 informes) |
| 4 Estrategia | [lean canvas](02-strategy/lean-canvas.md) · [propuesta de valor](02-strategy/value-proposition.md) · [modelo de negocio](02-strategy/business-model.md) · [posicionamiento](02-strategy/positioning.md) · [go-to-market](02-strategy/go-to-market.md) |
| 5 Marca | [misión, visión y valores](03-brand/mission-vision-values.md) · [tono de voz](03-brand/tone-of-voice.md) · [personalidad](03-brand/brand-personality.md) · [naming](03-brand/naming.md) |
| 6 Producto | [MVP](04-product/mvp-definition.md) · [priorización y plan al 9/11](04-product/feature-prioritization.md) · [recorridos](04-product/user-journey.md) |
| 7 Finanzas | [ingresos](05-financial/revenue-model.md) · [costos](05-financial/cost-structure.md) · [proyecciones](05-financial/projections.md) |
| 8 Validación | [playbook](06-validation/validation-playbook.md) · [riesgos](06-validation/risk-analysis.md) · [supuestos](06-validation/assumptions-tracker.md) · [experimentos](06-validation/experiment-design.md) · [criterios de corte](06-validation/kill-criteria.md) · [scorecard](06-validation/scorecard.md) |

*Nota de método: parte de la investigación (Olas 3–4), la síntesis y las Fases 4–8 se redactaron con Codex para ahorrar cuota. Claude verificó la síntesis y revisó cada fase.*
