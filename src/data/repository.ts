import * as sheets from '../lib/sheetsClient'
import type { SheetName } from '../lib/sheetsClient'
import type { CheckSheetRecord, QmsDocument, Specification } from '../types/domain'
import type { AccountVoucher, LedgerAccount, PurchaseOrder, StoreItem } from '../types/business'
import { ACCOUNT_VOUCHERS } from './accountVouchers'
import { CHECK_SHEETS } from './checkSheets'
import { DOCUMENTS } from './documents'
import { LEDGER_ACCOUNTS } from './ledgerAccounts'
import { PURCHASE_ORDERS } from './purchaseOrders'
import { SPECIFICATIONS } from './specifications'
import { STORE_ITEMS } from './storeItems'

/**
 * Data-access layer. Reads/writes go through the Google Sheets backend
 * (google-apps-script/Code.gs) when VITE_SHEETS_API_URL is configured;
 * otherwise every function resolves with the bundled mock data so the app
 * still works standalone. Any Sheets API failure (misconfigured script,
 * network error) falls back to mock data rather than breaking the page.
 */

// CheckSheetRecord has nested arrays/objects that don't fit flat sheet
// columns - they're stored as JSON-text columns and (de)serialised here.
const NESTED_FIELDS = ['readings', 'machineReadings', 'corePinChecks', 'diePrep', 'signatures'] as const

function decodeCheckSheetRow(row: Record<string, unknown>): CheckSheetRecord {
  const decoded: Record<string, unknown> = { ...row }
  for (const field of NESTED_FIELDS) {
    const value = decoded[field]
    if (typeof value === 'string') decoded[field] = JSON.parse(value)
  }
  return decoded as unknown as CheckSheetRecord
}

function encodeCheckSheetRow(record: CheckSheetRecord): Record<string, unknown> {
  const encoded: Record<string, unknown> = { ...record }
  for (const field of NESTED_FIELDS) {
    encoded[field] = JSON.stringify(record[field])
  }
  return encoded
}

export async function loadSpecifications(): Promise<Specification[]> {
  if (!sheets.isConfigured()) return SPECIFICATIONS
  try {
    return await sheets.listRows<Specification>('Specifications')
  } catch (err) {
    console.warn('Falling back to mock specifications:', err)
    return SPECIFICATIONS
  }
}

export async function loadDocuments(): Promise<QmsDocument[]> {
  if (!sheets.isConfigured()) return DOCUMENTS
  try {
    return await sheets.listRows<QmsDocument>('Documents')
  } catch (err) {
    console.warn('Falling back to mock documents:', err)
    return DOCUMENTS
  }
}

export async function saveDocument(doc: QmsDocument): Promise<void> {
  if (!sheets.isConfigured()) return
  await sheets.createRow('Documents', doc)
}

export async function loadCheckSheets(): Promise<CheckSheetRecord[]> {
  if (!sheets.isConfigured()) return CHECK_SHEETS
  try {
    const rows = await sheets.listRows<Record<string, unknown>>('CheckSheets')
    return rows.map(decodeCheckSheetRow)
  } catch (err) {
    console.warn('Falling back to mock check sheets:', err)
    return CHECK_SHEETS
  }
}

export async function saveCheckSheet(record: CheckSheetRecord): Promise<void> {
  if (!sheets.isConfigured()) return
  await sheets.createRow('CheckSheets', encodeCheckSheetRow(record))
}

export async function updateCheckSheet(record: CheckSheetRecord): Promise<void> {
  if (!sheets.isConfigured()) return
  await sheets.updateRow('CheckSheets', record.id, encodeCheckSheetRow(record))
}

/** Flat records with no nested fields go through the Sheets API as-is. */
function simpleResource<T extends { id: string }>(sheet: SheetName, mockData: T[]) {
  return {
    async load(): Promise<T[]> {
      if (!sheets.isConfigured()) return mockData
      try {
        return await sheets.listRows<T>(sheet)
      } catch (err) {
        console.warn(`Falling back to mock ${sheet}:`, err)
        return mockData
      }
    },
    async save(record: T): Promise<void> {
      if (!sheets.isConfigured()) return
      await sheets.createRow(sheet, record)
    },
    async update(record: T): Promise<void> {
      if (!sheets.isConfigured()) return
      await sheets.updateRow(sheet, record.id, record)
    },
  }
}

const purchaseOrderResource = simpleResource<PurchaseOrder>('PurchaseOrders', PURCHASE_ORDERS)
export const loadPurchaseOrders = purchaseOrderResource.load
export const savePurchaseOrder = purchaseOrderResource.save
export const updatePurchaseOrder = purchaseOrderResource.update

const storeItemResource = simpleResource<StoreItem>('StoreItems', STORE_ITEMS)
export const loadStoreItems = storeItemResource.load
export const saveStoreItem = storeItemResource.save
export const updateStoreItem = storeItemResource.update

const accountVoucherResource = simpleResource<AccountVoucher>('AccountVouchers', ACCOUNT_VOUCHERS)
export const loadAccountVouchers = accountVoucherResource.load
export const saveAccountVoucher = accountVoucherResource.save
export const updateAccountVoucher = accountVoucherResource.update

const ledgerAccountResource = simpleResource<LedgerAccount>('LedgerAccounts', LEDGER_ACCOUNTS)
export const loadLedgerAccounts = ledgerAccountResource.load
export const saveLedgerAccount = ledgerAccountResource.save
export const updateLedgerAccount = ledgerAccountResource.update
