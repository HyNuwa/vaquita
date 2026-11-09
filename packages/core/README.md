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

## Browser-safe Safe primitives and creation (offline)

`@vaquita/core/fondo/constantes` exports the S2 limits in 18-decimal bigint
units (plus recipient count and hashed role/budget keys). The UI contribution
limit and group objective are operational, not on-chain restrictions.
`@vaquita/core/fondo/safe` exports:

- `TxSafe`: `{ to, value, data, operation: 0 | 1, nonce }`.
- `hashTransaccionSafe(safe, tx)`: Safe 1.4.1 EIP-712 hash on Celo 42220,
  binding the Safe, body and nonce. Frozen `SAFE_GAS_FIELDS` fixes `safeTxGas`,
  `baseGas`, `gasPrice` to zero and `gasToken`, `refundReceiver` to zero addresses;
  execution builders must reuse this invariant.
- `firmasPreaprobadas([owner1, owner2])`: exactly two distinct owners, sorted
  numerically; each entry is 32-byte owner + 32-byte zero + `01` (65 bytes).
  This encodes approvals; it does not verify current ownership or on-chain approval.
- `encodeMultiSend(calls)`: **ABI-wrapped `multiSend(bytes)` calldata**, not raw
  packed entries. Each `{ to, data }` becomes operation 0, value 0, byte length
  and data. Any outer delegatecall is separate from these inner calls.

`@vaquita/core/fondo/transacciones` exports `TxPersona = { to: Address, data: Hex }`
and five synchronous, pure builders with an **explicit attribution code**:

- `aportar(safe, monto, code)`: wARS `transfer` to the Safe, not `approve`.
  Amounts are 18-decimal bigint units; agent caps do not limit human amounts.
- `aprobarHash(safe, hash, code)`: Safe `approveHash` for the exact supplied hash.
- `ejecutarPropuesta(safe, txSafe, firmas, code)`: Safe `execTransaction` with
  the exact body and signatures and the shared frozen `SAFE_GAS_FIELDS` zeros.
  The nonce belongs to the hash; Safe reads it on-chain, not from an ABI argument.
- `crearSafe(config, code)`: official factory `createProxyWithNonce`, Safe L2
  singleton and the validated setup described below. No module is enabled yet.
- `desplegarRoles(safe, groupId, code)`: official module factory `deployModule`,
  pinned Roles mastercopy and that Safe as owner, avatar and target. This does not
  enable the module or grant spending permissions.

### Deterministic setup and address prediction

The `safe` subpath also exports `CreationConfig`: `{ groupId, owners,
operatingWallet, identityWallet }`, with readonly inputs. `encodeSafeSetup(config)`
requires exactly three distinct, nonzero owners, excluding both supplied agent
accounts. It preserves their order, uses threshold two and the pinned fallback
handler, and initializes with no delegatecall, payment or refund.
`encodeRolesSetup(safe)` encodes the three Safe addresses for Roles 2.1.1.

`creationSalt(groupId)` is the uint256 value of keccak256 of the literal UTF-8
identifier. `predictSafeAddress(config, proxyCreationCode)` combines the official
factory, hashed initializer, that nonce and padded singleton. The creation code
must come from the **verified factory**; an arbitrary supplied value is not
verified by this pure function. `predictRolesAddress(groupId, safe)` uses the
module factory's distinct EIP-1167 creation template and its corresponding setup.
The same complete inputs reproduce the same addresses; changing owner order or
other setup inputs changes the address even with the same group identifier.

Prediction does not establish that code at an address is the expected deployment.
The read-injected resumption module below checks occupied addresses; the initial
permissions batch remains separate. Never skip a deployment merely because an
address has nonempty code.

Each outer transaction validates the live-format code, appends ERC-8021 and asserts
its tag. Inner Safe data stays byte-for-byte unchanged, even if empty or tagged.
The web's existing wallet submission helper accepts this additive two-field type;
existing purchase transactions remain structurally compatible.

These helpers do not load environment, filesystem, SQL or server adapters.
They do not simulate, compare on-chain hashes, check current owners/approvals or
submit transactions. Later RPC orchestration must compare the current hash and
simulate before requesting the second signature. Tests cover the scoped browser
core import closure and public imports, not a browser bundle or future reader and
verifier modules; full S2-18 remains pending.
Tests use synthetic fixtures and an independent reference encoding, never RPC.
The fixed hash is **not fork evidence**: S2-11 remains pending. This unit does
not submit deployments, verify a deployed fund or establish full S2 completion.

## Read-injected creation resumption

`@vaquita/core/fondo/creacion` exports `planCreation(config, code, reader)` and
`CreationReader`/`CreationPlan`. The caller injects chain ID, block number, code,
storage and low-level call reads; this module creates no transport or wallet.
It validates owners/code before reads, then checks actual Celo chain ID and pins
all reference, factory and deployed-state reads to one block number.

The five creation references must match their cached code hashes. Creation code
comes from that authenticated factory. An occupied predicted Safe must retain
its singleton, expected owner set/threshold, handler, zero guard and no module
except possibly predicted Roles. Occupied Roles must have the exact proxy runtime
for the authenticated mastercopy and Safe as owner/avatar/target. Allowing Roles
as a module **does not attest its spending permissions**. MultiSend and full
fund verification remain separate from this creation-only check.

The result contains `{ safe, roles, blockNumber, steps }`; each ordered missing
step has `{ step: "safe" | "roles", tx: TxPersona }`. Neither deployment is
returned twice, including when Roles was deployed before Safe. An empty list
means only **no deployments missing at that block**, not configured/active fund.
Read failures, malformed data or mismatches throw
`No pudimos verificar la creación del fondo.` without raw transport details;
they are never treated as absence.
There is no retry, persistence, signing, broadcast or automatic permission reset.
Numeric block pinning is not finality; callers must re-read/simulate before later
signatures. Initial rules, full verification and fork evidence remain separate.

## Initial Roles rules (pure encoding)

`@vaquita/core/fondo/roles` exports `condicionesVaqui(recipients)` and
`buildInitialRules({ safe, roles, operatingWallet, recipients, nonce })`.
Recipients are checksum-normalized, deduplicated and sorted numerically without
mutating inputs. The effective list must contain 1–20 valid addresses; no owner
exclusions are silently applied to recipients. Invalid lists throw
`Elegí entre 1 y 20 destinatarios con cuentas válidas.` Invalid group account
formats or a nonce outside uint256 throw
`Revisá las cuentas del grupo y el número de operación.`

The Roles 2.1.1 BFS tree is `Matches(Or(recipients), And(LessThan(L+1),
WithinAllowance(K)))`: recipient leaves first, then both amount leaves, with
32-byte left-padded addresses/unsigned words. Fixed constants encode an inclusive
5,000 wARS transfer bound and 20,000 wARS per 2,592,000-second allowance.
The interface's 20-recipient maximum is not an immutable on-chain limit.

The resulting `TxSafe` delegatecalls pinned MultiSendCallOnly with zero value and
the explicit nonce. Its five internal zero-value CALLs are, in order: Safe
`enableModule`, Roles `setAllowance`, `scopeTarget`, `scopeFunction` for only wARS
`transfer(address,uint256)`/options 0, then `assignRoles` to the operating wallet.
It reuses complete `encodeMultiSend` calldata exactly once; there are no extra
permissions, ERC-20 approvals or default-role changes. Existing
`ejecutarPropuesta` supplies outer attribution and zero refund fields.

**Initial setup is not idempotent:** replaying the allowance setter resets its
balance. Never automatically replay this batch to resume missing deployments.
Addresses/state are caller-supplied and not authenticated by this pure encoder;
verify current configuration and simulate before signatures. Timestamp zero
starts the period at execution; refill equals maxRefill, but two budgets may be
spent across a renewal boundary. No additional on-chain frequency claim is made.
Offline encoding tests do not attest deployed permissions, a browser bundle,
new fork evidence or full S2 acceptance.

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

## Read-only fund contract verification

```sh
npm run fondo:contratos
```

Uses the runtime `CELO_RPC_URL` variable or `https://forno.celo.org`; it does not
load environment files, accounts, databases or signing keys. It checks actual
chain ID 42220, rejects prohibited configured addresses and prints the expected
and observed bytecode hash for all six reference contracts. Empty code, a hash
mismatch or an RPC failure exits with status 1; all mandatory checks passing exits
with 0. Requests have a 30-second deadline and no automatic retries. RPC errors
are sanitized rather than printing endpoint credentials or external details.

**Separate pending human check:** `sanityCheckZodiacModuleAddress` is not executed.
Zodiac 5.0.1 was removed after its dependency audit, by explicit project-owner
decision. Every completed result table reports this limitation on stderr, including on
exit 0. Early configuration or chain-ID failures print only their specific error. A successful hash check is not a completed Zodiac checker, an audit, a
permission check or evidence of a product deployment. No Zodiac import or new
dependency is required. Ordinary tests use injected read-only clients, not a real
RPC.

Design and rules: [`docs/investigacion/10-scaffold-stable-agent.md`](../../docs/investigacion/10-scaffold-stable-agent.md).
