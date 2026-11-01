# A2 · Tendencias de industria y timing — La Vaquita 2.0

> Investigación desk (agente A2). Fecha de corte: **2026-10-24**. 17 búsquedas web.
> Clasificación de fuentes: **T1** = primaria/oficial (INDEC, BCRA, comunicados de la empresa, foro oficial de Celo); **T2** = prensa especializada o analistas con metodología (TechCrunch, Infobae, Chainalysis vía prensa, TRM Labs, Artemis); **T3** = blogs, agregadores, notas de exchanges con interés comercial, MEXC News.
> ⚠️ = dato con más de 18 meses (anterior a abril 2025). Varias cifras vienen de resúmenes de búsqueda y no se verificaron contra el documento original; se indica cuando pasa.

---

## 1. Tendencias tecnológicas

### 1.1 Stablecoins de moneda local de Ripio (wARS, wBRL, wMXN + wCOP, wCLP, wPEN)
- **Descripción:** Ripio emite tokens 1:1 respaldados por moneda local, atados a cuentas bancarias virtuales locales, con on/off-ramp sin costo. Lanzó wARS en Ethereum, Base y World Chain (World App fue la integración más profunda) y después desplegó su stack wFIAT en Celo con seis monedas. Textile FX fue socio de liquidez desde el día uno (FX wARS/wBRL).
- **Datos:** wARS movió ~US$ 200.000 en su mes de lanzamiento (dic-2025). Meta declarada de Ripio: "al menos US$ 100M de AUM a fin de año". El despliegue en Celo se anunció hacia el **31-jul-2026** según una de las fuentes (T3; el blog de Celo devolvió 403 y no se pudo confirmar la fecha).
- **Etapa de adopción:** temprana / innovadores. El volumen inicial es chico frente a USDT (ver 4.2).
- **Impacto:** **Oportunidad.** Es la pieza que hace posible un producto en pesos onchain sin riesgo cambiario para el usuario; el comercio cobra en pesos. **Amenaza:** liquidez baja, dependencia de un solo emisor y de que Ripio mantenga el ramp gratis.
- **Timeline:** disponible hoy en Celo; escalar depende de que Ripio llegue a su meta de AUM en 2026-2027.
- **Fuentes:** Cointelegraph (T2), blockchain.news (T3), blog.celo.org (T1, no verificado por 403).

### 1.2 Celo como L2 de Ethereum + MiniPay como canal de distribución
- **Descripción:** Celo migró de L1 a L2 sobre OP Stack el **26-mar-2025** (T2, The Block). Hoy se posiciona como la red de pagos con stablecoins en mercados emergentes.
- **Datos:** pico de 840.000 DAU y 1,3M MAU (máximo histórico); ~5M usuarios semanales de USDT y 7,2M tx semanales; más de US$ 65.000M de volumen de stablecoins desde la migración (T3, MEXC/The Block). growthepie (24-mar-2026, T2): ~14M de teléfonos verificados y +300.000 direcciones activas verificadas por día. MiniPay: **+16M de wallets** (foro Celo, Update Q1 2026, T1 autodeclarado), +400M de tx en el ecosistema de Mini Apps; dic-2025: US$ 96M en USDT enviados y 3,5M de pagos P2P en el mes (Tether/Opera, T1 autodeclarado). Q2 2026: tarjeta Visa con cashback en oro.
- **Contradicción:** las cifras de MiniPay van de 11M (abril 2026, MEXC) a 14M (MEXC) a 16M (foro Q1 2026). Probablemente miden cosas distintas (wallets creadas vs. activas). Ninguna es auditada.
- **Etapa:** adopción temprana-mayoritaria en África (Nigeria, Kenia, Ghana); **en Argentina, MiniPay no tiene tracción visible** (DATA GAP, ver sección 6).
- **Impacto:** **Oportunidad** (fees bajos, gas en stablecoin, base de usuarios para un Mini App). **Amenaza:** la base de MiniPay está en África, no en el NOA; en Argentina el usuario vive en Mercado Pago.
- **Timeline:** ya.

### 1.3 Pagos agénticos (x402, AP2, Mastercard Agent Pay, Visa)
- **Descripción:** protocolos para que agentes de IA paguen. x402 (Coinbase + Cloudflare) usa HTTP 402 con stablecoins; AP2 (Google) usa "mandatos" firmados con límites y fue donado a la FIDO Alliance en abril 2026; Mastercard lanzó Agent Pay en LatAm y el Caribe (dic-2025) y reportó transacciones en vivo con Santander, Itaú y Bancolombia (mar-2026, T1). Santander también completó tx agénticas con Visa en varios mercados de LatAm (T3).
- **Datos x402 (contradictorios):** ~100M tx y ~US$ 600M anualizados a fin de 2025 (OKX Ventures, T3); 119M tx en Base + 35M en Solana a mar-2026 (T3); ~165M tx y ~US$ 50M acumulados a abr-2026 (Coinbase vía Eco, T3). Artemis (vía CryptoSlate, T2): el volumen ajustado **cayó 77%**, de US$ 5,15M (nov-2025) a US$ 1,19M (may-2026), con 2,89M tx/mes y ticket promedio de US$ 0,52. TRM Labs (T2): solo entre **0,6% y 7,5%** de US$ 25,62M de comercio x402 analizado parece realmente agéntico. BlindPay (T3): 75M tx por US$ 24M en 30 días de jul-2026, mayormente bots de fracciones de centavo.
- **Etapa:** hype / experimentación. Hay mucho conteo de transacciones y poco comercio real.
- **Impacto:** **Oportunidad narrativa** (la categoría "agente que mueve plata" tiene atención de inversores y de Mastercard/Visa). **Amenaza:** el usuario final todavía no le confía plata a un agente; las billeteras siguen pidiendo aprobación manual ("approval gap", CryptoSlate). Para La Vaquita esto valida el diseño "el LLM propone, el código decide".
- **Timeline:** emisores habilitados para Agent Pay en LatAm desde feb-2026; volumen relevante, no antes de 2027-2028.

### 1.4 ERC-8004 (identidad y reputación de agentes)
- **Descripción:** registro onchain de identidad, reputación y validación de agentes. Complementario a x402 (pago).
- **Datos:** mainnet de Ethereum el **29-ene-2026** (varias fuentes T3; una dice 10-feb). +10.000 agentes registrados a principios de febrero; ~21.000 desplegados en varias redes al 13-feb-2026 (Nevermined, T3 vendor). Sigue en estado **Draft**, con v2 en desarrollo (Taiko, T3).
- **Etapa:** innovadores. Útil como señal de confianza, no como canal de usuarios.
- **Impacto:** **Oportunidad baja-media.** Diferencia ante jurados e inversores cripto; el usuario de Jujuy no lo va a ver. Riesgo de cambios en el estándar (v2).

### 1.5 Account abstraction / wallets invisibles
- **Descripción:** wallets creadas por número de teléfono, gas pagado en stablecoin (CIP-64 en Celo), sin seed phrase. MiniPay es el caso emblema (14M de teléfonos verificados).
- **Etapa:** mayoría temprana en wallets embebidas.
- **Impacto:** **Oportunidad**: condición necesaria para usuarios no cripto.
- **DATA GAP:** no encontré datos 2026 de adopción de wallets con AA en Argentina. Proxy: los 14M de teléfonos verificados de Celo (global). Confianza: Baja.

---

## 2. Actividad de inversión

### 2.1 ROSCA / savings circles digitales
| Empresa | País | Ronda | Fecha | Notas | Tier |
|---|---|---|---|---|---|
| MoneyFellows | Egipto | US$ 13M pre-Serie C (Al Mada Ventures, Nclude, Partech Africa, CommerzVentures) | may-2025 | +US$ 60M acumulados, +8,5M usuarios, rentable en Egipto, expansión a Marruecos | T2 (TechCrunch) |
| MoneyFellows | Egipto | US$ 31M Serie B | oct-2022 ⚠️ | | T2 |
| Esusu | EE.UU. | US$ 50M Serie C (Westbound Equity) | fines 2025 | Valuación US$ 1.200M; +US$ 200M acumulados. **Pivoteó a rent reporting**: los savings circles ya no aparecen en su oferta | T2 (FinTech Futures) |
| PasanaQ / Sommos | Bolivia | pre-seed ~US$ 180K | sin fecha | Pasanaku digital, SaaS, aceleradoras Krealo y Seedstars; planea Perú, Colombia, México | T3 (descubre.vc) |
| Tanda | EE.UU. | sin dato | sin fecha | Tanda como beneficio para empleados | T2 (TechCrunch) |
| BX Smart Labs | México | US$ 60.420 (UNICEF Innovation Fund) | sin fecha | Tandas en blockchain | T1 |
| WeTrust | Global | ~US$ 5M ICO | 2017 ⚠️ | ROSCA en Ethereum; no despegó | T3 |

- **Tendencia:** el capital grande va a ROSCA **fiat** con escala (MoneyFellows) o a quienes **pivotaron** fuera de los circles (Esusu). En ROSCA onchain **no encontré ninguna ronda 2025-2026**: hay solo proyectos de hackathon (ROSA, Starosca, ChainCircle, ROSCA dapp en ETHOnline 2025). Lectura: espacio abierto, pero también señal de que nadie probó que escale.

### 2.2 Social commerce / compra grupal LatAm
- **Favo** (Brasil/Perú): Serie A US$ 26,5M liderada por Tiger Global (oct-2021 ⚠️). Cerró Brasil en 2022 y **Perú en feb-2024** ⚠️ por "desafíos de mercado que hicieron insostenible el negocio" (T2, Contxto).
- **Muni** (Colombia): Serie A US$ 20M liderada por Lightspeed (mar-2022 ⚠️), +15.000 comunidades en Colombia, Brasil y México (dato sin fecha). Caso Stanford GSB 2024 sobre levantar plata en un entorno difícil. **No hay noticias 2025-2026**: DATA GAP sobre si sigue operando.
- **Tendencia:** el modelo Pinduoduo/"líder de comunidad" con logística propia **quemó capital y no sobrevivió** en LatAm. Hoy el social commerce que crece es el de plataformas globales (Temu, Shein, TikTok Shop; ver 3.4). Implicancia: La Vaquita 2.0 no debería tener logística ni inventario. Su primera oferta (bienes digitales con acceso revocable) esquiva justo lo que mató a Favo.

### 2.3 Fintech y venture Argentina 2026
- 2025: US$ 270M en 73 rondas (ARCAP + EY, T1/T2).
- 2026: **más de US$ 400M en los primeros cinco meses** (Forbes Argentina: +US$ 427M), con menos rondas y tickets más grandes (T2).
- Rondas: **Ualá** US$ 195M liderada por Allianz X, con Tencent, Soros, Stone Ridge, D1; valuación US$ 3.200M (4-mar-2026, T2 BA Times / El Economista). Pomelo US$ 55M, Humand US$ 66M (HRtech); Belo y Tapi (Tapi levantó US$ 31M y compró una empresa en México) sin monto en la fuente. iProfesional mezcla un "Ualá US$ 197M" con el dato de 2025: contradicción menor.
- **Tendencia:** deshielo del VC argentino, concentrado en fintech de escala e infraestructura (Pomelo, Tapi). El pre-seed de consumo cripto sigue siendo nicho.
- **Adquisiciones relevantes:** Tapi compró una empresa mexicana (2026, sin detalle). DATA GAP: no encontré M&A de ROSCA ni de social commerce en 2025-2026.

---

## 3. Cambios de comportamiento

### 3.1 Ahorro e inflación en Argentina
- Inflación **septiembre 2026: 1,9% mensual, 33,4% interanual, 23,6% acumulada** en el año (INDEC vía Infobae, 13-oct-2026, T1/T2). Agosto: 1,7%. Núcleo de septiembre: 1,7%.
- Tasas (oct-2026): plazo fijo a 30 días entre 16,5% y 24% TNA según banco (Reba 24%, Provincia 21%, Nación 19,25-20%); **Mercado Pago, cuenta remunerada y Reservas: 19% TNA**; Ualá: 24% TNA hasta $ 1M (comparatasas, 23-oct-2026). Con 1,9% mensual (~25% anualizado), **la mayoría de las opciones en pesos rinden por debajo de la inflación**. El incentivo a no quedarse en pesos vuelve a aparecer (T2/T3).
- Dólar cripto: las stablecoins en dólares son el **71% de las compras cripto** en Argentina (Bitso, "Panorama cripto LatAm 2026", T3 con interés comercial). Chainalysis vía iProUP (T2): Argentina movió **US$ 88.500M** en cripto entre jul-2025 y jun-2026 (+15,3%), segundo mercado de LatAm; en Argentina y Venezuela, +70% de las compras va a USDT/USDC.
- Encuesta Bitso/Synopsis 2023 ⚠️: 25,3% muy o bastante dispuesto a comprar dólares digitales; 47% había escuchado hablar de stablecoins.
- **Tensión para el producto:** el argentino ahorra en **dólares**, no en pesos digitales. wARS no protege de la inflación. El valor de La Vaquita tiene que venir de **comprar antes y con descuento** (el pozo es poder de compra inmediato, que en inflación vale más que esperar), no de ahorrar en pesos.

### 3.2 Ahorro por objetivos en apps
- Mercado Pago Reservas: **+15M de "reservas" creadas** (categorías, no personas), sobre todo organización personal, vacaciones y fondo de emergencia (T2, iProfesional 2026; no se pudo aislar la fecha exacta del dato). Mercado Pago: +50M de usuarios activos en la región (jun-2026).
- Ualá: +11M de clientes en Argentina, México y Colombia (mar-2026).
- **Implicancia:** el ahorro por metas **individual** ya es un hábito masivo y gratis. La Vaquita 2.0 compite contra eso: su diferencial tiene que ser lo **grupal** (presión social, compromiso, adelanto del pozo) más el **descuento**.

### 3.3 Cuotas, crédito y morosidad (2026)
- Morosidad: según la Central de Deudores del BCRA (vía Conclusión, T2/T3) la proporción de deudores en mora pasó del 13,6% (oct-2024) al **27,8% (jun-2026)**; el 15,5% del monto adeudado por familias está en situación irregular. **Contradicción:** SIISA ubica la mora total en ~12% y La Gaceta, en 11,6% en tarjetas. Las definiciones son distintas.
- D'Alessio Irol: 57% tiene cuotas con tarjeta de crédito, 18% préstamos personales. Instituto Argentina Grande: 26,2% de los hogares endeudados (2,6M). Tarjetas: cinco meses seguidos de caída real, **escasez de cuotas sin interés** y tasas de tarjeta por encima del 100% anual (Catamarca).
- **Implicancia: oportunidad fuerte.** Hay demanda de "comprar en cuotas" y la oferta formal se encarece o se corta. Una junta **es** comprar en cuotas sin interés y sin scoring. El que cobra primero recibe crédito de sus pares. Riesgo: la misma mora que golpea a los bancos puede pegar en los aportes (impago después de cobrar). Por eso el acceso revocable es clave.

### 3.4 Social commerce y compra cross-border
- Compras por courier/puerta a puerta: **US$ 751M** acumulados ene-jul 2026, **+83,9% interanual**; récord mensual de US$ 118M en abril (Analytica vía iProfesional/El Economista, T2). En 2025 Shein/Temu crecieron +270% hacia Argentina, con ~5M de usuarios. El Decreto 604/2026 (17-jul-2026) unificó el régimen: envíos de hasta US$ 400 sin derechos (T2; hay contradicción con versiones anteriores de US$ 50 / 12 envíos).
- TikTok Shop: lanzó en México (feb-2025 ⚠️) y Brasil (may-2025); Brasil llegó a US$ 46,1M de GMV en ago-2025 (Momentum Works, T2). **No está en Argentina** (DATA GAP).
- Social commerce LatAm: proyección de US$ 8.210M a US$ 31.240M de GMV para 2029 (databook Q1 2024 ⚠️, T3, anterior a TikTok Shop).
- **Implicancia:** el argentino compra online barato y en volumen, pero **solo**. La "compra en grupo" tipo Pinduoduo no tiene un jugador en Argentina. Temu y Shein además ya "ganaron" en precio. El descuento de La Vaquita tiene que venir de comercios locales o digitales, no competir con Temu en productos físicos.

### 3.5 Juntas, tandas y pasanakus entre jóvenes
- **DATA GAP:** no encontré encuestas 2024-2026 sobre uso de juntas entre jóvenes en Argentina o en el NOA. Proxy: WhatsApp es la herramienta de coordinación grupal dominante (Comscore 2025: ~217M de visitantes únicos mensuales en LatAm, T2); Findex 2025: 37% de adultos de LatAm con cuenta de dinero móvil (vs. 22% en 2021) y 19% ahorra vía móvil (T1 vía resúmenes). KQED (T2, sin fecha) documenta jóvenes latinos en EE.UU. que digitalizan la tanda. Confianza: Baja. **Este dato hay que salir a buscarlo con entrevistas en Jujuy** (cultura de pasanaku por cercanía con Bolivia).

---

## 4. Predicciones de expertos (horizonte 2027)

| Tema | Predicción | Fuente | Tier | Comentario |
|---|---|---|---|---|
| Inflación Argentina | 30% en 2026; **21,2% dic/dic 2027**; ene-mar 2027 en 1,6-1,7% mensual | REM BCRA sep-2026 (6-oct-2026) | T1 | Sigue alta: los pesos se queman y el poder de compra inmediato vale |
| PBI Argentina | 2026: +1,5% (recortado 0,6 pp); Q3-2026 −1% (recesión técnica); Q1-2027 +0,7% | REM BCRA | T1 | Consumo débil a corto plazo |
| PBI 2027 | +3% | CEPAL | T1 | Contradice levemente el tono del REM |
| Dólar | $ 1.614 a dic-2026 (mediana) | REM vía Perfil | T1/T2 | |
| Agentic spend global | US$ 8.000M en 2026, US$ 1,5 billones en 2030 | Juniper Research vía Eco | T3 | Muy especulativo |
| Agentic commerce | US$ 3-5 billones en 2030; LatAm + Medio Oriente US$ 0,4 billones (8%) | McKinsey 2026 vía blog / Finnosummit | T3 | No verificado contra McKinsey |
| Agentic commerce 2027 | 1 de cada 3 líderes de e-commerce cree que +50% de las tx serán de agentes en 2027 | Logicbroker | T3 | Encuesta de opinión, global |
| Stablecoins LatAm | Ripio: US$ 100M AUM en wFIAT a fin de 2026 | Ripio vía Cointelegraph | T1/T2 | Meta de la empresa, no un pronóstico |
| Cripto en bancos AR | Apertura posible "en una eventual segunda presidencia de Milei" (2027+) | Director BCRA vía iProUP, oct-2026 | T2 | Se postergó la fecha de abril 2026 |
| Social commerce LatAm | US$ 31.240M de GMV en 2029 | Databook 2024 ⚠️ | T3 | |

- **DATA GAP:** no hay un pronóstico creíble de stablecoins de **moneda local** en LatAm para 2027. Proxy: Chainalysis (LatAm US$ 593.800M de actividad cripto, +9,8% interanual a jun-2026; stablecoins = 32% del valor cross-border). Confianza: Baja para wARS en particular.

---

## 5. Evaluación de timing

**Veredicto: momento razonablemente bueno para un piloto chico; prematuro para escalar con plata de VC.** Puntaje subjetivo: 6,5/10.

### A favor
1. **Crédito al consumo caro y escaso:** pocas cuotas sin interés, tarjetas por encima del 100% anual y la mora en 27,8% (según la medición) empujan a buscar financiamiento informal. La junta es crédito entre pares sin interés.
2. **Inflación de 1,9% mensual con tasas por debajo:** esperar para comprar destruye valor, y recibir el pozo antes es valioso.
3. **La infraestructura está lista desde hace meses:** wARS en Celo con ramp gratis (jul-2026), gas en stablecoin y ERC-8004 en mainnet (ene-2026). Ser de los primeros casos de uso de wARS en Celo da visibilidad con Ripio y Celo.
4. **VC argentino descongelado** (+US$ 400M en 2026) y narrativa de agentes caliente (Mastercard Agent Pay en LatAm).
5. **Los grandes del social commerce no hacen "compra en grupo" en Argentina:** Favo murió, Muni está en silencio y TikTok Shop no llegó.

### En contra
1. **Recesión técnica en Q3-2026** y PBI en baja: menos excedente para aportar.
2. **Mora en suba:** el riesgo central del producto (el que cobra y deja de pagar) aumenta justo ahora.
3. **El argentino ahorra en dólares:** wARS no compite como reserva de valor, y ahorrar en pesos digitales es contraintuitivo.
4. **Mercado Pago Reservas y Ualá dan metas individuales gratis y remuneradas:** un sustituto fuerte.
5. **Pagos agénticos con poco uso real** (TRM: 0,6-7,5% agéntico); la confianza del usuario en un agente con su plata todavía no está probada.
6. **Regulación cripto en pausa:** bancos sin cripto; el registro PSAV de la CNV (RG 1058/2025) puede alcanzar al modelo si se considera intermediación.
7. **Antecedentes de fracaso:** Favo y WeTrust.

### Qué mejoraría el timing
- Que Ripio llegue a liquidez real en wARS y aparezcan otros comercios que lo acepten.
- Una baja de inflación por debajo de ~1,5% mensual con salario real en alza (más excedente para aportar).
- Que el BCRA habilite cripto en bancos o billeteras (normaliza la experiencia).
- Que MiniPay u otra wallet con AA entre fuerte en Argentina.

### Qué lo empeoraría
- Una devaluación brusca (wARS pierde valor entre turno y turno y el pozo compra menos).
- Una regulación que trate la coordinación de juntas como intermediación financiera.
- Que Mercado Pago lance "Reservas compartidas" o una junta nativa (amenaza existencial; DATA GAP sobre si está en su roadmap).

---

## 6. Data gaps

| # | Gap | Proxy | Confianza |
|---|---|---|---|
| 1 | Uso de juntas/pasanakus entre jóvenes en Argentina o Jujuy | WhatsApp como herramienta de coordinación grupal; Findex 2025 (37% con cuenta móvil en LatAm) | Baja |
| 2 | Usuarios de MiniPay en Argentina | Global 11-16M, concentrado en África | Baja |
| 3 | Volumen y holders actuales de wARS (oct-2026) | US$ 200K en dic-2025 + meta de US$ 100M de AUM | Baja |
| 4 | Pronóstico de stablecoins de moneda local en LatAm 2027 | Chainalysis LatAm (US$ 593.800M, +9,8%) | Baja |
| 5 | Estado actual de Muni y del social commerce grupal LatAm 2025-2026 | Cierre de Favo (2024) | Media |
| 6 | Funding 2025-2026 de ROSCA onchain | Solo proyectos de hackathon | Media (la ausencia de rondas es un hallazgo en sí) |
| 7 | Datos de bancarización, informalidad y billeteras en Jujuy | Nacional: 63% prefiere Mercado Pago (WorldPay 2024 ⚠️) | Baja |
| 8 | Roadmap de Mercado Pago o Ualá para ahorro grupal | — | Baja |
| 9 | Fecha exacta del deploy de Ripio en Celo | 31-jul-2026 (T3) | Media |
| 10 | Cifras de mora: medición del BCRA (27,8%) vs. SIISA (~12%) | Usar el rango 12-28% según la definición | Media |

---

## 7. Fuentes

**Tecnología**
- Cointelegraph, Ripio peso stablecoins (T2): https://cointelegraph.com/news/argentine-exchange-ripio-peso-stablecoins
- Blog de Celo, Ripio deploys wFIAT stack on Celo (T1, 403 al acceder): https://blog.celo.org/ripio-deploys-wfiat-stack-on-celo-with-no-cost-on-off-ramps-expanding-the-leading-stablecoin-9f801b82b899
- blockchain.news, Ripio wFIAT en Celo (T3): https://blockchain.news/news/ripio-wfiat-stablecoins-celo-integration
- Foro de Celo, MiniPay Update Q1 2026 (T1): https://forum.celo.org/t/minipay-update-q1-2026/13273
- Foro de Celo, MiniPay Update Q2 2026 (T1): https://forum.celo.org/t/minipay-update-q2-2026/13664
- Foro de Celo, Sustaining and Expanding MiniPay (T1): https://forum.celo.org/t/sustaining-and-expanding-minipay-as-celo-s-global-stablecoin-distribution-layer/12958
- Barchart, Tether y Opera MiniPay (T1 vía prensa): https://www.barchart.com/story/news/37360409/tether-and-opera-expand-financial-access-in-emerging-markets-through-minipay
- Decrypt, Opera/Celo (T2): https://decrypt.co/350750/opera-celo-scale-up-partnership-to-make-stablecoins-useful-for-millions-of-users
- growthepie, Celo anniversary report (T2): https://www.growthepie.com/quick-bites/celo-anniversary-report
- The Block, Celo (T2): https://www.theblock.co/price/celo
- CryptoSlate, x402 approval gap (T2): https://cryptoslate.com/tiny-x402-payments-expose-gap-holding-ai-agents-back/
- TRM Labs, measuring AI agent payments (T2): https://www.trmlabs.com/trm-tech-blog/whos-actually-paying-measuring-ai-agent-payments-onchain
- BlockEden, x402 (T3): https://blockeden.xyz/blog/2026/04/01/x402-protocol-http-402-ai-agent-commerce-stablecoin-payments/
- BlindPay, comparación de protocolos de pago para agentes (T3): https://blindpay.com/resources/more/agent-payment-protocols-compared.md
- Eco, agentic payments (T3): https://eco.com/support/support/en/articles/14839401-agentic-payments
- Mastercard, Agent Pay LatAm (dic-2025, T1): https://www.mastercard.com/news/latin-america/en/newsroom/press-releases/pr-en/2025/december/mastercard-unveils-agent-pay-in-latin-america-and-the-caribbean
- Mastercard, live transactions LatAm (mar-2026, T1): https://www.mastercard.com/news/latin-america/en/newsroom/press-releases/pr-en/2026/march/mastercard-advances-agentic-payments-in-latin-america-and-the-caribbean-with-live-transactions-completed-across-the-region
- Nevermined, ERC-8004 statistics (T3): https://nevermined.ai/blog/erc-8004-agent-identity-statistics
- DiarioBitcoin, lanzamiento de ERC-8004 (T3): https://www.diariobitcoin.com/ethereum/lanzamiento-de-erc-8004-miles-de-agentes-de-ia-en-mainnet-ethereum/
- Taiko, guía de ERC-8004 (T3): https://claim.taiko.xyz/guides/erc-8004-trustless-agent-standard

**Inversión**
- TechCrunch, MoneyFellows US$ 13M (T2): https://techcrunch.com/2025/05/04/moneyfellows-raises-13m-to-take-its-group-savings-model-outside-egypt
- Wamda, MoneyFellows (T2): https://www.wamda.com/index.php/en/2025/05/money-fellows-secures-13-million-expand-digital-saving-offerings-africa
- CairoScene, MoneyFellows (T3): https://cairoscene.com/Business/MoneyFellows-Raises-13M-to-Expand-Savings-Circles-Beyond-Egypt
- FinTech Futures, Esusu Serie C (T2): https://www.fintechfutures.com/venture-capital-funding/esusu-lands-50m-in-series-c-funding
- descubre.vc, PasanaQ (T3): https://www.descubre.vc/pasana-q
- UNICEF Innovation Fund, BX Smart Labs (T1): https://www.unicefinnovationfund.org/story/bx-smart-labs-developing-decentralized-app-saving-circles
- Contxto, Favo (T2): https://www.contxto.com/en/brazil/social-commerce-platform-favo-raises-265m/
- TechCrunch, Muni (2022, T2): https://techcrunch.com/2022/03/22/muni-gives-latin-american-communities-buying-power-through-shopping-app/
- Stanford GSB, caso Muni (T1): https://www.gsb.stanford.edu/faculty-research/case-studies/muni-community-group-buying-latin-america
- iProfesional, inversión en startups 2026 (T2): https://www.iprofesional.com/management/456446-la-inversion-en-startups-argentinas-en-2026-ya-casi-duplico-el-total-invertido-en-2025
- Forbes Argentina, US$ 427M (T2): https://www.forbesargentina.com/negocios/mas-us-427-millones-startups-argentinas-2026-se-reactivo-capital-n88093
- El Observador, VC 2025 (T2): https://www.elobservador.com.uy/argentina/economia-y-negocios/se-reactiva-el-venture-capital-startups-argentinas-captaron-us-270-millones-2025-n6046981
- BA Times, Ualá US$ 3.200M (T2): https://batimes.com.ar/news/economy/argentinas-uala-reaches-us32-billion-valuation-in-new-funding-round.phtml
- El Economista, Ualá (T2): https://eleconomista.com.ar/negocios/uala-recibe-us-195-millones-gigante-global-dispara-su-valuacion-us-3200-millones-n93087
- Hackathons ROSCA onchain (T3): https://chain.link/hack-26/projects/starosca · https://ethglobal.com/showcase/rosca-dapp-sm9ky · https://hackquest.io/projects/ROSA

**Comportamiento y macro**
- Infobae, inflación de septiembre 2026 (T1/T2): https://www.infobae.com/economia/2026/10/13/la-inflacion-en-septiembre-fue-de-19-y-acumulo-334-en-los-ultimos-doce-meses/
- BCRA, REM septiembre 2026 (T1): https://www.bcra.gob.ar/archivos/Pdfs/PublicacionesEstadisticas/informes/relevamiento-expectativas-mercado-2026-09.pdf
- Infobae, REM (T2): https://www.infobae.com/economia/2026/10/06/las-consultoras-que-releva-el-bcra-volvieron-a-recortar-el-crecimiento-del-pbi-y-estimaron-una-inflacion-de-19-para-septiembre/
- El Cronista, REM 2027 (T2): https://www.cronista.com/economia-politica/rem-cual-sera-la-inflacion-y-a-cuanto-cotizara-el-dolar-a-fin-de-ano-segun-mas-de-44-gurues-de-la-city/
- Perfil, REM dólar (T2): https://www.perfil.com/noticias/economia/el-mercado-recalculo-la-inflacion-de-septiembre-y-bajo-la-expectativa-para-el-dolar-que-espera-para-fin-de-ano.phtml
- MDZ, plazo fijo 21-oct-2026 (T2): https://www.mdzol.com/economia/2026/10/21/plazo-fijo-cual-es-el-banco-que-mas-paga-hoy-21-de-octubre-segun-el-bcra-1989692.html
- DolarHoy, plazo fijo 22-oct (T3): https://dolarhoy.com/herramientas-de-inversion/plazo-fijo-que-bancos-pagan-mas-tasa-este-viernes-22-de-octubre-20261022000
- Ámbito, plazo fijo octubre (T2): https://www.ambito.com/economia/cuanto-podes-ganar-si-depositas-10-millones-un-plazo-fijo-30-dias-las-nuevas-tasas-octubre-2026-n6334214
- iProfesional, Mercado Pago octubre 2026 (T2): https://www.iprofesional.com/actualidad/466353-mercado-pago-cuanto-rinde-con-las-nuevas-tasas-en-octubre-2026
- Comparatasas (T3): https://comparatasas.ar/
- CriptoNoticias, neobancos 2026 (T3): https://www.criptonoticias.com/mercados/neobancos-apuntan-agresivamente-argentina-2026/
- CriptoNoticias, encuesta Bitso/Synopsis (2023 ⚠️, T3): https://www.criptonoticias.com/mercados/encuesta-argentinos-comprar-dolares-digitales-ahorrar-bitso-synopsis
- iProUP, Chainalysis LatAm 2026 (T2): https://www.iproup.com/economia-digital/72304-criptomonedas-crecen-en-latinoamerica-que-lugar-ocupa-argentina
- MercoPress, stablecoins en Sudamérica (T2): https://en.mercopress.com/2026/10/20/stablecoins-solana-and-ethereum-which-blockchains-are-winning-in-south-america
- Conclusión, mora en hogares 2026 (T3): https://www.conclusion.com.ar/?p=1452731
- El Economista, mora (T2): https://eleconomista.com.ar/economia/las-familias-endeudan-consumos-basicos-mora-supera-niveles-pandemia-n94723/amp
- La Gaceta, tarjetas (T2): https://www.lagaceta.com.ar/nota/1139813/economia/tasas-uso-riesgos-minimo-tarjeta-al-limite-cuales-son-estrategias-para-no-caer-refinanciaciones
- La Nación, mapa financiero 2026 (T2): https://www.lanacion.com.ar/economia/negocios/el-nuevo-mapa-financiero-de-los-argentinos-en-2026-nid04052026/
- iProfesional, courier 2026 (T2): https://www.iprofesional.com/index.php/comex/451440-importacion-via-courier-puerta-puerta-se-duplica-ratifican-boom-compras-online-2026
- iProUP, Shein/Temu/Amazon 2026 (T2): https://www.iproup.com/economia-digital/71088-los-argentinos-ya-gastaron-millones-en-shein-temu-y-amazon-este-ano.amp
- Rest of World, TikTok Shop LatAm (T2): https://restofworld.org/2025/tiktok-shop-latin-america-shein-temu/
- Momentum Works, TikTok Shop Brasil (T2): https://thelowdown.momentum.asia/tiktok-shop-brazil-gmv-grew-close-to-us50m-in-august/
- GlobeNewswire, databook de social commerce LatAm 2024 ⚠️ (T3): https://www.globenewswire.com/en/news-release/2024/02/22/2833382/28124/en/Latin-America-Social-Commerce-Industry-Projected-to-Surge-Influential-Market-Dynamics-Revealed-in-New-Q1-2024-Databook.html
- iProUP, Mercado Pago renovó su app (T2): https://www.iproup.com/economia-digital/68743-mercado-pago-renovo-su-app-tres-pestanas-dolares-con-cotizacion-y-el-fixture-del-mundial
- Algoritmo Digital, uso de Mercado Pago (T3): https://algoritmodigital.com.ar/news/como-usan-los-argentinos-mercado-pago-para-ahorrar-y-organizar-sus-gastos-en-2025/
- ITIF / Findex 2025 (T2): https://itif.org/publications/2025/09/29/forty-percent-adults-low-middle-income-economies-formally-saved-in-2024/
- BID, Savings Groups in LAC (T1): https://publications.iadb.org/publications/english/document/Savings_Groups_in_Latin_America_and_the_Caribbean_Series_Note_1_What_Are_Savings_Groups_The_Evolution_of_Group_Mechanisms_for_Savings_and_Credit.pdf
- Bloomberg Línea, hábitos digitales 2025 (T2): https://www.bloomberglinea.com/latinoamerica/asi-evolucionan-los-habitos-digitales-en-america-latina-en-2025/
- KQED, tanda entre jóvenes latinos (T2): https://www.kqed.org/news/12090533/remember-your-moms-tanda-young-latinos-are-giving-it-a-tech-savvy-twist-2
- TodoJujuy, billeteras (T3): https://www.todojujuy.com/mundo/argentina-lidera-el-ranking-pagos-billetera-virtual-america-latina-n267642

**Regulación y predicciones**
- iProUP, BCRA y cripto en una segunda presidencia (oct-2026, T2): https://www.iproup.com/economia-digital/72139-el-bcra-evalua-habilitar-cripto-en-una-segunda-presidencia-de-milei
- iProUP, BCRA posterga cripto en bancos (T2): https://www.iproup.com/economia-digital/72166-bcra-posterga-cripto-en-bancos-efecto-en-mercado-pago-cocos-y-uala
- Develop Argentina, CNV RG 1058/2025 (T3): https://developargentina.com/blog/bancos-argentinos-cripto-abril-2026
- Finnosummit, agentic commerce LatAm (T3): https://www.finnosummit.com/en/the-future-of-agentic-commerce-financial-infrastructure-and-ecosystem-maturity-in-latin-america/
- Tenten, tamaño del agentic commerce (T3): https://tenten.co/shopify/agentic-commerce-market-size/
