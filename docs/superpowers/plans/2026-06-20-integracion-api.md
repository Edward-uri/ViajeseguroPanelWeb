# Integración API + UX — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the Admin panel to the real ViajeSeguro API (JWT auth + admin review endpoints), with centralized config/routes, one-use-case-per-file services, types in dedicated files, an extensible sidebar, and professional UX feedback (loading/empty/error states + Sileo toasts).

**Architecture:** A framework-agnostic HTTP client (`shared/api/http.ts`) with Bearer auth + single-flight 401 refresh feeds tiny per-use-case functions (`features/<x>/api/<useCase>.ts`) that each map a backend DTO to a clean UI model. A `shared/auth` store (localStorage) holds the session; `AuthProvider`/`RequireAuth` gate routes. Viewmodels expose `{ data, isLoading, error, retry }` and trigger toasts on actions. The mock layer is removed.

**Tech Stack:** React 19, React Router 7, Tailwind 4, TypeScript, Vite, `sileo` (toasts).

**Spec:** `docs/superpowers/specs/2026-06-20-integracion-api-arquitectura.md`

## Global Constraints

- **DO NOT run `git commit`** — the user versions manually. Skip all commit steps.
- **No test runner.** Verify each task with `npx tsc -b --noEmit` and `npm run lint`; run `npm run build` at milestones. The user does manual end-to-end testing with their admin account.
- **Types/interfaces live in dedicated `*.types.ts` files** — never declared inside a `.tsx`. `.tsx` files use `import type`. Component `Props` go in a sibling `<Component>.types.ts`.
- **All route paths come from `src/routes/paths.ts`**; sidebar nav from `src/routes/navigation.tsx`; SVG icons are components in `src/shared/icons/`.
- **One use case per file** under `features/<x>/api/`; each function maps DTO→UI model and returns a clean model (viewmodels never see raw DTOs).
- **Config:** base URL from `import.meta.env.VITE_API_URL` (+ `VITE_API_PREFIX`), with `http://localhost:3005` / `/api` defaults.
- **Sileo** pinned exactly `sileo@0.1.5` (canonical package by `hiaaryan`). Single alerts layer.
- Font/style conventions unchanged: `style={{ fontFamily: 'var(--font-family-jakarta)' }}`, Tailwind tokens.

## Backend contract (exact shapes used by this plan)

```
POST /auth/login/start    body {correo}                         -> 202 {message}
POST /auth/login/verify   body {correo, codigo(/^\d{4}$/)}      -> 200 SessionResponse
POST /auth/refresh        body {refreshToken}                   -> 200 {accessToken, refreshToken}
POST /auth/logout         body {refreshToken}                   -> 200 {message}
GET  /users/me                                                  -> 200 {data: PublicUser}
GET  /municipios                                                -> 200 {data: Municipio[]}   (Municipio {idMunicipio,nombre,estado})
GET  /admin/conductores/pendientes  -> {data: [{idConductor:number, nombre, telefono, documentosPendientes:number}]}
GET  /admin/conductores/{id}        -> OnboardingConductor {estadoVerificacion, licencia:{numero,expedicion,vence}|null, requeridos:string[], documentos: DocItem[]}
PATCH/admin/documentos/{id}         body {estado:'aprobado'} | {estado:'rechazado', motivoRechazo(3..500)} -> {documento: DocItem, estadoVerificacion}
GET  /admin/documentos/{id}/archivo -> binary (image)
GET  /admin/vehiculos/pendientes    -> {data: [{idVehiculo:number, placa, propietario, telefono, documentosPendientes:number}]}
GET  /admin/vehiculos/{id}          -> VehiculoDetalle {idVehiculo, placa, modelo, color, anio, idMunicipio, estadoVerificacion, requeridos, opcionales, documentos: DocItem[]}
PATCH/admin/vehiculos/documentos/{id} body (same oneOf) -> {documento: DocItem, estadoVerificacion}
GET  /admin/vehiculos/documentos/{id}/archivo -> binary

PublicUser {idUsuario:number, telefono, correoElectronico:string|null, rol:'pasajero'|'conductor'|'propietario'|'admin', estadoCuenta:'activo'|'suspendido'|'eliminado', telefonoVerificado:boolean, idMunicipio:number|null, fotoPerfilUrl:string|null, fechaRegistro:string|null}
SessionResponse {accessToken, refreshToken, user: PublicUser}
DocItem {tipo:string, estado:'pendiente'|'aprobado'|'rechazado'|'faltante', idDocumento:number|null, motivoRechazo:string|null}
ErrorResponse {error:{code:string, message:string, details?}}
```

---

## Phase A — Config, errors, HTTP client

### Task 1: Env config + Vite env types

**Files:**
- Create: `.env.example`, `.env`
- Create: `src/env.d.ts`
- Create: `src/shared/api/config.ts`

**Interfaces:**
- Produces: `apiConfig.baseUrl: string`

- [ ] **Step 1: `.env.example` and `.env`**

Both files contain:
```
VITE_API_URL=http://localhost:3005
VITE_API_PREFIX=/api
```

- [ ] **Step 2: `src/env.d.ts`** (type the env vars)
```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_API_PREFIX?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

- [ ] **Step 3: `src/shared/api/config.ts`**
```ts
const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3005'
const prefix = import.meta.env.VITE_API_PREFIX ?? '/api'

export const apiConfig = {
  baseUrl: `${base.replace(/\/$/, '')}${prefix}`,
} as const
```

- [ ] **Step 4: Verify** — `npx tsc -b --noEmit` → PASS.

---

### Task 2: Session types + auth store

**Files:**
- Create: `src/shared/auth/session.types.ts`
- Create: `src/shared/auth/authStore.ts`

**Interfaces:**
- Produces: types `Rol`, `EstadoCuenta`, `AuthUser`, `Session`; `authStore` with `get()`, `getAccessToken()`, `getRefreshToken()`, `set(Session)`, `setTokens(a,r)`, `setUser(AuthUser)`, `clear()`, `subscribe(fn)=>unsub`.

- [ ] **Step 1: `session.types.ts`**
```ts
export type Rol = 'pasajero' | 'conductor' | 'propietario' | 'admin'
export type EstadoCuenta = 'activo' | 'suspendido' | 'eliminado'

export interface AuthUser {
  idUsuario: number
  telefono: string
  correoElectronico: string | null
  rol: Rol
  estadoCuenta: EstadoCuenta
  telefonoVerificado: boolean
  idMunicipio: number | null
  fotoPerfilUrl: string | null
  fechaRegistro: string | null
}

export interface Session {
  accessToken: string
  refreshToken: string
  user: AuthUser
}
```

- [ ] **Step 2: `authStore.ts`**
```ts
import type { AuthUser, Session } from './session.types'

const KEY = 'viajeseguro.session'
const listeners = new Set<() => void>()

function load(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

let session: Session | null = load()

function persist() {
  if (session) localStorage.setItem(KEY, JSON.stringify(session))
  else localStorage.removeItem(KEY)
  listeners.forEach((l) => l())
}

export const authStore = {
  get: () => session,
  getAccessToken: () => session?.accessToken ?? null,
  getRefreshToken: () => session?.refreshToken ?? null,
  set(next: Session) { session = next; persist() },
  setTokens(accessToken: string, refreshToken: string) {
    if (!session) return
    session = { ...session, accessToken, refreshToken }
    persist()
  },
  setUser(user: AuthUser) {
    if (!session) return
    session = { ...session, user }
    persist()
  },
  clear() { session = null; persist() },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l) } },
}
```

- [ ] **Step 3: Verify** — `npx tsc -b --noEmit` → PASS.

---

### Task 3: Error types + HTTP client

**Files:**
- Create: `src/shared/api/errors.types.ts`
- Create: `src/shared/api/errors.ts`
- Create: `src/shared/api/http.ts`

**Interfaces:**
- Consumes: `apiConfig` (Task 1), `authStore` (Task 2).
- Produces: `ApiError` class, `friendlyMessage(unknown): string`, `request<T>(path, opts?): Promise<T>`, `requestBlobUrl(path): Promise<string>`.

- [ ] **Step 1: `errors.types.ts`**
```ts
export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown }
}
```

- [ ] **Step 2: `errors.ts`**
```ts
export class ApiError extends Error {
  code: string
  status: number
  details?: unknown
  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

const MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Revisa los datos e inténtalo de nuevo.',
  UNAUTHORIZED: 'Tu sesión expiró. Inicia de nuevo.',
  FORBIDDEN: 'Esta cuenta no tiene acceso al panel.',
  NOT_FOUND: 'No se encontró el recurso solicitado.',
  OTP_INVALID: 'El código es incorrecto.',
  OTP_EXPIRED: 'El código expiró. Solicita uno nuevo.',
  RATE_LIMITED: 'Demasiados intentos. Espera un momento.',
}

export function friendlyMessage(e: unknown): string {
  if (e instanceof ApiError) return MESSAGES[e.code] ?? e.message ?? 'Ocurrió un error.'
  if (e instanceof TypeError) return 'No se pudo conectar con el servidor.'
  return 'Ocurrió un error inesperado.'
}
```

- [ ] **Step 3: `http.ts`** (Bearer + single-flight refresh + JSON/blob)
```ts
import { apiConfig } from './config'
import { authStore } from '../auth/authStore'
import { ApiError } from './errors'
import type { ApiErrorBody } from './errors.types'

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

let refreshing: Promise<boolean> | null = null

async function doRefresh(): Promise<boolean> {
  const rt = authStore.getRefreshToken()
  if (!rt) return false
  try {
    const res = await fetch(`${apiConfig.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { accessToken: string; refreshToken: string }
    authStore.setTokens(data.accessToken, data.refreshToken)
    return true
  } catch {
    return false
  }
}

function buildInit(opts: RequestOptions): RequestInit {
  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (opts.auth !== false) {
    const token = authStore.getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  }
}

async function send(path: string, opts: RequestOptions): Promise<Response> {
  let res = await fetch(`${apiConfig.baseUrl}${path}`, buildInit(opts))
  if (res.status === 401 && opts.auth !== false && authStore.getRefreshToken()) {
    refreshing = refreshing ?? doRefresh()
    const ok = await refreshing
    refreshing = null
    if (ok) res = await fetch(`${apiConfig.baseUrl}${path}`, buildInit(opts))
    else authStore.clear()
  }
  return res
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await send(path, opts)
  if (res.status === 204) return undefined as T
  const text = await res.text()
  const json: unknown = text ? JSON.parse(text) : undefined
  if (!res.ok) {
    const body = json as ApiErrorBody | undefined
    throw new ApiError(body?.error?.code ?? 'UNKNOWN', body?.error?.message ?? res.statusText, res.status, body?.error?.details)
  }
  return json as T
}

export async function requestBlobUrl(path: string): Promise<string> {
  const res = await send(path, { auth: true })
  if (!res.ok) throw new ApiError('FILE_ERROR', 'No se pudo cargar el archivo.', res.status)
  return URL.createObjectURL(await res.blob())
}
```

- [ ] **Step 4: Verify** — `npx tsc -b --noEmit` → PASS.

---

### Task 4: Centralized endpoints

**Files:**
- Create: `src/shared/api/endpoints.ts`

**Interfaces:**
- Produces: `endpoints` (all paths; functions for parameterized ones).

- [ ] **Step 1: `endpoints.ts`**
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

- [ ] **Step 2: Verify** — `npx tsc -b --noEmit` → PASS.

---

## Phase B — Domain types + auth use cases + provider/guard

### Task 5: UI domain types + document label helper

**Files:**
- Create: `src/shared/data/document.types.ts`, `driver.types.ts`, `vehicle.types.ts`, `queue.types.ts`
- Create: `src/shared/data/documentLabel.ts`
- Replace: `src/shared/data/index.ts` (barrel)
- Delete: `src/shared/data/seed.ts`, `mockStore.ts`, `reviewService.ts`, `vehicleService.ts`, `documentService.ts`, `types.ts`

**Interfaces:**
- Produces: `DocumentStatus`, `VerificationStatus`, `ReviewDocument`, `DriverLicense`, `DriverDetail`, `VehicleDetail`, `DriverQueueItem`, `VehicleQueueItem`, `QueueStats`, `documentLabel(tipo)`.

- [ ] **Step 1: `document.types.ts`**
```ts
export type DocumentStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'faltante'
export type VerificationStatus = 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'

export interface ReviewDocument {
  idDocumento: number | null
  tipo: string
  label: string
  status: DocumentStatus
  optional: boolean
  motivoRechazo: string | null
}
```

- [ ] **Step 2: `driver.types.ts`**
```ts
import type { ReviewDocument, VerificationStatus } from './document.types'

export interface DriverLicense {
  numero: string
  expedicion: string | null
  vence: string | null
}

export interface DriverDetail {
  idConductor: number
  estadoVerificacion: VerificationStatus
  licencia: DriverLicense | null
  documentos: ReviewDocument[]
}
```

- [ ] **Step 3: `vehicle.types.ts`**
```ts
import type { ReviewDocument, VerificationStatus } from './document.types'

export interface VehicleDetail {
  idVehiculo: number
  placa: string
  modelo: string | null
  color: string | null
  anio: number | null
  idMunicipio: number
  estadoVerificacion: VerificationStatus
  documentos: ReviewDocument[]
}
```

- [ ] **Step 4: `queue.types.ts`**
```ts
export interface DriverQueueItem {
  idConductor: number
  nombre: string
  telefono: string
  documentosPendientes: number
}

export interface VehicleQueueItem {
  idVehiculo: number
  placa: string
  propietario: string
  telefono: string
  documentosPendientes: number
}

export interface QueueStats {
  inQueue: number
  pendingDocs: number
}
```

- [ ] **Step 5: `documentLabel.ts`**
```ts
const LABELS: Record<string, string> = {
  licencia: 'Licencia de conducir',
  ine_frente: 'INE (frente)',
  ine_reverso: 'INE (reverso)',
  tarjeta_circulacion: 'Tarjeta de circulación',
  foto_vehiculo: 'Foto del vehículo',
  permiso_municipal: 'Permiso/concesión municipal',
}

export function documentLabel(tipo: string): string {
  return LABELS[tipo] ?? tipo
}
```

- [ ] **Step 6: barrel `index.ts`**
```ts
export * from './document.types'
export * from './driver.types'
export * from './vehicle.types'
export * from './queue.types'
export { documentLabel } from './documentLabel'
```

- [ ] **Step 7: Delete the mock files** (filesystem delete, not git): `seed.ts`, `mockStore.ts`, `reviewService.ts`, `vehicleService.ts`, `documentService.ts`, `types.ts` under `src/shared/data/`.

- [ ] **Step 8: Verify** — `npx tsc -b --noEmit` will FAIL here because the old viewmodels still import the deleted services. That is expected; those imports are replaced in Phase D/E. Confirm the only errors are "cannot find module '../../../shared/data'" style from `features/review`, `features/vehicles`, `features/drivers`. Do NOT fix them in this task.

---

### Task 6: Auth use cases

**Files:**
- Create: `src/features/auth/api/loginStart.ts`, `loginVerify.ts`, `refreshSession.ts`, `logout.ts`, `getMe.ts`

**Interfaces:**
- Consumes: `request` (Task 3), `endpoints` (Task 4), `Session`/`AuthUser` (Task 2).
- Produces: `loginStart(correo): Promise<void>`, `loginVerify(correo, codigo): Promise<Session>`, `logout(refreshToken): Promise<void>`, `getMe(): Promise<AuthUser>`.

- [ ] **Step 1: `loginStart.ts`**
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function loginStart(correo: string): Promise<void> {
  return request<void>(endpoints.auth.loginStart, { method: 'POST', auth: false, body: { correo } })
}
```

- [ ] **Step 2: `loginVerify.ts`**
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { Session } from '../../../shared/auth/session.types'

export function loginVerify(correo: string, codigo: string): Promise<Session> {
  return request<Session>(endpoints.auth.loginVerify, { method: 'POST', auth: false, body: { correo, codigo } })
}
```

- [ ] **Step 3: `refreshSession.ts`** (thin wrapper; http.ts refreshes internally, but expose for completeness)
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function refreshSession(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  return request(endpoints.auth.refresh, { method: 'POST', auth: false, body: { refreshToken } })
}
```

- [ ] **Step 4: `logout.ts`**
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function logout(refreshToken: string): Promise<void> {
  return request<void>(endpoints.auth.logout, { method: 'POST', body: { refreshToken } })
}
```

- [ ] **Step 5: `getMe.ts`**
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { AuthUser } from '../../../shared/auth/session.types'

export async function getMe(): Promise<AuthUser> {
  const res = await request<{ data: AuthUser }>(endpoints.users.me)
  return res.data
}
```

- [ ] **Step 6: Verify** — `npx tsc -b --noEmit` (ignore the pre-existing Task 5 errors from old viewmodels; these new files must add no new errors).

---

### Task 7: AuthProvider + useAuth + RequireAuth

**Files:**
- Create: `src/features/auth/AuthContext.ts`, `AuthContext.types.ts`
- Create: `src/features/auth/AuthProvider.tsx`
- Create: `src/features/auth/useAuth.ts`
- Create: `src/features/auth/RequireAuth.tsx`

**Interfaces:**
- Consumes: `authStore` (Task 2), `getMe` (Task 6), `Session`/`AuthUser` (Task 2), `paths` (Task 14 — use literal `'/login'` here to avoid ordering; replaced to `paths.login` during Task 14).
- Produces: `<AuthProvider>`, `useAuth(): { user, isAuthenticated, isReady, login(Session), logout() }`, `<RequireAuth>`.

- [ ] **Step 1: `AuthContext.types.ts`**
```ts
import type { AuthUser, Session } from '../../shared/auth/session.types'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isReady: boolean
  login: (session: Session) => void
  logout: () => Promise<void>
}
```

- [ ] **Step 2: `AuthContext.ts`**
```ts
import { createContext } from 'react'
import type { AuthContextValue } from './AuthContext.types'

export const AuthContext = createContext<AuthContextValue | null>(null)
```

- [ ] **Step 3: `AuthProvider.tsx`** (hydrate from store, validate via getMe, expose actions)
```tsx
import { useEffect, useState, type ReactNode } from 'react'
import { authStore } from '../../shared/auth/authStore'
import { getMe } from './api/getMe'
import { logout as logoutRequest } from './api/logout'
import { AuthContext } from './AuthContext'
import type { AuthUser, Session } from '../../shared/auth/session.types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(authStore.get()?.user ?? null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => authStore.subscribe(() => setUser(authStore.get()?.user ?? null)), [])

  useEffect(() => {
    let active = true
    if (!authStore.getAccessToken()) { setIsReady(true); return }
    getMe()
      .then((u) => { if (active) { authStore.setUser(u) } })
      .catch(() => { if (active) authStore.clear() })
      .finally(() => { if (active) setIsReady(true) })
    return () => { active = false }
  }, [])

  const login = (session: Session) => authStore.set(session)
  const logout = async () => {
    const rt = authStore.getRefreshToken()
    if (rt) { try { await logoutRequest(rt) } catch { /* ignore network errors on logout */ } }
    authStore.clear()
  }

  return (
    <AuthContext value={{ user, isAuthenticated: !!user, isReady, login, logout }}>
      {children}
    </AuthContext>
  )
}
```

- [ ] **Step 4: `useAuth.ts`**
```ts
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
```

- [ ] **Step 5: `RequireAuth.tsx`** (gate; wait for isReady; redirect if no session)
```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export function RequireAuth() {
  const { isAuthenticated, isReady } = useAuth()
  if (!isReady) {
    return <div className="flex h-screen w-screen items-center justify-center text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
```

- [ ] **Step 6: Verify** — `npx tsc -b --noEmit` (ignore pre-existing Task 5 viewmodel errors).

---

## Phase C — Toasts (Sileo)

### Task 8: Install Sileo + toast helper + Toaster mount

**Files:**
- Modify: `package.json` (dependency), `src/App.tsx`
- Create: `src/shared/ui/toast.ts`

**Interfaces:**
- Produces: `notify.success(msg)`, `notify.error(msg | unknown)`, `notify.info(msg)`.

- [ ] **Step 1: Install** — `npm install sileo@0.1.5` → confirm it resolves with peer React 19 (if a peer warning appears, it is acceptable; do not use `--force` unless it fails to install).

- [ ] **Step 2: Read Sileo's API** — open `node_modules/sileo/README.md` (or its `dist` types) and confirm the exact export names for the provider component and the `toast` function (the README documents a `<Toaster/>`-style provider and a `toast` object with `success`/`error`/`info`/`warning`). Use the names exactly as the package exports them.

- [ ] **Step 3: `src/shared/ui/toast.ts`** (thin wrapper so the rest of the app never imports Sileo directly — single swap point)
```ts
import { toast } from 'sileo'
import { friendlyMessage } from '../api/errors'

export const notify = {
  success: (message: string) => toast.success(message),
  error: (e: unknown) => toast.error(typeof e === 'string' ? e : friendlyMessage(e)),
  info: (message: string) => toast.info(message),
}
```
> If the package's exported function/method names differ from `toast.success/error/info`, adapt THIS file only and keep the `notify` surface identical.

- [ ] **Step 4: Mount the provider in `src/App.tsx`** alongside the router (exact provider component name per Step 2; shown here as `Toaster`):
```tsx
import { Toaster } from 'sileo'
import { AppRouter } from './routes'

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  )
}

export default App
```

- [ ] **Step 5: Verify** — `npx tsc -b --noEmit` (ignore Task 5 viewmodel errors) and `npm run lint`.

---

## Phase D — Admin use cases (with DTO→UI mapping)

### Task 9: Municipios catalog use case

**Files:**
- Create: `src/shared/api/catalog/municipios.types.ts`, `getMunicipios.ts`

**Interfaces:**
- Produces: `getMunicipioName(id): Promise<string>` (cached map id→nombre).

- [ ] **Step 1: `municipios.types.ts`**
```ts
export interface MunicipioDTO {
  idMunicipio: number
  nombre: string
  estado: string
}
```

- [ ] **Step 2: `getMunicipios.ts`** (cache the catalog in memory; expose a name lookup)
```ts
import { request } from '../http'
import { endpoints } from '../endpoints'
import type { MunicipioDTO } from './municipios.types'

let cache: Map<number, string> | null = null

async function load(): Promise<Map<number, string>> {
  if (cache) return cache
  const res = await request<{ data: MunicipioDTO[] }>(endpoints.catalog.municipios)
  cache = new Map(res.data.map((m) => [m.idMunicipio, m.nombre]))
  return cache
}

export async function getMunicipioName(id: number): Promise<string> {
  try {
    const map = await load()
    return map.get(id) ?? `Municipio #${id}`
  } catch {
    return `Municipio #${id}`
  }
}
```

- [ ] **Step 3: Verify** — `npx tsc -b --noEmit` (ignore Task 5 errors).

---

### Task 10: Review (driver) use cases

**Files:**
- Create: `src/features/review/api/admin.dto.types.ts`
- Create: `src/features/review/api/getDriverQueue.ts`
- Create: `src/features/review/api/getDriverDetail.ts`

**Interfaces:**
- Consumes: `request`, `endpoints`, domain types + `documentLabel` (Task 5).
- Produces: `getDriverQueue(): Promise<{ items: DriverQueueItem[]; stats: QueueStats }>`, `getDriverDetail(id): Promise<DriverDetail>`.

- [ ] **Step 1: `admin.dto.types.ts`**
```ts
export interface DocItemDTO {
  tipo: string
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'faltante'
  idDocumento: number | null
  motivoRechazo: string | null
}

export interface DriverQueueDTO {
  idConductor: number
  nombre: string
  telefono: string
  documentosPendientes: number
}

export interface OnboardingConductorDTO {
  estadoVerificacion: 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'
  licencia: { numero: string; expedicion: string | null; vence: string | null } | null
  requeridos: string[]
  documentos: DocItemDTO[]
}
```

- [ ] **Step 2: `getDriverQueue.ts`** (also derives stats: inQueue = count, pendingDocs = sum)
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { DriverQueueItem, QueueStats } from '../../../shared/data'
import type { DriverQueueDTO } from './admin.dto.types'

export async function getDriverQueue(): Promise<{ items: DriverQueueItem[]; stats: QueueStats }> {
  const res = await request<{ data: DriverQueueDTO[] }>(endpoints.admin.driverQueue)
  const items: DriverQueueItem[] = res.data.map((d) => ({
    idConductor: d.idConductor,
    nombre: d.nombre,
    telefono: d.telefono,
    documentosPendientes: d.documentosPendientes,
  }))
  const stats: QueueStats = {
    inQueue: items.length,
    pendingDocs: items.reduce((acc, i) => acc + i.documentosPendientes, 0),
  }
  return { items, stats }
}
```

- [ ] **Step 3: `getDriverDetail.ts`** (map DocItemDTO → ReviewDocument; optional=false for drivers)
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import { documentLabel } from '../../../shared/data'
import type { DriverDetail, ReviewDocument } from '../../../shared/data'
import type { OnboardingConductorDTO, DocItemDTO } from './admin.dto.types'

function mapDoc(d: DocItemDTO): ReviewDocument {
  return {
    idDocumento: d.idDocumento,
    tipo: d.tipo,
    label: documentLabel(d.tipo),
    status: d.estado,
    optional: false,
    motivoRechazo: d.motivoRechazo,
  }
}

export async function getDriverDetail(id: string | number): Promise<DriverDetail> {
  const dto = await request<OnboardingConductorDTO>(endpoints.admin.driverDetail(id))
  return {
    idConductor: Number(id),
    estadoVerificacion: dto.estadoVerificacion,
    licencia: dto.licencia,
    documentos: dto.documentos.map(mapDoc),
  }
}
```

- [ ] **Step 4: Verify** — `npx tsc -b --noEmit` (ignore Task 5 viewmodel errors).

---

### Task 11: Vehicle use cases

**Files:**
- Create: `src/features/vehicles/api/admin.dto.types.ts`
- Create: `src/features/vehicles/api/getVehicleQueue.ts`
- Create: `src/features/vehicles/api/getVehicleDetail.ts`

**Interfaces:**
- Produces: `getVehicleQueue(): Promise<{ items: VehicleQueueItem[]; stats: QueueStats }>`, `getVehicleDetail(id): Promise<VehicleDetail>`.

- [ ] **Step 1: `admin.dto.types.ts`**
```ts
export interface VehicleDocItemDTO {
  tipo: string
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'faltante'
  idDocumento: number | null
  motivoRechazo: string | null
}

export interface VehicleQueueDTO {
  idVehiculo: number
  placa: string
  propietario: string
  telefono: string
  documentosPendientes: number
}

export interface VehiculoDetalleDTO {
  idVehiculo: number
  placa: string
  modelo: string | null
  color: string | null
  anio: number | null
  idMunicipio: number
  estadoVerificacion: 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'
  requeridos: string[]
  opcionales: string[]
  documentos: VehicleDocItemDTO[]
}
```

- [ ] **Step 2: `getVehicleQueue.ts`**
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { VehicleQueueItem, QueueStats } from '../../../shared/data'
import type { VehicleQueueDTO } from './admin.dto.types'

export async function getVehicleQueue(): Promise<{ items: VehicleQueueItem[]; stats: QueueStats }> {
  const res = await request<{ data: VehicleQueueDTO[] }>(endpoints.admin.vehicleQueue)
  const items: VehicleQueueItem[] = res.data.map((v) => ({
    idVehiculo: v.idVehiculo,
    placa: v.placa,
    propietario: v.propietario,
    telefono: v.telefono,
    documentosPendientes: v.documentosPendientes,
  }))
  const stats: QueueStats = {
    inQueue: items.length,
    pendingDocs: items.reduce((acc, i) => acc + i.documentosPendientes, 0),
  }
  return { items, stats }
}
```

- [ ] **Step 3: `getVehicleDetail.ts`** (optional=true when tipo ∈ opcionales)
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import { documentLabel } from '../../../shared/data'
import type { VehicleDetail, ReviewDocument } from '../../../shared/data'
import type { VehiculoDetalleDTO, VehicleDocItemDTO } from './admin.dto.types'

export async function getVehicleDetail(id: string | number): Promise<VehicleDetail> {
  const dto = await request<VehiculoDetalleDTO>(endpoints.admin.vehicleDetail(id))
  const opcionales = new Set(dto.opcionales)
  const documentos: ReviewDocument[] = dto.documentos.map((d: VehicleDocItemDTO) => ({
    idDocumento: d.idDocumento,
    tipo: d.tipo,
    label: documentLabel(d.tipo),
    status: d.estado,
    optional: opcionales.has(d.tipo),
    motivoRechazo: d.motivoRechazo,
  }))
  return {
    idVehiculo: dto.idVehiculo,
    placa: dto.placa,
    modelo: dto.modelo,
    color: dto.color,
    anio: dto.anio,
    idMunicipio: dto.idMunicipio,
    estadoVerificacion: dto.estadoVerificacion,
    documentos,
  }
}
```

- [ ] **Step 4: Verify** — `npx tsc -b --noEmit` (ignore Task 5 errors).

---

### Task 12: Document review + file use cases

**Files:**
- Create: `src/features/documents/api/reviewDocument.types.ts`
- Create: `src/features/documents/api/approveDriverDocument.ts`, `rejectDriverDocument.ts`, `approveVehicleDocument.ts`, `rejectVehicleDocument.ts`
- Create: `src/features/documents/api/getDriverDocumentFile.ts`, `getVehicleDocumentFile.ts`

**Interfaces:**
- Produces: `approveDriverDocument(id): Promise<void>`, `rejectDriverDocument(id, motivo): Promise<void>`, `approveVehicleDocument(id): Promise<void>`, `rejectVehicleDocument(id, motivo): Promise<void>`, `getDriverDocumentFile(id): Promise<string>`, `getVehicleDocumentFile(id): Promise<string>`.

- [ ] **Step 1: `reviewDocument.types.ts`**
```ts
export type ReviewDecision =
  | { estado: 'aprobado' }
  | { estado: 'rechazado'; motivoRechazo: string }
```

- [ ] **Step 2: `approveDriverDocument.ts`**
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ReviewDecision } from './reviewDocument.types'

export function approveDriverDocument(idDocumento: number): Promise<void> {
  const body: ReviewDecision = { estado: 'aprobado' }
  return request<void>(endpoints.admin.driverDocPatch(idDocumento), { method: 'PATCH', body })
}
```

- [ ] **Step 3: `rejectDriverDocument.ts`**
```ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ReviewDecision } from './reviewDocument.types'

export function rejectDriverDocument(idDocumento: number, motivoRechazo: string): Promise<void> {
  const body: ReviewDecision = { estado: 'rechazado', motivoRechazo }
  return request<void>(endpoints.admin.driverDocPatch(idDocumento), { method: 'PATCH', body })
}
```

- [ ] **Step 4: `approveVehicleDocument.ts`** and **`rejectVehicleDocument.ts`** — identical to Steps 2–3 but using `endpoints.admin.vehicleDocPatch(idDocumento)`:
```ts
// approveVehicleDocument.ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ReviewDecision } from './reviewDocument.types'

export function approveVehicleDocument(idDocumento: number): Promise<void> {
  const body: ReviewDecision = { estado: 'aprobado' }
  return request<void>(endpoints.admin.vehicleDocPatch(idDocumento), { method: 'PATCH', body })
}
```
```ts
// rejectVehicleDocument.ts
import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ReviewDecision } from './reviewDocument.types'

export function rejectVehicleDocument(idDocumento: number, motivoRechazo: string): Promise<void> {
  const body: ReviewDecision = { estado: 'rechazado', motivoRechazo }
  return request<void>(endpoints.admin.vehicleDocPatch(idDocumento), { method: 'PATCH', body })
}
```

- [ ] **Step 5: `getDriverDocumentFile.ts`** and **`getVehicleDocumentFile.ts`**
```ts
// getDriverDocumentFile.ts
import { requestBlobUrl } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function getDriverDocumentFile(idDocumento: number): Promise<string> {
  return requestBlobUrl(endpoints.admin.driverDocFile(idDocumento))
}
```
```ts
// getVehicleDocumentFile.ts
import { requestBlobUrl } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function getVehicleDocumentFile(idDocumento: number): Promise<string> {
  return requestBlobUrl(endpoints.admin.vehicleDocFile(idDocumento))
}
```

- [ ] **Step 6: Verify** — `npx tsc -b --noEmit` (ignore Task 5 errors).

---

## Phase E — Viewmodels (data/loading/error/retry + toasts)

> Shared viewmodel shape for lists/details: `{ data, isLoading, error: string | null, retry() }`. On actions, call the use case, then `notify.success/error`, then refetch.

### Task 13: Rewrite the four admin viewmodels

**Files:**
- Replace: `src/features/review/viewmodels/useReviewQueueViewModel.ts`, `useDriverDetailViewModel.ts`
- Replace: `src/features/vehicles/viewmodels/useVehicleQueueViewModel.ts`, `useVehicleDetailViewModel.ts`

**Interfaces:**
- Consumes: use cases from Tasks 10–12 + `notify` (Task 8) + `getMunicipioName` (Task 9).
- Produces (exact return shapes the views in Phase F rely on):
  - `useReviewQueueViewModel(): { items: DriverQueueItem[]; stats: QueueStats | null; isLoading: boolean; error: string | null; retry(): void }`
  - `useDriverDetailViewModel(id): { detail: DriverDetail | null; isLoading; error; retry; viewerDoc; rejectDoc; openViewer(doc); closeViewer(); openReject(doc); closeReject(); approve(doc); confirmReject(doc, motivo); fileUrl: string | null; fileLoading: boolean }`
  - `useVehicleQueueViewModel(): { items: VehicleQueueItem[]; stats; isLoading; error; retry }`
  - `useVehicleDetailViewModel(id): { detail: VehicleDetail | null; municipio: string; ... same modal/file surface as driver ... }`

- [ ] **Step 1: `useReviewQueueViewModel.ts`**
```ts
import { useCallback, useEffect, useState } from 'react'
import { getDriverQueue } from '../api/getDriverQueue'
import { friendlyMessage } from '../../../shared/api/errors'
import type { DriverQueueItem, QueueStats } from '../../../shared/data'

export function useReviewQueueViewModel() {
  const [items, setItems] = useState<DriverQueueItem[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setIsLoading(true); setError(null)
    getDriverQueue()
      .then(({ items, stats }) => { setItems(items); setStats(stats) })
      .catch((e) => setError(friendlyMessage(e)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { load() }, [load])
  return { items, stats, isLoading, error, retry: load }
}
```

- [ ] **Step 2: `useDriverDetailViewModel.ts`** (detail + modal state + approve/reject with toasts + real file load)
```ts
import { useCallback, useEffect, useState } from 'react'
import { getDriverDetail } from '../api/getDriverDetail'
import { approveDriverDocument } from '../../documents/api/approveDriverDocument'
import { rejectDriverDocument } from '../../documents/api/rejectDriverDocument'
import { getDriverDocumentFile } from '../../documents/api/getDriverDocumentFile'
import { notify } from '../../../shared/ui/toast'
import { friendlyMessage } from '../../../shared/api/errors'
import type { DriverDetail, ReviewDocument } from '../../../shared/data'

export function useDriverDetailViewModel(id: string | undefined) {
  const [detail, setDetail] = useState<DriverDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setIsLoading(true); setError(null)
    getDriverDetail(id)
      .then(setDetail)
      .catch((e) => setError(friendlyMessage(e)))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const openViewer = (doc: ReviewDocument) => {
    setViewerDoc(doc); setFileUrl(null)
    if (doc.idDocumento == null) return
    setFileLoading(true)
    getDriverDocumentFile(doc.idDocumento)
      .then(setFileUrl)
      .catch(() => notify.error('No se pudo cargar el documento.'))
      .finally(() => setFileLoading(false))
  }
  const closeViewer = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl)
    setViewerDoc(null); setFileUrl(null)
  }
  const openReject = (doc: ReviewDocument) => { closeViewer(); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)

  const approve = async (doc: ReviewDocument) => {
    if (doc.idDocumento == null) return
    try { await approveDriverDocument(doc.idDocumento); notify.success('Documento aprobado.'); closeViewer(); load() }
    catch (e) { notify.error(e) }
  }
  const confirmReject = async (doc: ReviewDocument, motivo: string) => {
    if (doc.idDocumento == null) return
    try { await rejectDriverDocument(doc.idDocumento, motivo); notify.success('Documento rechazado.'); setRejectDoc(null); load() }
    catch (e) { notify.error(e) }
  }

  return { detail, isLoading, error, retry: load, viewerDoc, rejectDoc, fileUrl, fileLoading, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
```

- [ ] **Step 3: `useVehicleQueueViewModel.ts`** — mirror of Step 1 using `getVehicleQueue` and `VehicleQueueItem`.
```ts
import { useCallback, useEffect, useState } from 'react'
import { getVehicleQueue } from '../api/getVehicleQueue'
import { friendlyMessage } from '../../../shared/api/errors'
import type { VehicleQueueItem, QueueStats } from '../../../shared/data'

export function useVehicleQueueViewModel() {
  const [items, setItems] = useState<VehicleQueueItem[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setIsLoading(true); setError(null)
    getVehicleQueue()
      .then(({ items, stats }) => { setItems(items); setStats(stats) })
      .catch((e) => setError(friendlyMessage(e)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { load() }, [load])
  return { items, stats, isLoading, error, retry: load }
}
```

- [ ] **Step 4: `useVehicleDetailViewModel.ts`** — mirror of Step 2 using `getVehicleDetail`, `approveVehicleDocument`, `rejectVehicleDocument`, `getVehicleDocumentFile`, plus a `municipio` name resolved via `getMunicipioName(detail.idMunicipio)`:
```ts
import { useCallback, useEffect, useState } from 'react'
import { getVehicleDetail } from '../api/getVehicleDetail'
import { approveVehicleDocument } from '../../documents/api/approveVehicleDocument'
import { rejectVehicleDocument } from '../../documents/api/rejectVehicleDocument'
import { getVehicleDocumentFile } from '../../documents/api/getVehicleDocumentFile'
import { getMunicipioName } from '../../../shared/api/catalog/getMunicipios'
import { notify } from '../../../shared/ui/toast'
import { friendlyMessage } from '../../../shared/api/errors'
import type { VehicleDetail, ReviewDocument } from '../../../shared/data'

export function useVehicleDetailViewModel(id: string | undefined) {
  const [detail, setDetail] = useState<VehicleDetail | null>(null)
  const [municipio, setMunicipio] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setIsLoading(true); setError(null)
    getVehicleDetail(id)
      .then((d) => { setDetail(d); getMunicipioName(d.idMunicipio).then(setMunicipio) })
      .catch((e) => setError(friendlyMessage(e)))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const openViewer = (doc: ReviewDocument) => {
    setViewerDoc(doc); setFileUrl(null)
    if (doc.idDocumento == null) return
    setFileLoading(true)
    getVehicleDocumentFile(doc.idDocumento).then(setFileUrl).catch(() => notify.error('No se pudo cargar el documento.')).finally(() => setFileLoading(false))
  }
  const closeViewer = () => { if (fileUrl) URL.revokeObjectURL(fileUrl); setViewerDoc(null); setFileUrl(null) }
  const openReject = (doc: ReviewDocument) => { closeViewer(); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)

  const approve = async (doc: ReviewDocument) => {
    if (doc.idDocumento == null) return
    try { await approveVehicleDocument(doc.idDocumento); notify.success('Documento aprobado.'); closeViewer(); load() } catch (e) { notify.error(e) }
  }
  const confirmReject = async (doc: ReviewDocument, motivo: string) => {
    if (doc.idDocumento == null) return
    try { await rejectVehicleDocument(doc.idDocumento, motivo); notify.success('Documento rechazado.'); setRejectDoc(null); load() } catch (e) { notify.error(e) }
  }

  return { detail, municipio, isLoading, error, retry: load, viewerDoc, rejectDoc, fileUrl, fileLoading, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
```

- [ ] **Step 5: Verify** — `npx tsc -b --noEmit` (now the Task 5 module errors must be resolved for review/vehicles; remaining errors will be from the VIEWS still using the old shapes — fixed in Phase F).

---

## Phase F — Views, modals, routes, sidebar, auth wiring

### Task 14: Route paths + navigation config + icons

**Files:**
- Create: `src/routes/paths.ts`
- Create: `src/routes/navigation.types.ts`, `src/routes/navigation.tsx`
- Create: `src/shared/icons/QueueIcon.tsx`, `VehicleIcon.tsx`, `DriversIcon.tsx`, `SettingsIcon.tsx`

**Interfaces:**
- Produces: `paths` constants, `navItems: NavItem[]`, icon components.

- [ ] **Step 1: `paths.ts`**
```ts
export const paths = {
  login: '/login',
  verificar: '/verificar',
  revision: '/revision',
  driverDetail: (id: string | number) => `/revision/${id}`,
  vehiculos: '/vehiculos',
  vehicleDetail: (id: string | number) => `/vehiculos/${id}`,
  conductores: '/conductores',
  ajustes: '/ajustes',
} as const
```

- [ ] **Step 2: icon components** — move each SVG from the current `Sidebar.tsx` into its own component. Example `QueueIcon.tsx` (repeat the pattern for `VehicleIcon`, `DriversIcon`, `SettingsIcon` using the SVG paths currently inline in `Sidebar.tsx`):
```tsx
export function QueueIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.75 5.5L19.25 5.5L19.25 17.42L2.75 17.42L2.75 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.75 11.92L19.25 11.92" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
```
(VehicleIcon, DriversIcon, SettingsIcon: copy the corresponding `<svg>` bodies that currently live in `Sidebar.tsx`.)

- [ ] **Step 3: `navigation.types.ts`**
```ts
import type { ReactNode } from 'react'

export interface NavItem {
  label: string
  to: string
  icon: ReactNode
}
```

- [ ] **Step 4: `navigation.tsx`**
```tsx
import { paths } from './paths'
import { QueueIcon } from '../shared/icons/QueueIcon'
import { VehicleIcon } from '../shared/icons/VehicleIcon'
import { DriversIcon } from '../shared/icons/DriversIcon'
import { SettingsIcon } from '../shared/icons/SettingsIcon'
import type { NavItem } from './navigation.types'

export const navItems: NavItem[] = [
  { label: 'Cola de revisión', to: paths.revision, icon: <QueueIcon /> },
  { label: 'Vehículos', to: paths.vehiculos, icon: <VehicleIcon /> },
  { label: 'Conductores', to: paths.conductores, icon: <DriversIcon /> },
  { label: 'Ajustes', to: paths.ajustes, icon: <SettingsIcon /> },
]
```

- [ ] **Step 5: Verify** — `npx tsc -b --noEmit` (view errors from Phase E may remain; new files must add none).

---

### Task 15: Rewrite Sidebar from nav config + real user

**Files:**
- Replace: `src/shared/layouts/Sidebar.tsx`

**Interfaces:**
- Consumes: `navItems` (Task 14), `useAuth` (Task 7), `Logo`.

- [ ] **Step 1: `Sidebar.tsx`** (iterate `navItems`; footer shows the real user)
```tsx
import { NavLink } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { navItems } from '../../routes/navigation'
import { useAuth } from '../../features/auth/useAuth'

export function Sidebar() {
  const { user, logout } = useAuth()
  const initial = (user?.correoElectronico ?? 'A').charAt(0).toUpperCase()
  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-white">
      <div className="flex items-center gap-3 px-6 py-[30px]">
        <Logo size={36} />
        <span className="text-[26px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Jala</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition-colors duration-150 ${
                isActive ? 'bg-sidebar-active font-semibold text-primary' : 'font-medium text-ink hover:bg-surface'
              }`
            }
            style={{ fontFamily: 'var(--font-family-jakarta)' }}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-base font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initial}</div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Administrador</span>
            <span className="truncate text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{user?.correoElectronico ?? ''}</span>
          </div>
          <button onClick={() => { void logout() }} aria-label="Cerrar sesión" className="shrink-0 text-ink-soft hover:text-red" style={{ fontFamily: 'var(--font-family-jakarta)' }}>⎋</button>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Verify** — `npx tsc -b --noEmit`.

---

### Task 16: Routes from config + RequireAuth + AuthProvider mount

**Files:**
- Replace: `src/routes/index.tsx`
- Modify: `src/App.tsx` (wrap with `<AuthProvider>`)

**Interfaces:**
- Consumes: `RequireAuth`, `AuthProvider`, `paths`, all views.

- [ ] **Step 1: `routes/index.tsx`** (private routes from a config list; uses `paths`)
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppLayout } from '../shared/layouts/AppLayout'
import { RequireAuth } from '../features/auth/RequireAuth'
import { LoginView, CodeVerificationView } from '../features/auth'
import { ReviewQueueView, DriverDetailView } from '../features/review'
import { VehicleQueueView, VehicleDetailView } from '../features/vehicles'
import { DriversListView } from '../features/drivers'
import { SettingsView } from '../features/settings'
import { paths } from './paths'

interface PrivateRoute { path: string; element: ReactNode }

const privateRoutes: PrivateRoute[] = [
  { path: paths.revision, element: <ReviewQueueView /> },
  { path: '/revision/:driverId', element: <DriverDetailView /> },
  { path: paths.vehiculos, element: <VehicleQueueView /> },
  { path: '/vehiculos/:vehicleId', element: <VehicleDetailView /> },
  { path: paths.conductores, element: <DriversListView /> },
  { path: paths.ajustes, element: <SettingsView /> },
]

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.login} element={<LoginView />} />
        <Route path={paths.verificar} element={<CodeVerificationView />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            {privateRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>
        </Route>
        <Route path="/" element={<Navigate to={paths.revision} replace />} />
        <Route path="*" element={<Navigate to={paths.login} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: `App.tsx`** (AuthProvider + Toaster)
```tsx
import { Toaster } from 'sileo'
import { AuthProvider } from './features/auth/AuthProvider'
import { AppRouter } from './routes'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
```
> Note: `RequireAuth` uses `useAuth`, which requires `AuthProvider` to wrap the router — satisfied here.

- [ ] **Step 3: Verify** — `npx tsc -b --noEmit`.

---

### Task 17: Wire auth into Login + Code views (real API, email field)

**Files:**
- Replace: `src/features/auth/viewmodels/useLoginViewModel.ts`, `useCodeVerificationViewModel.ts`
- Modify: `src/features/auth/views/LoginView.tsx` (label → "Correo", email validation, toast), `CodeVerificationView.tsx` (pass correo, real verify, toast)

**Interfaces:**
- Consumes: `loginStart`, `loginVerify` (Task 6), `useAuth().login`, `notify`, `paths`.

- [ ] **Step 1: `useLoginViewModel.ts`** (email validation + loginStart)
```ts
import { useCallback, useState } from 'react'
import { loginStart } from '../api/loginStart'
import { notify } from '../../../shared/ui/toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useLoginViewModel() {
  const [correo, setCorreo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isValid = EMAIL_RE.test(correo.trim())

  const sendCode = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      await loginStart(correo.trim())
      notify.success(`Te enviamos un código a ${correo.trim()}`)
      return true
    } catch (e) {
      notify.error(e)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [correo])

  return { correo, setCorreo, isLoading, isValid, sendCode }
}
```

- [ ] **Step 2: `LoginView.tsx`** — use `correo`/`setCorreo`/`isValid`/`sendCode`; label "Correo", `type="email"`, navigate to `paths.verificar` with `state: { correo }`. (Keep the existing split AuthLayout markup; only the field wiring + copy change.)
```tsx
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { InputField } from '../../../shared/components/InputField'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { useLoginViewModel } from '../viewmodels/useLoginViewModel'
import { paths } from '../../../routes/paths'

export function LoginView() {
  const navigate = useNavigate()
  const { correo, setCorreo, isLoading, isValid, sendCode } = useLoginViewModel()

  const handleSubmit = async () => {
    if (!isValid) return
    const ok = await sendCode()
    if (ok) navigate(paths.verificar, { state: { correo } })
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Inicia sesión</h1>
          <p className="text-base text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Ingresa tu correo para recibir un código.</p>
        </div>
        <div className="flex flex-col gap-6">
          <InputField label="Correo" value={correo} onChange={setCorreo} placeholder="admin@jala.local" type="email" disabled={isLoading} />
          <PrimaryButton onClick={handleSubmit} disabled={!isValid} isLoading={isLoading}>Enviar código</PrimaryButton>
        </div>
        <p className="text-center text-sm text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Solo para administradores de Jala.</p>
      </div>
    </AuthLayout>
  )
}
```

- [ ] **Step 3: `useCodeVerificationViewModel.ts`** — keep the 4-digit `code`/`updateDigit`/resend-cooldown surface, but `verifyCode(correo)` calls `loginVerify` and stores the session via `useAuth().login`. Preserve the existing fields the view already uses (`code`, `updateDigit`, `isLoading`, `isComplete`, `canResend`, `countdown`, `resendCode`, `startResendCooldown`) and change only the verify logic:
```ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { loginVerify } from '../api/loginVerify'
import { loginStart } from '../api/loginStart'
import { useAuth } from '../useAuth'
import { notify } from '../../../shared/ui/toast'

export function useCodeVerificationViewModel(correo: string) {
  const { login } = useAuth()
  const [code, setCode] = useState<string[]>(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const timer = useRef<number | null>(null)

  const isComplete = code.every((d) => d !== '')

  const updateDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 1)
    setCode((prev) => prev.map((d, i) => (i === index ? v : d)))
  }

  const startResendCooldown = useCallback(() => {
    setCanResend(false); setCountdown(30)
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { if (timer.current) window.clearInterval(timer.current); setCanResend(true); return 0 }
        return c - 1
      })
    }, 1000)
  }, [])

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current) }, [])

  const verifyCode = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const session = await loginVerify(correo, code.join(''))
      if (session.user.rol !== 'admin') { notify.error('Esta cuenta no tiene acceso al panel.'); return false }
      login(session)
      return true
    } catch (e) { notify.error(e); return false } finally { setIsLoading(false) }
  }, [correo, code, login])

  const resendCode = useCallback(async () => {
    try { await loginStart(correo); notify.info('Código reenviado.'); startResendCooldown() } catch (e) { notify.error(e) }
  }, [correo, startResendCooldown])

  return { code, updateDigit, isLoading, isComplete, canResend, countdown, verifyCode, resendCode, startResendCooldown }
}
```

- [ ] **Step 4: `CodeVerificationView.tsx`** — read `correo` from `location.state`; pass it to the viewmodel; on success navigate to `paths.revision`. Keep the existing dark/markup structure but remove the `error` prop usage (errors now surface via toast). Update the call sites:
```tsx
// key changes only:
// const correo = (location.state as { correo?: string })?.correo ?? ''
// const { code, updateDigit, isLoading, isComplete, canResend, countdown, verifyCode, resendCode, startResendCooldown } = useCodeVerificationViewModel(correo)
// const handleVerify = async () => { if (!isComplete) return; if (await verifyCode()) navigate(paths.revision) }
// subtitle shows {correo}; if no correo, redirect to paths.login
```
Full file: keep the current `CodeVerificationView.tsx` layout, replace the viewmodel call to pass `correo`, drop the `error &&` block, and import `paths`. (The implementer should open the current file and apply these edits.)

- [ ] **Step 5: Verify** — `npx tsc -b --noEmit` and `npm run lint`.

---

### Task 18: Queue views — loading/empty/error states + 2 stats + nav-state

**Files:**
- Replace: `src/features/review/views/ReviewQueueView.tsx`
- Replace: `src/features/vehicles/views/VehicleQueueView.tsx`
- Create: `src/shared/components/QueueState.tsx`, `QueueState.types.ts` (shared loading/empty/error block)

**Interfaces:**
- Consumes: the rewritten queue viewmodels (Task 13), `StatCard`, `StatusBadge`, `Button`, `paths`.

- [ ] **Step 1: `QueueState.types.ts`**
```ts
export interface QueueStateProps {
  isLoading: boolean
  error: string | null
  isEmpty: boolean
  emptyText: string
  onRetry: () => void
}
```

- [ ] **Step 2: `QueueState.tsx`** (renders loading skeleton / error+retry / empty; returns `null` when there's data to show)
```tsx
import { Button } from './Button'
import type { QueueStateProps } from './QueueState.types'

export function QueueState({ isLoading, error, isEmpty, emptyText, onRetry }: QueueStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-bg" />
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white py-12">
        <p className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>Reintentar</Button>
      </div>
    )
  }
  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-border bg-white py-12 text-center text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {emptyText}
      </div>
    )
  }
  return null
}
```

- [ ] **Step 3: `ReviewQueueView.tsx`** — 2 StatCards (En cola, Docs pendientes), `QueueState` for non-data states, table from `items`, "Revisar" navigates with `state` carrying the queue item (for the detail header):
```tsx
import { useNavigate } from 'react-router-dom'
import { useReviewQueueViewModel } from '../viewmodels/useReviewQueueViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { QueueState } from '../../../shared/components/QueueState'
import { paths } from '../../../routes/paths'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function ReviewQueueView() {
  const navigate = useNavigate()
  const { items, stats, isLoading, error, retry } = useReviewQueueViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Cola de revisión" subtitle="Conductores con documentos por revisar" />
      <div className="mb-6 flex gap-4">
        <StatCard value={stats?.inQueue ?? 0} label="En cola" />
        <StatCard value={stats?.pendingDocs ?? 0} label="Docs pendientes" accent="success" />
      </div>
      <QueueState isLoading={isLoading} error={error} isEmpty={items.length === 0} emptyText="No hay conductores con documentos pendientes 🎉" onRetry={retry} />
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {items.map((d) => (
            <div key={d.idConductor} className="flex items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initials(d.nombre)}</span>
                <div>
                  <div className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.nombre}</div>
                  <div className="text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>ID {d.idConductor}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.telefono}</div>
              <div className="w-36"><StatusBadge variant="pendiente">{d.documentosPendientes} pendientes</StatusBadge></div>
              <Button onClick={() => navigate(paths.driverDetail(d.idConductor), { state: { nombre: d.nombre, telefono: d.telefono } })}>Revisar</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: `VehicleQueueView.tsx`** — mirror of Step 3 with `useVehicleQueueViewModel`, fields `placa/propietario/telefono`, the vehicle icon, navigate `paths.vehicleDetail(v.idVehiculo)` with `state: { propietario: v.propietario, telefono: v.telefono }`. (Same structure; replace fields and labels.)

- [ ] **Step 5: Verify** — `npx tsc -b --noEmit` and `npm run lint`.

---

### Task 19: Detail views — nav-state header, real document image, states

**Files:**
- Replace: `src/features/review/views/DriverDetailView.tsx`
- Replace: `src/features/vehicles/views/VehicleDetailView.tsx`
- Modify: `src/features/documents/components/DocumentViewerModal.tsx` + `DocumentViewerModal.types.ts` (accept `fileUrl`/`fileLoading`)
- Modify: `src/features/documents/components/DocumentCard.tsx` (driver/vehicle docs now keyed by `idDocumento`; "Revisar" hidden when `idDocumento == null`)

**Interfaces:**
- Consumes: detail viewmodels (Task 13), `useLocation().state` for header data, `DocumentCard`, modals.

- [ ] **Step 1: `DocumentViewerModal.types.ts`** (Props in its own file, per convention)
```ts
import type { ReviewDocument } from '../../../shared/data'

export interface DocumentViewerModalProps {
  document: ReviewDocument | null
  isOpen: boolean
  fileUrl: string | null
  fileLoading: boolean
  onClose: () => void
  onApprove: (doc: ReviewDocument) => void
  onReject: (doc: ReviewDocument) => void
}
```

- [ ] **Step 2: `DocumentViewerModal.tsx`** — render the real image when `fileUrl` is set (spinner while `fileLoading`, fallback skeleton otherwise); disable Approve when `document.idDocumento == null`. Replace the left `DocumentThumbnail` with:
```tsx
// inside the grid, left cell:
{fileLoading ? (
  <div className="flex h-[320px] items-center justify-center rounded-xl bg-neutral-bg text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
) : fileUrl ? (
  <img src={fileUrl} alt={document.label} className="h-[320px] w-full rounded-xl object-contain bg-neutral-bg" />
) : (
  <DocumentThumbnail uploaded size="large" />
)}
```
Keep the right column (Archivo/Tipo/nota + buttons) but drop the "Subido" row (no upload date in the admin DTO); show `tipo`-derived `label` for "Tipo" and `idDocumento` for "Archivo". Import `DocumentViewerModalProps` from the types file.

- [ ] **Step 3: `DocumentCard.tsx`** — its `ReviewDocument` now has `idDocumento`, `optional`, `status`, `label`, `motivoRechazo`. `uploaded = document.status !== 'faltante'`; show "Revisar" only when `uploaded && document.idDocumento != null`; show the rejection reason when `status === 'rechazado'` (small red text). Move `DocumentCardProps` to `DocumentCard.types.ts`.

- [ ] **Step 4: `DriverDetailView.tsx`** — header name/phone from `location.state` (fallback "Conductor #id"); license card from `detail.licencia`; documents grid from `detail.documentos`; `isLoading`/`error` states; modals wired to the viewmodel (`fileUrl`/`fileLoading` passed to the viewer):
```tsx
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDriverDetailViewModel } from '../viewmodels/useDriverDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'
import { paths } from '../../../routes/paths'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function DriverDetailView() {
  const navigate = useNavigate()
  const { driverId } = useParams()
  const state = (useLocation().state as { nombre?: string; telefono?: string } | null) ?? {}
  const vm = useDriverDetailViewModel(driverId)
  const nombre = state.nombre ?? `Conductor #${driverId}`

  if (vm.isLoading) return <div className="p-8 text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
  if (vm.error || !vm.detail) {
    return (
      <div className="p-8">
        <button onClick={() => navigate(paths.revision)} className="mb-6 text-sm text-ink-soft">‹ Volver a la cola</button>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white py-12">
          <p className="text-sm text-ink-soft">{vm.error ?? 'No se encontró el conductor.'}</p>
          <Button variant="outline" size="sm" onClick={vm.retry}>Reintentar</Button>
        </div>
      </div>
    )
  }
  const d = vm.detail
  return (
    <div className="p-8">
      <button onClick={() => navigate(paths.revision)} className="mb-6 flex items-center gap-2 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>‹ Volver a la cola</button>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initials(nombre)}</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{nombre}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>ID {d.idConductor}{state.telefono ? ` · ${state.telefono}` : ''}</div>
        </div>
      </div>

      {d.licencia && (
        <div className="mb-8 flex gap-12 rounded-2xl border border-border bg-white px-6 py-5">
          <Info label="Número de licencia" value={d.licencia.numero} />
          <Info label="Expedición" value={d.licencia.expedicion ?? '—'} />
          <Info label="Vencimiento" value={d.licencia.vence ?? '—'} />
          <div className="ml-auto self-center text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Licencia de conducir</div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Documentos ({d.documentos.length})</h2>
      <div className="grid grid-cols-3 gap-6">
        {d.documentos.map((doc) => <DocumentCard key={doc.tipo} document={doc} onReview={vm.openViewer} />)}
      </div>

      <DocumentViewerModal document={vm.viewerDoc} isOpen={!!vm.viewerDoc} fileUrl={vm.fileUrl} fileLoading={vm.fileLoading} onClose={vm.closeViewer} onApprove={vm.approve} onReject={vm.openReject} />
      <RejectDocumentModal document={vm.rejectDoc} isOpen={!!vm.rejectDoc} onClose={vm.closeReject} onConfirm={vm.confirmReject} />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{label}</div>
      <div className="text-base font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{value}</div>
    </div>
  )
}
```
> The `Info` helper is a local function component without an interface declared in JSX — its inline params object is allowed (it's not a named `interface`). If preferred for strict consistency, extract `InfoProps` to `DriverDetailView.types.ts`; do the same in the vehicle view.

- [ ] **Step 5: `VehicleDetailView.tsx`** — mirror of Step 4 using `useVehicleDetailViewModel`; header `placa` + `state.propietario`/`state.telefono` (fallback "Vehículo #id"); data card Modelo/Color/Año/Municipio where Municipio = `vm.municipio`; same modals. Back link → `paths.vehiculos`.

- [ ] **Step 6: Verify** — `npx tsc -b --noEmit` and `npm run lint`.

---

### Task 20: Conductores list + Ajustes (real data) + final pass

**Files:**
- Modify: `src/features/drivers/views/DriversListView.tsx` + viewmodel
- Modify: `src/features/settings/views/SettingsView.tsx`

- [ ] **Step 1: Conductores** — there is no "all drivers" admin endpoint; reuse `getDriverQueue` (pending drivers) and present the same table titled "Conductores" / "Conductores con revisión pendiente", with loading/empty/error states (reuse `QueueState`). Rewrite `useDriversListViewModel` to call `getDriverQueue` and return `{ items, isLoading, error, retry }`. "Ver" navigates to `paths.driverDetail(id)` with `state`.
> If a full drivers list endpoint is added later, only this viewmodel changes.

- [ ] **Step 2: Ajustes** — use `useAuth().user` for the profile (email, rol) and `useAuth().logout` for "Cerrar sesión" (navigate to `paths.login` after). Replace the hardcoded admin block.
```tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'
import { useAuth } from '../../auth/useAuth'
import { paths } from '../../../routes/paths'

export function SettingsView() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const handleLogout = async () => { await logout(); navigate(paths.login) }
  const initial = (user?.correoElectronico ?? 'A').charAt(0).toUpperCase()
  return (
    <div className="p-8">
      <PageHeader title="Ajustes" subtitle="Perfil y preferencias" />
      <div className="max-w-xl rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-base font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initial}</span>
          <div>
            <div className="text-base font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{user?.correoElectronico ?? 'Administrador'}</div>
            <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Rol: {user?.rol ?? 'admin'}</div>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <Button variant="dangerOutline" onClick={() => { void handleLogout() }}>Cerrar sesión</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify** — `npx tsc -b --noEmit` and `npm run lint`.

---

## Phase G — Types retrofit + final build

### Task 21: Retrofit existing component Props into `.types.ts`

**Files:**
- For each existing shared/feature component that declares an inline `interface ...Props`, create a sibling `<Component>.types.ts` exporting the interface and change the `.tsx` to `import type`. Components: `Button`, `StatusBadge`, `StatCard`, `PageHeader`, `Modal`, `DocumentThumbnail`, `Logo`, `InputField`, `PrimaryButton`, `CodeInput`, `DocumentCard`, `RejectDocumentModal`.

- [ ] **Step 1**: For each, move the `interface XProps { ... }` (and any local exported type like `BadgeVariant`) to `<Component>.types.ts`; in the `.tsx`, replace the declaration with `import type { XProps } from './<Component>.types'`. Keep `BadgeVariant` exported from `StatusBadge.types.ts` and update its importers (`documentStatus.ts`, `DriversListView.tsx`) to import from the new location.
- [ ] **Step 2: Verify** — `npx tsc -b --noEmit` and `npm run lint` (no behavior change; pure move).

---

### Task 22: Final build + flow checklist

**Files:** none (verification only)

- [ ] **Step 1**: `npx tsc -b --noEmit` → PASS; `npm run lint` → PASS; `npm run build` → PASS.
- [ ] **Step 2**: Start `npm run dev` with the backend running (`VITE_API_URL=http://localhost:3005`). Manual flow (user-driven):
  - `/login` → enter admin email → toast "código enviado" → `/verificar` → enter 4-digit OTP → lands on `/revision`.
  - Refresh the page → still authenticated (localStorage); direct `/` → `/revision`.
  - Queue shows real pending drivers + 2 stats; empty/error states behave.
  - Open a driver → documents load; open a document → real image shows; Approve → toast + badge updates; Reject → reason modal → toast.
  - Vehicles flow analogous; vehicle detail shows municipio name.
  - Ajustes shows the real account; "Cerrar sesión" returns to `/login`.
- [ ] **Step 3**: Fix any issues surfaced, re-run Step 1.

---

## Self-Review (against spec)

- **§2 config centralizado** → Tasks 1, 4. **§3 estructura/use-case-per-file** → Tasks 6, 9–12. **§4 http+refresh** → Task 3. **§5 auth** → Tasks 2, 6, 7, 16, 17. **§6 mapeo + huecos** → Tasks 5, 10, 11 (stats), 18 (nav-state), 13/19 (municipio). **§7 UX/feedback** → Tasks 8 (toasts), 18 (QueueState), 19 (states + real image). **§8 reemplazos** → Tasks 5, 13, 15, 16, 20. **§11 tipos en archivos aparte** → Tasks 5, 7, 18, 19, 21. **§12 navegación/rutas** → Tasks 14, 15, 16.
- **Type consistency:** viewmodel return shapes in Task 13 match exactly what the views in Tasks 18–20 consume (`items`, `stats`, `detail`, `viewerDoc`, `fileUrl`, `fileLoading`, `municipio`, `retry`). DTO types (Tasks 10–12) feed the UI types (Task 5) via the mappers. `endpoints` keys (Task 4) match every use-case import.
- **Ordering note:** Task 5 intentionally leaves the build red until Phase E rewires the viewmodels; every other task ends green (ignoring those known module errors, called out explicitly).
- **No commits**: all tasks verify with tsc/lint/build only.
- **Sileo**: pinned `sileo@0.1.5`; Task 8 reads the package's real export names before use and isolates them behind `notify`.
