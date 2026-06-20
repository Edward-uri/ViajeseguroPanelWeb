import { request } from '../http'
import { endpoints } from '../endpoints'
import type { MunicipioDTO } from './municipios.types'

let cache: Map<number, string> | null = null

async function load(): Promise<Map<number, string>> {
  if (cache) return cache
  const res = await request<{ data: MunicipioDTO[] }>(endpoints.catalog.municipios)
  cache = new Map(res.data.map((m) => [m.idMunicipio, m.nombre]))
  return cache
}

export async function getMunicipioName(id: number): Promise<string> {
  try {
    const map = await load()
    return map.get(id) ?? `Municipio #${id}`
  } catch {
    return `Municipio #${id}`
  }
}
