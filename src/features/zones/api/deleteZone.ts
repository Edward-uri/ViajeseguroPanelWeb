import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'

/** Desactiva una zona (soft delete en el backend). */
export async function deleteZone(idMunicipio: number, idZona: number): Promise<void> {
  await request<void>(endpoints.admin.zone(idMunicipio, idZona), { method: 'DELETE' })
}
