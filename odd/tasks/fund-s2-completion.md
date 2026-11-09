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
- **T5 [done over ee081ac, see L5]** — S2-S6; delegated: one independent verifier, trigger: Risk line names a high-risk item.
- **T6 [author GREEN, see L7]** — S7; inline: `packages/core/test-fork/fondo-s2.test.ts`, 20/20 on local Anvil. Risk: none in product code; tests and docs only.

## Log
- **L1** — Human verbatim: "ok haz lo que falta para completar S2".
- **L2** — Human verbatim: "si avanza con todo". Reply to whether to include the local fork; no RPC named.
- **L7** — Fork suite: S2-1 to S2-11, N1 to N14, S2-19, S2-20 end to end (owners, bytecode, module) and S2-21 pass, 20/20, through `forno` with generated accounts and nothing sent to mainnet; offline core 800/800, core types exit 0. S2-11 vector fixed in `test/fondo-safe.test.ts`, same value on two runs. N1 to N10 run through the real `simulacion` control and are asserted as a passing control, not one by one. S2-10's "Roles 2.1.0" is simulated by a proxy to a code-less address, so it proves the mastercopy check, not the behavior of 2.1.0. S2-21's "application and database disconnected" holds because the suite imports neither, not because a server was shut down. Not closed: `TOKEN_RESTRINGIDO`, no exact wARS signal was obtained and none was invented. No independent verifier ran over this unit, since it changes no product code. Out of S2: Zodiac checker, I1-I4, S8.
- **L6** — Human relays, verbatim: "Usá el RPC público de Celo mainnet: https://forno.celo.org (chainId 42220), únicamente para el fork local, sin transmitir transacciones a mainnet." and "eso me respondio el otro agente". T6 unblocked with that destination; every send goes to the local Anvil through the fork sender, with accounts generated in the process.
- **L5** — Independent verifier over `ee081ac`, in the isolated copy: no blockers; S2-S6 PASS offline, except the deferred `TOKEN_RESTRINGIDO` row. 127/127; with its probe 177/178, the red being A1; `tsc` exit 1 only from an earlier probe file; a real esbuild browser bundle of the new modules passed. A1 (revert reason `constructor` resolved through the prototype) and A2 (wARS token as destination) fixed after that run with RED/GREEN, so that verdict does not cover those two lines. Open advisories: the Safe itself is accepted as a destination because the body has no Safe argument; addresses are not checksum-checked; `grupoId` accepts free text although the spec calls it technical. Not proven: anything on-chain; S2-20 bytecode and owner divergence end to end, since the author's test mocks `verificarGrupo`.
- **L4** — T1-T4 RED observed (missing modules). `txCancelar`, `txCambiarResponsable`, `txCerrarVaqui` and Roles bodies take the Safe/Roles address explicitly, which the spec signatures omit, because the body needs its target. S2-18 is covered by the existing transitive closure and public imports, not a real bundle: no bundler is a project dependency and the spec's wording is about imports.
- **L3** — Design notes. `TOKEN_RESTRINGIDO` needs the exact wARS signal, which the spec ties to the verified ABI and a fork test, so it is not invented in T1 and waits for T6. Bodies that target Roles live in `roles.ts`, not `safe.ts`, because `roles.ts` already imports from `safe.ts`.
