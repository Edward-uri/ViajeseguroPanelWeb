import { useCallback, useEffect, useState } from 'react'
import { getReportedDriverDetail } from '../api/getReportedDriverDetail'
import { useConductorAdminActions } from './useConductorAdminActions'
import { friendlyMessage } from '../../../shared/api/errors'
import type { DetalleConductorReportadoDto } from '../api/reporte.dto.types'

export function useReportedDriverDetailViewModel(id: string | undefined) {
  const [detail, setDetail] = useState<DetalleConductorReportadoDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])
  const actions = useConductorAdminActions(retry)

  useEffect(() => {
    if (!id) return
    const ctrl = new AbortController()
    getReportedDriverDetail(id, ctrl.signal)
      .then((d) => { setDetail(d); setError(null); setIsLoading(false) })
      .catch((e) => {
        if (ctrl.signal.aborted) return
        setError(friendlyMessage(e)); setIsLoading(false)
      })
    return () => ctrl.abort()
  }, [id, tick])

  return { detail, isLoading, error, retry, ...actions }
}
