import { useState } from 'react'
import { updateProfile } from '../../auth/api/updateProfile'
import { authStore } from '../../../shared/auth/authStore'
import { notify } from '../../../shared/ui/toast'
import type { UpdateProfileInput } from '../../auth/api/updateProfile.types'

export function useEditProfileViewModel() {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const submit = async (input: UpdateProfileInput): Promise<void> => {
    setSaving(true)
    try {
      const user = await updateProfile(input)
      authStore.setUser(user) // refleja el teléfono u otros cambios en la UI
      notify.success('Perfil actualizado.')
      setOpen(false)
    } catch (e) {
      notify.error(e)
    } finally {
      setSaving(false)
    }
  }

  return { open, saving, openModal, closeModal, submit }
}
