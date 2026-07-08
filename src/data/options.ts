import type { SelectOption } from '../components/ui/FormField'
import type {
  LedgerGroup,
  PurchaseCategory,
  PurchaseOrderStatus,
  StoreCategory,
  VoucherStatus,
  VoucherType,
} from '../types/business'
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

export const PURCHASE_CATEGORY_OPTIONS: SelectOption[] = (
  ['Raw Material', 'Consumables', 'Spares', 'Tooling', 'Services'] satisfies PurchaseCategory[]
).map((v) => ({ value: v, label: v }))

export const PURCHASE_ORDER_STATUS_OPTIONS: SelectOption[] = (
  ['draft', 'approved', 'ordered', 'received', 'cancelled'] satisfies PurchaseOrderStatus[]
).map((v) => ({ value: v, label: v }))

export const STORE_CATEGORY_OPTIONS: SelectOption[] = (
  ['Raw Material', 'Consumable', 'Spare Part', 'Finished Goods', 'Packing Material'] satisfies StoreCategory[]
).map((v) => ({ value: v, label: v }))

export const VOUCHER_TYPE_OPTIONS: SelectOption[] = (
  ['Purchase Invoice', 'Sales Invoice', 'Payment', 'Receipt'] satisfies VoucherType[]
).map((v) => ({ value: v, label: v }))

export const VOUCHER_STATUS_OPTIONS: SelectOption[] = (
  ['Pending', 'Paid', 'Overdue', 'Cancelled'] satisfies VoucherStatus[]
).map((v) => ({ value: v, label: v }))

export const LEDGER_GROUP_OPTIONS: SelectOption[] = (
  ['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses'] satisfies LedgerGroup[]
).map((v) => ({ value: v, label: v }))
