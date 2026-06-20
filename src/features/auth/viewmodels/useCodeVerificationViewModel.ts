import { useState, useCallback, useRef } from 'react'

export function useCodeVerificationViewModel() {
  const [code, setCode] = useState<string[]>(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isComplete = code.every((digit) => digit !== '')

  const updateDigit = useCallback((index: number, value: string) => {
    if (value.length > 1) return
    if (value && !/^\d$/.test(value)) return
    setCode((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }, [])

  const verifyCode = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch {
      setError('Codigo incorrecto. Intenta de nuevo.')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startResendCooldown = useCallback(() => {
    setCanResend(false)
    setCountdown(30)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const resendCode = useCallback(async (): Promise<boolean> => {
    if (!canResend) return false
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      startResendCooldown()
      return true
    } catch {
      return false
    }
  }, [canResend, startResendCooldown])

  return {
    code,
    updateDigit,
    isLoading,
    error,
    isComplete,
    canResend,
    countdown,
    verifyCode,
    resendCode,
    startResendCooldown,
  }
}
