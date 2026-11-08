# Estado · Maximiliano

**Última actualización:** 2026-11-08

## Estado actual · S1 integrado y primera unidad de S2

S1 quedó integrado mediante los PRs #24–#29 y el cierre documental #30.
`staging`: `01fcb81cf80ed7c64fbcc299221b2ed90fd16bf5`; CI final
42460067821 aprobada. Los originales y las revisiones cerradas se preservaron;
`main` sigue intacto. El checker Zodiac sigue pendiente humano, no aprobado.
Seguimiento de esa entrega: `odd/tasks/fund-s1-publication.md`.

Autorizado ahora: corregir el registro de avance y comenzar únicamente las
primitivas Safe y los constructores etiquetados de S2 con tests offline y revisión
independiente. Rama `feat/fund-s2-primitives`, seguimiento
`odd/tasks/fund-s2-primitives.md`. No se inicia el resto de S2, no se agregan
dependencias ni se repiten fork/RPC o acciones en mainnet. Falta el vector fijo de
fork para S2-11; las pruebas sintéticas no lo acreditan.

### Progreso local T2 · 2026-11-08
Constantes y primitivas puras implementadas: hash Safe/Celo 42220 con campos de
reembolso en cero, firmas preaprobadas de dos responsables distintos en orden
numérico y MultiSend ABI completo con llamadas internas de operación y valor cero.
RED observado por módulos ausentes; GREEN focalizado: 5 tests offline. El hash
fijo se calculó con una referencia sintética independiente, no con un fork:
S2-11 sigue pendiente. T3 y el resto de S2 no están implementados por esta unidad;
verificación independiente y revisión siguen a cargo del orquestador.

Corrección acotada S5, lote 1: el probe independiente de `encodeMultiSend([])`
falló con `TypeError: x.replace is not a function`; RED local reprodujo 1 fallo y
5 éxitos. Se codifica la lista vacía como bytes `0x`, sin una nueva restricción.
GREEN: 6 tests focalizados, 383 tests/21 archivos y ambos typechecks aprobados;
el vector no vacío se conserva. El fallo TS2345 inicial del test de variantes
quedó corregido una vez con `as const`; no se borra esa evidencia. El recheck
independiente limitado aprobó el caso vacío (1 test y probe exacto, ambos exit 0);
se conservan los PASS previos y el probe fallido. S2-11 sigue sin vector de fork.

## Resumen histórico de implementación de S1
Este resumen conserva la evidencia local anterior a la publicación; el estado
vigente de entrega y el nuevo alcance figuran arriba.

El producto cambió ([D16](../../proyecto/decisiones.md)): La Vaquita pasa a ser un fondo compartido con reglas, sobre Safe y Zodiac Roles, con Vaqui ejecutando dentro de límites en cadena. La compra colectiva queda en pausa, con su código y su evidencia. Las specs alineadas y revisadas se mergearon en el PR #22 con CI verde. S1 tiene configuración de contratos y ABI con revisión nativa aprobada y cerrada (T1). El sender local y selector seguro (T2) pasan 38 tests focalizados, check completo de 346 tests y verificación independiente directa (38 tests, typecheck y tres grupos de probes); dos intentos anteriores fallaron en preparación con cero tests. T2 ya tiene revisión nativa aprobada y cerrada. T3 lifecycle ya tiene revisión nativa aprobada y cerrada. T3b pasó la suite del repo en Anvil 1.8.7: Safe 2 de 3, configuración de Roles, proxy exacto, fondos y tiempo locales. El check pasó 363 tests y ambos typechecks; verificación independiente aprobada con 17 tests y typecheck, reutilizando evidencia del fork sin repetirlo. T3b ya tiene revisión nativa aprobada y cerrada. T4 agrega `fondo:contratos`: pasó la lectura pública de seis hashes con exit 0, 14 tests nuevos, check de 377 y ambos typechecks. Verificación independiente aprobada (14 tests, typecheck, dos escenarios del CLI con RPC loopback); revisión nativa aprobada y cerrada. El cierre funcional independiente de S1 pasó 377 tests y ambos typechecks, sin repetir fork/RPC. Los ocho criterios de aceptación quedaron documentados localmente; esa cadena se publicó e integró después, con la evidencia de CI registrada arriba. Zodiac se retiró por decisión explícita ante alertas transitivas; su checker queda pendiente humano. Esta evidencia no convierte el spike en producto completo; el script suelto previo sigue siendo solo una prueba de viabilidad ([evidencia](../../pruebas/fondo.md)).

Control: [`control-entrega.md`](../../tareas/control-entrega.md). Producto: [`spec.md`](../../proyecto/spec.md). Plan y estado de cada pieza: [`plan-fondo-compartido.md`](../../proyecto/plan-fondo-compartido.md).

## Próximo paso
Revisar nativamente T2 ya verificado independientemente; después implementar los constructores
etiquetados de T3, con migración solo del tipo `TxPersona` en la web. Sin despliegues ni
nuevas pruebas de red. Checker Zodiac y vector de fork S2-11 quedan pendientes
explícitos; los [pasos humanos](../../proyecto/specs/09-pasos-humanos.md) siguen
separados.

## Bloqueos
- Falta confirmar si Esteban y Daniel aceptan ser responsables. Si no, el piloto es una simulación (D16.20).
- Faltan contactos para las cinco entrevistas.
- Quien solo cargó wARS por Ripio no tiene con qué pagar la comisión: hay que comprobar cómo la consigue.
- Dónde corre el proceso de Vaqui y el plan gratuito de PostgreSQL están sin verificar.
- La identidad ERC-8004 sigue en una cuenta personal de MetaMask (D15.10); las operaciones del fondo salen de otra wallet (D16.25).
- Lo que toque plata se revisa con agentes, que no es una auditoría.


## Historial de publicación de S1
Las notas inferiores reflejan cada etapa; no son el estado actual.

### Rama de publicación sender · 2026-11-08
Unidad original d070eaa preservada; checks de integración y publicación en curso. Sin nuevos forks ni pagos, sin merges a staging.


### Rama de publicación harness · 2026-11-08
Unidad original f6ab375 preservada; checks de integración y publicación en curso. Sin nuevos forks ni pagos, sin merges a staging.


### Rama de publicación fixture · 2026-11-08
Unidad original 16141c7 preservada; checks de integración y publicación en curso. Sin nuevos forks ni pagos, sin merges a staging.


### Publicación S1 · 2026-11-08
Issue #23 aprobada. Tracker #24 en borrador y cinco unidades #25–#29 publicadas contra su padre inmediato; todas con CI real en verde en la primera observación. Originales y árboles productivos preservados según verificación independiente; check final local 377 tests y ambos typechecks aprobados, más 2 tests de routing. El commit documental final exige observar su nueva CI antes de entregar.

Autorización posterior recibida: revisar e integrar S1 hasta staging, sin main. Revisión Standards: 0 infracciones duras y 2 observaciones menores conocidas; revisión Spec: 0 hallazgos, 8 criterios cubiertos. Evidencia de ambas y resolución registrada en PRs #24–#29. Integración en curso desde la hoja hacia el tracker, con SHA y CI vigentes antes de cada merge y preservación de árboles/ancestros.

Hijos #29→#28→#27→#26→#25 integrados con merges preservando originales y CI nueva aprobada en cada padre. Tracker 4613546 verificado independientemente: árbol completo idéntico al candidato revisado 3527248 y todos los originales ancestros.

S1 integrado en staging: PR #24 merge e6884eba2eefe9d34489cb172574bd3878f4bd7b, después de sus cinco hijos; CI de staging 42459205485 aprobada. Árbol exacto del tracker y originales ancestros comprobados. Revisión Standards sin infracciones duras y dos menores conocidas, Spec sin hallazgos. Main intacto en 8c0df02e28f84793701a43352c6c6abe48f90a3c.

Próximo paso: decidir el siguiente alcance. Este cierre documental no inicia S2 ni cambia código. No hubo nuevos forks, RPC, pagos ni replay de revisiones nativas. Checker Zodiac y observaciones menores permanecen pendientes explícitos, sin presentarlos como aprobación o auditoría. Checker Zodiac sigue pendiente humano por la excepción acordada; no se presenta como PASS ni auditoría.
