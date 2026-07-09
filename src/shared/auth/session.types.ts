export type Rol = 'pasajero' | 'conductor' | 'propietario' | 'admin'
export type EstadoCuenta = 'activo' | 'suspendido' | 'eliminado'

export interface AuthUser {
  idUsuario: number
  telefono: string
  correoElectronico: string | null
  rol: Rol
  // multi-rol: presente desde backend fase 2; rol = principal derivado
  roles?: Rol[]
  estadoCuenta: EstadoCuenta
  telefonoVerificado: boolean
  tienePassword: boolean
  idMunicipio: number | null
  fotoPerfilUrl: string | null
  fechaRegistro: string | null
  esPropietario?: boolean
}

export interface Session {
  accessToken: string
  refreshToken: string
  user: AuthUser
}
