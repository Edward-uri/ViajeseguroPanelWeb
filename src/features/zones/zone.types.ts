/** Zona con su tarifa, tal como la usa la UI del panel. */
export interface Zone {
  idZona: number
  nombre: string
  precio: number
  latCentro: number | null
  lngCentro: number | null
  activo: boolean
}

/** Datos que captura el formulario al crear/editar una zona. */
export interface ZoneInput {
  nombre: string
  precio: number
  lat: number | null
  lng: number | null
}
