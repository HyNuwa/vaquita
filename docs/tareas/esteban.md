# Tareas · Esteban

> **1/11 · La toma Maxi, por D12:** todas estas tareas pasaron a [maximiliano.md](maximiliano.md), con fechas nuevas. Esteban sigue como colaborador opcional, sin tareas asignadas: si toma alguna, se acuerda con Maxi y se anota allá. Lo de abajo queda como referencia y no es el plan vigente.

**Rol:** colaborador opcional. Antes, cadena y pagos.

## Plan anterior, traspasado (25/10)

Fuente: [D11](../proyecto/decisiones.md), [plan vigente](../proyecto/plan-compra-colectiva.md) y su [checklist de tests](../proyecto/plan-compra-colectiva.md#4-checklist-de-tests-en-foundry).

| Etapa | Tarea | Estado |
|---|---|---|
| 25–29/10 | Spike original sin cambios: wARS, autorización exacta, `transferFrom`, tag desde móvil y conciliación; registrar resultado y peor caso de gas | Sin resultado registrado |
| 25–29/10 | Probar `permit` real: el ABI lo expone, falta firma válida con dominio, nonce, total y vencimiento correctos; compromiso propio en cadena | Pendiente |
| 25–29/10 | Primer pago real mínimo con tag verificado y registro ERC-8004; verificar wallet de inscripción | Sin resultado registrado |
| 29/10–2/11 | `CompraColectiva` y fábrica sin admin ni upgrades, términos inmutables, lista acotada y tope $ 5.000 incluido cargo; cancelar irreversible, ejecutar una vez y vencer | Pendiente, condicionado al spike |
| 29/10–2/11 | Foundry: mínimo−1/mínimo/máximo, sobreventa y selección; revocación, cancelación y recarga; doble ejecución; firmas inválidas; token pausado y bloqueos; reentrancia; gas; invariantes y ERC-8021/CIP-64 | Pendiente |
| 29/10–2/11 | Lector de eventos para `compra/`: hash + índice de log, bloque y campaña; reprocesamiento y confirmaciones sin doble conteo | Pendiente |
| 2/11 | Revisión cruzada con Maxi; resolver hallazgos antes de mainnet | Pendiente |
| 3–6/11 | Despliegue y verificación en Celo mainnet; probar tag, CIP-64 y wallet móvil; campaña real chica con core, bot y web | Pendiente, sujeto a tests y revisión |
| 7–8/11 | Evidencias: despliegues, código verificado, compromisos, ejecución, importes y cargo; `verifyTx`, ERC-8004 y enlaces para video y entrega | Pendiente |

**Hitos:** resultado del spike al 29/10; contrato probado y revisado al 2/11; campaña comprobable y congelamiento al 6/11. Si falla el spike: compromiso y transferencias P2P directas registrados por el agente, sin ejecución atómica; pierde la prueba del profesor. No tratarlo como equivalente.

Las pruebas de x402 (D8) y Ripio (D9) siguen pendientes, sin reemplazar el compromiso propio de cada comprador ni bloquear este recorrido. Las pruebas automáticas no tocan red; el spike y las evidencias reales se registran aparte. Terceros solo con tests, revisión, montos chicos y riesgos escritos (D11.5).

## Hecho (en pausa por D11)

El plan anterior no registraba `JuntaReglas` como terminado: queda reemplazado por `CompraColectiva`. No se marca como hecho un resultado del spike ni de x402/Ripio que no está documentado. El motor de juntas y sus tests se conservan en pausa; el pipeline de envío, política e identidad ya existentes siguen vigentes.

## Entregables

- Resultado del spike y firma real de `permit`, con limitaciones y evidencia, en `docs/pruebas/`.
- Contrato y fábrica con Foundry, fuzzing, invariantes y revisión cruzada; lector integrado con `compra/`.
- Mainnet con tag ERC-8021, CIP-64 y topes; identidad ERC-8004 antes del **9/11, 09:00 GMT (06:00 ART)**.
- Evidencias listas para el envío del **8/11 antes de 20:00 ART**, sin secretos ni datos personales.
