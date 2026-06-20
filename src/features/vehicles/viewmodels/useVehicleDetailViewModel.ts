import { useCallback, useEffect, useState } from 'react'
import { getVehicleDetail } from '../api/getVehicleDetail'
import { approveVehicleDocument } from '../../documents/api/approveVehicleDocument'
import { rejectVehicleDocument } from '../../documents/api/rejectVehicleDocument'
import { getVehicleDocumentFile } from '../../documents/api/getVehicleDocumentFile'
import { getMunicipioName } from '../../../shared/api/catalog/getMunicipios'
import { notify } from '../../../shared/ui/toast'
import { friendlyMessage } from '../../../shared/api/errors'
import type { VehicleDetail, ReviewDocument } from '../../../shared/domain'

export function useVehicleDetailViewModel(id: string | undefined) {
  const [detail, setDetail] = useState<VehicleDetail | null>(null)
  const [municipio, setMunicipio] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)

  const retry = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    if (!id) return
    let active = true
    getVehicleDetail(id)
      .then((d) => {
        if (!active) return
        setDetail(d)
        setError(null)
        setIsLoading(false)
        void getMunicipioName(d.idMunicipio).then((name) => { if (active) setMunicipio(name) })
      })
      .catch((e) => {
        if (!active) return
        setError(friendlyMessage(e))
        setIsLoading(false)
      })
    return () => { active = false }
  }, [id, tick])

  const openViewer = (doc: ReviewDocument) => {
    setViewerDoc(doc)
    setFileUrl(null)
    if (doc.idDocumento == null) return
    setFileLoading(true)
    getVehicleDocumentFile(doc.idDocumento)
      .then(setFileUrl)
      .catch(() => notify.error('No se pudo cargar el documento.'))
      .finally(() => setFileLoading(false))
  }

  const closeViewer = useCallback(() => {
    setFileUrl((url) => { if (url) URL.revokeObjectURL(url); return null })
    setViewerDoc(null)
  }, [])

  const openReject = (doc: ReviewDocument) => { closeViewer(); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)

  const approve = async (doc: ReviewDocument) => {
    if (doc.idDocumento == null) return
    try {
      await approveVehicleDocument(doc.idDocumento)
      notify.success('Documento aprobado.')
      closeViewer()
      setTick((n) => n + 1)
    } catch (e) { notify.error(e) }
  }

  const confirmReject = async (doc: ReviewDocument, motivo: string) => {
    if (doc.idDocumento == null) return
    try {
      await rejectVehicleDocument(doc.idDocumento, motivo)
      notify.success('Documento rechazado.')
      setRejectDoc(null)
      setTick((n) => n + 1)
    } catch (e) { notify.error(e) }
  }

  return { detail, municipio, isLoading, error, retry, viewerDoc, rejectDoc, fileUrl, fileLoading, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
