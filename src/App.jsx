import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { useStore } from './lib/store'

// Pages
import LandingPage from './pages/Landing'
import { LoginPage, SignupPage } from './pages/Auth'
import OnboardingPage from './pages/Onboarding'
import DashboardPage from './pages/Dashboard'
import Dashboard2026Page from './pages/Dashboard2026'
import ChecklistPage from './pages/Checklist'
import ContractorsPage from './pages/Contractors'
import DocumentsPage from './pages/Documents'
import SettingsPage from './pages/Settings'
import GuestChecklistPage from './pages/GuestChecklist'

// Loading spinner
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Protected Route wrapper - requires login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  
  return children
}

// Auth route - redirects to dashboard if already logged in
function AuthRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - anyone can access */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/score" element={<GuestChecklistPage />} />
      <Route path="/contractors" element={<ContractorsPage />} />
      
      {/* Auth routes - redirect to dashboard if logged in */}
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
      
      {/* Onboarding - for new users */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      
      {/* Protected routes - require login */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard-2026" element={<ProtectedRoute><Dashboard2026Page /></ProtectedRoute>} />
      <Route path="/checklist" element={<ProtectedRoute><ChecklistPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
