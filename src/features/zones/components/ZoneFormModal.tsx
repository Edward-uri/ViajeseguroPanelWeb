import { lazy, Suspense, useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { CloseIcon, PriceIcon, InfoIcon } from '../../../shared/icons'
import type { Zone, ZoneInput } from '../zone.types'
import type { ZoneFormModalProps } from './ZoneFormModal.types'

const ZoneMapPicker = lazy(() => import('./ZoneMapPicker').then((m) => ({ default: m.ZoneMapPicker })))
const hasMapToken = !!import.meta.env.VITE_MAPBOX_TOKEN

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function ZoneFormModal({ open, zone, saving, onClose, onSubmit }: ZoneFormModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} labelledById="zone-form-title" size="lg">
      {open && <ZoneForm zone={zone} saving={saving} onClose={onClose} onSubmit={onSubmit} />}
    </Modal>
  )
}

function ZoneForm({
  zone,
  saving,
  onClose,
  onSubmit,
}: {
  zone: Zone | null
  saving: boolean
  onClose: () => void
  onSubmit: (input: ZoneInput) => void
}) {
  const [nombre, setNombre] = useState(zone?.nombre ?? '')
  const [precio, setPrecio] = useState(zone ? String(zone.precio) : '')
  const [lat, setLat] = useState(zone?.latCentro != null ? String(zone.latCentro) : '')
  const [lng, setLng] = useState(zone?.lngCentro != null ? String(zone.lngCentro) : '')

  const precioNum = Number(precio)
  const latFilled = lat.trim() !== ''
  const lngFilled = lng.trim() !== ''
  const latNum = latFilled ? Number(lat) : null
  const lngNum = lngFilled ? Number(lng) : null
  const hasPoint = latFilled && lngFilled
  const valid =
    nombre.trim().length > 0 &&
    precio.trim() !== '' && Number.isFinite(precioNum) && precioNum >= 0 &&
    (!latFilled || Number.isFinite(Number(lat))) &&
    (!lngFilled || Number.isFinite(Number(lng)))

  const pickPoint = (la: number, ln: number) => { setLat(la.toFixed(6)); setLng(ln.toFixed(6)) }
  const clearPoint = () => { setLat(''); setLng('') }

  const submit = () => {
    if (!valid || saving) return
    onSubmit({
      nombre: nombre.trim(),
      precio: precioNum,
      lat: latFilled ? Number(lat) : null,
      lng: lngFilled ? Number(lng) : null,
    })
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-active text-primary"><PriceIcon size={20} /></span>
          <div>
            <h2 id="zone-form-title" className="text-lg font-bold text-ink" style={jakarta}>{zone ? 'Editar zona' : 'Nueva zona'}</h2>
            <p className="text-sm text-ink-soft" style={jakarta}>{zone ? 'Actualiza el nombre o la tarifa.' : 'Define el nombre y la tarifa de la zona.'}</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-ink"><CloseIcon size={18} /></button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Field label="Nombre de la zona" value={nombre} onChange={setNombre} placeholder="Centro" disabled={saving} />
        <Field label="Tarifa (MXN)" value={precio} onChange={setPrecio} placeholder="25.50" type="number" disabled={saving} />
        <div>
          <p className="mb-2 text-xs font-medium text-ink-soft" style={jakarta}>Centro de la zona (opcional)</p>
          {hasMapToken ? (
            <>
              <Suspense fallback={<div className="flex h-64 w-full items-center justify-center rounded-xl border border-border bg-neutral-bg text-sm text-ink-soft" style={jakarta}>Cargando mapa…</div>}>
                <ZoneMapPicker lat={latNum} lng={lngNum} onChange={pickPoint} />
              </Suspense>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs" style={jakarta}>
                <span className="text-ink-soft">{hasPoint ? `Centro: ${lat}, ${lng}` : 'Toca el mapa o arrastra el pin para fijar el centro.'}</span>
                {hasPoint && <button type="button" onClick={clearPoint} className="shrink-0 font-semibold text-red hover:underline">Limpiar</button>}
              </div>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-start gap-2 rounded-lg border border-border bg-neutral-bg px-3 py-2 text-xs text-ink-soft" style={jakarta}>
                <InfoIcon size={14} className="mt-0.5 shrink-0" />
                <span>Agrega VITE_MAPBOX_TOKEN en tu .env para fijar el centro en un mapa. Por ahora puedes capturarlo manual.</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitud" value={lat} onChange={setLat} placeholder="16.7530" type="number" disabled={saving} />
                <Field label="Longitud" value={lng} onChange={setLng} placeholder="-93.1150" type="number" disabled={saving} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" disabled={!valid} isLoading={saving} onClick={submit}>{zone ? 'Guardar cambios' : 'Crear zona'}</Button>
      </div>
    </>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink-soft" style={jakarta}>{label}</span>
      <input
        type={type}
        inputMode={type === 'number' ? 'decimal' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-placeholder focus:border-primary disabled:opacity-50"
        style={jakarta}
      />
    </label>
  )
}
