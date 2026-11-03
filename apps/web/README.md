# @vaquita/web

Campaign page per community (`/c/:slug`): offers, terms, progress and history. Buyers commit or cancel by signing in their own wallet. Full flow in [`docs/proyecto/spec.md`](../../docs/proyecto/spec.md). It should also serve `agent.json` over HTTPS for the ERC-8004 registration (template in [`public/agent.json`](../../public/agent.json)). Not started yet: see area 4 in [`docs/tareas/`](../../docs/tareas/README.md).

Rules for this app:
- It never holds keys. Buyer signatures leave from one file only, `src/lib/firmar.ts`, using the transaction the core built (D15.5).
- Browser code imports only pure core modules: no `.env` and no wallet clients.
- No addresses or crypto jargon in what users read; Rioplatense Spanish, amounts as `$ 1.234,50`.
- Stack (D15): Next.js on Vercel, RainbowKit, wagmi, viem and WalletConnect. See [`docs/proyecto/stack.md`](../../docs/proyecto/stack.md).
