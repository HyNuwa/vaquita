# Qué cambia con La Vaquita

v0.1 · 17/10/2026. Contexto argentino con datos de octubre de 2026 y cálculos propios.

---

## 1. El contexto: por qué una junta hoy

| Dato | Valor | Fuente |
|---|---|---|
| Inflación de septiembre de 2026 | **1,9 % mensual · 33,4 % interanual** | INDEC, vía Canal 26 y El Ancasti (13/10/2026) |
| Costo de un préstamo personal bancario (CFT TEA) | **de 58,9 % a 320,1 %** según el banco | iProUP (02/09/2026) |
| Mora de las familias con bancos | **12,3 %**, máxima desde 2001 | CEPA con datos del BCRA y la CENDEU (mayo de 2026) |
| Mora de las familias con billeteras y fintech | **29,6 %** | ídem |
| Personas en mora | **5,8 millones** de 20,9 millones de deudores | ídem |

**Lectura:**
- Pedir prestado es carísimo.
- Millones de personas ya están en mora, lo que en la práctica las deja afuera del crédito formal.
- Ahorrar en pesos sin rendimiento pierde un 1,9 % por mes.

La junta es la respuesta que la gente ya usa: un **crédito sin interés bancario entre conocidos**.
Pero tiene tres problemas: depende de un cobrador, se rompe cuando alguien no paga y el que cobra
último pierde contra la inflación.

---

## 2. La corrección: la "junta justa"

En el documento 14 (modelo de negocio) propuse premios del 1 % al 3 % para los primeros turnos. Con la inflación
actual **no alcanza**: el último turno ganaría el equivalente a un 3,8 % anual, contra un 33 % de
inflación. La promesa de que "el que espera no pierde" no se cumplía.

**Nueva regla:** el agente calcula el pozo de cada turno de forma que **todos terminan igual en
términos reales**, usando la inflación mensual como tasa. El que cobra antes recibe un poco menos,
el que cobra después recibe un poco más, y la suma es exactamente lo que puso el grupo.

Ejemplo: 10 personas, $20.000 por mes cada una, tasa de 1,9 % mensual.

| Turno | Cobra | Diferencia contra el pozo "plano" ($200.000) |
|---|---|---|
| 1 | $183.490 | –8,3 % |
| 2 | $186.976 | –6,5 % |
| 3 | $190.529 | –4,7 % |
| 5 | $197.837 | –1,1 % |
| 6 | $201.596 | +0,8 % |
| 8 | $209.330 | +4,7 % |
| 10 | $217.360 | +8,7 % |

Total pagado: $2.000.000, exactamente lo que aportó el grupo.

**Para quien cobra primero:** el costo implícito de adelantar el pozo es de **≈ 2 % mensual
(≈ 26 % anual)**. El préstamo personal más barato que publicaba un banco en septiembre tenía un
CFT de 58,9 % anual, y el más caro, de 320 %. Es **menos de la mitad del mejor crédito bancario**,
sin carpeta y sin Veraz.

**Para quien cobra último:** recibe un 8,7 % más, que es lo que la inflación se comió mientras
esperaba. La promesa ahora sí se cumple.

La tasa la fija el grupo al crear la vaquita (por defecto, la última inflación mensual del INDEC)
y queda congelada para todo el ciclo. Es una regla del código, no una decisión del LLM. Si la
inflación real termina siendo distinta, la diferencia la absorben todos por igual.

### Cómo gana La Vaquita con esta regla
Se cobra un **1 % del pozo solo a los turnos de la primera mitad**, los que reciben la ventaja de
liquidez. En el ejemplo son ≈ $9.500 por ciclo, el equivalente al 0,48 % del volumen.

Así se mantiene la regla de que "paga el que se beneficia", y aun así el turno 1 sigue muy por
debajo del costo de un crédito. Los turnos de la segunda mitad no pagan nada.

---

## 3. Antes y después, por actor

### El organizador ("la que junta")
| Hoy | Con La Vaquita |
|---|---|
| Persigue a cada uno por WhatsApp | El agente recuerda y cobra solo |
| Lleva la planilla y concilia transferencias a mano | Cada aporte queda registrado y conciliado al instante |
| Si alguien no paga, pone la cara o pone la plata | Lo resuelven las reglas: fondo de garantía, o pozo completo o devolución |
| Tiene la plata de todos en su cuenta | El pozo está en una cuenta del grupo con reglas públicas (escrow en v2) |

### El que necesita plata ya
| Hoy | Con La Vaquita |
|---|---|
| Préstamo personal: CFT de 58,9 % a 320 % anual | Turno 1: ≈ 26 % anual implícito |
| Si está en mora en el sistema, directamente no accede | Accede por su grupo, sin carpeta |
| La junta tradicional le da el turno por sorteo o por favor | Elige su turno y sabe exactamente cuánto le cuesta |

### El que cobra último
| Hoy | Con La Vaquita |
|---|---|
| Recibe $200.000 que valen un 15–18 % menos que cuando empezó | Recibe $217.360: la inflación compensada |
| Corre el riesgo de que el ciclo se corte antes de su turno | Fondo de garantía + historial: el que ya cobró y no paga pierde su depósito |

### Todos los miembros
| Hoy | Con La Vaquita |
|---|---|
| "¿Quién pagó? ¿Cuánto falta?" se pregunta en el grupo y nadie sabe | El agente responde con datos verificables |
| No queda historial | Cada aporte puntual queda registrado: un historial de cumplimiento propio |
| Necesitan estar en el mismo banco o billetera | Funciona con cualquier wallet en Celo; se carga y se retira con Ripio |
| Juntas entre países (colectividades) se complican | Mismo motor en wARS, wPEN, wBRL, wCOP… (fase 3) |

---

## 4. Qué cambia de verdad y qué no (honestidad para el pitch)

**Lo que cambia por el agente:**
- No hay cobrador humano.
- Las reglas se cumplen sin excepciones.
- La "junta justa" se recalcula sin errores.
- Recordatorios con tono humano, en el chat del grupo.

**Lo que cambia por usar wARS en Celo:**
- El registro de cada aporte es verificable por cualquiera.
- Los pagos pueden ser programables: escrow que el agente no puede vaciar.
- Opera 24/7, sin depender de un banco en particular.
- Se puede ir entre países con la misma lógica.

**Lo que NO cambia:**
- La confianza en el grupo sigue importando. Un grupo de desconocidos sigue siendo riesgoso.
- La inflación no desaparece: se reparte de forma justa, no se le gana.
- Para un grupo que ya funciona bien por transferencia, el valor está en el agente y en las reglas, no en la blockchain.

---

## 5. Implicancias para el producto
1. **Reemplazar el "premio fijo"** por la fórmula de la junta justa. Es determinística: va en `src/policy/`, con tests que comprueben que la suma de los pagos es igual a la suma de los aportes.
2. **La tasa del ciclo queda congelada** al crear la vaquita y es visible para todos.
3. **El mensaje al usuario** dice cuánto cobra cada turno en pesos, sin hablar de tasas: "Si cobrás en enero recibís $183.490; si cobrás en octubre, $217.360".
4. **El pitch** cambia de "premia al que espera" a: **"crédito entre conocidos a la mitad del costo del banco, sin que nadie pierda contra la inflación"**.

---

## Fuentes
- Inflación septiembre 2026 (INDEC): https://www.canal26.com/economia/2026/10/13/la-inflacion-de-septiembre-fue-de-19-y-acumula-un-alza-de-236-en-lo-que-va-del-2026/ · https://elancasti.com.ar/politica-y-economia/subio-la-inflacion-septiembre-y-acumulo-334-interanual-n623767
- Tasas de préstamos personales, septiembre 2026: https://www.iproup.com/finanzas/71138-prestamos-personales-cuanto-cuesta-pedir-banco-cobra-menos-tasa-total-septiembre-2026
- Mora de las familias (CEPA, BCRA y CENDEU): https://www.losandes.com.ar/economia/la-morosidad-familias-y-empresas-alcanzo-un-maximo-mayo-cuantos-millones-se-adeudan-n5999732 · https://www.iprofesional.com/finanzas/460797-morosidad-en-argentina-pego-un-salto-record-y-millones-dejaron-de-pagar-deudas
- Cálculos propios: el pozo de cada turno es c·(1+r)^(k−1), con c normalizado para que la suma sea igual a la de los aportes; el costo implícito surge de la TIR de los flujos de cada turno.
