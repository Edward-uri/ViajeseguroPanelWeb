import { useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { CloseIcon, EditIcon } from '../../../shared/icons'
import type { UpdateProfileInput } from '../../auth/api/updateProfile.types'
import type { EditProfileModalProps } from './EditProfileModal.types'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }
const PHONE_RE = /^\d{10,15}$/

export function EditProfileModal({ open, saving, defaultPhone, onClose, onSubmit }: EditProfileModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} labelledById="edit-profile-title" size="md">
      {/* Se monta al abrir y se desmonta al cerrar → estado fresco sin efecto. */}
      {open && <EditProfileForm saving={saving} defaultPhone={defaultPhone} onClose={onClose} onSubmit={onSubmit} />}
    </Modal>
  )
}

function EditProfileForm({
  saving,
  defaultPhone,
  onClose,
  onSubmit,
}: {
  saving: boolean
  defaultPhone: string
  onClose: () => void
  onSubmit: (input: UpdateProfileInput) => void
}) {
  const [nombre, setNombre] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [telefono, setTelefono] = useState(defaultPhone)
  const [fechaNacimiento, setFechaNacimiento] = useState('')

  const tel = telefono.trim()
  const telOk = tel === '' || PHONE_RE.test(tel)
  const namesOk =
    nombre.trim().length <= 30 && apellidoPaterno.trim().length <= 30 && apellidoMaterno.trim().length <= 30

  // Solo se envían los campos con valor (actualización parcial).
  const build = (): UpdateProfileInput => {
    const input: UpdateProfileInput = {}
    if (nombre.trim()) input.nombre = nombre.trim()
    if (apellidoPaterno.trim()) input.apellidoPaterno = apellidoPaterno.trim()
    if (apellidoMaterno.trim()) input.apellidoMaterno = apellidoMaterno.trim()
    if (tel) input.telefono = tel
    if (fechaNacimiento) input.fechaNacimiento = fechaNacimiento
    return input
  }

  const hasChanges = Object.keys(build()).length > 0
  const valid = hasChanges && telOk && namesOk

  const submit = () => {
    if (!valid || saving) return
    onSubmit(build())
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-active text-primary"><EditIcon size={20} /></span>
          <div>
            <h2 id="edit-profile-title" className="text-lg font-bold text-ink" style={jakarta}>Editar perfil</h2>
            <p className="text-sm text-ink-soft" style={jakarta}>El correo no se puede cambiar.</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-ink"><CloseIcon size={18} /></button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Field label="Nombre" value={nombre} onChange={setNombre} placeholder="Tu nombre" disabled={saving} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Apellido paterno" value={apellidoPaterno} onChange={setApellidoPaterno} placeholder="Paterno" disabled={saving} />
          <Field label="Apellido materno" value={apellidoMaterno} onChange={setApellidoMaterno} placeholder="Materno" disabled={saving} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Field label="Teléfono" value={telefono} onChange={setTelefono} placeholder="9611234567" type="tel" disabled={saving} />
            {!telOk && <p className="mt-1 text-xs font-medium text-red" style={jakarta}>Debe tener 10 a 15 dígitos.</p>}
          </div>
          <Field label="Fecha de nacimiento" value={fechaNacimiento} onChange={setFechaNacimiento} type="date" disabled={saving} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" disabled={!valid} isLoading={saving} onClick={submit}>Guardar cambios</Button>
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
        inputMode={type === 'tel' ? 'numeric' : undefined}
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
