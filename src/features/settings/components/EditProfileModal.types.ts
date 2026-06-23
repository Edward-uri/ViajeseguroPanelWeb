import type { UpdateProfileInput } from '../../auth/api/updateProfile.types'

export interface EditProfileModalProps {
  open: boolean
  saving: boolean
  /** Teléfono actual, para precargar el campo. */
  defaultPhone: string
  onClose: () => void
  onSubmit: (input: UpdateProfileInput) => void
}
