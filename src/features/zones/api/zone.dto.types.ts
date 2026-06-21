/** Respuesta del backend para una zona (admin). Nota: el centro viene como latCentro/lngCentro. */
export interface ZonaAdminDto {
  idZona: number
  nombre: string
  precio: number
  latCentro: number | null
  lngCentro: number | null
  activo: boolean
}

/** Body de POST /admin/.../zonas. El centro se envía como lat/lng. */
export interface CrearZonaDto {
  nombre: string
  precio: number
  lat?: number
  lng?: number
}

/** Body de PATCH /admin/.../zonas/{idZona}. Todos los campos opcionales. */
export interface ActualizarZonaDto {
  nombre?: string
  precio?: number
  lat?: number
  lng?: number
  activo?: boolean
}
