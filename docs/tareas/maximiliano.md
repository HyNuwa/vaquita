# Tareas · Maximiliano

**Rol:** responsable de toda la entrega ([D12](../proyecto/decisiones.md)): producto, cadena, core, agente, web y envío. **Plan actualizado al 4/11 (D16).** Las puertas P0 a P6 y qué se recorta si una no cierra están en [control-entrega.md](control-entrega.md).

## Archivos y módulos bajo tu responsabilidad

Todos los de la [tabla de áreas](README.md#áreas).

## Plan

Fuente de producto: [D16](../proyecto/decisiones.md), [spec](../proyecto/spec.md) y [plan técnico](../proyecto/plan-fondo-compartido.md).

### P0 y P1 · Cerradas

Primer pago, ERC-8004 y etiqueta desde el celular: [`docs/pruebas/spike.md`](../pruebas/spike.md). De la inscripción, falta agregar la wallet `0x1F1C…4170`, para cuando haya demo.

### P2 · Miércoles 4/11

| Tarea | Estado |
|---|---|
| Registrar D16 y reescribir la documentación | Hecho, en PR |
| Verificar Safe y Roles en Celo contra las fuentes oficiales: bytecode y direcciones. Tomar `MultiSendCallOnly` | Pendiente |
| Agregar direcciones a `config/`, validadas por red; rechazar las versiones con fallo | Pendiente |
| Crear la wallet operativa de Vaqui, con su clave solo en secretos | Pendiente |
| Armar el fork local: Safe, Roles y permisos | Pendiente |
| Correr las pruebas negativas en fork | Pendiente |
| Medir costos de crear un grupo y de cada operación | Pendiente |
| Pedirles a Esteban y Daniel que sean responsables, con su propia wallet | Pendiente (Maxi) |
| Enviar los pedidos de entrevista | Pendiente (Maxi) |

### P3 · Jueves 5/11

| Tarea | Estado |
|---|---|
| `fondo/`: transacciones, Safe, Roles y verificación, con tests sin red | Pendiente |
| Ajustar `tagged-sender.ts` para `execTransactionWithRole`, con su tope de gas | Pendiente |
| Safe real con Roles y verificación completa, incluido el checker oficial | Pendiente |
| `approveHash` y `execTransaction` con etiqueta, verificados por separado | Pendiente |
| Pago de Vaqui con CIP-64 y un rechazo real en mainnet | Pendiente |
| Compra de pesos por Ripio: KYC, costos y moneda para la comisión | Pendiente (Maxi) |
| Elegir proveedor de PostgreSQL y verificar el plan gratuito | Pendiente |

### P4 · Viernes 6/11

| Tarea | Estado |
|---|---|
| Web: crear grupo, invitar, aportar, ver los tres saldos, proponer y aprobar, con textos de riesgo | Pendiente |
| Lector con cursor, sin duplicados y con recuperación | Pendiente |
| Base de datos y acceso con firma de wallet | Pendiente |
| Pagos programados: aprobación de dos firmas y scheduler sin pago doble | Pendiente |
| Proceso de Vaqui, bitácora pública y dónde corre | Pendiente |
| Recorrido del equipo en mainnet: aporte, gasto, pago de Vaqui y devolución | Pendiente |

### P5 · Sábado 7/11

| Tarea | Estado |
|---|---|
| Revocación, cambio de responsable y disolución en mainnet | Pendiente |
| Bot: avisos, recordatorios, explicaciones y vínculo con Telegram por desafío | Pendiente |
| Cuotas | Pendiente |
| Cinco entrevistas, en `docs/usuarios/resultados.md` | Pendiente (Maxi) |
| Personas invitadas, si se cumple D16.19 | Pendiente |
| Probar la salida de pesos; si no, se declara | Pendiente |
| Instalar Valora y repetir la prueba de etiqueta | Pendiente (Maxi) |
| Congelar el código a las 20:00 | Pendiente |

### P6 · Domingo 8/11, 20:00

| Tarea | Estado |
|---|---|
| README, arquitectura y pitch; distinguir lo real, lo simulado y lo que falta | Pendiente |
| Grabar el video y armar el deck | Pendiente |
| Buscar secretos en todo el historial | Pendiente |
| Mergear `staging` a `main`, enviar el formulario y probar los enlaces en incógnito | Pendiente |

**Fuera:** todo lo que [D16.1](../proyecto/decisiones.md) deja afuera, x402, `buy` y la demora con veto (D16.23).

**En pausa, con su código:** compra colectiva (D16) y juntas (D11.7). Tareas anteriores: historial de Git de este archivo.

## Entregables

- Inscripción, código de atribución e identidad ERC-8004 verificados.
- Safe y Roles verificados, con hashes de aprobaciones, pagos y rechazos.
- Vaqui ejecutando pagos programados sin intervención y dentro de límites en cadena.
- Web usable desde el celular, con montos locales y riesgos antes de firmar.
- Entrevistas registradas, con lo bueno y lo malo.
- Entrega enviada el **8/11 antes de las 20:00 ART**, con evidencias de qué es real, qué es simulado y qué falta. Cierre oficial: **lunes 9/11, 09:00 GMT (06:00 ART)**.
