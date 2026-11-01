# La Vaquita v4 — Comunidades dueñas de sus acuerdos

**Fase:** desarrollo de idea (diseño), antes de validar
**Proyecto:** la-vaquita-2 → v4
**Fecha:** 2026-10-25
**Confianza:** Media sobre la arquitectura; Baja sobre la demanda (0 entrevistas, 0 comercios, 0 compras)

---

> **Origen:** dos textos que aportó el fundador ("Red social de economía colectiva" y la crítica de un profesor: *si sacás la blockchain y el producto funciona igual, no la necesitabas*). Este documento los desarrolla y los cruza con lo aprendido en v2, v3 y 3.0 (`comparacion-versiones.md`).

## 1. La tesis
> **Las comunidades son dueñas de sus acuerdos, de su plata y de su historial económico. La Vaquita facilita la coordinación, pero no tiene poder unilateral sobre nada de eso.**

**Prueba de diseño (la del profesor, afinada):** un proyecto Web3 no tiene que dejar de funcionar sin blockchain, pero tiene que **perder una propiedad central** de su propuesta de valor. En La Vaquita, esa propiedad es **sobrevivir a la empresa**:

| Elemento | ¿Sobrevive si La Vaquita desaparece? | Dónde vive |
|---|---|---|
| Compromisos y condiciones de una compra grupal | **Sí** | Contrato de campaña, verificado en Celoscan |
| Fondos de una comunidad | **Sí** | Una Safe de la comunidad (La Vaquita no firma) |
| Historial verificable (compras ejecutadas, aportes de junta) | **Sí** | Eventos públicos en la cadena; cualquiera puede recalcularlo |
| Reglas de una junta activa | Sí, en la versión con contrato | Fuera del MVP (ver §4) |
| Perfiles, feed, chat, avisos y el agente | No hace falta | Web2 |

**Límite de la tesis (encontrado en `fast-track/debate-ronda-3.md`):**
- **[Data]** El contrato verificado de wARS en Celoscan es **actualizable (UUPS)** y expone **`pause`** y una **lista de bloqueo** (`blockUser`, `setEnforceBlocklist`).
- **[Opinion]** Por eso, "sobrevive a la empresa" vale **para La Vaquita, no para el emisor del token**: Ripio puede pausar wARS o bloquear direcciones. Hay que decirlo así en el pitch: *La Vaquita no puede tocar tu plata ni tus acuerdos; el token tiene las reglas de su emisor regulado.*

## 2. Prueba del profesor aplicada a todas las versiones
| Versión | Sin cadena, ¿qué se pierde? | ¿Pasa? |
|---|---|---|
| v2 (junta + comercio) | Que cada miembro pague en wARS entre pares. Una transferencia bancaria hace lo mismo | 🟡 Apenas |
| v3 (software del organizador) | Nada: la propia v3 deja la cadena como opción | ❌ No |
| 3.0 (layaway con bóveda) | La devolución automática sin intermediario | ✅ Sí, pero con una bóveda que junta fondos de terceros |
| **v4** | La ejecución sin depender del operador, los fondos fuera de su control y un historial que se puede llevar a otro lado | ✅ **Sí, y por una razón estructural** |

## 3. El mecanismo central: compra grupal con compromiso sin depósito
**El aporte principal de este documento.** La 3.0 juntaba la plata en una bóveda hasta llegar al cupo, y eso tenía dos problemas: el riesgo de la CNV (custodia de fondos de terceros) y el riesgo técnico (un contrato inmutable con plata adentro). En la v4, **la plata no sale de la wallet de cada persona hasta el momento exacto de la compra.**

**Cómo funciona [Assumption: diseño a validar técnica y jurídicamente]:**
1. **La comunidad vota la campaña:** proveedor, precio, cupo mínimo, fecha límite y tope por persona. El voto es por firma, sin token. Las condiciones quedan fijadas en un contrato de campaña creado por una fábrica, sin clave de administrador.
2. **Cada persona se compromete:** registra su compromiso y autoriza al contrato a cobrar exactamente el precio (`approve` de ERC-20). **La plata sigue en su wallet.** Puede ahorrar en cuotas en su propia wallet y la app le muestra cuánto le falta.
3. **Ejecución atómica, que cualquiera puede disparar:** cuando hay al menos N compromisos con saldo y autorización suficientes antes de la fecha límite, cualquiera llama a `ejecutar()`. El contrato cobra a cada comprometido que tenga fondos, salta a los que no y, **si los cobros válidos llegan al cupo, le paga todo junto al proveedor en la misma transacción.** Si no llegan, se revierte todo y nadie paga.
4. **Retirarse** es revocar la autorización o gastar el saldo. No hay nada que reembolsar, porque la plata nunca se movió.

**Qué gana frente a la 3.0:**

| | Bóveda (3.0) | Compromiso sin depósito (v4) |
|---|---|---|
| Plata de terceros junta antes de la compra | Sí | **No** |
| Reembolsos | Hay que programarlos y pueden fallar | **No existen** |
| Qué pasa si el contrato tiene un bug | La plata queda trabada | Solo se ejecuta en la transacción de compra, con topes por campaña |
| Si La Vaquita desaparece | El retiro depende de que el contrato esté bien hecho | `ejecutar()` y la revocación siguen disponibles para cualquiera |
| Lectura de la CNV (RG 1172/2026) | Custodia de terceros, dudosa | **Mejor argumento, pero sin exclusión automática.** El art. 9 separa la transferencia (inc. 3) de la custodia y administración (inc. 4). Cobrar en forma automatizada por cuenta de terceros puede seguir siendo una transferencia; que no haya admin no decide quién tiene influencia efectiva. Hace falta un abogado |

**Límites honestos:**
- **La entrega.** Cuando se ejecuta la compra, la plata va al proveedor, y la cadena no puede verificar que llegaron diez auriculares. Por eso el MVP empieza con **bienes o servicios de entrega simple y proveedores identificados** (cursos, insumos con retiro en el local). La liberación por etapas con disputa reintroduce la custodia en el contrato: queda para después y con análisis legal.
- **Los compromisos sin fondos.** Un "me comprometo" sin saldo no vale nada hasta la ejecución. El agente avisa a tiempo, y el progreso que muestra la app cuenta **compromisos con fondos**, no anotados.
- **El costo.** Cada cobro de la ejecución gasta gas. Para 10 a 50 compradores es razonable en Celo, con CIP-64 pagado por quien ejecuta. **[Assumption: medir en testnet]**
- **`permit`:** el ABI verificado de wARS expone `permit` (EIP-2612), así que no hace falta una transacción `approve` aparte. Falta probarlo con una firma real. Las direcciones salen solo de `packages/core/src/config/tokens.ts`.

**Correcciones al diseño (Codex, ronda 3):**
1. **Gastar el saldo no cancela el compromiso:** si la persona recarga la wallet, la autorización sigue vigente. Se agrega `cancelarCompromiso()`, irreversible para esa adhesión. Nunca se piden autorizaciones infinitas, solo el importe exacto.
2. **Saltear a alguien cambia quién compra.** Hace falta fijar de antemano un mínimo y un máximo de unidades, un precio unitario y una regla determinística de selección si sobran compradores. Solo se saltea una insuficiencia de saldo comprobada o una cancelación. **Cualquier otro error del token revierte todo.**
3. **El patrón del contrato:**
   - fábrica y campañas sin actualizaciones, con términos inmutables y token fijo;
   - lista acotada de compradores aprobada por la comunidad (frena el Sybil y el gas);
   - estados *abierta*, *ejecutada* y *vencida*, con una sola ejecución;
   - `nonReentrant` y `SafeERC20`;
   - transferencia directa del comprador al proveedor;
   - la firma del comprador queda vinculada a la campaña, la cadena, el importe, el proveedor, la comisión y un nonce.
4. **Tests mínimos, locales y sin red:**
   - mínimo − 1, mínimo y máximo de compradores;
   - revocación, cancelación y recarga;
   - doble ejecución;
   - firmas vencidas, repetidas o de otra campaña;
   - token pausado y bloqueos de comprador, proveedor o contrato;
   - reentrancia;
   - el peor caso de gas;
   - invariantes de conservación y cobro único;
   - revisión independiente antes de mainnet.
5. **El mismo saldo puede respaldar varias campañas**, y simular la ejecución no reserva los fondos. El progreso cuenta compromisos con fondos *en ese momento*, y se aclara que no es una reserva.
6. **[Data]** No hay un precedente verificado del mecanismo completo. Settly hace una liquidación grupal con `approve` y cobro posterior, solo en testnet.

## 4. Las otras piezas, con alcance acotado
- **Tesorería de la comunidad: una Safe**, no un contrato propio. Está auditada y existe en el ecosistema de Celo (`.agents/skills/celopedia-skill/references/ecosystem.md`). Los firmantes son miembros elegidos por la comunidad, nunca La Vaquita. *Después del hackathon.*
- **Junta (ROSCA): demo limitada** con el motor que ya está en `packages/core`, donde cada miembro firma su aporte. **La cadena no resuelve la mora** y la demo no promete cubrirla.
- **Reputación: credenciales separadas, no una nota.** Se calculan desde eventos públicos ("8 de 8 aportes a tiempo", "3 compras ejecutadas") y cualquiera las puede recalcular. Hay tres reglas: no se publican montos personales, la reputación no se compra y los registros se pueden disputar. Un historial corto no cuenta como mala reputación. Verificable y portable **no significa predictivo**.
- **El agente, con una tarea que no sea decorativa:**
  - junta el interés de varias comunidades en un pedido de cotización;
  - compara cotizaciones verificadas;
  - avisa a cada comprometido cuánto le falta;
  - llama a `ejecutar()` cuando se cumplen las condiciones.

  Esto último podría hacerlo cualquiera; el agente solo lo hace a tiempo. Nunca firma por nadie ni ve direcciones: trabaja con alias (regla 6 de AGENTS.md).

## 5. Quién paga: la tensión que trae la v4
**[Opinion]** Si los contratos son abiertos y cualquiera puede ejecutarlos, La Vaquita **no puede cobrar por controlar la plata.** Esa es justamente la promesa. Entonces el negocio tiene que estar en la **coordinación**:

| Opción | Cómo | Riesgo |
|---|---|---|
| **Comisión del proveedor por la demanda que trae La Vaquita** (base) | Se factura aparte, fuera del contrato, por cada campaña ejecutada. Hipótesis: 5–8% | El proveedor puede saltearse a La Vaquita en la segunda compra |
| **Cargo fijado en la campaña** | Un parámetro inmutable (por ejemplo, 2%) que la comunidad acepta al votar y que se paga en la ejecución | No se puede saltear dentro de esa campaña (corregido en la ronda 3), pero la comunidad puede crear otra sin el cargo. No da una exención legal: cobrar un honorario y ejecutar pagos ajenos son hechos distintos |
| **Tarifa fija por cotización y negociación** (propuesta de Codex) | La paga quien encarga el servicio, contra entregables y fuera del flujo de compra | Monetiza el trabajo aunque la compra se ejecute por otra interfaz. Tampoco está probada |
| **Herramientas para organizadores** (después) | Reportes y automatizaciones | Mismo problema que la v3: la competencia lo ofrece barato |

**[Opinion]** La ventaja no puede estar en el contrato, que se puede copiar. Si existe, está en la **red de proveedores que repiten y en el historial de demanda de las comunidades.** Es la misma pregunta que dejó la 3.0: *¿algún proveedor pidió repetir?*

## 6. Segmento: comunidades que ya existen, no desconocidos
**[Opinion]** Juntar desconocidos multiplica el fraude, las cuentas falsas y el costo de conseguir usuarios. Se empieza con **comunidades que ya existen** y con un problema concreto: **comprar en conjunto insumos o equipamiento para conseguir mejor precio.** Los textos proponen estudiantes universitarios, pero **el equipo no tiene acceso confirmado a la UNJu** (`00-intake/brief.md`). Lo accesible hoy son las comunidades de desarrolladores de Jujuy, según la exploración 3.0. Se arranca por donde haya acceso real.

## 7. MVP del hackathon (hasta el 8/11)
| Entra | Queda afuera |
|---|---|
| Crear una comunidad y votar una campaña por firma | Feed, chat y token |
| Contrato de campaña: fábrica, compromiso, `ejecutar()` atómico y sin admin | Liberación por etapas y disputas en la cadena |
| Una campaña real en mainnet, chica: dentro del tope de la política actual ($ 5.000 por pago) o con una excepción explícita del equipo | Montos de $ 100.000 por persona (los de la 3.0) |
| Credenciales calculadas desde eventos | Calificación universal |
| Agente: cotización, recordatorios y ejecución | Que el agente firme o custodie |
| Demo de junta con el motor que ya existe | Junta con contrato |

**Hace falta decidirlo en equipo:**
- **Pasar del alcance actual a la v4.** Hoy está en `docs/tareas/`, y Esteban y Daniel tienen trabajo asignado.
- **Sumar Solidity y un framework de contratos.** Si no está en `docs/proyecto/stack.md`, hay que registrarlo en `decisiones.md`.
- **Cumplir las reglas del repo:**
  - toda transacción del agente pasa por `tagged-sender.ts`, con ERC-8021 y CIP-64;
  - el modo de prueba es el que corre por defecto;
  - los tests no tocan la red.

## 8. Validar sin blockchain primero
**[Opinion]** La prueba del profesor también sirve para validar: **si nadie repite una compra grupal hecha a mano, la cadena no lo va a arreglar.**

| Semana | Qué | Corte |
|---|---|---|
| 25/10–1/11 | E1 de la 3.0: 15 proveedores; además, 10–15 personas de comunidades accesibles | 0 ofertas escritas → no hay compra grupal (K1 de la 3.0) |
| 2–8/11 | **Una compra grupal manual** (planilla y transferencias) en paralelo a la demo | Menos de 10 compromisos con plata → revisar el ticket y el producto |
| 9–24/11 | La misma compra, en la cadena, con la comunidad real; medir el abandono en la wallet y en el `approve` | Más del 50% abandona en la rampa → K5 de la 3.0 |
| 24/11 | ¿Alguien pidió repetir? ¿El proveedor volvería? | Ninguno → cerrar o cambiar de segmento |

## 9. Puntaje estimado (misma vara que v2, v3 y 3.0)
| | Problema | Mercado | Ventaja | Factibilidad | Modelo | Equipo | Momento | **Total** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Claude (borrador) | 5 | 3 | 4 | 6 | 3 | 4 | 5 | 4,3 |
| Codex (ronda 3) | 5 | 3 | 3 | 4 | 3 | 4 | 5 | 3,9 |
| **Acordado** | 5 | 3 | **3** | **5** | 3 | 4 | 5 | **4,0** |

- **[Opinion] Ventaja, 3:** acepto la crítica de Codex. Nada prueba todavía que este diseño valga más para alguien que una compra grupal a mano.
- **[Opinion] Factibilidad, 5:** no se juntan fondos y no hay reembolsos, pero el contrato es más delicado de lo que parecía. Lo complican la selección, la cancelación, el token pausable y la revisión de seguridad, todo antes del 8/11.
- **[Opinion] Modelo de negocio, 3:** la promesa de "no tenemos control" hace que cualquiera pueda saltearse el cobro.
- **Lo que sigue trabando la nota es lo mismo:** cero evidencia. **La v4 es la versión más defendible para el hackathon y frente a la crítica Web3. Como negocio, no es todavía mejor que las otras.**

## Flags
**Red Flags:**
- **[Data]** 0 evidencia de demanda y de proveedores. Esta es la quinta versión de la idea en un día.

**Yellow Flags:**
- **[Opinion]** Monetizar una infraestructura que, por diseño, se puede usar sin pagar.
- **[Assumption]** Que `ejecutar()` resista las revocaciones de último momento y que el gas sea razonable: hay que medirlo antes de mainnet.
- **[Opinion]** Los textos del fundador citan una actualización de la normativa PSP del BCRA en octubre de 2026 que no está verificada en este documento. La consulta legal tiene que cubrir CNV, BCRA (PSP), IGJ (compra para un fin determinado) y consumo.
- **[Opinion]** Cambiar el alcance del hackathon a dos semanas del cierre.

## Fuentes
- Textos del fundador (25/10/2026): "La Vaquita 2.0 — Red social de economía colectiva" y la respuesta a la crítica del profesor.
- `fast-track/debate-ronda-3.md` (Codex: ataque técnico y jurídico; contrato verificado de wARS en Celoscan; texto de la RG CNV 1172/2026).
- `comparacion-versiones.md`, `fast-track/04-scorecard.md`, `fast-track/raw/ola-1.md` §4 (CNV y IGJ), `06-validation/scorecard.md` y la exploración 3.0 (carpeta local del fundador).
- `.agents/skills/celopedia-skill/references/ecosystem.md` (Safe Wallet en Celo) y `AGENTS.md` (reglas del proyecto).
