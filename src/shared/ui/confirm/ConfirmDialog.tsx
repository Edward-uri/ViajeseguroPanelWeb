import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { CloseIcon, WarningIcon, QuestionIcon } from '../../icons'
import type { ConfirmDialogProps } from './confirm.types'

const jakarta = { fontFamily: 'var(--font-family-jakarta)' }

export function ConfirmDialog({ open, options, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!options) return null
  const tone = options.tone ?? 'default'
  const Icon = options.icon ?? (tone === 'danger' ? WarningIcon : QuestionIcon)
  const chip = tone === 'danger' ? 'bg-danger-bg text-red' : 'bg-sidebar-active text-primary'

  return (
    <Modal isOpen={open} onClose={onCancel} labelledById="confirm-title" size="md" elevated>
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${chip}`}>
          <Icon size={22} />
        </span>
        <div className="flex-1">
          <h2 id="confirm-title" className="text-lg font-bold text-ink" style={jakarta}>{options.title}</h2>
          {options.message && <p className="mt-1 text-sm text-ink-soft" style={jakarta}>{options.message}</p>}
        </div>
        <button onClick={onCancel} aria-label="Cerrar" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-ink">
          <CloseIcon size={18} />
        </button>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onCancel}>{options.cancelLabel ?? 'Cancelar'}</Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="sm" icon={options.icon} onClick={onConfirm}>
          {options.confirmLabel ?? 'Confirmar'}
        </Button>
      </div>
    </Modal>
  )
}
