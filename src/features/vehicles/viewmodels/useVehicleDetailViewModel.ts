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
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setIsLoading(true); setError(null)
    getVehicleDetail(id)
      .then((d) => { setDetail(d); void getMunicipioName(d.idMunicipio).then(setMunicipio) })
      .catch((e) => setError(friendlyMessage(e)))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const openViewer = (doc: ReviewDocument) => {
    setViewerDoc(doc); setFileUrl(null)
    if (doc.idDocumento == null) return
    setFileLoading(true)
    getVehicleDocumentFile(doc.idDocumento)
      .then(setFileUrl)
      .catch(() => notify.error('No se pudo cargar el documento.'))
      .finally(() => setFileLoading(false))
  }
  const closeViewer = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl)
    setViewerDoc(null); setFileUrl(null)
  }
  const openReject = (doc: ReviewDocument) => { closeViewer(); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)

  const approve = async (doc: ReviewDocument) => {
    if (doc.idDocumento == null) return
    try { await approveVehicleDocument(doc.idDocumento); notify.success('Documento aprobado.'); closeViewer(); load() } catch (e) { notify.error(e) }
  }
  const confirmReject = async (doc: ReviewDocument, motivo: string) => {
    if (doc.idDocumento == null) return
    try { await rejectVehicleDocument(doc.idDocumento, motivo); notify.success('Documento rechazado.'); setRejectDoc(null); load() } catch (e) { notify.error(e) }
  }

  return { detail, municipio, isLoading, error, retry: load, viewerDoc, rejectDoc, fileUrl, fileLoading, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
