import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { Session } from '../../../shared/auth/session.types'

export function loginVerify(correo: string, codigo: string): Promise<Session> {
  return request<Session>(endpoints.auth.loginVerify, { method: 'POST', auth: false, body: { correo, codigo } })
}
