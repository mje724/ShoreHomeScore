import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wind, Droplets, Thermometer, Zap, TreePine, Scale, Cpu,
  ChevronDown, Check, HelpCircle, DollarSign, Home, X,
  Save, ArrowRight, AlertTriangle, TrendingUp, Lock, Sparkles
} from 'lucide-react'
import { Card, Button, Badge, ProgressBar, Modal } from '../components/ui'
import { ScoreGauge } from '../components/ScoreGauge'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import { upgradeCosts, calculateInsuranceSavings, getNeighborhoodData } from '../data/costs'

// Checklist categories
const categories = [
  {
    id: 'wind',
    name: 'Wind Defense',
    subtitle: 'Protect against hurricanes',
    icon: Wind,
    color: '#22d3ee',
    items: [
      { key: 'roofType', type: 'select', label: 'Roof Type', options: [
        { value: null, label: 'Basic 3-Tab Shingles', points: 0, desc: 'Flat strips, least wind-resistant' },
        { value: 'architectural', label: 'Architectural Shingles', points: 200, desc: 'Dimensional look, 130mph rated' },
        { value: 'metal', label: 'Standing Seam Metal', points: 300, desc: 'Best protection, 140+ mph' },
      ]},
      { key: 'roofFasteners', type: 'toggle', label: 'Stainless Steel Fasteners', points: 150, help: 'Ring-shank nails that won\'t rust in salt air' },
      { key: 'roofSealed', type: 'toggle', label: 'Sealed Roof Deck', points: 300, help: 'Waterproof membrane under shingles - FORTIFIED standard' },
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
        { value: null, label: 'Slab on Ground', points: 0, desc: 'Most vulnerable to flooding' },
        { value: 'crawl', label: 'Crawl Space (1-3ft)', points: 150, desc: 'Some protection' },
        { value: 'elevated', label: 'Elevated on Pilings (+4ft)', points: 400, desc: 'NJ REAL 2026 compliant' },
      ]},
      { key: 'floodVents', type: 'toggle', label: 'Smart Flood Vents', points: 100, help: 'Let water flow through to reduce wall pressure' },
      { key: 'breakawayPanels', type: 'toggle', label: 'Breakaway Wall Panels', points: 100, help: 'Sacrificial panels that protect the structure' },
      { key: 'floodMaterials', type: 'toggle', label: 'Flood-Resistant Materials', points: 100, help: 'Marine-grade flooring and moisture-resistant drywall' },
      { key: 'backflowValves', type: 'toggle', label: 'Backflow Prevention', points: 50, help: 'Prevents sewage from backing up into your home' },
    ],
  },
  {
    id: 'thermal',
    name: 'Thermal Shield',
    subtitle: 'Energy efficiency',
    icon: Thermometer,
    color: '#fb923c',
    items: [
      { key: 'atticInsulation', type: 'toggle', label: 'R-60 Attic Insulation', points: 150, help: 'IECC 2021 standard - huge energy savings' },
      { key: 'wallInsulation', type: 'toggle', label: 'Wall Insulation', points: 100, help: 'Dense-pack insulation in exterior walls' },
      { key: 'exteriorWrap', type: 'toggle', label: 'Continuous Exterior Insulation', points: 150, help: 'Foam board that eliminates thermal bridges' },
      { key: 'airSealing', type: 'toggle', label: 'Professional Air Sealing', points: 100, help: 'Sealing gaps around pipes, wires, fixtures' },
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
        { value: null, label: 'Ground Level', points: 0, desc: 'At risk of flood damage' },
        { value: 'elevated', label: 'Elevated (+4ft)', points: 300, desc: 'Protected from flooding' },
      ]},
      { key: 'electricalElevated', type: 'toggle', label: 'Elevated Electrical Panel', points: 150, help: 'Main breaker box above flood line' },
      { key: 'waterHeaterElevated', type: 'toggle', label: 'Elevated Water Heater', points: 75, help: 'Tank raised above potential flood level' },
      { key: 'generatorInterlock', type: 'toggle', label: 'Generator Transfer Switch', points: 75, help: 'Safe connection for backup power' },
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
        { value: null, label: 'Asphalt/Concrete', points: 0, desc: 'Water runs off toward home' },
        { value: 'permeable', label: 'Permeable Pavers', points: 150, desc: 'Water drains into ground' },
      ]},
      { key: 'rainGarden', type: 'toggle', label: 'Rain Garden', points: 100, help: 'Captures and absorbs runoff' },
      { key: 'frenchDrain', type: 'toggle', label: 'French Drain System', points: 75, help: 'Directs water away from foundation' },
      { key: 'properGrading', type: 'toggle', label: 'Proper Yard Grading', points: 75, help: 'Ground slopes away from house' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal Shield',
    subtitle: 'Documentation',
    icon: Scale,
    color: '#a855f7',
    items: [
      { key: 'elevationCert', type: 'toggle', label: 'Elevation Certificate', points: 150, help: 'Required for accurate flood insurance pricing' },
      { key: 'appraisalDoc', type: 'toggle', label: 'Pre-Improvement Appraisal', points: 100, help: 'Locks value before renovations for 40% calc' },
      { key: 'permitsClosed', type: 'toggle', label: 'All Permits Closed', points: 100, help: 'All construction permits finalized' },
      { key: 'floodZoneLOMA', type: 'toggle', label: 'Flood Zone LOMA', points: 75, help: 'Letter of Map Amendment if incorrectly zoned' },
      { key: 'insuranceAudit', type: 'toggle', label: 'Insurance Coverage Audit', points: 75, help: 'Review to identify gaps and savings' },
    ],
  },
  {
    id: 'tech',
    name: 'Active Defense',
    subtitle: 'Smart technology',
    icon: Cpu,
    color: '#ec4899',
    items: [
      { key: 'smartShutoff', type: 'toggle', label: 'Smart Water Shutoff', points: 125, help: 'Auto-closes main valve when leak detected' },
      { key: 'leakSensors', type: 'toggle', label: 'Leak Sensors', points: 75, help: 'Alerts when water detected at fixtures' },
      { key: 'batteryBackup', type: 'toggle', label: 'Whole-Home Battery', points: 200, help: 'Powers home during outages' },
      { key: 'floodMonitor', type: 'toggle', label: 'Flood Level Monitor', points: 100, help: 'Alerts when water level rises' },
    ],
  },
]

export default function GuestChecklistPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setGuestSelections, guestSelections } = useStore()
  
  const [selections, setSelections] = useState(guestSelections || {})
  const [expandedCategory, setExpandedCategory] = useState('wind')
  const [zipCode, setZipCode] = useState('08742')
  const [homeValue, setHomeValue] = useState(500000)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)

  // Save to store on change
  useEffect(() => {
    setGuestSelections(selections)
  }, [selections])

  // Show save prompt after several interactions
  useEffect(() => {
    if (interactionCount === 5 || interactionCount === 15) {
      setShowSaveModal(true)
    }
  }, [interactionCount])

  const updateSelection = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }))
    setInteractionCount(prev => prev + 1)
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

  const percentage = Math.round((score.total / score.max) * 100)
  const savings = useMemo(() => calculateInsuranceSavings(selections), [selections])
  const neighborhood = getNeighborhoodData(zipCode)

  // Category progress
  const getCategoryProgress = (category) => {
    let earned = 0, max = 0
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

  // 40% calculation
  const fortyPercentThreshold = homeValue * 0.4

  const handleSaveProgress = () => {
    // Store selections and navigate to signup
    setGuestSelections(selections)
    navigate('/signup')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Simple Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b-2 border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100">ShoreHomeScore</h1>
                <p className="text-xs text-slate-500">Free Assessment Tool</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {user ? (
                <Link to="/dashboard">
                  <Button size="sm">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Button size="sm" onClick={() => setShowSaveModal(true)}>
                    <Save className="w-4 h-4 mr-1" />
                    Save Progress
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3">
            How Resilient is Your Shore Home?
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Check off what you have. We'll calculate your protection score and show you what to prioritize.
          </p>
        </div>

        {/* Property Quick Info */}
        <Card className="mb-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Your ZIP Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="08742"
                className="w-full px-4 py-2.5 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Estimated Home Value</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={homeValue}
                  onChange={(e) => setHomeValue(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Score Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="flex flex-col items-center py-6">
                <ScoreGauge score={score.total} maxScore={score.max} size="md" />
                
                <div className="w-full mt-6 space-y-4 px-2">
                  {/* Savings */}
                  <div className="flex items-center justify-between p-3 bg-emerald-900/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-slate-300">Insurance Savings</span>
                    </div>
                    <span className="font-bold text-emerald-400">${savings.annualSavings}/yr</span>
                  </div>

                  {/* Neighborhood comparison */}
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">vs. {zipCode} Average</span>
                      <span className={percentage > neighborhood.average ? 'text-emerald-400' : 'text-amber-400'}>
                        {percentage > neighborhood.average ? '+' : ''}{percentage - neighborhood.average}%
                      </span>
                    </div>
                    <ProgressBar value={neighborhood.average} max={100} color="blue" size="sm" />
                    <p className="text-xs text-slate-500 mt-2">
                      {neighborhood.total} homes in your area
                    </p>
                  </div>

                  {/* 40% Warning */}
                  <div className="p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-200">40% Rule Threshold</span>
                    </div>
                    <p className="text-lg font-bold text-amber-400">${fortyPercentThreshold.toLocaleString()}</p>
                    <p className="text-xs text-amber-300/70">Max renovation before elevation required</p>
                  </div>
                </div>
              </Card>

              {/* Save CTA */}
              {!user && (
                <Card className="bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 border-emerald-500/30">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-100 mb-1">Save Your Progress</h3>
                    <p className="text-sm text-slate-300 mb-4">
                      Create a free account to save your checklist and track improvements over time.
                    </p>
                    <Button onClick={() => setShowSaveModal(true)} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save & Create Account
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="lg:col-span-2 space-y-4">
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
                      <div className="text-right hidden sm:block">
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
                    <ProgressBar value={progress.earned} max={progress.max} color="emerald" size="sm" />
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

            {/* Bottom CTA */}
            {!user && (
              <Card className="bg-slate-800 border-emerald-500/30">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-100">Ready to take action?</h3>
                    <p className="text-sm text-slate-400">
                      Save your progress and get a personalized improvement roadmap.
                    </p>
                  </div>
                  <Button onClick={() => setShowSaveModal(true)} className="whitespace-nowrap">
                    Save My Score
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-xs text-slate-600 text-center">
            Educational information based on NJ REAL rules (N.J.A.C. 7:13) and IECC 2021 energy codes. 
            Not legal, financial, or insurance advice.
          </p>
        </div>
      </footer>

      {/* Save Progress Modal */}
      <SaveProgressModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveProgress}
        score={percentage}
      />
    </div>
  )
}

// Checklist Item Component
function ChecklistItem({ item, value, onChange, color }) {
  const [showHelp, setShowHelp] = useState(false)

  if (item.type === 'toggle') {
    return (
      <div className="p-4 bg-slate-700/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-slate-200">{item.label}</span>
            {item.help && (
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="p-1 hover:bg-slate-600 rounded"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <Badge color="emerald" size="sm">+{item.points}</Badge>
          </div>
          
          <button
            onClick={() => onChange(!value)}
            className={`w-12 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${
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
        
        <AnimatePresence>
          {showHelp && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-sm text-slate-400 mt-3 pl-0"
            >
              💡 {item.help}
            </motion.p>
          )}
        </AnimatePresence>
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
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left ${
                value === option.value
                  ? 'border-emerald-500 bg-emerald-900/30'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div>
                <span className="text-slate-200 block">{option.label}</span>
                {option.desc && (
                  <span className="text-xs text-slate-400">{option.desc}</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
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

// Save Progress Modal
function SaveProgressModal({ isOpen, onClose, onSave, score }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 w-full max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Your Score: {score}%
          </h2>
          <p className="text-slate-400">
            Create a free account to save your progress and track improvements over time.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={onSave} className="w-full" size="lg">
            Save & Create Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <button
            onClick={onClose}
            className="w-full py-3 text-slate-400 hover:text-slate-300 text-sm"
          >
            Continue without saving
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          Your checklist data will transfer to your new account.
        </p>
      </motion.div>
    </div>
  )
}
