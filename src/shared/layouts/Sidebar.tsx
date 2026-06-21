import { NavLink } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { LogoutIcon } from '../icons'
import { navItems } from '../../routes/navigation'
import { useAuth } from '../../features/auth/useAuth'
import { useConfirm } from '../ui/confirm'
import { notify } from '../ui/toast'

export function Sidebar() {
  const { user, logout } = useAuth()
  const confirm = useConfirm()
  const initial = (user?.correoElectronico ?? 'A').charAt(0).toUpperCase()

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
  }

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-white">
      <div className="flex items-center gap-3 px-6 py-[26px]">
        <Logo size={38} />
        <span className="text-[24px] font-bold tracking-tight text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Jala</span>
      </div>

      <p className="px-7 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        Menú
      </p>
      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] transition-colors duration-150 ${
                isActive
                  ? "bg-sidebar-active font-semibold text-primary before:absolute before:left-0 before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-primary before:content-['']"
                  : 'font-medium text-ink-soft hover:bg-surface hover:text-ink'
              }`
            }
            style={{ fontFamily: 'var(--font-family-jakarta)' }}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="m-4 flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initial}</div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Administrador</span>
          <span className="truncate text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{user?.correoElectronico ?? ''}</span>
        </div>
        <button
          onClick={() => { void handleLogout() }}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-danger-bg hover:text-red"
        >
          <LogoutIcon size={18} />
        </button>
      </div>
    </aside>
  )
}
