import { Plus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { DataTable, type DataColumn } from '../components/ui/DataTable'
import { Drawer } from '../components/ui/Drawer'
import { FormField } from '../components/ui/FormField'
import { StatusChip } from '../components/ui/StatusChip'
import { useAccess } from '../context/AccessContext'
import { PURCHASE_CATEGORY_OPTIONS, PURCHASE_ORDER_STATUS_OPTIONS } from '../data/options'
import { PURCHASE_ORDERS } from '../data/purchaseOrders'
import { loadPurchaseOrders, savePurchaseOrder, updatePurchaseOrder } from '../data/repository'
import { nextId } from '../lib/id'
import { purchaseOrderStatusTone } from '../lib/tones'
import { useAsyncData } from '../lib/useAsyncData'
import type { PurchaseCategory, PurchaseOrder, PurchaseOrderStatus } from '../types/business'

function emptyOrder(): PurchaseOrder {
  return {
    id: nextId('po'),
    poNumber: '',
    vendorName: '',
    category: 'Raw Material',
    itemDescription: '',
    quantity: 0,
    unit: '',
    unitPrice: 0,
    orderDate: new Date().toISOString().slice(0, 10),
    expectedDeliveryDate: '',
    status: 'draft',
    requestedBy: '',
  }
}

const columns: DataColumn<PurchaseOrder>[] = [
  { key: 'poNumber', header: 'PO Number', width: 130, nowrap: true },
  { key: 'vendorName', header: 'Vendor', width: 220 },
  { key: 'category', header: 'Category', width: 130 },
  { key: 'itemDescription', header: 'Item', width: 260 },
  { key: 'quantity', header: 'Qty', width: 90, accessor: (r) => `${r.quantity} ${r.unit}` },
  { key: 'unitPrice', header: 'Unit Price', width: 110, render: (r) => `₹${r.unitPrice.toLocaleString()}` },
  { key: 'total', header: 'Total', width: 130, accessor: (r) => r.quantity * r.unitPrice, render: (r) => `₹${(r.quantity * r.unitPrice).toLocaleString()}` },
  { key: 'orderDate', header: 'Order Date', width: 110, nowrap: true },
  { key: 'status', header: 'Status', width: 110, render: (r) => <StatusChip value={r.status} tone={purchaseOrderStatusTone[r.status]} /> },
  { key: 'requestedBy', header: 'Requested By', width: 140 },
]

export function Purchase() {
  const { hasPermission } = useAccess()
  const canCreate = hasPermission('purchase:create')
  const canEdit = hasPermission('purchase:edit')
  const { data: orders, setData: setOrders, loading } = useAsyncData(loadPurchaseOrders, PURCHASE_ORDERS)
  const [active, setActive] = useState<PurchaseOrder | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setActive(emptyOrder())
    setIsNew(true)
  }

  function openRow(order: PurchaseOrder) {
    setActive(order)
    setIsNew(false)
  }

  function close() {
    setActive(null)
    setIsNew(false)
  }

  function save() {
    if (!active) return
    if (isNew) {
      setOrders((prev) => [active, ...prev])
      savePurchaseOrder(active).catch((err) => console.warn('Could not persist purchase order:', err))
    } else {
      setOrders((prev) => prev.map((o) => (o.id === active.id ? active : o)))
      updatePurchaseOrder(active).catch((err) => console.warn('Could not persist purchase order changes:', err))
    }
    close()
  }

  const editable = isNew || canEdit

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">Purchase Orders</h1>
            <p className="text-sm text-muted">Raw material, consumables, spares and tooling orders. Click a row to open it.</p>
          </div>
        </div>
        {canCreate && (
          <Button icon={<Plus className="h-4 w-4" />} onClick={openNew}>
            New Purchase Order
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading purchase orders…</p>
      ) : (
        <DataTable tableKey="purchase-orders" columns={columns} data={orders} onRowClick={openRow} />
      )}

      <Drawer
        open={!!active}
        onClose={close}
        title={isNew ? 'New Purchase Order' : `Purchase Order - ${active?.poNumber}`}
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
            <legend className="mb-2 px-1 text-sm font-semibold text-primary">Order Details</legend>
            <FormField label="PO Number" required value={active.poNumber} readOnly={!editable} onChange={(v) => setActive({ ...active, poNumber: String(v) })} placeholder="PO-2026-0XX" />
            <FormField label="Vendor Name" required value={active.vendorName} readOnly={!editable} onChange={(v) => setActive({ ...active, vendorName: String(v) })} />
            <FormField label="Category" type="select" required value={active.category} options={PURCHASE_CATEGORY_OPTIONS} readOnly={!editable} onChange={(v) => setActive({ ...active, category: v as PurchaseCategory })} />
            <FormField label="Status" type="status" required value={active.status} options={PURCHASE_ORDER_STATUS_OPTIONS} readOnly={!editable} onChange={(v) => setActive({ ...active, status: v as PurchaseOrderStatus })} />
            <FormField label="Item Description" span={2} required value={active.itemDescription} readOnly={!editable} onChange={(v) => setActive({ ...active, itemDescription: String(v) })} />
            <FormField label="Quantity" type="number" required value={active.quantity} readOnly={!editable} onChange={(v) => setActive({ ...active, quantity: Number(v) })} />
            <FormField label="Unit" required value={active.unit} readOnly={!editable} onChange={(v) => setActive({ ...active, unit: String(v) })} placeholder="kg / nos / ltr / set" />
            <FormField label="Unit Price (₹)" type="number" required value={active.unitPrice} readOnly={!editable} onChange={(v) => setActive({ ...active, unitPrice: Number(v) })} />
            <FormField label="Total (₹)" value={active.quantity * active.unitPrice} readOnly disabled onChange={() => {}} />
            <FormField label="Order Date" type="date" required value={active.orderDate} readOnly={!editable} onChange={(v) => setActive({ ...active, orderDate: String(v) })} />
            <FormField label="Expected Delivery" type="date" value={active.expectedDeliveryDate} readOnly={!editable} onChange={(v) => setActive({ ...active, expectedDeliveryDate: String(v) })} />
            <FormField label="Requested By" required value={active.requestedBy} readOnly={!editable} onChange={(v) => setActive({ ...active, requestedBy: String(v) })} />
          </fieldset>
        )}
      </Drawer>
    </div>
  )
}
