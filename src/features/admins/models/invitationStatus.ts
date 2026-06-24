import type { BadgeVariant } from '../../../shared/components/StatusBadge'

export interface InvitationStatusInfo {
  label: string
  variant: BadgeVariant
  canResend: boolean
  canRevoke: boolean
}


export function invitationStatus(estado: string): InvitationStatusInfo {
  const s = estado.trim().toLowerCase()
  if (s.startsWith('pendiente')) return { label: 'Pendiente', variant: 'pendiente', canResend: true, canRevoke: true }
  if (s.startsWith('acept')) return { label: 'Aceptada', variant: 'aprobado', canResend: false, canRevoke: false }
  if (s.startsWith('expir')) return { label: 'Expirada', variant: 'rechazado', canResend: true, canRevoke: false }
  if (s.startsWith('revoc')) return { label: 'Revocada', variant: 'neutral', canResend: true, canRevoke: false }
  return { label: estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : '—', variant: 'neutral', canResend: false, canRevoke: false }
}
