# Tareas

**Desde el 1/11, todas las tareas son de Maxi** ([D12](../proyecto/decisiones.md)). Fechas, puertas y recortes: [control-entrega.md](control-entrega.md). Lista completa: [maximiliano.md](maximiliano.md).

Plan de producto vigente: [compra colectiva por intención](../proyecto/plan-compra-colectiva.md), según [D11](../proyecto/decisiones.md), hasta que la puerta P0 confirme el producto final. El cronograma de juntas sigue en pausa.

## Quién coordina

Maxi coordina y hace la entrega. Esteban y Daniel son colaboradores opcionales: pueden tomar una tarea si la acuerdan con Maxi, y entonces se anota en [maximiliano.md](maximiliano.md). El plan de la entrega no depende de ninguno de los dos.

Los PR no necesitan aprobación: cada uno mergea el suyo con la CI en verde. Lo que toque plata pasa antes por la [revisión sin un segundo integrante](control-entrega.md#revisión-sin-un-segundo-integrante).

## Áreas

| Área | Paths | Responsable |
|---|---|---|
| **Cadena y pagos** | `packages/core/src/chain/`, `identity/`, `payments/`, `config/`, `packages/core/scripts/` | Maxi |
| **Contratos de compra** | `contracts/` (condicionado al spike, D11.4) | Maxi |
| **Compra colectiva** | `packages/core/src/compra/` (a crear) | Maxi |
| **Motor de la junta (en pausa)** y política | `packages/core/src/junta/`, `policy/` | Maxi |
| **Bot y agente** | `apps/bot/`, `packages/core/src/agent/` | Maxi |
| **Web, producto y entrega** | `apps/web/`, `packages/core/src/ramp/`, `docs/entrega/`, `docs/usuarios/` | Maxi |

## Hecho (en pausa por D11)

El motor de juntas y sus tests quedan en el repo: reglas, obligaciones, pagos tardíos, estado de ronda, compromisos por turno, buscador y escenarios de incumplimiento. D2 y D10 siguen como reglas de esa línea; sale de la demo. El pipeline, identidad, política y reglas de envío siguen vigentes.

## Archivos

- [control-entrega.md](control-entrega.md): puertas, recortes y rutina.
- [maximiliano.md](maximiliano.md): todas las tareas.
- [esteban.md](esteban.md) y [daniel.md](daniel.md): el plan anterior, traspasado.
