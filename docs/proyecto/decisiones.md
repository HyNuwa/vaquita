# Decisiones del equipo

Una entrada por decisión, la más nueva arriba. Formato: fecha · decisión · quién la propuso · por qué.

Las decisiones de producto previas al repo (canal Telegram, wARS, junta justa, custodia, onboarding) están en [contexto.md](contexto.md#6-decisiones-de-producto-tomadas).

## 2026-11-01 · D13: el agente actúa solo y cobra por x402; `buy` queda opcional · Maximiliano (líder técnico)
**Por qué:** el track pide que "the agent is autonomous and useful", sin definirlo. La mejor pista de la [página oficial](https://www.loops.house/agents-on-open-rails/) es "a way to pay and get paid without a human in the loop". En D11 el agente no cobraba ni pagaba, y casi todas sus acciones terminaban en un humano. x402 no es obligatorio en LatAm ni da un bonus declarado: suma como uso real del stack. Esta es nuestra interpretación, no una regla de las bases.

| # | Decisión | Condición o consecuencia |
|---|---|---|
| D13.1 · Loop propio | El agente lee eventos y actúa sin que nadie le escriba: reclama cotizaciones, publica la comparación, avisa cuando faltan compromisos o fondos, ejecuta al cumplirse las condiciones y reintenta con límite. Las reglas son código; el LLM solo redacta | Detalle en [plan-compra-colectiva.md](plan-compra-colectiva.md#loop-propio-d131). Amplía D11.6: la comunidad sigue votando, el agente nunca firma por un comprador y el dry-run sigue por defecto. No se recorta |
| D13.2 · Bitácora pública | Cada acción del agente queda registrada con su motivo y, si corresponde, su hash; se muestra en la web de la campaña | Solo alias y datos públicos. No se recorta |
| D13.3 · Cobro por x402 | El organizador paga un cargo chico en wARS por "pedir cotizaciones", y ese pago activa al agente. Módulo `packages/core/src/payments/x402.ts` detrás de `X402_ENABLED`, apagado por defecto | Se construye después de la campaña del viernes 6/11; si no pasa los criterios de D8 antes del congelamiento, queda afuera. Las liquidaciones las envía el facilitador y no llevan nuestra etiqueta: se aprueba esa excepción a la regla 3 y se declara la wallet PayTo. Solo prueba D11.8 si paga alguien ajeno al equipo |
| D13.4 · x402 y compromisos | Los compromisos **no** usan x402 | x402 le paga al vendedor en el momento, sin condición: se perdería la ejecución atómica de D11.3 |
| D13.6 · Producto | **Queda cerrado: se entrega D11.** Vaquita Club no sigue en esta entrega | Cierra la elección de producto de D12.4 y de la puerta P0 |
| D13.5 · `buy` | Queda opcional: solo después de P5 y solo para gastos reales del agente (inferencia y datos para buscar proveedores) | Sin implementar por ahora. Choca con las reglas 8 y 9 porque guarda la clave en el keychain y no pasa por `tagged-sender.ts`: activarlo requiere otra entrada acá, con wallet aparte y tope de gasto. Las bases avisan: "Spamming the cheapest call scores nothing" |

## 2026-11-01 · D12: Maxi toma todas las tareas y los PR dejan de requerir aprobación · Maximiliano (líder técnico)
**Por qué:** faltan 8 días para el cierre y la entrega no puede depender de disponibilidad ajena. Los PR estaban trabados: cinco abiertos desde el 24/10, sin aprobar.

| # | Decisión | Condición o consecuencia |
|---|---|---|
| D12.1 · Tareas | Todas las tareas de la entrega son de Maxi. Esteban y Daniel siguen como colaboradores opcionales | Lista en [tareas/maximiliano.md](../tareas/maximiliano.md). Control en [tareas/control-entrega.md](../tareas/control-entrega.md). Donde un plan anterior nombra a otro responsable, rige esta decisión |
| D12.2 · PR | En `staging` y `main`, 0 aprobaciones requeridas: cada autor mergea su PR. Siguen la CI obligatoria, el PR como único camino y la prohibición de force push y de borrado | Reemplaza la revisión entre dos del 24/10. Cualquier colaborador con escritura también puede mergear sin aprobación |
| D12.3 · Revisión de lo que toca plata | La "revisión cruzada" de D11.4, D11.5 y el checklist pasa a ser la [revisión sin un segundo integrante](../tareas/control-entrega.md#revisión-sin-un-segundo-integrante): skill `review` más otro agente, con hallazgos en el PR | No es una auditoría ni se presenta como tal. Se mantienen el tope de $ 5.000 y los riesgos por escrito para participantes ajenos |
| D12.4 · D11 | D11 ya no espera la aprobación de Esteban o Daniel | La puerta P0 confirma si el producto final es D11 o Vaquita Club. Vaquita Club no está decidido |
| D12.5 · Fechas | Los hitos vencidos del 27 y el 29/10 se reemplazan por las puertas P0 a P6. E1 pasa a cortar el jueves 5/11 a las 12:00 | Envío interno y cierre oficial sin cambios |

## 2026-10-25 · D11: el MVP pasa de juntas a compra colectiva por intención · Maximiliano (líder técnico; se confirma con la aprobación del PR por Esteban o Daniel)
**Por qué:** la investigación de `docs/investigacion/la-vaquita-2/` evaluó cinco versiones con el mismo criterio. Ninguna pasó de ≈4/10 como startup, y la traba fue siempre la misma: no hay evidencia. Para el hackathon elegimos la versión con el caso más concreto, el uso de la cadena más justificado (la prueba de "si sacás la blockchain, ¿qué perdés?") y el experimento más barato de correr. El detalle está en `docs/investigacion/la-vaquita-2/v4-comunidades-propietarias.md`, `comparacion-versiones.md` y `fast-track/debate-ronda-3.md`. El diseño completo, en [plan-compra-colectiva.md](plan-compra-colectiva.md).

| # | Decisión | Condición o consecuencia |
|---|---|---|
| D11.1 · Producto | **Compra colectiva por intención.** La comunidad publica lo que necesita, el agente pide y compara cotizaciones (subasta inversa), la comunidad vota una oferta y cada miembro se compromete. Si se llega al cupo, la compra se ejecuta en wARS en una sola transacción | Pitch: *"Un agente que junta la demanda de comunidades tech de LatAm, consigue que los proveedores compitan y ejecuta la compra en wARS sin custodiar la plata."* |
| D11.2 · Rubro | **Solo bienes digitales y servicios** (cursos, licencias, entradas a eventos, pases de coworking) para comunidades de desarrolladores de Jujuy | Nada físico en el MVP: la entrega no se puede verificar y la comisión es del 2–4% |
| D11.3 · Mecanismo | **Compromiso sin depósito:** cada miembro firma en la cadena su `comprometer()` (lleva el tag y cuenta como firmante independiente), con autorización del importe exacto (`approve` o `permit`). La plata se queda en su wallet hasta `ejecutar()`, que es atómica: cobra a cada comprometido y le paga directo al proveedor en la misma transacción. Si no se llega al cupo, se revierte todo | Reemplaza a `JuntaReglas` de D7. El spike de D7 sigue igual, porque prueba las mismas piezas. Se descarta firmar solo un `permit` fuera de la cadena: sin una transacción propia de cada comprador se pierden los firmantes independientes del leaderboard |
| D11.4 · Contrato | Fábrica y campañas **sin admin ni actualizaciones**; token fijo (wARS de `tokens.ts`); términos inmutables; lista acotada de compradores; `cancelarCompromiso()` irreversible; estados *abierta*, *ejecutada* y *vencida*; `nonReentrant` y `SafeERC20`. Solo se saltea a un comprador por falta de saldo comprobada o por cancelación; **cualquier otro error del token revierte todo**. Foundry con fuzzing e invariantes; revisión cruzada antes de mainnet | `contracts/` se habilita cuando pase el spike. Checklist de tests en `plan-compra-colectiva.md` |
| D11.5 · Topes | Tope por comprador fijo en la fábrica: **$ 5.000 por compromiso** (igual que el tope por pago de la política) hasta que el contrato tenga sus tests y su revisión. Subirlo requiere una entrada nueva en este archivo | Los participantes ajenos al equipo entran recién con el contrato revisado, montos chicos y los riesgos explicados por escrito |
| D11.6 · Agente | El agente arma la intención, prepara los pedidos de cotización, compara ofertas, recuerda los compromisos y llama a `ejecutar()` cuando el código confirma las condiciones. **Nunca firma por un comprador ni elige proveedor**: decide la comunidad. Su wallet solo manda `ejecutar()` y el registro ERC-8004, por `tagged-sender.ts`. El LLM ve alias, no direcciones | Herramientas nuevas en `plan-compra-colectiva.md` |
| D11.7 · Juntas | El motor de juntas (`packages/core/src/junta/`, con sus tests) **queda en el repo, pero en pausa**: sale del recorrido de la demo. D2 y D10 siguen valiendo para cuando vuelva | Se muestra solo si sobra tiempo, sin usuarios reales |
| D11.8 · Ingreso (hipótesis) | Comisión del proveedor por la demanda que trae La Vaquita (hipótesis del 10–15% en digital), o un cargo visible fijado en la campaña. Se valida en E1 | El contrato acepta un cargo opcional, fijado al crear la campaña e inmutable |
| D11.9 · Validación primero | **E1, esta semana y sin código:** una necesidad real de una comunidad accesible y pedidos de cotización a 3–15 proveedores, con fecha límite el **29/10** | Si no hay ninguna oferta escrita al 29/10, la demo usa una campaña del equipo con un proveedor amigo, y lo decimos en el pitch |
| D6 · Nombre (se reabre) | **Se recomienda cambiar el nombre comercial:** chocamos con vaquita.fi (subvención del Stellar Community Fund, según su solicitud), lavaquita.com.ar, vaquita.com.py y VaquitaAI. Hay candidatos a revisar (Intenta, Kupula, ClubPay, DemandaNet, JuntaAgent u otros), con dominio, GitHub y una búsqueda rápida | Se decide el **27/10**. Hasta entonces "La Vaquita" es el nombre de trabajo. Los identificadores del código (`@vaquita/*`) no se renombran antes del 9/11 |

Lo que no cambia: las 10 reglas de `AGENTS.md`, Telegram más web, wARS, el `.env` y el ledger únicos, la estructura del monorepo, D5 (hosting) y que solo el core habla con la cadena.

## 2026-10-24 · Santos deja el equipo; Maxi coordina las tareas · Maximiliano (líder técnico)
- El equipo queda en tres: Maxi, Esteban y Daniel. Las tareas de Santos (producto, usuarios, legal y D10, landing, deck, video y formulario de entrega) pasan a Maxi.
- Maxi coordina las tareas de todos: puede reasignarlas y tomar cualquiera para llegar a la entrega, marcándolo en el archivo del responsable y avisando en el PR.
- Se mantiene la revisión entre dos: cada PR necesita la aprobación de otro integrante.
- El hook `pre-commit` deja borrar la carpeta de `docs/miembros/` de quien ya no figura en `docs/equipo.md`.

## 2026-10-24 · Decisiones de diseño previstas para el 25/10 · Maximiliano (líder técnico)
Cierra lo que `plan-junta-contrato.md` ("Qué decide el equipo el 25/10") y `plan-del-equipo.md` (sección 8) dejaban abierto. Desde acá el alcance queda fijo: lo nuevo va a la hoja de ruta.

| # | Decisión | Condición o consecuencia |
|---|---|---|
| D7 · Arquitectura | Contrato de reglas `JuntaReglas` con aportes P2P: cada aporte pasa por el contrato y llega al que cobra en la misma transacción; el contrato nunca guarda plata | **Condicionada al spike:** se aprueba solo si confirma pagos en wARS, autorización por aporte, `transferFrom`, tag desde el móvil y conciliación. Si no pasa, las juntas nuevas usan `DIRECT_P2P` con el id de la obligación en la transacción. `contracts/` se habilita cuando el spike pase |
| D2 · Mora | Sin garantías ni compensación automática en el MVP: obligaciones registradas, pagos verificables y escenarios de incumplimiento explicados antes de entrar | La compensación queda como prototipo en simulación |
| D10 · Tipo de junta | Junta clásica con cuota fija; el orden se acuerda con el buscador de turnos | Precio por turno y licitaciones, a la hoja de ruta, después de la revisión legal (RG IGJ 8/2015) |
| `.env` | Un solo `.env` y un solo ledger en la raíz, compartidos por todas las apps (`packages/core/src/config/paths.ts`) | Se corrige `repositorio-y-entrega.md`, que proponía uno por app: dos ledgers permitirían gastar el presupuesto diario dos veces |
| D6 · Nombre | Seguimos con La Vaquita | Se aclara en el pitch la diferencia con vaquita.fi y VaquitaAI |
| Alcance | Solo juntas | La vaca de objetivo sale del MVP y va a la hoja de ruta; se quita de `contexto.md` y `AGENTS.md` |
| Estructura | El motor y todo lo que habla con Celo siguen en `packages/core`. `apps/api` es fina: HTTP, base de datos y jobs, importando del core | Se mantiene la regla de que solo el core habla con la cadena (y su guarda en la CI) |
| D5 · Hosting | Bot y API en Railway (con su Postgres), web en Vercel | Sujeto a que el despliegue de prueba del 30/10 funcione |

Siguen abiertas, porque dependen de pruebas y no de una decisión: D8 (x402) y D9 (Ripio), a cargo de Esteban.

## 2026-10-18 · Skills en una sola carpeta: `.agents/skills` · Maximiliano (falta confirmar con el equipo)
- Las skills de los agentes existen una sola vez, en `.agents/skills/`. Codex, Cursor, Gemini CLI y Copilot la leen directo.
- Claude Code, Devin y Windsurf usan su propia carpeta: `npm install` crea `.claude/skills`, `.devin/skills` y `.windsurf/skills` como links a `.agents/skills` (`.agents/link-skills.mjs`). En Windows es una *junction*, que no pide permisos de admin.
- Por qué no se commitean los symlinks: en Windows, sin Modo Desarrollador y `core.symlinks=true`, Git los baja como archivos de texto con la ruta adentro, y la skill desaparece sin aviso.
- Los links están en `.gitignore` y la CI falla si alguien commitea archivos ahí, para que nadie edite una copia por error.

## 2026-10-18 · Monorepo con npm workspaces · Maximiliano (falta confirmar con el equipo)
- Un solo repo: `packages/core` (el scaffold), `apps/bot` y `apps/web`, más `docs/`.
- Por qué: todo es TypeScript y del mismo dominio, y lo crítico tiene que existir **una sola vez**. `tokens.ts`, `policy.ts`, `tagged-sender.ts` y el motor de la vaquita los usan el bot, la web y los scripts. Con varios repos habría que copiarlos (como los esquemas Zod en HCD), y copiar direcciones de contratos y topes de pago que mueven plata real es un riesgo. Además, con poco tiempo, un cambio en la fórmula, sus tests y el mensaje del bot entran en un solo PR.
- Sin Turborepo ni Nx: npm workspaces alcanza. Los paquetes se consumen como TypeScript fuente (`@vaquita/core/<ruta>`), sin build intermedio.
- `.env` y `data/ledger.json` existen solo en la raíz (`packages/core/src/config/paths.ts`). Antes se resolvían con `process.cwd()`: si el bot arrancaba desde `apps/bot`, iba a usar otro ledger y el presupuesto diario se podía gastar dos veces.

## 2026-10-18 · Flujo de trabajo basado en el de HCD, con mejoras · Maximiliano (falta confirmar con el equipo)
Se copia el flujo que armó Misael para HCD (AGENTS.md como fuente de reglas, bitácora y estado por integrante, Conventional Commits, `staging` → `main` con PR y 1 aprobación). Cambios:
- **Docs en el mismo repo:** un solo commit y un solo PR por cambio (en HCD hacían falta dos).
- **Escáner de secretos** en `pre-commit` y en la CI: bloquea `.env`, claves privadas, tokens de Telegram y keys de Anthropic. Acá una clave filtrada es plata perdida.
- **CI en GitHub Actions** (`.github/workflows/ci.yml`): typecheck, tests y las mismas reglas de los hooks (formato de commits, bitácora, secretos). Los hooks son locales y se pueden saltear sin querer; la CI no.
- **Guard de la regla 9:** la CI falla si algo fuera de `packages/core/src/chain/` llama a `sendTransaction`, `writeContract`, `sendRawTransaction` o `createWalletClient`.
- **Hooks automáticos:** `npm install` configura `core.hooksPath` (script `prepare`), así nadie se olvida.
- **Carpetas propias:** el hook no deja commitear cambios en `docs/miembros/` de otro integrante (en HCD era solo una regla escrita).
- **Plantilla de PR** con checklist y límite de 72 caracteres en el asunto del commit.

## 2026-10-18 · Idioma · Maximiliano (falta confirmar con el equipo)
- Commits, ramas y PRs en inglés (lo valida el hook), como en HCD.
- `docs/` y **todo texto que ve el usuario** en español rioplatense (regla 10 del producto). Los nombres de las herramientas del LLM también (`pagar`, `estado`).
- Los comentarios del código siguen el idioma del archivo: el scaffold está comentado en español y se mantiene así. No se traduce en masa.
