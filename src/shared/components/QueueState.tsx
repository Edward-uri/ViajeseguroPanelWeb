import { Button } from './Button'
import type { QueueStateProps } from './QueueState.types'

export function QueueState({ isLoading, error, isEmpty, emptyText, onRetry }: QueueStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-bg" />
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white py-12">
        <p className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>Reintentar</Button>
      </div>
    )
  }
  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-border bg-white py-12 text-center text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {emptyText}
      </div>
    )
  }
  return null
}
