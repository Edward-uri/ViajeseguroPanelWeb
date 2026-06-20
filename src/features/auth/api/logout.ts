import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function logout(refreshToken: string): Promise<void> {
  return request<void>(endpoints.auth.logout, { method: 'POST', body: { refreshToken } })
}
