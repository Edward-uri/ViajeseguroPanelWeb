import type { DocumentStatus } from '../../../shared/domain'
import type { BadgeVariant } from '../../../shared/components/StatusBadge'

export function statusToBadge(status: DocumentStatus): { variant: BadgeVariant; label: string } {
  switch (status) {
    case 'aprobado': return { variant: 'aprobado', label: 'Aprobado' }
    case 'pendiente': return { variant: 'pendiente', label: 'Pendiente' }
    case 'rechazado': return { variant: 'rechazado', label: 'Rechazado' }
    case 'faltante': return { variant: 'faltante', label: 'Faltante' }
  }
}
