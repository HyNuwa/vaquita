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

## Fund sender (local fork tests)

Apps use `enviador` from `@vaquita/core/fondo/enviador`, never import
`chain/fork-sender` directly. `enviador({ deps: senderDeps })` defaults to the
existing tagged sender, preserving CIP-64, policy caps and dry-run/live behavior.
Both routes expose `prepare(call)` and `broadcast(signedTx)`, reusing `Call`,
`Prepared` and `Broadcasted` from the existing sender.

Fork tests opt in explicitly with
`enviador({ mode: "fork", env: { E2E_FORK: "1" }, deps: forkDeps })`.
The injected environment must have **no `LIVE_PAYMENTS` property**, including no
empty, invalid or `undefined` value. No environment file is loaded by the selector.
`forkDeps` supplies `rpcUrl`, `attributionCode` and a local account generated in
process by the test (`generatePrivateKey()` / `privateKeyToAccount()`); never use
real keys or Anvil's default accounts. An optional `fetchFn` is a trusted test-only
transport replacement, not an alternate endpoint or production configuration.

Only HTTP(S) URLs with the literal hostname `localhost` or `127.0.0.1` are allowed;
credentials, query strings, fragments, alternate IP spellings and redirects are
rejected. Configuration is checked before signing or contacting the RPC.
The fork uses tagged ordinary legacy transactions, **without CIP-64 or
`feeCurrency`**, on chain 42220. Explicit `{ deploy: true, data }` is supported.
Unlike production, fork gas is native currency: `maxGasCost18` is a native cost,
not a stablecoin budget, and fork preparation does not enforce production caps.
Fork broadcasts return `attributionCodes: null`; they are not mainnet evidence.
These deterministic tests do not run Anvil or prove contract deployment:

```sh
npm exec -w @vaquita/core -- vitest run test/fork-sender.test.ts test/fondo-enviador.test.ts
```

## Fork lifecycle test helper

`test/helpers/anvil.ts` resolves Anvil from `ANVIL_BIN`, then `PATH`, then
`~/.foundry/bin`. An explicit invalid override fails rather than choosing a
different executable. It does not load environment files; `LIVE_PAYMENTS` must
be entirely absent. `CELO_RPC_URL` selects the upstream fork source, defaulting
to the public Celo RPC. Upstream access is read-only; all administrative calls
are restricted to the helper's ephemeral loopback endpoint.

`withAnvil(options, async (fork) => { ... })` starts a dedicated child on a free
loopback port, waits for chain 42220 and closes that child in `finally`.
Startup failure also triggers cleanup. Shutdown waits for exit, escalates only
that child from `SIGTERM` to `SIGKILL`, and fails if exit cannot be confirmed.
The helper does not send transactions; fork fixtures use the selector above.
Its ordinary tests mock process, port and RPC operations, so they do not need
Anvil or an upstream connection:

```sh
npm exec -w @vaquita/core -- vitest run test/anvil.test.ts
```

Run the separate integration suite explicitly from the repository root:

```sh
npm run fondo:fork
```

It requires Anvil and read-only access to the upstream Celo RPC. The normal
`npm test` suite excludes `test-fork/`; CI does not execute the fork command.
The core typecheck includes both configurations and the fork tests.
`test/helpers/fondo-fixture.ts` checks all six reference code hashes before
funding fresh accounts through local administrative RPC. It deploys Safe and
Roles through the guarded sender; the suite checks owners, threshold, module
owner/avatar/target and exact proxy runtime, then exercises local token funding
and time advancement. No production configuration or stored signing key is loaded.
A passing run proves only that local fork state, never mainnet deployment.
Local token funding (`anvil_dealERC20`) has a 30-second request deadline because
it may query forked storage. Readiness and other administrative calls retain
their existing short deadline; no failed request is automatically repeated.
Diagnostics show controlled phase labels and sanitized local RPC errors, never
external error messages or request parameters.

Design and rules: [`docs/investigacion/10-scaffold-stable-agent.md`](../../docs/investigacion/10-scaffold-stable-agent.md).
