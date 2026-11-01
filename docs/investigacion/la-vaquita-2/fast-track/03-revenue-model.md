# Modelo de ingresos — B1 y alternativa B2

**Fase:** 7 — Modelo de ingresos · Etapa A, basada en supuestos  
**Proyecto:** La Vaquita v3  
**Fecha:** 2026-10-25  
**Confianza:** Baja: cero entrevistas, sin cobros, renovación ni soporte propios medidos.

**[Opinion] Veredicto: Riesgoso.** B1 mejora la contribución hipotética de A, pero exige cobrar por funciones ya ofrecidas y sostener renovación alta. Borrador sin superar el Research Gate; sin proyecciones completas.

## Precio a probar y anclas

**[Data]** Única consulta web nueva: **Banco Nación, dólar billete vendedor, 23/10/2026, 17:03: $ 1.550/USD**, consultado el 25/10. [Fuente oficial](https://www.bna.com.ar/Personas). **[Estimate]** Conversión comparativa: `ARS = USD × 1.550`; sin impuestos de contratación extranjera ni cargos de tarjeta.

| Oferta relevada [Data] | Equivalente ARS [Estimate] |
|---|---:|
| Tanda: USD 3,49/círculo/mes | $ 5.409,50/mes |
| Tanda: USD 34,99/círculo/año | $ 54.234,50/año; $ 4.519,54/mes equivalente |
| MiRonda Organizador: USD 14,99/mes, cinco grupos/20 miembros según Ola 2 | $ 23.234,50/mes |

**[Data]** Las Olas relevan TandaPlus MXN 149/año y JuntemosPe S/10–30/mes, en preapertura gratuita. Sin cotizaciones de esas monedas, no los convierto. Oferta publicada no demuestra ventas ni renovación.

| Escalón [Assumption] | Precio mensual final a probar | Alcance piloto |
|---|---:|---|
| Una junta | **$ 4.900** | Registro, avisos e historial privado |
| Tres o más juntas, B1 | **$ 14.900** | Bandeja transversal; hasta cinco juntas |

**[Assumption]** Cobro anticipado por transferencia, separado de aportes; dos juntas contratan dos unidades individuales. **[Estimate]** $ 4.900 queda bajo Tanda mensual, pero sobre su equivalente anual; $ 14.900 queda bajo tres Tanda mensuales ($ 16.228,50) y MiRonda. **[Opinion]** Son anclas externas, no disposición a pagar local. Revisar precio antes de cada oferta, sin trasladar aumentos retroactivos.

**[Assumption] B2:** $ 4.900/junta/mes dividido entre `n` integrantes: `cuota = 4.900/n`; diez pagan $ 490 cada uno. Factura, consentimiento y reparto exacto, sin margen del organizador ni descuento del pozo. **[Opinion]** Su costo de cobranza y encuadre requieren validación propia; no hereda el CAC de B1 automáticamente.

## Economía por organizador y mes

**[Assumption]** Unidad: tres juntas de diez integrantes, un vencimiento mensual por junta. Solo el abono es ingreso. Además de infraestructura fija, consumo incremental `I = 3 × $ 300 = $ 900/mes`, presupuesto nuevo; los costos anteriores por ciclo no equivalen a meses.

**[Assumption]** WhatsApp API: **$ 0**, con avisos compartidos manualmente por el organizador; medir sus minutos. Si se automatiza, `W = mensajes cobrables × tarifa + abono del proveedor`, a cotizar. Se mantienen 15 minutos mensuales de atención habitual y `d = 1` disputa/mes, de duración `t`. Hora humana **$ 5.000**, heredada; cuenta aunque no salga de caja.

**[Assumption]** Reserva fiscal `q = 5%` del abono, heredada como provisión, sin acreditar suficiencia tributaria. Transferencia del abono sin arancel presupuestado; validar cobro efectivo e impuestos con contador.

**[Estimate] Fórmulas:** `soporte = (15 + d × t) × 5.000/60`; `servir = I + W + soporte`; `C_caja = P × (1−q) − I − W = $ 13.255`; `C_completa = C_caja − soporte`. Ambas contribuciones son antes de CAC y fijos; la segunda valora trabajo humano.

| Disputa: t minutos [Assumption] | Ingreso | Soporte [Estimate] | Servir total | C_completa |
|---|---:|---:|---:|---:|
| 15 | $ 14.900 | $ 2.500 | $ 3.400 | **$ 10.755** |
| 60, base | $ 14.900 | $ 6.250 | $ 7.150 | **$ 7.005** |
| 180 | $ 14.900 | $ 16.250 | $ 17.150 | **−$ 2.995** |

**[Estimate]** Con cinco juntas, `I = $ 1.500`: contribución base $ 6.405 y recupero del CAC base en 6,25 meses, manteniendo igual soporte, todavía no demostrado. Una junta, con `I = $ 300`, atención habitual de cinco minutos y una disputa de 15/60 minutos, deja $ 2.688,33/−$ 1.061,67. El escalón chico admite poco acompañamiento.

## Adquisición y recupero

**[Estimate]** `CAC = (desembolsos + horas del fundador × 5.000)/organizadores nuevos pagos`; incluir rechazos y capacitación inicial, sin duplicarla como soporte. `Recupero = CAC/C_completa`, únicamente si esta es positiva y el cliente sigue pagando.

| CAC por organizador [Assumption] | Caja + horas propias | Completo | Meses con t=15 / t=60 [Estimate] |
|---|---|---:|---:|
| Bajo | $ 2.500 + 1,5 h × $ 5.000 | $ 10.000 | 0,93 / 1,43 |
| Base, heredado | $ 10.000 + 6 h × $ 5.000 | $ 40.000 | 3,72 / 5,71 |
| Alto | $ 25.000 + 15 h × $ 5.000 | $ 100.000 | 9,30 / 14,28 |

**[Estimate]** Con t=180 no hay recupero. Con cobro mensual, 5,71 requiere seis meses pagos. **[Opinion]** El CAC anterior era por grupo; conservarlo por organizador es una hipótesis, no ahorro observado.

## Equilibrio de caja mínimo

**[Assumption]** Recorte del presupuesto previo, en ARS de octubre de 2026; sin cotizaciones:

| Fijo mensual | Anterior → B1 | Recorte propuesto |
|---|---:|---|
| Infraestructura | $ 80.000 → $ 40.000 | Sin comercio ni firma integrada del piloto |
| Herramientas | $ 40.000 → $ 20.000 | Licencias opcionales |
| Legal recurrente | $ 60.000 → $ 60.000 | Se conserva |
| Contador/administración | $ 80.000 → $ 60.000 | Menos liquidación comercial |
| Cuenta/dominio/comunicaciones | $ 40.000 → $ 40.000 | Se conserva |
| **Total** | **$ 300.000 → $ 220.000** | **−$ 80.000** |

**[Opinion]** No había un fijo comercial aislado: estos recortes son presupuestos nuevos. También salen variables de compra, CPA, conciliación comercial y captación de comercios; no se borran horas de junta. La demo conserva presupuesto separado.

**[Estimate]** `N_caja = techo(220.000/13.255) = 17 organizadores B1 pagos`, cartera adquirida, sin sueldos ni nuevas altas. Valorando soporte base: `techo(220.000/7.005) = 32`, antes de CAC. Con renovación del 95% y reposición mensual al CAC de caja base: `techo[220.000/(13.255−0,05×10.000)] = 18` para caja. Excluye desarrollo, únicos y remuneraciones.

## Comparación con A

| Concepto [Estimate] | A: paga comercio | B1: base |
|---|---:|---:|
| Unidad | Círculo completo | Organizador/mes, tres juntas |
| Ingreso neto antes de reserva fiscal | $ 14.250 | $ 14.900 |
| Contribución completa, antes de CAC/fijos | **$ 1.037,50/círculo** | **$ 7.005/mes** |
| CAC completo asignado | $ 54.814,81, grupo + comercio | $ 40.000, organizador |
| Recupero | **53 ciclos** | **5,71 meses** |

**[Opinion]** Ciclo no equivale a mes; no convertir los 53 ciclos sin conocer su duración. B1 elimina dependencia de compra, pero suma competencia directa por abono.

## Umbrales del veredicto

**[Estimate]** Con base de tres juntas y CAC $ 40.000: contribución positiva exige `d×t < 144,06 min/mes`; recupero ≤6 meses exige `d×t ≤64,06`. Cada costo adicional reduce estos límites.

**[Assumption]** Renovación mensual constante `r`, sin descuentos: `LTV_contribución = 7.005/(1−r)`, antes de fijos y sin descuento financiero. **[Estimate]** A r=95%, LTV=$ 140.100 y LTV/CAC=3,50. Para LTV/CAC≥3: `r≥1−7.005/120.000 ≈94,2%`; LTV>CAC exige `r>1−7.005/40.000 ≈82,5%`.

**[Opinion]** Pasaría a **Viable provisional** con pago observado, renovación ≥95%, disputas ≤60 minutos/organizador/mes y CAC≤$ 40.000, verificando carga y encuadre jurídico. **Riesgoso** entre objetivos y límites. **No viable bajo la base** con disputas ≥144,06 minutos o renovación por debajo del umbral de recupero: cambiar precio, costos o segmento. Recalcular con cinco juntas.

## Flags

- **Red — [Data]:** cero entrevistas y renovación desconocida. **[Opinion]** Primero tres entrevistas; antes de cobrar, revisión jurídica/fiscal; luego pagos y renovación observados.
- **Yellow — [Opinion]:** fijos recortados, reserva fiscal y minutos sin cotizar/medir; caja sin sueldos depende de trabajo gratuito. Incluir disputas abiertas y pausas en las cohortes.

## Fuentes

- **[Data]** [Intake](00-cambios-e-intake.md), [debate](debate-ronda-1.md), [Ola 1](raw/ola-1.md), [Ola 2](raw/ola-2.md) y [Gate](01-research-gate.md): precios y límites de evidencia.
- **[Data]** [Costos anteriores](../05-financial/cost-structure.md), §§2–7: hora, CAC base, fijos y modelo A. Los recortes B1 son supuestos propios.
- **[Data]** [Banco Nación](https://www.bna.com.ar/Personas): cotización identificada arriba.
- **[Data]** `honesty-protocol.md` y `output-specs.md` leídos; este último no contiene Fase 7. Etapa A sigue esta consigna.
