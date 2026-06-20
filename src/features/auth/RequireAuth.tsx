import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export function RequireAuth() {
  const { isAuthenticated, isReady } = useAuth()
  if (!isReady) {
    return <div className="flex h-screen w-screen items-center justify-center text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
