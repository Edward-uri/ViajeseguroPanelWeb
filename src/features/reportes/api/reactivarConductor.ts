import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

/** Revierte el veto de un conductor: reactiva su cuenta suspendida. Idempotente. */
export async function reactivarConductor(id: string | number): Promise<void> {
  await request<{ ok: true }>(endpoints.admin.reactivarConductor(id), { method: 'POST' })
}
