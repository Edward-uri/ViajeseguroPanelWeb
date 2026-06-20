import { Toaster } from 'sileo'
import { AuthProvider } from './features/auth/AuthProvider'
import { AppRouter } from './routes'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
