---
title: Repositorio y guía de entrega
subtitle: Qué va en cada carpeta, quién la cuida, qué evidencias juntamos y cómo enviamos el proyecto
kicker: Complemento del plan del equipo y del plan técnico · versión 2
team: Maxi · Esteban · Daniel · Santos
date: 21 de octubre de 2026
footer: La Vaquita · Repositorio y entrega v2
---

# 0. Cambios en esta versión

| Cambio | v1 (18/10) | v2 (21/10) |
|---|---|---|
| Carpetas | `apps/web/v/[slug]` con vaca de objetivo; `contracts/` sin definir | Rutas `/j/:slug` solo para juntas; módulos `simulacion`, `payments/x402` y `payments/ripio` (experimentales); `spikes/textile` fuera del workspace; sin `contracts/` hasta D7 |
| Variables | `LIVE_PAYMENTS`, claves y tokens | Suman `JUNTA_MODE`, banderas experimentales, tope de buy y wallet de pruebas de Textile |
| Evidencias | Lista de transacciones | Evidencias separadas entre real y simulado, más el registro de decisiones |
| Entrega | Envío el dom 8/11 a las 18:00 | Congelamiento el vie 6/11; envío el dom 8/11 antes de las 20:00 |
| README | Prometía cobro automático | Promesa provisional y sección "Qué es real y qué es simulado" |

# 1. Cómo está organizado

Un solo repositorio público, `la-vaquita` (nombre sujeto a D6), con workspaces de npm. Las reglas del motor las usan a la vez la API, el bot y la web, así que viven en un paquete compartido.

| Carpeta | Para qué sirve | Dueño | Dónde se publica |
|---|---|---|---|
| `packages/core` | Reglas, junta justa, estados, exposición, contabilidad, montos, tokens, envío taggeado, política | Maxi (reglas) · Esteban (cadena) | Lo importan los demás |
| `apps/api` | API, base de datos, simulación, lector de cadena, jobs, módulos experimentales de pagos, buy | Maxi · Esteban (`chain/`, `payments/`) · Daniel (`buy/`) | Railway o Render (D5) |
| `apps/bot` | Bot de Telegram y loop del LLM | Daniel | Railway o Render (D5) |
| `apps/web` | Web de la junta y landing | Maxi (app) · Santos (landing y textos) | Vercel (D5) |
| `spikes/textile` | Prueba independiente de Textile FX, **fuera de los workspaces** y con su propia wallet | Quien tenga capacidad libre | No se publica |
| `docs/` | Planes, registro de decisiones, entrega, legal | Santos · Maxi | En el repo |

Código, commits y variables en inglés; documentación y textos de producto en español.

# 2. Detalle de cada parte

## packages/core

```
packages/core/src/
├── config/        network · tokens · policy · env              (existe)
├── attribution/   tag ERC-8021                                  (existe)
├── chain/         reader · tagged-sender                        (existe)
├── money/         montos en pesos, formato es-AR                (existe)
├── identity/      ERC-8004                                      (existe)
├── ramp/          links de ramp.ripio.com                       (existe)
├── junta/         tabla de turnos (Σ = N²·A), N configurable    (nuevo · Maxi)
├── rules/         máquina de estados, mora, cancelación         (nuevo · Maxi)
├── exposure/      exposición por turno y por grupo, escenarios  (nuevo · Maxi)
├── ledger/        contabilidad por grupo e invariantes          (nuevo · Maxi)
└── types/         Junta, Miembro, Ronda, Aporte, Orden          (nuevo · Maxi)
```

## apps/api

```
apps/api/src/
├── routes/          juntas · miembros · rondas · publico · admin · pausa
├── services/        conciliación · órdenes · idempotencia
├── simulacion/      saldos, garantías, incumplimientos y déficit simulados
├── chain/           lector de eventos (hash + índice de log)       (Esteban)
├── payments/
│   ├── x402/        experimental, detrás de X402_ENABLED (D8)     (Esteban)
│   └── ripio/       experimental, detrás de RIPIO_ENABLED (D9)    (Esteban)
├── buy/             pagos del agente con tope de gasto            (Daniel)
├── jobs/            agenda de rondas y recordatorios
└── db/              esquema y migraciones
```

`JUNTA_MODE=real` hace que la API se niegue a arrancar mientras D2 y D7 estén bloqueadas.

## apps/bot

```
apps/bot/src/
├── bot.ts          grammY, comandos y botones de confirmación
├── agent/          loop del LLM, prompt del sistema, herramientas
├── tools/          estado · explicar_reglas · proponer_junta ·
│                   negociar_turnos · alertar_atraso · link_para_cargar
├── templates/      mensajes de texto fijo (montos, hashes, avisos)
└── api-client.ts   habla solo con la API
```

El bot **no importa** `tagged-sender` ni ninguna clave de wallet.

## apps/web

```
apps/web/app/
├── page.tsx                 landing                          (Santos)
└── j/[slug]/
    ├── page.tsx             estado, rotulado "simulado"       (Maxi)
    ├── unirse/              turno, exposición, reglas         (Maxi)
    ├── aportar/             aporte simulado (y experimental)  (Maxi)
    └── riesgos/             escenarios de incumplimiento      (Maxi)
```

## docs/

```
docs/
├── plan-del-equipo.md · plan-tecnico.md · repositorio-y-entrega.md
├── decisiones.md          registro de decisiones con estado, fecha y evidencia
├── pruebas/               resultados de las pruebas de x402, Ripio y Textile
├── entrega/               campos del formulario, textos, evidencias
├── usuarios/              entrevistas y tamaños de juntas (sin datos personales)
└── contexto/              investigación, modelo de negocio, AGENTS.md
```

# 3. Cómo se conectan las piezas

| Conexión | Cómo funciona | Quién la cuida |
|---|---|---|
| core → api, bot, web | Workspace: `import { … } from "@vaquita/core"` | Maxi |
| bot → api | HTTPS con token de servicio; el bot nunca toca la cadena | Daniel |
| web → api | HTTPS | Maxi |
| api → cadena | Solo por `tagged-sender` (envíos) y `reader` (lecturas) | Esteban |
| cadena → api | El lector registra eventos de pagos técnicos con clave hash + índice de log | Esteban |

## Un aporte en la demo

| Paso | web | api | bot | cadena |
|---|---|---|---|---|
| Se abre la ronda | — | La agenda abre la ronda | Aviso con texto fijo | — |
| El miembro aporta | Confirma | Registra un aporte **simulado** | "Aportó Juan (simulado)" | — |
| Ronda completa | Estado | El motor aprueba la adjudicación | Aviso | — |
| Adjudicación | — | Movimiento **simulado** | Aviso | — |
| Incumplimiento | Escenario | Garantía simulada y déficit | Aviso | — |

## Un pago técnico real

| Paso | api | cadena |
|---|---|---|
| Orden del motor | Compara el monto con la tabla y los topes | — |
| Envío | `tagged-sender`: tag, gas en USDC, firma, verificación | Tx en mainnet |
| Confirmación | Lector concilia por hash + índice de log | `verifyTx` muestra el código |

# 4. Variables de entorno y secretos

| Variable | Dónde vive | Para qué |
|---|---|---|
| `AGENT_PRIVATE_KEY` | Solo `apps/api` | Firma de pagos técnicos y registro ERC-8004 |
| `ATTRIBUTION_CODE` | `apps/api` | Código `celo_…` para el tag |
| `LIVE_PAYMENTS` | Solo `apps/api` | Transmisión real solo con la frase exacta |
| `JUNTA_MODE` | `apps/api` | `simulada` por defecto; `real` bloqueado |
| `X402_ENABLED` · `X402_FACILITATOR_URL` · `X402_API_KEY` | Solo `apps/api` | Prueba de x402 (D8) |
| `RIPIO_ENABLED` | Solo `apps/api` | Prueba de Ripio (D9) |
| `BUY_SPEND_CAP_USD` | `apps/api` | Tope de gasto del agente en buy |
| `CELO_RPC_URL` · `CELO_RPC_URL_BACKUP` | `apps/api` | Forno y Chainstack |
| `FEE_CURRENCY` | `apps/api` | `USDC` por defecto |
| `DATABASE_URL` | `apps/api` | Postgres |
| `BOT_SERVICE_TOKEN` | `apps/api` y `apps/bot` | Autentica al bot |
| `TELEGRAM_BOT_TOKEN` · `LLM_API_KEY` | Solo `apps/bot` | Bot y LLM |
| `NEXT_PUBLIC_API_URL` · `NEXT_PUBLIC_CHAIN_ID=42220` | `apps/web` | Configuración pública |
| `TEXTILE_TEST_PRIVATE_KEY` | Solo `spikes/textile` | Wallet de pruebas separada, sin fondos de grupos |

Los secretos viven en las variables de entorno del hosting y en un `.env` local ignorado por Git. En el repo hay un `.env.example` por app que separa direcciones públicas, configuración de red y secretos (estos últimos sin valores).

# 5. Cómo trabajar dentro del repo

| Tema | Regla |
|---|---|
| Ramas | `main` siempre funciona; ramas `feat/`, `fix/`, `docs/`, `spike/` |
| Commits | En inglés y cortos: `feat(core): add exposure per turn` |
| Pull requests | Una revisión mínima. `chain/` y `payments/` los revisa alguien distinto de Esteban; `junta/`, `rules/`, `exposure/` y `ledger/`, alguien distinto de Maxi |
| CI | `npm test`, `npm run typecheck`, tests de contabilidad y casos de mora, y búsqueda de secretos |
| Issues | Uno por tarea, con responsable y fecha. Etiquetas: `core`, `api`, `bot`, `web`, `pagos`, `simulacion`, `usuarios`, `entrega`, `bloqueado` |
| Contratos de datos | Un cambio en `packages/core/types` se avisa antes de mergear |
| Envíos reales | Regla de las dos llaves antes de activar `LIVE_PAYMENTS` |
| Decisiones | Todo cambio de estado se anota en `docs/decisiones.md` con fecha y evidencia |
| Listo significa | Cumple la definición de terminado del plan técnico (sección 16) |

El repo es **público desde el primer día**. Los cuatro tienen permiso de escritura; Maxi es administrador; `main` está protegido.

# 6. Migrar el código existente

Si todavía no se hizo, el repo `stable-agent-latam` pasa a ser `packages/core`:

```
mkdir la-vaquita && cd la-vaquita && git init
mkdir -p packages apps docs spikes
cp -r ../stable-agent-latam packages/core
rm -rf packages/core/.git packages/core/node_modules packages/core/package-lock.json
npm init -y
npm pkg set private=true workspaces[0]="packages/*" workspaces[1]="apps/*"
npm pkg set name="@vaquita/core" --workspace=packages/core
npm install
npm test --workspace=packages/core      # 87 tests en verde
git add . && git commit -m "chore: bootstrap monorepo with core package"
```

`spikes/` queda fuera de `workspaces` a propósito.

# 7. Evidencias para la entrega

| Evidencia | Real o simulada | Dónde | Responsable |
|---|---|---|---|
| Identidad ERC-8004 | Real | Enlace a 8004scan y hash del registro | Esteban |
| Wallet del agente | Real | Dirección, igual a la de la inscripción | Esteban |
| Pagos técnicos con tag | Real | `docs/entrega/transacciones.md`: hash, tipo y código verificado | Esteban |
| Prueba de x402 | Real (aislada) | `docs/pruebas/x402.md`: versiones, resultado, PayTo y cada criterio de D8 | Esteban |
| Prueba de Ripio | Real (aislada) | `docs/pruebas/ripio.md`: resultado y cada criterio de D9 | Esteban |
| Pagos del agente con buy | Real | Llamadas, gasto y para qué sirvió cada una | Daniel |
| Juntas, aportes y adjudicaciones | **Simulada** | Capturas y logs rotulados "simulado" | Maxi |
| Incumplimiento con déficit mayor que la garantía | **Simulada** | Escenario de la demo | Maxi |
| Usuarios | Real | `docs/usuarios/`: entrevistas, grupos que probaron el flujo simulado y cómo se los consiguió | Santos |
| Registro de decisiones | — | `docs/decisiones.md` al día | Maxi |
| Prueba de Textile (si se hizo) | Real (aislada) | `docs/pruebas/textile.md` | Quien la haga |

# 8. Entrega en Loops House paso a paso

## Antes del congelamiento (hasta el vie 6/11)

| # | Tarea | Quién |
|---|---|---|
| 1 | Releer los campos del formulario (`docs/entrega/campos.md`) | Santos |
| 2 | Completar la tabla de evidencias de la sección 7 | Esteban y Maxi |
| 3 | README raíz con la plantilla de la sección 10 | Maxi |
| 4 | Buscar secretos en todo el historial | Esteban |

## Sábado 7 y domingo 8/11

| Cuándo | Qué se hace | Quién |
|---|---|---|
| Sáb 7 | Video subido como no listado y deck en PDF; verificación en incógnito y desde un celular | Santos y Daniel |
| Dom 8 · 10:00 | Llamada de 15 minutos: checklist | Todos |
| Dom 8 · 13:00 | Formulario en borrador con el kit de textos ajustado al estado real | Santos |
| Dom 8 · 15:00 | Materiales congelados | Todos |
| Dom 8 · 17:00 | Revisión final del formulario | Maxi y Santos |
| **Dom 8 · antes de las 20:00** | **Envío** y captura de confirmación | Maxi |
| Lun 9 · 06:00 | Cierre oficial | — |

> **Honestidad sobre el estado:** el formulario, el README, el deck y el video dicen qué es real y qué es simulado. El jurado abre el repo y Celoscan.

# 9. Comandos útiles

```
# Buscar secretos antes de cada push importante
git log --all -p | grep -iE "private_key|secret|api[_-]?key|BEGIN .*KEY|0x[0-9a-f]{64}" | head -20

# Verificar el tag de una transacción
npm run tx:verificar --workspace=packages/core -- 0x<hash>

# Correr todos los tests
npm test --workspaces && npm run typecheck --workspaces
```

# 10. Plantilla del README raíz

```
# La Vaquita (nombre provisional)
Reglas claras, turnos justos y riesgos transparentes.

Un agente en Telegram que organiza la junta de un grupo en pesos digitales
(wARS) sobre Celo: explica reglas y riesgos, ayuda a acordar los turnos y
controla los aportes. El LLM conversa; las reglas son código.

## Qué es real y qué es simulado
Real en Celo mainnet: identidad ERC-8004, transacciones con tag ERC-8021,
pagos técnicos con wARS [y pruebas de x402 y Ripio, si pasaron].
Simulado: la operación de juntas con fondos de terceros, las garantías y
los incumplimientos, hasta resolver la cobertura (D2), la custodia (D7)
y la revisión legal.

## Enlaces
- Bot: @<usuario>   · Web: <URL>
- Agente en 8004scan: <URL>   · Wallet del agente: <dirección>
- Evidencias: docs/entrega/   · Decisiones: docs/decisiones.md

## Cómo funciona
packages/core (reglas y cadena) · apps/api · apps/bot · apps/web

## Límites
Una junta es un crédito entre conocidos y tiene riesgo: no garantizamos
que nadie pierda. No es un producto financiero regulado.

## Equipo
Maxi (líder técnico) · Esteban (cadena y pagos) · Daniel (agente) · Santos (producto)
```

# 11. Si algo falla

| Problema | Alternativa |
|---|---|
| Vercel no despliega | Web estática en Netlify Drop |
| Railway o Render caídos | El otro proveedor, con la configuración lista |
| El RPC de Forno falla | `CELO_RPC_URL_BACKUP` con Chainstack |
| El LLM no responde | Plantillas fijas; el motor no depende del LLM |
| x402 falla en la prueba | Se documenta el resultado en `docs/pruebas/x402.md`; el aporte queda simulado |
| Un movimiento real queda `SIN_ASIGNAR` | El operador lo revisa y lo anota en `docs/decisiones.md` |
| El video no sube | Google Drive con acceso por enlace |
| El formulario no deja enviar | Otro navegador, capturas y aviso en el Telegram del hackathon antes de las 22:00 del domingo |
