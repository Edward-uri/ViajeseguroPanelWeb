import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useVehicleDetailViewModel } from '../viewmodels/useVehicleDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { EmptyState } from '../../../shared/components/EmptyState'
import { BackIcon, VehicleIcon, DocumentIcon, WarningIcon, RefreshIcon, SpinnerIcon } from '../../../shared/icons'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'
import { paths } from '../../../routes/paths'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function VehicleDetailView() {
  const navigate = useNavigate()
  const { vehicleId } = useParams()
  const state = (useLocation().state as { propietario?: string; telefono?: string } | null) ?? {}
  const vm = useVehicleDetailViewModel(vehicleId)
  const goBack = () => navigate(paths.vehiculos)

  if (vm.isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-ink-soft" style={jakarta}>
        <SpinnerIcon size={28} className="animate-spin text-primary" />
        <span className="text-sm">Cargando vehículo…</span>
      </div>
    )
  }
  if (vm.error || !vm.detail) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <BackLink onClick={goBack} label="Volver a vehículos" />
        <div className="mt-6">
          <EmptyState
            icon={WarningIcon}
            tone="danger"
            title="No se pudo cargar"
            description={vm.error ?? 'No se encontró el vehículo.'}
            action={{ label: 'Reintentar', icon: RefreshIcon, onClick: vm.retry }}
            secondaryAction={{ label: 'Volver a vehículos', icon: BackIcon, onClick: goBack }}
          />
        </div>
      </div>
    )
  }
  const v = vm.detail
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <BackLink onClick={goBack} label="Volver a vehículos" />
      <div className="mb-6 mt-6 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-warning-bg text-primary">
          <VehicleIcon size={26} />
        </span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={jakarta}>{v.placa}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={jakarta}>{state.propietario ?? `Vehículo #${v.idVehiculo}`}{state.telefono ? ` · ${state.telefono}` : ''}</div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-x-12 gap-y-4 rounded-2xl border border-border bg-white px-6 py-5">
        <Info label="Modelo" value={v.modelo ?? '—'} />
        <Info label="Color" value={v.color ?? '—'} />
        <Info label="Año" value={v.anio != null ? String(v.anio) : '—'} />
        <Info label="Municipio" value={vm.municipio || '—'} />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <DocumentIcon size={18} className="text-ink-soft" />
        <h2 className="text-lg font-bold text-ink" style={jakarta}>Documentos ({v.documentos.length})</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {v.documentos.map((doc) => <DocumentCard key={doc.tipo} document={doc} onReview={vm.openViewer} />)}
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
