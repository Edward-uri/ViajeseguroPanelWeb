import { useCallback, useEffect, useState } from 'react'
import { getDriverQueue } from '../../review/api/getDriverQueue'
import { friendlyMessage } from '../../../shared/api/errors'
import type { DriverQueueItem } from '../../../shared/domain'

export function useDriversListViewModel() {
  const [items, setItems] = useState<DriverQueueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let active = true
    getDriverQueue()
      .then((res) => { if (!active) return; setItems(res.items); setError(null); setIsLoading(false) })
      .catch((e) => { if (!active) return; setError(friendlyMessage(e)); setIsLoading(false) })
    return () => { active = false }
  }, [tick])

  return { items, isLoading, error, retry }
}
