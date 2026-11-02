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

## Parte con fondos · pendiente

- [ ] Primer pago con etiqueta verificada.
- [ ] `approve` y `transferFrom` reales a través de un contrato.
- [ ] Etiqueta desde la wallet del celular.
- [ ] Conciliación por eventos y peor caso de gas con la lista completa.
