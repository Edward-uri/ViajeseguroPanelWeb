export type RolReportado = 'conductor' | 'pasajero'

/** Fila de la lista admin: un usuario reportado en un rol, con su acumulado. */
export interface UsuarioReportadoDto {
  idUsuario: number
  rol: RolReportado
  nombre: string | null
  conteo: number
  ultimoReporte: string | null
  estadoCuenta: string
}

/** Respuesta paginada + el umbral de veto configurado en el backend. */
export interface ListaUsuariosReportadosDto {
  data: UsuarioReportadoDto[]
  page: number
  perPage: number
  total: number
  totalPages: number
  umbral: number
}

/** Un reporte visto desde el detalle admin (con nombre del reportante). */
export interface ReporteConReportanteDto {
  idReporte: number
  idViaje: number | null
  idReportante: number
  reportanteNombre: string | null
  motivo: string
  comentario: string | null
  creadoEn: string | null
}

/** Detalle admin: contacto del usuario + sus reportes en ese rol + umbral. */
export interface DetalleUsuarioReportadoDto {
  idUsuario: number
  rol: RolReportado
  nombre: string | null
  telefono: string | null
  correo: string | null
  estadoCuenta: string
  conteo: number
  reportes: ReporteConReportanteDto[]
  umbral: number
}
