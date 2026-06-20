import type { ReviewDocument } from '../../../shared/domain'

export interface DocumentViewerModalProps {
  document: ReviewDocument | null
  isOpen: boolean
  fileUrl: string | null
  fileLoading: boolean
  onClose: () => void
  onApprove: (doc: ReviewDocument) => void
  onReject: (doc: ReviewDocument) => void
}
