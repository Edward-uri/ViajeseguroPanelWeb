import type { LucideIcon } from '../icons'

export interface StatCardProps {
  value: number | string
  label: string
  accent?: 'primary' | 'success'
  /** Icono opcional mostrado en el chip de la derecha. */
  icon?: LucideIcon
}
