# S6 · Web

`apps/web`, móvil primero: 360 px de ancho sin desplazamiento horizontal, botones de al menos 48 px y contraste AA. La UX es prioridad: alguien que nunca usó cripto tiene que entender qué pasa, y antes de cada firma, qué está por firmar y qué riesgo corre.

Antes de escribir pantallas, cargar las skills `impeccable` y `mobile-native`. CSS propio con variables, sin librerías de componentes nuevas. Texto en español rioplatense. `/prueba-firma` se elimina.

## Lenguaje

**Prohibido en pantalla:** Safe, tesorería, Zodiac, Roles, módulo, gas, wei, nonce, hash, calldata, contrato, token, multifirma, on-chain. Un test (S6-3) recorre los textos.

**Direcciones:** solo cuando son imprescindibles, cortas (`0x1F1C…4170`) y con botón "Copiar". **Montos:** `$ 1.234,50`, con `formatLocal`.

**Reemplazos:** comisión (gas), pesos digitales (wARS), confirmar en tu billetera (firmar), ver comprobante (Celoscan).

## Rutas

| Ruta | Quién | Contenido |
|---|---|---|
| `/` | Público | Qué es, qué no es, "Es un prototipo", y "Crear un grupo" |
| `/grupos` | Sesión | Sus grupos |
| `/grupos/nuevo` | Sesión | Asistente de creación |
| `/i/[token]` | Público | Invitación |
| `/g/[id]` | Integrante | Fondo del grupo |
| `/g/[id]/aportar` | Integrante | Aporte |
| `/g/[id]/gastos/nuevo` | Responsable | Proponer un gasto |
| `/g/[id]/propuestas/[pid]` | Integrante | Detalle; aprobar si es responsable |
| `/g/[id]/programados` | Integrante | Lista y creación |
| `/g/[id]/ajustes` | Integrante | Vaqui, destinatarios, responsables, cuota, salir y disolver |
| `/vaqui` | Público | Bitácora y quién es Vaqui |
| `/riesgos` | Público | Tabla de riesgos de la spec §11 |

## Componentes de firma

**`PasoDeFirma`** se usa en toda transacción. Muestra, antes de abrir la billetera: qué se hace en una frase, monto, destinatario y comisión estimada. Usa `firmarYEsperar` de `lib/firmar.ts` y consulta `GET /api/tx/:hash`: **una transacción confirmada no es un gasto hecho hasta ver el evento.**

| Estado | Texto |
|---|---|
| Listo | Botón: "Confirmar en mi billetera" |
| Firmando | "Confirmá en tu billetera…" |
| `rechazada` | "Rechazaste la firma. No se hizo nada." |
| `sin-enviar` | "No se pudo enviar a tu billetera. No se hizo nada; probá de nuevo." |
| `pendiente` | "Se envió, pero todavía no se confirmó. Revisá en unos minutos antes de volver a firmar." |
| `reemplazada` | "Cancelaste o cambiaste la operación desde tu billetera. Esta firma no se aplicó." |
| `fallida` | "La operación no se completó. No se movió plata, pero la comisión se cobró." |
| Confirmada, con evento | "Listo." + "Ver comprobante" |
| Confirmada, sin evento | "Se confirmó, pero todavía no vemos el resultado. Actualizamos en unos segundos." |

**Comisión estimada:** `estimateGas` por el precio actual, en CELO, más su equivalente en dólares si `money/fx.ts` responde. Si no se puede estimar: "Tu billetera te muestra la comisión antes de confirmar." Si no tiene saldo de comisión: "Necesitás un poco de CELO en tu billetera para pagar la comisión. Los pesos digitales no sirven para eso." Valores de referencia medidos en fork: [fondo.md](../../pruebas/fondo.md).

**`Montos`** usa `parseLocalAmount`. Acepta `1.500,50`, y rechaza negativos y más de 2 decimales.

## Crear un grupo

Asistente de una pantalla por paso, que se puede retomar: siempre consulta `creacion/siguiente`.

1. **Datos:** nombre y destinatario inicial, con alias y dirección. Texto: "Vaqui solo va a poder pagarle a quien autoricen."
2. **Responsables:** "Un grupo tiene tres responsables. Dos juntos pueden mover el fondo; uno solo, no." El creador elige si es responsable. Se generan los enlaces, con "Copiar" y "Compartir".
3. **Espera:** se muestra quién aceptó. Cada responsable abre su enlace, entra con su billetera y acepta. Así no hay que escribir direcciones ni se puede cargar una mal.
4. **Aviso obligatorio:** "Si se pierden dos de las tres billeteras responsables, la plata puede quedar trabada para siempre. La Vaquita no tiene una llave para rescatarla." Con casilla de aceptación.
5. **Crear:** dos `PasoDeFirma` del creador: crear el fondo y preparar los permisos de Vaqui.
6. **Reglas:** "Dos responsables tienen que aprobar qué puede hacer Vaqui": destinatarios, "$ 5.000 por pago", "$ 20.000 cada 30 días". Con la advertencia: "Al cruzar la renovación, Vaqui podría gastar hasta $ 40.000 en poco tiempo." El creador no puede saltear este paso.
7. **Verificación:** lista de controles en lenguaje simple. Si falla, muestra cuál y **no acepta aportes**.
8. **Activo:** enlace de invitación para integrantes.

## Fondo del grupo: `/g/[id]`

Orden de arriba hacia abajo:

1. **Saldo total:** "Hay en el fondo", con el dato de la última actualización.
2. **Desglose:** "Aportes identificados" y "Fondos sin identificar", con el texto "Entraron sin que sepamos de quién. No se asignan a nadie y no cuentan como cuota."
3. **Pendiente:** propuesta por aprobar, con botón si es responsable; aviso de desactualizada si corresponde.
4. **Botón principal:** "Aportar".
5. **Cuotas:** "Es un acuerdo del grupo, no un cobro." Quién está al día, sin montos de deuda, sin la palabra "mora".
6. **Pagos programados:** próximo, con "La fecha la aplica Vaqui: no está garantizada por la red."
7. **Historial:** movimientos con comprobante. Los que no pasaron por la web también. Las alertas se destacan.
8. **Responsables e integrantes.**

Si `simulacion` es `true`: franja fija "Grupo de prueba: los tres responsables no son personas independientes." Si pasa el objetivo: "Este grupo pasó los $ 100.000 de referencia."

## Aportar

1. Primer aporte en el grupo: aceptar, con casillas separadas: "Es un aporte al grupo, no un ahorro mío", "No hay retiro automático: una devolución la aprueban dos responsables", "Es un prototipo experimental", y "Leí quién controla el fondo y los riesgos". Se guarda con `riesgos_version`.
2. Monto, con tope de $ 5.000.
3. Saldo de pesos insuficiente: "Cargar pesos", con `ramp/ripio.ts`. Si no se probó la carga real, con el texto: "Te llevamos a Ripio, un servicio externo."
4. `PasoDeFirma`.

## Propuestas

**Proponer:** destinatario, monto y descripción. Si hay otra pendiente: "Ya hay una propuesta esperando. Aprobala o cancelala antes de crear otra."

**Detalle:** qué hace, quién propuso, quién aprobó, y según el caso:

- Sin aprobación propia: "Aprobar".
- Con una aprobación ajena: "Aprobar y ejecutar", con simulación previa.
- Ya aprobada por él: "Esperando a otro responsable. Podés avisarle."
- "Cancelar": "Para cancelarla, dos responsables tienen que aprobar el reemplazo. Borrarla de la pantalla no alcanza."
- `desactualizada`: "El fondo cambió por fuera de esta propuesta. Ya no se puede ejecutar."

**Devolución:** un integrante la pide con monto y motivo. "Dos responsables la tienen que aprobar. No es automática."

## Ajustes

- **Vaqui**: dos acciones separadas y siempre explicadas:
  - **Pausar:** "Frena nuestro servicio. No le quita el permiso. Si robaran su clave, todavía podría pagar dentro de sus límites."
  - **Revocar:** "Le quita el permiso de verdad. Tienen que aprobarlo dos responsables."
- **Destinatarios:** agregar o quitar es una propuesta.
- **Responsables:** "Cambiar responsable", propuesta de los otros dos. Avisa que los pagos programados pueden requerir nueva aprobación.
- **Cuota:** monto y día, con "No se cobra sola".
- **Salir:** "Tu historial en la red queda; dejamos de mostrar tu nombre." Responsable: "Primero tienen que reemplazarte."
- **Disolver:** los cinco pasos de la spec, en orden, con reparto sugerido y editable. "Es una sugerencia: dos responsables pueden cambiarla." Muestra los fondos sin identificar.

## Estados generales

Cada pantalla tiene carga, vacío y error con salida. Billetera en otra red: la cambia `firmarYEsperar`; si falla: "Cambiá a Celo en tu billetera." Sin sesión: "Entrar con mi billetera". Sin billetera en el celular: enlaces a Valora y MetaMask.

Sin conexión a la base: se muestra el saldo desde la cadena, con "Algunos datos no están disponibles."

## E2E

`npm run e2e`, con Playwright fijo en la raíz, Chromium, viewport 360×740 y `isMobile`. Fuera de la CI. Levanta anvil, PostgreSQL local con `docker-compose.dev.yml`, Next en modo producción y el proceso de Vaqui con `E2E_FORK=1`. Si Docker no está corriendo, se anota en Bloqueos.

**Billetera de prueba:** conector `mock` de wagmi activado solo con `E2E_FORK=1`, con RPC local. `lib/wagmi.ts` no lo incluye en el paquete salvo con ese valor, y **`next build` falla si `E2E_FORK=1` coincide con `VERCEL` o `NODE_ENV=production` sin `E2E_PERMITIDO=1`**. Cuentas con `anvil_impersonateAccount`, generadas en la corrida.

| ID | Recorrido |
|---|---|
| E1 | Crear grupo con tres responsables y llegar a `activo` |
| E2 | Rechazar un aporte antes de `activo`; aceptar riesgos y aportar después |
| E3 | Los tres saldos, incluida una transferencia directa sin identificar |
| E4 | Proponer, aprobar con uno, ver que no se ejecuta, y aprobar y ejecutar con otro |
| E5 | Cancelar con reemplazo |
| E6 | Crear un pago programado con dos firmas; Vaqui lo paga |
| E7 | Pago sobre el tope: se prepara una propuesta |
| E8 | Pausar: no paga. Reanudar. Revocar: la verificación lo refleja y no paga |
| E9 | Cambiar un responsable sin el tercero |
| E10 | Pedir devolución y aprobarla; salir del grupo |
| E11 | Disolver y repartir |
| E12 | Rechazo de firma, error de red y comisión insuficiente |

## Criterios de aceptación

| ID | Nivel | Debe pasar |
|---|---|---|
| S6-1 | Local | `npm run build -w @vaquita/web` |
| S6-2 | Local | Paquete del navegador sin `VAQUI_OPERATIVA_PRIVATE_KEY`, `DATABASE_URL`, `SESSION_SECRET` ni `pg` |
| S6-3 | CI | Sin palabras prohibidas en los textos |
| S6-4 | Local | `npm run e2e`: E1 a E12 |
| S6-5 | Local | Captura móvil de cada pantalla en `docs/pruebas/capturas/`, sin direcciones reales, revisada con la skill `impeccable` |
| S6-6 | Local | Sin desplazamiento horizontal a 360 px, y foco visible con teclado |
| S6-7 | CI | Producción no incluye el conector `mock` |
