# Spike de wARS

Se reproduce con `npm run spike:lectura`. No transmite nada y firma con una clave descartable.

## Parte sin fondos · 2026-11-02 · hecha

Contra wARS real en Celo mainnet, con simulaciones (`eth_call`):

| Pregunta | Resultado |
|---|---|
| ¿Está pausado? | No |
| ¿Es actualizable? | Sí, proxy EIP-1967. Implementación: `0xba0030bba7112171a8a5bcc417ee1994051321b9` |
| ¿Acepta `permit`? | Sí, en simulación con firma real |
| ¿Dominio de la firma? | `name` "Peso Argentino", `version` "1". No tiene `version()`: sale de `eip712Domain()` y reproduce `DOMAIN_SEPARATOR` |
| ¿Ignora el tag al final del calldata? | Sí, `approve` da el mismo resultado con y sin tag |
| ¿Se lee el motivo de un `transferFrom` fallido? | No, revierte sin motivo legible |

**Para el contrato:** como el revert no dice el motivo, la falta de saldo de D11.4 se comprueba con `balanceOf` y `allowance`, no leyendo el error.

Una simulación no es una transacción: esto no reemplaza la parte con fondos.

## Primer pago · 2026-11-02 · hecho

| Dato | Valor |
|---|---|
| Comprobante | [`0xad963fb9fe7feb93e82c380fb642eaeff35409d7f5d667d6b82bcb23e03fc1a0`](https://celoscan.io/tx/0xad963fb9fe7feb93e82c380fb642eaeff35409d7f5d667d6b82bcb23e03fc1a0) |
| Estado | Confirmada en el bloque 81729367 |
| Monto | 1 wARS, de la wallet del agente `0x1F1Cd124f456eecA90d8cb44BACB3Da031cC4170` a una segunda wallet del equipo |
| Etiqueta | `celo_c3121001b7ca`, leída de la cadena con `npm run tx:verificar` |
| Gas | Pagado en USDT por fee abstraction: el saldo bajó de 1 a 0,997785 USDT |

Es un pago entre wallets del mismo dueño: prueba la tubería, no cuenta como usuario independiente.

## Identidad ERC-8004 · 2026-11-02 · hecho

Vaqui quedó registrado desde la wallet del agente con `agentId` 10026.

- Transacción: [`0x11a82c1ca5ae37c67b7294264571352d016cc518a68d7e1f0148b41356eb058b`](https://celoscan.io/tx/0x11a82c1ca5ae37c67b7294264571352d016cc518a68d7e1f0148b41356eb058b), estado `success`.
- Etiqueta `celo_c3121001b7ca`, comprobada con `tx:verificar`.
- Tarjeta: [`public/agent.json`](https://raw.githubusercontent.com/HyNuwa/vaquita/staging/public/agent.json).

## Compra real por contrato · 2026-11-02 · hecha

Una compra de $ 1 contra wARS real en Celo mainnet, con la wallet del agente como única compradora y una segunda wallet del equipo como proveedor. Se reproduce con `npm run spike:contrato`.

- Fábrica de prueba: [`0xD0D4d7045e0025caCBEc3ea91de581059b282401`](https://celoscan.io/address/0xD0D4d7045e0025caCBEc3ea91de581059b282401)
- Campaña: [`0x803bcbBD2E99f4e71bdE806F83aD3d9aC03B1B99`](https://celoscan.io/address/0x803bcbBD2E99f4e71bdE806F83aD3d9aC03B1B99)

| Paso | Transacción | Gas usado |
|---|---|---|
| Desplegar fábrica | [`0x5ded146a…`](https://celoscan.io/tx/0x5ded146a527d15e9b42801d241781f7f97354a394e22f4c5800b52bb5548e6c3) | 2.258.362 |
| Crear campaña | [`0xc1cbe4cf…`](https://celoscan.io/tx/0xc1cbe4cfe0f920e155d40c68effceb3dc35c1b7448197970f97569d929fece98) | 1.524.943 |
| Autorizar importe exacto | [`0x747a5c66…`](https://celoscan.io/tx/0x747a5c668b533a69ee859c791a433d0b97402bfec24d44510a3679754bef40a6) | 136.945 |
| Comprometerse | [`0x7c1326e4…`](https://celoscan.io/tx/0x7c1326e4e7610479f7b9c9327a6793e41f0e0bfc3d34f8928f273f5a8911e62e) | 148.567 |
| Ejecutar compra | [`0xc72596da…`](https://celoscan.io/tx/0xc72596da90790d7ba9974de0312c7e54d3591804c4b959b01b7710b93881c40b) | 204.630 |

Comprobado después, leyendo la cadena:

- Las cinco transacciones salieron bien y llevan la etiqueta `celo_c3121001b7ca`.
- El comprador pagó $ 1 y el proveedor cobró $ 1, comparando saldos antes y después del bloque de la ejecución.
- La autorización quedó en cero, la campaña no guarda plata y figura ejecutada.
- La compra quedó descontada del presupuesto diario.

**Costo:** el saldo de USDT bajó de 0,997785 a 0,931694, es decir 0,066 USDT sumando esta compra y el registro ERC-8004.

**Qué no prueba:** es un solo comprador, de una wallet del equipo, así que no cuenta como usuario independiente. No cubre varios compradores, exclusiones, `permit` ni la firma desde el celular.

**Para el peor caso:** comprometerse costó 148.567 de gas contra 60.986 en el test con token doble, así que los números de Foundry se quedan cortos en la red. Al precio del 2/11, el tope de 0,20 USD (D14.5) alcanza hasta unos 5,8 M de gas estimado. Con 50 compradores, eso deja unos 116 mil por comprador. Una sola compra no alcanza para saber si la ejecución entra: hay que medirlo con varios compradores.

Nota: la primera corrida frenó después de desplegar porque el RPC respondió vacío justo tras confirmar, y sin mover wARS. La fábrica estaba bien; el script ahora espera 8 segundos tras cada confirmación y se retomó sin firmar de nuevo lo ya hecho.

## Firma desde el celular · 2026-11-03 · hecha

Autorización de $ 0 sobre wARS, armada por el core y firmada en MetaMask móvil con WalletConnect, desde `/prueba-firma`. Es una prueba técnica (D15.2).

- Transacción: [`0x4dc1fa54…`](https://celoscan.io/tx/0x4dc1fa5449b0366f3b7af9666fe9d94fa540c3616b23424ebfc284b031ac041a), confirmada y con 31.973 de gas.
- Etiqueta: `npm run tx:verificar` devuelve `celo_c3121001b7ca`. MetaMask conservó el sufijo.
- Comisión: transacción común (tipo 2), pagada en CELO. Es lo esperado: MetaMask ignora `feeCurrency`.

**Qué no prueba:**

- La firmante fue la wallet del agente (`0x1F1C…4170`), así que no cuenta como comprador independiente.
- No prueba Valora, que sigue siendo la primera opción del comprador, ni su moneda de comisión.
- No cubre una autorización mayor a cero ni `comprometer()` desde el celular.
- No confirma que el leaderboard la acredite: solo que la etiqueta está en la cadena.

## Parte con fondos · pendiente

Se ensaya con `npm run spike:contrato -- <alias>` y se lanza con `LIVE_PAYMENTS=si-muevo-plata-real`. Hace falta `forge build` antes. Recorre una compra real de $ 1 con la wallet del agente como única compradora. Si se corta, retoma donde quedó; con `revocar` al final deja en cero la autorización de una campaña sin ejecutar.

- [x] Primer pago con etiqueta verificada: ver arriba.
- [x] `approve` y `transferFrom` reales a través de un contrato: ver arriba.
- [x] Conciliación por eventos y saldos: ver arriba.
- [x] Etiqueta desde la wallet del celular, con MetaMask: ver arriba.
- [ ] Etiqueta desde Valora, la primera opción del comprador (D15.2).
- [ ] Peor caso de gas con varios compradores.
