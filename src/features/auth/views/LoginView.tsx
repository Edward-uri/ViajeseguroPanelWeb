import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { InputField } from '../../../shared/components/InputField'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { useLoginViewModel } from '../viewmodels/useLoginViewModel'

export function LoginView() {
  const navigate = useNavigate()
  const { emailOrPhone, setEmailOrPhone, isLoading, error, isValid, sendCode } = useLoginViewModel()

  const handleSubmit = async () => {
    if (!isValid) return
    const success = await sendCode()
    if (success) {
      navigate('/verificar', { state: { emailOrPhone } })
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            Inicia sesión
          </h1>
          <p className="text-base text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            Ingresa tu correo o teléfono para recibir un código.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <InputField
            label="Correo o teléfono"
            value={emailOrPhone}
            onChange={setEmailOrPhone}
            placeholder="admin@jala.local"
            type="text"
            disabled={isLoading}
          />

          {error && <p className="text-sm text-red">{error}</p>}

          <PrimaryButton onClick={handleSubmit} disabled={!isValid} isLoading={isLoading}>
            Enviar código
          </PrimaryButton>
        </div>

        <p className="text-center text-sm text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          Solo para administradores de Jala.
        </p>
      </div>
    </AuthLayout>
  )
}
