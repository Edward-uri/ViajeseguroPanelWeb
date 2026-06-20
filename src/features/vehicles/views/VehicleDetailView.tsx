import { useNavigate, useParams } from 'react-router-dom'
import { useVehicleDetailViewModel } from '../viewmodels/useVehicleDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'

export function VehicleDetailView() {
  const navigate = useNavigate()
  const { vehicleId } = useParams()
  const vm = useVehicleDetailViewModel(vehicleId)
  if (!vm.vehicle) return <div className="p-8 text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
  const v = vm.vehicle
  return (
    <div className="p-8">
      <button onClick={() => navigate('/vehiculos')} className="mb-6 flex items-center gap-2 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>‹ Volver a vehículos</button>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-bg text-primary">🛺</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.plate}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.ownerName} · {v.ownerPhone}</div>
        </div>
      </div>

      <div className="mb-8 flex gap-12 rounded-2xl border border-border bg-white px-6 py-5">
        <Info label="Modelo" value={v.model} />
        <Info label="Color" value={v.color} />
        <Info label="Año" value={String(v.year)} />
        <Info label="Municipio" value={v.municipality} />
      </div>

      <h2 className="mb-4 text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Documentos ({v.documents.length})</h2>
      <div className="grid grid-cols-3 gap-6">
        {v.documents.map((doc) => <DocumentCard key={doc.id} document={doc} onReview={vm.openViewer} />)}
      </div>

      <DocumentViewerModal document={vm.viewerDoc} isOpen={!!vm.viewerDoc} onClose={vm.closeViewer} onApprove={vm.approve} onReject={vm.openReject} />
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
