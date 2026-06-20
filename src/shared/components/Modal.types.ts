import type { ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  labelledById?: string
  size?: 'md' | 'lg'
}
