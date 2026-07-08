import { Package, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { DataTable, type DataColumn } from '../components/ui/DataTable'
import { Drawer } from '../components/ui/Drawer'
import { FormField } from '../components/ui/FormField'
import { StatusChip } from '../components/ui/StatusChip'
import { useAccess } from '../context/AccessContext'
import { STORE_CATEGORY_OPTIONS } from '../data/options'
import { loadStoreItems, saveStoreItem, updateStoreItem } from '../data/repository'
import { STORE_ITEMS } from '../data/storeItems'
import { nextId } from '../lib/id'
import { stockStatus, stockStatusTone } from '../lib/tones'
import { useAsyncData } from '../lib/useAsyncData'
import type { StoreCategory, StoreItem } from '../types/business'

function emptyItem(): StoreItem {
  return {
    id: nextId('store'),
    itemCode: '',
    itemName: '',
    category: 'Raw Material',
    unitOfMeasure: '',
    quantityInStock: 0,
    reorderLevel: 0,
    unitCost: 0,
    location: '',
    lastUpdated: new Date().toISOString().slice(0, 10),
  }
}

const columns: DataColumn<StoreItem>[] = [
  { key: 'itemCode', header: 'Item Code', width: 110, nowrap: true },
  { key: 'itemName', header: 'Item Name', width: 260 },
  { key: 'category', header: 'Category', width: 140 },
  { key: 'quantityInStock', header: 'Qty in Stock', width: 120, accessor: (r) => `${r.quantityInStock} ${r.unitOfMeasure}` },
  { key: 'reorderLevel', header: 'Reorder Level', width: 120, accessor: (r) => `${r.reorderLevel} ${r.unitOfMeasure}` },
  { key: 'value', header: 'Stock Value', width: 130, accessor: (r) => r.quantityInStock * r.unitCost, render: (r) => `₹${(r.quantityInStock * r.unitCost).toLocaleString()}` },
  { key: 'location', header: 'Location', width: 180 },
  {
    key: 'stockStatus',
    header: 'Status',
    width: 120,
    accessor: (r) => stockStatus(r),
    render: (r) => <StatusChip value={stockStatus(r)} tone={stockStatusTone[stockStatus(r)]} />,
  },
]

export function Stores() {
  const { hasPermission } = useAccess()
  const canCreate = hasPermission('stores:create')
  const canEdit = hasPermission('stores:edit')
  const { data: items, setData: setItems, loading } = useAsyncData(loadStoreItems, STORE_ITEMS)
  const [active, setActive] = useState<StoreItem | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setActive(emptyItem())
    setIsNew(true)
  }

  function openRow(item: StoreItem) {
    setActive(item)
    setIsNew(false)
  }

  function close() {
    setActive(null)
    setIsNew(false)
  }

  function save() {
    if (!active) return
    const record = { ...active, lastUpdated: new Date().toISOString().slice(0, 10) }
    if (isNew) {
      setItems((prev) => [record, ...prev])
      saveStoreItem(record).catch((err) => console.warn('Could not persist store item:', err))
    } else {
      setItems((prev) => prev.map((i) => (i.id === record.id ? record : i)))
      updateStoreItem(record).catch((err) => console.warn('Could not persist store item changes:', err))
    }
    close()
  }

  const editable = isNew || canEdit

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">Stores & Inventory</h1>
            <p className="text-sm text-muted">Raw material, consumables, spares and finished goods stock. Click a row to open it.</p>
          </div>
        </div>
        {canCreate && (
          <Button icon={<Plus className="h-4 w-4" />} onClick={openNew}>
            New Store Item
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading store items…</p>
      ) : (
        <DataTable tableKey="store-items" columns={columns} data={items} onRowClick={openRow} />
      )}

      <Drawer
        open={!!active}
        onClose={close}
        title={isNew ? 'New Store Item' : `Store Item - ${active?.itemCode}`}
        footer={
          <>
            <Button variant="outline" onClick={close}>
              {isNew ? 'Cancel' : 'Close'}
            </Button>
            {editable && <Button onClick={save}>{isNew ? 'Save' : 'Save Changes'}</Button>}
          </>
        }
      >
        {active && (
          <fieldset className="card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <legend className="mb-2 px-1 text-sm font-semibold text-primary">Item Details</legend>
            <FormField label="Item Code" required value={active.itemCode} readOnly={!editable} onChange={(v) => setActive({ ...active, itemCode: String(v) })} placeholder="RM-0XX" />
            <FormField label="Item Name" required value={active.itemName} readOnly={!editable} onChange={(v) => setActive({ ...active, itemName: String(v) })} />
            <FormField label="Category" type="select" required value={active.category} options={STORE_CATEGORY_OPTIONS} readOnly={!editable} onChange={(v) => setActive({ ...active, category: v as StoreCategory })} />
            <FormField label="Unit of Measure" required value={active.unitOfMeasure} readOnly={!editable} onChange={(v) => setActive({ ...active, unitOfMeasure: String(v) })} placeholder="kg / nos / ltr" />
            <FormField label="Quantity in Stock" type="number" required value={active.quantityInStock} readOnly={!editable} onChange={(v) => setActive({ ...active, quantityInStock: Number(v) })} />
            <FormField label="Reorder Level" type="number" required value={active.reorderLevel} readOnly={!editable} onChange={(v) => setActive({ ...active, reorderLevel: Number(v) })} />
            <FormField label="Unit Cost (₹)" type="number" required value={active.unitCost} readOnly={!editable} onChange={(v) => setActive({ ...active, unitCost: Number(v) })} />
            <FormField label="Stock Value (₹)" value={active.quantityInStock * active.unitCost} readOnly disabled onChange={() => {}} />
            <FormField label="Location" span={2} required value={active.location} readOnly={!editable} onChange={(v) => setActive({ ...active, location: String(v) })} />
          </fieldset>
        )}
      </Drawer>
    </div>
  )
}
