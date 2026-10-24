# Bitácora · Maximiliano

Una entrada por commit, la más nueva arriba.

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
