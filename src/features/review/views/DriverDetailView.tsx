import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDriverDetailViewModel } from '../viewmodels/useDriverDetailViewModel'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { DocumentCard, DocumentViewerModal, RejectDocumentModal } from '../../documents'
import { paths } from '../../../routes/paths'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function DriverDetailView() {
  const navigate = useNavigate()
  const { driverId } = useParams()
  const state = (useLocation().state as { nombre?: string; telefono?: string } | null) ?? {}
  const vm = useDriverDetailViewModel(driverId)
  const nombre = state.nombre ?? `Conductor #${driverId}`

  if (vm.isLoading) return <div className="p-8 text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Cargando…</div>
  if (vm.error || !vm.detail) {
    return (
      <div className="p-8">
        <button onClick={() => navigate(paths.revision)} className="mb-6 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>‹ Volver a la cola</button>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white py-12">
          <p className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{vm.error ?? 'No se encontró el conductor.'}</p>
          <Button variant="outline" size="sm" onClick={vm.retry}>Reintentar</Button>
        </div>
      </div>
    )
  }
  const d = vm.detail
  return (
    <div className="p-8">
      <button onClick={() => navigate(paths.revision)} className="mb-6 flex items-center gap-2 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>‹ Volver a la cola</button>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initials(nombre)}</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{nombre}</h1>
            <StatusBadge variant="en_revision">En revisión</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>ID {d.idConductor}{state.telefono ? ` · ${state.telefono}` : ''}</div>
        </div>
      </div>

      {d.licencia && (
        <div className="mb-8 flex gap-12 rounded-2xl border border-border bg-white px-6 py-5">
          <Info label="Número de licencia" value={d.licencia.numero} />
          <Info label="Expedición" value={d.licencia.expedicion ?? '—'} />
          <Info label="Vencimiento" value={d.licencia.vence ?? '—'} />
          <div className="ml-auto self-center text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Licencia de conducir</div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Documentos ({d.documentos.length})</h2>
      <div className="grid grid-cols-3 gap-6">
        {d.documentos.map((doc) => <DocumentCard key={doc.tipo} document={doc} onReview={vm.openViewer} />)}
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
