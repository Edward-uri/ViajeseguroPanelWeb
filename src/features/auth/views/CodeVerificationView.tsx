import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { CodeInput } from '../components/CodeInput'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { useCodeVerificationViewModel } from '../viewmodels/useCodeVerificationViewModel'
import { paths } from '../../../routes/paths'

export function CodeVerificationView() {
  const navigate = useNavigate()
  const location = useLocation()
  const correo = (location.state as { correo?: string } | null)?.correo ?? ''

  const { code, updateDigit, isLoading, isComplete, canResend, countdown, verifyCode, resendCode } = useCodeVerificationViewModel(correo)

  if (!correo) return <Navigate to={paths.login} replace />

  const handleVerify = async () => {
    if (!isComplete) return
    if (await verifyCode()) navigate(paths.revision)
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Ingresa el código</h1>
          <p className="text-base text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            Enviamos un código de 4 dígitos a <span className="font-semibold text-ink">{correo}</span>
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <CodeInput code={code} onChange={updateDigit} disabled={isLoading} />
          <PrimaryButton onClick={handleVerify} disabled={!isComplete} isLoading={isLoading}>Verificar y entrar</PrimaryButton>
        </div>
        <div className="text-center">
          {canResend ? (
            <button onClick={() => { void resendCode() }} className="text-sm font-semibold text-primary transition-colors hover:text-primary-light" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Reenviar código</button>
          ) : (
            <p className="text-sm text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Reenviar código en {countdown}s</p>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}
