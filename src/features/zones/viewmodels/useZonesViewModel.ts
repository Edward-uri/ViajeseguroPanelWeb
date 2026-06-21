import { useCallback, useEffect, useState } from 'react'
import { listMunicipios } from '../../../shared/api/catalog/listMunicipios'
import { getZones } from '../api/getZones'
import { createZone } from '../api/createZone'
import { updateZone } from '../api/updateZone'
import { deleteZone } from '../api/deleteZone'
import { useConfirm } from '../../../shared/ui/confirm'
import { notify } from '../../../shared/ui/toast'
import { PowerIcon } from '../../../shared/icons'
import { friendlyMessage } from '../../../shared/api/errors'
import type { Municipio } from '../../../shared/api/catalog/municipios.types'
import type { Zone, ZoneInput } from '../zone.types'

export function useZonesViewModel() {
  const confirm = useConfirm()
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [municipioId, setMunicipioId] = useState<number | null>(null)
  const [zones, setZones] = useState<Zone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Zone | null>(null)
  const [saving, setSaving] = useState(false)

  const retry = useCallback(() => setTick((n) => n + 1), [])

  // Carga el catálogo de municipios una sola vez y selecciona el primero.
  useEffect(() => {
    let active = true
    listMunicipios()
      .then((list) => {
        if (!active) return
        setMunicipios(list)
        setMunicipioId((cur) => cur ?? list[0]?.idMunicipio ?? null)
        if (list.length === 0) setIsLoading(false)
      })
      .catch((e) => { if (active) { setError(friendlyMessage(e)); setIsLoading(false) } })
    return () => { active = false }
  }, [])

  // Carga las zonas del municipio seleccionado (y al reintentar).
  useEffect(() => {
    if (municipioId == null) return
    let active = true
    // setState diferido a microtask para no disparar setState síncrono en el efecto.
    Promise.resolve().then(() => { if (active) { setIsLoading(true); setError(null) } })
    getZones(municipioId)
      .then((list) => { if (active) { setZones(list); setError(null); setIsLoading(false) } })
      .catch((e) => { if (active) { setError(friendlyMessage(e)); setIsLoading(false) } })
    return () => { active = false }
  }, [municipioId, tick])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (zone: Zone) => { setEditing(zone); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditing(null) }

  const submitForm = async (input: ZoneInput): Promise<void> => {
    if (municipioId == null) return
    setSaving(true)
    try {
      if (editing) {
        await updateZone(municipioId, editing.idZona, {
          nombre: input.nombre,
          precio: input.precio,
          lat: input.lat ?? undefined,
          lng: input.lng ?? undefined,
        })
        notify.success('Zona actualizada.')
      } else {
        await createZone(municipioId, input)
        notify.success('Zona creada.')
      }
      setFormOpen(false)
      setEditing(null)
      setTick((n) => n + 1)
    } catch (e) {
      notify.error(e)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (zone: Zone): Promise<void> => {
    if (municipioId == null) return
    if (zone.activo) {
      const ok = await confirm({
        title: 'Desactivar zona',
        message: `La zona "${zone.nombre}" dejará de estar disponible para tarifar. ¿Continuar?`,
        confirmLabel: 'Desactivar',
        tone: 'danger',
        icon: PowerIcon,
      })
      if (!ok) return
      try { await deleteZone(municipioId, zone.idZona); notify.success('Zona desactivada.'); setTick((n) => n + 1) } catch (e) { notify.error(e) }
    } else {
      try { await updateZone(municipioId, zone.idZona, { activo: true }); notify.success('Zona activada.'); setTick((n) => n + 1) } catch (e) { notify.error(e) }
    }
  }

  return {
    municipios, municipioId, setMunicipioId,
    zones, isLoading, error, retry,
    formOpen, editing, saving,
    openCreate, openEdit, closeForm, submitForm, toggleActive,
  }
}
