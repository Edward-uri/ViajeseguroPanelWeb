import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { DriverAdminDto } from './driver.dto.types'

/** Lista todos los conductores con su estado y vehículos (vista de gestión). */
export async function getDrivers(): Promise<DriverAdminDto[]> {
  const res = await request<{ data: DriverAdminDto[] }>(endpoints.admin.drivers)
  return res.data
}
