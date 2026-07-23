import { useCallback, useState } from 'react'
import { vetarConductor } from '../api/vetarConductor'
import { reactivarConductor } from '../api/reactivarConductor'
import { notify } from '../../../shared/ui/toast'
import { useConfirm } from '../../../shared/ui/confirm'
import { BanIcon, PowerIcon } from '../../../shared/icons'

/**
 * Acciones de moderación sobre un conductor (vetar / reactivar), compartidas por
 * el detalle de reportes y la lista de conductores. `onDone` refresca la vista.
 * `busyId` marca la fila en curso para deshabilitar sus botones.
 */
export function useConductorAdminActions(onDone: () => void) {
  const confirm = useConfirm()
  const [busyId, setBusyId] = useState<number | null>(null)

  const vetar = useCallback(async (id: number, nombre: string | null) => {
    const ok = await confirm({
      title: 'Desactivar y vetar conductor',
      message:
        `Se suspenderá la cuenta de ${nombre ?? 'este conductor'} y se cerrarán sus sesiones de inmediato. ` +
        'No podrá iniciar sesión ni operar hasta que lo reactives.',
      confirmLabel: 'Desactivar y vetar',
      tone: 'danger',
      icon: BanIcon,
    })
    if (!ok) return
    setBusyId(id)
    try {
      await vetarConductor(id)
      notify.success('Conductor vetado. Su cuenta quedó suspendida.')
      onDone()
    } catch (e) {
      notify.error(e)
    } finally {
      setBusyId(null)
    }
  }, [confirm, onDone])

  const reactivar = useCallback(async (id: number, nombre: string | null) => {
    const ok = await confirm({
      title: 'Reactivar conductor',
      message: `Se reactivará la cuenta de ${nombre ?? 'este conductor'}. Podrá volver a iniciar sesión y operar.`,
      confirmLabel: 'Reactivar',
      icon: PowerIcon,
    })
    if (!ok) return
    setBusyId(id)
    try {
      await reactivarConductor(id)
      notify.success('Conductor reactivado.')
      onDone()
    } catch (e) {
      notify.error(e)
    } finally {
      setBusyId(null)
    }
  }, [confirm, onDone])

  return { vetar, reactivar, busyId }
}
