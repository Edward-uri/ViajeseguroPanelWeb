export interface QueueStateProps {
  isLoading: boolean
  error: string | null
  isEmpty: boolean
  emptyText: string
  onRetry: () => void
}
