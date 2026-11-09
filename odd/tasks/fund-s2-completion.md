# S2: completion of the shared-fund core
Build the S2 modules still missing, then prove S2-1 to S2-11, N1 to N14, S2-19 and S2-21 on a local fork.
Branch: `feat/fund-s2-completion`, stacked on `feat/fund-s2-reader` (`b94633d`). Delivery: local commits only; push and PR are the human's. Runner: Vitest; fork suite through `npm run fondo:fork`.

## Specs
1. **S1** — Human verbatim: "ok haz lo que falta para completar S2", then "si avanza con todo". Includes the local fork; the RPC destination is not yet given and nothing touches the network until it is.
2. **S2** — `docs/proyecto/specs/02-core-fondo.md:147`: "`clasificarError(e)` en `errores.ts` devuelve un código estable, un texto en español y si es transitorio". Table at :149-161; S2-16 "`clasificarError` con cada fila de la tabla".
3. **S3** — :167-169 pure rules `saldos.ts`, `cuotas.ts`, `reparto.ts`; S2-17 "Reglas puras, incluidas la invariante de `reparto` con pruebas aleatorias y el cruce de mes en hora argentina".
4. **S4** — :110-118 Safe bodies `txGasto`, `txCancelar`, `txCambiarResponsable`, `txCambiarDestinatarios`, `txRevocar`, `txCerrarVaqui`, `txReparto`.
5. **S5** — :57-59 `fondo/manifiesto.ts`; S2-20 "Manifiesto exportado/importado: detecta red, bytecode, módulo o responsables divergentes; no confía en campos del JSON sin revalidar en Celo".
6. **S6** — S2-18 browser boundary over the new modules.
7. **S7** — Fork: S2-1 to S2-11, N1 to N14, S2-19, S2-21. Requires the RPC destination from the human. Assumption: mainnet stays out of scope.

## Tasks
- **T1 [author GREEN]** — S2; inline: `errores.ts`, RED/GREEN. `TOKEN_RESTRINGIDO` deferred to T6.
- **T2 [author GREEN]** — S3; inline: pure rules, RED/GREEN.
- **T3 [author GREEN]** — S4; inline: Safe bodies, RED/GREEN. Risk 6.
- **T4 [author GREEN]** — S5,S6; inline: manifest and browser boundary, RED/GREEN. Author evidence for T1-T4: core 793/793 in 35 files, core and web types exit 0.
- **T5 [pending]** — S2-S6; delegated: one independent verifier, trigger: Risk line names a high-risk item.
- **T6 [blocked: RPC destination]** — S7; fork suite.

## Log
- **L1** — Human verbatim: "ok haz lo que falta para completar S2".
- **L2** — Human verbatim: "si avanza con todo". Reply to whether to include the local fork; no RPC named.
- **L4** — T1-T4 RED observed (missing modules). `txCancelar`, `txCambiarResponsable`, `txCerrarVaqui` and Roles bodies take the Safe/Roles address explicitly, which the spec signatures omit, because the body needs its target. S2-18 is covered by the existing transitive closure and public imports, not a real bundle: no bundler is a project dependency and the spec's wording is about imports.
- **L3** — Design notes. `TOKEN_RESTRINGIDO` needs the exact wARS signal, which the spec ties to the verified ABI and a fork test, so it is not invented in T1 and waits for T6. Bodies that target Roles live in `roles.ts`, not `safe.ts`, because `roles.ts` already imports from `safe.ts`.
