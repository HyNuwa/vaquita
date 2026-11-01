# Stack tecnológico

Versiones tomadas de los `package.json` el 2026-10-18. Para sumar una librería fuera de esta lista, anotar la decisión en [decisiones.md](decisiones.md).

Estado: ✅ en uso · ⏳ pendiente de decidir.

## General

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 1 | Gestor de paquetes | **npm** con workspaces | 11 | ✅ |
| 2 | Node.js | **24** (mínimo 20) | — | ✅ Lo usa la CI |
| 3 | Lenguaje | **TypeScript**, ESM, `strict` + `noUncheckedIndexedAccess` | 7.0 | ✅ Config común en `tsconfig.base.json` |
| 4 | Ejecución de scripts | **tsx** | 4.23 | ✅ Sin build: se corre TypeScript fuente |
| 5 | Tests | **vitest**, sin red | 5.0 | ✅ El `ChainReader` se reemplaza por un fake |
| 6 | Validación | **zod** | 4.6 | ✅ |
| 7 | CI | **GitHub Actions** | — | ✅ `.github/workflows/ci.yml` |
| 8 | Lint y formato | — | — | ⏳ |

## `packages/core`

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 9 | Cliente de Celo | **viem** (tx CIP-64) | 2.57 | ✅ |
| 10 | Atribución ERC-8021 | **@celo/attribution-tags** | 0.5.0 (fija) | ✅ |
| 11 | Variables de entorno | **dotenv**, un solo `.env` en la raíz | 18.0 | ✅ |
| 12 | Persistencia del motor (vaquitas, rondas, aportes) | — | — | ⏳ Hoy el ledger es un JSON en `data/` |

## `contracts/`

| Pieza | Elección | Versión | Estado |
|---|---|---|---|
| Contrato y fábrica `CompraColectiva` | **Solidity con Foundry**, fuzzing e invariantes; tests locales sin red | Por definir | ⏳ Condicionado al spike (D11.4) |
| Utilidades seguras | **OpenZeppelin: `SafeERC20` y `ReentrancyGuard`** | Por definir | ⏳ Anotar en [decisiones.md](decisiones.md) cuando se fije la versión |

`contracts/` se habilita cuando pase el spike; esta tabla no implica instalación ni despliegue. Segunda revisión antes de mainnet (D12.3). Diseño: [plan-compra-colectiva.md](plan-compra-colectiva.md).

## `apps/bot`

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 13 | Librería de Telegram | — | — | ⏳ |
| 14 | LLM y SDK | — (las tools ya tienen el formato de tool use de la API de Claude) | — | ⏳ |
| 15 | Hosting del bot | — | — | ⏳ |

## `apps/web`

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 16 | Framework | — | — | ⏳ |
| 17 | Hosting | — (tiene que servir `agent.json` por HTTPS para ERC-8004) | — | ⏳ |
