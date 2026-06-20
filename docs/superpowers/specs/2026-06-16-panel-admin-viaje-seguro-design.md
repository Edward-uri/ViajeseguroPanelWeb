# Panel Admin (Web) — Viaje Seguro / Jala — Diseño

**Fecha:** 2026-06-16
**Fuente de diseño:** Figma, página "Panel Admin (Web)" del archivo Viaje Seguro.
**Stack:** React 19, React Router 7, Tailwind CSS 4, TypeScript, Vite.

## 1. Propósito

Panel web de administración para **Jala** (servicio de mototaxis "Viaje Seguro"). El
administrador revisa los documentos subidos por conductores y vehículos y los **aprueba o
rechaza**, manteniendo la flota verificada. Es una herramienta interna de back-office.

## 2. Alcance

**Dentro del alcance:**

- Alinear Login + Verificación por código 1:1 con Figma.
- Cola de revisión (conductores pendientes) + Detalle conductor.
- Vehículos pendientes + Detalle vehículo.
- Modales compartidos: Visor de documento (aprobar/rechazar) y Rechazar documento (motivo).
- Conductores (lista completa) y Ajustes — diseñados por nosotros con el mismo estilo (no
  existen en Figma).
- Sidebar con nav canónico de 4 ítems + logo real.
- Capa de datos mock en memoria, desacoplada y lista para sustituir por API real.

**Fuera del alcance:**

- Backend / API real (la capa de servicios queda lista para conectarse después).
- Autenticación real (se mantiene el flujo simulado existente).
- Tests automatizados (no hay runner configurado; verificación visual manual). Los viewmodels
  quedan como funciones puras/hooks fáciles de testear si luego se agrega Vitest.

## 3. Modelo de dominio y datos mock

Tipos de dominio (en `models/` de cada feature o `shared/data/types.ts`):

```
DocumentStatus = 'aprobado' | 'pendiente' | 'rechazado' | 'faltante'
DocumentKind   = 'licencia' | 'ine_frente' | 'ine_reverso' | 'tarjeta_circulacion'
               | 'foto_vehiculo' | 'permiso_municipal'

Document  { id, kind, label, status, fileName?, uploadedAt?, optional, rejectionReason? }
Driver    { id, name, phone, status, license: { number, issuedAt, expiresAt }, documents: Document[] }
Vehicle   { id, plate, model, color, year, municipality, ownerName, ownerPhone, status, documents: Document[] }
ReviewStatus = 'en_revision' | 'aprobado' | 'rechazado'
```

**Capa de datos** (`src/shared/data/`):

- `seed.ts` — datos de ejemplo (Carlos Méndez, Ana López, vehículo XYZ-123, etc. tal cual el Figma).
- `mockStore.ts` — singleton mutable en memoria que contiene los arrays sembrados.
- `reviewService.ts`, `vehicleService.ts`, `documentService.ts` — funciones `async` que
  devuelven `Promise<T>` con latencia simulada (`setTimeout`). Incluyen mutaciones:
  `approveDocument(id)`, `rejectDocument(id, reason)`, que actualizan el store.

**Reactividad entre vistas:** sin store global. Cada vista hace fetch en `useEffect` al montar;
al volver de un detalle a la cola, la cola re-consulta el store mutado y los contadores se
actualizan. Cambiar a API real = reescribir solo los `*Service.ts` (misma firma `Promise<T>`).

## 4. Decomposición por features

```
src/features/
  auth/        (existente) alinear LoginView, CodeVerificationView, AuthLayout a Figma
  review/      ReviewQueueView (Cola de revisión), DriverDetailView (Detalle conductor)
  vehicles/    VehicleQueueView (Vehículos), VehicleDetailView (Detalle vehículo)
  documents/   DocumentCard, DocumentViewerModal, RejectDocumentModal + document.types
  drivers/     DriversListView (Conductores — propuesta propia)
  settings/    SettingsView (Ajustes — propuesta propia)
```

Se elimina `features/dashboard`; su ruta pasa a `review`. Cada feature mantiene
`models/ viewmodels/ views/ components/ index.ts`.

## 5. Componentes compartidos nuevos (`src/shared/components/`)

- `Logo` — logo real exportado de Figma (mototaxi línea), con prop de tamaño/color.
- `StatusBadge` — variantes: `en_revision`, `pendiente`, `aprobado`, `rechazado`, `faltante`,
  `opcional`, `pendientes` (contador). Mapea a los tokens de color.
- `StatCard` — tarjeta con borde izquierdo de color (primary/success), número grande + label.
- `PageHeader` — título + subtítulo.
- `Modal` — base accesible: overlay, focus trap, cerrar con `Esc` y clic fuera, `role="dialog"`,
  `aria-modal`, bloqueo de scroll del fondo.
- `DocumentThumbnail` — preview tipo "documento" (skeleton naranja) o estado "No subido".

`PrimaryButton` se mantiene; se añaden variantes de botón (sólido verde, outline rojo, sólido
rojo, outline neutro) ya sea como props de variante o componentes hermanos.

## 6. Tokens de color (en `src/index.css`, ya existentes salvo lo indicado)

primary `#FF8F00` · primary-light `#FFB300` · blue `#005B9F` · red `#D84315` · ink `#1A1410` ·
ink-soft `#6B6661` · surface `#F6F6F6` · border `#D1D1D1` · placeholder `#B6B3B1` ·
success `#1E8E5A` · success-bg `#E6F4EA` · warning `#E8A317` · warning-bg `#FDF3DD` ·
sidebar-active `#FFF1E0`. **Añadir:** `--color-danger-bg` (rojo claro para badge "Faltante") y
un fondo neutro para badge "Opcional" (usar `surface`/`border` + `ink-soft`). Fuente:
Plus Jakarta Sans.

## 7. Especificación de pantallas

### Auth (alinear 1:1)
Layout dividido: panel izquierdo 560px con gradiente naranja (180deg #FF8F00→#FFB300),
**logo dentro de círculo blanco** arriba, debajo "Jala" grande, "Panel de administración" y
"Verifica conductores y mantén la flota segura." — todo **alineado a la izquierda en vertical**.
Panel derecho blanco con el formulario centrado. Restaurar acentos correctos en los textos.
- **Login:** "Inicia sesión", input "Correo o teléfono", botón gradiente "Enviar código".
- **Código:** "Ingresa el código", 4 cajas de dígito, "Verificar y entrar", link "Reenviar código".

### Cola de revisión (`/revision`)
PageHeader "Cola de revisión" / "Conductores con documentos por revisar". 3 StatCards: En cola,
Docs pendientes (borde naranja), Aprobados hoy (borde verde). Tabla: CONDUCTOR (avatar iniciales
+ nombre + ID), TELÉFONO, DOCS PENDIENTES (badge "N pendientes"), ESTADO (StatusBadge), botón
sólido "Revisar" → navega a `/revision/:driverId`.

### Detalle conductor (`/revision/:driverId`)
Link "‹ Volver a la cola". Header: avatar + nombre + badge estado + "ID · teléfono". Tarjeta de
licencia (Número de licencia, Expedición, Vencimiento, etiqueta "Licencia de conducir").
"Documentos (N)": grid de 3 columnas de `DocumentCard` (thumbnail, nombre, StatusBadge, botón
outline "Revisar"). Card "Faltante" muestra "No subido" sin thumbnail. "Revisar" abre
`DocumentViewerModal`.

### Vehículos pendientes (`/vehiculos`)
PageHeader "Vehículos pendientes" / "Vehículos con documentos por revisar". 3 StatCards: En cola,
Docs pendientes, Activados hoy. Tabla: VEHÍCULO (icono + placa + modelo·color), PROPIETARIO,
TELÉFONO, DOCS PENDIENTES, botón "Revisar" → `/vehiculos/:vehicleId`.

### Detalle vehículo (`/vehiculos/:vehicleId`)
Link "‹ Volver a vehículos". Header: icono vehículo + placa + badge + "propietario · teléfono".
Tarjeta de datos (Modelo, Color, Año, Municipio). "Documentos (3)": grid de `DocumentCard`
(Tarjeta de circulación, Foto del vehículo, Permiso/concesión municipal con badges Opcional/Faltante).

### Visor documento (modal sobre el detalle)
Encabezado: nombre del documento + StatusBadge + cerrar. Izquierda: preview grande. Derecha:
Archivo, Subido (fecha), Tipo, nota de ayuda. Botones: "✓ Aprobar documento" (sólido verde),
"Rechazar" (outline rojo) → abre RejectDocumentModal.

### Rechazar documento (modal)
Icono de alerta rojo + "Rechazar documento" + nombre del doc. Textarea "Motivo del rechazo"
(helper: "El conductor verá este motivo · 3–500 caracteres", validación 3–500). Botones
"Cancelar" (outline) y "Rechazar documento" (sólido rojo, deshabilitado si inválido).

### Conductores (`/conductores`) — propuesta propia
Lista completa de conductores (no solo pendientes) reutilizando el mismo estilo de tabla +
StatusBadge, con filtro/contador simple. Mismo PageHeader.

### Ajustes (`/ajustes`) — propuesta propia
Vista de perfil/preferencias del administrador con el estilo de tarjetas del panel (datos del
admin, cerrar sesión). Mantener simple.

## 8. Sidebar y rutas

Nav canónico (4 ítems): **Cola de revisión** → `/revision`, **Vehículos** → `/vehiculos`,
**Conductores** → `/conductores`, **Ajustes** → `/ajustes`. El logo de líneas se reemplaza por
el `Logo` real. Los detalles (`/revision/:id`, `/vehiculos/:id`) mantienen activo su ítem padre.
`AppLayout` envuelve todas las rutas autenticadas. `*` → `/login`; `/` → `/revision`.

## 9. Logo

Exportar el componente Figma "Logo / Mototaxi Línea" a `src/assets/logo-jala.svg` y consumirlo
mediante el componente `Logo`. En auth va dentro del círculo blanco; en sidebar va junto al
wordmark "Jala".

## 10. Orden de construcción

1. Tokens (añadir danger-bg) + exportar logo + componente `Logo`.
2. Componentes compartidos (`StatusBadge`, `StatCard`, `PageHeader`, `Modal`, `DocumentThumbnail`).
3. Capa de datos mock (`seed`, `mockStore`, services).
4. Feature `review` (cola + detalle conductor).
5. Feature `vehicles` (cola + detalle vehículo).
6. Feature `documents` (modales Visor + Rechazar) e integrarlos en los detalles.
7. Features `drivers` (Conductores) y `settings` (Ajustes).
8. Alinear `auth` 1:1 con Figma.
9. Sidebar + rutas + limpieza de `features/dashboard`.
10. Verificación visual contra Figma (capturas) e iteración.
```
