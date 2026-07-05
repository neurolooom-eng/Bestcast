import { LogOut } from 'lucide-react'

export function UserChip({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {initials}
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="truncate text-sm font-medium text-text">{name}</p>
        <p className="truncate text-[11px] text-muted">{role}</p>
      </div>
      <button type="button" className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text" title="Sign out">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}
