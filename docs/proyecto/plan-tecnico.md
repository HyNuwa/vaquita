---
title: Plan técnico
subtitle: Qué construimos, qué es real y qué es simulado, y qué decide el código en lugar del LLM
kicker: La Vaquita · versión 2
team: Maxi · Esteban · Daniel
date: 21 de octubre de 2026
footer: La Vaquita · Plan técnico v2
---


> **Actualización 24/10:** el equipo decidió D2, D5, D6, D7 y D10, el `.env` único, el alcance y la estructura ([decisiones.md](decisiones.md)), y Santos dejó el equipo. La tabla de la sección 1 ya tiene los estados nuevos. Donde este plan habla de garantías, déficit o custodia, manda la arquitectura de [plan-junta-contrato.md](plan-junta-contrato.md): el contrato nunca guarda plata y los aportes van de miembro a miembro. El lector de cadena y los pagos viven en `packages/core`, no en `apps/api`.

# 0. Cambios en esta versión

| Cambio | v1 (18/10) | v2 (21/10) |
|---|---|---|
| Operación de juntas | Real en mainnet desde el 1/11 | **Simulada** hasta cerrar D2 y D7. Los pagos técnicos con wARS son reales |
| Modos | Solo `LIVE_PAYMENTS` | `LIVE_PAYMENTS` (envío real) y `JUNTA_MODE` (simulada por defecto; la operación real está bloqueada) |
| Estados de ronda | `pendiente → abierta → completa → pagada` | Máquina de estados que separa la cancelación antes de adjudicar de la mora después de adjudicar |
| Exposición | No existía | Cálculo de exposición nominal y escenarios donde la garantía no alcanza |
| Fórmula de la junta justa | El texto decía Σ pozos = N·A (inconsistente con su propio ejemplo) | **Corregida:** Σ pozos = N·P = N²·A |
| Tamaño de grupo | 3 a 12 | Configurable, sin máximo universal; piloto de 4 a 8 |
| Aportes de miembros | Firma de transacción por el miembro | x402 o Ripio, ambos pendientes de prueba; una autorización por aporte, sin débito recurrente |
| Herramientas del agente | Incluían proponer y explicar | Suman negociar turnos con consentimiento y alertar atrasos, con límites explícitos |
| Seguridad | Topes globales | Topes por operación, por grupo y globales; pausa; idempotencia; montos contra la tabla aceptada; notificaciones de montos con texto fijo |
| Textile FX | No figuraba | Fuera del camino crítico; prueba independiente opcional |
| Alcance | Junta y vaca de objetivo | Solo junta rotativa |

# 1. Decisiones que afectan el diseño

El registro completo está en el plan del equipo (sección 8). Las que condicionan este documento:

| # | Decisión | Estado | Efecto en el diseño |
|---|---|---|---|
| A6 | Piloto de 4 a 8; tamaño configurable | Aprobada | `N` es un parámetro; ningún límite fijo en el código |
| A7 | Solo junta rotativa | Aprobada | Sin vaca de objetivo ni gastos compartidos |
| D2 | Mora después de cobrar: sin garantías ni compensación automática en el MVP | Aprobada (24/10) | El motor registra obligaciones y pagos y explica los escenarios de incumplimiento; la compensación queda como prototipo en simulación |
| D7 | Contrato de reglas sin custodia, aportes P2P | Aprobada (24/10), condicionada al spike | Si el spike no pasa, `DIRECT_P2P` con id de obligación. Aportes reales de personas ajenas al equipo solo después de resolver lo financiero, la seguridad y lo legal; hasta entonces, la junta exprés del equipo |
| D8 | x402 | Pendiente de prueba | Módulo experimental, detrás de una bandera |
| D9 | Ripio | Pendiente de prueba | Módulo experimental, detrás de una bandera |
| D10 | Junta clásica con cuota fija | Aprobada (24/10) | Sin precio por turno, comisión ni subastas; vuelven a la hoja de ruta después de la revisión legal |

# 2. Resumen

Un organizador arma una junta en Telegram. El agente explica las reglas, ayuda a acordar el orden de los turnos con el consentimiento del grupo y muestra a cada participante su exposición antes de entrar. Durante el ciclo, el motor lleva la contabilidad de aportes, adjudicaciones, garantías e incumplimientos y el agente avisa los atrasos.

Hasta el 9/11, esa operación corre **en simulación**, con saldos simulados. En paralelo, la tubería de pagos se prueba **en mainnet** con transacciones reales con wARS, tag ERC-8021 y gas en USDC, para demostrar que el riel funciona.

# 3. Alcance del MVP

| Dentro del MVP | Fuera del MVP |
|---|---|
| Junta rotativa con `N` configurable (piloto de 4 a 8) | Vaca de objetivo y gastos compartidos |
| Crear la junta por chat con confirmación del organizador | Operación real con fondos de terceros (D2, D7) |
| Explicación de reglas, turnos y exposición de cada participante | Cobertura real de incumplimientos |
| Negociación de turnos con consentimiento | Subastas o licitaciones de turnos (D10) |
| Motor de estados y contabilidad, con tests | Débito recurrente automático |
| Garantías, incumplimientos y déficit en simulación | Contrato de escrow (depende de D7) |
| Alertas de atraso con reglas simples | Modelos predictivos de mora |
| Pagos técnicos reales con tag en mainnet | Conversiones automáticas a dólares |
| Identidad ERC-8004 | Reputación avanzada de ERC-8004 (si falta tiempo) |
| Pruebas de x402 y Ripio (experimentales) | WhatsApp |
| Pagos del agente con buy (si son útiles) | KYC propio |
| Web con banner de "modo simulado" | App móvil nativa |

# 4. Modos de operación

| Variable | Valores | Qué controla |
|---|---|---|
| `LIVE_PAYMENTS` | vacío (ensayo) · `si-muevo-plata-real` | Si el envío taggeado transmite o solo firma. Afecta únicamente los pagos técnicos |
| `JUNTA_MODE` | `simulada` (por defecto) · `real` (bloqueado) | Si la operación de una junta mueve saldos simulados o fondos reales. `real` no arranca mientras D2 y D7 estén bloqueadas: el proceso se niega a iniciar con ese valor |
| `X402_ENABLED` · `RIPIO_ENABLED` | `false` por defecto | Activan los módulos experimentales solo en pruebas |

En modo simulado, el bot y la web lo dicen en cada pantalla y mensaje que muestra saldos ("simulado").

# 5. Actores

| Actor | Qué hace | Cómo entra |
|---|---|---|
| Organizador | Crea la junta, invita y confirma las reglas | Telegram y web |
| Miembro | Se une, ve su turno y su exposición, aporta (simulado) | Link a la web y Telegram |
| Agente | Conversa, explica, propone, avisa. No decide pagos | Bot de Telegram |
| Motor de reglas | Decide qué operación es válida. No tiene LLM | `packages/core` |
| Equipo (operador) | Configura, monitorea, responde soporte. Sus órdenes pasan por el motor | Panel y base de datos |

# 6. Flujos

## A · Crear una junta
1. El organizador escribe, por ejemplo: "armemos una junta de 6, $20.000 por semana".
2. El agente arma una **propuesta**: `N`, aporte, frecuencia, fecha de inicio y método de orden (sorteo, elección o lista).
3. El motor calcula la tabla de turnos y la exposición de cada turno; el bot las muestra en pesos.
4. El organizador confirma con un botón. Sin confirmación no se crea nada.

## B · Unirse
1. El miembro abre el link y ve las reglas, su turno, lo que recibiría y su **exposición** (cuánto debería seguir aportando después de cobrar, y cuánto cubre su garantía en la simulación).
2. Acepta las reglas. En modo simulado, el saldo y la garantía son simulados.

## C · Aportar
- **Modo simulado (MVP):** el miembro confirma el aporte y el motor registra un movimiento simulado.
- **Caminos reales (pendientes de prueba, D8 y D9):** cada aporte requiere **una autorización por aporte** del miembro (no hay débito recurrente). Ver la sección 10.

## D · Adjudicar el pozo (simulado)
1. El motor verifica que la ronda esté `COMPLETA`.
2. Calcula la orden de pago: destinatario = miembro del turno, monto = el de la tabla aceptada.
3. En simulación, registra el movimiento. En modo real (bloqueado), usaría el envío taggeado.

## E · Atraso e incumplimiento (simulado)
1. El agente avisa antes del vencimiento y en el vencimiento, con mensajes de texto fijo.
2. Si vence el plazo de gracia, la ronda pasa a `INCOMPLETA`.
3. **Antes de adjudicar:** la ronda puede cancelarse y se devuelven los aportes de esa ronda (simulado).
4. **Después de adjudicar:** se ejecuta la garantía simulada del que falló y el motor registra el **déficit** que queda. Quién absorbe ese déficit es D2 y no está decidido: el motor lo muestra, no lo reparte.

## F · Cierre
Resumen del ciclo con aportes, puntualidad y, en simulación, garantías devueltas y déficits registrados.

# 7. Estados

**Ronda:**

```
ABIERTA → RECAUDANDO → VERIFICANDO → COMPLETA → ADJUDICADA → CERRADA
                            │
                            └→ INCOMPLETA → CANCELADA   (antes de adjudicar: se devuelve lo aportado)
                                          → PAUSADA     (decisión del grupo o pausa general)

ADJUDICADA → EN_MORA → CUBIERTA_PARCIAL / CUBIERTA   (después de adjudicar: garantía y déficit, D2)
```

**Aporte:** `DETECTADO → CONCILIADO` o `SIN_ASIGNAR` (lo revisa el operador) o `DUPLICADO` (no suma).

**Orden de pago:** `PROPUESTA → APROBADA_POR_MOTOR → FIRMADA → ENVIADA → CONFIRMADA` o `FALLIDA`. Ninguna orden salta un estado. Cada orden tiene una clave de idempotencia por ronda.

La **cancelación antes de adjudicar** y la **mora después de adjudicar** son casos distintos y tienen reglas distintas.

# 8. Motor de reglas

## Junta justa (solo en simulación hasta D10)
Datos: `N` miembros, aporte `A` por ronda, pozo de ronda `P = N·A`, tasa mensual `r` congelada al crear la junta.

```
w_k    = (1 + r)^(k − 1)        k = 1..N
c      = N · P / Σ w_k
pozo_k = c · w_k
```

- **Invariante:** Σ pozo_k = N · P = N² · A, exacto, en `bigint` con 18 decimales. El residuo de redondeo va al turno N.
- La tabla se calcula al crear la junta, la aceptan todos y no se recalcula.
- Comisión por turno temprano: **solo en simulación** hasta D10.

Ejemplo (N = 6, A = $20.000, r = 1,9 %): turno 1, $114.425; turno 3, $118.815; turno 6, $125.717. Suma: $720.000.

## Exposición nominal
```
exposicion_k = max(0, aportes_pendientes_despues_de_cobrar_k − garantia_ejecutable_k)
```
Es una medida de diseño, no la pérdida máxima: no incluye recuperaciones, costos ni impagos simultáneos. El motor la calcula por participante y por grupo y la muestra antes de unirse.

## Garantías (parámetros, no aprobados)
El monto de garantía por turno es un **parámetro configurable**. El ejemplo de la sección 9 usa 1,5 aportes para la primera mitad y 0,5 para la segunda, solo como ilustración. Un aval del organizador no es una garantía ejecutable.

## Reglas que el motor tiene que documentar (D2 resuelve las marcadas)
1. Cuándo una ronda está completa.
2. Plazo de gracia y criterio de mora.
3. Orden de aplicación de las garantías.
4. **Tratamiento del déficit cuando la garantía no alcanza (D2).**
5. Quién autoriza y ejecuta la adjudicación.
6. Pagos tardíos o duplicados.
7. Devolución y cancelación antes de adjudicar.
8. **Consecuencias del impago después de adjudicar (D2).**
9. Cuándo se libera el sobrante de garantía.
10. Topes por operación, por grupo y globales; pausa general.
11. Invariantes contables: lo reconocido, lo recibido, las obligaciones y las salidas autorizadas.
12. Cada monto se compara contra la tabla aceptada por todos.

## Tamaño del grupo
`N` es configurable y no tiene un máximo universal. En modo real (bloqueado), la habilitación de una junta dependería de la exposición calculada, la duración del ciclo, las garantías y los controles. El piloto usa de 4 a 8.

# 9. Escenarios donde la garantía no alcanza

Ejemplo ilustrativo: N = 6, aporte $20.000, garantía de 1,5 aportes ($30.000) para los turnos 1 a 3 y de 0,5 aportes ($10.000) para los turnos 4 a 6. Incumplimiento **justo después de cobrar**:

| Turno que incumple | Aportes que todavía debía | Garantía | Déficit sin cubrir |
|---|---|---|---|
| 1 | $100.000 | $30.000 | **$70.000** |
| 2 | $80.000 | $30.000 | **$50.000** |
| 3 | $60.000 | $30.000 | **$30.000** |
| 4 | $40.000 | $10.000 | **$30.000** |
| 5 | $20.000 | $10.000 | **$10.000** |
| 6 | $0 | $10.000 | $0 (se devuelve) |

- **Antes de cobrar:** la ronda queda incompleta; la garantía del que falla cubre su aporte faltante hasta su monto. Si la ronda no se completa, se cancela y se devuelve lo aportado en esa ronda.
- **A mitad del ciclo:** turnos 3 y 4, déficit de $30.000 cada uno.
- **Dos incumplimientos:** si fallan los turnos 1 y 2, el déficit llega a $120.000.

En los turnos 1 a 5, la garantía no cubre todas las obligaciones pendientes. Quién absorbe el déficit es D2. La demo muestra este caso en simulación.

# 10. Pagos reales en mainnet

**Reales hasta el 9/11:** envío taggeado (`tagged-sender`), registro ERC-8004, pagos técnicos con wARS entre wallets del equipo, pruebas aisladas de x402 y Ripio, y pagos del agente con buy.

**Regla de atribución:** toda transacción que firma o envía una wallet nuestra lleva el tag ERC-8021, verificado sobre la transacción firmada. Las liquidaciones de x402 las envía el facilitador y las entregas del ramp las envía Ripio: no llevan nuestro tag. Su uso requiere que el equipo apruebe esa excepción y documente la wallet PayTo.

## D8 · Criterios de aceptación de x402
- Versiones exactas del cliente y del facilitador registradas.
- Red `eip155:42220`, token wARS y Permit2 con pago de gas patrocinado.
- Un pago real desde una wallet nueva, sin gas en esa configuración concreta.
- `payTo` y monto exactos.
- Conciliación con la ronda correcta.
- Rechazo de firmas vencidas o reutilizadas.
- Sin aportes duplicados ante reintentos.
- Errores del facilitador manejados.
- Excepción de atribución aprobada y PayTo documentada.

## D9 · Criterios de aceptación de Ripio
- Una transferencia completa: banco → ramp.ripio.com → wARS en Celo.
- Requisitos de verificación del pagador documentados.
- Cómo se identifica al pagador (una dirección por miembro concilia, pero no acredita identidad).
- Cómo se administran los fondos y las claves de esas direcciones (depende de D7).
- Tiempos y costos medidos.
- Excepción de atribución aprobada.

Una transferencia aislada exitosa no valida la conciliación financiera de una junta.

# 11. Backend

**Módulos de `apps/api`:** `juntas` · `miembros` · `rondas` · `aportes` (conciliación e idempotencia) · `ordenes` · `simulacion` (saldos, garantías y déficit simulados) · `jobs` · `publico` · `buy`. El lector de eventos y los pagos (`chain`, `payments/x402`, `payments/ripio`) viven en `packages/core` y la API los importa (decisión del 24/10).

| Endpoint | Quién | Para qué | Modo |
|---|---|---|---|
| `POST /juntas` | Bot, con confirmación | Crear la junta, la tabla de turnos y la exposición | Simulado |
| `GET /j/:slug` | Público | Estado de la junta | Simulado (rotulado) |
| `POST /j/:slug/unirse` | Miembro | Aceptar reglas y turno | Simulado |
| `POST /rondas/:id/aporte` | Miembro | Registrar un aporte simulado | Simulado |
| `POST /rondas/:id/aporte/x402` | Miembro | Aporte por x402 | Experimental (D8) |
| `POST /rondas/:id/incumplimiento` | Operador (para demo) | Simular un incumplimiento | Simulado |
| `GET /rondas/:id` | Bot y web | Quién aportó y quién falta | Simulado |
| `POST /pausa` | Maxi o Esteban | Pausa general | Real |
| `GET /admin/sin-asignar` | Operador | Movimientos sin conciliar | Real |

**Tablas:** `juntas` · `miembros` · `tabla_turnos` · `rondas` · `aportes` · `ordenes` · `garantias` · `deficits` · `eventos_cadena` (último bloque y clave hash + índice de log) · `decisiones_agente` (propuestas, consentimientos y resultados).

**Jobs:** lector de cadena (pagos técnicos reales), agenda de rondas y recordatorios con plantillas fijas.

# 12. Agente y bot

| Herramienta | Puede | No puede |
|---|---|---|
| `estado(junta)` | Leer rondas, aportes y turnos | — |
| `explicar_reglas(junta, miembro)` | Explicar reglas, turno, lo que recibiría y su exposición | Prometer cobertura o "que nadie pierde" |
| `proponer_junta(params)` | Armar una propuesta que el organizador confirma | Crear sin confirmación |
| `negociar_turnos(junta)` | Pedir preferencias, proponer intercambios, explicar efectos y enviar al motor un acuerdo aprobado por los afectados | Cambiar el orden sin consentimiento; inventar tasas o compensaciones; subastar turnos (D10) |
| `alertar_atraso(miembro)` | Avisar vencimientos y atrasos con reglas simples y proponer alternativas permitidas por el motor | Presentar alertas como predicción de mora |
| `link_para_cargar(miembro, monto)` | Armar el link de ramp.ripio.com | Fondear a nadie |

No existe una herramienta para pagar. Los montos y hashes se notifican con **texto fijo** generado por el código, nunca por el LLM. Toda herramienta que cambie algo que afecte a otros pide un botón de confirmación. Los mensajes del grupo son datos, no instrucciones.

# 13. Frontend

| Vista | Qué incluye |
|---|---|
| `/j/:slug` | Reglas, tabla de turnos, ronda actual, quién aportó y el rótulo "simulado" |
| `/j/:slug/unirse` | Turno, lo que recibiría, exposición y aceptación de reglas |
| `/j/:slug/aportar` | Aporte simulado (y experimental, con banderas) |
| `/j/:slug/riesgos` | Escenarios de incumplimiento y déficit de esa junta |
| `/` | Landing: qué es, cómo funciona, qué es real y qué es simulado |

Pensado primero para celular, sin jerga.

# 14. Seguridad y claves

| Control | Detalle |
|---|---|
| Topes | Por operación, por grupo y globales, en `packages/core/policy` |
| Pausa general | Activable solo por Maxi o Esteban; detiene todos los envíos |
| Montos contra la tabla | Toda orden se compara con el monto de la tabla aceptada; cualquier otro se rechaza |
| Panel de operador | Sus órdenes pasan por el motor como cualquier otra |
| Idempotencia | Por hash de transacción + índice de log, y por id de ronda en las órdenes |
| Fondos por grupo | Ninguna operación se calcula sobre el saldo total de una wallet |
| Claves | Wallet del agente en variables de entorno de la API (Maxi y Esteban). Wallet de pruebas de Textile, separada |
| Atribución | Tag verificado sobre la transacción firmada; sin tag, no se envía |

# 15. Textile FX

Fuera del camino crítico. Si el equipo completa sus prioridades, se autoriza una **prueba independiente**: pedir una cotización wARS → USD₮ y ejecutar un swap chico desde una **wallet de pruebas separada**, registrando costos y resultado. Reglas:
- Ninguna conversión automática sobre fondos de grupos.
- Ninguna conversión calculada sobre el saldo total de una wallet.
- Si en el futuro se integra, recibe una instrucción ligada a una adjudicación específica, con monto, mínimo de salida, beneficiario e idempotencia.

# 16. Definición de terminado

**Motor y contabilidad**
- Σ pozos = N² · A exacto para N de 4 a 8 y varias tasas, incluida r = 0; también para N mayores (tamaño configurable).
- Ninguna adjudicación si la ronda no está `COMPLETA`.
- Ningún pago a alguien que no es el miembro del turno ni por un monto distinto del de la tabla.
- **Pagos duplicados:** un mismo evento procesado dos veces no suma dos aportes.
- **Reintentos:** reintentar una orden no genera un segundo pago.
- **Firmas vencidas o reutilizadas:** rechazadas (en la prueba de x402).
- **Conciliación:** cada aporte real queda asignado a miembro y ronda, o como `SIN_ASIGNAR`.
- **Pausa de emergencia:** con la pausa activa, ningún envío sale.
- **Caso simulado de mora con déficit mayor que la garantía:** el turno 1 incumple después de cobrar, se ejecuta su garantía simulada y el motor registra el déficit restante sin repartirlo.
- La cancelación antes de adjudicar devuelve exactamente lo aportado en esa ronda.

**Hackathon**
- Identidad ERC-8004 visible en 8004scan.
- Pagos técnicos reales en mainnet con tag verificado con `verifyTx`.
- Repo público con la sección "Qué es real y qué es simulado".
- Usuarios reales recorrieron el flujo simulado.

# 17. Riesgos técnicos

| Riesgo | Mitigación |
|---|---|
| Fórmula mal implementada | Tests del invariante N² · A y del residuo |
| Doble procesamiento de eventos | Idempotencia por hash + índice de log |
| x402 falla o cambia de versión | Versiones fijadas y registradas; módulo detrás de bandera |
| Mezcla de fondos entre grupos | Contabilidad por grupo; nada sobre el saldo total |
| Caída del RPC | RPC de respaldo (Chainstack) |
| Caída del LLM | Plantillas fijas; el motor no depende del LLM |
| Prompt injection en el grupo | El LLM no tiene herramientas de pago; montos con texto fijo |
| Clave del agente comprometida | Saldo mínimo, topes, pausa y dos personas con acceso |

# 18. Hoja de ruta (después del hackathon)

- Resolver D2 (cobertura) y D7 (custodia) y pasar la revisión legal antes de cualquier operación real.
- Escrow no custodial, si D7 lo elige.
- Panel para organizaciones.
- Historial de cumplimiento, con consentimiento.
- Otras monedas: wBRL, wCOP, wMXN.
