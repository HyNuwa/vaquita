# @vaquita/web

Public, read-only status page for each vaquita (members, rounds, who paid, who gets the pot next). It should also serve `agent.json` over HTTPS for the ERC-8004 registration (template in [`public/agent.json`](../../public/agent.json)). Not started yet: see area 4 in [`docs/tareas/`](../../docs/tareas/README.md).

Rules for this app:
- Read-only: it never signs or sends transactions.
- No addresses or crypto jargon in what users read; Rioplatense Spanish, amounts as `$ 1.234,50`.
- Framework and hosting are pending in [`docs/proyecto/stack.md`](../../docs/proyecto/stack.md).
