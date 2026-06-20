import type { AuthUser, Session } from './session.types'

const KEY = 'viajeseguro.session'
const listeners = new Set<() => void>()

function load(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

let session: Session | null = load()

function persist() {
  if (session) localStorage.setItem(KEY, JSON.stringify(session))
  else localStorage.removeItem(KEY)
  listeners.forEach((l) => l())
}

export const authStore = {
  get: () => session,
  getAccessToken: () => session?.accessToken ?? null,
  getRefreshToken: () => session?.refreshToken ?? null,
  set(next: Session) { session = next; persist() },
  setTokens(accessToken: string, refreshToken: string) {
    if (!session) return
    session = { ...session, accessToken, refreshToken }
    persist()
  },
  setUser(user: AuthUser) {
    if (!session) return
    session = { ...session, user }
    persist()
  },
  clear() { session = null; persist() },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l) } },
}
