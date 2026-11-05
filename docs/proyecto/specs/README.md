# Specs de implementación del fondo compartido

Estas specs bajan [spec.md](../spec.md) y [D16](../decisiones.md) a un nivel que se puede ejecutar sin preguntar. Si una decisión falta, se aplica la [regla de ambigüedad](#regla-de-ambigüedad).

**Orden de autoridad:** `AGENTS.md` > D16 > `spec.md` > estas specs > `plan-fondo-compartido.md`. La [tabla de garantías](../spec.md#6-qué-garantizamos-y-qué-no) no se puede contradecir nunca.

## Orden

Cada parte se hace en orden, en su propia rama y su propio PR contra `staging`.

| Parte | Archivo | Quién | Termina cuando |
|---|---|---|---|
| S1 | [Contratos y fork](01-contratos-y-fork.md) | Autónomo | `npm run fondo:contratos` y los negativos en fork pasan |
| S2 | [Core del fondo](02-core-fondo.md) | Autónomo | Módulos puros con tests y recorridos en fork |
| S3 | [Datos, acceso y API](03-datos-y-api.md) | Autónomo | Migraciones y rutas con tests sobre PGlite |
| S4 | [Lector](04-lector.md) | Autónomo | Caídas, duplicados y reorganizaciones cubiertos |
| S5 | [Vaqui y pagos programados](05-vaqui.md) | Autónomo | Sin pago doble, con recuperación tras caída |
| S6 | [Web](06-web.md) | Autónomo | E2E móvil contra el fork |
| S7 | [Bot y LLM](07-bot.md) | Autónomo | Avisos y herramientas de solo lectura |
| S8 | [Cierre autónomo](08-cierre-autonomo.md) | Autónomo | `npm run fondo:gate` imprime `GATE OK` |
| H | [Pasos humanos en mainnet y entrega](09-pasos-humanos.md) | **Maxi** | Evidencia en `docs/pruebas/fondo.md` y envío |

El avance se marca en [avance.md](avance.md), en el mismo PR que hace el trabajo.

## Qué puede y qué no puede hacer una ejecución autónoma

**Puede:** instalar las dependencias previstas en cada parte, levantar fork, PostgreSQL local y navegador, abrir PRs, y mergear a `staging` con CI verde si quien lanzó la ejecución lo autorizó.

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
- Lo que toque `fondo/`, `chain/`, `config/` o `policy/`: skill `review` y una revisión aparte con otro agente, con hallazgos y resolución en el PR ([control-entrega](../../tareas/control-entrega.md#revisión-sin-un-segundo-integrante)).
- Antes de abrir el PR: `npm run check` y, desde S1, `npm run fondo:fork`.

## Comando para `/goal`

Primero mergear el PR de estas specs. `/goal` evalúa solo lo que aparece en la conversación, así que la condición exige mostrar la salida del comando. Lanzarlo en modo automático:

```text
/goal Implementar en orden S1 a S8 de docs/proyecto/specs/README.md, siguiendo cada spec y marcando avance.md. La condición se cumple solo cuando la última salida mostrada de `npm run fondo:gate` contiene `GATE OK`, todos los PRs de S1 a S8 están mergeados en staging con CI verde, y la sección "Bloqueos" de avance.md está mostrada en la conversación. Autorizo mergear esos PRs a staging, nunca a main, después de la revisión que pide la spec. Nunca definir LIVE_PAYMENTS, transmitir a mainnet, leer claves reales, crear cuentas, escribirles a personas ni debilitar una prueba. Si un bloqueo impide cerrar una parte, anotarlo y seguir con lo independiente; si no queda nada por hacer sin intervención humana, mostrar los bloqueos y detenerse. Detenerse también tras 150 turnos.
```

Si se llena el contexto o se agotan los créditos, `/goal` se corta: `avance.md` y los PRs permiten retomar con el mismo comando.

**Lo que este comando no termina:** S8 deja todo listo y probado en fork. Mainnet, las personas y la entrega necesitan a Maxi: [pasos humanos](09-pasos-humanos.md).
