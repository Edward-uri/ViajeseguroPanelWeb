import logoUrl from '../../assets/logo-jala.svg'

interface LogoProps {
  size?: number
  className?: string
}

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
