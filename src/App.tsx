import { Toaster } from 'sileo'
import { AuthProvider } from './features/auth/AuthProvider'
import { AppRouter } from './routes'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      {/* fill = --color-ink: toast oscuro de marca (legible sobre fondo claro),
          con los colores de estado (verde/rojo/azul) en el título e icono. */}
      <Toaster position="top-right" options={{ fill: '#1A1410' }} />
    </AuthProvider>
  )
}

export default App
