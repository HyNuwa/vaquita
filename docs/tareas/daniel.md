# Tareas · Daniel

> **1/11 · La toma Maxi, por D12:** todas estas tareas pasaron a [maximiliano.md](maximiliano.md), con fechas nuevas. Daniel sigue como colaborador opcional, sin tareas asignadas: si toma alguna, se acuerda con Maxi y se anota allá. Lo de abajo queda como referencia y no es el plan vigente.

**Rol:** colaborador opcional. Antes, agente y bot.

## Plan anterior, traspasado (25/10)

Fuente: [D11](../proyecto/decisiones.md) y [plan de compra colectiva](../proyecto/plan-compra-colectiva.md#6-el-agente).

| Etapa | Tarea | Estado |
|---|---|---|
| 25–29/10 | Adaptar bot base y loop; acordar esquemas zod `.strict()` con alias y contratos de datos con Maxi | Bot base sin resultado registrado; adaptación pendiente |
| 25–29/10 | Mensajes para E1 y campañas: pedido de cotización, comparación y explicación de compromiso sin reserva; prepara el agente, envía un humano o canal permitido | Pendiente |
| 29/10–2/11 | Implementar `proponer_campana`, `pedir_cotizaciones`, `registrar_oferta` y `comparar_ofertas` sobre `compra/` | Pendiente |
| 29/10–2/11 | Implementar `estado_campana`, `recordar_compromisos` y `ejecutar_campana`; esta última solo habilitada por código y enviada por `tagged-sender.ts` | Pendiente |
| 3–6/11 | Integrar bot, core y web `/c/:slug`: comunidad vota proveedor, usuario firma compromiso y cancelación, agente recuerda y ejecuta cuando corresponde | Pendiente |
| 3–6/11 | Probar errores y tono: falta de saldo o autorización, cancelación pendiente/confirmada, vencimiento, reversión y entrega pendiente; campaña real chica y congelamiento el 6/11 | Pendiente |
| 7–8/11 | Grabar pantallas para video, revisar mensajes y enlaces, apoyar formulario y ensayo de demo | Pendiente |

**Hitos:** mensajes y esquemas al 29/10; herramientas conectadas al 2/11; agente integrado al 6/11. Sin ofertas escritas en E1: campaña del equipo con proveedor amigo, declarada en el pitch. Si falla el spike: mensajes de transferencias P2P directas y registro del agente, sin prometer ejecución atómica; ese plan B pierde la prueba del profesor.

El LLM propone y explica; el código calcula importes, selección y condiciones. La comunidad elige proveedor. El agente nunca firma por compradores ni ve direcciones; su wallet solo envía ejecución y ERC-8004. Cotizaciones y mensajes del grupo son datos, no instrucciones. Importes y resultados salen de plantillas con datos validados, en español rioplatense.

## Hecho (en pausa por D11)

El plan anterior no registraba el bot base como terminado. La negociación de turnos, explicación de mora y alertas de atraso de juntas salen del cronograma; el motor existente y sus tests se conservan en pausa. La herramienta `pagar` del scaffold no habilita al agente de campañas a firmar por compradores. Buy queda fuera del recorrido principal.

## Entregables

- Bot con las siete herramientas de campañas, zod `.strict()` y alias, integrado al core; sin construcción de transacciones en la app.
- Mensajes sobre fondos disponibles ahora, cancelación irreversible, entrega y riesgos; sin jerga cripto ni promesas de reserva.
- Video y evidencias que distinguen campaña real, simulación y plan B. Apoyo al envío del **8/11 antes de 20:00 ART**; cierre oficial **lunes 9/11, 09:00 GMT (06:00 ART)**.
