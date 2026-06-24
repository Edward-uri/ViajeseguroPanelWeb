import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import type { ZoneMapPickerProps } from './ZoneMapPicker.types'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const DEFAULT_VIEW = { longitude: -93.115, latitude: 16.753, zoom: 11 }

export function ZoneMapPicker({ lat, lng, onChange }: ZoneMapPickerProps) {
  return (
    <div className="h-64 w-full overflow-hidden rounded-xl border border-border">
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={lat != null && lng != null ? { longitude: lng, latitude: lat, zoom: 13 } : DEFAULT_VIEW}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        cursor="crosshair"
        onClick={(e) => onChange(e.lngLat.lat, e.lngLat.lng)}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {lat != null && lng != null && (
          <Marker
            longitude={lng}
            latitude={lat}
            color="#FF8F00"
            draggable
            onDragEnd={(e) => onChange(e.lngLat.lat, e.lngLat.lng)}
          />
        )}
      </Map>
    </div>
  )
}
