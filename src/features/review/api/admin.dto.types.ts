export interface DocItemDTO {
  tipo: string
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'faltante'
  idDocumento: number | null
  motivoRechazo: string | null
}

export interface DriverQueueDTO {
  idConductor: number
  nombre: string
  telefono: string
  documentosPendientes: number
}

export interface ConductorVehiculoDTO {
  idVehiculo: number
  placa: string
  estadoVerificacion: 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'
}

export interface OnboardingConductorDTO {
  /** Estado solo de los documentos personales del conductor. */
  estadoVerificacion: 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'
  /** Estado combinado (documentos + vehículo): si el conductor puede operar. */
  estadoGlobal: 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'
  licencia: { numero: string; expedicion: string | null; vence: string | null } | null
  requeridos: string[]
  documentos: DocItemDTO[]
  /** Vehículo propio del conductor (null si aún no registra uno). */
  vehiculo: ConductorVehiculoDTO | null
}
