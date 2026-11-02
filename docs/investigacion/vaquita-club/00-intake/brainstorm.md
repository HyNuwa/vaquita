# Brainstorm — Vaquita Club

**Phase:** 2 Brainstorm (Fast Track, 3 variantes)
**Project:** vaquita-club
**Date:** 2026-11-01
**Confidence:** Baja a media (criterio propio, sin validación de clientes)

---

Todas comparten las reglas del hackathon: Celo mainnet, wARS, etiqueta ERC-8021 e identidad ERC-8004. Los juicios de esta tabla son [Opinion].

| | A. Campañas que compiten | B. Desafío grupal | C. Mandato de compra |
|---|---|---|---|
| **Cómo funciona** | Cada persona ahorra para una categoría; el agente elige la mejor campaña | El grupo tiene un umbral; si lo alcanza, se libera un bono | La persona deposita un máximo y un plazo; el agente compra en el mejor momento |
| **Decisión del agente** | Alta: elige, reasigna y decide cuándo canjear | Baja: casi todo es regla del contrato | Alta: decide si comprar y cuándo |
| **Componente social** | Medio, con el bono como regla de campaña | Alto | Nulo |
| **Comercios necesarios** | 2 de la misma categoría, o 1 más una campaña del equipo declarada | 1 | 2 para tener alternativa real |
| **Complejidad** | Media | Baja | Media |
| **Riesgo principal** | Conseguir productos realmente sustituibles | Que se lea como un bot con reglas | Pierde "ahorro social" y queda como una compra programada |

## Recomendación [Opinion]

**Grupos con campañas que compiten: A como base, con el bono de B como parte obligatoria de cada campaña y el "cuándo comprar" de C como decisión del agente.**

- Es la que mejor responde a "agente autónomo y útil" sin perder la tesis.
- El grupo comparte una categoría de compra y cada persona conserva su saldo.
- El bono grupal mantiene el diferencial frente a Naranja X y no se recorta. Si hay atraso, salen primero el x402 y el chat.
- La compra de datos por x402 queda fuera del núcleo. Solo tiene sentido si hay un servicio ajeno cuyo dato cambie la decisión del agente.

*Corrección del 2026-11-01:* la primera versión de este documento proponía el bono como regla opcional y como lo primero a recortar. Se descartó porque, sin él, queda ahorro individual con descuento.

## Regla de decisión del agente (propuesta)

Determinista: entre las campañas vigentes de la categoría autorizada con presupuesto suficiente, elegir la de mayor beneficio en wARS para esa persona, incluyendo el extra grupal solo si el grupo ya superó el umbral de esa campaña. Empates: vence primero la campaña más próxima a expirar. Si la campaña elegida se agota antes del canje, se vuelve a calcular.

El agente también avisa cuánto falta para el umbral y calcula el aporte que le falta a cada persona. El LLM solo redacta y explica estos mensajes y decisiones.

---

## Flags

**Red Flags:**
- Ninguna variante funciona sin al menos un comercio o creador real, salvo con el plan B declarado.

**Yellow Flags:**
- Un segundo oferente real es más difícil de conseguir que el primero. Sin él, la decisión del agente pierde fuerza.

## Sources
- Decisiones y hechos en `00-intake/brief.md`.
