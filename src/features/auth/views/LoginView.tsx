import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { InputField } from '../../../shared/components/InputField'
import { PasswordField } from '../../../shared/components/PasswordField'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { useLoginViewModel } from '../viewmodels/useLoginViewModel'
import { paths } from '../../../routes/paths'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function LoginView() {
  const navigate = useNavigate()
  const vm = useLoginViewModel()

  const handlePassword = async () => {
    if (!vm.canPassword) return
    if (await vm.signInWithPassword()) navigate(paths.revision)
  }
  const handleSendCode = async () => {
    if (!vm.canSendCode) return
    if (await vm.sendCode()) navigate(paths.verificar, { state: { correo: vm.correo.trim() } })
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={jakarta}>Inicia sesión</h1>
          <p className="text-base text-ink-soft" style={jakarta}>
            {vm.mode === 'password' ? 'Ingresa tu correo y contraseña.' : 'Ingresa tu correo para recibir un código.'}
          </p>
        </div>

        <div className="flex rounded-xl bg-surface p-1">
          <ModeTab active={vm.mode === 'password'} onClick={() => vm.setMode('password')}>Contraseña</ModeTab>
          <ModeTab active={vm.mode === 'otp'} onClick={() => vm.setMode('otp')}>Código por correo</ModeTab>
        </div>

        {vm.mode === 'password' ? (
          <div className="flex flex-col gap-6">
            <InputField label="Correo" value={vm.correo} onChange={vm.setCorreo} placeholder="admin@jala.local" type="email" disabled={vm.isLoading} />
            <PasswordField label="Contraseña" value={vm.password} onChange={vm.setPassword} placeholder="••••••••" disabled={vm.isLoading} autoComplete="current-password" />
            <PrimaryButton onClick={handlePassword} disabled={!vm.canPassword} isLoading={vm.isLoading}>Entrar</PrimaryButton>
            <p className="text-center text-sm text-ink-soft" style={jakarta}>
              ¿Primera vez o sin contraseña?{' '}
              <button onClick={() => vm.setMode('otp')} className="font-semibold text-primary transition-colors hover:text-primary-light" style={jakarta}>Entra con código</button>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <InputField label="Correo" value={vm.correo} onChange={vm.setCorreo} placeholder="admin@jala.local" type="email" disabled={vm.isLoading} />
            <PrimaryButton onClick={handleSendCode} disabled={!vm.canSendCode} isLoading={vm.isLoading}>Enviar código</PrimaryButton>
            <p className="text-center text-sm text-ink-soft" style={jakarta}>
              ¿Ya tienes contraseña?{' '}
              <button onClick={() => vm.setMode('password')} className="font-semibold text-primary transition-colors hover:text-primary-light" style={jakarta}>Entra con contraseña</button>
            </p>
          </div>
        )}

        <p className="text-center text-sm text-placeholder" style={jakarta}>Solo para administradores de Jala.</p>
      </div>
    </AuthLayout>
  )
}

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${active ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}
      style={jakarta}
    >
      {children}
    </button>
  )
}
