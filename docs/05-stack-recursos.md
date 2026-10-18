# 05 · Stack y recursos

## Herramientas

| Recurso | Para qué | Cómo |
| --- | --- | --- |
| **Celopedia** | Skill oficial de Celo para el coding agent | `npx skills add celo-org/celopedia-skills` |
| **Skill del hackathon + tag** | Registro en Loops House y tag de atribución `celo_…` | https://www.loops.house/agents-on-open-rails |
| **@celo/attribution-tags** | Agregar el tag ERC-8021 al calldata | Librería npm |
| **eve (Vercel)** | Agentes como carpetas, deploy en Vercel (Node 24+) | `npx eve@latest init mi-agente` · https://eve.dev |
| **Ripio Ramp** | On/off-ramp en moneda local por URL, sin credenciales | https://ramp.ripio.com |
| **Ripio Bridge** | Mover wFIAT entre cadenas | https://bridge.ripio.com · /developers |

## Documentación de Celo

- Atribución ERC-8021: https://docs.celo.org/build/agents/attribution-tags · https://github.com/celo-org/attribution-tags
- ERC-8004: https://docs.celo.org/build/agents/8004
- Fee abstraction: https://docs.celo.org/build/fee-abstraction/overview
- Fee currencies: https://docs.celo.org/build/tools/contracts/fee-currencies
- Celopedia: https://github.com/celo-org/celopedia-skills

## Código base

Scaffold `stable-agent` (TypeScript + viem) con la tubería de transacciones ya resuelta: ver [10-scaffold-stable-agent.md](10-scaffold-stable-agent.md).

## Contexto para el coding agent

- https://docs.ripio.com/llms.txt (Ripio · wFIAT)
- https://eve.dev/llms.txt (eve)

## Ayuda

- **Telegram:** https://t.me/realworldagentshackathon (responde DevRel de Celo)
- **Office hours:** jueves 9:00 (hora ARG)

## Recordatorio

Siempre verificar las direcciones oficiales de los tokens; no dejar que el LLM las invente.
