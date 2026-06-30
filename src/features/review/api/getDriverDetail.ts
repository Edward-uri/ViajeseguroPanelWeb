import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import { documentLabel } from '../../../shared/domain'
import type { DriverDetail, ReviewDocument } from '../../../shared/domain'
import type { OnboardingConductorDTO, DocItemDTO } from './admin.dto.types'

function mapDoc(d: DocItemDTO): ReviewDocument {
  return {
    idDocumento: d.idDocumento,
    tipo: d.tipo,
    label: documentLabel(d.tipo),
    status: d.estado,
    optional: false,
    motivoRechazo: d.motivoRechazo,
  }
}

export async function getDriverDetail(id: string | number): Promise<DriverDetail> {
  const dto = await request<OnboardingConductorDTO>(endpoints.admin.driverDetail(id))
  return {
    idConductor: Number(id),
    estadoVerificacion: dto.estadoVerificacion,
    licencia: dto.licencia,
    documentos: dto.documentos.map(mapDoc),
    vehiculo: dto.vehiculo,
  }
}
