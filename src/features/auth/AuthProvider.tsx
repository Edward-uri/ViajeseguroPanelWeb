import { useEffect, useState, type ReactNode } from 'react'
import { authStore } from '../../shared/auth/authStore'
import { getMe } from './api/getMe'
import { logout as logoutRequest } from './api/logout'
import { AuthContext } from './AuthContext'
import type { AuthUser, Session } from '../../shared/auth/session.types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(authStore.get()?.user ?? null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => authStore.subscribe(() => setUser(authStore.get()?.user ?? null)), [])

  useEffect(() => {
    let active = true
    if (!authStore.getAccessToken()) { Promise.resolve().then(() => { if (active) setIsReady(true) }); return }
    getMe()
      .then((u) => { if (active) authStore.setUser(u) })
      .catch(() => { if (active) authStore.clear() })
      .finally(() => { if (active) setIsReady(true) })
    return () => { active = false }
  }, [])

  const login = (session: Session) => authStore.set(session)
  const logout = async () => {
    const rt = authStore.getRefreshToken()
    if (rt) { try { await logoutRequest(rt) } catch { /* ignore network errors on logout */ } }
    authStore.clear()
  }

  return (
    <AuthContext value={{ user, isAuthenticated: !!user, isReady, login, logout }}>
      {children}
    </AuthContext>
  )
}
