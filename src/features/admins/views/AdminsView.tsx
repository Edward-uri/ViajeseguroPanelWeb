import { useAdminsViewModel } from '../viewmodels/useAdminsViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { EmptyState } from '../../../shared/components/EmptyState'
import { InviteAdminModal } from '../components/InviteAdminModal'
import { AdminsIcon, InviteIcon, ResendIcon, RevokeIcon, InfoIcon } from '../../../shared/icons'
import type { AdminAccount } from '../admin.types'

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
        subtitle="Invita y gestiona a quienes acceden al panel"
        action={<Button icon={InviteIcon} onClick={vm.openInvite}>Invitar admin</Button>}
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-border bg-neutral-bg px-4 py-3">
        <InfoIcon size={18} className="mt-0.5 shrink-0 text-ink-soft" />
        <p className="text-sm text-ink-soft" style={jakarta}>
          Vista lista para usarse. El envío y la gestión de invitaciones se activarán cuando el backend exponga los endpoints.
        </p>
      </div>

      {vm.admins.length === 0 ? (
        <EmptyState
          icon={AdminsIcon}
          title="Aún no hay administradores"
          description="Invita al primer administrador para que pueda acceder al panel y revisar documentos."
          action={{ label: 'Invitar admin', icon: InviteIcon, onClick: vm.openInvite }}
        />
      ) : (
        <div className="overflow-x-auto">
        <div className="min-w-[680px] overflow-hidden rounded-2xl border border-border bg-white">
          <div className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft" style={jakarta}>
            <span className="flex-1">Administrador</span>
            <span className="w-32">Estado</span>
            <span className="w-40">Invitado</span>
            <span className="w-[150px] text-right">Acciones</span>
          </div>
          {vm.admins.map((a) => (
            <AdminRow key={a.idUsuario} admin={a} onResend={vm.resendInvite} onRevoke={vm.revokeAccess} />
          ))}
        </div>
        </div>
      )}

      <InviteAdminModal open={vm.inviteOpen} sending={vm.sending} onClose={vm.closeInvite} onSubmit={vm.invite} />
    </div>
  )
}

function AdminRow({
  admin,
  onResend,
  onRevoke,
}: {
  admin: AdminAccount
  onResend: (a: AdminAccount) => void
  onRevoke: (a: AdminAccount) => void
}) {
  const pending = admin.estado === 'pendiente'
  return (
    <div className="flex items-center gap-4 border-t border-border px-6 py-4 transition-colors first:border-t-0 hover:bg-surface">
      <div className="flex flex-1 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={jakarta}>{initial(admin.correo)}</span>
        <div className="text-sm font-semibold text-ink" style={jakarta}>{admin.correo}</div>
      </div>
      <div className="w-32">
        <StatusBadge variant={pending ? 'pendiente' : 'aprobado'}>{pending ? 'Pendiente' : 'Activo'}</StatusBadge>
      </div>
      <div className="w-40 text-sm text-ink-soft" style={jakarta}>{fmtDate(admin.fechaInvitacion)}</div>
      <div className="flex w-[150px] items-center justify-end gap-2">
        {pending && (
          <button
            onClick={() => onResend(admin)}
            aria-label="Reenviar invitación"
            title="Reenviar invitación"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-ink-soft transition-colors hover:border-primary hover:text-primary"
          >
            <ResendIcon size={16} />
          </button>
        )}
        <button
          onClick={() => onRevoke(admin)}
          aria-label="Revocar acceso"
          title="Revocar acceso"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red/30 text-red transition-colors hover:bg-danger-bg"
        >
          <RevokeIcon size={16} />
        </button>
      </div>
    </div>
  )
}
