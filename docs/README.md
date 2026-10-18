# Docs · Agents on Open Rails (Celo × Ripio)

Contexto del hackathon y material para el brainstorming, organizado para usar como documentación del proyecto y como contexto para el coding agent.

Fuentes: Builder Session Jujuy (17/10/2026, francoduran23.github.io/builder-session-jujuy), página del hackathon (loops.house/agents-on-open-rails) y recursos que compartieron los organizadores.

| # | Documento | Contenido |
| --- | --- | --- |
| 01 | [Hackathon](01-hackathon.md) | Fechas, tracks, premios, cómo evalúan |
| 02 | [Requisitos](02-requisitos.md) | Requisitos eliminatorios y reglas que no se negocian |
| 03 | [Celo](03-celo.md) | Datos de la red, ERC-8021, ERC-8004, x402, fee abstraction, MiniPay |
| 04 | [Ripio y wFIAT](04-ripio-wfiat.md) | Direcciones de tokens, ramps, bridge |
| 05 | [Stack y recursos](05-stack-recursos.md) | Skills, librerías, links, canales de ayuda |
| 06 | [Principios de diseño](06-principios-diseno.md) | Cómo debe comportarse el agente |
| 07 | [Prompt base](07-prompt-base.md) | Prompt para arrancar el coding agent |
| 08 | [Brainstorming](08-brainstorming.md) | Ideas semilla, filtro de ideas, ángulos locales, argumentos |
| 09 | [Próximos pasos](09-proximos-pasos.md) | Checklist hasta la entrega |
| 10 | [Scaffold stable-agent](10-scaffold-stable-agent.md) | Código base existente: estructura, tubería de tx, política, scripts, qué falta |
| 11 | [Ideas T1](11-ideas.md) | 5 ideas desarrolladas, comparación y recomendación |
| 12 | [Idea Mesada](12-idea-mesada.md) | Candidata anterior: pitch, flujos, reglas, MVP, demo, riesgos |
| 13 | [La Vaquita: referentes y mejoras](13-vaquita-benchmark-y-mejoras.md) | Benchmark (MoneyFellows, Tanda, Esusu, Ronda, CeloSusu…), 6 mejoras, riesgos |
| 14 | [La Vaquita: modelo de negocio](14-vaquita-modelo-de-negocio.md) | Lean canvas, segmentos, ingresos, unit economics, regulación PSAV, go-to-market |
| 15 | [Qué cambia con La Vaquita](15-que-cambia-con-la-vaquita.md) | Contexto argentino, "junta justa" indexada por inflación, antes y después por actor |

## Idea actual: La Vaquita

> **La Vaquita** es un agente que organiza la junta, la tanda o la vaca de tu grupo en pesos digitales (wARS): cobra a cada uno, paga el pozo a quien le toca y reparte la inflación de forma justa, con reglas que nadie, ni el agente, puede romper.

Pitch: **"crédito entre conocidos a la mitad del costo del banco, sin que nadie pierda contra la inflación"** (ver doc 15).

Recorrido de la idea: 5 candidatas (doc 11) → Mesada (doc 12) → **La Vaquita** (docs 13–15).

Skills instaladas en el proyecto: `.claude/skills/celopedia-skill` y `.claude/skills/docs-watch` (Celopedia v2.12.1).

## Fechas que importan

- **Entrega:** lunes **9/11/2026, 06:00 (hora ARG)**. También es el límite para registrar la identidad ERC-8004.
- **Ganadores:** viernes 13/11/2026.
- **Office hours:** jueves 9:00 (hora ARG).
