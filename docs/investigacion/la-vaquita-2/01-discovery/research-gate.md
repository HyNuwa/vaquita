# Research Gate — ¿seguir, pivotar o parar?

**Fase:** 3.5 — Research Gate
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Media sobre el diagnóstico; Baja sobre la demanda (0 entrevistas)

---

## Qué encontró la investigación

| Dimensión | Lectura | Confianza |
|---|---|---|
| **Tamaño de mercado** | Nicho en Argentina: 5,6% sin ponderar ahorra en club o con alguien fuera de la familia (~1,9 M de adultos). El SAM digital es un techo ilustrativo. Brasil (12,8 M en consórcios) y Egipto (Money Fellows, 8 M) muestran que la categoría escala en otros países. **[Estimate]** | Baja |
| **Competencia** | Fuerte en sustitutos (WhatsApp a $0, Naranja X Cuenta Compartida, Mercado Pago). Débil en el ángulo exacto: nadie conecta el turno con una compra con descuento. En el hackathon, "junta + agente IA" ya está visto (TesorerIA, AjoAI, Ajo Circle). **[Data]** | Media |
| **Demanda** | Sin evidencia propia. Indirecta: el pasanaku sigue vivo en el NOA, la mora está en récord, el crédito es caro y el comercio ya resigna entre 20% y 40% en descuentos y cuotas. **[Data]** | Baja |
| **Timing** | Bueno para un piloto chico y prematuro para escalar (6,5/10). La infraestructura está lista (wARS, ERC-8004, MiniPay en Argentina), pero wARS todavía tiene volumen chico. **[Opinion]** | Media |
| **Regulación** | La IGJ RG 8/2015 incluye servicios. Separar la junta (en dinero) de la compra (opcional, a cargo del comercio) baja el vínculo, pero no da una exención acreditada. La RG 1172 se cumple si el miembro firma. **[Data]** | Media |

## Señales más fuertes
1. **Hay un espacio libre real y verificado:** ningún competidor ata el turno a una compra con descuento y entrega escalonada (B1, B4, A4).
2. **El comercio tiene un motivo económico para pagar:** ya cede entre 20% y 40% en cuotas, descuentos y adquisición de clientes. Una venta de contado ya fondeada le ahorra parte de eso (C4).
3. **Hay acceso real a los dos lados en un caso concreto:** servicio técnico, organizador y grupo de 5 (C3, D1, D2, D3).

## Señales en contra
1. 🔴 **El modelo de ingresos no tiene un caso que lo valide.** Hacé Una Vaquita (Argentina, mismo modelo) parece cerrada. Money Fellows vive de cobrarle al usuario y cubre los impagos con capital propio. Esusu recién encontró negocio cuando apareció otro pagador.
2. 🔴 **La regulación tensiona el diseño:** integrar la compra sube la conversión y el riesgo IGJ; separarla baja el riesgo y también el ingreso. No se puede tener las tres cosas a la vez (conversión, metas libres y riesgo bajo).
3. 🔴 **Nadie absorbe el impago.** Suspender el acceso disuade, pero no le devuelve la plata al grupo, y puede considerarse cláusula abusiva.
4. 🟡 **Conseguir usuarios de a uno cuesta más que la comisión esperada (D1).** Solo cierra el canal organizador → grupo.
5. 🟡 0 entrevistas, equipo sin rol comercial, contactos familiares (sesgo) y choque de nombre con "Vaquita Protocol".

## Recomendación: 🟡 LUZ AMARILLA

**[Opinion]** La investigación no mata la idea, pero tampoco la sostiene. El espacio libre y el motivo del comercio son reales. Ahora bien, el modelo elegido (gratis para el ahorrista y paga el comercio) no tiene ningún precedente vivo, y el riesgo legal crece justo con lo que lo diferencia: atar la junta a la compra.

### Qué tiene que ser cierto para que funcione
1. **≥3 de 10 comercios** (≥8 sin relación familiar) aceptan el paquete: descuento, comisión, venta escalonada y devolución. *(Criterio de salida del brief, vigente)*
2. **Un abogado confirma por escrito** que el flujo separado (junta en dinero y oferta del comercio aparte) queda fuera de "ahorro para fines determinados" en grupos privados.
3. **Un organizador arma un grupo de 5 sin subsidio** y todos entienden qué siguen debiendo después de cobrar.
4. **Al menos un 30% de los beneficiarios compra en el comercio** cuando la compra es opcional. *(Supuesto de C4: es la variable que más mueve el ingreso)*

### Pivotes que la investigación deja abiertos (para la Fase 4)
- **Cobro mixto:** el comercio paga el CPA y el ahorrista paga un fee chico por elegir turno temprano, como Money Fellows. Requiere revisar el riesgo de que se interprete como interés.
- **"Canal de contado" para comercios:** vender al comercio la venta pre-fondeada como alternativa a las cuotas. Es el pagador más claro (C4).
- **Herramienta de juntas sin comercio:** es el pivote previsto si se dispara el criterio de salida. El riesgo regulatorio es bajo, pero falta encontrar quién paga.

### Para el hackathon (9/11)
La demo no necesita resolver todo lo anterior. Puede mostrar una **junta que paga en dinero** y una **oferta de comercio que el beneficiario canjea aparte**. Eso coincide con el diseño de menor riesgo y abre el pitch con el ángulo que nadie tiene: el turno termina en una compra con descuento.

---

## Flags

**Red Flags:**
- Modelo de ingresos sin precedente vivo; el antecedente local parece haber cerrado.
- Encuadre IGJ posible también para servicios; dictamen legal pendiente.
- Impago sin respaldo exigible.

**Yellow Flags:**
- CAC individual mayor que la comisión; dependencia del organizador como canal.
- Mercado argentino de nicho; la escala depende de otros países.
- Competencia en el mismo track del hackathon; choque de nombre.

## Fuentes
- `market-analysis.md`, `competitor-landscape.md`, `target-audience.md`, `industry-trends.md`, `confidence-dashboard.md`, `verification-report.md` y los 15 archivos de `raw/`.
