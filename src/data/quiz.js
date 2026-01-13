export const quizQuestions = [
  {
    id: 'propertyType',
    question: 'What type of property is this?',
    type: 'single',
    options: [
      { id: 'primary', label: 'Primary Residence', icon: '🏠', description: 'Where you live most of the year' },
      { id: 'vacation', label: 'Vacation Home', icon: '🏖️', description: 'Second home or beach house' },
      { id: 'rental', label: 'Rental Property', icon: '🔑', description: 'Investment property you rent out' },
    ],
  },
  {
    id: 'homeAge',
    question: 'How old is your home?',
    type: 'single',
    options: [
      { id: 'new', label: 'Less than 10 years', icon: '✨', description: 'Built 2015 or later' },
      { id: 'medium', label: '10-30 years', icon: '🏡', description: 'Built 1995-2014' },
      { id: 'older', label: '30-50 years', icon: '🏚️', description: 'Built 1975-1994' },
      { id: 'historic', label: 'Over 50 years', icon: '🏛️', description: 'Built before 1975' },
    ],
  },
  {
    id: 'floodHistory',
    question: 'Has your property ever flooded?',
    type: 'single',
    options: [
      { id: 'never', label: 'Never', icon: '✅', description: 'No flooding history' },
      { id: 'minor', label: 'Minor flooding', icon: '💧', description: 'Water in yard or garage' },
      { id: 'major', label: 'Major flooding', icon: '🌊', description: 'Water entered the home' },
      { id: 'multiple', label: 'Multiple times', icon: '⚠️', description: 'Flooded more than once' },
    ],
  },
  {
    id: 'roofKnowledge',
    question: 'Do you know what type of roof you have?',
    type: 'single',
    options: [
      { id: '3tab', label: '3-Tab Shingles', icon: '📋', description: 'Flat, uniform strips' },
      { id: 'architectural', label: 'Architectural Shingles', icon: '🏗️', description: 'Dimensional, layered look' },
      { id: 'metal', label: 'Metal Roof', icon: '🔩', description: 'Standing seam or panels' },
      { id: 'other', label: 'Other / Not sure', icon: '❓', description: 'Tile, slate, or unknown' },
    ],
  },
  {
    id: 'foundationKnowledge',
    question: 'What type of foundation does your home have?',
    type: 'single',
    options: [
      { id: 'slab', label: 'Slab on Ground', icon: '⬜', description: 'Home sits directly on concrete' },
      { id: 'crawl', label: 'Crawl Space', icon: '🔲', description: 'Raised 1-3 feet with vents' },
      { id: 'elevated', label: 'Elevated / Pilings', icon: '🏗️', description: 'Raised 4+ feet on posts' },
      { id: 'basement', label: 'Basement', icon: '⬛', description: 'Below-ground level' },
    ],
  },
  {
    id: 'plannedWork',
    question: 'Are you planning any renovations?',
    type: 'single',
    options: [
      { id: 'none', label: 'No plans', icon: '🚫', description: 'Just want to assess current state' },
      { id: 'minor', label: 'Minor updates', icon: '🔧', description: 'Under $50,000 in work' },
      { id: 'major', label: 'Major renovation', icon: '🏗️', description: '$50,000 - $200,000' },
      { id: 'rebuild', label: 'Full rebuild', icon: '🏠', description: 'Over $200,000 or new construction' },
    ],
  },
  {
    id: 'concerns',
    question: 'What are your biggest concerns?',
    type: 'multiple',
    options: [
      { id: 'flooding', label: 'Flooding', icon: '🌊', description: 'Storm surge or rain flooding' },
      { id: 'wind', label: 'Wind Damage', icon: '💨', description: 'Hurricane or storm winds' },
      { id: 'insurance', label: 'Insurance Costs', icon: '💰', description: 'High premiums or coverage gaps' },
      { id: 'compliance', label: 'Code Compliance', icon: '📋', description: 'Meeting NJ REAL requirements' },
      { id: 'value', label: 'Home Value', icon: '📈', description: 'Protecting investment' },
      { id: 'energy', label: 'Energy Costs', icon: '⚡', description: 'High utility bills' },
    ],
  },
  {
    id: 'timeline',
    question: 'When do you want to make improvements?',
    type: 'single',
    options: [
      { id: 'asap', label: 'As soon as possible', icon: '🚀', description: 'Ready to start now' },
      { id: 'soon', label: 'Within 6 months', icon: '📅', description: 'Planning for this year' },
      { id: 'year', label: 'Within a year', icon: '🗓️', description: 'Researching options' },
      { id: 'later', label: 'Just exploring', icon: '🔍', description: 'No immediate plans' },
    ],
  },
]

// Convert quiz answers to initial property selections
export function quizToSelections(answers) {
  const selections = {
    roofType: null,
    roofFasteners: false,
    roofSealed: false,
    foundationType: null,
    floodVents: false,
    breakawayPanels: false,
    floodMaterials: false,
    backflowValves: false,
    atticInsulation: false,
    wallInsulation: false,
    exteriorWrap: false,
    airSealing: false,
    hvacLocation: null,
    electricalElevated: false,
    waterHeaterElevated: false,
    generatorInterlock: false,
    drivewaySurface: null,
    rainGarden: false,
    frenchDrain: false,
    properGrading: false,
    elevationCert: false,
    appraisalDoc: false,
    permitsClosed: false,
    floodZoneLOMA: false,
    insuranceAudit: false,
    smartShutoff: false,
    leakSensors: false,
    batteryBackup: false,
    floodMonitor: false,
  }

  // Pre-fill based on quiz answers
  if (answers.roofKnowledge) {
    if (answers.roofKnowledge === 'architectural') {
      selections.roofType = 'architectural'
    } else if (answers.roofKnowledge === 'metal') {
      selections.roofType = 'metal'
    }
  }

  if (answers.foundationKnowledge) {
    if (answers.foundationKnowledge === 'crawl') {
      selections.foundationType = 'crawl'
    } else if (answers.foundationKnowledge === 'elevated') {
      selections.foundationType = 'elevated'
    }
  }

  return selections
}

// Get recommended priorities based on quiz
export function getRecommendedPriorities(answers) {
  const priorities = []

  // If they've had flooding, flood protection is #1
  if (answers.floodHistory === 'major' || answers.floodHistory === 'multiple') {
    priorities.push({
      category: 'flood',
      urgency: 'critical',
      reason: 'Based on your flooding history',
    })
  }

  // If planning major work, check 40% rule
  if (answers.plannedWork === 'major' || answers.plannedWork === 'rebuild') {
    priorities.push({
      category: 'legal',
      urgency: 'critical',
      reason: 'Major renovations may trigger elevation requirements',
    })
  }

  // Old homes need more attention
  if (answers.homeAge === 'older' || answers.homeAge === 'historic') {
    priorities.push({
      category: 'roof',
      urgency: 'high',
      reason: 'Older roofs may not meet current wind codes',
    })
    priorities.push({
      category: 'thermal',
      urgency: 'medium',
      reason: 'Older homes typically lack modern insulation',
    })
  }

  // Based on concerns
  if (answers.concerns?.includes('flooding')) {
    priorities.push({
      category: 'flood',
      urgency: 'high',
      reason: 'You identified flooding as a concern',
    })
  }
  if (answers.concerns?.includes('wind')) {
    priorities.push({
      category: 'roof',
      urgency: 'high',
      reason: 'You identified wind damage as a concern',
    })
  }
  if (answers.concerns?.includes('insurance')) {
    priorities.push({
      category: 'legal',
      urgency: 'high',
      reason: 'Proper documentation can reduce insurance costs',
    })
  }

  return priorities
}
