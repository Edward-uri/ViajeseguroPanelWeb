import { useCallback, useEffect, useState } from 'react'
import { getDriverDetail } from '../api/getDriverDetail'
import { approveDriverDocument } from '../../documents/api/approveDriverDocument'
import { rejectDriverDocument } from '../../documents/api/rejectDriverDocument'
import { getDriverDocumentFile } from '../../documents/api/getDriverDocumentFile'
import { notify } from '../../../shared/ui/toast'
import { friendlyMessage } from '../../../shared/api/errors'
import type { DriverDetail, ReviewDocument } from '../../../shared/domain'

export function useDriverDetailViewModel(id: string | undefined) {
  const [detail, setDetail] = useState<DriverDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setIsLoading(true); setError(null)
    getDriverDetail(id)
      .then(setDetail)
      .catch((e) => setError(friendlyMessage(e)))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const openViewer = (doc: ReviewDocument) => {
    setViewerDoc(doc); setFileUrl(null)
    if (doc.idDocumento == null) return
    setFileLoading(true)
    getDriverDocumentFile(doc.idDocumento)
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
    try { await approveDriverDocument(doc.idDocumento); notify.success('Documento aprobado.'); closeViewer(); load() } catch (e) { notify.error(e) }
  }
  const confirmReject = async (doc: ReviewDocument, motivo: string) => {
    if (doc.idDocumento == null) return
    try { await rejectDriverDocument(doc.idDocumento, motivo); notify.success('Documento rechazado.'); setRejectDoc(null); load() } catch (e) { notify.error(e) }
  }

  return { detail, isLoading, error, retry: load, viewerDoc, rejectDoc, fileUrl, fileLoading, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
