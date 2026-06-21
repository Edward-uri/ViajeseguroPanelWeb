import type { Zone } from '../zone.types'
import type { ZonaAdminDto } from './zone.dto.types'

/** Mapea el DTO del backend a la entidad de UI. */
export const toZone = (d: ZonaAdminDto): Zone => ({
  idZona: d.idZona,
  nombre: d.nombre,
  precio: d.precio,
  latCentro: d.latCentro,
  lngCentro: d.lngCentro,
  activo: d.activo,
})
