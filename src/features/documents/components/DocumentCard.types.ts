import type { ReviewDocument } from '../../../shared/domain'

export interface DocumentCardProps {
  document: ReviewDocument
  onReview: (doc: ReviewDocument) => void
}
