import type { LucideIcon } from '../icons'
import type { EmptyStateAction } from './EmptyState.types'

export interface QueueStateProps {
  isLoading: boolean
  error: string | null
  isEmpty: boolean
  onRetry: () => void
  /** Configuración del estado vacío. */
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
  emptyTone?: 'neutral' | 'success'
  /** Acción secundaria opcional en el estado vacío (además de "Actualizar"). */
  emptyAction?: EmptyStateAction
}
