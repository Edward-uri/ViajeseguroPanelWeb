import { useEffect, useState } from 'react'
import { reviewService, type Driver, type QueueStats } from '../../../shared/data'

export function useReviewQueueViewModel() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([reviewService.getDriverQueue(), reviewService.getDriverQueueStats()]).then(
      ([q, s]) => { if (active) { setDrivers(q); setStats(s); setIsLoading(false) } },
    )
    return () => { active = false }
  }, [])

  return { drivers, stats, isLoading }
}
