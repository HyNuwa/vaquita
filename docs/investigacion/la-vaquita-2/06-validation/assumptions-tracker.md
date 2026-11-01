# Registro de supuestos — evidencia pendiente, sin dar pruebas por hechas

**Fase:** 8 — Validación
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Baja en los supuestos comerciales, operativos y financieros

---

## Cómo usar el registro

**[Data]** El brief registra cero entrevistas y las finanzas siguen en Etapa A. **[Opinion]** Un supuesto repetido en intake, estrategia y finanzas sigue teniendo un solo origen. Un repo o una fórmula correcta no validan demanda, ventas ni vida de cliente. Los umbrales propuestos están fijados en [experimentos](validation-playbook.md) y [criterios de corte](kill-criteria.md).

**[Opinion]** Estados para futuras actualizaciones: **sin probar**, **en prueba**, **validado** e **invalidado**, siempre indicando población, período y evidencia. En esta entrega no se cambia un estado a «en prueba» por haber diseñado el experimento. Confianza Alta exige evidencia directa convergente en ese alcance; Media admite respaldo parcial; Baja indica ausencia de prueba propia o extrapolación crítica. Una cuenta desfavorable cuestiona el supuesto, pero no se presenta como resultado empírico.

## Tabla de supuestos críticos

**[Assumption]** Cada enunciado de la primera columna es una hipótesis pendiente, salvo las expectativas rechazadas explícitamente al final. Referencias E1–E5: plan; K1–K7: cortes. Las métricas futuras conservan familiares/independientes, rubros, turnos y cohortes separados.

| ID · supuesto | Confianza actual y motivo | Método de prueba / evidencia necesaria | Estado al 25/10 |
|---|---|---|---|
| A01 · Comercios pagan descuento + ventas escalonadas individuales + CPA + devoluciones. | Baja: ninguna aceptación propia. | E1: 10 comercios, ≥8 independientes; ≥3 aceptaciones escritas completas. <3 obliga a abandonar híbrido, K1. | Sin probar; entrevistas pospuestas. |
| A02 · Organizadores/integrantes tienen el mismo dolor frecuente y ya intentan resolverlo. | Baja local: testimonios externos y personas ficticias. | E1: 5–10 personas, al menos 3 organizadores; ≥80% dolor espontáneo y ≥40% pago/solución propia/búsqueda activa. | Sin probar. |
| A03 · Un organizador completa cinco lugares sin subsidio ni captación individual costosa. | Baja: acceso informado solo a dos comercios familiares. | E1 identifica candidatos; E4: grupo aceptado en 14 días, horas y rechazos completos; K3. | Sin probar. |
| A04 · Cuatro aportes de $ 25.000 y calendario semanal son sostenibles para cada miembro. | Baja: base financiera, no ingreso verificado. | E1 conducta y alternativas; E2 compromiso; E4 cinco aceptaciones/capacidad y cumplimiento posterior. No pedir información financiera personal para publicarla. | Sin probar. |
| A05 · El último turno encuentra valor sin premio ni garantía. | Baja: no hay observaciones por turno. | E2 compara alternativa y razones; E4/E5 registran rechazos, cambios de turno y repetición. | Sin probar. |
| A06 · Se entienden aporte, turno, deuda, faltante, compra opcional y costos externos. | Baja: solo recorrido diseñado. | E2: 5/5 explican seis puntos críticos; una corrección y nueva prueba. K3. | Sin probar. |
| A07 · La web compartida por WhatsApp reduce fricción frente al chat/planilla. | Baja: canal elegido, preferencia no medida. | E2: ≥4/5 sin ayuda y ≥3/5 con diferencia relevante/siguiente paso; E3/E4 celular y rampa. | Sin probar. |
| A08 · Vaqi se escribe y recuerda sin confundirse con Vaki. | Baja: homofonía ya advertida en naming. | E2 dictado sin logo con 10 personas; ≥5/10 grafías Vaki/homófonas rechaza candidato. | Sin probar; señal documental adversa. |
| A09 · Vaqi puede usarse/protegerse en AR y en expansión CO/MX. | Baja: sin consulta registral acreditada. | Puerta previa E4: INPI, búsqueda fonética y revisión profesional; SIC/IMPI antes de expansión. Revisión adversa implica otro nombre. | Sin probar. |
| A10 · El diferencial importa frente a TesorerIA, AjoAI y sustitutos habituales. | Baja comercial: precedentes técnicos sí relevados. | E2 fichas neutrales, comprensión de diferencia y conducta siguiente; E5 repetición. No medir preferencia por logo. | Sin probar. |
| A11 · Una firma integrada preserva control, recuperación, CIP-64 y tag. | Baja: el código observado por producto firma localmente. | E3 al 27/10, contingencia 28/10; evidencia de dueño, rechazo, recuperación y operación efectiva. K2. | Sin probar en el flujo elegido. |
| A12 · DIRECT_P2P vincula cada pago a la obligación correcta sin ambigüedad. | Media como diseño: hay motor; falta integración. | E3 eventos repetidos, deudas similares, timeout y reinicio; E4 restauración y revisión independiente. | Sin probar de punta a punta. |
| A13 · Persistencia, acceso por pertenencia y concurrencia soportan operación real. | Baja: brechas documentadas por producto. | E3 fallos locales; puerta E4 restaura y reconcilia sin doble pago ni lectura de otro círculo; K5. | Sin probar. |
| A14 · El piloto de $ 25.000 por aporte puede operar con una política aprobada y ledger único. | Baja: hoy supera tope $ 5.000 del agente. | E4 revisión de alcance por firmante, límites, concurrencia y trazabilidad; no elusión por fraccionamiento. | Sin probar; límite actual adverso documentado. |
| A15 · ARS↔wARS/Celo es accesible y económicamente tolerable para miembro y comercio. | Baja: anuncio/rampa no son ensayo completo. | E4 ingreso, firma, recepción y retiro con mínimos, costos, tiempos y elegibilidad de ambos lados. | Sin probar. |
| A16 · El flujo separado puede operar con encuadre jurídico financiable. | Baja: separar es mitigación, no exención acreditada; IGJ incluye servicios en relevamiento. | E4 evaluación escrita IGJ/PSAV/consumo/datos/publicidad y obligaciones; K4. | Sin probar; revisión pendiente. |
| A17 · El grupo acepta riesgo sin cobertura y puede continuar sin rescates. | Baja: no hay círculo propio a frecuencia real. | E2 comprensión; E4 19/20 a término como meta y 20/20 saldadas; E5 réplica. K5. | Sin probar. |
| A18 · Descuento incremental y CPA dejan margen al comercio. | Baja: benchmarks ajenos. | E1 ficha de neto contra canal marginal; E4 venta y costos/devolución reales, sin subsidio. | Sin probar. |
| A19 · CPA digital 10–15% o servicios 6–10% se cobra sobre ticket final con impuestos acordados. | Baja: precios decididos, no negociados. | E1 aceptación por rubro; E4 contrato/liquidación, no convenio genérico. | Sin probar. |
| A20 · Ticket final $ 100.000 coincide con una necesidad y dinero disponible. | Baja: supuesto base. | E1 compra prevista; E4 precio descontado, origen de fondos y capacidad; no usar ticket $ 400.000 para mejorar ingresos. | Sin probar. |
| A21 · Compra opcional llega al 30% de oportunidades previstas. | Baja: no hay compras propias. | E5: primer corte 5/15; una corrección, cierre acumulado ≥9/30. Reportar también sobre cobros completos y por turno; K6. | Sin probar. |
| A22 · Atribución cubre toda la vigencia y genera CPA cobrable. | Baja: no hay módulo/operación comercial demostrada. | E4/E5: código por miembro/ciclo, pedido, pago, entrega, devoluciones y comisión cobrada; probar turno tardío. | Sin probar. |
| A23 · Ajustes del CPA son ≤5% y cobro tarda un mes. | Baja: reserva y plazo supuestos. | E4 contrato; E5 ajustes en pesos/compras y demora real por cohorte. Mostrar pendientes; reemplazar hipótesis con conteos. | Sin probar. |
| A24 · Variables de caja $ 1.000/círculo y $ 500/compra alcanzan. | Baja: sin tarifas ni consumos propios. | E3/E4 costos externos; E5 factura/consumo real, reintentos y costos absorbidos, sin duplicar infraestructura. | Sin probar. |
| A25 · Dos horas de soporte de junta más 0,1 h por compra reflejan la operación. | Baja: no hay partes de horas adjuntos. | E4/E5 cronómetro por tarea; incluir inconclusos. Meta de junta ≤30 min, comercial separado y total humano combinado. | Sin probar; automatización sin medir. |
| A26 · El organizador ahorra ≥30% de tiempo sin trasladar todo al equipo. | Baja: no hay línea de base. | E1 reconstruye último ciclo; E2 tareas comparables; E4/E5 minutos antes/después y calidad/casos abiertos. | Sin probar. |
| A27 · CAC completo $ 8.000/miembro y $ 26.666,67/comercio es alcanzable. | Baja: escenarios de captación, sin activaciones. | E1/E4/E5 caja+horas desde primer contacto, rechazos y reposiciones; grupo/organizador son la misma bolsa. Comercio se activa con primera venta y CPA cobrado. | Sin probar. |
| A28 · Repetición observada puede recuperar ambos CAC. | Baja, con evidencia matemática adversa: la base exige 53 ciclos. | E5 contribución acumulada y ciclos completados, CAC asignado una vez; ratio ≥1 antes de ampliar. K7. | Sin probar empíricamente; base de tres ciclos no recupera. |
| A29 · Se repite y recomienda fuera de la familia. | Baja: no hay grupos independientes ni elegibles. | E5 otros dos organizadores/diez personas distintas; un segundo ciclo empezado y completado; nuevo organizador separado de completar el grupo actual. | Sin probar. |
| A30 · El mercado accesible permite más que un piloto local. | Baja: TAM/SAM son techos ilustrativos. | E1 lista de candidatos/rubros accesibles y causas de rechazo; E5 réplica, oferta renovada y canal; luego nueva estimación desde cohortes. | Sin probar. |
| A31 · Hay persona y horas comerciales para ejecutar. | Baja: el equipo no tiene ese rol dedicado. | E1: responsable, agenda y horas previstas; luego entrevistas/contactos efectivos. No sustituir con un agente que simula clientes. | Sin probar; rol ausente en insumos. |
| A32 · El alcance recortado cabe en ~30 días-persona efectivos. | Baja: estimación inicial ~45. | E2 reestimación por tarea/persona, reserva/revisión/entrega incluidas; controles 27/10, 1/11 y 4/11. K2. | Sin probar; brecha de 15 días-persona. |
| A33 · Únicos/fijos y reserva fiscal cubren el costo de operar. | Baja: sin cotizaciones ni encuadre fiscal definido. | E4 cotizaciones jurídico/fiscal, marca, seguridad e infra; E5 real contra presupuesto. 5% fiscal no es alícuota legal. | Sin probar. |
| A34 · Hay fondeo disponible antes de cada compromiso. | Baja: saldo real y aportes comprometidos desconocidos. | E4/E5 calendario de caja, recursos acreditados y gastos hasta cierre; premios/grants/pre-seed separados de CPA. K7. | Sin probar; no equivale a caja real cero. |
| A35 · Se sostienen capacidad operativa y costos cuando crece el volumen. | Baja: el equilibrio completo base excede capacidad del equipo. | E5 horas por cohorte/picos, capacidad remunerada y margen después de adquisición/fijos; contratar solo con nueva caja. | Sin probar. |
| A36 · Inflación 1,9% y actualización de precios mantienen ticket real y margen. | Baja como futuro: presupuesto, no pronóstico. | E1 acepta precio/vigencia; E4/E5 neto por turno, costos reales y fechas de cobro. No indexar obligaciones ya aceptadas. | Sin probar. |

## Expectativas que no se admiten como hipótesis base

| Expectativa | Evidencia y tratamiento |
|---|---|
| «Revocar un servicio o tener reputación cubre al grupo». | **[Estimate]** No hay reposición de los $ 100.000 adeudados por el primer turno base. **[Data]** Producto descarta esa garantía. **[Opinion] Estado: invalidado como mecanismo de cobertura del diseño actual**, por ausencia de reposición y exclusión explícita; no por experimento empírico ni dictamen sobre toda cláusula posible. |
| «Con soporte cero y tres ciclos, la base recupera ambos CAC». | **[Estimate]** Máximo $ 11.037,50/ciclo × 3 = $ 33.112,50 < $ 54.814,81 de captación asignada. **Estado: invalidado para esos parámetros por cálculo**, sin prueba de mercado. |
| «Firma propia o servicios implican exención automática». | **[Data]** Los insumos no acreditan esa conclusión y relevan IGJ también para servicios. **[Opinion] Estado: sin probar como encuadre propio**, excluido como permiso para operar; E4 exige evaluación concreta. |

## Ficha para la próxima actualización

**[Assumption]** Al ejecutar, completá esta ficha en almacenamiento autorizado. No se crean registros personales ni archivos adicionales en esta entrega.

```text
Supuesto ID:
Fecha y cohorte/población:
Experimento y umbral fijado antes de probar:
Método, cantidad de intentos y exclusiones justificadas:
Conteos: numerador / denominador; independientes / familiares:
Evidencia y ubicación privada autorizada:
Resultado: confirmado / contradicho / todavía incierto:
Nuevo estado y confianza, limitados a este alcance:
Decisión, responsable y próxima fecha:
```

**[Opinion]** No mover A01 a validado porque respondan tres familiares, ni A28 porque la contribución sea positiva antes de CAC. Si se cambia oferta, muestra o precio después de conocer resultados, conservar la versión anterior y tratarlo como experimento nuevo; el corte vigente <3/10 no se borra.

## Flags

**Red Flags:**

- **[Data]** Ninguna hipótesis comercial clave tiene prueba propia adjunta. **[Estimate]** Las cuentas base de recupero ya son adversas aun sin datos de mercado.
- **[Opinion]** A01, A11, A16, A17 y A28 pueden bloquear el híbrido por motivos independientes; no se validan por demostrar el motor.

**Yellow Flags:**

- **[Opinion]** La precisión de los importes no aumenta confianza en las hipótesis. Mantener visibles cohortes, pendientes, horas y límites de muestra.
- **[Data]** Marca, responsable comercial, cotizaciones y fondos disponibles siguen pendientes; el registro no los resuelve.

## Fuentes

- [Brief](../00-intake/brief.md), [brainstorm](../00-intake/brainstorm.md) y [progreso](../PROGRESS.md): supuestos y decisiones del fundador.
- [Confianza](../01-discovery/confidence-dashboard.md), [Research Gate](../01-discovery/research-gate.md), [público](../01-discovery/target-audience.md), [mercado](../01-discovery/market-analysis.md), [competencia](../01-discovery/competitor-landscape.md), [tendencias](../01-discovery/industry-trends.md).
- [Modelo de negocio](../02-strategy/business-model.md), [salida](../02-strategy/go-to-market.md), [posicionamiento](../02-strategy/positioning.md); [nombre](../03-brand/naming.md).
- [MVP](../04-product/mvp-definition.md), [priorización](../04-product/feature-prioritization.md), [recorridos](../04-product/user-journey.md); [ingresos](../05-financial/revenue-model.md), [costos](../05-financial/cost-structure.md), [proyecciones](../05-financial/projections.md).
- [Plan](validation-playbook.md), [diseño detallado](experiment-design.md) y [cortes](kill-criteria.md). Guías locales provistas: `startup-design/references/customer-interview.md`, `honesty-protocol.md`, `output-specs.md` («Phase 8»), en la ruta citada en el plan. Sin búsquedas web nuevas ni entrevistas ejecutadas.
