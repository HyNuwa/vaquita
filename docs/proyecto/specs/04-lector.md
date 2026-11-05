# S4 · Lector

`packages/core/src/fondo/lector.ts`. Corre dentro del proceso de S5. **La cadena manda:** el lector es el único que pasa propuestas a `ejecutada`, `cancelada` o `desactualizada`.

## Ciclo

Por defecto cada 15 segundos, por cada grupo con `safe`, excepto `disuelto`:

1. `cabeza = bloque actual - CONFIRMACIONES`. Por defecto, `CONFIRMACIONES = 5`.
2. **Reorganización:** si el hash del bloque `cursores.ultimo_bloque` difiere de `ultimo_hash`, retroceder 256 bloques, borrar los `movimientos` de esos bloques y seguir. Los estados derivados se recalculan.
3. Leer desde `ultimo_bloque + 1` hasta `cabeza`, en tramos. Tramo inicial de 2.000 bloques. Si `forno` responde con error de rango, se reduce a la mitad; con error transitorio, se espera y se reintenta.
4. En **una sola transacción de base**: insertar con `ON CONFLICT DO NOTHING`, recalcular estados y actualizar el cursor.
5. Encolar avisos con clave idempotente.

Primer ciclo de un grupo: desde `grupos.bloque_inicio`, el bloque de creación del Safe.

## Eventos

| Fuente | Filtro | Eventos |
|---|---|---|
| Safe | `address = safe` | `ApproveHash`, `SafeMultiSigTransaction`, `ExecutionSuccess`, `ExecutionFailure`, `ExecutionFromModuleSuccess`, `ExecutionFromModuleFailure`, `AddedOwner`, `RemovedOwner`, `ChangedThreshold`, `EnabledModule`, `DisabledModule`, `ChangedGuard`, `ChangedFallbackHandler` |
| Roles | `address = roles` | `AssignRoles`, `ScopeTarget`, `ScopeFunction`, `AllowTarget`, `AllowFunction`, `RevokeTarget`, `RevokeFunction`, `SetAllowance`, `SetDefaultRole`, `ConsumeAllowance` |
| wARS | `from = safe` o `to = safe` | `Transfer` |

Las firmas exactas de estos eventos se toman del ABI verificado de cada contrato, y un test en fork comprueba que cada una aparece al ejecutar la operación que la emite.

## Clasificación

| Evento | Regla | Resultado |
|---|---|---|
| `Transfer` al Safe | `from` es integrante activo en ese momento y el grupo ya estaba `activo` | `aporte`, con `integrante_id` |
| `Transfer` al Safe | Cualquier otro caso | `sin_atribucion`. No se asigna a nadie y no cuenta como cuota |
| `Transfer` desde el Safe, con `ExecutionFromModuleSuccess` en la misma tx | — | `pago_vaqui` |
| `Transfer` desde el Safe, sin lo anterior | — | `gasto` |
| Cambios en dueños, módulos, guard, handler o permisos | La `tx` coincide con una propuesta conocida | `regla` |
| Los mismos cambios | No coincide | `alerta`: aviso inmediato y nueva verificación del grupo. Si falla, Vaqui deja de pagar en ese grupo |

## Estados derivados

| Señal | Efecto |
|---|---|
| `ExecutionSuccess(hash)` de una propuesta | `ejecutada`, con la tx |
| `ExecutionFailure(hash)` | `rechazada`, porque el `nonce` se consumió; se avisa |
| `nonce()` del Safe mayor que `safe_nonce`, sin ejecución propia | `desactualizada`, salvo que la propuesta de cancelación con ese `nonce` se haya ejecutado: entonces `cancelada` |
| `ApproveHash(hash, dueño)` | Fila en `aprobaciones` |
| Cambio de dueños | Actualiza responsables. Firmas de pagos programados de un exdueño: `requiere_reaprobacion` si ya no quedan dos válidas |
| `EnabledModule`, `AssignRoles` | Avanza el asistente de creación, sin activar el grupo |

**Conciliación:** en cada ciclo con movimientos se compara con `balanceOf` en `cabeza`. Una diferencia genera una alerta para el equipo en la bitácora y no se corrige sola.

## Reconstrucción

`npm run fondo:reconstruir -- <grupoId>` borra los movimientos y el cursor del grupo, y vuelve a leer desde `bloque_inicio`. Los datos fuera de cadena no se reconstruyen, y por eso no se borran.

## Criterios de aceptación

| ID | Nivel | Debe pasar |
|---|---|---|
| S4-1 | CI | Clasificación con cada fila, con logs falsos |
| S4-2 | CI | Reprocesar el mismo tramo no duplica nada |
| S4-3 | CI | Una caída entre la inserción y el cursor no deja estado parcial |
| S4-4 | CI | Reorganización: se retrocede, se quita lo viejo, y queda igual a una lectura limpia |
| S4-5 | CI | Error de rango reduce el tramo; error transitorio no avanza el cursor |
| S4-6 | CI | Transferencia de una wallet registrada antes de `activo`: `sin_atribucion` |
| S4-7 | CI | Un aviso no se encola dos veces |
| S4-8 | Fork | Recorrido completo: cada operación de S2 da el movimiento y estado esperados |
| S4-9 | Fork | Agregar un dueño por fuera de la web da `alerta`, y Vaqui deja de pagar |
| S4-10 | Fork | Reconstrucción: mismos saldos que antes |
| S4-11 | Lectura | Medir rangos reales en `forno` y anotarlo en `docs/pruebas/fondo.md`. Ajustar el valor por defecto si hace falta |
