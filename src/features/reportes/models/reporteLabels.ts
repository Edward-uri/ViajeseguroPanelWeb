import type { BadgeVariant } from '../../../shared/components/StatusBadge'

/** Motivos del backend (MOTIVOS_REPORTE) → etiqueta legible. */
const MOTIVOS: Record<string, string> = {
  conduccion_peligrosa: 'Conducción peligrosa',
  falta_respeto: 'Falta de respeto',
  cobro_indebido: 'Cobro indebido',
  unidad_insegura: 'Unidad insegura',
  comportamiento_inseguro: 'Comportamiento inseguro',
  dano_a_unidad: 'Daño a la unidad',
  no_se_presento: 'No se presentó',
  otro: 'Otro',
}

export const motivoLabel = (motivo: string): string => MOTIVOS[motivo] ?? motivo

/** Estado de la cuenta (usuarios.estado_cuenta) → etiqueta + variante de badge. */
export function estadoCuentaBadge(estado: string): { label: string; variant: BadgeVariant } {
  switch (estado) {
    case 'activo':
      return { label: 'Activa', variant: 'aprobado' }
    case 'suspendido':
      return { label: 'Suspendida', variant: 'rechazado' }
    case 'eliminado':
      return { label: 'Eliminada', variant: 'neutral' }
    default:
      return { label: estado, variant: 'neutral' }
  }
}

/** ¿La cuenta sigue activa? (única situación en la que tiene sentido vetar). */
export const puedeVetar = (estado: string): boolean => estado === 'activo'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** ISO → "12 jul 2026" (o con hora: "12 jul 2026 · 14:30"). '—' si viene null. */
export function formatFecha(iso: string | null, withTime = false): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const base = `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
  if (!withTime) return base
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${base} · ${hh}:${mm}`
}
