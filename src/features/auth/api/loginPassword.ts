import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { Session } from '../../../shared/auth/session.types'

/** Login con correo + contraseña (usuarios que ya fijaron su contraseña). */
export function loginPassword(correo: string, password: string): Promise<Session> {
  return request<Session>(endpoints.auth.loginPassword, { method: 'POST', auth: false, body: { correo, password } })
}
