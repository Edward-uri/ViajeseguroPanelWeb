import type { ReviewDocument } from './types'
import { findDocument, store } from './mockStore'

const delay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const documentService = {
  approveDocument: (docId: string): Promise<ReviewDocument> => {
    const doc = findDocument(docId)
    if (!doc) return Promise.reject(new Error('Documento no encontrado'))
    doc.status = 'aprobado'
    doc.rejectionReason = undefined
    store.driverApprovedToday += 1
    return delay(structuredClone(doc))
  },
  rejectDocument: (docId: string, reason: string): Promise<ReviewDocument> => {
    const doc = findDocument(docId)
    if (!doc) return Promise.reject(new Error('Documento no encontrado'))
    doc.status = 'rechazado'
    doc.rejectionReason = reason
    return delay(structuredClone(doc))
  },
}
