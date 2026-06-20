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
