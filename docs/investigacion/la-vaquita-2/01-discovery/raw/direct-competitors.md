# B1 · Competidores directos: perfiles en profundidad

> **Fecha de la investigación:** 2026-10-24 · **Agente:** B1 (Direct Competitor Deep-Dives) · **Ola:** 2
> **Alcance:** apps de juntas/tandas/ROSCA digitales, ROSCA + comercio, ROSCA onchain en Celo y sustitutos directos en Argentina.
> **Escala de fuentes:** **T1** = fuente primaria (la empresa, el regulador, el registro onchain, la tienda de apps). **T2** = prensa especializada o medio reconocido (TechCrunch, Arab Finance, LatamList, Finsiders, TodoJujuy). **T3** = agregadores, directorios y perfiles de terceros (CB Insights, Dealroom, KarmaHQ, PitchBook, sitios de reseñas de apps).
> **⚠ >18 meses** = dato anterior a abril de 2025.
> **Limitación:** el presupuesto de búsquedas web de la sesión se agotó a mitad de la ronda 6. Faltó verificar las fichas de Google Play (rating y descargas) de casi todos, buscar apps argentinas de "juntas" directamente en Play Store y revisar el estado actual de Pasanaku/Bolivia. Todo eso figura en **Data gaps**.

---

## 0. Resumen ejecutivo (para apurados)

- **El único competidor directo de escala es Money Fellows (Egipto).** Tiene más de 8 M de registrados, unos 350k MAU, US$ 1.500 M transaccionados, más de US$ 60 M levantados y es rentable. Es el único que combina ROSCA, comercios (328 acuerdos B2B2C) y tarjeta. Está lejos de LatAm: su expansión anunciada es a Marruecos y, quizás, a Arabia Saudita.
- **En LatAm no hay un Money Fellows.** Lo más cercano es **Sommos** (ex PasanaQ, Bolivia), que pivoteó a **B2B white-label para bancos**: dice tener más de 100k usuarios mediante 10 bancos de Bolivia, Perú y México. No tiene app propia de consumo ni comercios. Los intentos de consumo en México (Yahoo Tanda, Ahorro Libre, Zaveapp) **murieron o se apagaron** entre 2017 y 2018.
- **En Celo el espacio está lleno de hackathon-ware.** Ronda, AjoAI, ChamaAgent, Circlepot, ChamaVault y Celo-Save: todos en cUSD, ninguno con wARS, comercios ni tracción verificable. **AjoAI y ChamaAgent ya son "ROSCA + agente IA + ERC-8004" en Celo mainnet**, así que el "agente que coordina" **no alcanza como diferencial**.
- **El sustituto argentino más peligroso no es una ROSCA:** es la **Cuenta Compartida de Naranja X** (ago-2026, grupos de hasta 10, "Frascos" con metas y rendimiento diario, casi 10 M de clientes). Resuelve "ahorrar en grupo hacia una meta" sin turnos, sin riesgo de contraparte y desde una marca muy fuerte en el NOA (Jujuy incluido).
- **Hueco claro:** nadie combina **ROSCA + compra con descuento en comercio asociado + entrega escalonada + pesos digitales + comunidad por interés** en LatAm. El modelo de Money Fellows (cobrar por turnos tempranos y vender productos de comercios dentro de la app) demuestra que monetizar por el lado del comercio es viable, pero en Egipto la mayor parte del ingreso sigue saliendo del usuario.

---

## 1. Perfiles

### 1.1 Money Fellows (Egipto) · Amenaza: **MEDIA** (alta como modelo a copiar, baja como rival en AR hoy)

| Campo | Dato | Fuente |
|---|---|---|
| Web | moneyfellows.com | T1 |
| Año / sede | Fundada en 2016 (lanzamiento app ~2016-2017), El Cairo | T3 CB Insights (sin verificar en detalle) |
| Equipo | CEO y cofundador **Ahmed Wadi** | T2 TechCrunch, may-2025 |
| Funding | **US$ 13 M pre-Serie C** (may-2025; lideran Al Mada Ventures y DPI Nclude, con Partech Africa y CommerzVentures). **Más de US$ 60 M en total.** Serie B de US$ 31 M (oct-2022 ⚠ >18 meses) | T2 TechCrunch 2025-05-04; T2 TechCrunch 2022 |
| Etapa | Growth, **rentable** ("We have managed to crack this model and reach profitability", Wadi) | T2 TechCrunch 2025-05; T2 Arab Finance 2025-10-22 |
| Regulación | Sandbox fintech del Banco Central de Egipto; banco socio principal **Banque Misr** | T2 Arab Finance 2025-10-22 |

**Producto.** Gam'eya (ROSCA) digital: el usuario elige un círculo (6, 10 o 12 meses) y un **turno de cobro**. Además ofrece tarjeta prepaga (lanzada en 2025, con más de 50k emitidas), pago con tarjeta bancaria o e-wallet, más de 40 puntos de distribución físicos y una alianza con **Sympl (BNPL)** para comprar en cuotas en sus comercios. Tiene planeados inversiones, nómina, seguros y remesas. (T2 Arab Finance 2025-10; T2 TechCrunch 2025-05; T2 EgyptInnovate, sin fecha.)

**Pricing (quién paga: el usuario, sobre todo el de turno temprano).**
- Su propio blog: comisión de administración **de hasta 16% en los turnos tempranos, que baja hasta 0% en los turnos finales**, y "14 turnos sin comisión" (T1 blog, capturado en 2026, sin fecha visible).
- 2022: "comisión única de ~6%" para turnos tempranos (T2 TechCrunch 2022 ⚠ >18 meses).
- Ola 1: ~5% en el primer turno.
- La nota de prensa de oct-2025 habla de "**zero service fees**" bajo el sandbox (T2 Arab Finance). **Contradicción sin resolver:** probablemente se refiere a círculos o promos puntuales. Hay promos agresivas: 75% off en las 3 primeras cuotas, 50% off en admin fees en Black Friday (T1 blog).
- **Comercio:** según TechCrunch 2022, vende productos de comercios egipcios dentro de la app y **gana con el markup** sobre esos productos (⚠ >18 meses). El porcentaje de comisión al comercio es **DATA GAP**.

**Impago (el punto clave).**
1. **Pagaré y contrato legal** por la parte de cada usuario, con riesgo de acción legal si no paga (T2 EgyptInnovate, perfil antiguo ⚠).
2. **Scoring y matching** con "datos de comportamiento, credit scores y nivel de ingreso", y **límite de crédito** asignado por turno: los turnos tempranos son más difíciles para usuarios nuevos (T2 TechCrunch 2025; T1 blog; T3 500 Global).
3. **La empresa financia el hueco:** "Instead of canceling the group, we finance one slot." Los turnos sin cubrir son menos del 10% y el 7-8% de los turnos activos requiere capital de trabajo propio. Por eso negocian líneas con bancos (T2 TechCrunch 2025-05).
4. Recargos por mora en el contrato (T3 500 Global).

**Posicionamiento (tagline literal).** "Money Fellows: Online Circles" (nombre en las tiendas, T1). El blog habla de "guaranteed online Money Circles" (T1).

**Tracción.**
- **Más de 8 M de registrados** y ~350k MAU, es decir, ~4% activo. Más de 2 M de círculos completados, US$ 1.500 M transaccionados y 328 acuerdos B2B2C (T2 Arab Finance 2025-10-22).
- TechCrunch may-2025: más de 8,5 M de usuarios. El pago promedio por usuario subió de EGP 23.000 a EGP 45.000 (~US$ 906).
- Reseñas: un agregador informa **3,5/5 con ~37k reseñas** en Android (T3 marlvel.ai, sin verificar en Play). iOS: 4,0 con 29 reseñas (T3, 2021 ⚠). Trustpilot: 3,2, con una sola reseña en 12 meses (1★, may-2026, tarjeta bloqueada con ~EGP 2.000) (T3 Trustpilot).

**Fortalezas.** Escala, rentabilidad, regulación (sandbox + banco), un motor de riesgo propio que cubre turnos y la red B2B2C. Demuestra que la ROSCA digital con comercio funciona como negocio.

**Debilidades.** Quejas por **comisiones altas**, errores de débito automático que generan sobregiros, crashes en Android y soporte lento con la tarjeta (T3 agregador; T3 Trustpilot). El MAU es bajo frente a los registrados. El modelo **requiere balance propio** para cubrir impagos: es intensivo en capital y depende de la licencia.

**Por qué MEDIA.** No está en LatAm ni anunció entrar. Pero es el benchmark que cualquier inversor va a usar ("¿por qué no Money Fellows en Argentina?") y podría licenciar o replicar su modelo.

---

### 1.2 Sommos (ex PasanaQ, Bolivia) · Amenaza: **MEDIA**

| Campo | Dato | Fuente |
|---|---|---|
| Web | DATA GAP (no verificada) | — |
| Año / sede | 2020 o 2021 según la fuente (otra dice "establecida 2023" tras el rebrand); Santa Cruz de la Sierra (CB Insights también dice La Paz: inconsistente) | T3 CB Insights; T2 LatamList 2025-02-11; T3 One Young World 2026-06 |
| Equipo | **Diego Rojas**, fundador y CEO | T2 eju.tv; T3 CB Insights |
| Funding | Pre-seed de **~US$ 180k** (ago-2022 ⚠ >18 meses; fondos de EE.UU. y ángeles LatAm). Krealo/Seedstars. **Levantando Seed** (feb-2025, monto no informado) | T2 LatamFintech 2022; T2 LatamList 2025-02 |
| Etapa | Early / seed | — |

**Producto.** Empezó como app de consumo para digitalizar el **pasanaku** boliviano: registra grupos y arma un perfil crediticio alternativo según la conducta de ahorro. **Pivoteó a "white-label platform"**: vende software a bancos, IFIs y empresas, que se lo ofrecen a sus clientes. Algunas herramientas corren **sobre WhatsApp** (T2 LatamList 2025-02; T3 One Young World 2026-06).

**Pricing.** B2B SaaS a bancos (el banco paga). Las tarifas son **DATA GAP**.

**Impago.** No documentado. El enfoque es al revés que el nuestro: el ahorro grupal es **originación de crédito** para el banco. Dicen **más de US$ 200 M en crédito desembolsado** a través de sus plataformas (T3 One Young World 2026-06, autodeclarado, sin verificar).

**Tracción.** **Más de 100.000 usuarios** mediante **10 bancos y servicios financieros** de Bolivia, Perú y México (T3 One Young World, jun-2026). LatamList (feb-2025) menciona Bolivia, Perú y Colombia, con la meta de 5 países. Premio "Habitando el Futuro" de Habitat for Humanity (T3 LinkedIn). Sin ficha de consumo en las tiendas: **DATA GAP**.

**Fortalezas.** Conoce la ROSCA andina, tiene relación con bancos y una presencia regional real (Bolivia es vecina de Jujuy y comparte la cultura del pasanaku). Usa WhatsApp como canal.

**Debilidades.** Al ser B2B depende de los ciclos de venta bancarios y no tiene marca de consumo. No tiene comercios ni stablecoins. Su funding es chico.

**Por qué MEDIA.** Es el actor de LatAm que más se parece en el "qué" y está **a una frontera de Jujuy**. Si un banco del NOA lo contrata, aparece una junta digital con marca bancaria. No compite por el lado del comercio.

---

### 1.3 Bloom Money (Reino Unido) · Amenaza: **BAJA**

| Campo | Dato | Fuente |
|---|---|---|
| Web | DATA GAP (el dominio bloom-money.com no resolvió) | — |
| Año / sede | 2021, Londres | T3 1st Formations; T2 People of Color in Tech 2025-05-22 |
| Equipo | **Nina Mohanty**, fundadora | T2 POCIT |
| Funding | **~US$ 2 M seed** (may/jun-2025; Zinal Growth, January Ventures, PactVC, Octopus según T3). Otra fuente dice US$ 1,29 M en total (inconsistente). Campaña de crowdfunding en Crowdcube | T2 POCIT; T3 Seedtable; T3 VCBacked |
| Etapa | Seed |

**Producto.** "Bloom Circles": ROSCA digital (sou-sou, susu, tanda) para **inmigrantes y diásporas**. Los fondos los custodia AF Payments Ltd (EMI) y **no tienen cobertura FSCS**. Opera bajo supervisión de la FCA como distribuidor de una EMI. Ofrece recordatorios de pago y resolución de disputas. Planea perfiles crediticios para prestar para pensiones u oro (T2 POCIT; T3 Seedtable; T3 TechRound).

**Pricing / impago.** **DATA GAP** (no hallado).

**Tracción.** "Más de 13.000 clientes en el Reino Unido" (T3 blog de 1st Formations, baja confiabilidad). Startups 100 UK 2025 (T3).

**Fortalezas / debilidades.** Su foco en **comunidades de origen** (diáspora) es análogo a nuestras "comunidades por interés". Es chico y está fuera de LatAm.

**Por qué BAJA.** No compite geográficamente. Sirve de **referencia de segmentación por comunidad**.

---

### 1.4 Mycon (Brasil, consórcio 100% digital con chatbot IA) · Amenaza: **BAJA-MEDIA** (como visión LatAm)

| Campo | Dato | Fuente |
|---|---|---|
| Año / sede | Creada en 2017 por **Marcelo y Márcio Kogut** (inversión inicial de ~R$ 10 M); opera desde dic-2019; controlante **Grupo Coimex**; administradora Coimex Administradora de Consórcios | T2 Finsiders (2022, actualizado 2025-04-23) ⚠ cifras de 2022 |
| Funding | Founders + Coimex. Otras rondas: DATA GAP | T2 Finsiders |

**Producto.** Consórcio (el pariente regulado de la ROSCA en Brasil: grupo cerrado, adjudicación por sorteo o licitación) vendido **por un chatbot con IA llamado "Mycon"** en la web y la app, con humanos como respaldo. Tiene un marketplace de cuotas usadas ("MyCotas") sin comisión de intermediación.

**Pricing.** **Tasa fija total de 9,99%** para todos los plazos, "hasta 50% más barato" que la competencia. Paga el **usuario** (T2 Finsiders ⚠ 2022).

**Impago.** No documentado en la fuente. En el consórcio regulado, la administradora gestiona la mora y el bien queda en garantía (conocimiento general del sector, no verificado para Mycon).

**Tracción.** Más de 14.000 clientes, R$ 2.000 M en crédito vendido en 2021, meta de R$ 4.000 M en 2022 y R$ 50 M de presupuesto de marketing (T2 Finsiders ⚠ >18 meses).

**Por qué BAJA-MEDIA.** Demuestra que **"agente conversacional + ahorro grupal regulado para comprar un bien"** ya existe en LatAm y escala con dinero de un grupo logístico. No está en Argentina ni usa comercios con descuento.

---

### 1.5 Naranja X "Cuenta Compartida" (Argentina) · Amenaza: **ALTA** (sustituto directo en el piloto)

| Campo | Dato | Fuente |
|---|---|---|
| Empresa | Naranja X (Grupo Galicia / Naranja), Córdoba | T2 TodoJujuy 2026-08-13 |
| Lanzamiento | **13-ago-2026**, despliegue progresivo |
| Base | "**Casi 10 millones de clientes**" |

**Producto.** Cuenta grupal para **hasta 10 personas**, creada "en dos clics", con **CBU/alias propio** separado de las cuentas personales. Permite pagar servicios, recargas, QR y transferencias con el saldo común. El saldo tiene **rendimiento diario**. Los **"Frascos"** son subfondos para metas grupales o gastos fijos. Incluye un módulo de tareas para asignar pagos, y todos los movimientos son visibles para todos.

**Pricing.** No se menciona costo (**DATA GAP**; probablemente gratuita).

**Impago.** No aplica: no hay turnos ni adelanto, cada uno aporta lo que pone. **Ese es el punto:** elimina el riesgo de contraparte que define a la ROSCA.

**Tagline.** "devolverles tiempo, de eso se trata" (cita del ejecutivo en la nota). La nota la presenta como "la primera cuenta compartida del país".

**Por qué ALTA.** Para el caso "juntamos plata entre amigos para una meta", es gratis, rinde interés, la marca es conocida en Jujuy (la nota salió en TodoJujuy) y se usa en pesos. **No da el pozo adelantado** (el valor de la ROSCA para quien cobra temprano) **ni descuentos de comercio por compra colectiva**: ahí está nuestra defensa. Ualá y Mercado Pago no tienen un producto grupal equivalente según lo hallado (T2).

---

### 1.6 Ronda (Celo, Farcaster mini-app) · Amenaza: **BAJA**

- **Origen:** **ETHGlobal Buenos Aires** (nov-2025). Premios: **Celo "Best MiniApp on Celo" (3.º)** y **Self "Best Self onchain SDK integration" (3.º)** (T1 ETHGlobal showcase).
- **Equipo:** repo `github.com/builders-garden/ronda`. Integrantes: DATA GAP. Builders Garden sería un estudio web3 italiano (conocimiento previo, **no verificado**).
- **Producto:** depósitos **semanales** al protocolo; cada ciclo un miembro recibe el pozo. Verificación opcional con **Self** (edad, nacionalidad, género), contratos non-custodial, backend de agenda y notificaciones, y un **subdominio ENS por grupo**. Demo: ronda-peach.vercel.app.
- **Stablecoin / pricing / impago:** **no especificados** (T1 showcase).
- **Tracción:** DATA GAP (proyecto de hackathon).
- **Por qué BAJA:** es un prototipo. Lo relevante es que **nació en Buenos Aires y en Celo**, así que los jueces del ecosistema ya vieron una "ronda". Hay que diferenciarse explícitamente.

### 1.7 AjoAI (Celo, África) · Amenaza: **MEDIA** en el hackathon, **BAJA** en el mercado

- **Qué es:** "infraestructura onchain para ahorro grupal autónomo y reputación crediticia portable". Tiene CircleFactory de escrows non-custodial, un **ledger de reputación ERC-8004**, agent card ERC-8004 y endpoints **MCP y A2A** (T3 KarmaHQ, 2026).
- **Agente IA:** opera los círculos según la agenda: cobra aportes, rota pagos, estaciona fondos ociosos en yield y **aplica penalidades onchain por impago**, sin poder mover fondos arbitrarios.
- **Moneda:** stablecoins Mento.
- **Pricing:** ahorro **gratis**. Ingreso: 10-20% del yield sobre fondos ociosos (cuando salga el adaptador de Aave V3, todavía no disponible) y **micropagos x402** por endpoints premium (por ejemplo, que un prestamista lea el score).
- **Estado:** "Live on Celo mainnet" (autodeclarado). Sin equity, solo grants. Equipo no listado. Web: ajo-ai-tan.vercel.app, X @ajo_ai_.
- **Por qué MEDIA en el hackathon:** **ya ocupa el pitch "agente IA + ROSCA + ERC-8004 en Celo"**. No tiene wARS, comercios ni LatAm.

### 1.8 ChamaAgent (Celo) · Amenaza: **MEDIA** en el hackathon, **BAJA** en el mercado

- **Registro ERC-8004 #9146 en Celo mainnet**, registrado el **2026-05-24**. Owner y agent wallet `0x60347c5337480460b7e274a3c05ebe445ec0b0b9` (T1 explorer ERC-8004 de QuickNode). Los metadatos crudos apuntan a Celo Sepolia (#274), otro owner y una inconsistencia testnet/mainnet.
- **Producto:** ROSCA "trustless" en **cUSD**, miembros verificados con **Self Agent ID**, escrow por grupo y pago del pozo completo en **orden fijo**. "El agente no tiene custodia, solo dispara pasos del workflow; los miembros aprueban el contrato directamente."
- Repo: github.com/SimpleX-T/chama-agent. Tracción, pricing e impago: DATA GAP.
- **Lectura:** es casi literalmente la arquitectura de La Vaquita 1.0, ya registrada. **Nuestro diferencial no puede ser la arquitectura.**

### 1.9 Circlepot (Celo) · Amenaza: **BAJA**

- ROSCA en Celo con **cUSD** (planea cKES, cEUR, cGHS, cNGN y cZAR). Smart wallets de Thirdweb con login por email o redes sociales y **gas patrocinado**. On/off-ramp con **Fonbnk, Partna y Yellow Card** (T3 KarmaHQ).
- **Impago:** **colateral bloqueado** que se devuelve al cerrar el círculo, reintentos automáticos y **reputation scoring**.
- **Pricing:** **0,2% sobre cada pago del pozo**, penalidad por retiro anticipado y premium opcional para el creador. Paga el **usuario**.
- Regiones: Global, África y LatAm. Equipo, fondos y usuarios: no listados (US$ 0 levantado).
- **Es el único de Celo con un mecanismo explícito de impago (colateral) y un fee concreto.**

### 1.10 ChamaVault y Celo-Save (Celo) · Amenaza: **BAJA** (agrupados)

- **ChamaVault:** ROSCA en **cUSD dentro de MiniPay**. El contrato reemplaza al tesorero y hay un "Trust Score". Ingreso previsto: parte del yield, tier PRO con pago único en cUSD, token CHMT y SaaS white-label para cooperativas. Bootstrapped, US$ 0, buscando grants. Impago: no especificado. Web: chama-vault-chi.vercel.app (T3 KarmaHQ).
- **Celo-Save:** ROSCA con identidad **Self Protocol** y trust score por puntualidad. Hoy es gratis; a futuro, "fee pequeño con tope sobre el pago" y plan para organizadores. Fundadora visible: Ebele Lynda Okolo (LinkedIn y X @lynndabel). US$ 0 levantado (T3 KarmaHQ).
- Otros nombres en el mismo nicho de KarmaHQ: **ChamaPay, CeloSusu, CoSave y CeloSave**, todos en cUSD y orientados a África.

### 1.11 Vaquita Protocol (Base → Stellar; equipo vinculado a Argentina) · Amenaza: **BAJA**, pero **⚠ colisión de nombre**

- "Save-to-earn" gamificado: **penaliza el retiro anticipado** y reparte el yield perdido entre quienes cumplen. **No es una ROSCA por turnos.** Otra versión (página en ICP) describe sorteos mensuales con colateral en USDC (T3).
- Corrió en **Base de oct a dic-2024** con 182 wallets y 410 tx (autodeclarado, ⚠ >18 meses). TVL ~US$ 351 a 2.824 (T3 DefiLlama, AlphaGrowth). Migra a **Stellar/Soroban** con Blend USDC y onboarding **ARS/USD vía Anclap** (T3 solicitud al Stellar Community Fund).
- Líder: **Leandro Conti**. Ganó un track en **Believathon, XION House of Argentina**. Pre-seed (T3 HackQuest).
- **Riesgo:** el nombre "Vaquita" ya está usado por un producto cripto de ahorro con raíces en Argentina. Hay que revisarlo antes de invertir en la marca (ver Data gaps).

### 1.12 Cementerio y casos de referencia (no son amenaza, son lecciones)

| Caso | Qué pasó | Lección | Fuente |
|---|---|---|---|
| **Yahoo Finance "Tanda"** (EE.UU., ene-2018) | Pozos de 5 o 9 personas; los primeros turnos pagaban ~8% y el último ganaba 2%; **Yahoo no cubría impagos** (trust score). ~37k instalaciones y **cerrada en mayo de 2018** | La ROSCA entre desconocidos sin respaldo del riesgo no tracciona en un mercado sin la costumbre | T2 TechCrunch 2018-05-25; T2 Quartz 2018 ⚠ |
| **Ahorro Libre** (México, 2017) | Tandas de 3 a 16 personas, aporte máximo de MXN 1.000 y pozo máximo de MXN 15.000 | Sin rastros posteriores: probablemente discontinuada | T2 Expansión 2017 ⚠ |
| **Zaveapp** (México, 2015-17) | Alcancía digital con grupos de meta (ahorro **individual**); US$ 330k-450k (Wayra); 25k usuarios en 2017 | Grupo como presión social, sin turnos. Sin noticias recientes | T2 El Financiero, Expansión ⚠ |
| **Warda** (Perú) | Anunció "junta digital" para fines de 2023 | Lanzamiento no confirmado | T2 Gestión 2023 ⚠ |
| **Facily** (Brasil) | Compra grupal tipo Pinduoduo; unicornio en dic-2021; récord de quejas en Procon-SP; despidos masivos | La compra colectiva con descuento sin logística sólida destruye confianza | T2 InfoMoney, IstoÉ Dinheiro 2021-22 ⚠ |
| **Mission Asset Fund** (EE.UU., ONG) | Lending Circles de 6 a 10 personas, préstamo al 0%, **reporta a los 3 burós de crédito**; dicen +168 pts de score y 99% de repago; red de más de 50 ONGs. En 2026 hay una app MAF y las organizaciones "garantizan el fondeo si alguien abandona" | El buró como premio y el respaldo institucional del impago | T2 KVPR 2026-03-16; T3 BadCredit (⚠ cifras 2015-16) |
| **JoinSusu** (Seattle, 2025) | App de ahorro grupal, 2 empleados, respaldada por una aceleradora | Ruido, no amenaza | T3 PitchBook |

---

## 2. Cómo manejan el impago (comparado)

| Mecanismo | Quién lo usa | Costo para el modelo |
|---|---|---|
| **El operador financia el turno con balance propio** | Money Fellows (7-8% de los turnos), ONGs de MAF, Yahoo Tanda (según una fuente; otra dice que no) | Intensivo en capital; requiere licencia y fondeo bancario |
| **Contrato legal y pagaré, con acción judicial** | Money Fellows | Costo de cobranza; difícil en cripto non-custodial |
| **Scoring y turno asignado según riesgo** (los riesgosos cobran al final) | Money Fellows, Yahoo Tanda | Datos y modelo propio; **es lo que La Vaquita puede replicar en código determinístico** |
| **Colateral bloqueado onchain** | Circlepot, Vaquita Protocol (versión ICP) | Mata el valor de la ROSCA para quien no tiene ahorro previo |
| **Penalidades onchain y reputación ERC-8004** | AjoAI, ChamaVault, Celo-Save | Barato, pero no recupera la plata |
| **Ninguno / no documentado** | Ronda, ChamaAgent, Bloom, Sommos | — |
| **Diseño sin riesgo de contraparte** | Naranja X (no hay adelanto) | Pierde el valor del adelanto |

**Oportunidad específica de La Vaquita 2.0:** si el pozo de un turno **paga una compra en un comercio con entrega escalonada**, el comercio puede entregar en tramos atados a los aportes. El impago deja de ser "se fue con la plata" y pasa a ser "no recibe el resto del bien". Ningún competidor relevado hace esto. Es el análogo del consórcio brasileño, donde el bien queda en garantía, sin la burocracia.

---

## 3. ¿Quién cobra a quién?

| Competidor | Usuario paga | Comercio paga | Otro |
|---|---|---|---|
| Money Fellows | **Sí** (hasta 16% en turnos tempranos; promos 0%) | Markup sobre productos vendidos en la app (2022) | Tarjeta y BNPL vía Sympl |
| Sommos | No directamente | No | **Banco** (SaaS) |
| Mycon | **Sí** (9,99% fijo) | No | — |
| Circlepot | **Sí** (0,2% del pozo) | No | Premium del creador |
| AjoAI / ChamaVault | No | No | **Yield** y x402 o tier PRO |
| Naranja X | No (DATA GAP) | No | Float del saldo |
| Yahoo Tanda (†) | Sí (~8% al primer turno) | No | — |
| **La Vaquita 2.0** | **No** | **Sí (comisión)** | — |

**Lectura:** **nadie relevado vive de la comisión del comercio como ingreso principal.** Money Fellows lo hace como ingreso secundario. Es un hueco de posicionamiento ("gratis para el que ahorra") y también un riesgo: no hay un comparable que demuestre que alcanza solo con eso.

---

## 4. Resumen del panorama

**Concentración.** El mercado es muy fragmentado. Hay **un solo jugador de escala global (Money Fellows), concentrado en Egipto**. En LatAm no hay un líder de consumo: la ROSCA sigue siendo informal (WhatsApp y cuaderno) y los únicos digitalizadores son B2B (Sommos) o productos regulados vecinos (consórcio, planes de ahorro). En Celo hay **más de 8 proyectos clonados** de hackathon y ninguno tiene tracción verificable.

**Huecos.**
1. **ROSCA + comercio asociado con descuento + entrega escalonada:** vacío en LatAm. Money Fellows lo prueba a medias en Egipto.
2. **Pesos argentinos digitales (wARS):** ningún competidor onchain opera en moneda local latinoamericana; todos usan cUSD.
3. **Comunidades por interés:** solo Bloom (diáspora) segmenta por comunidad; nadie lo hace en LatAm.
4. **Gratis para el usuario, pagado por el comercio:** nadie lo tiene como modelo principal.
5. **Jujuy/NOA y la frontera con Bolivia:** comparte la cultura del pasanaku, Sommos no tiene app de consumo y Naranja X es fuerte pero no hace ROSCA.

**Posicionamiento sugerido.** No competir como "otra ROSCA onchain con agente" (AjoAI y ChamaAgent ya ocupan eso). Posicionarse como **"la junta que te consigue el producto más barato"**: el valor es **precio de compra colectiva + adelanto del bien + cero comisión al usuario**. El agente y la blockchain quedan como infraestructura invisible. Contra Naranja X: "ellos guardan la plata del grupo; nosotros te adelantan la compra y te consiguen descuento".

**Foso competitivo posible (por orden de defensa).**
1. **Red de comercios asociados con descuento y entrega escalonada:** lento de copiar y local.
2. **Historial de cumplimiento propio** (scoring determinístico por comunidad) para asignar turnos: la clave de Money Fellows.
3. **Comunidad y marca local en Jujuy.**
4. El stack técnico (agente, Celo, ERC-8004) **no es foso**: está replicado en 6 o más proyectos.

---

## 5. Matriz comparativa

| Nombre | Producto | Pricing | Target | Funding | Tracción | Fortaleza clave | Debilidad clave |
|---|---|---|---|---|---|---|---|
| **Money Fellows** (EG) | ROSCA digital + tarjeta + BNPL + productos de comercios | Usuario: hasta 16% en turnos tempranos → 0%; promos "zero fees"; markup sobre productos | Egipcios bancarizados y sub-bancarizados | >US$ 60 M (US$ 13 M may-2025) | >8 M registrados, ~350k MAU, US$ 1.500 M, rentable (oct-2025) | Motor de riesgo que **financia turnos** + 328 alianzas B2B2C | Quejas por comisiones y débitos; intensivo en capital; sin LatAm |
| **Sommos** (BO) | ROSCA/ahorro grupal white-label para bancos, con WhatsApp | SaaS al banco (DATA GAP) | Bancos e IFIs de Bolivia, Perú, Colombia y México | ~US$ 180k pre-seed (2022 ⚠); seed en curso | >100k usuarios vía 10 bancos (jun-2026, autodeclarado) | Cultura del pasanaku + canal bancario | Sin marca de consumo ni comercios |
| **Bloom Money** (UK) | ROSCA "Bloom Circles" para diásporas | DATA GAP | Inmigrantes en el Reino Unido | ~US$ 2 M seed (2025) + Crowdcube | ~13k clientes (T3) | Segmentación por comunidad | Chico; fuera de LatAm |
| **Mycon** (BR) | Consórcio digital vendido por chatbot IA | Usuario: 9,99% fijo total | Brasileños que quieren comprar auto o inmueble | Founders (R$ 10 M) + Grupo Coimex | 14k clientes, R$ 2.000 M en 2021 ⚠ | IA conversacional + producto regulado | Producto pesado (bienes grandes); datos viejos |
| **Naranja X Cuenta Compartida** (AR) | Cuenta grupal con Frascos de metas y rendimiento | Sin costo informado | Parejas, familias y amigos argentinos | Grupo Galicia | Base de ~10 M de clientes; lanzada ago-2026 | Marca, gratuidad, rendimiento, presencia en Jujuy | **No adelanta el pozo** ni da descuentos |
| **Ronda** (Celo) | ROSCA semanal en Farcaster + Self + ENS | DATA GAP | Comunidades poco bancarizadas | Premios de ETHGlobal BA | Prototipo | Nació en BA, visible para el ecosistema Celo | Sin modelo, moneda ni tracción |
| **AjoAI** (Celo) | ROSCA + **agente IA** + reputación ERC-8004 + MCP/A2A | Gratis; 10-20% del yield; x402 | Ajo/esusu en África | Solo grants | "Live on mainnet" (autodeclarado) | Ya ocupa "agente + ERC-8004 + ROSCA" | Sin usuarios visibles; yield no listo |
| **ChamaAgent** (Celo) | ROSCA cUSD con agente non-custodial + Self Agent ID | DATA GAP | Chamas (Kenia) | DATA GAP | Agente ERC-8004 #9146 (may-2026) | Arquitectura casi idéntica a la nuestra | Metadatos inconsistentes; sin tracción |
| **Circlepot** (Celo) | ROSCA cUSD con colateral, gas patrocinado y ramps africanos | Usuario: 0,2% del pozo + penalidades + premium | África y LatAm | US$ 0 | DATA GAP | Único con mecanismo de impago claro | El colateral reduce el valor; sin moneda local LatAm |
| **ChamaVault / Celo-Save** (Celo) | ROSCA cUSD (MiniPay / Self) con trust score | Yield, PRO, futuro fee con tope | África | US$ 0 | DATA GAP | MiniPay como distribución | Commodity |
| **Vaquita Protocol** (Base→Stellar) | Save-to-earn con penalidad por retiro | Penalidades → pool de premios | Ahorristas cripto de LatAm | Pre-seed / grants | 182 wallets (2024 ⚠), TVL < US$ 3k | Equipo vinculado a AR + ARS vía Anclap | No es ROSCA; **colisión de nombre** |

---

## 6. Data gaps

1. **Google Play / App Store:** rating, cantidad de reseñas y descargas verificadas de Money Fellows (solo hay un agregador T3: 3,5★ con 37k reseñas), Bloom y Naranja X. Falta revisar las tiendas directamente.
2. **Apps argentinas de "juntas", "ahorro en grupo" o "círculo":** la búsqueda en prensa no encontró ninguna. **Falta la búsqueda directa en Play Store Argentina** (se agotó el presupuesto). Hipótesis: no existe una app de consumo relevante, pero **no está confirmado**.
3. **Money Fellows:** comisión exacta al comercio y estructura vigente de admin fees (16% contra 6% contra "zero fees"). Tasa de default publicada. Estado de Marruecos y Arabia Saudita en 2026.
4. **Sommos:** web oficial, nombres de los bancos clientes, pricing SaaS y verificación de la cifra de 100k usuarios y US$ 200 M.
5. **Bloom Money:** pricing y política de impago.
6. **Naranja X:** costo de la Cuenta Compartida, tasa de los Frascos y adopción a oct-2026.
7. **Proyectos de Celo:** usuarios y TVL onchain de Ronda, AjoAI, ChamaAgent y Circlepot. Se puede medir leyendo los contratos en Celoscan (tarea técnica, no web).
8. **Pasanaku digital en Bolivia y Perú (2025-26):** sin verificar si hay apps de consumo activas además de Sommos.
9. **México 2025-26:** no se encontró ninguna app de tandas de consumo activa. Puede haber jugadores que la búsqueda no capturó.
10. **Kiip:** no se encontró ninguna app de lending circles con ese nombre. Se descarta como competidor hasta tener evidencia.
11. **Marca "Vaquita":** verificar en INPI y en tiendas la colisión con Vaquita Protocol y otras apps de "vaquita" (colectas).

---

## 7. Fuentes

**Money Fellows**
- T2 · TechCrunch, 2025-05-04: https://techcrunch.com/2025/05/04/moneyfellows-raises-13m-to-take-its-group-savings-model-outside-egypt
- T2 · Arab Finance, 2025-10-22: https://arabfinance.com/en/news/newdetails/Money-Fellows-reaches-1-5B-in-total-transaction-value
- T2 · MEA Tech Watch, 2025-10-21: https://meatechwatch.com/2025/10/21/egypts-money-fellows-surpasses-1-5-billion-in-transactions-achieves-profitability/
- T2 · TechCrunch, 2022-10-31 ⚠: https://techcrunch.com/2022/10/31/money-fellows-an-egyptian-fintech-digitizing-money-circles-raises-31m-funding
- T1 · Blog "Your Complete Guide to Money Fellows App" (sin fecha, capturado en 2026): https://moneyfellows.com/en-us/blog-home/your-complete-guide-to-money-fellows-app/
- T1 · Blog "Year-End Offers": https://moneyfellows.com/en-us/blog-home/year-end-offers-are-here-with-money-fellows/
- T2 · EgyptInnovate, Sympl: https://egyptinnovate.com/en/news/money-fellows-and-sympl-forge-strategic-partnership-to-deliver-flexible-payment-solutions
- T2 · EgyptInnovate, perfil (pagaré y cobertura de impago, sin fecha ⚠): https://egyptinnovate.com/en/node/7224
- T3 · 500 Global: https://500.co/theglobalvc/egypt-s-money-fellows-uses-an-old-school-lending-tool-to-drive-fintech-innovation
- T3 · Trustpilot: https://www.trustpilot.com/review/moneyfellows.com
- T3 · Marlvel (agregador de reseñas): https://marlvel.ai/apps/money-fellows-online-circles
- T1 · App Store: https://apps.apple.com/us/app/money-fellows-online-circles/id1113492041
- T3 · Smashi Business (Golfo): https://smashibusiness.beehiiv.com/p/trump-s-gulf-visit-moneyfellows-major-funding-and-damac-s-chelsea-partnership

**Sommos / PasanaQ**
- T2 · LatamList, 2025-02-11: https://latamlist.com/sommos-transforming-financial-inclusion-across-latin-america/
- T3 · One Young World, 2026-06: https://upsun.oneyoungworld.com/project/sommos
- T2 · LatamFintech, 2022 ⚠: https://www.latamfintech.co/articles/credit-fintech-pasanaq-raised-us-180k-to-launch-its-mobile-platform-in-bolivia
- T2 · eju.tv (entrevista a Diego Rojas): https://eju.tv/?p=3004726
- T3 · CB Insights: https://www.cbinsights.com/company/pasanaq
- T3 · Descubre: https://www.descubre.vc/pasana-q

**Bloom Money**
- T2 · People of Color in Tech, 2025-05-22: https://peopleofcolorintech.com/articles/entrepreneur-secures-2m-for-app-helping-immigrants-save-money/
- T3 · Seedtable: https://seedtable.com/companies/bloom-money/funding-rounds/seed-2025-06
- T3 · 1st Formations: https://www.1stformations.co.uk/blog/?p=31090
- T3 · Startups 100 UK 2025: https://startups.co.uk/startups-100/2025/bloom-money

**Mycon**
- T2 · Finsiders Brasil (2022, actualizado 2025-04-23) ⚠: https://finsidersbrasil.com.br/reportagem-exclusiva-fintechs/mycon-acelera-acoes-de-marketing-e-preve-vender-r-4-bi-em-consorcios/

**Naranja X**
- T2 · TodoJujuy, 2026-08-13: https://www.todojujuy.com/naranja-x-presenta-la-primera-cuenta-compartida-del-pais-disenada-aliviar-las-tensiones-y-la-carga-mental-gestionar-la-plata-grupo-parejas-familias-o-amigos-n294563

**Celo y onchain**
- T1 · ETHGlobal, Ronda: https://ethglobal.com/showcase/ronda-7ck82
- T1 · ERC-8004 Explorer, ChamaAgent #9146: https://erc-8004.quicknode.com/agents/celo-mainnet/9146
- T3 · KarmaHQ, AjoAI: https://www.karmahq.org/project/ajoai/about
- T3 · KarmaHQ, Circlepot: https://www.karmahq.org/project/circlepot/about
- T3 · KarmaHQ, ChamaVault: https://www.karmahq.org/project/chama-vault/about
- T3 · KarmaHQ, Celo-Save: https://www.karmahq.org/project/celo-save-1/about
- T3 · KarmaHQ, ChamaPay: https://www.karmahq.xyz/project/chamapay/about
- T3 · DefiLlama, Vaquita Protocol: https://defillama.com/protocol/vaquita-protocol
- T3 · HackQuest, Vaquita (XION House of Argentina): https://hackquest.io/en/projects/Believathon-Local-Edition-XION-House-of-Argentina-Vaquita
- T3 · Stellar Community Fund, Vaquita: https://communityfund.stellar.org/submissions/recf0kKLHyFBwSHmL

**Cementerio y referencias**
- T2 · TechCrunch, 2018-05-25 ⚠ (cierre de Yahoo Tanda): https://techcrunch.com/2018/05/25/yahoo-shuts-down-social-savings-app-tanda-only-months-after-launch
- T2 · Quartz, 2018 ⚠: https://qz.com/1183768/yahoo-finance-has-a-plan-to-become-the-uber-of-saving-money
- T2 · Expansión, 2017 ⚠ (Ahorro Libre): https://expansion.mx/dinero/2017/06/29/un-seguro-y-dos-apps-que-te-ayudaran-a-lograr-el-ahorro-que-tanto-quieres
- T2 · Expansión, 2017 ⚠ (Zaveapp): https://expansion.mx/tecnologia/2017/05/08/zaveapp-la-fintech-mexicana-que-busca-conquistar-europa
- T2 · Gestión, 2023 ⚠ (Warda): https://gestion.pe/tu-dinero/finanzas-personales/banca-se-alista-a-ofrecer-juntas-de-ahorro-digital-ahorro-programado-ahorro-digital-cuentas-de-ahorro-noticia/
- T2 · InfoMoney ⚠ (Facily): https://www.infomoney.com.br/do-zero-ao-topo/facily-o-quase-unicornio-brasileiro-que-disparou-em-vendas-e-em-reclamacoes-no-procon/
- T2 · IstoÉ Dinheiro ⚠ (Facily): https://istoedinheiro.com.br/como-a-facily-foi-do-status-de-unicornio-as-demissoes-em-massa
- T2 · KVPR, 2026-03-16 (MAF / tandas en California): https://www.kvpr.org/business-economy/2026-03-16/newer-generations-are-giving-an-old-money-saving-technique-a-modern-twist
- T3 · BadCredit.org ⚠ (MAF): https://www.badcredit.org/news/maf-helps-underserved-financial-consumers-gain-access-and-build-credit/
- T3 · PitchBook (JoinSusu): https://pitchbook.com/profiles/company/1367126-83
