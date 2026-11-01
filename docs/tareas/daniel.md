# Tareas · Daniel

**Rol:** agente y bot. Bot de Telegram, loop del LLM con herramientas, mensajes, alertas de atraso e integración con buy (plan del equipo v2, sección 5). Revisión cruzada: Maxi.

> Maxi coordina las tareas del equipo y puede tomar cualquiera de esta lista para llegar a la entrega. Si la toma, la marca acá como "La toma Maxi" y lo avisa en el PR ([README](README.md)).

## Archivos y módulos bajo tu responsabilidad

- `apps/bot/`
- `packages/core/src/agent/`

## Plan

Fuente: `docs/proyecto/plan-del-equipo.md` (sección 6) y `docs/proyecto/decisiones.md` (24/10).

| Etapa | Tarea | Estado |
|---|---|---|
| 21–23/10 | Bot base y loop del LLM con herramientas de lectura | Sin registrar |
| 24–25/10 | Explicación de reglas y riesgos en el bot (D2: sin garantías, riesgos explicados antes de entrar) | Pendiente |
| 26–28/10 | Negociación de turnos con consentimiento, sobre el buscador de turnos del motor | Pendiente |
| 29–30/10 | Alertas de atraso; buy si es útil | Pendiente |
| 31/10–3/11 | Bot conectado a la API | Pendiente |
| 4–6/11 | Errores y tono del bot | Pendiente |
| 7–8/11 | Grabación de pantallas para el video | Pendiente |

## Entregables

- Bot que crea una junta, acuerda el orden y avisa los atrasos, en español rioplatense.
- El LLM propone y el código decide: nunca ve direcciones ni calcula montos.
