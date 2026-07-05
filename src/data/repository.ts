import * as sheets from '../lib/sheetsClient'
import type { CheckSheetRecord, QmsDocument, Specification } from '../types/domain'
import { CHECK_SHEETS } from './checkSheets'
import { DOCUMENTS } from './documents'
import { SPECIFICATIONS } from './specifications'

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
