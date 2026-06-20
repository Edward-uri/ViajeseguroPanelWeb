# Panel Admin (Web) — Viaje Seguro / Jala — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full "Panel Admin (Web)" document-review experience (review queues, detail screens, approve/reject modals, drivers list, settings) on top of the existing MVVM scaffold, matching the Figma design, backed by a swappable in-memory mock data layer.

**Architecture:** Feature-based MVVM (`features/<x>/{models,viewmodels,views,components,index.ts}`) + `shared/{components,layouts,data}`. Views are presentational and consume `useXViewModel` hooks; viewmodels call `Promise`-returning services that read/write a mutable in-memory `mockStore`. Cross-view freshness comes from each view fetching on mount. Swapping to a real API = rewriting only the `*Service.ts` files.

**Tech Stack:** React 19, React Router 7, Tailwind CSS 4 (`@theme` tokens in `src/index.css`), TypeScript, Vite. No test runner configured — verification is `tsc` typecheck + ESLint + visual comparison against Figma screenshots.

**Spec:** `docs/superpowers/specs/2026-06-16-panel-admin-viaje-seguro-design.md`

**Figma node IDs (page "Panel Admin (Web)"):**
- Login `202:627` · Código `202:665`
- Cola de revisión `202:709` · Detalle conductor `202:799`
- Visor documento `202:925` · Rechazar documento `202:1060`
- Cola de vehículos `218:304` · Detalle vehículo `218:387`
- Logo instance "Logo / Mototaxi Línea" `202:631` (login) / `218:390` (sidebar)

**Conventions (match existing code):**
- Font applied via `style={{ fontFamily: 'var(--font-family-jakarta)' }}` on text nodes.
- Color via Tailwind tokens: `text-ink`, `bg-surface`, `border-border`, `text-primary`, etc.
- Each feature exposes its public views through `index.ts` barrel.

**Verification commands (used throughout):**
- Typecheck: `npx tsc -b --noEmit` → Expected: no errors.
- Lint: `npm run lint` → Expected: no errors.
- Visual: `npm run dev`, open the route, compare against the Figma node with
  `mcp__figma__get_screenshot { nodeId }`. Iterate up to 3 times per screen.

---

## Phase 0 — Foundations

### Task 1: Toolchain check + color tokens

**Files:**
- Modify: `src/index.css` (add tokens in `@theme`)

- [ ] **Step 1: Ensure dependencies are installed and dev server runs**

Run: `npm install` then `npm run dev`
Expected: Vite starts, app serves at `http://localhost:5173` (or shown port). Stop the server after confirming.

- [ ] **Step 2: Add the missing badge tokens to `@theme` in `src/index.css`**

Insert after `--color-sidebar-active: #FFF1E0;`:

```css
  --color-danger-bg: #FBE7E0;
  --color-neutral-bg: #F0EFEE;
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: PASS (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "chore: add danger-bg and neutral-bg badge tokens"
```

---

### Task 2: Export logo + `Logo` shared component

**Files:**
- Create: `src/assets/logo-jala.svg`
- Create: `src/shared/components/Logo.tsx`

- [ ] **Step 1: Export the logo vector from Figma**

Call `mcp__figma__get_design_context` with `{ nodeId: "202:631", dirForAssetWrites: "<abs>/src/assets" }`.
From the returned reference code, extract the SVG markup for the "Mototaxi Línea" logo and save it
as `src/assets/logo-jala.svg`. The artwork is an orange line-drawing of a mototaxi (tuk-tuk).
If the tool writes a file directly, rename/move it to `src/assets/logo-jala.svg`.

- [ ] **Step 2: Create the `Logo` component**

```tsx
// src/shared/components/Logo.tsx
import logoUrl from '../../assets/logo-jala.svg'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 36, className }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Jala"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/assets/logo-jala.svg src/shared/components/Logo.tsx
git commit -m "feat: export Jala logo and add Logo component"
```

---

## Phase 1 — Shared UI primitives

### Task 3: `Button` component (variants)

**Files:**
- Create: `src/shared/components/Button.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/shared/components/Button.tsx
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'success' | 'danger' | 'outline' | 'dangerOutline' | 'ghost'
type ButtonSize = 'sm' | 'md'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  isLoading?: boolean
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:brightness-105',
  success: 'bg-success text-white hover:brightness-105',
  danger: 'bg-red text-white hover:brightness-105',
  outline: 'border border-primary bg-white text-primary hover:bg-sidebar-active',
  dangerOutline: 'border border-red bg-white text-red hover:bg-danger-bg',
  ghost: 'bg-transparent text-ink hover:bg-surface',
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFamily: 'var(--font-family-jakarta)' }}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
```

- [ ] **Step 2: Typecheck** → `npx tsc -b --noEmit` → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/components/Button.tsx
git commit -m "feat: add Button component with variants"
```

---

### Task 4: `StatusBadge` component

**Files:**
- Create: `src/shared/components/StatusBadge.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/shared/components/StatusBadge.tsx
import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'en_revision' | 'pendiente' | 'aprobado' | 'rechazado'
  | 'faltante' | 'opcional' | 'neutral'

interface StatusBadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

const styles: Record<BadgeVariant, string> = {
  en_revision: 'bg-warning-bg text-warning',
  pendiente: 'bg-warning-bg text-warning',
  aprobado: 'bg-success-bg text-success',
  rechazado: 'bg-danger-bg text-red',
  faltante: 'bg-danger-bg text-red',
  opcional: 'bg-neutral-bg text-ink-soft',
  neutral: 'bg-neutral-bg text-ink-soft',
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}
      style={{ fontFamily: 'var(--font-family-jakarta)' }}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 2: Typecheck** → `npx tsc -b --noEmit` → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/components/StatusBadge.tsx
git commit -m "feat: add StatusBadge component"
```

---

### Task 5: `StatCard` component

**Files:**
- Create: `src/shared/components/StatCard.tsx`

- [ ] **Step 1: Create the component** (left colored border, big number, label — see Figma `202:709`)

```tsx
// src/shared/components/StatCard.tsx
interface StatCardProps {
  value: number | string
  label: string
  accent?: 'primary' | 'success'
}

export function StatCard({ value, label, accent = 'primary' }: StatCardProps) {
  const borderColor = accent === 'success' ? 'border-l-success' : 'border-l-primary'
  return (
    <div
      className={`flex-1 rounded-xl border border-border border-l-4 ${borderColor} bg-white px-5 py-4`}
    >
      <div className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {value}
      </div>
      <div className="mt-1 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {label}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/components/StatCard.tsx
git commit -m "feat: add StatCard component"
```

---

### Task 6: `PageHeader` component

**Files:**
- Create: `src/shared/components/PageHeader.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/shared/components/PageHeader.tsx
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/components/PageHeader.tsx
git commit -m "feat: add PageHeader component"
```

---

### Task 7: `Modal` accessible base

**Files:**
- Create: `src/shared/components/Modal.tsx`

- [ ] **Step 1: Create the component** (portal, Esc to close, overlay click, scroll lock, `role="dialog"`, `aria-modal`, focus first focusable / restore focus on close)

```tsx
// src/shared/components/Modal.tsx
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  labelledById?: string
  size?: 'md' | 'lg'
}

export function Modal({ isOpen, onClose, children, labelledById, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxW = size === 'lg' ? 'max-w-[860px]' : 'max-w-[520px]'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        tabIndex={-1}
        className={`w-full ${maxW} rounded-2xl bg-white p-6 shadow-2xl outline-none`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/components/Modal.tsx
git commit -m "feat: add accessible Modal base component"
```

---

### Task 8: `DocumentThumbnail` component

**Files:**
- Create: `src/shared/components/DocumentThumbnail.tsx`

- [ ] **Step 1: Create the component** (orange-header skeleton "document" preview when uploaded; "No subido" upload icon otherwise — see cards in Figma `202:799` / `218:387`)

```tsx
// src/shared/components/DocumentThumbnail.tsx
interface DocumentThumbnailProps {
  uploaded: boolean
  size?: 'card' | 'large'
}

export function DocumentThumbnail({ uploaded, size = 'card' }: DocumentThumbnailProps) {
  const height = size === 'large' ? 'h-[320px]' : 'h-[120px]'

  if (!uploaded) {
    return (
      <div className={`flex ${height} flex-col items-center justify-center gap-2 rounded-xl bg-neutral-bg`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-placeholder">
          <path d="M12 16V4M12 4L7 9M12 4l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-xs text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          No subido
        </span>
      </div>
    )
  }

  return (
    <div className={`flex ${height} items-center justify-center rounded-xl bg-neutral-bg p-6`}>
      <div className="w-full max-w-[300px] overflow-hidden rounded-md bg-white shadow-sm">
        <div className="h-3 w-full bg-primary" />
        <div className="flex gap-3 p-4">
          <div className="h-12 w-10 shrink-0 rounded bg-border" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div className="h-2 w-3/4 rounded bg-border" />
            <div className="h-2 w-full rounded bg-border" />
            <div className="h-2 w-2/3 rounded bg-border" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/components/DocumentThumbnail.tsx
git commit -m "feat: add DocumentThumbnail component"
```

---

## Phase 2 — Domain types + mock data layer

### Task 9: Domain types

**Files:**
- Create: `src/shared/data/types.ts`

- [ ] **Step 1: Create the types**

```ts
// src/shared/data/types.ts
export type DocumentStatus = 'aprobado' | 'pendiente' | 'rechazado' | 'faltante'
export type ReviewStatus = 'en_revision' | 'aprobado' | 'rechazado'
export type DocumentKind =
  | 'licencia' | 'ine_frente' | 'ine_reverso'
  | 'tarjeta_circulacion' | 'foto_vehiculo' | 'permiso_municipal'

export interface ReviewDocument {
  id: string
  kind: DocumentKind
  label: string
  status: DocumentStatus
  optional: boolean
  fileName?: string
  uploadedAt?: string        // display string, e.g. "14 jun 2026, 18:00"
  rejectionReason?: string
}

export interface DriverLicense {
  number: string
  issuedAt: string           // "15/03/2022"
  expiresAt: string          // "15/03/2027"
}

export interface Driver {
  id: string
  name: string
  phone: string
  status: ReviewStatus
  license: DriverLicense
  documents: ReviewDocument[]
}

export interface Vehicle {
  id: string
  plate: string
  model: string
  color: string
  year: number
  municipality: string
  ownerName: string
  ownerPhone: string
  status: ReviewStatus
  documents: ReviewDocument[]
}

export interface QueueStats {
  inQueue: number
  pendingDocs: number
  approvedToday: number      // for vehicles this is "Activados hoy"
}
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/data/types.ts
git commit -m "feat: add domain types for review/vehicles/documents"
```

---

### Task 10: Seed data

**Files:**
- Create: `src/shared/data/seed.ts`

- [ ] **Step 1: Create seed data matching the Figma mockups**

Drivers: Carlos Méndez (ID 12, 9611234567, en_revision, license ABC123456 / 15/03/2022 / 15/03/2027,
5 docs: licencia=aprobado, ine_frente=pendiente, ine_reverso=pendiente, tarjeta_circulacion=pendiente,
foto_vehiculo=faltante) and Ana López (ID 18, 9617654321, en_revision, 1 pending doc). Vehicle:
XYZ-123 (Bajaj RE, Rojo, 2021, Tuxtla Gutiérrez, owner Carlos Méndez / 9611234567, en_revision,
3 docs: tarjeta_circulacion=pendiente, foto_vehiculo=aprobado, permiso_municipal=faltante+optional).

```ts
// src/shared/data/seed.ts
import type { Driver, Vehicle } from './types'

export const seedDrivers: Driver[] = [
  {
    id: '12',
    name: 'Carlos Méndez',
    phone: '9611234567',
    status: 'en_revision',
    license: { number: 'ABC123456', issuedAt: '15/03/2022', expiresAt: '15/03/2027' },
    documents: [
      { id: 'd12-lic', kind: 'licencia', label: 'Licencia de conducir', status: 'aprobado', optional: false, fileName: 'licencia.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-ine-f', kind: 'ine_frente', label: 'INE (frente)', status: 'pendiente', optional: false, fileName: 'ine_frente.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-ine-r', kind: 'ine_reverso', label: 'INE (reverso)', status: 'pendiente', optional: false, fileName: 'ine_reverso.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-tc', kind: 'tarjeta_circulacion', label: 'Tarjeta de circulación', status: 'pendiente', optional: false, fileName: 'tarjeta.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-foto', kind: 'foto_vehiculo', label: 'Foto del vehículo', status: 'faltante', optional: false },
    ],
  },
  {
    id: '18',
    name: 'Ana López',
    phone: '9617654321',
    status: 'en_revision',
    license: { number: 'XYZ987654', issuedAt: '01/06/2023', expiresAt: '01/06/2028' },
    documents: [
      { id: 'd18-lic', kind: 'licencia', label: 'Licencia de conducir', status: 'aprobado', optional: false, fileName: 'licencia.jpg', uploadedAt: '14 jun 2026, 12:00' },
      { id: 'd18-ine-f', kind: 'ine_frente', label: 'INE (frente)', status: 'pendiente', optional: false, fileName: 'ine_frente.jpg', uploadedAt: '14 jun 2026, 12:00' },
    ],
  },
]

export const seedVehicles: Vehicle[] = [
  {
    id: 'XYZ-123',
    plate: 'XYZ-123',
    model: 'Bajaj RE',
    color: 'Rojo',
    year: 2021,
    municipality: 'Tuxtla Gutiérrez',
    ownerName: 'Carlos Méndez',
    ownerPhone: '9611234567',
    status: 'en_revision',
    documents: [
      { id: 'v-xyz-tc', kind: 'tarjeta_circulacion', label: 'Tarjeta de circulación', status: 'pendiente', optional: false, fileName: 'tarjeta.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'v-xyz-foto', kind: 'foto_vehiculo', label: 'Foto del vehículo (placa visible)', status: 'aprobado', optional: false, fileName: 'foto.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'v-xyz-permiso', kind: 'permiso_municipal', label: 'Permiso/concesión municipal', status: 'faltante', optional: true },
    ],
  },
]

export const seedStats = { driverApprovedToday: 8, vehicleActivatedToday: 5 }
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/data/seed.ts
git commit -m "feat: add seed data matching Figma mockups"
```

---

### Task 11: Mock store (singleton)

**Files:**
- Create: `src/shared/data/mockStore.ts`

- [ ] **Step 1: Create a mutable in-memory store with deep-cloned seed and helpers**

```ts
// src/shared/data/mockStore.ts
import type { Driver, Vehicle, ReviewDocument } from './types'
import { seedDrivers, seedVehicles, seedStats } from './seed'

const clone = <T>(v: T): T => structuredClone(v)

interface MockStore {
  drivers: Driver[]
  vehicles: Vehicle[]
  driverApprovedToday: number
  vehicleActivatedToday: number
}

export const store: MockStore = {
  drivers: clone(seedDrivers),
  vehicles: clone(seedVehicles),
  driverApprovedToday: seedStats.driverApprovedToday,
  vehicleActivatedToday: seedStats.vehicleActivatedToday,
}

/** Find a document anywhere (drivers + vehicles); returns the doc and its owner status setter. */
export function findDocument(docId: string): ReviewDocument | undefined {
  for (const d of store.drivers) {
    const found = d.documents.find((x) => x.id === docId)
    if (found) return found
  }
  for (const v of store.vehicles) {
    const found = v.documents.find((x) => x.id === docId)
    if (found) return found
  }
  return undefined
}

export function countPendingDocs(docs: ReviewDocument[]): number {
  return docs.filter((x) => x.status === 'pendiente').length
}
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/data/mockStore.ts
git commit -m "feat: add mutable in-memory mock store"
```

---

### Task 12: Services (review, vehicle, document)

**Files:**
- Create: `src/shared/data/reviewService.ts`
- Create: `src/shared/data/vehicleService.ts`
- Create: `src/shared/data/documentService.ts`
- Create: `src/shared/data/index.ts` (barrel)

- [ ] **Step 1: Create a latency helper + services**

```ts
// src/shared/data/reviewService.ts
import type { Driver, QueueStats } from './types'
import { store, countPendingDocs } from './mockStore'

const delay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const reviewService = {
  getDriverQueue: () =>
    delay(store.drivers.filter((d) => d.status === 'en_revision').map((d) => structuredClone(d))),
  getAllDrivers: () => delay(store.drivers.map((d) => structuredClone(d))),
  getDriverById: (id: string) => delay(structuredClone(store.drivers.find((d) => d.id === id))),
  getDriverQueueStats: (): Promise<QueueStats> => {
    const queue = store.drivers.filter((d) => d.status === 'en_revision')
    return delay({
      inQueue: queue.length,
      pendingDocs: queue.reduce((acc, d) => acc + countPendingDocs(d.documents), 0),
      approvedToday: store.driverApprovedToday,
    })
  },
}
```

```ts
// src/shared/data/vehicleService.ts
import type { Vehicle, QueueStats } from './types'
import { store, countPendingDocs } from './mockStore'

const delay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const vehicleService = {
  getVehicleQueue: () =>
    delay(store.vehicles.filter((v) => v.status === 'en_revision').map((v) => structuredClone(v))),
  getVehicleById: (id: string) => delay(structuredClone(store.vehicles.find((v) => v.id === id))),
  getVehicleQueueStats: (): Promise<QueueStats> => {
    const queue = store.vehicles.filter((v) => v.status === 'en_revision')
    return delay({
      inQueue: queue.length,
      pendingDocs: queue.reduce((acc, v) => acc + countPendingDocs(v.documents), 0),
      approvedToday: store.vehicleActivatedToday,
    })
  },
}
```

```ts
// src/shared/data/documentService.ts
import type { ReviewDocument } from './types'
import { findDocument, store } from './mockStore'

const delay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const documentService = {
  approveDocument: (docId: string): Promise<ReviewDocument> => {
    const doc = findDocument(docId)
    if (!doc) return Promise.reject(new Error('Documento no encontrado'))
    doc.status = 'aprobado'
    doc.rejectionReason = undefined
    store.driverApprovedToday += 1
    return delay(structuredClone(doc))
  },
  rejectDocument: (docId: string, reason: string): Promise<ReviewDocument> => {
    const doc = findDocument(docId)
    if (!doc) return Promise.reject(new Error('Documento no encontrado'))
    doc.status = 'rechazado'
    doc.rejectionReason = reason
    return delay(structuredClone(doc))
  },
}
```

```ts
// src/shared/data/index.ts
export * from './types'
export { reviewService } from './reviewService'
export { vehicleService } from './vehicleService'
export { documentService } from './documentService'
```

- [ ] **Step 2: Typecheck** → `npx tsc -b --noEmit` → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/shared/data/
git commit -m "feat: add mock services for review, vehicles, documents"
```

---

## Phase 3 — Documents feature (shared review pieces)

### Task 13: `DocumentCard` + status helper

**Files:**
- Create: `src/features/documents/models/documentStatus.ts`
- Create: `src/features/documents/components/DocumentCard.tsx`

- [ ] **Step 1: Status → badge variant + label helper**

```ts
// src/features/documents/models/documentStatus.ts
import type { DocumentStatus } from '../../../shared/data/types'
import type { BadgeVariant } from '../../../shared/components/StatusBadge'

export function statusToBadge(status: DocumentStatus, optional: boolean): { variant: BadgeVariant; label: string } {
  switch (status) {
    case 'aprobado': return { variant: 'aprobado', label: 'Aprobado' }
    case 'pendiente': return { variant: 'pendiente', label: 'Pendiente' }
    case 'rechazado': return { variant: 'rechazado', label: 'Rechazado' }
    case 'faltante': return { variant: 'faltante', label: optional ? 'Faltante' : 'Faltante' }
  }
}
```

- [ ] **Step 2: `DocumentCard`** (thumbnail + label + badge(s) + outline "Revisar"; "Revisar" hidden when faltante & no file — see Figma `202:799`/`218:387`)

```tsx
// src/features/documents/components/DocumentCard.tsx
import type { ReviewDocument } from '../../../shared/data/types'
import { DocumentThumbnail } from '../../../shared/components/DocumentThumbnail'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { statusToBadge } from '../models/documentStatus'

interface DocumentCardProps {
  document: ReviewDocument
  onReview: (doc: ReviewDocument) => void
}

export function DocumentCard({ document, onReview }: DocumentCardProps) {
  const uploaded = document.status !== 'faltante'
  const badge = statusToBadge(document.status, document.optional)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <DocumentThumbnail uploaded={uploaded} />
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            {document.label}
          </span>
          <div className="flex gap-2">
            {document.optional && <StatusBadge variant="opcional">Opcional</StatusBadge>}
            <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
          </div>
        </div>
        {uploaded && (
          <Button variant="outline" size="sm" onClick={() => onReview(document)}>Revisar</Button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck** → PASS.
- [ ] **Step 4: Commit**

```bash
git add src/features/documents/
git commit -m "feat: add DocumentCard and status helper"
```

---

### Task 14: `RejectDocumentModal`

**Files:**
- Create: `src/features/documents/components/RejectDocumentModal.tsx`

- [ ] **Step 1: Create the modal** (matches Figma `202:1060`: alert icon + title + doc label, textarea, helper "El conductor verá este motivo · 3–500 caracteres", validation 3–500, Cancelar / Rechazar documento)

```tsx
// src/features/documents/components/RejectDocumentModal.tsx
import { useState, useEffect } from 'react'
import type { ReviewDocument } from '../../../shared/data/types'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'

interface RejectDocumentModalProps {
  document: ReviewDocument | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (doc: ReviewDocument, reason: string) => void
}

export function RejectDocumentModal({ document, isOpen, onClose, onConfirm }: RejectDocumentModalProps) {
  const [reason, setReason] = useState('')
  useEffect(() => { if (isOpen) setReason('') }, [isOpen])

  const valid = reason.trim().length >= 3 && reason.trim().length <= 500

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledById="reject-title" size="md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-danger-bg text-red">!</span>
          <div>
            <h2 id="reject-title" className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
              Rechazar documento
            </h2>
            <p className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
              {document?.label}
            </p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="text-ink-soft">✕</button>
      </div>

      <label className="mt-6 block text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        Motivo del rechazo
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        maxLength={500}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-border bg-white p-3 text-sm text-ink outline-none focus:border-primary"
        style={{ fontFamily: 'var(--font-family-jakarta)' }}
      />
      <p className="mt-2 text-xs text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        El conductor verá este motivo · 3–500 caracteres
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" disabled={!valid} onClick={() => document && onConfirm(document, reason.trim())}>
          Rechazar documento
        </Button>
      </div>
    </Modal>
  )
}
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/features/documents/components/RejectDocumentModal.tsx
git commit -m "feat: add RejectDocumentModal"
```

---

### Task 15: `DocumentViewerModal` + documents barrel

**Files:**
- Create: `src/features/documents/components/DocumentViewerModal.tsx`
- Create: `src/features/documents/index.ts`

- [ ] **Step 1: Create the viewer modal** (matches Figma `202:925`: header label + badge + close; left large preview; right meta Archivo/Subido/Tipo + helper note; Aprobar documento (success) / Rechazar (dangerOutline))

```tsx
// src/features/documents/components/DocumentViewerModal.tsx
import type { ReviewDocument } from '../../../shared/data/types'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { DocumentThumbnail } from '../../../shared/components/DocumentThumbnail'
import { statusToBadge } from '../models/documentStatus'

interface DocumentViewerModalProps {
  document: ReviewDocument | null
  isOpen: boolean
  onClose: () => void
  onApprove: (doc: ReviewDocument) => void
  onReject: (doc: ReviewDocument) => void
}

export function DocumentViewerModal({ document, isOpen, onClose, onApprove, onReject }: DocumentViewerModalProps) {
  if (!document) return null
  const badge = statusToBadge(document.status, document.optional)
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledById="viewer-title" size="lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 id="viewer-title" className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            {document.label}
          </h2>
          <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="text-ink-soft">✕</button>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_300px] gap-6">
        <DocumentThumbnail uploaded size="large" />
        <div className="flex flex-col gap-4">
          <Meta label="Archivo" value={document.fileName ?? '—'} />
          <Meta label="Subido" value={document.uploadedAt ?? '—'} />
          <Meta label="Tipo" value={document.label} />
          <p className="rounded-lg bg-surface p-3 text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            Verifica que los datos sean legibles y coincidan con la licencia antes de aprobar.
          </p>
          <div className="mt-auto flex flex-col gap-3">
            <Button variant="success" fullWidth onClick={() => onApprove(document)}>✓ Aprobar documento</Button>
            <Button variant="dangerOutline" fullWidth onClick={() => onReject(document)}>Rechazar</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{label}</div>
      <div className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{value}</div>
    </div>
  )
}
```

```ts
// src/features/documents/index.ts
export { DocumentCard } from './components/DocumentCard'
export { DocumentViewerModal } from './components/DocumentViewerModal'
export { RejectDocumentModal } from './components/RejectDocumentModal'
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/features/documents/
git commit -m "feat: add DocumentViewerModal and documents barrel"
```

---

## Phase 4 — Review feature (drivers)

### Task 16: Review queue (viewmodel + view)

**Files:**
- Create: `src/features/review/viewmodels/useReviewQueueViewModel.ts`
- Create: `src/features/review/views/ReviewQueueView.tsx`
- Create: `src/features/review/index.ts`

- [ ] **Step 1: Viewmodel** (fetch queue + stats on mount)

```ts
// src/features/review/viewmodels/useReviewQueueViewModel.ts
import { useEffect, useState } from 'react'
import { reviewService, type Driver, type QueueStats } from '../../../shared/data'

export function useReviewQueueViewModel() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([reviewService.getDriverQueue(), reviewService.getDriverQueueStats()]).then(
      ([q, s]) => { if (active) { setDrivers(q); setStats(s); setIsLoading(false) } },
    )
    return () => { active = false }
  }, [])

  return { drivers, stats, isLoading }
}
```

- [ ] **Step 2: View** — Figma `202:709`. Layout: `PageHeader("Cola de revisión", "Conductores con documentos por revisar")`, row of 3 `StatCard` (En cola, Docs pendientes, Aprobados hoy=success accent), then a white rounded table card. Table columns: CONDUCTOR (avatar with initials + name + `ID {id}`), TELÉFONO, DOCS PENDIENTES (`StatusBadge variant="pendiente"` → "{n} pendientes"), ESTADO (`StatusBadge variant="en_revision"` → "En revisión"), and a `Button` "Revisar" → `navigate('/revision/' + driver.id)`. Wrap content in `<div className="p-8">`. Pull exact spacing/column widths from `get_design_context(202:709)`. Helper for initials: first letters of name words, uppercased.

```tsx
// src/features/review/views/ReviewQueueView.tsx  (skeleton — fill exact styles from Figma 202:709)
import { useNavigate } from 'react-router-dom'
import { useReviewQueueViewModel } from '../viewmodels/useReviewQueueViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function ReviewQueueView() {
  const navigate = useNavigate()
  const { drivers, stats } = useReviewQueueViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Cola de revisión" subtitle="Conductores con documentos por revisar" />
      <div className="mb-6 flex gap-4">
        <StatCard value={stats?.inQueue ?? 0} label="En cola" />
        <StatCard value={stats?.pendingDocs ?? 0} label="Docs pendientes" />
        <StatCard value={stats?.approvedToday ?? 0} label="Aprobados hoy" accent="success" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {/* header row + driver rows; see Figma 202:709 for column layout */}
        {drivers.map((d) => {
          const pending = d.documents.filter((x) => x.status === 'pendiente').length
          return (
            <div key={d.id} className="flex items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">{initials(d.name)}</span>
                <div>
                  <div className="text-sm font-semibold text-ink">{d.name}</div>
                  <div className="text-xs text-ink-soft">ID {d.id}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink">{d.phone}</div>
              <div className="w-36"><StatusBadge variant="pendiente">{pending} pendientes</StatusBadge></div>
              <div className="w-32"><StatusBadge variant="en_revision">En revisión</StatusBadge></div>
              <Button onClick={() => navigate(`/revision/${d.id}`)}>Revisar</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

```ts
// src/features/review/index.ts
export { ReviewQueueView } from './views/ReviewQueueView'
export { DriverDetailView } from './views/DriverDetailView'
```

- [ ] **Step 3: Typecheck** (note: `index.ts` references `DriverDetailView` created in Task 17 — if running tasks out of order, comment the second export until Task 17). Run `npx tsc -b --noEmit` after Task 17. For now verify the view file alone compiles.
- [ ] **Step 4: Commit**

```bash
git add src/features/review/viewmodels/ src/features/review/views/ReviewQueueView.tsx
git commit -m "feat: add review queue view and viewmodel"
```

---

### Task 17: Driver detail (viewmodel + view) with modals wired

**Files:**
- Create: `src/features/review/viewmodels/useDriverDetailViewModel.ts`
- Create: `src/features/review/views/DriverDetailView.tsx`

- [ ] **Step 1: Viewmodel** (load driver; manage viewer + reject modal state; approve/reject mutate via documentService and update local doc)

```ts
// src/features/review/viewmodels/useDriverDetailViewModel.ts
import { useCallback, useEffect, useState } from 'react'
import { reviewService, documentService, type Driver, type ReviewDocument } from '../../../shared/data'

export function useDriverDetailViewModel(driverId: string | undefined) {
  const [driver, setDriver] = useState<Driver | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)

  const reload = useCallback(() => {
    if (!driverId) return
    reviewService.getDriverById(driverId).then((d) => { setDriver(d); setIsLoading(false) })
  }, [driverId])

  useEffect(() => { reload() }, [reload])

  const openViewer = (doc: ReviewDocument) => setViewerDoc(doc)
  const closeViewer = () => setViewerDoc(null)
  const openReject = (doc: ReviewDocument) => { setViewerDoc(null); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)

  const approve = async (doc: ReviewDocument) => {
    await documentService.approveDocument(doc.id)
    setViewerDoc(null)
    reload()
  }
  const confirmReject = async (doc: ReviewDocument, reason: string) => {
    await documentService.rejectDocument(doc.id, reason)
    setRejectDoc(null)
    reload()
  }

  return { driver, isLoading, viewerDoc, rejectDoc, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
```

- [ ] **Step 2: View** — Figma `202:799`. Layout: back link "‹ Volver a la cola" → `navigate('/revision')`; header (avatar initials, name, `StatusBadge en_revision`, "ID {id} · {phone}"); license info card (4 columns: Número de licencia, Expedición, Vencimiento, right-aligned label "Licencia de conducir"); "Documentos ({n})" then a 3-column grid of `DocumentCard`. Render `DocumentViewerModal` + `RejectDocumentModal` from the viewmodel state. Pull exact spacing from `get_design_context(202:799)`.

```tsx
// src/features/review/views/DriverDetailView.tsx  (skeleton — fill exact styles from Figma 202:799)
import { useNavigate, useParams } from 'react-router-dom'
import { useDriverDetailViewModel } from '../viewmodels/useDriverDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function DriverDetailView() {
  const navigate = useNavigate()
  const { driverId } = useParams()
  const vm = useDriverDetailViewModel(driverId)
  if (!vm.driver) return <div className="p-8 text-ink-soft">Cargando…</div>
  const d = vm.driver
  return (
    <div className="p-8">
      <button onClick={() => navigate('/revision')} className="mb-6 flex items-center gap-2 text-sm text-ink-soft">‹ Volver a la cola</button>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">{initials(d.name)}</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">{d.name}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft">ID {d.id} · {d.phone}</div>
        </div>
      </div>

      <div className="mb-8 flex gap-12 rounded-2xl border border-border bg-white px-6 py-5">
        <Info label="Número de licencia" value={d.license.number} />
        <Info label="Expedición" value={d.license.issuedAt} />
        <Info label="Vencimiento" value={d.license.expiresAt} />
        <div className="ml-auto self-center text-sm text-ink-soft">Licencia de conducir</div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-ink">Documentos ({d.documents.length})</h2>
      <div className="grid grid-cols-3 gap-6">
        {d.documents.map((doc) => <DocumentCard key={doc.id} document={doc} onReview={vm.openViewer} />)}
      </div>

      <DocumentViewerModal document={vm.viewerDoc} isOpen={!!vm.viewerDoc} onClose={vm.closeViewer} onApprove={vm.approve} onReject={vm.openReject} />
      <RejectDocumentModal document={vm.rejectDoc} isOpen={!!vm.rejectDoc} onClose={vm.closeReject} onConfirm={vm.confirmReject} />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-placeholder">{label}</div>
      <div className="text-base font-semibold text-ink">{value}</div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck** → `npx tsc -b --noEmit` → PASS (review barrel now resolves).
- [ ] **Step 4: Visual** — temporarily add routes (or use Task 24) and compare `/revision` and `/revision/12` against Figma `202:709` and `202:799`. Verify approve/reject updates badges + queue counts.
- [ ] **Step 5: Commit**

```bash
git add src/features/review/
git commit -m "feat: add driver detail view with review modals"
```

---

## Phase 5 — Vehicles feature

### Task 18: Vehicle queue (viewmodel + view)

**Files:**
- Create: `src/features/vehicles/viewmodels/useVehicleQueueViewModel.ts`
- Create: `src/features/vehicles/views/VehicleQueueView.tsx`
- Create: `src/features/vehicles/index.ts`

- [ ] **Step 1: Viewmodel** (mirror of review queue, using `vehicleService`)

```ts
// src/features/vehicles/viewmodels/useVehicleQueueViewModel.ts
import { useEffect, useState } from 'react'
import { vehicleService, type Vehicle, type QueueStats } from '../../../shared/data'

export function useVehicleQueueViewModel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([vehicleService.getVehicleQueue(), vehicleService.getVehicleQueueStats()]).then(
      ([q, s]) => { if (active) { setVehicles(q); setStats(s); setIsLoading(false) } },
    )
    return () => { active = false }
  }, [])

  return { vehicles, stats, isLoading }
}
```

- [ ] **Step 2: View** — Figma `218:304`. `PageHeader("Vehículos pendientes", "Vehículos con documentos por revisar")`, 3 StatCards (En cola, Docs pendientes, "Activados hoy"=success accent). Table columns: VEHÍCULO (rounded square icon + `{plate}` bold + `{model} · {color}`), PROPIETARIO ({ownerName}), TELÉFONO ({ownerPhone}), DOCS PENDIENTES (badge), "Revisar" → `navigate('/vehiculos/' + v.id)`. Structure mirrors `ReviewQueueView`. Pull exact styles from `get_design_context(218:304)`.

```tsx
// src/features/vehicles/views/VehicleQueueView.tsx  (skeleton — fill exact styles from Figma 218:304)
import { useNavigate } from 'react-router-dom'
import { useVehicleQueueViewModel } from '../viewmodels/useVehicleQueueViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'

export function VehicleQueueView() {
  const navigate = useNavigate()
  const { vehicles, stats } = useVehicleQueueViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Vehículos pendientes" subtitle="Vehículos con documentos por revisar" />
      <div className="mb-6 flex gap-4">
        <StatCard value={stats?.inQueue ?? 0} label="En cola" />
        <StatCard value={stats?.pendingDocs ?? 0} label="Docs pendientes" />
        <StatCard value={stats?.approvedToday ?? 0} label="Activados hoy" accent="success" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {vehicles.map((v) => {
          const pending = v.documents.filter((x) => x.status === 'pendiente').length
          return (
            <div key={v.id} className="flex items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-bg text-primary">🛺</span>
                <div>
                  <div className="text-sm font-semibold text-ink">{v.plate}</div>
                  <div className="text-xs text-ink-soft">{v.model} · {v.color}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink">{v.ownerName}</div>
              <div className="w-36 text-sm text-ink">{v.ownerPhone}</div>
              <div className="w-36"><StatusBadge variant="pendiente">{pending} pendientes</StatusBadge></div>
              <Button onClick={() => navigate(`/vehiculos/${v.id}`)}>Revisar</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

```ts
// src/features/vehicles/index.ts
export { VehicleQueueView } from './views/VehicleQueueView'
export { VehicleDetailView } from './views/VehicleDetailView'
```

> Note: replace the `🛺` placeholder with the vehicle icon SVG from Figma `218:440` during the visual pass.

- [ ] **Step 3: Typecheck** (after Task 19 the barrel resolves).
- [ ] **Step 4: Commit**

```bash
git add src/features/vehicles/viewmodels/ src/features/vehicles/views/VehicleQueueView.tsx
git commit -m "feat: add vehicle queue view and viewmodel"
```

---

### Task 19: Vehicle detail (viewmodel + view)

**Files:**
- Create: `src/features/vehicles/viewmodels/useVehicleDetailViewModel.ts`
- Create: `src/features/vehicles/views/VehicleDetailView.tsx`

- [ ] **Step 1: Viewmodel** (same shape as driver detail, using `vehicleService.getVehicleById`)

```ts
// src/features/vehicles/viewmodels/useVehicleDetailViewModel.ts
import { useCallback, useEffect, useState } from 'react'
import { vehicleService, documentService, type Vehicle, type ReviewDocument } from '../../../shared/data'

export function useVehicleDetailViewModel(vehicleId: string | undefined) {
  const [vehicle, setVehicle] = useState<Vehicle | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)

  const reload = useCallback(() => {
    if (!vehicleId) return
    vehicleService.getVehicleById(vehicleId).then((v) => { setVehicle(v); setIsLoading(false) })
  }, [vehicleId])

  useEffect(() => { reload() }, [reload])

  const openViewer = (doc: ReviewDocument) => setViewerDoc(doc)
  const closeViewer = () => setViewerDoc(null)
  const openReject = (doc: ReviewDocument) => { setViewerDoc(null); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)
  const approve = async (doc: ReviewDocument) => { await documentService.approveDocument(doc.id); setViewerDoc(null); reload() }
  const confirmReject = async (doc: ReviewDocument, reason: string) => { await documentService.rejectDocument(doc.id, reason); setRejectDoc(null); reload() }

  return { vehicle, isLoading, viewerDoc, rejectDoc, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
```

- [ ] **Step 2: View** — Figma `218:387`. Back link "‹ Volver a vehículos" → `/vehiculos`; header (vehicle icon, `{plate}` big, `StatusBadge en_revision`, "{ownerName} · {ownerPhone}"); data card (Modelo, Color, Año, Municipio — same `Info` pattern as driver, separated by vertical dividers); "Documentos (3)" grid of `DocumentCard`; viewer + reject modals from viewmodel. Pull exact styles from `get_design_context(218:387)`.

```tsx
// src/features/vehicles/views/VehicleDetailView.tsx  (skeleton — fill exact styles from Figma 218:387)
import { useNavigate, useParams } from 'react-router-dom'
import { useVehicleDetailViewModel } from '../viewmodels/useVehicleDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'

export function VehicleDetailView() {
  const navigate = useNavigate()
  const { vehicleId } = useParams()
  const vm = useVehicleDetailViewModel(vehicleId)
  if (!vm.vehicle) return <div className="p-8 text-ink-soft">Cargando…</div>
  const v = vm.vehicle
  return (
    <div className="p-8">
      <button onClick={() => navigate('/vehiculos')} className="mb-6 flex items-center gap-2 text-sm text-ink-soft">‹ Volver a vehículos</button>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-bg text-primary">🛺</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">{v.plate}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft">{v.ownerName} · {v.ownerPhone}</div>
        </div>
      </div>

      <div className="mb-8 flex gap-12 rounded-2xl border border-border bg-white px-6 py-5">
        <Info label="Modelo" value={v.model} />
        <Info label="Color" value={v.color} />
        <Info label="Año" value={String(v.year)} />
        <Info label="Municipio" value={v.municipality} />
      </div>

      <h2 className="mb-4 text-lg font-bold text-ink">Documentos ({v.documents.length})</h2>
      <div className="grid grid-cols-3 gap-6">
        {v.documents.map((doc) => <DocumentCard key={doc.id} document={doc} onReview={vm.openViewer} />)}
      </div>

      <DocumentViewerModal document={vm.viewerDoc} isOpen={!!vm.viewerDoc} onClose={vm.closeViewer} onApprove={vm.approve} onReject={vm.openReject} />
      <RejectDocumentModal document={vm.rejectDoc} isOpen={!!vm.rejectDoc} onClose={vm.closeReject} onConfirm={vm.confirmReject} />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-placeholder">{label}</div>
      <div className="text-base font-semibold text-ink">{value}</div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck** → PASS.
- [ ] **Step 4: Commit**

```bash
git add src/features/vehicles/
git commit -m "feat: add vehicle detail view with review modals"
```

---

## Phase 6 — Drivers list + Settings (own proposals)

### Task 20: Conductores list (`/conductores`)

**Files:**
- Create: `src/features/drivers/viewmodels/useDriversListViewModel.ts`
- Create: `src/features/drivers/views/DriversListView.tsx`
- Create: `src/features/drivers/index.ts`

- [ ] **Step 1: Viewmodel** (fetch all drivers via `reviewService.getAllDrivers`)

```ts
// src/features/drivers/viewmodels/useDriversListViewModel.ts
import { useEffect, useState } from 'react'
import { reviewService, type Driver } from '../../../shared/data'

export function useDriversListViewModel() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let active = true
    reviewService.getAllDrivers().then((d) => { if (active) { setDrivers(d); setIsLoading(false) } })
    return () => { active = false }
  }, [])
  return { drivers, isLoading }
}
```

- [ ] **Step 2: View** — reuse the same visual style as the review queue (PageHeader "Conductores" / "Todos los conductores registrados" + table card). Columns: CONDUCTOR, TELÉFONO, ESTADO (`StatusBadge` mapping `en_revision`→"En revisión", `aprobado`→"Activo", `rechazado`→"Rechazado"), action "Ver" → `navigate('/revision/' + d.id)`. No StatCards. Map status to label/variant with a small inline helper. Keep consistent with `ReviewQueueView` markup.

```tsx
// src/features/drivers/views/DriversListView.tsx
import { useNavigate } from 'react-router-dom'
import { useDriversListViewModel } from '../viewmodels/useDriversListViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatusBadge, type BadgeVariant } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import type { ReviewStatus } from '../../../shared/data'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const statusMap: Record<ReviewStatus, { variant: BadgeVariant; label: string }> = {
  en_revision: { variant: 'en_revision', label: 'En revisión' },
  aprobado: { variant: 'aprobado', label: 'Activo' },
  rechazado: { variant: 'rechazado', label: 'Rechazado' },
}

export function DriversListView() {
  const navigate = useNavigate()
  const { drivers } = useDriversListViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Conductores" subtitle="Todos los conductores registrados" />
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {drivers.map((d) => {
          const s = statusMap[d.status]
          return (
            <div key={d.id} className="flex items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">{initials(d.name)}</span>
                <div>
                  <div className="text-sm font-semibold text-ink">{d.name}</div>
                  <div className="text-xs text-ink-soft">ID {d.id}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink">{d.phone}</div>
              <div className="w-36"><StatusBadge variant={s.variant}>{s.label}</StatusBadge></div>
              <Button variant="outline" onClick={() => navigate(`/revision/${d.id}`)}>Ver</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

```ts
// src/features/drivers/index.ts
export { DriversListView } from './views/DriversListView'
```

- [ ] **Step 3: Typecheck** → PASS.
- [ ] **Step 4: Commit**

```bash
git add src/features/drivers/
git commit -m "feat: add Conductores list view"
```

---

### Task 21: Ajustes (`/ajustes`)

**Files:**
- Create: `src/features/settings/views/SettingsView.tsx`
- Create: `src/features/settings/index.ts`

- [ ] **Step 1: View** — simple settings using card style: PageHeader "Ajustes" / "Perfil y preferencias"; a white rounded card with admin profile (avatar "A", "Administrador", "admin@jala.local") and a `Button variant="dangerOutline"` "Cerrar sesión" → `navigate('/login')`. Keep minimal; no data layer needed.

```tsx
// src/features/settings/views/SettingsView.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'

export function SettingsView() {
  const navigate = useNavigate()
  return (
    <div className="p-8">
      <PageHeader title="Ajustes" subtitle="Perfil y preferencias" />
      <div className="max-w-xl rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-base font-bold text-white">A</span>
          <div>
            <div className="text-base font-semibold text-ink">Administrador</div>
            <div className="text-sm text-ink-soft">admin@jala.local</div>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <Button variant="dangerOutline" onClick={() => navigate('/login')}>Cerrar sesión</Button>
        </div>
      </div>
    </div>
  )
}
```

```ts
// src/features/settings/index.ts
export { SettingsView } from './views/SettingsView'
```

- [ ] **Step 2: Typecheck** → PASS.
- [ ] **Step 3: Commit**

```bash
git add src/features/settings/
git commit -m "feat: add Ajustes view"
```

---

## Phase 7 — Auth alignment (1:1 with Figma)

### Task 22: Align `AuthLayout` + restore accents

**Files:**
- Modify: `src/features/auth/components/AuthLayout.tsx`
- Modify: `src/features/auth/views/LoginView.tsx`
- Modify: `src/features/auth/views/CodeVerificationView.tsx`
- Modify: `src/features/auth/components/CodeInput.tsx`

- [ ] **Step 1: Rework `AuthLayout`** to match Figma `202:627`: left panel **560px** with gradient `linear-gradient(180deg,#FF8F00,#FFB300)`; content **left-aligned, vertical**: a **white circle (~104px)** containing the `Logo`, then "Jala" (≈64px bold white), then "Panel de administración" (subtitle), then "Verifica conductores y mantén la flota segura." Right panel white, form `max-w-[400px]` left-aligned within centered column. Replace the inline wavy SVG with `<Logo />` inside the circle.

```tsx
// src/features/auth/components/AuthLayout.tsx
import type { ReactNode } from 'react'
import { Logo } from '../../../shared/components/Logo'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div
        className="relative hidden w-[560px] shrink-0 flex-col justify-center overflow-hidden px-[72px] lg:flex"
        style={{ background: 'linear-gradient(180deg, #FF8F00 0%, #FFB300 100%)' }}
      >
        <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white">
          <Logo size={56} />
        </div>
        <h1 className="mt-8 text-6xl font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Jala</h1>
        <p className="mt-4 text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Panel de administración</p>
        <p className="mt-2 text-base text-white/85" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Verifica conductores y mantén la flota segura.</p>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[400px] px-8">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Restore accents** in `LoginView.tsx` ("Inicia sesión", "Ingresa tu correo o teléfono para recibir un código.", "Correo o teléfono"), `CodeVerificationView.tsx` ("Ingresa el código", "Enviamos un código de 4 dígitos a", "Reenviar código"), and `CodeInput.tsx` label ("Código de verificación"). Keep existing logic/viewmodels untouched. Confirm "Enviar código" / "Verificar y entrar" copy matches Figma `202:627` / `202:665`.

- [ ] **Step 3: Typecheck + Visual** — `npx tsc -b --noEmit` → PASS; compare `/login` vs `202:627` and `/verificar` vs `202:665`.
- [ ] **Step 4: Commit**

```bash
git add src/features/auth/
git commit -m "refactor: align auth screens 1:1 with Figma"
```

---

## Phase 8 — Integration (sidebar, routes, cleanup)

### Task 23: Update `Sidebar` (4 nav items + Logo)

**Files:**
- Modify: `src/shared/layouts/Sidebar.tsx`

- [ ] **Step 1: Replace the inline wavy SVG logo with `<Logo />`** next to the "Jala" wordmark.
- [ ] **Step 2: Set the canonical nav (4 items)** — add "Vehículos" and update `to` paths:

```tsx
const navItems: NavItem[] = [
  { label: 'Cola de revisión', to: '/revision', icon: /* keep existing list/queue icon */ },
  { label: 'Vehículos', to: '/vehiculos', icon: /* mototaxi/car icon from Figma 218:419 */ },
  { label: 'Conductores', to: '/conductores', icon: /* keep existing person icon */ },
  { label: 'Ajustes', to: '/ajustes', icon: /* keep existing gear icon */ },
]
```

Update the `end` prop logic so the active item stays highlighted on nested routes: `Cola de revisión` active for `/revision*`, `Vehículos` active for `/vehiculos*` (NavLink default matches path prefix for nested segments; remove `end` except where exact match is needed).

- [ ] **Step 3: Typecheck** → PASS.
- [ ] **Step 4: Commit**

```bash
git add src/shared/layouts/Sidebar.tsx
git commit -m "feat: add Vehículos nav item and real logo to sidebar"
```

---

### Task 24: Update routes + remove `features/dashboard`

**Files:**
- Modify: `src/routes/index.tsx`
- Delete: `src/features/dashboard/` (entire folder)

- [ ] **Step 1: Rewrite the router**

```tsx
// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../shared/layouts/AppLayout'
import { LoginView, CodeVerificationView } from '../features/auth'
import { ReviewQueueView, DriverDetailView } from '../features/review'
import { VehicleQueueView, VehicleDetailView } from '../features/vehicles'
import { DriversListView } from '../features/drivers'
import { SettingsView } from '../features/settings'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/verificar" element={<CodeVerificationView />} />
        <Route element={<AppLayout />}>
          <Route path="/revision" element={<ReviewQueueView />} />
          <Route path="/revision/:driverId" element={<DriverDetailView />} />
          <Route path="/vehiculos" element={<VehicleQueueView />} />
          <Route path="/vehiculos/:vehicleId" element={<VehicleDetailView />} />
          <Route path="/conductores" element={<DriversListView />} />
          <Route path="/ajustes" element={<SettingsView />} />
        </Route>
        <Route path="/" element={<Navigate to="/revision" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Delete the dashboard feature**

```bash
git rm -r src/features/dashboard
```

- [ ] **Step 3: Typecheck + Lint** → `npx tsc -b --noEmit` && `npm run lint` → PASS (no dangling imports).
- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: wire panel routes and remove dashboard stub"
```

---

### Task 25: Final visual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the app** — `npm run dev`.
- [ ] **Step 2: For each screen, screenshot the route and compare to its Figma node**, iterating on spacing/typography/colors (max 3 iterations each):
  - `/login` ↔ `202:627`, `/verificar` ↔ `202:665`
  - `/revision` ↔ `202:709`, `/revision/12` ↔ `202:799`
  - viewer modal ↔ `202:925`, reject modal ↔ `202:1060`
  - `/vehiculos` ↔ `218:304`, `/vehiculos/XYZ-123` ↔ `218:387`
  - `/conductores`, `/ajustes` (own style — verify consistency with the panel)
- [ ] **Step 3: Functional smoke test** — from `/revision/12`: open INE (frente) → Aprobar → badge becomes "Aprobado" and queue "Docs pendientes" decreases on return; open another → Rechazar → reason modal → confirm → badge "Rechazado". Repeat from `/vehiculos/XYZ-123`.
- [ ] **Step 4: Final typecheck + lint** → `npx tsc -b --noEmit` && `npm run lint` → PASS.
- [ ] **Step 5: Commit any visual fixes**

```bash
git add -A
git commit -m "polish: align panel screens to Figma after visual review"
```

---

## Self-Review (against spec)

- **Auth 1:1** → Task 22. **Cola de revisión** → Task 16. **Detalle conductor** → Task 17.
  **Vehículos** → Task 18. **Detalle vehículo** → Task 19. **Visor documento** → Task 15.
  **Rechazar documento** → Task 14. **Conductores** → Task 20. **Ajustes** → Task 21.
  **Sidebar 4 ítems + logo** → Tasks 2/23. **Mock data layer** → Tasks 9–12. **Tokens** → Task 1.
  **Shared components** (Logo/StatusBadge/StatCard/PageHeader/Modal/DocumentThumbnail/Button) → Tasks 2–8.
  **Routing + remove dashboard** → Task 24. All spec sections covered.
- **Type consistency:** `ReviewDocument`, `Driver`, `Vehicle`, `QueueStats`, `BadgeVariant`, service method
  names (`getDriverQueue`, `getVehicleById`, `approveDocument`, `rejectDocument`) and viewmodel return
  shapes are used identically across tasks.
- **Known ordering note:** `review`/`vehicles` `index.ts` barrels export a detail view created in the
  following task; typecheck passes once both tasks in the pair are complete (flagged in Tasks 16/18).
- **Placeholders:** the `🛺` emoji (vehicle icon) and table column pixel widths are intentional
  stand-ins replaced with exact Figma values during the visual pass (Tasks 18/19/25) via
  `get_design_context`. No `TBD`/`TODO` left in code steps.
