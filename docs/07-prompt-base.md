# 07 · Prompt base para el coding agent

Antes de usarlo:

1. ~~Reemplazar la línea **Idea**~~: ya completada con La Vaquita (ver [13](13-vaquita-benchmark-y-mejoras.md), [14](14-vaquita-modelo-de-negocio.md) y [15](15-que-cambia-con-la-vaquita.md)).
2. Reemplazar `celo_XXXXXXXX` por el tag real de Loops House.
3. Tener instalada la skill de Celopedia y pasarle docs.ripio.com/llms.txt y eve.dev/llms.txt como contexto.

```
Vamos a construir un agente para el hackathon Agents on Open Rails (Celo × Ripio), Track 1: Stable Agents LatAm.

Idea: La Vaquita, un agente en el chat de Telegram del grupo que organiza juntas, tandas y vacas en pesos digitales (wARS): cobra a cada uno, paga el pozo a quien le toca con la fórmula de "junta justa" indexada por inflación, y aplica reglas de mora (pozo completo o devolución + fondo de garantía) que nadie puede romper. (Detalle en docs/13, 14 y 15)

Reglas que no se negocian:
- Solo Celo mainnet (chainId 42220, RPC https://forno.celo.org). Testnet solo para pruebas locales.
- Mueve wFIAT real de Ripio (wARS, wBRL, wMXN…). Verificá las direcciones oficiales de los tokens con la skill de Celopedia y docs.ripio.com/llms.txt; no las inventes.
- Cada transacción lleva el tag de atribución ERC-8021 [celo_XXXXXXXX] como sufijo del calldata, agregado en el cliente de la wallet (no en el contrato), con @celo/attribution-tags. Si falta, la transacción no se manda.
- El agente registra su identidad ERC-8004 desde su propia wallet antes del 9/11.
- El gas se paga en una stablecoin con fee abstraction de Celo.

Diseño:
- El LLM decide qué hacer; los límites (topes por pago, presupuesto diario, destinatarios permitidos) son código determinístico que el agente no puede cambiar.
- Montos siempre en la moneda local del usuario. UX para alguien que nunca usó cripto.
- Modo ensayo (dry-run) por defecto; pagos reales solo con una variable explícita.
- Claves en .env, nunca en el repo.

Empezá proponiendo la estructura del repo y el primer paso que mueva 1 wARS real con el tag, y escribí tests antes de tocar mainnet.
```
