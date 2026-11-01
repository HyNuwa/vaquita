# Plan de 30 días — La Vaquita 2.0 (v2, después del pivote del 25/10)

**Fecha:** 2026-10-25 · **Horizonte:** 25/10 al 24/11/2026 · **Equipo:** Maxi, Esteban y Daniel
**Pregunta que guía el mes:** ¿quién sufre tanto organizar juntas que pagaría por resolverlo, aunque no haya descuento comercial? (ver `00-intake/brief.md`, "Notas de pivote 2")
**Regla de gasto:** se libera por etapas, solo cuando la etapa anterior dio señales favorables. Los $7,3 M de `05-financial/projections.md` son un escenario, no un presupuesto.

---

## Etapa 1 · 25/10 – 8/11: hackathon (sin cambiar el modelo técnico)
1. **Puerta de firma el 27/10 (K2):** wallet invisible con firma del dueño, CIP-64 y tag ERC-8021. Si falla, `DIRECT_P2P`; si al 28/10 sigue fallando, se declara bloqueado. Ver `04-product/feature-prioritization.md`.
2. **Registrar la identidad ERC-8004 temprano.** Montos de la demo dentro del tope de $ 5.000 por pago.
3. **La demo:** la ROSCA, la deuda que queda después de cobrar, wARS, el agente respondiendo y derivando un atraso, y la oferta comercial separada. Si hay que recortar, se recortan funciones; los controles de pago y la seguridad no se tocan.
4. **Control de alcance el 1/11, congelamiento el 4/11 y envío el 8/11.**
5. **En paralelo, el responsable comercial** (4–8 h por semana) arma la lista de contactos: organizadores de juntas o pasanaku (a través de referentes de ferias, asociaciones y conocidos), 2–3 mutuales o cooperativas, y comercios. Empieza un registro de contactos, rechazos y compromisos.

## Etapa 2 · 9/11 – 15/11: descubrimiento de clientes
Guiones en `06-validation/discovery-v2.md`. Preguntar por conducta pasada, sin presentar el producto antes de tiempo.

| Prioridad | A quién | Cuántos | Qué se busca |
|---|---|---|---|
| 1 | **Organizadores que ya llevan juntas o pasanaku** | 6–8 | Horas que les lleva coordinar, cómo registran las deudas, qué pasa ante un incumplimiento, qué usan hoy, si quieren cambiar el medio de pago o solo ordenar la organización |
| 2 | **Responsables de mutuales, cooperativas o empresas** | 2–3 | Si quieren administrar juntas o solo registrar acuerdos y pagos; quién decide y quién paga; condiciones de su reglamento |
| 3 | **Comercios** (≥8 independientes de 10) | arranca 4–5 | Paquete completo del CPA, sin cambiar K1 |

## Etapa 3 · 16/11 – 23/11: pruebas comerciales chicas (compromisos, no opiniones)
1. **Organizador (B):** ofrecer usar la herramienta con su grupo real con un precio concreto. Cuentan solo la seña, el prepago o la puesta en marcha agendada con fecha. **Señal mínima a favor: ≥2 de 6–8 organizadores se comprometen.** [Supuesto: el umbral se ajusta en el acta]
2. **Institución (C):** demo sin fondos reales y una propuesta de piloto con precio por miembro. Cuenta una carta de intención o una reunión con quien decide.
3. **Comercio (A):** completar las 10 entrevistas. **K1: si menos de 3 de 10 aceptan, se abandona la hipótesis comercial.**
4. **Legal:** enviar el expediente del flujo que tenga mejores señales. Sin dictamen ni pruebas de seguridad, no se captan fondos de terceros.

## Etapa 4 · 24/11: decisión de dirección
- Acta según `06-validation/kill-criteria.md`, con evidencia directa por pagador: entrevistas, compromisos, rechazos y costo de resolverlo.
- Opciones:
  - (a) seguir con un pagador y diseñar su piloto;
  - (b) seguir con dos en paralelo, solo si los dos tienen compromisos;
  - (c) cerrar.
- No se declara ganador sin alguna evidencia de pago.
