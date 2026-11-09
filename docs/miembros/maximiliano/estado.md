# Estado · Maximiliano

**Última actualización:** 2026-11-08

## Foco vigente · creación/configuración S2 publicada, sin merge
Cadena publicada y confirmada: #36 C1/ancla en borrador hacia staging (1a50eba), #37 C2 hacia el ancla (4848324), #38 C3/cierre hacia C2. `feat/fund-s2-create-rules` conserva c27a141, preparación ef5a63a y este recibo pasivo; la cabeza exacta y su CI vigente se consultan en el PR #38. Originales y rama fuente `feat/fund-s2-create` preservados. Cada PR usa `Refs #35` no cerrante y exactamente un `type:feature`.
CI de las tres cabezas fuente observada en verde, primer intento: 42544945983/42544951761/42544959291. Verificación independiente mw8kgjuc-p-n2k8 y tres guardas completas por SHA aprobadas; deltas iniciales 311/265/319. Registro actual solo documental, sin cambiar producción, tests, configuración ni historia. Se conserva el rechazo de privilegios y la corrección DACL explícitamente autorizada, sin elevación; temporales privados eliminados y ninguna configuración privada leída.
Seguimiento: `odd/tasks/fund-s2-creation-publication.md`; recibo de la cabeza documental final/CI en #38. Próximo paso: decisión humana separada de revisión/integración y, por separado, eventual fork. Sin merge, fork/RPC, dinero, dependencias, cambios del harness ni nueva autoridad nativa; issues23/31/35 abiertas. Permisos desplegados, verificador/bundle completos, S2-11, checker Zodiac y aceptación completa de S2 siguen fuera de esta entrega.

## Historial del cierre offline anterior a la autorización de publicación
Las restricciones de no publicación que siguen describen aquella etapa; el alcance vigente es el indicado arriba. Se conservan todas las pruebas, fallos y recuperaciones.

## Unidad offline de creación/configuración verificada
Primera unidad integrada en staging `c16f081029e761371968a9750a480e26c45b9fe3`: PRs #34, #33 y #32 mergeados en ese orden, árbol revisado exacto y CI final 42527864054 aprobada. Main, ramas e historia original preservados; issues23/31 siguen abiertas.
Rama local nueva sin publicar: `feat/fund-s2-create`. C1 puro implementado: setup/predicción de ambas direcciones y constructores `crearSafe`/`desplegarRoles` con etiqueta exterior. Valida tres responsables distintos, no nulos y ajenos a ambas cuentas suministradas de Vaqui; no consulta ni afirma la identidad real de esas cuentas en cadena. RED 21 fallos/30 éxitos; GREEN 51 focalizados, 428 completos y typechecks core/web aprobados.
C1 pasó la nueva verificación independiente mw8gqnjj-i-qe2c: 51 tests focalizados, 12 probes públicos aislados y typecheck core, exit0; revisión de creación/Standards-dinero sin hallazgos. Los 85 archivos del payload y originales permanecieron idénticos. Los 428 tests completos y tipos web siguen siendo evidencia del autor.
C1 confirmado localmente en `1a50ebaefe9afc9a72df755dbf64579d381fe0a3` (311 líneas, sin publicar). C2 implementado: `planCreation` devuelve solo despliegues faltantes tras autenticar referencias y verificar estado a un bloque fijo; una lista vacía no declara permisos ni fondo activo. RED por módulo ausente; GREEN 79 focalizados, 456 completos y tipos core/web aprobados (jobs47/48). C2 pasó verificación independiente mw8hysz3-k-o9te: 92 tests (79 focalizados + 13 probes), tipos core y revisión de dinero/especificación sin hallazgos; los 87 originales/copias, HEAD y estado quedaron idénticos. Los 456 completos y tipos web son evidencia del autor. C2 confirmado localmente en `4848324c90b7aa9f8828d014ab85916ed0374dd5` (265 líneas, sin publicar).
C3 implementado: condiciones BFS y lote inicial puro de cinco llamadas; GREEN job52 de 94 focalizados/471 completos/tipos core+web. El primer GREEN falló en cuatro expectativas del test (tabla y representación hexadecimal); corregidas sin cambiar producción. C3 pasó verificación independiente mw8insc2-m-ivo4: 110 tests (94 focalizados + 16 probes), tipos core y revisión de dinero/especificación sin hallazgos; 89 originales/copias, HEAD y estado idénticos. C3 confirmado en `5d96d52bb1d0ba7359e27c8e68a861e0ccebcfc9` (226 líneas). Las tres unidades suman 802 líneas, cada una menor a 400, con hooks normales. Evidencia combinada en `docs/pruebas/fondo.md` y `docs/proyecto/specs/avance.md`. Próximo paso: decisión humana de publicación/revisión y, separadamente, eventual fork autorizado; no nuevas acciones automáticas. Seguimiento: `odd/tasks/fund-s2-creation.md`.
Bloqueos actuales: ninguno técnico. Se conservan el timeout previo de preparación (cero tests) y el rechazo posterior del preflight por la guarda, sin bypass; el nuevo intento C1 fue autorizado y preparado por lista blanca (85 archivos/365KB, dependencias vinculadas). No hizo falta leer configuración privada. C1/C2/C3 completos en commits locales sin publicar; pruebas offline y revisiones independientes aprobadas. No se declaran permisos desplegados, verificador completo ni S2 completo. No se autorizan nuevos fork/RPC público, movimientos reales, dependencias, evaluación nativa ni publicación de esta implementación. El checker Zodiac, S2-11 y la aceptación completa de S2 siguen pendientes y no se declaran aprobados.

## Historial anterior a la integración
Las secciones siguientes conservan la evidencia de sus etapas anteriores: sus cabezas, PRs abiertos y restricciones de no-merge describen esos momentos, no el foco vigente autorizado arriba.

## Publicación de la primera unidad S2 · 2026-11-08
Foco actual: publicación de la primera unidad S2 confirmada en #32 (tracker en borrador), #33 (primitivas) y #34 (builders/cierre), con `Refs #31`. CI de sus cabezas fuente aprobada: 42521590056, 42521660779 y 42521825595. Hooks/guardas, verificación independiente de CI y preservación estructural aprobados; ningún PR mergeado ni push a staging/main.
Wrapper de primitivas: fuente exacta e5, CI del tracker, 2 tests de routing, 6 focalizados, 383 completos y ambos typechecks aprobados; delta final de 381 líneas. Wrapper builders: fuente f4/CI del tracker exactas, 2 tests de routing, 96 focalizados, 408 completos y ambos typechecks aprobados. Verificación estructural independiente aprobada: fuentes exactas, cinco originales ancestros y bitácoras/diagnóstico preservados; presupuestos fuente 48/381/348 y primer cierre pasivo del hijo 357 líneas. Próximo paso: observar CI del nuevo registro documental y persistir recibos finales en los PRs antes de entregar; después corresponde una nueva decisión de alcance, no un merge automático.
Seguimiento: `odd/tasks/fund-s2-publication.md`. El registro inferior conserva íntegra la etapa fuente f4b2bb2 y su diagnóstico/cierre corregido; sus referencias a no publicación describen aquel momento histórico. No se declara revisión nativa aprobada ni S2 completo.

## Estado actual · S1 integrado y primera unidad de S2

S1 quedó integrado mediante los PRs #24–#29 y el cierre documental #30.
`staging`: `01fcb81cf80ed7c64fbcc299221b2ed90fd16bf5`; CI final
42460067821 aprobada. Los originales y las revisiones cerradas se preservaron;
`main` sigue intacto. El checker Zodiac sigue pendiente humano, no aprobado.
Seguimiento de esa entrega: `odd/tasks/fund-s1-publication.md`.

Primera unidad de S2 implementada y cerrada localmente: primitivas Safe y
constructores etiquetados, con tests offline y revisión funcional independiente.
La corrección documental posterior fue autorizada expresamente.
Rama `feat/fund-s2-primitives`, seguimiento
`odd/tasks/fund-s2-primitives.md`. No se inicia el resto de S2, no se agregan
dependencias ni se repiten fork/RPC o acciones en mainnet. Falta el vector fijo de
fork para S2-11; las pruebas sintéticas no lo acreditan.

### Progreso local T2 · 2026-11-08
Constantes y primitivas puras implementadas: hash Safe/Celo 42220 con campos de
reembolso en cero, firmas preaprobadas de dos responsables distintos en orden
numérico y MultiSend ABI completo con llamadas internas de operación y valor cero.
RED observado por módulos ausentes; GREEN focalizado: 5 tests offline. El hash
fijo se calculó con una referencia sintética independiente, no con un fork:
S2-11 sigue pendiente. T2 no incluye T3 ni el resto de S2; la implementación y
verificación de T3 se registran por separado abajo.

Corrección acotada S5, lote 1: el probe independiente de `encodeMultiSend([])`
falló con `TypeError: x.replace is not a function`; RED local reprodujo 1 fallo y
5 éxitos. Se codifica la lista vacía como bytes `0x`, sin una nueva restricción.
GREEN: 6 tests focalizados, 383 tests/21 archivos y ambos typechecks aprobados;
el vector no vacío se conserva. El fallo TS2345 inicial del test de variantes
quedó corregido una vez con `as const`; no se borra esa evidencia. El recheck
independiente limitado aprobó el caso vacío (1 test y probe exacto, ambos exit 0);
se conservan los PASS previos y el probe fallido. S2-11 sigue sin vector de fork.

### Progreso local T3 · 2026-11-08
Constructores puros `aportar`, `aprobarHash` y `ejecutarPropuesta` implementados
con código explícito, etiqueta exterior y `TxPersona` de dos campos. Ejecución
reutiliza los ceros de T2 sin modificar cuerpo ni firmas; aporte transfiere wARS
sin aplicar topes del agente. Web: solo import y anotación de tipo, compra intacta.
RED: suite de constructores sin tests por módulo ausente, 2 fallos de frontera y
4 tests de compra aprobados. GREEN: 29 focalizados; suite completa 408/23 archivos
y typechecks core/web aprobados. Recorrido estático de imports del core y probe
público aprobados para constantes/Safe/constructores; no es bundle navegador ni
prueba de los futuros lector/verificador (S2-18 completo pendiente).
T2 conserva su verificación independiente aprobada. Se conservan las tres
fallas de evaluación nativa por declaración de archivos no rastreados; no son
PASS ni crearon START/lineage.
T3 pasó verificación independiente: 29 tests focalizados, 2 probes públicos y
typecheck core en estado aislado con imports resueltos al candidato. Un probe
opcional de igualdad del JS no pudo ejecutarse por `TypeError: Cannot read
properties of undefined (reading 'ES2022')`; no se reintentó ni se afirma PASS.
La comparación estructural confirma solo los dos cambios de tipo en la web.
Check final del autor: 35 focalizados, 408 tests/23 archivos y ambos typechecks,
exit 0; diffcheck y actualización AST del grafo aprobados.
Diagnóstico estático posterior: ASSESS no adopta la selección de INSPECT y las
llamadas no llevaban declaración propia; el rango comprometido sí se transmitía.
El fallo no estableció `reviewDue` ni un gate obligatorio adicional. El plan de
respaldo para el riesgo de seguridad exige checks del autor y verificación
independiente, ambos ya aprobados. Se corrige la inferencia de bloqueo, sin
convertir los fallos en revisión nativa aprobada ni repetir evaluaciones.
La primera unidad queda cerrada solo en ese alcance local. S2-11 sigue pendiente
por falta de vector de fork y checker Zodiac pendiente humano.

## Resumen histórico de implementación de S1
Este resumen conserva la evidencia local anterior a la publicación; el estado
vigente de entrega y el nuevo alcance figuran arriba.

El producto cambió ([D16](../../proyecto/decisiones.md)): La Vaquita pasa a ser un fondo compartido con reglas, sobre Safe y Zodiac Roles, con Vaqui ejecutando dentro de límites en cadena. La compra colectiva queda en pausa, con su código y su evidencia. Las specs alineadas y revisadas se mergearon en el PR #22 con CI verde. S1 tiene configuración de contratos y ABI con revisión nativa aprobada y cerrada (T1). El sender local y selector seguro (T2) pasan 38 tests focalizados, check completo de 346 tests y verificación independiente directa (38 tests, typecheck y tres grupos de probes); dos intentos anteriores fallaron en preparación con cero tests. T2 ya tiene revisión nativa aprobada y cerrada. T3 lifecycle ya tiene revisión nativa aprobada y cerrada. T3b pasó la suite del repo en Anvil 1.8.7: Safe 2 de 3, configuración de Roles, proxy exacto, fondos y tiempo locales. El check pasó 363 tests y ambos typechecks; verificación independiente aprobada con 17 tests y typecheck, reutilizando evidencia del fork sin repetirlo. T3b ya tiene revisión nativa aprobada y cerrada. T4 agrega `fondo:contratos`: pasó la lectura pública de seis hashes con exit 0, 14 tests nuevos, check de 377 y ambos typechecks. Verificación independiente aprobada (14 tests, typecheck, dos escenarios del CLI con RPC loopback); revisión nativa aprobada y cerrada. El cierre funcional independiente de S1 pasó 377 tests y ambos typechecks, sin repetir fork/RPC. Los ocho criterios de aceptación quedaron documentados localmente; esa cadena se publicó e integró después, con la evidencia de CI registrada arriba. Zodiac se retiró por decisión explícita ante alertas transitivas; su checker queda pendiente humano. Esta evidencia no convierte el spike en producto completo; el script suelto previo sigue siendo solo una prueba de viabilidad ([evidencia](../../pruebas/fondo.md)).

Control: [`control-entrega.md`](../../tareas/control-entrega.md). Producto: [`spec.md`](../../proyecto/spec.md). Plan y estado de cada pieza: [`plan-fondo-compartido.md`](../../proyecto/plan-fondo-compartido.md).

## Próximo paso
Decidir por separado la publicación de esta unidad o el siguiente alcance de S2;
no se ejecutan automáticamente. Código local en `e5f72e7` (primitivas) y `80b9bf7`
(constructores y tipo web), con hooks normales y verificación funcional
independiente aprobada. No hay revisión nativa aprobada, push/PR ni integración
de S2. La mejora del contrato público de ASSESS pertenece a Gentle Pi y queda
como trabajo separado; no se parchea la instalación global ni se reintenta por
esta corrección documental. RDD y los presupuestos no cambian.
Sin despliegues ni nuevas pruebas de red. Checker Zodiac y vector de fork S2-11
quedan pendientes explícitos; los [pasos humanos](../../proyecto/specs/09-pasos-humanos.md)
siguen separados.

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
