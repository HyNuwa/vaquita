# B3 · Go-to-market de competidores (La Vaquita 2.0)

> Fecha de investigación: 2026-10-24. Agente B3. Fuentes clasificadas por tier:
> **T1** = fuente primaria (empresa, filing regulatorio, página oficial); **T2** = prensa especializada / medios reconocidos (TechCrunch, Forbes, Bloomberg Línea, Wamda, Caixin); **T3** = blogs, agregadores, contenido patrocinado, perfiles autodeclarados (KarmaHQ, Substack, reseñas).
> Todo lo que dice "DATA GAP" no se encontró en fuentes públicas. No se completó con supuestos.

---

## 1. Desglose GTM por competidor

### 1.1 Money Fellows (Egipto) — el benchmark más cercano

| Dimensión | Hallazgo | Fecha | Tier |
|---|---|---|---|
| Escala | +8 M descargas, ~350.000 MAU, +1.000.000 clientes atendidos, US$ 1.500 M transaccionados, rentable | oct-2025 | T2 (Launch Base Africa, MEA TechWatch; origen: comunicado de la empresa) |
| Activación | En 2022: 4,5 M registrados pero solo **7 % MAU** | oct-2022 | T2 (TechCrunch) |
| Alianzas B2B2C | **328 acuerdos B2B2C** con empresas e instituciones; +50.000 tarjetas prepagas; +40 puntos de distribución físicos; banco socio principal Banque Misr | oct-2025 | T2 (Arab Finance, Mubasher; origen comunicado) |
| Comercio con descuento | Venden productos de comercios egipcios dentro de la app con descuento para el usuario; ingreso por **markup/comisión** sobre esos productos + fees de la ROSCA | oct-2022 | T2 (TechCrunch) |
| Canal principal (temprano) | "No gastamos realmente en marketing. La mayoría de nuestros clientes entra por referidos, así se sienten seguros porque viene de amigos cercanos." Además, canales offline: alianzas con puntos físicos donde el cliente entrega documentos y dinero en mano | may-2019 | T2 (Wamda, entrevista a Ahmed Wadi) |
| Mecánica de referidos | Código promo único. El que invita recibe **EGP 300 de descuento en su próxima cuota**; el nuevo usuario recibe descuento en su primera vaquita. Se activa cuando el invitado se registra **y entra a un círculo** (no solo descarga) | s/f, vigente 2025-26 | T1 (blog moneyfellows.com) |
| Programa de embajadores | Comisión por cada usuario que traen y que entra a un círculo o firma contrato; tope "hasta EGP 100.000 por círculo por suscriptor"; calculadora basada en el monto del pozo (porcentaje exacto: **DATA GAP**) | s/f | T1 (moneyfellows.com/ambassadors-page, vía snippet; la página dio 404 al fetch directo) |
| Ticket medio | Pozo medio por usuario ~EGP 23.000 (~US$ 1.100) | oct-2022 | T2 (TechCrunch/Axios) |
| Manejo de riesgo como GTM | Scoring crediticio + analítica de comportamiento; si falta un integrante, la empresa financia el lugar vacío (<8 % de los slots activos) → permite armar grupos **entre desconocidos** (casi todas las transacciones son entre extraños) | oct-2025 / 2022 | T2 |
| Pricing | Fee por turno temprano (quien cobra primero paga más; quien cobra último puede recibir bonificación). Porcentajes exactos: **DATA GAP** | — | — |
| Cómo consiguieron los 328 partners | **DATA GAP**. No hay fuente pública sobre equipo de ventas vs. autoservicio. Lo que sí se sabe: los acuerdos son "con empresas e instituciones" (probablemente empleadores + comercios), no un marketplace abierto | — | — |
| Publicidad paga | **DATA GAP** (Meta Ad Library requiere sesión; no se pudo consultar) | — | — |

**Lectura:** Money Fellows creció 3 años casi solo con referidos de confianza + canal físico, y recién después sumó B2B2C (empleadores, comercios, banco). El descuento en comercio es una **capa de monetización y retención**, no el canal de adquisición inicial. El referido se paga en **descuento sobre la cuota**, no en efectivo: costo bajo y amarrado a que el invitado efectivamente ahorre.

### 1.2 Esusu (EE.UU.) — pivote de B2C a B2B puro

| Dimensión | Hallazgo | Fecha | Tier |
|---|---|---|---|
| Origen | App B2C de ROSCA (susu) para inmigrantes, minorías y estudiantes; reportaba cada aporte como pago de préstamo a los burós. "Unos pocos miles" de inscriptos al año del lanzamiento | 2018-2019 | T2 (Black Enterprise, NYU Stern) |
| Canal temprano | Comunidad de inmigrantes + alianzas con universidades (NYU) para educación financiera | 2018-19 | T2 |
| Pivote | Abandonó la ROSCA como producto central: **vende a propietarios** (landlords) reporte de alquiler a burós | 2020+ | T2 |
| Motion de ventas | Ventas enterprise a grandes propietarios institucionales: dice trabajar con **65 % de los mayores propietarios** de EE.UU. (Blackstone, Invitation Homes, Related, etc.). +5 M unidades, 12 M personas | 2024-2026 | T1/T2 (comunicados, HousingWire) |
| Distribución B2B2C | API embebible para bancos/fintech/cooperativas de crédito; Zillow (mar-2026), Affirm (pago de alquiler en 2 cuotas), Pentadata | 2025-26 | T2 |
| Valuación | Series B US$ 130 M (ene-2022, US$ 1.000 M); Series C US$ 50 M a US$ 1.200 M | 2022 / s/f | T2 |

**Lectura:** la ROSCA B2C en EE.UU. **no escaló** con referidos; el negocio apareció cuando encontraron a **un pagador institucional** (el landlord) que gana algo concreto (menos mora). Paralelo para nosotros: el comercio asociado es nuestro "landlord".

### 1.3 Tanda (México) — mercado fragmentado, nadie ganó

No existe un "Tanda" dominante en México con datos públicos. Lo que hay:

| Jugador | GTM observable | Fecha | Tier |
|---|---|---|---|
| **Tanda+ (Tanda Más)**, Oaxaca | Freemium: 1 tanda gratis, unirse hasta 5 con código de invitación; **$39 MXN por tanda adicional**; cobro por tarjeta u **OXXO en efectivo**. Invitación: el organizador comparte un código por WhatsApp. "Tanda+ Tienda" (próximamente): compras a plazos 3-12 meses, compras grupales, "sin buró". Redes: Instagram, Facebook, TikTok. Score de confianza + gamificación con cartas de Lotería Mexicana. Usuarios: **DATA GAP** | 2026 | T1 (tandamas.mx) |
| **Mi Tandita** | Solo herramienta de organización, no toca el dinero | 2026 | T1 |
| **Tandapp (BBVA)** | App de banco para organizar tandas; plan de microcréditos ligados al ahorro | s/f | T2 (BBVA) |
| **Transfer** (Banamex/Inbursa/Telcel) | Planeaba tandas sobre base de 5 M clientes | s/f | T2 (El Financiero) |
| **Bloinx** | Tanda en blockchain, ganó Entrepreneurship World Cup MX 2020; sin tracción pública | 2020 | T2 |

Contexto de mercado: ~20 % de los mexicanos que ahorran usan tandas (Milenio, T2); CONDUSEF **recomienda no participar** en tandas por riesgo de estafa (T1 vía resumen). Esto convierte la "confianza" en el mensaje GTM central.

**Lectura:** Tanda+ es el análogo más parecido a La Vaquita 2.0 (tanda + tienda + invitación por WhatsApp + pago en efectivo), y muestra que la monetización freemium por tanda adicional es viable para un equipo chico. Ninguno tiene escala demostrada.

### 1.4 Sommos / PasanaQ (Bolivia) — B2B white-label a bancos

| Dimensión | Hallazgo | Fecha | Tier |
|---|---|---|---|
| Modelo | White-label: vende el software a bancos, IFs, retailers de crédito; el usuario final ahorra (solo o en grupo) dentro de su banco y ese historial alimenta el scoring | feb-2025 | T2 (LatamList) |
| Motion | Ventas institucionales remotas; adopción con focus groups, entrevistas y visitas de campo; adapta el producto a cada cultura local | feb-2025 | T2 |
| Mercados | Bolivia, Perú, Colombia; meta 5 países | feb-2025 | T2 |
| Equipo / funding | 18 personas; pre-seed ~US$ 180-230 K (cifras en conflicto); levantando seed | 2025 | T2/T3 |
| Reconocimiento | Premio Hábitat para la Humanidad (innovación financiera, vivienda) | s/f | T3 (LinkedIn) |
| Clientes nombrados, usuarios, pricing | **DATA GAP** | — | — |

**Lectura:** Sommos esquivó la adquisición B2C vendiendo a quien ya tiene los clientes. Es la prueba de que en el Altiplano (Bolivia ↔ Jujuy, misma cultura de pasanaku) hay un canal institucional. Pero ciclo de venta largo y requiere confianza regulatoria.

### 1.5 ROSCA onchain en Celo (Ronda, ChamaVault, Circlepot y similares)

| Proyecto | GTM / distribución | Estado | Tier |
|---|---|---|---|
| **Ronda** | Farcaster mini-app en Celo; aportes semanales; verificación opcional con Self (edad, nacionalidad, género). 3er puesto "Best MiniApp on Celo" y "Best Self integration" en ETHGlobal Buenos Aires | Hackathon; usuarios **DATA GAP** | T1 (ethglobal.com) |
| **ChamaVault** | Chama/susu/tontine en MiniPay, cUSD, "Trust Score" onchain; ingreso planeado por yield | Autodeclarado; mainnet y usuarios **DATA GAP** | T3 (KarmaHQ) |
| **Circlepot** | Celo, cUSD (cKES, cNGN, etc. planeados), wallets Thirdweb, gas patrocinado, garantía colateral, score de reputación | Autodeclarado; **DATA GAP** de tracción | T3 (KarmaHQ) |
| CeloSusu, ChamaPay, SusuFlow AI, ChamaAgent (ERC-8004, solo Sepolia) | Mismo patrón: hackathon/grant, distribución vía MiniPay o Farcaster | Prototipos | T3 |

Canal común: **ecosistema cripto** (Farcaster, MiniPay con +10 M wallets activadas, grants de Celo). Ninguno publica usuarios reales. Todos apuntan a África (cUSD, cKES). **Nadie apunta a Argentina/wARS ni a comunidades no-cripto vía Telegram/WhatsApp.**

**Lectura:** el espacio onchain está saturado de prototipos y vacío de distribución. El diferencial no es "ROSCA en Celo" (hay 8+), es **quién trae a los usuarios**.

### 1.6 Referencias de comercio

#### Hotmart (afiliados de productos digitales, LatAm)
- Comisión de afiliado **definida por cada productor, hasta 80 %** del valor neto; el productor paga solo por venta efectiva, sin costo fijo. (T1, hotmart.com/es/afiliados)
- Fee de plataforma ~9,9 % + US$ 0,50 por venta (T3, bit4learn). Retiro mínimo US$ 50 y pago en 2 días hábiles desde 2025 (T3, no verificado en fuente oficial).
- Escala: 26-30 M usuarios, +580.000 infoproductos, 188 países (T2/T3, cifras de distinto momento).
- **Lección:** el bien digital tiene margen para pagar comisiones altas (30-80 %). Es el primer vertical de comercio asociado más fácil: cursos, plantillas, suscripciones. Los productores ya están acostumbrados a pagar por venta → **outbound casi autoservicio**.

#### Pinduoduo (compra en equipo vía WeChat)
- **Mecánica:** cada producto tiene dos precios (individual y en equipo). El usuario abre un equipo o se une a uno abierto y lo comparte; el equipo tiene **24 h para completarse**, después se confirma y despacha en 48 h. El tamaño mínimo bajó con el tiempo a **2 personas** (al principio 10+). (T2, YC/Anu Hariharan, 2020)
- Otras palancas: "kan jia" (los amigos ayudan a bajar el precio, hasta gratis en 24 h), sobre rojo que se reclama compartiendo en un grupo, ruleta por compartir, lotería de 0,01 RMB que exige invitar, huerto virtual (Duo Duo Orchard, 2018) donde se riega con compras/invitaciones y llega una caja de fruta real, check-in diario. (T3, Inside Startups)
- **CAC:** 2017 ~RMB 11 (US$ 1,64) vs. RMB 310 Taobao/Tmall y RMB 225 JD (T3, SmartBrief); otra fuente da RMB 24 (T3, EqualOcean). 2018: gasto en adquisición RMB 7.700 M, +677 % i.a. (T2, Caixin). S&M en F-1: RMB 169 M (2016) → RMB 1.344,6 M (2017) (T1, SEC). Conclusión: CAC 10-20x menor que incumbentes **mientras** dependía de viralidad; luego subió con paid.
- **Qué depende de WeChat:** mini-program (tienda dentro del chat), WeChat Pay sin salir de la app, Moments y grupos como superficie. **Qué NO depende:** el doble precio, la ventana de 24 h, el tamaño mínimo de equipo, la gamificación y los check-ins.
- **Replicable en LatAm:** Telegram tiene **Mini Apps + bot + pagos** dentro del chat (lo más parecido a un mini-program). WhatsApp solo permite link compartido + catálogo, sin pagos integrados en AR. Por eso **Telegram es el canal técnicamente más cercano a WeChat**; WhatsApp es donde está la gente. Precedente de viralidad en Telegram: Hamster Kombat reportó 200 M usuarios en 3 meses (2024, autodeclarado, T2 Cointelegraph), con referidos como motor y fatiga posterior ("sigue pidiendo más amigos", Decrypt).

#### Muni (Colombia/México/Brasil) y Favo (Perú/Brasil) — líderes de barrio
| | Muni | Favo |
|---|---|---|
| Modelo | Líderes comunitarios revenden supermercado por catálogo + link de WhatsApp; centralizan pedidos, hacen la última milla y cobran en efectivo | Emprendedores con tienda online sin inversión inicial; inspirado en modelos chinos |
| Pago al líder | "Comisión por cada venta + bonos por volumen" (T3, ABC Economía); **porcentaje: DATA GAP** | **Hasta 15 % de comisión** sobre ventas (T2, Contxto) |
| Escala | +15.000 líderes, +40.000 clientes, líderes +20 % mensual (T2, TechCrunch mar-2022) | +170.000 clientes en Brasil (T2) |
| Estructura | ~500 empleados (mitad en depósitos), US$ 27 M levantados | 170 despidos en Brasil |
| Cierre | Nov-2022: no logró cerrar Series B (T2, Forbes Colombia) | Brasil jun-2022; Perú 29-feb-2024 (T2, Bloomberg Línea, Contxto) |
| Causa | Capital: la logística de supermercado (depósitos, picking, márgenes finos de alimentos) quemaba caja; invierno de VC | Tasas altas, caja, competencia de Rappi/PedidosYa |

**Por qué se cayó el canal:** el canal de líderes **funcionó para adquirir** (15.000 líderes, crecimiento orgánico). Lo que mató a ambos fue el **costo operativo físico** (inventario, depósitos, entrega de bienes de bajo margen) financiado con VC que dejó de llegar. Caso similar: Meesho (India) abandonó a sus revendedores en 2021-22 para ir directo al consumidor con plata de SoftBank, y los revendedores perdieron clientes porque el precio directo era menor (T2/T3, The Captable, Entrackr). **Riesgo para nosotros:** si el líder/organizador cobra comisión y después la plataforma lo saltea, se rompe la confianza.

---

## 2. Mapa de oportunidad de canales

CAC estimado = estimación propia, orden de magnitud, a validar en el piloto (no es dato de fuente). Supuestos: organizador trae un grupo de 6-10 personas; Argentina 2026.

| Canal | Saturación | Nuestra oportunidad | CAC estimado (por usuario activo) |
|---|---|---|---|
| **SEO / contenido** | Media. "Junta/tanda/vaquita" en español tiene contenido de bancos (BBVA), medios y CONDUSEF advirtiendo riesgos; nadie con foco Argentina/NOA ni contenido en Rioplatense | Contenido de "cómo armar una junta sin que nadie se borre", calculadoras de pozo, plantillas. Lento (meses) para el horizonte del piloto | Bajo en $ pero alto en tiempo: ~US$ 0-2 a 6-12 meses; ~0 aporte en el piloto |
| **Paid (Meta/TikTok)** | Alta en fintech AR (billeteras, bancos digitales pujan las mismas audiencias) | Mínima con presupuesto cero. Solo útil como test chico de mensaje (US$ 50-100) | Alto: probablemente US$ 5-20 por registro, más por usuario que completa un turno (**DATA GAP** de benchmarks AR) |
| **Comunidad / social** (grupos de interés, Telegram, WhatsApp, Instagram local) | Baja para ROSCA en AR; los grupos ya existen pero sin herramienta | **Alta.** El organizador de una junta ya existente es el canal: ya tiene confianza. Comunidades por interés (gamers, estudiantes de cursos, clubes) en Jujuy | Muy bajo: tiempo del equipo; ~US$ 0-1 |
| **Outbound a comercios** (bienes digitales/servicios) | Baja. Productores de Hotmart, academias, SaaS locales, gimnasios ya pagan comisión a afiliados | **Alta y barata:** pitch "te traemos un grupo que ya juntó la plata; pagás comisión solo si compra". Autoservicio tipo afiliado (link + código) es replicable | Costo por partner: horas de fundador; sin vendedor → 10-20 partners en el piloto es realista (estimación) |
| **Alianzas B2B2C** (mutuales, cooperativas, academias, empleadores) | Baja en AR para ROSCA; Sommos y Money Fellows (328 acuerdos) muestran que funciona | **Media-alta** a mediano plazo: una mutual o academia en Jujuy trae decenas de grupos de golpe. Ciclo de venta lento y exige confianza (wARS/cripto es fricción) | Bajo por usuario (US$ 0,5-3), alto en tiempo de cierre (semanas-meses) |
| **PLG / viralidad del grupo** | Baja: los ROSCA onchain no tienen distribución; Tanda+ invita por código pero sin recompensa | **La mejor.** El producto es viral por diseño: un organizador = 6-10 usuarios. Sumar: (a) referido pagado en descuento sobre cuota/compra (modelo Money Fellows), (b) "abrí una vaquita para este producto, se completa en 24-72 h" (modelo Pinduoduo), (c) el agente en Telegram invita y recuerda | El más bajo: costo = descuento del referido, financiable con la comisión del comercio |

Notas: el número de usuarios de MiniPay (+10 M wallets) **no** es un canal para nosotros: es África/USDT, no Argentina/wARS.

---

## 3. Conclusión clave

**Qué funciona (evidencia):**
1. **El referido de confianza es el canal #1 de las ROSCA que escalaron.** Money Fellows llegó a millones "sin gastar en marketing" (2019) y recompensa en **descuento sobre la cuota, condicionado a que el invitado entre a un círculo**.
2. **El dinero aparece cuando hay un tercero que paga.** Esusu (landlord), Sommos (banco), Money Fellows (comercio + empleador). El usuario final no paga o paga poco.
3. **Pinduoduo prueba que "comprar juntos" baja el CAC 10-20x** mientras el mecanismo es social: precio de equipo, ventana corta, equipo mínimo chico.
4. **Los líderes comunitarios adquieren bien** (Muni: 15.000 líderes) pero el canal muere si el negocio tiene costos físicos que no cierran o si la plataforma los saltea.

**Canales subexplotados:**
- **Viralidad de grupo en Telegram con un agente**: nadie en ROSCA lo hace; Telegram es lo más cercano a WeChat (mini app + bot + pagos en el chat).
- **Outbound a vendedores de bienes digitales** (productores tipo Hotmart, academias, cursos): ya pagan 30-80 % a afiliados; un pozo que ya está juntado es un lead muy calificado.
- **Mutuales y academias en Jujuy/NOA**: B2B2C que Sommos validó en el Altiplano; nadie lo hace en Argentina.

**Dónde ganar con presupuesto mínimo (recomendación):**
1. **Organizador = canal.** Reclutar 10-20 organizadores de juntas que ya existen en Jujuy (comunidades por interés). Darles la herramienta gratis y un beneficio por turno completado (no comisión en efectivo al inicio, para no repetir la dependencia de Muni/Favo).
2. **"Vaquita por producto" estilo Pinduoduo:** el comercio publica un producto con precio de grupo; el agente arma la vaquita y la comparte; ventana de completado (p. ej. 72 h). El descuento lo paga el comercio con la comisión.
3. **Comercios como afiliados autoservicio:** link + código + comisión solo por venta efectiva. Empezar con bienes digitales (sin logística: evita el error de Muni/Favo).
4. **Referido en descuento**, nunca en efectivo, y solo cuando el invitado paga su primera cuota (modelo Money Fellows, controla fraude y "farmeo" tipo Hamster Kombat).
5. **No pagar ads** hasta medir K-factor real en el piloto.

---

## 4. Data gaps

- **Money Fellows:** porcentaje de comisión de embajadores; fee exacto por turno; cómo cerraron los 328 acuerdos (equipo de ventas vs. autoservicio); tamaño medio de grupo real (el ejemplo de 10 es ilustrativo); % de círculos completados y tasa de mora (solo hay "<8 % de slots necesitan inyección"); CAC; K-factor; anuncios en Meta Ad Library (requiere sesión, no consultado).
- **Esusu:** retención y completado de la etapa B2C; ingresos; por qué exactamente abandonaron la ROSCA.
- **Tanda (México):** no se identificó una empresa "Tanda" mexicana con tracción pública; Tanda+ no publica usuarios ni fundadores.
- **Sommos:** clientes bancarios nombrados, usuarios activos, pricing de la licencia.
- **Ronda, ChamaVault, Circlepot:** usuarios, estado en mainnet, retención. Todo lo publicado es autodeclarado.
- **Muni:** porcentaje de comisión de líderes; unit economics; retención de líderes.
- **Favo:** cantidad de líderes; retención.
- **Pinduoduo:** CAC por usuario oficial (las cifras de RMB 11/24 son de terceros y se contradicen); tasa de completado de equipos.
- **Hotmart:** cantidad de afiliados activos; comisión media real (solo rango 1-80 %).
- **Benchmarks generales:** no hay estudio público con % de completado ni tamaño medio de grupo en apps de ROSCA. Literatura académica: 10 % de 60 ROSCA taiwanesas tuvieron problemas de pago (Bauchet & Larsen 2018, T2), no comparable con apps.
- **Argentina:** CAC de fintech en Meta para AR; cantidad de mutuales activas en Jujuy (INAES tiene buscador; cooperativas a nivel país: 17.225 a mar-2025, T2 Observatorio UNL).

---

## 5. Fuentes

**Money Fellows**
- [T2] Launch Base Africa, 2025-10-21: https://launchbaseafrica.com/2025/10/21/how-money-fellows-hit-profitability-by-digitising-egypts-informal-gameya-and-processing-1-5b
- [T2] MEA TechWatch, 2025-10-21: https://meatechwatch.com/2025/10/21/egypts-money-fellows-surpasses-1-5-billion-in-transactions-achieves-profitability/
- [T2] Arab Finance, 2025-10: https://arabfinance.com/en/news/newdetails/Money-Fellows-reaches-1-5B-in-total-transaction-value
- [T2] Mubasher, 2025-10: https://english.mubasher.info/news/4511596/Money-Fellows-logs-1-5bn-transactions/
- [T2] TechCrunch, 2022-10-31: https://techcrunch.com/2022/10/31/money-fellows-an-egyptian-fintech-digitizing-money-circles-raises-31m-funding
- [T2] Wamda, 2019-05: https://www.wamda.com/en/2019/05/conversation-ahmed-wadi-moneyfellows
- [T2] Seamless North Africa 2024: https://seamlessxtra.com/interview-with-ahmed-wadi-founder-ceo-of-money-fellows-at-seamless-north-africa-2024/
- [T2] Egyptian Streets, 2022-10-31: https://egyptianstreets.com/2022/10/31/egyptian-money-pooling-startup-money-fellows-raises-31-million-in-funding/
- [T1] Referidos: https://moneyfellows.com/en-us/blog-home/earn-with-money-fellows-your-guide-to-the-referral-system/
- [T1] Referidos: https://moneyfellows.com/en-us/blog-home/invite-earn-money-fellows-referral-program/
- [T1] Embajadores: https://moneyfellows.com/en-us/ambassadors-page/ (vía snippet; 404 al fetch el 2026-10-24)

**Esusu**
- [T2] HousingWire, Series C: https://www.housingwire.com/articles/esusu-raises-50m-series-c/
- [T2] Pulse 2.0: https://pulse2.com/esusu-50-million-series-c-at-1-2-billion-valuation/
- [T2] Inman, 2022-01-31: https://inman.com/2022/01/31/black-owned-fintech-startup-esusu-hits-1b-unicorn-valuation
- [T1] Esusu × Progress Residential: https://esusurent.com/blog/esusu-and-progress-residential-partner-to-bring-rent-reporting-to-single-family-rental-housing
- [T2] Black Enterprise, 2018-05-15: https://blackenterprise.com/esusu-app-digital-savings/
- [T2] NYU Stern: https://www.stern.nyu.edu/sternbusiness-magazine/man-mission-samir-goel.md

**Tanda (México)**
- [T1] Tanda+: https://www.tandamas.mx/
- [T1] Mi Tandita: https://www.mi-tandita.com/
- [T2] BBVA, mitos de las tandas: https://www.bbva.com/es/mx/salud-financiera/mitos-y-realidades-de-las-tandas-de-ahorro-son-tan-buenas/
- [T2] El Financiero, Transfer: https://www.elfinanciero.com.mx/economia/transfer-ofrecera-tandas-online/
- [T2] Expansión, 2018-01-19: https://expansion.mx/tecnologia/2018/01/19/yahoo-replicara-las-tandas-en-una-app-llamada-tanda
- [T2] Milenio: https://www.milenio.com/sociedad/tandas-la-forma-de-ahorrar-que-trasciende-generaciones

**Sommos / PasanaQ**
- [T2] LatamList, 2025-02-11: https://latamlist.com/?p=16314
- [T3] CB Insights: https://www.cbinsights.com/company/pasanaq
- [T3] Descubre.vc: https://www.descubre.vc/e/pasana-q

**ROSCA onchain (Celo)**
- [T1] Ronda, ETHGlobal: https://ethglobal.com/showcase/ronda-7ck82
- [T3] ChamaVault: https://www.karmahq.xyz/project/chama-vault/about
- [T3] Circlepot: https://www.karmahq.xyz/project/circlepot/about
- [T3] CeloSusu: https://www.karmahq.xyz/project/celosusu/about
- [T3] SusuFlow AI: https://www.karmahq.xyz/project/susuflow-ai/about
- [T1] Celo blog, MiniPay 2 años: https://blog.celo.org/celebrating-two-years-of-minipay-operas-noncustodial-stablecoin-wallet-built-on-celo-6ca80ff5c39a

**Hotmart**
- [T1] https://hotmart.com/es/afiliados
- [T3] https://bit4learn.com/hotmart/
- [T2] Enter.co, 26 M usuarios: https://www.enter.co/empresas/hotmart-llego-a-26-millones-de-usuarios

**Pinduoduo / social commerce**
- [T2] YC, Anu Hariharan, 2020-05-06: https://ycombinator.com/library/2z-pinduoduo-and-the-rise-of-social-e-commerce
- [T3] Inside Startups: https://insidestartups.substack.com/p/from-0-725-million-users-growth-levers
- [T1] Pinduoduo F-1/A (SEC), 2018: https://www.sec.gov/Archives/edgar/data/0001737806/000104746918005119/a2236253zf-1a.htm
- [T2] Caixin, 2019-05-15: https://www.caixinglobal.com/2019-05-15/chart-of-the-day-the-bulk-e-retailer-nipping-at-alibabas-heels-101416068.html
- [T3] SmartBrief (CAC 2017): https://www.smartbrief.com/?p=40745
- [T3] EqualOcean: https://equalocean.com/analysis/201901221334-solution-satisfy-once-ignored-demand-pinduoduo-its-different-user-image
- [T2] Modern Retail, 2021-05-11: https://www.modernretail.co/platforms/how-pinduoduo-is-competing-with-alibaba-by-building-commerce-communities/
- [T2] The Captable, Meesho, 2021-10: https://the-captable.com/2021/10/meeshos-festive-season-flipkart
- [T3] Entrackr, revendedores Meesho: https://entrackr.com/?p=128922
- [T2] TechCrunch, Meesho 2018-06-06: https://techcrunch.com/2018/06/06/social-selling-startup-meesho-lands-11-5m-series-b-led-by-sequoia-india/
- [T2] Cointelegraph, Hamster Kombat: https://cointelegraph.com/news/hamster-kombat-guinness-world-record-200m-users
- [T2] Decrypt, fatiga de referidos: https://decrypt.co/237629/hamster-kombat-keeps-demanding-more-friends-enough-already

**Muni / Favo**
- [T2] TechCrunch, 2022-03-22: https://techcrunch.com/2022/03/22/muni-gives-latin-american-communities-buying-power-through-shopping-app/
- [T2] Forbes Colombia, 2022-11-24: https://forbes.co/2022/11/24/emprendedores/se-apaga-muni-una-startup-colombiana-que-le-apostaba-al-supermercado-comunitario
- [T2] Forbes Colombia, 2022-06-01: https://forbes.co/2022/06/01/emprendedores/muni-tiene-us20-millones-frescos-para-su-supermercado-comunitario-para-la-base-de-la-piramide/
- [T3] ABC Economía (comisión + bonos): https://abceconomia.co/?p=29609
- [T2] Bloomberg Línea, Favo sale de Brasil, 2022-06: https://www.bloomberglinea.com/english/perus-favo-pulls-out-of-brazil-sheds-170-employees
- [T2] Contxto, cierre de Favo, 2024-02: https://www.contxto.com/en/peru/peruvian-online-supermarket-favo-shuts-down-after-five-years
- [T2] TechCrunch, Favo × Tiger Global, 2021-10-06: https://techcrunch.com/2021/10/06/tiger-global-backs-favo-which-is-building-an-easier-way-for-latin-americans-to-order-groceries-online

**Contexto / académico**
- [T2] Bauchet & Larsen 2018 (IDEAS/RePEc): https://ideas.repec.org/a/taf/jdevst/v54y2018i9p1483-1495.html
- [T2] Observatorio de Economía Social UNL, may-2025: https://www.fcjs.unl.edu.ar/observatorioes/wp-content/uploads/sites/55/2025/05/Boletín-Mayo-2025.pdf
