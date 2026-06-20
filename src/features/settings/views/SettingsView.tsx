import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'
import { useAuth } from '../../auth/useAuth'
import { paths } from '../../../routes/paths'

export function SettingsView() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const handleLogout = async () => { await logout(); navigate(paths.login) }
  const initial = (user?.correoElectronico ?? 'A').charAt(0).toUpperCase()
  return (
    <div className="p-8">
      <PageHeader title="Ajustes" subtitle="Perfil y preferencias" />
      <div className="max-w-xl rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-base font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initial}</span>
          <div>
            <div className="text-base font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{user?.correoElectronico ?? 'Administrador'}</div>
            <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Rol: {user?.rol ?? 'admin'}</div>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <Button variant="dangerOutline" onClick={() => { void handleLogout() }}>Cerrar sesión</Button>
        </div>
      </div>
    </div>
  )
}
