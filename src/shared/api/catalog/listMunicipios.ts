import { request } from '../http'
import { endpoints } from '../endpoints'
import type { MunicipioDTO, Municipio } from './municipios.types'

let cache: Municipio[] | null = null

/** Lista de municipios para selectores (cacheada en memoria). */
export async function listMunicipios(): Promise<Municipio[]> {
  if (cache) return cache
  const res = await request<{ data: MunicipioDTO[] }>(endpoints.catalog.municipios)
  cache = res.data.map((m) => ({ idMunicipio: m.idMunicipio, nombre: m.nombre }))
  return cache
}
