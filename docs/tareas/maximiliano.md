# Tareas · Maximiliano

**Rol:** líder técnico. Motor de reglas, obligaciones y exposición; web de la junta; integración final (plan del equipo v2, decisión A3).

## Archivos y módulos bajo tu responsabilidad

- `packages/core/src/junta/`: reglas, obligaciones, compromisos por turno y orden de turnos.
- `apps/web/`: la web de la junta (la landing es de Santos).
- Revisión cruzada: el contrato y los pagos de Esteban.

## Plan

Fuente: `docs/proyecto/plan-del-equipo.md` (sección 6) y `docs/proyecto/plan-junta-contrato.md`.

| Etapa | Tarea | Estado |
|---|---|---|
| 21–23/10 | Modelo de obligaciones: reglas, obligaciones por ronda, pagos tardíos, estado de ronda, compromisos por turno | Hecho (22/10) |
| 21–23/10 | Orden de turnos según cuánto puede adelantar cada miembro | Siguiente |
| 25/10 | Decisiones con el equipo: D7, D2, D10, `.env` único | Pendiente |
| 26–28/10 | Escenarios de incumplimiento y propuesta escrita de D2 | Pendiente |
| 29–30/10 | Conciliación desde eventos del contrato o de `DIRECT_P2P`; persistencia del motor (G4) | Pendiente |
| 31/10–3/11 | Web conectada al motor | Pendiente |
| 4–6/11 | Casos límite del motor | Pendiente |
| 7–8/11 | README y arquitectura | Pendiente |

## Entregables

- Motor con tests: ninguna obligación se paga dos veces, ningún pago va a revisión sin motivo, y las rondas distinguen cierre por fecha de saldo.
- Web de la junta con turnos, obligaciones y estado de cada ronda.
- README con qué es real y qué es simulado.
