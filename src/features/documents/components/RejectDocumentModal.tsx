import { useState } from 'react'
import type { ReviewDocument } from '../../../shared/domain'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { WarningIcon, CloseIcon, RejectedIcon } from '../../../shared/icons'
import type { RejectDocumentModalProps } from './RejectDocumentModal.types'

export function RejectDocumentModal({ document, isOpen, onClose, onConfirm }: RejectDocumentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledById="reject-title" size="md">
      {document && <RejectForm document={document} onClose={onClose} onConfirm={onConfirm} />}
    </Modal>
  )
}


function RejectForm({
  document,
  onClose,
  onConfirm,
}: {
  document: ReviewDocument
  onClose: () => void
  onConfirm: (doc: ReviewDocument, reason: string) => void
}) {
  const [reason, setReason] = useState('')
  const trimmed = reason.trim()
  const valid = trimmed.length >= 3 && trimmed.length <= 500

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-bg text-red"><WarningIcon size={18} /></span>
          <div>
            <h2 id="reject-title" className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
              Rechazar documento
            </h2>
            <p className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
              {document.label}
            </p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-ink"><CloseIcon size={18} /></button>
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
        <Button variant="danger" icon={RejectedIcon} disabled={!valid} onClick={() => onConfirm(document, trimmed)}>
          Rechazar documento
        </Button>
      </div>
    </>
  )
}
