import { useCallback, useState } from 'react'
import { setPassword as setPasswordRequest } from '../api/setPassword'
import { checkPasswordPolicy } from '../models/passwordPolicy'
import { authStore } from '../../../shared/auth/authStore'
import { notify } from '../../../shared/ui/toast'

export function useCreatePasswordViewModel() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const policy = checkPasswordPolicy(password)
  const matches = confirm.length > 0 && password === confirm
  const canSubmit = policy.valid && matches && !isLoading

  const submit = useCallback(async (): Promise<boolean> => {
    if (!policy.valid || !matches) return false
    setIsLoading(true)
    try {
      await setPasswordRequest(password)
      // Reflejar de inmediato que ya tiene contraseña (evita un round-trip a /users/me).
      const current = authStore.get()?.user
      if (current) authStore.setUser({ ...current, tienePassword: true })
      notify.success('Contraseña creada. Ya puedes entrar con tu correo y contraseña.')
      return true
    } catch (e) {
      notify.error(e)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [password, policy.valid, matches])

  return { password, setPassword, confirm, setConfirm, policy, matches, canSubmit, isLoading, submit }
}
