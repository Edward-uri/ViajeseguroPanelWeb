import { BackIcon, ForwardIcon } from '../icons'
import type { PaginationProps } from './Pagination.types'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

/** Paginación simple (anterior / siguiente) para las tablas del panel. */
export function Pagination({ page, totalPages, total, disabled, onPage }: PaginationProps) {
  if (totalPages <= 1) return null
  const btn =
    'inline-flex items-center gap-1 rounded-[10px] border border-border bg-white px-3 py-1.5 text-sm font-semibold text-ink ' +
    'transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className="mt-4 flex items-center justify-between" style={jakarta}>
      <span className="text-xs text-ink-soft">
        Página {page} de {totalPages}
        {total != null ? ` · ${total} ${total === 1 ? 'resultado' : 'resultados'}` : ''}
      </span>
      <div className="flex items-center gap-2">
        <button className={btn} disabled={disabled || page <= 1} onClick={() => onPage(page - 1)}>
          <BackIcon size={16} />
          Anterior
        </button>
        <button className={btn} disabled={disabled || page >= totalPages} onClick={() => onPage(page + 1)}>
          Siguiente
          <ForwardIcon size={16} />
        </button>
      </div>
    </div>
  )
}
