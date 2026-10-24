# Decisiones del equipo

Una entrada por decisión, la más nueva arriba. Formato: fecha · decisión · quién la propuso · por qué.

Las decisiones de producto previas al repo (canal Telegram, wARS, junta justa, custodia, onboarding) están en [contexto.md](contexto.md#6-decisiones-de-producto-tomadas).

## 2026-10-24 · Santos deja el equipo; Maxi coordina las tareas · Maximiliano (líder técnico)
- El equipo queda en tres: Maxi, Esteban y Daniel. Las tareas de Santos (producto, usuarios, legal y D10, landing, deck, video y formulario de entrega) pasan a Maxi.
- Maxi coordina las tareas de todos: puede reasignarlas y tomar cualquiera para llegar a la entrega, marcándolo en el archivo del responsable y avisando en el PR.
- Se mantiene la revisión entre dos: cada PR necesita la aprobación de otro integrante.
- El hook `pre-commit` deja borrar la carpeta de `docs/miembros/` de quien ya no figura en `docs/equipo.md`.

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
