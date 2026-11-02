# Tareas · Maximiliano

**Rol:** responsable de toda la entrega ([D12](../proyecto/decisiones.md)): producto, contrato, cadena, core, agente, web y envío. **Plan actualizado al 1/11.** Las puertas P0 a P6 y qué se recorta si una no cierra están en [control-entrega.md](control-entrega.md).

## Archivos y módulos bajo tu responsabilidad

Todos los de la [tabla de áreas](README.md#áreas).

## Plan

Fuente de producto: [D11](../proyecto/decisiones.md), [D13](../proyecto/decisiones.md) y [plan de compra colectiva](../proyecto/plan-compra-colectiva.md).

### P0 · Lunes 2/11, 12:00

| Tarea | Venía de | Estado |
|---|---|---|
| Elegir el producto: D11 (D13.6) | Nueva | Hecho el 1/11 |
| Confirmar inscripción, wallet inscripta, código `celo_...` y campos del formulario | Santos | Sin confirmar |
| Crear `.env` en esta computadora y fondear la wallet del agente; correr `preflight` | Esteban | Pendiente |
| Commitear D11 y D12; mergear el PR #9 y cerrar los PR viejos | Maxi | Hecho el 1/11 |

### P1 · Martes 3/11

| Tarea | Venía de | Estado |
|---|---|---|
| Primer pago mínimo real (`pago:primero`) con la etiqueta verificada (`tx:verificar`) | Esteban | Sin evidencia |
| Completar `public/agent.json` y registrar ERC-8004 (`identidad:registrar`) | Esteban | Sin evidencia |
| Spike: wARS, autorización exacta, `transferFrom`, etiqueta desde el celular y conciliación; peor caso de gas; resultado en `docs/pruebas/spike.md` | Esteban | Sin evidencia |
| Probar `permit` con firma real, si no se recortó | Esteban | Pendiente |
| Definir cómo firma el comprador desde la web sin romper la regla 9 ni la guarda de la CI | Maxi | Pendiente |

### P2 · Miércoles 4/11

| Tarea | Venía de | Estado |
|---|---|---|
| `CompraColectiva` y fábrica sin admin ni actualizaciones, con términos inmutables, lista acotada y tope de $ 5.000 | Esteban | Pendiente, condicionado al spike |
| Foundry: [checklist del plan](../proyecto/plan-compra-colectiva.md#4-checklist-de-tests-en-foundry), con fuzzing e invariantes | Esteban | Pendiente |
| Segunda revisión del contrato con la skill `review` y otro agente; resolver hallazgos | Maxi | Pendiente |
| E1: elegir una necesidad digital real y enviar los pedidos a 3–15 proveedores. Corte nuevo: jueves 5/11, 12:00 | Maxi | Sin evidencia |
| Preguntas legales por escrito: CNV, IGJ, consumo y entrega | Maxi | Pendiente |

### P3 · Jueves 5/11

| Tarea | Venía de | Estado |
|---|---|---|
| Registrar el resultado de E1, aunque sea cero | Maxi | Pendiente |
| `compra/`: cotizaciones, voto, elegibilidad, selección determinística y estado desde eventos; montos `bigint`, tests sin red | Maxi | Reglas puras hechas el 2/11 |
| Lector de eventos: hash + índice de log, bloque y campaña; reprocesamiento sin doble conteo | Esteban | Pendiente |
| Web `/c/:slug`: ofertas, voto, compromiso y cancelación con wallet propia, progreso e historial | Maxi | Pendiente |

### P4 · Viernes 6/11

| Tarea | Venía de | Estado |
|---|---|---|
| Desplegar y verificar en Celo mainnet; probar etiqueta, CIP-64 y wallet móvil | Esteban | Pendiente, sujeto a tests y revisión |
| Bot y loop del LLM con esquemas zod `.strict()` y alias | Daniel | Pendiente |
| Las 7 herramientas del [plan](../proyecto/plan-compra-colectiva.md#6-el-agente), incluidas `pedir_cotizaciones` y `recordar_compromisos` | Daniel | Pendiente |
| Loop propio: disparadores, límites y ejecución sin confirmación manual, con tests sin red (D13.1) | Nueva | Reglas hechas; falta el proceso que las corre |
| Bitácora pública del agente en la web (D13.2) | Nueva | Registro hecho; falta mostrarla en la web |
| Mensajes sobre fondos, cancelación irreversible, entrega y errores, sin jerga cripto | Daniel | Pendiente |
| Campaña completa del equipo con plata real y montos chicos | Todos | Pendiente |

### P5 · Sábado 7/11

| Tarea | Venía de | Estado |
|---|---|---|
| Campaña chica con personas ajenas al equipo, si se cumple D11.5 | Maxi | Pendiente |
| Cobro x402 en wARS detrás de `X402_ENABLED`: pago real mínimo y criterios de D8 en `docs/pruebas/x402.md`; si no pasa, queda apagado (D13.3) | Nueva | Pendiente |
| Evidencias: despliegues, código verificado, compromisos, ejecución, importes, `verifyTx` y ERC-8004 | Esteban | Pendiente |
| Congelar el código a las 20:00 | Maxi | Pendiente |

### P6 · Domingo 8/11, 20:00

| Tarea | Venía de | Estado |
|---|---|---|
| README, arquitectura y pitch; distinguir lo real, lo simulado y lo que falta | Maxi | Pendiente |
| Grabar el video y armar el deck | Maxi, Daniel | Pendiente |
| Buscar secretos en todo el historial | Esteban | Pendiente |
| Mergear `staging` a `main`, enviar el formulario con la wallet PayTo si x402 quedó activo, y probar los enlaces en incógnito | Maxi | Pendiente |

**Alternativas:** sin ofertas escritas al 5/11, campaña del equipo con proveedor amigo, declarada en el pitch. Sin spike aprobado, transferencias P2P directas registradas por el agente, sin ejecución atómica: pierde la prueba del profesor y no se presenta como equivalente.

**Fuera de la entrega salvo que sobre tiempo:** nombre comercial nuevo, Ripio (D9), `buy` (D13.5) y juntas.

## Hecho (en pausa por D11)

| Fecha | Trabajo conservado | Estado |
|---|---|---|
| 22/10 | Modelo de obligaciones: reglas, obligaciones por ronda, pagos tardíos, estado de ronda y compromisos por turno | Hecho (en pausa por D11) |
| 22/10 | Buscador de órdenes según cuánto puede adelantar cada miembro | Hecho (en pausa por D11) |
| 24/10, PR #6 | Decisiones: D7, D2, D10, D5, D6, `.env` único, alcance y estructura | Hecho; juntas en pausa, D7 y alcance reemplazados por D11, D6 reabierta; D5 y estructura vigentes |
| 24/10 | Escenarios de incumplimiento y propuesta escrita de D2; D2 decidida | Hecho (en pausa por D11) |

## Entregables

- Inscripción, código de atribución e identidad ERC-8004 verificados.
- Contrato probado y con segunda revisión; campaña real con hashes comprobables.
- Agente y web usables desde el celular, con montos locales y riesgos antes de firmar.
- Entrega enviada el **8/11 antes de las 20:00 ART**, con evidencias de qué es real, qué es simulado y qué falta. Cierre oficial: **lunes 9/11, 09:00 GMT (06:00 ART)**.
