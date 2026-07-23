import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { ListaConductoresReportadosDto } from './reporte.dto.types'

/** Lista paginada de conductores con reportes acumulados. */
export async function getReportedDrivers(
  page: number,
  perPage = 10,
  signal?: AbortSignal,
): Promise<ListaConductoresReportadosDto> {
  const qs = `?page=${page}&perPage=${perPage}`
  return request<ListaConductoresReportadosDto>(`${endpoints.admin.reportes}${qs}`, { signal })
}
