# @vaquita/bot

Telegram bot and LLM loop with tool use (`estado`, `cobrar`, `pagar_pozo`, `link_para_cargar`). Not started yet: see area 3 in [`docs/tareas/`](../../docs/tareas/README.md).

Rules for this app:
- It never builds or sends transactions: it calls `@vaquita/core` (`payments/`, `agent/tools`). CI fails if it uses `sendTransaction`, `writeContract` or a wallet client.
- The LLM only sees aliases, never addresses, and only proposes; the core decides.
- Every message to users in Rioplatense Spanish, amounts as `$ 1.234,50`, no crypto jargon.
- The Telegram bot token goes in the root `.env`, never in code.
- Library choices are pending in [`docs/proyecto/stack.md`](../../docs/proyecto/stack.md).
