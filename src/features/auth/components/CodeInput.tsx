import { useRef, useEffect } from 'react'

interface CodeInputProps {
  code: string[]
  onChange: (index: number, value: string) => void
  disabled?: boolean
}

export function CodeInput({ code, onChange, disabled = false }: CodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      onChange(index - 1, '')
    }
  }

  const handleChange = (index: number, value: string) => {
    onChange(index, value)
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    pasted.split('').forEach((char, i) => {
      if (i < 4) {
        onChange(i, char)
      }
    })
    const focusIndex = Math.min(pasted.length, 3)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[13px] font-semibold uppercase tracking-wide text-ink"
        style={{ fontFamily: 'var(--font-family-jakarta)' }}
      >
        Código de verificación
      </label>
      <div className="flex gap-3">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            className="h-[72px] w-[72px] rounded-xl border border-border bg-white text-center text-3xl font-bold text-ink outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            style={{ fontFamily: 'var(--font-family-jakarta)' }}
          />
        ))}
      </div>
    </div>
  )
}
