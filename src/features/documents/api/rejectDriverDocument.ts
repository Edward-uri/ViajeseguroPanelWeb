import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ReviewDecision } from './reviewDocument.types'

export function rejectDriverDocument(idDocumento: number, motivoRechazo: string): Promise<void> {
  const body: ReviewDecision = { estado: 'rechazado', motivoRechazo }
  return request<void>(endpoints.admin.driverDocPatch(idDocumento), { method: 'PATCH', body })
}
