# Bitácora · Maximiliano

Una entrada por commit, la más nueva arriba.

## 2026-10-18 · chore(repo): restructure into an npm workspaces monorepo
- **Qué hice:** pasé el scaffold a `packages/core` y creé `apps/bot` y `apps/web` (vacías) con npm workspaces. `.env` y el ledger ahora se resuelven desde la raíz del repo y no desde `process.cwd()`, para que el bot y los scripts compartan el presupuesto diario. Copié y mejoré el flujo de HCD: AGENTS.md, hooks con escáner de secretos y control de carpetas propias, CI con las mismas reglas, plantilla de PR y docs del equipo (contexto, stack, decisiones, tareas, miembros). Los 87 tests siguen en verde.
- **Archivos clave:** `package.json`, `packages/core/`, `packages/core/src/config/paths.ts`, `.githooks/`, `.github/`, `AGENTS.md`, `docs/`.
- **Próximo paso:** que el equipo confirme las decisiones del 18/10, repartir las áreas de `docs/tareas/` y activar la protección de `main` y `staging` en GitHub.
