import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ThemeProvider } from './context/ThemeContext'
import { CheckSheets } from './pages/CheckSheets'
import { Dashboard } from './pages/Dashboard'
import { Documents } from './pages/Documents'
import { Settings } from './pages/Settings'
import { Specifications } from './pages/Specifications'

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="specifications" element={<Specifications />} />
            <Route path="check-sheets" element={<CheckSheets />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
