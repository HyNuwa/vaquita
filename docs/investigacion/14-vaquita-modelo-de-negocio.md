# La Vaquita — Modelo de negocio

v0.1 · 17/10/2026. Todos los números de las secciones 4 y 5 son **supuestos para validar**
en el piloto, no datos de mercado. El cálculo está en el Anexo para poder cambiarlos.

---

## 1. Resumen en 5 líneas
1. **Qué.** Un agente que organiza juntas, tandas y vacas de grupo en pesos digitales (wARS), dentro del chat del grupo.
2. **Para quién.** Grupos que ya ahorran o juntan plata informalmente, y las organizaciones que los nuclean.
3. **Por qué pagan.** Nadie tiene que hacer de cobrador. Las reglas no se rompen. Y el que espera su turno no pierde contra la inflación.
4. **Cómo ganamos.** Una parte del **premio por adelantar el turno**, pagado solo por quien cobra antes, más **planes para organizaciones**.
5. **La restricción que define la estrategia.** Custodiar plata de terceros nos convierte en PSAV ante la CNV. Por eso el camino de escala es **no custodial** (contrato de escrow) o a través de un socio regulado.

---

## 2. Lean Canvas

| Bloque | Contenido |
|---|---|
| **Problema** | 1) Organizar una junta es trabajo no pago: cobrar, recordar, llevar la planilla, pelear. 2) Si alguien deja de pagar, el grupo pierde y no tiene a quién reclamar. 3) Con inflación, cobrar último es perder. |
| **Segmentos** | Ver sección 3. Early adopters: organizadores de juntas ya existentes y comunidades migrantes con tradición de junta o pasanaku. |
| **Propuesta de valor única** | "Tu junta de siempre, pero se cobra sola, no se rompe y premia al que espera." |
| **Solución** | Un agente en Telegram que cobra, concilia y paga. Reglas fijas: pozo completo o devolución, fondo de garantía y premio por turno. Estado público por vaquita. Historial de cumplimiento. |
| **Canales** | El organizador invita a su grupo; **cada grupo es un canal de adquisición**. Comunidades (colectividades, clubes, cooperativas). Ripio y el ecosistema Celo. |
| **Ingresos** | Parte del premio por turno · Plan Organización · Revenue share con socios (ramps). Más adelante: rendimiento del pozo en vacas de objetivo y referidos de crédito con consentimiento. |
| **Costos** | LLM por mensaje · gas de las transacciones del agente · infraestructura · soporte · cumplimiento regulatorio (cuando escale). |
| **Métricas clave** | Grupos activos · % de rondas pagadas a tiempo · tasa de mora · grupos que repiten ciclo · firmantes independientes · volumen. |
| **Ventaja injusta** | Ser el primer agente de juntas en **moneda local** con rieles de Ripio. Las reglas por código que generan confianza. El historial de cumplimiento acumulado de cada miembro. |

---

## 3. Segmentos de clientes

| Segmento | Quién paga | Dolor principal | Rol |
|---|---|---|---|
| **Organizador de junta** ("la que junta") | Nadie, porque es gratis para el organizador | Hacer de cobrador, poner la cara cuando alguien no paga | **Canal.** Trae a todo el grupo |
| **Miembros de junta** | Solo quien elige cobrar primero (el premio) | Mora, falta de transparencia, inflación | Usuario y firmante |
| **Grupos de vaca de objetivo** (regalo, viaje, causa) | Gratis | Juntar y perseguir aportes | Adquisición masiva, al estilo Vaki |
| **Organizaciones**: cooperativas, mutuales, clubes, sindicatos, empleadores, ONG de inclusión financiera | La organización | Administrar fondos comunes y cuotas de muchos miembros | **Ingreso principal**, al estilo Chamasoft |
| **Socios**: Ripio, wallets, fintechs | Revenue share o licencia | Necesitan casos de uso reales para wFIAT y volumen on-chain | Distribución y alianza |

Sobre el organizador: en las tandas tradicionales, quien organiza muchas veces tiene un
beneficio, como el primer turno o una pequeña retribución. Conservar esa costumbre importa:
el organizador no paga y puede recibir una parte del premio de su grupo.

---

## 4. Flujos de ingreso

### 4.1 Premio por adelantar el turno (consumo)
Una idea de MoneyFellows y Tanda, con un giro local. **Solo paga quien obtiene la ventaja**
(lección de Esusu: el costo lo paga el que se beneficia).

Ejemplo (supuesto): 10 personas, $20.000 por mes, pozo de $200.000.

| Turno | Paga premio | Cobra |
|---|---|---|
| 1 | 3 % | $194.000 |
| 2 | 2,5 % | $195.000 |
| 3 | 2 % | $196.000 |
| 4 | 1,5 % | $197.000 |
| 5 | 1 % | $198.000 |
| 6 a 10 | — | **$202.800** |

Cómo se reparten los premios del ciclo ($20.000 en total):
- **70 % para los turnos finales:** +$2.800 cada uno. Compensa la espera.
- **30 % para La Vaquita:** $6.000 por ciclo de 10 meses.

Eso equivale al **0,3 % del volumen del ciclo**. Una alternativa simple es que el organizador
se quede con una parte de ese 30 %.

**Ventajas:**
- Nadie paga por usar el producto; se paga por conseguir liquidez antes.
- El grupo puede apagar el premio. En ese caso se cobra una tarifa plana chica, o la vaquita es gratis si es de menos de 6 personas.

### 4.2 Plan Organización (B2B)
Para cooperativas, mutuales, clubes, empleadores y ONG que manejan muchos grupos o cuotas. Incluye:
- muchas vaquitas bajo una misma organización;
- un panel de mora y reportes;
- exportación contable;
- marca propia en los mensajes;
- soporte.

Precio supuesto: **$1.500 por miembro activo por mes**.

| Miembros activos | Ingreso mensual (supuesto) |
|---|---|
| 50 | $75.000 (≈ US$54) |
| 200 | $300.000 (≈ US$214) |
| 1.000 | $1.500.000 (≈ US$1.071) |

Hay una variante al estilo Chamasoft: que la **organización o un banco aliado pague por sus grupos**
para que sean gratis para los miembros de menores ingresos.

### 4.3 Socios
- **Ripio.** Cada vaquita genera carga de pesos (on-ramp) y retiro del pozo (off-ramp). Hay que negociar un revenue share o un acuerdo de distribución. Hoy los ramps son gratuitos para el usuario, así que no asumimos ingreso de acá hasta tener un acuerdo.
- **Wallets y fintechs.** Licencia de marca blanca del agente de juntas (como hace Magie con su vertical B2B).

### 4.4 Más adelante (no para el hackathon)
- **Rendimiento del pozo** mientras espera, sobre todo en vacas de objetivo que juntan durante semanas. Requiere un producto regulado (por ejemplo, el de rendimiento de Ripio B2B) y **compartirlo con el grupo**: es parte de la propuesta anti-inflación, no solo un ingreso.
- **Historial de cumplimiento como puerta al crédito.** Con consentimiento explícito, referir miembros con buen historial a prestamistas. Es el aprendizaje de Esusu: la identidad financiera vale más que el pozo.
- **Funciones premium por x402 en pesos:** reportes, vaquitas grandes, recordatorios por SMS.

---

## 5. Unit economics (supuestos)

### Por grupo de consumo (10 personas, ronda mensual)
| Concepto | Valor |
|---|---|
| Ingreso por ciclo | $6.000 ≈ **US$4,29** |
| Costo variable por ciclo | ≈ **US$1,24**: 40 mensajes de LLM por ronda × US$0,003, más 2 transacciones del agente × US$0,002 |
| Margen de contribución | ≈ US$3,05 por ciclo (71 %) → **US$0,30 por grupo por mes** |
| Break-even contra US$150/mes de infraestructura (sin sueldos) | **~490 grupos** |

**Lectura honesta.** El consumo solo tiene un margen porcentual sano pero un **ingreso absoluto
muy bajo**. Sirve como motor de adquisición y de datos, no como negocio por sí solo. El negocio
lo sostiene **B2B** (4.2) y, más adelante, **socios y rendimiento compartido**.

### Escenarios a 12 meses (supuestos, sin sueldos)
| Escenario | Grupos | Organizaciones (200 miembros) | Ingreso/mes | Costo/mes | Resultado | Volumen/mes |
|---|---|---|---|---|---|---|
| Piloto | 30 | 0 | US$13 | US$154 | –US$141 | ≈US$4.300 |
| Tracción | 300 | 3 | US$771 | US$195 | +US$577 | ≈US$42.900 |
| Escala inicial | 2.000 | 15 | US$4.071 | US$435 | +US$3.636 | ≈US$285.700 |

Cotización supuesta: 1 US$ = $1.400. Se usa solo para comparar con los costos en dólares;
el producto opera 100 % en pesos.

### Palancas que más mueven el resultado
1. **Cantidad de organizaciones.** Cada organización de 200 miembros equivale a unos 700 grupos de consumo en margen.
2. **Costo de LLM por ronda.** Mensajes plantillados para recordatorios y LLM solo para conversar.
3. **Tamaño del aporte.** El ingreso escala con el pozo.
4. **Grupos que repiten ciclo.** Bajan el costo de adquisición prácticamente a cero.

---

## 6. Regulación: la restricción que define la arquitectura

En Argentina, la **RG CNV 1058/2025** (vigente desde el 20/05/2025) exige registrarse como
**PSAV** a quien preste servicios de activos virtuales, incluidas la **custodia o administración**
y las **transferencias**:
- La categoría de custodia exige un **patrimonio neto mínimo de US$150.000**, que baja a la mitad si el volumen es menor a US$2,5 M.
- Hay que ser una **S.A. o S.R.L.**, con oficial de cumplimiento, auditorías de sistemas e informes mensuales.
- **Exención:** operaciones de hasta **35.000 UVA por mes** (≈ US$44.275 según la fuente).

**Qué implica:**
- **Hackathon y piloto.** Con montos bajos estamos muy por debajo del umbral. Con el ejemplo de $200.000 por pozo, el umbral se alcanza recién con **~310 grupos activos** que paguen en el mismo mes.
- **Antes de llegar a ese volumen** hay que elegir un camino:
  - **A. No custodial.** El pozo vive en un contrato de escrow por vaquita y el agente es solo operador: dispara pagos que el contrato permite y no puede llevarse la plata. Es el camino preferido, porque además es lo que genera confianza, como en Ronda o ChamaPay.
  - **B. Socio regulado.** Operar la custodia a través de un PSAV registrado (por ejemplo, Ripio B2B con KYB).
  - **C. Registrarse.** Es costoso. Solo tiene sentido con la tracción del escenario "Escala inicial".
- Se necesita **asesoramiento legal** antes de salir del piloto. La premisa es que no lo somos y este documento no reemplaza ese consejo.
- La captación de ahorro del público es otra regulación a revisar, porque la junta tiene componentes de ahorro y de crédito.

Fuentes: Estudio O'Farrell, resumen de la RG 1058/2025 (https://www.estudio-ofarrell.com/la-cnv-reglamenta-las-actividades-de-los-proveedores-de-servicios-de-activos-virtuales-psav/) · abogados.com.ar (https://abogados.com.ar/resolucion-general-cnv-n1058-regulacion-de-proveedores-de-servicios-de-activos-virtuales-psav/36529)

---

## 7. Go-to-market

| Fase | Cuándo | Objetivo | Cómo | Monetización |
|---|---|---|---|---|
| **0. Hackathon** | 17/10 → 9/11 | 3–5 grupos reales, varios ciclos cortos | Grupos propios y de conocidos (familia, trabajo, Builder Sessions). Ciclos diarios o cada 2 días para mostrar rondas completas | Ninguna (premio activado en modo demo) |
| **1. Piloto** | nov → feb | 30 grupos, 1 organización | Organizadores de juntas reales. Una colectividad (peruana, boliviana o paraguaya) y un club o cooperativa | Premio por turno activado; plan Organización gratis a cambio de feedback |
| **2. Tracción** | mar → ago | 300 grupos, 3 organizaciones | Referidos de organizadores. Acuerdo con Ripio. Contenido "cómo armar tu junta" | Ambos flujos |
| **3. Región** | 2027 | México (tandas), Perú (juntas), Colombia (natilleras) | Mismo motor, wMXN, wPEN, wCOP | + socios y marca blanca |

**Loop de crecimiento.** Organizador → invita a 9 personas → al terminar el ciclo, 1 o 2 de ellas
arman su propia vaquita. Hay que medir cuántos grupos nuevos genera cada grupo (meta: más de 1).

---

## 8. Métricas

| Métrica | Por qué | Meta del piloto (supuesta) |
|---|---|---|
| Rondas pagadas completas y a tiempo | Prueba que las reglas funcionan | ≥ 90 % |
| Tasa de mora (aportes cubiertos por el fondo de garantía) | Riesgo central del modelo | ≤ 5 % |
| Grupos que repiten ciclo | Retención real | ≥ 50 % |
| Grupos nuevos por grupo | Crecimiento orgánico | > 1 |
| Firmantes independientes por semana | Lo que mira el leaderboard del hackathon | Crecer cada semana |
| Costo de LLM por ronda | Margen | ≤ US$0,10 |

---

## 9. Riesgos del modelo

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El ingreso de consumo es muy bajo | Alto | B2B como motor; consumo como adquisición |
| Regulación de custodia (PSAV) | Alto al escalar | Diseño no custodial antes de llegar a ~300 grupos; socio regulado |
| Mora mayor a la esperada | Alto | Fondo de garantía, pozo completo o devolución, grupos con vínculo previo |
| Rechazo al premio ("¿por qué pago para cobrar primero?") | Medio | Opcional por grupo; explicarlo como "compensación al que espera" |
| Fricción de wallet y onboarding | Alto | Link de ramp.ripio.com cargado; wallet embebida; probar en el piloto |
| Dependencia de un canal (Telegram/WhatsApp) | Medio | Web pública por vaquita como respaldo |
| Competidores on-chain (Ronda, CeloSusu, ChamaPay) | Bajo hoy | Moneda local + agente cobrador + usuarios reales |

---

## 10. Cómo se cuenta en el pitch (30 segundos)
> En LatAm, millones de personas ahorran en juntas, tandas y vaquitas, pero dependen de que
> alguien cobre y de que nadie se borre. La Vaquita es un agente que vive en el chat del grupo,
> cobra en pesos digitales, paga el pozo a quien le toca y premia al que espera para que no
> pierda contra la inflación. Gratis para el organizador; cobramos solo al que elige cobrar
> primero, y a las organizaciones que manejan muchos grupos.

---

## Anexo — Cálculo
Supuestos editables:
- Cotización: 1 US$ = $1.400.
- Grupo: 10 miembros con aporte de $20.000.
- Premios por turno: 3 %, 2,5 %, 2 %, 1,5 % y 1 %.
- Parte para La Vaquita: 30 %.
- Costos: LLM US$0,003 por mensaje × 40 mensajes por ronda; gas US$0,002 por transacción × 2 por ronda; infraestructura fija US$150 por mes.
- Plan Organización: $1.500 por miembro por mes.

El script de cálculo se puede volver a correr con otros valores; pedíselo a Claude en el proyecto.
