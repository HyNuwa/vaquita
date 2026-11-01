# Definición del MVP — una junta clara antes de una oferta

**Fase:** 6 — Producto
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Media sobre reutilización del motor; Baja sobre firma integrada, adopción y economía comercial

---

## 1. Hipótesis central y dos pruebas distintas

**[Assumption]** Si un organizador puede invitar a sus conocidos desde WhatsApp a una web sencilla, donde cada integrante entiende y firma sus aportes, ve su turno y su deuda posterior, y consulta al agente sin perseguir comprobantes, el grupo podrá completar y repetir una junta con menos trabajo humano. Si algunos beneficiarios eligen además una compra conveniente, el CPA cobrado al comercio podría financiar esa coordinación sin cobrarle al ahorrista.

**[Opinion]** La hipótesis tiene dos partes que se prueban por separado: utilidad operativa de la junta y sostenibilidad del ingreso comercial. Que todos aporten no prueba que alguien compre; que alguien compre no prueba que el círculo termine ni que la comisión cubra adquisición y soporte. Base: [propuesta de valor](../02-strategy/value-proposition.md), [modelo de negocio](../02-strategy/business-model.md) y [salida al mercado](../02-strategy/go-to-market.md).

| Alcance | Qué tiene que mostrar o medir | Qué evidencia permite producir |
|---|---|---|
| **Demo del hackathon** | **[Data]** Junta por turnos, deuda posterior, oferta opcional separada y agente; Celo mainnet, wARS, ERC-8004, ERC-8021 y CIP-64. | **[Opinion]** Recorrido demostrable y evidencia técnica del equipo. No valida demanda, mora, retención ni CPA comercial. |
| **Piloto comercial** | **[Assumption]** Ciclos de conocidos a frecuencia real, compra libre, comisión cobrada, costos de captación y soporte, repetición y faltantes. | **[Opinion]** Resultados por cohorte, incluyendo fracasos e inconclusos. Empieza después de las puertas comerciales, técnicas y jurídicas; no tiene que terminar antes del 9/11. |

**[Data]** Las entrevistas siguen pospuestas por decisión del fundador: cero usuarios entrevistados y cero comercios contactados en el brief. Al retomarlas, son el experimento #1: diez potenciales integrantes, tres organizadores y diez comercios, al menos ocho sin vínculo familiar. Menos de tres aceptaciones comerciales completas obliga a abandonar el híbrido. No se cambia esa regla por terminar la demo.

## 2. Decisiones de producto que fijan el alcance

- **[Data] Canal elegido para esta fase:** web app responsive/PWA con wallet invisible; el organizador comparte un enlace en su grupo de WhatsApp. Ahí sigue la conversación del grupo; las consultas al agente y las confirmaciones ocurren en la web. No hay bot de WhatsApp ni de Telegram. Las referencias previas al canal abierto quedan superadas por la consigna del 25/10.
- **[Data] Junta:** privada, por invitación, entre adultos conocidos, metas libres, grupo de cinco y hasta cinco turnos. Cada persona cobra una vez. La frecuencia se acuerda antes de empezar; cinco turnos semanales abarcan cuatro semanas entre primera y última fecha, más preparación y cierre.
- **[Data] Control:** cada integrante firma cada aporte. El agente prepara y explica; nunca firma por un miembro. «Wallet invisible» significa evitar jerga y cambios de aplicación, conservando consentimiento, rechazo y recuperación bajo control del miembro. El equipo no recibe sus claves ni puede disponer de sus fondos.
- **[Data] Flujos:** aportes directos al beneficiario en wARS; compra posterior opcional, con pago y comprobante propios; CPA pagado por el comercio. No se descuenta comisión del pozo ni se desvía automáticamente al comercio. Los tres registros se concilian por separado.
- **[Data] Ingreso:** solo CPA comercial. Rangos para negociar, todavía sin aceptación: digital 10–15%, servicios 6–10%, bienes físicos 2–4%. El participante paga $ 0 a La Vaquita; ve antes de confirmar los costos externos para ingresar, enviar o retirar plata y quién los absorbe.
- **[Data] Agente:** responde sobre aportes, turnos, recordatorios y pagos usando datos del motor. Reclamos, discrepancias y conflictos pasan a una persona. Montos, destinatarios, orden y mora son determinísticos; el LLM solo recibe alias y datos autorizados del círculo.
- **[Data] Marca:** La Vaquita es el nombre de trabajo; el definitivo sigue en verificación. Se aplican misión 3, visión 2 y los cinco valores adoptados en [marca](../03-brand/mission-vision-values.md), con el [tono de voz](../03-brand/tone-of-voice.md): cercano, claro, sereno y franco.

**[Opinion]** La web abre sin instalar; el acceso a la junta requiere autenticación y pertenencia. El enlace identifica una invitación, no concede lectura de deudas a cualquiera que lo reciba. La instalación PWA y las notificaciones del sistema pueden esperar; para la demo alcanzan avisos dentro de la web y textos que una persona decide compartir por WhatsApp.

## 3. Dolores que determinan las funciones

**[Data]** Los dolores y puntajes vienen de la «Jerarquía de dolores» de [target-audience.md](../01-discovery/target-audience.md). **[Estimate]** Esos puntajes priorizan entrevistas con evidencia secundaria; no miden incidencia en Jujuy. Los códigos siguientes son referencias locales de esta fase, no nuevos hallazgos.

| Código | Dolor del insumo | Prioridad heredada | Respuesta y límite del MVP |
|---|---|---:|---|
| D1 | Plata bloqueada / desconfianza | 15 | Firma propia, pagos directos y estado verificable. Persisten riesgos de billetera, emisor, rampa e impago. |
| D2 | Crédito caro / costos sorpresa | 15 | Costos completos y deuda antes de aceptar; no prometer crédito gratis ni ausencia de deuda. |
| D3 | Perseguir pagos | 15 | Obligaciones, conciliación, avisos y consultas al agente; un aviso no cubre un faltante. |
| D4 | No alcanza / dificultad de ahorrar | 12 | Calendario compatible y compromiso visible; seleccionar capacidad real, sin crear ingresos ni prestar. |
| D5 | Perder control del débito | 12 | Consentimiento por operación y posibilidad de rechazar; sin débitos automáticos. |
| D6 | Carga social y administrativa | 8 | Un estado compartido, revisión humana y registro de tiempo; sin arbitraje discrecional del agente. |
| D7 | Cursos con condiciones poco claras | 6 | Oferta con vigencia, precio comparable y devolución; no revocar una compra por mora en la junta. |
| D8 | Esperar el último turno | Sin puntaje propio | Orden aceptado, adelanto y deuda por turno; misma oferta no vuelve equivalentes todos los turnos. |
| C1 | Comercio: captar clientes | 15 | Compra atribuida e incremental a contrastar, sin prometer cinco ventas. |
| C2 | Comercio: dinero retenido | 15 | Compraventa directa y liquidación verificable; La Vaquita no guarda el pago comercial. |
| C3 | Comercio: dependencia de plataforma | 10 | Acuerdo simple sin exclusividad, conciliación y posibilidad de no renovar. |
| C4 | Comercio: límite de pago del alumno | 8 | Oferta compatible con dinero disponible; sin financiación ni ticket inflado para mejorar el CPA. |

**[Opinion]** D1, D2 y D3 tienen respuesta obligatoria desde la demo. Por eso un catálogo, una identidad visual terminada o una cuenta de agente registrada no sustituyen firma, costos claros y conciliación. La [matriz competitiva](../01-discovery/competitor-landscape.md) ya muestra agentes con turnos y recordatorios: el resultado a demostrar es menos ambigüedad y menos trabajo, con libertad de compra.

## 4. Funciones imprescindibles para la demo

**[Assumption]** F01–F10 son la unidad mínima de construcción; sus esfuerzos y dependencias están en [feature-prioritization.md](feature-prioritization.md). «Imprescindible» exige el comportamiento indicado, aunque parte de la operación sea manual y esté declarada.

| ID | Función imprescindible | Dolor al que responde | Criterio observable de terminado |
|---|---|---|---|
| F01 | Entrada móvil, invitación y acceso al círculo | D1, D6 | El organizador crea un borrador, comparte el enlace manualmente por WhatsApp y admite a conocidos autenticados. Otra persona sin pertenencia no ve información del círculo; un enlace reenviado no alcanza para entrar. |
| F02 | Wallet invisible y firma personal | D1, D5 | Alta integrada, acceso y recuperación probados; la persona confirma o rechaza un pago con monto y beneficiario. No hay claves de miembros en el servidor ni firma del agente por ellos. |
| F03 | Reglas, turnos y deuda aceptados | D2, D4, D5, D8 | Cinco integrantes, cuota y fechas, orden viable aprobado por todos y versión de reglas aceptada. Cada persona ve cuánto aporta antes y después de cobrar y un escenario de faltante. Cambiar el borrador invalida las aceptaciones anteriores. |
| F04 | Preparación y pago directo en wARS | D1, D2, D5 | El código toma monto y beneficiario de la obligación, informa costos externos y pide firma. Toda tx de la aplicación atraviesa la validación del core: Celo mainnet, tag ERC-8021 y CIP-64 con costo de red en stablecoin. El agente no puede variar esos datos ni transmitir por una orden conversacional sin consentimiento. |
| F05 | Conciliación persistente por obligación | D1, D3, D6 | Recibo y evento verificados antes de marcar pagado; reiniciar no pierde estado. Un evento repetido no duplica el aporte. Otra suma, destinatario o ronda pasa a revisión. Un pago desconocido no se asigna por intuición. |
| F06 | Estado del círculo y resumen individual | D1, D3, D4, D6, D8 | Muestra previsto, recibido confirmado, faltante, vencimiento, turno y deuda restante. Distingue ronda vencida de ronda saldada; muestra obligaciones después de cobrar y permite volver sin comprar. |
| F07 | Agente dentro de la web y recordatorios | D3, D6 | Resuelve cuatro consultas: cuánto aportar, cuándo toca cobrar, qué queda pendiente y si un pago está confirmado. Lee herramientas autorizadas con alias. Los avisos salen de fechas/estados del motor; una persona puede compartir el texto por WhatsApp, sin bot. |
| F08 | Atraso, discrepancia y derivación humana | D1, D3, D6 | Un atraso produce aviso privado y faltante visible. «Ya pagué» abre caso, frena avisos reiterados y deriva a humano. El pago tardío cumple la deuda original. La decisión grupal de continuar o suspender se registra según reglas; no hay cobertura automática. Se anotan minutos humanos desde la demo. |
| F09 | Una oferta opcional después del cobro | D2, D7, C1, C2, C3, C4 | Vista separada con comercio, precio de contado comparable, precio final, vigencia, condiciones y devolución; «Seguir sin comprar» visible. Comprar abre un flujo comercial separado. Sin acuerdo real, la ficha y compra son de ejemplo y se rotulan así; no se declara venta ni CPA cobrado. |
| F10 | Identidad del agente y evidencia técnica | D1, como transparencia limitada | ERC-8004 registrado desde la wallet técnica del agente; ficha accesible por HTTPS y evidencia de tx con tag y CIP-64. La identidad no se presenta como garantía de fondos o solvencia. Registro y pagos técnicos también llevan las protecciones del core. |

**[Opinion]** F02 y F04 son una puerta de viabilidad, no integración resuelta: el código actual firma con una cuenta local. Hay que adaptar la preparación, firma externa del miembro y verificación antes de transmitir sin copiar claves a un servidor. Si la billetera elegida no permite cumplir tag, CIP-64 y control individual, la demo queda técnicamente incompleta; no se reemplaza por custodia ni por una firma del agente.

### Qué se hace con plata real y qué se muestra en ensayo

**[Assumption]** La demo usa un círculo de ensayo de cinco posiciones para mostrar el recorrido completo y el atraso. Esas posiciones no equivalen a cinco clientes. Las pruebas reales se hacen entre cuentas propias de integrantes del equipo, con sus firmas: al menos un aporte de **$ 1,00 en wARS** vinculado a una obligación y conciliado desde la red. Se registra quién controló cada cuenta; no se cuentan wallets del equipo como usuarios independientes.

**[Opinion]** Mantener conjuntos de ensayo y real separados, con rótulos persistentes y evidencia por operación. Un estado alimentado por datos de prueba nunca dice «pago confirmado» en el conjunto real. La toma real muestra lo efectivamente recibido; el cierre de cinco turnos de ensayo se identifica como recorrido acelerado, no como ciclo comercial ni retención. No hace falta reclutar terceros para completar el guion del hackathon.

**[Estimate]** Para mostrar la aritmética en ensayo: cinco personas, aporte $ 1,00, pozo **4 × $ 1,00 = $ 4,00**, sin aporte a uno mismo; quien cobra primero sigue debiendo cuatro aportes, $ 4,00. El escenario comercial base es distinto: aporte $ 25.000,00, pozo $ 100.000,00 y 20 obligaciones por ciclo. Un turno 2 deja tres aportes, $ 75.000,00, después de cobrar.

**[Data]** `config/policy.ts` fija hoy $ 5.000,00 por pago, $ 20.000,00 diarios y 20 pagos diarios para el agente. **[Opinion]** La base comercial de $ 25.000,00 no está habilitada por esa política. El piloto necesita revisión explícita de límites y del alcance por firmante, con controles de concurrencia; no subirlos para la demo, fraccionar una cuota para eludirlos ni crear otro ledger. Modo ensayo por defecto; real solo con la activación explícita definida en el repo.

## 5. Funciones imprescindibles adicionales para el piloto

**[Assumption]** El piloto incluye F01–F10 operativos, con datos reales y sin reemplazar evidencias por ejemplos. P01–P05 completan lo necesario para medir las métricas de estrategia. Se puede operar con formularios y conciliación humana; no hace falta un portal comercial autoservicio.

| ID | Función adicional | Dolor al que responde | Mínimo operativo y medición |
|---|---|---|---|
| P01 | Venta atribuida y liquidación de CPA | C1, C2, C3, D7 | Acuerdo por oferta, código/enlace de atribución, pedido propio, pago al comercio, entrega, devoluciones y liquidación. Estados separados: intención, venta pagada, válida, CPA devengado, pendiente y cobrado. Confirmación del comercio contrastada con evidencia; un clic no es una venta. |
| P02 | Registro de captación, cohortes y tiempo | D3, D6, C1 | Fuente de cada organizador/miembro/comercio, hitos, caja, horas de captación y de soporte, costos técnicos y motivos de abandono. Exportación agregada para calcular costos sin duplicarlos. Registro de casos inconclusos, no solo éxitos. |
| P03 | Cierre, repetición y recomendación | D4, D6, D8, C3 | Cierre con todas las obligaciones saldadas o terminación con deuda explícita; nuevo ciclo con consentimiento nuevo, sin arrastre automático. Vincular ciclos y organizadores para distinguir repetición, miembros que vuelven y otro grupo recomendado. |
| P04 | Operación confiable y revisión humana | D1, D3, D5, D6 | Persistencia durable, autorización por rol, respaldo/restauración, relectura de eventos, pagos pendientes tras una caída y cola humana con responsable. Horario de atención comunicado; sin promesa de 24/7. Revisar concurrencia y presupuestos antes de varios grupos. |
| P05 | Entrada/salida de pesos y condiciones del flujo | D1, D2, D5, D7, C2, C4 | Prueba completa de ingreso, firma, recepción y retiro con costos/tiempos; recuperación sin custodia del equipo. Condiciones y privacidad del flujo concreto revisadas, límites aprobados y comprensión de cada participante. Comercio capaz de cobrar por el medio acordado, sin presumir aceptación de wARS. |

**[Opinion]** P05 recoge puertas externas además de desarrollo: evaluación jurídica y fiscal, rampa y proveedor de firma. Separar plazos externos de horas de programación. La [regulación por modalidad](../01-discovery/market-analysis.md) no acredita exención por ser cinco conocidos, firmar personalmente o separar la compra; este documento hereda esa incertidumbre y no emite una conclusión legal nueva.

### Contrato mínimo de medición

**[Assumption]** Registrar identificadores internos de cohorte, círculo, ciclo, turno, obligación, miembro, oferta, pedido y caso humano; fecha, estado y causa del cambio. Mantener el mapa de direcciones fuera del LLM. Los datos de operación viven en almacenamiento autorizado, no en estos documentos públicos; reportar solo agregados y casos anonimizados.

| Métrica requerida | Definición y denominador | Datos mínimos y cuidado |
|---|---|---|
| Costo por organizador activado | **[Assumption]** Caja + horas de captación/formación valoradas / organizadores con grupo completo y primera ronda saldada. | P02 + F05: conservar caja y horas por separado. Sin activados: gasto y cero activaciones, sin cociente. |
| Costo por integrante activado | **[Assumption]** Misma bolsa anterior / integrantes nuevos activados. | Aceptó reglas y pagó primera obligación exigible, o cobró como primer beneficiario. Organizador incluido como integrante; no sumar ambos costos de adquisición. |
| Conversión a compra | **[Assumption]** Beneficiarios con al menos una compra válida atribuida / oportunidades previstas; también / beneficiarios con turno completamente cobrado. | P01 + F05: una oportunidad por miembro/ciclo; devolver una compra revierte su validez. Ventas repetidas se informan aparte, sin inflar conversión. Mostrar cobros parciales y compras de esos casos aparte. |
| CPA efectivamente cobrado | **[Assumption]** Pesos recibidos del comercio netos de ajustes/devoluciones, por cohorte. | P01: no confundir con promesa, devengado, volumen de aportes ni ventas. Registrar fecha, base y evidencia de liquidación. |
| Repetición | **[Assumption]** Círculos que empiezan otro ciclo / elegibles; círculos que lo completan / elegibles, en la misma ventana observada. | P03: mostrar ambos hitos y tiempo de seguimiento. No llamar repetición a intención; sin elegibles, informar que todavía no se puede medir. |
| Tiempo humano de soporte por círculo completado | **[Assumption]** Minutos de atención, conciliación y conflictos de toda la cohorte / círculos completados de esa cohorte. | F08/P02/P04: incluir trabajo de suspendidos e inconclusos; informar también sus minutos y proporción. Con cero completados: minutos totales, sin promedio ficticio. |
| Costo por comercio pagador activado | **[Assumption]** Caja + horas comerciales / comercios con primera venta y CPA cobrado. | P01/P02: acuerdos no son activaciones. Asignar este costo una vez a la economía completa, sin ocultarlo ni repetirlo por grupo. |

**[Estimate]** Para comparabilidad con estrategia, valorar inicialmente la hora en $ 5.000,00 de octubre de 2026 y conservar horas sin monetizar. Una compra entre cinco beneficiarios es 20%; dos son 40%. El 30% exploratorio se evalúa entre varios círculos, siempre con conteos y denominadores, no como «1,5 compras» exigidas a un grupo.

## 6. Funciones deseables después del mínimo

| ID | Función deseable | Dolor asociado | Condición para incorporarla |
|---|---|---|---|
| O01 | Instalación PWA y acceso desde inicio | D3, D6 | **[Opinion]** Solo después de que abrir y volver por enlace funcione. No es condición de entrada. |
| O02 | Avisos del sistema con consentimiento | D3, D6 | **[Opinion]** Después de medir recordatorios web/manuales y soporte de dispositivos; conservar alternativa sin permiso de notificaciones. |
| O03 | Varias ofertas y alta comercial autoservicio | D7, C1, C3, C4 | **[Opinion]** Solo con ventas/CPA repetidos y conciliación probada; antes, una oferta pertinente y operación asistida. |

**[Opinion]** Mejorar filtros de turnos y reutilizar reglas puede seguir a P03 si reduce trabajo observado. No asignarle beneficios ni un nuevo compromiso de entrega sin medirlo. El nombre y la estética deben poder cambiar sin rehacer reglas, pagos ni contenidos críticos.

## 7. Lo explícitamente fuera de alcance

**[Data]** Quedan afuera de la demo y del piloto de esta fase: DeFi y rendimiento, token propio, premios o gamificación con valor, grupos abiertos, préstamos de La Vaquita, custodia, bots de Telegram o WhatsApp, comisión al ahorrista, cargo por turno y abonos. No se abre un fondo común para luego invertirlo ni un crédito comercial propio.

**[Opinion]** También se excluyen garantías, seguro o rescate del equipo; scoring como cobertura; revocar un curso pagado por mora entre pares; sanciones o reordenamiento decididos por el LLM; débito automático; compra obligatoria; desviar el pozo al comercio; marketplace amplio, logística, inventario y reservas de stock financiadas; app nativa; varias monedas en la junta y conversión automática. Las ofertas iniciales cotizan en pesos; una oferta en USDC queda para una revisión posterior con costos y consentimiento específicos, sin cambiar la junta en wARS.

**[Opinion]** El contrato de reglas no es condición de valor de producto: se usa únicamente si pasa el spike y cabe en tiempo. `DIRECT_P2P` es el recorte previsto, siempre con vínculo inequívoco pago–obligación, firma individual y las mismas verificaciones. Si tampoco funciona, se declara el bloqueo; no se maquilla con capturas ni con una firma centralizada.

## 8. Criterios de éxito y puertas de decisión

| Prueba | Umbral propuesto | Lectura del resultado |
|---|---|---|
| Demo técnica antes del 4/11 | **[Assumption]** Al menos un aporte real del equipo de $ 1,00 firmado por su dueño, conciliado; ERC-8004 registrado; todas las tx emitidas por la app con tag, chainId y CIP-64 comprobables. Cero firmas de miembro hechas por el agente. | Evidencia técnica. Si falla firma, atribución o moneda del costo de red, falta un obligatorio del hackathon. |
| Recorrido demo antes del 7/11 | **[Assumption]** Tres pasadas completas desde celular: invitación, reglas/deuda, firmar o rechazar, estado, agente, oferta y seguir sin comprar; una pasada incluye atraso y caso humano. Sin defectos críticos abiertos sobre plata o acceso. | Verifica funcionamiento y mensajes; los tres devs no constituyen muestra comercial. |
| Comprensión antes del piloto | **[Assumption]** Los cinco integrantes explican sin ayuda su aporte, turno, deuda posterior, quién soporta un faltante, compra opcional y costos externos. Todos prueban firma/rechazo y recuperación. | Si alguien no entiende, revisar y volver a probar antes de activar el círculo; no promediar para esconder una confusión crítica. |
| Puerta comercial | **[Data]** ≥3/10 aceptaciones completas, ≥8 comercios independientes entrevistados; <3/10 implica abandonar el híbrido. | Habilita probar compra, no demuestra ventas ni rentabilidad. Entrevistas siguen pendientes. |
| Primer ciclo a frecuencia real | **[Assumption]** Meta heredada: 19/20 obligaciones a término y 20/20 saldadas, sin rescates del equipo; toda discrepancia resuelta o pendiente explícita. | Un fallo exige revisar continuidad y causas; no estimar una tasa estable de mora con 20 obligaciones. Suspender no equivale a completar. |
| Compra y CPA en varios círculos | **[Assumption]** Referencia exploratoria: 30% de compra válida entre hasta 15 oportunidades de tres círculos; al menos una venta independiente con ahorro neto y CPA cobrado. | Mostrar conteos: 4/15 = 26,7%; 5/15 = 33,3%. Si nadie compra o el comercio no liquida, no está probada la monetización. No forzar compras para pasar. |
| Menor trabajo humano | **[Assumption]** Medir primero la carga previa del organizador. Meta de aprendizaje: reducir al menos 30% sus minutos por ciclo comparable; soporte del equipo ≤30 minutos por círculo completado, incluyendo inconclusos en el numerador. | Son objetivos nuevos, no benchmarks. Publicar base, casos y calidad; si quedan reclamos sin atender, no se considera éxito aunque bajen minutos. |
| Réplica y repetición | **[Assumption]** Otros dos organizadores y diez personas distintas completan su primer ciclo; observar al menos un círculo que empieza y completa un segundo ciclo. | Registrar ventanas y denominadores; no asumir retención de todos ni exigir este resultado antes del hackathon. |
| Economía medida | **[Assumption]** Contribución operativa positiva con CPA cobrado, ajustes y todo el soporte, más adquisición de grupos/comercios y costos fiscales reportados por separado. | Solo ampliar si el recupero se sostiene con repetición observada; no tomar los $ 13.000,00 del escenario de tres minutos como resultado propio. |

**[Opinion]** Antes de aportes ajenos al equipo se requieren además P04/P05 y evaluación del flujo concreto. No se promete ausencia total de regulación. Una entrega técnica exitosa el **9/11/2026, 09:00 GMT / 06:00 ART** no convierte estas condiciones pendientes en cumplidas.

## Flags

**Red Flags:**

- **[Data]** El pipeline actual firma localmente; la wallet invisible con firma del miembro, tag y CIP-64 todavía no está integrada. Es la primera dependencia del plazo.
- **[Data]** Cero entrevistas y ningún CPA propio acreditado. **[Opinion]** Compra cero implica ingreso cero; el CPA puede no cubrir captación y soporte aun con círculos saldados.
- **[Opinion]** El grupo soporta los faltantes sin garantía; ocultar deuda, mostrar un cobro parcial como completo o revocar un servicio pagado contradice el producto.
- **[Opinion]** Separar compra y firma reduce ciertos riesgos, pero no acredita exclusión IGJ/PSAV. El piloto de $ 25.000,00 por aporte también requiere resolver los límites de la política actual.

**Yellow Flags:**

- **[Estimate]** Tres devs y quince días alcanzan solo con una demo acotada y puertas tempranas; el piloto y la retención quedan para después.
- **[Opinion]** El último turno puede no encontrar valor suficiente; metas libres dispersan compras. Medir rechazo por turno y no forzar una oferta.
- **[Data]** Nombre definitivo en verificación y contactos comerciales familiares sesgados; no presentar la marca ni los comercios como validados.

## Fuentes

- [Brief y notas de pivote](../00-intake/brief.md), [progreso](../PROGRESS.md) y consigna del fundador del 2026-10-25: canal, dos alcances, exclusiones y requisitos internos.
- Estrategia revisada: [Lean Canvas](../02-strategy/lean-canvas.md), [propuesta de valor](../02-strategy/value-proposition.md), [modelo de negocio](../02-strategy/business-model.md), [posicionamiento](../02-strategy/positioning.md), [salida al mercado](../02-strategy/go-to-market.md): economía, métricas, ticket base y puertas.
- [Público](../01-discovery/target-audience.md), jerarquía, trabajos y último turno; [competencia](../01-discovery/competitor-landscape.md), matriz; [mercado](../01-discovery/market-analysis.md), modalidades y límites de evidencia jurídica. Se reutiliza investigación previa; sin verificación normativa nueva.
- [Misión, visión y valores](../03-brand/mission-vision-values.md), decisión inicial adoptada; [tono](../03-brand/tone-of-voice.md), costos y estados; [personalidad](../03-brand/brand-personality.md) y [nombres](../03-brand/naming.md).
- [Reglas del repo](../../../../AGENTS.md), [contexto](../../../proyecto/contexto.md), [stack](../../../proyecto/stack.md), [tareas de Maxi](../../../tareas/maximiliano.md) y [estado](../../../miembros/maximiliano/estado.md): lectura al 25/10, sin modificar código ni planes.
- Código inspeccionado: [pagos](../../../../packages/core/src/payments/pay.ts), [emisor protegido](../../../../packages/core/src/chain/tagged-sender.ts), [política](../../../../packages/core/src/config/policy.ts), [ledger](../../../../packages/core/src/policy/ledger.ts) y [obligaciones](../../../../packages/core/src/junta/obligations.ts). Existencia de código no acredita ejecución en mainnet.
- Referencia provista: `C:/Users/Usuario/.claude/plugins/cache/startup-skill/startup/a5f97c317b93/startup-design/references/output-specs.md`, sección «Phase 6 — Product». Etiquetas: [Data] = insumo o código observado; [Estimate] = cuenta o esfuerzo; [Assumption] = hipótesis/umbral a probar; [Opinion] = criterio de producto. Sin búsquedas web nuevas.
