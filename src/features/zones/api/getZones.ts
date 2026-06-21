import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import { toZone } from './mapZone'
import type { Zone } from '../zone.types'
import type { ZonaAdminDto } from './zone.dto.types'

/** Lista las zonas (activas e inactivas) de un municipio. */
export async function getZones(idMunicipio: number): Promise<Zone[]> {
  const res = await request<{ data: ZonaAdminDto[] }>(endpoints.admin.zones(idMunicipio))
  return res.data.map(toZone)
}
