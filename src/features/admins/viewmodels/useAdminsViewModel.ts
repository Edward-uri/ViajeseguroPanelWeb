import { useState } from 'react'
import { useConfirm } from '../../../shared/ui/confirm'
import { notify } from '../../../shared/ui/toast'
import { RevokeIcon } from '../../../shared/icons'
import type { AdminAccount } from '../admin.types'

/**
 * ViewModel de Administradores.
 *
 * ⚠️ Aún SIN backend: la lista está vacía (no se inventa data) y las acciones
 * son stubs que avisan al usuario. Para conectar más adelante:
 *   - Crear casos de uso en `features/admins/api/`:
 *       · listAdmins(): Promise<AdminAccount[]>        → reemplaza `admins = []`
 *       · inviteAdmin(correo): Promise<void>           → en `invite`
 *       · resendInvite(idUsuario): Promise<void>       → en `resendInvite`
 *       · revokeAdmin(idUsuario): Promise<void>        → en `revokeAccess`
 *   - Cambiar los `notify.info(...)` por la llamada real + refresco de la lista.
 */
export function useAdminsViewModel() {
  const confirm = useConfirm()
  const [admins] = useState<AdminAccount[]>([]) // sin datos hasta conectar el backend
  const [inviteOpen, setInviteOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const openInvite = () => setInviteOpen(true)
  const closeInvite = () => setInviteOpen(false)

  const invite = async (correo: string): Promise<void> => {
    setSending(true)
    try {
      // TODO(backend): await inviteAdmin(correo); luego refrescar la lista.
      await Promise.resolve()
      notify.info(`Vista lista: la invitación a ${correo} se enviará al conectar el backend.`)
      setInviteOpen(false)
    } finally {
      setSending(false)
    }
  }

  const resendInvite = async (admin: AdminAccount): Promise<void> => {
    // TODO(backend): await resendInvite(admin.idUsuario); luego toast de éxito.
    notify.info(`Reenviar invitación a ${admin.correo} estará disponible al conectar el backend.`)
  }

  const revokeAccess = async (admin: AdminAccount): Promise<void> => {
    const ok = await confirm({
      title: 'Revocar acceso',
      message: `${admin.correo} dejará de tener acceso al panel. ¿Continuar?`,
      confirmLabel: 'Revocar',
      tone: 'danger',
      icon: RevokeIcon,
    })
    if (!ok) return
    // TODO(backend): await revokeAdmin(admin.idUsuario); luego refrescar la lista.
    notify.info('Revocar acceso estará disponible al conectar el backend.')
  }

  return { admins, inviteOpen, sending, openInvite, closeInvite, invite, resendInvite, revokeAccess }
}
