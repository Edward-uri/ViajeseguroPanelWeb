import { useCallback, useEffect, useState } from 'react'
import { getDriverQueue } from '../api/getDriverQueue'
import { friendlyMessage } from '../../../shared/api/errors'
import type { DriverQueueItem, QueueStats } from '../../../shared/domain'

export function useReviewQueueViewModel() {
  const [items, setItems] = useState<DriverQueueItem[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let active = true
    getDriverQueue()
      .then((res) => {
        if (!active) return
        setItems(res.items)
        setStats(res.stats)
        setError(null)
        setIsLoading(false)
      })
      .catch((e) => {
        if (!active) return
        setError(friendlyMessage(e))
        setIsLoading(false)
      })
    return () => { active = false }
  }, [tick])

  return { items, stats, isLoading, error, retry }
}
