import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { AdminInvitation } from '../admin.types'
import type { InvitationDto } from './invitation.dto.types'

/** Lista las invitaciones de admin. */
export async function getInvitations(): Promise<AdminInvitation[]> {
  const res = await request<{ data: InvitationDto[] }>(endpoints.admin.invitations)
  return res.data.map((d) => ({
    idInvitacion: d.idInvitacion,
    correo: d.correo,
    estado: d.estado,
    expiraEn: d.expiraEn ?? null,
    createdAt: d.createdAt ?? null,
  }))
}
