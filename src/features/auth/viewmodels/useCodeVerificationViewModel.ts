import { useCallback, useEffect, useRef, useState } from 'react'
import { loginVerify } from '../api/loginVerify'
import { loginStart } from '../api/loginStart'
import { useAuth } from '../useAuth'
import { notify } from '../../../shared/ui/toast'

export function useCodeVerificationViewModel(correo: string) {
  const { login } = useAuth()
  const [code, setCode] = useState<string[]>(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const timerRef = useRef<number | null>(null)

  const isComplete = code.every((d) => d !== '')

  const updateDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 1)
    setCode((prev) => prev.map((d, i) => (i === index ? v : d)))
  }

  const startTimer = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          setCanResend(true)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [startTimer])

  // 'revision' = entrar al panel; 'password' = ofrecer crear contraseña; null = falló.
  const verifyCode = useCallback(async (): Promise<'revision' | 'password' | null> => {
    setIsLoading(true)
    try {
      const session = await loginVerify(correo, code.join(''))
      if (session.user.rol !== 'admin') {
        notify.error('Esta cuenta no tiene acceso al panel.')
        return null
      }
      login(session)
      return session.user.tienePassword ? 'revision' : 'password'
    } catch (e) {
      notify.error(e)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [correo, code, login])

  const resendCode = useCallback(async () => {
    try {
      await loginStart(correo)
      notify.info('Código reenviado.')
      setCanResend(false)
      setCountdown(30)
      startTimer()
    } catch (e) {
      notify.error(e)
    }
  }, [correo, startTimer])

  return { code, updateDigit, isLoading, isComplete, canResend, countdown, verifyCode, resendCode }
}
