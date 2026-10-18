# Tareas

Cada integrante tiene un archivo `<slug>.md` con su plan y los archivos que le pertenecen. Antes de tocar algo de otra área, se habla con su responsable.

## Áreas (propuesta, falta asignar)

Las áreas siguen los workspaces del monorepo y la lista de "Falta" de [contexto.md](../proyecto/contexto.md#4-estado-del-repo). Las áreas 1 y 2 son lógica del core y no dependen de nadie; el bot y la web consumen lo que exponen.

| # | Área | Paths | Incluye | Responsable |
|---|---|---|---|---|
| 1 | **Cadena e identidad** | `packages/core/src/chain/`, `identity/`, `payments/`, `config/`, `packages/core/scripts/` | Primer pago real de 1 wARS, registro ERC-8004, conciliación de aportes (eventos `Transfer`), calificación en la Reputation Registry | Por asignar |
| 2 | **Motor de vaquita** | `packages/core/src/vaquita/` (nuevo), `policy/` | Modelo de datos, junta justa en `bigint` con su invariante, mora (A + B), política por vaquita, persistencia | Por asignar |
| 3 | **Bot y agente** | `apps/bot/`, `packages/core/src/agent/` | Bot de Telegram, loop del LLM con tools (`estado`, `cobrar`, `pagar_pozo`, `link_para_cargar`), textos al usuario | Por asignar |
| 4 | **Web, onboarding y entrega** | `apps/web/`, `public/`, `packages/core/src/ramp/` | Página pública de estado, `agent.json` por HTTPS, links de Ripio, demo, video y pitch | Por asignar |

Los contratos entre áreas (qué funciones expone el core al bot y a la web) se anotan en [decisiones.md](../proyecto/decisiones.md) apenas se acuerdan.

## Archivos por integrante

- [daniel.md](daniel.md)
- [esteban.md](esteban.md)
- [santos.md](santos.md)
- [maximiliano.md](maximiliano.md)
