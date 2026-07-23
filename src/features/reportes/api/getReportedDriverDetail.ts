import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { DetalleConductorReportadoDto } from './reporte.dto.types'

/** Detalle admin de un conductor reportado (contacto + sus reportes). */
export async function getReportedDriverDetail(
  id: string | number,
  signal?: AbortSignal,
): Promise<DetalleConductorReportadoDto> {
  return request<DetalleConductorReportadoDto>(endpoints.admin.reporteDetail(id), { signal })
}
