# Plan: junta con contrato de reglas

21/10/2026 · Maxi · Copia del [documento en Claude Docs](https://claude.ai/artifact/1DoNkMgrdAxe7DaV3VaLgb), que tiene los diagramas. Actualizada el 22/10/2026.

**Propuesta:** un contrato de reglas en Celo que nunca guarda plata. Cada aporte pasa por el contrato y llega en la misma transacción al que cobra; el contrato solo verifica monto, turno y destinatario, y deja el registro. La parte financiera (cuánto arriesga cada uno, el orden de turnos y la mora) la calcula un motor determinístico fuera de la cadena, y el agente la explica. Se decide con el equipo el 25/10/2026. **No está aprobada.**

**Promesa del MVP:** tu grupo acuerda las reglas, cada aporte queda identificado y todos pueden comprobar qué se pagó y qué sigue pendiente. Antes de participar, conocés tus obligaciones y los riesgos del turno elegido.

*Versión 3 (22/10), con la segunda revisión incorporada: las autorizaciones de wARS son por contrato y no por junta, el plan B identifica cada pago con un id de obligación, los pagos tardíos y las rondas superpuestas tienen reglas, y se suman una prueba de UX y el criterio de usuarios independientes. Después del 25/10 el diseño queda congelado.*

## Respuesta corta: contrato de reglas con pago P2P

Sí a un contrato, pero uno que **no guarde plata**: el pago va del miembro al que cobra en la misma transacción, y el contrato solo deja pasar el monto correcto al destinatario correcto. Safe no hace falta para las juntas; sirve para otra cosa (abajo).

| Opción | ¿Guarda plata? | ¿Hace cumplir las reglas? | Trabajo hasta el 9/11 | Veredicto |
| --- | --- | --- | --- | --- |
| **Contrato de reglas + pago P2P** | No: cada aporte pasa directo al que cobra | Sí: monto, turno y destinatario fijos desde el inicio; registro en cadena | Contrato chico (unas 150 líneas) con tests e invariantes | **Recomendada** |
| P2P puro (transferencias de wARS; el agente concilia) | No | No: el miembro puede mandar otro monto o a otra wallet, y con dos juntas entre las mismas personas no se sabe a cuál corresponde un pago | Casi nada | **Plan B** si el contrato no llega al 30/10 |
| Safe por junta | Sí, el grupo, y en la práctica quien firma | No: una multisig no sabe de turnos ni de montos | Medio, y difícil para alguien que nunca usó cripto | No para las juntas |
| Contrato custodio (escrow con garantía, como VaquitaAI) | Sí | Sí | Alto: estados, devoluciones, garantía y seguridad | No: es custodia, y la garantía no cubre lo que promete |

**Dónde sí usar Safe:** como guardián del contrato, una Safe 2 de 3 del equipo que solo puede pausar los pagos si aparece un bug. No puede mover plata de nadie. Es opcional: si complica, ese rol queda en una wallet del equipo con el mismo límite.

## Cómo funciona

*Diagrama de las tres capas y del camino de un pago: en el [documento en Claude Docs](https://claude.ai/artifact/1DoNkMgrdAxe7DaV3VaLgb).*

El agente no puede mover plata ni cambiar reglas: solo propone, y el motor valida. Juan firma su pago desde la web; el contrato verifica que vaya a Marta por el monto acordado y lo pasa en la misma transacción. El motor se entera por los eventos del contrato y el agente avisa en el grupo.

## El contrato: qué hace y qué no puede hacer

Un solo contrato para todas las juntas (`JuntaReglas`), con wARS fijo como token. Lo despliega la wallet del agente con el tag de atribución. Cada junta guarda: miembros en orden de turno (el miembro k cobra la ronda k), monto, período, inicio, días de gracia y organizador.

| Función | Quién la llama | Qué hace | MVP |
| --- | --- | --- | --- |
| `crearJunta(miembros, monto, periodo, inicio, gracia)` | Organizador | Registra las reglas. Rechaza miembros repetidos y montos en 0. La junta queda pendiente | Sí |
| `aceptar(id)` | Cada miembro, desde su wallet | Confirma las reglas. Cuando aceptan todos antes del inicio, la junta se activa; si no, se cancela | Sí |
| `pagar(id, ronda)` | El miembro que paga | Debita `monto` de wARS **solo de quien llama** y lo manda al que cobra esa ronda, en la misma transacción. Rechaza si ya pagó esa ronda, si es quien cobra o si la ronda no empezó. Acepta rondas anteriores ya vencidas (ver pagos tardíos). Emite `AportePagado` | Sí |
| Lecturas: `rondaActual`, `estadoRonda`, `vencidas` | Cualquiera | Quién pagó y qué obligaciones están vencidas en cada ronda | Sí |
| `pausar()` / `reanudar()` | Guardián (Safe del equipo) | Frena los pagos nuevos ante un bug. No mueve fondos ni cambia reglas | Sí, con ese único permiso |
| `compensar` | — | Cancelar dos deudas cruzadas sin transferir | No: queda en simulación hasta tener especificación, pruebas y revisión legal |
| `pagarConFirma` | — | Pago sin gas para el miembro | No: un permiso ERC-2612 no dice a qué junta, ronda ni destinatario corresponde; haría falta EIP-712 con protección contra reutilización |
| Garantías y devoluciones | — | — | No |

**Lo que el contrato no puede hacer, por diseño:** retener aportes, cambiar el monto, el orden o los destinatarios después de crear la junta, debitar de una wallet que no sea la de quien llama, ni actualizarse. No tiene dueño ni función de retiro. Nunca se pide una autorización ilimitada; cuánto se autoriza y cuándo está en la tabla de autorizaciones, abajo.

**Invariantes que prueban los tests (Foundry, con fuzzing):**

1. `pagar` no cambia el saldo de wARS del contrato: lo que debita de quien llama llega completo al que cobra. (No exigimos saldo 0 absoluto: cualquiera puede mandarle tokens a una dirección.)
2. `pagar` solo debita a `msg.sender`, nunca a otra wallet, aunque tenga autorización.
3. Cada miembro paga como mucho una vez por ronda, y nunca en la ronda en que cobra.
4. Un pago solo puede ir al miembro que cobra esa ronda.
5. Nada cambia las reglas de una junta después de crearla.
6. La pausa no mueve fondos.
7. Toda transacción que mandamos lleva el tag, y el contrato ignora esos bytes al final del calldata (se prueba en el spike).

**Autorizaciones de wARS: el permiso es por contrato, no por junta.** Un `approve` de ERC-20 autoriza a una dirección y no dice para qué junta es. Si Rosa está en dos juntas de `JuntaReglas` y autoriza $100.000 y después $60.000, el segundo `approve` reemplaza al primero: no quedan dos permisos separados. Lo que ata cada débito a una obligación es la validación de `pagar`, no el token.

| Opción | Firmas por aporte | Qué limita el riesgo | Cuándo |
| --- | --- | --- | --- |
| **Autorización por aporte:** `approve` del monto exacto y después `pagar` | 2 | El permiso nunca supera un aporte; un bug no puede gastar más | Spike del 23/10 y MVP, si la prueba de UX lo aguanta |
| **Autorización acotada al contrato compartido:** la web suma lo pendiente del miembro en todas sus juntas | 1, más 1 al entrar a cada junta | `pagar` debita solo una obligación existente, impaga y por su monto exacto (invariantes 2 a 4) | Si la primera resulta demasiado incómoda |
| **Un contrato por junta** (clon mínimo, EIP-1167) | 1 al entrar | El permiso sí queda atado a una junta | Hoja de ruta: suma una fábrica y un despliegue por junta |

Empezamos con la autorización por aporte: es la de menor riesgo y la que se prueba en el spike.

## La parte financiera: lo que nos diferencia

El MVP separa tres problemas: la **seguridad de los pagos** (la resuelve el contrato), la **contabilidad de las obligaciones** (la lleva el motor) y el **riesgo** (el agente lo explica con números exactos). Todo es código determinístico; el LLM solo lo explica.

### 1. Obligaciones, no solo pagos

El motor registra cada obligación de la junta y su estado; un pago es una forma de cumplirla. Así una deuda vencida nunca se confunde con un pago, y se distingue la ronda que terminó por fecha, los pagos que llegaron y las deudas que siguen pendientes.

| Campo | Qué representa |
| --- | --- |
| `obligacionId` | Identificador único de la deuda |
| `deudor` / `acreedor` | Quién debe y quién tiene que recibir |
| `monto`, `ronda`, `vence` | Importe nominal, ronda y fecha límite con gracia |
| `estado` | Pendiente, vencida o pagada; si se pagó tarde, guarda la fecha de pago y los días de atraso (compensada, solo en simulación) |
| `formaDeCumplimiento` | Transferencia (compensación, solo en simulación) |
| `referencia` | Hash de la transacción del pago |

**Pagos tardíos y rondas superpuestas.** Una deuda vencida se puede regularizar siempre, sin contarla dos veces:

- **La obligación original se mantiene.** Al pagarse tarde pasa a pagada y guarda el vencimiento y la fecha real. Ejemplo: Juan le debe $20.000 a Marta, vence el 3/11 y paga el 5/11; queda pagada con 2 días de atraso. No se crea una deuda nueva.
- **Una ronda tiene dos estados separados:** *cerrada por fecha* (pasó el vencimiento con la gracia) y *saldada* (todas sus obligaciones pagadas). Una ronda puede estar cerrada sin estar saldada.
- **Rondas superpuestas:** `pagar(id, ronda)` acepta cualquier ronda ya empezada, no solo la actual. Cada pago nombra su ronda y el motor nunca reparte un pago entre varias deudas. La web ofrece primero la deuda más vieja.
- **Sin doble conteo:** el contrato rechaza un segundo pago del mismo deudor en la misma ronda, y el motor descarta eventos repetidos por hash e índice de log.
- **Junta suspendida o terminada** (lo decide el grupo; en el MVP se registra fuera de la cadena): no se generan obligaciones de rondas futuras, pero las vencidas se pueden pagar siempre, porque la plata va directo al acreedor. Si alguien paga una ronda anulada, el contrato igual la manda a quien cobraba esa ronda y el motor la marca para revisar.

### 2. Qué compromete cada turno

Ejemplo: 6 personas, $20.000 por semana, junta clásica. Cada uno recibe $100.000 de los otros cinco.

| Turno | Aportado antes de cobrar | Obligaciones después de cobrar |
| --- | --- | --- |
| 1 | $0 | $100.000 |
| 2 | $20.000 | $80.000 |
| 3 | $40.000 | $60.000 |
| 4 | $60.000 | $40.000 |
| 5 | $80.000 | $20.000 |
| 6 | $100.000 | $0 |

Son compromisos nominales programados, no predicciones de pérdida. Lo aportado antes de cobrar es lo que ese turno le adelanta al grupo; las obligaciones después de cobrar son lo que el grupo le confía a ese miembro.

### 3. Orden de turnos: dos dimensiones

1. Cada miembro dice cuánto puede adelantar antes de cobrar.
2. El motor lista los órdenes que respetan esos límites. Con 8 personas o menos se prueban todos.
3. Para cada orden muestra cuánto seguirán debiendo los primeros turnos: es la confianza que el grupo deposita en ellos.
4. El agente recomienda, pero no decide quién es confiable: el grupo aprueba el orden explícitamente y todos lo firman con `aceptar`.
5. Si ningún orden cumple los límites, el agente dice que la junta no es viable así y propone bajar el monto o sumar menos gente.

### 4. Cuando alguien no paga

- Al vencer la ronda, aviso. Pasados los días de gracia, la obligación figura como vencida; el contrato lo expone con `vencidas`.
- La junta no desaparece: el motor muestra qué se pagó, qué está vencido y a quién afecta.
- No hay devoluciones automáticas: los aportes ya llegaron a otros miembros y el contrato no tiene plata que devolver.
- Continuar, suspender o terminar con deudas pendientes lo decide el grupo con la política que aceptó al crear la junta. El agente no improvisa.
- No prometemos recuperar el dinero ni que nadie pierda.

### 5. Compensación: solo en simulación

Si Ana no le pagó a Bruno en la ronda 1 y Bruno le debe a Ana en la ronda 2, las dos obligaciones de $20.000 podrían extinguirse sin transferir. Se registran como dos obligaciones compensadas, no como dos pagos, y cambian las dos juntas o ninguna. Para el 9/11 se muestra en la simulación; con fondos reales no se habilita hasta tener especificación, pruebas y revisión legal.

**Frente a la competencia:** VaquitaAI usa una garantía plana y, si no alcanza, deja bloqueados los aportes de la ronda. Nosotros no prometemos cobertura: cada pago es verificable, cada deuda queda a la vista y el compromiso de cada turno se conoce antes de entrar.

**Propuesta para D2:** sin garantías ni compensación automática en el MVP. Obligaciones registradas, pagos verificables y escenarios de incumplimiento explicados; la compensación sigue como prototipo en simulación.

## Qué ve el usuario

Todo en pesos; la palabra "cripto" no aparece hasta que hace falta.

**Rosa, la organizadora:**

1. Le escribe al bot de Telegram: "quiero armar una junta de 6, de $20.000 por semana".
2. El agente le pregunta a cada miembro cuánto puede adelantar antes de cobrar, propone órdenes posibles y muestra cuánto aporta y cuánto sigue debiendo cada turno. El grupo aprueba el orden.
3. Rosa confirma y firma la creación de la junta en la web.

**Juan, un miembro que nunca usó cripto:**

1. Abre el link de la junta: ve su turno, cuánto aporta antes de cobrar, cuánto recibe y qué obligaciones le quedan después.
2. Crea su wallet en la web, carga pesos con Ripio (le llegan como wARS) y recibe de la canilla unos centavos para el gas.
3. Toca "Acepto las reglas". Firma la aceptación. Cada aporte son dos firmas más: autorizar el monto exacto y pagar. Hasta su primer aporte son tres confirmaciones, y la prueba de UX tiene que mostrar que las entiende sin ayuda.
4. Cada semana el bot le avisa a quién le toca. Toca "Pagar $20.000 a Marta" y la plata le llega directo a Marta.
5. El bot cuenta en el grupo quién pagó y quién falta. El día de su turno recibe $100.000 en su wallet y, si pasa la prueba de Ripio, los puede pasar a pesos.

## Plan hasta el 9/11

*Plan por persona hasta el 9/11: en el [documento en Claude Docs](https://claude.ai/artifact/1DoNkMgrdAxe7DaV3VaLgb).*

**Criterios de los hitos.** El spike del 23/10 pasa si una wallet que no es de un desarrollador, desde un teléfono real, hace una transferencia mínima de wARS a través de `JuntaReglas` con autorización por aporte (approve del monto exacto y transferFrom desde el contrato), el evento queda indexado y el tag se verifica en una transacción firmada desde ese cliente móvil. El 30/10 funcionan crear junta, aceptar, pagar, conciliar, ver obligaciones y detectar atrasos. El 3/11, bot y web integrados con usuarios de prueba, y la simulación de incumplimiento con resultados comprobables. Maxi revisa el contrato de Esteban y Esteban revisa los pagos de la web. La junta exprés es del equipo: 4 personas, rondas diarias y montos chicos.

**Prueba de UX, antes del 3/11:** una persona ajena al equipo, con su teléfono, acepta las reglas, autoriza y hace su primer aporte (tres confirmaciones) sin ayuda de un desarrollador. Si no lo logra, se simplifica el recorrido antes de sumar usuarios.

**Usuarios independientes:** para el hackathon cuenta una wallet que no es del equipo, que no fondeamos nosotros y que ya tenía actividad en Celo antes del hackathon. La junta exprés del equipo es una demostración técnica, no reemplaza a esos usuarios. Ojo: la canilla de gas fondea wallets nuevas, así que esas no cuentan como independientes; a quien ya tiene actividad en Celo no se le manda gas.

## Riesgos y plan B

**Plan B: una modalidad aparte, no una migración.** Cada junta se crea en una modalidad y la conserva todo su ciclo.

| Modalidad | Registro de aportes | Compensación |
| --- | --- | --- |
| `CONTRACT_P2P` | Eventos del contrato `JuntaReglas` | No en el MVP |
| `DIRECT_P2P` | Transferencias de wARS con el id de la obligación en la transacción; sin id verificable, quedan pendientes de conciliación | No en el MVP |

Si el contrato no pasa el spike o no está en mainnet el 30/10, las juntas nuevas se crean en `DIRECT_P2P`. Una junta activa nunca cambia de modalidad en silencio. El motor, el bot y la web no cambian, porque el motor recibe los aportes como eventos.

**Conciliación en `DIRECT_P2P`.** Un `Transfer` de ERC-20 no dice a qué junta ni a qué ronda corresponde, y el tag ERC-8021 atribuye la transacción a la app, no a una obligación. Si Juan y Marta están en dos juntas de $20.000, una transferencia de Juan a Marta es ambigua. Reglas:

- Cada obligación tiene un `obligacionId`. La web lo agrega al final del calldata de la transferencia, antes del tag. El spike prueba que wARS ignora esos bytes.
- El motor lee el calldata de la transacción y marca la obligación pagada solo si el id coincide con una obligación abierta con ese deudor, ese acreedor y ese monto.
- Sin id verificable (por ejemplo, un pago hecho desde otra app) la transferencia queda **pendiente de conciliación**, nunca pagada. Pasa a pagada solo si el acreedor confirma que la recibió por esa junta.

`DIRECT_P2P` no se trata como equivalente al contrato hasta que este mecanismo pase su propia prueba.

| Riesgo | Cómo lo bajamos | Si igual pasa |
| --- | --- | --- |
| La wallet del miembro no firma transacciones con gas en USDC (MetaMask no soporta el tipo de transacción de Celo) | Spike del 23/10 desde un teléfono real, con una wallet que no sea de un desarrollador | Probar otra wallet compatible; las juntas de terceros no arrancan hasta resolverlo |
| Un bug podría usar las autorizaciones ERC-20 que los miembros le dieron al contrato | Autorización por aporte, por el monto exacto; `pagar` solo debita a quien llama; tests con invariantes | Pausar; las juntas nuevas, en `DIRECT_P2P` |
| El contrato no ignora el tag al final del calldata | Probarlo en el spike, también en el despliegue | `DIRECT_P2P` |
| Otro bug en el contrato | Contrato chico, fuzzing, revisión entre dos y pausa | Pausar; las juntas nuevas, en `DIRECT_P2P` |
| Pocos usuarios reales | Santos recluta grupos desde ya; junta exprés del equipo con rondas diarias | Mostrar la junta exprés completa y las rondas reales que haya |
| Una junta semanal que arranca el 3/11 llega a una o dos rondas para el 9/11 | Junta exprés diaria para mostrar el ciclo completo | Contarlo tal cual en el pitch |
| Marco legal (IGJ, CNV) | No custodiamos; montos chicos; consulta legal antes del 3/11 | Sin aportes reales de personas ajenas al equipo hasta resolverlo |
| Seguir rediseñando la lógica financiera mientras programamos | El alcance queda fijo desde el 25/10 | Lo nuevo va a la hoja de ruta |
| El nombre choca con vaquita.fi y VaquitaAI | Decidir el 25/10 | Seguir con el nombre y aclararlo en el pitch |

## Qué decide el equipo el 25/10

| Decisión | Propuesta | Alternativa |
| --- | --- | --- |
| D7 · Arquitectura | Contrato de reglas con aportes P2P, sujeto a que el spike del 23/10 confirme pagos en wARS, autorización por aporte, transferFrom, tag desde el móvil y conciliación. Se aprueba solo si el spike pasa | `DIRECT_P2P` para las juntas nuevas si el contrato no pasa, con la conciliación por id de obligación probada antes de tratarla como equivalente |
| D2 · Mora | Sin garantías ni compensación automática: obligaciones registradas, pagos verificables y escenarios de incumplimiento explicados | Compensación en simulación hasta especificarla y probarla |
| D10 · Tipo de junta | Junta clásica con cuota fija | Precio variable y licitaciones, después de la revisión legal |
| Carpeta `contracts/` | Se habilita si se aprueba D7 | Sigue cerrada |
| Aportes reales de personas ajenas al equipo | Solo después de resolver lo financiero, la seguridad y lo legal pendiente | Solo la junta exprés del equipo |
| Alcance | Fijo desde el 25/10: compensación, pago con firma, garantías y Safe de fondos quedan fuera | — |
| Nombre y segmento | Decidirlos en G2 | Seguir con "La Vaquita" |

La aprobación que tenemos hoy cubre los documentos y el prototipo, no la operación con fondos de terceros: eso es lo que se decide acá. Si se aprueba, actualizo los tres planes, `contexto.md` y `AGENTS.md` en un solo cambio.
