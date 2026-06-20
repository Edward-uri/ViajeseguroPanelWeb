import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { InputField } from '../../../shared/components/InputField'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { useLoginViewModel } from '../viewmodels/useLoginViewModel'
import { paths } from '../../../routes/paths'

export function LoginView() {
  const navigate = useNavigate()
  const { correo, setCorreo, isLoading, isValid, sendCode } = useLoginViewModel()

  const handleSubmit = async () => {
    if (!isValid) return
    const ok = await sendCode()
    if (ok) navigate(paths.verificar, { state: { correo } })
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Inicia sesión</h1>
          <p className="text-base text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Ingresa tu correo para recibir un código.</p>
        </div>
        <div className="flex flex-col gap-6">
          <InputField label="Correo" value={correo} onChange={setCorreo} placeholder="admin@jala.local" type="email" disabled={isLoading} />
          <PrimaryButton onClick={handleSubmit} disabled={!isValid} isLoading={isLoading}>Enviar código</PrimaryButton>
        </div>
        <p className="text-center text-sm text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Solo para administradores de Jala.</p>
      </div>
    </AuthLayout>
  )
}
