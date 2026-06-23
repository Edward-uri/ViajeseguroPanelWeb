/**
 * Modelo de UI para un administrador / invitación.
 *
 * Nota: aún no hay endpoints. Esta forma es la que consumirá la vista; cuando
 * exista el backend se mapeará el DTO real a este tipo en la capa `api/`.
 */
export type AdminStatus = 'activo' | 'pendiente'

export interface AdminAccount {
  idUsuario: number
  correo: string
  estado: AdminStatus
  /** Fecha de invitación o alta (ISO), si aplica. */
  fechaInvitacion: string | null
}
