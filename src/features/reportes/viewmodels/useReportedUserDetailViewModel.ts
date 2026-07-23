import { useCallback, useEffect, useState } from 'react'
import { getReportedUserDetail } from '../api/getReportedUserDetail'
import { useConductorAdminActions } from './useConductorAdminActions'
import { friendlyMessage } from '../../../shared/api/errors'
import type { RolReportado, DetalleUsuarioReportadoDto } from '../api/reporte.dto.types'

export function useReportedUserDetailViewModel(id: string | undefined, rol: RolReportado | undefined) {
  const [detail, setDetail] = useState<DetalleUsuarioReportadoDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])
  const actions = useConductorAdminActions(retry)

  useEffect(() => {
    if (!id || !rol) return
    const ctrl = new AbortController()
    getReportedUserDetail(id, rol, ctrl.signal)
      .then((d) => { setDetail(d); setError(null); setIsLoading(false) })
      .catch((e) => {
        if (ctrl.signal.aborted) return
        setError(friendlyMessage(e)); setIsLoading(false)
      })
    return () => ctrl.abort()
  }, [id, rol, tick])

  return { detail, isLoading, error, retry, ...actions }
}
