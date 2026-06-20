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
    let cancelled = false
    setIsLoading(true)
    setError(null)
    getDriverQueue()
      .then((res) => {
        if (cancelled) return
        setItems(res.items)
        setStats(res.stats)
      })
      .catch((e) => { if (!cancelled) setError(friendlyMessage(e)) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [tick])

  return { items, stats, isLoading, error, retry }
}
