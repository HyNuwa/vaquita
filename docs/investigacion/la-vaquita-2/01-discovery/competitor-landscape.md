# Competencia, sustitutos y espacio defendible

**Fase:** 3 — Investigación de mercado
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Media

---

## Panorama: dos competencias distintas

**[Opinion] Hallazgo mayor — confianza Media.** En el mercado, la amenaza principal es **seguir con WhatsApp y transferencias o usar productos financieros conocidos**; en el hackathon, es parecer otro agente que organiza plata grupal. Ganar una comparación técnica con un prototipo no prueba que un grupo cambie su manera de pagar (`raw/direct-competitors.md`, `raw/indirect-competitors.md`, `raw/emerging-competitors.md`).

**[Data]** No hay participaciones de mercado que permitan medir concentración de ROSCA digital en Argentina. Money Fellows es el comparable de mayor escala relevado, concentrado en Egipto; Sommos vende infraestructura institucional; las alternativas argentinas de pagos y crédito tienen bases grandes, pero sus clientes totales no son usuarios de ahorro grupal (`raw/direct-competitors.md`). **[Opinion]** La oferta especializada parece fragmentada y la distribución está en manos de incumbentes y organizadores; no corresponde llamar “mercado vacío” a un problema que ya se resuelve gratis (confianza Media).

**[Opinion]** Se normalizan tiers: T1 para normativa, organismos, registros y evidencia técnica verificable; T2 para prensa y documentación comercial; T3 para directorios, redes y testimonios. Un repositorio T1 demuestra implementación pública, no uso; un README con tracción autodeclarada no pasa a ser auditoría independiente. Alta requiere varias T1 convergentes; la mayoría de las conclusiones comerciales de este documento tiene confianza Media o Baja.

## Matriz competitiva

**[Data]** La matriz resume las ofertas y antecedentes documentados en `raw/direct-competitors.md` (B1), `raw/indirect-competitors.md` (B2), `raw/competitor-gtm.md` (B3) y `raw/emerging-competitors.md` (B4), con correcciones de `raw/geographic.md` y `raw/partnerships.md`. “Sin dato” significa no verificado, nunca cero. Las fortalezas y debilidades son **[Opinion]**; pricing y tracción son **[Data]** atribuidos, con sus límites.

| Nombre | Producto | Pricing | Target | Funding | Tracción | Fortaleza clave | Debilidad clave |
|---|---|---|---|---|---|---|---|
| **WhatsApp + transferencias** | Junta entre conocidos, seguimiento manual | $0 de herramienta/transferencia relevada; posibles retribuciones informales sin cuantificar | Grupos preexistentes | No aplica | Uso local de juntas sin medir | Confianza y hábito ya instalados | Trabajo del organizador; incumplimiento poscobro sin cobertura. B2; Media sobre alternativa, Baja sobre tamaño. |
| **Naranja X Cuenta Compartida** | Cuenta hasta diez integrantes, Frascos, pagos y movimientos compartidos | Costo específico no confirmado | Parejas, familias, amigos argentinos | Grupo Galicia; ronda del producto sin dato | Lanzamiento ago-2026; ≈10 millones de clientes de la empresa, **sin adopción del producto medida** | Marca, pesos y distribución | No adelanta un pozo rotativo; sigue habiendo riesgos de cuenta y operación. B1/D2; Media. |
| **Mercado Pago** | Reservas, Amigos, pagos, cuotas y promociones | P2P $0; tasas y crédito según producto | Usuarios y comercios argentinos | Incumbente; sin monto pertinente en raw | >15 millones de reservas **creadas**, no personas; usuarios de Amigos sin dato | Puede resolver la compra sin incorporar una junta | No se relevó ROSCA por turnos ni roadmap confirmado. B2/A2; Media. |
| **Ualá** | Cuenta remunerada y crédito/BNPL | Según producto; no hay tarifa ROSCA | Público bancarizado o con cuenta digital | USD 195 millones en mar-2026 según prensa | >11 millones de clientes regionales; sin ahorro grupal medido | Capital y relación financiera previa | No se encontró producto rotativo. B2/A2; Media. |
| **Money Fellows** | ROSCA, tarjeta y acuerdos comerciales | Usuario: hasta 16% temprano→0% final en blog; 5–6% son referencias antiguas; promociones distintas | Egipto | >USD 60 millones acumulados; USD 13 millones en may-2025 | >8 millones registrados; ≈350.000 MAU y USD 1.500 millones, prensa oct-2025; origen empresarial | Gestión de riesgo, banco y distribución | Usa capital propio para huecos; no valida ingreso exclusivamente comercial. B1; Media. |
| **Sommos / PasanaQ** | Ahorro y perfil crediticio de marca blanca | SaaS institucional; monto sin dato | Bancos y entidades LatAm | ≈USD 180.000 presemilla en 2022; otras cifras difieren | >100.000 usuarios vía diez entidades, **autodeclarado** jun-2026 | Relación con distribuidores institucionales | Sin pricing ni actividad verificados por cliente; venta lenta. B1/B3; Baja para escala. |
| **BancoSol Pasanaku Digital** | Turnos y recordatorios dentro del banco | Tarifa sin dato; tope publicado Bs 2.000 por persona | Clientes bolivianos | Banco; sin inversión del producto | Oferta pública; adopción sin dato | Confianza bancaria y moneda habitual | No garantiza que los miembros cumplan; sin comercio relevado. B4/D2; Media sobre oferta. |
| **Tanda+ / TandaPlus** | Organización de tandas; Tanda+ anuncia tienda futura | Tanda+: una gratis y MXN 39 por adicional; TandaPlus sin tarifa corroborada | México/región según oferta | Sin dato | Sitios publicados; sin usuarios auditados; tienda **no lanzada en evidencia** | Invitación sobre canales existentes | Implementación comercial y escala sin verificar. B2/B3/D2; Media sobre condiciones, Baja sobre tracción. |
| **Mycon** | Consórcio regulado vendido por chatbot | Usuario: 9,99% total, dato de 2022 | Bienes grandes en Brasil | Fundadores/Coimex | 14.000 clientes y R$2.000 millones vendidos en 2021, **antiguo** | Operador regulado y distribuidor | Producto y capital distintos; pricing actual faltante. B1; Baja para comparación actual. |
| **Hacé Una Vaquita** | Colecta con vouchers, sin rotación | Referencia histórica: 10% al retirar, gratis si se gasta en asociados; comisión comercial sin dato | Regalos/eventos argentinos | Sin dato | Dominio no resolvía el 24/10; cierre o migración sin confirmar | Antecedente local del incentivo comercial | Sin continuidad ni economía verificadas; no demuestra éxito del modelo. B2/C2; Baja actual. |
| **Ronda** | ROSCA semanal, Farcaster, Self | Sin dato | Comunidades en Celo | Premios ETHGlobal BA | Prototipo premiado; usuarios sin dato | Precedente visible en Buenos Aires | Sin negocio ni adopción medidos; moneda no especificada en showcase. B1; Media técnica. |
| **AjoAI** | ROSCA, agente y reputación ERC-8004 | Gratis; yield/x402 propuestos | Ajo/esusu, África | Grants declarados | Mainnet autodeclarada; sin uso verificado | Ya ocupa “agente + ROSCA + identidad” | Ingreso por rendimiento aún propuesto; sin comercios relevados. B1; Baja comercial. |
| **Ajo Circle** | Bot Telegram; aportes directos, enlaces, conciliación y recordatorios | Sin dato | Círculos en moneda USD/NGN | Sin dato | Repo sept-2026; piloto declarado, uso sin dato | Precedente muy cercano de arquitectura y canal | Sin compradores ni modelo comercial demostrados. B4; Media técnica. |
| **ChamaAgent** | ROSCA cUSD y agente; escrow por grupo | Sin dato | Chamas | Sin dato | Registro #9146; metadata inconsistente mainnet/testnet; sin usuarios | Implementación de agente registrada | Registro no prueba operación sostenida ni cobertura. B1/B3; Media sobre registro, Baja sobre servicio. |
| **Circlepot** | ROSCA con colateral y billetera embebida | Usuario: 0,2% del pago y extras declarados | África/LatAm según proyecto | USD 0 declarado, sin auditoría | Sin tracción verificada | Explicita quién aporta garantía | Exige liquidez previa y no usa moneda local del piloto. B1; Baja comercial. |
| **ChamaVault / Celo-Save** | ROSCA y puntaje de cumplimiento | Yield/PRO/futuro fee, según proyecto | África | Sin inversión externa declarada | Sin usuarios corroborados | Opciones de distribución y seguimiento | No prueban sostenibilidad ni recuperación de deuda. B1/B3; Baja. |
| **TesorerIA** | Fondo común de gastos wARS/USDT, topes y votación | Sin dato | Grupos; mismo hackathon | Sin dato | README: ocho miembros y ≈$80.100 primera semana; **sin auditoría on-chain** | Relato de operación real y facilidad con passkeys | No rota pozos; tracción autodeclarada. B4; Media técnica, Baja sobre uso. |
| **Comunyfi** | Asignación comunitaria de fondos con votos | Sin dato | Comunidad jujuy.dev; mismo hackathon | Sin dato | Repo sin transacciones enviadas según relevamiento | Comunidad identificada y mismo wARS | No es ahorro rotativo; custodia y partes incompletas. B4; Media técnica. |
| **Vaquita Protocol** | Ahorro gamificado con penalidad; Base→Stellar según antecedentes | Penalidades/recompensas; tarifa actual sin dato | Ahorro cripto | Presemilla/grants sin monto confirmado | 182 wallets autodeclaradas en 2024; TVL histórico ≈USD 350–2.800 | Nombre y presencia previos en ecosistema | Producto distinto; escala baja y datos antiguos. B1/B4; Baja actual. |

## Qué enseñan los precedentes cuando se corrigen las inferencias

**[Opinion] Hallazgo mayor — confianza Media.** Money Fellows demuestra que puede haber negocio en digitalizar círculos **con cobro al usuario, selección de riesgo, acuerdos y capital**. No demuestra que un marketplace pequeño pueda financiar coordinación e impagos solo con el comercio. A4 y B3 exageran la prueba del pagador comercial; B1 detalla mejor quién paga y quién financia. Sus 328 acuerdos no son necesariamente 328 comercios: B3 los describe como empresas e instituciones (`raw/adjacent-markets.md`, `raw/competitor-gtm.md`, `raw/direct-competitors.md`).

**[Data]** El cierre de Yahoo Tanda en mayo de 2018 está documentado; era estadounidense, no una prueba de que “todas las apps mexicanas murieron”. Ahorro Libre y Zaveapp tienen antecedentes antiguos sin continuidad verificada; los sitios actuales de Tanda+ y TandaPlus impiden generalizar el cementerio (`raw/direct-competitors.md`, `raw/competitor-gtm.md`; confianza Media para cierre de Yahoo, Baja para estado de las demás).

**[Opinion]** Esusu encontró otro producto y otro pagador institucional; Sommos tomó el canal bancario. Eso sugiere buscar quién obtiene un beneficio económico medible de la coordinación, pero no obliga a copiar el pivote ni prueba que los círculos originales hayan sido inviables por una única causa (`raw/competitor-gtm.md`, `raw/trends.md`; confianza Media).

**[Opinion]** Hacé Una Vaquita es una pregunta incómoda más útil que un benchmark favorable: su incentivo comercial se parece, pero el retiro pago hacía que no fuera “gratis sin restricciones”. Un fallo de DNS no certifica cierre ni causalidad. Hasta reconstruir continuidad, ventas y comisiones, el caso debe pesar como **señal negativa sin diagnóstico**, no validación ni sentencia (`raw/demand-signals.md`; confianza Baja sobre desenlace).

## Mapa de posicionamiento

**[Opinion] Ejes propuestos — confianza Media como marco, Baja como oportunidad.** Eje horizontal: coordinación de plata ya disponible → acceso anticipado a una suma financiada por pares. Eje vertical: herramienta manual/gratuita → servicio con distribución comercial y responsabilidad explícita frente al riesgo.

- **[Data]** WhatsApp y planilla ocupan coordinación manual, con rotación posible y confianza personal; Naranja X y MP resuelven cuentas, metas o gastos con menor complejidad de adhesión (`raw/indirect-competitors.md`, `raw/geographic.md`).
- **[Data]** Money Fellows ocupa acceso anticipado con selección y respaldo financiero; Mycon representa ahorro regulado para bienes; Circlepot agrega garantía aportada por participantes (`raw/direct-competitors.md`).
- **[Data]** Los agentes Celo ocupan automatización de turnos y reputación con uso escasamente documentado; TesorerIA automatiza gastos comunes (`raw/emerging-competitors.md`).
- **[Assumption]** La Vaquita podría ocupar **junta privada en pesos, obligaciones comprensibles y compra opcional con descuento incremental**, financiada por una venta atribuible. Ese punto está libre de un líder demostrado en los insumos, pero el terreno libre puede reflejar falta de margen o riesgo legal. No se debe dibujar como “adelanto garantizado y gratis”.

## GTM: qué parece funcionar y qué no está probado

| Canal | Evidencia | Decisión para La Vaquita **[Opinion]** |
|---|---|---|
| Referente y recomendación personal | **[Data]** Money Fellows describe referidos desde 2019 y premios condicionados a entrar en un círculo; no publica CAC transferible. B3. | Priorizar organizador que completa un grupo, con costo de horas incluido. Confianza Media sobre mecanismo, Baja sobre rendimiento local. |
| Distribución institucional | **[Data]** Sommos vende a entidades; Money Fellows declara acuerdos. B1/B3. | Explorar después de una réplica independiente; exige venta y cumplimiento que el equipo todavía debe desarrollar. Confianza Media. |
| Líderes comunitarios | **[Data]** Muni/Favo captaron comunidades; B3 aporta cierre de Muni en nov-2022 que A2/A4 no tenían, y cierre de Favo. | Rescatar presentaciones de confianza, no inventario, entrega ni subsidios. No inferir que el canal era rentable por captar usuarios. Confianza Media. |
| Afiliación digital | **[Data]** Existen programas con condiciones diferentes; Platzi pausado históricamente, premios estudiantiles en especie y Coderhouse con tope. D1/D3. | Producto por producto; alta aprobada, descuento adicional, atribución y comisión cobrable. No llenar un catálogo para sustituir captación. Confianza Media. |
| Pauta y SEO | **[Data]** No hay CAC argentino ROSCA ni volumen de keywords medidos; D1 aporta rangos locales Tier 3. | Pauta fintech competida; SEO con bancos, ambigüedad y guías existentes. Usar contenido para explicar primero; saturación/costo local no cuantificados. Confianza Baja. |

**[Opinion]** Llenar una junta de cinco no demuestra viralidad: son cinco adhesiones necesarias para prestar el servicio. El crecimiento exige que aparezca **otro organizador que active otro grupo**. Los premios deben salir de margen comercial cobrado y no de cuotas ajenas; las horas de fundador impiden llamar “CAC cero” al canal (`raw/channels.md`; confianza Media).

## Riesgo de plataforma y costo de cambio

**[Opinion] Hallazgo mayor — confianza Media.** Mercado Pago puede quitar demanda sin copiar ROSCA: cuotas, descuentos, metas y transferencias ya resuelven parte del trabajo. Naranja X ya lanzó coordinación grupal, por lo que la afirmación contraria de B2 quedó superada por B1 y la página del proveedor relevada en D2. No hay base para asignar probabilidades numéricas ni fecha de lanzamiento a una futura tanda de MP (`raw/indirect-competitors.md`, `raw/direct-competitors.md`, `raw/geographic.md`).

**[Data]** D3 identifica restricciones TON/TON Connect para Telegram Mini Apps y Stars para ventas digitales dentro de bots; el bot común sin Mini App tiene una exención específica de las reglas blockchain, no autorización universal para el producto. Esto corrige el atajo Telegram≈WeChat de B3. MiniPay está disponible en Argentina, pero el FAQ relevado no lista wARS (`raw/partnerships.md`; confianza Media sobre reglas publicadas).

**[Opinion]** Los riesgos se acumulan: adquisición por WhatsApp, coordinación eventual en Telegram, firma web, billetera y rampa Ripio. Cambiar cada paso exige convencer a todo el grupo. Debe medirse cuántos completan el recorrido y qué valor neto reciben, antes de elegir el canal de la versión 2.0; el descarte de V7 por el fundador no autoriza a reinstalarlo como decisión (`raw/channels.md`, `raw/partnerships.md`, `../00-intake/brainstorm.md`; confianza Media).

**[Opinion]** El costo de cambio es alto al empezar y durante un ciclo: confianza colectiva, nuevo instrumento y obligaciones pendientes. Al terminar, puede ser bajo volver al chat gratis si los beneficios no se repiten. Convertir el historial en encierro o publicar morosos puede destruir confianza y agravar privacidad; reputación portable aún no es una ventaja demostrada (`raw/customer-voice.md`, `raw/regulatory.md`; confianza Baja sobre retención real).

## Dónde competir y cómo contarlo

**[Opinion]** Competir primero por menos trabajo del organizador y un ahorro verificable en una compra prevista, dentro de un grupo conocido con capacidad de aportar. No competir por rendimiento, crédito garantizado, precio de notebooks contra grandes marketplaces ni “primer agente ROSCA”. Acuerdos repetidos, organizadores que recomiendan y costos de servir bajos podrían construir una defensa; hoy son objetivos, no activos (`raw/audience-profile.md`, `raw/direct-competitors.md`; confianza Media).

**[Assumption] Pitch a probar, sin presentar funciones pendientes como operativas:** “Organizá una junta por turnos con tu gente. Cada persona sabe qué tiene que aportar y qué sigue debiendo después de cobrar; cuando le toca, puede elegir una compra con descuento real. El comercio paga por la venta confirmada”. Agregar que el grupo soporta el riesgo de incumplimiento y que la plataforma no garantiza cobrar.

| Comparación del hackathon | Diferencia comprobable o a demostrar |
|---|---|
| **TesorerIA** | **[Data]** Paga gastos de un fondo común, con topes y votación; la junta rota beneficiarios y registra deuda restante. **[Opinion]** Mostrar esa obligación y una compra voluntaria atribuida aporta más que decir “plata grupal con IA”. Su uso sigue autodeclarado. B4; Media. |
| **AjoAI** | **[Data]** Ya combina agente, ROSCA y ERC-8004. **[Opinion]** Diferenciar por moneda local, reglas comprensibles y resultado comercial medido; sin una venta real, el diferencial comercial es una hipótesis. B1; Media técnica, Baja comercial. |
| **Ajo Circle / ChamaAgent** | **[Data]** Ya existen turnos y automatización en Celo, con distintas custodias. **[Opinion]** Comparar flujo y límites de riesgo; no prometer que la firma del usuario elimina deuda. B1/B4; Media. |
| **Comunyfi** | **[Data]** Reparte fondos comunitarios según votos, no ahorro rotativo. **[Opinion]** Evitar “comunidad” como única novedad; buscar un organizador propio, sin atribuirse la distribución de jujuy.dev. B4/D3; Media. |

**[Opinion]** Para una demo, separar evidencia técnica, prueba entre integrantes y validación comercial independiente. No acelerar aportes ajenos para igualar una cifra rival. Un contrato de descuento sin venta no prueba ingreso, y un primer turno pagado no prueba que el grupo complete el ciclo (`raw/geographic.md`, `raw/emerging-competitors.md`; confianza Media).

## Vulnerabilidad del modelo y señales tempranas

| Vulnerabilidad | Qué observar primero | Consecuencia **[Opinion]** |
|---|---|---|
| **[Assumption] El comercio paga por venta que ya iba a tener.** | Comparar origen y precio real con venta habitual; comisión efectivamente cobrada. | Si hay canibalización, no extrapolar CPA de afiliados como presupuesto adicional. |
| **[Assumption] La libre elección reduce compra atribuida.** | Beneficiarios que cobran pero compran afuera, o no compran. | El ingreso cae aunque todas las cuotas estén pagadas; medir canje separado del cumplimiento. |
| **[Assumption] El grupo percibe garantía inexistente.** | Explicación con sus palabras de quién pierde si alguien incumple. | No abrir desconocidos ni prometer compensación con reputación. |
| **[Assumption] El comercio o el organizador prescinden del producto.** | Segundo ciclo manual y ventas sin atribuir. | El servicio debe ahorrar tiempo y sostener beneficios; contrato exclusivo no reemplaza valor. |
| **[Data] Colisión de nombre Vaquita Protocol.** | Disponibilidad INPI, dominios y confusión en búsquedas, aún sin verificar. | “La” delante no acredita derechos ni evita confusión. Revisar antes de inversión de marca. B1/B4. |

**[Opinion]** El corte vinculante sigue siendo el del brief: menos de tres aceptaciones completas en diez entrevistas, al menos ocho independientes, implica abandonar el híbrido. No reemplazarlo por diez registros de afiliado ni cambiar de rubro después de cada rechazo para evitar la decisión (`../00-intake/brief.md`, `raw/channels.md`; confianza Media sobre regla interna).

## Datos faltantes

- **[Data]** Adopción y precio actuales de Cuenta Compartida; uso de Amigos; cuotas de mercado y roadmap de incumbentes no están disponibles (`raw/direct-competitors.md`, `raw/indirect-competitors.md`).
- **[Data]** Faltan ingresos por pagador, impago neto, CAC y retención de cohortes de Money Fellows; MAU/registrados no mide retención (`raw/direct-competitors.md`, `raw/competitor-gtm.md`).
- **[Data]** Faltan continuidad y causas del desenlace de Hacé Una Vaquita, Ahorro Libre y Zaveapp; no confundir silencio con cierre (`raw/demand-signals.md`).
- **[Data]** Faltan actividad on-chain de rivales, validación independiente de TesorerIA, disponibilidad comercial de programas y revisión de marca (`raw/emerging-competitors.md`, `raw/partnerships.md`).

## Conexiones estratégicas

- [market-analysis.md](market-analysis.md) cuantifica cuánto puede facturar el espacio propuesto y las condiciones legales de competir allí.
- [target-audience.md](target-audience.md) precisa qué organizador puede convencer a un grupo de abandonar su solución actual.
- [industry-trends.md](industry-trends.md) examina plataformas, inversión y límites del relato de agentes.
- [confidence-dashboard.md](confidence-dashboard.md) distingue precedentes confirmados, cierres supuestos y tracción autodeclarada.

## Flags

**Red Flags:**

- **[Opinion]** Sin prueba de sostenibilidad exclusivamente comercial; Money Fellows requiere pagador usuario y capital (`raw/direct-competitors.md`).
- **[Data]** La arquitectura y el pitch genérico ya tienen precedentes; TesorerIA compite por la misma atención del jurado (`raw/emerging-competitors.md`).
- **[Data]** Telegram Mini Apps/Celo y ventas digitales con Stars impiden asumir el canal de B3 como viable (`raw/partnerships.md`).

**Yellow Flags:**

- **[Data]** Hacé Una Vaquita parece inactiva, sin causa ni cierre confirmados; colisión de nombre con Vaquita Protocol (`raw/demand-signals.md`, `raw/direct-competitors.md`).
- **[Opinion]** Cuenta Compartida y MP pueden absorber el uso sin copiar la rotación; distribuir por familia no demuestra repetición independiente (`raw/geographic.md`, `raw/channels.md`).

## Fuentes

- **Tier 1:** repositorios [TesorerIA](https://github.com/ruizemanuel/TesorerIA), [Comunyfi](https://github.com/FrancoDuran23/comunyfi) y [Ajo Circle](https://github.com/eddiemessiah/ajo-circle); `raw/emerging-competitors.md`. Código verificable; tracción del README, autodeclarada.
- **Tier 1:** [Ronda, ETHGlobal](https://ethglobal.com/showcase/ronda-7ck82) y [registro ChamaAgent](https://erc-8004.quicknode.com/agents/celo-mainnet/9146); `raw/direct-competitors.md`.
- **Tier 2:** [Naranja X, cuenta compartida](https://www.naranjax.com/cuenta/compartida) y [lanzamiento, TodoJujuy](https://www.todojujuy.com/naranja-x-presenta-la-primera-cuenta-compartida-del-pais-disenada-aliviar-las-tensiones-y-la-carga-mental-gestionar-la-plata-grupo-parejas-familias-o-amigos-n294563); `raw/geographic.md`, `raw/direct-competitors.md`.
- **Tier 2:** [Money Fellows, entrevista 2025](https://techcrunch.com/2025/05/04/moneyfellows-raises-13m-to-take-its-group-savings-model-outside-egypt) y [guía de precios propia](https://moneyfellows.com/en-us/blog-home/your-complete-guide-to-money-fellows-app/); `raw/direct-competitors.md`.
- **Tier 2:** [Sommos, LatamList](https://latamlist.com/sommos-transforming-financial-inclusion-across-latin-america/) y [BancoSol, Pasanaku](https://www.bancosol.com.bo/soluciones-digitales/servicios-digitales/pasanaku-digital); `raw/direct-competitors.md`, `raw/geographic.md`.
- **Tier 2:** [Cierre Yahoo Tanda, TechCrunch](https://techcrunch.com/2018/05/25/yahoo-shuts-down-social-savings-app-tanda-only-months-after-launch); `raw/direct-competitors.md`; 2018, antiguo.
- **Tier 2:** [Hacé Una Vaquita, antecedente](https://infonegocios.info/y-ademas/hace-una-vaquita-como-para-juntar-dinero-para-regalos-o-eventos); `raw/indirect-competitors.md`. Fallo de dominio registrado en `raw/demand-signals.md`, sin probar desenlace.
- **Tier 2:** [Esusu, Serie C](https://www.fintechfutures.com/venture-capital-funding/esusu-lands-50m-in-series-c-funding); `raw/trends.md`.
- **Tier 2:** [Cierre Muni, Forbes Colombia](https://forbes.co/2022/11/24/emprendedores/se-apaga-muni-una-startup-colombiana-que-le-apostaba-al-supermercado-comunitario) y [cierre Favo, Contxto](https://www.contxto.com/en/peru/peruvian-online-supermarket-favo-shuts-down-after-five-years); `raw/competitor-gtm.md`; antecedentes antiguos.
- **Tier 2:** [Telegram, reglas blockchain](https://core.telegram.org/bots/blockchain-guidelines) y [Stars](https://core.telegram.org/bots/payments-stars); `raw/partnerships.md`.
- **Tier 2:** [Coderhouse, legales](https://www.coderhouse.com/ar/legales), [JujuyDev](https://jujuy.dev.ar/) y [código de conducta](https://jujuy.dev.ar/codigo-de-conducta/); `raw/channels.md`, `raw/partnerships.md`.
- **Tier 3:** [AjoAI en Karma](https://www.karmahq.org/project/ajoai/about) y [Vaquita Protocol, solicitud SCF](https://communityfund.stellar.org/submissions/recf0kKLHyFBwSHmL); `raw/direct-competitors.md`; descripciones de proyecto, sin adopción independiente.
