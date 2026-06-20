export class ApiError extends Error {
  code: string
  status: number
  details?: unknown
  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

const MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Revisa los datos e inténtalo de nuevo.',
  UNAUTHORIZED: 'Tu sesión expiró. Inicia de nuevo.',
  FORBIDDEN: 'Esta cuenta no tiene acceso al panel.',
  NOT_FOUND: 'No se encontró el recurso solicitado.',
  OTP_INVALID: 'El código es incorrecto.',
  OTP_EXPIRED: 'El código expiró. Solicita uno nuevo.',
  RATE_LIMITED: 'Demasiados intentos. Espera un momento.',
}

export function friendlyMessage(e: unknown): string {
  if (e instanceof ApiError) return MESSAGES[e.code] ?? e.message ?? 'Ocurrió un error.'
  if (e instanceof TypeError) return 'No se pudo conectar con el servidor.'
  return 'Ocurrió un error inesperado.'
}
