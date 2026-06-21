import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ModalProps } from './Modal.types'

export function Modal({ isOpen, onClose, children, labelledById, size = 'md', elevated = false }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxW = size === 'lg' ? 'max-w-[860px]' : 'max-w-[520px]'

  return createPortal(
    <div
      className={`fixed inset-0 ${elevated ? 'z-60' : 'z-50'} flex items-center justify-center bg-black/40 p-4`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        tabIndex={-1}
        className={`w-full ${maxW} rounded-2xl bg-white p-6 shadow-2xl outline-none`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
