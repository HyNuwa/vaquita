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
| [proyecto/contexto.md](proyecto/contexto.md) | **Fuente de verdad (25/10):** compra colectiva por intención, reglas duras, direcciones, estado y juntas en pausa por D11 |
| [proyecto/plan-compra-colectiva.md](proyecto/plan-compra-colectiva.md) | **Plan vigente (D11):** contrato y fábrica, tests, core, agente, web, E1, cronograma y riesgos |
| [proyecto/plan-del-equipo.md](proyecto/plan-del-equipo.md) | **Antecedente v2 (21/10):** cronograma de juntas reemplazado por D11; reglas y entrega según aviso inicial |
| [proyecto/plan-tecnico.md](proyecto/plan-tecnico.md) | **Antecedente v2:** motor de juntas en pausa; pipeline y reglas vigentes según aviso D11 |
| [proyecto/plan-junta-contrato.md](proyecto/plan-junta-contrato.md) | **Antecedente v3 (22/10):** `JuntaReglas` reemplazado por `CompraColectiva`; spike original vigente |
| [proyecto/repositorio-y-entrega.md](proyecto/repositorio-y-entrega.md) | Carpetas y dueños, variables de entorno, evidencias para la entrega y el paso a paso del envío |
| [proyecto/stack.md](proyecto/stack.md) | Stack por workspace, con versiones y lo pendiente de decidir |
| [proyecto/decisiones.md](proyecto/decisiones.md) | Registro de decisiones del equipo |
| [equipo.md](equipo.md) | Integrantes, alias, roles y carpeta de cada uno |
| [tareas/control-entrega.md](tareas/control-entrega.md) | **Control hasta el cierre:** puertas, fechas y recortes |
| [tareas/](tareas/README.md) | Áreas de trabajo y tareas (desde D12, todas de Maxi) |
| [investigacion/](investigacion/README.md) | Docs 01–15: hackathon, Celo, Ripio, brainstorming, benchmark, modelo de negocio |
| [investigacion/la-vaquita-2/](investigacion/la-vaquita-2/README.md) | Investigación de versiones y validación; v4 y debate técnico/jurídico como antecedentes de D11 |

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
