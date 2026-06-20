import type { ReviewDocument, VerificationStatus } from './document.types'

export interface DriverLicense {
  numero: string
  expedicion: string | null
  vence: string | null
}

export interface DriverDetail {
  idConductor: number
  estadoVerificacion: VerificationStatus
  licencia: DriverLicense | null
  documentos: ReviewDocument[]
}
