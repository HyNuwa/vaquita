# S2 · Core del fondo

Todo en `packages/core/src/fondo/`. **Montos en `bigint` con 18 decimales**, nunca `number`. Sin `.env` en los módulos marcados "navegador".

## Módulos

| Archivo | Navegador | Contenido |
|---|---|---|
| `constantes.ts` | Sí | Límites y claves de rol |
| `abis.ts` | Sí | S1 |
| `transacciones.ts` | Sí | `TxPersona = { to, data }`, siempre etiquetada, y un constructor por operación |
| `safe.ts` | Sí | Hash, firmas preaprobadas, MultiSend y predicción de direcciones |
| `roles.ts` | Sí | Condiciones y lote de reglas |
| `lectura.ts` | No | `FondoReader`, interfaz de lecturas con cliente público de viem. Los tests la reemplazan por un fake |
| `verificar.ts` | No | Verificación completa de un grupo |
| `errores.ts` | Sí | Decodificación y clasificación |
| `saldos.ts`, `cuotas.ts`, `reparto.ts` | Sí | Reglas puras |

Exportar `TxPersona` desde `fondo/transacciones.ts` y hacer que `apps/web/src/lib/firmar.ts` lo importe de ahí. `compra/` no se toca.

**Dependencia permitida:** los constructores, la lectura de Safe, `verificarGrupo` y el flujo de firmas no importan `pg`, `DATABASE_URL`, sesiones ni ninguna API de La Vaquita. Son funciones puras o llamadas RPC desde un cliente con wallet. Las APIs auxiliares pueden reutilizarlas, nunca sustituir su validación.

## Constantes

```ts
LIMITE_POR_TRANSFERENCIA = 5_000n * 10n ** 18n
PRESUPUESTO_PERIODO      = 20_000n * 10n ** 18n
PERIODO_SEGUNDOS         = 2_592_000n            // 30 días
APORTE_MAXIMO_UI         = 5_000n * 10n ** 18n   // operativo, no en cadena
OBJETIVO_GRUPO           = 100_000n * 10n ** 18n // operativo, no en cadena
MAX_DESTINATARIOS        = 20
ROL_VAQUI       = keccak256(toHex("vaqui"))
CLAVE_PRESUPUESTO = keccak256(toHex("vaqui-mensual"))
```

## Crear un grupo

**Safe:** `createProxyWithNonce(safeL2, initializer, saltNonce)` en `proxyFactory`.

- `initializer = setup([r1, r2, r3], 2, 0x0, 0x, fallbackHandler, 0x0, 0, 0x0)`.
- `saltNonce = BigInt(keccak256(toHex(grupoId)))`.
- Tres dueños distintos, sin la dirección cero, sin la wallet operativa y sin la wallet de identidad. Si no, lanza.

**Roles:** `deployModule(rolesMastercopy, setUp(abi.encode(safe, safe, safe)), saltNonce)` en `moduleFactory`.

**Predicción (S2-4):** las dos direcciones se calculan antes de firmar, para retomar si la persona cierra la página:

- Safe: CREATE2 con `salt = keccak256(keccak256(initializer) ++ saltNonce)` y `proxyCreationCode()` de la fábrica más el `singleton` en 32 bytes.
- Roles: CREATE2 con el mismo tipo de `salt` y `0x602d8060093d393df3363d3d373d3d3d363d73` + mastercopy + `5af43d82803e903d91602b57fd5bf3`.

Si ya hay código en la dirección, ese paso está hecho y no se firma de nuevo.

## Manifiesto público de recuperación (nuevo)

`fondo/manifiesto.ts` exporta/importa un JSON portable con versión de esquema, `chainId=42220`, `grupoId` (identificador técnico, no nombre), `safe`, `roles`, `wARS`, `walletOperativa` pública, direcciones de contratos de referencia, `saltNonce`, bloque de despliegue y hashes de las transacciones de creación/configuración si existen. **No almacena claves, nombres, Telegram ni comprobantes.**

Al importar, **no se confía en el archivo**: comprobar red, bytecode, `getOwners()`, umbral, módulos y configuración actual de Roles mediante `verificarGrupo`. Los firmantes actuales se leen de la cadena, nunca del manifiesto. Si cambia un responsable, una dirección o un permiso, la lectura on-chain prevalece. También se puede abrir un Safe proporcionando **solo la dirección**, aunque sin manifiesto no sea posible recuperar el nombre del grupo ni el vínculo con un `grupoId` social.

`fondo/operacion-independiente.ts` permite construir y simular transacciones Safe, `approveHash` y `execTransaction` con wallet + RPC, **sin API ni SQL**. Si un cliente no soporta esa vía, la especificación documenta y prueba la ejecución manual mediante una interfaz compatible con Safe. La pérdida del backend puede interrumpir automatizaciones, pero no debe bloquear la administración de fondos.

## Condición de Vaqui

Orden BFS exacto, comprobado en fork. `paramType`: `None=0, Static=1, Calldata=5`. `operator`: `And=1, Or=2, Matches=5, EqualTo=16, LessThan=18, WithinAllowance=28`.

```text
0  parent 0  Calldata  Matches
1  parent 0  None      Or                 // parámetro 1: destinatario
2  parent 0  None      And                // parámetro 2: monto
3… parent 1  Static    EqualTo            // pad(destinatario, 32 bytes), uno por destinatario
n  parent 2  Static    LessThan           // LIMITE_POR_TRANSFERENCIA + 1 en 32 bytes; no hay "menor o igual"
n+1 parent 2 Static    WithinAllowance    // CLAVE_PRESUPUESTO
```

`condicionesVaqui(destinatarios)` ordena y deduplica en orden ascendente, y lanza con 0 o más de `MAX_DESTINATARIOS`.

## Lote de reglas iniciales

Transacción Safe con `operation = 1` hacia `multiSendCallOnly`, y dentro, con `operation = 0` y en este orden:

1. `safe.enableModule(roles)`
2. `roles.setAllowance(CLAVE_PRESUPUESTO, PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PRESUPUESTO_PERIODO, PERIODO_SEGUNDOS, 0)`
3. `roles.scopeTarget(ROL_VAQUI, wARS)`
4. `roles.scopeFunction(ROL_VAQUI, wARS, transfer, condicionesVaqui(lista), 0)`. `options = 0` significa sin valor y sin `delegatecall`
5. `roles.assignRoles(walletOperativa, [ROL_VAQUI], [true])`

Con `timestamp = 0`, el contrato usa el bloque actual como inicio del período. `maxRefill` igual a `refill` impide acumular más de un período, pero se pueden gastar dos presupuestos seguidos al cruzar la renovación.

## Aprobaciones

Transacción Safe: `safeTxGas`, `baseGas` y `gasPrice` en 0, `gasToken` y `refundReceiver` en cero.

1. Leer `nonce()` y `getTransactionHash(...)`. El hash local debe coincidir con el leído; si no, lanzar.
2. Primer responsable: `approveHash(hash)`.
3. Segundo responsable: `execTransaction(...)`. Firmas `pad(dueño, 32) ++ pad(0, 32) ++ 0x01`, ordenadas por dirección ascendente. El que ejecuta no necesita `approveHash`.

**Corrección de lo que decía el plan:** con estos valores en cero, si la llamada interna falla la transacción **revierte con `GS013`** y **no consume el `nonce`**. La propuesta sigue pendiente y se puede reintentar o cancelar. `ExecutionFailure` solo aparece con `safeTxGas` o `gasPrice` distintos de cero, algo que la web no arma pero alguien podría enviar por fuera. El lector lo trata igual.

Antes de pedirle la firma al segundo responsable se simula con `eth_call`. Si revierte, no se abre la billetera y se muestra el motivo.

## Constructores de `transacciones.ts`

Cada uno devuelve `TxPersona` con etiqueta y lanza si el código de atribución no es válido:

`crearSafe`, `desplegarRoles`, `aportar(safe, monto)`, `aprobarHash(safe, hash)`, `ejecutarPropuesta(safe, txSafe, firmas)`.

Cuerpos de transacción Safe, en `safe.ts`:

| Función | Destino | Contenido |
|---|---|---|
| `txGasto(destino, monto)` | wARS | `transfer` |
| `txCancelar()` | El Safe | Llamada vacía, valor 0, mismo `nonce` |
| `txCambiarResponsable(duenos, sale, entra)` | El Safe | `swapOwner(prev, sale, entra)`, con `prev` calculado; el primero usa el centinela `0x…01` |
| `txCambiarDestinatarios(lista)` | Roles | `scopeFunction` completo |
| `txRevocar(wallet)` | Roles | `assignRoles(wallet, [ROL_VAQUI], [false])` |
| `txCerrarVaqui(wallet, modulos)` | MultiSend | Revocar más `disableModule(prev, roles)`, con `prev` leído de `getModulesPaginated` |
| `txReparto(filas)` | MultiSend | Un `transfer` de wARS por fila |

**Fuera de esta versión:** cambiar los límites de Vaqui (son los de D16.29), devolverle el permiso tras revocarlo, y rotar su wallet en un grupo existente. Se declara, y el grupo sigue operando con sus responsables.

## Verificación de un grupo

`verificarGrupo(reader, grupo)` devuelve `{ ok, controles: [{ id, ok, detalle }] }`:

| Control | Comprueba |
|---|---|
| `contratos` | `codeHash` de los seis contratos |
| `safe-proxy` | El `singleton` en el slot 0 del Safe es `safeL2` |
| `safe-config` | Dueños iguales a los esperados, umbral 2 y `getStorageAt` del guard en cero |
| `safe-handler` | El fallback handler en el slot `keccak256("fallback_manager.handler.address")` es el esperado |
| `safe-modulos` | La lista de módulos es exactamente `[roles]` |
| `roles-mastercopy` | Bytecode del proxy igual a S1-6 y no prohibido |
| `roles-config` | Dueño, avatar y target son el Safe |
| `presupuesto` | `allowances` con refill, maxRefill y period esperados, y `balance ≤ PRESUPUESTO_PERIODO` |
| `eventos` | Último `ScopeFunction` y `AssignRoles` por `getLogs`, decodificados e iguales a lo esperado, sin otro `ScopeTarget`, `AllowTarget` ni `AllowFunction`, y sin `SetDefaultRole` |
| `simulacion` | Las negativas N1 a N10 con `eth_call`, desde la wallet operativa |

2.1.1 no tiene una función para leer permisos, así que los permisos efectivos se comprueban con **eventos más simulación**, sin confiar en lo enviado. Una falla en cualquier control deja el grupo sin pasar a `activo`.

**Desacople obligatorio:** la verificación recibe `{chainId, safe, roles, bloqueInicio?}` o un manifiesto validado. No requiere una fila `grupos`. Un resultado almacenado en SQL es solo caché con bloque de referencia; si hay discrepancias, la lectura reciente de Celo manda. Las verificaciones relativas a fondos se ejecutan también sin backend.

La simulación positiva no se exige si el Safe no tiene saldo o el presupuesto está agotado: en ese caso se comprueba que el rechazo sea por el motivo esperado de cada negativa.

## Errores

`clasificarError(e)` en `errores.ts` devuelve un código estable, un texto en español y si es transitorio:

| Origen | Señal | Código | ¿Reintenta? |
|---|---|---|---|
| Roles | `0xd0a9bf58` `ConditionViolation(uint8 status, bytes32)` | Según status, abajo | No |
| Roles | `0xfd8e9f28` `NoMembership` | `VAQUI_REVOCADO` | No |
| Roles | `0x4a0bfec1` `NotAuthorized(address)` | `CUENTA_NO_AUTORIZADA` | No |
| Safe | `GS020` | `FALTAN_FIRMAS` | No |
| Safe | `GS025` | `FIRMA_NO_VALIDA` | No |
| Safe | `GS013` | `GASTO_RECHAZADO` | No |
| wARS | Pausa o lista de bloqueo. La señal exacta se toma leyendo el contrato con su ABI verificado y de [`spike.md`](../../pruebas/spike.md), con una prueba en fork si se puede forzar | `TOKEN_RESTRINGIDO` | No |
| Red | Timeout, 429, 5xx | `RED_NO_DISPONIBLE` | Sí, hasta 3 |
| Saldo de comisión | Fondos insuficientes | `SIN_SALDO_COMISION` | No |

Status de `ConditionViolation` observados en fork: `1` delegatecall, `2` destino, `3` función, `4` valor, `5` destinatario, `9` tope por pago, `17` presupuesto. Mapean a `OPERACION_NO_PERMITIDA` salvo `5` a `DESTINATARIO_NO_AUTORIZADO`, `9` a `SUPERA_TOPE_POR_PAGO` y `17` a `PRESUPUESTO_AGOTADO`.

Los textos para personas no usan jerga ni direcciones.

## Reglas puras

- **`saldos.ts`:** recibe movimientos y devuelve `{ aportesIdentificados, sinAtribucion, gastado }`. `conciliar(movimientos, saldoEnCadena)`: si `ingresos - gastado ≠ saldo` al mismo bloque, devuelve una alerta.
- **`cuotas.ts`:** período mensual, en `America/Argentina/Buenos_Aires`. `esperado(cuota, altaIntegrante, fecha)` y `estado(...)`: `al_dia`, `pendiente` o `sin_cuota`. No hay cargos. Lo sin atribución nunca cuenta.
- **`reparto.ts`:** `sugerirReparto(saldo, aportesPorIntegrante)`. Proporcional en `bigint`. El resto por redondeo va al mayor aporte y, si empatan, a la dirección menor. Invariante: la suma es igual al saldo. Si no hay aportes identificados, devuelve lista vacía.

## Negativas (fork y simulación)

Desde la wallet operativa, sobre un grupo verificado. Cada test comprueba la **señal exacta**, no solo que falle.

| ID | Caso | Señal esperada |
|---|---|---|
| N1 | Destinatario no autorizado | status 5 |
| N2 | $ 5.000 + 1 wei | status 9 |
| N3 | Presupuesto agotado | status 17 |
| N4 | Otro token | status 2 |
| N5 | `approve` | status 3 |
| N6 | `transferFrom` | status 3 |
| N7 | `delegatecall` | status 1 |
| N8 | Con valor | status 4 |
| N9 | Otro rol | `NoMembership` |
| N10 | Otra cuenta | `NotAuthorized` |
| N11 | Tras revocar | `NoMembership` |
| N12 | Una sola firma de responsable | `GS020` |
| N13 | Propuesta vieja tras reemplazo | `GS025` |
| N14 | El creador, sin ser responsable, intenta `enableModule` | Revierte |

## Positivas en fork

| ID | Caso | Comprueba |
|---|---|---|
| S2-1 | $ 5.000 exactos | Pasa |
| S2-2 | 20.000 en cuatro pagos; renovar; otros 20.000 | Total 40.000: **peor caso confirmado** |
| S2-3 | Todas las transacciones | Etiqueta decodificada en el `input` de la transacción minada |
| S2-4 | Predicción | Las direcciones calculadas coinciden con los eventos |
| S2-5 | Cancelación | Reemplazo con el mismo `nonce`; vuelve a fallar la vieja |
| S2-6 | Gasto interno que falla | `GS013`, el `nonce` no cambia |
| S2-7 | Destinatarios | Sumar uno y quitar otro, y ver los dos efectos |
| S2-8 | Cambio de responsable | Con dos, sin el tercero |
| S2-9 | Disolución | Revoca, deshabilita y reparte; saldo final según lo aprobado |
| S2-10 | `verificarGrupo` | `ok` en uno sano; falla con guard, con otro módulo, con Roles 2.1.0 simulado por un proxy a otra mastercopy, y con un dueño extra |

## Criterios en CI

| ID | Debe pasar |
|---|---|
| S2-11 | Hash de transacción Safe contra un vector calculado en fork y guardado como fijo |
| S2-12 | Firmas en orden ascendente, y formato exacto de 65 bytes por firma |
| S2-13 | `condicionesVaqui`: orden BFS, deduplicación, 0 y 21 destinatarios rechazados |
| S2-14 | MultiSend codificado contra un vector fijo |
| S2-15 | Todo constructor devuelve etiqueta válida, y lanza con un código inválido |
| S2-16 | `clasificarError` con cada fila de la tabla |
| S2-17 | Reglas puras, incluidas la invariante de `reparto` con pruebas aleatorias y el cruce de mes en hora argentina |
| S2-18 | Importar los módulos "navegador" no carga `dotenv` ni `node:fs` |
| S2-19 | Con RPC y dirección Safe (sin `DATABASE_URL` ni APIs), se leen saldo, responsables, umbral, módulos y permisos y se construye una propuesta firmable |
| S2-20 | Manifiesto exportado/importado: detecta red, bytecode, módulo o responsables divergentes; no confía en campos del JSON sin revalidar en Celo |
| S2-21 | Dos responsables aprueban/ejecutan una transacción con la aplicación y la base desconectadas; los hashes y saldos se verifican por RPC |
