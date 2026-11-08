# Avance de las specs

Se actualiza en el mismo PR que hace el trabajo. Una casilla se marca solo cuando pasan sus criterios.

## Regla Web3-first de aceptación

- [ ] Web3-first: núcleo financiero operable con wallet + RPC sin `DATABASE_URL` ni sesión; prueba I1–I4.
- D16 y `spec.md` alineados documentalmente con Web3-first en esta corrección; `contexto.md` y `stack.md` precisan sus dependencias. Revisión independiente documental completada según el registro inferior; no equivale a S8-5. Esto no marca criterios funcionales ni de revisión del código como cumplidos.

## S1 · Contratos y fork
- [x] Criterios S1-1 a S1-8 — verificados localmente el 2026-11-08; código aún sin publicar.

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
cierre de S8. Push, PRs, CI remota e integración en `staging` siguen pendientes
de la decisión de publicación.

## S2 · Core del fondo
- [ ] Negativas N1 a N14
- [ ] Criterios S2-1 a S2-21

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
- **Entrega de S1:** unidades locales verificadas y revisadas; publicación de la
  cadena y CI remota aún no ejecutadas.
