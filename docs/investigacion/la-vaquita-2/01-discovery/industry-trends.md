# Tendencias y momento de entrada para La Vaquita 2.0

**Fase:** 3 — Investigación de mercado
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Media

---

## Lectura central

**[Opinion] Hallazgo mayor — confianza Media.** La tecnología llegó antes que la validación comercial. Hay rieles para experimentar con pesos digitales y atención hacia agentes, pero no evidencia propia de que un grupo quiera asumir crédito entre pares para obtener un descuento, ni de que ese descuento financie la operación (`raw/trends.md`, `raw/demand-signals.md`, `raw/pricing-deep-dive.md`).

**[Opinion]** El momento favorece un piloto privado y acotado, sujeto a revisión del flujo; desfavorece salir a comunidades abiertas con promesas de cobertura. El mismo deterioro del crédito que vuelve atractiva una junta reduce la capacidad de cumplir después de cobrar. La oportunidad exige seleccionar capacidad y confianza, no captar indiscriminadamente a quienes quedaron fuera del crédito (`raw/adjacent-markets.md`, `raw/regulatory.md`; confianza Media).

**[Opinion]** Se usan T1 para organismos, normativa, investigación y analistas con método explícito; T2 para prensa y documentación comercial; T3 para blogs, redes y estimaciones comerciales sin método contrastado. Alta requiere varias T1 coincidentes; las tendencias macro y de adopción se califican aquí principalmente con confianza Media, porque buena parte llega vía prensa o declaraciones de proveedores. No se agregaron búsquedas nuevas.

## Tendencias macro: vientos con doble efecto

| Tendencia | Evidencia y confianza | Qué significa para la startup **[Opinion]** |
|---|---|---|
| Inflación persistente, menor que en episodios previos pero relevante para esperar | **[Data]** Los raw citan 1,9% mensual y 33,4% interanual en sep-2026, varias notas basadas en INDEC; el REM espera 21,2% para 2027, una expectativa. `raw/trends.md`, `raw/market-size.md`; **Media**, sin confundir repeticiones de INDEC con fuentes independientes. | El turno temprano vale más; el tardío soporta espera y riesgo. wARS mantiene denominación nominal en pesos, no poder adquisitivo. Precio congelado traslada costo al comercio; indexación o USDC lo devuelve al participante. |
| Crédito restrictivo y morosidad | **[Data]** CEPA sobre BCRA: 29,6–30,1% en billeteras may-jun; otros raw citan 27,8% de deudores y 11,6–12% para otros universos. `raw/adjacent-markets.md`, `raw/trends.md`; **Media** en deterioro, **Baja** para magnitud comparable. | No promediar esas tasas ni usarlas para ROSCA. El grupo puede preferir ayuda mutua, pero necesita ingresos futuros; no hay “ahorro sin deuda” para quien cobra primero. |
| Ingresos limitados | **[Data]** Pobreza y restricción de ahorro aparecen en A1/C3; el 13–15% jujeño es opinión sobre asalariados, no encuesta. `raw/audience-profile.md`; **Media** como contexto, **Baja** para mercado pagador. | El problema no siempre es falta de disciplina. Un aporte imposible no se corrige con recordatorios ni gamificación. |
| Adopción de cuentas, objetivos y compras digitales | **[Data]** MP reporta reservas creadas y Naranja X lanzó Cuenta Compartida en ago-2026; el BCRA documenta uso amplio de cuentas y pagos. `raw/trends.md`, `raw/geographic.md`; **Media**. | Facilita explicar metas y seguimiento, pero eleva el estándar de facilidad. “Grupal” dejó de ser por sí solo una novedad. |
| Preferencia cripto por dólares | **[Data]** Bitso atribuye 71% de compras cripto argentinas de 2025 a stablecoins; Lemon publica otra métrica de usuarios, no comparable. `raw/trends.md`, `raw/market-size.md`; **Media** como señal comercial, **Baja** para preferencia local exacta. | La demanda de USDT/USDC no valida wARS. El valor debe estar en coordinar una compra, no en prometer que ahorrar en peso tokenizado protege contra inflación. |

**[Estimate]** Con inflación constante de 1,9% mensual, diez meses elevan precios 20,7% y reducen 17,2% el poder de compra de una suma nominal. Se corrige la equivalencia aproximada de A1 entre suba de precios y pérdida de compra. Un ciclo corto limita exposición, pero también reduce la anticipación absoluta que justifica una ROSCA; la frecuencia tiene que seguir ingresos reales, no el calendario de una demo (`raw/market-size.md`, `raw/geographic.md`; confianza Media sobre aritmética, Baja sobre proyección).

## Tecnología y curva de adopción

| Tecnología | Etapa evaluada **[Opinion]** | Evidencia y límite | Decisión para La Vaquita **[Opinion]** |
|---|---|---|---|
| **wFIAT / wARS en Celo** | Innovadores para este mercado | **[Data]** Ripio y Celo anunciaron seis monedas el 31/07/2026. El volumen inicial citado en A2 no mide uso actual de wARS/Celo; la meta de USD 100 millones es aspiración del emisor. D2/D3 mejoran fecha y documentación. **Media** sobre anuncio; **Baja** sobre adopción. | Probar identidad, fondeo, firma, recepción y retiro con cuenta propia. No proyectar usuarios desde la base total de Ripio. |
| **Celo y pago de comisión de red en stablecoin** | Infraestructura disponible; experiencia final sin validar | **[Data]** CIP-64 está documentado; D3 advierte que compatibilidad EVM no prueba soporte y MetaMask descarta `feeCurrency`. `raw/partnerships.md`; **Media**. | La prueba termina con importe y salida conciliados, no con una URL de rampa o transacción armada. No bajar controles para reducir fricción. |
| **Billetera embebida/passkeys** | Disponible como oferta, adopción local no medida | **[Data]** Para, Privy y otros proveedores ofrecen integración; D3 distingue modalidades de custodia y firma delegada. **Media** sobre oferta; **Baja** sobre circuito propio. | Elegir una candidata y probar consentimiento, rechazo y recuperación. “Invisible” no debe significar control del desarrollador. |
| **MiniPay** | Distribución global relevante; demanda jujeña desconocida | **[Data]** D3 confirma disponibilidad argentina; FAQ sin wARS. A2 cita 11–16 millones según fechas y métricas distintas, no auditadas. **Media** sobre disponibilidad, **Baja** sobre canal útil. | No descartar por país ni asumir canal resuelto por cifra global. La moneda y el flujo siguen sin confirmar. |
| **Pagos agénticos/x402** | Experimentación con atención alta | **[Data]** Mastercard reportó operaciones regionales; TRM estima 0,6–7,5% realmente agéntico en su muestra x402. Los totales de otros proveedores no son comparables. `raw/trends.md`; **Media**. | La IA debe reducir esfuerzo visible, no sumar transacciones para métricas. Mantener propuestas conversacionales y decisiones determinísticas; el usuario firma. |
| **ERC-8004** | Temprana, orientada a desarrolladores | **[Data]** Identidad/reputación ya aparece en AjoAI, ChamaAgent y ChamaScore; fechas globales de lanzamiento en A2 vienen sobre todo de T3. `raw/emerging-competitors.md`, `raw/direct-competitors.md`; **Media** sobre precedentes, **Baja** sobre adopción masiva. | Identificar al agente no certifica solvencia del miembro ni vuelve cobrable una deuda. No venderlo como seguro o ventaja exclusiva. |
| **Telegram Mini Apps** | Canal existente con reglas que limitan este uso | **[Data]** D3 releva TON/TON Connect y restricciones de links de otras redes; Stars para venta digital en bots. `raw/partnerships.md`; **Media**. | Corrige la recomendación de B3 de copiar WeChat directamente con Celo. Evaluar bot común de coordinación y flujo externo; clasificación y venta digital pendientes. |

**[Opinion] Hallazgo mayor — confianza Media.** La cadena puede reducir custodia del organizador y aportar verificabilidad, pero agrega emisor, rampa, billetera y reglas de plataforma. “No custodia La Vaquita” y “el usuario no depende de nadie” no son equivalentes. En este piloto, el costo dominante podría ser soporte y confianza, aunque las comisiones de red sean pequeñas (`raw/partnerships.md`, `raw/geographic.md`).

## Inversión y M&A: qué están financiando de verdad

**[Data]** Money Fellows levantó USD 13 millones en mayo de 2025 y más de USD 60 millones acumulados según prensa; Esusu obtuvo USD 50 millones de Serie C a fines de 2025 ya enfocada en reporte de alquileres; Sommos exhibe un giro institucional y financiamiento temprano mucho menor. Los raw no identifican una ronda 2025–2026 verificable de una ROSCA on-chain de consumo (`raw/trends.md`, `raw/direct-competitors.md`; confianza Media sobre rondas, Baja sobre exhaustividad).

**[Opinion]** El patrón financiado es distribución y gestión de riesgo o un pagador institucional con beneficio claro. Esusu no valida una ronda ROSCA; la rentabilidad declarada de Money Fellows no valida operar sin balance. La ausencia de rondas encontradas indica cobertura limitada y falta de comparable visible, no que sea imposible levantar capital (`raw/competitor-gtm.md`, `raw/demand-signals.md`; confianza Media).

**[Data]** El VC argentino citado pasó de USD 270 millones en 2025 a más de USD 400 millones en los primeros cinco meses de 2026, concentrado en rondas mayores e infraestructura. **[Opinion]** No implica disponibilidad para un equipo sin clientes; grants y aceleradoras tampoco deben financiar gastos comprometidos antes de adjudicación. D3 documenta Celo Camp cerrado y contradicciones de calendario/encaje en Prezenti (`raw/trends.md`, `raw/partnerships.md`; confianza Media sobre señales, Baja sobre financiamiento accesible).

**[Data]** Muni cerró en noviembre de 2022 según B3; Favo cerró Perú en febrero de 2024, tras salir de Brasil. A2/A4 dejaban Muni sin confirmar: se privilegia el antecedente de cierre con fuente específica de B3. **[Opinion]** No incorporar logística evita una carga de esos modelos, pero no demuestra que afiliación o comunidad solas alcancen (`raw/competitor-gtm.md`, `raw/trends.md`; confianza Media).

**[Data]** A4 recoge adquisición de Tricount por bunq en 2022; A2 menciona una compra de Tapi en México sin detalle. No hay M&A comparable ROSCA 2025–2026 suficientemente documentado en el conjunto. **[Opinion]** No construir una tesis de salida por adquisición con esos ejemplos ni tratar el cierre de una empresa como operación de M&A (`raw/adjacent-markets.md`, `raw/trends.md`; confianza Baja sobre mercado de salidas).

## Cambios de comportamiento y sus límites

**[Opinion]** Hay tres señales compatibles pero distintas: más organización de dinero en apps, persistencia de confianza interpersonal y demanda de precios bajos. Unirlas en una junta comercial exige demostrar que las mismas personas comparten las tres necesidades. Reservas creadas, usuarios de cripto y compras de e-commerce no se suman para fabricar demanda (`raw/trends.md`, `raw/demand-signals.md`; confianza Media).

**[Data]** C1 observa reclamos sobre bloqueo de saldos, cobros automáticos y condiciones de acceso a cursos; no es una encuesta representativa. **[Opinion]** La garantía revocable puede contradecir la promesa emocional de control: un servicio ya pagado que desaparece por una deuda con pares reproduce el tipo de frustración observado. La firma personal y la libertad de compra necesitan más peso que la gamificación (`raw/customer-voice.md`, `raw/regulatory.md`; confianza Media como tensión, Baja sobre prevalencia).

**[Opinion]** Metas libres amplían utilidad, pero dispersan demanda; precio colectivo requiere compras similares, capacidad ociosa o atribución comercial suficiente. Para el primer experimento conviene una oferta elegida por necesidad real, sin obligar a comprarla. Si la compra es opcional, la conversión comercial debe medirse independientemente del cumplimiento de cuotas (`raw/audience-profile.md`, `raw/pricing-deep-dive.md`, `raw/channels.md`; confianza Media).

## Trayectoria regulatoria

**[Data]** A3 releva actualización PSAV por RG CNV 1172/2026, vigente desde 16/10, y exclusiones condicionadas de autocustodia; también controles PSP reforzados. A2 seguía citando RG 1058/2025: para esta síntesis se prioriza la revisión regulatoria específica, sin afirmar dictamen sobre nuestro caso (`raw/regulatory.md`, `raw/trends.md`; confianza Media).

**[Opinion]** Una mejor definición de software autocustodiado es favorable para arquitectura, pero no resuelve IGJ, consumo, captación o datos. La RG IGJ 8/2015 incluye servicios; no hay sandbox argentino específico de ROSCA comercial encontrado ni precedente que garantice exclusión. Una consulta o reforma en trámite no habilita operar (`raw/regulatory.md`, `raw/adjacent-markets.md`; confianza Media sobre distinción, Baja sobre encuadre concreto).

**[Opinion]** Separar junta en dinero y compraventa posterior es mitigación razonable y simultáneamente un costo de monetización: el comercio deja de recibir compras obligatorias, la atribución puede perderse y la garantía cruzada queda más cuestionada. La startup debe probar que el valor voluntario alcanza; no puede presupuestar la conversión de un esquema integrado y el menor riesgo del separado a la vez (`raw/regulatory.md`, `raw/partnerships.md`; confianza Media).

**[Data]** D2 corrige generalizaciones regionales: la restricción Banxico no es prohibición universal a particulares; Colombia conserva riesgo de captación; Perú regula fondos colectivos y tiene exigencias PSAV; Bolivia ya tiene oferta bancaria y Chile trabaja una agenda de stablecoins. **[Opinion]** Token disponible y afinidad cultural no equivalen a permiso, rampa ni distribución por país (`raw/geographic.md`; confianza Media sobre marcos relevados, Baja sobre expansión propia).

## Scorecard de timing

**[Opinion]** Escala cualitativa de −2 (freno fuerte) a +2 (viento fuerte), peso igual por factor. Es una herramienta de priorización, no pronóstico; no se promedia confianza con puntaje. No se hereda el 6,5/10 de A2 porque omite o subestima competencia grupal y restricciones de plataforma relevadas después.

| Factor | Puntaje | Fundamento y confianza |
|---|---:|---|
| Rieles en moneda local disponibles | +2 | **[Data]** Anuncios wFIAT y documentación. Media sobre oferta, Baja sobre ejecución local. A2/D2/D3. |
| Familiaridad con metas y pagos digitales | +1 | **[Data]** Productos e informe BCRA. Media; también fortalece sustitutos. A2/D2. |
| Necesidad de alternativas al crédito caro | +1 | **[Opinion]** Deterioro abre conversación; no acredita solvencia. Media. A2/A4. |
| Visibilidad del ecosistema y hackathon | +1 | **[Data]** Programa y precedentes públicos. Media; distribución comercial no probada. B4/D3. |
| Capacidad de ahorro restringida | −2 | **[Opinion]** Amenaza continuidad del aporte. Media sobre restricción, Baja sobre cohorte. C3. |
| Impago sin capital de cobertura | −2 | **[Opinion]** Falta responsable que reponga dinero; el acceso revocable no lo resuelve. Media. B1/A3. |
| IGJ y consumo pendientes | −2 | **[Opinion]** Puede exigir rediseño incompatible con tesis integrada. Media sobre riesgo, Baja sobre dictamen. A3. |
| Sustitutos y costo de cambio colectivo | −1 | **[Opinion]** Naranja X/MP/chat compiten desde hábito y confianza. Media. B1/B2/D2. |
| Plataforma, firma y rampa sin ensayo completo | −1 | **[Opinion]** Telegram/Stars, wARS y soporte agregan dependencias. Media. D3. |
| Comisión y repetición sin clientes | −2 | **[Data]** Cero validación directa; **[Opinion]** frena escalar. Baja sobre viabilidad. Brief/C2/C4. |
| **Balance** | **−5, rango posible −20 a +20** | **[Estimate]** Suma de diez factores. No significa −25% de éxito ni mide tamaño de mercado. |

**[Opinion]** Veredicto: **buen momento para reducir incertidumbre; mal momento para financiar una expansión antes de las pruebas**. Los cuatro factores favorables permiten investigar; no neutralizan un bloqueo regulatorio o ausencia de pagador. Una aceptación familiar no cambia por sí sola el score (`raw/channels.md`, `raw/geographic.md`; confianza Media).

## Qué haría cambiar el veredicto

- **[Assumption] A favor:** flujo revisado jurídicamente, recorrido completo de firma/rampa, tres o más aceptaciones de diez comercios con ocho independientes, primera comisión cobrada y segundo grupo sin parentesco. Son puertas de aprendizaje derivadas del brief y D1/D2, no resultados.
- **[Assumption] En contra:** descuento neto menor que el contado habitual, rescates de cuotas por el equipo, rechazo de la mayoría de comercios, soporte que consume la comisión o necesidad de custodia para funcionar. Frenar o rediseñar antes de captar más.
- **[Opinion]** Para el 09/11 puede mostrarse implementación o recorrido acotado; un ciclo de cinco turnos semanales, quincenales o mensuales conserva su duración económica. No comprimir el calendario para llamar retención a una demostración (`raw/geographic.md`).

## Datos faltantes

- **[Data]** Volumen, usuarios activos y liquidez de wARS/Celo; rampas con costos y mínimos reales por participante/comercio; soporte de firma en la billetera elegida (`raw/trends.md`, `raw/partnerships.md`).
- **[Data]** Uso de juntas por jóvenes jujeños, búsqueda local, capacidad sostenida, demanda digital y disposición del comercio a pagar (`raw/demand-signals.md`, `raw/audience-profile.md`).
- **[Data]** Series homogéneas de mora, costes reales de cuotas y CAC argentino comparables; márgenes locales no cubiertos por cifras sectoriales globales (`raw/pricing-deep-dive.md`).
- **[Data]** Texto consolidado y dictamen IGJ/PSAV/consumo, reglas de plataforma aplicadas al flujo final y vigencia de cambios en datos (`raw/regulatory.md`, `raw/partnerships.md`).
- **[Data]** Causas de cierres, ingresos comerciales de comparables y M&A reciente del segmento. No se usa la referencia de reforma de datos con URL de diciembre de 2026 como hecho anterior al corte (`raw/regulatory.md`, `raw/trends.md`).

## Conexiones estratégicas

- [market-analysis.md](market-analysis.md) traduce inflación, margen y cumplimiento en escenarios económicos sin confundir ritmos con ingresos realizados.
- [competitor-landscape.md](competitor-landscape.md) explica por qué agentes y metas ya tienen precedentes y sustitutos.
- [target-audience.md](target-audience.md) selecciona capacidad, confianza y necesidad concreta frente al deterioro del crédito.
- [confidence-dashboard.md](confidence-dashboard.md) muestra qué tendencias descansan en datos, anuncios o hipótesis y ordena verificaciones.

## Flags

**Red Flags:**

- **[Opinion]** Servicios no evitan IGJ y acceso revocable no equivale a cobertura; encuadre pendiente (`raw/regulatory.md`).
- **[Data]** Canal Mini App Celo y venta digital en Telegram tienen restricciones publicadas (`raw/partnerships.md`).
- **[Opinion]** La crisis de crédito puede trasladar impago al grupo; no hay capital propio ni esquema de reposición demostrado (`raw/direct-competitors.md`).

**Yellow Flags:**

- **[Data]** Métricas globales, promociones y metas de emisores no son adopción local; inversión concentrada no es financiamiento accesible (`raw/trends.md`).
- **[Opinion]** Dólares digitales, cuentas compartidas y descuentos existentes pueden superar la propuesta antes de que nazca un competidor idéntico (`raw/indirect-competitors.md`, `raw/geographic.md`).

## Fuentes

- **Tier 1:** [BCRA, REM septiembre 2026](https://www.bcra.gob.ar/archivos/Pdfs/PublicacionesEstadisticas/informes/relevamiento-expectativas-mercado-2026-09.pdf), expectativas; `raw/trends.md`.
- **Tier 1:** [BCRA, inclusión financiera, segundo semestre 2025](https://www.bcra.gob.ar/publicaciones/informe-de-inclusion-financiera-segundo-semestre-de-2025/); `raw/geographic.md`.
- **Tier 1:** [RG IGJ 8/2015](https://www.argentina.gob.ar/sites/default/files/resolucion_general_08-15.pdf) y [CNV RG 1172/2026](https://www.boletinoficial.gob.ar/detalleAviso/primera/348986/20261015); `raw/regulatory.md`.
- **Tier 2:** [INDEC septiembre vía Infobae](https://www.infobae.com/economia/2026/10/13/la-inflacion-en-septiembre-fue-de-19-y-acumulo-334-en-los-ultimos-doce-meses/), única estadística de origen aunque haya varias notas; `raw/trends.md`.
- **Tier 2:** [Mora en billeteras, iProfesional](https://www.iprofesional.com/finanzas/452179-mercado-pago-uala-otras-billeteras-virtuales-ahogadas-por-morosidad-record); `raw/adjacent-markets.md`; fuente CEPA/BCRA.
- **Tier 2:** [Ripio, wFIAT en Celo](https://action.ripio.com/es/blog/las-stablecoins-wfiat-ya-estan-disponibles-en-celo), [Celo, fee abstraction](https://docs.celo.org/build/fee-abstraction/overview), [MiniPay, disponibilidad](https://docs.minipay.xyz/getting-started/availability.html) y [FAQ](https://minipay.to/faq); `raw/geographic.md`, `raw/partnerships.md`.
- **Tier 2:** [Mastercard, operaciones agénticas LatAm](https://www.mastercard.com/news/latin-america/en/newsroom/press-releases/pr-en/2026/march/mastercard-advances-agentic-payments-in-latin-america-and-the-caribbean-with-live-transactions-completed-across-the-region) y [TRM, análisis x402](https://www.trmlabs.com/trm-tech-blog/whos-actually-paying-measuring-ai-agent-payments-onchain); `raw/trends.md`.
- **Tier 2:** [Money Fellows, ronda y modelo](https://techcrunch.com/2025/05/04/moneyfellows-raises-13m-to-take-its-group-savings-model-outside-egypt) y [Esusu, Serie C](https://www.fintechfutures.com/venture-capital-funding/esusu-lands-50m-in-series-c-funding); `raw/trends.md`, `raw/direct-competitors.md`.
- **Tier 2:** [Muni, cierre](https://forbes.co/2022/11/24/emprendedores/se-apaga-muni-una-startup-colombiana-que-le-apostaba-al-supermercado-comunitario), [Favo, cierre](https://www.contxto.com/en/peru/peruvian-online-supermarket-favo-shuts-down-after-five-years), [Tricount, antecedente de adquisición recogido en comparativa](https://tricount.com/splitwise-vs-tricount) (**Tier 3**, comparativa comercial); `raw/competitor-gtm.md`, `raw/adjacent-markets.md`; antecedentes antiguos.
- **Tier 2:** [Telegram, blockchain](https://core.telegram.org/bots/blockchain-guidelines), [Stars](https://core.telegram.org/bots/payments-stars), [Privy, custodia](https://docs.privy.io/wallets/overview/flexible-custody) y [Prezenti, elegibilidad](https://www.prezenti.xyz/grants); `raw/partnerships.md`.
- **Tier 2:** [Naranja X, cuenta compartida](https://www.naranjax.com/cuenta/compartida); `raw/geographic.md`.
