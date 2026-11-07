# Specs de implementación del fondo compartido

Estas specs bajan [spec.md](../spec.md) y [D16](../decisiones.md) a un nivel que se puede ejecutar sin preguntar. Si una decisión falta, se aplica la [regla de ambigüedad](#regla-de-ambigüedad).

**Orden de autoridad:** `AGENTS.md` > D16 > `spec.md` > estas specs > `plan-fondo-compartido.md`. La [tabla de garantías](../spec.md#6-qué-garantizamos-y-qué-no) no se puede contradecir nunca.

## Principio Web3-first (acuerdo posterior a la Ronda 3)

**Celo es la fuente de verdad financiera.** Safe gobierna fondos, responsables, umbral y módulos; Zodiac Roles impone los permisos y cupos del agente; wARS y los eventos acreditan transferencias. Ninguna tabla SQL ni API autoriza gastos, modifica el control del Safe o puede elevar límites on-chain.

**Dos modos de uso, no dos custodias:**

1. **Modo independiente:** con una wallet, una dirección Safe o un manifiesto público exportado, los responsables consultan saldos y configuración, construyen una propuesta, aprueban y ejecutan con 2 de 3 directamente contra Celo. No requiere `DATABASE_URL`, sesiones, Telegram ni el servidor de La Vaquita. La ejecución manual mediante una interfaz compatible con Safe es el mecanismo de recuperación mínimo.
2. **Servicios auxiliares opcionales:** nombres, invitaciones, pertenencia social de integrantes, cuotas, avisos y programación de Vaqui utilizan almacenamiento externo persistente. PostgreSQL es un adaptador permitido, **no una dependencia del protocolo financiero**. Si el almacenamiento no está disponible, esos servicios se deshabilitan de forma segura; no se inventan datos ni se envían pagos automatizados.

**Límites explícitos:** ni los nombres privados, ni invitaciones, ni los calendarios EIP-712 que no se hayan exportado se reconstruyen automáticamente desde Celo. Las firmas de programaciones no son restricciones de fecha on-chain: una clave operativa comprometida puede gastar anticipadamente dentro de los límites de Roles. Safe 2 de 3 impide el control unilateral, pero no impide que dos responsables actúen juntos. Esta modificación debe sincronizarse con D16 y `spec.md`, que no se entregaron con estas specs; no se los considera ya modificados.

## Orden

Cada parte se hace en orden, en su propia rama y su propio PR contra `staging`.

| Parte | Archivo | Quién | Termina cuando |
|---|---|---|---|
| S1 | [Contratos y fork](01-contratos-y-fork.md) | Claude | `npm run fondo:contratos` y los negativos en fork pasan |
| S2 | [Core del fondo](02-core-fondo.md) | Claude | Módulos puros con tests y recorridos en fork |
| S3 | [Datos, acceso y API](03-datos-y-api.md) | Claude y Codex | Estado financiero independiente de SQL; almacenamiento auxiliar y APIs con tests |
| S4 | [Lector](04-lector.md) | Claude | Caídas, duplicados y reorganizaciones cubiertos |
| S5 | [Vaqui y pagos programados](05-vaqui.md) | Claude | Sin pago doble, con recuperación tras caída |
| S6 | [Web](06-web.md) | Claude y Codex | E2E móvil y prueba con backend/base desconectados |
| S7 | [Bot y LLM](07-bot.md) | Claude y Codex | Avisos y herramientas de solo lectura |
| S8 | [Cierre autónomo](08-cierre-autonomo.md) | Claude y Codex | `npm run fondo:gate` imprime `GATE OK` |
| H | [Pasos humanos en mainnet y entrega](09-pasos-humanos.md) | **Maxi** | Evidencia en `docs/pruebas/fondo.md` y envío |

El avance se marca en [avance.md](avance.md), en el mismo PR que hace el trabajo.

## Reparto entre Claude y Codex

Claude, en la conversación de `/goal`, dirige todo y hace lo crítico. A Codex le encarga lo demás. Una ejecución autónoma no le pide nada a Codex fuera de esta tabla.

| Parte | Hace Claude | Se encarga a Codex |
|---|---|---|
| S1, S2, S4, S5 | Todo | Nada |
| S3 | Migraciones, acceso con firma, cookie, invitaciones, autorización y rutas de propuestas, `tx`, programados y `creacion` | Las demás rutas, usando la autorización ya hecha |
| S6 | `PasoDeFirma`, `lib/firmar.ts`, `Montos` y los pasos 4 a 7 de crear un grupo | Las demás pantallas, estilos y E2E |
| S7 | `fondo/herramientas.ts`, el LLM y S7-4 a S7-8 | Comandos, vinculación, avisos y plantillas |
| S8 | `gate.ts`, `gasFijo`, los scripts que envían o generan claves, y la revisión final | Los demás scripts, `Dockerfile` y borradores de documentos, y Claude contrasta sus afirmaciones con la [tabla de garantías](../spec.md#6-qué-garantizamos-y-qué-no) |

Si un encargo necesita tocar `fondo/`, `chain/`, `config/`, `payments/` o `policy/`, Codex se detiene y lo hace Claude. Las únicas excepciones son las de esta tabla.

### Antes de cada encargo

Se encarga a Codex solo si se cumple todo esto:

1. **Entorno realmente aislado y sanitizado:** no alcanza con quitar `.env` de la raíz. Un worktree local no impide por sí mismo leer otros archivos. Ejecutar Codex en un contenedor/VM o workspace aislado que **no monte** secretos, `~/.ssh`, credenciales cloud, `.env*`, wallets ni carpetas ajenas. Verificar el aislamiento; si no es posible, Claude hace el trabajo sin delegarlo. No entregar claves reales a ningún agente de código.
2. No hay otro Codex corriendo, ni fork ni E2E en marcha. Se cortó una vez por falta de memoria.
3. Acceso a red deshabilitado por defecto. Si una instalación necesita red, habilitarla únicamente en un entorno sanitizado y para esa tarea; revisar lo que se instala.

### Cómo se lanza

Dentro de ese entorno **aislado**, desde Git Bash, en un worktree de una copia sanitizada (el comando por sí solo no constituye aislamiento):

```sh
git worktree add ../vaquita-codex-<parte> <rama>
timeout 1500 codex exec -C ../vaquita-codex-<parte> -s workspace-write \
  -c sandbox_workspace_write.network_access=false \
  -c shell_environment_policy.inherit=core \
  -o <archivo-de-salida> "<encargo>" </dev/null
```

- `</dev/null` evita que se cuelgue esperando entrada.
- Dentro de Codex, `npm` se llama `npm.cmd`, porque PowerShell bloquea el otro.
- El encargo nombra la spec, los criterios y los archivos permitidos, y repite lo prohibido de este documento: no leer secretos, no transmitir, no definir `LIVE_PAYMENTS` y no debilitar una prueba. Los límites de un prompt no sustituyen el aislamiento del entorno.

### Al recibir el trabajo

Codex no hace commits ni PRs: su sandbox no puede escribir en `.git`. Claude:

1. Lee todo el diff y rechaza lo que salga de los archivos permitidos o afloje una prueba existente.
2. Corre él mismo los criterios. Que Codex diga que pasan no cuenta como evidencia.
3. Hace el commit, con la bitácora, y abre el PR.

**Si falla:** se reintenta una vez. Si vuelve a fallar, se cuelga o se queda sin memoria, Claude hace ese trabajo y lo anota en "Decisiones tomadas". No es un bloqueo.

## Qué puede y qué no puede hacer una ejecución autónoma

**Puede:** instalar las dependencias previstas en cada parte, levantar fork, almacenamiento auxiliar de pruebas y navegador, abrir PRs, y mergear a `staging` con CI verde si quien lanzó la ejecución lo autorizó.

**No puede, nunca:**

- Definir `LIVE_PAYMENTS`, transmitir a mainnet, firmar con una clave real o leer `.env` con claves.
- Crear, imprimir o pedir claves privadas o seeds.
- Mergear a `main`, forzar pushes o usar `--no-verify`.
- Crear cuentas, comprar servicios, escribirles a personas o enviar el formulario.
- Marcar una pieza como ⛓️ o afirmar algo probado sin evidencia.
- Cambiar una regla de `AGENTS.md`, D16 o la tabla de garantías para que una prueba pase.

## Regla de ambigüedad

1. Si lo definen el orden de autoridad o el código existente, se sigue eso.
2. Si no, se elige la opción más restrictiva con la plata y más simple de explicar, y se anota en `avance.md`, sección "Decisiones tomadas".
3. Si la elección cambia una garantía, mueve plata de otra forma o agrega un servicio pago: se frena esa pieza, se anota en "Bloqueos" y se sigue con lo que no dependa de ella.

## Bloqueos

Un permiso denegado, una dependencia que no instala o un servicio caído no se esquivan. Se anota en "Bloqueos" con el error exacto y se sigue con lo que no dependa de eso. Una prueba negativa que no da el resultado esperado **frena toda la plata**: no se debilita la prueba.

## Reglas de cada PR

- Rama desde `staging` actualizado, un tema por PR y Conventional Commits en inglés.
- Bitácora y estado de `maximiliano` en el mismo commit (`AGENTS.md` §4), con la skill `commit-docs`.
- Lo que toque `fondo/`, `chain/`, `payments/`, `config/` o `policy/`: skill `review` y una revisión aparte con otro agente, con hallazgos y resolución en el PR ([control-entrega](../../tareas/control-entrega.md#revisión-sin-un-segundo-integrante)). Lo que escribió Claude lo revisa Codex, con `-s read-only` y las mismas condiciones; lo de Codex, Claude. Si Codex no puede, revisa un subagente de Claude sin el contexto de la implementación, y el PR lo aclara.
- **Revisión final (S8-5):** la hace un subagente de Claude nuevo, sin el contexto de la implementación, sobre todo el fondo. Lee specs y código sin que le digan qué esperar.
- Antes de abrir el PR: `npm run check` y, desde S1, `npm run fondo:fork`. Desde S6 también `npm run fondo:independiente`: prueba de lectura y operación Safe 2 de 3 sin backend ni base de datos.

## Comando para `/goal`

Primero mergear el PR de estas specs, sincronizar D16 y `spec.md`, y preparar un entorno aislado sin secretos para la delegación. `/goal` evalúa solo lo que aparece en la conversación, así que la condición exige mostrar la salida del comando. Lanzarlo en modo automático:

```text
/goal Implementar en orden S1 a S8 de docs/proyecto/specs/README.md, siguiendo cada spec y marcando avance.md. Respetar la sección "Reparto entre Claude y Codex": lo crítico lo hace Claude, lo demás se encarga a Codex si se cumplen sus condiciones, y la revisión final de S8-5 la hace un subagente de Claude nuevo. La condición se cumple solo cuando la última salida mostrada de `npm run fondo:gate` contiene `GATE OK`, todos los PRs de S1 a S8 están mergeados en staging con CI verde, y la sección "Bloqueos" de avance.md está mostrada en la conversación. Autorizo mergear esos PRs a staging, nunca a main, después de la revisión que pide la spec. Nunca definir LIVE_PAYMENTS, transmitir a mainnet, leer claves reales, crear cuentas, escribirles a personas ni debilitar una prueba. Mantener el núcleo financiero operable sin base de datos; no convertir SQL en fuente de verdad. Si un bloqueo impide cerrar una parte, anotarlo y seguir con lo independiente; si no queda nada por hacer sin intervención humana, mostrar los bloqueos y detenerse. Detenerse también tras 150 turnos.
```

Si se llena el contexto o se agotan los créditos, `/goal` se corta: `avance.md` y los PRs permiten retomar con el mismo comando.

**Lo que este comando no termina:** S8 deja todo listo y probado en fork. Mainnet, las personas y la entrega necesitan a Maxi: [pasos humanos](09-pasos-humanos.md).
