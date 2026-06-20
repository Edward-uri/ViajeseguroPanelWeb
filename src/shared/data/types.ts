export type DocumentStatus = 'aprobado' | 'pendiente' | 'rechazado' | 'faltante'
export type ReviewStatus = 'en_revision' | 'aprobado' | 'rechazado'
export type DocumentKind =
  | 'licencia' | 'ine_frente' | 'ine_reverso'
  | 'tarjeta_circulacion' | 'foto_vehiculo' | 'permiso_municipal'

export interface ReviewDocument {
  id: string
  kind: DocumentKind
  label: string
  status: DocumentStatus
  optional: boolean
  fileName?: string
  uploadedAt?: string
  rejectionReason?: string
}

export interface DriverLicense {
  number: string
  issuedAt: string
  expiresAt: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  status: ReviewStatus
  license: DriverLicense
  documents: ReviewDocument[]
}

export interface Vehicle {
  id: string
  plate: string
  model: string
  color: string
  year: number
  municipality: string
  ownerName: string
  ownerPhone: string
  status: ReviewStatus
  documents: ReviewDocument[]
}

export interface QueueStats {
  inQueue: number
  pendingDocs: number
  approvedToday: number
}
