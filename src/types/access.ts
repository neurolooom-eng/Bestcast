export type Permission =
  | 'dashboard:view'
  | 'documents:view'
  | 'documents:create'
  | 'documents:edit'
  | 'specifications:view'
  | 'specifications:edit'
  | 'checksheets:view'
  | 'checksheets:create'
  | 'checksheets:approve'
  | 'admin:access'
  | 'config:access'

export interface Group {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface User {
  id: string
  name: string
  email: string
  groupId: string
}
