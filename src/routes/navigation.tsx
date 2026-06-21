import { paths } from './paths'
import { QueueIcon, VehicleIcon, DriversIcon, SettingsIcon } from '../shared/icons'
import type { NavItem } from './navigation.types'

const ICON_SIZE = 20

export const navItems: NavItem[] = [
  { label: 'Cola de revisión', to: paths.revision, icon: <QueueIcon size={ICON_SIZE} /> },
  { label: 'Vehículos', to: paths.vehiculos, icon: <VehicleIcon size={ICON_SIZE} /> },
  { label: 'Conductores', to: paths.conductores, icon: <DriversIcon size={ICON_SIZE} /> },
  { label: 'Ajustes', to: paths.ajustes, icon: <SettingsIcon size={ICON_SIZE} /> },
]
