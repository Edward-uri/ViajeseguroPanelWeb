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
