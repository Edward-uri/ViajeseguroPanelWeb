import type { PageHeaderProps } from './PageHeader.types'

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
