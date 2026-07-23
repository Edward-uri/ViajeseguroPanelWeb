/** Fila de la lista admin: un conductor con su acumulado de reportes. */
export interface ConductorReportadoDto {
  idConductor: number
  nombre: string | null
  conteo: number
  ultimoReporte: string | null
  estadoCuenta: string
}

/** Respuesta paginada + el umbral de veto configurado en el backend. */
export interface ListaConductoresReportadosDto {
  data: ConductorReportadoDto[]
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

/** Detalle admin: contacto del conductor + sus reportes + umbral. */
export interface DetalleConductorReportadoDto {
  idConductor: number
  nombre: string | null
  telefono: string | null
  correo: string | null
  estadoCuenta: string
  conteo: number
  reportes: ReporteConReportanteDto[]
  umbral: number
}
