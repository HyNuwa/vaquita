# Decisiones del equipo

Una entrada por decisión, la más nueva arriba. Formato: fecha · decisión · quién la propuso · por qué.

Las decisiones de producto previas al repo (canal Telegram, wARS, junta justa, custodia, onboarding) están en [contexto.md](contexto.md#6-decisiones-de-producto-tomadas).

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
