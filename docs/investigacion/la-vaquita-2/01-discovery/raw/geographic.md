# D2 · Entrada geográfica y mercados — La Vaquita 2.0

> Ola 4 · Corte de análisis: **24-10-2026** · Investigación realizada: **25-10-2026**.
> Alcance: piloto en San Salvador de Jujuy, expansión argentina y comparación de Perú, Colombia, México, Bolivia y Chile.
> **[Data]**: dato o afirmación atribuible a una fuente. **[Estimate]**: cálculo o conclusión de esta investigación. **[Assumption]**: hipótesis o umbral propuesto para probar. **⚠️**: período del dato o publicación normativa anterior al 24-04-2025; no significa que una norma haya perdido vigencia.
> Tier 1: organismos públicos, normativa, investigación académica e informes de analistas. Tier 2: prensa y comunicados institucionales o de prestadores. Tier 3: blogs, páginas comerciales y redes. Una fuente comercial puede documentar su oferta sin demostrar adopción. Fuentes sin fecha: antigüedad desconocida; las páginas dinámicas consultadas el 25-10 no constituyen una captura histórica del 24-10.

## 1. Recomendación y alcance de la evidencia

**[Estimate] Jujuy es una buena ciudad para aprender con este equipo, pero no está demostrado que sea el mejor mercado argentino.** Gana por el acceso real a un servicio técnico de PC y a una distribuidora de limpieza familiares, según el contexto del equipo. Esa ventaja permite acompañar compras, observar problemas y conseguir confianza sin armar primero una fuerza comercial. No hay evidencia comparable que ubique a Jujuy por encima de Salta, Tucumán, Córdoba o CABA en demanda de juntas, capacidad de pago o adopción cripto.

**[Assumption] El primer grupo debería tener cinco adultos conocidos, un organizador y hasta cinco turnos**, alrededor de una necesidad de trabajo concreta: reparación, mantenimiento o accesorios de PC. El beneficiario recibe plata y decide libremente dónde comprar; el servicio técnico ofrece un descuento separado. No se condiciona el cobro a comprar ahí. La universidad y la comunidad boliviana son canales posibles posteriores: no hay acceso confirmado a ninguna de las dos.

**[Estimate] Secuencia recomendada:** San Salvador de Jujuy → réplica independiente en Salta → oferta de cursos y servicios digitales para grupos argentinos, con Córdoba como primera plaza de prospección remota. Después: **Argentina → Colombia → Perú**, sujeto a distribución y validación jurídica. Colombia pasa delante de Perú porque encontramos documentación de entrada y salida bancaria en COP; todavía hay que verificar que esa ruta permita operar específicamente con wCOP en Celo para nuestros usuarios. No es una prueba de demanda ni una garantía de funcionamiento. [F15, F18]

El contexto de las Olas 1–3 se usa como antecedente, sin recalcular mercado nacional ni repetir sus benchmarks. Se leyeron [C3 · audiencia](audience-profile.md), [A3 · regulación](regulatory.md) y [A4 · adyacencias](adjacent-markets.md). Esta investigación es una propuesta para La Vaquita 2.0; no cambia las decisiones vigentes del MVP del hackathon.

### Cómo se investigó

Se hicieron más de 30 consultas web, además de abrir documentos y contrastar fuentes, organizadas en seis bloques de profundización:

| Ronda | Pregunta y búsquedas representativas | Qué resolvió |
|---|---|---|
| 1 | Censo Jujuy/Salta/Tucumán/Córdoba/CABA; MAUTIC; penetración ENACOM | Separar población, geografía administrativa y conectividad. |
| 2 | Macro agente financiero; Naranja X sucursales y cuenta compartida; Sucrédito NOA; mutuales INAES | Identificar alternativas reales y evitar contar bancos históricos como actuales. |
| 3 | Ley impositiva Jujuy 2026; publicidad digital; procesamiento de pagos; Ley 5992; Convenio Multilateral | Encontrar costos y obligaciones locales específicos. |
| 4 | Ripio wFIAT Celo; países de Ramps API; retiros ARS; otras rampas wARS | Distinguir token, acceso bancario y funcionamiento efectivo. |
| 5 | Junta/pandero Perú; cadena/natillera Colombia; tanda México; pasanaku Bolivia; polla Chile; autoridades locales | Comparar cultura y perímetros regulatorios con fuentes primarias. |
| 6 | Banxico 4/2019; SBS Regla de Viaje; DS 5384; BancoSol; MiCadena; fuentes contradictorias | Corregir supuestos y definir condiciones de expansión. |

No se contactó a comercios, reguladores ni usuarios. No se abrieron cuentas ni se hicieron pagos. Los umbrales de validación de abajo son propuestas, no resultados obtenidos.

## 2. Mercado objetivo: tamaño, concentración y capacidad de acceso

### 2.1 Qué sabemos de Jujuy

| Variable | Evidencia y fecha | Uso correcto |
|---|---|---|
| Población provincial | **[Data] 811.611**, Censo 2022 ⚠️; DIPEC y perfil sanitario oficial. [F1, F2] | Referencia demográfica provincial, no clientes potenciales actuales. |
| Departamento Dr. Manuel Belgrano | **[Data, base C3] 320.990**, Censo 2022 ⚠️. C3 lo toma de una reproducción del censo; la descarga primaria completa no se pudo reabrir. [F1, F3] | Aproximación al entorno del piloto; **no equivale automáticamente al municipio de San Salvador ni al aglomerado Jujuy-Palpalá**. |
| Personas de 20–29 años | **[Data, base C3] 133.421 en toda la provincia**, Censo 2022 ⚠️; reproducción secundaria no revalidada en tabla primaria. [F3] | No son 133.421 jóvenes de la capital ni 133.421 compradores de tecnología. |
| Concentración demográfica | **[Estimate] 39,5%** de la población provincial en Dr. Manuel Belgrano: 320.990 / 811.611. | Sugiere concentración para acompañamiento presencial; no mide densidad de independientes. |
| Orden de magnitud juvenil local | **[Estimate] ≈52.800 personas de 20–29 años**, si el departamento tuviera la misma estructura de edades provincial: 320.990 × 133.421 / 811.611. | Proxy demográfico de confianza baja; **no es mercado atendible ni previsión de ventas**. No descuenta ingreso, necesidad, confianza ni disposición a usar wARS. |
| Pobreza | **[Data, base C3] 27,6%**, Jujuy-Palpalá, primer semestre de 2026. | Contexto de restricción de ingresos; no trasladar el porcentaje a cada persona, municipio o cohorte. No se recalculó en esta ola. |
| Margen para ahorrar | **[Data, base C3] 13–15% de asalariados**, opinión de una contadora en prensa, agosto de 2026. | No es una encuesta representativa ni describe a independientes. No multiplicarlo por la población para calcular mercado. |
| Distribución accesible | **[Data, contexto del equipo] Dos comercios familiares; uno de PC y otro de limpieza**, al corte de esta investigación. | Acceso para conversar y preparar un piloto; no hay contratos, descuentos ni clientes adheridos confirmados. |

**DATA GAP: cantidad y concentración barrial de independientes/jóvenes con una compra de PC prevista y capacidad para sostener cinco turnos. Proxy: demografía departamental y acceso al servicio técnico. Confianza: Baja.** Para cubrirlo: contar, con autorización y sin copiar datos personales al repo, consultas agregadas del comercio por reparación/accesorio, ticket, recurrencia y barrio durante cuatro semanas; después entrevistar a los interesados.

### 2.2 Tamaño inicial de abajo hacia arriba

**[Assumption] Primera unidad de aprendizaje: un comercio de PC × un organizador × cinco miembros únicos = una junta de cinco personas.** Si termina bien, sumar otros dos organizadores y diez participantes distintos: tres juntas y quince personas en total. No usar una tasa de adopción arbitraria de toda Jujuy.

**[Estimate] Con cinco miembros, cinco turnos y cuatro aportantes por turno hay veinte obligaciones de pago por ciclo**, bajo la fórmula del repo en la que el beneficiario no se transfiere a sí mismo. Tres grupos producen sesenta obligaciones previstas y quince oportunidades de compra. Ni sesenta pagos ni quince compras están garantizados; comprar al asociado es optativo. La facturación proviene de compras atribuidas, no del volumen que rota entre miembros.

**[Estimate] La densidad útil para este piloto es la cantidad de grupos completos que puede formar un organizador confiable**, no habitantes por kilómetro cuadrado. No encontramos una medición comparable de esa variable en las cinco plazas. El comercio de PC tiene mejor acceso demostrado para el equipo; la superioridad de su demanda sigue siendo una hipótesis.

## 3. Comparación de ciudades piloto argentinas

Los tamaños son referencias censales de **2022 ⚠️**, sin proyectarlos a 2026. Se explicita la unidad porque departamento, municipio y aglomerado no son intercambiables. La columna de acceso digital usa un indicador común de ENACOM: **accesos de internet fijo por cada cien hogares, segundo trimestre de 2026**, de alcance provincial; no mide usuarios únicos ni uso de billeteras. [F4–F8]

| Plaza | Tamaño de referencia y concentración del público | Juntas/pasanaku y acceso digital | Competencia | Costo de llegar con este equipo | Decisión |
|---|---|---|---|---|---|
| **San Salvador de Jujuy** | Dr. Manuel Belgrano: **320.990** [base C3]. **[Estimate]** Base menor, con acceso directo al punto de compra; independientes tech por barrio: DATA GAP. | **[Data] Jujuy: 66,42** accesos fijos/100 hogares. Pasanaku documentado en Argentina, sin prevalencia local medida. | **[Estimate] Alta en alternativas**: Naranja X, Macro, Sucrédito, transferencias y grupos manuales. ROSCA comercial local: DATA GAP. | **[Assumption] Menor desembolso marginal** por dos contactos familiares y acompañamiento local. Horas y CAC monetario: DATA GAP; cercanía no significa costo cero. | **Primero, para validar operación y confianza.** |
| **Salta** | Departamento Capital: **627.704**, según Senado provincial. Hay discrepancias con otras series; usar **≈0,62 millones**, no todo Gran Salta. [F4] **[Estimate]** Mayor base demográfica cercana. | **[Data] Salta: 73,79**. Una nota de Que Pasa Salta describe pasanaku en Argentina, **no mide participación salteña**. [F9] | Macro, Naranja X y Sucrédito; sin evidencia de un espacio competitivo vacío. | **[Assumption] Bajo–medio relativo** para réplica regional, pero sin organizador o comercio confirmado. Cotizar viaje y soporte antes de fijar presupuesto. | **Segunda plaza**, si aparece un referente independiente. |
| **San Miguel de Tucumán** | Municipio: **590.342** según portal nacional; un mapa provincial publica **584.798** para Capital. No resolver la discrepancia mezclando versiones. [F5] **[Estimate]** Concentración urbana atractiva; público técnico cuantificado: DATA GAP. | **[Data] Tucumán: 63,23**. Penetración local de juntas: DATA GAP. | Macro, Naranja X y **Sucrédito con casa central local**. [F10–F13] | **[Assumption] Medio relativo**: requiere otra red de confianza y soporte fuera de la plaza inicial. | **Alternativa a Salta si consigue mejor socio**, no tercera apertura automática. |
| **Córdoba capital** | Municipio: **1.505.250**. [F6] **[Estimate]** Mayor reservorio potencial para cursos y servicios de trabajo; cantidad alcanzable de estudiantes/independientes: DATA GAP. | **[Data] Córdoba provincial: 87,21**. No hay tasa comparable de juntas ni cripto por ciudad. | **[Data] Naranja nació en Córdoba en 1985**; oferta actual de cuenta compartida y cuotas. **[Estimate]** Exigencia de diferenciación alta. [F11, F14] | **[Assumption] Alto para desembarco presencial; menor para probar un comercio digital** que atienda grupos ya armados. Sin convenio universitario confirmado. | **Prospección remota después de probar réplica**; no instalar operación local todavía. |
| **CABA / AMBA** | **CABA: 3.121.707**. [F7] AMBA incluye otras jurisdicciones: **DATA GAP de población con delimitación homogénea** para esta comparación. **[Estimate]** Gran oferta potencial, con dispersión de redes en AMBA. | **[Data] CABA: 119,93; provincia de Buenos Aires: 94,56**. No son porcentajes de personas conectadas; PBA no equivale a AMBA. | Naranja X, Mercado Pago, bancos, cuotas, descuentos y organizadores manuales. Participaciones de mercado locales: DATA GAP. | **[Assumption] Alto en captación presencial sin contactos; plausible atención remota** si llega un organizador por referido. CAC comparado: DATA GAP. | **Aceptar demanda orgánica; postergar expansión geográfica paga.** |

**[Estimate] No hay fundamento para afirmar “Jujuy tiene menor competencia” porque es más chica.** Las billeteras y tarjetas nacionales llegan al NOA; la competencia manual también puede tener mucha confianza. La ventaja defendible inicial es resolver una compra concreta con un organizador conocido y demostrar un descuento real.

**Contradicción demográfica:** una fuente pública puede reproducir una versión anterior o una unidad distinta del censo. Tucumán muestra 590.342 frente a 584.798 en páginas oficiales. En Salta, un informe alojado en CFI publica 624.003 residentes de Capital en viviendas particulares, mientras el Senado informa 627.704 habitantes. No se calcula crecimiento ni densidad entre estas cifras sin reconciliar universo y versión. [F4, F5]

### 3.1 Conectividad y adopción: qué se puede comparar

**[Data] MAUTIC, cuarto trimestre de 2024 ⚠️**, informa hogares con acceso a internet: **Jujuy-Palpalá 93,9%; Salta 96,5%; Gran Tucumán-Tafí Viejo 95,4%; CABA 96,2%; partidos del GBA 93,0%**. Son aglomerados y hogares, no provincias ni usuarios de cripto. [F8]

**[Estimate] No hay contradicción con los 66,42 accesos fijos/100 hogares de Jujuy en ENACOM:** cambian geografía, período y definición; MAUTIC contempla acceso a internet y ENACOM cuenta conexiones fijas. Valores de ENACOM mayores a cien tampoco implican que todas las personas estén conectadas. No usar ninguno como tasa de onboarding a wARS.

**[Data] El BCRA reporta 37,8 millones de personas con cuentas a diciembre de 2025 y 29,5 millones que hicieron pagos electrónicos en el último trimestre de ese año**, en un informe publicado el 30-04-2026. No ofrece aquí una cuota comparable de compras en efectivo para cada ciudad candidata. [F19]

**DATA GAP: efectivo versus digital y cripto por ciudad, dentro del público objetivo. Proxy: conectividad y cuentas nacionales. Confianza: Baja.** Cubrir preguntando cómo se cobra el trabajo, cómo se paga hoy al técnico y cuántos pasos adicionales acepta cada participante. No concluir “NOA = efectivo” ni “Córdoba/CABA = usuarios cripto” a partir de estereotipos.

## 4. Dinámica competitiva local y canales institucionales

| Actor | Evidencia verificable | Implicación para entrar |
|---|---|---|
| **Banco Macro** | **[Data]** Tesorería nacional lo lista como agente financiero de **Jujuy, Salta y Tucumán**. Su memoria 2024 ⚠️ informa renovación jujeña por diez años. [F10] | **[Estimate]** Relación cotidiana con sueldos y pagos provinciales; competir por confianza y facilidad de uso, no solo por tasas. No se encontró cuota de clientes objetivo por ciudad. |
| **“Banco de Jujuy”** | **[Data]** La documentación de Macro identifica al antiguo Banco de Jujuy como absorbido; su historia registra la incorporación en 1998 ⚠️. [F10] | **[Estimate]** No contarlo como otro banco provincial independiente vigente. |
| **Naranja X** | **[Data]** Su web declara presencia en todas las provincias y más de 150 sucursales, sin fecha visible. La cuenta compartida admite **hasta diez integrantes y tres cuentas por persona**, con pagos, transferencias y Frascos. [F11] | **[Estimate]** “Ver la plata del grupo” ya tiene sustituto. La oportunidad está en obligaciones por turno, seguimiento y beneficio comercial verificable; no asumir que la marca carece de penetración en Jujuy. |
| **Tarjeta Sucrédito / Banco Sucrédito Regional** | **[Data]** La tarjeta declara once sucursales, casa central en Tucumán y presencia en Jujuy/Salta. El BCRA identifica al banco como entidad 00435; en enero de 2026 registra dos sucursales plenas en Tucumán y agencias complementarias en otras provincias. [F12, F13] | **[Estimate]** Cuotas y promociones locales son una alternativa importante. Once locales de la tarjeta no equivalen a once sucursales bancarias. |
| **Mercado Pago y transferencias** | **[Data, base Olas 1–3]** Herramientas de pagos y metas ya investigadas. | **[Assumption]** Preguntar por qué no alcanza un grupo de chat y transferencias. Si la respuesta es “alcanza”, el descuento o la coordinación deben probar valor adicional. |
| **Mutuales y cooperativas** | **[Data]** INAES permite consultar padrón por provincia y estado. El boletín jujeño documenta actividad de **AMUCDEMS, matrícula 35-Jujuy**, con convocatoria en julio de 2025. Eso no demuestra socios activos ni voluntad de trabajar con nosotros. [F20, F21] | **[Estimate]** Canal posterior con referente y base existente. No sumar mutuales de un directorio comercial como clientes ni tratar una matrícula como habilitación para cualquier servicio financiero. |
| **Organizaciones de microcrédito del NOA** | **[Data]** Una publicación provincial de mayo de 2017 ⚠️ menciona Juanita Moro, Mutual 23 de Agosto y organizaciones de Perico; PAICOOP muestra apoyo a cooperativas, pero su página no fecha las condiciones. [F22] | **[Estimate]** Hay infraestructura comunitaria para investigar; no corresponde afirmar operación vigente, tamaño o tasas actuales a partir de esas páginas. No es el canal inicial. |
| **Junta manual / pasanaku** | **[Data]** Prensa regional de enero de 2026 documenta la práctica en Argentina. No se encontró censo de grupos en las cinco ciudades. [F9] | **[Estimate]** El organizador puede ser canal y alternativa al producto a la vez. Hay que demostrar que le ahorramos trabajo sin quitarle control al grupo. |

**DATA GAP: fintech o cooperativa con predominio medido en ahorro grupal del NOA. Proxy: presencia comercial, padrones y oferta pública. Confianza: Baja.** Antes de afirmar liderazgo local, pedir referencias a organizadores y contrastar oferta de comercios. No se encontraron participaciones de mercado comparables.

## 5. Barreras de entrada en Jujuy y expansión argentina

### 5.1 Ingresos Brutos y otras obligaciones locales

**[Data] La Ley jujeña 6492, publicada el 17-12-2025, rige desde el 01-01-2026.** Su Anexo III, artículo 11, distingue **publicidad digital: 3,5%; gestión/procesamiento de pagos por cuenta de terceros: 5%; intermediación de servicios mediante plataformas: 6%**. El artículo 12 fija un **mínimo mensual general de $13.800** para actividades sin mínimo especial. [F23]

**[Estimate] Facturar “marketing” no determina por sí solo la actividad aplicable.** Hay que revisar prestación efectiva, contrato y régimen del contribuyente. El objetivo económico es gravar los ingresos propios por comisiones, sin confundirlos con aportes entre miembros; el encuadre y la base requieren confirmación contable. No se presume que el régimen general ni su mínimo correspondan a todos los casos.

**[Assumption] Para presupuestar el piloto**, comparar liquidación general, régimen simplificado/unificado si resulta elegible y beneficios aplicables. Incluir costo administrativo y mínimos, no solamente multiplicar la comisión por 3,5%. No se verificó cuál sería el alta fiscal concreta del equipo.

**[Data] La RG CA 5/2021 ⚠️ contempla operaciones digitales y presencia digital para el sustento territorial del Convenio Multilateral.** Vender desde Jujuy a otras provincias no permite asumir que toda la actividad queda únicamente en Jujuy. [F24] **[Estimate]** Antes de sumar comercios de otra provincia, revisar atribución de ingresos, retenciones y obligaciones; este informe no calcula una tasa nacional uniforme.

**[Data] El calendario municipal 2026 menciona canon de publicidad y propaganda; el Concejo trató en julio de 2026 un proyecto referido a ese canon y a la tasa de Inspección, Seguridad, Salubridad e Higiene.** [F25] **DATA GAP: aplicación concreta a una operación digital sin local propio. Proxy: normativa y trámites municipales. Confianza: Baja.** Cubrir con consulta profesional usando domicilio, actividad y publicidad reales; no confundir un proyecto con una exención aprobada.

### 5.2 Defensa del consumidor y confianza

**[Data] La Ley provincial 5992/2016 ⚠️ regula el procedimiento administrativo de defensa del consumidor, y el portal oficial señala modificación por Ley 6359.** Existe autoridad provincial y un canal federal de reclamos que deriva a la jurisdicción correspondiente. [F26]

**[Assumption] Preparar antes del piloto:** condiciones del descuento, precio de contado comparable, vigencia, qué cubre la reparación, garantía, devolución, responsable comercial y canal de reclamo. Explicar aparte qué pasa con las obligaciones de la junta si una compra falla. El hecho de que pague el comercio no permite dar por descartada una relación de consumo con la plataforma.

**[Data, base C3] Se registró una nota fechada el 24-10-2026 sobre una presunta estafa financiera.** La página original no pudo abrirse en esta ola; otro portal muestra una nota similar el 17-10-2026. **DATA GAP: fecha del hecho y relación entre ambas publicaciones. Proxy: referencias de prensa. Confianza: Baja.** No medir incidencia ni atribuirle un cambio cuantificado de conducta. [F27]

**[Assumption] Presentar una “junta entre conocidos para una compra de trabajo”**, sin prometer rendimiento. El referente conocido ayuda a reclutar, pero no garantiza cumplimiento. Explicar en lenguaje simple que el peso digital tiene emisor, que cada miembro firma y que existe riesgo de atraso, incumplimiento y problemas de conversión. Evitar jerga no significa ocultar esos riesgos.

### 5.3 Marco nacional: cambiar de ciudad no resuelve el encuadre

**[Data, base A3] El análisis anterior identificó la RG IGJ 8/2015 y la RG CNV 1172/2026 como normas relevantes.** La reapertura de esta última en el Boletín Oficial falló durante esta ola; no se agrega una conclusión jurídica nueva sobre su alcance. [F28]

**[Estimate] Separar el pago al beneficiario de la compra al comercio reduce la vinculación comercial obligatoria, pero no prueba una exención de los regímenes de ahorro, captación o servicios con activos virtuales.** Grupos por invitación, firma del miembro y ausencia de custodia son características del diseño, no permisos regulatorios. El análisis debe revisar quién organiza, qué promete, cómo cobra y qué controla realmente. Expandirse a Salta o Córdoba no evita normas nacionales.

**[Assumption] Antes de habilitar aportes de terceros y CPA**, obtener revisión del diagrama concreto: aportante → beneficiario; compra opcional beneficiario → comercio; factura de marketing comercio → plataforma. Incluir publicidad e invitaciones en esa revisión. Esta investigación no autoriza a lanzar ni modifica el bloqueo del repo para fondos externos mientras haya pendientes legales y de seguridad.

### 5.4 Convertir pesos a wARS: disponibilidad real y límites de lo verificado

**[Data] Ripio y Celo anunciaron el 31-07-2026 seis wFIAT en Celo:** wARS, wBRL, wMXN, wCOP, wPEN y wCLP. El comunicado de Celo anuncia entrada/salida sin costo. Es una condición declarada, no una cotización ejecutada por esta investigación. [F15, F16]

| Ruta | Qué está documentado | Qué falta probar |
|---|---|---|
| **Rampa alojada de Ripio → billetera propia** | **[Data]** Existe formulario con país, monto, red, moneda y destino. El material del hackathon diferencia el enlace alojado de la API y advierte que tokens/redes dependen del país. [F17] | AR + wARS + Celo, elegibilidad, identidad, mínimos, plazo, importe recibido, salida a pesos y recuperación ante un fallo. No alcanza con armar una URL. |
| **API de rampas Ripio** | **[Data]** Documentación Argentina con entrada/salida en ARS; API con verificación de clientes. La modalidad B2B requiere incorporación empresarial y KYB según documentación del programa. [F17, F18] | Alta empresarial, condiciones comerciales, soporte y acceso productivo. No asumir API abierta para el equipo por estar en el hackathon. |
| **App Ripio → retiro bancario** | **[Data]** Ayuda actualizada el 21-01-2026 documenta retiro de pesos a CBU/CVU/alias, inmediato y con comisión publicada del 0%. [F29] | Esa ayuda describe salida de saldo **ARS**; no prueba depósito/retiro de **wARS por Celo**, ni el costo total de llegar a ARS desde el token. |
| **Otras apps: Lemon, Buenbit u otras** | **DATA GAP:** no se encontró evidencia suficiente de un circuito nativo ARS ↔ wARS sobre Celo en las búsquedas realizadas. | No publicarlas como respaldo operativo confirmado. Pedir matriz token/red/país y ejecutar el recorrido autorizado antes de ofrecerlas. |
| **Comprar otra moneda y convertir/puentear** | **[Estimate]** Puede sumar operaciones y proveedores. | Liquidez, cotización final, red correcta, costos y soporte. No es la experiencia inicial recomendada para alguien que necesita pagar una reparación. |

**[Assumption] Recorrido a validar:** cuenta propia en pesos → proveedor de rampa con identificación → wARS en billetera propia → firma del aporte directo al beneficiario → compra al comercio o conversión a pesos. Si el comercio necesita pesos bancarios, medir su salida también. La Vaquita no recibe efectivo ni presta cuentas para completar el proceso.

**[Estimate] La principal barrera digital puede ser el esfuerzo adicional, no la conectividad.** Una transferencia habitual y una firma nueva no tienen el mismo costo de aprendizaje. La rampa puede tener custodia transitoria del proveedor aunque la junta no custodie; hay que explicar esa diferencia.

## 6. Beachhead: por qué primero, qué prueba ganar y cuándo expandirse

### 6.1 Segmento y propuesta

**[Assumption] Primer segmento:** adultos independientes o jóvenes con ingreso identificable, necesidad de herramienta/reparación no urgente y cuatro conocidos dispuestos a sostener el ciclo. “Nico” es el comprador principal; “Cami” participa si tiene ingreso o apoyo y acepta las obligaciones; “Don Rubén” valida capacidad de servicio, margen y atención. Tener interés en tecnología no reemplaza capacidad de pago.

**[Estimate] Mano de obra, mantenimiento y accesorios tienen mejor encaje inicial que una notebook nueva cara**, porque permiten ajustar ticket y validar atención con el comercio accesible. El margen disponible para descuento más CPA no está verificado. No prometer descuentos financiados por el equipo ni usar a la distribuidora de limpieza para cambiar de segmento antes de aprender del primer grupo.

### 6.2 Experimento y criterios de avance

Todos los valores de esta tabla son **[Assumption]**, propuestos el 25-10-2026. Son señales de decisión para una muestra chica, no estándares de la industria ni estimaciones de mora poblacional.

| Prueba | Diseño mínimo | Señal para avanzar | Si falla |
|---|---|---|---|
| Compra y oferta | Conversaciones con **diez potenciales miembros y el comercio**, precio de contado y descuento por escrito. | Cinco adultos con necesidad concreta y aporte viable; comercio conserva margen después de descuento, CPA e impuestos. | Ajustar ticket/oferta antes de desarrollar catálogo o abrir otra ciudad. |
| Formación | **Un organizador completa un grupo de cinco en catorce días**, por invitación, sin subsidio de aportes. | Todos explican con sus palabras los compromisos y el riesgo de impago. | Revisar propuesta o canal; una lista de interesados sin grupo completo no valida ROSCA. |
| Entrada y salida | Cinco recorridos individuales supervisados, luego **al menos cuatro sin ayuda directa**, después de resolver las condiciones legales y técnicas. | Ninguna persona necesita entregar su clave; se mide tiempo y costo total; salida del beneficiario/comercio comprobada. | Corregir fricción. No abrir nuevos grupos si la operatoria queda atrapada en el proveedor. |
| Cumplimiento | Completar cinco turnos: veinte obligaciones por grupo, con fecha de vencimiento definida. | **Al menos diecinueve de veinte a término y veinte de veinte saldadas al cierre acordado**, sin fondeo de rescate del equipo. | Registrar causa y exposición real; revisar capacidad de pago. No compensar con nuevos miembros. |
| Valor comercial | Registrar cada compra opcional y comparar con precio de contado vigente para igual servicio. | **Al menos tres de cinco beneficiarios compran voluntariamente**; ahorro neto positivo y CPA efectivamente cobrado por compras atribuidas. | Separar si falló descuento, necesidad o mecanismo de junta. No confundir “pagó su turno” con “generó ingreso”. |
| Independencia del vínculo familiar | Replicar con **otros dos organizadores y diez personas distintas**; al menos un comercio sin vínculo familiar antes de expansión paga. | Los nuevos grupos se forman por recomendación y el comercio paga sin trato especial. | El éxito familiar queda como aprendizaje operativo, no como adquisición repetible. |
| Economía y repetición | Medir horas de soporte, costos de conversión, costo de servir al comercio y facturación cobrada. | Margen de contribución positivo antes de gastos fijos; al menos **dos de tres organizadores** quieren repetir sin incentivo. | No escalar por cantidad de wallets; corregir costo de soporte u oferta. |

**[Estimate] Un ciclo de cinco turnos mensuales dura cinco meses; uno quincenal, aproximadamente diez semanas.** Por eso un piloto comercial completo iniciado después del 24-10-2026 no se valida antes del cierre del hackathon del 09-11. Una demostración rápida no prueba cumplimiento sostenido ni retención. Elegir frecuencia según los ingresos del grupo, sin comprimirla para simular validación.

### 6.3 Camino argentino 1 → 2 → 3

| Mercado | Qué se mantiene | Qué debe demostrar |
|---|---|---|
| **1. San Salvador de Jujuy: PC** | Cinco miembros, organizador conocido, compra opcional, comercio accesible, moneda local. | Que el grupo termina, el descuento se usa y el comerciante puede pagar una comisión real. |
| **2. Salta: réplica del mismo caso** | Mismo flujo y tipo de necesidad; otro referente y otro comercio. Tucumán reemplaza a Salta si ofrece mejor acceso confirmado. | Que funciona sin el parentesco ni presencia diaria de los fundadores. Registrar adquisición y soporte por cohorte. |
| **3. Argentina: cursos/servicios digitales** | Grupos armados por organizadores; comercios que pueden entregar a distancia. Córdoba es primera prospección remota; CABA/AMBA por referidos. | Que el beneficio comercial y la atención sobreviven fuera de la ciudad inicial, sin asumir acuerdos universitarios ni publicidad masiva de ahorro. |

**[Assumption] Mutuales y sindicatos entran después de la réplica independiente**, con una entidad activa y un referente responsable. Pueden bajar costo de formar grupos, pero incorporan negociación institucional y revisión legal. La primera prueba es un grupo cerrado, no un convenio nacional ni la integración de toda una base de socios.

**[Assumption] Comunidad boliviana en Jujuy:** trabajar con un referente propio y entrevistas específicas. No inferir disposición a adoptar La Vaquita por nacionalidad. Probar ese canal dentro de Argentina no valida operar en Bolivia ni convierte el producto en remesas.

## 7. Comparación LatAm

No se encontraron tasas recientes de participación en ROSCA con denominador y metodología comparables para los cinco países. La tabla evalúa evidencia de práctica, marco aplicable e infraestructura; **no es un ranking cuantitativo de mercado**. El token de cada país está respaldado por el anuncio del 31-07-2026, no por una prueba de nuestra aplicación. [F15]

| País | Cultura y mercado ROSCA | Regulación de junta digital y stablecoins | wFIAT en Celo y acceso bancario | Competencia local o regional | Recomendación |
|---|---|---|---|---|---|
| **Perú** | **[Data]** SBS reconoce juntas, redondillas y panderos como ahorro informal; frecuencia nacional reciente: DATA GAP. No confundir pandero informal con empresa autorizada de fondos colectivos. [F30] | **[Data]** SMV regula fondos colectivos para bienes y servicios, incluida educación. SBS tiene régimen de prevención de lavado para PSAV; el texto de la Res. 02648-2024 ⚠️ indica Regla de Viaje vigente desde **01-08-2026**. **[Estimate]** No hay exención demostrada para junta comercial sin custodia. [F31, F32] | **[Data] wPEN**, desde 31-07-2026. **DATA GAP:** recorrido bancario PEN ↔ wPEN en Celo para residente y comercio. El índice público consultado de rampas no permitió confirmar una página de país equivalente a Colombia. | **[Data]** Sommos declara juntas digitales con Caja Los Andes y LARA de los Andes; no se corroboró escala ni usuarios. [F33] | **[Estimate] Tercer país del camino propuesto**, detrás de Colombia por incertidumbre de rampa. Puede adelantarse si consigue referente, comercio y circuito completo antes. |
| **Colombia** | **[Data]** Supersociedades distingue **cadena rotativa sin intereses** de **natillera**, que puede acumular durante el año y prestar. No son sinónimos perfectos. [F34] | **[Data]** Captación masiva y habitual sin autorización es delito. SFC señala, con actualización del 11-06-2026, que criptoactivos no son dinero legal y esas operaciones no están bajo su supervisión. **[Estimate]** Grupo pequeño o pago directo no establece automáticamente exclusión regulatoria. [F35, F36] | **[Data] wCOP**. Ripio documenta entrada por PSE, BRE-B y solicitudes a Bancolombia/Nequi; salida por transferencia bancaria o BRE-B. Las solicitudes de pago son solo de entrada. Falta validar **token + Celo + usuario** en ese circuito. [F18] | **[Data]** MiCadena declara gratuidad, pagos directos por Nequi/Daviplata/bancos, recordatorios y puntaje. Tracción no corroborada. [F37] | **[Estimate] Primera candidata internacional**, después de la réplica argentina. La comparación debe ganarse contra pagos locales conocidos, no contra ausencia de herramientas. |
| **México** | **[Data]** CONDUSEF reconoce tandas entre familiares, vecinos y compañeros; advierte falta de protección financiera de ese mecanismo, mayo de 2024 ⚠️. [F38] | **[Data]** Circular Banxico 4/2019 ⚠️ se dirige a instituciones de crédito e instituciones de tecnología financiera. La presentación oficial de 2022 ⚠️ distingue empresas no financieras. **No demuestra prohibición general para particulares.** Encuadre de nuestro flujo, captación y obligaciones: pendiente. [F39] | **[Data] wMXN** también desplegada el 31-07-2026. No se lo puede descartar por ausencia de token. Acceso efectivo y condiciones del usuario: DATA GAP. | **[Data]** TandaPlus ofrece coordinación sin manejar dinero; su cobertura declarada no prueba penetración mexicana. [F40] | **[Estimate] Postergar por falta de distribución y costo de validación local**, no por una prohibición general inexistente en las fuentes revisadas. |
| **Bolivia** | **[Data]** FINRURAL define pasanaku como ahorro/crédito rotatorio informal y distingue modalidades solidarias y comerciales. Incidencia reciente: DATA GAP. [F41] | **[Data]** RD BCB 082/2024 ⚠️ habilitó canales electrónicos para compraventa de activos virtuales. El DS **5384, 07-05-2025**, incorpora régimen de empresas de tecnología financiera. **[Estimate]** Apertura cripto no equivale a libre operación de cualquier plataforma. [F42] | **[Data] La suite anunciada no incluye wBOB**; no encontramos un anuncio verificable de ese token. **[Estimate]** Usar dólares o moneda extranjera cambia riesgo y propuesta. | **[Data] BancoSol ofrece Pasanaku digital** en appSol/altoke, invitación por WhatsApp, turnos y recordatorios; máximo publicado **Bs 2.000 por persona** y sin garantía bancaria de cumplimiento. [F43] | **[Estimate] Postergar entrada nacional.** Afinidad cultural fuerte como hipótesis, pero falta moneda local de la suite y existe un competidor bancario directo. |
| **Chile** | **[Data]** Herramientas regionales mencionan “polla”; no se encontró medición oficial ni evidencia primaria suficiente de penetración actual. [F44] | **[Data]** Ley 21.521 y NCG 502 definen perímetro de servicios financieros y autorizaciones. BCCh anuncia en su informe de agosto de 2026 trabajo regulatorio sobre stablecoins a consulta; no tratar una consulta como regla ya aprobada. [F45, F46] | **[Data] wCLP** desde 31-07-2026. Acceso minorista bancario y circuito comercial: DATA GAP. | **[Data]** MiRonda/TandaPlus publicitan cobertura regional; uso chileno corroborado: DATA GAP. [F40, F44] | **[Estimate] Postergar** hasta confirmar demanda de junta y evolución del marco de stablecoins. |

### 7.1 Qué cambia respecto de los supuestos previos

- **[Data] México:** la restricción institucional de Banxico no es una prohibición general para personas. La decisión de postergarlo es comercial y operativa, con revisión legal pendiente. [F39]
- **[Data] Infraestructura:** Perú y Colombia no tienen exclusividad; México y Chile cuentan con wFIAT en Celo desde el mismo anuncio. [F15]
- **[Data] Bolivia:** BancoSol ya publica una solución de pasanaku con coordinación y pagos bancarios; no mirar solamente a proveedores de marca blanca. [F43]
- **[Data] Colombia:** la terminología de algunas apps equipara natillera con cadena; el documento de Supersociedades las distingue. Para el producto, especificar rotación por turnos y excluir préstamo con interés o reparto de rendimientos. [F34, F37]
- **[Data] Perú:** la Regla de Viaje mencionada en el texto SBS está vigente desde agosto de 2026; no es un requisito futuro. [F32]
- **[Estimate] Sin custodia no equivale a sin regulación:** siguen importando captación, organización comercial, actividad efectiva, consumo, prevención de lavado y datos. Las fuentes no permiten exportar el encuadre argentino a otro país.

### 7.2 Camino internacional 1 → 2 → 3 y condición de cambio

**[Estimate] Argentina → Colombia → Perú** es el orden de investigación comercial recomendado hoy, no un calendario de lanzamientos. Favorece primero el país ya accesible al equipo y después una moneda con rieles bancarios públicamente documentados. No hay socio extranjero confirmado.

**[Assumption] Puerta de entrada por país:** un organizador verificable, un comercio con beneficio neto, cinco participantes locales adultos, encuadre escrito del flujo, identidad y conversión completas, tratamiento de reclamos y economía de soporte medidos. Elegir ciudad a partir del referente; no nombrar Lima o Bogotá como beachhead sin una red concreta.

**[Assumption] Perú pasa delante de Colombia** si verifica primero su rampa y obtiene mejor distribución o encuadre legal. Colombia se posterga si la ventaja del descuento no compensa una rampa adicional frente a Nequi/Daviplata y MiCadena. No abrir dos países a la vez con tres perfiles técnicos y sin vendedor.

**[Estimate] Brasil queda fuera de la siguiente expansión operativa** según la priorización recibida en A4. No se revalidó en esta investigación el alcance de la Resolución 561 ni su fecha de aplicación; no se usa como justificación jurídica nueva. Una futura decisión sobre Brasil requiere una ronda específica.

## 8. Riesgos de entrada y señales para frenar

Las prioridades son **[Estimate]**; no se asignan probabilidades sin datos.

| Riesgo | Prioridad y motivo | Señal para frenar o cambiar |
|---|---|---|
| Confundir éxito familiar con demanda | **Muy alta:** el acceso actual depende del vínculo con comercios. | No se forma un segundo grupo independiente o el comercio externo no paga CPA. |
| Descuento y comisión sin margen | **Muy alta:** el piloto es físico/servicio técnico y el presupuesto es mínimo. | El precio final supera el contado comparable o el beneficio depende de subsidio del equipo. |
| Incumplimiento después de cobrar | **Muy alta:** la firma propia no elimina deuda entre miembros. | Necesidad de rescatar cuotas, fondear beneficiarios o incorporar nuevos aportantes para cubrir faltantes. |
| Rampa y salida no utilizables | **Muy alta:** token disponible no prueba servicio bancario. | El usuario necesita ayuda permanente, no puede retirar o el costo total consume el descuento. |
| Encuadre IGJ/PSAV/captación | **Muy alta:** CPA, invitación y ausencia de custodia no resuelven todo. | La revisión concreta exige autorización incompatible con presupuesto; cambiar diseño antes de abrir. |
| IIBB, mínimos y soporte | **Alta:** una comisión pequeña puede no cubrir costos fijos. | Margen de contribución negativo y falta de camino creíble para cubrir administración. |
| Desconfianza y promesas confusas | **Alta:** producto nuevo con obligaciones financieras entre conocidos. | Participantes creen que el equipo garantiza cobro, rendimiento o devolución de sus aportes. |
| Datos y exposición pública | **Alta:** seguimiento de deudas e identidad en grupos chicos. | La operación exige publicar información personal o incumplimientos identificables fuera del grupo. Diseñar acceso y consentimiento antes. |
| Expansión sin distribuidor | **Alta:** no hay vendedor ni socios internacionales confirmados. | El siguiente mercado exige anuncios pagos o presencia diaria del fundador antes de probar referidos. |
| Copia por alternativas locales | **Alta:** cuentas compartidas y apps de ROSCA ya resuelven parte del trabajo. | El único motivo para elegirnos es “usar blockchain”, sin ahorro comercial ni menor trabajo comprobados. |

## 9. Vacíos de información y cómo cubrirlos

| DATA GAP | Proxy disponible | Confianza | Cómo cubrirlo antes de decidir |
|---|---|---|---|
| Demanda y densidad del beachhead por ciudad | Población y acceso a comercios. | **Baja** | Misma guía de entrevistas y embudo por organizador; no comparar registros sueltos con grupos completos. |
| Serie censal homogénea de municipios y AMBA | Censos departamentales, municipios y distintas versiones oficiales. | **Baja** para un ranking fino | Descargar cuadros definitivos de igual universo, documentar revisión y delimitar AMBA antes de calcular densidad. |
| Edad 20–29 por municipio y clientes reales de PC | C3 provincial y extrapolación de ≈52.800. | **Baja** | Tabla primaria por edad/localidad y relevamiento agregado del comercio. |
| Participación local en juntas/pasanaku | Notas de prensa y reconocimiento cultural. | **Baja** | Entrevistar organizadores con ciclos terminados y distinguir práctica vigente de conocimiento del término. |
| Medios de pago de independientes del NOA | ENACOM, MAUTIC y BCRA nacional. | **Baja** | Medir instrumento de cobro, saldo disponible, necesidad de efectivo y recorrido real de los participantes. |
| CAC y horas de soporte por plaza | Cercanía y dos vínculos comerciales. | **Baja** | Registrar horas, viajes, conversaciones, grupos formados y comisiones cobradas; presupuestar fuera de Jujuy con cotizaciones. |
| Margen para descuento + CPA en PC | Rangos de pricing de olas anteriores. | **Baja** | Presupuesto escrito por servicio/accesorio y piloto sin subsidio, con devolución y atribución acordadas. |
| Actividad fiscal, base y régimen aplicable | Ley 6492 y normas digitales. | **Baja** sobre el caso propio | Contador con diagrama de fondos, domicilio, contratos, facturación esperada y provincias atendidas. |
| Encuadre comercial de la junta | Investigación A3 y normas locales. | **Baja** sobre aprobación del producto | Dictamen sobre flujo, publicidad, control del software y comisión; no preguntar solamente si “cripto es legal”. |
| ARS ↔ wARS Celo para usuario y comercio | Formulario Ripio, anuncio y documentación ARS. | **Baja** sobre ejecución | Prueba autorizada de punta a punta con identidad, límites, importe final, tiempo y salida; sin recibir fondos ajenos. |
| Alternativa independiente a Ripio en wARS | Sin ruta equivalente confirmada. | **Baja** | Confirmación documental de token/red/país y ensayo completo; no asumir soporte por listar CELO o USDC. |
| wPEN/wCOP/wMXN/wCLP con rampa efectiva | Despliegues; documentación COP más detallada. | **Baja** sobre disponibilidad para cada usuario | Residente elegible y proveedor confirman operación bancaria local con ese token y red. |
| Socio de distribución extranjero | Ninguno confirmado. | **Baja** | Conseguir referente y comercio antes de seleccionar ciudad o pagar adquisición. |
| Tracción de MiCadena, Sommos, TandaPlus y MiRonda | Webs comerciales. | **Baja** | Verificar app utilizable, socios y uso reciente; una landing no prueba actividad ni cierre. |
| Uso actual de “polla”/ROSCA en Chile | Mención en herramientas regionales. | **Baja** | Entrevistas a organizadores y fuentes locales; evitar extrapolación cultural. |
| Estado actual de mutuales/cooperativas candidatas | INAES y boletines; algunas noticias antiguas. | **Baja** para capacidad de distribuir | Consultar padrón activo y validar referente, servicios vigentes y consentimiento institucional. |
| Incidencia de la denuncia financiera de octubre | C3 y nota semejante con otra fecha. | **Baja** | Recuperar nota original y preguntar conocimiento/objeciones; no atribuir impacto causal sin medir. |

## 10. Fuentes y trazabilidad

Las referencias se citan con identificador en el texto. **s/f** significa que no se encontró fecha editorial visible. Se conserva la fecha del período medido aunque la publicación sea posterior. Las fuentes heredadas o con apertura fallida se identifican expresamente; no se presentan como verificación nueva.

| ID | Fuente, clasificación y fecha | URL y alcance |
|---|---|---|
| **F1** | **Tier 1 · DIPEC Jujuy**, Anuario Estadístico 2024; publicación indexada en 2026; cuadros censales 2022 ⚠️. | [Anuario oficial](https://dipec.jujuy.gob.ar/download/307/anuario/16928/anuario-estadistico-2024-jujuy.pdf). Se recuperó por búsqueda la tabla con 811.611; apertura completa con demora/error. |
| **F2** | **Tier 1 · Ministerio de Salud**, perfil sanitario Jujuy, ruta junio de 2025; población de 2022 ⚠️. | [Perfil sanitario provincial](https://www.argentina.gob.ar/sites/default/files/2025/06/perfil_sanitario-jujuy.pdf). Corrobora población provincial, no demanda de juntas. |
| **F3** | **Tier 3 · CityPopulation**, reproducción de Censo 2022 ⚠️, vía C3. | [Jujuy y departamentos](https://www.citypopulation.de/en/argentina/admin/38__jujuy/). Acceso restringido en esta ola; 320.990 y 133.421 se conservan como base heredada. |
| **F4** | **Tier 1 · Senado de Salta**, s/f; **Tier 1 · informe gubernamental alojado en CFI**, 2024; ambos usan censo 2022 ⚠️. | [Capital, Senado](https://senadosalta.gob.ar/senadores/departamentos/capital/) y [desarrollo inmobiliario Salta 2024](https://biblioteca.cfi.org.ar/wp-content/uploads/sites/2/2024/12/informe-final-desarrollo-inmobiliario-salta-2024.pdf). Universos a reconciliar: total y viviendas particulares. |
| **F5** | **Tier 1 · Argentina.gob.ar y Dirección de Estadística de Tucumán**, datos censales 2022 ⚠️. | [Municipio de San Miguel de Tucumán](https://www.argentina.gob.ar/tucuman/ciudad), [mapa provincial por departamento](https://estadistica.tucuman.gov.ar/archivos/9Mapas/Censo%202022/1_POBLACION%20TOTAL.pdf). Discrepancia preservada. |
| **F6** | **Tier 1 · Municipalidad de Córdoba**, publicación de 2023 ⚠️; censo 2022 ⚠️. | [Referencia municipal a 1.505.250 habitantes](https://cordoba.gob.ar/el-25-de-los-vecinos-fueron-beneficiados-con-la-pavimentacion-y-rehabilitacion-de-calles/). |
| **F7** | **Tier 1 · Estadística de CABA**, tablero dinámico; población 2022 ⚠️. | [Indicadores demográficos](https://www.estadisticaciudad.gob.ar/sipr/demo/principal). 3.121.707, solamente CABA. |
| **F8** | **Tier 1 · ENACOM**, datos abiertos hasta 2T-2026; **Tier 1 · INDEC**, MAUTIC publicado mayo de 2025, período 4T-2024 ⚠️. | [Accesos fijos por provincia](https://indicadores.enacom.gob.ar/DatosAbiertos/Internet/penetracion-provincias), [MAUTIC](https://www.indec.gob.ar/uploads/informesdeprensa/mautic_05_25FD0D0C4A71.pdf). Métricas y geografías diferentes. |
| **F9** | **Tier 2 · Que Pasa Salta**, 22-01-2026. | [Descripción del pasanaku en Argentina](https://www.quepasasalta.com.ar/argentina/que-es-el-pasanaku-el-metodo-boliviano-para-comprar-viviendas-en-argentina/). No es encuesta de Salta ni recomendación de entrar a vivienda. |
| **F10** | **Tier 1 · Tesorería nacional**, página publicada originalmente en 2024 ⚠️, consultada actualizada; **Tier 2 · Macro**, memoria 2024 ⚠️ e historia institucional. | [Agentes financieros provinciales](https://www.argentina.gob.ar/economia/tesoreria-general-de-la-nacion/agentes-financieros-provinciales-adheridos-al-sistema-cut), [memoria](https://www.macro.com.ar/relaciones-inversores/documento/1580939263322/bm-memoriaprincipal-2024.pdf), [historia](https://www.macro.com.ar/relaciones-inversores/conocenos). |
| **F11** | **Tier 2 · Naranja X**, páginas del prestador, s/f. | [Sucursales](https://www.naranjax.com/sucursales), [cuenta compartida](https://www.naranjax.com/cuenta/compartida). Oferta declarada; no participación local de mercado. |
| **F12** | **Tier 2 · Tarjeta Sucrédito**, s/f. | [Conocenos](https://www.tarjetasucredito.com.ar/conocenos). Presencia comercial y casa central. |
| **F13** | **Tier 1 · BCRA**, Información de Entidades Financieras, enero de 2026. | [Listado oficial, entidad 00435](https://www.bcra.gob.ar/archivos/Pdfs/PublicacionesEstadisticas/Entidades/202601e.pdf). Distingue sucursales bancarias y agencias. |
| **F14** | **Tier 2 · Naranja X**, 29-12-2025. | [Aniversario e historia en Córdoba](https://www.naranjax.com/blog/naranja-x-cumple-40-anos-pero-el-regalo-te-lo-llevas-vos). Hecho histórico 1985 ⚠️. |
| **F15** | **Tier 2 · Ripio**, comunicado 31-07-2026. | [Seis wFIAT en Celo](https://action.ripio.com/es/blog/las-stablecoins-wfiat-ya-estan-disponibles-en-celo). Despliegue documentado; no prueba de acceso bancario por usuario. |
| **F16** | **Tier 2 · Celo Core Co.**, comunicado 31-07-2026. | [Lanzamiento y anuncio de rampas sin costo](https://blog.celo.org/ripio-deploys-wfiat-stack-on-celo-with-no-cost-on-off-ramps-expanding-the-leading-stablecoin-9f801b82b899). Condiciones efectivas a verificar. |
| **F17** | **Tier 2 · Ripio y organización del hackathon**, documentación vigente consultada, octubre de 2026. | [Formulario alojado](https://ramp.ripio.com/), [Agents on Open Rails](https://www.loops.house/agents-on-open-rails), [introducción API](https://docs.ripio.com/ramps-api/overview/introduction). |
| **F18** | **Tier 2 · Ripio**, documentación primaria de producto, s/f. | [Argentina](https://docs.ripio.com/ramps-api/overview/countries/argentina), [Colombia](https://docs.ripio.com/ramps-api/overview/countries/colombia), [índice](https://docs.ripio.com/llms.txt). La página COP distingue métodos de entrada y salida. |
| **F19** | **Tier 1 · BCRA**, 30-04-2026; período segundo semestre de 2025. | [Informe de inclusión financiera](https://www.bcra.gob.ar/publicaciones/informe-de-inclusion-financiera-segundo-semestre-de-2025/), [bases desagregadas](https://www.bcra.gob.ar/indicadores-inclusion-financiera/). No equiparar cuenta abierta con uso de wARS. |
| **F20** | **Tier 1 · INAES**, padrón dinámico, s/f. | [Buscador de entidades](https://www2.inaes.gob.ar/Webinaes/BusquedaEntidades/Index). Permite filtrar provincia y estado; no se afirma cantidad de entidades activas. |
| **F21** | **Tier 1 · Boletín Oficial Jujuy**, 04-07-2025. | [Convocatoria AMUCDEMS](https://boletinoficial.jujuy.gob.ar/?p=313237). Evidencia de actividad institucional, no de alianza. |
| **F22** | **Tier 1 · Provincia de Jujuy**, noticia 05-05-2017 ⚠️ y página PAICOOP s/f. | [Red de microcréditos](https://prensa.jujuy.gob.ar/desarrollo-economico-y-produccion/red-micro-creditos-el-desarrollo-emprendedor-n25629), [PAICOOP](https://www.produccion.jujuy.gob.ar/?page_id=7582). No se toman tasas o montos como vigentes. |
| **F23** | **Tier 1 · Boletín Oficial / Rentas Jujuy**, Ley 6492, 17-12-2025, vigente 01-01-2026. | [Texto de la ley y anexos](https://boletinoficial.jujuy.gob.ar/?p=324226), [índice Rentas](https://rentasjujuy.gob.ar/ley-impositiva/). Anexo III, arts. 11 y 12. |
| **F24** | **Tier 1 · Comisión Arbitral**, RG 5/2021, 10-03-2021 ⚠️. | [Comercialización por medios electrónicos](https://www.ca.gob.ar/comarb-generales/download/236-2021/4047-rg-05-comercializacion-de-medios-electronicos-buena). Base del riesgo de actividad interjurisdiccional. |
| **F25** | **Tier 1 · Municipalidad / Concejo de San Salvador**, calendario 05-01-2026 y noticia 01-07-2026. | [Calendario impositivo](https://www.rentasmunijujuy.gob.ar/archivos/2026/calendario%20impositivo%202026.pdf), [tratamiento de proyecto de alivio](https://cdjujuy.gob.ar/noticias/concejales-y-funcionarias-municipales-analizaron-el-proyecto-de-alivio-fiscal-para-el-comercio-la-industria-y-los-servicios/). |
| **F26** | **Tier 1 · Jujuy y Defensa del Consumidor nacional**, Ley 5992 de 23-12-2016 ⚠️; páginas de trámites s/f. | [Ley provincial y referencia a modificación](https://boletinoficial.jujuy.gob.ar/?p=8961), [autoridad provincial](https://www.produccion.jujuy.gob.ar/?page_id=470), [reclamo federal](https://www.argentina.gob.ar/servicio/iniciar-un-reclamo-ante-defensa-del-consumidor). |
| **F27** | **Tier 2 · Jujuy al Día**, referencia heredada 24-10-2026, apertura fallida; **Tier 3 · Ledesma Participa**, portada con fecha 17-10-2026. | [Nota original referida en C3](https://www.jujuyaldia.com.ar/2026/10/24/jujuy-denuncio-una-presunta-estafa-de-75-millones-tras-invertir-en-una-financiera-y-habria-mas-damnificados/), [portada alternativa](https://ledesmaparticipa.com.ar/). Cronología no reconciliada. |
| **F28** | **Tier 1 · Boletín Oficial nacional**, RG CNV 1172/2026, 15-10-2026; contenido utilizado desde A3, reapertura con error. | [Aviso normativo](https://www.boletinoficial.gob.ar/detalleAviso/primera/348986/20261015). Ver [investigación regulatoria](regulatory.md) para el alcance heredado y la IGJ. |
| **F29** | **Tier 2 · Ayuda Ripio Argentina**, 21-01-2026. | [Métodos de retiro de pesos](https://help-ar.ripio.com/space/HC/1524304999/%C2%BFQu%C3%A9%2Bm%C3%A9todos%2Btengo%2Bpara%2Bretirar%2Bpesos%3F). Habla de ARS, no confirma el recorrido wARS/Celo. |
| **F30** | **Tier 1 · SBS Perú**, orientación al usuario, s/f. | [Compará y elegí](https://www.sbs.gob.pe/usuarios/aprende-con-la-sbs/compara-y-elige). Reconocimiento de modalidades informales. |
| **F31** | **Tier 1 · SMV Perú**, guía 11-12-2025 y página institucional s/f. | [Guía de fondos colectivos](https://www.gob.pe/institucion/smv/informes-publicaciones/7491714-guia-de-fondos-colectivos), [sistema de fondos colectivos](https://www.smv.gob.pe/OrientacionyEducacion/FondosColectivos.aspx). |
| **F32** | **Tier 1 · SBS Perú**, Res. 02648-2024, 30-07-2024 ⚠️; texto con indicación de vigencia de capítulo desde 01-08-2026. | [Texto normativo](https://intranet2.sbs.gob.pe/dv_int_cn/2424/v1.0/Adjuntos/2648-2024.R.pdf). Prevención de lavado PSAV y Regla de Viaje. |
| **F33** | **Tier 3 · Sommos**, web comercial, s/f. | [Oferta y asociaciones declaradas](https://sommosapp.com/index.html). Sin métricas corroboradas. |
| **F34** | **Tier 1 · Supersociedades Colombia**, ABC de captación, 2018 ⚠️. | [Documento oficial](https://www.supersociedades.gov.co/documents/20122/1229100/ABC-captacion-2018.pdf/04397067-cf79-ed90-16c0-bb28214d8cf2?t=1654389828719). Distingue cadenas y natilleras; no habilita nuestro diseño. |
| **F35** | **Tier 1 · Ministerio de Justicia Colombia**, orientación, s/f. | [Captación ilegal](https://www.minjusticia.gov.co/programas-co/LegalApp/Paginas/Que-puedo-hacer-si-una-persona-capta-dinero-del-publico-de-forma-ilegal.aspx). |
| **F36** | **Tier 1 · Superintendencia Financiera Colombia**, actualización 11-06-2026. | [Activos digitales o criptoactivos](https://www.superfinanciera.gov.co/publicaciones/10115324/que-son-los-activos-digitales-o-criptoactivos/). No sustituye análisis de captación. |
| **F37** | **Tier 3 · MiCadena**, web comercial con pie 2026, s/f editorial. | [Oferta colombiana](https://micadena.co/). Pagos directos, recordatorios y gratuidad declarados; no se toman sus pantallas ni frases comerciales como usuarios reales. |
| **F38** | **Tier 1 · CONDUSEF México**, mayo de 2024 ⚠️. | [Y mi tanda](https://revista.condusef.gob.mx/usuario-inteligente/tu-bolsillo/2024/05/y-mi-tanda/). Práctica y advertencias institucionales. |
| **F39** | **Tier 1 · Banxico**, Circular 4/2019, 08-03-2019 ⚠️; presentación 30-09-2022 ⚠️. | [Circular](https://www.banxico.org.mx/marco-normativo/normativa-emitida-por-el-banco-de-mexico/circular-4-2019/%7B8D7769AF-03F6-701A-68AA-EF25A73AD035%7D.pdf), [presentación, página 6](https://www.banxico.org.mx/publicaciones-y-prensa/presentaciones/%7BA6AF3CBC-FBD6-E1FE-E205-1B8BCC8C8853%7D.pdf). Alcance institucional, no prohibición universal. |
| **F40** | **Tier 3 · TandaPlus**, web comercial, s/f. | [Oferta de coordinación](https://www.tandaplus.com/). Disponibilidad y tracción por país sin corroborar. |
| **F41** | **Tier 3 · FINRURAL Bolivia**, glosario sectorial, s/f. | [Glosario de microfinanzas](https://www.finrural.org.bo/glosario-de-microfinanzas/). Fuente sectorial primaria para el término; no encuesta de uso. |
| **F42** | **Tier 1 · BCB y ASFI Bolivia**, 26-06-2024 ⚠️ y DS 5384 del 07-05-2025. | [Apertura de canales para activos virtuales](https://www.bcb.gob.bo/?q=node%2F235235), [normativa de servicios financieros](https://www.asfi.gob.bo/pb/decretos-supremos-referidos-servicios-financieros). |
| **F43** | **Tier 2 · BancoSol**, documentación del prestador, s/f. | [Pasanaku digital](https://www.bancosol.com.bo/soluciones-digitales/servicios-digitales/pasanaku-digital). Funciones y límite publicados; no participación de mercado. |
| **F44** | **Tier 3 · MiRonda**, web comercial, s/f. | [Herramienta regional](https://mironda.app/). Proxy débil para terminología y cobertura; no dimensiona Chile. |
| **F45** | **Tier 1 · CMF Chile**, 12-01-2024 ⚠️. | [Normativa de prestación de servicios financieros bajo Ley Fintec](https://www.cmfchile.cl/portal/prensa/625/w4-article-77135.html). |
| **F46** | **Tier 1 · Banco Central de Chile**, Informe de Sistemas de Pago, agosto de 2026. | [Informe y agenda de stablecoins](https://www.bcentral.cl/es/areas/politica-financiera/informe-de-sistemas-de-pago). Agenda/consulta no equivale a norma final vigente. |

**[Estimate] Decisión que permite tomar esta ola:** invertir primero en comprobar una junta completa y una venta atribuida en Jujuy; después probar repetición sin parentesco. La próxima ciudad y el próximo país deben elegirse por evidencia de distribución, cumplimiento y conversión bancaria, sin convertir población, familiaridad cultural o disponibilidad de un token en demanda probada.
