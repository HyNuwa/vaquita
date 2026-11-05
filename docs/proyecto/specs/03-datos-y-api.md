# S3 · Datos, acceso y API

## Dependencias

Fijas en `packages/core`: `pg` y, solo de desarrollo, `@electric-sql/pglite` para tests sin red. Anotar en `stack.md`. Sin ORM.

`fondo/datos/db.ts` define `Db = { query(sql, params), transaccion(fn) }`, con una implementación `pg` y otra PGlite. Este módulo no llega nunca al navegador.

**Local:** `docker-compose.dev.yml` con `postgres:17`, puerto `55432`, sin datos reales. **Producción:** `DATABASE_URL`, puesta por Maxi. Neon es la primera opción y su plan gratuito se verifica en los [pasos humanos](09-pasos-humanos.md); nada del código depende del proveedor.

## Migraciones

`packages/core/src/fondo/datos/migraciones/NNN_nombre.sql`, aplicadas en orden con `npm run fondo:migrar`, en una tabla `migraciones`. Son idempotentes por registro y no se editan después de mergeadas.

```sql
CREATE TABLE grupos (
  id uuid PRIMARY KEY,
  nombre text NOT NULL CHECK (char_length(nombre) BETWEEN 3 AND 60),
  estado text NOT NULL CHECK (estado IN ('borrador','esperando_responsables','safe_creado','roles_desplegado','reglas_aprobadas','activo','disolviendo','disuelto')),
  simulacion boolean NOT NULL DEFAULT true,
  safe text UNIQUE, roles text UNIQUE,
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
  version int NOT NULL,
  estado text NOT NULL CHECK (estado IN ('esperando_firmas','activo','pausado','requiere_reaprobacion','terminado','cancelado')),
  firmas jsonb NOT NULL DEFAULT '[]'
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

**Responsables:** una regla de aplicación, con test, mantiene exactamente tres activos después de la creación.

**`grupos.simulacion`:** `true` por defecto. Queda en `false` solo si Maxi lo cambia por script después de confirmar a tres personas independientes (D16.20). La web muestra "Grupo de prueba" mientras sea `true`.

## Acceso

**Sesión con firma (SIWE, `viem/siwe`):**

1. `POST /api/sesion/desafio` guarda un nonce de un solo uso, con 10 minutos de vigencia.
2. La billetera firma el mensaje con dominio, `chainId` 42220 y nonce.
3. `POST /api/sesion` verifica con `verifySiweMessage` en un cliente público, para aceptar también billeteras de contrato, y marca el desafío como usado.
4. Cookie `httpOnly`, `Secure`, `SameSite=Lax`, 7 días, con cuerpo `{ wallet, vence }` y HMAC-SHA256 con `SESSION_SECRET`.

Sin `SESSION_SECRET` de al menos 32 bytes, la web no arranca fuera de `next dev`.

**Invitaciones:** token de 32 bytes aleatorios, y en la base solo su SHA-256. Vence a los 14 días y es de un solo uso.

## API

Next.js Route Handlers en `apps/web/src/app/api/`. Entradas con zod `.strict()`. Errores como `{ codigo, mensaje }` en español. Las rutas nunca reciben ni devuelven claves.

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

**Autorización:** cada ruta comprueba rol y baja contra la base, **y** para las de responsable, que la wallet sea dueña según `getOwners()`. Si difieren, gana la cadena y se avisa.

**`GET /api/grupos/:id`** da nombres solo a integrantes activos. **Salir** borra el nombre, deja `Ex integrante` y conserva los movimientos.

**Límites operativos:** aportes de más de `APORTE_MAXIMO_UI` no se arman. Pasar `OBJETIVO_GRUPO` genera un aviso, y la web lo muestra como aviso y no como garantía.

## Criterios de aceptación (CI, con PGlite)

| ID | Debe pasar |
|---|---|
| S3-1 | Las migraciones corren desde cero y un segundo intento no hace nada |
| S3-2 | No se pueden tener dos propuestas `pendiente` en un grupo, incluso en concurrencia. Sí pueden convivir una propuesta y su cancelación, con el mismo `nonce` |
| S3-3 | SIWE: nonce reutilizado, vencido, otro dominio y otra red rechazados |
| S3-4 | Cookie alterada rechazada; sin secreto, no arranca |
| S3-5 | Invitación usada dos veces o vencida rechazada; en la base no está el token |
| S3-6 | Matriz de autorización: cada ruta con público, otro grupo, integrante y responsable |
| S3-7 | Responsable en la base y no en la cadena: rechazado |
| S3-8 | `POST /api/tx` no cambia estados |
| S3-9 | Cancelar no marca `cancelada` hasta que el lector ve la ejecución |
| S3-10 | Nombre borrado al salir; responsable sin reemplazo no puede salir |
| S3-11 | Ninguna respuesta contiene `token_hash`, `SESSION_SECRET` o datos de otro grupo |
| S3-12 | `GET /api/bitacora` no expone nombres, alias ni wallets |
| S3-13 | Entradas con campos de más rechazadas (`.strict()`) |
