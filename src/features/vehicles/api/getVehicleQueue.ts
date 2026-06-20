import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { VehicleQueueItem, QueueStats } from '../../../shared/domain'
import type { VehicleQueueDTO } from './admin.dto.types'

export async function getVehicleQueue(): Promise<{ items: VehicleQueueItem[]; stats: QueueStats }> {
  const res = await request<{ data: VehicleQueueDTO[] }>(endpoints.admin.vehicleQueue)
  const items: VehicleQueueItem[] = res.data.map((v) => ({
    idVehiculo: v.idVehiculo,
    placa: v.placa,
    propietario: v.propietario,
    telefono: v.telefono,
    documentosPendientes: v.documentosPendientes,
  }))
  const stats: QueueStats = {
    inQueue: items.length,
    pendingDocs: items.reduce((acc, i) => acc + i.documentosPendientes, 0),
  }
  return { items, stats }
}
