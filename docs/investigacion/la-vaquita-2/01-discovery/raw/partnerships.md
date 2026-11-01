# D3 · Mapa de socios estratégicos — La Vaquita 2.0

**Ola 4 · Brief del 24/10/2026 · Consulta web del 25/10/2026.**

## Recomendación

**[Estimate] Arrancá con el servicio técnico familiar, un organizador conocido y una sola solución de billetera.** Ripio resuelve la entrada y salida de pesos; JujuyDev puede acercar organizadores y pruebas; el Club de Emprendedores puede abrir un segundo grupo después. Las academias nacionales, mutuales y programas de financiamiento son opciones de expansión, no condiciones para empezar.

**[Data · aportado por el equipo]** Hay acceso real a dos comercios familiares: servicio técnico y accesorios de PC, y distribuidora de limpieza. No hay acuerdos comerciales, interés de compradores ni acceso universitario confirmados. Las personas Nico, Cami y Don Rubén son perfiles de diseño; no son contactos reales. Ninguna organización relevada en este archivo aceptó ser socia.

**[Assumption · diseño de prueba]** El piloto apunta a cinco adultos que se conocen, hasta cinco turnos y compra opcional de reparación o accesorios para trabajar. Los aportes van al beneficiario; el comercio vende directamente y factura su venta. La Vaquita propone cobrarle al comercio por una venta atribuida. No se promete que el comercio acepte wARS: puede necesitar que el beneficiario convierta a pesos antes de comprar. Esa fricción también se mide.

**[Data · alcance del repo]** Esta es investigación de la propuesta 2.0, no una modificación del MVP aprobado. El contexto vigente condiciona los aportes de terceros a resolver las cuestiones financieras, técnicas y legales. El calendario de abajo no reemplaza esa condición.

## Método y lectura de la evidencia

- **[Data]** Se hicieron más de 40 consultas de búsqueda, además de aperturas y seguimientos, organizadas en seis rondas temáticas: infraestructura; academias; programas SaaS y servicios; instituciones; comunidades; y contraste de condiciones, vigencia y accesibilidad. Se profundizó cuando el resultado inicial era genérico o devolvía otro país. No se enviaron mensajes ni formularios.
- **Tier 1 (T1):** gobierno, registros y documentación institucional o académica. **Tier 2 (T2):** prensa, comunicados y páginas, términos o documentación oficial de proveedores comerciales y comunidades. **Tier 3 (T3):** blogs independientes, directorios y redes sociales. Una fuente comercial primaria es buena evidencia de sus condiciones publicadas, aunque acá se clasifique T2.
- **[Data]:** afirmación de una fuente identificada; no implica auditoría independiente. **[Estimate]:** evaluación o cálculo propio. **[Assumption]:** propuesta todavía no validada. Los contactos familiares se identifican como información del equipo.
- **Fechas:** salvo indicación distinta, las páginas comerciales y técnicas no muestran actualización; se verificaron el **25/10/2026**. Esa consulta no demuestra cómo estaba la página el 24/10. No se incorporaron anuncios con fecha posterior al corte como hechos consumados. La fecha de rastreo o el año del pie de página no prueban vigencia.
- **⚠️ >18 meses:** evidencia anterior al **24/04/2025**. Una página sin fecha queda como antigüedad desconocida, no como actual por defecto. Los antecedentes de Olas 1–3 se usan como hipótesis de partida; no se volvieron a investigar mercado, macro ni competidores en general.

## Tabla de socios

**[Estimate] Todas las prioridades, esfuerzos, contraprestaciones propuestas y riesgos competitivos de las tablas son nuestros.** P0: resuelve una condición del primer piloto; P1: abordar dentro de 60 días; P2: después de evidencia comercial; P3: postergar o descartar con el diseño actual. Esfuerzo **B**: hasta una jornada de preparación; **M**: entre dos y cinco jornadas; **A**: más de cinco jornadas o dependencia institucional. Son horas de trabajo estimadas, no tiempos de respuesta garantizados. La columna Riesgo distingue capacidad de competir de obstáculos operativos; no atribuye intención de copiar.

### R1 · Infraestructura y acompañamiento

| Socio | Tipo | Qué reciben | Qué recibimos | Cómo abordarlo | Prioridad | Riesgo |
|---|---|---|---|---|---|---|
| Ripio: wARS y Ramps | Rampa y soporte técnico | Uso recurrente de wARS y aprendizaje de incorporación en Jujuy | Circuito pesos → billetera propia → pesos; soporte, si lo acuerdan | [Ramps Argentina][F01] y canal de ventas en [Ripio][F02]. Pedir demostración con cinco usuarios y cotización; programa público de comisión a partners no verificado | **P0 · M** | Competencia **media**: ya opera pagos y billetera. Operativo: KYC, tarifas y disponibilidad concreta de wARS/Celo pendientes |
| Celo Foundation / equipo de relación con desarrolladores | Ecosistema | Caso de uso local y actividad verificable | Ayuda técnica y presentaciones, si aceptan | Canales enlazados en [documentación Celo][F03] y acceso del hackathon ya informado por el equipo; pedir revisión técnica puntual | **P1 · B** | Competencia **baja**. No confundir acompañamiento con aval comercial ni grant |
| Celo Camp | Aceleración | Proyecto con usuarios y aprendizaje de mercado | Mentoría y eventual inversión, sujeta a selección | [Batch 10][F04]: postulación cerrada según ficha consultada; consultar próxima edición | **P2 · M** | Competencia **baja**. Riesgo de calendario: el cierre informado fue el 14/08/2026 |
| Prezenti / grants Celo | Financiamiento | Métricas y entregables del ecosistema | Financiamiento eventual | [Elegibilidad][F05]; primero consultar encaje, sin preparar una postulación larga | **P2 · M** | Competencia **baja**. Exigencias de tracción o infraestructura y estado contradictorio; no presupuestar ingreso |
| Para | Billetera integrada | Cliente y caso de uso con pagos periódicos | Incorporación con passkeys/MPC y recuperación | [Documentación][F06]; una prueba acotada de firma del miembro con wARS y comisión de red en USDC | **P0 condicional · M** | Competencia **baja-media**. Soporte CIP-64 y consentimiento por aporte pendientes; dependencia técnica |
| Privy | Billetera integrada | Cliente y caso de pagos | Incorporación y recuperación integradas | [Modelos de custodia][F07]. Alternativa si Para no pasa la prueba; pedir modalidad autocustodiada sin firma delegada | **P1 condicional · M** | Competencia **media** en infraestructura de pagos. Ofrece varios modelos de custodia; elegir marca no garantiza control del miembro |
| thirdweb | Billetera integrada | Uso de su infraestructura | Billetera embebida y herramientas Celo | [Directorio técnico Celo][F08]; evaluar solo si falla la primera opción | **P2 · M** | Competencia **media** por alcance de su plataforma. Soporte EVM no confirma CIP-64 |
| Reown / AppKit | Conexión de billeteras | Uso de conexión e incorporación | Conectar billeteras existentes; incorporación adicional según modalidad | [Guía de integración Celo][F08]; revisar licencia y la billetera que termina firmando | **P2 · M** | Competencia **baja-media**. Conectar no crea soporte de firma CIP-64; el tutorial antiguo usa una red retirada |
| MiniPay | Distribución y billetera | Aplicación útil y actividad | Descubrimiento dentro de la billetera | [Disponibilidad][F09], [FAQ][F10] y [listado de Mini Apps][F11]; consultar wARS antes de integrar | **P3 · A** | Competencia **media** dentro del catálogo. Argentina está disponible; wARS no figura entre las monedas del FAQ |
| Self Protocol | Identidad privada | Caso de verificación y prevención de duplicados | Prueba de atributos sin guardar copia del documento, si se implementa así | [Documentos admitidos][F12] y [países][F13]; prueba voluntaria, sin volverlo requisito de entrada | **P3 · M** | Competencia **baja**. Pasaporte/NFC pueden excluir usuarios; DNI argentino común no confirmado |
| Telegram: bot común sin Mini App | Plataforma de coordinación | Actividad en grupos | Recordatorios y consultas de estado | [Bot API][F14]; mantener el componente de billetera en web independiente y revisar el circuito completo | **P1 · B** | Competencia directa **baja**; dependencia de plataforma **alta**. Exención de reglas TON no equivale a aprobación de toda la propuesta |
| Telegram Mini Apps | Plataforma | Actividad dentro de TON | No hay encaje estándar verificado con Celo/wARS | [Reglas blockchain][F15] y [términos §7][F16] | **P3 · A** | Incompatibilidad material: reglas TON y TON Connect; también restringen links a activos de otras redes |

### R2 · Comercios ancla, educación y servicios

| Socio | Tipo | Qué reciben | Qué recibimos | Cómo abordarlo | Prioridad | Riesgo |
|---|---|---|---|---|---|---|
| Servicio técnico y accesorios de PC familiar | Comercio ancla; acceso informado por el equipo | Ventas atribuidas, turnos de trabajo previsibles y clientes que vuelven | Oferta local, soporte presencial y primer caso de CPA | Conversación directa con el dueño; definir mano de obra y accesorios elegibles, precio de referencia, descuento, comisión, factura y devoluciones | **P0 · B** | Competencia **baja**; puede coordinar su propio grupo. Principal riesgo: margen insuficiente al sumar descuento y CPA |
| Distribuidora de limpieza familiar | Segundo comercio; acceso informado por el equipo | Ventas de reposición o stock a revendedores | Segundo segmento accesible y cotizaciones reales | Entrevistar al dueño sobre clientes revendedores; no abrir otra junta todavía | **P1 exploratoria · B** | Competencia **baja**. Margen físico y logística; no trasladar tasas de cursos al mayorista |
| Coderhouse | Academia / afiliación | Inscripciones pagas atribuibles | Descuento adicional y remuneración publicada, sujetos a aceptación | [Términos §21][F17]; pedir alta comercial, condiciones AR y confirmación de atribución durante todo el ciclo | **P1 después del ancla · M** | Competencia **media**: comunidad, referidos y financiación propios. No asumir CPA porcentual uniforme ni exclusividad del descuento |
| Domestika | Academia / afiliación | Compras y registros atribuidos | Comisiones publicadas y catálogo creativo | [Formulario de afiliación][F18]; verificar condiciones del contrato, Argentina y liquidación antes de ofrecer | **P2 · B** | Competencia **media** por comunidad propia. Cursos baratos pueden no justificar una junta; sin evidencia de cobro en wARS |
| Hotmart | Agregador de productores | Ventas para productores afiliados | Acceso a productos con programa de afiliados | [Programa][F19]; seleccionar un productor con utilidad laboral y negociar oferta concreta | **P2 · M** | Competencia **media**. Aprobar una cuenta no asegura aprobación de cada producto, descuento, calidad ni venta atribuida |
| Digital House | Educación empresarial | Nuevas matrículas o grupo de formación | Oferta educativa y eventual convenio | [Soluciones para empresas][F20]; consultar grupos pequeños, compra individual y CPA | **P2 · M** | Competencia **media**. Canal empresarial comprobado; comisión pública de afiliación para este caso no encontrada |
| Platzi | Academia / referidos | Suscripciones nuevas | Tiempo extra de suscripción; CPA en dinero no probado | [Precios y FAQ de referidos][F21]; consultar convenio comercial separado del referido estudiantil | **P2 · M** | Competencia **media-alta** por comunidad y beneficios propios. El mes adicional no es comisión cobrable |
| Henry | Formación por cohortes | Nuevas inscripciones | Eventual oferta de formación | [Sitio y asesor comercial][F22]; pedir condiciones actuales y existencia de canal de afiliados | **P3 · M** | Competencia **media**. No encontramos CPA público; duración y financiación deben contrastarse con cinco turnos |
| Crehana | Educación y soluciones para empresas | Nuevos clientes | Eventual afiliación o convenio | [Guía de afiliados de 2022][F23], **⚠️ >18 meses**; pedir confirmación de que el programa sigue activo | **P3 · M** | Competencia **media**. Evidencia antigua; no presupuestar una comisión vigente |
| EDteam | Academia / referido estudiantil | Nuevos alumnos premium | Días o suscripción premium y descuento para referido | [Ayuda de referidos][F24]; consultar modalidad comercial distinta si interesa monetizar | **P3 · B** | Competencia **media**. Premio en especie, no CPA en efectivo; descuentos no acumulables según ayuda |
| Tiendanube | SaaS / afiliados y partners tecnológicos | Tiendas nuevas o aplicación útil | Ingreso por referidos y descuento para nuevas tiendas, si aprueban | [Socios][F25] y [FAQ Asociados, 17/06/2026][F26]; elegir afiliación antes de construir una aplicación | **P2 · B** | Competencia **media-alta** por herramientas propias de pagos y comercio. Es canal hacia comerciantes; no demanda probada de ROSCA para pagar SaaS |
| Alegra | SaaS / partners | Ventas e implementaciones | Comisiones y formación sujetas a categoría y aceptación | [Alegra Partners Argentina][F27]; solicitar condiciones para recomendador sin equipo comercial | **P2 · M** | Competencia **media**. La modalidad publicada favorece capacidad comercial/consultiva que el equipo todavía no tiene |
| Xubio | SaaS / partners contables | Clientes nuevos pagos | Descuentos, capacitación e incentivos según reglas | [Programa Argentina][F28]; explorar con un estudio contable local, sin fingir credenciales | **P2 · M** | Competencia **media**. No todo incentivo es efectivo; hay transición de programas durante 2026 y condiciones de validación |
| Gimnasio barrial de Jujuy, aún sin candidato validado | Servicio presencial | Altas y ocupación en horarios con capacidad | Beneficio local y posible CPA por alta | Pedir al comercio familiar una presentación; relevar precio público, alta y permanencia | **P2 · B** | Competencia **baja**. **DATA GAP:** nombre, margen y aceptación. Membresía mensual puede no necesitar junta |
| Smart Fit Argentina | Cadena de gimnasios | Altas | Eventual convenio | [Sitio y buscador de sedes][F29]; confirmar sede útil en Jujuy y canal corporativo | **P3 · M** | Competencia **baja-media**. No quedó verificado convenio CPA ni sede local aplicable; no asumir alcance territorial |
| Megatlon | Cadena / convenio empresarial | Altas corporativas | Propuesta de bienestar para organizaciones | [Formulario corporativo][F30]; no abordar antes de tener organización y territorio compatibles | **P3 · M** | Competencia **baja**. Su página institucional ubica sedes en Buenos Aires, Córdoba y Santa Fe; bajo encaje Jujuy |
| Nubicom | Conectividad NOA | Altas o contratos para pequeños negocios | Eventual descuento de conectividad | [Nubipymes y canales comerciales][F31]; pedir cobertura exacta del piloto y programa de referidos | **P2 · M** | Competencia **baja**. Sitio centrado en Salta; cobertura jujeña, prepago y CPA no confirmados |
| Cooperativa Telefónica de Perico (CTP) | Cooperativa y proveedor de conectividad | Beneficio para socios y potenciales altas | Acceso institucional local y eventual oferta | [Sitio oficial: contacto e internet][F32]; consultar servicio y propuesta a socios, luego verificar registro | **P2 · M** | Competencia **media**: tiene vínculo y facturación propios. Perico queda fuera del primer núcleo del piloto; acuerdo no confirmado |

### R3–R4 · Instituciones, incubación y comunidades

| Socio | Tipo | Qué reciben | Qué recibimos | Cómo abordarlo | Prioridad | Riesgo |
|---|---|---|---|---|---|---|
| JujuyDev: dominio encontrado `jujuy.dev.ar` | Comunidad técnica | Taller útil, pruebas voluntarias y aprendizaje público | Presentación a un organizador y usuarios con necesidad de equipo | [Sitio y canales oficiales][F33]; propuesta a la organización antes de convocar miembros | **P1 · B** | Competencia **media-alta**: capacidad técnica y posible cruce con Comunyfi, informado en Olas previas. Ser transparentes sobre el alcance del piloto |
| SaltaDev | Comunidad NOA | Taller y colaboración entre comunidades | Presentaciones a organizadores y comercios de Salta | [Sitio vigente `salta.dev`][F34]; pedir presentación desde JujuyDev | **P2 · B** | Competencia **media**. Buen canal regional; expandirse ahora agrega distancia y otro comercio |
| Club de Emprendedores de San Salvador de Jujuy | Municipalidad / canal institucional | Herramienta para emprendedores y un caso medible | Entrevistas y posible presentación a organizadores | [Presentación municipal del 09/06/2026][F35] y [canales del Club][F36]; pedir entrevista, no difusión masiva | **P1 · B** | Competencia **baja**; ciclo institucional y riesgo de interpretar participación como aval público |
| Secretaría de Economía Popular / Desarrollo Económico Social | Ministerio provincial / incubación | Validación de una herramienta para equipamiento productivo | Mentoría, acceso a emprendedores y posible programa | [Programas y formulario oficial][F37]. Consultar TECNOVA y ventanilla de formación; confirmar cohorte y cupo | **P1 exploratoria · M** | Competencia **baja**. ANR y capital semilla anunciados no son fondos adjudicados al equipo |
| EDEP / Jujuy Emprende | Ministerio provincial / formación y comercialización | Nuevos casos de digitalización comercial | Presentaciones a comercios y capacitación comercial | [EDEP][F38] y [Jujuy Emprende][F39]; pedir orientación y una presentación, sin integrar catálogo | **P2 · B** | Competencia **baja-media**: ya articulan medios de pago. Inscripción no implica acceso a una base de clientes |
| FEMUJ | Federación de mutuales de Jujuy | Posible beneficio para asociadas y aprendizaje de operación | Introducción a una mutual con responsable de beneficios | [Sitio y sección Contacto][F40]; pedir reunión exploratoria luego de un ciclo medido | **P2 · M** | Competencia **media-alta**: podría impulsar marca blanca con otro proveedor. Evitar exclusividad o cesión del vínculo con organizadores |
| AMPUAP Jujuy | Mutual de profesionales | Beneficio para socios que necesitan equipamiento | Organizador institucional y grupo conocido potencial | [Sitio institucional][F41]; declara matrícula INAES JUJUY40. Verificar vigencia y luego conversar con beneficios | **P2 · M** | Competencia **media**: ya tiene servicios y comunidad. Matrícula declarada en su web no equivale a vigencia corroborada |
| INAES / órgano local competente | Registro y orientación; no cliente comercial | Consulta concreta dentro de su competencia | Identificación y validación registral de candidatas | [Padrón][F42], [tablero anunciado el 24/08/2026][F43] y canales institucionales | **P1 exploratoria · B** | Competencia **nula**. Estar inscripto no certifica solvencia ni aprueba nuestra operación |
| CEDEMS | Sindicato docente | Posible beneficio de reparación/equipo | Grupo laboral y responsable de beneficios, si existe interés | Pedir presentación institucional desde UNJu; hay convenio UNJu–CEDEMS del 13/08/2025 en [memoria oficial][F44]. Canal comercial vigente: **DATA GAP** | **P2 · M** | Competencia **media** por beneficios propios. No asumir descuento por recibo, padrón disponible ni aval del sindicato |
| UNJu / Centro Universitario PyME | Universidad / asistencia empresarial | Caso de campo y colaboración | Orientación contable/comercial y eventual acceso a entrevistas | [Directorio nacional][F45] y [Centro PyME][F46]; contactar el área, sin presuponer llegada a estudiantes | **P2 · M** | Competencia **baja-media**. **⚠️ >18 meses:** antecedentes de 2022–2023; actividad y disponibilidad 2026 pendientes |
| UCSE, DASS Jujuy / Extensión | Universidad / emprendedores | Actividad para estudiantes emprendedores | Entrevistas y eventual organizador | [Antecedente EMPRENDASS, 19/12/2024][F47], **⚠️ >18 meses**; consultar agenda actual de Extensión | **P2 · M** | Competencia **baja**. Evento previo no prueba convenio ni disponibilidad presente |
| ICADE Jujuy / ICADE Incuba | Instituto terciario / incubación | Caso emprendedor y articulación | Mentoría y eventual acceso a alumnos emprendedores | [Formulario de incubadora y contacto][F48]; consultar actividad actual y una oferta educativa concreta | **P2 · M** | Competencia **baja-media**. Página sin fecha menciona Fondo Semilla; vigencia financiera no corroborada |
| Gaudileo, Centro de Innovación | Formación local / articulación; no aceleradora confirmada | Venta de formación y caso aplicado | Oferta presencial y presentaciones al ecosistema | Pedir presentación desde el Club o UNJu; [actividad oficial documentada el 25/09/2024][F49], **⚠️ >18 meses** | **P2 · M** | Competencia **media** por capacidad de desarrollo. No encontramos convocatoria actual de aceleración ni CPA |
| Fraternidades bolivianas de Alto Comedero, mediante referente propio | Comunidad / organizadores | Mejor registro y coordinación, si lo necesitan | Aprendizaje de juntas existentes y confianza de un referente | Pedir introducción al área municipal vinculada a colectividades o al consulado; [articulación oficial del 14/07/2026][F50] | **P2 · M** | Competencia **media**: organizadores ya resuelven el problema manualmente. No equiparar fraternidad con grupo de pasanaku ni pedir listados de personas |
| Ferias y asociaciones de comerciantes bolivianos | Canal territorial, candidato por identificar | Herramienta adaptada a prácticas propias | Organizador y comprensión de necesidades de stock | Llegar por referente de la comunidad; validar una asociación concreta antes de proponer piloto | **P3 · M** | Competencia **media** y costo de confianza alto. **DATA GAP:** entidad, autoridad, canal vigente y demanda |

## Hallazgos que cambian decisiones y contradicciones

### 1. Telegram Mini Apps no es un atajo para Celo

**[Data · T2]** Las [reglas oficiales][F15] distinguen expresamente Mini Apps de bots comunes sin componente Mini App: estos últimos están exentos de las restricciones blockchain de esa sección. Para Mini Apps rigen TON, TON Connect y restricciones a links hacia plataformas con activos de otras redes. La transición se fechó para enero–febrero de 2025, **⚠️ >18 meses**, pero la regla sigue publicada al consultar. Esto contradice la recomendación general de Olas previas de copiar el canal Pinduoduo mediante Telegram Mini Apps para wARS.

**[Data · T2]** El [FAQ de pagos digitales][F51] exige Stars para ventas digitales dentro de bots y Mini Apps; tener una web propia no habilita por sí solo otro medio dentro de Telegram. **[Estimate]** Para el piloto PC, conviene evaluar bot común de coordinación, web independiente para la firma y venta presencial directa. Eso no constituye confirmación de que Telegram acepte el circuito ROSCA: su clasificación específica queda pendiente. Para vender cursos desde el bot hay un obstáculo adicional, aunque el bot no tenga Mini App.

### 2. MiniPay llega a Argentina, pero no confirma wARS

**[Data · T2]** La [tabla de disponibilidad][F09] incluye Argentina en Android e iOS; dentro de Opera Mini indica acceso por invitación. El [FAQ][F10] enumera USDC, USDT y USDm/cUSD, sin listar wARS. **[Estimate]** La geografía dejó de ser el principal descarte; la compatibilidad de moneda y flujo sigue abierta. No cambiar la moneda del piloto solamente para entrar a su catálogo. **DATA GAP:** usuarios activos de MiniPay en Jujuy y soporte explícito de wARS. Proxy: disponibilidad de la app. Confianza: Baja para distribución local y compatibilidad monetaria.

### 3. Ripio es prioritario; su producto CaaS no equivale a autocustodia

**[Data · T2]** [Ramps Argentina][F01] documenta entrada por transferencia a CVU/Mercado Pago y salida a CBU/CVU/alias, con verificación de identidad. [La integración de entrada][F52] permite especificar destino. En cambio, [CaaS][F53] declara que Ripio mantiene activos y ejecuta operaciones. **[Estimate]** Pedir Ramps hacia billetera propia y el recorrido inverso; no incorporar CaaS como si mantuviera el diseño elegido.

**[Data · T2 · 31/07/2026]** El [anuncio Celo–Ripio][F54] promociona rampas sin costo. **Contradicción comercial a resolver:** un anuncio no reemplaza una cotización B2B ni determina spread, mínimos, impuestos o retiro de cada usuario. No asumir margen de referidos, comisión de partner ni costo total cero.

### 4. Billetera invisible no significa firma compatible

**[Data · T2]** Celo [lista proveedores integrados][F08], pero su [guía CIP-64][F55] aclara que la billetera debe construir ese tipo de transacción; MetaMask descarta `feeCurrency`. **[Estimate]** Exigir una prueba por aporte: sesión del miembro, autorización visible, transferencia wARS, comisión de red mediante adaptador USDC, etiqueta ERC-8021 preservada, rechazo y recuperación. Son requisitos técnicos internos; no texto para la pantalla del usuario.

**[Data · T2]** [Privy][F07] ofrece distintos modelos de custodia, incluido control del desarrollador y firma delegada; [Para][F06] documenta su integración, sin que eso pruebe el circuito específico del piloto. **DATA GAP:** soporte CIP-64 efectivo y precio aplicable de Para, Privy, thirdweb y Reown. Proxy: listado Celo y compatibilidad EVM. Confianza: Baja hasta completar la prueba. No implementar las cuatro alternativas en paralelo.

### 5. Afiliado, referido y comprador empresarial son relaciones distintas

**[Data · T2]** [Coderhouse §21][F17] publica 10% adicional para afiliados, atribución de 30 días y pago contra factura; su remuneración se expresa como hasta USD 30, a su criterio, con una fórmula adicional para cuentas argentinas. No es evidencia de una comisión estándar de 10–15% ni un monto asegurado. Su referido estudiantil es otro programa.

**[Data · T2]** [Domestika][F18] publica 40% por primera compra, 20% por compra recurrente y USD 2 por registro, con cookie de 30 días y liquidación mensual por PayPal. Son condiciones publicadas, sujetas a aceptación y contrato; no se comprobó liquidación efectiva para esta cuenta argentina. [Hotmart][F19] permite elegir productos afiliables; el productor define sus condiciones. No extrapolar una comisión a todo el catálogo.

**[Data · T2]** [Platzi][F21] ofrece un mes adicional por referido en la suscripción anual; [EDteam][F24] premia con tiempo premium. **[Estimate]** Son beneficios posibles para miembros, pero no sostienen nuestro ingreso CPA en efectivo. Digital House tiene canal empresarial; eso tampoco prueba afiliación. Crehana conserva una guía de 2022, **⚠️ >18 meses**, que no demuestra admisión actual.

**[Estimate] Riesgo de atribución concreto:** cinco turnos semanales pueden llevar la última compra más allá de una cookie de 30 días. Acordar código por compra o atribución validada para cada beneficiario y verificar reglas sobre cupones, reinicio de ventana y devoluciones. No prometer comisión por un clic del día de inscripción.

### 6. La alternativa local puede ser más útil que una gran academia

**[Data · T1 · 09/06/2026]** El [Club de Emprendedores][F35] anunció articulación con oficios, empleo e innovación. **[Data · T1 · programas identificados como 2026]** [Economía Popular][F37] publica formación de ventanilla permanente y TECNOVA por cohortes para mayores de 18 años domiciliados en Jujuy, individualmente o en equipos de hasta cuatro. Esto ofrece una vía pertinente para tres perfiles técnicos; no confirma convocatoria disponible, elegibilidad final ni monto.

**[Data · T2]** [JujuyDev][F33] declara más de 600 integrantes y 51 asistentes al primer encuentro del 03/09/2026. Son cifras de la comunidad, no compradores disponibles ni verificación independiente. El dominio encontrado es `jujuy.dev.ar`; no atribuir automáticamente cualquier dominio parecido. Los nombres del staff que coinciden con nombres del equipo no prueban vínculo ni autorización. **[Estimate]** Una presentación a un organizador vale más para el piloto que difusión abierta o un supuesto alcance total.

### 7. Mutuales sí, pero con candidata y verificación registral

**[Data · T2]** [AMPUAP][F41] declara matrícula JUJUY40 y servicios para profesionales de la administración pública e independientes. La apertura directa tuvo un timeout; la evidencia comercial proviene del resultado indexado de su sitio. **[Data · T1]** El [buscador INAES][F42] permite filtrar tipo de entidad, provincia y estado; el [nuevo tablero][F43] fue anunciado el 24/08/2026. No se obtuvo una consulta registral individual que confirme hoy la vigencia de AMPUAP o CTP.

**[Estimate]** Usar FEMUJ para llegar a una candidata con responsable de beneficios y un organizador. Primero una junta voluntaria y sin custodia de la institución; marca blanca y convenios amplios quedan para después. Un padrón de socios no es una lista disponible para campañas.

### 8. Financiamiento publicado no equivale a financiamiento accesible

**[Data · T2]** [Prezenti][F05] muestra ventana del 12/08 al 29/12/2026 y respuesta en dos a cuatro semanas. Anchor parte de una exigencia publicada de 10.000 transacciones diarias; Frontier apunta a infraestructura para otros desarrolladores y Boost requiere invitación. **[Estimate]** El piloto de cinco integrantes tiene bajo encaje inmediato. La [portada][F56] conserva a la vez un bloque de temporada cerrada: confirmar estado antes de preparar solicitud.

**[Data · T2, ficha indexada del organizador]** [Celo Camp Batch 10][F04] muestra postulaciones cerradas, con cierre el 14/08/2026. Estar dentro de las fechas de ejecución del programa no permite asumir inscripción abierta. El índice `celopg.eco/programs` devolvió 404 durante la consulta: no se usó como catálogo vigente. La skill local señala que Proof of Ship terminó; no se encontró aquí un anuncio primario de cierre accesible y no se lo recomienda como financiamiento. [Celo Devs][F57] sirve para enterarse de próximas convocatorias.

## Top 5 socios para los primeros 60 días

**[Assumption] Ventana de planificación:** día 0 = 25/10/2026; día 59 = 23/12/2026. Las metas son criterios internos de prueba, no previsiones de adopción. Primero se resuelven condiciones técnicas, financieras y legales del piloto; si no están resueltas, se hacen entrevistas y ensayos sin plata de terceros. No se contactó a estas organizaciones durante esta investigación.

| Orden / socio | Próximo paso concreto | Qué llevamos y qué pedimos | Responsable propuesto / esfuerzo | Evidencia para seguir o frenar |
|---|---|---|---|---|
| **1 · Servicio técnico familiar** | **Días 0–3:** reunión con el dueño y una hoja comercial para el primer ciclo | Pedir catálogo pequeño, capacidad de entrega por turno, costo y margen de mano de obra/accesorios, precio público comparable, descuento y CPA separados; preguntar si cobra wARS o requiere pesos | **[Assumption] Maxi**, por producto y acceso familiar; **[Estimate] 2–4 horas** | **[Assumption]** Seguir si hay una oferta escrita que deja margen y un organizador dispuesto a formar cinco adultos conocidos. Frenar si el descuento exige que La Vaquita anticipe fondos o garantice deudas |
| **2 · Ripio Ramps / wARS** | **Días 0–7:** preparar consulta técnica/comercial por el canal público de [Ripio][F02] | Diagrama del circuito y cinco usuarios de prueba; pedir confirmación de ARS→wARS/Celo a billetera propia, salida a pesos, mínimos, costos totales, requisitos del equipo y soporte | **[Assumption] Esteban**, por pagos; **[Estimate] 2–4 horas de preparación**, espera externa sin estimar | **[Assumption]** Seguir con cotización y prueba de entrada/salida conciliada. Si no se demuestra wARS en el circuito completo, no lanzar el piloto monetario |
| **3 · Para, como primera candidata** | **Días 0–7:** ejecutar una prueba acotada antes de contratar; usar [docs][F06] y soporte público | Pedir un recorrido con sesión del miembro, consentimiento por aporte y recuperación; verificar los requisitos técnicos de la sección anterior y precio para el piloto | **[Assumption] Esteban con revisión de Maxi**; **[Estimate] 1–2 jornadas**, techo para decidir | **[Assumption]** Continuar si pasa firma, rechazo y recuperación sin que el agente pueda pagar por el miembro. Si falla, evaluar Privy con el mismo criterio y registrar el bloqueo; no bajar requisitos |
| **4 · JujuyDev** | **Días 3–10:** preparar propuesta a organizadores desde [canales oficiales][F33] | Demostración breve, límites de riesgo y propuesta de entrevista; pedir una presentación a un organizador con necesidad real de reparación o equipo. Aclarar cercanía temática con otros proyectos | **[Assumption] Maxi**, con Daniel para la demo; **[Estimate] 3–5 horas** | **[Assumption]** Meta: una presentación y cinco entrevistas voluntarias; no prometer un grupo por los más de 600 miembros declarados. Frenar captación si nadie quiere organizar |
| **5 · Club de Emprendedores municipal** | **Días 10–20:** solicitar entrevista al área de Desarrollo Económico por los [canales del Club][F36] | Una página con el problema de equipamiento, resultados iniciales y pedido de entrevista o taller chico. Pedir un organizador de oficios/independientes; no pedir publicidad municipal de una junta abierta | **[Assumption] Maxi**; **[Estimate] 2–4 horas de preparación**, sin plazo externo garantizado | **[Assumption]** Meta: una entrevista y una presentación útil antes del día 30. Si no responde, sostener el piloto con el comercio y JujuyDev; no retrasarlo |

**[Estimate] Secuencia comercial:** días 0–14, oferta y ensayos; días 15–49, como máximo un ciclo de cinco turnos semanales si se habilita; días 50–59, cierre de obligaciones, ventas, comisiones y entrevistas. No abrir un segundo ciclo solo para cumplir una meta de crecimiento.

**[Assumption] Qué tiene que dejar cada acuerdo del piloto:** vigencia del precio o método de actualización, stock/capacidad, libre elección del beneficiario, descuento frente al precio realmente disponible, base de CPA, venta elegible, atribución, devoluciones y fecha de facturación. La factura de marketing es parte de la hipótesis comercial; no resuelve por sí sola el encuadre legal del producto.

**[Estimate] Evaluación económica mínima:** ingreso de La Vaquita = ventas válidas atribuidas × CPA acordado, menos costos propios. Neto del comercio = precio efectivamente cobrado − CPA − costos directos − impuestos aplicables. Validar el resultado con el dueño antes de ofrecer; no usar márgenes de cursos digitales para accesorios de PC.

**[Assumption] Medición del ciclo:** participantes que completan incorporación, tiempo y costo de entrada/salida, aportes debidos/pagados/atrasados, compras efectivas, descuento frente a alternativa pública, CPA facturado/cobrado y tiempo de soporte. Una transferencia de la junta no cuenta como venta del comercio. Registrar resultados agregados; no publicar documentos, datos de compradores ni listados de socios.

## Socios para evitar o postergar

- **[Estimate] Telegram Mini Apps con Celo/wARS:** descartar como implementación estándar mientras rijan las reglas relevadas. Un link externo dentro de la Mini App tampoco salva la restricción. Bot común y canal de venta digital requieren evaluaciones distintas.
- **[Estimate] MiniPay como dependencia inicial:** postergar hasta confirmar wARS y conocer demanda local. Disponibilidad argentina no alcanza para justificar otra integración.
- **[Estimate] Ripio CaaS para reemplazar la billetera propia:** evitar ese supuesto de arquitectura; evaluar Ramps para el circuito elegido. No descartar a Ripio como socio por esa diferencia entre productos.
- **[Estimate] Self obligatorio:** postergar. País soportado no demuestra DNI argentino soportado, y exigir pasaporte/NFC puede expulsar a personas del segmento. Verificar identidad tampoco garantiza que alguien pague después de cobrar.
- **[Estimate] Grants como caja del piloto:** no comprometer gastos contra una convocatoria ni demorar ventas esperando selección. Celo DevRel puede ser útil sin adjudicación.
- **[Estimate] Smart Fit y Megatlon:** postergar por encaje territorial o comercial insuficiente y ausencia de un convenio CPA local comprobado. Un gimnasio barrial puede ser una entrevista futura más accesible.
- **[Estimate] Henry, Crehana y convenios educativos nacionales largos:** postergar hasta validar demanda y condiciones actuales. Platzi/EDteam pueden aportar beneficios, pero no ingresos en efectivo probados. Coderhouse y Domestika también deben superar la comparación con ofertas públicas y cuotas existentes.
- **[Estimate] Aplicación para Tiendanube, implementación ERP o cuatro proveedores de billeteras a la vez:** evitar el esfuerzo antes de medir una venta. Los programas SaaS pueden convertirse en otra línea de servicios que disperse a un equipo sin vendedor.
- **[Estimate] Federación, sindicato o universidad como fuente masiva de usuarios:** postergar escala hasta que exista un organizador responsable, condiciones registrales cuando correspondan y un ciclo medido. No asumir acceso por haber encontrado un programa público.
- **[Estimate] Colectividad boliviana sin referente propio:** postergar captación. Primero escuchar a un organizador presentado por la comunidad; no convertir un evento cultural, consulado o feria en una lista comercial.
- **[Estimate] Exclusividad, volumen mínimo garantizado, compra de stock por La Vaquita o garantías de cobro para el comercio:** no ofrecer en el piloto. Reintroducen capital, obligaciones o riesgos que el equipo todavía no validó.

## Data gaps y cómo cubrirlos

| Brecha | Proxy y confianza | Acción concreta para cubrirla |
|---|---|---|
| **DATA GAP: margen, catálogo y voluntad de pagar CPA del servicio técnico.** | Acceso familiar informado por el equipo; **Confianza: Baja** para disposición comercial | Entrevista con costos y una oferta escrita; comparar venta con/sin descuento y comisión |
| **DATA GAP: un organizador y cinco personas con capacidad real de aportar.** | Clientes del comercio y miembros de comunidades; **Confianza: Baja** | Entrevistas voluntarias y ensayo completo; disponibilidad comunitaria no equivale a capacidad de pago |
| **DATA GAP: aceptar wARS o convertir antes de comprar.** | Ramps documentada; **Confianza: Baja** para el circuito del comercio | Mostrar ambas experiencias y medir costo, tiempo y conciliación de devolución |
| **DATA GAP: tarifas, mínimos, elegibilidad y acuerdo de partners Ripio.** | Docs Ramps y anuncio de rampas sin costo; **Confianza: Baja** | Pedir cotización y confirmación escrita para este volumen y esta moneda; no suponer sociedad constituida ni comisión de referido |
| **DATA GAP: CIP-64, atribución y precio en Para/Privy/thirdweb/Reown.** | Listado oficial Celo; **Confianza: Baja** | Una prueba de sesión del miembro y consulta comercial; preservar la aprobación de cada aporte |
| **DATA GAP: aceptación específica de ROSCA en Telegram y alcance del circuito hacia web externa.** | Exención de bot común y reglas Stars; **Confianza: Media** para coordinación, **Baja** para todo el producto | Contrastar flujo final con términos y consultar soporte/canal de desarrolladores antes de venta de cursos dentro del bot |
| **DATA GAP: wARS y usuarios activos MiniPay en Argentina/Jujuy.** | País disponible y FAQ de monedas; **Confianza: Baja** | Consulta de compatibilidad y prueba local; no inferir demanda por distribución global |
| **DATA GAP: DNI argentino, costo y tasa de éxito Self en el segmento.** | Soporte de país y pasaporte; **Confianza: Baja** para DNI | Confirmar documento/generación con Self y probar voluntariamente, sin guardar copias |
| **DATA GAP: alta y liquidación real de afiliados argentinos.** | Términos publicados de cada academia; **Confianza: Media** sobre publicación, **Baja** sobre nuestra admisión | Solicitar condiciones firmes: base, moneda, factura, pago, cupones, contracargos, atribución y compras después de 30 días |
| **DATA GAP: programas vigentes de Henry/Crehana y CPA de Digital House/Platzi/EDteam.** | Sitios oficiales, guía antigua o referidos en especie; **Confianza: Baja** | Pregunta comercial cerrada: comisión en dinero, volumen mínimo, descuento y admisión de grupo pequeño |
| **DATA GAP: vigencia individual AMPUAP/CTP y contraparte habilitada.** | Web institucional y buscador INAES sin resultado individual; **Confianza: Baja** sobre estado registral actual | Consultar padrón y certificado vigente, confirmar representante y responsable de beneficios antes de cualquier acuerdo |
| **DATA GAP: actividad 2026 y acceso a UNJu, UCSE, ICADE o Gaudileo.** | Antecedentes institucionales, algunos **⚠️ >18 meses**; **Confianza: Baja** | Consulta a cada área sobre agenda actual; pedir entrevistas, sin asumir acceso a estudiantes ni llamar aceleradora a un centro de formación |
| **DATA GAP: cupos, fechas y desembolsos TECNOVA/otros apoyos.** | Programa provincial publicado y resoluciones identificadas; **Confianza: Baja** sobre fondos disponibles | Pedir bases operativas, cohorte abierta y elegibilidad; presupuestar el piloto sin aporte |
| **DATA GAP: convocatoria Celo vigente y adecuada al piloto.** | Calendario Prezenti con inconsistencias; Celo Camp cerrado; **Confianza: Baja** sobre financiamiento accesible | Consulta a organizador; verificar encaje antes de preparar postulación |
| **DATA GAP: convenio local Smart Fit, oferta Nubicom en Jujuy y condiciones CTP.** | Sitios nacionales/regionales; **Confianza: Baja** | Validar domicilio servido, contrato, descuento y comisión. No confundir una promoción pública con beneficio exclusivo |
| **DATA GAP: asociación boliviana o feria concreta que quiera participar.** | Articulación municipal con fraternidades; **Confianza: Baja** | Introducción a referente y entrevista sobre su práctica; no inferir uso de pasanaku por nacionalidad |

## Fuentes con URL, fecha y tier

Las referencias comerciales sin fecha se consultaron el **25/10/2026**. Los términos pueden cambiar; las cifras publicadas se atribuyen a su emisor. Se conservaron URLs de las páginas efectivamente encontradas; las fallas de apertura se explicitan cuando afectan la evidencia. No se guardaron correos, documentos personales ni datos de compradores.

### Infraestructura

- **F01 · T2 · s/f:** [Ripio Ramps: Argentina][F01]. Métodos y requisitos del país.
- **F02 · T2 · s/f:** [Ripio: sitio y canal comercial][F02]. No se encontró programa público con comisión de partners.
- **F03 · T2 · s/f:** [Celo: financiamiento y vías de acompañamiento][F03]. Directorio oficial del ecosistema.
- **F04 · T2 · ficha 2026:** [Celo Camp Batch 10, Rise In][F04]. Evidencia indexada; apertura completa no disponible durante la investigación.
- **F05 · T2 · calendario 2026:** [Prezenti: calendario y elegibilidad][F05]. Contrastar con F56.
- **F06 · T2 · s/f:** [Para: documentación vigente][F06]. No confirma por sí sola CIP-64 para el flujo propuesto.
- **F07 · T2 · s/f:** [Privy: modelos de custodia][F07]. Distingue modalidades de control y delegación.
- **F08 · T2 · s/f:** [Celo: proveedores de billeteras][F08]. Lista de opciones, no certificación del piloto.
- **F09 · T2 · s/f:** [MiniPay: disponibilidad por país][F09]. Incluye Argentina.
- **F10 · T2 · s/f:** [MiniPay: preguntas frecuentes][F10]. Monedas publicadas; inconsistencia editorial en nombres no prueba soporte adicional.
- **F11 · T2 · s/f:** [MiniPay: presentación de Mini Apps][F11]. Ruta pública para consulta de encaje/listado.
- **F12 · T2 · s/f:** [Self Enterprise: documentos compatibles][F12]. No acredita DNI argentino común.
- **F13 · T2 · s/f:** [Self Enterprise: países compatibles][F13]. Soporte del país no sustituye el del documento.
- **F14 · T2 · s/f:** [Telegram Bot API][F14]. Interfaz pública de bots.
- **F15 · T2 · regla con transición ene–feb 2025, ⚠️ >18 meses:** [Telegram: reglas blockchain y exención de bots comunes][F15]. Página viva consultada en 2026.
- **F16 · T2 · s/f:** [Telegram: términos de desarrolladores, sección 7][F16]. Reglas de plataforma.
- **F51 · T2 · s/f:** [Telegram: pagos digitales y Stars][F51]. Diferencia ventas digitales de bienes/servicios físicos.
- **F52 · T2 · s/f:** [Ripio: integración de entrada de Ramps][F52]. Flujo técnico con billetera de destino.
- **F53 · T2 · s/f:** [Ripio: Crypto as a Service][F53]. Custodia declarada por el proveedor.
- **F54 · T2 · 31/07/2026:** [Celo: despliegue wFIAT de Ripio y anuncio de rampas][F54]. Comunicado, no cotización.
- **F55 · T2 · s/f:** [Celo: abstracción de comisiones y soporte CIP-64][F55]. Limitaciones de billeteras.
- **F56 · T2 · s/f:** [Prezenti: portada][F56]. Bloque de cierre que requiere contraste con calendario.
- **F57 · T2 · s/f:** [Celo Developers: newsletter][F57]. Seguimiento de convocatorias.
- **F58 · T2 · 26/03/2025, ⚠️ >18 meses:** [Reown: tutorial Celo][F58]. Usa Alfajores; sirve como antecedente, no configuración vigente.

### Comercios, educación y servicios

- **F17 · T2 · s/f:** [Coderhouse Argentina: términos, secciones 18 y 21][F17]. Referidos y afiliación separados.
- **F18 · T2 · s/f:** [Domestika: afiliados][F18]. Condiciones publicadas y formulario de admisión.
- **F19 · T2 · s/f:** [Hotmart: programa de afiliados][F19]. Selección de productos y registro.
- **F20 · T2 · s/f:** [Digital House: soluciones para empresas][F20]. No demuestra CPA para La Vaquita.
- **F21 · T2 · s/f:** [Platzi: precios y FAQ][F21]. Referidos con mes adicional.
- **F22 · T2 · s/f:** [Henry: sitio oficial][F22]. Canal de asesor; no se encontró programa público de CPA.
- **F23 · T2 · 18/04/2022, ⚠️ >18 meses:** [Crehana: guía de afiliados][F23]. Antecedente antiguo.
- **F24 · T2 · s/f:** [EDteam: ayuda de referidos][F24]. Beneficios en tiempo premium.
- **F25 · T2 · s/f:** [Tiendanube: categorías de socios][F25]. Afiliados, especialistas y tecnología.
- **F26 · T2 · actualización 17/06/2026:** [Tiendanube: FAQ de Asociados][F26]. Admisión y requisitos.
- **F27 · T2 · s/f:** [Alegra Partners Argentina][F27]. Solicitud, certificación y modalidad comercial.
- **F28 · T2 · términos con transición 2026–2027:** [Xubio Argentina: partners][F28]. Descuentos e incentivos sujetos a reglas.
- **F29 · T2 · s/f:** [Smart Fit Argentina][F29]. No acredita convenio local CPA.
- **F30 · T2 · s/f:** [Megatlon: corporativo][F30] y [presencia territorial institucional](https://megatlon.com/rrhh/).
- **F31 · T2 · s/f:** [Nubicom: servicios y canales][F31]. Cobertura concreta a validar.
- **F32 · T2 · s/f:** [Cooperativa Telefónica de Perico: sitio institucional y contacto][F32]. No certifica vigencia registral.

### Instituciones y comunidad

- **F33 · T2 · s/f, refiere actividad de septiembre 2026:** [JujuyDev: sitio oficial][F33]. Tamaño autodeclarado y canales de organización.
- **F34 · T2 · s/f, contiene eventos 2026:** [SaltaDev: sitio vigente][F34]. Comunidad y articulación regional.
- **F35 · T1 · 09/06/2026:** [Municipalidad: nueva etapa del Club de Emprendedores][F35]. Áreas y articulación.
- **F36 · T3 · perfil de canales, consulta 25/10/2026:** [Club de Emprendedores: Linktree][F36]. Ruta de contacto; corroborar identidad al usarla.
- **F37 · T1 · programas identificados como 2026:** [Secretaría de Economía Popular de Jujuy][F37]. TECNOVA, formación y formulario; cupos no confirmados.
- **F38 · T1 · s/f:** [EDEP Jujuy][F38]. Formación provincial.
- **F39 · T1 · s/f:** [Ministerio: Jujuy Emprende][F39]. Registro y comercialización; vigencia de cada beneficio a consultar.
- **F40 · T2 · s/f, contiene noticias 2025–2026:** [FEMUJ][F40]. Entrada institucional a mutuales.
- **F41 · T2 · s/f:** [AMPUAP Jujuy][F41]. Evidencia indexada del sitio; apertura directa con timeout.
- **F42 · T1 · registro vivo:** [INAES: buscador de entidades][F42]. No se obtuvo resultado registral individual en esta investigación.
- **F43 · T1 · 24/08/2026:** [INAES: nuevo tablero de entidades vigentes][F43]. Anuncio y ruta de acceso.
- **F44 · T1 · memoria 2024–2025, convenio del 13/08/2025:** [UNJu: memoria del Consejo Superior][F44]. Antecedente CEDEMS; no es acuerdo con La Vaquita.
- **F45 · T1 · antecedente de 2023, ⚠️ >18 meses:** [Centros Universitarios PyME: directorio nacional][F45]. Entrada UNJu y servicios.
- **F46 · T1 · antecedente de 2022, ⚠️ >18 meses:** [Centro PyME UNJu][F46]. Contenido indexado accesible; apertura directa con timeout. Actividad actual pendiente.
- **F47 · T2 · 19/12/2024, ⚠️ >18 meses:** [UCSE: EMPRENDASS en Jujuy][F47]. Comunicado del evento del 12/12/2024; no convocatoria vigente.
- **F48 · T2 · s/f, antigüedad desconocida:** [ICADE Incuba][F48]. Menciona Fondo Semilla sin demostrar vigencia 2026.
- **F49 · T1 · 25/09/2024, ⚠️ >18 meses:** [Gobierno de Jujuy: actividad organizada por Gaudileo][F49]. Antecedente de articulación y formación, no programa actual de aceleración.
- **F50 · T1 · 14/07/2026:** [Municipalidad: articulación con colectividad boliviana][F50]. Más de 30 fraternidades previstas para la actividad; no prueba de usuarios de juntas.

[F01]: https://docs.ripio.com/ramps-api/overview/countries/argentina
[F02]: https://www.ripio.com/es
[F03]: https://docs.celo.org/build/fund-your-project
[F04]: https://www.risein.com/celo/celo-camp-batch-10
[F05]: https://www.prezenti.xyz/grants
[F06]: https://docs.getpara.com/v3/introduction/welcome
[F07]: https://docs.privy.io/wallets/overview/flexible-custody
[F08]: https://docs.celo.org/build/tools/wallets
[F09]: https://docs.minipay.xyz/getting-started/availability.html
[F10]: https://minipay.to/faq
[F11]: https://minipay.to/mini-apps
[F12]: https://docs.self.xyz/docs/self-enterprise/flows/supported-documents/
[F13]: https://docs.self.xyz/docs/self-enterprise/reference/supported-countries/
[F14]: https://core.telegram.org/bots/api
[F15]: https://core.telegram.org/bots/blockchain-guidelines
[F16]: https://telegram.org/tos/bot-developers
[F17]: https://www.coderhouse.com/ar/legales
[F18]: https://www.domestika.org/es/affiliates
[F19]: https://hotmart.com/es/afiliados?authuser=0
[F20]: https://www.digitalhouse.com/landing/membresia-empresas
[F21]: https://platzi.com/precios/
[F22]: https://www.soyhenry.com/
[F23]: https://www.crehana.com/business/descargables/afiliado-crehana/
[F24]: https://ayuda.ed.team/article/89-referidos
[F25]: https://www.tiendanube.com/socios
[F26]: https://tiendanube.helpjuice.com/tiendanube-asociados/preguntas-frecuentes-sobre-el-programa-de-asociados
[F27]: https://argentina.alegra.com/partners/
[F28]: https://xubio.com/ar/partners-contadores
[F29]: https://www.smartfit.com.ar/
[F30]: https://megatlon.com/corporativo/
[F31]: https://nubicom.com.ar/
[F32]: https://ctp.com.ar/index9.php
[F33]: https://jujuy.dev.ar/
[F34]: https://salta.dev/
[F35]: https://www.sansalvadordejujuy.gob.ar/el-club-de-emprendedores-impulsa-una-nueva-etapa-de-crecimiento-e-innovacion-en-la-ciudad/
[F36]: https://linktr.ee/clubdeemprendedoresjujuy
[F37]: https://economiapopular.jujuy.gob.ar/
[F38]: https://edep.jujuy.gob.ar/
[F39]: https://www.produccion.jujuy.gob.ar/?page_id=3877
[F40]: https://www.femujujuy.com.ar/
[F41]: https://ampuapjujuy.com.ar/
[F42]: https://www2.inaes.gob.ar/Webinaes/BusquedaEntidades/Index
[F43]: https://www.argentina.gob.ar/noticias/nuevo-tablero-de-estadisticas-de-cooperativas-y-mutuales-vigentes
[F44]: https://www.unju.edu.ar/Documents/memoria_anual/2024_2025/MEMORIA%20ANUAL%20CONSEJO%20SUPERIOR%202024-2025.pdf
[F45]: https://www.argentina.gob.ar/produccion/procer/centros-universitarios-pyme
[F46]: https://fce.unju.edu.ar/centropymeunju
[F47]: https://www.ucse.edu.ar/notiucse/2024/12/19/una-nueva-edicion-de-emprendass-reune-a-jovenes-emprendedores/
[F48]: https://www.icadejujuy.edu.ar/icade-incuba.html
[F49]: https://prensa.jujuy.gob.ar/trabajo/el-futuro-del-trabajo-n116776
[F50]: https://www.sansalvadordejujuy.gob.ar/la-municipalidad-acompanara-los-actos-alusivos-al-201-aniversario-de-la-independencia-de-bolivia/
[F51]: https://core.telegram.org/bots/payments-stars
[F52]: https://docs.ripio.com/ramps-api/guides/on-ramp-integration
[F53]: https://docs.ripio.com/crypto-as-a-service/overview/introduction
[F54]: https://blog.celo.org/ripio-deploys-wfiat-stack-on-celo-with-no-cost-on-off-ramps-expanding-the-leading-stablecoin-9f801b82b899
[F55]: https://docs.celo.org/build/fee-abstraction/overview
[F56]: https://www.prezenti.xyz/
[F57]: https://celo-devs.beehiiv.com/subscribe
[F58]: https://reown.com/blog/how-to-get-started-with-reown-appkit-on-celo
