# Brief — La Vaquita 2.0 (Social ROSCA Commerce)

**Fase:** 1 — Intake
**Proyecto:** la-vaquita-2
**Fecha:** 2026-10-24
**Confianza:** Baja (idea sin contacto con usuarios ni comercios)

---

> Esta es una idea **nueva y evolucionada** de La Vaquita. Los documentos previos de `docs/investigacion/` son contexto secundario, no restricciones.

## 1. La idea

**Una sola experiencia: juntas rotativas (ROSCA) por turnos donde el pozo de cada turno puede usarse para comprar con descuento en un comercio asociado, dentro de una red social de comunidades.** Tres elementos inseparables: **Comunidad + ROSCA + Comercio.** Agente, reputación, gamificación y DeFi son herramientas complementarias.

- **Principio esencial:** la ROSCA por turnos es el corazón del producto (decisión del fundador). Nada de "acumular y comprar sin turnos".
- **Destino del fondo configurable:** pago al beneficiario o compra autorizada.
- **Oferta comercial opcional:** una vaquita puede no tener comercio.
- **Metas libres:** el usuario puede ahorrar para cualquier cosa; no hay límite de categorías.
- **Tres flujos separados en contabilidad y contratos:** aportes de la ROSCA, pagos comerciales y garantías.

### Configuración de cada vaquita
| Parámetro | Ejemplos |
|---|---|
| Objetivo | Notebook, cursos, viajes, herramientas, cualquier meta |
| Participantes | 5, 10, 20… según límites de riesgo |
| Aportes | Semanales, quincenales, mensuales |
| Turnos | Sorteados, acordados o por reglas aceptadas antes |
| Destino del fondo | Al beneficiario o compra autorizada |
| Oferta comercial | Opcional, con condiciones verificadas |
| Garantías | Según el riesgo de adelanto |
| Comunidad | Privada, verificada o abierta |

### Ejemplo de referencia: Club Tech Jujuy (cifras ilustrativas)
5 personas · $20.000/semana · pozo $100.000 · 5 semanas. Un comercio vende un kit de $100.000 a $90.000 si hay 5 compras en el ciclo, **con entrega escalonada** (una por turno). Cada semana: $90.000 al comercio y $10.000 al beneficiario. Comisión hipotética de La Vaquita: 3–5% sobre ventas confirmadas.

## 2. Problemas que dice resolver
1. Ahorrar solo es difícil sin compromiso externo ni meta concreta.
2. Comprar bienes importantes requiere liquidez que no se tiene.
3. Las compras individuales no aprovechan poder de negociación colectivo.
4. Las ROSCAs no escalan más allá de las relaciones personales (identidad, confianza, impagos).
5. Las comunidades no tienen herramientas financieras compartidas.

## 3. Fundadores
- 3 integrantes, perfil **técnico**: Maximiliano (líder técnico, producto y entrega), Esteban (cadena y pagos) y Daniel (agente y bot).
- Santos (producto, usuarios, legal) dejó el equipo el 24/10/2026. **Nadie tiene el rol comercial.** Las primeras entrevistas las harían Maxi y Daniel.
- **Contactos reales:** familiares de Maxi y/o Daniel tienen comercios en San Salvador de Jujuy (una distribuidora de artículos de limpieza y un servicio técnico con accesorios de PC). **[Founder-reported]**
- **No hay** acceso confirmado a comunidades universitarias o tecnológicas (UNJu, institutos) ni contacto con personas que ya hagan juntas informales.
- **Ventaja que no se pueda copiar: no identificada.** Lo único que hay es capacidad técnica (Celo, agentes) y dos comercios familiares, que no son una muestra neutral porque son familia.
- Dedicación: el fundador dice que no es una restricción.

## 4. Mercado
- **Piloto:** Jujuy. **Visión:** Argentina → LatAm → global.
- Segmento inicial propuesto: estudiantes, desarrolladores, diseñadores e independientes.
- Competencia conocida: ROSCAs informales, Ronda/AjoAI (Celo), Money Fellows, Sommos, Mercado Pago (Reservas), Pinduoduo como referencia, Muni y Favo como precedentes fallidos.

## 5. Negocio
- **Ingreso principal elegido: comisión del comercio sobre la venta confirmada** (3–5%, hipótesis). Se descarta el "premio por adelantar el turno" como ingreso principal.
- Secundarios: herramientas B2B para comunidades y alianzas.
- **DeFi: no descartado** por el fundador. Se evalúa con números en investigación y finanzas.
- Fuera del modelo inicial: token propio, préstamos propios, inventario y logística.

## 6. Restricciones
- Celo mainnet, wARS (Ripio), identidad ERC-8004 del agente, tx etiquetadas (ERC-8021).
- Hackathon *Agents on Open Rails*, entrega 9/11/2026: un MVP demostrable.
- Regulación: RG CNV 1172/2026 (ver `preflight.md`), protección al consumidor y datos personales.

## 7. Evidencia de clientes
- **Usuarios entrevistados: 0. Comercios contactados: 0.** No hay compromisos ni intención de pago.

## 8. Correcciones que surgieron en la entrevista
1. **Adelanto sin riesgo y gratis no existe.** Que el comercio cobre directo no elimina la deuda de $80.000 que le queda a quien cobra en la semana 1.
2. **"Ventas garantizadas" para el comercio no es cierto.** Si alguien deja de pagar, la última compra del ciclo puede no ocurrir. Además, el precio fijo en pesos durante 5 semanas pone el riesgo de inflación sobre el comercio.
3. **Economía del comercio:** 10% de descuento + 5% de comisión = 15% del precio. Puede funcionar en cursos o servicios digitales, pero es dudoso en electrónica en Argentina. **[Assumption, a validar]**
4. **Descuento "sintético" con DeFi:** en una ROSCA el pozo se reparte en cada ronda, así que casi no queda plata quieta generando interés. Además, custodiar para invertir complica la situación regulatoria.
5. **Logística consolidada en un punto común:** es el modelo de Muni y Favo, y contradice el principio de no hacer logística.
6. **Turno 5 vs. turno 1:** el descuento es igual para todos, así que la asimetría de la junta sigue. Se resuelve en la Fase 6.

## 9. Amenaza de Mercado Pago y criterio de salida
- **Si Mercado Pago lanza "Reservas grupales con descuentos":** la hipótesis de trabajo, no confirmada por los fundadores, es especializarse en comunidades de confianza y comercios locales medianos que Mercado Libre no atiende. **[Assumption]** Se valida en la Ola 2 de investigación.
- **Criterio de salida del modelo comercial (confirmado):** si de 10 comercios entrevistados **menos de 3** aceptan descuento + entrega escalonada + comisión, se abandona el híbrido comercial. Los comercios familiares cuentan, pero hacen falta al menos 8 comercios sin relación con el equipo.
- **Si se dispara:** pivotar a una herramienta de juntas sin comercio, o cerrar.

## Notas de pivote (2026-10-25, después del Research Gate 🟡)
- **Quién paga: no cambia.** El fundador eligió mantener **solo la comisión del comercio**. Se descartaron: cargo fijo por vaquita, cargo por turno temprano (riesgo de que se lea como interés) y abono mensual del comercio.
- **Qué cambia:**
  1. La comisión se fija por rubro: **10–15% en digital, 6–10% en servicios, 2–4% en bienes físicos** (`01-discovery/raw/pricing-deep-dive.md`). Reemplaza el 3–5% original.
  2. La **compra es opcional y está separada de la junta:** la junta paga en dinero al beneficiario, y el comercio le vende la oferta aparte (diseño de menor riesgo IGJ, `01-discovery/raw/regulatory.md`).
  3. El ahorrista no paga nada.
- **Riesgo aceptado:** queda una sola fuente de ingreso, sujeta a que haya compra (supuesto: 30% de los beneficiarios), y ningún modelo vivo depende solo de esa fuente. Pasa a ser la hipótesis principal de la Fase 8.
- **Entrevistas (Fase 3.7): pospuestas por decisión del fundador.** Las finanzas quedan en Etapa A (supuestos) y las entrevistas pasan a ser el experimento #1.

## Notas de pivote 2 (2026-10-25, después del scorecard 4,0/10)
- **Nueva hipótesis central:** *La Vaquita ayuda a organizadores y comunidades a administrar juntas con menos trabajo, compromisos claros y pagos verificables. Pagan por esa coordinación, y los integrantes conservan las ofertas comerciales opcionales.* La compra deja de ser la única explicación de cómo se financia el servicio.
- **Pregunta decisiva:** ¿quién sufre tanto organizar juntas que pagaría por resolverlo, aunque no haya descuento comercial?
- **Tres pagadores posibles, sin ganador todavía:**
  - **B. El organizador:** primera investigación, entre personas que ya organizan juntas o pasanaku.
  - **C. Instituciones:** segunda. Hipótesis comercial y jurídica: las deducciones salariales tienen límites (LCT arts. 131–133) y la Res. INAES 3034/2024 exige un reglamento por servicio.
  - **A. El comercio:** tercera. Se mantiene K1 sin cambios.
- **Segmento:** por conducta comprobada (personas que ya organizan ROSCAs), no por nacionalidad. La cifra de "30.000 personas con pasanaku" era un error: se refiere a residentes bolivianos en Jujuy.
- **Confianza:** se separan transparencia y coordinación (lo que resuelve el software) de la garantía de cumplimiento, que el software no resuelve. Se prueba si hay demanda solo por las dos primeras.
- **Sin cambios:** la demo del hackathon y la decisión de no levantar inversión con el modelo actual. Los $7,3 M de proyecciones son un escenario, no un presupuesto: el gasto se libera por etapas.
- **Responsable comercial:** 4 a 8 h por semana dentro del equipo, con registro de contactos, rechazos y compromisos. No se suma un cuarto socio todavía.

## 10. Notas de la entrevista
- Algunas respuestas llegaron redactadas por otra IA que "simuló" a los fundadores. Solo quedó registrado lo que el fundador confirmó como cierto.

---

## Flags

**Red Flags:**
- Cero contacto con usuarios y con comercios: el modelo de ingresos elegido depende por completo de un actor (el comercio) con el que nadie habló.

**Yellow Flags:**
- Equipo 100% técnico tras la salida de Santos: nadie tiene el rol comercial ni hay una ventaja que no se pueda copiar.
- Los dos únicos comercios accesibles son de familia: alto riesgo de un "sí" por cortesía en las entrevistas.
- "Sin límite de qué se compra" + "descuentos negociados" se tensionan: dispersión de compras = menos poder de negociación.
- Alcance amplio (red social + ROSCA + comercio + agente + DeFi + gamificación): riesgo de querer hacer todo a la vez.

## Fuentes
- Entrevista inicial con el fundador (2026-10-24) y documento "La Vaquita 2.0" provisto por el fundador.
- `preflight.md`.
