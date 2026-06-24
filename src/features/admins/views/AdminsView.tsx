import { useAdminsViewModel } from '../viewmodels/useAdminsViewModel'
import { invitationStatus } from '../models/invitationStatus'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { QueueState } from '../../../shared/components/QueueState'
import { InviteAdminModal } from '../components/InviteAdminModal'
import { AdminsIcon, InviteIcon, ResendIcon, RevokeIcon } from '../../../shared/icons'
import type { AdminInvitation } from '../admin.types'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

const initial = (correo: string) => correo.charAt(0).toUpperCase()
const fmtDate = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(iso)) : '—'

export function AdminsView() {
  const vm = useAdminsViewModel()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Administradores"
        subtitle="Invita y gestiona el acceso al panel"
        action={<Button icon={InviteIcon} onClick={vm.openInvite}>Invitar admin</Button>}
      />

      <QueueState
        isLoading={vm.isLoading}
        error={vm.error}
        isEmpty={vm.invitations.length === 0}
        onRetry={vm.retry}
        emptyIcon={AdminsIcon}
        emptyTitle="Aún no hay invitaciones"
        emptyDescription="Invita al primer administrador para darle acceso al panel."
        emptyAction={{ label: 'Invitar admin', icon: InviteIcon, onClick: vm.openInvite }}
      />

      {!vm.isLoading && !vm.error && vm.invitations.length > 0 && (
        <div className="overflow-x-auto">
        <div className="min-w-[680px] overflow-hidden rounded-2xl border border-border bg-white">
          <div className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft" style={jakarta}>
            <span className="flex-1">Administrador</span>
            <span className="w-32">Estado</span>
            <span className="w-40">Invitado</span>
            <span className="w-[150px] text-right">Acciones</span>
          </div>
          {vm.invitations.map((inv) => (
            <AdminRow key={inv.idInvitacion} inv={inv} onResend={vm.resendInvite} onRevoke={vm.revokeInvite} />
          ))}
        </div>
        </div>
      )}

      <InviteAdminModal open={vm.inviteOpen} sending={vm.sending} onClose={vm.closeInvite} onSubmit={vm.invite} />
    </div>
  )
}

function AdminRow({
  inv,
  onResend,
  onRevoke,
}: {
  inv: AdminInvitation
  onResend: (inv: AdminInvitation) => void
  onRevoke: (inv: AdminInvitation) => void
}) {
  const st = invitationStatus(inv.estado)
  return (
    <div className="flex items-center gap-4 border-t border-border px-6 py-4 transition-colors first:border-t-0 hover:bg-surface">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={jakarta}>{initial(inv.correo)}</span>
        <div className="truncate text-sm font-semibold text-ink" style={jakarta}>{inv.correo}</div>
      </div>
      <div className="w-32"><StatusBadge variant={st.variant}>{st.label}</StatusBadge></div>
      <div className="w-40 text-sm text-ink-soft" style={jakarta}>{fmtDate(inv.createdAt)}</div>
      <div className="flex w-[150px] items-center justify-end gap-2">
        {st.canResend && (
          <button
            onClick={() => onResend(inv)}
            aria-label="Reenviar invitación"
            title="Reenviar invitación"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-ink-soft transition-colors hover:border-primary hover:text-primary"
          >
            <ResendIcon size={16} />
          </button>
        )}
        {st.canRevoke && (
          <button
            onClick={() => onRevoke(inv)}
            aria-label="Revocar invitación"
            title="Revocar invitación"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red/30 text-red transition-colors hover:bg-danger-bg"
          >
            <RevokeIcon size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
