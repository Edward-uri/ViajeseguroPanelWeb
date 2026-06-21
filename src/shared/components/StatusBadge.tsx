import type { BadgeVariant, StatusBadgeProps } from './StatusBadge.types'

export type { BadgeVariant } from './StatusBadge.types'

const styles: Record<BadgeVariant, string> = {
  en_revision: 'bg-warning-bg text-warning',
  pendiente: 'bg-warning-bg text-warning',
  aprobado: 'bg-success-bg text-success',
  rechazado: 'bg-danger-bg text-red',
  faltante: 'bg-danger-bg text-red',
  opcional: 'bg-neutral-bg text-ink-soft',
  neutral: 'bg-neutral-bg text-ink-soft',
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[variant]}`}
      style={{ fontFamily: 'var(--font-family-jakarta)' }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
