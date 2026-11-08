# S1 · Contratos y fork

Viabilidad ya comprobada: ver [docs/pruebas/fondo.md](../../pruebas/fondo.md) y el script de referencia [`spike-fondo-fork.cjs`](../../pruebas/spike-fondo-fork.cjs). Esta parte lo convierte en código del repo.

## Dependencias

Ninguna nueva en el core. Foundry 1.8.7 ya es del proyecto: usar `anvil` de `ANVIL_BIN`, del `PATH` o de `~/.foundry/bin`.

`@gnosis-guild/zodiac` 5.0.1 exacta como `devDependency` del core, solo en `scripts/`, para `sanityCheckZodiacModuleAddress`. Si no se puede instalar o ejecutar, se anota en Bloqueos y queda como paso humano. La comparación de `codeHash` de esta spec sigue siendo obligatoria.

## `packages/core/src/config/fondo-contratos.ts`

Direcciones consultadas en las fuentes oficiales el 4/11/2026. Módulo sin `.env`, apto para el navegador.

| Clave | Dirección | `codeHash` | Fuente |
|---|---|---|---|
| `safeL2` | `0x29fcB43b46531BcA003ddC8FCB67FFE91900C762` | `0xb1f926978a0f44a2c0ec8fe822418ae969bd8c3f18d61e5103100339894f81ff` | safe-deployments 1.4.1 |
| `proxyFactory` | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` | `0x50c3cdc4074750a7a974204a716c999edd37482f907608d960b2b025ee0b3317` | safe-deployments 1.4.1 |
| `fallbackHandler` | `0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99` | `0x7c6007a5d711cea8dfd5d91f5940ec29c7f200fe511eb1fc1397b367af3c42f9` | safe-deployments 1.4.1 |
| `multiSendCallOnly` | `0x9641d764fc13c8B624c04430C7356C1C7C8102e2` | `0xecd5bd14a08c5d2122379900b2f272bdf107a7e92423c10dd5fe3254386c9939` | safe-deployments 1.4.1 |
| `rolesMastercopy` | `0xF2964CE6161ce0e75964Fe7927cE114cb0B283D5` | `0x471d8b3b419f1eb955230c0326c8812176df49bf3c7b414a563fda5a3c6c10b6` | Seguridad de Zodiac. Hash igual en Celo, Gnosis y Ethereum |
| `moduleFactory` | `0x000000000000aDdB49795b0f9bA5BC298cDda236` | `0x01623cbcf010a1c326230f1b2d5f48a66b440232ee49096102bc84967dc5f21e` | `@gnosis-guild/zodiac` 5.0.1. Hash igual en las tres redes |

**Límite de esta verificación:** para Safe, el hash coincide con el publicado por Safe. Para Roles y la fábrica no hay un hash publicado: se comprobó la dirección oficial y que el código es idéntico en tres redes, no una compilación propia del código fuente. Se declara así.

`DIRECCIONES_PROHIBIDAS`: Roles 2.1.0 `0x9646fDAD06d3e24444381f44362a3B0eB343D337` y Delay 1.1.0 `0x01F8cabB808D7dE0dF4202D4B60C8310d2f1339b`.

Exportar `contratosFondo(chainId)`, que lanza si `chainId !== 42220`, y `assertModuloPermitido(addr)`, que lanza si la dirección está prohibida.

## `packages/core/src/fondo/abis.ts`

ABI legibles, copiados del script de referencia.

**Roles es 2.1.1, no v3.** La rama `main` de `gnosisguild/zodiac-modifier-roles` es v3 desde octubre de 2026 y su API es otra: 2.1.1 no tiene `isMember`. La API válida es la del commit `557b17d5f0`:

```text
setUp(bytes)  // abi.encode(owner, avatar, target)
setAllowance(bytes32 key,uint128 balance,uint128 maxRefill,uint128 refill,uint64 period,uint64 timestamp)
scopeTarget(bytes32 roleKey,address target)
scopeFunction(bytes32 roleKey,address target,bytes4 selector,(uint8 parent,uint8 paramType,uint8 operator,bytes compValue)[] conditions,uint8 options)
assignRoles(address module,bytes32[] roleKeys,bool[] memberOf)
execTransactionWithRole(address to,uint256 value,bytes data,uint8 operation,bytes32 roleKey,bool shouldRevert)
allowances(bytes32) view returns (uint128 refill,uint128 maxRefill,uint64 period,uint128 balance,uint64 timestamp)
```

## `packages/core/src/chain/fork-sender.ts`

Único camino de envío para pruebas en fork. Vive en `chain/` porque la guarda de CI lo exige.

- Lanza salvo que el RPC sea `127.0.0.1` o `localhost`. Test con una URL pública.
- Agrega la etiqueta, firma con claves generadas en la prueba y usa una transacción común. **anvil 1.8.7 con `--celo` rechaza CIP-64** con `Invalid parameters`, así que CIP-64 no se prueba en fork.
- `packages/core/src/fondo/enviador.ts` elige entre `tagged-sender` y `fork-sender`: este último solo con `E2E_FORK=1` **y** RPC local. Si `LIVE_PAYMENTS` está definida, lanza. `apps/` usa ese selector, nunca `fork-sender` directo. Un test recorre `apps/` y falla si aparece.

## Arnés de fork

- `packages/core/vitest.fork.config.ts` y `packages/core/test-fork/`. `vitest.config` normal excluye `test-fork/`.
- `npm run fondo:fork`: levanta `anvil --fork-url <CELO_RPC_URL o forno> --celo --port <libre> --silent`, corre las pruebas y lo cierra, también si fallan.
- Cuentas: `generatePrivateKey()` en cada corrida, con `anvil_setBalance`. **No usar las cuentas por defecto de anvil:** sus direcciones tienen historia en mainnet y una transacción se quedó colgada por eso.
- Fondos: `anvil_dealERC20` funciona con wARS y USDC.
- Tiempo: `evm_increaseTime` seguido de `evm_mine`.

## `packages/core/scripts/verificar-contratos.ts`

`npm run fondo:contratos`, solo lectura contra `CELO_RPC_URL`:

1. `chainId` igual a 42220.
2. `keccak256(getCode)` igual a `codeHash` para las seis direcciones.
3. `sanityCheckZodiacModuleAddress` para `rolesMastercopy`, si la dependencia está.
4. Ninguna dirección prohibida en la configuración.
5. Imprime la tabla. Sale con 1 si algo no coincide.

## Separación del núcleo Web3

Los adaptadores de lectura y despliegue de contratos no utilizan PostgreSQL, sesiones ni el backend de La Vaquita. Las direcciones y los `codeHash` se verifican desde RPC incluso cuando la aplicación funciona en modo independiente. El manifiesto público y la recuperación se implementan en S2; esta parte no cambia custodia, versiones ni permisos de seguridad.

## Criterios de aceptación

| ID | Nivel | Debe pasar |
|---|---|---|
| S1-1 | CI | `contratosFondo(1)` lanza. `assertModuloPermitido` rechaza las dos versiones prohibidas |
| S1-2 | CI | `fork-sender` lanza con una URL pública |
| S1-3 | CI | Ningún archivo de `apps/` importa `fork-sender`; `enviador` rechaza el fork sin `E2E_FORK=1`, con RPC público o con `LIVE_PAYMENTS` |
| S1-4 | CI | Las direcciones de la tabla tienen checksum válido |
| S1-5 | Fork | Crear Safe y Roles, y leer dueño, avatar y target iguales al Safe, y umbral 2 |
| S1-6 | Fork | El código del proxy de Roles es `0x363d3d373d3d3d363d73` + mastercopy + `5af43d82803e903d91602b57fd5bf3` |
| S1-7 | Lectura | `npm run fondo:contratos` sale con 0 |
| S1-8 | Docs | `stack.md` y `docs/pruebas/fondo.md` actualizados |
