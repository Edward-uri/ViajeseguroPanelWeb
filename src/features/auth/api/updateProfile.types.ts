/**
 * Campos editables del perfil (PUT /users/me, actualización parcial).
 * El correo NO es editable. El rol lo deriva el backend del token, no se envía.
 */
export interface UpdateProfileInput {
  nombre?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  fechaNacimiento?: string
  telefono?: string
  idSexo?: number
}
