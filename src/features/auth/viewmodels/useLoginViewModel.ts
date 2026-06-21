import { useCallback, useState } from 'react'
import { loginStart } from '../api/loginStart'
import { loginPassword } from '../api/loginPassword'
import { useAuth } from '../useAuth'
import { notify } from '../../../shared/ui/toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type LoginMode = 'password' | 'otp'

export function useLoginViewModel() {
  const { login } = useAuth()
  const [mode, setMode] = useState<LoginMode>('password')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const emailValid = EMAIL_RE.test(correo.trim())
  const canPassword = emailValid && password.length > 0
  const canSendCode = emailValid

  const sendCode = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      await loginStart(correo.trim())
      notify.success(`Te enviamos un código a ${correo.trim()}`)
      return true
    } catch (e) {
      notify.error(e)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [correo])

  const signInWithPassword = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const session = await loginPassword(correo.trim(), password)
      if (session.user.rol !== 'admin') {
        notify.error('Esta cuenta no tiene acceso al panel.')
        return false
      }
      login(session)
      return true
    } catch (e) {
      notify.error(e)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [correo, password, login])

  return { mode, setMode, correo, setCorreo, password, setPassword, isLoading, emailValid, canPassword, canSendCode, sendCode, signInWithPassword }
}
