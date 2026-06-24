import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

/** Revoca una invitación pendiente. */
export async function revokeInvitation(idInvitacion: number): Promise<void> {
  await request<void>(endpoints.admin.invitation(idInvitacion), { method: 'DELETE' })
}
