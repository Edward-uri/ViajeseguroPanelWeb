import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppLayout } from '../shared/layouts/AppLayout'
import { RequireAuth } from '../features/auth/RequireAuth'
import { LoginView, CodeVerificationView, CreatePasswordView, AcceptInvitationView } from '../features/auth'
import { ReviewQueueView, DriverDetailView } from '../features/review'
import { VehicleQueueView, VehicleDetailView } from '../features/vehicles'
import { DriversListView } from '../features/drivers'
import { ReportsListView, ReportedUserDetailView } from '../features/reportes'
import { ZonesView } from '../features/zones'
import { AdminsView } from '../features/admins'
import { SettingsView } from '../features/settings'
import { paths } from './paths'

interface PrivateRoute {
  path: string
  element: ReactNode
}

const privateRoutes: PrivateRoute[] = [
  { path: paths.revision, element: <ReviewQueueView /> },
  { path: '/revision/:driverId', element: <DriverDetailView /> },
  { path: paths.vehiculos, element: <VehicleQueueView /> },
  { path: '/vehiculos/:vehicleId', element: <VehicleDetailView /> },
  { path: paths.conductores, element: <DriversListView /> },
  { path: paths.reportes, element: <ReportsListView /> },
  { path: '/reportes/:rol/:id', element: <ReportedUserDetailView /> },
  { path: paths.zonas, element: <ZonesView /> },
  { path: paths.administradores, element: <AdminsView /> },
  { path: paths.ajustes, element: <SettingsView /> },
]

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.login} element={<LoginView />} />
        <Route path={paths.verificar} element={<CodeVerificationView />} />
        <Route path={paths.crearPassword} element={<CreatePasswordView />} />
        <Route path={paths.aceptarInvitacion} element={<AcceptInvitationView />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            {privateRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>
        </Route>
        <Route path="/" element={<Navigate to={paths.revision} replace />} />
        <Route path="*" element={<Navigate to={paths.login} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
