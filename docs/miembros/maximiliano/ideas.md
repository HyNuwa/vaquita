# Ideas · Maximiliano

La más nueva arriba.

## 2026-10-25 · Compromiso sin depósito para compras grupales
- Cada comprador autoriza el importe exacto y firma su `comprometer()` en la cadena. La plata no sale de su wallet hasta que `ejecutar()`, que es atómica, le paga directo al proveedor; si no se llega al cupo, nadie paga y no hay nada que reembolsar.
- Pasa la prueba de "si sacás la blockchain, ¿qué perdés?": las condiciones y la ejecución sobreviven a La Vaquita. Tiene un límite: wARS es pausable por Ripio.
- Se convirtió en D11. El detalle está en `docs/investigacion/la-vaquita-2/v4-comunidades-propietarias.md`.
