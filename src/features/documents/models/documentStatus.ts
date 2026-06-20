import type { DocumentStatus } from '../../../shared/data/types'
import type { BadgeVariant } from '../../../shared/components/StatusBadge'

export function statusToBadge(status: DocumentStatus, optional: boolean): { variant: BadgeVariant; label: string } {
  switch (status) {
    case 'aprobado': return { variant: 'aprobado', label: 'Aprobado' }
    case 'pendiente': return { variant: 'pendiente', label: 'Pendiente' }
    case 'rechazado': return { variant: 'rechazado', label: 'Rechazado' }
    case 'faltante': return { variant: 'faltante', label: optional ? 'Faltante' : 'Faltante' }
  }
}
