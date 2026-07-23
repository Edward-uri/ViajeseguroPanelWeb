import { useCallback, useEffect, useState } from 'react'
import { getReportedDriverDetail } from '../api/getReportedDriverDetail'
import { vetarConductor } from '../api/vetarConductor'
import { puedeVetar } from '../models/reporteLabels'
import { notify } from '../../../shared/ui/toast'
import { useConfirm } from '../../../shared/ui/confirm'
import { BanIcon } from '../../../shared/icons'
import { friendlyMessage } from '../../../shared/api/errors'
import type { DetalleConductorReportadoDto } from '../api/reporte.dto.types'

export function useReportedDriverDetailViewModel(id: string | undefined) {
  const confirm = useConfirm()
  const [detail, setDetail] = useState<DetalleConductorReportadoDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vetando, setVetando] = useState(false)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])

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

  const vetar = async () => {
    if (!detail || !puedeVetar(detail.estadoCuenta)) return
    const ok = await confirm({
      title: 'Desactivar y vetar conductor',
      message:
        `Se suspenderá la cuenta de ${detail.nombre ?? 'este conductor'} y se cerrarán sus sesiones ` +
        'de inmediato. No podrá volver a iniciar sesión ni operar. Esta acción no se revierte desde el panel.',
      confirmLabel: 'Desactivar y vetar',
      tone: 'danger',
      icon: BanIcon,
    })
    if (!ok) return
    setVetando(true)
    try {
      await vetarConductor(detail.idConductor)
      notify.success('Conductor vetado. Su cuenta quedó suspendida.')
      setTick((n) => n + 1)
    } catch (e) {
      notify.error(e)
    } finally {
      setVetando(false)
    }
  }

  return { detail, isLoading, error, retry, vetar, vetando }
}
