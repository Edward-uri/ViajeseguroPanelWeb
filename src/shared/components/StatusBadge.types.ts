import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'en_revision' | 'pendiente' | 'aprobado' | 'rechazado'
  | 'faltante' | 'opcional' | 'neutral'

export interface StatusBadgeProps {
  variant: BadgeVariant
  children: ReactNode
}
