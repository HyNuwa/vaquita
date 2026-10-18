# 03 · Celo

## La red

- L2 de Ethereum desde el 26/03/2025 (OP Stack).
- Bloques de ~1 segundo.
- Gas promedio ~US$ 0,0005. Ejemplo: 1.000 tx/mes ≈ US$ 0,50.
- **Mainnet:** chainId `42220`, RPC `https://forno.celo.org`.

### Números para el pitch

- 20M+ wallets MiniPay.
- USD 6.200M de volumen mensual en stablecoins.
- 450K+ usuarios activos por día.
- 32 stablecoins globales.

## Piezas del stack que suman en la evaluación

| Pieza | Qué es | Para qué nos sirve |
| --- | --- | --- |
| **ERC-8021** | Tag de atribución como sufijo del calldata | **Obligatorio.** Así verifican que la tx es nuestra. Librería: `@celo/attribution-tags` |
| **ERC-8004** | Identidad onchain de agentes | **Obligatorio.** El agente se registra desde su propia wallet |
| **Fee abstraction** | Pagar gas con stablecoins (USD₮, USDC, USDm) en vez de CELO | El usuario no necesita tener CELO; también suma puntos |
| **x402** | Pagos por HTTP (el agente paga o cobra por un request) | Suma en "uso del stack". El facilitador de Celo liquida wARS, wBRL y wCOP (Permit2); wMXN y wPEN todavía no. **Las liquidaciones x402 no llevan tag ERC-8021**: se declara la wallet PayTo |
| **MiniPay** | Wallet de Celo con 20M+ usuarios | **No soporta wFIAT** (solo USDT, USDC, USDm). No sirve como canal para mover wARS |

## Contratos en mainnet

Datos tomados del scaffold `stable-agent` ([10-scaffold-stable-agent.md](10-scaffold-stable-agent.md)), que los marca como verificados el 17/10/2026 contra docs.celo.org.

### ERC-8004 (docs.celo.org/build/agents/8004)

| Registro | Dirección |
| --- | --- |
| Identity Registry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| Reputation Registry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

- `register(agentURI)` mintea un NFT a `msg.sender` y fija `agentWallet = msg.sender`. Por eso **se registra desde la wallet del agente**.
- `agentURI` apunta a un JSON de registro (`type: https://eips.ethereum.org/EIPS/eip-8004#registration-v1`) con nombre, descripción, servicios, `x402Support`, etc.
- El `agentId` se lee del evento `Registered`.

### Fee currencies (fee abstraction, CIP-64)

Fuente: docs.celo.org/build/tools/contracts/fee-currencies.

| Moneda | Token | Valor de `feeCurrency` en la tx | Decimales del token |
| --- | --- | --- | --- |
| USDC | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` | `0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B` (adapter) | 6 |
| USDT | `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` | `0x0E2A3e05bc9A16F5292A6170456A710cb89C6f72` (adapter) | 6 |
| USA₮ | `0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771` | `0x0357EE22278c922e1D36cFe6b899269b161880C4` (adapter) | 6 |
| USDm | `0x765DE816845861e75A25fCA122bb6898B8B1282a` | la misma dirección del token | 18 |

Detalles que importan:

- **Los wFIAT de Ripio NO son fee currency.** La wallet del agente necesita unos centavos de USDC/USDT/USDm aparte de los pesos.
- Para tokens de 6 decimales, `feeCurrency` lleva la dirección del **adapter**, no la del token. `balanceOf()` sobre el adapter devuelve 18 decimales.
- La tx es de tipo CIP-64 (`0x7b`). En Celo, `eth_gasPrice` y `eth_maxPriorityFeePerGas` aceptan la fee currency como parámetro.

## Atribución ERC-8021

- Docs: https://docs.celo.org/build/agents/attribution-tags · repo: https://github.com/celo-org/attribution-tags
- `@celo/attribution-tags` expone `toDataSuffix`, `fromDataSuffix`, `verifyTx` y `codeFromRepo`.
- El sufijo va al final del calldata. La EVM ignora los bytes extra, así que el `transfer` se ejecuta igual, y los indexers del hackathon leen el sufijo.
- Formato válido de código para el SDK: `/^[a-z0-9_]{1,32}$/`. El del hackathon empieza con `celo_`.

## Explorer

- Tx: `https://celoscan.io/tx/<hash>` · Dirección: `https://celoscan.io/address/<addr>`

## Ideas clave

- Los agentes no pueden abrir una cuenta bancaria, pero sí tener una wallet.
- x402 = pagos por HTTP. ERC-8004 = identidad de agentes.
- Fuente de verdad técnica: la skill Celopedia (`npx skills add celo-org/celopedia-skills`).
