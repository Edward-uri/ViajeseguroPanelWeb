import { useNavigate } from 'react-router-dom'
import { useReviewQueueViewModel } from '../viewmodels/useReviewQueueViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function ReviewQueueView() {
  const navigate = useNavigate()
  const { drivers, stats } = useReviewQueueViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Cola de revisión" subtitle="Conductores con documentos por revisar" />
      <div className="mb-6 flex gap-4">
        <StatCard value={stats?.inQueue ?? 0} label="En cola" />
        <StatCard value={stats?.pendingDocs ?? 0} label="Docs pendientes" />
        <StatCard value={stats?.approvedToday ?? 0} label="Aprobados hoy" accent="success" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center gap-4 bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          <div className="flex-1">Conductor</div>
          <div className="w-40">Teléfono</div>
          <div className="w-36">Docs pendientes</div>
          <div className="w-32">Estado</div>
          <div className="w-[104px]" />
        </div>
        {drivers.map((d) => {
          const pending = d.documents.filter((x) => x.status === 'pendiente').length
          return (
            <div key={d.id} className="flex items-center gap-4 border-t border-border px-6 py-4">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initials(d.name)}</span>
                <div>
                  <div className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.name}</div>
                  <div className="text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>ID {d.id}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.phone}</div>
              <div className="w-36"><StatusBadge variant="pendiente">{pending} pendientes</StatusBadge></div>
              <div className="w-32"><StatusBadge variant="en_revision">En revisión</StatusBadge></div>
              <Button onClick={() => navigate(`/revision/${d.id}`)}>Revisar</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
