import React, { useState } from 'react'
import { 
  User, Mail, Bell, Shield, Trash2, Save, LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar, Footer } from '../components/navigation'
import { Card, Button, Input, Alert } from '../components/ui'
import { useAuth } from '../lib/auth'
import { useStore } from '../lib/store'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { notifications, setNotifications, properties, deleteProperty } = useStore()
  const [saved, setSaved] = useState(false)

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      // In a real app, this would delete the account from Supabase
      signOut()
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">Settings</h1>

        {saved && (
          <Alert type="success" className="mb-6">
            Settings saved successfully!
          </Alert>
        )}

        {/* Profile */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            Profile
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              defaultValue={user?.user_metadata?.full_name || ''}
              placeholder="Your name"
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user?.email || ''}
              disabled
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Updates', desc: 'Receive weekly score updates and tips' },
              { key: 'storms', label: 'Storm Alerts', desc: 'Get notified about approaching storms' },
              { key: 'reminders', label: 'Document Reminders', desc: 'Reminders to update expiring documents' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-200">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(item.key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    notifications[item.key] ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      notifications[item.key] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Properties */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Properties
          </h2>
          
          {properties.length > 0 ? (
            <div className="space-y-3">
              {properties.map((property) => (
                <div 
                  key={property.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-200">
                      {property.address || 'Unnamed Property'}
                    </p>
                    <p className="text-sm text-slate-500">{property.zip_code}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this property?')) {
                        deleteProperty(property.id)
                      }
                    }}
                    className="p-2 hover:bg-slate-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No properties added yet.</p>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleSignOut} className="flex-1">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Danger Zone */}
        <Card className="mt-8 border-red-500/30">
          <h2 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-slate-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="danger" onClick={handleDeleteAccount}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
