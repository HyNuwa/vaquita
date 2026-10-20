---
name: review
description: Review the La Vaquita diff before a commit or PR for money-safety bugs, leaked secrets and broken project rules. Use before every large commit or PR.
---

# review

Review the current diff (`git diff`, or `git diff origin/staging...HEAD` for a PR) and report in this order.

## 1. Money and security (blocking)
- Private keys, mnemonics, bot tokens, API keys or `.env` in the diff or in logs.
- A transaction built or sent outside `packages/core/src/chain/tagged-sender.ts` (`sendTransaction`, `writeContract`, wallet clients).
- An address typed by hand instead of read from `config/tokens.ts` or `config/network.ts`.
- The LLM seeing or choosing an address, an amount it computed, or a limit; tool inputs not validated with zod `.strict()`.
- A payment that skips the policy engine or the ledger reservation, or a second ledger file.
- Anything that moves real money without the `LIVE_PAYMENTS` phrase check; non-mainnet chain IDs.
- Money math in floating point: pots, fees and contributions must be `bigint` in 18-decimal units, with the fair-pot invariant (sum of pots = N·A) tested.
- A payment that is not `pozo_k` to the member of turn k, a refund under rule A or a deposit return.

## 2. Bugs
Logic errors, edge cases (late payment, missing contribution, member leaves, rounding remainder, day boundary in Buenos Aires time), missing `await`, missing error handling, tests that hit the network.

## 3. Users and maintenance
User-facing text not in Rioplatense Spanish, amounts not formatted as `$ 1.234,50`, crypto jargon in messages; weak types (`any`), duplication, missing tests for new logic.

## Output
Short list: `[BLOCKING] / [IMPORTANT] / [MINOR]` + file:line + what happens + how to fix it. If there are no issues, say so in one line. Don't rewrite code unless asked.
