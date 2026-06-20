export const paths = {
  login: '/login',
  verificar: '/verificar',
  revision: '/revision',
  driverDetail: (id: string | number) => `/revision/${id}`,
  vehiculos: '/vehiculos',
  vehicleDetail: (id: string | number) => `/vehiculos/${id}`,
  conductores: '/conductores',
  ajustes: '/ajustes',
} as const
