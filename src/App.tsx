import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RequirePermission } from './components/RequirePermission'
import { AccessProvider } from './context/AccessContext'
import { ThemeProvider } from './context/ThemeContext'
import { Admin } from './pages/Admin'
import { CheckSheets } from './pages/CheckSheets'
import { Config } from './pages/Config'
import { Dashboard } from './pages/Dashboard'
import { Documents } from './pages/Documents'
import { Settings } from './pages/Settings'
import { Specifications } from './pages/Specifications'

function App() {
  return (
    <AccessProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="documents" element={<Documents />} />
              <Route path="specifications" element={<Specifications />} />
              <Route path="check-sheets" element={<CheckSheets />} />
              <Route path="settings" element={<Settings />} />
              <Route
                path="admin"
                element={
                  <RequirePermission permission="admin:access">
                    <Admin />
                  </RequirePermission>
                }
              />
              <Route
                path="config"
                element={
                  <RequirePermission permission="config:access">
                    <Config />
                  </RequirePermission>
                }
              />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AccessProvider>
  )
}

export default App
