import type { SelectOption } from '../components/ui/FormField'
import type { OkNotOk, ProductionLine, Shift, YesNo } from '../types/domain'

export const LINE_OPTIONS: SelectOption[] = (['MANDO-01', 'MANDO-02', 'MANDO-03', 'MANDO-06'] satisfies ProductionLine[]).map((v) => ({
  value: v,
  label: v,
}))

export const SHIFT_OPTIONS: SelectOption[] = (['1st', '2nd', '3rd'] satisfies Shift[]).map((v) => ({ value: v, label: `${v} Shift` }))

export const FURNACE_OPTIONS: SelectOption[] = ['HF1', 'HF2', 'HF3', 'HF4', 'HF5', 'HF6', 'HF11', 'HF12'].map((v) => ({ value: v, label: v }))

export const YES_NO_OPTIONS: SelectOption[] = (['YES', 'NO'] satisfies YesNo[]).map((v) => ({ value: v, label: v }))

export const OK_NOT_OK_OPTIONS: SelectOption[] = (['OK', 'NOT OK'] satisfies OkNotOk[]).map((v) => ({ value: v, label: v }))

export const SUPERVISOR_OPTIONS: SelectOption[] = ['Vimal', 'Bharathi', 'Mohan', 'Naveen', 'Ashok'].map((v) => ({ value: v, label: v }))
