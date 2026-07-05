import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeId = 'clinical-light' | 'clinical-dark' | 'ocean' | 'midnight' | 'emerald' | 'contrast'

export interface ThemeOption {
  id: ThemeId
  label: string
  mode: 'light' | 'dark'
  swatch: string
}

export const THEMES: ThemeOption[] = [
  { id: 'clinical-light', label: 'Clinical Light', mode: 'light', swatch: '#0d9488' },
  { id: 'clinical-dark', label: 'Clinical Dark', mode: 'dark', swatch: '#2dd4bf' },
  { id: 'ocean', label: 'Ocean', mode: 'light', swatch: '#0284c7' },
  { id: 'midnight', label: 'Midnight', mode: 'dark', swatch: '#818cf8' },
  { id: 'emerald', label: 'Emerald', mode: 'light', swatch: '#059669' },
  { id: 'contrast', label: 'High Contrast', mode: 'dark', swatch: '#facc15' },
]

const STORAGE_KEY = 'bestcast.ui.theme'
const DEFAULT_THEME: ThemeId = 'clinical-light'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null
  if (stored && THEMES.some((t) => t.id === stored)) return stored
  return DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = (next: ThemeId) => {
    setThemeState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
