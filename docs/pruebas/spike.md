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

## Parte con fondos · pendiente

- [x] Primer pago con etiqueta verificada: ver abajo.
- [ ] `approve` y `transferFrom` reales a través de un contrato.
- [ ] Etiqueta desde la wallet del celular.
- [ ] Conciliación por eventos y peor caso de gas con la lista completa.
