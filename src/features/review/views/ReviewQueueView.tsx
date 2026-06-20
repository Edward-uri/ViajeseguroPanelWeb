import { useNavigate } from 'react-router-dom'
import { useReviewQueueViewModel } from '../viewmodels/useReviewQueueViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { QueueState } from '../../../shared/components/QueueState'
import { paths } from '../../../routes/paths'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function ReviewQueueView() {
  const navigate = useNavigate()
  const { items, stats, isLoading, error, retry } = useReviewQueueViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Cola de revisión" subtitle="Conductores con documentos por revisar" />
      <div className="mb-6 flex gap-4">
        <StatCard value={stats?.inQueue ?? 0} label="En cola" />
        <StatCard value={stats?.pendingDocs ?? 0} label="Docs pendientes" accent="success" />
      </div>
      <QueueState isLoading={isLoading} error={error} isEmpty={items.length === 0} emptyText="No hay conductores con documentos pendientes 🎉" onRetry={retry} />
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {items.map((d) => (
            <div key={d.idConductor} className="flex items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initials(d.nombre)}</span>
                <div>
                  <div className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.nombre}</div>
                  <div className="text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>ID {d.idConductor}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.telefono}</div>
              <div className="w-36"><StatusBadge variant="pendiente">{d.documentosPendientes} pendientes</StatusBadge></div>
              <Button onClick={() => navigate(paths.driverDetail(d.idConductor), { state: { nombre: d.nombre, telefono: d.telefono } })}>Revisar</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
