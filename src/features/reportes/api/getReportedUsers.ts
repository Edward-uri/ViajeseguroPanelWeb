import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ListaUsuariosReportadosDto } from './reporte.dto.types'

/** Lista paginada de usuarios con reportes (conductores y pasajeros). */
export async function getReportedUsers(
  page: number,
  perPage = 10,
  signal?: AbortSignal,
): Promise<ListaUsuariosReportadosDto> {
  const qs = `?page=${page}&perPage=${perPage}`
  return request<ListaUsuariosReportadosDto>(`${endpoints.admin.reportes}${qs}`, { signal })
}
