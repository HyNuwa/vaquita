---
name: commit-docs
description: Before every commit that touches code in La Vaquita, update the member's bitacora.md and estado.md so the pre-commit hook passes. Use it before committing.
---

# commit-docs

Goal: every code commit carries its docs, with no hook rejections.

## Steps
1. Run `git config vaquita.member` to get the member slug. If it is empty, ask who they are; never guess.
2. Run `git status` and `git diff --staged` (if nothing is staged, `git diff`). Understand what changed and why.
3. Prepend an entry to `docs/miembros/<slug>/bitacora.md`, in Spanish, with the format in `AGENTS.md` section 4: date, commit message, what was done (1-3 lines), key files, next step.
4. Update `docs/miembros/<slug>/estado.md`: date and only what really changed (focus, next step, blockers).
5. If the change is a decision for everyone, add it to `docs/proyecto/decisiones.md` (append, don't rewrite others).
6. Stage those docs together with the code.
7. Propose an English Conventional Commit message under 72 characters (scopes: core, bot, web, scripts, docs, ci, repo) and wait for confirmation before committing.

## Rules
- Don't invent progress: if it is not in the diff, it doesn't go in the log.
- Only touch the member's own folder in `docs/miembros/`.
- No keys, tokens or emails in docs. Public addresses and tx hashes are fine.
- If the hook still fails, show its exact message and fix what it asks. Never use `--no-verify`.
