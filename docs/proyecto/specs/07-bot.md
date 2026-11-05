# S7 · Bot y LLM

`apps/bot`, con **grammY** fija y, solo si hay clave, **`@anthropic-ai/sdk`** fijo y modelo `claude-haiku-5-5`, configurable en `ANTHROPIC_MODEL`. Anotar en `stack.md`. Long polling. Sin `TELEGRAM_BOT_TOKEN`, el proceso corre igual sin bot. **Sin `ANTHROPIC_API_KEY`, el bot funciona con plantillas:** el LLM no es requisito de nada.

## Vincular una cuenta

1. `/vincular` en un privado genera un desafío: uso único, 10 minutos, con `telegram_id`.
2. El bot manda un enlace a la web con el `nonce`.
3. En la web, con sesión de wallet, la persona firma un mensaje que incluye `nonce`, `telegram_id` y dominio. Eso pasa por `POST /api/telegram/vincular`.
4. Se guarda el vínculo. Un mensaje reutilizado no vincula nada.

## Comandos

| Comando | Devuelve |
|---|---|
| `/start` | Qué es y cómo vincular |
| `/vincular`, `/desvincular` | Vínculo |
| `/grupos` | Sus grupos |
| `/estado` | Saldos y pendientes de un grupo |
| `/pendientes` | Lo que espera su aprobación, con enlace a la web |
| `/pausar` | Enlace a Ajustes con la explicación de pausa y revocación. No pausa desde el chat |

**El bot nunca pide una clave ni una seed,** nunca firma, y nunca ejecuta un pago ni un cambio. Si alguien pega algo que parezca una clave o una seed: no lo procesa, no lo envía al LLM, no lo registra, y responde que es un riesgo y que debe mover sus fondos.

## Avisos

Salen de la tabla `avisos`, por mensaje privado a cada integrante vinculado. Reintentan sin duplicar. Texto de plantilla con nombres y montos, sin direcciones ni jerga.

| Evento | Quién recibe |
|---|---|
| Aporte, gasto o pago de Vaqui | Integrantes |
| Fondos sin identificar | Responsables |
| Propuesta nueva, o aprobada por uno | Responsables |
| Recordatorio de aprobación tras 24 h, y cada 24 h hasta 3 veces | Responsables que faltan |
| Cuota: día de vencimiento y 3 días después | Quien está pendiente, en privado, nunca en un mensaje público |
| Pago programado por exceder límites, sin saldo o con reaprobación | Responsables |
| Alerta de reglas | Todos |
| Objetivo de $ 100.000 superado | Responsables |
| Pausa o revocación | Integrantes |

## LLM

Solo para preguntas en texto libre: "¿cuánto hay?", "¿qué es esta propuesta?".

**`fondo/herramientas.ts`:** solo lectura, entrada zod `.strict()` y nombres en español: `estado`, `ver_propuesta`, `ver_movimientos`, `ver_cuotas`, `ver_programados`, `explicar_limites`, `preparar_borrador_propuesta`.

- Reciben un **`alias` de grupo** resuelto por el código entre los grupos de quien pregunta. El LLM nunca ve direcciones, hashes, claves ni montos en wei: solo textos ya formateados y alias.
- **Ninguna paga.** `preparar_borrador_propuesta` no crea nada: devuelve un enlace al formulario web, sin destinatario ni monto elegidos por el LLM. La persona los completa.
- Los textos del grupo y de los integrantes llegan como datos, marcados como no confiables. Si piden algo, no se obedece.
- Sin memoria entre conversaciones. Tope de 5 llamadas por mensaje y de 20 mensajes por persona por hora.
- Ante error, plantilla: "No pude responder eso. Mirá el fondo acá: <enlace>."

`explicar_limites` siempre incluye: el peor caso de $ 40.000, que la pausa no quita el permiso, y que la fecha no es una garantía.

## Criterios de aceptación (CI, sin red, con cliente de Telegram y LLM falsos)

| ID | Debe pasar |
|---|---|
| S7-1 | Desafío vencido, reutilizado o con otro `telegram_id` rechazado |
| S7-2 | Un no vinculado no ve ningún dato; un vinculado, solo sus grupos |
| S7-3 | Ningún aviso se manda dos veces, incluso reiniciando |
| S7-4 | Texto con forma de clave o seed: no llega al LLM ni a los logs |
| S7-5 | Una herramienta con dirección, campo extra o alias ajeno se rechaza |
| S7-6 | Lo enviado al LLM no tiene direcciones, hashes ni claves, en una prueba con datos reales de ejemplo |
| S7-7 | Inyección en una descripción de propuesta: no cambia herramientas ni resultados |
| S7-8 | Ninguna herramienta importa `chain/`, `tagged-sender` o escribe en la base, comprobado con un test sobre los imports |
| S7-9 | Sin `ANTHROPIC_API_KEY`, responde con plantillas |
| S7-10 | Sin `TELEGRAM_BOT_TOKEN`, lector y programador siguen funcionando |
