# C2 · Señales de demanda y validación de mercado (La Vaquita 2.0)

> Agente C2 (Ola 3). Fecha de corte: **2026-10-24**. Profundidad pedida: DEEP.
> **Escala de fuentes:** **T1** = primaria (empresa, regulador, tienda de apps, microdatos); **T2** = prensa especializada o medio reconocido; **T3** = agregadores, blogs, perfiles autodeclarados. ⚠ = dato de más de 18 meses (anterior a abril de 2025).
>
> **Limitación grave (declarada):** el presupuesto de búsquedas web de la sesión **ya estaba agotado al arrancar este agente** (0 búsquedas disponibles, límite compartido entre agentes). No se pudo hacer ninguna de las 10+ búsquedas del protocolo. Lo que hay acá sale de:
> 1. **8 lecturas directas (WebFetch) a fuentes primarias**, hechas hoy. Funcionaron 3: moneyfellows.com, coderhouse.com/ar y club.lanacion.com.ar. Fallaron 5: Google Trends (HTTP 429), dos fichas de Google Play (404 por ID de paquete desconocido), haceunavaquita.com (el dominio no resuelve), 365.clarin.com (bloqueado), mercadopago.com.ar/costs-section (403) y tandamas.com (error SSL).
> 2. **Datos con fuente y tier ya relevados en las Olas 1-2** (`direct-competitors.md`, `competitor-gtm.md`, `indirect-competitors.md`, `market-size.md`, `adjacent-markets.md`, `trends.md`). Acá se reorganizan para responder demanda, precio y disposición a pagar. Las fuentes originales están al final.
>
> Nada de este documento se inventó. Donde no hay dato, dice **DATA GAP**. Los rangos recomendados son **estimaciones propias** y están marcados como tales.

---

## 0. Resumen ejecutivo

1. **La demanda de búsqueda no se pudo medir.** Google Trends devolvió 429 y no quedaban búsquedas para usar artículos que citen tendencias. Los proxies apuntan a un **nicho real pero chico en Argentina**: el 5,6 % de la muestra del Findex 2025 ahorró en un "club de ahorro o con alguien fuera de la familia" (T1, sin ponderar). El pasanaku tuvo cobertura en la prensa argentina en enero y febrero de 2026 (T2/T3).
2. **La demanda de "ahorrar en grupo para comprar algo" sí está probada**, pero en bienes grandes: 394.489 suscripciones nuevas a planes de ahorro de autos en 2025, +14,7 % (T2, Infobae). Solo ~4 de cada 10 suscriptores retiran el auto, y eso es una señal de insatisfacción con el canal actual.
3. **Actividad competitiva:** Money Fellows confirma en su web, hoy, "más de 8 millones de usuarios" (T1). Tanda+ (México) ya anuncia una "Tienda". En Celo hay al menos 5 ROSCA con agente. **En Argentina no se encontró ninguna app de consumo de juntas activa** (hipótesis sin confirmar en Play Store).
4. **El precio de referencia para el ahorrista es $ 0.** WhatsApp más transferencias de Mercado Pago es gratis, y las transferencias P2P no tienen comisión. Cualquier fee al usuario compite contra cero.
5. **Del lado del comercio sí hay disposición a pagar:** los productores de cursos ya pagan entre 30 y 80 % a afiliados en Hotmart, Udemy se queda con el 63 % de la venta orgánica y Mercado Libre cobra entre 11,8 y 17 %. Una comisión de **8-15 % en bienes digitales** es defendible (estimación propia).
6. **Puntaje general de validación: 5,5/10, "señal moderada, con validación pendiente del lado comercio en Jujuy".**

---

## 1. Demanda de búsqueda (R1)

### 1.1 Google Trends

| Término | Resultado | Estado |
|---|---|---|
| "junta de ahorro", "tanda", "pasanaku", "vaquita" (AR) | WebFetch a trends.google.com → **HTTP 429** | **DATA GAP** |
| "ahorro grupal", "comprar notebook en cuotas", "curso en cuotas" | No se intentó: no había presupuesto de búsqueda y Trends ya había bloqueado | **DATA GAP** |

**Advertencia metodológica aunque Trends funcione:** "vaquita" en Argentina se confunde con la colecta para un regalo o un asado (y con el animal), y "tanda" con la "tanda publicitaria". Solo "pasanaku" y "junta de ahorro" son términos limpios, y probablemente tengan un volumen bajo. Recomendación: medir con Trends **"pasanaku" en Jujuy, Salta y Bolivia** y **"plan de ahorro" contra "cuotas sin interés"** como proxy de "ahorro previo contra crédito".

### 1.2 Proxies de demanda disponibles

| Proxy | Dato | Fecha | Tier | Lectura |
|---|---|---|---|---|
| Ahorró en un club de ahorro o con alguien fuera de la familia (Findex `fin17c`, Argentina) | **5,6 %** (56/1.000, sin ponderar; IC ±1,4 pp) | encuesta 2024, publ. 2025 | T1 | ~1,9 M de adultos (estimación de `market-size.md`). Es un nicho, no un hábito masivo. El pool global da 16 %. |
| Lo mismo aplicado a Jujuy | ~33.000 adultos (estimación) | 2026 | Estimación | Podría ser más alto por el pasanaku andino: **DATA GAP**. |
| Pasanaku en la prensa argentina | Notas del 22-01-2026 (Que Pasa Salta) y del 01-02-2026 (Bardeo): grupos de 10 a más de 300 personas para vivienda o 0 km; "en el norte estaría comenzando a replicarse" | ene-feb 2026 | T2 / T3 | Hay una señal cultural en el NOA, pero sin números de uso. |
| Planes de ahorro de autos | 394.489 suscripciones en 2025 (+14,7 %); 23 % de los patentamientos; ~37-40 % llega a la adjudicación | ene-2026 | T2 (Infobae) | La demanda de ahorro previo para un bien está probada y es masiva. El producto actual frustra a la mayoría. |
| Tandas en México | 20 % de los adultos (ENIF 2024; hay lecturas de 20 % de los ahorristas, 30 % y 31 %) | 2024 | T2 sobre T1 | Es el mercado de tandas mejor medido de LatAm (para la visión regional). |
| Consórcio en Brasil | 12,93 M de participantes activos (mar-2026, récord) | 2026 | T1/T2 (ABAC) | "Ahorro grupal más compra" funciona a escala en LatAm cuando hay confianza institucional. |
| Contexto que empuja hacia el ahorro previo | Mora en billeteras virtuales de 29,6-30,1 % (may-jun 2026, CEPA/BCRA); Mercado Pago pasó de 5,5 % a 14,7 % en un año; escasez de cuotas sin interés | 2026 | T2 | El canal "cuotas" se está cerrando para el público sin buen scoring. Es un viento a favor. |
| Contexto en contra | Reservas de Mercado Pago al 19 % TNA; Ualá hasta 24-25 % TNA; inflación de 1,9 % mensual | oct-2026 | T2 / T1 | El ahorro individual remunerado es el sustituto directo. |
| Mercado Pago Reservas | +15 M de reservas creadas (categorías, no personas) | 2026 (fecha exacta sin aislar) | T2 | Hay demanda masiva de "ahorro por objetivo", individual. |
| Coderhouse (vertical inicial) | "+500.000 egresados"; precios en pesos con cuotas y descuentos (los montos no aparecen en la home) | leído hoy | T1 (autodeclarado) | El curso online es una compra que ya se financia en cuotas: hay un hábito de pagar en partes. |

**Conclusión R1:** no hay evidencia directa de búsquedas. Lo que sí hay: (a) un hábito de nicho de ahorro rotativo (~5,6 %), (b) una demanda masiva de ahorro por objetivo individual y de ahorro previo para bienes grandes, y (c) un canal de crédito que se deteriora. La tesis "junta con meta de compra" junta (a) con (b). Que el usuario argentino busque activamente esta combinación **no está probado**.

---

## 2. Señales de lanzamiento y actividad competitiva (R2)

| Producto | País | Señal de tracción | Fecha | Tier | Lectura |
|---|---|---|---|---|---|
| **Money Fellows** | Egipto (+MENA) | Su web dice hoy: "Join over 8 million users". Prensa: ~350k MAU (~4 % activo), +2 M de círculos, US$ 1.500 M transaccionados, 328 acuerdos B2B2C, rentable | 2026-10-24 (web) / oct-2025 (prensa) | T1 / T2 | Es la prueba más fuerte de que una ROSCA digital escala. También muestra que la **retención es el problema** (4-7 % de MAU sobre registrados). |
| Money Fellows en Android | — | 3,5★ con ~37k reseñas según un agregador. **La ficha de Play no se pudo leer** (404 con el ID probado) | s/f | T3 | **DATA GAP:** descargas verificadas en Play. |
| **Tanda+** | México | Freemium: $39 MXN por tanda adicional; cobro en OXXO; anuncia "Tanda+ Tienda" (compras a 3-12 meses, compras grupales) como **próximamente** | 2026 | T1 (web, vía Ola 2) | Valida la tesis "pozo + tienda" y es el competidor conceptual más cercano. Su web falló hoy por SSL. Descargas: **DATA GAP**. |
| TandaPlus, TandaClick, Tandas de dinero | México | Existen en tiendas | s/f | T3 | Hay varias apps chicas: el mercado está fragmentado y nadie domina. |
| **Hacé Una Vaquita** | Argentina | Gratis si se gasta en comercios adheridos; 10 % si se retira. **El dominio haceunavaquita.com no resuelve hoy** | ~2023 ⚠ / 2026-10-24 | T2 ⚠ / T1 (DNS) | **Señal negativa:** el antecedente local más parecido al modelo de ingresos parece haber cerrado o migrado. No se pudo confirmar el motivo (**DATA GAP**). Es una pregunta crítica para el pitch: "¿por qué esta vez funciona?". |
| BancoSol Pasanaku Digital | Bolivia | Pasanaku dentro de la app bancaria (tope Bs 2.000 por participante) | fecha: DATA GAP | T1 | Los bancos del Altiplano ya ven demanda. |
| Sommos / PasanaQ | Bolivia → LatAm | >100k usuarios a través de 10 bancos (autodeclarado) | jun-2026 | T3 | Hay demanda en la región, pero por el canal B2B. |
| Yahoo Finance Tanda (†) | EE.UU. | ~37k instalaciones; cerró en mayo de 2018 | 2018 ⚠ | T2 | **Antiseñal:** una ROSCA entre desconocidos, sin la costumbre y sin cubrir impagos, no tracciona. |
| ROSCA en Celo (Ronda, AjoAI, ChamaAgent, Circlepot, Celo-Save) | Global | Proyectos de hackathon o con grants; usuarios: **DATA GAP**; Ronda salió 3ª en ETHGlobal BA | 2025-26 | T1 / T3 | Hay mucha oferta y no se ve demanda: hay builders, no usuarios. |
| Hackathon actual (TesorerIA, Comunyfi) | AR | Fondo grupal en wARS | oct-2026 | Ola 1 | Competencia directa por el premio, no por el mercado. |
| Product Hunt "group savings" | — | No consultado | — | — | **DATA GAP**. |
| Waitlists | — | Solo "Tanda+ Tienda" como "próximamente" | 2026 | T1 | No se encontraron otras waitlists públicas. |

**Lectura R2:** la categoría "ROSCA digital" tiene **un ganador probado (Money Fellows)** y muchos intentos chicos. En Argentina, el único antecedente con el mismo modelo de ingresos (Hacé Una Vaquita) **no parece estar vivo**. Eso no invalida la idea, pero obliga a explicar qué cambia: agente, wARS, comunidad o vertical digital.

---

## 3. Panorama de precios (R3)

| Producto / sistema | Quién paga | Fee | Modelo | Fecha · Tier |
|---|---|---|---|---|
| **Money Fellows** | Usuario (y comercio vía markup) | Hasta 16 % en los turnos tempranos, que baja a 0 % en los finales (otras fuentes dicen ~5-6 % al primer turno); promos de "zero fees" y 75 % off en las primeras cuotas | Fee por adelantar el turno + markup sobre productos en la app + tarjeta/BNPL | blog 2026 T1; TechCrunch 2022 ⚠ T2 |
| **Tanda+** | Usuario (organizador) | 1 tanda gratis; $39 MXN por tanda adicional | Freemium por tanda; "Tienda" a futuro | 2026 · T1 |
| **Circlepot** (Celo) | Usuario | 0,2 % de cada pago del pozo + penalidad por retiro + premium del creador | Fee transaccional | 2025-26 · T1 (repo) |
| **AjoAI** (Celo) | Nadie hoy | Gratis; a futuro 10-20 % del yield + micropagos x402 | Yield + API | 2026 · T1 (repo) |
| **Hacé Una Vaquita** (AR) | Usuario si retira; comercio si gasta | 10 % por retiro; 0 % si se gasta en comercios adheridos (voucher) | Comisión al comercio + penalización por retiro | ~2023 ⚠ · T2 |
| **Mycon** (consórcio BR) | Usuario | 9,99 % fijo total | Tasa de administración | 2022 ⚠ · T2 |
| **Consórcio BR (mercado)** | Usuario | "Taxa de administração" de 10-20 % del plan (conocimiento general, no verificado 2025-26) | Tasa de administración + fondo de reserva + seguro | Confianza baja |
| **Planes de ahorro AR (0 km)** | Usuario | Cargos de administración, derecho de suscripción/adjudicación, seguros. **Porcentajes vigentes: DATA GAP** (no se pudieron buscar) | Administradora de la terminal + margen | IGJ; Infobae 2026 · T2 |
| **Chit funds (India)** | Usuario | Comisión del "foreman": tope legal de 5 % del valor del chit | Comisión regulada + subasta del turno | Ley de 1982 · T1 (confianza media) |
| **Yahoo Tanda** (†) | Usuario | ~8 % a los primeros turnos; el último ganaba 2 % | Fee por turno | 2018 ⚠ · T2 |
| **Vaki** (CO/MX) | Organizador de campañas comerciales | Sociales gratis; comerciales con comisión (**% DATA GAP**) | Crowdfunding | T3 |
| **Mercado Pago Amigos / transferencias** | Nadie | $ 0 en transferencias P2P con saldo o débito | Gana con el float, el crédito y el MDR al comercio | 2026 · T2 (iProUP) |
| **Mercado Pago Reservas** | Nadie (le paga al usuario) | Rinde 19 % TNA | Float | oct-2026 · T2 |
| **Mercado Pago cobros (comercio)** | Comercio | **DATA GAP** (la página de costos dio 403) | MDR por plazo de acreditación | — |
| **Junta informal por WhatsApp** | Nadie (a veces la organizadora cobra en especie) | $ 0; costumbre: la organizadora suele quedarse con el primer turno o una pequeña retribución | Confianza personal | Ola 1 (sin cuantificar) |
| **Hotmart** (referencia del lado comercio) | Productor | Plataforma ~9,9 % + US$ 0,50 por venta; comisión al afiliado de 1-80 %, la fija el productor | Pago solo por venta | T1 / T3 |
| **Udemy** | Instructor | Udemy se queda con el 63 % de la venta orgánica | Marketplace | nov-2023 ⚠ · T1 |
| **Mercado Libre AR** | Vendedor | 11,8-17 % + recargo por cuotas (+5,75 % en 3 cuotas, +10,75 % en 6) + IVA | Marketplace | ene-2026 · T3 |
| **BNPL LatAm** | Comercio | MDR de 3-8 % (confianza baja) | MDR + intereses | T3 |
| **La Vaquita 2.0 (propuesta)** | **Comercio** | A definir (ver §4) | Comisión por venta pre-fondeada | — |

**Patrón:** las ROSCA digitales que cobran **al usuario** lo hacen por **adelantar el turno** (5-16 %). Las de comercio pagan entre 3 % (BNPL) y más de 30 % (infoproductos). Nadie relevado vive solo de la comisión del comercio, salvo Hacé Una Vaquita, y no se pudo verificar que siga activa.

---

## 4. Evaluación de disposición a pagar (R4 + R5)

### 4.1 Ahorrista

| Evidencia | Qué dice |
|---|---|
| Money Fellows: 8 M de registrados pagando hasta 16 % por el primer turno | En Egipto **hay disposición a pagar por adelantar**. Pero es un mercado donde la empresa **financia el hueco** y garantiza (asume riesgo con balance propio). |
| Yahoo Tanda: 8 % al primer turno; cerró | Sin la costumbre ni la garantía, nadie paga. |
| Junta de WhatsApp a $ 0 + transferencias gratis | **El precio de referencia en AR es cero.** |
| Organizadora informal | La costumbre es que se quede con el **primer turno** o una pequeña retribución (Ola 1, sin cuantificar). Fee en dinero de pasanakus o juntas en Jujuy: **DATA GAP**. |
| Promos de MP: hasta 30 % de descuento con tope; 18 cuotas sin interés | Es el umbral que tiene que superar el "descuento por comprar con el pozo" para que alguien cambie de canal. |
| Inflación de 1,9 % mensual; Reservas al 19 % TNA | En un ciclo de 10 meses, el último turno pierde ~20 % de poder de compra si el precio sigue al IPC. El descuento tiene que compensar esa espera. |

**Recomendación (estimación propia):**
- **Fee al ahorrista: 0 %** para participar y para cobrar el pozo si se canjea en un comercio asociado. Cobrar al usuario compite contra $ 0 y contra Mercado Pago.
- **Opcional:** un fee **de 1-3 % solo para quien cobra el pozo en efectivo (retiro a pesos)**, igual que el 10 % de Hacé Una Vaquita pero mucho más bajo, o una prima por adelantar el turno. La cifra 1-3 % sale de quedar por debajo del chit fund (5 %) y del primer turno de Money Fellows (5-16 %), sin dejar de desincentivar el retiro. **No validada.**
- **Organizadora: no paga y recibe un beneficio** (prioridad de turno o una parte de la comisión del comercio). Esto respeta la costumbre y la convierte en canal.
- **Descuento que mueve a cambiar de canal:** tiene que **superar el ~20 % de pérdida por espera de los últimos turnos o igualar las promos de MP (hasta 30 %, con tope)**. Rango objetivo: **15-30 % de descuento** en bienes digitales. No hay encuesta argentina de elasticidad (**DATA GAP**). Hay que medirlo en el piloto.

### 4.2 Comercio

| Evidencia | Qué dice |
|---|---|
| Hotmart: afiliados al 30-50 % ("competitivo"), con un máximo de 80 % | Los productores de cursos **ya pagan mucho por venta efectiva**. Es el lado con mayor disposición a pagar. |
| Udemy se queda con el 63 % | Un instructor acepta perder la mayor parte del precio a cambio de distribución. |
| Mercado Libre 11,8-17 % + cuotas | Referencia para bienes físicos y comercios generalistas. |
| BNPL 3-8 % de MDR | Piso para un comercio que vende algo "pre-fondeado" sin riesgo de crédito. |
| Club La Nación | Tiene un formulario "Adherí tu establecimiento" (leído hoy, T1). **No publica si el comercio paga**: el modelo habitual es que el comercio pone el descuento a cambio de visibilidad (sin verificar). |
| Clarín 365 / beneficios de universidades o sindicatos / ANSES Beneficios (+7.000 comercios) | Los comercios aceptan **dar descuentos** para entrar en un club con audiencia. Fees pagados al club: **DATA GAP**. |
| CAC de pymes AR / costo de Meta Ads AR 2026 | **DATA GAP** (sin búsquedas). Único benchmark: Nubank, ~US$ 5 por cliente (2021 ⚠, T1). Retención D30 de apps financieras LatAm: 1-4 %. |

**Recomendación (estimación propia):**
- **Bienes digitales (cursos, software, suscripciones): 8-15 % de comisión**, de la que una parte se traslada como descuento al grupo. Razón: está muy por debajo de lo que ya pagan a afiliados (30-80 %) y se cobra solo cuando la venta ocurre con plata ya juntada. Eso permite que el comercio pague además el descuento del 15-30 % de su margen, porque el costo marginal del bien digital es cercano a cero.
- **Servicios locales (gimnasios, academias presenciales): 5-10 %.**
- **Bienes físicos (si se suman): 3-6 %**, en la línea del MDR de BNPL, porque compiten contra Mercado Libre y las cuotas.
- **Argumento de venta:** "venta pre-fondeada, sin riesgo de mora (con 30 % de mora en billeteras) y con un lead que ya tiene la plata". El 3-5 % que asume `market-size.md` es **conservador** para el vertical digital.

---

## 5. Puntaje de validación de mercado

| Dimensión | Puntaje (1-10) | Justificación |
|---|---|---|
| **Demanda de búsqueda** | **3** | No medida (Trends 429). Los proxies muestran un nicho de 5,6 % y cobertura del pasanaku en la prensa del NOA, sin volumen de búsqueda. La confianza es baja. |
| **Actividad competitiva** | **7** | Hay un ganador global (Money Fellows, 8 M), Tanda+ va hacia "pozo + tienda", bancos bolivianos con pasanaku y 5+ ROSCA en Celo. La categoría está validada afuera. En AR el espacio de consumo está vacío, y el antecedente local parece muerto. Ambas cosas son a la vez oportunidad y alerta. |
| **Evidencia de gasto** | **6** | Del lado comercio es fuerte (comisiones de afiliados del 30-80 %, marketplaces del 12-17 %). Del lado ahorrista es débil en AR: el precio de referencia es $ 0. El gasto en "ahorro previo para un bien" existe (394k planes), pero en un producto que frustra. |
| **Señal general** | **5,5 / 10** | **Moderada.** Validada como categoría en otros mercados; sin validar en Argentina y Jujuy. El modelo "gratis para el ahorrista, paga el comercio" es coherente con la evidencia de precios, pero no tiene un comparable vivo. |

**Qué subiría el puntaje rápido (piloto):**
1. Cartas de intención de 3-5 comercios digitales de Jujuy o del NOA aceptando 8-15 % de comisión.
2. Encuesta corta (n≥50) a organizadoras de juntas o pasanakus en Jujuy: frecuencia, monto, meta y si cobran algo.
3. Un test de landing con "vaquita por curso" y descuento, para medir la conversión a lista de espera.

---

## 6. Data gaps

| # | Gap | Por qué importa | Cómo cerrarlo |
|---|---|---|---|
| 1 | **Google Trends** de "pasanaku", "junta de ahorro", "plan de ahorro" contra "cuotas sin interés" (AR, Jujuy, Salta) | Única medición directa de la demanda de búsqueda | Abrir Trends a mano en el navegador (dio 429 al agente) |
| 2 | **Descargas y reseñas en Play** de Money Fellows, Tanda+, TandaPlus y BancoSol | Validar la tracción con T1 | Buscar en Play Store a mano (los IDs de paquete probados dieron 404) |
| 3 | **Qué pasó con Hacé Una Vaquita** (el dominio no resuelve el 2026-10-24) | Es el antecedente local del mismo modelo de ingresos | Buscar en prensa y LinkedIn de los fundadores; consultar en nic.ar |
| 4 | **Fee de la organizadora informal** en juntas o pasanakus de Jujuy (en dinero o en turno) | Define el incentivo para el canal | Entrevistas en el piloto |
| 5 | **Cargos vigentes de los planes de ahorro AR** (administración, derecho de suscripción) | Benchmark de "ahorro previo para un bien" en AR | IGJ, contratos de las terminales (Plan Rombo, Chevrolet Plan, etc.) |
| 6 | **Elasticidad al descuento** del comprador argentino (¿qué % lo hace cambiar de canal?) | Define cuánto descuento tiene que financiar el comercio | Test A/B en el piloto; buscar estudios de CACE/Kantar |
| 7 | **CAC de pymes y costo de Meta Ads en AR 2026** (CPM, CPC, CPA) | Argumento "te traemos clientes más baratos" | Meta Ads Library / benchmarks de agencias locales |
| 8 | **Fee que pagan los comercios** a Club La Nación, Clarín 365 y clubes de beneficios universitarios o sindicales | Comparable directo de "acceso a una comunidad" | Formulario de adhesión de Club La Nación; entrevistas |
| 9 | **MDR de Mercado Pago 2026** (link de pago, QR, Point) | Piso de costo que el comercio ya conoce | Leer mercadopago.com.ar/costs-section a mano (403) |
| 10 | Product Hunt y waitlists de ahorro grupal | Señal temprana de demanda | Búsqueda manual |
| 11 | Usuarios reales de las ROSCA en Celo | Saber si hay demanda onchain o solo builders | Exploradores de Celo (contratos de cada proyecto) |

---

## 7. Fuentes

**Leídas hoy (2026-10-24) por este agente:**
- [T1] Money Fellows, home ("Join over 8 million users"): https://www.moneyfellows.com/
- [T1] Coderhouse Argentina, home (+500.000 egresados, precios en pesos con cuotas): https://www.coderhouse.com/ar/
- [T1] Club La Nación, home ("Adherí tu establecimiento", sin condiciones publicadas): https://club.lanacion.com.ar/
- Fallidas: trends.google.com (429), play.google.com (404 con dos IDs), haceunavaquita.com (DNS), 365.clarin.com (bloqueado), mercadopago.com.ar/costs-section (403), tandamas.com (SSL).

**Datos tomados de las Olas 1-2 (fuente original citada en cada archivo):**
- `direct-competitors.md`: Money Fellows (blog T1; TechCrunch 2022/2025 T2; Arab Finance 2025-10-22 T2; Trustpilot/marlvel T3), Mycon (Finsiders T2), Circlepot, AjoAI, Celo-Save, Yahoo Tanda (TechCrunch 2018-05-25 T2).
- `competitor-gtm.md`: Tanda+ (web T1), Hotmart afiliados https://hotmart.com/es/afiliados (T1), bit4learn (T3), Milenio y CONDUSEF (T2).
- `indirect-competitors.md`: pasanaku en AR, https://www.quepasasalta.com.ar/argentina/que-es-el-pasanaku-el-metodo-boliviano-para-comprar-viviendas-en-argentina/ (T2, 22-01-2026) y https://bardeo.news/sociedad/pasanaku--el-metodo-de-los-bolivianos-en-argentina-para-comprarse-un-0-km_a697f70760e48856db2cdf75f (T3, 01-02-2026); MP sin comisión en P2P https://www.iproup.com/finanzas/34328-mercado-pago-como-dividir-gastos-con-amigos-sin-pagar-comisiones (T2); promos de MP https://mercado.com.ar/finanzas/mercado-pago-actualiza-beneficios-y-descuentos-para-enero-con-promociones-en-multiples-rubros (T2); Hacé Una Vaquita (Infonegocios, ~2023 ⚠); BCRA Informe de Inclusión Financiera oct-2025 https://www.bcra.gob.ar/archivos/Pdfs/PublicacionesEstadisticas/Informe-inclusion-financiera-octubre-25.pdf (T1).
- `market-size.md`: Global Findex 2025 Argentina, microdatos del Banco Mundial (T1); Udemy IR/SEC (T1 ⚠); Mercado Libre (Spom/Jaguarsheet T3); AppsFlyer State of Finance LatAm 2026 (T1/T2); Nubank F-1 vía TechCrunch (⚠).
- `adjacent-markets.md`: planes de ahorro https://www.infobae.com/economia/2026/01/12/planes-de-ahorro-solo-4-de-cada-10-suscriptores-retiran-el-auto-0km-pero-esta-modalidad-representa-mas-del-25-del-mercado/ (T2); ABAC consórcio (T1/T2); ENIF 2024 vía El Universal (T2); chit funds J-PAL https://www.povertyactionlab.org/sites/default/files/Unregistered%20chit%20funds.pdf (T1 ⚠); mora CEPA/BCRA (T2); ANSES Beneficios https://www.losandes.com.ar/economia/anses-ofrece-20-descuentos-jubilados-y-pensionados-cuales-son-los-comercios-adheridos-n5963399 (T2).
- `emerging-competitors.md`: BancoSol Pasanaku Digital (T1), TandaPlus (T3).
- `trends.md`: tasas de oct-2026 (comparatasas), inflación de sep-2026 (INDEC vía Infobae, T1/T2).
- Ola 1, `docs/investigacion/14-vaquita-modelo-de-negocio.md`: la costumbre de que la organizadora reciba el primer turno o una pequeña retribución (sin fuente externa cuantificada).
