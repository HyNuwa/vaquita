# Tareas · Esteban

**Rol:** cadena y pagos. Envío taggeado, identidad ERC-8004, atribución, pruebas de x402 y de Ripio, manejo de claves y secretos (plan del equipo v2, sección 5). Revisión cruzada: Maxi.

> Maxi coordina las tareas del equipo y puede tomar cualquiera de esta lista para llegar a la entrega. Si la toma, la marca acá como "La toma Maxi" y lo avisa en el PR ([README](README.md)).

## Archivos y módulos bajo tu responsabilidad

- `packages/core/src/chain/`, `identity/`, `payments/`, `config/`
- `packages/core/scripts/`
- `contracts/`, si el spike de D7 pasa

## Plan

Fuente: `docs/proyecto/plan-del-equipo.md` (sección 6) y `docs/proyecto/decisiones.md` (24/10).

| Etapa | Tarea | Estado |
|---|---|---|
| 21–23/10 | Pago real con tag, identidad ERC-8004 y prueba de x402 (G1, D8) | Sin registrar |
| 21–23/10 | Spike del contrato de reglas: wARS, autorización por aporte, `transferFrom`, tag desde el móvil y conciliación (condición de D7) | Sin registrar |
| 24–25/10 | Prueba de Ripio (D9) | Pendiente |
| 26–28/10 | Contrato `JuntaReglas` si pasa el spike; si no, `DIRECT_P2P` con id de obligación | Pendiente |
| 29–30/10 | Idempotencia, conciliación y pausa | Pendiente |
| 31/10–3/11 | Pagos técnicos reales conectados a la conciliación | Pendiente |
| 4–6/11 | Pagos duplicados, reintentos, firmas vencidas o reutilizadas | Pendiente |
| 7–8/11 | Lista de evidencias en mainnet | Pendiente |

## Entregables

- Resultado del spike y de las pruebas de x402 y Ripio en `docs/pruebas/`.
- Pagos reales con tag ERC-8021 y la identidad ERC-8004 registrada antes del 9/11.
