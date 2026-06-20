import type { ReviewDocument } from '../../../shared/domain'

export interface RejectDocumentModalProps {
  document: ReviewDocument | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (doc: ReviewDocument, reason: string) => void
}
