# Plan técnico del fondo compartido

**Decisión:** [D16](decisiones.md). **Producto:** [spec.md](spec.md). **Para implementar:** [specs/](specs/README.md), que mandan sobre este plan en el detalle. **Evidencia:** [fondo.md](../pruebas/fondo.md). **Fechas:** [control-entrega.md](../tareas/control-entrega.md).

**Estados:** ✅ **Implementado** (hay código) · 🧪 **Verificado en fork** · ⛓️ **Verificado en mainnet** · ⏳ **Pendiente**. Una pieza solo cambia de estado con evidencia.

## 1. Arquitectura

```text
Web (Next.js, Vercel)                  Proceso de Vaqui (fuera de Vercel)
  RainbowKit, wagmi y WalletConnect      indexador, scheduler y loop
  lib/firmar.ts: firmas de las personas  tagged-sender.ts: wallet operativa
        |                                        |
        v                                        v
packages/core/src/fondo/: arma cada { to, data + etiqueta }, sin .env en lo que llega al navegador
        |                                        |
        v                                        v
Celo mainnet                             PostgreSQL
  Safe 1.4.1 L2: 3 responsables, 2 firmas  grupos, integrantes, cuotas, propuestas,
  Roles 2.1.1: permiso de Vaqui            pagos programados, aprobaciones, desafíos
  wARS (Ripio)   ERC-8004 (Vaqui)          La cadena manda sobre saldo y transferencias
```

| Quién | Qué firma | Quién paga la comisión |
|---|---|---|
| Creador | Crear el Safe y desplegar Roles | El creador |
| Integrante | Aporte | El integrante, en la moneda que resuelva su billetera |
| Responsable | `approveHash`, `execTransaction` y aprobaciones de pagos programados | Cada responsable |
| Wallet operativa de Vaqui | `execTransactionWithRole` | Vaqui, en stablecoin por CIP-64 |

Vaqui no es dueño del Safe. Si Vaqui se cae, los responsables siguen operando por cadena.

## 2. Contratos oficiales

No se escribe un contrato de custodia. Las direcciones van a `packages/core/src/config/`, con su fuente, y se validan por red. Esta tabla es para leer, no para copiar.

| Pieza | Dirección | Fuente | Estado |
|---|---|---|---|
| Roles 2.1.1 (mastercopy) | `0xF2964CE6161ce0e75964Fe7927cE114cb0B283D5` | [Seguridad de Zodiac](https://docs.zodiac.eco/developers/security) | ⏳ Hashes comparados el 4/11: [fondo.md](../pruebas/fondo.md). Sigue pendiente la verificación completa |
| Fábrica de módulos 1.2.0 | `0x000000000000aDdB49795b0f9bA5BC298cDda236` | [`@gnosis-guild/zodiac` 5.0.1](https://unpkg.com/@gnosis-guild/zodiac@5.0.1/dist/cjs/contracts.js) | ⏳ Igual |
| SafeL2 1.4.1 | `0x29fcB43b46531BcA003ddC8FCB67FFE91900C762` | [safe-deployments](https://github.com/safe-global/safe-deployments) | ⏳ Igual |
| SafeProxyFactory 1.4.1 | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` | safe-deployments | ⏳ Igual |
| CompatibilityFallbackHandler 1.4.1 | `0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99` | safe-deployments | ⏳ Igual |
| MultiSendCallOnly 1.4.1 | `0x9641d764fc13c8B624c04430C7356C1C7C8102e2` | safe-deployments | ⏳ Igual |

**Nunca usar:** Roles 2.1.0 (`0x9646fDAD06d3e24444381f44362a3B0eB343D337`) ni Delay 1.1.0 (`0x01F8cabB808D7dE0dF4202D4B60C8310d2f1339b`). El core rechaza ambas, con un test. Delay 1.1.1 no se usa en esta versión (D16.23).

**Incidente de junio de 2026:** afectaba a un Safe con `CompatibilityFallbackHandler` que fuera miembro de un rol de Roles 2.1.0. Vaqui es una cuenta común, así que este diseño no entraría en ese caso. Aun así, se usa la versión corregida y se corren los controles.

### Verificación antes de conectar fondos (bloqueante)
- [ ] Bytecode de cada dirección comparado con el oficial
- [ ] La instancia de Roles apunta a la mastercopy 2.1.1 (se lee del proxy)
- [ ] `sanityCheckZodiacModuleAddress` y [checker oficial](https://app.zodiac.eco/public/fallback-handler)
- [ ] Safe: dueños, umbral 2, módulos, fallback handler, y sin guard
- [ ] Roles: dueño, avatar y target son el Safe
- [ ] Permisos efectivos leídos de la cadena, sin confiar en lo que se envió
- [ ] Resultado guardado en `docs/pruebas/fondo.md`

## 3. Crear un grupo

Estados: `borrador` → `safe_creado` → `roles_desplegado` → `reglas_aprobadas` → `verificado` → `activo` → `disolviendo` → `disuelto`.

| Paso | Quién | Qué | Estado |
|---|---|---|---|
| 1 | Creador | `createProxyWithNonce` con tres dueños y umbral 2. Lleva etiqueta | ⏳ |
| 2 | Creador | `deployModule` de Roles 2.1.1, con el Safe como dueño, avatar y target. Roles queda deshabilitado | ⏳ |
| 3 | Dos responsables | Lote aprobado con `MultiSendCallOnly`: `enableModule`, permisos y `assignRoles` para Vaqui | ⏳ |
| 4 | Sistema | Corre la verificación del §2. Si falla, no pasa a `activo` | ⏳ |
| 5 | Web | Recién en `activo` acepta aportes | ⏳ |

El creador no llega a controlar Roles, porque nace con el Safe como dueño. Una transferencia directa antes de `activo` no se puede impedir: entra como fondos sin atribución.

## 4. Aprobaciones

Flujo con un Safe real, a comprobar:

1. El backend lee `nonce()` y arma la transacción Safe con `safeTxGas`, `baseGas`, `gasPrice` y `refundReceiver` en cero.
2. **Responsable 1:** `approveHash(hash)`, con etiqueta.
3. **Responsable 2:** `execTransaction(...)`, con etiqueta. Las firmas son preaprobadas (`v = 1`, `r` = dueño, `s = 0`), ordenadas por dirección ascendente.
4. El lector confirma `ExecutionSuccess`.

**Puntos a probar:**
- El sufijo de la etiqueta no rompe `execTransaction`, y se verifica por separado en cada transacción.
- **Si la llamada interna falla, con estos valores en cero la transacción revierte con `GS013` y no consume el `nonce`** (visto en fork). `ExecutionFailure` solo aparece con `safeTxGas` o `gasPrice` distintos de cero: la web no lo arma, pero alguien podría enviarlo por fuera, así que el lector lo contempla. `firmar.ts` confirma el envío; el resultado sale del evento.
- Una aprobación queda en cadena para siempre: solo un reemplazo con el mismo `nonce` la invalida.
- Una transacción de reemplazo vacía invalida la propuesta anterior.

**Reglas de backend:** una propuesta pendiente por grupo (no es una propiedad de Safe). Se comprueba el `nonce` antes de proponer y antes de ejecutar. Borrar un registro nunca cuenta como cancelación. Si el Safe se movió fuera de la web, la propuesta vieja se marca como desactualizada.

## 5. Permiso de Vaqui

| Regla | Valor | Dónde | Estado |
|---|---|---|---|
| Destino de la llamada | Solo wARS | Roles | ⏳ |
| Función | Solo `transfer`; solo `Call` | Roles | ⏳ |
| Destinatario | Solo la lista autorizada | Roles | ⏳ |
| Por transferencia | $ 5.000 | Roles | ⏳ |
| Cada 30 días | $ 20.000, con `refill = maxRefill` y `period` de 30 días | Roles (`WithinAllowance`) | ⏳ |
| Combinación | Destinatario, tope y presupuesto en la misma condición | Roles | ⏳ |
| Montos | `bigint` con 18 decimales | Core | ⏳ |
| Segunda protección | `config/policy.ts`: $ 5.000 por pago y $ 20.000 por día | Fuera de cadena | ✅ Los valores existen; falta aplicarlos a esta operación |
| Fecha del pago | Scheduler | **Fuera de cadena, no es garantía** | ⏳ |
| Pausa | Nuestro servicio | **Fuera de cadena, no es garantía** | ⏳ |

**Visto en fork:** el tope es un `LessThan` junto con `WithinAllowance` dentro de un `And`. "Frecuencia" significa presupuesto cada 30 días y tope por pago, no cantidad de pagos (D16.34). Condición exacta en [S2](specs/02-core-fondo.md).

**Peor caso de una clave robada:** hasta $ 20.000 justo antes de la renovación y $ 20.000 justo después, en tandas de hasta $ 5.000, solo hacia destinatarios autorizados: **$ 40.000 por grupo**, visto en fork. Con una wallet para todos, el total es la suma de los grupos.

**Cambiar destinatarios o límites:** transacción Safe aprobada por dos responsables.

**Revocar:** `assignRoles` en falso; al disolver, además `disableModule`. Se lee la cadena para confirmar, y se prueba un pago después de revocar.

## 6. Datos

PostgreSQL administrado. **Pendiente:** verificar límites y condiciones del plan gratuito.

| Tabla | Contenido |
|---|---|
| `grupos` | Safe, Roles, estado y objetivo operativo |
| `integrantes` | Wallet, nombre, rol, baja y aceptación de riesgos |
| `cuotas` | Monto, período y aportes esperados |
| `propuestas` | Transacción Safe, `nonce`, descripción y estado |
| `aprobaciones` | Responsable, hash y transacción |
| `pagos_programados` | Destinatario, token, importe, fecha, periodicidad, estado y firmas |
| `ocurrencias_pago` | Pago, vencimiento, intento y hash. Clave única `(pago, vencimiento)` |
| `movimientos` | Eventos indexados. Clave única `(hash, índice de log)` |
| `desafios` | Uso único, vencimiento, wallet y objetivo |
| `bitacora` | Acción, motivo y hash |

**Aprobación de pagos programados:** dos firmas EIP-712 de responsables sobre destinatario, token, importe, fecha, periodicidad y un número de versión del pago. Vaqui las comprueba contra los dueños actuales del Safe antes de cada pago. Así, alterar la base no crea un pago válido. Si cambia un responsable, se comprueba que las firmas sigan siendo de dueños vigentes.

**Sin pago doble:**
1. Un solo proceso toma la ocurrencia con una escritura condicional (`pendiente` → `enviando`).
2. Guarda el hash antes de esperar confirmación.
3. Si se cae, primero lee la cadena. No reenvía mientras no sepa qué pasó.

**Secretos:** clave operativa solo en el entorno de ejecución de Vaqui, nunca en la web ni en Git. La web no conecta con ella.

**Ledger:** sigue el ledger único de `data/`, y el proceso de Vaqui es su único escritor. Ese proceso necesita disco persistente. Dónde corre (D5, Railway con precio sin verificar, o la PC de Maxi para la demo, declarado) queda pendiente.

## 7. Lector

| Fuente | Eventos |
|---|---|
| Safe | `ApproveHash`, `SafeMultiSigTransaction`, `ExecutionSuccess`, `ExecutionFailure`, `ExecutionFromModuleSuccess` y `ExecutionFromModuleFailure` |
| Cambios en el Safe | `AddedOwner`, `RemovedOwner`, `ChangedThreshold`, `EnabledModule`, `DisabledModule` y `ChangedGuard` |
| Roles | Asignación de roles, cambios de permisos y consumo de presupuesto |
| wARS | `Transfer` entrante y saliente del Safe |

- **Cursor persistente:** se reanuda después de una caída.
- **Sin duplicados:** clave `(hash, índice de log)`.
- **Reorganizaciones:** confirmaciones mínimas y comparación del hash del bloque; a fijar tras medir.
- **Origen de un aporte:** un `Transfer` entrante de una wallet registrada es un aporte identificado. El resto queda sin atribución.
- **Alertas:** cualquier cambio de dueños o permisos que no venga de una propuesta conocida avisa al grupo.
- **Pendiente:** medir los límites de consulta de `forno`.

Si la base se pierde, los movimientos se reconstruyen desde la cadena. Los datos fuera de cadena, no.

## 8. Pruebas

### Nivel 1: CI, sin red
Armado de transacciones y etiqueta, hash de Safe contra vectores conocidos, orden de firmas, condiciones de Roles, rechazo de versiones con fallo, validación de direcciones por red, reglas de cuotas y saldos, pagos programados, no pago doble, reorganizaciones y clasificación de errores.

### Nivel 2: fork local de mainnet
Fuera de la CI, sin transmitir nada. Corre contra los contratos reales y wARS real.

### Nivel 3: mainnet controlada
Solo después de la verificación del §2, con fondos del equipo y montos chicos. Se registra en `docs/pruebas/fondo.md`.

### Recorridos

| Prueba | Fork | Mainnet |
|---|---|---|
| Configuración inicial y lectura de permisos efectivos | ⏳ | ⏳ |
| El creador no puede activar permisos solo | ⏳ | ⏳ |
| Aporte con etiqueta, desde la web y directo | ⏳ | ⏳ |
| `approveHash` y `execTransaction`, con etiqueta en ambas | ⏳ | ⏳ |
| Una sola firma no alcanza | ⏳ | ⏳ |
| Cancelación con reemplazo del mismo `nonce` | ⏳ | ⏳ |
| Llamada interna fallida (`GS013`) | ⏳ | — |
| Pago de Vaqui permitido, con CIP-64 y etiqueta | ⏳ | ⏳ |
| Devolución | ⏳ | ⏳ |
| Cambio de responsable | ⏳ | ⏳ |
| Revocación | ⏳ | ⏳ |
| Disolución | ⏳ | ⏳ |
| Etiqueta desde Valora | — | ⏳ |

### Negativas

Todas se simulan. Al menos una se envía de verdad a mainnet, para ver el rechazo en Celoscan.

| Prueba | Resultado esperado | Fork | Simulada en mainnet |
|---|---|---|---|
| Destinatario no autorizado | Rechazo de Roles | ⏳ | ⏳ |
| Más de $ 5.000 | Rechazo de Roles | ⏳ | ⏳ |
| Presupuesto de 30 días excedido | Rechazo de Roles | ⏳ | ⏳ |
| Otro token | Rechazo de Roles | ⏳ | ⏳ |
| `approve` | Rechazo de Roles | ⏳ | ⏳ |
| `delegatecall` | Rechazo de Roles | ⏳ | ⏳ |
| Pago después de revocar | Rechazo de Roles | ⏳ | ⏳ |
| Pago anticipado **con el scheduler** | Lo frena el scheduler | ⏳ | — |
| Pago anticipado **directo con la clave** | **Pasa, dentro de los límites.** La prueba documenta que la fecha no es una garantía en cadena | ⏳ | ⏳ |
| Dos pagos alrededor de la renovación | Pasan y confirman el peor caso | ⏳ | — |

La renovación se prueba en fork adelantando el tiempo: en mainnet habría que esperar 30 días.

**Antes de mergear lo que toca plata:** skill `review` y otro agente, con los hallazgos en el PR. No es una auditoría y no se presenta como tal.

## 9. Código

| Pieza | Qué hace | Estado |
|---|---|---|
| `chain/tagged-sender.ts` | Envía con etiqueta y CIP-64 | ⛓️ Probado con pagos y contratos. ⏳ `execTransactionWithRole` entra en el tope de pagos según lo medido en fork; falta probarlo en mainnet |
| `attribution/` y `tx:verificar` | Etiqueta y verificación | ⛓️ |
| `apps/web/src/lib/firmar.ts` | Firma de la persona, y sus estados | ✅ Con MetaMask móvil ⛓️ en el caso feliz; fallos, Valora y `ExecutionFailure` ⏳ |
| `identity/` | ERC-8004 | ⛓️ Vaqui, `agentId` 10026 |
| `ramp/ripio.ts` | Link de carga | ✅ Falta una compra real |
| `policy/` | Topes y ledger | ✅ Falta aplicarlos a `fondo/` |
| `compra/` y `contracts/` | Compra colectiva | ⛓️ En pausa |
| `compra/loop.ts`, `runner.ts` y `agent-log.ts` | Loop y bitácora de la compra | ✅ En pausa; se reutiliza el patrón donde sirva |
| `config/`: direcciones de Safe y Zodiac | Validadas por red | ⏳ |
| `fondo/transacciones.ts` | Módulo puro: `{ to, data }` etiquetado | ⏳ |
| `fondo/safe.ts` y `fondo/roles.ts` | Hash, firmas y permisos | ⏳ |
| `fondo/verificar.ts` | Verificación del §2 | ⏳ |
| `fondo/lector.ts` | Indexador | ⏳ |
| `fondo/programados.ts` | Scheduler | ⏳ |
| `fondo/herramientas.ts` | Herramientas del LLM: solo lectura y preparar propuestas; con alias y zod `.strict()`. Ninguna paga | ⏳ |
| `apps/web` | Recorridos de la [spec](spec.md#5-recorridos) | ⏳ Hoy solo `/prueba-firma` |
| `apps/bot` | Telegram | ⏳ |

**Librerías:** viem para Safe y Roles, con el ABI de 2.1.1 fijo y sin el SDK de Roles (D16.34). Versiones fijas, anotadas en [stack.md](stack.md).

## 10. Pendientes externos

| Pendiente | Estado |
|---|---|
| Compra real por Ripio Ramp: KYC, costos y si vende una moneda para pagar comisiones | ⏳ |
| Salida de pesos del destinatario, punta a punta | ⏳ |
| Valora: etiqueta, wARS y moneda de la comisión | ⏳ |
| Esteban y Daniel como responsables | ⏳ |
| Wallet operativa y cómo la toma la inscripción del hackathon | ⏳ |
| Costos reales de crear un grupo y de cada operación | ⏳ Medir: no hay cifras |
| Entrevistas | ⏳ |

Evaluación regulatoria y auditoría: antes de operar comercialmente, no en esta etapa (D16.18).
