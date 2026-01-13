import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Star, Phone, CheckCircle, Shield, MapPin, Filter, ExternalLink 
} from 'lucide-react'
import { Navbar, Footer } from '../components/navigation'
import { Card, Button, Input, Badge } from '../components/ui'
import { contractors } from '../data/costs'

export default function ContractorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Pros' },
    { id: 'roofing', label: 'Roofing' },
    { id: 'elevation', label: 'Elevation' },
    { id: 'insulation', label: 'Insulation' },
    { id: 'hvac', label: 'HVAC' },
    { id: 'drainage', label: 'Drainage' },
    { id: 'smart', label: 'Smart Home' },
  ]

  const categoryMap = {
    roofing: ['roofType', 'roofFasteners', 'roofSealed'],
    elevation: ['foundationType', 'floodVents', 'breakawayPanels'],
    insulation: ['atticInsulation', 'wallInsulation', 'exteriorWrap', 'airSealing'],
    hvac: ['hvacLocation', 'electricalElevated', 'waterHeaterElevated', 'generatorInterlock'],
    drainage: ['drivewaySurface', 'rainGarden', 'frenchDrain', 'properGrading'],
    smart: ['smartShutoff', 'leakSensors', 'batteryBackup', 'floodMonitor'],
  }

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contractor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedCategory === 'all') return matchesSearch
    
    const categoryKeys = categoryMap[selectedCategory] || []
    const matchesCategory = contractor.categories.some(c => categoryKeys.includes(c))
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Find Trusted Contractors</h1>
          <p className="text-slate-400">
            Connect with verified professionals who specialize in coastal resilience.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or specialty..."
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Contractors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContractors.map((contractor, i) => (
            <motion.div
              key={contractor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-100">{contractor.name}</h3>
                    <p className="text-sm text-slate-400">{contractor.specialty}</p>
                  </div>
                  {contractor.fortifiedCertified && (
                    <Badge color="emerald">
                      <Shield className="w-3 h-3 mr-1" />
                      FORTIFIED
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-slate-200">{contractor.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {contractor.reviews} reviews
                  </span>
                  {contractor.verified && (
                    <div className="flex items-center gap-1 text-emerald-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                  <Phone className="w-4 h-4" />
                  {contractor.phone}
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" className="flex-1">
                    Get Quote
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredContractors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No contractors found matching your criteria.</p>
          </div>
        )}

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 border-emerald-500/30">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Are you a contractor?
            </h3>
            <p className="text-slate-300 mb-4">
              Join our network and connect with homeowners looking for resilience upgrades.
            </p>
            <Button>Apply to Join</Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
