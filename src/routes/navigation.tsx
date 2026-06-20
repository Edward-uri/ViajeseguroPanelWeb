import { paths } from './paths'
import { QueueIcon } from '../shared/icons/QueueIcon'
import { VehicleIcon } from '../shared/icons/VehicleIcon'
import { DriversIcon } from '../shared/icons/DriversIcon'
import { SettingsIcon } from '../shared/icons/SettingsIcon'
import type { NavItem } from './navigation.types'

export const navItems: NavItem[] = [
  { label: 'Cola de revisión', to: paths.revision, icon: <QueueIcon /> },
  { label: 'Vehículos', to: paths.vehiculos, icon: <VehicleIcon /> },
  { label: 'Conductores', to: paths.conductores, icon: <DriversIcon /> },
  { label: 'Ajustes', to: paths.ajustes, icon: <SettingsIcon /> },
]
