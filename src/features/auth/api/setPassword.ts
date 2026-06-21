import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

/**
 * Fija o cambia la contraseña del usuario autenticado (requiere sesión).
 * Política del backend: mínimo 8 caracteres, con mayúscula, minúscula y número.
 */
export async function setPassword(password: string): Promise<void> {
  await request<{ ok: boolean }>(endpoints.auth.setPassword, { method: 'POST', body: { password } })
}
