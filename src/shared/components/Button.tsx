import { SpinnerIcon } from '../icons'
import type { ButtonVariant, ButtonSize, ButtonProps } from './Button.types'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100'

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-sm shadow-primary/30 hover:bg-primary-light hover:shadow-md focus-visible:ring-primary/40',
  success: 'bg-success text-white shadow-sm hover:brightness-110 focus-visible:ring-success/40',
  danger: 'bg-red text-white shadow-sm hover:brightness-110 focus-visible:ring-red/40',
  outline: 'border border-primary/30 bg-white text-primary hover:border-primary hover:bg-sidebar-active focus-visible:ring-primary/30',
  dangerOutline: 'border border-red/30 bg-white text-red hover:border-red hover:bg-danger-bg focus-visible:ring-red/30',
  ghost: 'bg-transparent text-ink hover:bg-surface focus-visible:ring-border',
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
  icon: Icon,
}: ButtonProps) {
  const iconSize = size === 'sm' ? 16 : 18
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFamily: 'var(--font-family-jakarta)' }}
    >
      {isLoading ? (
        <>
          <SpinnerIcon size={iconSize} className="animate-spin" />
          Cargando…
        </>
      ) : (
        <>
          {Icon && <Icon size={iconSize} strokeWidth={2.25} />}
          {children}
        </>
      )}
    </button>
  )
}
