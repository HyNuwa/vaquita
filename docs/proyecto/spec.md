# La Vaquita: spec de la entrega

> Un agente que junta la demanda de comunidades tech de LatAm, consigue que los proveedores compitan y ejecuta la compra en pesos digitales sin custodiar la plata.

**Para:** entrega de Agents on Open Rails, Track 1 (Stable Agents: LatAm). **Red:** Celo mainnet (42220). **Fecha:** 2026-11-03. **Estado:** contrato probado con una compra real de $ 1; web y bot sin empezar.

Esta spec resume lo que se construye y en qué orden. Si algo contradice a otro documento, mandan [decisiones.md](decisiones.md) para las decisiones y [control-entrega.md](../tareas/control-entrega.md) para fechas y recortes. El detalle del contrato está en [plan-compra-colectiva.md](plan-compra-colectiva.md).

## 1. Problema

Una comunidad que compra junta consigue mejor precio, pero organizar esa compra tiene dos trabas:

1. **Coordinar.** Alguien tiene que pedir cotizaciones, compararlas, reclamar respuestas y perseguir a cada persona.
2. **Confiar.** Hoy alguien junta la plata y paga. Esa persona carga con el riesgo, y los demás confían en ella.

## 2. Solución en una frase

La comunidad publica qué necesita, el agente consigue y compara ofertas, la comunidad vota, y cada comprador firma su compromiso desde su billetera. Si se llega al cupo, un contrato cobra a cada uno y le paga directo al proveedor en una sola transacción. Si no se llega, nadie paga.

## 3. Experiencia

| Paso | Qué ve la persona | Qué pasa por debajo |
|---|---|---|
| 1 | En Telegram, la comunidad cuenta qué necesita: "10 entradas al evento, hasta $ 5.000 cada una, antes del 20" | El agente arma la intención y prepara los pedidos de cotización. Si no hay canal permitido, los manda un humano |
| 2 | Ofertas comparadas y una votación | El LLM resume. El código compara los importes y **la comunidad elige**, nunca el agente |
| 3 | Página `/c/:slug` con qué se compra, a quién, cuánto cuesta, fecha límite y cuántos faltan | Lee los términos y los eventos del contrato |
| 4 | "Conectá tu billetera", con Valora primero | RainbowKit y WalletConnect. Se leen el saldo en pesos y lo disponible para la comisión |
| 5 | Si faltan pesos: "Cargar pesos" | Link a Ripio Ramp con país, red, token, importe y dirección del comprador |
| 6 | "Te comprometés por $ 1.234,50. La plata queda en tu billetera hasta que se ejecute la compra" | Dos firmas: autorización del importe exacto y `comprometer()`. Ambas con etiqueta |
| 7 | Progreso de la campaña. Antes de la fecha, "Cancelar mi compromiso" | `cancelarCompromiso()`, irreversible en esa campaña. No se muestra como cancelado hasta que se confirme |
| 8 | "Se hizo la compra: pagaste $ 1.234,50" | El loop simula y llama a `ejecutar()` desde la wallet del agente |
| 9 | Si no se llegó al mínimo: "No se juntó el cupo. Nadie pagó" | `vencer()` no mueve fondos |
| 10 | El proveedor confirma la entrega; la bitácora muestra cada acción del agente con su motivo | El pago no prueba la entrega: se registra aparte, con evidencia |

Sin "gas", direcciones ni "calldata" en lo que lee la persona. Todos los montos van como `$ 1.234,50`.

**Lo que esta versión todavía pide:** tener una billetera y saldo para la comisión. Se lo decimos claro al comprador y en el pitch. La blockchain invisible queda para después del hackathon (D15.7).

## 4. Arquitectura

```text
Telegram (bot + LLM)            Web /c/:slug (Next.js en Vercel)
  propone, resume, recuerda       RainbowKit + wagmi + WalletConnect
        |                            |  el comprador firma en SU billetera
        |                            |  lib/firmar.ts: único archivo que envía (D15.5)
        v                            v
packages/core  <---- arma { to, data + etiqueta } para el comprador
  compra/: reglas, selección, estado desde eventos, loop
  chain/tagged-sender.ts: lo que manda la wallet del agente (CIP-64)
        |
        v
Celo mainnet
  FabricaCompraColectiva -> CompraColectiva (una por campaña, sin admin)
  wARS (Ripio)   ERC-8004 (Vaqui, agentId 10026)

Ripio Ramp: link que lleva pesos a wARS en la wallet del comprador
```

Quién firma qué:

| Quién | Qué firma | Quién paga la comisión |
|---|---|---|
| Comprador | Autorización, `comprometer()`, `cancelarCompromiso()` | El comprador, en la moneda que resuelva su billetera (D15.4) |
| Comunidad, desde la web | `createCampaign` | Quien firma |
| Wallet del agente | `ejecutar()` y registro ERC-8004, por `tagged-sender.ts` | El agente, en USDC o USD₮ por CIP-64 |

La página nunca recibe claves. El bundle del navegador solo importa del core módulos puros, sin `.env` ni cliente de wallet.

## 5. Contrato

Sin cambios (D15.1). `CompraColectiva` y su fábrica, sin admin ni actualizaciones:

- **Comprometer:** `comprometer()` exige autorización exacta previa. `comprometerConPermit()` hace las dos cosas en una transacción.
- **Cancelar:** `cancelarCompromiso()`, irreversible en esa campaña.
- **Ejecutar:** `ejecutar()` lo puede llamar cualquiera antes del límite. Cobra y paga en una sola transacción.
- **Vencer:** `vencer()` no mueve fondos.
- **Tope:** $ 5.000 por comprador (D11.5).
- **Invariante central:** el contrato nunca retiene plata. Va del comprador al proveedor en la misma transacción.

La fábrica desplegada en [`spike.md`](../pruebas/spike.md) es de prueba. La de uso real se despliega en P4, después de la segunda revisión.

## 6. Agente

- **Loop propio (D13.1):** lee la cadena y actúa sin que nadie le escriba: reclama cotizaciones, avisa si falta cupo o saldo, y ejecuta cuando el código confirma las condiciones.
- **Bitácora pública (D13.2):** cada acción, con su motivo y su hash.
- **Herramientas:** las 7 del [plan](plan-compra-colectiva.md#6-el-agente), con zod `.strict()` y alias. El LLM nunca ve direcciones ni elige proveedor.
- **Nunca firma por un comprador.** Su wallet solo manda `ejecutar()` y el registro ERC-8004.

## 7. Cumplimiento del hackathon

| Regla | Cómo |
|---|---|
| Celo mainnet con wFiat real | wARS, con dirección tomada de `tokens.ts` |
| Etiqueta ERC-8021 | Agente: `tagged-sender.ts`. Comprador: el core arma los datos con el sufijo. Se comprueba con `verifyTx` en transacciones reales |
| ERC-8004 | Vaqui, `agentId` 10026 |
| Repo público | `HyNuwa/vaquita` |
| Agente autónomo | Loop propio, con ejecución sin confirmación manual |
| Una persona real puede usarlo | Web en español rioplatense, probada desde el celular con alguien ajeno al equipo |
| Usuarios independientes | Valora con actividad previa en Celo. No fondeamos wallets: una wallet fondeada por nosotros no cuenta |

## 8. Stack

Next.js en Vercel (D5) · RainbowKit, wagmi y viem · WalletConnect · `@celo/attribution-tags` · Foundry · Telegram y LLM en Railway (D5). Sin servicios pagos de wallets. Lo pendiente está en [stack.md](stack.md).

## 9. Alcance

**Entra:**

- [x] Contrato, fábrica y compra real de $ 1 conciliada
- [x] ERC-8004
- [x] Etiqueta desde una billetera externa en mainnet, con MetaMask
- [ ] Etiqueta desde Valora
- [ ] `permit` en una transacción real
- [ ] Peor caso de gas con varios compradores
- [ ] Web: conectar, cargar pesos, comprometerse, cancelar y ver el progreso
- [ ] Lector de eventos y estado confirmado
- [ ] Bot, loop conectado a la cadena y bitácora en la web
- [ ] Campaña completa del equipo y otra con personas ajenas

**Queda para después:** ahorro por metas, wallet embebida, gas patrocinado y salida de pesos integrada.

## 10. Riesgos y preguntas abiertas

| # | Riesgo | Qué hacemos |
|---|---|---|
| 1 | **Ripio deja al comprador con wARS, pero wARS no paga comisiones.** Sin otra moneda, no puede firmar | Es el riesgo principal de la experiencia. Probar si el mismo Ripio Ramp vende USD₮, USDC o CELO en Celo para Argentina, o si Valora lo resuelve. No fondeamos nosotros, porque ese comprador deja de ser independiente |
| 2 | Valora con WalletConnect: no está comprobado que conserve la etiqueta, que muestre wARS ni qué moneda usa para la comisión | Prueba de P1. [Valora](https://support.valoraapp.com/hc/en-us/articles/4402359409165-Transaction-Fees) prioriza CELO y, sin CELO, usa el token nativo de Celo con más saldo; no aclara si es igual para apps externas |
| 3 | MetaMask ignora `feeCurrency`, así que necesita CELO | Solo respaldo técnico; no se ofrece a compradores sin experiencia |
| 4 | Salida de pesos del comercio sin validar | No decimos que la compra está resuelta de punta a punta hasta probar `ramp.ripio.com/offramp` con un proveedor real |
| 5 | Costo de `ejecutar()` con muchos compradores contra el tope de 0,20 USD | Medir. Si no entra, se achica la lista permitida |
| 6 | Un comprador bloqueado por Ripio revierte toda la ejecución | Aceptado en D14.3: se recupera con una campaña nueva |
| 7 | Consulta legal abierta (CNV, IGJ, consumo) | Montos chicos, riesgos por escrito y sin afirmar exenciones |

**Costo estimado para el comprador:** autorizar y comprometerse usaron 285.512 de gas en el spike. Eso es cerca de medio centavo de dólar, con el costo observado el 2/11; hay que confirmarlo en la prueba con billetera.

## 11. Referencia: Alcancía

[Alcancía](https://github.com/artugrande/alcancia) es el ejemplo del track, un agente de ahorro por metas. Lo usamos como referencia técnica para `providers.tsx`, `config.ts` y `Dashboard.tsx`:

- RainbowKit y wagmi con Valora y MetaMask.
- `dataSuffix` en cada firma del usuario, con el código asignado y el derivado del repo en un solo sufijo.
- Links a `ramp.ripio.com` y `/offramp`.
- Botón de demo rápida, página "cómo funciona" y tabla de cumplimiento en el README.

No copiamos código: el repo no publica licencia y el hackathon pide código escrito durante el evento. Tampoco copiamos sus direcciones (regla 2). Alcancía tampoco manda `feeCurrency` desde la web, así que no resuelve el riesgo 1.

## 12. Plan

Las puertas mandan: si una no cierra, se aplica su recorte.

| Puerta | Qué queda | Evidencia |
|---|---|---|
| P1 · Mar 3/11 | `approve(0)` con etiqueta desde MetaMask móvil y WalletConnect, por QR desde una página local, anotado como prueba técnica. Se mira la etiqueta con `verifyTx`. Valora y su moneda de comisión se prueban después | Hash en `spike.md` |
| P2 · Mié 4/11 | Segunda revisión del contrato, `permit` real, peor caso de gas, pedidos de cotización y compra real de pesos por Ripio Ramp | Salida de `forge test`, hashes y resultado del riesgo 1 |
| P3 · Jue 5/11 | Web `/c/:slug`: conectar, comprometerse y cancelar. Guarda de la CI con su excepción. Lector de eventos | CI en verde y prueba desde el celular |
| P4 · Vie 6/11 | Contrato en mainnet, bot, loop, bitácora y campaña completa del equipo | Hashes en `docs/entrega/transacciones.md` |
| P5 · Sáb 7/11 | Campaña con personas ajenas y salida de pesos probada o declarada pendiente. Código congelado a las 20:00 | Firmantes distintos |
| P6 · Dom 8/11 | README, video, deck y formulario, con la wallet del agente | Confirmación del envío |

**Criterio de terminado:** una persona ajena al equipo carga pesos, se compromete desde su billetera y ve la compra ejecutada, con cada transacción etiquetada y verificable. Lo que falte se dice en el pitch.
