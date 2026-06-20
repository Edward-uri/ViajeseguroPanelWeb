const LABELS: Record<string, string> = {
  licencia: 'Licencia de conducir',
  ine_frente: 'INE (frente)',
  ine_reverso: 'INE (reverso)',
  tarjeta_circulacion: 'Tarjeta de circulación',
  foto_vehiculo: 'Foto del vehículo',
  permiso_municipal: 'Permiso/concesión municipal',
}

export function documentLabel(tipo: string): string {
  return LABELS[tipo] ?? tipo
}
