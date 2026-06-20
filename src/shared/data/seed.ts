import type { Driver, Vehicle } from './types'

export const seedDrivers: Driver[] = [
  {
    id: '12',
    name: 'Carlos Méndez',
    phone: '9611234567',
    status: 'en_revision',
    license: { number: 'ABC123456', issuedAt: '15/03/2022', expiresAt: '15/03/2027' },
    documents: [
      { id: 'd12-lic', kind: 'licencia', label: 'Licencia de conducir', status: 'aprobado', optional: false, fileName: 'licencia.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-ine-f', kind: 'ine_frente', label: 'INE (frente)', status: 'pendiente', optional: false, fileName: 'ine_frente.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-ine-r', kind: 'ine_reverso', label: 'INE (reverso)', status: 'pendiente', optional: false, fileName: 'ine_reverso.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-tc', kind: 'tarjeta_circulacion', label: 'Tarjeta de circulación', status: 'pendiente', optional: false, fileName: 'tarjeta.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'd12-foto', kind: 'foto_vehiculo', label: 'Foto del vehículo', status: 'faltante', optional: false },
    ],
  },
  {
    id: '18',
    name: 'Ana López',
    phone: '9617654321',
    status: 'en_revision',
    license: { number: 'XYZ987654', issuedAt: '01/06/2023', expiresAt: '01/06/2028' },
    documents: [
      { id: 'd18-lic', kind: 'licencia', label: 'Licencia de conducir', status: 'aprobado', optional: false, fileName: 'licencia.jpg', uploadedAt: '14 jun 2026, 12:00' },
      { id: 'd18-ine-f', kind: 'ine_frente', label: 'INE (frente)', status: 'pendiente', optional: false, fileName: 'ine_frente.jpg', uploadedAt: '14 jun 2026, 12:00' },
    ],
  },
]

export const seedVehicles: Vehicle[] = [
  {
    id: 'XYZ-123',
    plate: 'XYZ-123',
    model: 'Bajaj RE',
    color: 'Rojo',
    year: 2021,
    municipality: 'Tuxtla Gutiérrez',
    ownerName: 'Carlos Méndez',
    ownerPhone: '9611234567',
    status: 'en_revision',
    documents: [
      { id: 'v-xyz-tc', kind: 'tarjeta_circulacion', label: 'Tarjeta de circulación', status: 'pendiente', optional: false, fileName: 'tarjeta.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'v-xyz-foto', kind: 'foto_vehiculo', label: 'Foto del vehículo (placa visible)', status: 'aprobado', optional: false, fileName: 'foto.jpg', uploadedAt: '14 jun 2026, 18:00' },
      { id: 'v-xyz-permiso', kind: 'permiso_municipal', label: 'Permiso/concesión municipal', status: 'faltante', optional: true },
    ],
  },
]

export const seedStats = { driverApprovedToday: 8, vehicleActivatedToday: 5 }
