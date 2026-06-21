import type { StatCardProps } from './StatCard.types'

const chips = {
  primary: 'bg-sidebar-active text-primary',
  success: 'bg-success-bg text-success',
} as const

export function StatCard({ value, label, accent = 'primary', icon: Icon }: StatCardProps) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-2xl border border-border bg-white px-5 py-4 transition-shadow duration-200 hover:shadow-sm">
      <div>
        <div className="text-[28px] font-bold leading-none text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          {value}
        </div>
        <div className="mt-2 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          {label}
        </div>
      </div>
      {Icon && (
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${chips[accent]}`}>
          <Icon size={22} strokeWidth={2} />
        </span>
      )}
    </div>
  )
}
