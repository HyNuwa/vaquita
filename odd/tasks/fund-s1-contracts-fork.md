# S1 — Fund contracts and local fork
Objective: implement S1 only, without real keys or mainnet writes. Integration branch: `feat/fund-s1-contracts-fork`, based on `9b487e2e7046889e85adc58334855b0d8a5c9c76` from updated `staging`.
Delivery: `auto-chain`, `chain_strategy=feature-branch-chain`; target integration is `staging` per project policy. Forecast: 900–1400 authored diff lines excluding generated lockfile. Runner: Vitest, npm workspaces; fork checks outside CI.

## Specs

### S1 — Authorization
> ok entonces haz el PR como planeas, y empezemos con a implementar

The immediately accepted proposal limits implementation to S1 after PR #22 is merged with green CI. Source specification: `docs/proyecto/specs/01-contratos-y-fork.md`, read in full. Higher authority: AGENTS.md, D16 and `docs/proyecto/spec.md`. This task document adds no product requirements.

### S2 — S1 acceptance criteria (verbatim from the accepted specification)
| ID | Nivel | Debe pasar |
|---|---|---|
| S1-1 | CI | `contratosFondo(1)` lanza. `assertModuloPermitido` rechaza las dos versiones prohibidas |
| S1-2 | CI | `fork-sender` lanza con una URL pública |
| S1-3 | CI | Ningún archivo de `apps/` importa `fork-sender`; `enviador` rechaza el fork sin `E2E_FORK=1`, con RPC público o con `LIVE_PAYMENTS` |
| S1-4 | CI | Las direcciones de la tabla tienen checksum válido |
| S1-5 | Fork | Crear Safe y Roles, y leer dueño, avatar y target iguales al Safe, y umbral 2 |
| S1-6 | Fork | El código del proxy de Roles es `0x363d3d373d3d3d363d73` + mastercopy + `5af43d82803e903d91602b57fd5bf3` |
| S1-7 | Lectura | `npm run fondo:contratos` sale con 0 |
| S1-8 | Docs | `stack.md` y `docs/pruebas/fondo.md` actualizados |

### S3 — Fork and safety requirements (verbatim excerpts)
> Ninguna nueva en el core. Foundry 1.8.7 ya es del proyecto: usar `anvil` de `ANVIL_BIN`, del `PATH` o de `~/.foundry/bin`.

> `@gnosis-guild/zodiac` 5.0.1 exacta como `devDependency` del core, solo en `scripts/`, para `sanityCheckZodiacModuleAddress`. Si no se puede instalar o ejecutar, se anota en Bloqueos y queda como paso humano. La comparación de `codeHash` de esta spec sigue siendo obligatoria.

> Lanza salvo que el RPC sea `127.0.0.1` o `localhost`. Test con una URL pública.

> Agrega la etiqueta, firma con claves generadas en la prueba y usa una transacción común. **anvil 1.8.7 con `--celo` rechaza CIP-64** con `Invalid parameters`, así que CIP-64 no se prueba en fork.

> `packages/core/src/fondo/enviador.ts` elige entre `tagged-sender` y `fork-sender`: este último solo con `E2E_FORK=1` **y** RPC local. Si `LIVE_PAYMENTS` está definida, lanza. `apps/` usa ese selector, nunca `fork-sender` directo. Un test recorre `apps/` y falla si aparece.

> Los adaptadores de lectura y despliegue de contratos no utilizan PostgreSQL, sesiones ni el backend de La Vaquita. Las direcciones y los `codeHash` se verifican desde RPC incluso cuando la aplicación funciona en modo independiente. El manifiesto público y la recuperación se implementan en S2; esta parte no cambia custodia, versiones ni permisos de seguridad.

## Tasks
- T1 | S1–S2 | route: gentle-ai-worker (context backstop) | status: in_progress | contract configuration, ABI and deterministic tests; slice `feat/fund-s1-contract-config` -> integration | commit: pending | Risk: item 2 (forbidden contract guards).
- T2 | S1–S3 | route: gentle-ai-worker | status: pending | isolated fork sender and selector guards with tests; slice `feat/fund-s1-fork-sender` -> T1 | commit: pending | Risk: item 2 (local-only sending guard).
- T3 | S1–S3 | route: gentle-ai-worker | status: pending | fork lifecycle harness, fixture and deployment assertions; slice `feat/fund-s1-fork-harness` -> T2 | commit: pending | Risk: item 5 (test environment).
- T4 | S1–S3 | route: gentle-ai-worker | status: pending | read-only contract verification CLI, exact optional checker dependency, tests and docs; slice `feat/fund-s1-contract-check` -> T3 | commit: pending | Risk: item 5 (dependency).
- T5 | S1–S3 | route: independent gentle-ai-verify + parent | status: pending | final suite, read-only contract check, fork, evidence and chain preparation | commit: pending | Risk: items 2, 5.

## Log
L1 — Original authorized request, verbatim: “ok entonces haz el PR como planeas, y empezemos con a implementar”.
L2 — PR #22 updated with commits `8d54393` and `5d0a44c`, CI check passed in run `42429727014`. Merged as `9b487e2e7046889e85adc58334855b0d8a5c9c76`. Fresh integration branch created from origin/staging; no mainnet operations.
L3 — Human chose “Cadena sobre una rama de S1 — recomendado” (`feature-branch-chain`). This delivery shape supersedes the one-PR-per-S1 default, but does not independently grant future publishing/merges. Planned coherent slice boundaries are T1, T2, T3, T4; do not split tests/docs from their behavior or compress code to meet a line heuristic.
L4 — Preparation observed Node v24.14.0, npm 11.20.0, LIVE_PAYMENTS absent. Anvil is not on PATH; version and executable fallback remain to validate before fork. Explorer located reference fixture and existing sender interfaces; no secrets were read. Configuration/ABI unit does not require fork tools or any new dependency. No tests yet executed for S1.
L5 — T1 worker observed RED (missing candidate modules, exit 1, zero tests), then GREEN (28 focused tests). First full check found TS2322 in test event topics, corrected once; subsequent full check passed 308 tests and core/web typecheck. Independent verifier passed 28 candidate tests plus 3 scratch boundary probes and typecheck; no blockers. Parent reran 28 tests successfully. T1 remains in progress pending native review of this work-unit commit. No runtime RPC/fork claim. Source + tests are new modules; no shared existing behavior changed. Authored source/test slice count to record at commit; metadata is not a reason to omit tests.
