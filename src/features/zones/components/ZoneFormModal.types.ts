import type { Zone, ZoneInput } from '../zone.types'

export interface ZoneFormModalProps {
  open: boolean
  /** Zona a editar, o `null` para crear una nueva. */
  zone: Zone | null
  saving: boolean
  onClose: () => void
  onSubmit: (input: ZoneInput) => void
}
