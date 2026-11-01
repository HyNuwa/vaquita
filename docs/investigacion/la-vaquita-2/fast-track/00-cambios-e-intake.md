# Cambios de diseño, intake y brainstorm — La Vaquita v3

**Fase:** Fast-track (0.5, 1 y 2)
**Proyecto:** la-vaquita-2 → modelo v3
**Fecha:** 2026-10-25
**Confianza:** Media sobre los cambios (son decisiones de diseño); Baja sobre la demanda (0 entrevistas)

---

## 1. Por qué un fast-track
El scorecard completo (`../06-validation/scorecard.md`) evaluó el modelo A, en el que pagaba solo el comercio, con un **4,0/10**. El fundador pidió los cambios necesarios para subir la nota y después un fast-track sobre el modelo resultante. **Regla de honestidad:** solo cuentan los cambios de diseño reales. Las dimensiones que dependen de evidencia (problema, mercado y equipo) no suben sin entrevistas. El debate con Codex está en `debate-ronda-1.md`.

## 2. Cambios adoptados (modelo v3)
| # | Cambio | Origen | Dimensión que puede mover |
|---|---|---|---|
| C1 | **Paga el organizador:** un precio por junta o un abono por organizador. Se fija antes de las entrevistas y se prueba con una seña o un prepago. | Pivote 2 | Modelo de negocio |
| C2 | **Coordinación primero:** registro, avisos y deuda posterior visible. Los pagos van por transferencia, efectivo o wARS (opcional). El software no custodia ni mueve la plata del grupo. | Claude | Factibilidad |
| C3 | **Doble confirmación:** cada pago pasa por *declarado* (lo informa quien paga), *confirmado* (lo acepta quien recibe) o *impugnado*. Las correcciones se agregan sin borrar nada y se puede exportar. Así no alcanza con que el organizador diga "pagó". | Codex | Factibilidad y ventaja |
| C4 | **Cabeza de playa:** organizadores que llevan **3 o más juntas a la vez**, con una bandeja única de vencimientos y excepciones. Ahí el trabajo es lo bastante pesado como para pagar por resolverlo. | Codex | Modelo de negocio y ventaja |
| C5 | **Sin comercio en el primer piloto pago:** no hay ofertas, atribución ni liquidación. El CPA queda como hipótesis A, con K1 intacto. | Codex | Factibilidad y modelo |
| C6 | **Historial privado del grupo**, no público: las deudas abiertas solo las ven sus integrantes. | Codex | Riesgo regulatorio y de datos |
| C7 | **Se descarta «Vaqi»** (suena igual que Vaki). «La Vaquita» sigue como nombre de trabajo y la verificación de nombres continúa. | Claude | Ventaja (confusión) |

**Lo que no cambia:** la demo del hackathon (wARS, firma de cada miembro, CIP-64 y ERC-8021, hasta el 8/11), el criterio K1 y la decisión de no levantar inversión.

## 3. Pre-flight
Pendiente del informe `raw/ola-1.md`, sección 1. Al cierre del fast-track, ver la síntesis en `01-research-gate.md`.

## 4. Intake (una ronda, desde lo que ya confirmó el fundador)
- **Idea:** software para organizadores de juntas, tandas o pasanaku que les ahorra tiempo y conflictos: quién pagó, quién debe y qué pasa si alguien se atrasa.
- **Equipo:** 3 técnicos (Maxi, Esteban y Daniel). Todavía no hay responsable comercial designado.
- **Conversaciones previas con clientes: 0.** Según el fast-track, hay que hacer **al menos 3 entrevistas** antes de seguir. Se registra como bloqueo, no se simula.
- **Contactos:** dos comercios familiares (sirven para el pagador A, no para el B). No hay referentes de organizadores.
- **Restricciones:** las del hackathon para la demo. El piloto pago puede funcionar sin cadena.

## 5. Brainstorm: 3 variaciones
| Variación | Quién paga | Qué compra | A favor | En contra |
|---|---|---|---|---|
| **B1. Abono del organizador múltiple** (elegida) | El organizador con 3 o más juntas | Bandeja de vencimientos, doble confirmación, avisos e historial | Su dolor es el más pesado; el organizador trae a su grupo | Segmento chico y difícil de encontrar; compite contra el cuaderno |
| **B2. Precio por junta, repartido entre los miembros** | Los integrantes, con un monto fijo y transparente que se divide entre todos | Lo mismo, para una junta suelta | Monto chico por persona | Riesgo IGJ si se lee como comisión de administración (ver `debate-ronda-1.md`); fricción para cobrar |
| **C1. Institución** (mutual, cooperativa o empresa) | La entidad, por miembro activo | Juntas entre socios con registro y reportes | Ticket más alto y un solo pagador | Ciclo de venta largo, reglamento INAES y responsabilidad jurídica |

**Elegida para el fast-track: B1**, con B2 como alternativa de precio y C1 como segunda línea (ver `../action-plan-30-days.md`).

## Flags
**Red Flags:**
- 0 entrevistas: según el fast-track, no se puede pasar de la Fase 3.7 sin al menos 3.

**Yellow Flags:**
- El organizador con 3 o más juntas a la vez puede ser muy escaso. Su existencia y cuántos hay se verifican en la Ola 1 y en las entrevistas.

## Fuentes
- `../00-intake/brief.md` ("Notas de pivote 2"), `../06-validation/scorecard.md`, `debate-ronda-1.md`.
