import type { LucideIcon } from '../icons'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  icon?: LucideIcon
}

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  tone?: 'neutral' | 'success' | 'danger'
  /** Acción principal (CTA) para que el usuario siempre tenga algo que hacer. */
  action?: EmptyStateAction
  /** Acción secundaria opcional (p. ej. ir a otra sección). */
  secondaryAction?: EmptyStateAction
}
