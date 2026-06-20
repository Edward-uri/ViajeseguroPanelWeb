interface StatCardProps {
  value: number | string
  label: string
  accent?: 'primary' | 'success'
}

export function StatCard({ value, label, accent = 'primary' }: StatCardProps) {
  const borderColor = accent === 'success' ? 'border-l-success' : 'border-l-primary'
  return (
    <div className={`flex-1 rounded-xl border border-border border-l-4 ${borderColor} bg-white px-5 py-4`}>
      <div className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {value}
      </div>
      <div className="mt-1 text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {label}
      </div>
    </div>
  )
}
