import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, ArrowRight, AlertTriangle, TrendingUp, DollarSign, 
  FileText, Users, Calendar, MapPin, ChevronRight, Zap
} from 'lucide-react'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import { Navbar, Footer } from '../components/navigation'
import { ScoreGauge, MiniScore } from '../components/ScoreGauge'
import { Button, Card, Badge, ProgressBar, EmptyState } from '../components/ui'
import { calculateTotalCosts, calculateInsuranceSavings, getNeighborhoodData } from '../data/costs'

export default function DashboardPage() {
  const { user } = useAuth()
  const { properties, currentPropertyId, setCurrentPropertyId } = useStore()
  
  const currentProperty = properties.find(p => p.id === currentPropertyId) || properties[0]

  if (!currentProperty) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <EmptyState
            icon={Plus}
            title="No Properties Yet"
            description="Add your first property to get started with your resilience assessment."
            action={
              <Link to="/onboarding">
                <Button>Add Your First Property</Button>
              </Link>
            }
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Property Selector */}
        {properties.length > 1 && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => setCurrentPropertyId(property.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentPropertyId === property.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <MapPin className="w-4 h-4" />
                {property.address?.split(',')[0] || 'Property'}
              </button>
            ))}
            <Link to="/onboarding">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700">
                <Plus className="w-4 h-4" />
                Add Property
              </button>
            </Link>
          </div>
        )}

        <DashboardContent property={currentProperty} />
      </main>

      <Footer />
    </div>
  )
}

function DashboardContent({ property }) {
  const selections = property.selections || {}
  
  // Calculate scores
  const score = useMemo(() => {
    let total = 0
    const max = 4000
    
    if (selections.roofType === 'architectural') total += 200
    if (selections.roofType === 'metal') total += 300
    if (selections.roofFasteners) total += 150
    if (selections.roofSealed) total += 300
    if (selections.foundationType === 'crawl') total += 150
    if (selections.foundationType === 'elevated') total += 400
    if (selections.floodVents) total += 100
    if (selections.breakawayPanels) total += 100
    if (selections.floodMaterials) total += 100
    if (selections.backflowValves) total += 50
    if (selections.atticInsulation) total += 150
    if (selections.wallInsulation) total += 100
    if (selections.exteriorWrap) total += 150
    if (selections.airSealing) total += 100
    if (selections.hvacLocation === 'elevated') total += 300
    if (selections.electricalElevated) total += 150
    if (selections.waterHeaterElevated) total += 75
    if (selections.generatorInterlock) total += 75
    if (selections.drivewaySurface === 'permeable') total += 150
    if (selections.rainGarden) total += 100
    if (selections.frenchDrain) total += 75
    if (selections.properGrading) total += 75
    if (selections.elevationCert) total += 150
    if (selections.appraisalDoc) total += 100
    if (selections.permitsClosed) total += 100
    if (selections.floodZoneLOMA) total += 75
    if (selections.insuranceAudit) total += 75
    if (selections.smartShutoff) total += 125
    if (selections.leakSensors) total += 75
    if (selections.batteryBackup) total += 200
    if (selections.floodMonitor) total += 100
    
    return { total, max }
  }, [selections])

  // Calculate costs and savings
  const costs = useMemo(() => calculateTotalCosts(selections), [selections])
  const savings = useMemo(() => calculateInsuranceSavings(selections), [selections])
  const neighborhood = getNeighborhoodData(property.zip_code)

  // 40% calculation
  const homeValue = property.home_value || 500000
  const projectBudget = property.project_budget || 0
  const substantialRatio = projectBudget / homeValue
  const isSubstantialImprovement = substantialRatio > 0.40

  // Roof age calculation
  const roofAge = property.roof_age || 15
  const replacementCost = property.replacement_cost || 300000
  const acvPayout = Math.max(0, replacementCost - (replacementCost * (roofAge / 25)))
  const isInsuranceCliff = roofAge > 15

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Welcome back! 👋
        </h1>
        <p className="text-slate-400 flex items-center gap-2 mt-1">
          <MapPin className="w-4 h-4" />
          {property.address || 'Your Property'}
        </p>
      </div>

      {/* Alerts */}
      {(isSubstantialImprovement || isInsuranceCliff) && (
        <div className="space-y-3">
          {isSubstantialImprovement && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/50 border-2 border-red-500 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-200">40% Rule Triggered</h3>
                  <p className="text-red-300/80 text-sm mt-1">
                    Your renovation budget exceeds 40% of home value. NJ REAL rules require elevation.
                  </p>
                </div>
                <span className="text-red-400 font-bold">{(substantialRatio * 100).toFixed(0)}%</span>
              </div>
            </motion.div>
          )}
          
          {isInsuranceCliff && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-900/50 border-2 border-amber-500 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-200">Insurance Gap Warning</h3>
                  <p className="text-amber-300/80 text-sm mt-1">
                    Your {roofAge}-year roof triggers ACV depreciation. You'd only receive ${acvPayout.toLocaleString()} on a claim.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center py-8">
          <ScoreGauge score={score.total} maxScore={score.max} size="lg" />
          
          <div className="mt-6 w-full px-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">vs. Neighborhood Avg</span>
              <span className="text-emerald-400 font-medium">
                +{Math.round((score.total / score.max) * 100 - neighborhood.average)}%
              </span>
            </div>
            <ProgressBar 
              value={neighborhood.average} 
              max={100} 
              color="blue" 
              size="sm" 
            />
            <p className="text-xs text-slate-500 mt-2 text-center">
              Based on {neighborhood.total} homes in {property.zip_code}
            </p>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Estimated Investment</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  ${costs.totalLow.toLocaleString()} - ${costs.totalHigh.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {costs.breakdown.length} upgrades selected
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-900/50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Annual Insurance Savings</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  ${savings.annualSavings.toLocaleString()}/yr
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ${(savings.annualSavings * 10).toLocaleString()} over 10 years
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-900/50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">40% Threshold</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  ${(homeValue * 0.4).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Max renovation before elevation required
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-900/50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Storm Season</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  139 Days
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Until June 1 hurricane season
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/checklist">
          <Card className="h-full hover:border-emerald-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">Continue Checklist</h3>
                <p className="text-sm text-slate-400">
                  {Object.values(selections).filter(Boolean).length} items completed
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </Card>
        </Link>

        <Link to="/contractors">
          <Card className="h-full hover:border-emerald-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">Find Contractors</h3>
                <p className="text-sm text-slate-400">FORTIFIED-certified pros</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </Card>
        </Link>

        <Link to="/documents">
          <Card className="h-full hover:border-emerald-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">Document Vault</h3>
                <p className="text-sm text-slate-400">Store your certificates</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Priority Actions */}
      {property.priorities && property.priorities.length > 0 && (
        <Card>
          <h2 className="text-lg font-bold text-slate-100 mb-4">Your Priority Actions</h2>
          <div className="space-y-3">
            {property.priorities.slice(0, 3).map((priority, i) => (
              <div 
                key={i}
                className={`p-4 rounded-lg border-2 ${
                  priority.urgency === 'critical' 
                    ? 'bg-red-900/30 border-red-500/50' 
                    : priority.urgency === 'high'
                    ? 'bg-amber-900/30 border-amber-500/50'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Badge color={
                      priority.urgency === 'critical' ? 'red' : 
                      priority.urgency === 'high' ? 'amber' : 'slate'
                    }>
                      {priority.urgency.toUpperCase()}
                    </Badge>
                    <h4 className="font-medium text-slate-100 mt-2 capitalize">
                      {priority.category} Protection
                    </h4>
                    <p className="text-sm text-slate-400">{priority.reason}</p>
                  </div>
                  <Link to="/checklist">
                    <Button size="sm" variant="secondary">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
