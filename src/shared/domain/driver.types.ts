import type { ReviewDocument, VerificationStatus } from './document.types'

export interface DriverLicense {
  numero: string
  expedicion: string | null
  vence: string | null
}

export interface DriverVehicle {
  idVehiculo: number
  placa: string
  estadoVerificacion: VerificationStatus
}

export interface DriverDetail {
  idConductor: number
  estadoVerificacion: VerificationStatus
  licencia: DriverLicense | null
  documentos: ReviewDocument[]
  /** Vehículo propio del conductor (null si aún no registra uno). */
  vehiculo: DriverVehicle | null
}
