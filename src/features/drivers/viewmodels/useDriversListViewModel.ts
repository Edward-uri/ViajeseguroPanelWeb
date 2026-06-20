import { useEffect, useState } from 'react'
import { reviewService, type Driver } from '../../../shared/data'

export function useDriversListViewModel() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let active = true
    reviewService.getAllDrivers().then((d) => { if (active) { setDrivers(d); setIsLoading(false) } })
    return () => { active = false }
  }, [])
  return { drivers, isLoading }
}
