# Tareas · Maximiliano

**Rol:** líder técnico. Motor de reglas, obligaciones y exposición; web de la junta; integración final (plan del equipo v2, decisión A3). Desde el 24/10 también producto, usuarios y entrega (eran de Santos), y coordina las tareas de todos ([README](README.md)).

## Archivos y módulos bajo tu responsabilidad

- `packages/core/src/junta/`: reglas, obligaciones, compromisos por turno y orden de turnos.
- `apps/web/`: la web de la junta y la landing.
- `docs/entrega/`, `docs/usuarios/`: formulario de entrega, entrevistas y usuarios.
- Revisión cruzada: el contrato y los pagos de Esteban, el bot de Daniel.

## Plan

Fuente: `docs/proyecto/plan-del-equipo.md` (sección 6) y `docs/proyecto/plan-junta-contrato.md`.

| Etapa | Tarea | Estado |
|---|---|---|
| 21–23/10 | Modelo de obligaciones: reglas, obligaciones por ronda, pagos tardíos, estado de ronda, compromisos por turno | Hecho (22/10) |
| 21–23/10 | Orden de turnos según cuánto puede adelantar cada miembro | Hecho (22/10) |
| 25/10 | Decisiones de diseño: D7, D2, D10, D5, D6, `.env` único, alcance y estructura | Hecho (24/10, PR #6) |
| 26–28/10 | Escenarios de incumplimiento y propuesta escrita de D2 | Pendiente |
| 29–30/10 | Conciliación desde eventos del contrato o de `DIRECT_P2P`; persistencia del motor (G4) | Pendiente |
| 31/10–3/11 | Web conectada al motor | Pendiente |
| 4–6/11 | Casos límite del motor | Pendiente |
| 7–8/11 | README y arquitectura | Pendiente |

### Producto y entrega (eran de Santos)

| Etapa | Tarea | Estado |
|---|---|---|
| Ya | Equipo inscripto en Loops House y código `celo_…` en el `.env` | Pendiente |
| Ya | Campos del formulario de entrega copiados a `docs/entrega/campos.md` | Pendiente |
| 24–25/10 | Entrevistas y evaluación de organizadores; segmento (G2) | Pendiente |
| 26–28/10 | Conclusión escrita sobre precios y licitaciones (D10, RG IGJ 8/2015) | Pendiente |
| 29–30/10 | Landing v1 y deck v1 | Pendiente |
| 31/10–3/11 | Usuarios reales recorriendo el flujo (G5) | Pendiente |
| 4–6/11 | Recorrido desde un celular ajeno; guion del video | Pendiente |
| 7–8/11 | Video, deck y textos; formulario y envío el dom 8 (G7) | Pendiente |

## Entregables

- Motor con tests: ninguna obligación se paga dos veces, ningún pago va a revisión sin motivo, y las rondas distinguen cierre por fecha de saldo.
- Web de la junta con turnos, obligaciones y estado de cada ronda.
- README con qué es real y qué es simulado.
