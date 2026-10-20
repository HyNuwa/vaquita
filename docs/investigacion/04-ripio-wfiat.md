# 04 · Ripio y wFIAT

## Qué son los wFIAT

Stablecoins locales emitidas por Ripio, 1:1 con la moneda real ("w" = wrapped). No son moneda de curso legal.

## Direcciones de los tokens

Misma dirección en Celo y en otras cadenas EVM. **Todos usan 18 decimales.**

| Token | País | Dirección | CoinGecko |
| --- | --- | --- | --- |
| wARS | Argentina | `0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d` | https://www.coingecko.com/en/coins/argentine-peso |
| wBRL | Brasil | `0xd76f5faf6888e24d9f04bf92a0c8b921fe4390e0` | https://www.coingecko.com/en/coins/brazilian-real |
| wMXN | México | `0x337e7456b420bd3481e7fa61fa9850343d610d34` | https://www.coingecko.com/en/coins/mexican-peso |
| wCOP | Colombia | `0x8a1d45e102e886510e891d2ec656a708991e2d76` | https://www.coingecko.com/en/coins/colombian-peso |
| wPEN | Perú | `0x4F34c8b3b5FB6D98Da888F0feA543d4d9C9F2eBE` | https://www.coingecko.com/en/coins/peruvian-sol |
| wCLP | Chile | `0x61D450a098b6a7f69fC4b98CE68198fe59768651` | https://www.coingecko.com/en/coins/chilean-peso |

> **Verificación.** Según el scaffold `stable-agent` (`src/config/tokens.ts`), el 17/10/2026 se cruzaron tres fuentes y coinciden: la página del hackathon (sección Ripio), Celopedia (`references/contracts.md`, que las marca "confirmadas onchain") y el brief del track. **docs.ripio.com/llms.txt no publica direcciones de tokens**, solo documenta la API B2B.
>
> Igual, antes de cada pago el código lee `symbol()` y `decimals()` onchain y aborta si no coinciden (`npm run preflight` lo chequea para los seis tokens). Las direcciones viven en configuración versionada con checksum EIP-55; nunca las genera el LLM.

Los wFIAT **no sirven para pagar gas**: ver fee currencies en [03-celo.md](03-celo.md).

## On/off-ramps

Dos formas de usar los ramps B2B de Ripio:

### 1. ramp.ripio.com con query params (lo más fácil para el hackathon)

- Sin credenciales. Armás una URL y mandás al usuario directo al flujo de Ripio.
- Rutas: `/` para on-ramp y `/offramp` para off-ramp.
- Si están `country`, `chain`, `token` y `amount`, el usuario saltea el formulario y va directo al flujo. Si no, los params solo precargan el formulario.
- `address` define la wallet de destino.
- Las redes y tokens disponibles dependen del país.
- Valor de `token`: solo `WARS` está confirmado por el ejemplo oficial. El resto (`WBRL`, `WMXN`, `WCOP`, `WPEN`, `WCLP`) sigue el mismo patrón, pero hay que probarlo antes de usarlo.

Ejemplo (on-ramp, wARS en Celo, Argentina):

```
https://ramp.ripio.com/?country=AR&chain=42220&token=WARS&amount=10000&address=0x...
```

### 2. Ramps API

- Docs: https://docs.ripio.com
- Onboarding en https://platform.ripio.com (due diligence + KYB).
- **Solo para empresas** (personas jurídicas), no para personas físicas.

## Bridge

- Dapp: https://bridge.ripio.com
- Integración para devs: https://bridge.ripio.com/developers
- Sirve para mover wFIAT entre cadenas.
