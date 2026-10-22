# Estado · Maximiliano

**Última actualización:** 2026-10-22

## En qué estoy
Motor de la junta en `packages/core/src/junta/`: reglas de la junta clásica, obligaciones por miembro y ronda, pagos tardíos sin doble conteo, estado de ronda (cerrada por fecha y saldada) y la tabla de qué compromete cada turno. No depende de D7: el contrato y `DIRECT_P2P` le pasan los pagos como eventos.

## Próximo paso
- Buscador de órdenes de turno que respeten cuánto puede adelantar cada miembro (sección 3 del plan del contrato).
- Revisar el contrato de Esteban cuando esté.
- Decidir con el equipo, el 25/10: D7 (contrato de reglas o `DIRECT_P2P`), D2, D10 y el `.env` único en la raíz.
- Conseguir la aprobación del PR #3 (planes v2 y plan del contrato v3).

## Bloqueos
- Ninguno para el motor. Todo lo que mueve plata espera la decisión del 25/10.
