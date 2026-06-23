export interface InviteAdminModalProps {
  open: boolean
  sending: boolean
  onClose: () => void
  onSubmit: (correo: string) => void
}
