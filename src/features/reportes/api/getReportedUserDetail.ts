import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { RolReportado, DetalleUsuarioReportadoDto } from './reporte.dto.types'

/** Detalle admin de un usuario reportado en un rol (contacto + sus reportes de ese rol). */
export async function getReportedUserDetail(
  id: string | number,
  rol: RolReportado,
  signal?: AbortSignal,
): Promise<DetalleUsuarioReportadoDto> {
  return request<DetalleUsuarioReportadoDto>(`${endpoints.admin.reporteDetail(id)}?rol=${rol}`, { signal })
}
