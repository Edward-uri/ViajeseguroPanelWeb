export type Rol = 'pasajero' | 'conductor' | 'propietario' | 'admin'
export type EstadoCuenta = 'activo' | 'suspendido' | 'eliminado'

export interface AuthUser {
  idUsuario: number
  telefono: string
  correoElectronico: string | null
  rol: Rol
  estadoCuenta: EstadoCuenta
  telefonoVerificado: boolean
  tienePassword: boolean
  idMunicipio: number | null
  fotoPerfilUrl: string | null
  fechaRegistro: string | null
}

export interface Session {
  accessToken: string
  refreshToken: string
  user: AuthUser
}
