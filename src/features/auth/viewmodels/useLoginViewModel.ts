import { useCallback, useState } from 'react'
import { loginStart } from '../api/loginStart'
import { notify } from '../../../shared/ui/toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useLoginViewModel() {
  const [correo, setCorreo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isValid = EMAIL_RE.test(correo.trim())

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

  return { correo, setCorreo, isLoading, isValid, sendCode }
}
