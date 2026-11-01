**Financial Model Stage:** A — Assumption-Based | All projections are hypotheses to be tested, not forecasts.

# Estructura de costos — separar caja, horas y adquisición

**Fase:** 7 — Finanzas
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Baja: presupuesto sin cotizaciones propias ni registros operativos adjuntos

---

**[Opinion]** El equilibrio de caja sin sueldos puede parecer cercano, pero depende de trabajo gratuito y cartera ya adquirida. Con los costos completos de la base, **el crecimiento a tres ciclos por grupo pierde plata antes de cubrir fijos**. No alcanza con bajar el costo de red ni con contar el pozo como facturación.

## 1. Alcance, moneda y criterio de imputación

**[Assumption]** Salvo los importes nominales identificados, todos los costos unitarios de este archivo se expresan en **pesos de octubre de 2026**. Para caja se multiplican por `I_m = 1,019^(m−1)`, como en [ingresos](revenue-model.md). Los gastos únicos se pagan al inicio; no se reindexan después de pagarlos. Son presupuestos a cotizar, no tarifas publicadas ni compromisos del equipo.

**[Data]** El fundador confirma ausencia de sueldos el año 1 y la referencia de dos horas de soporte que el agente debería reducir. Los insumos de estrategia todavía llaman a esas horas un supuesto y no adjuntan registros. **[Assumption]** Se conserva la base de **2 h/círculo**, sin adjudicarle evidencia de medición que no está disponible para auditar. La hora de $ 5.000 sigue la convención de estrategia, no una tarifa laboral comprobada.

**[Opinion]** El año 1 muestra caja y costo económico por separado: las horas propias no se desembolsan, pero consumen capacidad y tienen costo. Desde mes 13, si hay capital, el sueldo compra esa capacidad: **no se vuelven a sumar como desembolso las mismas horas** de soporte, conciliación o adquisición. El modelo de caja con sueldos conserva solo los desembolsos de esos rubros. No se asume un proveedor de soporte adicional.

## 2. Costos fijos mensuales

| Concepto **[Assumption]** | Base mensual | Qué cubre y qué falta cotizar |
|---|---:|---|
| Infraestructura | $ 80.000 | Web/API, base, copias, monitoreo y servicio básico de firma/autenticación. Validar que el proveedor respete firma individual y recuperación; el consumo incremental va en variables. |
| Herramientas del equipo | $ 40.000 | Colaboración, diseño y desarrollo. Uso del agente de producto por ciclo se costea aparte. |
| Asesoría legal recurrente | $ 60.000 | Revisión de cambios, contratos y consultas acotadas. No incluye autorización regulatoria ni litigio. |
| Contador y administración fiscal | $ 80.000 | Registración, facturación y liquidaciones. No incluye los tributos mismos. |
| Cuenta, dominio y comunicaciones | $ 40.000 | $ 20.000 de administración/cuenta y $ 20.000 de conectividad/dominio prorrateado. Sin oficina alquilada. |
| **Total mensual sin remuneraciones** | **$ 300.000** | **$ 3.600.000/año a precios de oct-2026; $ 4.001.076 nominales en año 1.** |

**[Assumption]** Para absorber mayor volumen, fijos sin sueldos de años 2/3: conservador $ 300.000/$ 300.000 mensuales; base $ 450.000/$ 600.000; optimista $ 600.000/$ 900.000, siempre a precios de oct-2026, luego indexados. Es una bolsa de capacidad y servicios, sin contratación oculta. Revisar por tramos de carga antes de comprometerla.

**[Opinion]** El presupuesto de infraestructura puede quedar corto si la firma integrada cobra por cuenta, recuperación o transacción. No supone que «wallet invisible» sea gratis ni que una licencia de desarrollo pague el consumo del agente de usuarios. No se agregan herramientas o dependencias mediante este documento.

## 3. Variables por círculo y por compra

| Unidad / concepto **[Assumption]** | Caja | Horas propias valorizadas | Criterio |
|---|---:|---:|---|
| Por círculo: soporte de junta | $ 0 en año 1 | 2 h × $ 5.000 = **$ 10.000** | Consultas, pagos discrepantes, atrasos y conflictos. Medir también atención de suspendidos e inconclusos. |
| Por círculo: red de aportes | **$ 200** | — | Veinte operaciones × $ 10 presupuestarios. No es precio de red observado ni conversión de una tarifa en dólares. Reintentos, autorizaciones o firma extra deben entrar si existen. |
| Por círculo: IA/lecturas/firma incremental | **$ 300** | — | Consumo incremental sobre la infraestructura fija; medir por grupo y por consulta. |
| Por círculo: contingencia de ingreso/rampa | **$ 500** | — | Bolsa técnica subsidiada, equivalente a 0,1% de los $ 500.000 transferidos. No se afirma que el proveedor cobre esa tasa ni se retienen fondos del grupo. |
| **Subtotal por círculo** | **$ 1.000** | **$ 10.000** | Mantiene el orden de magnitud técnico de estrategia, ahora desglosado. |
| Por compra: red, salida y liquidación comercial | **$ 500** | — | $ 100 técnicos + $ 400 de contingencia de cobro/salida. Distinto del ingreso de aportes de la fila anterior. Equivale a 0,5% del ticket base, sin afirmar arancel de rampa. |
| Por compra: conciliación comercial | $ 0 en año 1 | 0,1 h × $ 5.000 = **$ 500** | Seis minutos para cotejar pedido, entrega, ajuste y CPA. Se suman al soporte de la junta; no se cuentan dos veces las mismas tareas. |

**[Estimate]** A 30% de compra: 1,5 compras/círculo; variable de caja **$ 1.750**, horas **$ 10.750**, total variable **$ 12.500**. El tiempo humano es 2,15 h/círculo. No incluye adquisición, fijos, desarrollo ni remuneración de capital.

**[Assumption]** Las contingencias de rampa/red son gastos esperados de presupuesto, tratados como consumidos en el flujo. No se agregan además como una reserva de caja retenida. Si se demuestra costo cero, se libera esa partida; no se lo supone desde el anuncio comercial de una rampa. Si el costo efectivo supera la bolsa, el presupuesto aumenta o se acuerda quién lo paga antes de operar.

**[Assumption]** Ajustes del 5% del CPA bruto y reserva fiscal del 5% del CPA neto se calculan aparte, no por duplicado dentro de $ 12.500. La reserva fiscal es dinero apartado y no disponible para operar. No se promete cobertura total de impuestos: encuadre, IVA, IIBB, mínimos, retenciones, crédito fiscal y base de comisión siguen pendientes de contador. Los montos de fijos y únicos se presupuestan como salida total; no se anticipan créditos fiscales recuperables.

**[Opinion]** El modelo no cubre faltantes de los integrantes, inventario, logística, crédito propio, garantías ni fondos en DeFi. Los aportes se mantienen fuera de caja empresarial. Si el diseño termina requiriendo alguno de esos costos o capital regulatorio, este modelo deja de ser aplicable y hay que frenar y recalcular; no se paga con el fondo de los grupos.

## 4. Captación de los dos lados, una sola vez

| Captación base **[Estimate]** | Caja | Horas valorizadas | Completo |
|---|---:|---:|---:|
| Un grupo nuevo de cinco | $ 10.000 | 6 h × $ 5.000 = $ 30.000 | **$ 40.000** |
| Un miembro nuevo, prorrateo del grupo | $ 2.000 | $ 6.000 | **$ 8.000** |
| Un comercio activado pagador | $ 6.666,67 | 4 h × $ 5.000 = $ 20.000 | **$ 26.666,67** |
| Piloto de 18 grupos / 90 miembros | $ 180.000 | $ 540.000 | $ 720.000 |
| Diez comercios activados pagadores | $ 66.666,67 | $ 200.000 | $ 266.666,67 |
| **Captación completa del piloto** | **$ 246.666,67** | **$ 740.000** | **$ 986.666,67** |

**[Data]** El desglose viene de estrategia: grupo = $ 10.000 + seis horas; experimento comercial = $ 20.000 + doce horas para tres activaciones. **[Assumption]** Se extrapola a diez comercios pagadores; no supone que diez entrevistas alcancen. El costo de contactos que rechazan o nunca venden tiene que entrar en el numerador.

**[Opinion]** El costo por organizador y por miembro reparte la misma bolsa: no se suman. El CAC comercial se agrega una vez por comercio captado a la cartera, no por compra ni por círculo. Repetir con el mismo miembro no genera otro CAC completo; una reposición sí. Desde mes 13, las horas comerciales están dentro de la capacidad remunerada y solo se agrega la parte de caja del CAC.

**[Assumption]** Como asignación de cartera, el costo comercial completo del piloto equivale a $ 266.666,67 / 18 = **$ 14.814,81 por grupo nuevo**. No es una tarifa por grupo ni la promesa de igual productividad para cada comercio. Baja si la misma cartera atiende más grupos, y sube si hay bajas, poca venta o concentración. Se usa solo para evaluar recupero, sin volver a cargarla en caja.

## 5. Costos únicos, desarrollo y marca

| Concepto inicial **[Assumption]** | Desembolso en mes 1 | Alcance y puerta |
|---|---:|---|
| Dictamen/revisión legal y fiscal inicial | **$ 1.200.000** | Flujo concreto, contratos, consumo, privacidad y puesta en marcha. Presupuesto propio, sin cotización; no compra una exención ni una autorización garantizada. |
| Marca e INPI | **$ 400.000** | $ 200.000 de búsqueda/revisión y $ 200.000 de provisión para trámites/identidad mínima. No son aranceles oficiales. Separar pago del análisis y presentación: no presentar un nombre incompatible. |
| Seguridad y revisión externa acotada | **$ 600.000** | Flujos de firma, permisos, conciliación y persistencia. No equivale a auditoría integral de un contrato nuevo. |
| Puesta en marcha de desarrollo | **$ 200.000** | Pruebas de dispositivos, despliegue e integración inicial externos a las horas propias; sin inventar contratación tercerizada. |
| **Total de caja inicial** | **$ 2.400.000** | Se presupuesta toda la salida al inicio para evitar financiarla con ingresos aún inexistentes. Puede escalonarse después de cotizar, sin contar ese ahorro ahora. |

**[Data]** Marca sigue abierta: La Vaquita es nombre de trabajo y Vaqi tiene la homofonía con Vaki señalada en [naming](../03-brand/naming.md). **[Opinion]** Presupuestar INPI no acredita disponibilidad. La guía de marca pide claridad y control del usuario; no se justifica una identidad cara antes de despejar nombre y demanda.

**[Estimate]** Como costo económico inicial adicional: demo de **45 días-persona × 8 h × $ 5.000 = $ 1.800.000**; trabajo inicial del piloto de **14 días-persona × 8 h × $ 5.000 = $ 560.000**; total **$ 2.360.000 de horas propias**, sin salida de caja ni capitalización contable asumida. Se basa en los esfuerzos propuestos en producto, no en partes de horas ejecutados. No se incluyen aquí las horas de captación o soporte ya costeadas.

**[Opinion]** Producto identifica ~45 días-persona de alcance frente a ~30 disponibles para construir, con recortes. Valorar horas no resuelve ese faltante de calendario. El flujo no asume compra de quince días-persona adicionales ni que la demo complete el piloto. Si hace falta tercerización, cotizarla y aumentar capital. Las horas propias de mantenimiento posteriores se cubren con dedicación gratuita el año 1 y con capacidad salarial desde mes 13, sin volver a cargar el desarrollo inicial.

## 6. Contribución y puente desde estrategia

| Base por círculo **[Estimate]** | Importe de oct-2026 |
|---|---:|
| CPA bruto | $ 15.000,00 |
| Ajustes de ingreso, 5% | −$ 750,00 |
| **Ingreso neto devengado** | **$ 14.250,00** |
| Reserva fiscal presupuestaria, 5% del neto | −$ 712,50 |
| Variables de caja | −$ 1.750,00 |
| **Contribución de caja sin sueldos** | **$ 11.787,50** |
| Trabajo humano, soporte + conciliación comercial | −$ 10.750,00 |
| **Contribución completa antes de CAC y fijos** | **$ 1.037,50** |

**[Estimate]** Estrategia mostraba $ 3.250: `15.000 − 750 − 1.000 − 10.000`. Finanzas agrega **$ 750** de variable comercial de caja, **$ 750** de conciliación comercial y **$ 712,50** de reserva fiscal: `3.250 − 750 − 750 − 712,50 = 1.037,50`. No cambió la base de ingreso ni se duplicó infraestructura.

**[Estimate]** El margen operativo variable completo antes de la reserva fiscal sería `(14.250 − 12.500) / 14.250 = 12,3%`; después de esa reserva, la contribución es 7,3% del ingreso neto. Son definiciones presupuestarias, no margen contable auditado. No se compara ese 7,3% con el margen SaaS de 70–85%: el modelo y los costos son distintos.

| Soporte por círculo **[Estimate]** | Contribución completa, manteniendo todo lo demás |
|---|---:|
| 3 h | −$ 3.962,50 |
| **2 h, base** | **$ 1.037,50** |
| 1 h | $ 6.037,50 |
| 30 min | $ 8.537,50 |
| 15 min | $ 9.787,50 |
| 3 min, extremo sin validar | $ 10.787,50 |

**[Estimate]** El soporte máximo para contribución positiva, antes de CAC/fijos, es **2,2075 h ≈ 2 h 12 min**, además de los nueve minutos comerciales esperados. El escenario de tres minutos no es parte de las proyecciones optimistas. La meta exploratoria de producto de treinta minutos requiere medir también calidad y casos pendientes.

## 7. Punto de equilibrio: qué cubre cada número

**[Assumption]** Se mantiene c = 30%, T = $ 100.000, CPA = 10%, ajustes = 5%, reserva fiscal = 5% del neto y fijos de $ 300.000. Son cuentas de régimen estable: comisiones cobradas, misma escala de costos y sin nuevos únicos. El atraso inicial de cobro necesita capital de trabajo adicional, incluido en proyecciones.

| Equilibrio **[Estimate]** | Cuenta | Cierres de grupo/mes | Compras esperadas/mes | Alcance real |
|---|---|---:|---:|---|
| Caja sin sueldos ni nuevas altas | $ 300.000 / $ 11.787,50 | **26** | **39** | Cartera ya adquirida; trabajo gratuito. No paga CAC ni remunera al equipo. |
| Costo completo del trabajo, sin nuevas altas | $ 300.000 / $ 1.037,50 | **290** | **435** | Antes de CAC y únicos. Requiere unas 623,5 h/mes solo de operación. |
| Crecimiento con tres ciclos por grupo | $ 1.037,50 − ($ 40.000 + $ 14.814,81) / 3 | **Sin equilibrio finito** | — | Contribución después de adquirir ambos lados = **−$ 17.234,10/ciclo**. Más volumen empeora la pérdida. |
| Caja con tres remuneraciones, fijos del año 2, sin nuevas altas | ($ 450.000 + $ 2.925.000) / $ 11.787,50 | **287** | **430,5** | Las horas pasan a nómina y no se restan otra vez por ciclo. No incluye captar grupos nuevos. |

**[Estimate]** Los 287 ciclos del último renglón exigen **617 h/mes** de operación, por encima de las 450 h mensuales de tres personas, aun sin desarrollo, administración o captación. Hace falta menos soporte o más personal; agregarlo cambia el equilibrio. Por eso no se presenta ese número como una escala alcanzable con la estructura actual. Tampoco se presupuestan 290 grupos para resolverlo por horas gratuitas.

**[Estimate]** Manteniendo el ingreso y los costos completos, recuperar solo el CAC del grupo exige `40.000 / 1.037,50 = 38,55`: **39 ciclos**. Con la asignación comercial del piloto, `(40.000 + 14.814,81) / 1.037,50 = 52,83`: **53 ciclos**, antes de fijos. No hay evidencia de semejante vida de cliente. Si el comercio atendiera muchos más grupos, aun el piso de 39 ciclos seguiría sin validar.

**[Estimate]** Para que tres ciclos recuperen ambos CAC, el soporte tendría que costar menos que cero con la compra base: aun con soporte de junta cero, la contribución máxima es $ 11.037,50/ciclo y tres ciclos aportan $ 33.112,50, debajo de $ 54.814,81 de adquisición asignada. Bajar soporte por sí solo no arregla esa cohorte; también deben mejorar compra/CPA, repetición o adquisición efectiva.

## 8. Cuándo podrían cobrar los fundadores

**[Assumption]** Desde **mes 13, octubre de 2027**, únicamente con fondeo cerrado y puertas del piloto cumplidas: tres remuneraciones de **$ 750.000/mes por persona a precios de oct-2026**, más 30% de provisión por costos asociados. Total empresarial **$ 2.925.000/mes**, $ 35.100.000/año a precios de octubre. La provisión del 30% no es una determinación de cargas legales ni asegura ese sueldo de bolsillo; definir modalidad y costo total con contador.

**[Estimate]** En mes 13, el equivalente nominal de referencia por persona es **$ 940.051** y el costo total de las tres remuneraciones, **$ 3.666.199/mes**. Mantener el mismo valor real lleva la nómina nominal a **$ 48.895.810 en año 2** y **$ 61.286.082 en año 3**. No se paga un retroactivo ficticio por el año 1.

**[Opinion]** Ningún escenario planteado paga esos sueldos solo con su operación dentro de treinta y seis meses. El base necesita **$ 72,2 millones nominales acumulados hasta mes 24, con 20% de colchón**, contando año 1 y el primer año de remuneraciones. Si ya se consiguió el tramo inicial de $ 7,3 millones, falta un pre-seed de aproximadamente **$ 64,9 millones**. Sin ese cierre, se posponen remuneraciones, se reduce dedicación o se detiene; no se devengan sueldos sin caja para fingir runway.

**[Assumption]** Capacidad salarial de planificación: tres personas × 150 h/mes = 450 h, con al menos 100 h/mes reservadas para producto, administración y revisión. Los máximos de carga deben calcularse con picos de cohortes, no solo promedios. Cualquier excedente requiere contratación y nueva caja; no se resuelve clasificándolo como «lo hace el agente».

## 9. Contraste de supuestos con benchmarks

| Familia de supuestos | Contraste y flag |
|---|---|
| Comisión 10%, servicios 6–10%, físicos 2–4% | **[Data]** Referencia marketplace: take rate 10–25%, alerta <5%. **[Opinion]** Base dentro del rango sobre ventas; servicios parcialmente por debajo; físico fuera y bajo umbral de alerta. No equivale a rentabilidad de toda la junta. |
| Soporte 2 h, conciliación 6 min/compra, hora $ 5.000, costo de red/rampa/IA | **[Data]** Sin benchmark numérico de afiliación comparable en el archivo provisto. **[Opinion] Yellow:** medir todo y cotizar consumos; no atribuir margen SaaS a este servicio. |
| CAC $ 8.000/miembro y $ 26.666,67/comercio | **[Data]** Sin rango local comparable de marketplace/afiliación. **[Opinion] Red:** el problema se prueba con la propia contribución: 39–53 ciclos para recupero; no se usa el límite SaaS de 24 meses como regla universal. |
| Fijos, legales/contador, INPI, seguridad, desarrollo, remuneraciones y provisión 30% | **[Data]** La guía no contiene rangos aplicables. **[Opinion] Yellow:** presupuestos sin cotización; no son aranceles, mínimos legales ni salarios de mercado verificados. |
| Ajustes 5%, reserva fiscal 5%, inflación 1,9%, plazo de cobro | **[Data]** Sin benchmark aplicable de afiliación en la referencia. **[Opinion] Yellow:** reservas que pueden ser insuficientes; requieren ventas y liquidación fiscal reales. |
| Vida de grupos y oferta comercial | **[Data]** Marketplace: churn de oferta <5% mensual; alerta >10%. **[Opinion] Yellow:** desconocido. Los 53 ciclos de recupero no constituyen una vida de cliente asumida. Medir baja y reposición antes de anualizar. |

**[Opinion] Próximo paso:** conseguir cotizaciones de legal/contador, marca, firma/infra y seguridad; abrir un registro único de minutos por tarea y cohorte; contrastar desembolso y costo completo en las primeras ventas. No bajar CAC eliminando horas del cálculo ni prometer treinta minutos antes de medirlos.

## Flags

**Red Flags:**

- **[Estimate]** La cohorte base a tres ciclos pierde $ 51.702,31 por grupo después de ambos CAC asignados, antes de fijos. **[Opinion]** Escalar esa economía no la corrige.
- **[Opinion]** El equilibrio completo teórico excede la capacidad de tres personas a dos horas de soporte; requiere cambiar operación y volver a presupuestar.
- **[Data]** Revisión jurídica/fiscal y firma integrada siguen pendientes en producto. **[Opinion]** Si aparece capital regulatorio o custodia, no está financiado por estos costos de puesta en marcha.

**Yellow Flags:**

- **[Opinion]** Caja positiva sin sueldos no paga las horas de fundadores, captación o desarrollo ya aportados.
- **[Opinion]** Nombre, INPI, tarifas, impuestos y presupuestos no están confirmados; pueden exigir más capital.
- **[Opinion]** Soporte de inconclusos, picos simultáneos y altas fallidas pueden elevar los costos; una media calculada solo con éxitos los ocultaría.

## Fuentes

- Consigna del fundador del 2026-10-25: base, soporte, CAC, ausencia de sueldos y fondeo. Fuente interna sin partes de horas ni cotizaciones adjuntas.
- [Modelo de negocio](../02-strategy/business-model.md), costos y CAC; [D1, canales](../01-discovery/raw/channels.md), origen de la hora y del desglose de captación.
- [Mercado](../01-discovery/market-analysis.md), [tablero](../01-discovery/confidence-dashboard.md) y [Research Gate](../01-discovery/research-gate.md): límites fiscales, riesgos y presupuesto de cumplimiento heredado. No se convierte el rango histórico en dólares a pesos sin tipo de cambio.
- [MVP](../04-product/mvp-definition.md), [priorización](../04-product/feature-prioritization.md) y [recorrido](../04-product/user-journey.md): esfuerzo, puertas, firma y registro de atención/conciliación.
- [Nombres](../03-brand/naming.md), [personalidad](../03-brand/brand-personality.md), [misión y valores](../03-brand/mission-vision-values.md) y [tono](../03-brand/tone-of-voice.md): marca sin resolver y transparencia sobre costos y deuda.
- Referencias leídas: `C:/Users/Usuario/.claude/plugins/cache/startup-skill/startup/a5f97c317b93/startup-design/references/honesty-protocol.md` e `industry-benchmarks.md` («Marketplace / Platform»; sin tabla específica de afiliación).
- [Ingresos](revenue-model.md) y [proyecciones](projections.md): convenciones y caja. Presupuestos y cálculos propios de Etapa A, sin búsquedas web, tarifas oficiales nuevas ni conclusión legal propia.
