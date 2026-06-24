export const paths = {
  login: '/login',
  verificar: '/verificar',
  crearPassword: '/crear-password',
  aceptarInvitacion: '/aceptar-invitacion',
  revision: '/revision',
  driverDetail: (id: string | number) => `/revision/${id}`,
  vehiculos: '/vehiculos',
  vehicleDetail: (id: string | number) => `/vehiculos/${id}`,
  conductores: '/conductores',
  zonas: '/zonas',
  administradores: '/administradores',
  ajustes: '/ajustes',
} as const
