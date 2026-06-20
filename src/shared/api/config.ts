const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3005'
const prefix = import.meta.env.VITE_API_PREFIX ?? '/api'

export const apiConfig = {
  baseUrl: `${base.replace(/\/$/, '')}${prefix}`,
} as const
