import type { Driver, QueueStats } from './types'
import { store, countPendingDocs } from './mockStore'

const delay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const reviewService = {
  getDriverQueue: () =>
    delay(store.drivers.filter((d) => d.status === 'en_revision').map((d) => structuredClone(d))),
  getAllDrivers: () => delay(store.drivers.map((d) => structuredClone(d))),
  getDriverById: (id: string): Promise<Driver | undefined> =>
    delay(structuredClone(store.drivers.find((d) => d.id === id))),
  getDriverQueueStats: (): Promise<QueueStats> => {
    const queue = store.drivers.filter((d) => d.status === 'en_revision')
    return delay({
      inQueue: queue.length,
      pendingDocs: queue.reduce((acc, d) => acc + countPendingDocs(d.documents), 0),
      approvedToday: store.driverApprovedToday,
    })
  },
}
