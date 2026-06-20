# Integración API + UX — Arquitectura (propuesta)

**Fecha:** 2026-06-20
**Backend:** ViajeSeguro API (NestJS, JWT Bearer). Local `http://localhost:3005`, prod `https://api.codigoverse.space`. Prefijo `/api`.
**Objetivo:** Conectar el Panel Admin a la API real, con configuración centralizada, un caso de uso por archivo, y UX profesional (estados de carga/vacío/error + toasts).

## 0. Principios (lo que pediste)

1. **Una sola fuente para las rutas** — no editar paths regados por el código. El host va en `.env`; todas las rutas viven en UN archivo (`endpoints.ts`).
2. **Un caso de uso por archivo** — nada de "service" gordo con 10 métodos. Cada llamada = un módulo pequeño con una función. Archivos enfocados, fáciles de leer y testear.
3. **UX adecuada para producción** — cada vista maneja *cargando / vacío / error con reintento*; cada acción da feedback (toast de éxito/error); errores del backend se traducen a mensajes claros en español. Sin estados ambiguos.
4. **Vetar librerías antes de añadirlas** — hecho para Sileo (ver §1).

## 1. Librería de alertas: Sileo (aprobada)

`sileo` (toasts para React). Sin scripts de instalación, 1 dependencia (`motion`), MIT, ~90k descargas/mes, compatible React 19 + Vite. Se instala fijada a versión exacta:
```
npm i sileo@0.1.5
```
Se monta su `<Toaster />` una vez en la raíz y se usa `toast.success/error/...` desde cualquier parte. Es la **capa única de alertas** de todo el sistema. (Si en la práctica su API o estabilidad no convence, el reemplazo aislado es `sonner` — pero arrancamos con Sileo.)

## 2. Configuración centralizada

`.env.example` (y `.env` real, ignorado por git):
```
# Host del backend (sin slash final). El prefijo /api y las rutas viven en código.
VITE_API_URL=http://localhost:3005
VITE_API_PREFIX=/api
```
> Nota: poner cada ruta completa como variable de entorno no es type-safe ni práctico. En su lugar, **el host/prefijo es configurable por env** y **todas las rutas están en un único `endpoints.ts`** — así "no modificas rutas después": cambias un solo archivo, con autocompletado y sin redeploy de env.

`src/shared/api/endpoints.ts` — todas las rutas, en un lugar:
```ts
export const endpoints = {
  auth: {
    loginStart: '/auth/login/start',
    loginVerify: '/auth/login/verify',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  users: { me: '/users/me' },
  catalog: { municipios: '/municipios' },
  admin: {
    driverQueue: '/admin/conductores/pendientes',
    driverDetail: (id: string | number) => `/admin/conductores/${id}`,
    driverDocPatch: (id: number) => `/admin/documentos/${id}`,
    driverDocFile: (id: number) => `/admin/documentos/${id}/archivo`,
    vehicleQueue: '/admin/vehiculos/pendientes',
    vehicleDetail: (id: string | number) => `/admin/vehiculos/${id}`,
    vehicleDocPatch: (id: number) => `/admin/vehiculos/documentos/${id}`,
    vehicleDocFile: (id: number) => `/admin/vehiculos/documentos/${id}/archivo`,
  },
} as const
```

## 3. Estructura de carpetas (un caso de uso por archivo)

```
src/shared/api/
  http.ts            # request<T>() + requestBlob(): fetch + headers + auth + refresh + errores
  endpoints.ts       # todas las rutas (arriba)
  errors.ts          # ApiError + traducción de códigos -> mensajes en español
  config.ts          # baseUrl = VITE_API_URL + VITE_API_PREFIX

src/features/auth/api/
  loginStart.ts          # POST /auth/login/start        (correo) -> void
  loginVerify.ts         # POST /auth/login/verify        (correo,codigo) -> Session
  refreshSession.ts      # POST /auth/refresh             (refreshToken) -> Tokens
  logout.ts              # POST /auth/logout              (refreshToken) -> void
  getMe.ts               # GET  /users/me                 -> User
src/features/auth/
  authStore.ts           # singleton de tokens+user, persistido en localStorage, con subscribe
  AuthProvider.tsx       # contexto + useAuth(): user, isAuthenticated, login(), logout()
  RequireAuth.tsx        # guard de rutas (redirige a /login; opcional rol==='admin')

src/features/review/api/
  getDriverQueue.ts      # GET /admin/conductores/pendientes -> DriverQueueItem[]
  getDriverDetail.ts     # GET /admin/conductores/{id}        -> DriverDetail

src/features/vehicles/api/
  getVehicleQueue.ts     # GET /admin/vehiculos/pendientes    -> VehicleQueueItem[]
  getVehicleDetail.ts    # GET /admin/vehiculos/{id}          -> VehicleDetail

src/features/documents/api/
  approveDriverDocument.ts   # PATCH /admin/documentos/{id}          {estado:'aprobado'}
  rejectDriverDocument.ts    # PATCH /admin/documentos/{id}          {estado:'rechazado',motivoRechazo}
  approveVehicleDocument.ts  # PATCH /admin/vehiculos/documentos/{id}
  rejectVehicleDocument.ts   # PATCH /admin/vehiculos/documentos/{id}
  getDriverDocumentFile.ts   # GET  /admin/documentos/{id}/archivo          -> Blob/objectURL
  getVehicleDocumentFile.ts  # GET  /admin/vehiculos/documentos/{id}/archivo -> Blob/objectURL

src/shared/api/catalog/
  getMunicipios.ts       # GET /municipios -> Map<id,nombre> (cache en memoria)
```

Cada archivo de `api/` exporta **una** función `async`, hace la llamada vía `http.ts`, y **mapea el DTO del backend al modelo de UI** ahí mismo (los viewmodels reciben modelos limpios, no DTOs crudos). Se elimina la capa mock (`shared/data/seed.ts`, `mockStore.ts`, `*Service.ts`); los **tipos de dominio** (`shared/data/types.ts`) se conservan y se alinean con la API.

## 4. Cliente HTTP (`http.ts`)

- `request<T>(method, path, { body?, auth?=true, signal? }): Promise<T>`
  - URL = `config.baseUrl + path`.
  - Headers: `Content-Type: application/json`; si `auth`, `Authorization: Bearer <accessToken>` leído del `authStore`.
  - Si `!res.ok`: parsea `ErrorResponse { error: { code, message } }` y lanza `ApiError(code, message, status)`.
  - **Refresh automático**: si una petición autenticada da `401` y hay `refreshToken`, llama `/auth/refresh` **una sola vez** (single-flight: peticiones concurrentes esperan el mismo refresh), actualiza tokens y reintenta. Si el refresh falla → `authStore.clear()` + evento "sesión expirada" → redirige a `/login` con toast.
- `requestBlob(path): Promise<string>` — para los `/archivo` (imágenes de documentos): hace `fetch` con Bearer, devuelve un `objectURL` para `<img src>`. (No se puede poner la URL directa en `<img>` porque requiere header de auth.)
- Vive fuera de React (módulo), así cualquier caso de uso lo usa sin hooks.

## 5. Autenticación

- `authStore.ts`: singleton con `{ accessToken, refreshToken, user }`, persistido en `localStorage` (sigues logueado al recargar), con `subscribe()` para que React reaccione.
- `AuthProvider` + `useAuth()`: al cargar la app, si hay tokens → `getMe()` para hidratar `user` (y detectar expiración → refresh). Expone `login(session)`, `logout()`.
- `RequireAuth`: envuelve las rutas del `AppLayout`; sin sesión → `/login`. Verificación opcional `user.rol === 'admin'` (si no es admin, mensaje "Esta cuenta no tiene acceso al panel" y logout).
- **Flujo login** (mapea a las vistas actuales):
  1. `LoginView` → `loginStart(correo)` → toast "Te enviamos un código a {correo}" → navega a `/verificar`.
  2. `CodeVerificationView` → `loginVerify(correo, codigo)` → guarda sesión en `authStore` → navega a `/revision`.
  3. `Ajustes` → `logout(refreshToken)` → limpia store → `/login`.
- El **código es de 4 dígitos** (coincide con `CodeInput`); el **login es por correo** (la API no acepta teléfono) → el campo cambia a "Correo" (tipo email, con validación de formato).

## 6. Mapeo de modelos (DTO backend → UI) y huecos del contrato

- **Documentos**: `tipo` (string) → etiqueta legible (mapa: `licencia`→"Licencia de conducir", `ine_frente`→"INE (frente)", `ine_reverso`→"INE (reverso)", `tarjeta_circulacion`→"Tarjeta de circulación", `foto_vehiculo`→"Foto del vehículo", `permiso_municipal`→"Permiso/concesión municipal"). `estado` (`pendiente|aprobado|rechazado|faltante`) **coincide exacto** con nuestro `DocumentStatus`. `idDocumento` puede ser `null` (faltantes) → esos no se pueden revisar (la `DocumentCard` ya oculta "Revisar" cuando falta).
- **estadoVerificacion** (`incompleto|en_revision|rechazado|aprobado`) → badge: en_revision→"En revisión", aprobado→"Aprobado", rechazado→"Rechazado", incompleto→"Incompleto" (gris). Añadimos `incompleto` al modelo.
- **Huecos del API (decididos con defaults):**
  1. *Stat "Aprobados/Activados hoy"* no existe en el API → la cola muestra **2 tarjetas** (En cola = nº de filas, Docs pendientes = suma de `documentosPendientes`).
  2. *Detalle no trae nombre/teléfono* (conductor) ni propietario/teléfono (vehículo) → se **llevan desde la cola por `state` de navegación** (`navigate(..., { state })`); si entras directo por URL/recarga, el encabezado cae a un fallback ("Conductor #id") sin romper.
  3. *Vehículo trae `idMunicipio` (número)* → se consulta `/api/municipios` (cacheado en memoria) y se muestra el nombre; si no se encuentra, "Municipio #id".

## 7. UX / Feedback (profesional)

- **Estados por vista** (colas y detalles):
  - *Cargando*: skeletons en filas/tarjetas (no spinners genéricos en blanco).
  - *Vacío*: mensaje claro ("No hay conductores con documentos pendientes 🎉").
  - *Error*: tarjeta con el mensaje + botón **"Reintentar"** (re-fetch). Nunca pantalla en blanco.
- **Acciones (aprobar/rechazar)**: botón en estado `isLoading` mientras corre; al terminar, **toast** de éxito ("Documento aprobado") o error; el doc actualiza su badge y la cola recalcula contadores al volver.
- **Toasts (Sileo)** para: código enviado, login fallido, doc aprobado/rechazado, sesión expirada, error de red ("No se pudo conectar con el servidor"). Tipos success/error/info/warning.
- **Validación de formularios**: correo con formato válido (botón deshabilitado si no); código 4 dígitos; motivo de rechazo 3–500 (ya implementado).
- **Errores del backend → español**: `errors.ts` mapea `error.code` (p. ej. `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, OTP inválido/expirado) a mensajes amigables; fallback genérico si no hay match.
- **Sesión expirada**: interceptor global → toast "Tu sesión expiró, inicia de nuevo" + redirección suave a `/login`.

## 8. Qué se reemplaza / se ajusta de lo existente

- **Se elimina** la capa mock (`shared/data/seed.ts`, `mockStore.ts`, `reviewService.ts`, `vehicleService.ts`, `documentService.ts`, `shared/data/index.ts`).
- **Se conservan/ajustan** los tipos de dominio (`types.ts`) alineados a la API.
- **Viewmodels** pasan a consumir los casos de uso `api/` y a exponer `{ data, isLoading, error, retry }`; manejan toasts en las acciones.
- **Vistas**: colas con 2 stats + estados carga/vacío/error; detalles con header por nav-state + municipio por catálogo; visor de documento muestra la imagen real (objectURL).
- **Sidebar/Ajustes**: muestran el `user` real (correo, inicial) desde `authStore`; Ajustes con logout real.
- **App raíz**: monta `<Toaster/>` (Sileo) y `<AuthProvider>`; rutas privadas envueltas en `<RequireAuth>`.

## 9. Decisiones a confirmar

- ¿OK host+prefijo en `.env` y **todas las rutas en `endpoints.ts`** (no rutas crudas en env)?  [recomendado]
- ¿OK **localStorage** para la sesión + refresh automático?  [recomendado]
- ¿OK los 3 *defaults* de los huecos del API (§6: 2 stats, header por nav-state, municipio por catálogo)?
- ¿Arrancamos con **Sileo** como capa única de alertas?  [aprobada en §1]

## 10. Orden de implementación (cuando apruebes)

1. `.env.example` + `config.ts` + `endpoints.ts` + `errors.ts` + `http.ts` (con refresh).
2. Auth: `authStore` + casos de uso `auth/api/*` + `AuthProvider` + `RequireAuth`; cablear Login/Código/logout.
3. Instalar Sileo + montar `<Toaster/>` + helper de toasts.
4. Casos de uso admin (review, vehicles, documents, municipios) con su mapeo.
5. Reescribir viewmodels (estados data/loading/error/retry + toasts) y eliminar la capa mock.
6. Ajustar vistas: estados carga/vacío/error, header por nav-state, visor con imagen real, Sidebar/Ajustes con user real.
7. Build verde + repaso de flujos (tú haces las pruebas manuales con tu cuenta admin).

## 11. Convención: tipos e interfaces en archivos aparte

Ninguna `interface`/`type` se declara dentro de un archivo con JSX (`.tsx`). Se separan:
- **Modelos de dominio / DTOs / uniones / enums** → `*.types.ts` en `models/` del feature o en `shared/api/*.types.ts`. Una entidad, un solo lugar; nunca regada en una vista.
- **Props de componentes** → `<Componente>.types.ts` junto al componente; el `.tsx` solo importa el tipo y contiene markup + lógica.
- Los `.tsx` solo hacen `import type { ... }`.

Aplica al código nuevo y se **retrofitea lo existente** (Button, StatusBadge, StatCard, PageHeader, Modal, DocumentThumbnail, DocumentCard, los modales, etc. mueven su `*Props` a un `.types.ts` hermano) para que el repo quede consistente.

## 12. Navegación y rutas (extensible)

Centralizado para que añadir una sección sea trivial (un solo lugar):
- `src/routes/paths.ts` — constantes de rutas (`paths.revision`, `paths.driverDetail(id)`, `paths.vehiculos`, `paths.vehicleDetail(id)`, `paths.conductores`, `paths.ajustes`, `paths.login`, `paths.verificar`). **Toda** navegación usa estas constantes, no strings sueltos.
- `src/shared/icons/` — cada ícono SVG como su propio componente (`QueueIcon.tsx`, `VehicleIcon.tsx`, `DriversIcon.tsx`, `SettingsIcon.tsx`, …); fuera del `Sidebar` para no inflarlo, y reutilizables.
- `src/routes/navigation.tsx` + `navigation.types.ts` — **config de navegación** del sidebar como datos: `NavItem[]` (`{ label, to, icon }`). El `Sidebar` solo itera esta config.
- `src/routes/index.tsx` — las rutas privadas se construyen desde una lista `{ path, element }`, envueltas por `RequireAuth` + `AppLayout`.

Añadir una sección nueva = 1 ícono + 1 entrada en `navigation.tsx` + 1 ruta en la lista + 1 constante en `paths.ts`. `Sidebar` y router quedan desacoplados de los detalles.
