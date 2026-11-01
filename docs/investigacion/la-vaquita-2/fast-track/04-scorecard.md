# Scorecard v3 — 4,0/10: preocupaciones significativas

**Fase:** Fast-track 8 (scorecard y top 3 experimentos)
**Proyecto:** la-vaquita-2 → modelo v3 (B1: abono del organizador con 3 o más juntas)
**Fecha:** 2026-10-25
**Confianza:** Media sobre el diagnóstico; Baja sobre demanda, pago y renovación (0 entrevistas)

---

## Qué se puntúa
**[Opinion]** El modelo v3 con los cambios C1–C7 (`00-cambios-e-intake.md`), con la investigación de las Olas 1 y 2 (`raw/`) y la economía de `03-revenue-model.md`. Siete dimensiones, mismo peso, escala de 1 a 10. Claude escribió el borrador y Codex lo atacó en dos rondas (`debate-ronda-1.md` y `debate-ronda-2.md`). Esta es la versión acordada.

| Dimensión | A | v3 | Por qué |
|---|---:|---:|---|
| Problema | 6 | **6** | **[Opinion]** El trabajo de coordinar y llevar las deudas sigue siendo el mismo. Que el sustituto sea gratis pesa sobre el cobro, no sobre el dolor. No hay evidencia local de su intensidad. *(Claude había propuesto 5; Codex lo corrigió).* |
| Mercado | 4 | **3** | **[Estimate]** En Jujuy habría entre ≈140 y ≈6.900 organizadores por año. Son escenarios, no compradores, y solo una parte lleva 3 o más juntas. El equilibrio pide entre 17 y 32 organizadores pagos. |
| Ventaja competitiva | 3 | **2** | **[Data]** MiRonda, Tanda, TandaPlus y JuntemosPe ya ofrecen confirmación bilateral, varios grupos e historial, a USD 3–15 por mes. Lo que hace distinto al modelo A (junta más comercio) sale del piloto. Que las funciones se superpongan no significa que no se pueda competir, pero hoy no hay preferencia acreditada. |
| Factibilidad | 4 | **5** | **[Opinion]** Sin comercio, con la cadena como opción y con los estados bilaterales, se construye bastante menos. Siguen abiertos la conciliación, las excepciones y el encuadre del cobro. La demo del hackathon no cambia. |
| Modelo de negocio | 2 | **3** | **[Estimate]** Hay un pagador directo y una contribución de sensibilidad de $ 7.005 por organizador y por mes, con recupero del CAC en ≈5,7 meses (el modelo A necesitaba 53 ciclos). Pero los minutos de soporte, el CAC y la renovación son supuestos, y no hay ninguna venta. *(Claude había propuesto 4; Codex lo corrigió).* |
| Equipo | 4 | **4** | **[Opinion]** Sin cambios: 3 técnicos, ningún responsable comercial con horas reservadas y ningún acceso a organizadores. |
| Momento | 5 | **5** | **[Data]** Las transferencias crecen (+20,3%), pero eso no prueba demanda de software. La inflación castiga a los turnos tardíos. |
| **Total** | **4,0** | **4,0** | `(6+3+2+5+3+4+5)/7 = 28/7 = 4,0` |

## Veredicto
**[Opinion] 4,0/10: preocupaciones significativas. Validar B1 con un gasto acotado; todavía no lanzar ni expandir.** La nota es la misma que la del modelo A, pero por otras razones. Los cambios arreglaron lo que se podía arreglar sin evidencia: quién paga, la cuenta por unidad y lo que hay que construir. La investigación, a cambio, mostró que la herramienta del organizador ya existe y es barata. Rediseñar no da derecho a puntos: **lo que traba la nota es la falta de evidencia de pago, no el diseño.**

## Cambios adicionales adoptados (propuestos por Codex; todavía no suman puntos)
| # | Cambio | Puede mover | Riesgo |
|---|---|---|---|
| C8 | **B1 patrocinado por C1:** una asociación prepaga licencias para sus organizadores, con una sola factura y grupos privados separados. | Claridad del modelo | Otro comprador, ciclo largo y concentración |
| C9 | **Entrada desde la planilla que ya usa el organizador:** importa una plantilla única y al principio solo él ve la lista de vencimientos. Lo importado queda como *declarado*, nunca confirmado. | Factibilidad (5 → 6 si se prueba) | Datos heredados con errores |
| C10 | **Soporte delimitado:** se vende el registro y el reporte de discrepancias, no la mediación humana del conflicto financiero. | Modelo y factibilidad | Dejar afuera justo lo que el organizador querría comprar |

**Descartado:** cambiar de país. Bolivia tiene BancoSol, y México y Perú ya tienen competidores. El español rioplatense no da ventaja ahí.

## Qué movería la nota
| Evidencia | Dimensión | Suba posible [Opinion] |
|---|---|---|
| Al menos 2 de 5 organizadores con 3 o más juntas cuentan episodios recientes con un costo concreto | Problema | 6 → 7 |
| Al menos 2 pagos completos sobre 6 ofertas independientes | Modelo y mercado | 3 → 4–5 y 3 → 4 |
| Una razón concreta para elegirnos y no a MiRonda o Tanda | Ventaja | 2 → 3–4 |
| Un responsable comercial con horas reservadas y un referente que dé acceso | Equipo | 4 → 5 |

## Top 3 experimentos
1. **Entrevistas a 5 organizadores** que hoy llevan 3 o más juntas (los que llevan 2 se analizan aparte), con el guion de `../06-validation/discovery-v2.md` y, si se puede, observando un vencimiento. **Corte:** si menos de 2 de 5 describen episodios recientes con un costo concreto, B1 se pausa. Antes de declarar que el segmento no existe, se repite por otro canal.
2. **Prueba de pago (*concierge*), después de la revisión jurídica y fiscal.** Ofrecer $ 14.900 por un mes, pagados por adelantado, y operar la junta a mano. Las señas y los familiares se cuentan aparte. Medir rechazos, capacitación, minutos de soporte y disputas. **Corte:** menos de 2 pagos completos de 6 ofertas. **Para seguir hace falta además:** ahorrar al menos 30% del tiempo sin más errores, disputas de 60 minutos o menos por organizador y por mes, y un CAC de $ 40.000 o menos.
3. **Renovación.** **Objetivo: 95% o más** (con el 80%, el LTV de $ 35.025 no cubre el CAC de $ 40.000; equilibrio por encima del 82,5%, y LTV/CAC ≥ 3 recién con ≈94,2%). Con dos clientes, 2 de 2 solo habilita una cohorte más grande. Se cuentan las pausas y las bajas. Si falla, se recalcula el precio y el segmento, y recién después se evalúa C1.

## Flags
**Red Flags:**
- **[Data]** 0 entrevistas y 0 cobros propios; el encuadre del cobro sigue pendiente de un abogado.
- **[Data]** Las funciones centrales ya las ofrecen al menos 4 apps.

**Yellow Flags:**
- **[Opinion]** El soporte y el tamaño del mercado concurrente son desconocidos. Que el promedio suba no levanta estos bloqueos.

## Fuentes
- `00-cambios-e-intake.md`, `01-research-gate.md`, `02-lean-canvas.md`, `03-revenue-model.md`, `raw/ola-1.md`, `raw/ola-2.md`, `debate-ronda-1.md`, `debate-ronda-2.md` y `../06-validation/scorecard.md`.
