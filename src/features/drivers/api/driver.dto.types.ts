import type { VerificationStatus } from '../../../shared/domain'

export interface DriverVehicleDto {
  idVehiculo: number
  placa: string
  modelo: string | null
  activo: boolean
}

export interface DriverAdminDto {
  idConductor: number
  nombre: string
  telefono: string | null
  idMunicipio: number | null
  municipio: string | null
  estadoVerificacion: VerificationStatus
  vehiculos: DriverVehicleDto[]
}
