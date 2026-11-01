# Comparación de versiones — v2 (comercio), v3 (organizador) y 3.0 (layaway)

**Fase:** síntesis entre exploraciones
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-25
**Confianza:** Media sobre el diagnóstico; Baja sobre la demanda en las tres (0 entrevistas, 0 proveedores, 0 cobros)

---

## 1. Las tres versiones
| | **v2 · Modelo A** | **v3 · B1** | **3.0 · Layaway sincronizado** |
|---|---|---|---|
| Dónde está | `06-validation/scorecard.md` | `fast-track/04-scorecard.md` | Exploración paralela, fuera del repo (carpeta local del fundador), con su propia corrida de la skill en Fast Track |
| Mecanismo | Junta por turnos; quien cobra puede comprar aparte una oferta con descuento | Software para el organizador: registro, doble confirmación y avisos; los pagos van por fuera | Cada miembro aporta en cuotas a una bóveda de meta común en Celo. Si se llega al cupo, el contrato le paga al proveedor; si no, cada uno recupera lo suyo. Retiro libre |
| Quién paga | El comercio: CPA del 2–15% sobre la compra opcional | El organizador: $ 14.900 por mes (3 o más juntas) | El proveedor: 8% sobre cada campaña completada |
| Junta (ROSCA) | El núcleo | El núcleo | Sale del MVP (queda como módulo futuro) |
| Cadena | Obligatoria | Opcional en el piloto | Obligatoria: la bóveda es el producto |
| Agente | Coordina, recuerda y deriva | Recuerda y concilia | Agrega la demanda entre clubes y recuerda las cuotas; no firma |
| Evidencia propia | 0 | 0 | 0 |

## 2. Qué problema resuelve cada una
| Problema | v2 | v3 | 3.0 |
|---|---|---|---|
| **Impago entre miembros** (el que cobra primero queda debiendo) | ❌ Sin cobertura | ❌ Lo registra, no lo cubre | ✅ **No existe:** nadie le presta a nadie |
| **El ingreso depende de una compra opcional** | ❌ Supone que compra el 30% | ✅ Paga el organizador | ✅ Cada participante es comprador |
| **Espacio libre frente a la competencia** | 🟡 Nadie combina junta y comercio | ❌ MiRonda, Tanda, TandaPlus y JuntemosPe ofrecen lo mismo | 🟡 Nadie del track hace compras entre grupos con escrow; GrupoCompra ya lo hace a mano |
| **IGJ** | 🔴 Junta más compra, cerca de "fines determinados" | 🟡 Menor si no hay comisión a los miembros | 🟡 Sin grupo cerrado ni adjudicación, pero la meta es un bien determinado y La Vaquita intermedia cobrando |
| **CNV (RG 1172/2026)** | 🟢 Cada miembro firma | 🟢 No toca la plata | 🔴 **Una bóveda que junta fondos de terceros no es autocustodia.** La exclusión para "protocolos sin dueño" no tiene criterios publicados, y acá el dueño es identificable (despliega y cobra) |
| **Riesgo técnico** | 🟡 Firma integrada (puerta del 27/10) | 🟢 Bajo | 🔴 Contrato inmutable, sin admin y con plata real: un bug no se puede corregir |
| **Lados que hay que conseguir** | 2: grupos y comercios | 1: organizadores | 2: compradores y proveedores, con el proveedor manteniendo el precio durante toda la ventana |
| **"¿Por qué no WhatsApp?"** | El descuento | El tiempo ahorrado (sin probar) | La confianza: la plata vuelve sola si no se llega (sin probar; GrupoCompra lo logra con un depósito manual) |

## 3. Economía por unidad (Etapa A, toda supuesta)
| | v2 | v3 | 3.0 |
|---|---|---|---|
| Unidad | Círculo completo | Organizador por mes | Campaña ($ 100.000 × 10) |
| Contribución | $ 1.037,50 | $ 7.005 (base) | $ 17.000 la primera; $ 57.000 si el proveedor repite |
| Recupero del CAC | ~53 ciclos | ~5,7 meses | No se calculó un CAC por comprador; la primera campaña pierde plata con −30% en cualquier variable |
| Equilibrio sin sueldos | 26 círculos y 39 compras por mes | 17–32 organizadores pagos | ~9 campañas recurrentes por mes |
| Condición crítica | Conversión a compra | Renovación ≥95% por mes | Proveedores que repiten y tickets más altos |

**[Opinion]** Las unidades no son iguales, así que la tabla no ordena las versiones por rentabilidad. Lo que sí muestra es dónde está la fragilidad de cada una.

## 4. Puntaje con la misma vara
La 3.0 se puntuó a sí misma con 5,0, con otra calibración: le da 7 al momento con la misma macro que acá vale 5, y 7 a la factibilidad citando un repo con pagos en wARS, mientras su brief dice que "se empieza de cero". Acá se vuelve a puntuar con los mismos criterios que v2 y v3.

| Dimensión | v2 | v3 | 3.0 (original) | **3.0 (esta vara)** | Por qué |
|---|---:|---:|---:|---:|---|
| Problema | 6 | 6 | 5 | **5** | Liquidez y confianza en quien junta la plata: plausible, sin entrevistas |
| Mercado | 4 | 3 | 3 | **3** | El NOA no está medido; con un 8% de comisión, Jujuy no paga un sueldo |
| Ventaja | 3 | 2 | 5 | **4** | Un espacio real en el track, pero GrupoCompra ya prueba el mecanismo y un contrato se copia |
| Factibilidad | 4 | 5 | 7 | **5** | Un solo contrato y sin impago, pero inmutable y con plata real en 15 días; la rampa a wARS sin probar; el riesgo de la CNV |
| Modelo | 2 | 3 | 4 | **4** | No depende de la conversión, pero la primera campaña casi no deja contribución y hay dos lados vacíos |
| Equipo | 4 | 4 | 4 | **4** | Sin cambios |
| Momento | 5 | 5 | 7 | **5** | La misma macro que en v2 y v3 |
| **Total** | **4,0** | **4,0** | **5,0** | **≈4,3** | `(5+3+4+5+4+4+5)/7 = 30/7` |

**[Opinion]** La 3.0 es **la mejor de las tres en diseño**: elimina el impago y la dependencia de la conversión. **No es la mejor en riesgo de ejecución**: es la única que se apoya en la cadena para custodiar la plata.

## 4 bis. Agregado: v4 (comunidades dueñas de sus acuerdos)
Ver `v4-comunidades-propietarias.md`:
- **Mecanismo:** la compra grupal se hace con **compromiso sin depósito**. Cada persona autoriza al contrato a cobrarle el importe exacto, la plata se queda en su wallet hasta la ejecución, y la ejecución es atómica: si no se llega al cupo, nadie paga.
- **Prueba del profesor:** la pasa por una razón estructural (los acuerdos sobreviven a La Vaquita). Con un límite: wARS es pausable, tiene lista de bloqueo y es actualizable por su emisor.
- **Puntaje con la misma vara: 4,0** (Claude 4,3 y Codex 3,9 en `fast-track/debate-ronda-3.md`).
- **Frente a la 3.0:** mejora la custodia y elimina los reembolsos, pero el contrato es más delicado y el ingreso se puede eludir creando otra campaña.

## 5. Lo que comparten las tres
1. **Cero evidencia.** En las tres, la nota está trabada por lo mismo, y hubo cuatro rediseños en un día. La propia 3.0 lo marca como antipatrón ("rediseñar en lugar de validar").
2. **Ninguna tiene una ventaja que no se pueda copiar.**
3. **Un equipo técnico sin rol comercial.**

## 6. Recomendación
**[Opinion]**
1. **No hacer otro rediseño.** El próximo paso es salir a buscar evidencia.
2. **El experimento más barato y que más decide es el E1 de 3.0:** contactar a 15 proveedores (antes del 29/10, según el plan de 3.0) y conseguir 1 o 2 ofertas escritas con precio grupal, comisión aceptada y precio sostenido durante la ventana. Esas mismas conversaciones sirven para el **K1 de v2**: hay que sumar la pregunta por el paquete con descuento y CPA, y separar a los comercios familiares.
3. **Una pregunta por versión,** en las mismas salidas de campo:
   - v3: si el organizador paga por coordinar;
   - 3.0: si 10 personas depositan de verdad en una meta común.
4. **Hackathon:** pasar el alcance a 3.0 **es una decisión del equipo** (el alcance actual está en `docs/tareas/` y el motor de juntas, en `packages/core`). Si se toma, hay que:
   - mantener el tope de pago de la política actual (la 3.0 propone $ 100.000 por persona; hoy son $ 5.000 por pago);
   - testear a fondo una bóveda sin admin antes de mainnet;
   - consultar a un abogado por la CNV antes de recibir fondos de terceros.
5. **Decidir con datos el 24/11**, con un mismo criterio: la versión que tenga el primer pago real (de un proveedor, de un organizador o de una campaña completa) pasa a modo completo.

## Flags
**Red Flags:**
- **[Data]** 0 evidencia propia en las tres versiones.
- **[Opinion]** La 3.0 subestima el riesgo de la CNV y el técnico de una bóveda inmutable con fondos de terceros.

**Yellow Flags:**
- **[Opinion]** Cambiar el alcance del hackathon a 15 días del cierre, con dedicación parcial, sin pasar por el equipo.
- **[Data]** Los scorecards se hicieron con calibraciones distintas; las notas originales no se pueden comparar entre sí.

## Fuentes
- v2: `06-validation/scorecard.md`, `05-financial/`, `00-intake/brief.md`.
- v3: `fast-track/` (scorecard, modelo de ingresos, Olas 1 y 2 y debates con Codex).
- 3.0: exploración local del fundador fuera del repo (README, brief, research gate, modelo de ingresos, scorecard y panorama competitivo, al 25/10/2026, 18:07). Si se quiere conservar, se puede copiar a `docs/investigacion/`.
