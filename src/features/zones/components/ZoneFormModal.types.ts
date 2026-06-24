import type { Zone, ZoneInput } from '../zone.types'

export interface ZoneFormModalProps {
  open: boolean
  zone: Zone | null
  saving: boolean
  onClose: () => void
  onSubmit: (input: ZoneInput) => void
}
