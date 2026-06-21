import { createContext } from 'react'
import type { ConfirmContextValue } from './confirm.types'

export const ConfirmContext = createContext<ConfirmContextValue | null>(null)
