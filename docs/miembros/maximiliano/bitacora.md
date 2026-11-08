# Bitácora · Maximiliano

Una entrada por commit, la más nueva arriba.

## 2026-11-07 · feat(core): add isolated fork sender and guarded selector
- **Qué hice:** segunda unidad de S1: sender etiquetado exclusivo de RPC local, sin redirecciones ni CIP-64, y selector explícito que rechaza el modo fork si falta la bandera o existe `LIVE_PAYMENTS`. Conservé el sender normal y sus guardas. Pasaron 38 tests focalizados y el check completo de 346 tests; una verificación independiente directa pasó esos 38 tests, el typecheck y tres grupos de probes sin efectos. Dos intentos previos fallaron en preparación, con cero tests; no se presentan como aprobados.
- **Archivos clave:** `packages/core/src/chain/fork-sender.ts`, `packages/core/src/fondo/enviador.ts`, sus tests, `packages/core/README.md` y `odd/tasks/fund-s1-contracts-fork.md`.
- **Próximo paso:** revisión nativa de esta unidad y arnés de despliegue en fork; sin claves reales, envíos a mainnet ni publicación de código. T1 ya tiene revisión nativa aprobada y cerrada; T2 todavía no.

## 2026-11-07 · feat(core): add verified fund contract configuration and ABI
- **Qué hice:** primera unidad de S1: configuración pura de las seis referencias Safe/Zodiac, bloqueo de versiones prohibidas y ABI de Roles 2.1.1. Los 28 tests nuevos y el check completo (308 tests) pasan; una verificación independiente confirmó las guardas y los ABI. Esto no acredita bytecode actual ni despliegues en fork.
- **Archivos clave:** `packages/core/src/config/fondo-contratos.ts`, `packages/core/src/fondo/abis.ts`, sus tests y `odd/tasks/fund-s1-contracts-fork.md`.
- **Próximo paso:** revisión nativa de esta unidad y sender exclusivo de fork con selector seguro; sin claves reales ni envíos a mainnet.

## 2026-11-04 · docs(docs): add implementation specs for shared fund
- **Qué hice:** specs ejecutables de S1 a S8, con criterios de aceptación, pasos humanos y comando para `/goal`. Probé la viabilidad en un fork con un script suelto: sirvió para corregir `GS013`, descartar CIP-64 en anvil y el SDK de Roles. Nada corrió en mainnet.
- **Archivos clave:** `docs/proyecto/specs/`, `docs/pruebas/fondo.md`, `docs/pruebas/spike-fondo-fork.cjs`, `docs/proyecto/decisiones.md` (D16.34 a D16.37).
- **Próximo paso:** mergear y lanzar `/goal`. La revisión independiente de las specs no llegó a correr.

## 2026-11-04 · docs(docs): pivot product to shared fund with verifiable rules
- **Qué hice:** registré D16 tras tres rondas de decisiones: fondo compartido con Safe 2 de 3, Zodiac Roles 2.1.1 y Vaqui con límites en cadena. Compra colectiva y x402 en pausa. Reescribí spec, contexto, reglas y puertas; sumé el plan técnico con estados, el glosario y el guion de entrevistas.
- **Archivos clave:** `docs/proyecto/decisiones.md`, `docs/proyecto/spec.md`, `docs/proyecto/plan-fondo-compartido.md`, `docs/tareas/control-entrega.md`, `AGENTS.md`, `CONTEXT.md`.
- **Próximo paso:** verificar los contratos oficiales en Celo y probar los permisos de Roles en un fork local.

## 2026-11-03 · fix(web): handle replaced and stuck buyer transactions
- **Qué hice:** corregí lo que encontró la revisión de Codex: la web leía el `.env` completo, una transacción cancelada podía figurar como confirmada, una perdida dejaba la página colgada y los errores salían en inglés. Registré D15.10. La firma corregida no se volvió a probar desde el celular.
- **Archivos clave:** `apps/web/next.config.mjs`, `apps/web/src/lib/firmar.ts`, `apps/web/src/app/prueba-firma/page.tsx`, `docs/proyecto/decisiones.md`.
- **Próximo paso:** repetir la firma cuando se use la web de verdad y seguir con P2.

## 2026-11-03 · feat(web): add buyer signing page and tag test
- **Qué hice:** arranqué `apps/web` con Next.js, RainbowKit y wagmi. El core arma la transacción del comprador (`compra/firmas.ts`) y solo `firmar.ts` la envía a la billetera; la guarda de la CI exceptúa ese archivo. Una autorización de $ 0 firmada en MetaMask móvil conservó la etiqueta en mainnet, pero salió de la wallet del agente y no se probó Valora.
- **Archivos clave:** `packages/core/src/compra/firmas.ts`, `apps/web/src/lib/firmar.ts`, `apps/web/src/app/prueba-firma/page.tsx`, `.github/scripts/check-pr.sh`, `docs/pruebas/spike.md`.
- **Próximo paso:** P2: segunda revisión del contrato, `permit` en una transacción real, peor caso de gas y compra de pesos por Ripio Ramp.

## 2026-11-03 · docs(docs): record D15 wallet decision and add spec
- **Qué hice:** registré D15: billetera externa con RainbowKit, Valora primero y MetaMask de respaldo; sin thirdweb ni servicios pagos; el contrato no cambia y no se suma ahorro. Escribí `spec.md` y actualicé contexto, reglas, stack, puertas y tareas. No hay código nuevo ni pruebas nuevas.
- **Archivos clave:** `docs/proyecto/decisiones.md`, `docs/proyecto/spec.md`, `docs/tareas/control-entrega.md`, `AGENTS.md`, `apps/web/README.md`.
- **Próximo paso:** armar la página local y probar `approve(0)` con etiqueta desde MetaMask.

## 2026-11-02 · feat(core): add contract deployment and funded spike script
- **Qué hice:** `tagged-sender` ahora despliega contratos, solo con un pedido explícito, y tiene un tope de gas aparte para operaciones de contrato (D14.5). Sumé `spike:contrato`, que recorre una compra real de $ 1 y concilia eventos y saldos. Codex encontró 8 problemas, ya corregidos: dos corridas simultáneas, presupuesto liberado tras un cobro, un `deploy: false` que creaba contratos y el tope alto en cualquier llamada, entre otros. Una segunda pasada encontró 2 más, también corregidos: `revocar` podía olvidar una compra cobrada y el mensaje de recuperación permitía una segunda firma; Codex no revisó estas dos correcciones. Lanzado en mainnet: la compra de $ 1 quedó conciliada, con hashes en `spike.md`. La primera corrida frenó por un nodo atrasado, así que el script ahora espera tras cada confirmación.
- **Archivos clave:** `packages/core/src/chain/tagged-sender.ts`, `packages/core/src/config/policy.ts`, `packages/core/scripts/spike-contrato.ts`, `packages/core/test/tagged-sender.test.ts`.
- **Próximo paso:** probar la etiqueta desde el celular y medir el peor caso de gas con varios compradores.

## 2026-11-02 · chore(repo): add ERC-8004 registration to agent card
- **Qué hice:** registré a Vaqui en ERC-8004 desde la wallet del agente (`agentId` 10026) y sumé el registro a `public/agent.json`. La etiqueta quedó comprobada con `tx:verificar`.
- **Archivos clave:** `public/agent.json`, `docs/pruebas/spike.md`, `docs/tareas/control-entrega.md`.
- **Próximo paso:** script de despliegue de prueba para el spike con fondos.

## 2026-11-02 · chore(repo): fill agent card for Vaqui
- **Qué hice:** completé `public/agent.json` con el nombre Vaqui, que todavía no está registrado. Saqué la imagen porque no hay logo; el servicio web apunta al repo hasta que exista la página.
- **Archivos clave:** `public/agent.json`, `docs/tareas/control-entrega.md`, `docs/tareas/maximiliano.md`.
- **Próximo paso:** publicar la tarjeta en `staging`, ensayar el registro y lanzarlo desde la wallet del agente.

## 2026-11-02 · feat(repo): add collective purchase contract and factory
- **Qué hice:** escribí `CompraColectiva` y su fábrica en local, sin desplegar (D14), con tests de fallas del token, fuzzing e invariantes, y sumé `forge test` a la CI. Registré el primer pago real en `spike.md`. Codex no encontró forma de cobrar de más ni de cobrarle a quien no se comprometió; corregí sus dos hallazgos de código, sin que los volviera a revisar. El tercero, un comprador bloqueado que frena la campaña, queda aceptado en D14.3. No es una auditoría.
- **Archivos clave:** `contracts/src/`, `contracts/test/`, `.github/workflows/ci.yml`, `packages/core/src/compra/selection.ts`, `docs/proyecto/decisiones.md`, `docs/pruebas/spike.md`.
- **Próximo paso:** `agent.json` real y registro ERC-8004 como Vaqui; después, despliegue de prueba para el spike con fondos.

## 2026-11-02 · chore(repo): document personal wallet in env example
- **Qué hice:** sumé `MY_WALLET` a `.env.example` como referencia local para probar pagos. El código no la lee: los destinos salen de `ALLOWED_RECIPIENTS`. La clave del agente ya está en `.env` y `preflight` pasa entero.
- **Archivos clave:** `.env.example`, `docs/tareas/control-entrega.md`, `docs/tareas/maximiliano.md`.
- **Próximo paso:** primer pago real de $ 1, registro ERC-8004 y compilar el contrato.

## 2026-11-02 · feat(core): add agent loop process and wARS read-only spike
- **Qué hice:** proceso que corre el loop propio (D13.1) con estado durable y un solo dueño: guarda la tx firmada antes de transmitirla y nunca firma otra mientras la anterior pueda entrar. La revisión con Codex tuvo cuatro pasadas; los dos arreglos de la última tienen tests, pero Codex no los volvió a revisar. Sumé la parte sin fondos del spike de wARS.
- **Archivos clave:** `packages/core/src/compra/runner.ts`, `store.ts`, `agent-log.ts`, `loop.ts`, `packages/core/scripts/spike-wars.ts`, `docs/pruebas/spike.md`.
- **Próximo paso:** contrato y tests en local, sin desplegar; primer pago cuando la clave del agente esté en `.env`.

## 2026-11-02 · feat(core): add collective purchase rules and agent loop
- **Qué hice:** módulo `compra/` de reglas puras: condiciones y tope, selección igual a la del contrato, estado desde eventos, ofertas y voto, reglas del loop propio (D13.1) y bitácora pública sin texto libre (D13.2). Pasó la skill `review` y dos revisiones con Codex: la primera encontró 10 problemas, todos corregidos con tests.
- **Archivos clave:** `packages/core/src/compra/`, `packages/core/test/compra.test.ts`.
- **Próximo paso:** proceso que corre el loop y script del spike, los dos en dry-run; puerta P0 (inscripción, código y `.env`).

## 2026-11-01 · docs(docs): close product on D11 and add autonomous agent plan
- **Qué hice:** registré D13: el producto queda cerrado en D11, el agente suma un loop propio y una bitácora pública, y se agrega un cobro opcional por x402 en wARS. `buy` queda opcional. Corregí nuestras notas sobre los criterios del hackathon y sumé la excepción de x402 a la regla 3.
- **Archivos clave:** `docs/proyecto/decisiones.md`, `docs/proyecto/plan-compra-colectiva.md`, `docs/tareas/control-entrega.md`, `AGENTS.md`.
- **Próximo paso:** empezar a construir el módulo `compra/` y cerrar la puerta P0.

## 2026-11-01 · docs(docs): adopt D11 collective purchase and D12 solo delivery
- **Qué hice:** registré D11 (compra colectiva por intención) y D12 (todas las tareas son mías y los PR no requieren aprobación). Actualicé contexto, reglas, planes y tareas, sumé `docs/tareas/control-entrega.md` con las puertas hasta el cierre y la investigación de `la-vaquita-2/`. En GitHub bajé a 0 las aprobaciones de `staging` y `main`, y mergeé el PR #9.
- **Archivos clave:** `docs/proyecto/decisiones.md`, `docs/proyecto/plan-compra-colectiva.md`, `docs/tareas/control-entrega.md`, `docs/tareas/maximiliano.md`, `AGENTS.md`.
- **Próximo paso:** puerta P0 del 2/11: elegir el producto, confirmar la inscripción y el código de atribución, y crear el `.env`.

## 2026-10-24 · feat(core): add default scenarios and member positions
- **Qué hice:** escenarios de incumplimiento de D2 en el motor, sin garantías. `stopPayingScenario` dice qué pasa si un miembro deja de pagar desde una ronda: cuánto queda impago, a quién le falta cada aporte y cuánto se lleva neto (o cuánto le debe el grupo, si todavía no cobró). `afterCollectingScenarios` arma la tabla para mostrar antes de entrar. `juntaPosition` da la posición real de cada miembro (recibido, pagado, vencido, lo que le deben) y separa lo vencido de quienes ya cobraron, que es el riesgo que nadie cubre. 11 tests nuevos.
- **Archivos clave:** `packages/core/src/junta/defaults.ts`, `packages/core/test/defaults.test.ts`.
- **Próximo paso:** conciliación desde eventos (contrato o `DIRECT_P2P`) y persistencia del motor (29–30/10); mientras tanto, tareas de entrega que eran de Santos.

## 2026-10-24 · docs(docs): align context, rules and plans with 24/10 decisions
- **Qué hice:** reescribí `contexto.md` con la arquitectura aprobada (contrato de reglas sin custodia, junta clásica con cuota fija, obligaciones, mora sin garantías, solo juntas) y el estado real del motor. En los tres planes y el del contrato marqué los nuevos estados de D2, D5, D6, D7 y D10 y corregí estructura (cadena y pagos en el core, `apps/api` fina), `.env` único, hosting, ramas desde `staging` y el equipo de tres. `AGENTS.md` y el README ya no hablan de vacas ni de que el agente cobra y paga el pozo.
- **Archivos clave:** `docs/proyecto/contexto.md`, `plan-tecnico.md`, `plan-del-equipo.md`, `plan-junta-contrato.md`, `repositorio-y-entrega.md`, `AGENTS.md`, `README.md`.
- **Próximo paso:** escenarios de incumplimiento de D2 en el motor.

## 2026-10-24 · chore(repo): remove Santos and let the tech lead take any task
- **Qué hice:** saqué a Santos del equipo (dejó el proyecto): borré su carpeta y su archivo de tareas, y sus tareas de producto, usuarios, legal y entrega pasaron a mi plan. Completé los planes de Esteban y Daniel con el plan v2 y dejé escrito que yo coordino y puedo tomar cualquier tarea, marcándola y avisando en el PR. El hook deja borrar la carpeta de quien ya no está en `docs/equipo.md`.
- **Archivos clave:** `docs/equipo.md`, `docs/tareas/`, `.githooks/pre-commit`, `AGENTS.md`, `docs/proyecto/decisiones.md`.
- **Próximo paso:** actualizar los docs viejos a las decisiones del 24/10 y los escenarios de incumplimiento de D2.

## 2026-10-22 · feat(core): add turn order search for juntas
- **Qué hice:** buscador de órdenes de turno. Con lo que cada miembro puede adelantar antes de cobrar, lista los órdenes que respetan todos los límites (con 8 o menos los prueba todos), los ordena por margen y muestra cuánto adelanta y debe cada turno. Cuenta exacta de órdenes posibles para cualquier N. Si ningún orden sirve, dice qué miembros no entran y el mayor aporte con el que la junta sí es viable. 15 tests nuevos.
- **Archivos clave:** `packages/core/src/junta/turn-order.ts`, `commitments.ts`, `packages/core/test/turn-order.test.ts`.
- **Próximo paso:** decisiones del 25/10 (D7, D2, D10, `.env` único) y después escenarios de incumplimiento.

## 2026-10-22 · feat(core): add junta obligations engine
- **Qué hice:** motor de obligaciones de la junta clásica, independiente de D7. Valida las reglas (N sin máximo), genera una obligación por miembro y ronda, aplica pagos idempotentes por hash e índice de log, guarda el atraso de los pagos tardíos sin crear deudas nuevas, separa ronda cerrada por fecha de ronda saldada, manda a revisión todo pago que no coincide exacto y anula las rondas futuras si el grupo suspende la junta. Además, la tabla de qué compromete cada turno. 29 tests nuevos.
- **Archivos clave:** `packages/core/src/junta/rules.ts`, `obligations.ts`, `commitments.ts`, `packages/core/test/junta.test.ts`, `docs/tareas/maximiliano.md`.
- **Próximo paso:** buscador de órdenes de turno según cuánto puede adelantar cada miembro.

## 2026-10-18 · chore(repo): share agent skills from a single .agents folder
- **Qué hice:** moví las skills de `.claude/skills` a `.agents/skills`, la única copia para todos los agentes. `npm install` crea los links de `.claude/skills`, `.devin/skills` y `.windsurf/skills` (junction en Windows), que no se commitean porque en Windows los symlinks de Git se rompen. La CI falla si alguien commitea archivos en esas carpetas. También creé la rama `staging` en GitHub.
- **Archivos clave:** `.agents/skills/`, `.agents/link-skills.mjs`, `package.json`, `.gitignore`, `.github/scripts/check-pr.sh`, `AGENTS.md`.
- **Próximo paso:** activar la protección de `main` y `staging`, y abrir los PRs del monorepo y de las skills contra `staging`.

## 2026-10-18 · chore(repo): restructure into an npm workspaces monorepo
- **Qué hice:** pasé el scaffold a `packages/core` y creé `apps/bot` y `apps/web` (vacías) con npm workspaces. `.env` y el ledger ahora se resuelven desde la raíz del repo y no desde `process.cwd()`, para que el bot y los scripts compartan el presupuesto diario. Copié y mejoré el flujo de HCD: AGENTS.md, hooks con escáner de secretos y control de carpetas propias, CI con las mismas reglas, plantilla de PR y docs del equipo (contexto, stack, decisiones, tareas, miembros). Los 87 tests siguen en verde.
- **Archivos clave:** `package.json`, `packages/core/`, `packages/core/src/config/paths.ts`, `.githooks/`, `.github/`, `AGENTS.md`, `docs/`.
- **Próximo paso:** que el equipo confirme las decisiones del 18/10, repartir las áreas de `docs/tareas/` y activar la protección de `main` y `staging` en GitHub.
