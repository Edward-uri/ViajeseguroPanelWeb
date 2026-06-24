import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { Session } from '../../../shared/auth/session.types'

/**
 * Acepta una invitación de admin: fija la contraseña, crea la cuenta y abre sesión.
 * El `token` viene en el enlace del correo de invitación.
 */
export function acceptInvitation(token: string, password: string): Promise<Session> {
  return request<Session>(endpoints.auth.acceptInvitation, { method: 'POST', auth: false, body: { token, password } })
}
