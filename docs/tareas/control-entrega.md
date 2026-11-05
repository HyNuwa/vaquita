# Control de entrega

**Responsable único:** Maxi ([D12](../proyecto/decisiones.md)). **Última revisión:** miércoles 4/11/2026 ([D16](../proyecto/decisiones.md)).
**Cierre oficial:** lunes 9/11, 09:00 GMT (06:00 ART). **Envío interno:** domingo 8/11 antes de las 20:00 ART.

Este archivo manda sobre las fechas de cualquier otro plan. La lista de tareas está en [maximiliano.md](maximiliano.md). El estado de cada pieza técnica está en el [plan](../proyecto/plan-fondo-compartido.md). Las [specs](../proyecto/specs/README.md) detallan cómo se implementa cada cosa, y sus pasos humanos.

## Estado real al 4/11

| Tema | Estado | De dónde sale |
|---|---|---|
| Producto | Cerrado: fondo compartido (D16). La compra colectiva queda en pausa | `decisiones.md` |
| Inscripción y código `celo_...` | Hechos; falta agregar la wallet a la inscripción | Perfil de Loops House; `preflight` |
| Identidad ERC-8004 | Hecha: Vaqui, `agentId` 10026 | `docs/pruebas/spike.md` |
| Etiqueta y CIP-64 | Probados en mainnet con la wallet del agente | `docs/pruebas/spike.md` |
| Etiqueta desde una billetera externa | Probada con MetaMask móvil; falta Valora | `docs/pruebas/spike.md` |
| Safe y Roles | Viabilidad vista en un fork con un script suelto; hashes comparados. Sin código del producto ni mainnet | [`fondo.md`](../pruebas/fondo.md) |
| Wallet operativa de Vaqui | Sin crear | D16.25 |
| Módulo `fondo/`, web del fondo, bot y proceso de Vaqui | Sin empezar | Plan §9 |
| Base de datos | Sin elegir proveedor | D16.30 |
| Entrevistas | Cero; guion listo | `docs/usuarios/` |
| Responsables del piloto | Falta confirmar a Esteban y Daniel | D16.20 |
| Compra de pesos por Ripio | Sin hacer | Plan §10 |

"Sin evidencia" significa que no hay nada registrado en el repo. Si algo se hizo fuera del repo, se anota acá con su evidencia.

## Puertas

Una puerta se cierra solo con su evidencia. Si a la hora límite está abierta, esa misma noche se aplica el recorte, sin correr las fechas siguientes.

| # | Límite (ART) | Debe quedar | Evidencia | Si no se cumple | Estado |
|---|---|---|---|---|---|
| P0 | Lun 2/11, 12:00 | Inscripción, código y wallet con fondos | `preflight` sin errores | — | Cerrada |
| P1 | Mar 3/11, 23:59 | Primer pago, ERC-8004 y etiqueta desde el celular | `docs/pruebas/spike.md` | — | Cerrada, con MetaMask como prueba técnica |
| P2 | Mié 4/11, 23:59 | D16 mergeada. Contratos verificados contra las fuentes oficiales. Wallet operativa creada. Safe, Roles y permisos corriendo en fork, con las pruebas negativas. Pedidos de entrevista enviados; respuesta de Esteban y Daniel | `docs/pruebas/fondo.md`; salida de las pruebas | Si Safe y Roles no sirven en fork, el jueves a la mañana se vuelve a decidir (D16.24) | Abierta |
| P3 | Jue 5/11, 23:59 | `fondo/` con tests. Safe real con Roles verificado, con fondos del equipo. `approveHash` y `execTransaction` con etiqueta. Un pago de Vaqui, y un rechazo real en mainnet. Compra por Ripio | Hashes y `tx:verificar` en `docs/pruebas/fondo.md` | Recortes 1 a 3 | Abierta |
| P4 | Vie 6/11, 23:59 | Web: crear grupo, aportar, ver saldos, proponer y aprobar, desde el celular. Lector, base de datos y scheduler con Vaqui en marcha. Recorrido del equipo: aporte, gasto, pago de Vaqui y devolución | Hashes; prueba desde el celular | Recortes 4 a 6. Sin recorrido real el viernes, el sábado se dedica solo a eso | Abierta |
| P5 | Sáb 7/11, 20:00 | Revocación, cambio de responsable y disolución en mainnet. Bot. Cinco entrevistas registradas. Personas invitadas, si se cumple D16.19. **Código congelado** | Hashes; `docs/usuarios/resultados.md` | Sin invitados: se muestra el recorrido del equipo y se declara. Menos de cinco entrevistas: se declara cuántas | Abierta |
| P6 | Dom 8/11, 20:00 | README, arquitectura, video, deck y formulario. Búsqueda de secretos en el historial. Enlaces probados en incógnito | Confirmación del envío | Quedan 10 horas de margen, solo para corregir el envío | Abierta |

## Orden de recorte

Se recorta de arriba hacia abajo, y solo lo necesario:

1. Etiqueta probada en Valora: queda MetaMask, y se declara.
2. Salida de pesos: se declara pendiente.
3. Disolución en la web: se ejecuta por script y se muestra el reparto.
4. Cuotas en la web: quedan los aportes.
5. Bot de Telegram completo: quedan los avisos.
6. Personas invitadas: se declara.

## Lo que no se recorta

- Celo mainnet y wARS real.
- Etiqueta ERC-8021 en cada transacción e identidad ERC-8004.
- Gas en stablecoin con CIP-64 en la wallet de Vaqui.
- Dry-run por defecto, topes y envío solo por `tagged-sender.ts`.
- **Verificación de versiones antes de conectar fondos.**
- **Límites de Vaqui en cadena y todas las pruebas negativas.**
- Que Vaqui ejecute un pago programado sin intervención, con bitácora.
- Revocación en cadena.
- Decir en el pitch qué es real, qué es simulado y qué falta, y respetar la [tabla de garantías](../proyecto/spec.md#6-qué-garantizamos-y-qué-no).

## Revisión sin un segundo integrante

Vale desde D12 para todo lo que toque plata (`fondo/`, `chain/`, `payments/`, `policy/`, `config/`, y los permisos de Roles):

- Antes de mergear, se corre la skill `review` y una revisión aparte con otro agente. Los hallazgos y cómo se resolvieron quedan en el PR.
- Una revisión con agentes no es una auditoría, y no se presenta como tal.
- Para invitar personas se cumplen las condiciones de D16.19.
- Si Esteban o Daniel pueden mirar los permisos, mejor; no es requisito.

## Rutina diaria

1. Al empezar: mirar la próxima puerta y elegir solo lo que la acerca.
2. Al terminar: actualizar la columna **Estado**, las tareas y `docs/miembros/maximiliano/estado.md`.
3. Si la puerta del día no cierra: aplicar el recorte y anotarlo acá.
