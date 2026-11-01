---
title: Plan del equipo
subtitle: Cómo llegamos al 9 de noviembre con un prototipo funcional, pagos reales verificables y riesgos transparentes
kicker: Agents on Open Rails · Track Stable Agents LatAm · versión 2
team: Maxi (líder técnico) · Esteban · Daniel
date: 21 de octubre de 2026
footer: La Vaquita · Plan del equipo v2
---


> **Actualización 24/10:** Santos dejó el equipo. Sus tareas en este plan pasaron a Maxi, que además coordina las tareas de todos. Ver [equipo.md](../equipo.md) y [tareas/](../tareas/README.md).

# 0. Cambios en esta versión

Esta versión reemplaza a la del 18/10. La fuente es el estado de decisiones aprobado el 21/10.

| Cambio | Antes (v1, 18/10) | Ahora (v2, 21/10) |
|---|---|---|
| Promesa | "Tu junta de siempre, pero se cobra sola" | "Reglas claras, turnos justos y riesgos transparentes" (provisional) |
| Juntas con plata de terceros | Juntas reales desde el 1/11 | **Simuladas** hasta resolver D2 (mora) y D7 (custodia). Los pagos técnicos con wARS son reales |
| Alcance | Junta, vaca de objetivo y gastos compartidos | Solo junta rotativa |
| Tamaño de grupo | 3 a 12 | Piloto de 4 a 8; en el producto, configurable y sin máximo universal |
| Cómo aporta el miembro (D1) | Abierta | x402 y Ripio, ambos **pendientes de prueba** |
| Calendario | Puertas del 19/10 al 8/11 | Etapas desde el 21/10; congelamiento el **vie 6/11** |
| Roles | Esteban con cadena, pagos y seguridad | El cálculo de exposición pasa a Maxi y buy a Daniel |
| Decisiones | Tabla D1–D5 | Registro de decisiones con estado, responsable, fecha y evidencia (sección 8) |
| Textile FX | No figuraba | Fuera del camino crítico; prueba independiente autorizada si sobra capacidad |

# 1. Fechas críticas

Todas las horas son de Argentina (ART, UTC−3). El cierre oficial es el **lunes 9/11 a las 09:00 GMT, es decir, a las 06:00 ART**. La meta interna de envío es el **domingo 8/11 a las 20:00**.

| Cuándo | Puerta | Qué tiene que estar hecho |
|---|---|---|
| **Vie 23/10** | **G1 · Viabilidad técnica** | Pago real con wARS en mainnet con tag verificado. Identidad ERC-8004 registrada desde la wallet del agente. Prueba de x402 ejecutada con su resultado registrado (D8) |
| **Dom 25/10** | **G2 · Segmento y nombre** | 2 o 3 organizadores con grupo identificado y fecha tentativa (evaluados el sábado 24). Decisión de segmento. Nombre definido (D6) |
| Mié 28/10 | G3 · Diseño financiero | Propuesta de D2 y D7 con su evaluación. Conclusión escrita sobre precios y licitaciones (D10). Si no se cierran, siguen bloqueadas y el MVP queda en simulación |
| Vie 30/10 | G4 · Producto principal | Motor, estados, contabilidad, exposición y garantías simuladas funcionando con tests |
| Mar 3/11 | G5 · Integración | Bot, web, motor y pagos técnicos reales conectados. Demo de negociación de turnos y de un incumplimiento simulado |
| **Vie 6/11** | **G6 · Congelamiento** | Desde acá solo se corrigen errores, se graba el video y se ordena el repo |
| **Dom 8/11 · 20:00** | **G7 · Entrega interna** | Formulario enviado y captura de confirmación en el grupo |
| Lun 9/11 · 06:00 | Cierre oficial | No se envía nada después |

> **Atribución:** toda transacción que firma o envía una wallet nuestra lleva el tag ERC-8021. Una transacción sin tag no se puede contar después. El tag va antes del primer envío.

## Pasos de inscripción (verificar que estén hechos)

| # | Paso | Quién |
|---|---|---|
| 1 | Repo **público** creado con su nombre definitivo (no renombrar después de inscribirse: el código de atribución puede depender del nombre) | Maxi |
| 2 | Equipo inscripto en Loops House y código `celo_…` en el `.env` | Santos y Maxi |
| 3 | Wallet del agente declarada en la inscripción | Esteban |
| 4 | Identidad ERC-8004 registrada desde esa misma wallet | Esteban |
| 5 | Campos del formulario de entrega copiados a `docs/entrega/campos.md` | Santos |

# 2. La Vaquita en una página

| | |
|---|---|
| **Nombre** | La Vaquita (provisional, decisión D6) |
| **Promesa** | Reglas claras, turnos justos y riesgos transparentes |
| **Qué es** | Un agente de IA en el grupo de Telegram que organiza la junta de un grupo en pesos digitales (wARS): explica las reglas, ayuda a acordar los turnos, controla los aportes y avisa los atrasos. Las reglas son código y el agente no puede cambiarlas |
| **Para quién** | Quien ya organiza una junta y su grupo. Más adelante, cooperativas, mutuales y clubes |
| **Qué resuelve** | La junta depende de que alguien cobre, se rompe cuando alguien no paga y el que cobra último pierde contra la inflación. La Vaquita muestra antes de entrar las reglas, los turnos y los riesgos de cada participante |
| **Quién pagaría** | Hipótesis: gratis para usar; pagan quienes obtienen la ventaja de cobrar antes y las organizaciones. El precio por turno está **bloqueado por revisión legal** (D10) |
| **Diferencia** | Otros proyectos de juntas en Celo operan en dólares, no tienen un agente organizador ni reglas de mora explícitas. La Vaquita usa moneda local, turnos justos y riesgos visibles |
| **Red y tokens** | Celo mainnet · wARS · gas en USDC con fee abstraction · tag ERC-8021 · identidad ERC-8004 |

**Lo que no prometemos:** que nadie pierda, una garantía completa ni un cálculo de pérdida máxima. Una junta es un crédito entre conocidos y tiene riesgo. Cómo se cubre un incumplimiento después de cobrar está en diseño (D2).

**Marca (propuesta):** crema `#FFF6E9`, chocolate `#3A2A1F`, calabaza `#E2702B`, pasto `#2F7A55`. La voz es la de un amigo prolijo: frases cortas, vos, montos en pesos y nada de jerga cripto con el usuario.

# 3. Qué es real y qué es simulado

| Funcionalidad | Hasta el 9/11 | Condición para pasar a real |
|---|---|---|
| Registro de identidad ERC-8004 | **Real** en mainnet | — |
| Envío de transacciones con tag y gas en USDC | **Real** en mainnet | — |
| Pagos técnicos con wARS (desde wallets del equipo, montos chicos) | **Real** en mainnet | — |
| Prueba de aporte con x402 | **Real**, como prueba aislada | Pasar los criterios de D8 |
| Prueba de transferencia por Ripio | **Real**, como prueba aislada | Pasar los criterios de D9 |
| Pagos del agente con buy | **Real**, con tope de gasto | Que la llamada resuelva una necesidad del producto |
| Operación completa de una junta (aportes de miembros, adjudicación del pozo, devoluciones) | **Simulada** con saldos simulados | Cerrar D2 y D7 y la revisión legal |
| Garantías y su ejecución | **Simulada** | Cerrar D2 y D7 |
| Incumplimientos y déficit | **Simulado** | Cerrar D2 |
| Precio por turno y comisión | **Simulado** | Cerrar D10 |
| Conversión a dólares (Textile FX) | Fuera del MVP; solo prueba independiente | Ver sección 7 |

**Regla:** el éxito de una transferencia aislada no valida la conciliación financiera de una junta. Cada material del pitch y de la entrega dice qué es real y qué es simulado.

# 4. Requisitos del hackathon y cómo los cumplimos

| Requisito | Cómo lo cumplimos | Responsable |
|---|---|---|
| Identidad ERC-8004 registrada desde la wallet del agente | Registro en G1; enlace en 8004scan en la entrega | Esteban |
| Atribución ERC-8021 | Toda tx que firma o envía una wallet nuestra lleva el tag, verificado con `verifyTx` | Esteban |
| Evidencias en mainnet | Lista de transacciones reales con tag (pagos técnicos, registro, pruebas) | Esteban |
| Usuarios reales | Organizadores y miembros reales usan el flujo completo en modo simulado. Los pagos de usuarios en mainnet dependen de D7 | Santos |
| Repositorio público verificable | Público desde el inicio, sin secretos en el historial, README con lo real y lo simulado | Maxi |
| Cierre | Lun 9/11, 06:00 ART; envío interno el dom 8/11 a las 20:00 | Maxi |

**Criterios de Ripio y qué mostramos:**

| Criterio | Lo que mostramos |
|---|---|
| Funciona en mainnet con wFIAT real | Pagos técnicos con wARS taggeados y verificables en Celoscan |
| Uso real de wFIAT y del stack de Celo | wARS, fee abstraction, ERC-8021, ERC-8004 y, si pasan sus pruebas, x402 y el ramp de Ripio |
| Agente autónomo y útil | Explica reglas y riesgos, negocia turnos con consentimiento y detecta atrasos |
| Una persona real puede usarlo | Organizadores y miembros reales recorren el flujo; testimonios de las entrevistas |
| Impacto en LatAm | Juntas como crédito entre conocidos, turnos justos frente a la inflación y riesgos visibles |

# 5. Equipo y roles

| Persona | Dueño de | Revisión cruzada |
|---|---|---|
| **Maxi** · líder técnico | Backend: motor de reglas, estados, contabilidad y **cálculo de exposición**. Frontend: web de la junta. Integración final y decisiones técnicas | Esteban (motor), Santos (web) |
| **Esteban** · cadena y pagos | Envío taggeado, identidad ERC-8004, atribución, **pruebas de x402 y de Ripio**, manejo de claves y secretos | Maxi |
| **Daniel** · agente y bot | Bot de Telegram, loop del LLM con herramientas, mensajes, alertas de atraso, **integración con buy** | Maxi |
| **Santos** · producto y usuarios | Entrevistas y validación con organizadores, investigación de tamaños reales de juntas, consulta legal (IGJ), landing, deck, video y textos de entrega (después del 25/10) | Daniel |

Ninguna persona carga sola con pagos, custodia y seguridad: lo que toque plata se revisa entre dos.

# 6. Plan por etapas

| Etapa | Maxi | Esteban | Daniel | Santos |
|---|---|---|---|---|
| **21–23/10** · viabilidad técnica | Modelo de datos y máquina de estados | Pago real con tag, ERC-8004 y prueba de x402 (G1) | Bot base y loop del LLM con herramientas de lectura | Entrevistas con organizadores; preguntas sobre garantías, tamaños y medios de pago |
| **24–25/10** · validación | Junta justa y tamaño configurable, con tests | Prueba de Ripio | Explicación de reglas y riesgos en el bot | Evaluar organizadores (sáb 24) y decidir el segmento y el nombre (dom 25, G2) |
| **26–28/10** · diseño financiero | Cálculo de exposición y escenarios de déficit; propuesta de D2 | Propuesta de D7 (custodia y claves) | Herramienta de negociación de turnos con consentimiento | Conclusión sobre precios y licitaciones (D10) |
| **29–30/10** · producto principal | Contabilidad, garantías simuladas y estados completos (G4) | Idempotencia, conciliación y pausa | Alertas de atraso; buy si es útil | Landing v1 y deck v1 |
| **31/10–3/11** · integración | Web conectada al motor | Pagos técnicos reales conectados a la conciliación | Bot conectado a la API | Usuarios reales recorriendo el flujo simulado (G5) |
| **4–6/11** · pruebas | Casos límite del motor | Pagos duplicados, reintentos, firmas vencidas o reutilizadas | Errores y tono del bot | Probar el recorrido desde un celular ajeno. Guion del video |
| **7–8/11** · entrega | README y arquitectura | Lista de evidencias en mainnet | Grabación de pantallas | Video, deck y textos; envío el dom 8 (G7) |

# 7. Puertas de control y qué se recorta

Si una puerta no se cumple, al día siguiente se recorta alcance; la fecha no se mueve.

**No se recorta nunca:** identidad ERC-8004, atribución de las transacciones propias, motor de reglas y contabilidad, cálculo de exposición, demostración de un incumplimiento simulado y los pagos técnicos reales.

**Orden de recorte si nos atrasamos:**
1. La prueba independiente de Textile FX.
2. La reputación avanzada de ERC-8004 (calificaciones).
3. La integración con buy.
4. El camino de Ripio (si no pasó su prueba, queda documentado como siguiente paso).

**Textile FX:** fuera del camino crítico. Si el equipo completa antes sus prioridades, se autoriza una prueba independiente: pedir una cotización wARS → USD₮ y hacer un swap chico desde una wallet de pruebas, sin fondos de grupos. No se incorporan conversiones automáticas sobre fondos de varios grupos.

**Tamaño de grupo:** el piloto y la demo usan grupos de 4 a 8 personas para probar el motor, los pagos y los escenarios de mora. En el producto el tamaño es configurable, sin un máximo universal: la habilitación de operaciones depende de la exposición calculada, la duración del ciclo, las garantías y los controles disponibles. Antes de fijar un límite comercial, Santos investiga los tamaños reales de las juntas.

# 8. Registro de decisiones

Estados: **Aprobada**, **Pendiente de prueba**, **Bloqueada por diseño o revisión legal**.

| # | Decisión | Estado | Responsable | Fecha | Evidencia |
|---|---|---|---|---|---|
| A1 | Promesa: "Reglas claras, turnos justos y riesgos transparentes" (provisional) | Aprobada | Santos | 21/10 | Aprobación de Maxi, 21/10 |
| A2 | Calendario y puertas de esta versión | Aprobada | Maxi | 21/10 | Aprobación de Maxi, 21/10 |
| A3 | Reparto de tareas de la sección 5 | Aprobada | Maxi | 21/10 | Aprobación de Maxi, 21/10 |
| A4 | Prioridades del hackathon (sección 7) | Aprobada | Maxi | 21/10 | Aprobación de Maxi, 21/10 |
| A5 | Textile FX fuera del camino crítico; prueba independiente si sobra capacidad | Aprobada | Todos | 21/10 | Aprobación de Maxi, 21/10 |
| A6 | Piloto de 4 a 8 personas; tamaño configurable en el producto | Aprobada | Maxi y Santos | 21/10 | Aprobación de Maxi, 21/10 |
| A7 | Solo junta rotativa en el MVP (sin vaca de objetivo ni gastos compartidos) | Aprobada | Maxi | 21/10 | Aprobación de Maxi, 21/10 |
| D2 | Mora después de cobrar: sin garantías ni compensación automática en el MVP | Aprobada | Maxi | 24/10 | [decisiones.md](decisiones.md), 24/10. Falta: escenarios de incumplimiento en el motor |
| D5 | Hosting: API y bot en Railway, web en Vercel | Aprobada, pendiente de prueba | Maxi | 24/10 | [decisiones.md](decisiones.md), 24/10. Falta: despliegue de prueba (30/10) |
| D6 | Nombre: seguimos con La Vaquita y lo aclaramos en el pitch | Aprobada | Maxi | 24/10 | [decisiones.md](decisiones.md), 24/10 |
| D7 | Contrato de reglas sin custodia, aportes P2P; si el spike falla, `DIRECT_P2P` | Aprobada, condicionada al spike | Maxi y Esteban | 24/10 | [decisiones.md](decisiones.md), 24/10. Falta: resultado del spike |
| D8 | x402 para aportes | Pendiente de prueba | Esteban | 23/10 | Pendiente: criterios de la sección 10 del plan técnico |
| D9 | Ripio como camino de aporte | Pendiente de prueba | Esteban | 27/10 | Pendiente: criterios de la sección 10 del plan técnico |
| D10 | Junta clásica con cuota fija; precio por turno y licitaciones después de la revisión legal | Aprobada | Maxi | 24/10 | [decisiones.md](decisiones.md), 24/10. La conclusión sobre la RG IGJ 8/2015 sigue pendiente para la hoja de ruta |

Cada cambio de estado se anota acá con su fecha y su evidencia (resultado de la prueba, documento de diseño o conclusión legal).

# 9. Cómo trabajar sin pisarse

- **Reunión diaria de 15 minutos a las 21:00:** qué hice, qué hago, qué me bloquea.
- **Si alguien se traba más de una hora, lo dice en el grupo.**
- **Un issue por tarea**, con responsable y fecha. Nadie hace push directo a `main` y cada PR lo revisa otra persona.
- **El contrato de datos** vive en `packages/core`; un cambio se avisa antes de mergear.
- **Regla de las dos llaves:** cualquier envío real desde la wallet del agente lo aprueba otra persona antes de activar `LIVE_PAYMENTS`.
- **No se reciben fondos de participantes** en juntas operativas mientras D2 y D7 estén bloqueadas.
- **La clave del agente** la tienen solo Maxi y Esteban; nunca va al repo, a un chat ni a una captura.
- **Definición de terminado:** la del plan técnico (sección 16).
- **Frases prohibidas:** "nadie pierde", "100 % seguro", "sin riesgo", "rendimiento", "invertir", "garantizado".

# 10. Validación con organizadores

Las métricas se cuentan por separado, porque prueban cosas distintas:

| Métrica | Qué demuestra |
|---|---|
| Organizadores entrevistados | Entendimiento del problema real |
| Organizadores con grupo identificado y fecha tentativa | Interés accionable |
| Integrantes que entienden y aceptan las reglas | Comprensión de la solución |
| Integrantes que aceptarían una garantía y sus costos | Fricción del mecanismo central |
| Tamaños reales de las juntas relevadas | Base para el límite comercial |
| Pagos técnicos completados (x402 o Ripio) | Viabilidad técnica, no demanda |

**Plan de contingencia (G2):** si el domingo 25/10 no hay 2 o 3 organizadores dispuestos, se prueba otro segmento (colectividades, cooperativas, compañeros de trabajo). Si los organizadores rechazan la garantía o la wallet, se documenta la objeción y se lleva a D2 y D7.

La guía de 10 preguntas está en el documento "Por qué fracasan" (sección 7). Se suma una pregunta: ¿cuántas personas suelen tener sus juntas y cuánto dura un ciclo?

# 11. Pitch y demo

## Deck de 8 diapositivas

| # | Diapositiva | Contenido |
|---|---|---|
| 1 | Portada | Logo, promesa y equipo |
| 2 | El problema | La junta depende de un cobrador, se rompe con el que no paga y el último pierde contra la inflación |
| 3 | Por qué fracasaron las juntas digitales | Distribución, mora y costo, con casos reales |
| 4 | La Vaquita | Un agente que organiza la junta con reglas claras, turnos justos y riesgos transparentes |
| 5 | Turnos y riesgos visibles | La tabla de turnos y la exposición de cada participante (en simulación) |
| 6 | Demo | Recorrido del video |
| 7 | Qué es real y qué es simulado | Pagos reales en mainnet con tag e identidad ERC-8004; operación de junta y mora en simulación, y por qué |
| 8 | Siguiente paso | Diseño de cobertura (D2), custodia (D7), revisión legal y piloto con organizadores |

## Guion del video (3:00)

| Minuto | Qué se muestra | Quién habla |
|---|---|---|
| 0:00 | El problema, con un caso real de las entrevistas | Santos |
| 0:25 | El organizador arma la junta en Telegram y el agente explica reglas y riesgos | Daniel |
| 0:55 | El agente negocia un cambio de turno con el consentimiento del grupo | Daniel |
| 1:25 | Un incumplimiento simulado: el agente avisa, se ejecuta la garantía simulada y se muestra el déficit que queda | Maxi |
| 1:55 | Pagos reales en mainnet: transacción con tag, identidad ERC-8004 y pruebas de pago | Esteban |
| 2:25 | Qué es real, qué es simulado, qué falta y el siguiente paso | Santos |

Ensayar con cronómetro al menos dos veces y tener el video grabado por si falla la conexión en vivo.

# 12. Entrega final

| Elemento | Detalle | Responsable |
|---|---|---|
| Repo público | README con qué es, cómo se corre, arquitectura, qué es real y qué es simulado, límites y enlaces. Sin secretos en el historial | Maxi |
| Wallet del agente | La misma de la inscripción y de ERC-8004 | Esteban |
| Identidad ERC-8004 | Enlace en 8004scan | Esteban |
| Evidencias en mainnet | Hashes con tag verificado; pruebas de x402 y Ripio con su resultado y la wallet PayTo, si corresponde | Esteban |
| Usuarios | Organizadores entrevistados, grupos que recorrieron el flujo simulado y cómo se los consiguió | Santos |
| buy | Llamadas pagadas, gasto y qué necesidad resolvieron (si se entra en ese track) | Daniel |
| Registro de decisiones | Sección 8 actualizada al día de la entrega | Maxi |
| Video y deck | Video de 3 minutos no listado y deck en PDF | Santos |
| Confirmación | Captura del envío en el grupo | Maxi |

# 13. Riesgos

| Riesgo | Impacto | Qué hacer |
|---|---|---|
| La garantía no cubre las obligaciones pendientes después de cobrar | Pérdida para el grupo | D2 bloqueada; operación en simulación; escenarios de déficit documentados en el plan técnico |
| Custodia de fondos de terceros | Riesgo técnico y regulatorio | D7 bloqueada; no recibir fondos de participantes en juntas operativas |
| Precio por turno alcanzado por la regulación de ahorro previo | El diferencial queda en duda | D10 bloqueada; la tabla de turnos solo en simulación |
| x402 falla en mainnet o cambia de versión | Sin camino de aporte sin gas | D8: prueba con versiones registradas; Ripio como alternativa sujeta a su prueba |
| No conseguir organizadores | Se cae el criterio de usuarios reales | Plan de contingencia de la sección 10 |
| Usuarios reales sin pagos en mainnet | Menos evidencia para el jurado | Mostrar el recorrido real en modo simulado y los pagos técnicos reales; explicarlo en la entrega |
| Confundir una prueba técnica con un sistema listo | Afirmaciones falsas | Sección 3 en el README, el deck y el video |
| Nombre compartido con vaquita.fi | Confusión | D6 antes del 25/10 |
| Querer agregar funciones tarde | No se llega a integrar | Congelamiento el 6/11 |

# Anexo A · Textos para el formulario

Ajustar cada texto al estado real del 8/11. Nunca decir que algo funciona si no funciona.

| Campo probable | Texto |
|---|---|
| Nombre | La Vaquita (provisional) |
| Frase | Reglas claras, turnos justos y riesgos transparentes |
| Descripción corta | La Vaquita es un agente que organiza la junta de un grupo en pesos digitales sobre Celo: explica las reglas, ayuda a acordar turnos justos, controla los aportes y muestra los riesgos de cada participante antes de entrar. |
| Problema | En LatAm, mucha gente se presta plata en juntas entre conocidos porque el crédito es caro o inaccesible. Pero la junta depende de un cobrador, se rompe cuando alguien no paga y el que cobra último pierde contra la inflación. |
| Solución | Un agente en Telegram con un motor de reglas en código: turnos, aportes, estados y exposición de cada participante. El LLM conversa y propone; el código decide. |
| Qué es real y qué es simulado | Real en Celo mainnet: identidad ERC-8004, transacciones con tag ERC-8021 y pagos técnicos con wARS [y pruebas de x402 y Ripio, si pasaron]. Simulado: la operación completa de juntas con fondos de terceros, las garantías y los incumplimientos, hasta resolver la cobertura, la custodia y la revisión legal. |
| Tecnología | Celo mainnet, wARS de Ripio, fee abstraction (gas en USDC), ERC-8021, ERC-8004, TypeScript, viem y un LLM con herramientas. |
| Estado actual | [Ajustar al 8/11: organizadores, grupos, evidencias en mainnet] |
| Límites | No garantizamos que nadie pierda: una junta es un crédito entre conocidos. La cobertura de incumplimientos y la custodia están en diseño. No es un producto financiero regulado. |
| Equipo | Maxi (líder técnico: backend y frontend), Esteban (cadena y pagos), Daniel (agente y bot), Santos (producto, usuarios y pitch). |
