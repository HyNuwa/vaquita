# Estado · Maximiliano

**Última actualización:** 2026-11-02

## En qué estoy
Tomé todas las tareas de la entrega ([D12](../../proyecto/decisiones.md)). Esteban y Daniel quedan como colaboradores opcionales, y los PR ya no necesitan aprobación. El control está en [`docs/tareas/control-entrega.md`](../../tareas/control-entrega.md). El producto quedó cerrado: se entrega D11 (D13.6).
D13 suma al agente un loop propio y una bitácora pública, y un cobro por x402 opcional. El proceso que corre el loop ya está en el repo, probado con dobles: falta conectarlo a la cadena y al contrato. El contrato y su fábrica pasaron una compra real de $ 1 en mainnet con un solo comprador; la fábrica es de prueba, todavía no para uso real (D14). La parte sin fondos del spike está en [`docs/pruebas/spike.md`](../../pruebas/spike.md).

## Próximo paso
Puerta P1, martes 3/11 a las 23:59:
- Primer pago real hecho y verificado: ver [`docs/pruebas/spike.md`](../../pruebas/spike.md).
- ERC-8004 registrado: Vaqui, `agentId` 10026.
- La carga del proyecto en la página del hackathon, con la wallet `0x1F1Cd124f456eecA90d8cb44BACB3Da031cC4170`, queda para cuando haya demo live. La entrega interna sigue siendo el 8/11.
- Spike con fondos: compra real conciliada. Falta la etiqueta desde el celular y medir el peor caso de gas con varios compradores.

## Bloqueos
- Falta definir cómo firma el comprador desde la web sin romper la regla 9 ni la guarda de la CI.
- Falta un contacto con una comunidad y con proveedores para E1.
- Lo que toque plata ya no tiene un segundo revisor humano; lo reemplaza la revisión con agentes, que no es una auditoría.
