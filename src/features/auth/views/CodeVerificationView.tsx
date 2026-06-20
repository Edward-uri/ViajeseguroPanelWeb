import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthLayout } from '../components/AuthLayout'
import { CodeInput } from '../components/CodeInput'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { useCodeVerificationViewModel } from '../viewmodels/useCodeVerificationViewModel'

export function CodeVerificationView() {
  const navigate = useNavigate()
  const location = useLocation()
  const emailOrPhone = (location.state as { emailOrPhone?: string })?.emailOrPhone || 'admin@jala.local'

  const {
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
  } = useCodeVerificationViewModel()

  useEffect(() => {
    startResendCooldown()
  }, [startResendCooldown])

  const handleVerify = async () => {
    if (!isComplete) return
    const success = await verifyCode()
    if (success) {
      navigate('/revision')
    }
  }

  const handleResend = async () => {
    await resendCode()
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            Ingresa el código
          </h1>
          <p className="text-base text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            Enviamos un código de 4 dígitos a{' '}
            <span className="font-semibold text-ink">{emailOrPhone}</span>
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <CodeInput code={code} onChange={updateDigit} disabled={isLoading} />

          {error && <p className="text-sm text-red">{error}</p>}

          <PrimaryButton onClick={handleVerify} disabled={!isComplete} isLoading={isLoading}>
            Verificar y entrar
          </PrimaryButton>
        </div>

        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-primary transition-colors hover:text-primary-light"
              style={{ fontFamily: 'var(--font-family-jakarta)' }}
            >
              Reenviar código
            </button>
          ) : (
            <p className="text-sm text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
              Reenviar código en {countdown}s
            </p>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}
