/**
 * Thin client for the Google Sheets backend (a Google Apps Script Web App
 * bound to the QMS spreadsheet - see /google-apps-script/Code.gs).
 *
 * When VITE_SHEETS_API_URL is not set, `isConfigured()` is false and every
 * caller in src/data/repository.ts falls back to the bundled mock arrays,
 * so the app runs standalone (no backend needed) until a sheet is wired up.
 */

const API_URL = import.meta.env.VITE_SHEETS_API_URL as string | undefined

export function isConfigured() {
  return Boolean(API_URL)
}

export type SheetName = 'Specifications' | 'Documents' | 'CheckSheets'

export async function listRows<T>(sheet: SheetName): Promise<T[]> {
  if (!API_URL) throw new Error('VITE_SHEETS_API_URL is not configured')
  const res = await fetch(`${API_URL}?sheet=${sheet}`)
  if (!res.ok) throw new Error(`Sheets API GET ${sheet} failed: ${res.status}`)
  const body = await res.json()
  return body.rows as T[]
}

/**
 * Apps Script web apps don't handle CORS preflight, so POST bodies are sent
 * as text/plain (a "simple request" the browser won't preflight) - the
 * script parses the JSON itself regardless of declared content type.
 */
async function post(payload: unknown) {
  if (!API_URL) throw new Error('VITE_SHEETS_API_URL is not configured')
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Sheets API POST failed: ${res.status}`)
  return res.json()
}

export function createRow<T>(sheet: SheetName, data: T) {
  return post({ sheet, action: 'create', data })
}

export function updateRow<T>(sheet: SheetName, id: string, data: T) {
  return post({ sheet, action: 'update', id, data })
}
