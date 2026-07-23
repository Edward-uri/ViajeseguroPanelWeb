import { useCallback, useEffect, useState } from 'react'
import { getReportedUsers } from '../api/getReportedUsers'
import { friendlyMessage } from '../../../shared/api/errors'
import type { UsuarioReportadoDto } from '../api/reporte.dto.types'

const PER_PAGE = 10

export function useReportsListViewModel() {
  const [items, setItems] = useState<UsuarioReportadoDto[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [umbral, setUmbral] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])
  const goToPage = useCallback((p: number) => setPage(p), [])

  useEffect(() => {
    const ctrl = new AbortController()
    getReportedUsers(page, PER_PAGE, ctrl.signal)
      .then((res) => {
        setItems(res.data)
        setTotal(res.total)
        setTotalPages(res.totalPages)
        setUmbral(res.umbral)
        setError(null)
        setIsLoading(false)
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return
        setError(friendlyMessage(e))
        setIsLoading(false)
      })
    return () => ctrl.abort()
  }, [page, tick])

  return { items, page, totalPages, total, umbral, isLoading, error, retry, goToPage }
}
