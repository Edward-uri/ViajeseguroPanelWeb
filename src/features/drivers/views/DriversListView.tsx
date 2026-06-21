import { useNavigate } from 'react-router-dom'
import { useDriversListViewModel } from '../viewmodels/useDriversListViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { QueueState } from '../../../shared/components/QueueState'
import { DriversIcon, QueueIcon, PhoneIcon } from '../../../shared/icons'
import { paths } from '../../../routes/paths'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function DriversListView() {
  const navigate = useNavigate()
  const { items, isLoading, error, retry } = useDriversListViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Conductores" subtitle="Conductores con revisión pendiente" />
      <QueueState
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        onRetry={retry}
        emptyIcon={DriversIcon}
        emptyTitle="Sin conductores en revisión"
        emptyDescription="No hay conductores con revisión pendiente en este momento."
        emptyAction={{ label: 'Ir a la cola de revisión', icon: QueueIcon, onClick: () => navigate(paths.revision) }}
      />
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {items.map((d) => (
            <div key={d.idConductor} className="flex items-center gap-4 border-t border-border px-6 py-4 transition-colors first:border-t-0 hover:bg-surface">
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{initials(d.nombre)}</span>
                <div>
                  <div className="text-sm font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>{d.nombre}</div>
                  <div className="text-xs text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>ID {d.idConductor}</div>
                </div>
              </div>
              <div className="flex w-44 items-center gap-2 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
                <PhoneIcon size={15} className="shrink-0 text-placeholder" />
                {d.telefono}
              </div>
              <div className="w-36"><StatusBadge variant="en_revision">En revisión</StatusBadge></div>
              <Button variant="outline" onClick={() => navigate(paths.driverDetail(d.idConductor), { state: { nombre: d.nombre, telefono: d.telefono } })}>Ver</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
