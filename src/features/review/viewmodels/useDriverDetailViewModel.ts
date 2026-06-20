import { useCallback, useEffect, useState } from 'react'
import { reviewService, documentService, type Driver, type ReviewDocument } from '../../../shared/data'

export function useDriverDetailViewModel(driverId: string | undefined) {
  const [driver, setDriver] = useState<Driver | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)

  const reload = useCallback(() => {
    if (!driverId) return
    reviewService.getDriverById(driverId).then((d) => { setDriver(d); setIsLoading(false) })
  }, [driverId])

  useEffect(() => { reload() }, [reload])

  const openViewer = (doc: ReviewDocument) => setViewerDoc(doc)
  const closeViewer = () => setViewerDoc(null)
  const openReject = (doc: ReviewDocument) => { setViewerDoc(null); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)

  const approve = async (doc: ReviewDocument) => {
    await documentService.approveDocument(doc.id)
    setViewerDoc(null)
    reload()
  }
  const confirmReject = async (doc: ReviewDocument, reason: string) => {
    await documentService.rejectDocument(doc.id, reason)
    setRejectDoc(null)
    reload()
  }

  return { driver, isLoading, viewerDoc, rejectDoc, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
