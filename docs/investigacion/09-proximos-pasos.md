# 09 · Próximos pasos

Límite: **lunes 9/11/2026, 06:00 (hora ARG)**.

## Setup

- [ ] Registrarse en Loops House
- [ ] Obtener el tag `celo_…`: se emite al inscribirse en Loops House (requiere login, no hay instalador de skill)
- [x] Instalar Celopedia (`npx skills add celo-org/celopedia-skills`, en `.claude/skills/`)
- [ ] Sumarse al Telegram: https://t.me/realworldagentshackathon

## Idea y repo

- [x] Elegir idea y track: **La Vaquita**, Track 1 (docs 13–15; antes Mesada, doc 12)
- [ ] Decidir: fórmula de junta justa, mecanismo de mora, custodia (wallet del agente o escrow), ciclo corto para la demo (doc 13 §5)
- [ ] Conseguir 3–5 grupos reales para arrancar el primer ciclo antes del 1/11
- [ ] Probar el off-ramp de Ripio con wARS en Celo
- [x] Crear el repo público `vaquita`: https://github.com/HyNuwa/vaquita
- [ ] Completar el prompt base ([07-prompt-base.md](07-prompt-base.md)) y arrancar el coding agent

## Mainnet (con el scaffold, ver [10-scaffold-stable-agent.md](10-scaffold-stable-agent.md))

- [x] Direcciones de los wFIAT cruzadas en tres fuentes (lo hizo el scaffold)
- [ ] `npm test` en verde
- [ ] Crear la wallet del agente, cargar wARS (`npm run ramp:link`) y ~0,10 USDC para gas
- [ ] `npm run preflight` en verde
- [ ] Primera transacción real: `npm run pago:primero` (1 wARS con tag, gas en USDC) y `npm run tx:verificar`
- [ ] Publicar `agent.json` y registrar la identidad ERC-8004 (`npm run identidad:registrar`)

## Entrega

- [ ] Conseguir usuarios reales en LatAm
- [ ] Definir el camino de crecimiento post-hackathon
- [ ] Declarar si un relayer paga el gas
- [ ] Entregar antes del lunes 9/11, 06:00 ART
