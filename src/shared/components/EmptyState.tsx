import { Button } from './Button'
import type { EmptyStateProps } from './EmptyState.types'

const tones = {
  neutral: 'bg-neutral-bg text-ink-soft',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-red',
} as const

export function EmptyState({ icon: Icon, title, description, tone = 'neutral', action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
      <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tones[tone]}`}>
        <Icon size={30} strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 text-base font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button size="sm" icon={action.icon} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button size="sm" variant="outline" icon={secondaryAction.icon} onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
