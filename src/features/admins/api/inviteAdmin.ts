import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export async function inviteAdmin(correo: string): Promise<void> {
  await request(endpoints.admin.invitations, { method: 'POST', body: { correo } })
}
