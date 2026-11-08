# Evidencia del fondo compartido

Lo que no está acá no está probado. Las transacciones de esta página corrieron en un **fork local**: no existen en mainnet.

## Suite S1 del repositorio · 2026-11-08 · fork local

`npm run fondo:fork` pasó con Anvil 1.8.7: un test de integración, 30,12 s.
Se verificaron los seis hashes de referencia antes de financiar cuentas nuevas;
se crearon Safe y Roles mediante el selector y el sender etiquetado de fork.
Las assertions comprobaron tres responsables generados, umbral 2, dueño/avatar/target
de Roles iguales al Safe y runtime exacto del proxy. También pasaron la carga
local de wARS y USDC y el avance del tiempo.

El check completo pasó 363 tests y los typechecks de core/web. Una verificación
independiente ejecutó 17 tests focalizados, typecheck del core y probes en memoria;
inspeccionó las assertions y reutilizó el resultado del fork anterior: **no ejecutó
otro fork**. T3b quedó en el commit local `16141c7`: revisión nativa de
resiliencia, legibilidad y confiabilidad aprobada y cerrada mediante acknowledgement.
La observación informativa sobre el contexto sanitizado del diagnóstico queda
separada; no abrió una corrección ni reabre la revisión.

Dos corridas previas fallaron por timeout; el diagnóstico localizó el fallo en
`anvil_dealERC20`. Se cambió exclusivamente su plazo de solicitud de 1 a 30 segundos,
con test determinista; readiness y demás consultas conservan sus límites. Los
intentos fallidos se conservan en `odd/tasks/fund-s1-contracts-fork.md`.
No se observó Anvil activo después de la corrida exitosa.

Esta evidencia cubre S1-5/S1-6 en fork, no permisos completos, concurrencia,
CIP-64 ni despliegues en mainnet. El comando independiente `fondo:contratos`,
el checker Zodiac y el cierre total de S1 seguían pendientes al cerrar T3b;
la sección siguiente registra el avance de T4.

## Verificador S1 del repositorio · 2026-11-08 · solo lectura

`npm run fondo:contratos` terminó con **exit 0** (6 s): RPC respondió chainId
42220 y los seis hashes de código coincidieron con `contratosFondo(42220)`.
El CLI imprimió una fila por contrato con dirección pública, hash esperado,
observado y resultado; no carga claves, archivos de entorno, wallet, backend o
base de datos. Un fallo de lectura, otra red, código ausente o hash diferente
produce exit 1; no hay reintentos automáticos. Tests nuevos: 14; check completo:
377 tests y typechecks core/web aprobados. Verificación independiente aprobada:
14 tests, typecheck y dos escenarios del CLI real con RPC loopback (otra red y
código ausente), comprobando exit/stdout/stderr y solo métodos de lectura.
El éxito RPC público usa la evidencia de mi corrida, no una repetición del
verificador. Revisión nativa de T4 pendiente.

**Bloqueo / paso humano:** `sanityCheckZodiacModuleAddress` no fue ejecutado.
Zodiac 5.0.1 se instaló sin scripts y luego se retiró por decisión explícita del
responsable ante alertas de seguridad en su árbol transitivo. Su función es un
chequeo síncrono de registro/direcciones defectuosas, no una verificación RPC.
La auditoría completa terminó con exit 1 y reportó 36 vulnerabilidades en todo
el árbol, no todas atribuibles a la instalación. No se aplicó `audit fix`,
downgrade ni override. Los 26 paquetes agregados se retiraron offline, sin
scripts; `packages/core/package.json` y `package-lock.json` quedaron idénticos
al estado previo. Toda tabla completada avisa en stderr que el checker humano está
pendiente, incluso con exit 0 por los hashes. Los rechazos tempranos de
configuración o chainId imprimen únicamente el error correspondiente. Esto no es una auditoría ni prueba
permisos efectivos; no se repitió el fork de T3b.

## Contratos en Celo · 2026-11-04 · solo lectura

| Contrato | Resultado |
|---|---|
| SafeL2, SafeProxyFactory, CompatibilityFallbackHandler y MultiSendCallOnly 1.4.1 | `keccak256` del código igual al `codeHash` publicado en safe-deployments |
| Roles 2.1.1 y fábrica de módulos 1.2.0 | Direcciones oficiales. Código idéntico en Celo, Gnosis y Ethereum |

**Sin hacer todavía:** compilar el código fuente de Roles y comparar, `sanityCheckZodiacModuleAddress` y el checker oficial. Hashes en [S1](../proyecto/specs/01-contratos-y-fork.md).

## Viabilidad en fork · 2026-11-04

Script de una sola corrida, [`spike-fondo-fork.cjs`](spike-fondo-fork.cjs): anvil 1.8.7 con `--celo`, bloque 81941077 y wARS real. **No es el código del producto:** la implementación y sus pruebas son [S1 y S2](../proyecto/specs/README.md).

### Funcionó

- Crear el Safe 2 de 3 y desplegar Roles 2.1.1 con el Safe como dueño, avatar y target.
- Lote con `MultiSendCallOnly`: habilitar Roles, presupuesto, permisos y rol de Vaqui.
- `approveHash` y `execTransaction` con firmas preaprobadas y etiqueta ERC-8021 en cada transacción.
- Pago de Vaqui con `execTransactionWithRole`.
- Cambiar destinatarios, cambiar un responsable sin el tercero, y revocar.

### Rechazos

| Caso | Resultado |
|---|---|
| $ 5.000 exactos | Pasa |
| Destinatario no autorizado | `ConditionViolation` status 5 |
| $ 5.000 + 1 wei | status 9 |
| Otro token | status 2 |
| `approve` y `transferFrom` | status 3 |
| `delegatecall` | status 1 |
| Con valor | status 4 |
| Presupuesto agotado | status 17 |
| Rol ajeno | `NoMembership` |
| Otra cuenta | `NotAuthorized` |
| Después de revocar | `NoMembership` |
| Una sola firma | `GS020` |
| Propuesta vieja tras el reemplazo | `GS025` |

### Lo que corrige el plan

- **Peor caso confirmado:** $ 20.000 en cinco pagos, se adelanta el tiempo 30 días, otros $ 20.000 en cuatro. Total: $ 40.000.
- **Gasto interno que falla:** con `safeTxGas` y `gasPrice` en cero, la transacción **revierte con `GS013` y no consume el `nonce`**. Antes dábamos por hecho que emitía `ExecutionFailure`.
- **Frecuencia:** no se limita en cadena en esta configuración. "Frecuencia" significa presupuesto cada 30 días y tope por pago.
- **CIP-64:** anvil lo rechaza con `Invalid parameters`, así que se prueba solo en mainnet.
- **Roles v3:** la rama principal del repo de Zodiac ya es v3. No sirve como referencia de API para 2.1.1, que no permite leer permisos: se comprueban con eventos y simulación.

### Costos estimados

Gas medido en el fork, con precios de `forno` de ese momento. **No son costos reales en mainnet**, y una transacción CIP-64 suma gas extra.

| Operación | Gas | CELO | USD aprox. |
|---|---|---|---|
| Crear el Safe | 306.307 | 0,0620 | 0,0045 |
| Desplegar Roles | 191.282 | 0,0387 | 0,0028 |
| `approveHash` | 53.259 | 0,0108 | 0,0008 |
| Lote de reglas, un destinatario | 454.498 | 0,0920 | 0,0068 |
| Pago de Vaqui | 130.877 a 147.965 | 0,0265 a 0,0300 | 0,0019 a 0,0022 |
| Aporte | 44.292 | 0,0090 | 0,0007 |
| Reemplazo vacío | 61.763 | 0,0125 | 0,0009 |
| Cambiar destinatarios | 260.457 | 0,0527 | 0,0039 |
| Cambiar responsable | 92.170 | 0,0187 | 0,0014 |
| Revocar | 78.558 | 0,0159 | 0,0012 |

### No se probó

Mainnet, CIP-64 con Roles, la disolución completa, billeteras reales y la concurrencia.

## Mainnet

Sin transacciones todavía.
