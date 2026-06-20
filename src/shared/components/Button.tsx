import type { ButtonVariant, ButtonSize, ButtonProps } from './Button.types'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:brightness-105',
  success: 'bg-success text-white hover:brightness-105',
  danger: 'bg-red text-white hover:brightness-105',
  outline: 'border border-primary bg-white text-primary hover:bg-sidebar-active',
  dangerOutline: 'border border-red bg-white text-red hover:bg-danger-bg',
  ghost: 'bg-transparent text-ink hover:bg-surface',
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFamily: 'var(--font-family-jakarta)' }}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
