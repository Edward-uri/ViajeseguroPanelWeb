import { apiConfig } from './config'
import { authStore } from '../auth/authStore'
import { ApiError } from './errors'
import type { ApiErrorBody } from './errors.types'

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

let refreshing: Promise<boolean> | null = null

async function doRefresh(): Promise<boolean> {
  const rt = authStore.getRefreshToken()
  if (!rt) return false
  try {
    const res = await fetch(`${apiConfig.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { accessToken: string; refreshToken: string }
    authStore.setTokens(data.accessToken, data.refreshToken)
    return true
  } catch {
    return false
  }
}

function buildInit(opts: RequestOptions): RequestInit {
  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (opts.auth !== false) {
    const token = authStore.getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  }
}

async function send(path: string, opts: RequestOptions): Promise<Response> {
  let res = await fetch(`${apiConfig.baseUrl}${path}`, buildInit(opts))
  if (res.status === 401 && opts.auth !== false && authStore.getRefreshToken()) {
    refreshing = refreshing ?? doRefresh()
    const ok = await refreshing
    refreshing = null
    if (ok) res = await fetch(`${apiConfig.baseUrl}${path}`, buildInit(opts))
    else authStore.clear()
  }
  return res
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await send(path, opts)
  if (res.status === 204) return undefined as T
  const text = await res.text()
  const json: unknown = text ? JSON.parse(text) : undefined
  if (!res.ok) {
    const body = json as ApiErrorBody | undefined
    throw new ApiError(body?.error?.code ?? 'UNKNOWN', body?.error?.message ?? res.statusText, res.status, body?.error?.details)
  }
  return json as T
}

export async function requestBlobUrl(path: string): Promise<string> {
  const res = await send(path, { auth: true })
  if (!res.ok) throw new ApiError('FILE_ERROR', 'No se pudo cargar el archivo.', res.status)
  return URL.createObjectURL(await res.blob())
}
