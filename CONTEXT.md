# La Vaquita

Plataforma para que grupos y comunidades administren dinero compartido mediante reglas verificables, sin depender del control unilateral de un organizador. Este glosario fija el lenguaje del producto.

## Lo que ve la persona

**Grupo**:
Conjunto de personas que comparten un fondo y sus reglas.
_Evitar_: comunidad (como término del producto), DAO, micro-DAO

**Fondo del grupo**:
La plata que pertenece al grupo, según la ve una persona en la interfaz.
_Evitar_: tesorería, vaquita, bóveda, pozo, Safe (en textos para usuarios)

**Integrante**:
Persona que forma parte de un grupo, puede aportar y ve su fondo.
_Evitar_: miembro, comprador, participante

**Responsable**:
Integrante que puede aprobar gastos junto con otro responsable. Un grupo tiene tres y ninguno puede mover el fondo solo.
_Evitar_: administrador, organizador, tesorero, firmante

**Aporte**:
wARS que un integrante pone en el fondo del grupo.
_Evitar_: depósito, contribución, compromiso

**Aporte no identificado**:
wARS que entró al fondo sin atribución a un integrante. No cuenta como cuota pagada.
_Evitar_: aporte anónimo, donación

**Cuota**:
Aporte periódico acordado por el grupo. Es una expectativa, no un cobro ni plata disponible.
_Evitar_: deuda, mora

**Gasto**:
Salida de plata del fondo hacia un destinatario.
_Evitar_: pago (cuando se habla del fondo), retiro

**Devolución**:
Gasto aprobado que le devuelve plata a un integrante. No es un derecho automático.
_Evitar_: retiro, reembolso

**Destinatario autorizado**:
Dirección a la que Vaqui puede pagar, aprobada por dos responsables.
_Evitar_: proveedor, beneficiario

**Pago programado**:
Gasto recurrente o con fecha, aprobado por dos responsables, que Vaqui ejecuta. Su fecha no es una garantía en cadena.
_Evitar_: débito automático, suscripción

**Disolución**:
Cierre de un grupo mediante una propuesta que reparte el fondo restante.
_Evitar_: liquidación garantizada

**Propuesta**:
Gasto o cambio de reglas que espera la aprobación de dos responsables.
_Evitar_: votación, solicitud

**Límite del agente**:
Monto y frecuencia máximos que Vaqui puede gastar sin una propuesta, aplicados en cadena.
_Evitar_: presupuesto (a secas), permiso

## El agente

**Vaqui**:
El agente de La Vaquita. Opera con permisos limitados y revocables; no es responsable ni dueño del fondo.
_Evitar_: Sapo, bot (para hablar del agente), asistente

**Pausa de Vaqui**:
Detención de nuestro servicio. No le quita el permiso en cadena.
_Evitar_: revocación, bloqueo

**Revocación de Vaqui**:
Eliminación en cadena de su permiso, aprobada por dos responsables.
_Evitar_: pausa, desactivar

## Arquitectura

**Tesorería**:
La cuenta en cadena que guarda el fondo de un grupo. Es un término interno, nunca de la interfaz.
_Evitar_: billetera común, wallet del grupo
