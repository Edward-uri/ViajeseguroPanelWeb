import { useNavigate } from 'react-router-dom'
import { useDriversListViewModel, type FiltroEstado } from '../viewmodels/useDriversListViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import type { BadgeVariant } from '../../../shared/components/StatusBadge'
import { Button } from '../../../shared/components/Button'
import { QueueState } from '../../../shared/components/QueueState'
import { DriversIcon, PhoneIcon, VehicleIcon } from '../../../shared/icons'
import { paths } from '../../../routes/paths'
import type { VerificationStatus } from '../../../shared/domain'

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

const BADGE: Record<VerificationStatus, { label: string; variant: BadgeVariant }> = {
  aprobado: { label: 'Aprobado', variant: 'aprobado' },
  rechazado: { label: 'Rechazado', variant: 'rechazado' },
  en_revision: { label: 'En revisión', variant: 'en_revision' },
  incompleto: { label: 'Incompleto', variant: 'pendiente' },
}

const FILTROS: { key: FiltroEstado; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'aprobado', label: 'Aprobados' },
  { key: 'en_revision', label: 'En revisión' },
  { key: 'incompleto', label: 'Incompletos' },
  { key: 'rechazado', label: 'Rechazados' },
]

export function DriversListView() {
  const navigate = useNavigate()
  const { items, conteos, filtro, setFiltro, isLoading, error, retry } = useDriversListViewModel()
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title="Conductores" subtitle="Todos los conductores registrados y sus vehículos" />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filtro === f.key ? 'bg-ink text-white' : 'border border-border bg-white text-ink-soft hover:text-ink'
            }`}
            style={jakarta}
          >
            {f.label} ({conteos[f.key]})
          </button>
        ))}
      </div>

      <QueueState
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        onRetry={retry}
        emptyIcon={DriversIcon}
        emptyTitle="Sin conductores"
        emptyDescription="No hay conductores que coincidan con el filtro seleccionado."
      />
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[860px] overflow-hidden rounded-2xl border border-border bg-white">
            {items.map((d) => (
              <div key={d.idConductor} className="flex items-center gap-4 border-t border-border px-6 py-4 transition-colors first:border-t-0 hover:bg-surface">
                <div className="flex w-56 shrink-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={jakarta}>{initials(d.nombre)}</span>
                  <div>
                    <div className="text-sm font-semibold text-ink" style={jakarta}>{d.nombre}</div>
                    <div className="text-xs text-ink-soft" style={jakarta}>ID {d.idConductor}{d.municipio ? ` · ${d.municipio}` : ''}</div>
                  </div>
                </div>
                <div className="flex w-40 shrink-0 items-center gap-2 text-sm text-ink-soft" style={jakarta}>
                  <PhoneIcon size={15} className="shrink-0 text-placeholder" />
                  {d.telefono ?? '—'}
                </div>
                <div className="w-32 shrink-0">
                  <StatusBadge variant={BADGE[d.estadoVerificacion].variant}>{BADGE[d.estadoVerificacion].label}</StatusBadge>
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-2" style={jakarta}>
                  {d.vehiculos.length === 0 && <span className="text-xs text-placeholder">Sin vehículos</span>}
                  {d.vehiculos.map((v) => (
                    <span
                      key={v.idVehiculo}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                        v.activo ? 'border-success bg-success-bg text-success' : 'border-border bg-white text-ink-soft'
                      }`}
                      title={v.modelo ?? undefined}
                    >
                      <VehicleIcon size={13} />
                      {v.placa}
                      {v.activo && <span className="font-semibold">· activo</span>}
                    </span>
                  ))}
                </div>
                <Button variant="outline" onClick={() => navigate(paths.driverDetail(d.idConductor), { state: { nombre: d.nombre, telefono: d.telefono } })}>Ver</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
