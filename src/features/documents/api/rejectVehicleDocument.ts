import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ReviewDecision } from './reviewDocument.types'

export function rejectVehicleDocument(idDocumento: number, motivoRechazo: string): Promise<void> {
  const body: ReviewDecision = { estado: 'rechazado', motivoRechazo }
  return request<void>(endpoints.admin.vehicleDocPatch(idDocumento), { method: 'PATCH', body })
}
