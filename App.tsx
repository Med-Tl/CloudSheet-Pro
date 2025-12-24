import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import { Providers } from './app/Providers'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SheetView from './pages/SheetView'

const App: React.FC = () => {
  return (
    <Providers>
      <HashRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sheet/:id" element={<SheetView />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </Providers>
  )
}

export default App
