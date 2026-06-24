export interface ZonaAdminDto {
  idZona: number
  nombre: string
  precio: number
  latCentro: number | null
  lngCentro: number | null
  activo: boolean
}

export interface CrearZonaDto {
  nombre: string
  precio: number
  lat?: number
  lng?: number
}

export interface ActualizarZonaDto {
  nombre?: string
  precio?: number
  lat?: number
  lng?: number
  activo?: boolean
}
