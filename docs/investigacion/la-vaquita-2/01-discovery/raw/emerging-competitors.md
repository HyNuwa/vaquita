# B4 · Competidores emergentes y stealth — La Vaquita 2.0

> Investigación del 2026-10-24. Agente B4 (discovery). Fuentes: búsquedas web, READMEs de GitHub y metadata de la API de GitHub (`created_at` / `pushed_at`) consultada el 2026-10-24.
> **Tiers de fuente:** T1 = fuente primaria verificable (repo, API de GitHub, página oficial del producto); T2 = prensa o listados de terceros; T3 = afirmación del propio proyecto que no se pudo verificar (tracción autodeclarada, por ejemplo).
> No se reperfilan Money Fellows, Esusu, Sommos/PasanaQ, Tanda MX, Ronda, ChamaVault, Circlepot ni AjoAI (ya conocidos).

## TL;DR

1. **Dentro del mismo hackathon (Agents on Open Rails, Track Stable Agents LatAm) hay dos proyectos de "plata en grupo" en wARS:** **TesorerIA** (fondo común con tope de gasto, votación y **un grupo real en mainnet con 8 miembros desde el 15/10**) y **Comunyfi** (pozo comunitario votado con fichitas, de jujuy.dev). Ninguno hace **junta rotativa por turnos** ni **comercio asociado**.
2. **En el hackathon anterior de Celo (Agents at Work, sept-oct 2026) ya hubo dos agentes de ajo/esusu** (Ajo Agent y Ajo Circle, de eddiemessiah), uno de ellos **bot de Telegram non-custodial** muy parecido a nuestro diseño. El jurado de Celo **ya vio "ROSCA + agente + Telegram"**.
3. **En Celo hay como diez repos de ROSCA de 2026** (AjoChain, CeloCircle, Pamoja, Paycon, ChamaScore, CeloAjo, AjoAI...), casi todos en USDT/cUSD/USDC, orientados a África, con tracción cero o testnet.
4. **Nadie combina pozo de turno + compra con descuento en comercio asociado.** No encontramos ningún competidor, onchain ni fintech, que haga el puente ROSCA → comercio. Es el ángulo libre.
5. Los grandes jugadores (Mercado Pago, Ualá, Ripio, MiniPay) **no tienen ahorro rotativo grupal público** (DATA GAP sobre betas internas). La excepción es **BancoSol (Bolivia)**, que tiene "Pasanaku Digital" dentro de su app bancaria.

## 1. Tabla resumen

| Proyecto | Qué hace | Chain/canal | Estado (fecha) | Tracción | Diferencia con La Vaquita | Amenaza |
|---|---|---|---|---|---|---|
| **TesorerIA** (ruizemanuel) | Tesorero IA de un fondo grupal: aportes a contrato, reembolso de gastos hasta un tope semanal, el excedente va a votación, resumen semanal | Celo mainnet, wARS + USDT, web Next.js con passkeys, Pimlico | Lanzado en mainnet; repo creado el 2026-10-08, último push el 2026-10-24, 254 commits | T3: 1 grupo, 8 miembros, ~ARS 80.100 en la 1.ª semana (al 15/10) | Fondo común con gastos, no junta rotativa; sin turnos, sin comercio; web, no Telegram | **ALTA** (mismo track, mismo token, "plata de grupo", ya tiene usuarios reales) |
| **Comunyfi** (FrancoDuran23) | Pozo comunitario de jujuy.dev; se reparte con "fichitas" votadas por Telegram | Celo mainnet (config), wARS, Telegram + Luma | MVP sin tx enviadas; creado el 2026-10-07, 2 commits | Ninguna visible | Grants comunitarios, no ahorro rotativo; el agente custodia el pozo | MEDIA (comparte la narrativa "comunidad + pozo en wARS") |
| **Ajo Circle** (eddiemessiah) | Bot de Telegram para ROSCA: arma rondas, manda links de pago, recuerda a los atrasados, verifica pagos onchain; pago miembro a miembro, **non-custodial** | Celo, USDT / USA₮ / cNGN, MiniPay | Piloto; creado el 2026-09-15, 2 commits; hackathon Agents at Work | 0 estrellas, sin uso declarado | Igual en mecánica; distinto en moneda (USD/NGN, África), sin metas, sin comercio, sin LLM | **ALTA como precedente** (el jurado de Celo ya lo vio) |
| **Ajo Agent** (eddiemessiah) | Agente que paga el pozo semanal (5 × 5 USA₮) al siguiente del turno | Celo mainnet, USA₮ | Repo de hackathon; creado el 2026-09-10, 2 commits | 0 | Custodial (el agente tiene el pozo); una sola función | MEDIA (precedente) |
| **Paycon** (toluwanibakare) | "AI-powered group savings": ajo, metas, fondo de emergencia, "DeFAI agent" | Celo, Telegram + web | "Build in progress"; creado el 2026-07-11, 10 commits | 0 | Mismo pitch de producto (ROSCA + metas + agente + Telegram) pero sin wARS ni comercio | MEDIA |
| **ChamaScore Agent** (devanshug2307) | Score de confianza para chamas; payouts rotativos; reputación ERC-8004 de miembros | Celo Sepolia, USDC, A2A/MCP | Demo viva, cron cada 6 h; 61 commits; hackathon celo-onchain-agents | T3: agente #338, 3 miembros, 2 rondas en testnet | Reputación del circle con ERC-8004 (ángulo que podríamos querer); testnet | MEDIA (ya usó ERC-8004 para savings circles) |
| **AjoChain / CeloCircle / Pamoja / CeloAjo** | Mini Apps de ROSCA para MiniPay | Celo, cUSD/USDT | Repos de 2026-03 a 2026-05 | 0 visible | Sin agente IA, sin wARS, África/Indonesia | BAJA |
| **Alcancía** (artugrande) | Agente de ahorro **individual** por metas; alcancías onchain; conversión vía Textile | Celo mainnet, wARS/wBRL/wMXN/..., ERC-8004 #9911 | Creado el 2026-10-15, 22 commits | 0 | Individual, no grupal; el autor dio la Builder Session del hackathon (probable DevRel/mentor) | MEDIA (es la "referencia" que el jurado tiene en la cabeza para "ahorro en wFIAT") |
| **Seña / Trato Hecho / Tildai / Cobrador / Vuelto / Respend** | Cobros, señas, caja de comercio, reembolsos en wARS | Celo, wARS, Telegram/x402 | Repos de hackathon, 2026-10-17 a 2026-10-24 | 0 a 1 estrella | B2B/comercio; ninguno grupal. **Tildai** tiene comercios en Telegram con QR (posible socio/competidor en el lado comercio) | BAJA (MEDIA para Tildai en el lado comercio) |
| **BreadchainCoop/saving-circles** | Contratos ROSCA; v1.1.0 (2026-10-05) agrega "goal saving circles" | EVM (chain no indicada en el release) | Librería activa desde 2024-11 | 2 estrellas | Infraestructura, sin agente ni UX; metas grupales igual que nuestras "metas libres" | BAJA (posible base técnica) |
| **armina / Starosca / PACT** (Chainlink hackathon 2026) | ROSCA con yield, colateral, IA para yield, x402 para crédito | Base Sepolia / Base / Avalanche | Proyectos de galería, sin premio listado | 0 visible | DeFi-first, sin LatAm ni comercio | BAJA |
| **Vaquita Protocol** | Save-to-earn gamificado con penalidad por retiro anticipado | Base | Lanzado; TVL ~USD 350 a 2.800 (T2, DefiLlama/AlphaGrowth) | Muy baja | **Choque de nombre** "Vaquita" en el ecosistema cripto LatAm; producto distinto | BAJA (riesgo de marca/SEO) |
| **BancoSol Pasanaku Digital** | Pasanaku dentro de las apps appSol/altoke: grupos, recordatorios, cobro a atrasados | App bancaria, Bolivia, Bs | Lanzado (fecha: DATA GAP); tope Bs 2.000 por participante | DATA GAP | Banco, fiat, solo clientes; sin comercio | BAJA para el hackathon, MEDIA como señal de que "los bancos ya lo hacen" |
| **TandaPlus** | Tandas/cundinas/pasanakus por web, WhatsApp y Android | Fiat, multi-país | Lanzado (fecha: DATA GAP) | DATA GAP | Off-chain, sin IA declarada | BAJA |
| **Mercado Pago "Amigos"** | Dividir gastos, pedir plata entre contactos (lanzamiento reportado en feb 2026) | Fiat AR | Lanzado | Base masiva | Split de gastos, no ahorro rotativo | BAJA hoy, ALTA si lo extienden |

## 2. Detalle de los 5 más relevantes

### 2.1 TesorerIA — el competidor directo del hackathon (T1 repo, T3 tracción)
- **Qué hace:** fondo grupal en wARS. Los miembros aportan a un smart contract; el agente convierte USDT → wARS (Uniswap v3), reembolsa gastos hasta un **tope semanal**, lleva la cuenta de quién debe la cuota, escribe un resumen semanal (con frases fijas, sin LLM) y manda a **votación** el gasto que supera el tope.
- **Arquitectura:** "the part that signs and moves money is deterministic code with no language model"; el chat (Claude) solo propone y nunca firma. **Es el mismo principio que nuestra regla "el LLM propone, el código decide"**. Passkeys, gas patrocinado (Pimlico), salida a Ripio, Chainlink USD/ARS.
- **Estado:** repo creado el 2026-10-08, 254 commits, último push el 2026-10-24 (activísimo). Track Stable Agents LatAm.
- **Tracción (autodeclarada, T3):** al 15/10/2026, un grupo real de 8 miembros, ~ARS 80.100 aportados en la primera semana, 11 aportes (7 en USDT, 4 en wARS) y un gasto de ARS 80.000 partido en 60.000 reembolsados + 20.000 aprobados por votación de 5 miembros.
- **Diferencia:** es un **fondo común de gastos** (equipo de fútbol, grupo de amigos), no una **junta rotativa** con turnos ni un pozo que se cobra entero. No tiene comercio asociado. Canal web, no Telegram.
- **Amenaza: ALTA.** Para un jurado apurado, "plata de grupo en wARS con agente" ya está tomado por un proyecto con usuarios reales y commits diarios. **Tenemos que diferenciarnos explícitamente en el pitch:** rotación/turnos + metas + comercio.

### 2.2 Ajo Circle (y Ajo Agent) — precedente del jurado de Celo (T1)
- **Qué hace:** bot de Telegram (`/newcircle` → `/join` → `/begin`) donde cada ronda un miembro cobra y los demás le pagan **directo desde su wallet**, sin wallet común. El servidor lee el log de Transfer, chequea el tag de atribución y lo postea en el grupo. "It never holds anyone's money." Los atrasos se recuerdan, no se penalizan ("no collateral in v1").
- **Chain:** Celo, USDT (MiniPay, gas por CIP-64), USA₮, cNGN. Tiene script de registro ERC-8004.
- **Estado:** piloto con almacenamiento en un JSON; 2 commits; creado el 2026-09-15. Hackathon Celo **Agents at Work**, track "Value Moved". Ajo Agent (2026-09-10) es la variante custodial de "un solo verbo".
- **Diferencia:** misma mecánica non-custodial y mismo canal que nuestro diseño. Le faltan moneda local LatAm (wARS), LLM conversacional, metas libres y comercio.
- **Amenaza: ALTA como precedente, BAJA como competidor real.** El jurado/DevRel de Celo ya vio "ROSCA en Telegram en Celo" hace un mes. Ajo Agent también sostiene (sin fuente) que "no project built around a general-purpose agent has ever placed in the top tier": trabajo acotado + distribución propia.

### 2.3 Comunyfi — "comunidad + pozo wARS" en el mismo track (T1)
- **Qué hace:** pozo comunitario de jujuy.dev. Quienes hicieron check-in en Luma reciben fichitas por Telegram (tope de 100 por persona y 40 por proyecto) y las reparten entre proyectos locales; tras una aprobación humana, el agente paga en wARS en proporción.
- **Estado:** creado el 2026-10-07, 2 commits, sin tx en mainnet; ERC-8004 y x402 son placeholders.
- **Diferencia:** reparte grants, no hace ahorro rotativo. Custodial.
- **Amenaza: MEDIA.** Le saca a "comunidades" la novedad, pero tiene distribución propia real (una comunidad dev con eventos). Para el jurado, comunidad + Telegram + wARS ya aparece en otro proyecto.

### 2.4 Paycon + ChamaScore — el pitch "AI group savings" ya escrito (T1)
- **Paycon** (creado el 2026-07-11, 10 commits, "build in progress"): "AI-powered group savings on Celo. Run Ajo/Esusu savings circles, goal pools, and emergency funds — all managed by your DeFAI agent. Multi-channel via Telegram + Web." **Es casi palabra por palabra nuestra descripción de producto**, sin wARS ni comercio. Custodia y LLM: DATA GAP.
- **ChamaScore** (61 commits, Celo Sepolia, agente ERC-8004 #338): score de confianza de miembros a partir del historial del contrato, payouts rotativos, reputación del agente dada por los miembros, endpoints A2A/MCP. Se presentó a `celo-onchain-agents` (track "best-agent").
- **Amenaza: MEDIA.** Ninguno tiene tracción, pero los dos demuestran que "ROSCA + agente + metas" y "ROSCA + ERC-8004 reputación" ya existen como idea en Celo.

### 2.5 Alcancía — la referencia mental del jurado para "ahorro en wFIAT" (T1)
- **Qué hace:** ahorro **individual** por metas anuales; cada meta es una alcancía onchain propia, el agente reparte el sueldo entrante y convierte vía Textile; para romper una meta pide motivo, adivinanza y 72 h de espera. ERC-8004 #9911 en mainnet; soporta los 6 wFIAT.
- **Autor:** `artugrande`, que también publicó las slides de la Builder Session del hackathon y PRs de wFIAT en `celo-org/celopedia-skills`. **Inferencia (no confirmada):** es DevRel/mentor y Alcancía funciona como demo de referencia. El "guardián amigo" grupal figura solo en el roadmap.
- **Amenaza: MEDIA.** No compite en grupo, pero fija la vara técnica (mainnet, ERC-8004, multi-wFIAT, Textile) y "metas de ahorro" deja de ser novedad por sí sola.

## 3. Grandes jugadores (R4)

| Jugador | Señal encontrada | Fecha | Tier |
|---|---|---|---|
| Mercado Pago (AR) | Función "Amigos" para dividir gastos y pedir plata; "Torneos de amigos" del Fixture 2026 con pozos entre amigos, cuestionados por loterías y cambiados a "Amistoso"/"Porotos" | feb 2026 / jun 2026 | T2 |
| Ualá | Solo cuenta remunerada por niveles (hasta 25 % TNA, jun 2026). Sin ahorro grupal | jun 2026 | T2 |
| Ripio | Sin función pública de ahorro grupal ni agentes en la app (APK 6.5.9 a 7.0.1, abr-jul 2026, sin notas). Su apuesta visible es wFIAT + hackathon | 2026 | T2 |
| MiniPay (Opera) | Más de 50 Mini Apps y más de 400 M tx de Mini Apps (Q1 2026); hasta USD 1 M en CELO para builders (abr 2026); Kiln "earn" en USDT (feb 2026). **No hay** savings circles ni "Pockets" oficiales | 2026 | T1/T2 |
| BancoSol (BO) | Pasanaku Digital en appSol/altoke; tope Bs 2.000; no deja avanzar de turno si alguien no pagó | fecha: DATA GAP | T1 |
| Hakbah (Arabia Saudita) | Jameya digital, más de 2 M de usuarios registrados (fuera de LatAm, sirve de comparable) | feb 2026 | T2 |

Patentes y ofertas de empleo: **DATA GAP**, no se encontraron señales indexadas.

## 4. Síntesis para el jurado (R6)

**Lo que el jurado va a ver como "ya hecho":**
1. **Fondo de grupo en wARS con agente que no firma con LLM y tope de gasto:** TesorerIA, con usuarios reales en mainnet. Si nuestro pitch suena a "manejamos la plata del grupo", perdemos la comparación.
2. **ROSCA en Telegram en Celo, non-custodial, con recordatorios:** Ajo Circle (Agents at Work, sept 2026), más una decena de repos ajo/chama.
3. **"AI group savings" con metas y fondo de emergencia:** Paycon.
4. **Reputación ERC-8004 en savings circles:** ChamaScore.
5. **Ahorro por metas en wFIAT con ERC-8004 en mainnet:** Alcancía.
6. **Pozo comunitario votado:** Comunyfi.

**Lo que no tiene nadie (ángulo libre):**
1. **El pozo de turno como poder de compra:** que el turno cobre en un **comercio asociado con descuento** (el comercio cobra en wARS, el grupo obtiene un precio mejor y el comercio consigue demanda adelantada y garantizada). No encontramos **ningún** proyecto onchain ni fintech que conecte ROSCA con comercio. Tildai y Cobrador tienen el lado comercio en wARS pero sin grupos, así que **podrían ser socios del demo**, no competidores.
2. **Junta rotativa en moneda local argentina (wARS):** todos los ROSCA de Celo están en USDT/cUSD/USDC/cNGN y apuntan a África. En el track LatAm, el único con turnos somos nosotros (TesorerIA y Comunyfi no rotan).
3. **Vocabulario y reglas rioplatenses** (junta, vaca, "a quién le toca"), con importes en pesos y reglas de atraso deterministas.
4. **Metas libres por turno** (cada uno cobra para su objetivo) unidas a una compra concreta: Alcancía hace metas individuales y Paycon "goal pools", pero ninguno ata la meta a un comercio.

**Recomendaciones para el pitch:**
- Abrir con **comercio + turno**, no con "ahorro grupal con IA" (ya está gastado).
- Una diapositiva "por qué no somos TesorerIA ni Ajo Circle" en una línea cada uno.
- Mostrar **una compra real** en un comercio asociado en mainnet. La tracción de TesorerIA (8 personas reales) es la vara: aunque sea una junta chica entre los tres del equipo más conocidos, que sea real.
- Cuidar el nombre: "Vaquita Protocol" existe en Base (save-to-earn). Conviene "La Vaquita" con artículo, o chequear la colisión.

## 5. Data gaps

- **DATA GAP:** lista oficial de proyectos inscriptos o ganadores de Agents on Open Rails (no es pública al 2026-10-24); el relevamiento sale de búsquedas en GitHub y puede tener huecos.
- **DATA GAP:** resultados y premios del hackathon Agents at Work (no se sabe si Ajo Circle o Ajo Agent ganaron).
- **DATA GAP:** tracción de TesorerIA verificada onchain (los números salen del README, T3; no se revisó la dirección del contrato en el explorador).
- **DATA GAP:** custodia, LLM y estado de mainnet de Paycon.
- **DATA GAP:** fecha de lanzamiento y uso de BancoSol Pasanaku Digital y de TandaPlus.
- **DATA GAP:** betas internas, patentes o vacantes de Mercado Pago, Ualá, Ripio y MiniPay sobre ahorro grupal (nada indexado).
- **DATA GAP:** Product Hunt y Google Play para "vaquita"/"junta" en AR/MX/PE 2026 (solo apareció Pasanaku en Play, actualizada el 2026-08-25; "Capital for live" ya no está en Play).
- **DATA GAP:** la chain de BreadchainCoop/saving-circles v1.1.0 y sus usuarios.
- **DATA GAP:** Colosseum Agent Hackathon (Solana, feb 2026): no se encontró la lista de ganadores; no apareció ningún ROSCA entre los ganadores reportados del Frontier.

## 6. Fuentes

Hackathon Agents on Open Rails (wARS):
- https://github.com/ruizemanuel/TesorerIA (T1; API: creado el 2026-10-08, push el 2026-10-24)
- https://github.com/FrancoDuran23/comunyfi (T1; creado el 2026-10-07)
- https://github.com/artugrande/alcancia (T1; creado el 2026-10-15)
- https://github.com/artugrande/stable-agents-latam-irl (T1; slides de la Builder Session, 2026-10-13)
- https://github.com/AugustoGL/Agents-on-open-rail (Seña; T1; creado el 2026-10-18)
- https://github.com/Antony27c/Tildai (T1; estado al 20/10/2026)
- https://github.com/lorenzo00005/cobrador (T1; 2026-10-20)
- https://github.com/JoaquinGiorgis/vuelto (T1; 2026-10-17)
- https://github.com/Gastonfoncea/respend (T1; 2026-10-17)
- https://github.com/mterrera29/trato-hecho (T1; 2026-10-17)
- https://github.com/mswitach/vidriera , https://github.com/mswitach/lupa-celo-x402 (T1)
- https://github.com/emilianooferreyra/sme-treasury-agent (T1)
- https://github.com/facundogrilloucc/agents-on-open-rails (T1)
- https://github.com/celo-org/celopedia-skills/pull/92 (T1; wFIAT en Celo, 2026-10-21)

ROSCA en Celo y otras chains:
- https://github.com/eddiemessiah/ajo-circle (T1; 2026-09-15)
- https://github.com/eddiemessiah/ajo-agent (T1; 2026-09-10)
- https://github.com/toluwanibakare/paycon (T1; 2026-07-11)
- https://github.com/devanshug2307/chamascore-agent (T1; 2026-06-11)
- https://github.com/MickeeJay/AjoChain , https://github.com/shihab903/celocircle , https://github.com/yowanda/pamoja-celo , https://github.com/olugbojak-create/CeloAjo (T1)
- https://github.com/BreadchainCoop/saving-circles/releases/tag/v1.1.0 (T1; 2026-10-05)
- https://github.com/joekeyz8/ajosave (Stellar; T1)
- https://chain.link/hack-26 (armina, Starosca, PACT; T1)
- https://github.com/celo-org/savings-circle-demo (archivado en 2022; T1)
- https://defillama.com/protocol/vaquita-protocol , https://alphagrowth.io/vaquita-protocol (T2)

Grandes jugadores y fintech:
- https://www.bancosol.com.bo/soluciones-digitales/servicios-digitales/pasanaku-digital (T1)
- https://tandaplus.com/ (T1)
- https://play.google.com/store/apps/details?id=com.pasanaku.miapp (T1)
- https://www.iproup.com/finanzas/13028-como-funciona-amigos-la-nueva-funcion-de-mercado-pago-para-compartir-gastos (T2)
- https://chequeado.com/el-explicador/polemica-por-el-prode-de-mercado-pago-en-el-mundial-2026-tras-los-cuestionamientos-la-plataforma-cambio-el-torneo-de-amigos/ (T2)
- https://www.iproup.com/economia-digital/68894-uala-sube-su-cuenta-remunerada-al-25-tna-como-llegar-al-nivel-mas-alto-en-junio (T2)
- https://forum.celo.org/t/minipay-update-q1-2026/13273 (T1)
- https://press.opera.com/2026/04/22/minipay-builders-incentive-and-roadshow/ (T1)
- https://www.kiln.fi/post/kiln-powers-stablecoin-earn-product-for-minipay-users-on-celo-targeting-1-3b-unbanked-globally (T1)
- https://www.semafor.com/article/02/03/2026/saudi-traditional-savings-circles-go-digital (T2; Hakbah)
- https://solanacompass.com/news/colosseum-announces-26-winners-of-the-solana-frontier-hackathon-the-largest-crypto-hackathon-ever (T2)
- https://cointelegraph.com/news/circle-unveils-agent-stack-for-ai-driven-stablecoin-transactions (T2; contexto agentic payments)
