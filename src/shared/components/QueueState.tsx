import { EmptyState } from './EmptyState'
import { RefreshIcon, WarningIcon } from '../icons'
import type { QueueStateProps } from './QueueState.types'

export function QueueState({
  isLoading,
  error,
  isEmpty,
  onRetry,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyTone = 'neutral',
  emptyAction,
}: QueueStateProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-bg" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-40 animate-pulse rounded bg-neutral-bg" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-neutral-bg" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-bg" />
          </div>
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <EmptyState
        icon={WarningIcon}
        tone="danger"
        title="No se pudo cargar"
        description={error}
        action={{ label: 'Reintentar', icon: RefreshIcon, onClick: onRetry }}
      />
    )
  }
  if (isEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        tone={emptyTone}
        title={emptyTitle}
        description={emptyDescription}
        action={{ label: 'Actualizar', icon: RefreshIcon, onClick: onRetry }}
        secondaryAction={emptyAction}
      />
    )
  }
  return null
}
