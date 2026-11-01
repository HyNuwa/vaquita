# Informe de verificación: la-vaquita-2

*Generado: 2026-10-25 · Revisó: Claude, sobre la síntesis escrita por Codex*

## Resumen
- **Problemas críticos:** 0
- **Advertencias:** 4
- **Info:** 4

## Problemas críticos
Ninguno. Los 5 entregables tienen encabezado con confianza, datos faltantes, conexiones estratégicas, flags y fuentes. Entre 54 y 114 afirmaciones por archivo llevan etiqueta [Data]/[Estimate]/[Assumption]/[Opinion]. Las contradicciones críticas entre olas están arbitradas de forma explícita en `confidence-dashboard.md`.

## Advertencias

### 1. Cobertura desigual de la Ola 3
- **Archivos:** `target-audience.md`, `confidence-dashboard.md`
- **Problema:** C1–C4 se hicieron con el presupuesto de búsqueda agotado: C2 con 0 búsquedas, C3 con 3. No hay voz argentina en primera persona sobre juntas ni citas de comercios argentinos. El dashboard lo declara, pero la persona primaria descansa sobre datos de terceros.
- **Corrección sugerida:** las entrevistas de la Fase 3.7 reemplazan esa evidencia. Las segundas pasadas C1b y C2b quedaron sin terminar por el límite de uso de Codex.

### 2. Datos de más de 18 meses sin la marca ⚠️
- **Archivos:** `competitor-landscape.md`, `industry-trends.md`
- **Problema:** se usan como precedentes la cita de Money Fellows de 2019, el cierre de Yahoo Tanda en 2018 y el de Muni en 2022. Están fechados, pero no marcados como desactualizados. Como hechos históricos sirven; como métricas actuales no.
- **Corrección sugerida:** ninguna, mientras no se usen como métricas actuales.

### 3. Ingresos de A1 y C4 sobre bases distintas
- **Archivos:** `market-analysis.md`
- **Problema:** la síntesis ya corrigió la anualización de A1 (dividiendo por 2) y aclaró que C4 no confirma a A1. En la Fase 7 hay que usar un único modelo de cohorte.
- **Corrección sugerida:** aplicarlo en la Fase 7.

### 4. Desfasaje con el plazo del hackathon
- **Archivos:** todos
- **Problema:** el plan de verificación (dictamen legal, 10 comercios, ciclo completo de un grupo) excede los 15 días que faltan para el 9/11. La síntesis no distingue qué entra en la demo y qué es validación de la startup.
- **Corrección sugerida:** separar los dos alcances en la Fase 4 o la 6.

## Info
- El TAM ($0,68–1,36 billones de aportes), el SAM ($303.000 M de compras) y el 5,6% (sin ponderar) son consistentes entre los archivos.
- La comisión queda como hipótesis por rubro (3–5% vs. 10–15%). Correctamente, no se adoptó la cifra mayor para mejorar el pronóstico.
- Correcciones entre olas bien resueltas: Naranja X sí tiene Cuenta Compartida; MiniPay está disponible en Argentina; Banxico no prohíbe a particulares operar cripto; Cuota Simple no está vigente.
- No se usaron fuentes duplicadas como si fueran independientes. El 13–15% de ahorro en Jujuy está bien bajado a "opinión profesional en prensa".

## Checklist de verificación
- [x] Todas las afirmaciones cuantitativas etiquetadas
- [x] Sin contradicciones internas sin resolver
- [x] Calificaciones de confianza consistentes con la evidencia
- [x] Data gaps declarados en todos los entregables
- [x] Red/Yellow flags presentes en todos los entregables
- [~] Datos viejos fechados, pero sin la marca ⚠️
- [x] Sin falsa corroboración por fuente duplicada
- [ ] Estrategia refleja datos de mercado (Fase 4, pendiente)
- [ ] Producto refleja dolores (Fase 6, pendiente)
- [ ] Finanzas reflejan el modelo (Fase 7, pendiente)
- [ ] Validación cubre riesgos (Fase 8, pendiente)
