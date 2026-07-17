import { useCallback, useEffect, useMemo, useState } from 'react'
import { getDrivers } from '../api/getDrivers'
import { friendlyMessage } from '../../../shared/api/errors'
import type { VerificationStatus } from '../../../shared/domain'
import type { DriverAdminDto } from '../api/driver.dto.types'

export type FiltroEstado = 'todos' | VerificationStatus

export function useDriversListViewModel() {
  const [all, setAll] = useState<DriverAdminDto[]>([])
  const [filtro, setFiltro] = useState<FiltroEstado>('todos')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let active = true
    getDrivers()
      .then((res) => { if (!active) return; setAll(res); setError(null); setIsLoading(false) })
      .catch((e) => { if (!active) return; setError(friendlyMessage(e)); setIsLoading(false) })
    return () => { active = false }
  }, [tick])

  const items = useMemo(
    () => (filtro === 'todos' ? all : all.filter((d) => d.estadoVerificacion === filtro)),
    [all, filtro],
  )
  const conteos = useMemo(() => {
    const c: Record<FiltroEstado, number> = { todos: all.length, aprobado: 0, en_revision: 0, incompleto: 0, rechazado: 0 }
    for (const d of all) c[d.estadoVerificacion] += 1
    return c
  }, [all])

  return { items, conteos, filtro, setFiltro, isLoading, error, retry }
}
