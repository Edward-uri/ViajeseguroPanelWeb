import { useNavigate } from 'react-router-dom'
import { useVehicleQueueViewModel } from '../viewmodels/useVehicleQueueViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { QueueState } from '../../../shared/components/QueueState'
import { VehicleIcon } from '../../../shared/icons/VehicleIcon'
import { paths } from '../../../routes/paths'

export function VehicleQueueView() {
  const navigate = useNavigate()
  const { items, stats, isLoading, error, retry } = useVehicleQueueViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Vehículos pendientes" subtitle="Vehículos con documentos por revisar" />
      <div className="mb-6 flex gap-4">
        <StatCard value={stats?.inQueue ?? 0} label="En cola" />
        <StatCard value={stats?.pendingDocs ?? 0} label="Docs pendientes" accent="success" />
      </div>
      <QueueState isLoading={isLoading} error={error} isEmpty={items.length === 0} emptyText="No hay vehículos con documentos pendientes 🎉" onRetry={retry} />
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {items.map((v) => (
            <div key={v.idVehiculo} className="flex items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-bg text-primary">
                  <VehicleIcon />
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.placa}</div>
                </div>
              </div>
              <div className="w-40 text-sm text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.propietario}</div>
              <div className="w-36 text-sm text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{v.telefono}</div>
              <div className="w-36"><StatusBadge variant="pendiente">{v.documentosPendientes} pendientes</StatusBadge></div>
              <Button onClick={() => navigate(paths.vehicleDetail(v.idVehiculo), { state: { propietario: v.propietario, telefono: v.telefono } })}>Revisar</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
