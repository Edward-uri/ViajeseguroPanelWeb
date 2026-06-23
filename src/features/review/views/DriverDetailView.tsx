import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDriverDetailViewModel } from '../viewmodels/useDriverDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { EmptyState } from '../../../shared/components/EmptyState'
import { BackIcon, LicenseIcon, DocumentIcon, WarningIcon, RefreshIcon, SpinnerIcon } from '../../../shared/icons'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'
import { paths } from '../../../routes/paths'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function DriverDetailView() {
  const navigate = useNavigate()
  const { driverId } = useParams()
  const state = (useLocation().state as { nombre?: string; telefono?: string } | null) ?? {}
  const vm = useDriverDetailViewModel(driverId)
  const nombre = state.nombre ?? `Conductor #${driverId}`
  const goBack = () => navigate(paths.revision)

  if (vm.isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-ink-soft" style={jakarta}>
        <SpinnerIcon size={28} className="animate-spin text-primary" />
        <span className="text-sm">Cargando conductor…</span>
      </div>
    )
  }
  if (vm.error || !vm.detail) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <BackLink onClick={goBack} label="Volver a la cola" />
        <div className="mt-6">
          <EmptyState
            icon={WarningIcon}
            tone="danger"
            title="No se pudo cargar"
            description={vm.error ?? 'No se encontró el conductor.'}
            action={{ label: 'Reintentar', icon: RefreshIcon, onClick: vm.retry }}
            secondaryAction={{ label: 'Volver a la cola', icon: BackIcon, onClick: goBack }}
          />
        </div>
      </div>
    )
  }
  const d = vm.detail
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <BackLink onClick={goBack} label="Volver a la cola" />
      <div className="mb-6 mt-6 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-bold text-white" style={jakarta}>{initials(nombre)}</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={jakarta}>{nombre}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={jakarta}>ID {d.idConductor}{state.telefono ? ` · ${state.telefono}` : ''}</div>
        </div>
      </div>

      {d.licencia && (
        <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-border bg-white px-6 py-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sidebar-active text-primary">
            <LicenseIcon size={24} />
          </span>
          <Info label="Número de licencia" value={d.licencia.numero} />
          <Info label="Expedición" value={d.licencia.expedicion ?? '—'} />
          <Info label="Vencimiento" value={d.licencia.vence ?? '—'} />
          <div className="ml-auto self-center text-sm font-medium text-ink-soft" style={jakarta}>Licencia de conducir</div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <DocumentIcon size={18} className="text-ink-soft" />
        <h2 className="text-lg font-bold text-ink" style={jakarta}>Documentos ({d.documentos.length})</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {d.documentos.map((doc) => <DocumentCard key={doc.tipo} document={doc} onReview={vm.openViewer} />)}
      </div>

      <DocumentViewerModal document={vm.viewerDoc} isOpen={!!vm.viewerDoc} fileUrl={vm.fileUrl} fileLoading={vm.fileLoading} onClose={vm.closeViewer} onApprove={vm.approve} onReject={vm.openReject} />
      <RejectDocumentModal document={vm.rejectDoc} isOpen={!!vm.rejectDoc} onClose={vm.closeReject} onConfirm={vm.confirmReject} />
    </div>
  )
}

function BackLink({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink" style={jakarta}>
      <BackIcon size={18} />
      {label}
    </button>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-placeholder" style={jakarta}>{label}</div>
      <div className="text-base font-semibold text-ink" style={jakarta}>{value}</div>
    </div>
  )
}
