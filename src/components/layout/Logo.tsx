import { Gem } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Text-based wordmark placeholder - bestcastgroup.com could not be reached
 * from this environment to pull the real logo asset. Swap this component's
 * markup for an <img> once the real logo file is available; every consumer
 * just renders <Logo /> so the swap is one place.
 */
export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-fg">
        <Gem className="h-4.5 w-4.5" />
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <p className={cn('truncate text-sm font-bold tracking-wide text-text')}>BEST CAST</p>
          <p className="truncate text-[10px] uppercase tracking-wider text-muted">e-QMS</p>
        </div>
      )}
    </div>
  )
}
