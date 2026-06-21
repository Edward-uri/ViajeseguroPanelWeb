import { useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { CloseIcon, PriceIcon } from '../../../shared/icons'
import type { Zone, ZoneInput } from '../zone.types'
import type { ZoneFormModalProps } from './ZoneFormModal.types'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function ZoneFormModal({ open, zone, saving, onClose, onSubmit }: ZoneFormModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} labelledById="zone-form-title" size="md">
      {/* El formulario se monta al abrir y se desmonta al cerrar → estado fresco sin efecto. */}
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
  const valid =
    nombre.trim().length > 0 &&
    precio.trim() !== '' && Number.isFinite(precioNum) && precioNum >= 0 &&
    (!latFilled || Number.isFinite(Number(lat))) &&
    (!lngFilled || Number.isFinite(Number(lng)))

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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitud" value={lat} onChange={setLat} placeholder="16.7530" type="number" disabled={saving} />
            <Field label="Longitud" value={lng} onChange={setLng} placeholder="-93.1150" type="number" disabled={saving} />
          </div>
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
