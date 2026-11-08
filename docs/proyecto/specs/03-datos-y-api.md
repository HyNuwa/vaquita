# S3 · Datos, acceso y API

## Límite de autoridad — Web3-first

Esta parte implementa **servicios auxiliares**, no una base de datos financiera. Ninguna operación de Safe, Zodiac o wARS requiere que esta API esté en línea. Los servicios de grupos sociales, invitaciones, cuotas, descripciones, notificaciones y programación de Vaqui sí requieren persistencia. Cuando no existe un proveedor persistente, se ocultan/deshabilitan esas funciones; los responsables conservan el modo independiente de S2/S6 para operar su Safe.

- **Fuente de verdad en Celo:** balance, titulares y umbral Safe, módulos, permisos de Roles, hashes aprobados, transferencias y ejecución final.
- **Estado derivado/cacheable:** `grupos.safe`, `roles`, responsables visibles, propuestas ejecutadas, aprobaciones, movimientos y saldos. Nunca se confía en estas filas para autorizar pagos: siempre se compara con la cadena.
- **Estado necesariamente externo:** nombres, participantes no responsables, invitaciones, cuotas, solicitudes, Telegram, mensajes EIP-712 y sus firmas, programación, avisos, transacciones pendientes del ejecutor y bitácora enriquecida.
- **Restauración:** los fondos se operan sin backend mediante dirección Safe o manifiesto de S2; los metadatos privados solo se recuperan mediante exportación/copia externa. Sin esa copia, no se promete recuperación de cuotas, nombres ni calendario.

**No poner en el navegador una cadena de conexión a la base.** Todos los endpoints que acceden a datos privados requieren autenticación y autorización.

## Dependencias

Para el adaptador auxiliar PostgreSQL: `pg` y, para tests offline, `@electric-sql/pglite`, con versiones fijas. Anotar en `stack.md`. Sin ORM. El núcleo `fondo/` de S2 **no importa** este adaptador.

`AUX_STORAGE=postgres|deshabilitado` en la web. Si no hay `DATABASE_URL`, arranca en modo independiente con los endpoints auxiliares deshabilitados de forma explícita (503 `SERVICIO_AUXILIAR_NO_DISPONIBLE`, nunca datos simulados). El ejecutor de Vaqui requiere persistencia duradera del adaptador operativo para pagos programados; sin ella no transmite. PostgreSQL es la implementación inicial de ese servicio, no una condición de control sobre el Safe.

`fondo/datos/db.ts` define `Db = { query(sql, params), transaccion(fn) }`, con una implementación `pg` y otra PGlite. Este módulo no llega nunca al navegador.

**Auxiliar local:** `docker-compose.dev.yml` con `postgres:17`, puerto `55432`, sin datos reales. **Despliegue con funciones colaborativas:** `DATABASE_URL` configurada por el operador (Neon es solo una opción a comparar). **Despliegue de modo independiente:** no se exige PostgreSQL y la web obtiene datos financieros desde RPC. Ninguna ruta de modo independiente llama al adaptador SQL.

## Migraciones

`packages/core/src/fondo/datos/migraciones/NNN_nombre.sql`, aplicadas en orden con `npm run fondo:migrar`, en una tabla `migraciones`. Son idempotentes por registro y no se editan después de mergeadas.

```sql
CREATE TABLE grupos (
  id uuid PRIMARY KEY,
  nombre text NOT NULL CHECK (char_length(nombre) BETWEEN 3 AND 60),
  estado text NOT NULL CHECK (estado IN ('borrador','esperando_responsables','safe_creado','roles_desplegado','reglas_aprobadas','activo','disolviendo','disuelto')),
  simulacion boolean NOT NULL DEFAULT true,
  safe text UNIQUE, roles text UNIQUE,
  manifiesto_publico jsonb, -- copia auxiliar: se verifica contra Celo al usarla
  salt numeric(78,0) NOT NULL,
  vaqui_wallet text,
  vaqui_pausado boolean NOT NULL DEFAULT false,
  bloque_inicio bigint,
  verificado_en timestamptz, verificacion jsonb,
  creador text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE integrantes (
  id uuid PRIMARY KEY,
  grupo_id uuid NOT NULL REFERENCES grupos,
  wallet text NOT NULL,
  nombre text NOT NULL CHECK (char_length(nombre) BETWEEN 1 AND 40),
  rol text NOT NULL CHECK (rol IN ('integrante','responsable')),
  riesgos_version int,
  riesgos_aceptados_en timestamptz,
  alta_en timestamptz NOT NULL DEFAULT now(),
  baja_en timestamptz,
  UNIQUE (grupo_id, wallet)
);

CREATE TABLE invitaciones (
  token_hash text PRIMARY KEY,
  grupo_id uuid NOT NULL REFERENCES grupos,
  rol text NOT NULL CHECK (rol IN ('integrante','responsable')),
  vence_en timestamptz NOT NULL,
  usada_en timestamptz,
  usada_por text
);

CREATE TABLE destinatarios (
  id uuid PRIMARY KEY,
  grupo_id uuid NOT NULL REFERENCES grupos,
  alias text NOT NULL CHECK (alias ~ '^[a-z0-9_-]{1,32}$'),
  wallet text NOT NULL,
  estado text NOT NULL CHECK (estado IN ('propuesto','autorizado','quitado')),
  UNIQUE (grupo_id, alias), UNIQUE (grupo_id, wallet)
);

CREATE TABLE cuotas (
  grupo_id uuid PRIMARY KEY REFERENCES grupos,
  monto numeric(78,0) NOT NULL CHECK (monto > 0),
  dia_del_mes int NOT NULL CHECK (dia_del_mes BETWEEN 1 AND 28),
  activa boolean NOT NULL DEFAULT true
);

CREATE TABLE propuestas (
  id uuid PRIMARY KEY,
  grupo_id uuid NOT NULL REFERENCES grupos,
  tipo text NOT NULL CHECK (tipo IN ('reglas_iniciales','gasto','devolucion','cancelacion','cambio_responsable','cambio_destinatarios','revocar_vaqui','cerrar_vaqui','reparto')),
  descripcion text NOT NULL CHECK (char_length(descripcion) <= 280),
  origen text NOT NULL CHECK (origen IN ('responsable','vaqui')),
  autor text,
  safe_to text NOT NULL, safe_value numeric(78,0) NOT NULL DEFAULT 0,
  safe_data text NOT NULL, safe_operation int NOT NULL CHECK (safe_operation IN (0,1)),
  safe_nonce numeric(78,0) NOT NULL,
  safe_hash text NOT NULL,
  estado text NOT NULL CHECK (estado IN ('pendiente','ejecutada','cancelada','desactualizada','rechazada')),
  tx_ejecucion text,
  creada_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (grupo_id, safe_hash)
);
-- Una por grupo. La cancelación convive con la original porque usa su mismo nonce.
CREATE UNIQUE INDEX una_pendiente ON propuestas (grupo_id) WHERE estado = 'pendiente' AND tipo <> 'cancelacion';
CREATE UNIQUE INDEX una_cancelacion ON propuestas (grupo_id) WHERE estado = 'pendiente' AND tipo = 'cancelacion';

CREATE TABLE solicitudes_devolucion (
  id uuid PRIMARY KEY,
  grupo_id uuid NOT NULL REFERENCES grupos,
  integrante_id uuid NOT NULL REFERENCES integrantes,
  monto numeric(78,0) NOT NULL CHECK (monto > 0),
  motivo text NOT NULL CHECK (char_length(motivo) <= 280),
  estado text NOT NULL CHECK (estado IN ('abierta','propuesta','rechazada','cerrada')),
  propuesta_id uuid REFERENCES propuestas
);

CREATE TABLE aprobaciones (
  propuesta_id uuid NOT NULL REFERENCES propuestas,
  responsable text NOT NULL,
  tx_hash text,
  PRIMARY KEY (propuesta_id, responsable)
);

CREATE TABLE pagos_programados (
  id uuid PRIMARY KEY,
  grupo_id uuid NOT NULL REFERENCES grupos,
  destinatario_id uuid NOT NULL REFERENCES destinatarios,
  monto numeric(78,0) NOT NULL CHECK (monto > 0),
  primera_fecha date NOT NULL,
  periodicidad text NOT NULL CHECK (periodicidad IN ('una_vez','mensual')),
  valida_hasta timestamptz NOT NULL, -- caducidad de la autorización EIP-712
  max_ejecuciones int NOT NULL CHECK (max_ejecuciones BETWEEN 1 AND 12),
  version int NOT NULL,
  estado text NOT NULL CHECK (estado IN ('esperando_firmas','activo','pausado','requiere_reaprobacion','terminado','cancelado')),
  firmas jsonb NOT NULL DEFAULT '[]',
  paquete_firmado jsonb, -- exportable: mensaje EIP-712 exacto, dominio y firmas
  hash_payload text
);

CREATE TABLE ocurrencias_pago (
  pago_id uuid NOT NULL REFERENCES pagos_programados,
  vencimiento date NOT NULL,
  estado text NOT NULL CHECK (estado IN ('pendiente','enviando','confirmada','fallida','incierta','ensayo','excede_limites','omitida')),
  intentos int NOT NULL DEFAULT 0,
  tx_hash text, tx_firmada text, nonce_cuenta bigint,
  detalle text,
  actualizada_en timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (pago_id, vencimiento)
);

CREATE TABLE movimientos (
  tx_hash text NOT NULL, indice_log int NOT NULL,
  grupo_id uuid NOT NULL REFERENCES grupos,
  bloque bigint NOT NULL, bloque_hash text NOT NULL, fecha timestamptz NOT NULL,
  tipo text NOT NULL,
  clasificacion text CHECK (clasificacion IN ('aporte','sin_atribucion','gasto','pago_vaqui','regla','alerta')),
  desde text, hacia text, monto numeric(78,0),
  integrante_id uuid REFERENCES integrantes,
  crudo jsonb NOT NULL,
  PRIMARY KEY (tx_hash, indice_log)
);

CREATE TABLE cursores (
  grupo_id uuid PRIMARY KEY REFERENCES grupos,
  ultimo_bloque bigint NOT NULL,
  ultimo_hash text NOT NULL
);

CREATE TABLE desafios (
  id uuid PRIMARY KEY,
  objetivo text NOT NULL CHECK (objetivo IN ('sesion','telegram')),
  nonce text NOT NULL UNIQUE,
  wallet text,
  telegram_id bigint,
  vence_en timestamptz NOT NULL,
  usado_en timestamptz
);

CREATE TABLE telegram (
  wallet text PRIMARY KEY,
  telegram_id bigint NOT NULL UNIQUE,
  vinculado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE avisos (
  clave text PRIMARY KEY,   -- idempotencia: un mismo aviso se manda una vez
  grupo_id uuid NOT NULL REFERENCES grupos,
  para text NOT NULL,  -- 'integrantes', 'responsables', 'todos' o 'wallet:<dirección>'
  texto text NOT NULL,
  enviado_en timestamptz
);

CREATE TABLE bitacora (
  id uuid PRIMARY KEY,
  en timestamptz NOT NULL DEFAULT now(),
  grupo_id uuid REFERENCES grupos,
  accion text NOT NULL,
  resultado text NOT NULL CHECK (resultado IN ('hecho','omitido','fallido','ensayo')),
  motivo text NOT NULL,      -- código fijo, no texto libre
  tx_hash text
);
```

Las direcciones se guardan con checksum. Los montos se pasan como texto entre la base y `bigint`.

**Semántica de los campos:** `grupos.estado`, `destinatarios.estado`, `propuestas.estado`, `aprobaciones`, `movimientos`, `verificacion` y `cursores` son observaciones o coordinación; jamás prevalecen sobre `getOwners()`, `nonce()`, permisos de Roles, recibos o eventos. `pagos_programados` guarda **intenciones firmadas fuera de cadena**; las firmas EIP-712 no imponen por sí solas las fechas ni la cancelación en Safe/Zodiac.

**Exportación:** incluir manifiesto público, propuestas Safe no ejecutadas con su `to/value/data/operation/nonce/hash`, y paquetes completos de pagos programados (mensaje EIP-712, dominio, firmas y estado conocido) en archivos portables. Exportar información privada solo a integrantes autorizados y con opción de cifrado local. Al importar, volver a comprobar firmas, expiración, responsables actuales y estado on-chain; una versión/cancelación almacenada en un archivo no constituye revocación en cadena.

**Responsables:** una regla de aplicación, con test, mantiene exactamente tres activos después de la creación.

**`grupos.simulacion`:** `true` por defecto. Queda en `false` solo si Maxi lo cambia por script después de confirmar a tres personas independientes (D16.20). La web muestra "Grupo de prueba" mientras sea `true`.

## Acceso

**Sesión auxiliar con firma (SIWE, `viem/siwe`):** la necesitan las rutas que consultan datos privados del servicio, **no** la lectura ni la operación manual de Safe en modo independiente.

1. `POST /api/sesion/desafio` guarda un nonce de un solo uso, con 10 minutos de vigencia.
2. La billetera firma el mensaje con dominio, `chainId` 42220 y nonce.
3. `POST /api/sesion` verifica con `verifySiweMessage` en un cliente público, para aceptar también billeteras de contrato, y marca el desafío como usado.
4. Cookie `httpOnly`, `Secure`, `SameSite=Lax`, 7 días, con cuerpo `{ wallet, vence }` y HMAC-SHA256 con `SESSION_SECRET`.

Sin `SESSION_SECRET` de al menos 32 bytes, las rutas de sesión auxiliares no se habilitan en producción. **La web pública y el modo independiente sí arrancan** y permiten leer/operar Safe por RPC; la ausencia de secreto no crea sesiones inseguras.

**Invitaciones:** token de 32 bytes aleatorios, y en la base solo su SHA-256. Vence a los 14 días y es de un solo uso.

## API

Next.js Route Handlers en `apps/web/src/app/api/`. Entradas con zod `.strict()`. Errores como `{ codigo, mensaje }` en español. Las rutas nunca reciben ni devuelven claves. **Las rutas auxiliares no son la vía obligatoria para consultar fondos ni enviar transacciones.** El modo independiente obtiene `balanceOf`, `getOwners`, permisos y recibos usando viem y RPC desde el cliente de la persona; las transacciones se envían desde su wallet. Una API caída devuelve un error explícito y la interfaz ofrece acceso independiente, nunca afirma que los fondos estén inaccesibles.

| Método y ruta | Quién | Efecto |
|---|---|---|
| `POST /api/sesion/desafio` | Público | Desafío |
| `POST /api/sesion`, `DELETE /api/sesion` | Público, sesión | Entrar, salir |
| `GET /api/invitaciones/:token` | Público | Nombre del grupo y rol. Nada más |
| `POST /api/invitaciones/:token/aceptar` | Sesión | Alta con nombre y riesgos. Da de alta si no fue usada |
| `POST /api/grupos` | Sesión | Crea `borrador` e invitaciones de responsable |
| `GET /api/grupos` | Sesión | Sus grupos |
| `GET /api/grupos/:id` | Integrante | Grupo, saldos, integrantes, propuesta pendiente y programados |
| `POST /api/grupos/:id/invitaciones` | Responsable | Invitación de integrante |
| `POST /api/grupos/:id/destinatarios` | Responsable | Agrega como `propuesto` |
| `GET /api/grupos/:id/creacion/siguiente` | Creador o responsable | La próxima `TxPersona` del asistente, según lo que ya está en cadena |
| `POST /api/grupos/:id/creacion/verificar` | Integrante | Corre `verificarGrupo`; si da `ok`, pasa a `activo` |
| `POST /api/grupos/:id/propuestas` | Responsable | Crea propuesta con el `nonce` vigente |
| `POST /api/grupos/:id/solicitudes` | Integrante | Pide una devolución: fila en `solicitudes_devolucion`, y un responsable la convierte en propuesta o la rechaza con un motivo |
| `GET /api/propuestas/:id/siguiente` | Responsable | `aprobarHash` o `ejecutar`, tras comprobar `nonce`, dueños y simulación |
| `POST /api/propuestas/:id/cancelar` | Responsable | Crea la propuesta de `cancelacion` con el mismo `nonce`. No toca la original hasta que el lector vea la ejecución |
| `POST /api/tx` | Sesión | Asocia un hash a un grupo. **No cambia ningún estado:** el estado sale de la cadena |
| `GET /api/tx/:hash` | Integrante | Resultado leído del recibo y de los eventos |
| `POST /api/grupos/:id/programados` | Responsable | Crea el pago, en `esperando_firmas` |
| `POST /api/programados/:id/firmas` | Responsable | Agrega una firma EIP-712 verificada |
| `POST /api/grupos/:id/vaqui/pausa` | Responsable | Pausa o reanuda. **Solo cambia nuestro servicio** |
| `PUT /api/grupos/:id/cuota` | Responsable | Fija o quita la cuota |
| `POST /api/grupos/:id/salir` | Integrante | Baja. Un responsable no puede irse sin haber sido reemplazado |
| `POST /api/grupos/:id/disolver` | Responsable | Pasa a `disolviendo` y arma la secuencia de S2 |
| `POST /api/telegram/vincular` | Sesión | Confirma un desafío de Telegram |
| `GET /api/bitacora` | Público | Solo acción, resultado, motivo, fecha y hash |

**Ruta independiente adicional:** `/fondo/abrir` (S6) recibe una dirección Safe o un manifiesto local; sin sesión ni `DATABASE_URL` permite verificar el grupo y armar una transacción de Safe. No tiene escritura en base. Las propuestas no ejecutadas requieren conservar/exportar su calldata: `ApproveHash` por sí solo solo revela un hash, no el contenido original.

**Autorización:** cada ruta privada comprueba pertenencia social y baja contra el almacenamiento auxiliar y, para operaciones de responsables, que la wallet sea dueña según `getOwners()` de Celo. Si difieren, gana la cadena y se avisa. **La pertenencia social guardada fuera de cadena no es un permiso financiero.** El modo independiente permite actuar a responsables verificados directamente contra Safe, aunque la base no esté accesible. Los integrantes no responsables no obtienen acceso a datos privados sin la fuente externa que certifica su pertenencia.

**`GET /api/grupos/:id`** da nombres solo a integrantes activos. **Salir** borra el nombre, deja `Ex integrante` y conserva los movimientos.

**Límites operativos:** aportes de más de `APORTE_MAXIMO_UI` no se arman. Pasar `OBJETIVO_GRUPO` genera un aviso, y la web lo muestra como aviso y no como garantía.

## Criterios de aceptación (CI, con PGlite)

| ID | Debe pasar |
|---|---|
| S3-1 | Las migraciones corren desde cero y un segundo intento no hace nada |
| S3-2 | No se pueden tener dos propuestas `pendiente` en un grupo, incluso en concurrencia. Sí pueden convivir una propuesta y su cancelación, con el mismo `nonce` |
| S3-3 | SIWE: nonce reutilizado, vencido, otro dominio y otra red rechazados |
| S3-4 | Cookie alterada rechazada; en producción, sin `SESSION_SECRET` de al menos 32 bytes, las rutas de sesión auxiliares quedan deshabilitadas y no crean ni aceptan sesiones. La web pública y el modo independiente sí arrancan |
| S3-5 | Invitación usada dos veces o vencida rechazada; en la base no está el token |
| S3-6 | Matriz de autorización: cada ruta con público, otro grupo, integrante y responsable |
| S3-7 | Responsable en la base y no en la cadena: rechazado |
| S3-8 | `POST /api/tx` no cambia estados |
| S3-9 | Cancelar no marca `cancelada` hasta que el lector ve la ejecución |
| S3-10 | Nombre borrado al salir; responsable sin reemplazo no puede salir |
| S3-11 | Ninguna respuesta contiene `token_hash`, `SESSION_SECRET` o datos de otro grupo |
| S3-12 | `GET /api/bitacora` no expone nombres, alias ni wallets |
| S3-13 | Entradas con campos de más rechazadas (`.strict()`) |
| S3-14 | Sin `DATABASE_URL` ni `SESSION_SECRET`, la web arranca en modo independiente; APIs auxiliares devuelven 503 y no fabrican información |
| S3-15 | Alterar `grupos`, `aprobaciones` o `destinatarios` no modifica titulares, permisos ni autoriza transferencias; prevalecen RPC, firmas y eventos |
| S3-16 | Exportación/importación de manifiesto y propuesta pendiente: verifica cadena y contenido; no afirma recuperar datos sociales que nunca estuvieron on-chain |
| S3-17 | Pago programado EIP-712 guarda/exporta dominio, mensaje y firmas exactas; caducidad y máximo de ejecuciones validados; mensaje alterado rechazado |
| S3-18 | Consultas financieras del modo independiente no importan `pg`, no llaman a rutas de sesión y funcionan con la API auxiliar desconectada |
