import { useNavigate } from 'react-router-dom'
import { useVehicleQueueViewModel } from '../viewmodels/useVehicleQueueViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'

export function VehicleQueueView() {
  const navigate = useNavigate()
  const { vehicles, stats } = useVehicleQueueViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Vehículos pendientes" subtitle="Vehículos con documentos por revisar" />
      <div className="mb-6 flex gap-4">
        <StatCard value={stats?.inQueue ?? 0} label="En cola" />
        <StatCard value={stats?.pendingDocs ?? 0} label="Docs pendientes" />
        <StatCard value={stats?.approvedToday ?? 0} label="Activados hoy" accent="success" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center gap-4 bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          <div className="flex-1">Vehículo</div>
          <div className="w-40">Propietario</div>
          <div className="w-36">Teléfono</div>
          <div className="w-36">Docs pendientes</div>
          <div className="w-[104px]" />
        </div>
        {vehicles.map((v) => {
          const pending = v.documents.filter((x) => x.status === 'pendiente').length
          return (
            <div key={v.id} className="flex items-center gap-4 border-t border-border px-6 py-4">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-bg text-primary">🛺</span>
                <div>
                  <div className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.plate}</div>
                  <div className="text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.model} · {v.color}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.ownerName}</div>
              <div className="w-36 text-sm text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.ownerPhone}</div>
              <div className="w-36"><StatusBadge variant="pendiente">{pending} pendientes</StatusBadge></div>
              <Button onClick={() => navigate(`/vehiculos/${v.id}`)}>Revisar</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
