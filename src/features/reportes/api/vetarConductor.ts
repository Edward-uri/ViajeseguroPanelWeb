import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

/** Veta a un conductor: suspende su cuenta y revoca sus sesiones. Idempotente. */
export async function vetarConductor(id: string | number): Promise<void> {
  await request<{ ok: true }>(endpoints.admin.vetarConductor(id), { method: 'POST' })
}
