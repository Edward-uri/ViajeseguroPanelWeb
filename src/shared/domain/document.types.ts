export type DocumentStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'faltante'
export type VerificationStatus = 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'

export interface ReviewDocument {
  idDocumento: number | null
  tipo: string
  label: string
  status: DocumentStatus
  optional: boolean
  motivoRechazo: string | null
}
