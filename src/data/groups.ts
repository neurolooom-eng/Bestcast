import type { Group, Permission } from '../types/access'

const ALL_PERMISSIONS: Permission[] = [
  'dashboard:view',
  'documents:view',
  'documents:create',
  'documents:edit',
  'specifications:view',
  'specifications:edit',
  'checksheets:view',
  'checksheets:create',
  'checksheets:edit',
  'checksheets:approve',
  'admin:access',
  'config:access',
]

export const GROUPS: Group[] = [
  {
    id: 'group-admin',
    name: 'Administrator',
    description: 'Full access, including user & access management and backend configuration.',
    permissions: ALL_PERMISSIONS,
  },
  {
    id: 'group-developer',
    name: 'Developer',
    description: 'Technical access to wire up and verify the Google Sheets backend.',
    permissions: ['dashboard:view', 'documents:view', 'specifications:view', 'checksheets:view', 'config:access'],
  },
  {
    id: 'group-quality-manager',
    name: 'Quality Manager',
    description: 'Owns QMS documents and specifications, gives final approval on production line records.',
    permissions: [
      'dashboard:view',
      'documents:view',
      'documents:create',
      'documents:edit',
      'specifications:view',
      'specifications:edit',
      'checksheets:view',
      'checksheets:approve',
    ],
  },
  {
    id: 'group-shift-supervisor',
    name: 'Shift Supervisor',
    description: 'Line supervisor - starts check sheets and edits them while a shift is in review.',
    permissions: [
      'dashboard:view',
      'documents:view',
      'specifications:view',
      'checksheets:view',
      'checksheets:create',
      'checksheets:edit',
    ],
  },
  {
    id: 'group-operator',
    name: 'Operator',
    description: 'Enters process check sheet readings for their shift while it is still a draft.',
    permissions: ['checksheets:view', 'checksheets:create'],
  },
  {
    id: 'group-viewer',
    name: 'Viewer',
    description: 'Read-only access across every module - no create, edit or admin actions.',
    permissions: ['dashboard:view', 'documents:view', 'specifications:view', 'checksheets:view'],
  },
]
