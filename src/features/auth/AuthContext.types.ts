import type { AuthUser, Session } from '../../shared/auth/session.types'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isReady: boolean
  login: (session: Session) => void
  logout: () => Promise<void>
}
