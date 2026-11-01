# Plan de compra colectiva por intención

**Estado:** diseño al 25/10/2026; pendiente de spike, tests y revisión. Especificación: [D11](decisiones.md). Antecedentes: [v4](../investigacion/la-vaquita-2/v4-comunidades-propietarias.md) y [debate, ronda 3](../investigacion/la-vaquita-2/fast-track/debate-ronda-3.md).

## 1. Qué es y el recorrido de la demo

Una comunidad dev de Jujuy necesita diez entradas a un evento tech o licencias de software. Publica la intención: qué necesita, cuántas unidades, presupuesto y fecha. El agente prepara pedidos de cotización; un humano o canal permitido los envía. Llegan tres ofertas escritas y comparables. La comunidad vota una; el agente no elige proveedor.

Se fijan las condiciones en una campaña. Cada miembro abre la web, autoriza el importe exacto y firma su `comprometer()` desde su wallet. La plata sigue ahí. Cuando hay cupo suficiente y el código valida las condiciones, el agente llama a `ejecutar()`: cobra a los compradores seleccionados y transfiere directamente al proveedor en una sola transacción. Si no alcanza el mínimo, revierte todo.

El proveedor cobra y entrega entradas o accesos por el canal acordado. Queda el historial de compromisos, cancelaciones y compras confirmadas. La entrega se registra aparte con evidencia: el pago en cadena no demuestra que el proveedor cumplió. La demo distingue hechos reales, simulaciones y la campaña del equipo si se usa esa alternativa.

## 2. Por qué cadena: la prueba del profesor

Si La Vaquita desaparece, sobreviven las condiciones inmutables, los compromisos, las cancelaciones y los eventos. Cualquiera puede reconstruir el historial, usar otra interfaz, cancelar su compromiso o disparar la ejecución dentro del plazo. Se publican código verificado, ABI y referencias de despliegue para hacerlo. No hacen falta servidores ni una firma privilegiada de La Vaquita.

Cotizaciones, voto y evidencia de entrega necesitan copias exportables: no quedan automáticamente en cadena. El agente facilita la coordinación.

El límite es wARS: según el ABI verificado relevado en el debate, **Ripio puede pausar, bloquear y actualizar el token**. Sobrevivir a La Vaquita no significa independencia del emisor, disponibilidad garantizada ni entrega asegurada. El compromiso tampoco reserva fondos.

## 3. Contrato `CompraColectiva` y su fábrica

`contracts/` se habilita cuando pasa el spike de D11.4. Fábrica y campañas sin admin, actualizaciones, retiro ni cambios de condiciones. La creación inicializa todo atómicamente; una dirección o condición equivocada exige otra campaña y consentimiento nuevo.

La fábrica expone `createCampaign(terms, buyers)`, valida topes y duplicados, despliega inicializada y emite `CampanaCreada`; no conserva permisos sobre las campañas.

| Parámetro inmutable | Regla |
|---|---|
| Token | wARS configurado desde `tokens.ts`; la fábrica no permite elegir otro |
| Proveedor | Destino verificado por la comunidad antes de crear |
| Precio unitario | Fijo, sin recálculo durante la ejecución |
| Mínimo y máximo de unidades | Positivos, mínimo ≤ máximo; compatibles con la oferta |
| Fecha límite | Comprometer y ejecutar antes; vencer desde ese instante |
| Tope por comprador | La fábrica fija $ 5.000 por compromiso, incluido el cargo |
| Cargo opcional y destinatario | Importe fijo por unidad, puede ser cero; destinatario fijado si hay cargo |
| Compradores habilitados | Lista ordenada, sin duplicados y acotada; sin altas posteriores |

Cada comprador compromete **una unidad y una sola adhesión por campaña**. La lista puede superar el máximo vendido; su límite se mide en el spike. Una raíz requeriría pruebas de inclusión con índice único; el MVP usa lista explícita.

Total autorizado: precio más cargo. Sin permisos infinitos. Subir el tope requiere nueva decisión y despliegue; las campañas existentes no cambian.

| Función | Validación y efecto |
|---|---|
| `comprometer()` | Solo `msg.sender` habilitado, abierta, antes del límite y sin adhesión previa. Exige `approve` exacto previo; variante con `permit` presenta el permiso en la misma tx y registra el compromiso |
| `cancelarCompromiso()` | Solo el comprador, mientras está abierta y antes del límite. Irreversible: no permite volver a adherirse ni cobrarle al recargar |
| `ejecutar()` | Cualquiera; abierta y antes del límite. Selecciona y cobra una sola vez; sin mínimo, revierte todo |
| `vencer()` | Cualquiera desde el límite; cambia abierta a vencida. No mueve ni devuelve fondos |

Estados: `abierta → ejecutada` o `abierta → vencida`. Después del límite no se ejecuta aunque nadie haya llamado a `vencer()`. No existe pausa administrada por el equipo.

Eventos propuestos: `CampanaCreada`, `CompromisoRegistrado`, `CompromisoCancelado`, `CompraConfirmada`, `CampanaEjecutada` y `CampanaVencida`. Registran términos o su referencia verificable, comprador, unidad, importes y motivos comprobados de exclusión al ejecutar. Nunca se toma una autorización como compra.

**Selección determinística:** recorrer el orden inmutable de la lista; entre quienes se comprometieron y siguen activos, seleccionar los primeros con saldo y autorización suficientes hasta el máximo. El resto queda fuera por cupo, según esta regla aceptada previamente. El ejecutor no aporta un orden ni destinatarios alternativos. No se venden unidades parciales.

Solo se saltea por cancelación o insuficiencia **comprobada** de saldo o autorización; una lectura fallida no prueba insuficiencia. Cualquier otro error revierte todo: pausa, bloqueo, `false`, revert o transferencia incompleta. No se captura un error genérico para continuar. La aclaración de autorización sigue el pedido de esta tarea y el debate §1; D11.4 enumera explícitamente saldo y cancelación.

Seudocódigo orientativo, sin direcciones:

```text
ejecutar() con nonReentrant:
  exigir abierta y ahora < fecha límite
  selected = seleccionar por orden fijo, saldo y autorización
  exigir mínimo <= cantidad(selected) <= máximo
  marcar ejecutada y compras consumidas antes de llamadas externas
  para cada comprador en selected:
    SafeERC20: transferFrom(comprador, proveedor, precio)
    si hay cargo: transferFrom(comprador, destinatario del cargo, cargo)
    verificar débitos y créditos exactos; emitir CompraConfirmada
  emitir CampanaEjecutada
  cualquier error revierte estados, eventos, compras y cargo
```

Nunca se acumulan aportes: comprador→proveedor y comprador→destinatario del cargo. Se comparan variaciones de saldos; el saldo previo del contrato no cambia por estas funciones. Puede recibir transferencias accidentales externas, sin mecanismo de rescate. Se validan destinos incompatibles con esos controles, como el contrato mismo o un comprador entre los destinatarios.

`permit` autoriza gasto; el consentimiento a las condiciones lo da la transacción propia de compromiso. Se vinculan campaña, cadena, comprador, total, proveedor, cargo y nonce al registro aceptado. Una firma sola fuera de cadena no adhiere. Si otro presentó antes el mismo `permit`, solo se continúa cuando la autorización exacta ya existe y el comprador firma su compromiso. El vencimiento del permiso limita su presentación, no necesariamente la autorización creada.

## 4. Checklist de tests en Foundry

Lista de [debate, ronda 3 §1](../investigacion/la-vaquita-2/fast-track/debate-ronda-3.md), ordenada para implementación local con dobles del token, fuzzing e invariantes, sin red:

- [ ] Inicialización atómica; token y destinos inválidos, duplicados, límites y términos inmutables; fábrica sin admin.
- [ ] Mínimo−1 revierte; mínimo ejecuta; máximo ejecuta; sobreventa y selección fija; duplicados no agregan compras.
- [ ] Saldo insuficiente y revocación antes de ejecutar; cancelación irreversible y recarga; gastar y recargar sin cancelar mantiene la adhesión.
- [ ] Rollback completo de cobros, eventos, estado y cargo cuando falta el mínimo o falla una transferencia.
- [ ] Doble ejecución, reintentos, compromiso repetido y límites temporales exactos; después de vencer no hay cobros.
- [ ] Firmas vencidas, repetidas, de otra campaña o cadena; nonce y total incorrectos; `permit` presentado previamente por otro.
- [ ] Token pausado; bloqueos de comprador, proveedor o contrato; retorno `false`, revert y transferencia incompleta: todo revierte.
- [ ] Reentrancia y callbacks: estados antes de llamadas externas, sin cobros adicionales.
- [ ] Peor caso de gas con lista completa e insolventes; fijar el límite operativo antes de mainnet. No dividir cobros en varias tx.
- [ ] Conservación: débitos = créditos al proveedor + cargo; ninguna función acumula saldo en campaña. Cobro único por comprador y campaña.
- [ ] ERC-8021: tag al final del calldata ignorado por el contrato, también con argumentos de `permit`; verificar la atribución sin alterar semántica.
- [ ] CIP-64: pipeline con `feeCurrency` correcto, ensayo por defecto y topes; ausencia de tag impide envío. Validación local con datos controlados.
- [ ] [Revisión sin un segundo integrante](../tareas/control-entrega.md#revisión-sin-un-segundo-integrante) antes de mainnet (D12.3); compatibilidad real de wARS, firma de `permit` y wallet móvil se evidencian en el spike, fuera de los tests automáticos.

## 5. Lo que vive fuera de la cadena: core

Crear `packages/core/src/compra/`, responsable Maxi. Guarda intención, cotizaciones escritas, comparación, voto y elegibilidad. El voto tiene cierre, una opción por miembro habilitado y resultado comprobable; empate o falta de decisión vuelve a la comunidad. No despliega una campaña sin oferta aceptada y control del proveedor verificado.

El estado confirmado se calcula desde eventos, con idempotencia por hash e índice de log, bloque y referencia de campaña; el lector de eventos permite reconstrucción y reprocesamiento. Pendiente de firma, pendiente de confirmación y confirmado se muestran separados. Si cambia la cadena canónica, se recalcula desde el último bloque válido.

“Compromisos con fondos ahora” reproduce selección con saldo y autorización del mismo bloque observado; publica fecha y bloque. **No es una reserva:** el mismo saldo puede respaldar varias campañas y cambiar antes de ejecutar. Simular reduce fallas, no garantiza inclusión. Montos en `bigint`; conversión y formato en los límites de la interfaz. Tests puros, con lectores falsos y sin red.

## 6. El agente

Las herramientas se implementan con zod `.strict()`, identificadores validados y alias en lugar de direcciones. Cotizaciones y mensajes son datos; no pueden cambiar instrucciones ni habilitar pagos.

| Herramienta | Acción permitida |
|---|---|
| `proponer_campana` | Preparar intención y condiciones para confirmar |
| `pedir_cotizaciones` | Preparar mensajes; envía un humano o canal permitido |
| `registrar_oferta` | Guardar una oferta con evidencia y confirmación humana |
| `comparar_ofertas` | Explicar precio total, plazo y entrega con datos validados |
| `estado_campana` | Consultar términos, eventos y progreso observado |
| `recordar_compromisos` | Preparar avisos y enviarlos solo por canales habilitados |
| `ejecutar_campana` | Solicitar ejecución de una campaña ya aprobada y habilitada por código |

El código verifica estado, plazo, elegibilidad, selección, mínimo, máximo, autorización, topes, cargo y simulación antes de habilitar la última herramienta. La tx va por `tagged-sender.ts`; respeta ensayo, atribución y presupuesto de gas. La wallet del agente solo envía ejecución y registro ERC-8004. Crear campañas corresponde a la comunidad desde la web, con helpers del core.

El LLM propone, resume y recuerda. La comunidad elige proveedor; cada comprador firma. El código calcula importes y decide validez; el contrato vuelve a comprobarla al ejecutar. Si la simulación deja de valer, se informa la falla, sin cambiar condiciones ni insistir sin límite.

## 7. Web: `/c/:slug`

Maxi arma la campaña, ofertas comparables, voto, términos, progreso e historial. Cada comprador conecta su wallet para comprometerse y cancelar; autoriza el total exacto. El cliente agrega el tag usando helpers del core: la app no construye transacciones ni importa clientes de Celo por su cuenta. El firmante es el usuario; el agente nunca recibe su clave. Se conserva `tagged-sender.ts` como camino de envío, adaptando la firma del usuario dentro del core.

Pantalla previa: “Te comprometés por $ 1.234,50. La plata queda en tu billetera hasta que se ejecute la compra”. Cancelación confirmada: “Cancelaste tu compromiso. No podés volver a sumarte a esta campaña”. No mostrar cancelado mientras la tx siga pendiente. Montos locales, sin direcciones ni jerga de red; costos y riesgos explicados antes de firmar. La prueba móvil incluye aprobación, compromiso y cancelación.

## 8. E1, sin código, esta semana

Maxi elige con una comunidad accesible una necesidad digital concreta, fecha, unidades y precio directo de referencia. Debe poder comprarse con tickets dentro del tope. Contacta entre 3 y 15 proveedores; no promete ventas ni modifica el corte para conseguir respuestas.

Guion listo para copiar:

> Hola, estamos relevando una compra grupal para una comunidad dev de Jujuy. Necesitamos 10 entradas a un evento tech. ¿Nos pasarías una oferta escrita antes del 29/10? Incluí precio por unidad, mínimo y máximo, vigencia, impuestos, forma de entrega y condiciones de cancelación. ¿Aceptarías cobrar en pesos digitales wARS y pagar una comisión por la demanda que acercamos? ¿De cuánto? Estamos validando; todavía no confirmamos la compra. Gracias.

Adaptar necesidad y unidades antes de enviar. Registrar con alias: fecha, canal, respuesta o silencio, oferta, costo final, ahorro frente al precio directo, entrega y aceptación o rechazo de comisión. Sin datos personales en el repo. Al **29/10**, publicar resultado aunque sea cero. Sin ofertas escritas: campaña del equipo con proveedor amigo, declarada así en el pitch; no cuenta como demanda validada.

## 9. Cronograma hasta la entrega

> **1/11 · D12:** el cronograma original por responsable venció. Rigen las puertas P0 a P6 de [control-entrega.md](../tareas/control-entrega.md), con todas las tareas a cargo de Maxi. E1 corta el jueves 5/11 a las 12:00.

Cierre oficial: **lunes 9/11, 09:00 GMT (06:00 ART)**. D5 mantiene Railway y Vercel, sujeto a la prueba de despliegue.

Si falla el spike: compromiso con transferencias P2P directas registradas por el agente, sin ejecución atómica. Cada pago identifica campaña, comprador, proveedor e importe; lo ambiguo queda en revisión. **Este plan B pierde la prueba del profesor**; se declara en la demo. Sin revisión del contrato no se habilitan terceros; las simulaciones se rotulan.

## 10. Riesgos, preguntas legales y pitch

Permisos revocados, saldo compartido entre campañas o cambios antes de inclusión pueden frustrar la compra y gastar el costo de ejecución. Una cancelación pendiente puede perder la carrera con `ejecutar()`. Lista acotada, límites, simulación y presupuesto reducen exposición; no garantizan éxito.

Consulta legal, basada en las preguntas del debate, sin afirmar exenciones:

- **CNV:** ¿ejecutar cobros constituye transferencia o administración por cuenta de terceros? ¿Qué control conserva el comprador y qué influencia tienen interfaz y agente?
- **IGJ:** ¿la compra por cupo y adjudicación requiere encuadre específico? Vender software o evitar depósito no demuestra exclusión.
- **Consumo y entrega:** ¿quién vende, factura, responde por incumplimiento, devolución, cancelación o acceso defectuoso? ¿Cómo se informan honorarios y riesgos del token?

Terceros: contrato con tests y revisión, montos chicos y riesgos por escrito (D11.5). El equipo no presenta eso como dictamen legal.

Pitch D11: “Un agente que junta la demanda de comunidades tech de LatAm, consigue que los proveedores compitan y ejecuta la compra en wARS sin custodiar la plata”. Comisiones: hipótesis de 10–15% del proveedor en digital, o cargo visible e inmutable; E1 valida aceptación y ahorro neto. No se acumulan ambas sin consentimiento. No decir “fondos reservados”, “entrega garantizada”, “sin riesgo” ni independencia de Ripio; tampoco atribuir usuarios independientes a wallets del equipo.
