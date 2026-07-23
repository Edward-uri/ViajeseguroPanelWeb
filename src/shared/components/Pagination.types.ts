export interface PaginationProps {
  page: number
  totalPages: number
  /** Total de elementos (opcional, para el texto "N resultados"). */
  total?: number
  /** Deshabilita los controles mientras carga la página. */
  disabled?: boolean
  onPage: (page: number) => void
}
