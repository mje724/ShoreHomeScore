import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, LayoutDashboard, FileText, Users, Settings, LogOut, 
  Menu, X, ChevronDown, Bell, User
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useStore } from '../lib/store'
import { Button } from './ui'

export function Navbar() {
  const { user, signOut, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const properties = useStore((s) => s.properties)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/checklist', label: 'Checklist', icon: FileText },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/contractors', label: 'Find Pros', icon: Users },
  ]

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b-2 border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-slate-900" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-100">ShoreHomeScore</h1>
              <p className="text-xs text-slate-500 -mt-0.5">NJ Coastal Resilience</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-slate-800 text-emerald-400' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <span className="hidden sm:inline-flex px-2 py-1 bg-amber-900 text-amber-400 text-xs font-medium rounded-full">
                Demo Mode
              </span>
            )}

            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 hover:bg-slate-800 rounded-lg relative">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-slate-800 border-2 border-slate-700 rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-700">
                          <p className="font-medium text-slate-100 truncate">
                            {user.user_metadata?.full_name || user.email}
                          </p>
                          <p className="text-sm text-slate-500 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-slate-800 rounded-lg"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Menu className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && user && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-800 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                        isActive 
                          ? 'bg-slate-800 text-emerald-400' 
                          : 'text-slate-400'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t-2 border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-slate-500 text-sm">© 2026 ShoreHomeScore</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Contact</a>
          </div>
        </div>
        <p className="text-xs text-slate-600 text-center mt-6">
          Educational information based on NJ REAL rules (N.J.A.C. 7:13) and IECC 2021 energy codes. 
          Not legal, financial, or insurance advice. Consult licensed professionals.
        </p>
      </div>
    </footer>
  )
}
