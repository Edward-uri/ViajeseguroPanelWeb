import { useEffect, useState } from 'react'
import { vehicleService, type Vehicle, type QueueStats } from '../../../shared/data'

export function useVehicleQueueViewModel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([vehicleService.getVehicleQueue(), vehicleService.getVehicleQueueStats()]).then(
      ([q, s]) => { if (active) { setVehicles(q); setStats(s); setIsLoading(false) } },
    )
    return () => { active = false }
  }, [])

  return { vehicles, stats, isLoading }
}
