# Debate, ronda 3 — atacar v4: compromiso sin depósito

**Fase:** diseño · abogado del diablo técnico y jurídico  
**Proyecto:** La Vaquita 2 → v4, comunidades propietarias  
**Fecha:** 2026-10-25  
**Confianza:** media en viabilidad técnica; baja en encuadre jurídico y negocio.

**[Opinion] Veredicto:** v4 reduce exposición a fondos depositados, pero exagera la firmeza del compromiso, la independencia del token y la facilidad del contrato. Seguir con validación y prototipo local; todavía no habilitar compras de terceros en mainnet.

## 1. Técnico: atomicidad no garantiza ejecución

**[Opinion]** `ejecutar()` es viable si todos los movimientos pertenecen a una sola transacción y cualquier déficit final revierte también cobros y comisiones. Saltar compradores cambia quién compra: hacen falta mínimo y máximo de unidades, precio unitario fijo y regla determinística de selección/sobreventa aceptados por proveedor y compradores. N wallets no prueban N personas. No corresponde recalcular precios discrecionalmente al ejecutar.

**[Opinion]** Revisar saldo y autorización es insuficiente: `transferFrom` puede fallar por otras restricciones. Para el MVP, saltaría solamente insuficiencias comprobadas y cancelaciones; un error inesperado del token revierte todo. Saltar cualquier fallo exige aislar cada intento y verificar transferencia efectiva: complejidad que v4 omite. No contar llamadas que devuelvan `false` como cobros.

**[Data] wARS:** dirección tomada de `tokens.ts`: `0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d`. Celoscan enlaza su proxy con la implementación verificada `LatamStable`; su ABI expone `permit(owner,spender,value,deadline,v,r,s)`, `nonces`, `DOMAIN_SEPARATOR`, `pause/unpause`, `blockUser/unblockUser`, `setEnforceBlocklist` y actualización UUPS. Hay interfaz EIP-2612, pausa y lista de bloqueo; no comprobé firmas reales, roles actuales ni bloqueo/pausa activos. [Proxy](https://celoscan.io/address/0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d#code), [implementación](https://celoscan.io/address/0xBa0030Bba7112171A8A5bCc417ee1994051321b9#code).

**[Opinion] Riesgos concretos:**

- **Griefing:** revocar antes de la inclusión puede impedir el mínimo y quemarle gas al ejecutor. No hay intercalado de otra transacción dentro de `ejecutar()`. Simular ayuda, no reserva fondos; el mismo saldo puede respaldar varias campañas.
- **Front-running:** una ejecución puede adelantarse a la revocación. Publicar «revocado» solo tras confirmación. Copiar `ejecutar()` no debe permitir cambiar destinatarios, comisión ni selección. `permit` autoriza gasto, no acredita por sí solo consentimiento a todas las condiciones; su vencimiento limita presentar la firma, no necesariamente la autorización ya creada.
- **Reactivación:** gastar el saldo no cancela: al recargarlo, el permiso sigue vigente. Agregar `cancelarCompromiso()` irreversible para esa adhesión; evitar firmas reutilizables. Nunca pedir aprobaciones infinitas.
- **Gas/Sybil:** limitar inscripciones y recorrido completo, incluidos insolventes; nadie debe llenar la lista gratis hasta bloquearla. Medir peor caso; «10–50 razonable» sigue sin evidencia. Fraccionar cobros entre transacciones pierde atomicidad.
- **Reentrancia/token:** guardia y estados antes de llamadas externas; probar callbacks y cambios del token. Una pausa global o bloqueo del proveedor puede impedir todo. Fábrica sin admin no elimina al administrador de wARS.
- **Dirección equivocada/inmutabilidad:** verificar identidad y control del proveedor, además del formato. Fijar destino y condiciones antes de adhesiones; un error exige campaña nueva y consentimiento nuevo. Sin admin tampoco hay rescate ni corrección unilateral.

**[Opinion] Patrón recomendado:** fábrica y campañas sin upgrades, inicialización atómica, token fijo, términos inmutables, lista acotada de compradores aprobada por la comunidad, ventana de ejecución, cancelación individual, estados abierta/ejecutada/vencida y ejecución única con `nonReentrant` y `SafeERC20`. Registro propio o firma del comprador vincula campaña, cadena, importe total, proveedor, comisión y nonce. Transferir directamente comprador→proveedor dentro de la misma transacción evita acumular fondos; si no alcanza el mínimo, revertir todo. Confirmar importes recibidos y registrar compras, no meras autorizaciones.

**[Opinion] Tests mínimos locales, sin red:** mínimo−1/mínimo/máximo; saldo insuficiente y revocación antes de ejecutar; rollback completo incluyendo comisión; duplicados, sobreventa y selección; doble ejecución, cancelación y recarga; límites temporales; firmas vencidas/repetidas/otra campaña o cadena; `permit` presentado previamente por otro; token pausado, bloqueos de comprador/proveedor/contrato, `false`, revert, transferencia incompleta y reentrancia; inicialización y destino inválidos; gas máximo con insolventes. Agregar invariantes de conservación y cobro único, revisión independiente y validación del pipeline ERC-8021/CIP-64, modo ensayo y topes del repo.

**[Data] Precedentes:** Settly describe liquidación grupal approve-pull en testnet; no demuestra crowdfunding sin depósito. La auditoría de Oak documenta gasto de autorizaciones ajenas y su corrección vinculando parámetros firmados, pero usa tesorerías. No encontré un precedente verificado del mecanismo completo v4; ninguno acredita su seguridad. [Settly](https://ethglobal.com/showcase/settly-sb0k3), [Oak](https://www.openzeppelin.com/news/oak-network-smart-contracts-audit).

## 2. Jurídico: mejor argumento, ninguna exclusión automática

**[Data]** RG 1172/2026: art. 2(iii) del capítulo sustituido excluye protocolos condicionadamente a ausencia de control/influencia suficiente que preste servicios PSAV; 2(iv), proveedores exclusivamente de billeteras de autocustodia sin facultades de administración/disposición. Art. 9 distingue transferencia (3) de custodia/administración (4). [Texto oficial](https://www.argentina.gob.ar/normativa/nacional/norma-431259/texto).

**[Opinion] Inferencia:** no depositar no resuelve ambas categorías. Permiso exacto, revocable y destino fijo mejoran el argumento; operar cobros automatizados por terceros puede seguir siendo transferencia o administración. «Sin admin» no decide influencia efectiva. Cobrar interfaz al ejecutar no crea una exención: recibir honorarios propios y ejecutar pagos ajenos son hechos distintos.

**[Opinion] Preguntas al abogado:** ¿qué categoría corresponde al flujo completo? ¿`approve` conserva control exclusivo? ¿Quién influye mediante interfaz, selección y automatización? ¿Qué cambia con ejecución exclusiva del comprador o comunidad? ¿Cómo separar honorarios y responsabilidades?

**[Data]** Ola-1 §4 no identifica exención IGJ general por vender software. **[Opinion]** Pedir además análisis de captación pública, adjudicación de bienes, mandato, entrega, cancelación y consumo: evitar depósito no prueba quedar afuera. Esto requiere revisar contratos y publicidad concretos.

## 3. Negocio: corregir qué se puede saltear

**[Opinion]** Una comisión fijada en la campaña no desaparece cambiando interfaz: para evitarla hay que crear otra campaña. Si `ejecutar()` permite elegir cero, sí es eludible. Inmutabilidad del precio consentido es compatible con ausencia de control discrecional.

**[Assumption]** Ni 2% de interfaz ni 5–8% externo tienen pago observado. La comisión facturada requiere atribución, contrato comercial y cobranza; el proveedor puede saltearla al repetir. Ambas juntas deben dejar ahorro frente a compra directa.

**[Estimate]** Con volumen de $1.000.000, 2% produce $20.000 brutos solo si se cobra íntegro; faltan soporte, adquisición, impuestos y operación. No demuestra margen.

**[Opinion] Tercer modelo:** tarifa fija por pedido de cotización y negociación, pagada por quien encarga el servicio, contra entregables y fuera del flujo de compras. Monetiza trabajo aunque la comunidad ejecute por otra interfaz. Validar una factura pagada y repetición; tampoco está probado.

## 4. Puntaje

**[Estimate]** La media original es 30/7 = 4,29: aritmética correcta, precisión aparente.

| Problema | Mercado | Ventaja | Factibilidad | Modelo | Equipo | Momento | Total |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 5 | 3 | 3 | 4 | 3 | 4 | 5 | **27/7 ≈3,9** |

**[Opinion]** Bajo ventaja por falta de evidencia de valor diferencial y factibilidad por seguridad, wallet, regulación y plazo. Subir exige oferta escrita, compra con ahorro neto, servicio pago, repetición y revisión técnica/jurídica favorable.

## Flags

- **Red — [Opinion]:** demanda e ingresos sin validar; posible actividad regulada; pago atómico no garantiza entrega.
- **Yellow — [Opinion]:** permisos revocables, token administrable, ejecución costosa fallida y cambio de alcance cerca del cierre.

## Fuentes

**[Data]** Consulta web: 2026-10-25; enlaces primarios junto a cada hallazgo. Base local: [v4 §§3/5](../v4-comunidades-propietarias.md), [ola-1 §4](raw/ola-1.md), [tokens.ts](../../../../packages/core/src/config/tokens.ts), [AGENTS.md](../../../../AGENTS.md). Protocolo: `C:/Users/Usuario/.claude/plugins/cache/startup-skill/startup/a5f97c317b93/startup-design/references/honesty-protocol.md`.
