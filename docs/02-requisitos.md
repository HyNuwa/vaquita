# 02 · Requisitos

## Eliminatorios (todos los tracks)

Si falta alguno, el proyecto no califica.

- [ ] **Celo mainnet.** Solo cuenta lo que pasa ahí. Tener testnet en el repo está bien.
- [ ] **Tag de atribución ERC-8021** en el calldata de **cada** transacción, agregado en el cliente de la wallet (no en el contrato). Sin tag no se puede acreditar después. El tag (`celo_…`) lo da la skill de Loops House al registrarte.
- [ ] **Identidad ERC-8004.** El agente la registra desde su propia wallet antes del cierre (9/11/2026, 06:00 ART = 09:00 GMT).
- [ ] **Repo público en GitHub** desde la inscripción hasta el juzgamiento, con código escrito durante el hackathon.

Si un relayer paga el gas, hay que declararlo en la entrega (no cuenta como aporte del builder).

## Reglas que no se negocian (para nuestro agente)

- Solo Celo mainnet: chainId `42220`, RPC `https://forno.celo.org`. Testnet solo para pruebas locales.
- Mueve wFIAT real de Ripio (wARS, wBRL, wMXN…). Las direcciones de los tokens se verifican contra fuentes oficiales (ver [04-ripio-wfiat.md](04-ripio-wfiat.md)); el LLM nunca las inventa.
- Cada transacción lleva el tag ERC-8021 `celo_XXXXXXXX` como sufijo del calldata, agregado en el cliente de la wallet con `@celo/attribution-tags`. **Si falta el tag, la transacción no se manda.**
- El agente registra su identidad ERC-8004 desde su propia wallet antes del 9/11.
- El gas se paga en una stablecoin con fee abstraction de Celo.

## Datos que todavía faltan

- [ ] Tag de atribución propio (`celo_…`): se obtiene al registrarse en Loops House con la skill del hackathon.
