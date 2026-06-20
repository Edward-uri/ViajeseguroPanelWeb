import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function loginStart(correo: string): Promise<void> {
  return request<void>(endpoints.auth.loginStart, { method: 'POST', auth: false, body: { correo } })
}
