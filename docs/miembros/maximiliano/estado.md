# Estado · Maximiliano

**Última actualización:** 2026-11-04

## Publicación de S1 · 2026-11-08

Preparación autorizada de tracker nuevo y CI para bases `feat/fund-s1-*`, sin
reescribir los commits revisados ni mergear a staging. GREEN aprobado: 2 tests de routing, check base de 280 tests y typechecks;
verificación independiente aprobada. Issue #23 creada y confirmada con
`status:approved`; etiquetas autorizadas creadas. Revisión nativa del ajuste,
PRs y comprobación de CI remota pendientes.
Seguimiento: `odd/tasks/fund-s1-publication.md`. La base de este tracker conserva
el estado histórico inferior; los PRs hijos aportan la evidencia de implementación.

## En qué estoy
El producto cambió ([D16](../../proyecto/decisiones.md)): La Vaquita pasa a ser un fondo compartido con reglas, sobre Safe y Zodiac Roles, con Vaqui ejecutando dentro de límites en cadena. La compra colectiva queda en pausa, con su código y su evidencia. Las decisiones están cerradas y la documentación, reescrita. Nada del fondo está implementado todavía: hay [specs de implementación](../../proyecto/specs/README.md) y una prueba de viabilidad en fork, con un script suelto ([evidencia](../../pruebas/fondo.md)).

Control: [`control-entrega.md`](../../tareas/control-entrega.md). Producto: [`spec.md`](../../proyecto/spec.md). Plan y estado de cada pieza: [`plan-fondo-compartido.md`](../../proyecto/plan-fondo-compartido.md).

## Próximo paso
Mergear el PR de las specs y lanzar `/goal` con el comando de [specs/README.md](../../proyecto/specs/README.md). En paralelo, los [pasos humanos](../../proyecto/specs/09-pasos-humanos.md) A1 a A6.

## Bloqueos
- Falta confirmar si Esteban y Daniel aceptan ser responsables. Si no, el piloto es una simulación (D16.20).
- Faltan contactos para las cinco entrevistas.
- Quien solo cargó wARS por Ripio no tiene con qué pagar la comisión: hay que comprobar cómo la consigue.
- Dónde corre el proceso de Vaqui y el plan gratuito de PostgreSQL están sin verificar.
- La identidad ERC-8004 sigue en una cuenta personal de MetaMask (D15.10); las operaciones del fondo salen de otra wallet (D16.25).
- Lo que toque plata se revisa con agentes, que no es una auditoría.
