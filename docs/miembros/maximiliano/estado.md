# Estado · Maximiliano

**Última actualización:** 2026-11-02

## En qué estoy
Tomé todas las tareas de la entrega ([D12](../../proyecto/decisiones.md)). Esteban y Daniel quedan como colaboradores opcionales, y los PR ya no necesitan aprobación. El control está en [`docs/tareas/control-entrega.md`](../../tareas/control-entrega.md). El producto quedó cerrado: se entrega D11 (D13.6).
D13 suma al agente un loop propio y una bitácora pública, y un cobro por x402 opcional. El proceso que corre el loop ya está en el repo, probado con dobles: falta conectarlo a la cadena y al contrato. El contrato y su fábrica están escritos y probados en local, sin desplegar (D14). La parte sin fondos del spike está en [`docs/pruebas/spike.md`](../../pruebas/spike.md).

## Próximo paso
Puerta P1, martes 3/11 a las 23:59:
- Primer pago real hecho y verificado: ver [`docs/pruebas/spike.md`](../../pruebas/spike.md).
- Registrar ERC-8004 como Vaqui (D14.4) y agregar la wallet `0x1F1Cd124f456eecA90d8cb44BACB3Da031cC4170` a la inscripción.
- Spike con fondos: despliegue de prueba, `transferFrom` real, etiqueta desde el celular y gas con wARS real.

## Bloqueos
- Falta definir cómo firma el comprador desde la web sin romper la regla 9 ni la guarda de la CI.
- Falta un contacto con una comunidad y con proveedores para E1.
- Lo que toque plata ya no tiene un segundo revisor humano; lo reemplaza la revisión con agentes, que no es una auditoría.
