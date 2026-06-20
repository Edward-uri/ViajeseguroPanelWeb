import type { ReviewDocument, VerificationStatus } from './document.types'

export interface VehicleDetail {
  idVehiculo: number
  placa: string
  modelo: string | null
  color: string | null
  anio: number | null
  idMunicipio: number
  estadoVerificacion: VerificationStatus
  documentos: ReviewDocument[]
}
