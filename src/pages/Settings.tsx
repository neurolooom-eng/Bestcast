import { Check, Settings as SettingsIcon } from 'lucide-react'
import buildInfo from '../build-info.json'
import { Card } from '../components/ui/Card'
import { THEMES, useTheme } from '../context/ThemeContext'

export function Settings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <SettingsIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">Settings</h1>
          <p className="text-sm text-muted">Appearance and application information.</p>
        </div>
      </div>

      <Card className="p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">Theme</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-2"
            >
              <span className="h-8 w-8 shrink-0 rounded-full border border-border" style={{ backgroundColor: t.swatch }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{t.label}</p>
                <p className="text-[11px] uppercase text-muted">{t.mode}</p>
              </div>
              {theme === t.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">Application Info</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted">Build ID</dt>
            <dd className="tabular-nums text-text">#{buildInfo.buildId}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Built</dt>
            <dd className="text-text">{buildInfo.buildDate ? new Date(buildInfo.buildDate).toLocaleString() : '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Organisation</dt>
            <dd className="text-text">Best Cast IT Limited</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Module</dt>
            <dd className="text-text">e-QMS</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
