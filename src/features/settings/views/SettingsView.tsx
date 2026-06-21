import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'
import { MailIcon, RoleIcon, LogoutIcon } from '../../../shared/icons'
import type { LucideIcon } from '../../../shared/icons'
import { useAuth } from '../../auth/useAuth'
import { useConfirm } from '../../../shared/ui/confirm'
import { notify } from '../../../shared/ui/toast'
import { paths } from '../../../routes/paths'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function SettingsView() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const confirm = useConfirm()
  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Cerrar sesión',
      message: '¿Seguro que quieres salir del panel?',
      confirmLabel: 'Cerrar sesión',
      tone: 'danger',
      icon: LogoutIcon,
    })
    if (!ok) return
    await logout()
    notify.success('Sesión cerrada.')
    navigate(paths.login)
  }
  const initial = (user?.correoElectronico ?? 'A').charAt(0).toUpperCase()
  return (
    <div className="p-8">
      <PageHeader title="Ajustes" subtitle="Perfil y preferencias" />
      <div className="max-w-xl overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center gap-4 border-b border-border p-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-bold text-white" style={jakarta}>{initial}</span>
          <div>
            <div className="text-base font-semibold text-ink" style={jakarta}>{user?.correoElectronico ?? 'Administrador'}</div>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-sidebar-active px-2.5 py-0.5 text-xs font-semibold text-primary" style={jakarta}>
              <RoleIcon size={13} /> {user?.rol ?? 'admin'}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <InfoRow icon={MailIcon} label="Correo" value={user?.correoElectronico ?? '—'} />
          <InfoRow icon={RoleIcon} label="Rol" value={user?.rol ?? 'admin'} />
        </div>
        <div className="border-t border-border p-6">
          <Button variant="dangerOutline" icon={LogoutIcon} onClick={() => { void handleLogout() }}>Cerrar sesión</Button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-ink-soft"><Icon size={18} /></span>
      <div>
        <div className="text-xs text-placeholder" style={jakarta}>{label}</div>
        <div className="text-sm font-semibold text-ink" style={jakarta}>{value}</div>
      </div>
    </div>
  )
}
