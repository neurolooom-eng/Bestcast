export type PurchaseCategory = 'Raw Material' | 'Consumables' | 'Spares' | 'Tooling' | 'Services'
export type PurchaseOrderStatus = 'draft' | 'approved' | 'ordered' | 'received' | 'cancelled'

export interface PurchaseOrder {
  id: string
  poNumber: string
  vendorName: string
  category: PurchaseCategory
  itemDescription: string
  quantity: number
  unit: string
  unitPrice: number
  orderDate: string
  expectedDeliveryDate: string
  status: PurchaseOrderStatus
  requestedBy: string
}

export type StoreCategory = 'Raw Material' | 'Consumable' | 'Spare Part' | 'Finished Goods' | 'Packing Material'

export interface StoreItem {
  id: string
  itemCode: string
  itemName: string
  category: StoreCategory
  unitOfMeasure: string
  quantityInStock: number
  reorderLevel: number
  unitCost: number
  location: string
  lastUpdated: string
}

export type VoucherType = 'Purchase Invoice' | 'Sales Invoice' | 'Payment' | 'Receipt'
export type VoucherStatus = 'Pending' | 'Paid' | 'Overdue' | 'Cancelled'

export interface AccountVoucher {
  id: string
  voucherNo: string
  type: VoucherType
  party: string
  amount: number
  voucherDate: string
  dueDate: string
  status: VoucherStatus
  paymentMode: string
  reference: string
}

export type LedgerGroup = 'Assets' | 'Liabilities' | 'Equity' | 'Income' | 'Expenses'

/** Chart-of-accounts style ledger master (Tally-style "Ledgers under Groups"), distinct from the transactional AccountVouchers. */
export interface LedgerAccount {
  id: string
  accountCode: string
  accountName: string
  group: LedgerGroup
  openingBalance: number
  debit: number
  credit: number
  asOfDate: string
}
