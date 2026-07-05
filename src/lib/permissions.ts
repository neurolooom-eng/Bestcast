import type { Permission } from '../types/access'

export interface PermissionMeta {
  key: Permission
  module: string
  label: string
}

/** Full permission catalog, grouped by module for the Admin > Groups matrix. */
export const PERMISSION_CATALOG: PermissionMeta[] = [
  { key: 'dashboard:view', module: 'Dashboard', label: 'View' },
  { key: 'documents:view', module: 'QMS Documents', label: 'View' },
  { key: 'documents:create', module: 'QMS Documents', label: 'Create' },
  { key: 'documents:edit', module: 'QMS Documents', label: 'Edit' },
  { key: 'specifications:view', module: 'Specifications', label: 'View' },
  { key: 'specifications:edit', module: 'Specifications', label: 'Edit' },
  { key: 'checksheets:view', module: 'Process Check Sheets', label: 'View' },
  { key: 'checksheets:create', module: 'Process Check Sheets', label: 'Create Draft' },
  { key: 'checksheets:edit', module: 'Process Check Sheets', label: 'Edit While In Review' },
  { key: 'checksheets:approve', module: 'Process Check Sheets', label: 'Approve' },
  { key: 'admin:access', module: 'Admin', label: 'Users & Access' },
  { key: 'config:access', module: 'Developer', label: 'Backend Config' },
]

export const PERMISSION_MODULES = Array.from(new Set(PERMISSION_CATALOG.map((p) => p.module)))
