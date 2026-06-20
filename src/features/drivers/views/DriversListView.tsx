import { useNavigate } from 'react-router-dom'
import { useDriversListViewModel } from '../viewmodels/useDriversListViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatusBadge, type BadgeVariant } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import type { ReviewStatus } from '../../../shared/data'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const statusMap: Record<ReviewStatus, { variant: BadgeVariant; label: string }> = {
  en_revision: { variant: 'en_revision', label: 'En revisión' },
  aprobado: { variant: 'aprobado', label: 'Activo' },
  rechazado: { variant: 'rechazado', label: 'Rechazado' },
}

export function DriversListView() {
  const navigate = useNavigate()
  const { drivers } = useDriversListViewModel()
  return (
    <div className="p-8">
      <PageHeader title="Conductores" subtitle="Todos los conductores registrados" />
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center gap-4 bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          <div className="flex-1">Conductor</div>
          <div className="w-40">Teléfono</div>
          <div className="w-36">Estado</div>
          <div className="w-[88px]" />
        </div>
        {drivers.map((d) => {
          const s = statusMap[d.status]
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
              <div className="w-36"><StatusBadge variant={s.variant}>{s.label}</StatusBadge></div>
              <Button variant="outline" onClick={() => navigate(`/revision/${d.id}`)}>Ver</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
