# S8 · Cierre autónomo

Deja todo listo para los [pasos humanos](09-pasos-humanos.md), sin transmitir nada.

## `npm run fondo:gate`

`packages/core/scripts/gate.ts` corre en orden y se detiene en el primer fallo:

1. `npm run check`
2. `npm run fondo:contratos`
3. `npm run fondo:fork`
4. `npm run build -w @vaquita/web`
5. `npm run e2e`
6. `npm run fondo:independiente` (fork + web sin base/API auxiliar: recorridos I1–I4)
7. Búsqueda en el árbol con `.githooks/lib/scan-secrets.sh`: sin claves.
8. Revisa [avance.md](avance.md): sin casillas pendientes en S1–S7 ni en "Prerrequisitos del gate" de S8 (S8-1, S8-2, S8-3, S8-5, S8-6, S8-7 y S8-8). La revisión independiente final S8-5, con hallazgos resueltos, es obligatoria antes de esta corrida. La sección "Evidencia posterior al gate" (S8-4) no es prerrequisito.
9. Comprueba que `LIVE_PAYMENTS` no esté definida en el proceso.

Si todo pasa, imprime exactamente `GATE OK <commit>`, con el conteo de tests. Si falla, imprime `GATE FALLA <paso>`.

**Sin autocertificación:** el gate no marca casillas ni exige un éxito propio anterior. Solo después de observar una corrida exitosa se registra S8-4 en "Evidencia posterior al gate", con commit, salida y conteo. Esta evidencia no reemplaza los pasos 1–9 ni sus fallos en ninguna corrida posterior. S8-7 se prueba antes mediante casos negativos del gate, sin necesitar un `GATE OK` previo; la revisión S8-5 no depende de marcar S8-4.

## Scripts para los pasos humanos

Solo se escriben y se prueban en fork o en modo ensayo. Quien los lanza en mainnet es Maxi.

| Comando | Qué hace |
|---|---|
| `npm run fondo:wallet-operativa` | Genera la clave y la agrega a `.env` si la variable no existe. **Imprime solo la dirección.** Falla si ya existe |
| `npm run fondo:grupo-prueba` | Crea un grupo de prueba, en ensayo por defecto |
| `npm run fondo:verificar -- <grupoId>` | Corre `verificarGrupo` contra mainnet, solo lectura, y agrega el resultado a `docs/pruebas/fondo.md` |
| `npm run fondo:estado -- <safe|manifiesto.json>` | Reconstruye el estado financiero público por RPC, sin base de datos ni escrituras |
| `npm run fondo:independiente` | Ejecuta I1–I4 contra fork sin `DATABASE_URL`, sesión ni API auxiliar |
| `npm run fondo:negativa-real -- <grupoId>` | Envía **una** negativa real (N1) con `tagged-sender`. Sin la frase, solo simula. El estimador fallaría antes de firmar, así que fija el gas a partir de un pago permitido, y un tope que no exceda los USD 0,05 |
| `npm run fondo:costos` | Saca los costos reales de las transacciones de un grupo |
| `npm run tx:verificar -- <hash>` | Existe |

**Sobre `fondo:negativa-real`:** `prepareTaggedTx` estima gas antes de firmar y una llamada que revierte no se puede estimar. Agregar a `Call` un campo opcional `gasFijo`, aceptado solo si el destino es Roles y el selector es `execTransactionWithRole`, con tests. Es el único cambio en `tagged-sender.ts`.

## Documentos

- `README.md`, `apps/web/README.md`, `apps/bot/README.md`, `.env.example` y `docs/proyecto/contexto.md` §4, con lo que existe de verdad.
- `plan-fondo-compartido.md`: estados actualizados, sólo con evidencia. Nada pasa a ⛓️.
- `docs/pruebas/fondo.md`: resultados en fork y costos medidos.
- Guion de la demo y borrador del texto de la entrega en `docs/proyecto/specs/guion-demo.md`, con lo real, lo simulado y lo que falta. Sin afirmaciones fuera de la [tabla de garantías](../spec.md#6-qué-garantizamos-y-qué-no).
- `Dockerfile` de `apps/bot`, sin secretos, con almacenamiento operativo duradero y `OpsStore` configurado para pagos reales. No ejecutar un pagador con filesystem efímero. Sin desplegarlo.
- Manifiesto público de un grupo de prueba, documentando cómo abrir su Safe sin La Vaquita. No incluir datos privados ni secretos.

## Criterios de aceptación

| ID | Debe pasar |
|---|---|
| S8-1 | `fondo:wallet-operativa`, en una carpeta temporal: nunca imprime la clave, y falla si ya existe |
| S8-2 | Scripts que envían: sin la frase no transmiten, con un test |
| S8-3 | `gasFijo` se rechaza en cualquier otra llamada |
| S8-4 | Con prerrequisitos acreditados y S8-4 aún pendiente, `npm run fondo:gate` imprime `GATE OK`; solo entonces se registra esa evidencia. Una casilla de prerrequisito pendiente o un paso fallido produce `GATE FALLA <paso>`, aunque haya un éxito anterior |
| S8-5 | Revisión final de todo el fondo por un subagente de Claude nuevo, sin el contexto de la implementación, con hallazgos y su resolución en un PR. Se aclara que no es una auditoría |
| S8-6 | `avance.md` tiene los bloqueos y las decisiones tomadas |
| S8-7 | El gate falla si no pasan I1–I4, si el modo independiente requiere `DATABASE_URL` o si editar una fila auxiliar habilita permisos financieros |
| S8-8 | La documentación distingue saldos/reglas on-chain de datos privados/programación externa y explica recuperación vía Safe/manifiesto |
