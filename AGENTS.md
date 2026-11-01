# AGENTS.md — La Vaquita

Mandatory rules for every AI coding agent (Claude Code, Codex, Cursor, Devin, GitHub Copilot, Gemini, Windsurf, etc.) and every human working on this repository. If anything here conflicts with your defaults, these rules win.

La Vaquita (working name, see D6 in `docs/proyecto/decisiones.md`) is an AI agent that turns communities into collective buyers: members post a shared need, the agent gets providers to compete with quotes, and the purchase executes atomically in digital pesos (wARS by Ripio) on Celo mainnet without the platform ever holding the money (decision D11, 2026-10-25; the junta engine stays in the repo but is paused). Maximiliano owns all delivery work, with Esteban and Daniel as optional collaborators (decision D12), for the **Agents on Open Rails** hackathon (Celo × Ripio), Track 1. **Deadline: Monday 2026-11-09, 09:00 GMT (06:00 ART).** Product context: [`docs/proyecto/contexto.md`](docs/proyecto/contexto.md) — read it before touching code.

## 0. Repository layout (monorepo)

One repo, npm workspaces. Code, docs and rules change together in one commit and one PR.

| Path | Package | Content |
|---|---|---|
| `packages/core/` | `@vaquita/core` | Tx pipeline, policy, payments, identity, ramp, collective-purchase rules (`compra/`), junta engine (paused). **The only package that talks to Celo.** |
| `contracts/` | — | `CompraColectiva` and its factory (Solidity + Foundry). Opens only after the D7/D11 spike passes |
| `apps/bot/` | `@vaquita/bot` | Telegram bot + LLM loop with tool use |
| `apps/web/` | `@vaquita/web` | Campaign page per community. Members commit or cancel by signing, in their own wallet, a transaction the core built |
| `docs/` | — | Team second brain, in Spanish |
| `.githooks/`, `.github/` | — | Git hooks, CI and PR template |
| `.agents/skills/` | — | Agent skills, one copy for every tool |

- Apps import from the core by subpath: `import { pay } from "@vaquita/core/payments/pay"`. Apps never import `viem` wallet clients or build transactions themselves.
- `.env` and `data/` (the spend ledger) live **only at the repo root** and are shared by every app and script (`packages/core/src/config/paths.ts`). Never create a second ledger: the daily budget would be spendable twice.
- **Skills** live only in `.agents/skills/`. `.claude/skills`, `.devin/skills` and `.windsurf/skills` are local links that `npm install` creates (`.agents/link-skills.mjs`); they are gitignored and CI fails if files are committed there. Add or edit skills in `.agents/skills/`.
- **Stack:** [`docs/proyecto/stack.md`](docs/proyecto/stack.md). Don't add a dependency outside it without recording the decision in `docs/proyecto/decisiones.md`. Package manager: **npm** only. Add a dependency to the workspace that uses it (`npm install <pkg> -w @vaquita/bot`), shared dev tools to the root.

## 1. Language

- **English:** commit messages, branch names, PR titles and descriptions, issues, identifiers in new code, README and config files.
- **Spanish:** everything in `docs/`, and **all user-facing text** (bot messages, web page, error messages shown to users) in Rioplatense Spanish. LLM tool names are Spanish too (`pagar`, `estado`, `cobrar`) because the agent operates in Spanish.
- **Code comments** follow the file you are in: the scaffold in `packages/core` is commented in Spanish; keep it that way there. Don't mass-translate.
- If the user talks to you in Spanish, reply in Spanish.

## 2. Identify who is working

1. Run `git config vaquita.member`. It returns the member's slug: `daniel`, `esteban` or `maximiliano`.
2. If it is empty, ask the user who they are and tell them to run `git config vaquita.member <slug>`. Never guess.
3. Names, aliases (e.g. "Maxi") and roles: [`docs/equipo.md`](docs/equipo.md).

## 3. Before starting a task

Read, in this order:
1. [`docs/README.md`](docs/README.md)
2. [`docs/proyecto/contexto.md`](docs/proyecto/contexto.md), [`stack.md`](docs/proyecto/stack.md) and [`decisiones.md`](docs/proyecto/decisiones.md); `docs/investigacion/` when the task needs background
3. `docs/tareas/control-entrega.md` (gates, deadlines and scope cuts) and `docs/tareas/maximiliano.md` (every task, per D12). Optional collaborators agree on a task with `maximiliano` before taking it, and it gets marked there.
4. The current member's `docs/miembros/<slug>/estado.md`

## 4. Documentation on every commit (mandatory)

Before creating **any commit that changes files outside `docs/`**, in the same commit:

1. **Prepend** an entry to `docs/miembros/<slug>/bitacora.md` (newest first), in Spanish:
   ```markdown
   ## YYYY-MM-DD · <commit message>
   - **Qué hice:** what changed and why, in 1–3 lines.
   - **Archivos clave:** main paths touched.
   - **Próximo paso:** what comes next.
   ```
2. **Update** `docs/miembros/<slug>/estado.md`: date, current focus, next step, blockers.
3. If the work produced an idea or proposal, add it to `docs/miembros/<slug>/ideas.md`.
4. If the team made a decision that affects everyone, add it to `docs/proyecto/decisiones.md`.
5. **Stage these files** together with the code.

The `pre-commit` hook rejects commits that touch code without the member's `bitacora.md`, and CI rejects PRs that do. **Never bypass hooks with `--no-verify`.**

Rules for `docs/`:
- Only edit **your own** folder in `docs/miembros/` (the hook enforces it). Other members' folders are read-only.
- Shared files (`docs/proyecto/`, `docs/equipo.md`, `docs/tareas/`): add to them, don't rewrite others' content.
- Never write secrets, private keys, API keys, bot tokens, emails or real users' data in `docs/`. Public wallet addresses and tx hashes are fine.

## 5. Answering questions about the team

For questions like "What is Maxi working on?":
1. Resolve the alias in [`docs/equipo.md`](docs/equipo.md).
2. Read `docs/miembros/<slug>/estado.md`, then the latest entries in `bitacora.md` and `ideas.md`.
3. Answer with the date of the last update, and say so if it is more than a few days old.

Run `git pull` first if the user wants the latest status.

## 6. Commits, branches and pull requests

- [Conventional Commits](https://www.conventionalcommits.org/) in English: `type(scope): imperative summary`, subject under 72 characters.
  - Types: `feat` `fix` `docs` `refactor` `test` `chore` `style` `perf` `build` `ci`.
  - Scopes: `core`, `bot`, `web`, `scripts`, `docs`, `ci`, `repo`. Example: `feat(core): add fair-pot schedule with bigint math`.
- The `commit-msg` hook (and CI) reject messages that don't follow the format or contain non-ASCII characters (accents, ñ, ¿, ¡).
- `main` and `staging` are protected: no direct pushes, no force pushes, no deletion. Changes land only through a PR with green CI. **No approval is required** (D12): authors merge their own PRs. Anything that touches money first goes through the review in `docs/tareas/control-entrega.md`.
- Always work on a branch created from an up-to-date `staging` (`feat/...`, `fix/...`, `docs/...`, `chore/...`), push it and open a PR to `staging`. `staging` goes to `main` for releases and the final submission.
- Don't reuse a branch that was already merged: start a new one from `staging`.
- Keep PRs small: one topic per PR. Fill in the PR template.

## 7. Setup (once per computer)

```sh
npm install                          # turns on the team hooks and links the skills folders
git config vaquita.member <slug>     # daniel, esteban or maximiliano
cp .env.example .env                 # only whoever runs the agent wallet needs real values
```

Check: `git config core.hooksPath` prints `.githooks`.

## 8. Project rules (never break)

Full context in [`docs/proyecto/contexto.md`](docs/proyecto/contexto.md) section 2.

1. **Celo mainnet only** (chainId 42220). Testnet only in local tests.
2. **Real Ripio wFIAT.** Token addresses come from `packages/core/src/config/tokens.ts`. **Never** invent or type an address from memory.
3. **Every tx carries the ERC-8021 tag** (`ATTRIBUTION_CODE`). Without it the tx is not broadcast.
4. **ERC-8004 identity** registered from the agent wallet before 2026-11-09.
5. **Gas in stablecoin** via fee abstraction (CIP-64, `feeCurrency` = USDC adapter). wARS is not a fee currency.
6. **The LLM proposes, the code decides.** Caps, budgets, recipients, campaign rules (quota, buyer selection, per-buyer cap, when to execute), pot amounts, turn order and late-payment rules are deterministic code. The LLM never picks the provider: the community votes. The LLM never sees addresses, only aliases.
7. **Dry-run by default.** Real money only with `LIVE_PAYMENTS=si-muevo-plata-real`.
8. **Keys only in `.env`**, never in the repo, in logs or in docs. The `pre-commit` hook and CI scan every diff for keys and tokens. If a key is ever pushed, treat it as leaked: move the funds and rotate it; deleting the commit is not enough.
9. **Tests before mainnet.** Every tx goes through `packages/core/src/chain/tagged-sender.ts`; never call `sendTransaction` or `writeContract` directly (CI blocks it outside `packages/core/src/chain/`). Tests never touch the network.
10. **UX for non-crypto users.** Amounts in local currency (`$ 1.234,50`); no "wei", "gas", "calldata" or addresses in user messages.
