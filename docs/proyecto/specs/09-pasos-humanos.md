# Pasos humanos: mainnet, personas y entrega

Esto no lo puede cerrar `/goal`: necesita tu wallet, tu teléfono, tus cuentas o a otras personas. Los comandos que mueven plata se lanzan con `!`. Cada resultado va a `docs/pruebas/fondo.md` y al [control de entrega](../../tareas/control-entrega.md).

## Se pueden empezar ya, en paralelo a `/goal`

| # | Paso | Listo cuando |
|---|---|---|
| A1 | Pedirles a Esteban y Daniel ser responsables, con su propia wallet | Responden. Si no, el piloto queda como simulación (D16.20) |
| A2 | Pedir las cinco entrevistas, con el [guion](../../usuarios/guion-entrevistas.md) | Resultados anonimizados en `docs/usuarios/resultados.md` |
| A3 | Compra real por Ripio: KYC, costo, y si vende algo para pagar la comisión | Resultado anotado |
| A4 | Crear una base PostgreSQL gratuita y comprobar sus límites (primera opción: Neon) | `DATABASE_URL` en `.env` y en Vercel |
| A5 | Elegir dónde corre Vaqui (Railway si su plan gratis alcanza; si no, tu PC, declarado) | Decisión en D16 |
| A6 | Crear el bot con BotFather y, si querés LLM, una clave de API | Secretos en `.env` |

## Después de `GATE OK`

| # | Paso | Comando o acción | Evidencia |
|---|---|---|---|
| H1 | Desplegar la web | Vercel, con `SESSION_SECRET`, `DATABASE_URL` y `NEXT_PUBLIC_WC_PROJECT_ID` | URL pública |
| H2 | Crear la wallet operativa y fondearla con unos USDC | `! npm run fondo:wallet-operativa` | La dirección pública |
| H3 | Crear el grupo desde el celular, y dos responsables aprueban las reglas. Sin Esteban y Daniel, con tus tres wallets y como simulación | Web. `! npm run fondo:verificar -- <id>`. Abrir el [checker oficial](https://app.zodiac.eco/public/fallback-handler) | Hashes y verificación |
| H4 | Primer pago de Vaqui: crear un programado de $ 1 con el proceso ya en modo real | `! LIVE_PAYMENTS=si-muevo-plata-real npm run vaqui` | Hash, `tx:verificar`, CIP-64 en Celoscan |
| H5 | Un rechazo real | `! LIVE_PAYMENTS=si-muevo-plata-real npm run fondo:negativa-real -- <id>` | Hash del rechazo en Celoscan |
| H6 | Recorrido: aporte, gasto, devolución | Web, celular | Hashes de `approveHash` y `execTransaction`, con etiqueta verificada por separado |
| H7 | Cancelación, cambio de responsable, revocación y disolución | Web, celular | Hashes |
| H8 | Costos reales | `! npm run fondo:costos` | Tabla en `fondo.md` |
| H9 | Valora: repetir etiqueta y aporte | Celular | Hash, o declarar el recorte |
| H10 | Salida de pesos del destinatario | Prueba real | Resultado, o se declara pendiente |
| H11 | Personas invitadas, si se cumple D16.19 | Enlace directo, hasta $ 5.000 y con riesgos por escrito | Hashes, sin datos personales |

## Entrega

| # | Paso |
|---|---|
| H12 | Agregar la wallet operativa a la inscripción, si el formulario lo admite, con la del agente |
| H13 | Grabar el video con `guion-demo.md`, y armar el deck. Separar real, simulado y pendiente |
| H14 | Búsqueda de secretos en **todo** el historial |
| H15 | Mergear `staging` a `main`, enviar el formulario antes del domingo 8/11 a las 20:00 ART y probar los enlaces en incógnito |
