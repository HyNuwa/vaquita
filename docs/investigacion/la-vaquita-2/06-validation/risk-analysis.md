# Riesgos — qué puede hacer caer la tesis

**Fase:** 8 — Validación
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Media sobre mecanismos de riesgo; Baja sobre su frecuencia y pérdida esperada

---

## Lectura y escala

**[Opinion]** El riesgo principal es económico: aun con compras supuestas, la contribución completa no recupera captar los dos lados. Demanda, encuadre jurídico y firma son puertas adicionales; ninguna se compensa promediando puntajes favorables de tecnología o mercado. La [scorecard](scorecard.md) da **4,0/10** y recomienda validar antes de comprometer expansión.

**[Data]** No hay entrevistas ni cohortes propias en los insumos. **[Opinion]** Las probabilidades de la matriz son juicios ordinales sobre que el riesgo se materialice durante demo/piloto: 1 muy baja, 2 baja, 3 media, 4 alta, 5 muy alta. No son porcentajes medidos. Impacto: 1 menor, 2 retrabajo acotado, 3 retrasa una cohorte, 4 obliga a cambiar producto/canal, 5 impide operar o vuelve inviable la tesis. Prioridad = P × I: 15–25 crítica, 8–14 alta, 1–7 seguimiento. No equivale a pérdida monetaria esperada.

## Matriz probabilidad × impacto

**[Opinion]** Todos los valores P/I, prioridades y mitigaciones son análisis propuesto. Los hechos de base se atribuyen por fila; las señales son observables para decidir en [E1–E5](validation-playbook.md), no resultados ya detectados.

| ID / categoría | Riesgo y evidencia de base | P | I | P×I | Mitigación concreta | Señal temprana y puerta |
|---|---|---:|---:|---:|---|---|
| R01 · Mercado | Dolor local o pagador inexistente para el paquete. **[Data]** Cero entrevistas; brief/público. | 4 | 5 | **20** | E1: diez comercios, ≥8 independientes, más 5–10 organizadores/integrantes; conducta pasada antes de propuesta. | Menos de tres aceptaciones completas o nadie tomó medidas para resolver el problema. K1; problema de E1. |
| R02 · Mercado | Sustituto gratuito y último turno sin beneficio. **[Data]** Chat, Mercado Pago y Naranja X relevados; preferencia propia desconocida. | 4 | 4 | **16** | E2: comparar alternativa real y turno final; E4/E5: ahorro neto, tiempo y motivos de no repetir. | Solo quieren primer turno, precio directo mejor, grupo incompleto después de 14 días. K3. |
| R03 · Mercado | Mercado atendible sobreestimado y salto físico→digital. **[Data]** Findex no ponderado; contactos familiares físicos, sin oferta digital validada. | 4 | 4 | **16** | E1 por rubro; E5 réplica fuera de familia. Reconstruir tamaño desde grupos accesibles y pagadores, no desde habitantes o usuarios cripto. | Aceptan solo familiares o físicos al 2–4%; no hay organizador/proveedor digital. No extrapolar a LatAm ni abrir pauta. |
| R04 · Producto | Se confunde automatización con garantía o cobrar con dejar de deber. **[Data]** Producto exige deuda y faltantes visibles; comprensión sin probar. | 4 | 5 | **20** | E2: explicación con palabras propias, cobro parcial y rechazo; 5/5 antes de activar. | «Si otro no paga me cubre la app» o «ya cobré, terminé». K3. |
| R05 · Producto | Impago poscobro sin cobertura; revocar acceso no repone fondos. **[Data]** No hay garantía ni rescate en MVP; finanzas excluye ese capital. | 4 | 5 | **20** | E2 explica exposición; E4 registra obligaciones y aplica reglas de suspensión; E5 observa repetición. Sin grupos abiertos ni promesa de recuperación. | Faltante tras cobrar, presión para que el equipo complete cuotas, deuda no saldada siete días después del cierre. K5. |
| R06 · Producto | Metas libres dispersan compra; descuento aparente y atribución insuficiente. **[Data]** Compra opcional, ticket $ 100.000 y conversión 30% son supuestos. | 4 | 5 | **20** | E1 oferta por necesidad; E4 compara contado y conserva compra aparte; E5 reporta compra por turno y atribución hasta último beneficiario. | Nadie compra, promoción pública igual/mejor, cookie vence antes del turno; <5/15 y luego <9/30. K6. |
| R07 · Negocio | Único ingreso sin precedente vivo acreditado. **[Data]** Money Fellows cobra al usuario; continuidad/causa de aparente inactividad de Hacé Una Vaquita no confirmadas. | 4 | 5 | **20** | E4/E5: pedido, pago, entrega, devolución y CPA cobrado; sin sumar abonos o cobros al participante descartados. | Convenios sin ventas, ventas sin comisión, comercio exige cinco compras o subsidio. K1/K6. |
| R08 · Negocio | Margen comercial insuficiente o canibalización. **[Estimate]** Descuento 10% y CPA 10% dejan 81% del contado antes de otros costos, no rentabilidad. | 4 | 4 | **16** | E1 calcula costo marginal y precio real por rubro; E4 registra origen del cliente, impuestos y neto. | Solo aceptan comisión quitando descuento; costos superan neto; cliente ya comprado captado por canal habitual. No contar aceptación incompleta. |
| R09 · Negocio | Nombre confundible: Vaqi suena como Vaki en CO/MX; La Vaquita también tiene coincidencias. **[Data]** Naming lo registra como pendiente. | 4 | 4 | **16** | E2 dictado con diez personas; E4 revisión fonética/marcaria INPI y, por expansión, SIC/IMPI. Mantener nombre de trabajo sin difusión amplia. | ≥5/10 escriben Vaki/variante homófona o revisión detecta antecedente incompatible: cambiar candidato; no registrar por entusiasmo. |
| R10 · Negocio | Diferencial débil frente a TesorerIA y AjoAI. **[Data]** El relevamiento muestra gastos comunes en uno y agente+ROSCA+ERC-8004 en otro; uso declarado sin auditoría. | 4 | 4 | **16** | E2 compara tareas con fichas neutrales; demo muestra deuda posterior, firma propia y compra libre. Declarar si comercio es solo ejemplo. | Público lo resume como «otro bot de plata grupal» o el pitch depende de «primero/único». Cambiar relato y probar valor, sin copiar métricas de tracción. |
| R11 · Equipo | Nadie asume ventas/entrevistas; Maxi concentra producto y entrega. **[Data]** Tres técnicos, salida de Santos y sin rol comercial en brief/equipo. | 4 | 5 | **20** | Antes de T0, responsable nominal y horas; Maxi coordina, Maxi/Daniel pueden entrevistar. Registrar comercial como costo y recortar construcción para reservar tiempo. | Agenda sin entrevistas, E1 se vuelve a postergar o todo depende de una persona. No activar piloto sin dueño y disponibilidad. |
| R12 · Equipo | Alcance de ~45 días-persona frente a ~30 efectivos. **[Estimate]** Brecha de 15 días-persona; producto. | 5 | 4 | **20** | E2 revisa alcance diario; E3 al 27/10. Alta asistida, un formato de reglas, cuatro consultas, oferta de ejemplo y DIRECT_P2P si pasa controles; conservar revisión/video. | Pendiente supera capacidad remanente; desvío >2 días-persona al 1/11; firma sin camino al 28/10. K2. |
| R13 · Finanzas | CAC mayor que LTV de contribución. **[Estimate]** Tres ciclos: $ 3.112,50/grupo frente a $ 54.814,81 de captación asignada; 53 ciclos de recupero. | 5 | 5 | **25** | E5: caja y horas de ambos lados, repeticiones completadas y contribución completa; no crecer con base vigente. Medir mejoras de adquisición, compra y operación sin acumular optimismos. | Más grupos agrandan pérdida; solo baja el CAC al borrar horas; cociente de recupero <1. K7. |
| R14 · Finanzas | Caja/fondeo insuficiente; trabajo gratuito confundido con margen. **[Data]** Saldo real y premios/grants/pre-seed comprometidos no informados. **[Estimate]** Base requiere $ 7,3 M para año 1 sin sueldos; ningún escenario paga la estructura con tres remuneraciones dentro de 36 meses. | 4 | 5 | **20** | E4/E5 liberan gasto por puertas, cotizan únicos y calculan caja por fecha. Financiar solo con recursos disponibles/comprometidos cobrables a tiempo; no usar cuotas ajenas. | Facturas vencen antes de premio/grant, caja no cubre cierre/devoluciones del tramo, nómina se activa sin capital. K7. |
| R15 · Finanzas | Ajustes, impuestos, inflación o demora destruyen la escasa contribución. **[Assumption]** 5% de ajustes, reserva fiscal 5%, inflación 1,9% y cobro al mes siguiente, sin datos propios. | 4 | 4 | **16** | Contador en puerta E4; contratos con base/plazo y seguimiento E5. Separar devengado/cobrado, IVA y reserva; presupuestar precios constantes y caja nominal. | CPA incluye impuesto no trasladable, atrasos de liquidación, ticket real baja o soporte supera ~2 h 12 min de junta/ciclo. Recalcular; K6/K7. |
| R16 · Regulación | IGJ también para servicios; separar compra no acredita exclusión. **[Data]** Síntesis regulatoria con textos/vigencias pendientes y sin evaluación del caso. | 3 | 5 | **15** | E4: profesional revisa flujo, publicidad, quién arma grupos y nexo económico. Revisar alternativa dentro del presupuesto; no exigir promesa de «cero regulación». | Requiere autorización/capital no financiados o cambiar flujos para comprar obligatoriamente. K4. |
| R17 · Regulación | PSAV/control efectivo, consumo, privacidad y fiscalidad mal encuadrados. **[Data]** Firma individual no es dictamen; revocación del curso y deudas públicas tienen riesgos señalados. | 3 | 5 | **15** | E4 jurídico/fiscal y seguridad: claves/permisos, operación del agente, reembolsos, datos mínimos y acceso. No usar umbral UVA como permiso universal. | El equipo puede disponer fondos del miembro, venta condiciona junta, términos permiten sanción cruzada o enlace revela deuda. K4/K5. |
| R18 · Técnica | Firma integrada no conserva CIP-64/tag o recuperación/control. **[Data]** Pipeline local actual y puerta del 27/10 en producto. | 4 | 5 | **20** | E3: dueño firma/rechaza, bytes e intención verificados, dos navegadores, recuperación. DIRECT_P2P solo si conserva todos los controles. | SDK «EVM» ignora feeCurrency, wrapper pierde atribución, se necesita clave en servidor o firmar por otro. K2. |
| R19 · Técnica | Doble pago, conciliación errónea, pérdida de persistencia, acceso indebido o límites eludidos. **[Data]** Producto marca concurrencia/recuperación pendientes; aporte base $ 25.000 supera tope $ 5.000. | 3 | 5 | **15** | E3 fallos/reinicios/idempotencia; E4 restauración, pertenencia, relectura y política por firmante explícita. Ledger único; apps no hablan a Celo por fuera del core. | Timeout lleva a otro pago, evento salda deuda equivocada, base cambia tras reinicio, aparece segundo ledger o se fracciona cuota. Bloqueo inmediato y K5. |
| R20 · Técnica | Entrada/salida wARS y proveedor/plataforma fallan en uso real. **[Data]** Rampa completa no probada; MiniPay no lista wARS en el relevamiento, MetaMask descarta feeCurrency; canal web elegido evita depender de bots TON/Stars. | 4 | 4 | **16** | E3 celular; E4 ARS→wARS→firma→recepción→ARS, elegibilidad, mínimos, costos y contingencia sin custodia. | Funciona escritorio pero no retorno desde WhatsApp; beneficiario o comercio no puede retirar; costo absorbe descuento. No activar aportes externos hasta resolver. |

## Impacto concreto del impago

**[Estimate]** Con cinco personas y aporte $ 25.000, quien cobra primero recibe cuatro aportes, **$ 100.000**, y sigue debiendo **$ 100.000** a los cuatro beneficiarios siguientes. Si no vuelve a pagar, cada uno tiene un faltante de $ 25.000 salvo recupero; no es una predicción de mora, es exposición nominal. Un curso suspendido, una reputación o un registro de agente no reponen ese dinero.

**[Opinion]** Se acepta para investigar que los pares soportan riesgo sin garantía, con comprensión y reglas explícitas. No se acepta volver invisible esa exposición ni convertir al equipo en rescatista. Un incidente monetario o de acceso frena nuevas operaciones afectadas aunque el promedio de cumplimiento sea alto. La revisión de K5 protege primero a quienes ya asumieron obligaciones.

## Qué resolver antes del 9/11 y qué queda para piloto

| Antes del hackathon | Antes/durante el piloto |
|---|---|
| **[Assumption]** R12/R18/R19: firma al 27/10, contingencia hasta 28/10, aporte real del equipo controlado, persistencia y acceso; identidad y evidencia completa antes del 4/11. | **[Assumption]** R01–R08/R11: retomar E1, prueba independiente E2, grupo completo, venta opcional y CPA cobrado. |
| **[Assumption]** R09/R10: usar nombre de trabajo, sin afirmar disponibilidad; pitch que distingue turnos/deuda de gastos comunes y reconoce precedentes ROSCA. | **[Assumption]** R09/R16/R17/R20: revisión marcaria/jurídica/fiscal y rampa completa antes de aportes externos. |
| **[Opinion]** La demo puede usar oferta de ejemplo y cinco posiciones de ensayo; no necesita simular que hubo entrevistas o cinco usuarios independientes. | **[Assumption]** R13–R15: economía completa, repetición, caja y capacidad medida por cohortes. No declarar retención por acelerar rondas. |

## Seguimiento y riesgo residual

**[Assumption]** Maxi mantiene la decisión de puertas; Esteban aporta evidencia de firma/conciliación; Daniel puede concentrar notas y casos. Cada riesgo crítico necesita una persona responsable, próxima fecha y enlace a evidencia antes de declararlo mitigado. Es una propuesta, no una reasignación del repo. Una revisión profesional puede reducir incertidumbre regulatoria, pero no elimina incumplimiento ni acredita demanda.

**[Opinion]** Bajar P requiere observaciones nuevas, no cambiar la descripción. Con una cohorte chica se aprende mecanismo y operabilidad; no se prueba una tasa de fraude, mora o retención poblacional. «Sin incidentes» tiene que acompañarse de cantidad de personas, operaciones y duración observadas. Un caso familiar no reduce automáticamente riesgo de réplica.

## Flags

**Red Flags:**

- **[Estimate]** R13 tiene la prioridad máxima: la base pierde después de captar; soporte cero por sí solo tampoco recupera ambos CAC en tres ciclos.
- **[Opinion]** R04/R05/R16–R19 pueden bloquear el flujo aun con aceptación comercial: riesgo no comprendido, faltante sin cobertura, encuadre incompatible o firma insegura.
- **[Data]** Faltan entrevistas, rol comercial, caja confirmada y prueba técnica integrada; no hay piloto validado al 25/10.

**Yellow Flags:**

- **[Opinion]** Mercado de nicho sin medición atendible, sesgo familiar, homofonía Vaqi/Vaki y rivales del mismo track reducen la defensa comercial.
- **[Opinion]** Asignar un riesgo no lo mitiga; presupuestar legal/seguridad no equivale a haber obtenido revisión o autorización.

## Fuentes

- [Brief](../00-intake/brief.md), [progreso](../PROGRESS.md) y [Research Gate](../01-discovery/research-gate.md): estado y banderas originales.
- [Tablero de confianza](../01-discovery/confidence-dashboard.md), [mercado](../01-discovery/market-analysis.md), [público](../01-discovery/target-audience.md), [competencia](../01-discovery/competitor-landscape.md) y [tendencias](../01-discovery/industry-trends.md): límites y antecedentes heredados; no nueva conclusión jurídica.
- Estrategia completa: [lienzo](../02-strategy/lean-canvas.md), [modelo](../02-strategy/business-model.md), [propuesta](../02-strategy/value-proposition.md), [posicionamiento](../02-strategy/positioning.md), [salida](../02-strategy/go-to-market.md).
- [Naming](../03-brand/naming.md); producto: [MVP](../04-product/mvp-definition.md), [priorización](../04-product/feature-prioritization.md), [recorridos](../04-product/user-journey.md).
- Finanzas Etapa A: [costos](../05-financial/cost-structure.md), [ingresos](../05-financial/revenue-model.md), [proyecciones](../05-financial/projections.md). La contribución financiera posterior reemplaza la cuenta parcial de $ 3.250 de estrategia.
- [Experimentos](validation-playbook.md), [criterios de corte](kill-criteria.md). Marco provisto: `startup-design/references/honesty-protocol.md` y `output-specs.md`, «Phase 8», bajo la ruta local indicada en el plan. Sin búsquedas web nuevas.
