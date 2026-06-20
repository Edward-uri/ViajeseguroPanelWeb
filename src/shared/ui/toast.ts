import { sileo } from 'sileo'
import { friendlyMessage } from '../api/errors'

export const notify = {
  success: (message: string) => sileo.success({ title: message }),
  error: (e: unknown) => sileo.error({ title: typeof e === 'string' ? e : friendlyMessage(e) }),
  info: (message: string) => sileo.info({ title: message }),
}
