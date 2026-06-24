import { useCallback, useEffect, useState } from 'react'
import { getInvitations } from '../api/getInvitations'
import { inviteAdmin } from '../api/inviteAdmin'
import { revokeInvitation } from '../api/revokeInvitation'
import { useConfirm } from '../../../shared/ui/confirm'
import { notify } from '../../../shared/ui/toast'
import { RevokeIcon } from '../../../shared/icons'
import { friendlyMessage } from '../../../shared/api/errors'
import type { AdminInvitation } from '../admin.types'

export function useAdminsViewModel() {
  const confirm = useConfirm()
  const [invitations, setInvitations] = useState<AdminInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const retry = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let active = true
    getInvitations()
      .then((list) => { if (active) { setInvitations(list); setError(null); setIsLoading(false) } })
      .catch((e) => { if (active) { setError(friendlyMessage(e)); setIsLoading(false) } })
    return () => { active = false }
  }, [tick])

  const openInvite = () => setInviteOpen(true)
  const closeInvite = () => setInviteOpen(false)

  const invite = async (correo: string): Promise<void> => {
    setSending(true)
    try {
      await inviteAdmin(correo)
      notify.success(`Invitación enviada a ${correo}.`)
      setInviteOpen(false)
      setTick((n) => n + 1)
    } catch (e) {
      notify.error(e)
    } finally {
      setSending(false)
    }
  }

  const resendInvite = async (inv: AdminInvitation): Promise<void> => {
    try {
      await inviteAdmin(inv.correo)
      notify.success(`Invitación reenviada a ${inv.correo}.`)
      setTick((n) => n + 1)
    } catch (e) {
      notify.error(e)
    }
  }

  const revokeInvite = async (inv: AdminInvitation): Promise<void> => {
    const ok = await confirm({
      title: 'Revocar invitación',
      message: `La invitación a ${inv.correo} quedará sin efecto. ¿Continuar?`,
      confirmLabel: 'Revocar',
      tone: 'danger',
      icon: RevokeIcon,
    })
    if (!ok) return
    try {
      await revokeInvitation(inv.idInvitacion)
      notify.success('Invitación revocada.')
      setTick((n) => n + 1)
    } catch (e) {
      notify.error(e)
    }
  }

  return { invitations, isLoading, error, retry, inviteOpen, sending, openInvite, closeInvite, invite, resendInvite, revokeInvite }
}
