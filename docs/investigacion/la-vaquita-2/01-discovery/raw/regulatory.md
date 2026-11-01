# A3 · Regulación y cumplimiento — La Vaquita 2.0

> Fecha: 2026-10-24 · Agente A3 (Regulatory & Compliance) · Ola 01-discovery
>
> **Esto no es asesoramiento legal.** Es una investigación de escritorio para ordenar preguntas y priorizar riesgos. Antes de abrir el producto a comunidades abiertas o cobrar comisiones hay que validarlo con un abogado matriculado (ver "Preguntas para un abogado").
>
> Convenciones: **[Data]** = lo que dice la norma o la fuente, con cita. **[Opinion]** = interpretación nuestra. **Tier 1** = texto normativo oficial / organismo; **Tier 2** = estudio jurídico o prensa especializada; **Tier 3** = blog o medio general. **DATA GAP** = no lo pudimos verificar.

---

## 0. Resumen ejecutivo (para quien lee solo esto)

1. **El riesgo número uno es la IGJ, no la CNV.** La RG IGJ 8/2015 regula "planes de ahorro previo por círculos o grupos cerrados para la adjudicación de sumas de dinero con destino a la adquisición de bienes muebles, **pasajes o servicios**" (Capítulo III del Anexo A). Una vaquita cuyo pozo paga un curso o software de un comercio asociado **se parece mucho** a esa figura. Para operarla como negocio hace falta autorización previa de la IGJ, sociedad con capital mínimo de **$100.000.000** (RG IGJ 1/2025) y bases técnicas con dictamen de actuario. Inviable para nosotros.
2. **El riesgo número dos es la "captación de dinero del público" (art. 299 inc. 4 LGS) y la intermediación financiera no autorizada (Ley 21.526 + art. 310 Código Penal).** Se dispara si **nosotros** recibimos, retenemos o administramos plata ajena, o si ofrecemos el esquema al público en general con publicidad.
3. **La CNV (RG 1172/2026, vigente desde el 16/10/2026) es el riesgo más chico** si mantenemos el diseño non-custodial: excluye expresamente a quien provee **solo software de billetera de autocustodia** y a quien recibe activos virtuales **como contraprestación de sus productos** (el comercio). El agente de IA que firma pagos con su propia llave **sí** puede acercarnos a "transferencia" o "custodia" (Categorías 3 y 4).
4. **Grupo privado entre conocidos, sin comercio, sin comisión: riesgo Bajo.** Es una junta/pasanaku de toda la vida con una herramienta de registro. **Con comercio + comisión: Medio-Alto.** **Comunidad abierta con comercio: Alto** sin rediseño ni autorización.
5. El diseño que más baja el riesgo: **no tocar fondos nunca, no adjudicar bienes o servicios desde un "fondo común", no prometer el bien/servicio nosotros, cobrar la comisión como servicio de marketing/software al comercio (no como porcentaje del ahorro), grupos chicos cerrados por invitación, sin publicidad masiva del "plan de ahorro".**

---

## 1. Regulaciones vigentes

### 1.1 Ahorro para fines determinados (círculos cerrados) — IGJ, nacional

| Campo | Detalle |
|---|---|
| **Normas** | Decreto 142.277/43 (régimen de empresas de capitalización y ahorro); Ley 22.315 (orgánica IGJ); Ley 19.550 art. 299 inc. 4; RG IGJ 8/2015 (Anexo A, vigente desde 01/11/2015); RG IGJ 1/2025 (BO 06/01/2025, capital mínimo). |
| **Jurisdicción** | Nacional. [Data, Tier 1] La IGJ "otorga y cancela, en todo el territorio nacional, la autorización para operar como sociedad de ahorro" y puede fiscalizarlas y sancionarlas (argentina.gob.ar/node/131291). [Data, Tier 2] Un fallo citado por abogados.com.ar califica a la Ley 22.315, el Decreto 142.277/43 y la RG IGJ 8/2015 como **derecho federal**, con competencia de la justicia federal. → Jujuy no tiene un régimen paralelo propio que conozcamos (**DATA GAP** sobre el registro provincial de Jujuy). |
| **Qué cubre** | [Data, Tier 1] El Anexo A de la RG 8/2015 tiene, entre otros: **Capítulo II** "Planes de ahorro previo por círculos o grupos cerrados para la adjudicación directa de bienes muebles"; **Capítulo III** "Planes de ahorro previo por círculos o grupos cerrados para la adjudicación de sumas de dinero con destino a la adquisición de bienes muebles, **pasajes o servicios**" (art. 34); Cap. IV inmuebles; Cap. V ciclo abierto por puntaje y sorteo; Cap. VI capitalización. **Sí cubre servicios.** |
| **Qué exige** | [Data, Tier 1] Art. 1: autorización previa de los planes, con contrato tipo y dictamen de abogado, nota técnica con dictamen de **actuario**, estudio de mercado firmado por contador, presupuesto a 36 meses, estados contables; antecedentes de socios y administradores (incluye ≥3 años administrando fondos de terceros, certificado de reincidencia, etc.); domicilio en CABA. Art. 1.3.1: prohíbe cláusulas abusivas en los términos del **art. 37 Ley 24.240**. Art. 2: capital mínimo (original $1.000.000). Art. 4: régimen de publicidad (define publicidad como toda difusión "dirigida a personas en general o a sectores o grupos determinados", incluidos "ofrecimientos personales"). Art. 15: sanciones. [Data, Tier 2] RG IGJ 1/2025 eleva el capital mínimo a **$100.000.000** (Cap. IV: $300.000.000). [Data, Tier 1 — considerandos RG 8/2015] Las multas se gradúan desde el 1% del capital mínimo, +2% por infracción, hasta un tope. |
| **Base del control** | [Data, Tier 1] Ley 19.550 art. 299 inc. 4: fiscalización estatal permanente de las SA que "realicen operaciones de capitalización, ahorro o en cualquier forma requieran dinero o valores al público con promesas de prestaciones o beneficios futuros". |
| **¿Nos aplica en el piloto privado?** | [Opinion] Probablemente **no**, si (a) no somos "administradora" (no recibimos ni retenemos cuotas), (b) el grupo es de conocidos que se juntan solos y no hay oferta "al público", (c) no prometemos adjudicar un bien/servicio. Las juntas/pasanakus informales existen hace décadas sin que encontremos un caso de intimación de la IGJ (**DATA GAP**: no hallamos ningún precedente público, ni a favor ni en contra). |
| **¿Con comercio?** | [Opinion] **Zona gris seria.** Un grupo cerrado que aporta cuotas periódicas y cada turno "adjudica" una suma aplicada a comprar un servicio de un comercio asociado, con entrega escalonada y sanción por impago, **reproduce la estructura económica del Capítulo III**. Que el pago sea directo miembro→comercio (non-custodial) ayuda, pero la IGJ mira la sustancia ("en cualquier forma requieran dinero... con promesas de prestaciones futuras"). El riesgo crece si **nosotros o el comercio** organizamos los grupos y los promocionamos. |
| **¿En comunidades abiertas?** | [Opinion] **Alto.** Oferta a personas indeterminadas + publicidad + organización por un tercero profesional = el supuesto típico que la norma quiere capturar. |
| **Costo** | Autorización: SA con $100M de capital integrado y disponible + actuario + contador + abogado + estructura de cumplimiento. [Opinion] Orden de **USD 100–150k iniciales** solo en capital (al tipo de cambio de oct-2026, **DATA GAP** exacto) más honorarios; fuera de alcance. |
| **Plazo** | **DATA GAP** (no hay plazo legal publicado; en la práctica, meses). |

### 1.2 Intermediación financiera y captación de ahorro — BCRA, nacional

| Campo | Detalle |
|---|---|
| **Normas** | Ley 21.526 de Entidades Financieras (arts. 1, 19, 38, 41, 42); Código Penal art. 310 (incorporado por Ley 26.733, 2011). |
| **Qué dice** | [Data, Tier 1] Art. 1 Ley 21.526: comprende a quienes "realicen intermediación habitual entre la oferta y la demanda de recursos financieros". [Data, Tier 2] Art. 19 sanciona la actividad financiera y la **publicidad tendiente a captar recursos del público** sin autorización del BCRA (BCRA, Sumario 1562 "Tutasa"; caso Afluenta). [Data, Tier 2 — transcripción doctrinaria] Art. 310 CP: prisión de 1 a 4 años, multa de 2 a 8 veces el valor de las operaciones e inhabilitación hasta 6 años para quien realice intermediación financiera sin autorización; el mínimo sube a 2 años si se usó internet u otros medios de difusión masiva. |
| **¿Nos aplica?** | [Opinion] Una ROSCA pura **no** es intermediación habitual: no hay un intermediario que tome fondos de unos y los preste a otros por cuenta propia con spread; cada miembro paga a otro miembro. **Pero** si La Vaquita (o un contrato que controlemos) **retiene el pozo**, decide a quién darlo, o **adelanta turnos con fondos propios o de terceros**, nos acercamos a captación + crédito. El "adelanto de turno" financiado por nosotros sería crédito → ver 1.3. |
| **Costo / plazo** | Licencia de entidad financiera: inviable. Cumplimiento = **no hacerlo**. |

### 1.3 Proveedores no financieros de crédito — BCRA

| Campo | Detalle |
|---|---|
| **Qué exige** | [Data, Tier 1/2] Com. "A" 7146: inscripción obligatoria en el registro de "Otros proveedores no financieros de crédito" para empresas que ofrecen crédito al público como actividad principal o accesoria, cuando las financiaciones superan **$10 millones** (cifra a verificar en el texto ordenado vigente — **DATA GAP**). La inscripción **no** habilita a captar fondos del público; quedan sujetos a sanciones de los arts. 41 y 42 Ley 21.526 y a normas de protección del usuario de servicios financieros. |
| **¿Nos aplica?** | [Opinion] Solo si **nosotros o un socio** financiamos adelantos de turno o la "compra con descuento" se cobra en cuotas con financiación del comercio. En el diseño actual (cada miembro aporta lo suyo; el comercio entrega escalonado lo ya pagado) **no** hay crédito nuestro. Ojo: el miembro que cobra primero recibe un servicio cuyo valor todavía no pagó del todo → económicamente **sí** hay un crédito implícito de los demás miembros (o del comercio, si entrega por adelantado). Eso es inherente a toda ROSCA. |

### 1.4 Proveedores de Servicios de Pago (PSP) — BCRA

| Campo | Detalle |
|---|---|
| **Normas** | Texto ordenado "Proveedores de servicios de pago" (BCRA, actualizado jul-2025, última Com. "A" 8287); Com. "A" 6885 (2020, define cuentas de pago); Com. "A" 8432 (30/04/2026: registro informa oficial de cumplimiento UIF, banco patrocinante, nómina de terceros); Com. "A" 8482 (16/09/2026: informes de cumplimiento con auditores para PSP que ofrecen cuentas de pago). |
| **Qué exige** | [Data, Tier 1] Inscripción en registro BCRA para personas jurídicas no bancarias que proveen servicios de pago; las que ofrecen **cuentas de pago** ("de libre disponibilidad... para ordenar o recibir pagos") tienen obligaciones reforzadas (encaje/fondos de clientes, auditoría). |
| **¿Nos aplica?** | [Opinion] **No en el diseño actual**: no ofrecemos cuentas ni movemos pesos fiduciarios; los pagos son token a token en la billetera de cada miembro. Pasaría a aplicar si integramos rampa fiat propia o recaudamos en pesos bancarios para luego distribuir. La rampa debe quedar en **Ripio** u otro proveedor ya registrado. |

### 1.5 Activos virtuales — CNV, UIF

**CNV RG 1172/2026** [Data, Tier 1 — Boletín Oficial 15/10/2026, aviso 348986]:
- Firmada 14/10/2026, publicada 15/10/2026, **vigente desde el 16/10/2026**. Sustituye el capítulo de PSAV de las Normas CNV creado por RG 994/2024 y RG 1058/2025 (Tier 2).
- **Definición de PSAV** (considerandos, remite al art. 4 bis Ley 25.246): persona humana o jurídica que, **como negocio**, realiza una o más de las actividades del art. 9 (categorías):
  - Cat. 1: intercambio activos virtuales ↔ moneda de curso legal.
  - Cat. 2: intercambio entre activos virtuales.
  - **Cat. 3: transferencia de activos virtuales.**
  - **Cat. 4: custodia o administración de activos virtuales o instrumentos que permitan el control sobre los mismos** (Tier 2: "excluidos los servicios en los que el usuario conserve el control exclusivo sobre dichos activos").
  - Cat. 5: participación y provisión de servicios financieros relacionados con la oferta o venta de un activo virtual.
- **Exclusiones (art. 2):**
  - i) intercambios **para sí**, a título personal;
  - **ii) quienes "reciban o entreguen Activos Virtuales como contraprestación por la compraventa o prestación de sus productos"** → el comercio asociado que cobra en wARS queda afuera;
  - iii) protocolos descentralizados, "siempre que no exista" persona con control o influencia suficiente;
  - **iv) quienes provean "exclusivamente servicios de software o hardware de billeteras de autocustodia"**, entendidas como "aquellas en las que el usuario conserve el control" de sus activos y medios de acceso, siempre que no hagan actividades de PSAV.
- **Personas humanas** (art. 1, 3er párrafo): inscripción solo si superan "de manera agregada... UVA 35.000 por mes calendario" (Tier 2: ≈ $75,5 millones, ≈ USD 49k al 15/10/2026; acreditable con certificación de contador).
- Obligaciones de PSAV inscriptos: objeto social expreso, patrimonio neto mínimo (**DATA GAP** monto), prohibición de mixers (art. 25), informe mensual desde 01/11/2026, hechos relevantes, aviso de 30 días para cese (Tier 2).

**UIF** [Data, Tier 1/2]: Ley 27.739 (2024) reemplazó el art. 20 de la Ley 25.246 e incorporó a los PSAV como **sujetos obligados (inc. 13)**; definió PSAV en art. 4 bis. **Resolución UIF 49/2024** (22/03/2024): requisitos mínimos de gestión de riesgo PLA/FT/FP para PSAV (KYC, monitoreo, ROS, oficial de cumplimiento), con plazos escalonados feb–ago 2025.

**wARS** [Data, Tier 2/3]: stablecoin 1:1 con el peso emitida por Ripio (lanzada oct-2025), respaldo declarado en depósitos bancarios en pesos; prueba de reservas a inicios de 2026. **No encontramos una autorización específica del BCRA o la CNV para wARS como token** (**DATA GAP**); Ripio opera como PSAV registrado ante la CNV.

**¿Nos aplica?** [Opinion]
- **Contrato que solo registra y valida reglas sin retener fondos**: no es custodia ni transferencia por cuenta de terceros. Encaja en la lógica de las exclusiones iii/iv, pero **"control o influencia suficiente"** sobre el contrato (si nosotros podemos pausarlo, upgradearlo o cambiar reglas) es exactamente la pregunta abierta que marca la prensa especializada. Mejor: contrato **sin admin keys** o con poderes mínimos y públicos.
- **Agente de IA que ejecuta pagos**: si el agente **firma con una llave nuestra** transferencias de wARS **de los miembros** (por ejemplo, vía `approve`/`transferFrom` o session keys con poder de disposición), eso puede leerse como **Cat. 3 (transferencia)** o **Cat. 4 (instrumentos que permiten el control)**. Si el agente solo **arma la transacción y el miembro la firma** en su billetera (o la paga desde MiniPay), seguimos siendo software de autocustodia. Esto es una decisión de diseño crítica.
- **Personas humanas del equipo**: el umbral UVA 35.000/mes aplica a operaciones **por cuenta de terceros**; si el equipo no opera por cuenta de terceros, no aplica. Si el agente mueve plata del pozo, el volumen agregado de todos los grupos podría superarlo rápido.
- **UIF**: solo seríamos sujeto obligado si fuéramos PSAV. Igual, conviene **KYC liviano** (identidad por Ripio al hacer el on-ramp) y política anti-fraccionamiento.

### 1.6 Defensa del consumidor — Nacional (y provincial en la aplicación)

| Norma | Qué exige | ¿Nos aplica? |
|---|---|---|
| **Ley 24.240 art. 37** (cláusulas abusivas) y CCyC arts. 985–988 (contratos por adhesión) y 1117–1122 (cláusulas abusivas en contratos de consumo) | [Data, Tier 1 vía RG IGJ 8/2015 art. 1.3.1] Se tienen por no convenidas las cláusulas que desnaturalicen obligaciones, amplíen derechos del predisponente o restrinjan los del consumidor. | [Opinion] **Sí**, al comercio frente a sus clientes y a nosotros si el miembro es "consumidor" de nuestra plataforma. La **"garantía revocable"** (cortar el acceso al curso a quien ya cobró y dejó de aportar) es el punto más delicado: el miembro pagó el servicio **con el pozo** (plata de los otros) y debe cuotas **a los otros miembros**, no al comercio. Cortar un servicio por una deuda con terceros podría ser abusivo **salvo** que el contrato con el comercio sea expresamente un servicio **por suscripción escalonada** (cada tramo de acceso se paga con cada cuota) y esté conectado (CCyC art. 1073: contratos conexos con finalidad económica común). |
| **Ley 24.240 art. 34 + CCyC art. 1110** (revocación 10 días en ventas a distancia) + **Res. SCI 424/2020** (botón de arrepentimiento) | [Data, Tier 1/2] Derecho irrenunciable a revocar dentro de 10 días corridos desde la entrega o la celebración, lo último que ocurra; botón de arrepentimiento en la home, sin registración previa, código de confirmación en 24 h. | [Opinion] **Sí** al comercio en la venta del curso/software. Choca con el diseño: si el beneficiario revoca, ¿a quién se devuelve el pozo, que pertenece económicamente a los otros miembros? Hay que definir que el reembolso vuelve **al beneficiario** (y éste sigue debiendo sus cuotas) o al grupo. **DATA GAP**: vigencia actual de la Res. 424/2020 y cambios por DNU 70/2023 a la Ley 24.240. |
| **Ley 24.240 (publicidad, precio, art. 36 operaciones de crédito)** | [Opinion — no verificado artículo por artículo] Información veraz sobre precio total, descuento real, costo financiero si hay financiación. | Aplica a cómo comunicamos "compra con descuento". Mostrar precio de lista, precio con descuento y que **no hay interés**. |
| **Autoridad en Jujuy** | **DATA GAP**: no identificamos la ley provincial ni el organismo de aplicación de Jujuy. | — |

### 1.7 Impositivo — ARCA (nacional) y Rentas Jujuy

| Tributo | [Data] / [Opinion] |
|---|---|
| **IVA sobre nuestra comisión** | [Opinion] La comisión del 3–5% cobrada al comercio es una prestación de servicios gravada (alícuota general 21%) si somos responsables inscriptos; monotributo si es persona humana chica. **DATA GAP**: no verificamos el artículo de la Ley de IVA; consultar contador. |
| **Ganancias** | [Opinion] Nuestra comisión es renta gravada de la sociedad/persona. Para los miembros, una ROSCA no genera renta (reciben lo que aportan, sin interés). Tenencia de wARS: posible Bienes Personales. [Data, Tier 3] Tratamiento de diferencias de cambio en stablecoins "sin resolver" según guías privadas. |
| **Impuesto a los débitos y créditos (Ley 25.413)** | [Opinion] Grava movimientos en **cuentas bancarias**; las transferencias on-chain de wARS no pasan por cuentas bancarias, así que en principio no tributan; sí al hacer on/off-ramp contra cuenta bancaria. **DATA GAP**: no encontramos normativa ARCA específica. |
| **Facturación del comercio** | [Data, Tier 3] Cobros en cripto se facturan con factura electrónica valuada en pesos al momento de la operación. [Opinion] Con wARS es trivial (1:1). El comercio debe facturar **a cada miembro por su cuota** o **al beneficiario por el total**: hay que decidirlo (impacta en quién es el consumidor y quién tiene derecho de revocación). |
| **Ingresos Brutos Jujuy** | **DATA GAP** (alícuota para servicios digitales/intermediación). Convenio Multilateral si operamos en varias provincias. |

---

## 2. Datos y privacidad

| Norma | Qué exige | Aplicación |
|---|---|---|
| **Ley 25.326** (Protección de Datos Personales) + Dec. 1558/2001, autoridad: **AAIP** | [Data, Tier 2] Sigue **plenamente vigente**; los proyectos de reforma (1948-D-2025, 644-S-2025, 1751-D-2026, 3397-D-2026) están en comisión **sin dictamen al 26/09/2026**. [Opinion] Consentimiento informado, finalidad, inscripción de bases de datos en el registro de la AAIP, derechos ARCO, seguridad, transferencias internacionales (el LLM y Telegram procesan datos fuera de Argentina). | **Sí, desde el piloto.** Guardamos nombre/alias de Telegram, historial de pagos, y potencialmente **datos de solvencia/comportamiento de pago** (quién pagó tarde). Estos últimos son sensibles en la práctica: no publicarlos, no compartirlos con comercios más allá de "acceso activo/suspendido". |
| **Blockchain pública** | [Opinion] Las direcciones y transacciones en Celo son públicas e inmutables. Si la página pública de estado vincula alias ↔ dirección ↔ montos, estamos publicando datos personales sin posibilidad de borrado. | Mantener la vinculación alias↔dirección **off-chain** y fuera de la web pública; la web muestra solo alias elegidos por el grupo. |
| **IA / decisiones automatizadas** | [Data, Tier 2] Hay proyectos sobre IA (2912-D-2026, sector público) sin sanción. | [Opinion] El LLM no decide sanciones (ya es regla del repo: "el LLM propone, el código decide"). Documentarlo en la política de privacidad. |

---

## 3. Cambios próximos (radar)

| Fecha | Cambio | Impacto |
|---|---|---|
| 16/10/2026 (ya vigente) | CNV RG 1172/2026, nuevo régimen PSAV, exclusión de autocustodia. | Favorable si somos non-custodial. |
| 01/11/2026 | Informe mensual PSAV (formulario PSAV_014). | Solo si fuéramos PSAV. Afecta a Ripio, no a nosotros. |
| En curso | Proyectos de reforma integral de datos personales (estándar tipo RGPD). | Si se aprueba: DPO, evaluación de impacto, multas mayores. Diseñar ya con minimización. |
| 2026 | BCRA endurece registro PSP (Com. "A" 8432, 8482). | Solo si tocamos fiat. |
| **DATA GAP** | ¿Hay proyecto IGJ o del Congreso para modernizar el Decreto 142.277/43 o regular "ahorro colaborativo digital"? No encontramos. | Sería la oportunidad de un sandbox. |

---

## 4. Estimación de costo de cumplimiento

> Montos orientativos [Opinion]; honorarios en Argentina varían mucho. Verificar con cotizaciones.

| Escenario | Qué incluye | Costo estimado |
|---|---|---|
| **Mínimo viable (piloto privado Jujuy, ≤ 5 grupos de conocidos)** | Términos y condiciones + política de privacidad redactados/revisados por abogado; inscripción de base de datos ante AAIP; monotributo o SAS; disclaimer claro ("herramienta de registro, no administramos fondos, no es un plan de ahorro"); contrato modelo con 1–2 comercios. | **USD 1.500–4.000** una vez + monotributo. Plazo: 2–4 semanas. |
| **Intermedio (comercios + comisión, grupos por invitación en varias ciudades)** | Dictamen legal formal sobre encuadre IGJ/BCRA/CNV (el documento más importante); SAS/SA; contador (IVA, IIBB, Convenio Multilateral); contrato marco con comercios que traslade obligaciones de consumo; KYC vía Ripio; auditoría del contrato inteligente. | **USD 10.000–30.000** primer año. Plazo: 2–4 meses. |
| **A escala (comunidades abiertas, LatAm)** | O bien (a) rediseño que nos mantenga claramente fuera (proveedor de software + marketplace), o (b) alianza con una administradora de planes de ahorro **ya autorizada por la IGJ** o una entidad/PSP regulada que asuma la parte regulada, o (c) autorización propia (SA con $100M de capital, actuario, oficial de cumplimiento, auditoría). Más un análisis por país. | (a)/(b): **USD 50–150k/año**; (c): **> USD 150k** iniciales + estructura permanente. Plazo: 6–18 meses. |

---

## 5. Evaluación de riesgo por modalidad

| Modalidad | IGJ (ahorro fines determinados) | BCRA (intermediación / crédito / PSP) | CNV/UIF (PSAV) | Consumidor | Datos | **Global** |
|---|---|---|---|---|---|---|
| **A. Grupo privado sin comercio** (conocidos, pozo en wARS al beneficiario, sin comisión) | Bajo | Bajo | Bajo (si non-custodial) | Bajo | Medio (on-chain público) | **BAJO** |
| **B. Grupo privado con comercio** (pozo paga curso/software, comisión 3–5%, garantía revocable) | **Medio-Alto** (se parece al Cap. III RG 8/2015) | Bajo-Medio (crédito implícito) | Bajo (comercio excluido por art. 2 ii) | **Medio** (revocación 10 días, suspensión de servicio) | Medio | **MEDIO** |
| **C. Comunidad abierta con comercio** (desconocidos, publicidad, escala) | **Alto** (oferta al público + organización profesional + promesa de prestación futura) | Medio (art. 19 Ley 21.526 penaliza publicidad para captar recursos; agravante art. 310 CP por internet) | Medio (si el agente firma por los usuarios) | Medio-Alto | Medio-Alto | **ALTO** |

[Opinion] El salto de riesgo grande está entre A y B por la **IGJ**, y entre B y C por el **carácter público** de la oferta.

---

## 6. Diseños que reducen el riesgo

1. **Nunca custodiar.** Cada cuota va directo de la billetera del miembro a la del beneficiario o del comercio. El contrato registra, no retiene. Sin admin keys, o con poderes mínimos, públicos y con timelock (reduce el riesgo de "control o influencia suficiente", CNV art. 2 iii).
2. **El miembro firma.** El agente propone y arma la transacción; el usuario la firma en su billetera (MiniPay/Valora). Evitar `approve` ilimitados o session keys con poder de disposición en manos del agente. Si se usan, que sean por monto y destinatario fijos y revocables. Mantiene la exclusión de autocustodia (art. 2 iv).
3. **No "adjudicar" desde un fondo.** El pozo es la suma de transferencias individuales al beneficiario; no existe un "fondo del grupo" ni sorteo/licitación administrados por nosotros. El orden de turnos lo fija el grupo (regla determinística elegida por ellos).
4. **Separar ROSCA y compra.** Modelo recomendado: la ROSCA entrega **dinero** al beneficiario (modalidad A, bajo riesgo). Aparte, el comercio ofrece al beneficiario un **descuento** si paga con su pozo. El comercio vende el servicio **al beneficiario**, que es su cliente y su consumidor. Evita que el esquema sea "ahorro previo para adquirir servicios" organizado por un tercero.
5. **Reformular la "garantía revocable".** En lugar de cortar un servicio ya pagado por una deuda con terceros: (a) el comercio vende una **suscripción por tramos**, donde cada tramo se habilita con cada cuota del miembro (el servicio nunca está pagado de más), o (b) la sanción es **reputacional/social dentro del grupo** (reglas del grupo, no del comercio). Que lo valide un abogado de consumo.
6. **Comisión como servicio al comercio**, facturada como marketing/software ("fee por cliente referido"), no como porcentaje del ahorro de los miembros. Nunca cobrarle a los miembros por "administrar" su ahorro.
7. **Grupos cerrados por invitación**, con tamaño máximo (por ejemplo ≤ 12–15) y sin publicidad que ofrezca "planes de ahorro" al público. Comunicar "herramienta para organizar tu junta con gente que conocés".
8. **Ningún crédito nuestro.** No adelantar turnos con fondos propios ni de inversores. Si algún día existe, que lo dé un proveedor de crédito registrado.
9. **Rampa fiat solo vía Ripio** (PSAV registrado), así el KYC/PLA queda en un sujeto obligado.
10. **Minimización de datos.** Alias en la web pública; mapeo alias↔dirección cifrado off-chain; política de borrado; inscripción en AAIP.
11. **Textos legales en lenguaje claro** (rioplatense): "La Vaquita no guarda tu plata", "no es un plan de ahorro autorizado por la IGJ", "si alguien no paga, la vaquita no lo cubre".

---

## 7. Preguntas para un abogado

1. Una app que coordina juntas rotativas entre conocidos, sin recibir fondos, ¿encuadra en el art. 299 inc. 4 de la Ley 19.550 o en el Decreto 142.277/43? ¿Hay dictámenes o jurisprudencia de la IGJ sobre ROSCAs/tandas/pasanakus?
2. Si el pozo de cada turno se usa para comprar un servicio a un comercio asociado con entrega escalonada, ¿es un "plan de ahorro previo por grupos cerrados para la adquisición de servicios" (Cap. III, art. 34, RG IGJ 8/2015)? ¿Qué diferencia de diseño nos saca de ahí (por ejemplo, separar ROSCA en dinero y descuento posterior)?
3. ¿Quién sería el "administrador" a ojos de la IGJ: nosotros, el comercio o el grupo? ¿Cambia algo que el contrato sea inmutable y nosotros no tengamos control?
4. ¿A partir de qué tamaño o forma de difusión un grupo "privado" pasa a ser "oferta al público"? ¿Invitación por link compartible cuenta como oferta al público?
5. Ley 21.526 art. 19 y CP art. 310: ¿hay riesgo penal para los fundadores si la plataforma escala a comunidades abiertas? ¿Qué publicidad está prohibida?
6. CNV RG 1172/2026: un agente de IA que arma transacciones y el usuario firma, ¿queda en la exclusión de software de autocustodia (art. 2 iv)? ¿Y si el agente tiene una session key con permiso limitado para debitar cuotas?
7. ¿El contrato inteligente con funciones de pausa/upgrade nos da "control o influencia suficiente" (art. 2 iii)?
8. "Garantía revocable": ¿es válida bajo la Ley 24.240 art. 37 y CCyC 1117–1122 la suspensión del acceso a un servicio por impago de cuotas debidas a otros miembros? ¿La conexidad contractual (CCyC 1073–1075) la habilita o la empeora?
9. Derecho de revocación de 10 días (art. 34 / CCyC 1110): ¿a quién se reembolsa si el servicio se pagó con el pozo? ¿Quién es el consumidor: el beneficiario o cada aportante?
10. ¿La comisión del 3–5% al comercio, facturada como servicio de marketing, cambia el encuadre IGJ/BCRA?
11. ¿Conviene una SAS en Jujuy o en CABA? ¿Qué organismo provincial de Jujuy controla personas jurídicas y defensa del consumidor?
12. Datos: ¿hay que inscribir la base en la AAIP desde el piloto? ¿Cómo tratar transferencia internacional (Telegram, proveedor de LLM)? ¿El historial de pagos tardíos es dato de solvencia?
13. Fiscal: IVA e IIBB de la comisión; si el comercio factura a cada aportante o al beneficiario; tratamiento de wARS en Ganancias y Bienes Personales.
14. ¿Existe vía de sandbox o consulta previa (IGJ, BCRA, CNV) para un producto así?

---

## 8. Data gaps

- **Precedentes**: no hallamos ningún caso público de IGJ/BCRA/CNV contra una junta, tanda, pasanaku o app de "círculos de ahorro" informal en Argentina (ni a favor ni en contra).
- **Texto del art. 34 (Cap. III) RG IGJ 8/2015**: vimos el índice oficial ("bienes muebles, pasajes o servicios") pero no el cuerpo del artículo; tampoco el art. 9 (Penalidades) ni el art. 15 (Sanciones) completos.
- **Texto consolidado del Decreto 142.277/43 art. 1** (alcance exacto) y **Ley 22.315 arts. 3/9** (competencia IGJ): solo vía fuentes secundarias.
- **RG IGJ 1/2025**: cifras ($100M / $300M) verificadas en Tier 2 y en el título del BO; no leímos el texto completo. ¿Hubo actualización posterior en 2026? No verificado.
- **CNV RG 1172/2026**: patrimonio neto mínimo de PSAV; numeración exacta de artículos (el extracto del BO tiene cuerpo + anexo y la numeración puede ser del texto de las Normas CNV).
- **BCRA**: monto vigente del umbral de registro de proveedores no financieros de crédito.
- **wARS**: no encontramos autorización/opinión específica de BCRA o CNV sobre stablecoins en pesos.
- **Consumidor**: vigencia actual de Res. SCI 424/2020; modificaciones a la Ley 24.240 por DNU 70/2023; ley y autoridad de consumo de Jujuy.
- **Jujuy**: registro de personas jurídicas (aparece dentro de Fiscalía de Estado, sin confirmar) y alícuota de IIBB.
- **Impuestos**: artículos específicos de la Ley de IVA y tratamiento ARCA de cobros en stablecoins.
- **LatAm**: estado actual de licencia de MoneyFellows (sandbox del Banco Central de Egipto según 2022; no confirmamos licencia de la FRA); regulación específica de tandas digitales en México; Perú solo cubierto para fondos colectivos.

---

## 9. Comparativo LatAm (rápido)

| País | Figura regulada | Regulador | Lectura para nosotros |
|---|---|---|---|
| **Brasil** | *Consórcio* (Lei 11.795/2008) | Banco Central do Brasil autoriza administradoras (art. 7); Circulares 3.432/3.433 subieron capital mínimo (R$ 400 mil bienes muebles / R$ 1 millón inmuebles) [Tier 2] | Equivalente directo de los planes IGJ. Operar sin autorización = contratos anulables y devoluciones [Tier 2]. Una "ROSCA con compra" en Brasil cae casi seguro en consórcio. |
| **México** | Ley Fintech (2018): ITF (fondeo colectivo, pagos electrónicos) con autorización CNBV; sandbox de 1–2 años [Tier 2] | CNBV, Banxico, CONDUSEF | CONDUSEF advierte sobre tandas como método de ahorro [Tier 3]. **DATA GAP** sobre apps de tandas digitales. El sandbox es una vía. |
| **Perú** | Empresas Administradoras de Fondos Colectivos (EAFC), Reglamento Res. SMV 020-2014-SMV/01 [Tier 1/2] | SMV (autoriza, supervisa, ejecuta garantías; revocó a Plan Rentable) | Similar a Brasil/Argentina: fondos colectivos para vehículos/inmuebles requieren autorización. |
| **Colombia** | Captación masiva y habitual no autorizada: Decreto 4334/2008 (intervención por Supersociedades), Decreto 4336/2008 (pena 120–240 meses); Decreto 1068/2015 define "masiva" con más de **20 personas** o más de **50 obligaciones** [Tier 1/2] | Superfinanciera, Supersociedades | El umbral de 20 personas es una referencia útil de "público" incluso para pensar Argentina [Opinion]. Riesgo penal muy alto. |
| **Egipto** (referencia) | MoneyFellows (gam'eya digital) | Operó en el **sandbox del Banco Central de Egipto** con Banque Misr monitoreando pagos; licencia definitiva no confirmada [Tier 2/3] | Prueba de que el modelo se puede regularizar vía sandbox y alianza bancaria, no operando en el vacío. Monetiza con fee al retirar el pozo. |

[Opinion] Patrón regional: **la ROSCA informal entre conocidos se tolera; la administración profesional de grupos de ahorro para adquirir bienes o servicios se regula siempre**, con autorización, capital mínimo y supervisión. La Vaquita 2.0 con comercios está del lado regulado salvo que el diseño la mantenga como herramienta del grupo.

---

## 10. Fuentes

**Tier 1 (normativa / organismos)**
- RG IGJ 8/2015, texto completo con Anexo A (PDF, 08/10/2015): https://www.argentina.gob.ar/sites/default/files/resolucion_general_08-15.pdf
- RG IGJ 8/2015 en Boletín Oficial (14/10/2015): https://www.boletinoficial.gob.ar/detalleAviso/primera/134153/20151014
- RG IGJ 1/2025 (texto): https://www.argentina.gob.ar/normativa/nacional/norma-408175/texto
- Decreto 142.277/1943: https://www.argentina.gob.ar/normativa/nacional/norma-253265/texto
- IGJ, competencia en sociedades de ahorro: https://www.argentina.gob.ar/node/131291
- Ley 19.550 (texto actualizado, art. 299): https://servicios.infoleg.gob.ar/infolegInternet/anexos/25000-29999/25553/texact.htm
- Ley 21.526 (texto): https://www.argentina.gob.ar/normativa/nacional/16071/texto
- BCRA, Sumario 1562 (Tutasa), art. 19 Ley 21.526: https://www.bcra.gob.ar/archivos/Pdfs/SistemasFinancierosYdePagos/Res-197-Sum-1562-Tutasa.pdf
- BCRA, texto ordenado PSP (jul-2025): https://www.bcra.gob.ar/archivos/Pdfs/Texord/t-snp-psp.pdf
- BCRA Com. "A" 6885: https://www.bcra.gob.ar/archivos/Pdfs/comytexord/A6885.pdf
- BCRA Com. "A" 8432 (30/04/2026): https://www.bcra.gob.ar/archivos/Pdfs/comytexord/A8432.pdf
- BCRA Com. "A" 8482 (16/09/2026): https://www.bcra.gob.ar/archivos/Pdfs/comytexord/A8482.pdf
- BCRA Com. "A" 7146 (proveedores no financieros de crédito): https://www.bcra.gob.ar/archivos/Pdfs/comytexord/A7146.pdf
- BCRA, trámite de inscripción de otros proveedores no financieros: https://www.bcra.gob.ar/inscribir-a-una-entidad-emisora-de-tarjetas-de-credito-y-o-compra-y-otros-proveedores-no-financieros/
- CNV RG 1172/2026, Boletín Oficial 15/10/2026: https://www.boletinoficial.gob.ar/detalleAviso/primera/348986/20261015
- UIF Resolución 49/2024: https://www.argentina.gob.ar/normativa/nacional/norma-397597/texto
- Res. SCI 424/2020 (botón de arrepentimiento), BO 05/10/2020: https://www.boletinoficial.gob.ar/detalleAviso/primera/235729/20201005
- Brasil, Lei 11.795/2008 art. 7: https://www.legjur.com/legislacao/art/lei_00117952008-7
- Colombia, Decreto 4334/2008: https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=33747
- Colombia, Supersociedades, ABC captación ilegal: https://supersociedades.gov.co/documents/guest/Prensa/Noticias/Documentos/2016/ABC%20Intervenci%C3%B3n%20por%20captaci%C3%B3n%20ilegal.pdf

**Tier 2 (estudios jurídicos / prensa especializada)**
- abogados.com.ar, RG IGJ 1/2025 (2025): https://abogados.com.ar/resolucion-igj-no-12025-modificaciones-en-materia-de-sociedades-de-capitalizacion-y-ahorro-para-fines-determinados/36158
- abogados.com.ar, competencia federal en planes de ahorro: https://abogados.com.ar/la-justicia-provincial-no-es-competente-para-entender-en-una-accion-colectiva-que-involucra-planes-de-ahorro/27484
- abogados.com.ar, CNV actualiza régimen PSAV (oct-2026): https://abogados.com.ar/la-cnv-actualiza-el-regimen-aplicable-a-los-proveedores-de-servicios-de-activos-virtuales/40294
- Criptoinforme, RG 1172/2026 (oct-2026): https://criptoinforme.com/legal/resolucion-1172-cnv-psav-exchanges-argentina/
- Estudio O'Farrell, RG 1172: https://www.estudio-ofarrell.com/la-cnv-actualiza-el-regimen-aplicable-a-los-proveedores-de-servicios-de-activos-virtuales/
- Beccar Varela, UIF 49/2024 (27/03/2024): https://beccarvarela.com/novedades/unidad-de-informacion-financiera-uif-resolucion-49-2024-proveedores-de-servicios-de-activos-virtuales-como-sujetos-obligados/
- Pensamiento Penal, delito de intermediación financiera no autorizada (art. 310 CP): https://pensamientopenal.com.ar/doctrina/90300-delito-intermediacion-financiera-no-autorizada
- Allende & Brea, caso Afluenta c. BCRA: https://allende.com/wp-content/uploads/2024/02/fintech-Afluenta-S.A.-y-otros-c.-BCRA-s.-Entidades-Financieras-1.pdf
- Estudio O'Farrell, botón de arrepentimiento: https://www.estudio-ofarrell.com/boton-de-arrepentimiento-en-relaciones-de-consumo-via-web-res-sci-424-20
- CiberLATAM, proyectos de datos personales (sep-2026): https://ciberlatam.com/noticias/argentina-proyectos-cambiar-datos
- Allende & Brea, reintroducción del proyecto de datos (dic-2026 según URL; fecha a verificar): https://allende.com/privacidad-y-ciberseguridad/se-reintroduce-en-el-congreso-el-proyecto-de-reforma-integral-del-regimen-argentino-de-proteccion-de-datos-personales-08-12-2026/
- Revista Mercado, lanzamiento wARS (oct-2025): https://mercado.com.ar/finanzas/ripio-presenta-wars-su-stablecoin-respaldada-en-pesos-argentinos-y-disponible-en-redes-blockchain/
- Garrigues, Ley Fintech México: https://www.garrigues.com/es_ES/noticia/mexico-estrena-normativa-sobre-fintech
- Gestión (Perú), SMV y fondos colectivos: https://gestion.pe/tu-dinero/finanzas-personales/fondos-colectivos-smv-revoca-autorizacion-de-funcionamiento-de-plan-rentable-noticia/
- Wamda, entrevista MoneyFellows (2019): https://www.wamda.com/en/2019/05/conversation-ahmed-wadi-moneyfellows

**Tier 3 (blogs / medios generales)**
- Bitrue, prueba de reservas wARS: https://www.bitrue.com/es/blog/ripio-wars-stablecoin-argentine-peso-on-chain-utility-price-chart
- Base blog, cobrar con stablecoins en Argentina: https://base.com/es-AR/blog/?p=18421
- Mediotiempo, CONDUSEF y tandas: https://www.mediotiempo.com/otros-mundos/atencion-con-tandas-condusef-lanza-advertencia-metodo-ahorro
- Egypt Innovate, MoneyFellows: https://egyptinnovate.com/en/node/7224
