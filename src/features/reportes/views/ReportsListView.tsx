import { useNavigate } from 'react-router-dom'
import { useReportsListViewModel } from '../viewmodels/useReportsListViewModel'
import { estadoCuentaBadge, formatFecha } from '../models/reporteLabels'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { QueueState } from '../../../shared/components/QueueState'
import { Pagination } from '../../../shared/components/Pagination'
import { Button } from '../../../shared/components/Button'
import { ReportsIcon, ClockIcon, WarningIcon } from '../../../shared/icons'
import { paths } from '../../../routes/paths'
import type { ConductorReportadoDto } from '../api/reporte.dto.types'

const initials = (name: string | null) =>
  (name ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function ReportsListView() {
  const navigate = useNavigate()
  const { items, page, totalPages, total, umbral, isLoading, error, retry, goToPage } =
    useReportsListViewModel()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Reportes"
        subtitle="Conductores con reportes de pasajeros, ordenados por cantidad"
      />

      {umbral > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink-soft" style={jakarta}>
          <WarningIcon size={16} className="shrink-0 text-warning" />
          Un conductor se marca para veto al acumular <strong className="text-ink">{umbral}</strong> reportes o más.
        </div>
      )}

      <QueueState
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        onRetry={retry}
        emptyIcon={ReportsIcon}
        emptyTitle="Sin reportes"
        emptyDescription="Ningún conductor tiene reportes de pasajeros por ahora."
      />

      {!isLoading && !error && items.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[720px] overflow-hidden rounded-2xl border border-border bg-white">
              {items.map((c) => (
                <Row key={c.idConductor} c={c} umbral={umbral} onOpen={() =>
                  navigate(paths.reporteDetail(c.idConductor), { state: { nombre: c.nombre } })
                } />
              ))}
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} disabled={isLoading} onPage={goToPage} />
        </>
      )}
    </div>
  )
}

function Row({ c, umbral, onOpen }: { c: ConductorReportadoDto; umbral: number; onOpen: () => void }) {
  const badge = estadoCuentaBadge(c.estadoCuenta)
  const alerta = umbral > 0 && c.conteo >= umbral
  return (
    <div className="flex items-center gap-4 border-t border-border px-6 py-4 transition-colors first:border-t-0 hover:bg-surface">
      <div className="flex w-64 shrink-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" style={jakarta}>
          {initials(c.nombre)}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink" style={jakarta}>{c.nombre ?? 'Sin nombre'}</div>
          <div className="text-xs text-ink-soft" style={jakarta}>ID {c.idConductor}</div>
        </div>
      </div>

      <div className="w-32 shrink-0">
        <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
      </div>

      <div className="flex w-40 shrink-0 items-center gap-1.5 text-xs text-ink-soft" style={jakarta}>
        <ClockIcon size={14} className="shrink-0 text-placeholder" />
        {formatFecha(c.ultimoReporte)}
      </div>

      <div className="flex flex-1 items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
            alerta ? 'bg-danger-bg text-red' : 'bg-neutral-bg text-ink'
          }`}
          style={jakarta}
        >
          {alerta && <WarningIcon size={14} />}
          {c.conteo} {c.conteo === 1 ? 'reporte' : 'reportes'}
        </span>
      </div>

      <Button variant="outline" size="sm" onClick={onOpen}>Ver</Button>
    </div>
  )
}
