import { ClipboardList, Plus } from 'lucide-react'
import { useState } from 'react'
import { CheckSheetForm } from '../components/checksheet/CheckSheetForm'
import { emptyCheckSheet } from '../components/checksheet/emptyCheckSheet'
import { Button } from '../components/ui/Button'
import { DataTable, type DataColumn } from '../components/ui/DataTable'
import { Drawer } from '../components/ui/Drawer'
import { StatusChip } from '../components/ui/StatusChip'
import { useAccess } from '../context/AccessContext'
import { CHECK_SHEETS } from '../data/checkSheets'
import { loadCheckSheets, saveCheckSheet, updateCheckSheet } from '../data/repository'
import { checkSheetStatusTone } from '../lib/tones'
import { useAsyncData } from '../lib/useAsyncData'
import type { CheckSheetRecord, CheckSheetStatus } from '../types/domain'

const NEXT_STATUS: Partial<Record<CheckSheetStatus, CheckSheetStatus>> = {
  submitted: 'reviewed',
  reviewed: 'approved',
}

const columns: DataColumn<CheckSheetRecord>[] = [
  { key: 'date', header: 'Date', width: 110, nowrap: true },
  { key: 'line', header: 'Line', width: 100, nowrap: true },
  { key: 'shift', header: 'Shift', width: 80 },
  { key: 'furnaceNo', header: 'Furnace', width: 90 },
  { key: 'status', header: 'Status', width: 110, render: (r) => <StatusChip value={r.status} tone={checkSheetStatusTone[r.status]} /> },
  { key: 'operator', header: 'Operator', width: 140, accessor: (r) => r.signatures.operatorSign },
  { key: 'supervisor', header: 'Shift Supervisor', width: 140, accessor: (r) => r.signatures.shiftSupervisorSign },
  { key: 'inCharge', header: 'In-Charge', width: 120, accessor: (r) => r.signatures.inChargeSign },
]

export function CheckSheets() {
  const { hasPermission } = useAccess()
  const canCreate = hasPermission('checksheets:create')
  const canApprove = hasPermission('checksheets:approve')
  const { data: records, setData: setRecords, loading } = useAsyncData(loadCheckSheets, CHECK_SHEETS)
  const [active, setActive] = useState<CheckSheetRecord | null>(null)
  const [mode, setMode] = useState<'view' | 'new'>('view')

  function openNew() {
    setActive(emptyCheckSheet())
    setMode('new')
  }

  function save() {
    if (!active) return
    setRecords((prev) => [active, ...prev])
    setActive(null)
    saveCheckSheet(active).catch((err) => console.warn('Could not persist check sheet to Google Sheets:', err))
  }

  function advanceStatus(record: CheckSheetRecord) {
    const next = NEXT_STATUS[record.status]
    if (!next) return
    const updated = { ...record, status: next }
    setRecords((prev) => prev.map((r) => (r.id === record.id ? updated : r)))
    updateCheckSheet(updated).catch((err) => console.warn('Could not persist status change to Google Sheets:', err))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">Process Check Sheets</h1>
            <p className="text-sm text-muted">
              Production line records (QC FMT 038) - one entry per shift, per line. Digitised from the Mando Model
              Line process check sheet.
            </p>
          </div>
        </div>
        {canCreate && (
          <Button icon={<Plus className="h-4 w-4" />} onClick={openNew}>
            New Check Sheet
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading check sheets…</p>
      ) : (
        <DataTable
          tableKey="check-sheets"
          columns={[
            ...columns,
            {
              key: 'view',
              header: '',
              width: canApprove ? 170 : 90,
              render: (r) => (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => {
                      setActive(r)
                      setMode('view')
                    }}
                  >
                    View
                  </button>
                  {canApprove && NEXT_STATUS[r.status] && (
                    <button
                      type="button"
                      className="text-xs font-medium text-success hover:underline"
                      onClick={() => advanceStatus(r)}
                    >
                      Mark {NEXT_STATUS[r.status]}
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          data={records}
        />
      )}

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        wide
        title={mode === 'new' ? 'New Process Check Sheet' : `Check Sheet - ${active?.line} · ${active?.date} · ${active?.shift} Shift`}
        subtitle="QC FMT 038 · Rev.10"
        footer={
          mode === 'new' ? (
            <>
              <Button variant="outline" onClick={() => setActive(null)}>
                Cancel
              </Button>
              <Button onClick={save}>Save Check Sheet</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setActive(null)}>
              Close
            </Button>
          )
        }
      >
        {active && <CheckSheetForm record={active} onChange={setActive} readOnly={mode === 'view'} />}
      </Drawer>
    </div>
  )
}
