# S5 · Vaqui y pagos programados

## Proceso

`apps/bot/src/main.ts`, un solo proceso, de larga duración y fuera de Vercel: lector, programador y bot (S7), con ciclos independientes. Si uno falla, se registra y los otros siguen.

**Un solo ejecutor:** el servicio utiliza `OpsStore` (`fondo/datos/ops-store.ts`) con transacciones duraderas, bloqueo exclusivo, ocurrencias únicas y recuperación de envíos firmados. El adaptador inicial es PostgreSQL y adquiere `pg_try_advisory_lock(42220)` sobre una **conexión dedicada viva**; si se pierde el bloqueo o la conexión, **no se transmiten pagos nuevos**. La interfaz permite sustituir la implementación en el futuro sin cambiar permisos on-chain. Sin almacenamiento operativo persistente, Vaqui funciona como lector/asesor, **nunca como pagador**. Ni el Safe ni sus responsables dependen de ese servicio.

**Comandos:** `npm run vaqui` y `npm run vaqui -- --solo-lector`.

**Modo:** ensayo salvo `LIVE_PAYMENTS=si-muevo-plata-real`. Lo muestra al arrancar.

## Configuración

`packages/core/src/config/env-vaqui.ts`. Variables nuevas, agregadas a `.env.example` sin valores:

| Variable | Uso |
|---|---|
| `VAQUI_OPERATIVA_PRIVATE_KEY` | Clave de la wallet operativa. Requerida también en ensayo |
| `VAQUI_WALLET_ADDRESS` | Dirección pública de esa wallet, para la web. El proceso comprueba que coincida con la clave |
| `DATABASE_URL` | Solo para el adaptador operativo PostgreSQL de automatizaciones. No es necesario para operar Safe desde la web independiente; sin persistencia Vaqui no envía pagos |
| `SESSION_SECRET` | Solo en la web |
| `TELEGRAM_BOT_TOKEN` | Opcional: sin él, no hay bot |
| `ANTHROPIC_API_KEY` | Opcional: sin él, se usan plantillas |

**Nunca** se cae en `AGENT_PRIVATE_KEY`. El arranque falla si la dirección operativa es la de identidad ERC-8004 o un responsable de algún grupo. La web no carga este módulo; un test lo comprueba.

## Pagos programados

### Aprobación

Dos firmas EIP-712, sin transacción y sin comisión:

```ts
domain = { name: "La Vaquita", version: "1", chainId: 42220, verifyingContract: safe }
PagoProgramado = {
  pagoId: bytes32, destinatario: address, token: address, monto: uint256,
  primeraFecha: string, periodicidad: string, validaHasta: uint64,
  maxEjecuciones: uint32, version: uint32, activo: bool,
}
```

`pagoId` es el UUID en `bytes32`. `primeraFecha` es `YYYY-MM-DD` en `America/Argentina/Buenos_Aires`; `validaHasta` es un Unix timestamp UTC. Se exige `validaHasta > now`, `maxEjecuciones >= 1` (máximo 12 en esta versión), y ejecución total no superior al máximo. La validez termina al alcanzar el contador o el vencimiento, lo que suceda primero. Una programación de una sola vez usa `maxEjecuciones=1`. Cambiar cualquier campo sube la `version` y exige firmas nuevas.

**Paquete portable:** el texto tipado exacto, dominio, firmas, versión y hash se exportan en JSON y se verifican con `getOwners()` del Safe en cadena; la base no puede convertir firmas inválidas en válidas. El agente valida firma, vencimiento, versión y número de ejecuciones antes de cada operación.

**Límite de seguridad:** cancelar, pausar o incrementar `version` en almacenamiento auxiliar es una orden a nuestro programador, **no una revocación on-chain**. Un operador o atacante con la clave de Vaqui aún puede gastar anticipadamente dentro del token, destinatarios y límites de Roles, incluso con firmas EIP-712 que el contrato no interpreta. La revocación efectiva es deshabilitar su rol en el Safe. No se promete que borrar el paquete firmado invalide permisos en Celo.

**Solo se aceptan firmas de cuentas comunes:** una firma de contrato se rechaza con un mensaje claro. Esto es una limitación declarada.

### Ocurrencias

Cada minuto, en hora argentina, se crean las ocurrencias vencidas con `ON CONFLICT DO NOTHING` a través de `OpsStore`. `mensual` usa el día de `primera_fecha`, y si el mes no lo tiene, el último día del mes. No se crean ocurrencias posteriores a `validaHasta` ni después de `maxEjecuciones`. Si no está disponible el almacenamiento duradero, no se emite ninguna transacción: no se improvisa una cola en memoria.

### Antes de cada pago, en este orden

1. El grupo está `activo`, sin pausa y con su última verificación en `ok`.
2. El pago está `activo`, dentro de `validaHasta` y `maxEjecuciones`, con dos firmas válidas de dos dueños **actuales** de `getOwners()` sobre el paquete exportable exacto. Si no: `requiere_reaprobacion` y aviso.
3. El destinatario está `autorizado` en el servicio **y** la política efectiva de Roles lo permite, comprobado mediante la configuración observada y una simulación `eth_call`. La fila auxiliar no da autorización.
4. `evaluatePayment` de `policy/engine.ts`: el tope de $ 5.000 y los $ 20.000 por día del ledger único de `data/`, para toda la wallet. Se usa como segunda protección.
5. Lectura de `balanceOf` del Safe y de `allowances`.
6. Simulación con `eth_call` de `execTransactionWithRole(wARS, 0, transfer, 0, ROL_VAQUI, true)`.

| Resultado | Estado de la ocurrencia | Efecto |
|---|---|---|
| Excede tope, presupuesto o destinatario | `excede_limites` | Prepara una propuesta si no hay otra pendiente. Si la hay, avisa una vez y vuelve a probar en el próximo ciclo |
| Saldo insuficiente | Sigue `pendiente` | Avisa una vez por vencimiento y reintenta cada hora |
| wARS restringido | `fallida` | Avisa, sin reintentar |
| Red no disponible | Sigue `pendiente` | Reintenta, hasta 3 por ciclo |
| Pausa | Sigue `pendiente` | Sin aviso repetido |
| Ok | Sigue abajo | |

### Envío, sin pago doble

Serializado: un envío a la vez por wallet.

1. `OpsStore.reclamarOcurrencia(...)` realiza de manera atómica el equivalente de `UPDATE ... SET estado='enviando' WHERE estado='pendiente'`. Si no reclama exactamente una, no se hace nada. Exige persistencia duradera y bloqueo exclusivo vigente.
2. Reserva en el ledger. `prepareTaggedTx` de `chain/tagged-sender.ts`, sin cambios ni un tope nuevo: el gas medido, unos 150.000 más lo de CIP-64, cuesta bastante menos que el tope de pagos de USD 0,05.
3. **Persistir `tx_hash`, `tx_firmada` y `nonce_cuenta` antes de transmitir, con confirmación duradera del almacenamiento. Si la escritura falla, no transmitir.**
4. Ensayo: estado `ensayo`, se libera la reserva y se registra. No se repite: un vencimiento ensayado no se paga después en modo real. Para una prueba real, se crea otro pago.
5. Real: `broadcast`, leer el recibo y buscar `Transfer`.
   - Éxito, con la `Transfer` esperada y etiqueta verificada: `confirmada`.
   - Revertida: `fallida`, se libera la reserva y se avisa. No se reintenta.
6. Escribir en la bitácora con motivo fijo. Avisar al grupo.

### Al arrancar, para cada `enviando`

| Lectura en cadena | Acción |
|---|---|
| Hay recibo | Resolver según el paso 5 |
| Sin recibo, y el nonce de la cuenta es igual a `nonce_cuenta` | Retransmitir **los mismos bytes** de `tx_firmada`. Nunca firmar otra |
| Sin recibo, y el nonce es mayor | `incierta`. Se detienen los pagos del grupo y se avisa al equipo. Ninguna acción automática |
| Sin `tx_firmada` | No se llegó a firmar: vuelve a `pendiente` y se libera la reserva |

El mismo control corre cada minuto para los `enviando` con más de 5 minutos.

### Sin gas

`GAS_OVER_CAP` y `NO_GAS_FUNDS` de `prepareTaggedTx` dejan la ocurrencia `pendiente`, liberan la reserva y avisan una vez al equipo.

## Bitácora

`fondo/bitacora.ts` escribe mediante el adaptador auxiliar en `bitacora`. El motivo sale de una lista cerrada de códigos, con zod `.strict()` y sin texto libre, igual que en `compra/agent-log.ts`.

Códigos: `PAGO_PROGRAMADO`, `PAGO_ENSAYADO`, `EXCEDE_LIMITES`, `SIN_SALDO`, `SIN_GAS`, `TOKEN_RESTRINGIDO`, `RED_NO_DISPONIBLE`, `PAUSADO`, `REQUIERE_REAPROBACION`, `PROPUESTA_PREPARADA`, `RECORDATORIO_CUOTA`, `RECORDATORIO_APROBACION`, `ALERTA_REGLAS`, `INCIERTA`, `DIFERENCIA_SALDO`.

## Criterios de aceptación

| ID | Nivel | Debe pasar |
|---|---|---|
| S5-1 | CI | Firmas: un responsable dos veces, un exdueño, datos alterados en la base, versión vieja y firma de otro Safe rechazadas |
| S5-2 | CI | Dos ejecuciones concurrentes sobre la misma ocurrencia envían una sola |
| S5-3 | CI | Caída tras guardar el hash y antes de transmitir: retransmite los mismos bytes, y nunca firma otra |
| S5-4 | CI | Caída tras transmitir: resuelve por recibo, sin reenviar |
| S5-5 | CI | Nonce avanzado sin recibo: `incierta`, y se detiene |
| S5-6 | CI | Sin la frase exacta, `sendRaw` no se llama nunca |
| S5-7 | CI | wARS restringido: una sola llamada, sin reintentos |
| S5-8 | CI | Mes corto, cruce de medianoche en hora argentina |
| S5-9 | CI | Excede límites con y sin propuesta pendiente |
| S5-10 | CI | Pausa: no envía, y al reanudar no duplica |
| S5-11 | CI | `env-vaqui`: rechaza la clave de identidad; la web no la importa |
| S5-12 | CI | Dos procesos: el segundo termina por el bloqueo |
| S5-13 | CI | Bitácora rechaza texto libre, direcciones y campos de más |
| S5-14 | Fork | Pago programado de punta a punta con `fork-sender`: fondos movidos y ocurrencia `confirmada` |
| S5-15 | Fork | **Pago anticipado directo con la clave pasa dentro de los límites.** La prueba documenta que la fecha no es una garantía en cadena |
| S5-16 | Fork | Pago anticipado por el programador: no sale |
| S5-17 | CI | Un `prepareTaggedTx` con un `execTransactionWithRole` real, con reader falso: firma CIP-64, etiqueta y destino Roles |
| S5-18 | CI | Autorización vencida, `maxEjecuciones` alcanzado, paquete modificado o dos firmas no válidas: no transmite; exportación e importación conservan bytes y hash firmados |
| S5-19 | CI | Apagar `OpsStore`, perder el lock o fallar la persistencia de `tx_firmada` bloquea nuevos pagos y no bloquea el acceso manual a Safe |
| S5-20 | Fork | Dos firmas EIP-712 verificables no impiden que la clave de Vaqui haga un pago anticipado dentro de Roles; el texto de garantías lo declara |
| S5-21 | CI | Reinicio sin base auxiliar: estado de solo lectura y aviso; nunca reconstruye a ciegas ocurrencias ya ejecutadas ni vuelve a firmar |

CIP-64 con Roles no se prueba en fork porque anvil lo rechaza: S5-17 cubre el armado y la prueba real es el [paso humano H4](09-pasos-humanos.md).
