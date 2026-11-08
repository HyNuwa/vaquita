# Estado · Maximiliano

**Última actualización:** 2026-11-08

## En qué estoy
El producto cambió ([D16](../../proyecto/decisiones.md)): La Vaquita pasa a ser un fondo compartido con reglas, sobre Safe y Zodiac Roles, con Vaqui ejecutando dentro de límites en cadena. La compra colectiva queda en pausa, con su código y su evidencia. Las specs alineadas y revisadas se mergearon en el PR #22 con CI verde. S1 tiene configuración de contratos y ABI con revisión nativa aprobada y cerrada (T1). El sender local y selector seguro (T2) pasan 38 tests focalizados, check completo de 346 tests y verificación independiente directa (38 tests, typecheck y tres grupos de probes); dos intentos anteriores fallaron en preparación con cero tests. T2 ya tiene revisión nativa aprobada y cerrada. T3 lifecycle ya tiene revisión nativa aprobada y cerrada. T3b pasó la suite del repo en Anvil 1.8.7: Safe 2 de 3, configuración de Roles, proxy exacto, fondos y tiempo locales. El check pasó 363 tests y ambos typechecks; verificación independiente aprobada con 17 tests y typecheck, reutilizando evidencia del fork sin repetirlo. T3b ya tiene revisión nativa aprobada y cerrada. T4 agrega `fondo:contratos`: pasó la lectura pública de seis hashes con exit 0, 14 tests nuevos, check de 377 y ambos typechecks. Verificación independiente aprobada (14 tests, typecheck, dos escenarios del CLI con RPC loopback); espera revisión nativa. Zodiac se retiró por decisión explícita ante alertas transitivas; su checker queda pendiente humano. Esta evidencia no convierte el spike en producto completo; el script suelto previo sigue siendo solo una prueba de viabilidad ([evidencia](../../pruebas/fondo.md)).

Control: [`control-entrega.md`](../../tareas/control-entrega.md). Producto: [`spec.md`](../../proyecto/spec.md). Plan y estado de cada pieza: [`plan-fondo-compartido.md`](../../proyecto/plan-fondo-compartido.md).

## Próximo paso
Revisar T4 y cerrar la evidencia de S1, con el checker Zodiac explícitamente pendiente como paso humano. No hay código de S1 publicado ni despliegues en mainnet; la evidencia nueva corresponde solo al fork local. Seguimiento: `odd/tasks/fund-s1-contracts-fork.md`, con PRs encadenados sobre una rama integradora. Los [pasos humanos](../../proyecto/specs/09-pasos-humanos.md) siguen separados.

## Bloqueos
- Falta confirmar si Esteban y Daniel aceptan ser responsables. Si no, el piloto es una simulación (D16.20).
- Faltan contactos para las cinco entrevistas.
- Quien solo cargó wARS por Ripio no tiene con qué pagar la comisión: hay que comprobar cómo la consigue.
- Dónde corre el proceso de Vaqui y el plan gratuito de PostgreSQL están sin verificar.
- La identidad ERC-8004 sigue en una cuenta personal de MetaMask (D15.10); las operaciones del fondo salen de otra wallet (D16.25).
- Lo que toque plata se revisa con agentes, que no es una auditoría.
