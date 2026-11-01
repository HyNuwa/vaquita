# Priorización y construcción — llegar al 9/11 con evidencia

**Fase:** 6 — Producto
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Media sobre piezas existentes; Baja sobre esfuerzo de firma integrada y plazos externos

---

## 1. Regla de prioridad y unidad de esfuerzo

**[Data]** El alcance de [mvp-definition.md](mvp-definition.md) separa demo del hackathon y piloto comercial. Web responsive/PWA, firma invisible del miembro y enlaces compartidos manualmente por WhatsApp son decisiones tomadas; no se vuelve a evaluar Telegram como canal. Los códigos F, P, O y los dolores D1–D8/C1–C4 son los mismos en los tres entregables.

**[Opinion]** Aplicar dos marcos juntos: MoSCoW fija lo que no puede faltar en cada alcance; RICE ordena conveniencia entre funciones comparables. Las obligaciones del hackathon y la seguridad son restricciones: no se recorta identidad o firma individual porque una oferta tenga mayor puntaje. Las dependencias también preceden al orden numérico.

**[Estimate] Convención de planificación:** un día-persona son seis horas de trabajo concentrado; un mes-persona son veinte días-persona, 120 horas. Los talles incluyen implementación y verificación local de la función, pero no la integración final entre áreas, revisión cruzada, video ni espera de terceros. Son tamaños de trabajo pendiente; el código reutilizable no se vuelve a contar como si hubiera que escribirlo entero.

| Talle | Días-persona de referencia | Meses-persona usados en RICE | Lectura |
|---|---:|---:|---|
| S | **[Estimate] 1** | 0,05 | Cambio acotado o una pieza simple. |
| M | **[Estimate] 2** | 0,10 | Flujo con varias piezas conocidas. |
| L | **[Estimate] 4** | 0,20 | Integración nueva o varios estados críticos. |
| XL | **[Estimate] 8** | 0,40 | Excede un bloque corto; partir antes de comprometerlo. |

**[Assumption]** RICE usa personas únicas afectadas en el primer trimestre del piloto: **15 integrantes, incluidos tres organizadores, y tres comercios**, 18 actores como máximo. Es una cohorte de aprendizaje propuesta, no previsión ni evidencia de demanda. Quince usuarios del hackathon no se deducen de este alcance. No se suman cinco personas por cada turno ni se cuenta de nuevo a quien organiza.

**[Estimate] Fórmula:** `RICE = alcance trimestral × impacto × confianza / esfuerzo en meses-persona`. Impacto: 3 masivo, 2 alto, 1 medio, 0,5 bajo, 0,25 mínimo. **[Assumption]** Confianza = **50% en todas las filas**: no hay datos propios de alcance o impacto para justificar 80%/100%. La existencia de un motor aumenta confianza técnica, pero no valida esos supuestos comerciales. Puntajes expresados con coma decimal.

## 2. Tabla RICE y MoSCoW

**[Opinion]** M = imprescindible; S = debería estar; C = podría estar; W = no entra en ese alcance. Las siglas conservan el nombre del marco MoSCoW y no son talles. «M en piloto» significa necesario antes de operar/medir ese piloto; no promete construcción antes del 9/11. Las filas están ordenadas por RICE descendente; empates no expresan una diferencia probada.

| ID y función | Dolores | Alcance trimestral | Impacto | Confianza | Esfuerzo: talle / meses-persona | RICE | MoSCoW demo | MoSCoW piloto |
|---|---|---:|---:|---:|---|---:|:---:|:---:|
| F03 · Reglas, turnos y deuda aceptados | D2, D4, D5, D8 | 15 | 3 | 50% | M / 0,10 | **225** | M | M |
| F09 · Una oferta opcional separada | D2, D7, C1–C4 | 18 | 1 | 50% | S / 0,05 | **180** | M | M |
| P01 · Venta atribuida y CPA | C1–C3, D7 | 18 | 2 | 50% | M / 0,10 | **180** | W | M |
| P02 · Captación, cohortes y tiempo | D3, D6, C1 | 18 | 2 | 50% | M / 0,10 | **180** | W | M |
| F01 · Invitación y acceso móvil | D1, D6 | 15 | 2 | 50% | M / 0,10 | **150** | M | M |
| F06 · Estado y resumen individual | D1, D3, D4, D6, D8 | 15 | 2 | 50% | M / 0,10 | **150** | M | M |
| F08 · Atraso y derivación humana | D1, D3, D6 | 15 | 2 | 50% | M / 0,10 | **150** | M | M |
| P05 · Entrada/salida y condiciones | D1, D2, D5, D7, C2, C4 | 18 | 3 | 50% | L / 0,20 | **135** | W | M |
| F02 · Wallet invisible y firma | D1, D5 | 15 | 3 | 50% | L / 0,20 | **112,5** | M | M |
| F04 · Pago directo en wARS | D1, D2, D5 | 15 | 3 | 50% | L / 0,20 | **112,5** | M | M |
| F05 · Conciliación persistente | D1, D3, D6 | 15 | 3 | 50% | L / 0,20 | **112,5** | M | M |
| P04 · Operación confiable | D1, D3, D5, D6 | 15 | 3 | 50% | L / 0,20 | **112,5** | W | M |
| F07 · Agente y recordatorios web | D3, D6 | 15 | 1 | 50% | M / 0,10 | **75** | M | M |
| F10 · Identidad y evidencia | D1, transparencia limitada | 15 | 0,5 | 50% | S / 0,05 | **75** | M | M |
| P03 · Cierre y repetición | D4, D6, D8, C3 | 15 | 1 | 50% | M / 0,10 | **75** | W | M |
| O01 · Instalación PWA | D3, D6 | 15 | 0,5 | 50% | S / 0,05 | **75** | C | S |
| O02 · Avisos del sistema | D3, D6 | 15 | 1 | 50% | M / 0,10 | **75** | W | S |
| O03 · Catálogo y alta autoservicio | D7, C1, C3, C4 | 18 | 0,5 | 50% | XL / 0,40 | **11,25** | W | C |

**[Estimate] Ejemplos auditables:** F03 = `15 × 3 × 0,50 / 0,10 = 225`; F04 = `15 × 3 × 0,50 / 0,20 = 112,5`; F09 = `18 × 1 × 0,50 / 0,05 = 180`. **[Opinion]** El bajo esfuerzo hace subir F09, pero no permite construirla antes del estado de cobro ni postergar F02/F04. La identidad F10 es obligatoria por el hackathon aunque su impacto directo estimado sea bajo.

**[Data] MoSCoW W en ambos alcances:** DeFi, token propio, gamificación con valor, comunidades abiertas, préstamos, custodia y bots de Telegram/WhatsApp. **[Opinion]** También quedan fuera garantías o rescates, revocar un curso por mora, comisión al participante, compra obligatoria, débito automático, app nativa y conversión de la junta a otra moneda. No se asigna RICE a funciones excluidas: un puntaje no las habilita.

## 3. Qué existe y qué falta en el repositorio

**[Data]** Inspección de `packages/core/src/` al 25/10/2026. «Existe» significa código leído, no despliegue ni prueba mainnet. `apps/web/` y `apps/bot/` solo contienen README y manifiesto de paquete; la web operativa todavía no está construida.

| Pieza observada | Qué se reutiliza | Qué falta para el producto elegido | Funciones |
|---|---|---|---|
| `junta/rules.ts`, `commitments.ts`, `turn-order.ts` | Reglas, pozo `(N − 1) × aporte`, deuda por turno y búsqueda de órdenes viables. | Interfaz, límite de cinco en la capa de producto, aceptación versionada y autorización. El motor permite más personas; no hace falta reescribir su aritmética. | F03, F06 |
| `junta/obligations.ts` | Libro en memoria, 20 obligaciones con cinco miembros, idempotencia hash/índice de evento, pagos tardíos y suspensión. | Lector/verificador de eventos, vínculo exacto a obligación, persistencia y reconstrucción después de caída. Revisión no tiene todavía un flujo humano de resolución durable. | F05, F08, P03/P04 |
| `junta/defaults.ts` | Escenarios de impago poscobro y posiciones reales, sin repartir ni cubrir faltantes. | Vistas, política grupal aceptada, registro de decisiones y casos humanos. No construir un motor de garantía. | F03, F06, F08 |
| `chain/tagged-sender.ts`, `attribution/tag.ts`, `chain/reader.ts` | Validación de red, tag, estimación, tope y saldo del costo de red, firma CIP-64 local, parseo de bytes firmados y recibo. | Separar preparación de firma local para aceptar firma externa del dueño. Probar soporte real del proveedor y volver a verificar intención y bytes antes de transmitir. No puede darse por resuelto con un SDK «compatible con EVM». | F02, F04, F10 |
| `payments/pay.ts` | Política, metadatos de token, saldo, formato, reserva y confirmación de un pago desde `LocalAccount`. | Flujo de aporte del miembro basado en obligación; consentimiento y cuenta propietaria correctos. No usar la cuenta del agente para pagar por los integrantes ni copiar la función en la web. | F04 |
| `policy/engine.ts`, `config/policy.ts` | Validación pura de alias, montos, cupos y presupuesto; configuración congelada. | Destinatarios autorizados del círculo, validación exacta de obligación y política de firmantes de miembros. El aporte comercial de $ 25.000,00 excede el tope actual de $ 5.000,00 por pago. | F03, F04, P05 |
| `policy/ledger.ts`, `config/paths.ts` | Registro único de gastos técnicos en la raíz, reservas y escritura por reemplazo de archivo. | Control de concurrencia y recuperación de operaciones pendientes para varias solicitudes. No es la base de juntas ni un registro de CPA; no crear copias del presupuesto por app. | F04, P04 |
| `agent/tools.ts` | Esquema estricto de `pagar`, destinatarios por enum de alias. | Herramientas de consulta autorizadas, loop del LLM en web, mensajes sin direcciones, recordatorios y derivación. `pagar` no debe disparar pagos de miembros: preparar una intención exige validación y firma posterior. | F07, F08 |
| `identity/erc8004.ts` y script de registro | Preparación de registro, lectura del identificador y ficha del agente. | Hospedar ficha HTTPS, ejecutar registro desde la wallet del agente y conservar evidencia real; registro todavía no acreditado en los insumos. | F10 |
| `ramp/ripio.ts`, `money/amounts.ts`, `money/fx.ts`, `config/tokens.ts` | Enlaces de ingreso/salida, formato monetario y direcciones centralizadas. | Prueba de elegibilidad, tiempos, costos, retorno y retiro; moneda del costo de red para cada firmante. El generador de enlaces no acredita una rampa completa. | F02, F04, P05 |
| Sin módulo comercial observado | Nada que permita afirmar atribución o CPA cobrado. | Ficha de una oferta para demo; pedidos, devolución, evidencia de venta y liquidación para piloto. | F09, P01 |
| Sin web/API operativas observadas | Tipos y funciones del core. | Web responsive, sesiones/roles, API fina, almacenamiento, cola humana, registro de métricas y despliegue. Todo contacto con Celo permanece en el core. | F01, F05–F09, P02–P04 |

**[Opinion]** El JSON del gasto técnico, el libro de obligaciones y la contabilidad comercial son registros distintos con propósitos distintos. Separarlos no autoriza dos ledgers del mismo presupuesto: `.env` y el ledger de gasto siguen únicos en la raíz. La persistencia nueva debe preservar ese control y la reconstrucción de obligaciones, sin convertir el pozo en saldo de La Vaquita.

### Puerta técnica de firma: 25–27/10

**[Assumption]** Esteban realiza la prueba de firma y Maxi integra la pantalla mínima. Se elige un proveedor solo si desde celular permite crear/acceder a una cuenta controlada por el miembro, recuperar acceso sin intervención custodial del equipo, firmar/rechazar una intención precisa y producir una tx verificable con los obligatorios. No se presupone un proveedor ni se agrega una dependencia en esta tarea documental.

**[Opinion] Criterios para pasar la puerta:**

1. El miembro firma y puede rechazar; el agente no dispone de su clave ni tiene permisos para pagar en su nombre.
2. La firma preserva Celo mainnet, tag ERC-8021 y CIP-64 con `feeCurrency` de stablecoin aprobada. wARS no paga el costo de red. Si el proveedor usa smart accounts u otro envoltorio, no se presume equivalencia: verificar la operación efectiva; si no cumple, queda bloqueado.
3. El core prepara, valida y transmite: la web solo presenta y solicita firma. Verificar firmante, token, cantidad, beneficiario, obligación, red, moneda del costo de red y tag sobre lo efectivamente firmado, además de conciliar recibo/evento. Reutilizar protecciones del emisor, no un camino paralelo de la web.
4. Ante timeout se consulta la intención y el hash antes de reintentar; no se pide otro pago porque aún no aparece el primero. Ensayo no transmite.
5. Recuperación y retorno desde el navegador interno de WhatsApp y un navegador normal funcionan o se ofrece abrir en el navegador compatible, conservando la invitación. El equipo no pide claves para «ayudar».

**[Data]** D7 del repo condiciona el contrato de reglas al spike y contempla `DIRECT_P2P`. **[Opinion]** Para este plazo, usar pago directo si el contrato no supera la prueba antes del cierre del 27/10: sin custodia, con asociación inequívoca entre intención, obligación y evento. Si hay varias deudas entre las mismas personas, no elegir la más reciente por defecto. El contrato no está presupuestado como desarrollo obligatorio; la alternativa directa sí debe pasar las mismas pruebas.

**[Opinion]** Si al 27/10 ninguna firma integrada cumple, recortar primero funciones accesorias y dedicar el 28/10 a resolverlo. Si sigue fallando, explicitar que la demo exigida está bloqueada. Una billetera externa o una firma del agente no se presentan como cumplimiento de la wallet invisible elegida; cambiar ese alcance requeriría una nueva decisión del fundador.

## 4. Dependencias y orden de construcción

**[Opinion]** Orden recomendado por riesgo y dependencias, usando RICE dentro de cada bloque:

| Orden | Construir | Depende de | Resultado que libera lo siguiente |
|---:|---|---|---|
| 0 | F02/F04: prueba de firma, formato de intención y arquitectura de acceso | Proveedor y obligatorios del hackathon | Una firma de miembro viable desde celular y contrato de datos entre web/core. En paralelo, F10: ficha HTTPS y registro. |
| 1 | F03 y F01: reglas, aceptación e invitación | Tipos del motor; sesión/rol básico | Cinco posiciones de ensayo, reglas aceptadas y obligación identificable. Ningún aporte se habilita antes de completar aceptaciones. |
| 2 | F05 y terminación de F04 | Orden 0, reglas e identificación de miembros | Aporte real de microimporte preparado, firmado y conciliado; estado persiste tras reinicio. |
| 3 | F06: resumen, recibido/faltante/deuda | F03 y F05 | Un estado compartido verificable con vistas por rol. |
| 4 | F07 y F08: agente, avisos y humano | F05/F06 y permiso de consulta | Consultas correctas, atraso de ensayo y derivación con minutos registrados. F08 también consume `defaults.ts`. |
| 5 | F09: oferta separada | Estado de cobro de F06 | Ficha opcional de ejemplo o real con camino explícito de no comprar; nunca desbloquea el cobro. |
| 6 | Integración, pruebas móviles, evidencia y entrega | F01–F10 | Demo repetible, simulaciones rotuladas, identidad y transacciones comprobables. |
| Después del hackathon | P05/P04 → P02 → P01/P03, con preparación de medición desde antes del primer contacto | Entrevistas retomadas, puerta 3/10 y evaluación del flujo | Piloto a frecuencia real. P02 debe operar desde la captación: no reconstruir horas a posteriori. P03 se prepara antes de terminar el primer ciclo. |

**[Opinion] Camino crítico:** prueba F02/F04 → firma integrada aceptada → obligación y aceptaciones F03 → envío/conciliación durable F04/F05 → estado F06 → agente/atraso F07/F08 → recorrido completo con F09 → evidencia y entrega. F01 y F10 avanzan en paralelo, pero también bloquean el cierre si no están terminados. Registrar ERC-8004 temprano evita dejar una dependencia de red para la madrugada final.

## 5. Capacidad y compromisos de los tres devs

**[Estimate]** Del **25/10 al 8/11 inclusive hay 15 días**. Con tres devs a seis horas concentradas por día, el techo es **45 días-persona, 270 horas**; trabajar todos los días es una hipótesis exigente, no disponibilidad confirmada. El 9/11 no es un día de desarrollo: la entrega vence a las **06:00 ART / 09:00 GMT**.

| Bolsa de tiempo | Días-persona | Uso |
|---|---:|---|
| F01–F10 | **[Estimate] 24** | Suma de los talles de la tabla, con reutilización del motor. |
| Integración, despliegue, pruebas móviles y revisión cruzada | **[Estimate] 9** | Incluye caminos de fallo y verificación de límites/atribución; no se elimina al recortar estética. |
| Guion, video, README/evidencia y formulario | **[Estimate] 6** | Entrega revisable con tiempo para corregir. |
| Reserva para bloqueos y correcciones | **[Estimate] 6** | En especial firma, conciliación y fallos del recorrido móvil. |
| **Total demo** | **[Estimate] 45** | No incluye construir el piloto completo ni esperar aprobaciones de terceros. |
| P01–P05 adicionales | **[Estimate] 14** | Trabajo posterior, más esperas legales/comerciales/rampa. Con demo y sus verificaciones excede la capacidad disponible. |

**[Assumption]** Si solo hay diez días efectivos por persona, la capacidad baja a 30 días-persona y faltan 15 respecto de este plan. Aplicar los recortes desde el primer control; no absorber la diferencia prometiendo menos pruebas o una billetera custodial. Los talles son puntos de referencia: si firma/persistencia duplican L a XL, consumen ocho días-persona extra entre ambas y agotan la reserva.

**[Assumption] Reparto propuesto para este plan, sin reasignar archivos:** Maxi: producto, reglas/web e integración; Esteban: firma, cadena, identidad y conciliación de eventos; Daniel: consultas del agente, recordatorios, casos humanos y guion. Los tres revisan cambios críticos de otro integrante. Es un plan a coordinar, no una modificación de `docs/tareas/` ni del ownership del repo. No hay trabajo previsto en el bot de Telegram.

## 6. Plan por día hasta el 9/11

**[Assumption]** Cada celda es el foco de ese día, no una tarea independiente de seis horas garantizadas. Las revisiones se hacen antes de integrar; ningún cambio crítico se aprueba a sí mismo. Mantener ensayo por defecto y pruebas automatizadas sin red; las comprobaciones mainnet son ejecuciones controladas aparte, entre cuentas del equipo y con activación explícita.

| Día / fecha ART | Maxi · producto/web/motor | Esteban · firma/cadena | Daniel · agente/operación | Hito o decisión del día |
|---|---|---|---|---|
| 1 · dom 25/10 | Fijar pantallas, contrato web/core, reglas de cinco y permisos; prototipo de confirmación. | Iniciar prueba de wallet invisible, CIP-64/tag y control de claves; inventariar bloqueos. | Definir cuatro consultas, herramientas con alias y estados de caso humano; guion mínimo. | **[Assumption]** Alcance F01–F10 cerrado y tablero de riesgos; sin desarrollo comercial adicional. |
| 2 · lun 26/10 | F01: sesión/invitación y apertura desde WhatsApp; servir ficha HTTPS mínima. | Firmar/rechazar desde celular; probar recuperación y datos firmados; avanzar F10. | F07: contrato de herramientas y autorización por círculo, respuestas con datos de ensayo. | **[Assumption]** Evidencia de compatibilidad de firma, o bloqueo identificado con dueño. |
| 3 · mar 27/10 | F03: reglas, orden aprobado, deuda y aceptaciones versionadas. | Cerrar prueba y elegir camino directo si contrato no pasa; registrar ERC-8004 por pipeline protegido. | F08: caso humano mínimo y registro de minutos; prueba de «ya pagué». | **[Assumption] Puerta crítica:** firma integrada viable, pago–obligación identificable y plan de evidencia de identidad. |
| 4 · mié 28/10 | F05: persistencia del libro, intenciones y reconstrucción. | Adaptar F04 a firma externa del miembro; validar intención/bytes antes de transmitir. | F07: loop de consultas en web con alias y datos autorizados; sin poder monetario discrecional. | **[Assumption]** Preparación y rechazo sin transmisión; aceptación previa exigida. Día de recuperación si falló la puerta. |
| 5 · jue 29/10 | Conectar obligación, intención, estado y persistencia. | F05: recibo/eventos y conciliación exacta; preparar primer microaporte. | Probar datos de herramientas, ausencia de direcciones y aislamiento entre círculos. | **[Assumption]** Pago de ensayo completo; evidencia real solo después de revisar el circuito. |
| 6 · vie 30/10 | F06: tablero con previsto, recibido, faltante y deuda; desplegar primera versión integrada. | Ejecutar aporte real de $ 1,00 firmado por el dueño y verificar atribución/CIP-64/recibo. | F07: avisos por fecha/estado en web y texto manual para WhatsApp. | **[Assumption]** Primer aporte real conciliado; si falla, se usa reserva y se congela toda mejora accesoria. |
| 7 · sáb 31/10 | Revisar acceso por rol, aceptación, retorno del pago y reinicio. | Probar reintento/timeout, evento duplicado y pago de otra ronda; revisión cruzada. | F08: atraso y discrepancia de ensayo, escalamiento y pausa de avisos del caso. | **[Assumption]** Reiniciar conserva lo pagado; no se duplica ni se pierde una deuda. |
| 8 · dom 1/11 | F09: oferta separada, costos/condiciones y «Seguir sin comprar». | Corroborar identidad/ficha y evidencia de cada tx real; revisar flujo sin compra. | Agente explica deuda posterior, cobro parcial y oferta opcional; derivación sin prometer resolución. | **[Assumption]** Junta y oferta independientes; ejemplo comercial rotulado si no hay venta real. |
| 9 · lun 2/11 | Recorrido completo en celular y navegador interno; corregir abandonos. | Verificar firmas rechazadas, saldo insuficiente, costo de red y destinatario incorrecto. | Revisar comprensión de textos y tiempos de casos; preparar libreto de demostración. | **[Assumption]** Una pasada integrada, incluida decisión de no comprar. |
| 10 · mar 3/11 | Corregir fallos de acceso/persistencia y revisar agente de Daniel. | Revisar integración de Maxi y repetir solo los casos afectados. | Revisar web/pagos desde la perspectiva del usuario y probar consultas hostiles o ambiguas. | **[Assumption]** Funciones demo terminadas; lista corta de defectos con severidad. |
| 11 · mié 4/11 | Congelar funciones y versión candidata; separar ensayo/real en pantallas y evidencia. | Cerrar obligatorios mainnet e identidad; ningún defecto crítico de plata abierto. | Ensayar agente + humano y guion de oferta; enumerar lo simulado. | **[Assumption] Puerta de entrega:** F01–F10 integrados y evidencia técnica disponible. |
| 12 · jue 5/11 | Reserva: corregir solo bloqueos y pérdidas de comprensión. | Reserva: firma/conciliación/infraestructura; pruebas de regresión de lo tocado. | Reserva: permisos, consultas y casos humanos; preparar toma de respaldo. | **[Estimate]** Hasta tres días-persona de reserva, sin funciones nuevas. |
| 13 · vie 6/11 | Segunda reserva y pasada móvil final; capturas legibles. | Revisión final de recibos, identidad, tags y costos de red. | Ensayar tres pasadas en total, una con atraso y humano; cerrar guion. | **[Estimate]** Otros tres días-persona de reserva; si sobran, mejorar evidencia y legibilidad. |
| 14 · sáb 7/11 | README, arquitectura, alcance real/simulado y textos de entrega. | Armar evidencias técnicas reproducibles y revisar afirmaciones del pitch. | Grabar video, revisar audio/recorrido y preparar respaldo. | **[Assumption]** Video y formulario en borrador completo; sin filmar un ejemplo como venta real. |
| 15 · dom 8/11 | Revisar enlaces/campos y enviar antes de las 18:00 ART; verificar constancia. | Comprobar URL pública y ficha; soporte de una corrección bloqueante. | Revisar video y formulario contra demo; verificar respaldo y constancia de envío. | **[Assumption]** Entrega hecha con doce horas de margen hasta las 06:00 ART; registrar hora y comprobante. |
| Límite · lun 9/11, 06:00 ART | Verificación de recepción si hiciera falta. | Disponibilidad para un bloqueo de entrega. | Respaldo de materiales accesible. | **[Data]** 09:00 GMT: vence la entrega. No planificar desarrollo ni una operación mainnet nueva en ese margen. |

**[Opinion]** La demostración de cinco turnos es de ensayo y acelerada. El primer aporte real no obliga a completar un ciclo comercial antes del 9/11. Si se muestran varias cuentas controladas por los tres devs, se declara quién las controla y no se las cuenta como cinco miembros independientes ni como tracción del piloto.

## 7. Qué recortar y qué no se negocia

| Señal / fecha de control | Recorte concreto | Qué debe seguir funcionando |
|---|---|---|
| Firma aún incierta al 27/10 | **[Opinion]** Cancelar contrato nuevo, instalación PWA, avisos del sistema y toda oferta adicional. Probar un solo proveedor viable y pago directo. | Firma del dueño, consentimiento, CIP-64/tag y conciliación. Si no hay camino compatible, declarar bloqueo; no ocultarlo detrás de una demo custodial. |
| No hay aporte real conciliado al 30/10 | **[Opinion]** Concentrar reserva en F02/F04/F05; F09 queda en ficha de ejemplo y salida simulada a compra. | Aporte real del equipo, estado verificable y agente consultable. No llamar «venta» a la muestra comercial. |
| Desvío de más de dos días-persona al 1/11 | **[Opinion]** Crear círculos con formulario mínimo/alta asistida, un único formato de reglas y un orden acordado validado; sin editor avanzado ni explorador visual de todos los órdenes. Un grupo de ensayo y una oferta. | Cinco aceptaciones, invitación privada, reglas explícitas, deuda y posibilidad de no entrar. |
| Poco tiempo para agente al 3/11 | **[Opinion]** Cuatro intenciones con herramientas cerradas y contexto breve; eliminar negociación conversacional y memoria extensa. Avisos web y compartir manual por WhatsApp. | Consultas sobre aportes/turnos/pagos, preparación determinística, derivación y registro de minutos. No reemplazar el agente entero por una promesa en el pitch. |
| Defectos abiertos al 4/11 | **[Opinion]** Congelar toda función y usar 5–6/11 solo para corregir/ensayar; quitar pulido visual, instalación y autoservicio comercial. | Acceso, firma, pagos, deuda, atraso, agente, oferta opcional y obligatorios técnicos. |
| No hay acuerdo comercial antes de grabar | **[Opinion]** Mostrar oferta ficticia rotulada y separación de flujos; declarar CPA pendiente de validación. | No prometer descuentos, socios, entregas o ingresos inexistentes; el cobro nunca depende de comprar. |
| Persiste un defecto crítico el 7/11 | **[Opinion]** Entregar evidencia parcial honesta y explicitar el obligatorio incumplido; posponer operación externa. | No transmitir una intención insegura ni presentar como terminada la demo requerida. Un video no reemplaza el control faltante. |

**[Data]** Nunca se recortan Celo mainnet, wARS, ERC-8004, tag ERC-8021 por tx, CIP-64, firma de cada miembro, determinismo monetario, separación de compra, acceso por pertenencia ni deuda visible. **[Opinion]** Tampoco se omiten pruebas críticas o revisión cruzada para agregar estética. No subir límites, pedir claves, crear un segundo ledger o usar pagos del equipo como rescate del piloto.

## 8. Construcción del piloto después de la entrega

**[Assumption]** Al retomar entrevistas, P02 registra captación desde el primer contacto. Superar el corte comercial y resolver P05/P04 habilita un primer grupo de cinco; no hay fecha garantizada porque revisión jurídica, rampa, oferta y disponibilidad de usuarios son externas al equipo.

1. **[Assumption]** P05/P04: condiciones del flujo, límites, recuperación, ingreso/salida y restauración probados antes de aportes externos. Los $ 25.000,00 por obligación del modelo base requieren política aprobada; no se hereda el permiso de un microaporte de demo.
2. **[Assumption]** P01: una oferta de servicio/digital, acuerdo de CPA, pedidos y devolución con conciliación asistida. Mantener el costo comercial en la economía completa y las comisiones cobradas separadas de las pendientes.
3. **[Assumption]** P03: completar cinco turnos a frecuencia aceptada, cerrar pendientes y ofrecer un ciclo nuevo sin reingreso automático. Medir soporte de todos los grupos, incluidos los inconclusos.
4. **[Assumption]** Otros dos organizadores y diez personas distintas; contrastar conversión sobre varios círculos, CPA cobrado y repetición efectiva antes de O03 o difusión amplia. El 30% exploratorio no es una promesa de ventas.

**[Estimate]** P01–P05 suman catorce días-persona de implementación/operación inicial; ese número no incluye las semanas de un ciclo, las entrevistas, la espera de terceros ni la atención posterior. **[Opinion]** No convertirlo en «piloto validado en cinco días con tres devs». La métrica que condiciona el avance es tiempo humano de soporte por círculo completado junto con calidad, compra libre y economía completa.

## Flags

**Red Flags:**

- **[Data]** Firma local del agente y web vacía: el flujo no custodial integrado es trabajo pendiente, no una capacidad ya disponible. **[Opinion]** Si el proveedor no preserva CIP-64/tag y control individual, cae el camino crítico.
- **[Estimate]** El plan consume quince días consecutivos de tres devs; duplicar esfuerzo de firma y persistencia excede la reserva. No hay capacidad para agregar el piloto completo antes del 9/11.
- **[Data]** El aporte comercial base excede la política actual. **[Opinion]** Tampoco están resueltos concurrencia, revisión jurídica del flujo ni economía solo CPA; no habilitar aportes externos por terminar la demo.
- **[Opinion]** Atribuir pagos por proximidad de fecha o tratar un reinicio como pago fallido puede duplicar cobros o dejar deudas mal saldadas. F05 no se recorta.

**Yellow Flags:**

- **[Assumption]** Selección de framework, proveedor y persistencia exige acordar/registrar decisiones al implementar; esta tarea no agrega dependencias ni modifica el stack.
- **[Opinion]** Navegador interno de WhatsApp, recuperación y notificaciones pueden fallar aunque la firma funcione en escritorio; probar temprano y conservar el retorno al círculo.
- **[Data]** Sin vendedor dedicado y nombre todavía en verificación. **[Opinion]** Limitar catálogo y estética reduce trabajo; no resuelve acceso a organizadores ni disposición a pagar CPA.

## Fuentes

- [Definición del MVP](mvp-definition.md) y [recorridos](user-journey.md): identificadores, dolores, criterios de aceptación y separación demo/piloto de esta fase.
- [Brief](../00-intake/brief.md), [progreso](../PROGRESS.md) y consigna del fundador del 2026-10-25: tres devs, canal fijado, deadline y exclusiones.
- Estrategia: [Lean Canvas](../02-strategy/lean-canvas.md), [propuesta](../02-strategy/value-proposition.md), [modelo](../02-strategy/business-model.md), [posicionamiento](../02-strategy/positioning.md) y [salida al mercado](../02-strategy/go-to-market.md): cohortes, costos, métricas y puertas.
- [Público](../01-discovery/target-audience.md), jerarquía; [competencia](../01-discovery/competitor-landscape.md), matriz; [mercado](../01-discovery/market-analysis.md), riesgos por modalidad. Sin actualización normativa ni búsquedas nuevas.
- [Valores](../03-brand/mission-vision-values.md) y [tono](../03-brand/tone-of-voice.md): control personal, claridad de compromisos y revisión humana.
- [AGENTS.md](../../../../AGENTS.md), [contexto](../../../proyecto/contexto.md), [stack](../../../proyecto/stack.md), [decisiones](../../../proyecto/decisiones.md), [áreas](../../../tareas/README.md), [plan de Maxi](../../../tareas/maximiliano.md) y [estado](../../../miembros/maximiliano/estado.md): ownership y reglas técnicas. El canal y los ingresos de la consigna 2.0 prevalecen sobre versiones previas.
- Código observado: [emisor](../../../../packages/core/src/chain/tagged-sender.ts), [pay](../../../../packages/core/src/payments/pay.ts), [motor de política](../../../../packages/core/src/policy/engine.ts), [límites](../../../../packages/core/src/config/policy.ts), [ledger](../../../../packages/core/src/policy/ledger.ts), [obligaciones](../../../../packages/core/src/junta/obligations.ts), [turnos](../../../../packages/core/src/junta/turn-order.ts), [impagos](../../../../packages/core/src/junta/defaults.ts), [herramientas](../../../../packages/core/src/agent/tools.ts), [identidad](../../../../packages/core/src/identity/erc8004.ts) y [rampa](../../../../packages/core/src/ramp/ripio.ts).
- Referencias provistas: `C:/Users/Usuario/.claude/plugins/cache/startup-skill/startup/a5f97c317b93/startup-design/references/output-specs.md`, «Phase 6 — Product»; `frameworks.md` en el mismo directorio, «RICE Prioritization» y «MoSCoW Prioritization». Esfuerzos, alcance trimestral y plan diario son estimaciones propias; no compromisos del equipo ni resultados observados.
