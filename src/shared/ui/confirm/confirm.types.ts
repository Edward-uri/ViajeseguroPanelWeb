import type { LucideIcon } from '../../icons'

export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'default' | 'danger'
  /** Icono opcional para el encabezado y el botón de confirmar. */
  icon?: LucideIcon
}

export interface ConfirmContextValue {
  /** Abre el diálogo y resuelve `true` si el usuario confirma, `false` si cancela. */
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

export interface ConfirmDialogProps {
  open: boolean
  options: ConfirmOptions | null
  onConfirm: () => void
  onCancel: () => void
}
