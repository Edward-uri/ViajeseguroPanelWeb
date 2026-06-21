import { useCallback, useState, type ReactNode } from 'react'
import { ConfirmContext } from './ConfirmContext'
import { ConfirmDialog } from './ConfirmDialog'
import type { ConfirmOptions } from './confirm.types'

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<{ options: ConfirmOptions; resolve: (v: boolean) => void } | null>(null)

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ options, resolve })),
    [],
  )

  const settle = (value: boolean) => {
    pending?.resolve(value)
    setPending(null)
  }

  return (
    <ConfirmContext value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={!!pending}
        options={pending?.options ?? null}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext>
  )
}
