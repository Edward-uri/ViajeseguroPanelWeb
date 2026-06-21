import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import { toZone } from './mapZone'
import type { Zone, ZoneInput } from '../zone.types'
import type { ZonaAdminDto, CrearZonaDto } from './zone.dto.types'

/** Crea una zona con su tarifa vigente en el municipio. */
export async function createZone(idMunicipio: number, input: ZoneInput): Promise<Zone> {
  const body: CrearZonaDto = { nombre: input.nombre, precio: input.precio }
  if (input.lat != null) body.lat = input.lat
  if (input.lng != null) body.lng = input.lng
  const res = await request<{ data: ZonaAdminDto }>(endpoints.admin.zones(idMunicipio), { method: 'POST', body })
  return toZone(res.data)
}
