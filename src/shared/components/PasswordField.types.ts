export interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  autoComplete?: 'current-password' | 'new-password'
}
