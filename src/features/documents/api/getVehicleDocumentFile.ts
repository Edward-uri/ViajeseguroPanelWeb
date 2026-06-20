import { requestBlobUrl } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

export function getVehicleDocumentFile(idDocumento: number): Promise<string> {
  return requestBlobUrl(endpoints.admin.vehicleDocFile(idDocumento))
}
