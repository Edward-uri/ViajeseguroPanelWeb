import { DocumentThumbnail } from '../../../shared/components/DocumentThumbnail'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { statusToBadge } from '../models/documentStatus'
import type { DocumentCardProps } from './DocumentCard.types'

export function DocumentCard({ document, onReview }: DocumentCardProps) {
  const uploaded = document.status !== 'faltante'
  const badge = statusToBadge(document.status)
  const canReview = uploaded && document.idDocumento != null
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <DocumentThumbnail uploaded={uploaded} />
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{document.label}</span>
          <div className="flex flex-wrap gap-2">
            {document.optional && <StatusBadge variant="opcional">Opcional</StatusBadge>}
            <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
          </div>
          {document.status === 'rechazado' && document.motivoRechazo && (
            <span className="text-xs text-red" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{document.motivoRechazo}</span>
          )}
        </div>
        {canReview && <Button variant="outline" size="sm" onClick={() => onReview(document)}>Revisar</Button>}
      </div>
    </div>
  )
}
