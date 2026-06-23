import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Logo } from '../components/Logo'
import { MenuIcon } from '../icons'

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false)

  // Cerrar el drawer con Escape (solo relevante en pantallas pequeñas).
  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F7F6F4 0%, #EEECEA 100%)' }}
    >
      {/* Resplandores de marca: dan color al cristal del sidebar para que "se note". */}
      <div className="pointer-events-none absolute -left-24 top-12 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-4 h-80 w-80 rounded-full bg-primary-light/15 blur-3xl" />

      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      {/* Fondo oscuro del drawer (solo móvil/tablet) */}
      {navOpen && (
        <div className="fixed inset-0 z-20 bg-ink/30 backdrop-blur-sm lg:hidden" onClick={() => setNavOpen(false)} aria-hidden />
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Barra superior con hamburguesa (solo debajo de lg) */}
        <header className="flex items-center gap-3 border-b border-border/60 bg-white/70 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setNavOpen(true)}
            aria-label="Abrir menú"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-white/60"
          >
            <MenuIcon size={22} />
          </button>
          <Logo size={26} />
          <span className="text-lg font-bold tracking-tight text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Jala</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
