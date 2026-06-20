import { useState, useCallback } from 'react'

export function useLoginViewModel() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = emailOrPhone.trim().length > 0

  const sendCode = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch {
      setError('Error al enviar el codigo. Intenta de nuevo.')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    emailOrPhone,
    setEmailOrPhone,
    isLoading,
    error,
    isValid,
    sendCode,
  }
}
