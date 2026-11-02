# Control de entrega

**Responsable único:** Maxi ([D12](../proyecto/decisiones.md)). **Última revisión:** domingo 1/11/2026 (D13).
**Cierre oficial:** lunes 9/11, 09:00 GMT (06:00 ART). **Envío interno:** domingo 8/11 antes de las 20:00 ART.

Este archivo manda sobre las fechas de cualquier otro plan. La lista de tareas está en [maximiliano.md](maximiliano.md).

## Estado real al 1/11

| Tema | Estado | De dónde sale |
|---|---|---|
| Pipeline de envío, política, identidad y scripts | Hecho en el core, sin uso en mainnet registrado | `packages/core/` |
| Motor de juntas y sus tests | Hecho, en pausa por D11 | En `staging` desde el 1/11 |
| `staging` | Al día; no quedan PR viejos abiertos | PR #9 mergeado el 1/11 |
| Documentación de D11 y D12 | En `staging` desde el 1/11 | Este archivo |
| Producto final | Cerrado: D11 | D13.6 en `decisiones.md` |
| Inscripción y código `celo_...` | Sin confirmar | No hay `.env` en esta computadora |
| Identidad ERC-8004 | Sin evidencia | `public/agent.json` sigue con los valores de ejemplo |
| Spike de D7/D11 y primer pago | Sin evidencia | No existe `docs/pruebas/` |
| E1 (cotizaciones) | Sin evidencia; venció el 29/10 | No existe `docs/usuarios/` |
| Nombre | Sin decidir; venció el 27/10 | D6 reabierta |
| Contrato | No empezado | No existe `contracts/` |
| Módulo `compra/` | Reglas puras hechas y revisadas; falta conectarlas a la cadena | `packages/core/src/compra/` |
| Bot y web | No empezados | `apps/` solo tiene `package.json` y `README.md` |

"Sin evidencia" significa que no hay nada registrado en el repo. Si algo se hizo fuera del repo, se anota acá con su evidencia.

## Puertas

Una puerta se cierra solo con su evidencia. Si a la hora límite está abierta, esa misma noche se aplica el recorte que figura en la tabla, sin correr las fechas siguientes.

| # | Límite (ART) | Debe quedar | Evidencia | Si no se cumple | Estado |
|---|---|---|---|---|---|
| P0 | Lun 2/11, 12:00 | Inscripción confirmada; código `celo_...` y wallet del agente con fondos en `.env` | Entrada en `decisiones.md`; `preflight` sin errores | Sin inscripción o sin código, se frena todo lo demás hasta resolverlo: la etiqueta no se agrega después | Abierta |
| P1 | Mar 3/11, 23:59 | Primer pago con etiqueta verificada; ERC-8004 registrado con `agent.json` real; spike de autorización exacta, `transferFrom` y etiqueta desde el celular | `docs/pruebas/spike.md` con hashes | Falla el spike: plan B de transferencias directas, declarado en la demo. Falla el ERC-8004: es requisito, se sigue hasta resolverlo | Abierta |
| P2 | Mié 4/11, 23:59 | Contrato y checklist de Foundry en verde; segunda revisión hecha; pedidos de cotización enviados | Salida de `forge test`; hallazgos resueltos en el PR | Recortes 4 y 5. Si el jueves a la mañana sigue en rojo: plan B | Abierta |
| P3 | Jue 5/11, 23:59 | `compra/` con tests; web donde el comprador se compromete y cancela con su wallet; guarda de la CI resuelta | CI en verde; prueba local desde el celular | Recortes 6 y 7 | Abierta |
| P4 | Vie 6/11, 23:59 | Contrato en mainnet; agente con loop propio y bitácora pública; una campaña completa del equipo con plata real y montos chicos | Hashes de compromiso y ejecución en `docs/entrega/transacciones.md` | Recorte 8. Sin campaña real el viernes, el sábado se dedica solo a eso | Abierta |
| P5 | Sáb 7/11, 20:00 | Campaña chica con personas ajenas al equipo, si se cumple D11.5; cobro x402 probado o apagado; **código congelado** | Hashes y firmantes distintos; `docs/pruebas/x402.md` | Se muestra la campaña del equipo y se declara así en el pitch | Abierta |
| P6 | Dom 8/11, 20:00 | README, arquitectura, video, deck, formulario enviado; búsqueda de secretos en el historial; enlaces probados en incógnito | Confirmación del envío | Quedan 10 horas de margen hasta el cierre, solo para corregir el envío | Abierta |

## Orden de recorte

Se recorta de arriba hacia abajo, y solo lo necesario:

1. Cambio de nombre: se entrega con el nombre de trabajo.
2. Ripio (D9), `buy` (D13.5) y, si a las 20:00 del sábado no pasó sus criterios, el cobro por x402 (D13.3).
3. Cualquier demostración de juntas.
4. `permit`: queda `approve` exacto, con dos transacciones por comprador.
5. Fábrica: se despliega cada campaña directo, también sin admin ni actualizaciones.
6. Voto dentro de la web: se vota en el grupo y el resultado se publica al crear la campaña.
7. Landing: la página de la campaña alcanza.
8. Envío automático a proveedores: los pedidos los manda un humano y se declara así. El resto del loop sigue.

## Lo que no se recorta

- Celo mainnet y wARS real.
- Etiqueta ERC-8021 en cada transacción e identidad ERC-8004.
- Gas en stablecoin con CIP-64.
- Dry-run por defecto, topes y envío solo por `tagged-sender.ts`.
- Tests del contrato antes de mainnet.
- Loop propio y bitácora pública del agente (D13).
- Decir en el pitch qué es real, qué es simulado y qué falta.

## Revisión sin un segundo integrante

Vale desde D12 para todo lo que toque plata (`contracts/`, `chain/`, `payments/`, `policy/`, `compra/`):

- Antes de mergear, se corre la skill `review` y una revisión aparte con otro agente. Los hallazgos y cómo se resolvieron quedan en el PR.
- Una revisión con agentes no es una auditoría, y no se presenta como tal.
- Para P5 se mantienen las condiciones de D11.5: tests en verde, montos dentro del tope y riesgos por escrito.
- Si Esteban o Daniel pueden mirar el contrato, mejor; no es requisito.

## Rutina diaria

1. Al empezar: mirar la próxima puerta y elegir solo lo que la acerca.
2. Al terminar: actualizar la columna **Estado**, las tareas y `docs/miembros/maximiliano/estado.md`.
3. Si la puerta del día no cierra: aplicar el recorte y anotarlo acá.
