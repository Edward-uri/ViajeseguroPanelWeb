import type { ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  labelledById?: string
  size?: 'md' | 'lg'
  /** Eleva el z-index para apilarse por encima de otro modal (p. ej. confirmación). */
  elevated?: boolean
}
