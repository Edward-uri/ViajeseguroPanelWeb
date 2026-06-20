import { useNavigate, useParams } from 'react-router-dom'
import { useDriverDetailViewModel } from '../viewmodels/useDriverDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function DriverDetailView() {
  const navigate = useNavigate()
  const { driverId } = useParams()
  const vm = useDriverDetailViewModel(driverId)
  if (!vm.driver) return <div className="p-8 text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
  const d = vm.driver
  return (
    <div className="p-8">
      <button onClick={() => navigate('/revision')} className="mb-6 flex items-center gap-2 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>‹ Volver a la cola</button>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initials(d.name)}</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.name}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>ID {d.id} · {d.phone}</div>
        </div>
      </div>

      <div className="mb-8 flex gap-12 rounded-2xl border border-border bg-white px-6 py-5">
        <Info label="Número de licencia" value={d.license.number} />
        <Info label="Expedición" value={d.license.issuedAt} />
        <Info label="Vencimiento" value={d.license.expiresAt} />
        <div className="ml-auto self-center text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Licencia de conducir</div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Documentos ({d.documents.length})</h2>
      <div className="grid grid-cols-3 gap-6">
        {d.documents.map((doc) => <DocumentCard key={doc.id} document={doc} onReview={vm.openViewer} />)}
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
