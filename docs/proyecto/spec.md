# La Vaquita: spec del producto

> Grupos y comunidades administran dinero compartido mediante reglas transparentes, sin depender de una sola persona. Vaqui automatiza operaciones dentro de los permisos que el grupo le concede.

**Decisión:** [D16](decisiones.md). **Glosario:** [`CONTEXT.md`](../../CONTEXT.md). **Cómo se construye y qué está probado:** [plan-fondo-compartido.md](plan-fondo-compartido.md). **Estado:** prototipo experimental; nada de esta spec está implementado todavía.

## 1. Problema

La plata de muchos grupos es de todos, pero está en la cuenta de una persona. Esa persona carga con la responsabilidad, los demás dependen de su buena voluntad, y cuando deja el rol la cuenta se va con ella.

Esta hipótesis sale de la [investigación del 4/11](../miembros/maximiliano/relevamientos/2026-11-04-fondos-compartidos.md). Falta validar que le pase a grupos reales en Argentina y que paguen el costo de usar una billetera ([§10](#10-validación)).

## 2. Para quién

**Piloto:** comunidades dev o web3 con aportes periódicos y alguien que hoy maneja la plata. Son accesibles y ya entienden las billeteras.

**No es el nicho definitivo.** La visión incluye comunidades, colectivos y equipos que administran dinero compartido, y el nicho se decide con evidencia.

## 3. Qué entra

- Crear un grupo con tres responsables.
- Registrar integrantes.
- Aportar pesos digitales (wARS) al fondo.
- Ver saldo e historial.
- Proponer y aprobar gastos.
- Acordar una cuota opcional y recordarla.
- Programar pagos y fijar los límites de Vaqui.
- Cambiar responsables y revocar a Vaqui.
- Pedir una devolución, salir del grupo y disolverlo.

**Fuera:** Splitwise completo, juntas, compras grupales, crédito, reputación, gobernanza general, rendimiento DeFi y monetización.

## 4. Roles

| Rol | Puede | No puede |
|---|---|---|
| **Integrante** | Aportar, ver el fondo y pedir una devolución | Proponer o aprobar gastos, o frenar a dos responsables |
| **Responsable** | Lo anterior, proponer gastos y aprobar junto con otro responsable | Mover el fondo solo |
| **Vaqui** | Recordar, explicar, preparar propuestas y ejecutar pagos programados dentro de sus límites | Aprobar, pagar a destinatarios nuevos, superar sus límites o cambiar sus permisos |
| **La Vaquita** | Operar la web y a Vaqui | Mover el fondo: no tiene llave |

## 5. Recorridos

### Crear un grupo
1. Quien crea el grupo indica a los tres responsables y paga el despliegue.
2. Antes de firmar, se avisa que perder dos wallets responsables puede trabar el fondo para siempre.
3. Dos responsables aprueban las reglas iniciales: los permisos, el presupuesto y los destinatarios de Vaqui.
4. Se comprueba la configuración. **Hasta entonces, la web no acepta aportes.**

### Aportar
1. El integrante abre la invitación y entra con su billetera.
2. Si le faltan pesos, usa "Cargar pesos" (Ripio).
3. Acepta que es un **aporte al grupo, no un ahorro individual**, que no hay retiro automático, quién controla el fondo y que es un prototipo.
4. Ve el monto y la comisión estimada, y firma.

Tope desde la interfaz: $ 5.000 por aporte.

### Gastar con aprobación
1. Un responsable propone un gasto, o Vaqui lo prepara: destinatario, monto y descripción.
2. Un responsable aprueba y otro aprueba y ejecuta. Cada uno firma y paga su comisión.
3. Vaqui avisa al grupo.

Hay una propuesta pendiente por grupo. Para cancelarla, dos responsables ejecutan un reemplazo; borrarla de la pantalla no alcanza.

### Pago programado
1. Dos responsables aprueban destinatario, token, importe, fecha, periodicidad y estado.
2. En la fecha, Vaqui lo ejecuta sin que nadie intervenga.
3. Si el pago excede sus límites, prepara una propuesta.

### Cuota
El grupo puede fijar una cuota periódica. La web calcula lo esperado y muestra quién está al día, y Vaqui recuerda. Sin cargos automáticos, multas ni expulsiones. Una cuota pendiente no es plata disponible.

### Salir de un grupo
La persona puede irse y pedir una devolución, que se aprueba como cualquier gasto. No es un derecho automático. El historial en cadena sigue, pero la aplicación deja de asociar públicamente su nombre.

### Cambiar un responsable
Dos responsables reemplazan al tercero. Lo pueden hacer sin él.

### Revocar o pausar a Vaqui
- **Pausa:** detiene nuestro servicio. No le quita el permiso en cadena.
- **Revocación:** dos responsables le quitan el permiso en cadena.

La interfaz nunca las presenta como equivalentes.

### Disolver
1. Se detienen los pagos programados.
2. Se revoca a Vaqui en cadena.
3. Se identifican las obligaciones pendientes.
4. Se prepara una propuesta de reparto, con una sugerencia proporcional a los aportes.
5. Dos responsables la aprueban, y pueden cambiarla.

## 6. Qué garantizamos y qué no

Lo que comunicamos tiene que coincidir con esta tabla.

| Afirmación | ¿Se puede decir? | Qué la sostiene |
|---|---|---|
| Ningún responsable mueve el fondo solo | **Sí**, una vez probado | Safe 2 de 3 |
| Vaqui no puede pagar a un destinatario no autorizado ni pasar $ 5.000 por pago | **Sí**, una vez probado | Zodiac Roles |
| Vaqui no puede pasar $ 20.000 cada 30 días | **Con matiz:** al cruzar la renovación puede gastar hasta dos presupuestos seguidos | Zodiac Roles |
| Dos responsables pueden revocar a Vaqui | **Sí**, una vez probado | Safe y Roles |
| Los movimientos son verificables | **Sí** | Cadena pública |
| Los integrantes están protegidos si dos responsables actúan de mala fe | **No.** La transparencia permite detectarlo, no impedirlo | — |
| Vaqui no puede pagar antes de la fecha | **No.** La fecha es de nuestro scheduler; con una clave robada se podría pagar antes, dentro del presupuesto | — |
| Un reparto está garantizado | **No.** Dos responsables pueden cambiarlo | — |
| El fondo no puede pasar $ 100.000 ni recibir más de $ 5.000 | **No.** Son límites operativos: se puede transferir directo | — |
| Una pausa protege frente a una clave robada | **No.** Solo la revocación quita el permiso | — |
| La plata no se puede perder o congelar | **No.** Se pueden perder dos wallets, y Ripio puede pausar o bloquear wARS | — |

## 7. Saldos

La cadena es la fuente de verdad. La web distingue:

- **Saldo total en cadena:** lo que realmente hay.
- **Aportes identificados:** registrados y atribuidos a un integrante.
- **Fondos sin atribución:** transferencias directas o de origen desconocido. No se asignan a nadie, no cuentan como cuota y no se presentan como aporte de un integrante.

## 8. Vaqui

Tareas:

- Recordar cuotas y aprobaciones pendientes.
- Explicar el estado del fondo y cada propuesta.
- Avisar de cada movimiento, incluidos los que no pasaron por la web.
- Ejecutar pagos programados.
- Preparar una propuesta cuando algo excede sus permisos.
- Avisar si el fondo pasa el objetivo de $ 100.000.

Reglas:

- El LLM analiza y explica. No elige destinatarios, no decide montos, no ve direcciones y no accede a claves.
- Ante un rechazo del token: muestra el fallo, identifica el estado, avisa y deja de reintentar si no es transitorio.
- Cada acción queda en la bitácora con su motivo.

## 9. Privacidad

- **En cadena:** montos y direcciones, públicos e imborrables. Una dirección no es anónima.
- **Fuera de cadena:** datos personales, descripciones y comprobantes. Se accede firmando con la wallet.
- **Telegram:** se vincula con un desafío único y con vencimiento, para que un mensaje reutilizado no vincule una wallet ajena.
- **Bitácora pública:** acción, motivo genérico y hash. Sin nombres ni alias que permitan relacionar a una persona con sus movimientos.

## 10. Validación

- **Entrevistas:** cinco organizadores reales, con [este guion](../usuarios/guion-entrevistas.md).
- **Etapa 1:** solo fondos y wallets del equipo, hasta completar aporte, gasto y devolución.
- **Etapa 2:** pocas personas invitadas, con su wallet y hasta $ 5.000, sin registro abierto y con los riesgos por escrito. No fondeamos a nadie.
- **Responsables:** tres personas independientes. Si no se consiguen, es una simulación y se dice.

**Sigue sin validar:** que los grupos lo quieran en lugar de una cuenta común, y quién pagaría una suscripción y por qué.

**Terminado para la entrega:** el recorrido completo funciona con dos responsables reales en mainnet, las pruebas negativas pasan, y lo que falte se declara. Sumar personas invitadas es la etapa siguiente, si pasan las condiciones de D16.19.

## 11. Riesgos para quien participa

Se muestran antes del primer aporte.

| Riesgo | Qué significa |
|---|---|
| Prototipo experimental | Sin auditoría propia ni evaluación regulatoria |
| Dos responsables de acuerdo | Pueden mover todo el fondo |
| Pérdida de acceso | Sin dos wallets responsables, el fondo se traba |
| Emisor de wARS | Ripio puede pausar, bloquear y actualizar el token |
| Clave de Vaqui | Una clave robada puede gastar dentro de sus límites, hacia destinatarios autorizados |
| Comisiones | wARS no paga comisiones: hace falta otra moneda |
| Sin retiro automático | Un aporte es del grupo |
