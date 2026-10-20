# @vaquita/core

The only package that talks to Celo. Everything that moves money, holds a rule or knows an address lives here, with tests that never touch the network.

```
src/
  config/      network · tokens · policy · env · paths   ← addresses and limits: read from here, never retype
  attribution/ tag                                         ← ERC-8021
  policy/      engine · ledger                             ← deterministic limits + daily spend
  chain/       reader · tagged-sender                      ← the only way to the network
  payments/    pay · messages
  money/       amounts · fx
  identity/    erc8004
  ramp/        ripio
  agent/       tools                                       ← the only thing the LLM sees
scripts/       run from the repo root with npm run (see the root README)
test/          vitest, no network
```

Apps import by subpath: `import { pay } from "@vaquita/core/payments/pay"`.

```sh
npm test -w @vaquita/core
npm run typecheck -w @vaquita/core
```

Design and rules: [`docs/investigacion/10-scaffold-stable-agent.md`](../../docs/investigacion/10-scaffold-stable-agent.md).
