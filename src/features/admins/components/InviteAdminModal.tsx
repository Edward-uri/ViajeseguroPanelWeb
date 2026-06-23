import { useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { InputField } from '../../../shared/components/InputField'
import { CloseIcon, InviteIcon } from '../../../shared/icons'
import type { InviteAdminModalProps } from './InviteAdminModal.types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function InviteAdminModal({ open, sending, onClose, onSubmit }: InviteAdminModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} labelledById="invite-title" size="md">
      {open && <InviteForm sending={sending} onClose={onClose} onSubmit={onSubmit} />}
    </Modal>
  )
}

function InviteForm({
  sending,
  onClose,
  onSubmit,
}: {
  sending: boolean
  onClose: () => void
  onSubmit: (correo: string) => void
}) {
  const [correo, setCorreo] = useState('')
  const valid = EMAIL_RE.test(correo.trim())

  const submit = () => {
    if (!valid || sending) return
    onSubmit(correo.trim())
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-active text-primary"><InviteIcon size={20} /></span>
          <div>
            <h2 id="invite-title" className="text-lg font-bold text-ink" style={jakarta}>Invitar administrador</h2>
            <p className="text-sm text-ink-soft" style={jakarta}>Le enviaremos una invitación por correo para acceder al panel.</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-ink"><CloseIcon size={18} /></button>
      </div>

      <div className="mt-6">
        <InputField label="Correo del administrador" value={correo} onChange={setCorreo} placeholder="nuevo.admin@jala.local" type="email" disabled={sending} />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" icon={InviteIcon} disabled={!valid} isLoading={sending} onClick={submit}>Enviar invitación</Button>
      </div>
    </>
  )
}
