export type ReviewDecision =
  | { estado: 'aprobado' }
  | { estado: 'rechazado'; motivoRechazo: string }
