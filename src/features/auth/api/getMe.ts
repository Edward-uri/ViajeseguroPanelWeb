import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { AuthUser } from '../../../shared/auth/session.types'

export async function getMe(): Promise<AuthUser> {
  const res = await request<{ data: AuthUser }>(endpoints.users.me)
  return res.data
}
