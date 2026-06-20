export interface DriverQueueItem {
  idConductor: number
  nombre: string
  telefono: string
  documentosPendientes: number
}

export interface VehicleQueueItem {
  idVehiculo: number
  placa: string
  propietario: string
  telefono: string
  documentosPendientes: number
}

export interface QueueStats {
  inQueue: number
  pendingDocs: number
}
