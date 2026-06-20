import type { Vehicle, QueueStats } from './types'
import { store, countPendingDocs } from './mockStore'

const delay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const vehicleService = {
  getVehicleQueue: () =>
    delay(store.vehicles.filter((v) => v.status === 'en_revision').map((v) => structuredClone(v))),
  getVehicleById: (id: string): Promise<Vehicle | undefined> =>
    delay(structuredClone(store.vehicles.find((v) => v.id === id))),
  getVehicleQueueStats: (): Promise<QueueStats> => {
    const queue = store.vehicles.filter((v) => v.status === 'en_revision')
    return delay({
      inQueue: queue.length,
      pendingDocs: queue.reduce((acc, v) => acc + countPendingDocs(v.documents), 0),
      approvedToday: store.vehicleActivatedToday,
    })
  },
}
