import { NavLink } from 'react-router-dom'
import { Logo } from '../components/Logo'

export interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Cola de revisión',
    to: '/revision',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.75 5.5L19.25 5.5L19.25 17.42L2.75 17.42L2.75 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.75 11.92L19.25 11.92" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Vehículos',
    to: '/vehiculos',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 14V9.5C3 8 4 7 5.5 7H12C13 7 13.8 7.5 14.3 8.4L16.5 12.5C16.8 13 17 13.5 17 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 14H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="15.5" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="15.5" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Conductores',
    to: '/conductores',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="7.33" r="3.67" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3.21 18.33C3.21 14.65 6.32 11.67 11 11.67C15.68 11.67 18.79 14.65 18.79 18.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Ajustes',
    to: '/ajustes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="2.75" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 2.75V4.58M11 17.42V19.25M2.75 11H4.58M17.42 11H19.25M5.13 5.13L6.43 6.43M15.57 15.57L16.87 16.87M16.87 5.13L15.57 6.43M6.43 15.57L5.13 16.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-white">
      <div className="flex items-center gap-3 px-6 py-[30px]">
        <Logo size={36} />
        <span className="text-[26px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          Jala
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition-colors duration-150 ${
                isActive
                  ? 'bg-sidebar-active font-semibold text-primary'
                  : 'font-medium text-ink hover:bg-surface'
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-base font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
              Administrador
            </span>
            <span className="text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
              admin@jala.local
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
