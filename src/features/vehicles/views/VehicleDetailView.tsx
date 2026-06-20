import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useVehicleDetailViewModel } from '../viewmodels/useVehicleDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { VehicleIcon } from '../../../shared/icons/VehicleIcon'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'
import { paths } from '../../../routes/paths'

export function VehicleDetailView() {
  const navigate = useNavigate()
  const { vehicleId } = useParams()
  const state = (useLocation().state as { propietario?: string; telefono?: string } | null) ?? {}
  const vm = useVehicleDetailViewModel(vehicleId)

  if (vm.isLoading) return <div className="p-8 text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
  if (vm.error || !vm.detail) {
    return (
      <div className="p-8">
        <button onClick={() => navigate(paths.vehiculos)} className="mb-6 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>‹ Volver a vehículos</button>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white py-12">
          <p className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{vm.error ?? 'No se encontró el vehículo.'}</p>
          <Button variant="outline" size="sm" onClick={vm.retry}>Reintentar</Button>
        </div>
      </div>
    )
  }
  const v = vm.detail
  return (
    <div className="p-8">
      <button onClick={() => navigate(paths.vehiculos)} className="mb-6 flex items-center gap-2 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>‹ Volver a vehículos</button>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-bg text-primary">
          <VehicleIcon />
        </span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.placa}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{state.propietario ?? `Vehículo #${v.idVehiculo}`}{state.telefono ? ` · ${state.telefono}` : ''}</div>
        </div>
      </div>

      <div className="mb-8 flex gap-12 rounded-2xl border border-border bg-white px-6 py-5">
        <Info label="Modelo" value={v.modelo ?? '—'} />
        <Info label="Color" value={v.color ?? '—'} />
        <Info label="Año" value={v.anio != null ? String(v.anio) : '—'} />
        <Info label="Municipio" value={vm.municipio || '—'} />
      </div>

      <h2 className="mb-4 text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Documentos ({v.documentos.length})</h2>
      <div className="grid grid-cols-3 gap-6">
        {v.documentos.map((doc) => <DocumentCard key={doc.tipo} document={doc} onReview={vm.openViewer} />)}
      </div>

      <DocumentViewerModal document={vm.viewerDoc} isOpen={!!vm.viewerDoc} fileUrl={vm.fileUrl} fileLoading={vm.fileLoading} onClose={vm.closeViewer} onApprove={vm.approve} onReject={vm.openReject} />
      <RejectDocumentModal document={vm.rejectDoc} isOpen={!!vm.rejectDoc} onClose={vm.closeReject} onConfirm={vm.confirmReject} />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{label}</div>
      <div className="text-base font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{value}</div>
    </div>
  )
}
