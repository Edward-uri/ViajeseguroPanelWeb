import { useZonesViewModel } from '../viewmodels/useZonesViewModel'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { QueueState } from '../../../shared/components/QueueState'
import { ZoneFormModal } from '../components/ZoneFormModal'
import { ZonesIcon, PlusIcon, EditIcon, PowerIcon, DropdownIcon } from '../../../shared/icons'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }
const money = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

export function ZonesView() {
  const vm = useZonesViewModel()
  return (
    <div className="p-8">
      <PageHeader
        title="Zonas y tarifas"
        subtitle="Precios fijos por zona en cada municipio"
        action={<Button icon={PlusIcon} disabled={vm.municipioId == null} onClick={vm.openCreate}>Crear zona</Button>}
      />

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="municipio" className="text-sm font-medium text-ink-soft" style={jakarta}>Municipio</label>
        <div className="relative">
          <select
            id="municipio"
            value={vm.municipioId ?? ''}
            onChange={(e) => vm.setMunicipioId(Number(e.target.value))}
            disabled={vm.municipios.length === 0}
            className="appearance-none rounded-xl border border-border bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-ink outline-none transition-colors hover:border-primary focus:border-primary disabled:opacity-50"
            style={jakarta}
          >
            {vm.municipios.map((m) => <option key={m.idMunicipio} value={m.idMunicipio}>{m.nombre}</option>)}
          </select>
          <DropdownIcon size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        </div>
      </div>

      <QueueState
        isLoading={vm.isLoading}
        error={vm.error}
        isEmpty={vm.zones.length === 0}
        onRetry={vm.retry}
        emptyIcon={ZonesIcon}
        emptyTitle="Sin zonas en este municipio"
        emptyDescription="Crea la primera zona y define su tarifa para empezar."
        emptyAction={{ label: 'Crear zona', icon: PlusIcon, onClick: vm.openCreate }}
      />

      {!vm.isLoading && !vm.error && vm.zones.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft" style={jakarta}>
            <span className="flex-1">Zona</span>
            <span className="w-32">Tarifa</span>
            <span className="w-28">Estado</span>
            <span className="w-[150px] text-right">Acciones</span>
          </div>
          {vm.zones.map((z) => (
            <div key={z.idZona} className={`flex items-center gap-4 border-t border-border px-6 py-4 transition-colors hover:bg-surface ${z.activo ? '' : 'opacity-60'}`}>
              <div className="flex flex-1 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-active text-primary"><ZonesIcon size={18} /></span>
                <div>
                  <div className="text-sm font-semibold text-ink" style={jakarta}>{z.nombre}</div>
                  {z.latCentro != null && z.lngCentro != null && (
                    <div className="text-xs text-ink-soft" style={jakarta}>{z.latCentro.toFixed(4)}, {z.lngCentro.toFixed(4)}</div>
                  )}
                </div>
              </div>
              <div className="w-32 text-sm font-bold text-ink" style={jakarta}>{money(z.precio)}</div>
              <div className="w-28"><StatusBadge variant={z.activo ? 'aprobado' : 'neutral'}>{z.activo ? 'Activa' : 'Inactiva'}</StatusBadge></div>
              <div className="flex w-[150px] items-center justify-end gap-2">
                <Button variant="outline" size="sm" icon={EditIcon} onClick={() => vm.openEdit(z)}>Editar</Button>
                <button
                  onClick={() => { void vm.toggleActive(z) }}
                  aria-label={z.activo ? 'Desactivar zona' : 'Activar zona'}
                  title={z.activo ? 'Desactivar' : 'Activar'}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${z.activo ? 'border-red/30 text-red hover:bg-danger-bg' : 'border-success/30 text-success hover:bg-success-bg'}`}
                >
                  <PowerIcon size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ZoneFormModal open={vm.formOpen} zone={vm.editing} saving={vm.saving} onClose={vm.closeForm} onSubmit={vm.submitForm} />
    </div>
  )
}
