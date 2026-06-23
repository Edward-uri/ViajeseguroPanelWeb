import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { AuthUser } from '../../../shared/auth/session.types'
import type { UpdateProfileInput } from './updateProfile.types'

/**
 * Edita el perfil del usuario autenticado (PUT /users/me).
 * `input` debe traer solo los campos a actualizar. Devuelve el perfil ya actualizado.
 */
export async function updateProfile(input: UpdateProfileInput): Promise<AuthUser> {
  const res = await request<{ data: AuthUser }>(endpoints.users.me, { method: 'PUT', body: input })
  return res.data
}
