# 10 · Scaffold existente: `stable-agent`

El proyecto base (TypeScript + viem) está copiado en la raíz de este repo (`src/`, `scripts/`, `test/`); el original vino de `stable-agent-latam/stable-agent`. Implementa las reglas del hackathon y el primer hito (mover 1 wARS con tag). **Todavía no tiene idea de producto:** el README tiene la línea "Idea" sin completar, y el agente solo sabe pagar wARS a contactos de una lista.

Sirve como base técnica para cualquier idea que salga del brainstorming: la idea define qué herramientas ve el LLM y qué flujos hay, y la tubería de transacciones se reutiliza tal cual.

## Stack

- Node ≥ 20, TypeScript, ESM.
- `viem` (cliente Celo, tx CIP-64), `@celo/attribution-tags` 0.5.0, `zod`, `dotenv`.
- Tests con `vitest`, **sin red** (el `ChainReader` se reemplaza por un fake). Según el README son 87 tests.

## Estructura

```
src/
  config/      network.ts · tokens.ts · policy.ts · env.ts
  attribution/ tag.ts                        ← ERC-8021
  policy/      engine.ts · ledger.ts         ← límites determinísticos + gasto diario
  chain/       reader.ts · tagged-sender.ts  ← único camino a la red
  payments/    pay.ts · messages.ts          ← flujo de pago + textos para el usuario
  money/       amounts.ts · fx.ts            ← pesos ↔ unidades, formato es-AR
  identity/    erc8004.ts
  ramp/        ripio.ts                      ← links a ramp.ripio.com
  agent/       tools.ts                      ← lo único que ve el LLM
scripts/       preflight · send-first-wars · register-agent · ramp-link · verify-tx
test/          amounts · attribution · env · payment · policy · ramp-identity-tools
public/        agent.json (plantilla de registro ERC-8004)
```

## Cómo cumple cada regla

| Regla | Dónde se garantiza |
| --- | --- |
| Solo Celo mainnet (42220) | `assertMainnet()` antes de firmar + chainId re-chequeado en la tx firmada |
| wFIAT real, direcciones verificadas | `src/config/tokens.ts` + lectura de `symbol()`/`decimals()` onchain antes de cada pago |
| Tag ERC-8021 en cada tx, en el cliente | `tagged-sender.ts`: agrega el sufijo con `@celo/attribution-tags` y **parsea la tx firmada** para verificarlo. Sin tag no se transmite |
| Gas en stablecoin | Tx CIP-64 (tipo `0x7b`) con `feeCurrency` = adapter de USDC por defecto |
| Límites que el LLM no puede cambiar | `src/config/policy.ts` (congelado) + `src/policy/engine.ts` (funciones puras) |
| Destinatarios permitidos | El LLM solo elige un **alias** de `ALLOWED_RECIPIENTS`; nunca escribe direcciones |
| Dry-run por defecto | Real solo con `LIVE_PAYMENTS=si-muevo-plata-real` (frase exacta) |
| Claves fuera del repo | `.env` en `.gitignore`; `.env.example` sin secretos |
| Identidad ERC-8004 desde la wallet del agente | `scripts/register-agent.ts`, por la misma tubería con tag |

## Tubería de transacciones (`tagged-sender.ts`)

Es el único camino a la red; nada llama a `sendTransaction` de viem directo.

1. `chainId === 42220`, o se corta.
2. Calldata + sufijo ERC-8021, verificado.
3. `estimateGas` con el calldata ya taggeado y con `feeCurrency`.
4. Costo máximo de gas ≤ tope de la política (0,05 USD) y ≤ saldo de la fee currency.
5. Firma local de una tx CIP-64 con `feeCurrency`.
6. Se **parsea la tx firmada** y se vuelven a verificar tag, chainId, feeCurrency y destino.
7. Dry-run → devuelve la tx firmada sin transmitir. Real → `sendRawTransaction`, espera el receipt y verifica el tag onchain con `verifyTx`.

## Política por defecto (`src/config/policy.ts`)

- Zona horaria del "día": `America/Argentina/Buenos_Aires`.
- wARS: máximo **$5.000 por pago**, presupuesto de **$20.000 por día**, máximo **20 pagos por día**.
- Tope de gas: 0,05 USD por tx.
- El ledger (`data/ledger.json`) **reserva** el monto antes de transmitir y lo libera si la tx falla; los ensayos no se registran.

## Superficie del LLM (`src/agent/tools.ts`)

Una sola herramienta, `pagar` (formato tool use de la API de Claude):

- `destinatario`: enum cerrado de alias.
- `monto`: string canónico en pesos (`"1500.50"`). Se rechazan `"1.500"` y `"1,5"` a propósito, porque el punto y la coma cambian de significado según el país.
- `motivo`: hasta 140 caracteres.

No tiene campos de red, gas, dirección de token ni límites. **Todavía no hay loop del agente ni canal** (WhatsApp, Telegram, web): eso depende de la idea.

## UX ya resuelta

- Montos formateados en moneda local (`$ 1.234,50`).
- Mensajes de rechazo en lenguaje llano ("No te alcanza el saldo…", "Superás tu presupuesto de hoy…").
- Costo de red mostrado en pesos vía CoinGecko, **solo para mostrar**. Si no hay cotización, no inventa un número.

## Variables de entorno (`.env.example`)

| Variable | Qué es |
| --- | --- |
| `AGENT_PRIVATE_KEY` | Clave de la wallet **del agente** (no la personal). Registra también la identidad ERC-8004 |
| `ATTRIBUTION_CODE` | Código `celo_…` de Loops House. En modo real rechaza placeholders |
| `GITHUB_REPO` | Opcional. Avisa si `codeFromRepo(repo)` no coincide con el código |
| `CELO_RPC_URL` | Default `https://forno.celo.org`; debe ser https |
| `FEE_CURRENCY` | `USDC` (default), `USDT`, `USAT` o `USDm` |
| `ALLOWED_RECIPIENTS` | `alias:0x…` separados por coma |
| `LIVE_PAYMENTS` | Vacío = ensayo. `si-muevo-plata-real` = real |
| `AGENT_URI` | URL https del `agent.json` publicado (para ERC-8004) |

## Scripts

```bash
npm install
cp .env.example .env        # completar AGENT_PRIVATE_KEY, ATTRIBUTION_CODE, ALLOWED_RECIPIENTS
npm test                    # todo verde antes de tocar mainnet
npm run ramp:link -- 1000   # link de Ripio para cargar pesos en la wallet del agente
#   + cargar ~0,10 USDC en la misma wallet para el gas
npm run preflight           # solo lectura: red, tokens, saldos, días al cierre
npm run pago:primero -- prueba                                   # ensayo
LIVE_PAYMENTS=si-muevo-plata-real npm run pago:primero -- prueba # real: $1
npm run tx:verificar -- 0x<hash>                                 # confirmar el tag
npm run identidad:registrar                                      # ERC-8004 (ensayo / real)
```

## Registro ERC-8004 (`scripts/register-agent.ts`)

1. Completar `public/agent.json` (nombre, descripción, imagen, endpoint web) y publicarlo en una URL https → `AGENT_URI`.
2. `npm run identidad:registrar` en ensayo; después en real.
3. `register(agentURI)` mintea un NFT a `msg.sender` y fija `agentWallet = msg.sender`: por eso se firma desde la wallet del agente.
4. Agregar `{ agentId, agentRegistry: "eip155:42220:<IdentityRegistry>" }` a `registrations` en `agent.json` y volver a publicarlo.

## Lo que falta (depende de la idea)

- [ ] Completar la línea "Idea" del README y `public/agent.json`.
- [ ] Loop del agente (LLM + herramientas) y canal de usuario.
- [ ] Herramientas propias de la idea (cobrar, ahorrar, dividir, etc.) y otros wFIAT además de wARS.
- [ ] x402 y MiniPay si la idea los usa (`x402Support` está en `false`).
- [ ] Probar `rampToken` para monedas distintas de wARS.
- [ ] Menor: el comentario de `src/attribution/tag.ts` menciona `src/chain/signer.ts`, pero el archivo real es `src/chain/tagged-sender.ts`.
