import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function refreshSession(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  return request(endpoints.auth.refresh, { method: 'POST', auth: false, body: { refreshToken } })
}
