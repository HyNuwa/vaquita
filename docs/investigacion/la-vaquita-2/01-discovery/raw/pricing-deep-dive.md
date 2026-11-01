# C4 · Pricing deep-dive: cuánto puede cobrarle La Vaquita al comercio

> Fecha: 2026-10-24 · Agente C4 (research) · Estado: borrador para discovery
> Etiquetas: **[Data]** dato con fuente · **[Estimate]** cuenta propia sobre datos · **[Assumption]** supuesto a validar.
> Tiers de fuente: **T1** oficial / primaria · **T2** prensa o agregador serio · **T3** blog, agencia o dato no oficial.

**Límite de esta ronda:** el presupuesto de búsquedas web de la sesión se agotó después de 3 búsquedas. El resto salió de 14 fetches directos a sitios oficiales (Coderhouse, Platzi, Smart Fit, Hotmart, Damodaran/NYU, Mercado Pago, Ripio). El protocolo pedía 10+ búsquedas, así que este informe tiene **más DATA GAPs de lo deseable** (ver sección 7). No inventé ningún número: donde falta el dato, la cuenta se marca como [Assumption].

---

## 0. Conclusión en 5 líneas

1. **El hallazgo clave:** el comercio argentino ya regala entre 20 y 40 % del precio para vender: descuentos "permanentes" (Coderhouse muestra 35 % OFF en todas sus carreras), cuotas sin interés que financia el comercio y comisiones de tarjeta. La Vaquita le trae un cliente **que paga de contado con plata ya ahorrada**. Ese ahorro financiero es el espacio para el descuento y para nuestra comisión.
2. **Digital (cursos, SaaS):** el comercio puede pagar **10-15 % de comisión + 10 % de descuento al usuario** y le sigue conviniendo más que su canal pago habitual [Estimate].
3. **Servicios con capacidad ociosa (gimnasios, institutos, ISP):** **6-10 % de comisión + 5-10 % de descuento** [Estimate].
4. **Bienes físicos (electrónica):** solo **2-4 % de comisión + 3-5 % de descuento**, sostenido por el ahorro de no financiar cuotas. No sirve para el piloto [Estimate].
5. **Piloto (recomendación):** CPA del 10 % sobre la venta confirmada para digital, 0 % de fee fijo y gratis para el usuario. Escenario base: **~$ 450.000 ARS/mes** con 50 turnos por mes [Estimate]. La hipótesis del brief (3-5 %) deja plata sobre la mesa en digital.

---

## 1. Tabla por vertical

| Vertical | Margen bruto | CAC típico | Descuento posible al usuario | Comisión viable La Vaquita | Fuente |
|---|---|---|---|---|---|
| **Cursos online / bootcamps** (Coderhouse, Platzi, cursos Hotmart) | Global "Education" 45,8 % (incluye presencial). Infoproducto/curso grabado: costo marginal casi 0, margen bruto de contribución >80 % [Estimate]. Hotmart cobra 9,9 % + fijo y el productor paga a afiliados 30-50 % (hasta 80 %), lo que muestra márgenes de contribución de ese orden [Data] | Alumno individual: USD 60 orgánico / USD 136 pago (EE.UU., 2024, T3). Total de adquisición ~20 % del arancel (2U, 2018, T3) [Data]. LatAm: **DATA GAP** | **10-15 %** sobre el precio ya promocionado. Coderhouse publica 35 % OFF permanente + 12 cuotas sin interés, así que el precio "real" es el de promo [Data] | **10-15 % CPA** (20 % como techo negociable con infoproductores que ya pagan 30-50 % a afiliados) [Estimate] | Damodaran ene-2026 (T1); Hotmart precios (T1); focus-digital nov-2024 (T3); coderhouse.com/ar/carreras oct-2026 (T1) |
| **SaaS / software para pymes** | Software (System & Application) 71,7 %; Software (Internet) 62,6 % (global) [Data] | **DATA GAP** para Argentina. Regla general: LTV:CAC ≥ 3 (T3) | **10-20 %** sobre el plan anual (Platzi ya cobra el anual a ~5,5 meses del mensual: Expert $359.900/año contra Basic $64.900/mes) [Data] | **10-15 % del primer año** [Estimate] | Damodaran ene-2026 (T1); platzi.com/precios oct-2026 (T1) |
| **Gimnasios** | Recreation 39,8 % (global). El costo marginal de un socio extra es bajo mientras haya capacidad ociosa [Data + Estimate] | **DATA GAP** | **5-10 %** sobre un pase de 3-12 meses pagado por adelantado. Referencia: Smart Fit $39.990-55.990/mes con 12 meses de permanencia [Data] | **6-10 %** [Estimate] | Damodaran (T1); smartfit.com.ar/planes oct-2026 (T1) |
| **Internet (ISP) / servicios técnicos** | Telecom Services 58,8 %; Business & Consumer Services 33,4 % (global) [Data] | **DATA GAP** | **5-10 %**, como bonificación de instalación o de meses [Assumption] | **5-8 %** o un fijo por alta [Assumption] | Damodaran (T1) |
| **Bienes físicos: electrónica, notebooks, celulares** (contraste) | Electronics (Consumer & Office) 38,8 % bruto pero **-4,5 % operativo**; Retail General 33,2 %; Distributors 30,6 % (global) [Data]. En Argentina tras la apertura de importaciones: **DATA GAP** | **DATA GAP** | **3-5 %**, financiado con el ahorro de no ofrecer cuotas [Estimate] | **2-4 %** [Estimate] | Damodaran (T1) |
| **Accesorios de PC** | **DATA GAP** (el retail de accesorios suele tener más margen que los equipos [Assumption]) | DATA GAP | 5-10 % [Assumption] | 3-6 % [Assumption] | — |

**Lectura:** el orden de viabilidad es **digital > servicios con capacidad ociosa > físico**. Esto confirma la intuición del brief: empezar por cursos y software.

---

## 2. Costo de cobrar para el comercio

### 2.1 Mercado Pago Argentina

| Medio | Comisión | Acreditación | Fecha / Tier |
|---|---|---|---|
| QR con saldo MP | 0,6 % | Inmediata | may-2026, T3 (yo-facturo) |
| QR con saldo / dinero en cuenta | 0,8 % + IVA | Inmediata | 2023, T2 (iProfesional) ⚠ dato viejo |
| QR con débito | 0,6-1,2 % según plan y volumen | Inmediata o 1 día | may-2026, T3 |
| Débito (Point) | 3,25 % | En el acto | ene-2026, T2 (iProUP, solo el snippet; el artículo no se pudo leer completo) |
| Débito (QR) | 1,35 % | En el acto | ene-2026, T2 (iProUP, snippet) |
| Crédito | 6,29 % (iProUP 2026) / 6,49 % + IVA (iProfesional 2023) | En el acto | T2 |
| Crédito | 4,29 % / 3,39 % / 1,79 % / 0 % + IVA | 10 / 18 / 35 / 70 días | 2023, T2 ⚠ |
| Crédito en QR | 2,99-4,49 % según cuotas | 2-14 días hábiles | may-2026, T3 |

[Data] Las páginas oficiales de costos de Mercado Pago devolvieron 403. Los números vienen de prensa y blogs, y **no son del todo coherentes entre sí**.

### 2.2 Costo de financiar cuotas sin interés

- [Data] Coderhouse vende a "12 cuotas sin interés" del mismo valor que el precio de contado ($405.860 = 12 × $33.822). **El comercio absorbe el costo financiero.**
- [Data, contexto previo] Mercado Libre cobra +5,75 % por 3 cuotas y +10,75 % por 6 cuotas (ene-2026, T3).
- [Estimate] Si extrapolamos esa curva, 12 cuotas sin interés le costarían al comercio **~15-20 % del precio**. **DATA GAP:** no conseguí la tasa de descuento de cuotas de 2026 (Cuota Simple o adquirentes).

### 2.3 Cobrar en wARS (canal La Vaquita)

| Concepto | Costo | Etiqueta |
|---|---|---|
| Gas en Celo (CIP-64, pagado en USDC) | Centavos de USD por tx; despreciable frente al ticket | [Estimate] |
| Comisión por recibir wARS | 0 % (transferencia token a token) | [Data, diseño] |
| Off-ramp wARS → pesos en banco vía Ripio | **DATA GAP.** ramp.ripio.com no publica fees y help.ripio.com dio 403. Supuesto de trabajo: **0,5-1,5 %** | [Assumption] |
| Acreditación | Inmediata on-chain; el off-ramp depende de Ripio | [Data] / DATA GAP |

**Cuenta comparativa** (venta de $405.860, curso Coderhouse):

| Canal | Costo de cobro | Costo financiero | Total | Etiqueta |
|---|---|---|---|---|
| Tarjeta de crédito, 12 cuotas sin interés, acreditación inmediata | 6,49 % + IVA 21 % = **7,85 %** | ~15-20 % | **~23-28 % ≈ $93.000-113.600** | [Estimate] |
| QR con saldo | 0,6-0,97 % | 0 | **~1 % ≈ $4.000** | [Estimate] |
| wARS + off-ramp Ripio | 0 % + 0,5-1,5 % | 0 | **~1 % ≈ $2.000-6.100** | [Assumption] |

**Conclusión:** el pago de contado en wARS le ahorra al comercio **~20-25 puntos** frente a su venta típica en cuotas. Con ese ahorro paga el descuento y nuestra comisión.

---

## 3. Modelos de cobro alternativos para La Vaquita

| Modelo | Quién paga | Benchmark | A favor | En contra | Veredicto piloto |
|---|---|---|---|---|---|
| **CPA / comisión por venta confirmada** | Comercio | Hotmart afiliados 30-50 % (hasta 80 %); ML 11,8-17 %; Udemy se queda con el 63 % orgánico; Favo pagaba hasta 15 % a líderes; BNPL MDR LatAm 3-8 % (T3, contexto previo) | El comercio solo paga por resultado. Encaja con el diseño "marketing/afiliación" que baja el riesgo IGJ | Requiere atribuir la venta (código de descuento o link por miembro) | **Sí, principal** |
| **Fee fijo mensual por listado** | Comercio | **DATA GAP** (no se pudo buscar). Referencia: Hotmart y Udemy no cobran fijo; ML tampoco cobra por publicar en la categoría gratuita | Ingreso predecible | Con 300 usuarios en Jujuy, ningún comercio paga por aparecer | **No en el piloto**; quizás después de 1.000 usuarios |
| **Fee al usuario por adelantar el turno** | Usuario | Money Fellows: hasta 16 % en turnos tempranos (T1 blog); Circlepot 0,2 % del pozo; Hacé Una Vaquita 10 % si retirás | Monetiza sin comercio | Parece **interés sobre un crédito implícito** (riesgo BCRA/IGJ, ver regulatory.md). Choca con "la junta es justa". El brief ya lo descartó como ingreso principal | **No** |
| **Fee por retiro / off-ramp** | Usuario | Hacé Una Vaquita 10 % si retirás en vez de gastar | Empuja el gasto en comercios asociados | Castiga al usuario que solo quiere ahorrar. Ripio ya cobra la rampa | **No** (como mucho, cero de nuestro lado) |
| **Freemium para organizadores** | Organizador | **DATA GAP** de benchmarks de precio. Circlepot 0,2 % como piso de mercado | Útil si aparecen organizadores "profesionales" (varias juntas) | En un piloto de 300 personas nadie paga | **Gratis**; medir si hay organizadores con 3+ juntas |
| **B2B a mutuales / cooperativas / sindicatos** | Institución | **DATA GAP**. Supuesto: $500-1.000 ARS por socio activo por mes, o setup + fee | Ticket alto, canal de confianza en Jujuy | Ciclo de venta largo; no entra en el hackathon | **Explorar** con 1-2 entrevistas |
| **Float / rendimiento del pozo** | — | Reservas MP ~19 % TNA (contexto previo) | Ingreso pasivo | Hace falta custodia o un producto de rendimiento: cambia el encuadre regulatorio. Con un pozo que rota por semana, el float es chico | **No** |

---

## 4. Recomendación de pricing para el piloto

### 4.1 Estructura

| Componente | Valor piloto | Etiqueta |
|---|---|---|
| Usuario / organizador | **$ 0** (sin fee por turno, adelanto ni retiro) | Decisión sugerida |
| Comisión digital (cursos, SaaS) | **10 % CPA** sobre la venta confirmada, facturada como servicio de marketing + IVA | [Estimate] |
| Comisión servicios (gimnasios, institutos, ISP) | **7 % CPA** | [Estimate] |
| Comisión físico | **3 %**, solo si aparece un comercio interesado; fuera del foco | [Estimate] |
| Descuento al usuario (lo pone el comercio) | **10 % digital, 5-10 % servicios** sobre el precio promocionado vigente | [Estimate] |
| Fee fijo | **$ 0** (los primeros 3 meses gratis; cobrar fijo solo con tracción) | Decisión sugerida |

**Por qué 10 % y no 3-5 %:** el comercio digital ya paga 20-47 % de CAC pago y ~20-25 % en costos de cuotas. 10 % + 10 % de descuento = 20 %, menos de lo que le cuesta su canal actual. 3-5 % es fácil de vender, pero deja ingreso sobre la mesa. Conviene ofrecer 10 % y aceptar bajar a 7 % como concesión de negociación.

### 4.2 Cuenta del comercio (curso de $405.860)

| Concepto | Canal habitual (tarjeta, 12 cuotas, ads) | Canal La Vaquita |
|---|---|---|
| Precio cobrado | $405.860 | $365.274 (−10 % descuento) |
| Costo de cobro + financiación | −$93.000 a −$113.600 (23-28 %) | −$3.650 (~1 % off-ramp) [Assumption] |
| CAC / comisión | −$81.000 (20 % estilo 2U) [Estimate] | −$36.527 (10 % sobre $365.274) |
| **Neto del comercio** | **≈ $211.000-232.000 (52-57 %)** | **≈ $325.000 (80 %)** |

[Estimate] Aun con supuestos conservadores, el canal La Vaquita deja **~$90.000-110.000 más por alumno**. Ojo: si el comercio vende con débito o QR sin cuotas y su CAC es orgánico, la ventaja se achica mucho (ver sensibilidad).

### 4.3 Escenarios de ingreso del piloto (Jujuy, ~300 usuarios)

Supuestos comunes [Assumption]: 50 juntas activas de 6 personas y 1 turno cobrado por junta por mes, o sea **50 beneficiarios por mes**. El ticket de compra es menor o igual que el pozo.

| Escenario | Beneficiarios que compran en comercio asociado | Ticket medio | GMV/mes | Comisión media (mix) | **Ingreso La Vaquita/mes** | Anual |
|---|---|---|---|---|---|---|
| Conservador | 15 % → 7,5 | $250.000 | $1.875.000 | 6 % | **$112.500** | $1,35 M |
| Base | 30 % → 15 | $300.000 | $4.500.000 | 10 % | **$450.000** | $5,4 M |
| Optimista | 40 % → 20 | $350.000 | $7.000.000 | 15 % (algún infoproductor a 20 %) | **$1.050.000** | $12,6 M |

Cuentas: Base = 50 × 0,30 × $300.000 × 0,10 = $450.000. Conservador = 50 × 0,15 × $250.000 × 0,06 = $112.500. Optimista = 50 × 0,40 × $350.000 × 0,15 = $1.050.000.
[Estimate] Son pesos nominales sin IVA. Con 1,9 % de inflación mensual, el ticket tiene que indexarse; si la comisión es un porcentaje, se indexa sola.

**Comparación con market-size.md:** allá el ingreso a 3-5 % daba ~$3 M/año. El escenario base de acá ($5,4 M) es consistente si se sube la comisión a 10 % y se asume 30 % de conversión. **La variable que más pesa es la conversión a compra**, no la comisión.

---

## 5. Sensibilidad (±30 %)

Base: descuento 10 %, comisión 10 %, conversión 30 %, ticket $300.000, 50 turnos/mes.

### 5.1 Costo total para el comercio (descuento + comisión + ~1 % cobro)

| | Comisión 7 % (−30 %) | Comisión 10 % | Comisión 13 % (+30 %) |
|---|---|---|---|
| **Descuento 7 % (−30 %)** | 15 % | 18 % | 21 % |
| **Descuento 10 %** | 18 % | **21 %** | 24 % |
| **Descuento 13 % (+30 %)** | 21 % | 24 % | 27 % |

[Estimate] Frente al canal habitual con cuotas (~43-48 % entre cobro, cuotas y CAC), **todas las celdas le convienen al comercio digital**. Frente a un comercio que vende **solo con QR y CAC orgánico** (~1 % + ~10 % de CAC [Assumption]), solo convienen las celdas de ≤ 15-18 %. Para ese perfil hay que ofrecer 7 % + 7 %.
Para electrónica (margen operativo global −4,5 %), **ninguna celda es viable**: cualquier costo por encima de ~5-8 % se come el margen. Por eso físico queda en 3 % + 3-5 %, financiado con el ahorro de cuotas.

### 5.2 Ingreso mensual de La Vaquita

| Variable movida | −30 % | Base | +30 % |
|---|---|---|---|
| Comisión (7 % / 10 % / 13 %) | $315.000 | $450.000 | $585.000 |
| Conversión a compra (21 % / 30 % / 39 %) | $315.000 | $450.000 | $585.000 |
| Descuento al usuario (7 % / 10 % / 13 %) → efecto sobre la conversión [Assumption: elasticidad 0,5] | ~$382.500 (conversión 25,5 %) | $450.000 | ~$517.500 (conversión 34,5 %) |
| Comisión +30 % y la conversión cae 15 % porque el comercio baja el descuento [Assumption] | — | — | ~$497.000 |

[Estimate] El ingreso es lineal en comisión y conversión. El descuento no entra en nuestro ingreso, pero mueve la conversión. **Conviene optimizar conversión (descuento visible y comercios que la gente ya quiere) antes que exprimir la comisión.**

---

## 6. Implicancias para el diseño y la regulación

- El cobro al comercio tiene que facturarse como **servicio de marketing/afiliación** y no como porcentaje "del pozo", para sostener la separación IGJ (ver regulatory.md). Lleva IVA 21 % si somos responsables inscriptos (DATA GAP: confirmar con contador). Al comercio inscripto ese IVA le sirve como crédito fiscal.
- La atribución tiene que ser determinista en el código (código de descuento por beneficiario y turno), coherente con "el LLM propone, el código decide".
- El descuento lo da el comercio al beneficiario. **La junta nunca paga al comercio** (diseño del brief).

---

## 7. Data gaps

1. **CAC de educación online en LatAm/Argentina**: solo hay benchmarks de EE.UU. (focus-digital 2024, 2U 2018). Prioridad alta.
2. **Márgenes brutos reales de academias argentinas** (Coderhouse, Digital House, Henry, Crehana): no publican. El sitio de Henry dio error de certificado. Damodaran es global.
3. **Tasa de descuento de cuotas sin interés 2026** (Cuota Simple, Payway, Fiserv, MP): solo se extrapoló desde ML (ene-2026, T3).
4. **Comisiones oficiales de Mercado Pago 2026**: las páginas oficiales dieron 403. Las fuentes de prensa se contradicen (débito QR 0,6-1,35 %; crédito 6,29-6,49 %).
5. **Costo del off-ramp de Ripio wARS → ARS**: no hay datos publicados. Hay que probarlo de punta a punta (ya está en 09-proximos-pasos.md).
6. **Márgenes de electrónica y celulares en Argentina después de la apertura de importaciones 2026**: no investigado (sin presupuesto de búsqueda).
7. **Márgenes y CAC de gimnasios, ISP y servicios técnicos en Argentina/Jujuy**.
8. **Benchmarks de fee fijo por listado y de freemium para organizadores de juntas**.
9. **Precio B2B para mutuales y cooperativas**.
10. **Tipo de cambio ARS/USD vigente** para convertir los CAC de EE.UU. Los CAC en USD de la tabla 1 no se convirtieron por eso.
11. **Conversión real beneficiario → compra**: es la variable dominante y no existe dato. Hay que medirla en el piloto.

**Validación sugerida:** 10 entrevistas a comercios de Jujuy y online (3 academias, 2 infoproductores de Hotmart, 2 gimnasios, 1 ISP, 2 software pymes). Mostrarles la cuenta de 4.2 y ofrecerles 10 %, 7 % y 5 %.

---

## 8. Fuentes

| # | Fuente | Fecha | Tier | Uso |
|---|---|---|---|---|
| 1 | [Damodaran, Margins by Sector (US)](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html) | ene-2026 | T1 | Márgenes brutos y operativos por industria (global/EE.UU.) |
| 2 | [Coderhouse Argentina, carreras](https://www.coderhouse.com/ar/carreras) | oct-2026 (captura) | T1 | Precios ARS, 35 % OFF, 12 cuotas sin interés |
| 3 | [Coderhouse Argentina, home](https://www.coderhouse.com/ar/) | oct-2026 | T1 | Promos (2 clases gratis, garantía de empleo) |
| 4 | [Platzi precios](https://platzi.com/precios/) | oct-2026 | T1 | Precios ARS de suscripción |
| 5 | [Smart Fit Argentina planes](https://www.smartfit.com.ar/planes) | oct-2026 (sin fecha visible) | T1 | Precio de gimnasio |
| 6 | [Hotmart precios (ES)](https://hotmart.com/es/precios) | 2026 | T1 | Fee de plataforma 9,9 % + fijo (Europa) |
| 7 | [Focus Digital, CAC online education](https://focus-digital.co/average-customer-acquisition-cost-for-online-education/) | nov-2024 | T3 | CAC por canal y segmento (EE.UU.) |
| 8 | [EdTech Bet, CAC](https://edtechbet.substack.com/p/cac) | s/f (cita 2U 2018) | T3 | CAC ≈ 20 % del arancel |
| 9 | [yo-facturo, QR Mercado Pago comisiones](https://yo-facturo.com/blog/qr-mercado-pago-comisiones-cobrar/) | may-2026 | T3 | Comisiones QR |
| 10 | [iProfesional, comisiones Mercado Pago](https://www.iprofesional.com/tecnologia/386153-mercado-pago-que-debes-saber-sobre-comisiones-plazos-y-montos) | ago-2023 ⚠ | T2 | Tabla de plazos de acreditación |
| 11 | [iProUP, MP vs Ualá vs Payway](https://www.iproup.com/finanzas/64002-mercado-pago-uala-modo-cual-es-mas-barato-para-cobrar-en-comercios-y-emprendimientos) | ene-2026 | T2 | Débito/crédito en el acto (solo el snippet; el cuerpo no cargó) |
| 12 | [Ripio Ramp](https://ramp.ripio.com) | oct-2026 | T1 | Sin fees publicados (gap) |
| 13 | Archivos previos: `market-size.md`, `competitor-gtm.md`, `direct-competitors.md`, `regulatory.md`, `adjacent-markets.md` | oct-2026 | — | Benchmarks del contexto previo (ML, Hotmart afiliados, Money Fellows, BNPL) |
