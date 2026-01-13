// Cost estimates for upgrades (low and high range)
export const upgradeCosts = {
  // Roof
  roofType: {
    architectural: { low: 8000, high: 15000, label: 'Architectural Shingles' },
    metal: { low: 15000, high: 30000, label: 'Standing Seam Metal Roof' },
  },
  roofFasteners: { low: 500, high: 1500, label: 'Stainless Steel Fasteners' },
  roofSealed: { low: 2000, high: 5000, label: 'Sealed Roof Deck' },
  
  // Foundation
  foundationType: {
    crawl: { low: 15000, high: 40000, label: 'Raise to Crawl Space' },
    elevated: { low: 80000, high: 200000, label: 'Full Elevation (+4ft)' },
  },
  floodVents: { low: 500, high: 2000, label: 'Smart Flood Vents' },
  breakawayPanels: { low: 2000, high: 5000, label: 'Breakaway Wall Panels' },
  floodMaterials: { low: 5000, high: 15000, label: 'Flood-Resistant Materials' },
  backflowValves: { low: 300, high: 1000, label: 'Backflow Prevention Valves' },
  
  // Thermal
  atticInsulation: { low: 1500, high: 4000, label: 'R-60 Attic Insulation' },
  wallInsulation: { low: 2000, high: 6000, label: 'Wall Insulation' },
  exteriorWrap: { low: 8000, high: 20000, label: 'Continuous Exterior Insulation' },
  airSealing: { low: 500, high: 2000, label: 'Professional Air Sealing' },
  
  // Systems
  hvacLocation: {
    elevated: { low: 3000, high: 8000, label: 'Elevate HVAC' },
  },
  electricalElevated: { low: 2000, high: 5000, label: 'Elevate Electrical Panel' },
  waterHeaterElevated: { low: 500, high: 1500, label: 'Elevate Water Heater' },
  generatorInterlock: { low: 500, high: 1500, label: 'Generator Transfer Switch' },
  
  // Site
  drivewaySurface: {
    permeable: { low: 8000, high: 25000, label: 'Permeable Pavers' },
  },
  rainGarden: { low: 2000, high: 8000, label: 'Rain Garden' },
  frenchDrain: { low: 2000, high: 6000, label: 'French Drain System' },
  properGrading: { low: 1000, high: 4000, label: 'Yard Regrading' },
  
  // Legal
  elevationCert: { low: 300, high: 800, label: 'Elevation Certificate' },
  appraisalDoc: { low: 400, high: 800, label: 'Property Appraisal' },
  permitsClosed: { low: 0, high: 500, label: 'Permit Closure' },
  floodZoneLOMA: { low: 500, high: 2000, label: 'LOMA Application' },
  insuranceAudit: { low: 0, high: 300, label: 'Insurance Audit' },
  
  // Tech
  smartShutoff: { low: 200, high: 500, label: 'Smart Water Shutoff' },
  leakSensors: { low: 100, high: 300, label: 'Leak Sensors' },
  batteryBackup: { low: 10000, high: 20000, label: 'Whole-Home Battery' },
  floodMonitor: { low: 100, high: 400, label: 'Flood Monitor' },
}

// Insurance savings estimates per upgrade
export const insuranceSavings = {
  roofType: {
    architectural: { annual: 200, label: 'Wind-rated roof discount' },
    metal: { annual: 400, label: 'Impact-resistant roof discount' },
  },
  roofSealed: { annual: 150, label: 'FORTIFIED roof discount' },
  foundationType: {
    elevated: { annual: 2000, label: 'Elevation credit' },
  },
  floodVents: { annual: 100, label: 'Flood vent credit' },
  smartShutoff: { annual: 50, label: 'Water protection discount' },
  batteryBackup: { annual: 100, label: 'Backup power credit' },
  elevationCert: { annual: 300, label: 'Accurate rating discount' },
}

// Calculate total costs for a property
export function calculateTotalCosts(selections) {
  let totalLow = 0
  let totalHigh = 0
  const breakdown = []

  Object.entries(selections).forEach(([key, value]) => {
    if (!value) return
    
    const costData = upgradeCosts[key]
    if (!costData) return
    
    // Handle nested options (like roofType: 'architectural')
    if (typeof value === 'string' && costData[value]) {
      const option = costData[value]
      totalLow += option.low
      totalHigh += option.high
      breakdown.push({
        key,
        label: option.label,
        low: option.low,
        high: option.high,
      })
    } else if (value === true && costData.low !== undefined) {
      totalLow += costData.low
      totalHigh += costData.high
      breakdown.push({
        key,
        label: costData.label,
        low: costData.low,
        high: costData.high,
      })
    }
  })

  return { totalLow, totalHigh, breakdown }
}

// Calculate insurance savings
export function calculateInsuranceSavings(selections) {
  let annualSavings = 0
  const breakdown = []

  Object.entries(selections).forEach(([key, value]) => {
    if (!value) return
    
    const savingsData = insuranceSavings[key]
    if (!savingsData) return
    
    if (typeof value === 'string' && savingsData[value]) {
      const option = savingsData[value]
      annualSavings += option.annual
      breakdown.push({
        key,
        label: option.label,
        annual: option.annual,
      })
    } else if (value === true && savingsData.annual !== undefined) {
      annualSavings += savingsData.annual
      breakdown.push({
        key,
        label: savingsData.label,
        annual: savingsData.annual,
      })
    }
  })

  return { annualSavings, breakdown }
}

// Sample contractor data
export const contractors = [
  {
    id: 1,
    name: 'Shore Roofing Pros',
    specialty: 'Roofing',
    categories: ['roofType', 'roofFasteners', 'roofSealed'],
    rating: 4.8,
    reviews: 127,
    phone: '(732) 555-0101',
    verified: true,
    fortifiedCertified: true,
  },
  {
    id: 2,
    name: 'Coastal Elevation Services',
    specialty: 'Foundation & Elevation',
    categories: ['foundationType', 'floodVents', 'breakawayPanels'],
    rating: 4.9,
    reviews: 84,
    phone: '(609) 555-0202',
    verified: true,
    fortifiedCertified: true,
  },
  {
    id: 3,
    name: 'Green Home Insulators',
    specialty: 'Insulation & Energy',
    categories: ['atticInsulation', 'wallInsulation', 'exteriorWrap', 'airSealing'],
    rating: 4.7,
    reviews: 203,
    phone: '(732) 555-0303',
    verified: true,
    fortifiedCertified: false,
  },
  {
    id: 4,
    name: 'Jersey Shore HVAC',
    specialty: 'HVAC & Electrical',
    categories: ['hvacLocation', 'electricalElevated', 'waterHeaterElevated', 'generatorInterlock'],
    rating: 4.6,
    reviews: 156,
    phone: '(609) 555-0404',
    verified: true,
    fortifiedCertified: false,
  },
  {
    id: 5,
    name: 'Stormwater Solutions NJ',
    specialty: 'Drainage & Landscaping',
    categories: ['drivewaySurface', 'rainGarden', 'frenchDrain', 'properGrading'],
    rating: 4.8,
    reviews: 67,
    phone: '(732) 555-0505',
    verified: true,
    fortifiedCertified: false,
  },
  {
    id: 6,
    name: 'SmartHome Shore',
    specialty: 'Smart Home & Monitoring',
    categories: ['smartShutoff', 'leakSensors', 'batteryBackup', 'floodMonitor'],
    rating: 4.9,
    reviews: 92,
    phone: '(609) 555-0606',
    verified: true,
    fortifiedCertified: false,
  },
]

// Get contractors for specific upgrades
export function getContractorsForUpgrade(upgradeKey) {
  return contractors.filter(c => c.categories.includes(upgradeKey))
}

// ZIP code to average neighborhood score (mock data)
export const neighborhoodScores = {
  '08742': { average: 42, total: 234, topScore: 89 },
  '08738': { average: 38, total: 189, topScore: 85 },
  '08751': { average: 45, total: 312, topScore: 92 },
  '08752': { average: 41, total: 267, topScore: 88 },
  '08753': { average: 39, total: 198, topScore: 86 },
  '08008': { average: 52, total: 421, topScore: 95 },
  '08006': { average: 48, total: 156, topScore: 91 },
  'default': { average: 40, total: 150, topScore: 85 },
}

export function getNeighborhoodData(zipCode) {
  return neighborhoodScores[zipCode] || neighborhoodScores['default']
}
