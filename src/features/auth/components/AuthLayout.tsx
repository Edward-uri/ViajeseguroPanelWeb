import type { ReactNode } from 'react'
import { Logo } from '../../../shared/components/Logo'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div
        className="relative hidden w-[560px] shrink-0 flex-col justify-center overflow-hidden px-[72px] lg:flex"
        style={{ background: 'linear-gradient(180deg, #FF8F00 0%, #FFB300 100%)' }}
      >
        <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white">
          <Logo size={56} />
        </div>
        <h1 className="mt-8 text-6xl font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Jala</h1>
        <p className="mt-4 text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Panel de administración</p>
        <p className="mt-2 text-base text-white/85" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Verifica conductores y mantén la flota segura.</p>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[400px] px-8">{children}</div>
      </div>
    </div>
  )
}
