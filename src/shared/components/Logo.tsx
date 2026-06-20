import logoUrl from '../../assets/logo-jala.svg'
import type { LogoProps } from './Logo.types'

export function Logo({ size = 36, className }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Jala"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
