import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import { toZone } from './mapZone'
import type { Zone } from '../zone.types'
import type { ZonaAdminDto, ActualizarZonaDto } from './zone.dto.types'

/** Edita nombre / precio / centro / estado de una zona (campos parciales). */
export async function updateZone(idMunicipio: number, idZona: number, patch: ActualizarZonaDto): Promise<Zone> {
  const res = await request<{ data: ZonaAdminDto }>(endpoints.admin.zone(idMunicipio, idZona), { method: 'PATCH', body: patch })
  return toZone(res.data)
}
