interface DocumentThumbnailProps {
  uploaded: boolean
  size?: 'card' | 'large'
}

export function DocumentThumbnail({ uploaded, size = 'card' }: DocumentThumbnailProps) {
  const height = size === 'large' ? 'h-[320px]' : 'h-[120px]'

  if (!uploaded) {
    return (
      <div className={`flex ${height} flex-col items-center justify-center gap-2 rounded-xl bg-neutral-bg`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-placeholder">
          <path d="M12 16V4M12 4L7 9M12 4l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-xs text-placeholder" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
          No subido
        </span>
      </div>
    )
  }

  return (
    <div className={`flex ${height} items-center justify-center rounded-xl bg-neutral-bg p-6`}>
      <div className="w-full max-w-[300px] overflow-hidden rounded-md bg-white shadow-sm">
        <div className="h-3 w-full bg-primary" />
        <div className="flex gap-3 p-4">
          <div className="h-12 w-10 shrink-0 rounded bg-border" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div className="h-2 w-3/4 rounded bg-border" />
            <div className="h-2 w-full rounded bg-border" />
            <div className="h-2 w-2/3 rounded bg-border" />
          </div>
        </div>
      </div>
    </div>
  )
}
