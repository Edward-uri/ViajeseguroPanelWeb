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

export interface OnboardingConductorDTO {
  estadoVerificacion: 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'
  licencia: { numero: string; expedicion: string | null; vence: string | null } | null
  requeridos: string[]
  documentos: DocItemDTO[]
}
