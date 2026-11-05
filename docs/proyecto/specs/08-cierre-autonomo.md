# S8 · Cierre autónomo

Deja todo listo para los [pasos humanos](09-pasos-humanos.md), sin transmitir nada.

## `npm run fondo:gate`

`packages/core/scripts/gate.ts` corre en orden y se detiene en el primer fallo:

1. `npm run check`
2. `npm run fondo:contratos`
3. `npm run fondo:fork`
4. `npm run build -w @vaquita/web`
5. `npm run e2e`
6. Búsqueda en el árbol con `.githooks/lib/scan-secrets.sh`: sin claves.
7. Revisa [avance.md](avance.md): ninguna casilla `- [ ]` en las secciones S1 a S8.
8. Comprueba que `LIVE_PAYMENTS` no esté definida en el proceso.

Si todo pasa, imprime exactamente `GATE OK <commit>`, con el conteo de tests. Si falla, imprime `GATE FALLA <paso>`.

## Scripts para los pasos humanos

Solo se escriben y se prueban en fork o en modo ensayo. Quien los lanza en mainnet es Maxi.

| Comando | Qué hace |
|---|---|
| `npm run fondo:wallet-operativa` | Genera la clave y la agrega a `.env` si la variable no existe. **Imprime solo la dirección.** Falla si ya existe |
| `npm run fondo:grupo-prueba` | Crea un grupo de prueba, en ensayo por defecto |
| `npm run fondo:verificar -- <grupoId>` | Corre `verificarGrupo` contra mainnet, solo lectura, y agrega el resultado a `docs/pruebas/fondo.md` |
| `npm run fondo:negativa-real -- <grupoId>` | Envía **una** negativa real (N1) con `tagged-sender`. Sin la frase, solo simula. El estimador fallaría antes de firmar, así que fija el gas a partir de un pago permitido, y un tope que no exceda los USD 0,05 |
| `npm run fondo:costos` | Saca los costos reales de las transacciones de un grupo |
| `npm run tx:verificar -- <hash>` | Existe |

**Sobre `fondo:negativa-real`:** `prepareTaggedTx` estima gas antes de firmar y una llamada que revierte no se puede estimar. Agregar a `Call` un campo opcional `gasFijo`, aceptado solo si el destino es Roles y el selector es `execTransactionWithRole`, con tests. Es el único cambio en `tagged-sender.ts`.

## Documentos

- `README.md`, `apps/web/README.md`, `apps/bot/README.md`, `.env.example` y `docs/proyecto/contexto.md` §4, con lo que existe de verdad.
- `plan-fondo-compartido.md`: estados actualizados, sólo con evidencia. Nada pasa a ⛓️.
- `docs/pruebas/fondo.md`: resultados en fork y costos medidos.
- Guion de la demo y borrador del texto de la entrega en `docs/proyecto/specs/guion-demo.md`, con lo real, lo simulado y lo que falta. Sin afirmaciones fuera de la [tabla de garantías](../spec.md#6-qué-garantizamos-y-qué-no).
- `Dockerfile` de `apps/bot`, sin secretos, con volumen para `data/`. Sin desplegarlo.

## Criterios de aceptación

| ID | Debe pasar |
|---|---|
| S8-1 | `fondo:wallet-operativa`, en una carpeta temporal: nunca imprime la clave, y falla si ya existe |
| S8-2 | Scripts que envían: sin la frase no transmiten, con un test |
| S8-3 | `gasFijo` se rechaza en cualquier otra llamada |
| S8-4 | `npm run fondo:gate` imprime `GATE OK` |
| S8-5 | Revisión aparte de todo el fondo, con hallazgos y su resolución en un PR. Se aclara que no es una auditoría |
| S8-6 | `avance.md` tiene los bloqueos y las decisiones tomadas |
