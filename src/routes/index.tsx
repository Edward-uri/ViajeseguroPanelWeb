import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../shared/layouts/AppLayout'
import { LoginView, CodeVerificationView } from '../features/auth'
import { ReviewQueueView, DriverDetailView } from '../features/review'
import { VehicleQueueView, VehicleDetailView } from '../features/vehicles'
import { DriversListView } from '../features/drivers'
import { SettingsView } from '../features/settings'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/verificar" element={<CodeVerificationView />} />
        <Route element={<AppLayout />}>
          <Route path="/revision" element={<ReviewQueueView />} />
          <Route path="/revision/:driverId" element={<DriverDetailView />} />
          <Route path="/vehiculos" element={<VehicleQueueView />} />
          <Route path="/vehiculos/:vehicleId" element={<VehicleDetailView />} />
          <Route path="/conductores" element={<DriversListView />} />
          <Route path="/ajustes" element={<SettingsView />} />
        </Route>
        <Route path="/" element={<Navigate to="/revision" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
