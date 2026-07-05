import { ClipboardList, FileText, LayoutDashboard, Ruler, Settings } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Quality Management',
    items: [
      { to: '/documents', label: 'QMS Documents', icon: FileText },
      { to: '/specifications', label: 'Specifications', icon: Ruler },
    ],
  },
  {
    label: 'Production',
    items: [{ to: '/check-sheets', label: 'Process Check Sheets', icon: ClipboardList }],
  },
  {
    label: 'Admin',
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
]
