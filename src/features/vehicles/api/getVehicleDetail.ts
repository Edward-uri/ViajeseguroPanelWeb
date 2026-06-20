import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import { documentLabel } from '../../../shared/domain'
import type { VehicleDetail, ReviewDocument } from '../../../shared/domain'
import type { VehiculoDetalleDTO, VehicleDocItemDTO } from './admin.dto.types'

export async function getVehicleDetail(id: string | number): Promise<VehicleDetail> {
  const dto = await request<VehiculoDetalleDTO>(endpoints.admin.vehicleDetail(id))
  const opcionales = new Set(dto.opcionales)
  const documentos: ReviewDocument[] = dto.documentos.map((d: VehicleDocItemDTO) => ({
    idDocumento: d.idDocumento,
    tipo: d.tipo,
    label: documentLabel(d.tipo),
    status: d.estado,
    optional: opcionales.has(d.tipo),
    motivoRechazo: d.motivoRechazo,
  }))
  return {
    idVehiculo: dto.idVehiculo,
    placa: dto.placa,
    modelo: dto.modelo,
    color: dto.color,
    anio: dto.anio,
    idMunicipio: dto.idMunicipio,
    estadoVerificacion: dto.estadoVerificacion,
    documentos,
  }
}
