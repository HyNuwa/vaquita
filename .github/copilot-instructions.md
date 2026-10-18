# Copilot instructions

All rules for this repository live in [AGENTS.md](../AGENTS.md) at the repository root. Read it before doing anything; its rules are mandatory.

Key points:
- Commits, branches and PRs in English (Conventional Commits). `docs/` and all user-facing text in Rioplatense Spanish.
- Every commit that touches code must also update `docs/miembros/<member>/bitacora.md` and `estado.md` (member = `git config vaquita.member`).
- Every transaction goes through `packages/core/src/chain/tagged-sender.ts`. Token addresses only from `packages/core/src/config/tokens.ts`.
- Keys only in `.env`. Dry-run by default.
