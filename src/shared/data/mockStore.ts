import type { Driver, Vehicle, ReviewDocument } from './types'
import { seedDrivers, seedVehicles, seedStats } from './seed'

const clone = <T>(v: T): T => structuredClone(v)

interface MockStore {
  drivers: Driver[]
  vehicles: Vehicle[]
  driverApprovedToday: number
  vehicleActivatedToday: number
}

export const store: MockStore = {
  drivers: clone(seedDrivers),
  vehicles: clone(seedVehicles),
  driverApprovedToday: seedStats.driverApprovedToday,
  vehicleActivatedToday: seedStats.vehicleActivatedToday,
}

export function findDocument(docId: string): ReviewDocument | undefined {
  for (const d of store.drivers) {
    const found = d.documents.find((x) => x.id === docId)
    if (found) return found
  }
  for (const v of store.vehicles) {
    const found = v.documents.find((x) => x.id === docId)
    if (found) return found
  }
  return undefined
}

export function countPendingDocs(docs: ReviewDocument[]): number {
  return docs.filter((x) => x.status === 'pendiente').length
}
