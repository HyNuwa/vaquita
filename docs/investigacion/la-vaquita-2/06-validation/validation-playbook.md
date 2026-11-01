# Plan de validación — primero evidencia, después inversión

**Fase:** 8 — Validación
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Baja sobre demanda y viabilidad; Media sobre el diseño de las pruebas

---

## Punto de partida y reglas

**[Data]** Las entrevistas fueron pospuestas y siguen en cero en el [brief](../00-intake/brief.md). El experimento **E1 es el primero**, sin reemplazarlo por encuestas, respuestas de IA ni pruebas entre los devs. Este documento diseña trabajo futuro: no contacta personas, no ejecuta operaciones ni compromete gastos. No se actualiza PROGRESS porque la consigna limita la entrega a estos seis archivos.

**[Data]** Se conserva el pivote: junta que paga dinero al beneficiario, compra posterior opcional y separada, único ingreso por comisión del comercio —CPA—. Digital 10–15%, servicios 6–10%, físicos 2–4%; participante $ 0 a La Vaquita. Prevalece el producto posterior a estrategia: web móvil/PWA, firma integrada del miembro y enlaces compartidos manualmente por WhatsApp. No se reinstala Telegram ni la revocación de servicios como garantía.

**[Opinion]** Pasar una puerta habilita la prueba siguiente; no valida toda la empresa. Las métricas se fijan antes de empezar, se conservan rechazos y casos inconclusos y se informan numeradores/denominadores. Los umbrales nuevos son **[Assumption]**, decisiones de aprendizaje, no estándares del sector ni probabilidades de éxito.

## Orden de menor a mayor compromiso

**[Estimate]** Presupuestos orientativos: horas y costos unitarios en pesos de octubre de 2026; el sobre anual E5 conserva la caja nominal de finanzas y debe reexpresarse al calendarizarlo. El orden usa el techo de costo completo de cada prueba, no solo desembolsos: E1 hasta $ 100.000; E2 hasta $ 110.000; E3 hasta $ 140.000; E4 alrededor de $ 3,7 M; E5 alrededor de $ 5,1 M adicionales si se ejecuta todo el tramo anual. Los dos últimos incluyen puertas y operación; se fraccionan para poder cortar temprano. No son cotizaciones ni autorizaciones para gastar.

| ID | Prueba | Horizonte | Tiempo y caja incremental estimados | Costo completo estimado |
|---|---|---|---|---|
| E1 | Entrevistas y aceptación del paquete completo | Cuando se retomen entrevistas; no obligatoria antes del 9/11 | 12–16 h; 7–14 días calendario; $ 0–20.000 de caja | $ 60.000–100.000, hora a $ 5.000 |
| E2 | Recorrido sin plata: comprensión, valor, nombre y diferenciación | Demo del 25/10 al 3/11; muestra independiente después de E1 | 12–18 h, incluida preparación; 2–4 días; $ 0–20.000 | $ 60.000–110.000 |
| E3 | Firma integrada y conciliación desde celular | Puerta al 27/10; contingencia hasta el 28/10 | 12–24 h; 2–3 días; $ 0–20.000, incluidos microimportes técnicos y costos de prueba | $ 60.000–140.000; no comprar días adicionales del calendario |
| E4 | Primer círculo real, con puertas jurídica/fiscal, marca y seguridad | Piloto después del hackathon y de E1–E3 | Revisión externa estimada 2–4 semanas; cinco turnos semanales más cierre y liquidación. Caja ≈$ 3,02 M bajo el paquete financiero completo | ≈$ 3,7 M con preparación y horas; liberar por etapas |
| E5 | Réplica independiente, compra y recupero por cohortes | Piloto; controles en 3, 6 y hasta 18 grupos | Varios meses; techo restante del año 1 base ≈$ 3,8 M de caja | ≈$ 5,1 M con horas operativas/comerciales restantes; sujeto a cotizaciones y cortes |

**[Estimate]** E4 toma los $ 2,4 M únicos de finanzas, hasta dos meses de fijos de $ 300.000, $ 16.666,67 de captación de caja asignada a un grupo y $ 1.750 variables: ≈$ 3,02 M. Agrega 14 días-persona de preparación × **6 h** × $ 5.000 = $ 420.000, unas 30 h internas de revisión ($ 150.000), $ 38.148,14 de captación valorizada y $ 10.750 de operación: ≈$ 3,64 M, redondeado a $ 3,7 M. Es un sobre de planificación, no el precio mínimo de aprender con un grupo. El reparto comercial usa la asignación de cartera de finanzas; si se incurre en toda la campaña para solo un grupo, hay que cargarla entera.

**[Estimate]** E5 toma como referencia el resto de los $ 6,82 M de salidas nominales del año 1 de finanzas después de E4; ≈$ 3,8 M de caja. Las horas de captación/operación restantes, valorizadas en pesos de octubre, son `$ 740.000 + 54 × $ 10.750 − $ 38.148,14 − $ 10.750 = $ 1.271.601,86`: ≈$ 1,27 M. El sobre combinado ronda $ 5,1 M, sin ser un flujo homogéneo a una única fecha: requiere reexpresar precios y calendario antes de aprobarlo. No volver a sumar únicos, desarrollo o CAC ya imputados. Producto usa días-persona de seis horas; la valoración financiera de desarrollo usa ocho. Acá se explicita la convención de seis, sin modificar aquella proyección ni sumar ambas valoraciones.

## E1 — Entrevistas: ¿hay problema y pagador?

**[Assumption] Supuesto:** comercios independientes aceptan descuento real, ventas individuales escalonadas, CPA y devoluciones; organizadores tienen un problema frecuente y pueden reunir conocidos con capacidad de aportar.

**Método propuesto:**

1. Congelá una muestra de **10 comercios con ≥8 independientes del equipo**; priorizá digital/servicios y separá físicos como contraste. Entrevistá además **5–10 organizadores o integrantes**, con al menos tres que hayan organizado una junta. No cuentan entrevistas de práctica repetidas ni dos personas del mismo comercio como dos comercios.
2. Hacé conversaciones de 25–30 minutos sobre conducta pasada, sin presentar primero la solución. Pedí consentimiento para notas; solicitá evidencias anonimizadas solo si las quieren mostrar.
3. Después del tramo de descubrimiento, ofrecé condiciones concretas por rubro y registrá el paquete completo por escrito. No preguntes solo «¿lo usarías?» ni prometas compras.
4. Cerrá la muestra y sintetizá por lado, rubro y vínculo. Usá los guiones y fichas de [experiment-design.md](experiment-design.md).

**Métricas:** aceptaciones completas / 10, de las cuales independientes / independientes; dolor espontáneo / personas de cada lado; conducta de pago, solución propia o búsqueda activa; motivos de rechazo; precio y neto comercial; horas y caja desde el primer contacto.

**[Data] Pasa comercial:** ≥3/10 aceptaciones completas con muestra de ≥8 independientes. **No pasa: <3/10 → abandonar el híbrido comercial.** No se reduce CPA por fuera de lo acordado ni se sustituye un rechazo para mejorar el resultado. Tres aceptaciones habilitan venta experimental; no son tres pagadores activados.

**[Assumption] Pasa problema:** ≥80% de organizadores/integrantes relatan el mismo dolor central sin inducirlo y ≥40% ya pagó por algo relacionado, armó una solución propia o buscó activamente alternativas. Con cinco: 4/5 y 2/5; con diez: 8/10 y 4/10. Reportar organizadores e integrantes por separado. Si falla, revisar segmento antes del piloto aunque los comercios acepten. No mezclar estas proporciones con el corte comercial vinculante.

## E2 — Sin plata: ¿entienden el compromiso y vale cambiar?

**[Assumption] Supuesto:** la claridad de reglas y menor trabajo justifican cambiar el chat/planilla; deuda, falta de cobertura y compra opcional se comprenden; el nombre no introduce confusión adicional.

**Método propuesto:**

1. Prepará un prototipo o fichas del recorrido elegido: invitación, reglas, turno, firma/rechazo, recibido/faltante, deuda, consulta al agente y oferta con «Seguir sin comprar».
2. Probá primero con los tres devs para la demo. Cuando se retomen entrevistas, probá con cinco personas independientes de E1; agregá otras cinco para nombre si hacen falta. La pasada interna no cuenta como prueba de clientes.
3. Pedí que expliquen y resuelvan escenarios sin ayuda; compará contra su herramienta actual. Cronometrá acciones y ayuda, no elogios.
4. Mostrá al final una comparación neutral con TesorerIA y AjoAI, basada en la síntesis existente, y probá dictado de «Vaqi» sin logo. Cerrá con revisión del alcance y capacidad real de los tres devs.

**Métricas:** comprensión por pregunta/persona, finalización autónoma, minutos de ayuda, elección del último turno y motivos, ahorro esperado respaldado por una línea de base, dictado y asociación con Vaki, diferencia que identifican frente a alternativas, días-persona pendientes.

**[Assumption] Pasa:** 5/5 explican los seis puntos críticos definidos en el diseño antes de activar un grupo; ≥4/5 recorren el prototipo sin ayuda; ≥3/5 identifican una diferencia relevante con su alternativa y aceptan un siguiente paso fechado, sin comprometer dinero. El alcance recortado debe caber en los ~30 días-persona efectivos, incluida revisión y entrega. **No pasa:** repetir una sola vez con correcciones; si persiste confusión crítica, frenar activación y pivotar mensaje/flujo. Un rechazo del último turno no se arregla pagando un premio.

**[Assumption] Marca:** cinco o más de diez escriben «Vaki» u otra grafía homófona tras escuchar Vaqi → rechazar Vaqi para difusión amplia y abrir otra ronda. La ausencia de ese resultado no acredita disponibilidad jurídica; revisión INPI/SIC/IMPI en la puerta previa de E4. La Vaquita sigue como nombre de trabajo del hackathon.

## E3 — Puerta técnica: ¿firma quien debe firmar?

**[Assumption] Supuesto:** el proveedor integrado permite consentimiento, rechazo y recuperación del miembro, conservando el circuito protegido del core, tag y CIP-64. Los insumos describen firma local actual, no compatibilidad ya lograda.

**Método propuesto:**

1. Esteban prueba firma/lectura; Maxi integra una pantalla mínima. Verificá control de cuenta, recuperación y apertura desde navegador interno de WhatsApp y navegador normal; sin claves en el servidor del equipo.
2. En ensayo y pruebas locales sin red, intentá alterar monto/destinatario/red, rechazar, duplicar evento, cortar conexión y reiniciar. El core tiene que detectar inconsistencias; la web no construye otra ruta de envío.
3. Solo como ejecución técnica controlada y con activación explícita, un integrante firma un microaporte real de **$ 1,00 en wARS** desde su cuenta a otra del equipo. Registrá evidencia de intención, firma, bytes, recibo/evento, conciliación y reinicio. No se ejecuta por escribir este documento.
4. Si el contrato no pasa, probá `DIRECT_P2P` con asociación inequívoca obligación–pago y los mismos controles. Registrá cada intento y costo.

**Métricas:** escenarios críticos aprobados, firmas del dueño / pagos, rechazos sin transmisión, recuperaciones, conciliaciones correctas e idempotentes, fallos por navegador, ayuda y costo. En cada operación verificá Celo mainnet, wARS desde configuración, tag ERC-8021 y CIP-64 con `feeCurrency` aprobada; wARS no paga el costo de red.

**[Assumption] Pasa al 27/10:** todos los controles críticos, firma/rechazo y recuperación probados, más microaporte real conciliado o camino de implementación reproducible sin incompatibilidades pendientes. Este último permite seguir construyendo, **no cerrar la evidencia mainnet**. El aporte real conciliado tiene control intermedio al 30/10 y la evidencia demo completa vence antes del 4/11, según producto. **No pasa:** recortar contrato/accesorios y usar el 28/10 de contingencia; si ninguna firma integrada compatible funciona, bloquear ese alcance. No sustituir por firma del agente, custodia, otra moneda ni una wallet externa presentada como integrada.

## E4 — Piloto de un círculo: del encuadre al CPA cobrado

**[Assumption] Supuesto:** el flujo concreto puede operar dentro del presupuesto, y cinco conocidos pueden completar una junta sin rescate, elegir una compra que convenga y generar una comisión cobrable.

**Método propuesto, por puertas secuenciales:**

1. **Antes de activar aportes ajenos**, obtener evaluación escrita de IGJ —también servicios—, PSAV/control efectivo, consumo, privacidad y publicidad; contador para actividad, factura, base/traslado de impuestos e IIBB. Cotizar seguridad y marca, incluida homofonía Vaqi/Vaki en Argentina, Colombia y México. El presupuesto de únicos no compra autorización. Si el flujo requiere capital regulatorio, custodia, rescates o un costo no financiado, detenerlo y recalcular.
2. Completar recuperación, ingreso y retiro ARS↔wARS, costos/tiempos, acceso por pertenencia, restauración, reintentos y concurrencia. Resolver explícitamente la diferencia entre aporte base $ 25.000 y tope actual $ 5.000; no fraccionar pagos ni duplicar el ledger para eludirlo.
3. Con E1 y E2 aprobados, un organizador reúne cinco adultos con cuota sostenible en hasta 14 días. Antes de activar, todos aceptan versión de reglas y explican deuda/faltante. Acordar una oferta pertinente independiente, con precio comparable, CPA, impuestos, entrega, atribución y devolución; no reservar cinco compras.
4. Completar cinco turnos semanales a frecuencia real; distinguir 20 obligaciones, retrasos, faltantes y cobros parciales. La compra ocurre después y por elección. Conciliar pedido→pago→entrega→devolución→CPA cobrado. Registrar todos los minutos, también de fallos.

**Métricas:** 19/20 obligaciones a término como meta, 20/20 saldadas al cierre; cero rescates del equipo; ahorro neto positivo sobre contado accesible; ventas válidas, CPA devengado y cobrado; demora/ajustes; minutos del organizador y del equipo; incidentes y caja disponible.

**[Assumption] Pasa:** puertas previas resueltas para ese flujo, 20/20 obligaciones saldadas sin rescates, ninguna confusión crítica ni defecto monetario/de acceso abierto, y al menos una venta independiente con ahorro neto y CPA cobrado dentro del plazo contractual. Esto prueba ejecución, no 30% de compra ni una tasa de mora estable. Si no hubo compra, la parte operativa puede pasar y la comercial queda sin validar para E5. Si una deuda persiste siete días después del cierre previsto o exige rescate, suspender nuevas altas y aplicar K5.

## E5 — Réplica y economía: ¿funciona fuera de la familia y recupera captar?

**[Assumption] Supuesto:** otros dos organizadores y diez personas distintas pueden repetir el resultado; compra opcional y menor trabajo producen contribución suficiente para recuperar CAC completo, con repetición observada.

**Método propuesto:**

1. Agregá dos grupos independientes al primero, sin subsidios de cuotas ni compras del equipo. Mantené una oportunidad prevista por miembro/ciclo; no borres suspendidos del denominador.
2. Revisá al completar **15 oportunidades**: para superar 30% hacen falta **5/15**, no 4/15. Si queda por debajo, permití una sola corrección documentada de oferta/atribución y hasta otras 15 oportunidades de círculos distintos o ciclos nuevos; con acumulado <9/30, abandonar el híbrido (K6). No extender indefinidamente la muestra.
3. Medí comienzo y cierre de un segundo y, si corresponde, tercer ciclo de grupos originales. Repetir no crea miembros nuevos. Solo después de pasar compra/cobro y corregir economía puede abrirse, por tandas, el tramo de hasta 18 grupos/90 miembros de finanzas. Diez comercios pagadores son una meta posterior, no condición ya lograda por E1.
4. Calculá contribución después de ajustes, reserva fiscal o impuestos efectivos sin duplicarlos, variables, todo el soporte y conciliación. Comparala con CAC de grupos más captación comercial asignada una sola vez; evaluá recupero con ciclos realmente completados, no vida futura inventada.

**Métricas y pasa/no pasa [Assumption]:**

- Compra válida ≥30% sobre oportunidades previstas, con conteos por turno y también sobre cobros completos; CPA de ventas válidas cobrado dentro del plazo acordado y ajustes informados.
- Al menos un grupo empieza **y completa** un segundo ciclo; registrar cuántos eran elegibles. Otros dos organizadores completan sus primeros ciclos.
- Carga del organizador baja ≥30% contra su línea de base comparable; soporte de junta del equipo ≤30 min por círculo completado como meta, conciliación comercial aparte. Incluir minutos de inconclusos y calidad de resolución.
- Contribución completa >0 y contribución acumulada observada / CAC completo asignado ≥1 para ampliar adquisición; fijos, capacidad y caja se evalúan aparte. Si solo mejora soporte y la cuenta sigue debajo de uno al control fijado en K7, no pasa.

**[Estimate]** La base de finanzas ya muestra el problema: $ 3.112,50 en tres ciclos frente a $ 54.814,81 de captación asignada de ambos lados; cociente ≈0,057. Recupero teórico: 53 ciclos. Incluso soporte de junta cero deja solo $ 33.112,50 en tres ciclos; no recupera esos CAC. Por eso automatizar, ganar un grant o completar un grupo no basta para aprobar E5.

## Calendario y responsables propuestos

| Momento | Trabajo permitido por el diseño | Decisión |
|---|---|---|
| 25–27/10 | E3 técnico; E2 interno y recorte de alcance. E1 sigue pendiente hasta retomarse. | Al 27/10: compatibilidad de firma y carga restante; contingencia hasta 28/10. |
| 29/10–3/11 | E2 interno y recorrido técnico; microaporte del equipo y registro ERC-8004 según plan de producto. | Al 30/10, aporte real conciliado o concentrar reserva; antes del 4/11, obligatorios técnicos y acceso sin defectos críticos. |
| 4–8/11 | Tres pasadas móviles, evidencia y entrega; oferta de ejemplo si no hay acuerdo/venta. | Envío propuesto el 8/11; límite 9/11, 06:00 ART / 09:00 GMT. No afirmar validación de clientes. |
| T0 = entrevistas retomadas | E1 y E2 independiente; preparación de revisión profesional. | <3/10 comercios: se termina el híbrido, aunque la demo funcione. |
| Después de puertas | E4, luego E5 con cortes por cohorte. | No prometer completar ciclos semanales antes del hackathon. |

**[Assumption]** Maxi coordina puertas, presupuesto y revisión comercial; Maxi/Daniel pueden entrevistar y Daniel llevar síntesis/soporte; Esteban verifica firma/pagos. Es una propuesta para coordinar, sin reasignar archivos ni cambiar planes del repo. Antes de T0 tiene que haber **una persona responsable comercial y bloques de horas concretos**; si nadie los toma, E1 no comienza y el piloto no se habilita.

## Flags

**Red Flags:**

- **[Data]** Pagador sin entrevistas y modelo solo CPA sin precedente vivo acreditado; no equivale a probar inexistencia universal ni cierre de Hacé Una Vaquita.
- **[Opinion]** IGJ también puede alcanzar servicios; autocustodia, firma y compra separada no certifican exención. Suspender un servicio no repone plata a los pares.
- **[Estimate]** Economía base no recupera CAC y el alcance estimado de 45 días-persona excede ~30 efectivos. Los presupuestos de prueba no resuelven esos problemas.

**Yellow Flags:**

- **[Opinion]** Sesgo familiar, turno final, confusión Vaqi/Vaki, TesorerIA/AjoAI y falta de rol comercial pueden hacer fallar demanda o ejecución aunque funcione la firma.
- **[Data]** Los costos, caja disponible y cotizaciones no están confirmados. No financiar obligaciones con premios, grants o inversión sin cobrar.

## Fuentes

- [Brief y pivote](../00-intake/brief.md), [brainstorm](../00-intake/brainstorm.md) y [progreso](../PROGRESS.md): decisiones internas, postergación y corte vinculante.
- Discovery: [Research Gate](../01-discovery/research-gate.md), [confianza](../01-discovery/confidence-dashboard.md), [mercado](../01-discovery/market-analysis.md), [competencia](../01-discovery/competitor-landscape.md), [público](../01-discovery/target-audience.md), [tendencias](../01-discovery/industry-trends.md) y [verificación](../01-discovery/verification-report.md). Evidencia heredada, sin actualización externa.
- Estrategia: [modelo](../02-strategy/business-model.md), [salida al mercado](../02-strategy/go-to-market.md), [lienzo](../02-strategy/lean-canvas.md), [propuesta](../02-strategy/value-proposition.md) y [posicionamiento](../02-strategy/positioning.md).
- [Nombre Vaqi](../03-brand/naming.md), [MVP](../04-product/mvp-definition.md), [priorización](../04-product/feature-prioritization.md) y [recorridos](../04-product/user-journey.md): decisiones posteriores y puertas.
- Finanzas Etapa A: [ingresos](../05-financial/revenue-model.md), [costos](../05-financial/cost-structure.md) y [proyecciones](../05-financial/projections.md); sus cifras son hipótesis calculadas, no resultados.
- Referencias provistas y leídas: `C:/Users/Usuario/.claude/plugins/cache/startup-skill/startup/a5f97c317b93/startup-design/references/honesty-protocol.md`, `output-specs.md` («Phase 8») y `customer-interview.md`. Sin búsquedas web nuevas.
