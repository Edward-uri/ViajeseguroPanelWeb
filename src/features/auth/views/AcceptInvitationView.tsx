import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../../../shared/components/PasswordField'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { CheckIcon, WarningIcon } from '../../../shared/icons'
import { useAcceptInvitationViewModel } from '../viewmodels/useAcceptInvitationViewModel'
import { paths } from '../../../routes/paths'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function AcceptInvitationView() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const vm = useAcceptInvitationViewModel(token)

  const handleSubmit = async () => {
    if (await vm.submit()) navigate(paths.revision)
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-bg text-red"><WarningIcon size={30} strokeWidth={1.75} /></span>
          <div>
            <h1 className="text-[28px] font-bold text-ink" style={jakarta}>Invitación no válida</h1>
            <p className="mt-2 text-base text-ink-soft" style={jakarta}>El enlace está incompleto o expiró. Pide una nueva invitación al administrador.</p>
          </div>
          <button onClick={() => navigate(paths.login)} className="text-sm font-semibold text-primary transition-colors hover:text-primary-light" style={jakarta}>Ir al inicio de sesión</button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={jakarta}>Activa tu cuenta</h1>
          <p className="text-base text-ink-soft" style={jakarta}>Crea una contraseña para entrar al panel de administración.</p>
        </div>

        <div className="flex flex-col gap-6">
          <PasswordField label="Contraseña" value={vm.password} onChange={vm.setPassword} placeholder="••••••••" disabled={vm.isLoading} autoComplete="new-password" />

          <ul className="flex flex-col gap-1.5">
            {vm.policy.rules.map((r) => (
              <li key={r.label} className="flex items-center gap-2 text-sm" style={jakarta}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${r.met ? 'bg-success-bg text-success' : 'bg-neutral-bg text-placeholder'}`}>
                  {r.met ? <CheckIcon size={11} strokeWidth={3} /> : <span className="h-1 w-1 rounded-full bg-current" />}
                </span>
                <span className={r.met ? 'text-ink' : 'text-ink-soft'}>{r.label}</span>
              </li>
            ))}
          </ul>

          <PasswordField label="Confirmar contraseña" value={vm.confirm} onChange={vm.setConfirm} placeholder="••••••••" disabled={vm.isLoading} autoComplete="new-password" />
          {vm.confirm.length > 0 && !vm.matches && (
            <p className="-mt-3 text-xs font-medium text-red" style={jakarta}>Las contraseñas no coinciden.</p>
          )}

          <PrimaryButton onClick={handleSubmit} disabled={!vm.canSubmit} isLoading={vm.isLoading}>Activar cuenta y entrar</PrimaryButton>
        </div>
      </div>
    </AuthLayout>
  )
}
