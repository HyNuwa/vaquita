# Stack tecnológico

Versiones tomadas de los `package.json` el 2026-10-18. Para sumar una librería fuera de esta lista, anotar la decisión en [decisiones.md](decisiones.md).

Estado: ✅ en uso · ⏳ pendiente de decidir.

## General

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 1 | Gestor de paquetes | **npm** con workspaces | 11 | ✅ |
| 2 | Node.js | **24** (mínimo 20) | — | ✅ Lo usa la CI |
| 3 | Lenguaje | **TypeScript**, ESM, `strict` + `noUncheckedIndexedAccess` | 7.0 | ✅ Config común en `tsconfig.base.json` |
| 4 | Ejecución de scripts | **tsx** | 4.23 | ✅ Sin build: se corre TypeScript fuente |
| 5 | Tests | **vitest**, sin red | 5.0 | ✅ El `ChainReader` se reemplaza por un fake |
| 6 | Validación | **zod** | 4.6 | ✅ |
| 7 | CI | **GitHub Actions** | — | ✅ `.github/workflows/ci.yml` |
| 8 | Lint y formato | — | — | ⏳ |

## `packages/core`

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 9 | Cliente de Celo | **viem** (tx CIP-64) | 2.57 | ✅ |
| 10 | Atribución ERC-8021 | **@celo/attribution-tags** | 0.5.0 (fija) | ✅ |
| 11 | Variables de entorno | **dotenv**, un solo `.env` en la raíz | 18.0 | ✅ |
| 12 | Persistencia del fondo | **PostgreSQL administrado** (D16.30) | Proveedor y plan gratuito a verificar | ⏳ El ledger de gasto sigue en `data/` |

## Fondo compartido (D16)

| Pieza | Elección | Versión | Estado |
|---|---|---|---|
| Control compartido | **Safe** (`SafeL2`, fábrica y `CompatibilityFallbackHandler`), contratos oficiales | 1.4.1 | ⏳ Sin probar. Direcciones en el [plan](plan-fondo-compartido.md#2-contratos-oficiales) |
| Permisos del agente | **Zodiac Roles** | **2.1.1**; 2.1.0 prohibida | ⏳ Sin probar |
| Configuración de permisos | SDK de Roles, solo para generar y revisar | Se fija al instalar | ⏳ |
| Comprobación de módulos | **`@gnosis-guild/zodiac`** (`sanityCheckZodiacModuleAddress`) | 5.0.1, a confirmar al instalar | ⏳ |
| Interacción con Safe | **viem**, sin SDK de Safe | La del core, fija | ⏳ |

## `contracts/` (en pausa por D16)

| Pieza | Elección | Versión | Estado |
|---|---|---|---|
| Contrato y fábrica `CompraColectiva` | **Solidity con Foundry**, fuzzing e invariantes; tests locales sin red | Solidity 0.8.30, Foundry 1.8.7, forge-std 1.17.0 | ⏳ Escrito y sin desplegar: el despliegue sigue condicionado al spike (D14) |
| Utilidades seguras | **OpenZeppelin: `SafeERC20` y `ReentrancyGuard`** | 5.6.1 | ✅ Fijada en [D14](decisiones.md) |

`contracts/` se escribe y se prueba en local desde D14; el despliegue se habilita cuando pase el spike. Segunda revisión antes de mainnet (D12.3). Diseño: [plan-compra-colectiva.md](plan-compra-colectiva.md).

## Cobro por x402 (D13.3)

| Pieza | Elección | Versión | Estado |
|---|---|---|---|
| Vendedor y comprador x402 | **`@x402/*`** (`core`, `evm`, middleware del servidor y `fetch`) | v2; se fija al instalar | ⏸️ En pausa por D16.17 |

`@celo/buy` no se instala salvo una decisión nueva (D13.5).

## `apps/bot`

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 13 | Librería de Telegram | — | — | ⏳ |
| 14 | LLM y SDK | — (las tools ya tienen el formato de tool use de la API de Claude) | — | ⏳ |
| 15 | Hosting del bot | — | — | ⏳ |

## `apps/web`

| # | Pieza | Elección | Versión | Estado |
|---|---|---|---|---|
| 16 | Framework | **Next.js** (D15.8) | 15.5.28 | ✅ |
| 17 | Hosting | **Vercel** (D5); tiene que servir `agent.json` por HTTPS para ERC-8004 | — | ⏳ Sin desplegar |
| 18 | Billetera de las personas | **RainbowKit, wagmi, viem y WalletConnect**; Valora primero, MetaMask de respaldo (D15.2) | RainbowKit 2.2.11, wagmi 2.19.5, viem 2.57.7 | ✅ Probada con MetaMask móvil |
| 19 | TypeScript de la web | **5.9**, solo en `apps/web`: Next 15 rechaza TypeScript 7 | 5.9.3 | ✅ El resto del repo sigue en 7 |
| 20 | QR de RainbowKit | **`qr` fijo y `cuer`**, con `overrides` en la raíz: `qr` 0.6 o mayor rechaza el borde en 0 que pide `cuer` y rompe el QR | qr 0.5.5, cuer 0.0.3 | ✅ |
