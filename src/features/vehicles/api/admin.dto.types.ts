export interface VehicleDocItemDTO {
  tipo: string
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'faltante'
  idDocumento: number | null
  motivoRechazo: string | null
}

export interface VehicleQueueDTO {
  idVehiculo: number
  placa: string
  propietario: string
  telefono: string
  documentosPendientes: number
}

export interface VehiculoDetalleDTO {
  idVehiculo: number
  placa: string
  modelo: string | null
  color: string | null
  anio: number | null
  idMunicipio: number
  estadoVerificacion: 'incompleto' | 'en_revision' | 'rechazado' | 'aprobado'
  requeridos: string[]
  opcionales: string[]
  documentos: VehicleDocItemDTO[]
}
