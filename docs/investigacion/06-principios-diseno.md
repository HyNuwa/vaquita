# 06 · Principios de diseño

## El agente

- **El LLM decide qué hacer; los límites son código determinístico** que el agente no puede cambiar:
  - tope por pago,
  - presupuesto diario,
  - destinatarios permitidos (allowlist).
- Las direcciones de tokens y contratos salen de configuración verificada, nunca del LLM.
- Ninguna transacción sale sin el tag ERC-8021. Es una validación en el cliente de la wallet, no una sugerencia al modelo.

## El usuario

- Montos siempre en la **moneda local** del usuario (pesos, reales…), nunca en "wei" ni en "tokens".
- UX para alguien que **nunca usó cripto**. Preferir canales que ya usa (WhatsApp, Telegram, MiniPay).

## Seguridad y operación

- **Dry-run por defecto.** Pagos reales solo con una variable explícita (ej. `LIVE_PAYMENTS=true`).
- Claves en `.env`, **nunca en el repo** (`.env` en `.gitignore`, con `.env.example` sin secretos).
- Gas pagado en stablecoin con fee abstraction de Celo.

## Forma de trabajo

- Tests antes de tocar mainnet.
- **Primer hito:** mover 1 wARS real con el tag en Celo mainnet.
- No todo necesita blockchain: usarla donde haga falta mover plata o guardar registros sin intermediario.
