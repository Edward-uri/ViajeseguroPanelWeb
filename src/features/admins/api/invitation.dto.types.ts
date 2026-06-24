export interface InvitationDto {
  idInvitacion: number
  correo: string
  estado: string
  expiraEn: string | null
  invitadoPor?: number | null
  createdAt?: string | null
}
