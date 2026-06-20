import { useCallback, useEffect, useState } from 'react'
import { vehicleService, documentService, type Vehicle, type ReviewDocument } from '../../../shared/data'

export function useVehicleDetailViewModel(vehicleId: string | undefined) {
  const [vehicle, setVehicle] = useState<Vehicle | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [viewerDoc, setViewerDoc] = useState<ReviewDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<ReviewDocument | null>(null)

  const reload = useCallback(() => {
    if (!vehicleId) return
    vehicleService.getVehicleById(vehicleId).then((v) => { setVehicle(v); setIsLoading(false) })
  }, [vehicleId])

  useEffect(() => { reload() }, [reload])

  const openViewer = (doc: ReviewDocument) => setViewerDoc(doc)
  const closeViewer = () => setViewerDoc(null)
  const openReject = (doc: ReviewDocument) => { setViewerDoc(null); setRejectDoc(doc) }
  const closeReject = () => setRejectDoc(null)
  const approve = async (doc: ReviewDocument) => { await documentService.approveDocument(doc.id); setViewerDoc(null); reload() }
  const confirmReject = async (doc: ReviewDocument, reason: string) => { await documentService.rejectDocument(doc.id, reason); setRejectDoc(null); reload() }

  return { vehicle, isLoading, viewerDoc, rejectDoc, openViewer, closeViewer, openReject, closeReject, approve, confirmReject }
}
