import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { DocumentThumbnail } from '../../../shared/components/DocumentThumbnail'
import { CloseIcon, CheckIcon, RejectedIcon, SpinnerIcon } from '../../../shared/icons'
import { statusToBadge } from '../models/documentStatus'
import type { DocumentViewerModalProps } from './DocumentViewerModal.types'

export function DocumentViewerModal({ document, isOpen, fileUrl, fileLoading, onClose, onApprove, onReject }: DocumentViewerModalProps) {
  if (!document) return null
  const badge = statusToBadge(document.status)
  const canDecide = document.idDocumento != null
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledById="viewer-title" size="lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 id="viewer-title" className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{document.label}</h2>
          <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-ink">
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
        {fileLoading ? (
          <div className="flex h-[320px] flex-col items-center justify-center gap-2 rounded-xl bg-neutral-bg text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            <SpinnerIcon size={24} className="animate-spin text-primary" />
            <span className="text-sm">Cargando documento…</span>
          </div>
        ) : fileUrl ? (
          <img src={fileUrl} alt={document.label} className="h-[320px] w-full rounded-xl bg-neutral-bg object-contain" />
        ) : (
          <DocumentThumbnail uploaded size="large" />
        )}
        <div className="flex flex-col gap-4">
          <Meta label="Archivo" value={document.idDocumento != null ? `#${document.idDocumento}` : '—'} />
          <Meta label="Tipo" value={document.label} />
          <p className="rounded-lg bg-surface p-3 text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            Verifica que los datos sean legibles y coincidan con la información antes de aprobar.
          </p>
          <div className="mt-auto flex flex-col gap-3">
            <Button variant="success" fullWidth icon={CheckIcon} disabled={!canDecide} onClick={() => onApprove(document)}>Aprobar documento</Button>
            <Button variant="dangerOutline" fullWidth icon={RejectedIcon} disabled={!canDecide} onClick={() => onReject(document)}>Rechazar</Button>
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
