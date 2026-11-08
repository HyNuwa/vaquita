# Avance de las specs

Se actualiza en el mismo PR que hace el trabajo. Una casilla se marca solo cuando pasan sus criterios.

## Regla Web3-first de aceptación

- [ ] Web3-first: núcleo financiero operable con wallet + RPC sin `DATABASE_URL` ni sesión; prueba I1–I4.
- D16 y `spec.md` alineados documentalmente con Web3-first en esta corrección; `contexto.md` y `stack.md` precisan sus dependencias. Revisión independiente documental completada según el registro inferior; no equivale a S8-5. Esto no marca criterios funcionales ni de revisión del código como cumplidos.

## S1 · Contratos y fork
- [x] Criterios S1-1 a S1-8 — verificados e integrados en `staging` el 2026-11-08, con la excepción humana del checker indicada abajo.

Unidades locales: T1 `50fd2e7`, T2 `d070eaa`, T3 `f6ab375`, T3b `16141c7`
y T4 `6314087`, cada una con revisión nativa aprobada y cerrada. Verificación
final independiente: **377 tests y typechecks core/web**, exit 0. El fork de T3b
pasó una vez (30,12 s); `fondo:contratos` pasó con chainId 42220 y seis hashes
coincidentes. Ambos resultados de red son ejecuciones del autor inspeccionadas
independientemente, no nuevas corridas del verificador. Evidencia y límites:
[`docs/pruebas/fondo.md`](../../pruebas/fondo.md).

**Excepción autorizada:** `sanityCheckZodiacModuleAddress` sigue pendiente humano.
El responsable eligió retirar Zodiac 5.0.1 ante alertas transitivas; la dependencia
y los cambios de lockfile se retiraron sin tocar otras dependencias. No equivale
a un checker aprobado, auditoría, permisos efectivos completos, pruebas I1–I4 ni
cierre de S8.

**Entrega observada:** PRs #24–#29 integrados preservando los commits originales;
PR #24 llegó a `staging` como `e6884eba2eefe9d34489cb172574bd3878f4bd7b`.
El cierre documental #30 dejó `staging` en
`01fcb81cf80ed7c64fbcc299221b2ed90fd16bf5`; CI final
[42460067821](https://github.com/HyNuwa/vaquita/actions/runs/42460067821)
aprobada. Revisión independiente sin bloqueantes, con observaciones menores
separadas. `main` no se integró y no hubo nuevas corridas de fork/RPC.
Seguimiento completo: `odd/tasks/fund-s1-publication.md`.

## S2 · Core del fondo
- [ ] Negativas N1 a N14
- [ ] Criterios S2-1 a S2-21

Primera unidad autorizada: primitivas Safe y constructores etiquetados aptos para
navegador, con pruebas offline y revisión independiente. No incluye el resto de
S2 ni nuevas corridas de fork/RPC. Seguimiento: `odd/tasks/fund-s2-primitives.md`.
Implementación local de esa unidad: constantes, hash Safe, firmas preaprobadas,
MultiSend y los constructores `aportar`, `aprobarHash` y `ejecutarPropuesta`;
`TxPersona` sustituye solo el tipo usado por la firma web. Check final: 408 tests
y typechecks core/web aprobados; verificación funcional independiente aprobada.
La prueba de navegador cubre el recorrido de dependencias del core e imports
públicos, no un bundle ni los futuros lector/verificador de S2-18. No se marcan
S2-15 ni S2-18 completos por estos tres constructores. La evaluación nativa está
bloqueada por la declaración de archivos no rastreados; no hay revisión nativa
aprobada ni publicación de esta unidad.
S2-11 necesita un vector fijo con procedencia de fork; no se encontró uno en la
evidencia revisada. Un vector sintético no cierra ese criterio.

## S3 · Datos, acceso y API
- [ ] Criterios S3-1 a S3-18

## S4 · Lector
- [ ] Criterios S4-1 a S4-14

## S5 · Vaqui y pagos programados
- [ ] Criterios S5-1 a S5-21

## S6 · Web
- [ ] Recorridos E1 a E12 y Web3-first I1 a I4
- [ ] Criterios S6-1 a S6-10

## S7 · Bot y LLM
- [ ] Criterios S7-1 a S7-11

## S8 · Cierre autónomo

### Prerrequisitos del gate
- [ ] Criterios S8-1 a S8-3
- [ ] S8-5: revisión independiente final, con hallazgos y resolución
- [ ] Criterios S8-6 a S8-8

### Evidencia posterior al gate
- [ ] S8-4: corrida exitosa observada de `npm run fondo:gate`, con commit, salida y conteo

S8-4 se registra solo después del éxito; no se exige para la primera corrida. El gate exige S1–S7 y todos los prerrequisitos de S8, incluida S8-5, y vuelve a ejecutar sus comprobaciones en cada corrida. Ninguna casilla de este archivo se marca por esta corrección documental.

## Decisiones tomadas

### Revisión independiente de las specs sobre la base `8d54393`

Un subagente `gentle-ai-verify`, separado del autor de los cambios, leyó las specs 01–09, README, avance y sus fuentes de autoridad. Aprobó la alineación documental e identificó tres contradicciones preexistentes, corregidas en una sola tanda:

| Hallazgo | Corrección | Comprobación independiente |
|---|---|---|
| Recuperación podía ordenar retransmitir sin explicitar modo real | S5 exige frase exacta, persistencia y bloqueo vigentes también al recuperar; en ensayo conserva el envío sin transmitir ni volver a firmar | Resuelto documentalmente; S5-3, S5-6 y S5-19 especifican los escenarios |
| Gate exigía acreditar su propio éxito previo | S8-4 se registra después del gate; S8-5 y los restantes prerrequisitos siguen siendo obligatorios antes | Resuelto documentalmente; primera corrida posible sin autocertificación |
| Lectura/verificación incompatibles con el cliente independiente | S2 declara módulos RPC aptos para navegador, con dependencias inyectadas y adaptadores de servidor separados | Resuelto documentalmente; S2-18 incluye dependencias transitivas |

La comprobación posterior se limitó a estos tres hallazgos y los dio por resueltos. `git diff --check` pasó. No hubo tests, builds, fork ni operaciones en mainnet: no se acreditan criterios funcionales, S8-5 ni una auditoría. Evidencia de ejecución de revisión: tareas locales `mw714cjv-4-j9oj` (revisión completa) y `mw719yh5-6-q3ck` (comprobación dirigida). La CI del candidato actualizado debe observarse después de publicarlo; esta revisión no autoriza push ni merge.

Las que la regla de ambigüedad haya resuelto durante la ejecución: fecha, decisión y motivo.

## Bloqueos

Lo que necesita a una persona: pieza, error exacto y qué se hizo mientras tanto.

- **S1, checker Zodiac:** `sanityCheckZodiacModuleAddress` no ejecutado. Zodiac
  5.0.1 retirado por decisión explícita ante alertas de seguridad transitivas;
  comprobación obligatoria de red/seis hashes completada sin SDK. El checker
  queda como paso humano, no se instala otra versión ni se aplica `audit fix`.
- **S2-11, vector de hash:** falta un vector fijo obtenido del fork. Las pruebas
  offline pueden verificar la implementación local, pero no reemplazan esa
  procedencia ni autorizan otra corrida de red.
