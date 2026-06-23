export interface SidebarProps {
  /** Visible como drawer en pantallas pequeñas. En lg+ siempre está fijo. */
  open: boolean
  /** Cierra el drawer (al navegar, tocar el fondo o el botón cerrar). */
  onClose: () => void
}
