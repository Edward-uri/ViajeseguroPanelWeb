export interface ZoneMapPickerProps {
  lat: number | null
  lng: number | null
  /** Se llama al hacer clic en el mapa o arrastrar el pin. */
  onChange: (lat: number, lng: number) => void
}
