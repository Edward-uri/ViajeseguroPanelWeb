import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'en_revision' | 'pendiente' | 'aprobado' | 'rechazado'
  | 'faltante' | 'opcional' | 'neutral'

interface StatusBadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

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
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}
      style={{ fontFamily: 'var(--font-family-jakarta)' }}
    >
      {children}
    </span>
  )
}
