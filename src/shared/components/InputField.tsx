interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[13px] font-semibold uppercase tracking-wide text-ink"
        style={{ fontFamily: 'var(--font-family-jakarta)' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-border bg-white px-4 py-4 text-base text-ink outline-none transition-colors duration-200 placeholder:text-placeholder focus:border-primary disabled:opacity-50"
        style={{ fontFamily: 'var(--font-family-jakarta)' }}
      />
    </div>
  )
}
