import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Button } from '../../../shared/components/Button'

export function SettingsView() {
  const navigate = useNavigate()
  return (
    <div className="p-8">
      <PageHeader title="Ajustes" subtitle="Perfil y preferencias" />
      <div className="max-w-xl rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-base font-bold text-white" style={{ fontFamily: 'var(--font-family-jakarta)' }}>A</span>
          <div>
            <div className="text-base font-semibold text-ink" style={{ fontFamily: 'var(--font-family-jakarta)' }}>Administrador</div>
            <div className="text-sm text-ink-soft" style={{ fontFamily: 'var(--font-family-jakarta)' }}>admin@jala.local</div>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <Button variant="dangerOutline" onClick={() => navigate('/login')}>Cerrar sesión</Button>
        </div>
      </div>
    </div>
  )
}
