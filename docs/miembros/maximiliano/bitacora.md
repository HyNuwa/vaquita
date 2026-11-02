# Bitácora · Maximiliano

Una entrada por commit, la más nueva arriba.

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
