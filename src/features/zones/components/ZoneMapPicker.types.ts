export interface ZoneMapPickerProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}
