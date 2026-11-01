# La Vaquita

An AI agent for intent-based collective buying in digital pesos (wARS by Ripio) on Celo. Developer communities in Jujuy describe what they need, the agent prepares and compares supplier quotes, and the community votes on an offer for digital goods or services. Each buyer signs an on-chain commitment and authorizes the exact amount. Funds stay in their wallets until an atomic purchase pays the supplier directly; if the minimum is not met, the entire transaction reverts. This is the MVP design under D11, pending the spike, implementation and review.

La Vaquita is the working name, with a commercial naming decision due October 27. The existing rotating savings circle (junta) engine and its tests remain in the repo, paused under D11.7 and outside the main demo; `@vaquita/*` identifiers stay unchanged before November 9.

Built for the **Agents on Open Rails** hackathon (Celo × Ripio), Track 1: Stable Agents LatAm.

> Pitch: *"An agent that aggregates demand from LatAm tech communities, gets suppliers to compete, and executes purchases in wARS without holding buyers' funds."* Commitments do not reserve funds; payment does not guarantee delivery. Ripio can pause, block and upgrade wARS. Full context: [`docs/proyecto/contexto.md`](docs/proyecto/contexto.md). Design: [`docs/proyecto/plan-compra-colectiva.md`](docs/proyecto/plan-compra-colectiva.md).

## Repository layout

npm workspaces monorepo:

| Path | What |
|---|---|
| [`packages/core`](packages/core) | Tx pipeline (ERC-8021 tag, CIP-64 gas in USDC), policy, payments, ERC-8004 identity, Ripio ramp, vaquita engine. The only package that talks to Celo. |
| [`apps/bot`](apps/bot) | Telegram bot + LLM loop with tool use |
| [`apps/web`](apps/web) | Public status page per vaquita |
| [`docs/`](docs/README.md) | Team docs (Spanish) |

## Guarantees already in the core

- Celo mainnet only (chainId 42220).
- ERC-8021 attribution tag on every transaction; untagged transactions are never broadcast.
- Gas paid in USDC (fee abstraction, CIP-64).
- Deterministic limits the LLM cannot change.
- Dry-run by default; real payments only with `LIVE_PAYMENTS=si-muevo-plata-real`.
- ERC-8004 identity registration from the agent wallet.

## Onboarding (every team member, once per computer)

```sh
git clone https://github.com/HyNuwa/vaquita.git
cd vaquita
npm install                          # installs every workspace and turns on the team's git hooks
git config vaquita.member <slug>     # daniel, esteban or maximiliano
npm run check                        # typecheck + tests, no network
```

Then read [`AGENTS.md`](AGENTS.md) and [`docs/README.md`](docs/README.md). If you use an AI coding agent, it reads `AGENTS.md` and follows these rules on its own.

## Running the agent wallet scripts

Only whoever operates the agent wallet needs a real `.env` (at the repo root):

```bash
cp .env.example .env        # AGENT_PRIVATE_KEY, ATTRIBUTION_CODE, ALLOWED_RECIPIENTS
npm run preflight           # read-only: network, tokens, balances
npm run pago:primero -- prueba                                   # dry-run: 1 wARS
LIVE_PAYMENTS=si-muevo-plata-real npm run pago:primero -- prueba # real
npm run tx:verificar -- 0x<hash>                                 # check the tag on-chain
npm run identidad:registrar                                      # ERC-8004
```

## Rules in short

- **Commits, branches and PRs in English** ([Conventional Commits](https://www.conventionalcommits.org/), e.g. `feat(core): add fair-pot schedule`). `docs/` and every user-facing text in Rioplatense Spanish.
- **Every commit that touches code also updates your docs:** `docs/miembros/<you>/bitacora.md` and `estado.md`, in the same commit.
- **Work on a branch from `staging`** and merge through a PR with green CI (no approval required).
- **Keys only in `.env`.** Hooks and CI scan every diff for keys and tokens. **Never use `--no-verify`.**
- **Every transaction goes through `packages/core/src/chain/tagged-sender.ts`.**

## Skills for coding agents

`.agents/skills/` is the only copy, shared by every agent. It includes Celopedia (`npx skills add celo-org/celopedia-skills`), plus `commit-docs` (log before every commit) and `review` (security review before a PR).

Codex, Cursor, Gemini CLI and Copilot read `.agents/skills/` directly. For Claude Code, Devin and Windsurf, `npm install` links `.claude/skills`, `.devin/skills` and `.windsurf/skills` to it (a junction on Windows, no admin needed). Those links are not committed; never put files in them.
