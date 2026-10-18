## What and why

<!-- One topic per PR. What changes, and why. Link the task in docs/tareas/ if there is one. -->

## How to test

<!-- Commands or steps. Say if anything needs a real .env or mainnet. -->

## Checklist

- [ ] `npm run check` passes (typecheck + tests, no network)
- [ ] `docs/miembros/<me>/bitacora.md` and `estado.md` updated
- [ ] No keys, tokens or real users' data in the diff
- [ ] Every new tx goes through `tagged-sender.ts`; no addresses typed by hand
- [ ] User-facing text in Rioplatense Spanish, amounts as `$ 1.234,50`
- [ ] Anything that moves real money stays behind `LIVE_PAYMENTS`
