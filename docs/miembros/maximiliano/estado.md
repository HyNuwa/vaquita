# Estado · Maximiliano

**Última actualización:** 2026-11-07

## En qué estoy
El producto cambió ([D16](../../proyecto/decisiones.md)): La Vaquita pasa a ser un fondo compartido con reglas, sobre Safe y Zodiac Roles, con Vaqui ejecutando dentro de límites en cadena. La compra colectiva queda en pausa, con su código y su evidencia. Las specs alineadas y revisadas se mergearon en el PR #22 con CI verde. Arrancó S1: configuración de contratos y ABI con 28 tests nuevos, check completo de 308 tests y verificación independiente aprobada. Faltan sender, arnés, verificador RPC y evidencia de despliegues del producto en fork; el script suelto previo sigue siendo solo una prueba de viabilidad ([evidencia](../../pruebas/fondo.md)).

Control: [`control-entrega.md`](../../tareas/control-entrega.md). Producto: [`spec.md`](../../proyecto/spec.md). Plan y estado de cada pieza: [`plan-fondo-compartido.md`](../../proyecto/plan-fondo-compartido.md).

## Próximo paso
Cerrar la revisión de la primera unidad de S1 y seguir con sender local, selector, arnés y verificador. Seguimiento: `odd/tasks/fund-s1-contracts-fork.md`, con PRs encadenados sobre una rama integradora. Los [pasos humanos](../../proyecto/specs/09-pasos-humanos.md) siguen separados.

## Bloqueos
- Falta confirmar si Esteban y Daniel aceptan ser responsables. Si no, el piloto es una simulación (D16.20).
- Faltan contactos para las cinco entrevistas.
- Quien solo cargó wARS por Ripio no tiene con qué pagar la comisión: hay que comprobar cómo la consigue.
- Dónde corre el proceso de Vaqui y el plan gratuito de PostgreSQL están sin verificar.
- La identidad ERC-8004 sigue en una cuenta personal de MetaMask (D15.10); las operaciones del fondo salen de otra wallet (D16.25).
- Lo que toque plata se revisa con agentes, que no es una auditoría.
