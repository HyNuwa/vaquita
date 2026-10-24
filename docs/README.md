# Docs de La Vaquita · segundo cerebro del equipo

Esta carpeta es la memoria compartida del proyecto **La Vaquita**. Está en español, igual que todo lo que ve el usuario; commits, ramas y PRs van en inglés (ver [AGENTS.md](../AGENTS.md)).

Se puede abrir como bóveda de Obsidian (abrir la carpeta `docs/` como vault). Los links son relativos para que también funcionen en GitHub.

## Cómo funciona

- Cada integrante tiene su carpeta en [`miembros/`](miembros/) con tres archivos:
  - `estado.md`: en qué está ahora, qué sigue y qué lo bloquea. Siempre al día.
  - `bitacora.md`: una entrada por commit, la más nueva arriba.
  - `ideas.md`: ideas y propuestas que va dejando.
  - `relevamientos/` (opcional): investigaciones largas, por ejemplo conversaciones con IA hechas fuera del repo. Un archivo por tema: `AAAA-MM-DD-tema.md`.
- Con cada commit que toca código, el agente (o la persona) actualiza su `bitacora.md` y su `estado.md` **en el mismo commit**. El hook `pre-commit` no deja commitear si falta, y la CI rechaza el PR.
- Las decisiones que afectan a todos van en [`proyecto/decisiones.md`](proyecto/decisiones.md).
- Cada uno edita solo su carpeta de `miembros/` (el hook lo controla). En los archivos compartidos se agrega, no se reescribe lo de otros.

## Mapa

| Archivo | Qué tiene |
|---|---|
| [proyecto/contexto.md](proyecto/contexto.md) | **Fuente de verdad:** qué es, reglas duras, direcciones, estado, junta justa, mora, restricciones |
| [proyecto/plan-del-equipo.md](proyecto/plan-del-equipo.md) | **Plan v2 (21/10):** fechas y puertas G1–G7, qué es real y qué es simulado, roles, etapas, recortes, registro de decisiones A1–A7 y D2–D10, pitch y entrega |
| [proyecto/plan-tecnico.md](proyecto/plan-tecnico.md) | **Plan técnico v2:** alcance del MVP, modos (`LIVE_PAYMENTS`, `JUNTA_MODE`), estados, motor de reglas, exposición, escenarios de déficit, criterios de x402 y Ripio, definición de terminado |
| [proyecto/plan-junta-contrato.md](proyecto/plan-junta-contrato.md) | **Propuesta v3 (22/10, se decide el 25/10):** contrato de reglas que no guarda plata, aportes P2P, motor de obligaciones, autorizaciones, pagos tardíos, plan B `DIRECT_P2P` y su conciliación |
| [proyecto/repositorio-y-entrega.md](proyecto/repositorio-y-entrega.md) | Carpetas y dueños, variables de entorno, evidencias para la entrega y el paso a paso del envío |
| [proyecto/stack.md](proyecto/stack.md) | Stack por workspace, con versiones y lo pendiente de decidir |
| [proyecto/decisiones.md](proyecto/decisiones.md) | Registro de decisiones del equipo |
| [equipo.md](equipo.md) | Integrantes, alias, roles y carpeta de cada uno |
| [tareas/](tareas/README.md) | Áreas de trabajo, responsables y plan de cada integrante |
| [investigacion/](investigacion/README.md) | Docs 01–15: hackathon, Celo, Ripio, brainstorming, benchmark, modelo de negocio |

## Onboarding (una vez por compu)

```sh
git clone https://github.com/HyNuwa/vaquita.git
cd vaquita
npm install                          # instala todo y activa los hooks del equipo
git config vaquita.member <tu-slug>  # daniel, esteban o maximiliano
npm run check                        # typecheck + tests, sin red
```

Para verificar: `git config vaquita.member` tiene que mostrar tu slug y `git config core.hooksPath` tiene que mostrar `.githooks`.

Solo quien maneja la wallet del agente necesita un `.env` con valores reales (`cp .env.example .env`). Nunca se comparte por el repo ni por el chat del equipo.

## Fechas que importan

- **Entrega:** lunes **9/11/2026, 06:00 (hora ARG)**. También es el límite para registrar la identidad ERC-8004.
- **Ganadores:** viernes 13/11/2026.
- **Office hours:** jueves 9:00 (hora ARG).
