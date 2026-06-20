import { NavLink } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { navItems } from '../../routes/navigation'
import { useAuth } from '../../features/auth/useAuth'

export function Sidebar() {
  const { user, logout } = useAuth()
  const initial = (user?.correoElectronico ?? 'A').charAt(0).toUpperCase()
  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-white">
      <div className="flex items-center gap-3 px-6 py-[30px]">
        <Logo size={36} />
        <span className="text-[26px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Jala</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition-colors duration-150 ${
                isActive ? 'bg-sidebar-active font-semibold text-primary' : 'font-medium text-ink hover:bg-surface'
              }`
            }
            style={{ fontFamily: 'var(--font-family-jakarta)' }}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-base font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initial}</div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Administrador</span>
            <span className="truncate text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{user?.correoElectronico ?? ''}</span>
          </div>
          <button onClick={() => { void logout() }} aria-label="Cerrar sesión" className="shrink-0 text-ink-soft transition-colors hover:text-red" style={{ fontFamily: 'var(--font-family-jakarta)' }}>⎋</button>
        </div>
      </div>
    </aside>
  )
}
