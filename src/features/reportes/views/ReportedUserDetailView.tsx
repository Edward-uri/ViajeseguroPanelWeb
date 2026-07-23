import type { ReactNode } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useReportedUserDetailViewModel } from '../viewmodels/useReportedUserDetailViewModel'
import { estadoCuentaBadge, motivoLabel, formatFecha, puedeVetar, puedeReactivar, rolLabel } from '../models/reporteLabels'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { EmptyState } from '../../../shared/components/EmptyState'
import { Button } from '../../../shared/components/Button'
import {
  BackIcon, WarningIcon, RefreshIcon, SpinnerIcon, PhoneIcon, MailIcon, BanIcon, PowerIcon, ReportsIcon,
} from '../../../shared/icons'
import { paths } from '../../../routes/paths'
import type { RolReportado, ReporteConReportanteDto } from '../api/reporte.dto.types'

const initials = (name: string | null) =>
  (name ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function ReportedUserDetailView() {
  const navigate = useNavigate()
  const { rol, id } = useParams()
  const state = (useLocation().state as { nombre?: string | null } | null) ?? {}
  const vm = useReportedUserDetailViewModel(id, rol as RolReportado | undefined)
  const goBack = () => navigate(paths.reportes)

  if (vm.isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-ink-soft" style={jakarta}>
        <SpinnerIcon size={28} className="animate-spin text-primary" />
        <span className="text-sm">Cargando usuario…</span>
      </div>
    )
  }
  if (vm.error || !vm.detail) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <BackLink onClick={goBack} />
        <div className="mt-6">
          <EmptyState
            icon={WarningIcon}
            tone="danger"
            title="No se pudo cargar"
            description={vm.error ?? 'No se encontró el usuario.'}
            action={{ label: 'Reintentar', icon: RefreshIcon, onClick: vm.retry }}
            secondaryAction={{ label: 'Volver a reportes', icon: BackIcon, onClick: goBack }}
          />
        </div>
      </div>
    )
  }

  const d = vm.detail
  const nombre = d.nombre ?? state.nombre ?? `Usuario #${d.idUsuario}`
  const badge = estadoCuentaBadge(d.estadoCuenta)
  const alerta = d.umbral > 0 && d.conteo >= d.umbral
  const vetable = puedeVetar(d.estadoCuenta)
  const reactivable = puedeReactivar(d.estadoCuenta)
  const busy = vm.busyId === d.idUsuario

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <BackLink onClick={goBack} />

      <div className="mb-6 mt-6 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-bold text-white" style={jakarta}>
          {initials(nombre)}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-ink" style={jakarta}>{nombre}</h1>
            <span className="inline-flex items-center rounded-full bg-sidebar-active px-2.5 py-1 text-xs font-semibold text-primary" style={jakarta}>
              {rolLabel(d.rol)}
            </span>
            <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
          </div>
          <div className="text-sm text-ink-soft" style={jakarta}>ID {d.idUsuario}</div>
        </div>
      </div>

      {/* Contacto */}
      <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-border bg-white px-6 py-5">
        <Contact icon={<PhoneIcon size={16} />} label="Teléfono" value={d.telefono} href={d.telefono ? `tel:${d.telefono}` : undefined} />
        <Contact icon={<MailIcon size={16} />} label="Correo" value={d.correo} href={d.correo ? `mailto:${d.correo}` : undefined} />
      </div>

      {/* Moderación */}
      <div className={`mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-6 py-5 ${alerta && vetable ? 'border-red/30 bg-danger-bg' : 'border-border bg-white'}`}>
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${reactivable ? 'bg-success-bg text-success' : 'bg-danger-bg text-red'}`}>
            {reactivable ? <PowerIcon size={22} /> : <BanIcon size={22} />}
          </span>
          <div>
            <div className="text-base font-bold text-ink" style={jakarta}>
              {d.conteo} {d.conteo === 1 ? 'reporte' : 'reportes'}{d.umbral > 0 ? ` · umbral de veto: ${d.umbral}` : ''}
            </div>
            <p className="mt-0.5 max-w-lg text-sm text-ink-soft" style={jakarta}>
              {vetable
                ? 'Vetar suspende la cuenta y cierra sus sesiones de inmediato. Podrás reactivarlo más tarde.'
                : reactivable
                  ? 'La cuenta está suspendida. Puedes reactivarla para que vuelva a operar.'
                  : 'La cuenta está eliminada; no requiere acción.'}
            </p>
          </div>
        </div>
        {vetable && (
          <Button variant="danger" icon={BanIcon} isLoading={busy} onClick={() => vm.vetar(d.idUsuario, nombre)}>
            Desactivar y vetar
          </Button>
        )}
        {reactivable && (
          <Button variant="success" icon={PowerIcon} isLoading={busy} onClick={() => vm.reactivar(d.idUsuario, nombre)}>
            Reactivar
          </Button>
        )}
      </div>

      {/* Reportes */}
      <div className="mb-4 flex items-center gap-2">
        <ReportsIcon size={18} className="text-ink-soft" />
        <h2 className="text-lg font-bold text-ink" style={jakarta}>Reportes ({d.reportes.length})</h2>
      </div>
      {d.reportes.length === 0 ? (
        <EmptyState icon={ReportsIcon} title="Sin reportes" description="Este usuario no tiene reportes registrados en este rol." />
      ) : (
        <div className="flex flex-col gap-3">
          {d.reportes.map((r) => <ReporteCard key={r.idReporte} r={r} />)}
        </div>
      )}
    </div>
  )
}

function ReporteCard({ r }: { r: ReporteConReportanteDto }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge variant="rechazado">{motivoLabel(r.motivo)}</StatusBadge>
        <span className="text-xs text-ink-soft" style={jakarta}>{formatFecha(r.creadoEn, true)}</span>
      </div>
      {r.comentario && (
        <p className="mt-3 text-sm text-ink" style={jakarta}>“{r.comentario}”</p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft" style={jakarta}>
        <span>Reportó: {r.reportanteNombre ?? `Usuario #${r.idReportante}`}</span>
        {r.idViaje != null && <span>Viaje #{r.idViaje}</span>}
      </div>
    </div>
  )
}

function Contact({ icon, label, value, href }: { icon: ReactNode; label: string; value: string | null; href?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-active text-primary">{icon}</span>
      <div>
        <div className="text-xs text-placeholder" style={jakarta}>{label}</div>
        {value && href ? (
          <a href={href} className="text-base font-semibold text-primary hover:underline" style={jakarta}>{value}</a>
        ) : (
          <div className="text-base font-semibold text-ink" style={jakarta}>{value ?? '—'}</div>
        )}
      </div>
    </div>
  )
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink" style={jakarta}>
      <BackIcon size={18} />
      Volver a reportes
    </button>
  )
}
