import { requestBlobUrl } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function getDriverDocumentFile(idDocumento: number): Promise<string> {
  return requestBlobUrl(endpoints.admin.driverDocFile(idDocumento))
}
