import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'success' | 'danger' | 'outline' | 'dangerOutline' | 'ghost'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  isLoading?: boolean
  fullWidth?: boolean
}
