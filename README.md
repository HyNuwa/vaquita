# La Vaquita

Agente que organiza la junta, la tanda o la vaca de tu grupo en pesos digitales (wARS de Ripio) sobre Celo: cobra a cada uno, paga el pozo a quien le toca y reparte la inflación de forma justa, con reglas que nadie, ni el agente, puede romper.

Proyecto para el hackathon **Agents on Open Rails** (Celo × Ripio), Track 1: Stable Agents LatAm.

## Estado

El código parte de un scaffold de pagos en wARS que ya cumple las reglas del hackathon (ver [docs/10](docs/10-scaffold-stable-agent.md)):

- Solo Celo mainnet (chainId 42220).
- Tag de atribución ERC-8021 en cada transacción; sin tag no se transmite.
- Gas pagado en USDC (fee abstraction, tx CIP-64).
- Límites determinísticos que el LLM no puede cambiar.
- Modo ensayo por defecto; pagos reales solo con `LIVE_PAYMENTS=si-muevo-plata-real`.
- Registro de identidad ERC-8004 desde la wallet del agente.

La lógica propia de La Vaquita (grupos, turnos, junta justa, mora, bot de Telegram) está por construirse.

## Uso

```bash
npm install
cp .env.example .env        # completar AGENT_PRIVATE_KEY, ATTRIBUTION_CODE, ALLOWED_RECIPIENTS
npm test                    # sin red; todo verde antes de tocar mainnet
npm run preflight           # solo lectura: red, tokens, saldos
npm run pago:primero -- prueba                                   # ensayo: 1 wARS
LIVE_PAYMENTS=si-muevo-plata-real npm run pago:primero -- prueba # real
npm run tx:verificar -- 0x<hash>                                 # confirmar el tag
```

## Documentación

Todo el contexto está en [`docs/`](docs/README.md):

- Hackathon, requisitos y stack: docs 01–07
- Scaffold técnico: doc 10
- Ideas evaluadas: docs 11–12
- La Vaquita (benchmark, modelo de negocio, junta justa): docs 13–15

## Skills para el coding agent

`.claude/skills/` incluye Celopedia (`npx skills add celo-org/celopedia-skills`).
