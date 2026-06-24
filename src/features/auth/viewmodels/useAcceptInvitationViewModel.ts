import { useCallback, useState } from 'react'
import { acceptInvitation } from '../api/acceptInvitation'
import { checkPasswordPolicy } from '../models/passwordPolicy'
import { useAuth } from '../useAuth'
import { notify } from '../../../shared/ui/toast'

export function useAcceptInvitationViewModel(token: string) {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const policy = checkPasswordPolicy(password)
  const matches = confirm.length > 0 && password === confirm
  const canSubmit = !!token && policy.valid && matches && !isLoading

  const submit = useCallback(async (): Promise<boolean> => {
    if (!token || !policy.valid || !matches) return false
    setIsLoading(true)
    try {
      const session = await acceptInvitation(token, password)
      login(session)
      notify.success('¡Listo! Tu cuenta de administrador está activa.')
      return true
    } catch (e) {
      notify.error(e)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [token, password, policy.valid, matches, login])

  return { password, setPassword, confirm, setConfirm, policy, matches, canSubmit, isLoading, submit }
}
