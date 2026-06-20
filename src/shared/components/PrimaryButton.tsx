import type { PrimaryButtonProps } from './PrimaryButton.types'

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full rounded-[10px] py-4 text-base font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background: 'linear-gradient(180deg, #FF8F00 0%, #FFB300 100%)',
        boxShadow: '0px 4px 14px 0px rgba(255, 143, 0, 0.35)',
        fontFamily: 'var(--font-family-jakarta)',
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
