import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ReviewDecision } from './reviewDocument.types'

export function approveDriverDocument(idDocumento: number): Promise<void> {
  const body: ReviewDecision = { estado: 'aprobado' }
  return request<void>(endpoints.admin.driverDocPatch(idDocumento), { method: 'PATCH', body })
}
