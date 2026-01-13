import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wind, Droplets, Thermometer, Zap, TreePine, Scale, Cpu,
  ChevronDown, Check, HelpCircle, Info, DollarSign
} from 'lucide-react'
import { Navbar, Footer } from '../components/navigation'
import { Card, Button, Badge, ProgressBar } from '../components/ui'
import { ScoreGauge } from '../components/ScoreGauge'
import { useStore } from '../lib/store'
import { saveProperty } from '../lib/database'
import { upgradeCosts, calculateInsuranceSavings } from '../data/costs'

// Checklist categories config
const categories = [
  {
    id: 'wind',
    name: 'Wind Defense',
    subtitle: 'Protect against hurricanes',
    icon: Wind,
    color: '#22d3ee',
    items: [
      { key: 'roofType', type: 'select', label: 'Roof Type', options: [
        { value: null, label: 'Basic 3-Tab Shingles', points: 0 },
        { value: 'architectural', label: 'Architectural Shingles', points: 200 },
        { value: 'metal', label: 'Standing Seam Metal', points: 300 },
      ]},
      { key: 'roofFasteners', type: 'toggle', label: 'Stainless Steel Fasteners', points: 150, help: 'Corrosion-resistant ring-shank nails' },
      { key: 'roofSealed', type: 'toggle', label: 'Sealed Roof Deck', points: 300, help: 'FORTIFIED standard waterproof membrane' },
    ],
  },
  {
    id: 'flood',
    name: 'Flood Armor',
    subtitle: 'Protect against flooding',
    icon: Droplets,
    color: '#3b82f6',
    items: [
      { key: 'foundationType', type: 'select', label: 'Foundation Type', options: [
        { value: null, label: 'Slab on Ground', points: 0 },
        { value: 'crawl', label: 'Crawl Space (1-3ft)', points: 150 },
        { value: 'elevated', label: 'Elevated on Pilings (+4ft)', points: 400 },
      ]},
      { key: 'floodVents', type: 'toggle', label: 'Smart Flood Vents', points: 100 },
      { key: 'breakawayPanels', type: 'toggle', label: 'Breakaway Wall Panels', points: 100 },
      { key: 'floodMaterials', type: 'toggle', label: 'Flood-Resistant Materials', points: 100 },
      { key: 'backflowValves', type: 'toggle', label: 'Backflow Prevention', points: 50 },
    ],
  },
  {
    id: 'thermal',
    name: 'Thermal Shield',
    subtitle: 'Energy efficiency',
    icon: Thermometer,
    color: '#fb923c',
    items: [
      { key: 'atticInsulation', type: 'toggle', label: 'R-60 Attic Insulation', points: 150 },
      { key: 'wallInsulation', type: 'toggle', label: 'Wall Insulation', points: 100 },
      { key: 'exteriorWrap', type: 'toggle', label: 'Continuous Exterior Insulation', points: 150 },
      { key: 'airSealing', type: 'toggle', label: 'Professional Air Sealing', points: 100 },
    ],
  },
  {
    id: 'systems',
    name: 'Vital Systems',
    subtitle: 'Equipment protection',
    icon: Zap,
    color: '#facc15',
    items: [
      { key: 'hvacLocation', type: 'select', label: 'HVAC Location', options: [
        { value: null, label: 'Ground Level', points: 0 },
        { value: 'elevated', label: 'Elevated (+4ft)', points: 300 },
      ]},
      { key: 'electricalElevated', type: 'toggle', label: 'Elevated Electrical Panel', points: 150 },
      { key: 'waterHeaterElevated', type: 'toggle', label: 'Elevated Water Heater', points: 75 },
      { key: 'generatorInterlock', type: 'toggle', label: 'Generator Transfer Switch', points: 75 },
    ],
  },
  {
    id: 'site',
    name: 'Site Defense',
    subtitle: 'Drainage & landscaping',
    icon: TreePine,
    color: '#10b981',
    items: [
      { key: 'drivewaySurface', type: 'select', label: 'Driveway Surface', options: [
        { value: null, label: 'Asphalt/Concrete', points: 0 },
        { value: 'permeable', label: 'Permeable Pavers', points: 150 },
      ]},
      { key: 'rainGarden', type: 'toggle', label: 'Rain Garden', points: 100 },
      { key: 'frenchDrain', type: 'toggle', label: 'French Drain System', points: 75 },
      { key: 'properGrading', type: 'toggle', label: 'Proper Yard Grading', points: 75 },
    ],
  },
  {
    id: 'legal',
    name: 'Legal Shield',
    subtitle: 'Documentation',
    icon: Scale,
    color: '#a855f7',
    items: [
      { key: 'elevationCert', type: 'toggle', label: 'Elevation Certificate', points: 150 },
      { key: 'appraisalDoc', type: 'toggle', label: 'Pre-Improvement Appraisal', points: 100 },
      { key: 'permitsClosed', type: 'toggle', label: 'All Permits Closed', points: 100 },
      { key: 'floodZoneLOMA', type: 'toggle', label: 'Flood Zone LOMA', points: 75 },
      { key: 'insuranceAudit', type: 'toggle', label: 'Insurance Coverage Audit', points: 75 },
    ],
  },
  {
    id: 'tech',
    name: 'Active Defense',
    subtitle: 'Smart technology',
    icon: Cpu,
    color: '#ec4899',
    items: [
      { key: 'smartShutoff', type: 'toggle', label: 'Smart Water Shutoff', points: 125 },
      { key: 'leakSensors', type: 'toggle', label: 'Leak Sensors', points: 75 },
      { key: 'batteryBackup', type: 'toggle', label: 'Whole-Home Battery', points: 200 },
      { key: 'floodMonitor', type: 'toggle', label: 'Flood Level Monitor', points: 100 },
    ],
  },
]

export default function ChecklistPage() {
  const { properties, currentPropertyId, updateProperty } = useStore()
  const property = properties.find(p => p.id === currentPropertyId) || properties[0]
  
  const [expandedCategory, setExpandedCategory] = useState('wind')
  const [selections, setSelections] = useState(property?.selections || {})
  const [saving, setSaving] = useState(false)

  const updateSelection = async (key, value) => {
    const newSelections = { ...selections, [key]: value }
    setSelections(newSelections)
    
    // Auto-save
    setSaving(true)
    await saveProperty({ ...property, selections: newSelections })
    setSaving(false)
  }

  // Calculate score
  const score = useMemo(() => {
    let total = 0
    categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.type === 'toggle' && selections[item.key]) {
          total += item.points
        } else if (item.type === 'select') {
          const selected = item.options.find(o => o.value === selections[item.key])
          if (selected) total += selected.points
        }
      })
    })
    return { total, max: 4000 }
  }, [selections])

  // Calculate category progress
  const getCategoryProgress = (category) => {
    let earned = 0
    let max = 0
    category.items.forEach(item => {
      if (item.type === 'toggle') {
        max += item.points
        if (selections[item.key]) earned += item.points
      } else if (item.type === 'select') {
        const maxOption = Math.max(...item.options.map(o => o.points))
        max += maxOption
        const selected = item.options.find(o => o.value === selections[item.key])
        if (selected) earned += selected.points
      }
    })
    return { earned, max }
  }

  const savings = useMemo(() => calculateInsuranceSavings(selections), [selections])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Score Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="flex flex-col items-center py-6">
                <ScoreGauge score={score.total} maxScore={score.max} size="md" />
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Insurance Savings</span>
                    <span className="text-emerald-400 font-medium">
                      ${savings.annualSavings}/yr
                    </span>
                  </div>
                  
                  {saving && (
                    <p className="text-xs text-center text-slate-500">Saving...</p>
                  )}
                </div>
              </Card>

              {/* Cost Estimate Card */}
              <Card className="mt-4">
                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Selected Upgrades Cost
                </h3>
                <div className="space-y-2">
                  {Object.entries(selections).filter(([k, v]) => v).slice(0, 5).map(([key]) => {
                    const cost = upgradeCosts[key]
                    if (!cost) return null
                    const data = typeof cost.low === 'number' ? cost : cost[selections[key]]
                    if (!data) return null
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-400 truncate">{data.label}</span>
                        <span className="text-slate-300">${data.low.toLocaleString()}</span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>

          {/* Checklist */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-100">Property Checklist</h1>
              <p className="text-slate-400">Select the upgrades you have or want to add</p>
            </div>

            {categories.map((category) => {
              const progress = getCategoryProgress(category)
              const isExpanded = expandedCategory === category.id
              const Icon = category.icon

              return (
                <Card key={category.id} padding="none">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-750 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-bold text-slate-100">{category.name}</h2>
                        <p className="text-sm text-slate-400">{category.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold" style={{ color: category.color }}>
                          {progress.earned}/{progress.max}
                        </div>
                        <div className="text-xs text-slate-500">points</div>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </div>
                  </button>

                  <div className="px-5 pb-2">
                    <ProgressBar 
                      value={progress.earned} 
                      max={progress.max} 
                      color="emerald" 
                      size="sm" 
                    />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-slate-700"
                      >
                        <div className="p-5 space-y-3">
                          {category.items.map((item) => (
                            <ChecklistItem
                              key={item.key}
                              item={item}
                              value={selections[item.key]}
                              onChange={(value) => updateSelection(item.key, value)}
                              color={category.color}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ChecklistItem({ item, value, onChange, color }) {
  const [showHelp, setShowHelp] = useState(false)

  if (item.type === 'toggle') {
    return (
      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-slate-200">{item.label}</span>
          {item.help && (
            <button onClick={() => setShowHelp(!showHelp)}>
              <HelpCircle className="w-4 h-4 text-slate-500" />
            </button>
          )}
          <Badge color="emerald" size="sm">+{item.points}</Badge>
        </div>
        
        <button
          onClick={() => onChange(!value)}
          className={`w-12 h-6 rounded-full p-1 transition-colors ${
            value ? 'bg-emerald-500' : 'bg-slate-600'
          }`}
        >
          <motion.div
            className="w-4 h-4 rounded-full bg-white"
            animate={{ x: value ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500 }}
          />
        </button>
      </div>
    )
  }

  if (item.type === 'select') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">{item.label}</label>
        <div className="grid gap-2">
          {item.options.map((option) => (
            <button
              key={option.value || 'null'}
              onClick={() => onChange(option.value)}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                value === option.value
                  ? 'border-emerald-500 bg-emerald-900/30'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <span className="text-slate-200">{option.label}</span>
              <div className="flex items-center gap-2">
                <Badge color={option.points > 0 ? 'emerald' : 'slate'} size="sm">
                  +{option.points}
                </Badge>
                {value === option.value && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
