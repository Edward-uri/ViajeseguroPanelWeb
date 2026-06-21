import { useNavigate, Navigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../../../shared/components/PasswordField'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { CheckIcon } from '../../../shared/icons'
import { useCreatePasswordViewModel } from '../viewmodels/useCreatePasswordViewModel'
import { useAuth } from '../useAuth'
import { paths } from '../../../routes/paths'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function CreatePasswordView() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const vm = useCreatePasswordViewModel()

  // Solo se llega aquí tras verificar el código (ya hay sesión).
  if (!isAuthenticated) return <Navigate to={paths.login} replace />

  const handleSubmit = async () => {
    if (await vm.submit()) navigate(paths.revision)
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={jakarta}>Crea una contraseña</h1>
          <p className="text-base text-ink-soft" style={jakarta}>Así entras más rápido la próxima vez, sin esperar un código por correo.</p>
        </div>

        <div className="flex flex-col gap-6">
          <PasswordField label="Nueva contraseña" value={vm.password} onChange={vm.setPassword} placeholder="••••••••" disabled={vm.isLoading} autoComplete="new-password" />

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

          <PrimaryButton onClick={handleSubmit} disabled={!vm.canSubmit} isLoading={vm.isLoading}>Guardar contraseña</PrimaryButton>
          <button onClick={() => navigate(paths.revision)} className="text-center text-sm font-medium text-ink-soft transition-colors hover:text-ink" style={jakarta}>Omitir por ahora</button>
        </div>
      </div>
    </AuthLayout>
  )
}
