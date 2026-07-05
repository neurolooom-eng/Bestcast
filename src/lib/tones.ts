import type { Tone } from '../components/ui/StatusChip'
import type { CheckSheetStatus, DocumentStatus, OkNotOk } from '../types/domain'

export const checkSheetStatusTone: Record<CheckSheetStatus, Tone> = {
  draft: 'neutral',
  submitted: 'info',
  approved: 'success',
}

export const documentStatusTone: Record<DocumentStatus, Tone> = {
  draft: 'neutral',
  'in-review': 'info',
  approved: 'success',
  obsolete: 'danger',
}

export const okNotOkTone: Record<OkNotOk, Tone> = {
  OK: 'success',
  'NOT OK': 'danger',
}
