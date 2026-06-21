import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from '../icons'
import type { PasswordFieldProps } from './PasswordField.types'

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  autoComplete = 'current-password',
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-semibold uppercase tracking-wide text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border bg-white px-4 py-4 pr-12 text-base text-ink outline-none transition-colors duration-200 placeholder:text-placeholder focus:border-primary disabled:opacity-50"
          style={{ fontFamily: 'var(--font-family-jakarta)' }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-ink"
        >
          {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      </div>
    </div>
  )
}
