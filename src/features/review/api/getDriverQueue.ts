import { request } from '../../../shared/api/http'
import { endpoints } from '../../../shared/api/endpoints'
import type { DriverQueueItem, QueueStats } from '../../../shared/domain'
import type { DriverQueueDTO } from './admin.dto.types'

export async function getDriverQueue(): Promise<{ items: DriverQueueItem[]; stats: QueueStats }> {
  const res = await request<{ data: DriverQueueDTO[] }>(endpoints.admin.driverQueue)
  const items: DriverQueueItem[] = res.data.map((d) => ({
    idConductor: d.idConductor,
    nombre: d.nombre,
    telefono: d.telefono,
    documentosPendientes: d.documentosPendientes,
  }))
  const stats: QueueStats = {
    inQueue: items.length,
    pendingDocs: items.reduce((acc, i) => acc + i.documentosPendientes, 0),
  }
  return { items, stats }
}
