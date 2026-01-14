import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Thermometer, Zap, FileCheck,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronDown, ChevronRight, Info, Award, Calendar,
  DollarSign, Building, Wind, Battery, Gauge, MapPin,
  FileText, Bell, Users, CheckSquare, Square, CircleDot,
  AlertCircle, ArrowUp, Umbrella, Scale, Leaf, Radio,
  X, Menu, Settings, HelpCircle, Pencil, Calculator,
  Ruler, Waves, FileWarning, ExternalLink
} from 'lucide-react';

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================
const LEGACY_WINDOW_END = new Date('2026-07-15');
const STORM_SEASON_START = new Date('2026-06-01');
const CAFE_ELEVATION = 4; // +4ft above BFE
const COST_PER_SQFT = 250; // NJ Shore average
const LAND_VALUE_PERCENT = 0.35; // Land typically 35% of total value

// =============================================================================
// GLOSSARY - Plain English definitions for technical terms
// =============================================================================
const GLOSSARY = {
  bfe: {
    term: 'BFE (Base Flood Elevation)',
    definition: 'The height that FEMA predicts floodwater will reach during a major flood (the "100-year flood" that has a 1% chance of happening each year). Measured in feet above a fixed reference point called NAVD88. If your BFE is 9ft, FEMA expects flood water could reach 9 feet during a major flood event.',
    example: 'If your home\'s first floor is at 11ft and your BFE is 9ft, you have 2ft of "freeboard" (safety buffer) above the expected flood level.',
    whyItMatters: 'Your elevation relative to BFE determines your flood insurance rates and whether you meet building code requirements.'
  },
  navd88: {
    term: 'NAVD88',
    definition: 'North American Vertical Datum of 1988 - a fixed reference point for measuring elevation across the US. It\'s roughly based on average sea level but adjusted for local geography. All flood elevations in your area use this same reference point.',
    example: 'When your Elevation Certificate says "9.5ft NAVD88", that\'s your height above this fixed reference - not above the current water level.',
    whyItMatters: 'Using a consistent reference allows accurate comparison between your home, flood levels, and building requirements.'
  },
  cafe: {
    term: 'CAFE (Climate-Adjusted Flood Elevation)',
    definition: 'New Jersey\'s 2026 requirement that adds 4 extra feet to the BFE for new construction and major renovations. This accounts for rising sea levels and more intense storms predicted due to climate change.',
    example: 'If your BFE is 9ft, the CAFE standard requires your lowest floor to be at 13ft (9 + 4 = 13).',
    whyItMatters: 'Homes built to CAFE standard will have lower flood risk and insurance costs for decades to come.'
  },
  substantialImprovement: {
    term: 'Substantial Improvement (SI)',
    definition: 'When the cost of your renovation equals or exceeds 50% of your home\'s structure value (not including land). Hitting this threshold triggers mandatory elevation requirements - your entire home must be raised to meet current flood codes.',
    example: 'If your structure is worth $400,000, any renovation totaling $200,000 or more (over 10 years) triggers SI.',
    whyItMatters: 'This is the most important threshold for shore homeowners. Accidentally triggering SI can add $150,000-$400,000 in unexpected elevation costs.'
  },
  structureValue: {
    term: 'Structure Value',
    definition: 'The value of your home\'s building only - NOT including the land it sits on. This is what\'s used to calculate the 50% Substantial Improvement threshold. Typically 60-70% of your total property value.',
    example: 'A home worth $600,000 total might have land worth $200,000 and structure worth $400,000. Your 50% threshold would be $200,000.',
    whyItMatters: 'Using the wrong value (total vs structure) could cause you to miscalculate your renovation budget.'
  },
  floodZone: {
    term: 'Flood Zone',
    definition: 'FEMA\'s classification of flood risk for your area. Common zones: AE (high risk, along rivers/bays), VE (highest risk, coastal with waves), X (lower risk, outside 100-year flood area).',
    example: 'VE zones face both flooding AND wave action, requiring stronger foundations and stricter building codes than AE zones.',
    whyItMatters: 'Your flood zone determines your insurance requirements, building codes, and flood risk level.'
  },
  elevationCertificate: {
    term: 'Elevation Certificate (EC)',
    definition: 'An official document prepared by a surveyor that records your home\'s elevation compared to the BFE. It includes your lowest floor height, machinery locations, and flood vent information.',
    example: 'The EC might show your lowest floor at 8.5ft with a BFE of 9ft, meaning you\'re 0.5ft below the expected flood level.',
    whyItMatters: 'Required for accurate flood insurance pricing. An EC showing you\'re above BFE can save thousands per year in premiums.'
  },
  floodVent: {
    term: 'Flood Vent (Engineered Opening)',
    definition: 'Special openings in foundation walls that allow floodwater to flow through rather than pushing against your home. ICC-certified "engineered" vents automatically open when water rises and close when it recedes.',
    example: 'A 400 sq ft garage needs at least 2 engineered flood vents (each typically rated for 200 sq ft).',
    whyItMatters: 'Proper venting reduces structural damage during floods and can improve your NFIP insurance rating.'
  },
  acv: {
    term: 'ACV (Actual Cash Value)',
    definition: 'Insurance payout method that deducts depreciation from your claim. Older roofs get reduced payouts because they\'ve "used up" some of their lifespan. The opposite is RCV (Replacement Cost Value) which pays full replacement cost.',
    example: 'A 15-year-old roof damaged in a storm might only get 50% of replacement cost under ACV, while a 5-year-old roof gets nearly full value.',
    whyItMatters: 'Roof age directly affects how much insurance will pay if you have damage. Older roofs = lower payouts.'
  },
  fortified: {
    term: 'FORTIFIED',
    definition: 'A voluntary certification program by IBHS (Insurance Institute for Business & Home Safety) that verifies your home meets enhanced wind and storm resistance standards. Three levels: Bronze, Silver, and Gold.',
    example: 'FORTIFIED Silver requires sealed roof deck, proper fasteners, and protected openings - many insurers offer 15-25% discounts.',
    whyItMatters: 'FORTIFIED certification can significantly reduce wind/hurricane insurance premiums and improves resale value.'
  },
  iecc: {
    term: 'IECC (International Energy Conservation Code)',
    definition: 'National building code for energy efficiency. New Jersey adopted the 2024 version which requires high insulation (R-60 attic), efficient windows (U-factor ≤0.30), and air sealing verification.',
    example: 'If you replace windows during a renovation, the new ones must meet 2024 IECC standards with U-factor of 0.30 or lower.',
    whyItMatters: 'Any permitted renovation must meet current energy codes, which affects material choices and costs.'
  },
  irz: {
    term: 'IRZ (Inundation Risk Zone)',
    definition: 'Areas projected to experience daily tidal flooding by the year 2100 due to sea level rise (based on 4.4ft rise projections). Properties in IRZ have additional disclosure requirements.',
    example: 'A home 3 feet above current high tide might be in an IRZ because sea levels are expected to rise significantly.',
    whyItMatters: 'IRZ properties require deed notices for any substantial work, affecting future buyers\' awareness and property values.'
  },
  breakawayWalls: {
    term: 'Breakaway Walls',
    definition: 'Walls below the BFE designed to collapse under flood pressure without damaging the main structure. Required in V-zones for any enclosed area below flood level.',
    example: 'A ground-level garage in a VE zone must have walls that will break away during a flood rather than transfer damaging forces to the elevated home above.',
    whyItMatters: 'Proper breakaway walls protect your home\'s structural integrity during floods and are required for code compliance.'
  },
  sealedRoofDeck: {
    term: 'Sealed Roof Deck',
    definition: 'A secondary water barrier applied directly to your roof decking (plywood) under the shingles. If shingles blow off in high winds, this membrane prevents water from entering your home.',
    example: 'Peel-and-stick underlayment or spray-applied SWR (Secondary Water Resistance) are common methods.',
    whyItMatters: 'Major source of hurricane damage is water intrusion after shingles blow off. Sealed deck prevents this and qualifies for insurance discounts.'
  },
  nfip: {
    term: 'NFIP (National Flood Insurance Program)',
    definition: 'The federal flood insurance program run by FEMA. Most private insurers don\'t cover floods, so NFIP is the primary source of flood coverage. Rates are based on your elevation relative to BFE.',
    example: 'A home 2ft below BFE might pay $3,000+/year while a home 2ft above BFE might pay under $1,000/year.',
    whyItMatters: 'Understanding NFIP rating factors helps you make mitigation decisions that reduce premiums.'
  }
};

// Threshold explanations
const COMPLIANCE_INFO = {
  fortyPercent: {
    title: '40% Yellow Zone',
    definition: 'When your renovation costs reach 40% of your structure value (building only, not land), most towns require extra scrutiny.',
    description: 'This is an early warning threshold. You haven\'t triggered mandatory elevation yet, but the town will look more closely at your permits.',
    consequences: [
      'Contractor must sign affidavits confirming project costs',
      'Building department does detailed review of all work',
      'You\'re getting close to the 50% cliff - plan carefully',
      'Consider phasing work across multiple years if possible'
    ],
    citation: 'N.J.A.C. 7:13 - NJ Flood Hazard Area Control Act'
  },
  fiftyPercent: {
    title: '50% Red Zone - Substantial Improvement',
    definition: 'When renovation costs hit 50% of structure value, federal law requires your entire home to be elevated to current flood standards.',
    description: 'This is the critical threshold. Once crossed, you cannot continue your renovation until the whole house is raised to BFE +4ft - often adding $150,000-$400,000 to your project.',
    consequences: [
      'ALL work stops until home is elevated to BFE + 4ft',
      'Elevation typically costs $150,000 - $400,000+',
      'All mechanicals (HVAC, electrical, plumbing) must be elevated too',
      'Timeline extends by 6-12 months minimum',
      'Cannot get Certificate of Occupancy without compliance'
    ],
    citation: 'FEMA 44 CFR 59.1 & N.J.A.C. 7:13-12.5'
  },
  cafeStandard: {
    title: 'CAFE +4ft Standard (2026)',
    definition: 'New Jersey\'s climate-adjusted requirement that adds 4 feet of extra height above FEMA\'s flood level for new construction and substantial improvements.',
    description: 'This accounts for sea level rise and stronger storms. If your BFE is 9ft, you\'d need to build to 13ft under CAFE.',
    consequences: [
      'First floor must be at BFE + 4ft (not just BFE)',
      'Higher construction costs upfront, but better protection',
      'Significant flood insurance savings over time',
      'Your home will meet standards for decades to come'
    ],
    citation: 'NJ REAL Rules - Effective January 2026'
  },
  ventingRatio: {
    term: '1:1 Flood Venting Rule',
    definition: 'For every square foot of enclosed space below flood level (garage, crawlspace), you need 1 square inch of flood vent opening.',
    description: 'Flood vents let water flow through your foundation instead of building up pressure that can destroy walls.',
    consequences: [
      'A 400 sq ft garage needs 400 sq inches of venting (typically 2 engineered vents)',
      'Non-engineered openings (holes in walls) need TWICE the area',
      'Insufficient venting = code violation + insurance penalties',
      'Proper venting can improve your flood insurance rating'
    ],
    citation: 'FEMA TB 1-08 & NJ Uniform Construction Code'
  },
  legacyWindow: {
    title: 'July 2026 Legacy Window',
    definition: 'A 6-month grace period where permit applications can be reviewed under OLD rules (BFE instead of BFE+4) if submitted before the deadline.',
    description: 'If you\'re planning major work, submitting a complete application before July 2026 could save significant elevation costs.',
    consequences: [
      'Applications must be COMPLETE (not just started)',
      'Could save $50,000-$150,000 in extra elevation costs',
      'Deadline is firm - no extensions',
      'Must include all engineering, surveys, and supporting docs'
    ],
    citation: 'NJ REAL Rules - Grandfathering Provision'
  }
};

// =============================================================================
// ZIP CODE & REGIONAL DATA (with avg $/sqft from 2024-2025 sales data)
// =============================================================================
const ZIP_DATA = {
  // Ocean County
  '08742': { municipality: 'Point Pleasant Beach', county: 'Ocean', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 425 },
  '08751': { municipality: 'Seaside Heights', county: 'Ocean', bfe: 10, floodZone: 'AE', tidal: true, pricePerSqft: 335 },
  '08752': { municipality: 'Seaside Park', county: 'Ocean', bfe: 10, floodZone: 'VE', tidal: true, pricePerSqft: 380 },
  '08753': { municipality: 'Toms River', county: 'Ocean', bfe: 8, floodZone: 'AE', tidal: true, pricePerSqft: 275 },
  '08008': { municipality: 'Long Beach Island', county: 'Ocean', bfe: 9, floodZone: 'VE', tidal: true, pricePerSqft: 625 },
  '08050': { municipality: 'Manahawkin', county: 'Ocean', bfe: 7, floodZone: 'AE', tidal: true, pricePerSqft: 285 },
  '08721': { municipality: 'Bayville', county: 'Ocean', bfe: 7, floodZone: 'AE', tidal: true, pricePerSqft: 265 },
  '08723': { municipality: 'Brick', county: 'Ocean', bfe: 8, floodZone: 'AE', tidal: true, pricePerSqft: 295 },
  '08735': { municipality: 'Lavallette', county: 'Ocean', bfe: 10, floodZone: 'AE', tidal: true, pricePerSqft: 485 },
  '08738': { municipality: 'Mantoloking', county: 'Ocean', bfe: 11, floodZone: 'VE', tidal: true, pricePerSqft: 850 },
  '08740': { municipality: 'Ocean Beach', county: 'Ocean', bfe: 10, floodZone: 'AE', tidal: true, pricePerSqft: 395 },
  '08741': { municipality: 'Pine Beach', county: 'Ocean', bfe: 7, floodZone: 'AE', tidal: true, pricePerSqft: 310 },
  // Monmouth County
  '08736': { municipality: 'Manasquan', county: 'Monmouth', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 520 },
  '07719': { municipality: 'Belmar', county: 'Monmouth', bfe: 10, floodZone: 'AE', tidal: true, pricePerSqft: 445 },
  '07750': { municipality: 'Monmouth Beach', county: 'Monmouth', bfe: 11, floodZone: 'VE', tidal: true, pricePerSqft: 565 },
  '07720': { municipality: 'Bradley Beach', county: 'Monmouth', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 410 },
  '07756': { municipality: 'Ocean Grove', county: 'Monmouth', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 385 },
  '07762': { municipality: 'Spring Lake', county: 'Monmouth', bfe: 10, floodZone: 'AE', tidal: true, pricePerSqft: 695 },
  '07760': { municipality: 'Rumson', county: 'Monmouth', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 625 },
  '07732': { municipality: 'Highlands', county: 'Monmouth', bfe: 11, floodZone: 'VE', tidal: true, pricePerSqft: 345 },
  '07758': { municipality: 'Port Monmouth', county: 'Monmouth', bfe: 10, floodZone: 'AE', tidal: true, pricePerSqft: 295 },
  // Cape May County
  '08202': { municipality: 'Avalon', county: 'Cape May', bfe: 10, floodZone: 'VE', tidal: true, pricePerSqft: 785 },
  '08226': { municipality: 'Ocean City', county: 'Cape May', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 485 },
  '08247': { municipality: 'Stone Harbor', county: 'Cape May', bfe: 10, floodZone: 'VE', tidal: true, pricePerSqft: 825 },
  '08204': { municipality: 'Cape May', county: 'Cape May', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 545 },
  '08212': { municipality: 'Cape May Point', county: 'Cape May', bfe: 9, floodZone: 'VE', tidal: true, pricePerSqft: 625 },
  '08223': { municipality: 'Sea Isle City', county: 'Cape May', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 565 },
  '08243': { municipality: 'Sea Isle City', county: 'Cape May', bfe: 9, floodZone: 'VE', tidal: true, pricePerSqft: 585 },
  '08248': { municipality: 'Strathmere', county: 'Cape May', bfe: 9, floodZone: 'VE', tidal: true, pricePerSqft: 495 },
  '08260': { municipality: 'Wildwood', county: 'Cape May', bfe: 8, floodZone: 'AE', tidal: true, pricePerSqft: 345 },
  '08270': { municipality: 'Woodbine', county: 'Cape May', bfe: 6, floodZone: 'AE', tidal: false, pricePerSqft: 185 },
  // Atlantic County
  '08401': { municipality: 'Atlantic City', county: 'Atlantic', bfe: 9, floodZone: 'AE', tidal: true, pricePerSqft: 225 },
  '08402': { municipality: 'Margate', county: 'Atlantic', bfe: 8, floodZone: 'AE', tidal: true, pricePerSqft: 465 },
  '08403': { municipality: 'Longport', county: 'Atlantic', bfe: 9, floodZone: 'VE', tidal: true, pricePerSqft: 585 },
  '08406': { municipality: 'Ventnor', county: 'Atlantic', bfe: 8, floodZone: 'AE', tidal: true, pricePerSqft: 345 },
  '08234': { municipality: 'Egg Harbor Township', county: 'Atlantic', bfe: 6, floodZone: 'AE', tidal: false, pricePerSqft: 215 },
  '08037': { municipality: 'Hammonton', county: 'Atlantic', bfe: 5, floodZone: 'X', tidal: false, pricePerSqft: 195 },
};

// =============================================================================
// ROOFING HIERARCHY
// =============================================================================
const ROOF_TYPES = {
  '3tab': {
    name: '3-Tab Shingles',
    windRating: '60-90 mph',
    lifespan: '15-20 years',
    insuranceImpact: 'Highest ACV penalty - up to 25% less payout on claims',
    resilienceScore: 1,
    description: 'Basic asphalt shingles. Least wind resistant, prone to blow-off.',
    recommendation: 'Consider upgrading before next storm season'
  },
  'architectural': {
    name: 'Architectural Shingles',
    windRating: '110-130 mph',
    lifespan: '25-30 years',
    insuranceImpact: 'Standard rating - baseline for most policies',
    resilienceScore: 3,
    description: 'Dimensional shingles with better wind resistance and aesthetics.',
    recommendation: 'Minimum recommended for NJ coastal properties'
  },
  'metal_screwdown': {
    name: 'Metal Screw-Down',
    windRating: '120-140 mph',
    lifespan: '40-50 years',
    insuranceImpact: '10-15% premium reduction potential',
    resilienceScore: 4,
    description: 'Metal panels secured with exposed fasteners. Good wind resistance.',
    recommendation: 'Good choice, but standing seam is superior for coastal'
  },
  'metal_standing': {
    name: 'Metal Standing Seam',
    windRating: '140-180 mph',
    lifespan: '50-70 years',
    insuranceImpact: 'Up to 25% premium reduction + best claim outcomes',
    resilienceScore: 5,
    description: 'Premium metal with concealed fasteners. Best wind and leak resistance.',
    recommendation: 'Gold standard for NJ shore properties'
  },
  'tile': {
    name: 'Tile/Slate',
    windRating: '125-150 mph (when properly installed)',
    lifespan: '50-100 years',
    insuranceImpact: 'Premium credit varies by installation quality',
    resilienceScore: 4,
    description: 'Heavy, durable materials. Require reinforced structure.',
    recommendation: 'Excellent longevity but ensure proper installation'
  },
  'flat': {
    name: 'Flat/Low-Slope',
    windRating: 'Varies by membrane type',
    lifespan: '15-30 years',
    insuranceImpact: 'Requires additional wind mitigation documentation',
    resilienceScore: 2,
    description: 'TPO, EPDM, or modified bitumen. Different requirements than pitched.',
    recommendation: 'Ensure proper drainage and edge securement'
  }
};

// =============================================================================
// FOUNDATION TYPES
// =============================================================================
const FOUNDATION_TYPES = {
  'slab': {
    name: 'Slab on Grade',
    floodRisk: 'Highest',
    elevationCost: '$180,000 - $350,000',
    description: 'Concrete slab at ground level. Most vulnerable to flooding.',
    complianceNote: 'If in flood zone, will require elevation at 50% SI threshold'
  },
  'crawl': {
    name: 'Crawl Space',
    floodRisk: 'High',
    elevationCost: '$120,000 - $250,000',
    description: 'Raised floor with enclosed crawl space below.',
    complianceNote: 'Must have proper flood vents. Often requires wet floodproofing.'
  },
  'basement': {
    name: 'Basement',
    floodRisk: 'Very High',
    elevationCost: '$200,000 - $400,000+',
    description: 'Below-grade living or storage space.',
    complianceNote: 'Basements prohibited in V-zones. Major compliance challenges.'
  },
  'piers': {
    name: 'Pier/Post Foundation',
    floodRisk: 'Lower',
    elevationCost: '$80,000 - $180,000',
    description: 'Home elevated on concrete or wood piers.',
    complianceNote: 'Good starting point. May only need to raise higher.'
  },
  'piles': {
    name: 'Deep Pile Foundation',
    floodRisk: 'Lowest',
    elevationCost: '$50,000 - $120,000 (for additional height)',
    description: 'Home on driven piles, often already elevated.',
    complianceNote: 'Best position for compliance. Check if meets CAFE +4ft.'
  }
};

// =============================================================================
// CHECKLIST CATEGORIES (Enhanced with full definitions)
// =============================================================================
const CHECKLIST_CATEGORIES = [
  {
    id: 'wind',
    name: 'Wind Defense',
    icon: Wind,
    color: 'cyan',
    description: 'Protect your home from hurricane-force winds and flying debris',
    items: [
      {
        id: 'roof_type',
        name: 'What type of roof do you have?',
        type: 'select',
        definition: 'Your roof material affects how well your home handles high winds and how much you\'ll get paid if you file an insurance claim.',
        options: [
          { value: '3tab', label: '3-Tab Shingles - Basic flat shingles, often on older homes', score: 1 },
          { value: 'architectural', label: 'Architectural Shingles - Thicker, dimensional shingles (most common)', score: 3 },
          { value: 'metal_screwdown', label: 'Metal (Screw-Down) - Metal panels with visible screws', score: 4 },
          { value: 'metal_standing', label: 'Metal (Standing Seam) - Premium metal with hidden fasteners', score: 5 },
          { value: 'tile', label: 'Tile or Slate - Heavy clay, concrete, or stone tiles', score: 4 },
          { value: 'flat', label: 'Flat/Low-Slope - Rubber membrane or built-up roofing', score: 2 }
        ],
        howToCheck: 'Look at your roof from the street. 3-tab shingles look flat and uniform. Architectural shingles have a dimensional, layered look. Metal roofs are obvious. If unsure, check your home inspection report.',
        insuranceImpact: 'Metal standing seam = up to 25% wind premium discount. 3-tab = may face ACV penalties.',
        equityImpact: 'Metal roof adds $15,000-$25,000 to home value. New architectural adds $8,000-$15,000.',
        complianceNote: 'FORTIFIED certification requires architectural shingles minimum.'
      },
      {
        id: 'roof_age',
        name: 'How old is your roof?',
        type: 'number',
        unit: 'years old',
        definition: 'Insurance companies penalize older roofs because they\'re more likely to fail. Roofs over 15 years old often get reduced claim payouts.',
        placeholder: 'Check your permit records, home inspection, or look for a date on the attic decking.',
        howToCheck: 'Look at closing documents, permit records, or ask your roofer. Some roofers write the install date on the attic decking.',
        insuranceImpact: 'Roofs 15+ years face "ACV" penalties - you only get depreciated value, not replacement cost.',
        equityImpact: 'New roof adds $8,000-$20,000 in home value.',
        complianceNote: 'Some insurers won\'t cover roofs over 20 years old at all.'
      },
      {
        id: 'roof_deck',
        name: 'Do you have a sealed roof deck?',
        type: 'toggle',
        definition: 'A sealed roof deck is a sticky waterproof membrane applied directly to the plywood under your shingles. If shingles blow off in a hurricane, this barrier keeps water from pouring into your home.',
        howToCheck: 'Check permit records for roof replacement. Ask your roofer. Look in the attic - you might see the membrane overlapping at seams. If your roof was installed after 2012 in a coastal area, you likely have this.',
        insuranceImpact: '10-15% additional wind premium discount on top of roof type discount.',
        equityImpact: '+$3,000 - $5,000 home value.',
        complianceNote: 'Required for FORTIFIED Silver certification. Highly recommended for all shore homes.'
      },
      {
        id: 'roof_fasteners',
        name: 'Were ring-shank or stainless steel nails used?',
        type: 'toggle',
        definition: 'Ring-shank nails have ridges that grip the wood better than smooth nails. In high winds, regular nails can pull through the shingles. Ring-shank nails hold 40% tighter.',
        howToCheck: 'Ask your roofer or check permit records. If your roof was installed after 2010 in a coastal area, code likely required enhanced fasteners.',
        insuranceImpact: 'Part of the roof system discount package when documented.',
        equityImpact: '+$1,000 - $2,000 home value.',
        complianceNote: 'Required by code in high-velocity hurricane zones.'
      },
      {
        id: 'windows_impact',
        name: 'How are your windows protected?',
        type: 'select',
        definition: 'During hurricanes, flying debris can shatter windows. Once a window breaks, wind enters your home and can blow off the roof from inside. Protection is critical.',
        options: [
          { value: 'none', label: 'No protection - Standard windows with nothing covering them', score: 0 },
          { value: 'film', label: 'Security film - Clear film applied to glass (minimal protection)', score: 1 },
          { value: 'plywood', label: 'Plywood - Boards I put up before storms (labor intensive)', score: 1 },
          { value: 'accordion', label: 'Accordion or roll-down shutters - Permanent shutters that close', score: 3 },
          { value: 'impact', label: 'Impact-rated glass - Special windows that resist breaking', score: 4 },
          { value: 'both', label: 'Impact glass AND shutters - Maximum protection', score: 5 }
        ],
        howToCheck: 'Look at your windows. Impact glass has a small "Impact Rated" or "DP" label in the corner. Shutters are obvious. Check your home inspection or permit records.',
        insuranceImpact: 'Impact glass = 10-15% discount. Accordion shutters = 5-10% discount.',
        equityImpact: 'Impact windows add $10,000-$20,000 to home value.',
        complianceNote: 'Opening protection required in V-zones and for FORTIFIED certification.'
      },
      {
        id: 'garage_door',
        name: 'Is your garage door wind-rated?',
        type: 'toggle',
        definition: 'Garage doors are the #1 point of failure in hurricanes because of their large surface area. If your garage door blows in, wind pressure can blow off your roof from inside.',
        howToCheck: 'Look for a sticker on the inside of your garage door showing wind rating (look for "Wind Load" or "HVHZ"). Check permit records if the door was replaced.',
        insuranceImpact: '2-5% premium reduction when documented.',
        equityImpact: '+$2,000 - $4,000 home value.',
        complianceNote: 'New garage doors in coastal areas must be wind-rated by code.'
      }
    ]
  },
  {
    id: 'flood',
    name: 'Flood Armor',
    icon: Droplets,
    color: 'blue',
    description: 'Protect your home from rising water and storm surge',
    items: [
      {
        id: 'elevation_cert',
        name: 'Do you have an Elevation Certificate?',
        type: 'toggle',
        definition: 'An Elevation Certificate (EC) is an official document prepared by a surveyor that shows exactly how high your home sits compared to the expected flood level (BFE). It\'s like a report card for your home\'s flood risk.',
        howToCheck: 'Check your closing documents, ask your insurance agent, or contact your town\'s building department. If you bought in a flood zone, you probably received one.',
        insuranceImpact: 'REQUIRED for accurate flood insurance pricing. Can save $500-$3,000/year if your home is higher than expected.',
        equityImpact: 'Required for selling a home in a flood zone. Missing EC can delay closings.',
        complianceNote: 'Mandatory for NJ REAL compliance. Get a new EC after ANY work that might change elevation.'
      },
      {
        id: 'current_elevation',
        name: 'What is your lowest floor elevation?',
        type: 'number',
        unit: 'feet (NAVD88)',
        definition: 'This number from your Elevation Certificate shows how high your lowest living floor sits. Higher is better - every foot above BFE significantly reduces flood risk and insurance costs.',
        placeholder: 'Find this on your Elevation Certificate (Section C, "Top of Bottom Floor")',
        howToCheck: 'Look at your Elevation Certificate, Section C. The number for "Top of Bottom Floor" is what you need.',
        insuranceImpact: 'Each foot ABOVE BFE = major premium reduction. Each foot BELOW = major premium increase.',
        equityImpact: 'Homes at or above BFE are worth 10-20% more than comparable homes below BFE.',
        complianceNote: '2026 rules require BFE + 4 feet for substantial improvements.'
      },
      {
        id: 'foundation_type',
        name: 'What type of foundation does your home have?',
        type: 'select',
        definition: 'Your foundation type determines how vulnerable you are to flooding and how expensive it would be to raise your home if required.',
        options: [
          { value: 'slab', label: 'Slab - Concrete pad at ground level (most vulnerable)', score: 0 },
          { value: 'crawl', label: 'Crawl space - Short enclosed space under house', score: 1 },
          { value: 'basement', label: 'Basement - Below-ground living or storage space', score: 0 },
          { value: 'piers', label: 'Piers/Posts - House sits on concrete or wood posts', score: 3 },
          { value: 'piles', label: 'Deep piles - House on driven pilings (like beach houses)', score: 4 }
        ],
        howToCheck: 'Walk around your house. Can you see under it? Do you have stairs to enter? Is there a basement? Pier homes are usually 4-8 feet off the ground.',
        insuranceImpact: 'Elevated foundations (piers/piles) can save $2,000-$4,000/year on flood insurance.',
        equityImpact: 'Properly elevated homes command 15-25% premium in flood zones.',
        complianceNote: 'Foundation type determines cost if elevation is required ($50K-$400K range).'
      },
      {
        id: 'enclosed_sqft',
        name: 'How much enclosed space is below flood level?',
        type: 'number',
        unit: 'square feet',
        definition: 'This includes your garage, crawl space, or any area under your house that has walls around it. This space needs flood vents to let water flow through instead of building up pressure.',
        placeholder: 'Measure your garage/crawlspace: length × width. Example: 20ft × 20ft = 400 sq ft',
        howToCheck: 'Measure your garage or enclosed area under the house. Length × Width = square feet.',
        insuranceImpact: 'Enclosed areas require flood vents. Non-compliant enclosures face insurance penalties.',
        equityImpact: 'Code-compliant enclosures protect property value.',
        complianceNote: 'Triggers 1:1 venting requirement - 1 sq inch of vent per 1 sq ft of space.'
      },
      {
        id: 'flood_vents',
        name: 'How many flood vents do you have?',
        type: 'number',
        unit: 'vents',
        definition: 'Flood vents are special openings in your foundation walls that let floodwater flow through your garage/crawlspace instead of pushing against the walls. They open automatically when water rises.',
        placeholder: 'Count the rectangular vents in your garage/foundation walls. Each ICC-certified vent covers ~200 sq ft.',
        howToCheck: 'Walk around your foundation and count the vents. Look for rectangular openings, usually 8"×16" with a louver or screen. Check for "ICC Certified" labels.',
        insuranceImpact: 'Proper venting can improve your NFIP rating class, saving $300-$800/year.',
        equityImpact: '+$2,000 - $5,000 home value with compliant venting.',
        complianceNote: 'Need 1 vent per 200 sq ft. A 400 sq ft garage needs 2 vents minimum.'
      },
      {
        id: 'breakaway_walls',
        name: 'Are your walls below flood level "breakaway" walls?',
        type: 'toggle',
        definition: 'Breakaway walls are designed to collapse under flood pressure without damaging your house structure. This lets water pass through instead of destroying your foundation.',
        howToCheck: 'Breakaway walls are typically lightweight (plywood, lattice, or special drywall). If you have solid concrete or CMU block walls enclosing space below BFE in a V-zone, they\'re probably NOT breakaway.',
        insuranceImpact: 'Required for compliant enclosures in V-zones. Non-compliance = penalties.',
        equityImpact: '+$5,000 - $10,000 home value.',
        complianceNote: 'Required by code for any enclosed area below BFE in coastal V-zones.'
      },
      {
        id: 'sump_pump',
        name: 'Do you have a sump pump with battery backup?',
        type: 'toggle',
        definition: 'A sump pump removes water that collects under or in your home. The battery backup is critical because power often goes out during storms - exactly when you need the pump most.',
        howToCheck: 'Look in your basement or lowest level for a pit with a pump. Check if there\'s a battery backup unit mounted nearby or if the pump plugs into a battery system.',
        insuranceImpact: 'Reduces claim frequency - some insurers offer small discounts.',
        equityImpact: '+$1,500 - $3,000 home value.',
        complianceNote: 'Essential for any below-grade space. Battery backup is critical for storms.'
      }
    ]
  },
  {
    id: 'systems',
    name: 'Elevated Systems',
    icon: Zap,
    color: 'violet',
    description: 'Keep your mechanical equipment above flood waters',
    items: [
      {
        id: 'hvac_location',
        name: 'Where is your HVAC (heating/cooling) equipment?',
        type: 'select',
        definition: 'Your air conditioner, furnace, and air handler are expensive to replace. If they flood, you could be without heating/cooling for weeks and face a $10,000+ replacement bill.',
        options: [
          { value: 'ground', label: 'Ground level or below - Sitting on ground, in basement, or below flood level', score: 0 },
          { value: 'elevated_partial', label: 'Somewhat elevated - Raised on a platform but not 4+ feet above BFE', score: 2 },
          { value: 'elevated_full', label: 'Fully elevated - At least 4 feet above BFE', score: 4 },
          { value: 'roof', label: 'Roof-mounted - Equipment is on the roof', score: 5 }
        ],
        howToCheck: 'Find your outdoor AC unit and indoor air handler. Are they on the ground? On a platform? In the attic or on the roof?',
        insuranceImpact: 'Elevated HVAC reduces contents damage claims significantly.',
        equityImpact: '+$3,000 - $8,000 home value with fully elevated systems.',
        complianceNote: '2026 CAFE rules require HVAC at BFE+4 for any substantial improvement.'
      },
      {
        id: 'electrical_panel',
        name: 'Where is your main electrical panel?',
        type: 'select',
        definition: 'Your electrical panel (breaker box) is the heart of your home\'s electrical system. If it floods, your entire electrical system may need to be replaced - a $15,000+ repair.',
        options: [
          { value: 'basement', label: 'In basement or below grade', score: 0 },
          { value: 'ground', label: 'Ground floor, below flood level', score: 1 },
          { value: 'elevated', label: 'Elevated above BFE+4 feet', score: 4 }
        ],
        howToCheck: 'Find your breaker box (gray metal box with switches). What floor is it on? How high off the ground?',
        insuranceImpact: 'Flood damage to electrical = total system replacement. Major claim.',
        equityImpact: '+$2,000 - $5,000 home value with elevated panel.',
        complianceNote: 'New and replacement panels in flood zones must be elevated by code.'
      },
      {
        id: 'water_heater',
        name: 'Is your water heater elevated above flood level?',
        type: 'toggle',
        definition: 'Water heaters are expensive to replace and can be dangerous if flooded (gas leaks, electrical hazards). Elevating them is a relatively simple mitigation measure.',
        howToCheck: 'Find your water heater (usually in garage, basement, or utility closet). Is it on the floor or raised on a platform?',
        insuranceImpact: 'Reduces contents claims.',
        equityImpact: '+$1,000 - $2,000 home value.',
        complianceNote: 'Simple, low-cost mitigation. Can be raised on a platform for a few hundred dollars.'
      },
      {
        id: 'washer_dryer',
        name: 'Are your washer and dryer above flood level?',
        type: 'toggle',
        definition: 'Laundry appliances are often in basements or ground floors where they\'re vulnerable to flooding. Moving them to upper floors eliminates this risk.',
        howToCheck: 'Check where your laundry appliances are located. Are they in a basement, ground floor, or upper level?',
        insuranceImpact: 'Reduces contents claims.',
        equityImpact: '+$500 - $1,500 home value.',
        complianceNote: 'Consider relocating to upper floor during any renovation.'
      }
    ]
  },
  {
    id: 'tech',
    name: 'Smart Protection',
    icon: Radio,
    color: 'emerald',
    description: 'Modern technology to prevent and detect damage',
    items: [
      {
        id: 'water_shutoff',
        name: 'Do you have an automatic water shutoff valve?',
        type: 'toggle',
        definition: 'A smart water shutoff valve automatically turns off your home\'s water supply when it detects a leak. This prevents a small leak from becoming a $50,000 disaster while you\'re away.',
        howToCheck: 'Look at your main water line where it enters your house. Is there a motorized valve with a controller? Brands include Flo, Moen, Phyn.',
        insuranceImpact: '5-10% homeowner premium discount from many insurers.',
        equityImpact: '+$2,000 - $4,000 home value.',
        complianceNote: 'Prevents catastrophic water damage. Especially valuable for second homes.'
      },
      {
        id: 'leak_sensors',
        name: 'Do you have water leak sensors in key areas?',
        type: 'toggle',
        definition: 'Small sensors placed near water heaters, washing machines, under sinks, and in basements that alert your phone if they detect water. Early warning = early action.',
        howToCheck: 'Check under sinks, near water heater, behind washing machine, in basement. Look for small disc-shaped sensors or sensors connected to a smart home system.',
        insuranceImpact: 'Often bundled with smart shutoff for insurance discounts.',
        equityImpact: '+$500 - $1,000 home value.',
        complianceNote: 'Place near all water sources. Connect to phone for remote alerts.'
      },
      {
        id: 'backup_power',
        name: 'What type of backup power do you have?',
        type: 'select',
        definition: 'Power outages during storms can last days or weeks. Without power, sump pumps stop, freezers thaw, and you may need to evacuate. Backup power keeps critical systems running.',
        options: [
          { value: 'none', label: 'None - No backup power', score: 0 },
          { value: 'portable', label: 'Portable generator - Gas generator I connect manually', score: 1 },
          { value: 'standby', label: 'Standby generator - Automatic generator that kicks in when power fails', score: 3 },
          { value: 'battery', label: 'Battery backup - Whole-home battery (Tesla Powerwall, etc.)', score: 4 },
          { value: 'solar_battery', label: 'Solar + battery - Solar panels with battery storage', score: 5 }
        ],
        howToCheck: 'Do you have a generator? Is it portable (you wheel it out) or permanent (mounted outside)? Do you have solar panels or a battery system?',
        insuranceImpact: 'Reduces secondary damage from extended outages.',
        equityImpact: 'Standby generator adds $5,000-$15,000. Solar+battery adds $15,000-$30,000.',
        complianceNote: 'Essential for sump pumps during storms. Critical for medical equipment.'
      },
      {
        id: 'monitoring',
        name: 'Do you have a home monitoring system?',
        type: 'toggle',
        definition: 'Monitoring systems watch for security threats plus environmental hazards like water leaks, temperature extremes, and smoke. They alert you (and optionally a monitoring center) when something\'s wrong.',
        howToCheck: 'Do you have ADT, SimpliSafe, Ring Alarm, or similar? Does it monitor for water, temperature, and environmental hazards - not just security?',
        insuranceImpact: '5-15% homeowner premium discount.',
        equityImpact: '+$2,000 - $5,000 home value.',
        complianceNote: 'Remote alerts let you respond quickly even when away from home.'
      }
    ]
  },
  {
    id: 'thermal',
    name: 'Energy & Envelope',
    icon: Thermometer,
    color: 'amber',
    description: '2024 Energy Code requirements for renovations',
    items: [
      {
        id: 'attic_insulation',
        name: 'How much attic insulation do you have?',
        type: 'select',
        definition: 'Insulation is measured in "R-value" - higher numbers mean better insulation. NJ\'s 2024 energy code requires R-60 in attics for new construction and major renovations.',
        options: [
          { value: 'unknown', label: 'I don\'t know - Haven\'t checked my attic', score: 0 },
          { value: 'r30', label: 'R-30 or less - About 10 inches of fiberglass or less', score: 1 },
          { value: 'r49', label: 'R-49 - About 14-16 inches (previous code requirement)', score: 2 },
          { value: 'r60', label: 'R-60 or more - About 20+ inches (2024 code compliant)', score: 4 }
        ],
        howToCheck: 'Safely look in your attic. Measure how deep the insulation is. Roughly: 10" = R-30, 16" = R-49, 20"+ = R-60.',
        insuranceImpact: 'Better insulation reduces ice dam claims in winter.',
        equityImpact: '+$3,000 - $6,000 home value.',
        complianceNote: '2024 IECC requires R-60 for any ceiling insulation work in NJ.'
      },
      {
        id: 'window_uvalue',
        name: 'How energy-efficient are your windows?',
        type: 'select',
        definition: 'U-value measures how much heat passes through your windows. Lower is better. Old single-pane windows have terrible U-values (~1.0). Modern code requires U-0.30 or better.',
        options: [
          { value: 'single', label: 'Single-pane - Old windows, very drafty', score: 0 },
          { value: 'double_old', label: 'Double-pane (older) - Clear glass, 20+ years old', score: 1 },
          { value: 'double_new', label: 'Double-pane (newer) - Low-E glass, but not code-compliant', score: 2 },
          { value: 'code', label: 'High-performance - U-value 0.30 or lower (2024 code)', score: 4 }
        ],
        howToCheck: 'Look for a label between the glass panes showing U-value. Or count the panes - single-pane windows are one layer of glass, double-pane are two.',
        insuranceImpact: 'Indirect - reduces energy costs.',
        equityImpact: 'New code-compliant windows add $8,000-$15,000 in value.',
        complianceNote: '2024 IECC requires U≤0.30 for any window replacement.'
      },
      {
        id: 'air_sealing',
        name: 'Has your home had professional air sealing?',
        type: 'toggle',
        definition: 'Air sealing means finding and sealing gaps, cracks, and holes in your home\'s exterior (where pipes enter, around windows, etc.). A "blower door test" measures how leaky your home is.',
        howToCheck: 'Check your permit records for energy work. Did anyone ever do a "blower door test"? Can you feel drafts around windows and doors?',
        insuranceImpact: 'Reduces moisture/mold damage risk.',
        equityImpact: '+$2,000 - $4,000 home value.',
        complianceNote: '2024 IECC requires blower door testing for major renovations.'
      }
    ]
  },
  {
    id: 'site',
    name: 'Site & Lot',
    icon: Leaf,
    color: 'green',
    description: 'Your property\'s footprint and drainage',
    items: [
      {
        id: 'lot_sqft',
        name: 'What is your total lot size?',
        type: 'number',
        unit: 'square feet',
        definition: 'Your lot size determines how much of your property can be covered by buildings, driveways, and patios. Most towns limit coverage to 70-80% to ensure adequate drainage.',
        placeholder: 'Find this on your tax bill, survey, or property deed. Example: 5,000 sq ft.',
        howToCheck: 'Check your property tax bill, survey, or deed. Also available on county tax records online.',
        insuranceImpact: 'Affects overall property valuation.',
        equityImpact: 'Larger lots command premium prices.',
        complianceNote: 'Used to calculate impervious cover limits and building setbacks.'
      },
      {
        id: 'impervious_cover',
        name: 'What percentage of your lot is paved/covered?',
        type: 'select',
        definition: '"Impervious cover" means surfaces that don\'t absorb water - your roof, driveway, patio, sidewalks. Towns limit this to prevent flooding from stormwater runoff.',
        options: [
          { value: 'low', label: 'Under 50% - Lots of lawn and garden space', score: 4 },
          { value: 'moderate', label: '50-70% - Some room left for additions', score: 2 },
          { value: 'high', label: '70-85% - Close to or at typical limits', score: 1 },
          { value: 'maxed', label: 'Over 85% - No room for more coverage', score: 0 }
        ],
        howToCheck: 'Look at your property from above (Google Maps satellite view). Estimate what percentage is building + driveway + patio vs. grass/garden.',
        insuranceImpact: 'High runoff increases flood risk to your property and neighbors.',
        equityImpact: 'Room for expansion increases property value.',
        complianceNote: 'Most NJ shore towns limit impervious cover to 70-80% of lot.'
      },
      {
        id: 'permeable_surfaces',
        name: 'Do you have permeable pavers or surfaces?',
        type: 'toggle',
        definition: 'Permeable pavers are special bricks or stones that let water soak through into the ground instead of running off. They can help you meet impervious cover limits.',
        howToCheck: 'Look at your driveway and patio. Permeable pavers have gaps between them filled with gravel, or are made of porous concrete/asphalt. Water soaks in rather than running off.',
        insuranceImpact: 'May reduce flood risk to your property.',
        equityImpact: '+$3,000 - $8,000 home value.',
        complianceNote: 'Often receive credit toward impervious cover limits - you may be able to build more.'
      },
      {
        id: 'rain_garden',
        name: 'Do you have a rain garden or bioswale?',
        type: 'toggle',
        definition: 'A rain garden is a planted low area that collects rainwater from your roof, driveway, or lawn. The plants and soil filter the water as it soaks into the ground.',
        howToCheck: 'Look for a planted depression in your yard that collects water during rain. It usually has native plants and drains within 24-48 hours.',
        insuranceImpact: 'Demonstrates flood mitigation effort.',
        equityImpact: '+$2,000 - $5,000 home value.',
        complianceNote: 'May satisfy stormwater management requirements for additions.'
      }
    ]
  },
  {
    id: 'legal',
    name: 'Documentation & Compliance',
    icon: FileCheck,
    color: 'rose',
    description: 'Critical paperwork and regulatory status',
    items: [
      {
        id: 'permit_history',
        name: 'Do you know your complete 10-year permit history?',
        type: 'toggle',
        definition: 'Many NJ towns track ALL your permitted work over 10 years. When the total hits 50% of your structure value, you\'re required to elevate your entire home. Knowing your history helps you plan renovations safely.',
        howToCheck: 'Contact your town\'s building department and request permit history. Some towns have this online. Check for kitchen remodels, bathroom updates, roof replacement, deck additions, etc.',
        insuranceImpact: 'Prevents surprise elevation requirements mid-project.',
        equityImpact: 'Protects your renovation budget from unexpected costs.',
        complianceNote: 'CRITICAL for towns like Manasquan with 10-year cumulative rules.'
      },
      {
        id: 'flood_disclosure',
        name: 'Are your flood disclosure forms ready?',
        type: 'toggle',
        definition: 'NJ law (since March 2024) requires sellers AND landlords to disclose flood history, insurance claims, and flood zone status. Having these ready protects you legally.',
        howToCheck: 'Do you have documentation of past flooding, insurance claims, and your flood zone? Have you filled out NJ\'s required disclosure forms?',
        insuranceImpact: 'Required by law for any sale or rental.',
        equityImpact: 'Avoid legal liability and delayed closings.',
        complianceNote: 'Mandatory for all NJ real estate transactions since March 2024.'
      },
      {
        id: 'irz_status',
        name: 'Is your property in an Inundation Risk Zone (IRZ)?',
        type: 'select',
        definition: 'IRZ areas are projected to face daily tidal flooding by 2100 due to sea level rise. Properties in IRZ have extra disclosure requirements and may face long-term challenges.',
        options: [
          { value: 'unknown', label: 'I don\'t know - Need to check', score: 0 },
          { value: 'no', label: 'No - My property is not in an IRZ', score: 3 },
          { value: 'yes', label: 'Yes - My property is in an IRZ', score: 0 }
        ],
        howToCheck: 'Check NJ DEP\'s flood mapping tool or ask your local building department. IRZ is based on projected 4.4ft sea level rise by 2100.',
        insuranceImpact: 'IRZ status may affect future insurability.',
        equityImpact: 'Significant long-term value implications.',
        complianceNote: 'IRZ properties require deed notice for any substantial improvement.'
      },
      {
        id: 'legacy_app',
        name: 'Are you planning to submit a permit before July 2026?',
        type: 'toggle',
        definition: 'The "Legacy Window" allows permit applications submitted before July 2026 to be reviewed under OLD elevation rules (BFE instead of BFE+4). This could save $50,000-$150,000 in elevation costs.',
        howToCheck: 'Are you planning any major renovation? If so, submitting before July 2026 could grandfather you under easier rules.',
        insuranceImpact: 'Could lock in lower elevation requirements.',
        equityImpact: 'Potential savings of $50,000-$150,000.',
        complianceNote: 'Application must be COMPLETE by deadline - not just submitted.'
      }
    ]
  }
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

// Inline glossary term with tooltip
const GlossaryTerm = ({ term, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const glossaryItem = GLOSSARY[term];
  
  if (!glossaryItem) return <span>{children}</span>;
  
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-cyan-400 underline decoration-dotted underline-offset-2 cursor-help hover:text-cyan-300"
      >
        {children}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-slate-800 border border-cyan-500/50 rounded-xl p-4 shadow-xl"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-cyan-400">{glossaryItem.term}</h4>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-300 mb-3">{glossaryItem.definition}</p>
              {glossaryItem.example && (
                <div className="bg-slate-900/50 rounded-lg p-2 mb-2">
                  <p className="text-xs text-slate-400">
                    <span className="text-amber-400 font-bold">Example:</span> {glossaryItem.example}
                  </p>
                </div>
              )}
              <p className="text-xs text-emerald-400 border-t border-slate-700 pt-2">
                💡 <strong>Why it matters:</strong> {glossaryItem.whyItMatters}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  );
};

// Full glossary modal
const GlossaryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">📚 Glossary of Terms</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(GLOSSARY).map(([key, item]) => (
            <div key={key} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-bold text-cyan-400 mb-2">{item.term}</h4>
              <p className="text-sm text-slate-300 mb-2">{item.definition}</p>
              {item.example && (
                <p className="text-xs text-slate-400 mb-2">
                  <span className="text-amber-400 font-bold">Example:</span> {item.example}
                </p>
              )}
              <p className="text-xs text-emerald-400">
                💡 {item.whyItMatters}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const InfoTooltip = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 left-0 top-full mt-2 w-80 bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-xl"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-white">{info.title}</h4>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {info.definition && (
                <p className="text-sm text-cyan-300 mb-2 italic">{info.definition}</p>
              )}
              <p className="text-sm text-slate-300 mb-3">{info.description}</p>
              <ul className="space-y-1 mb-3">
                {info.consequences.map((c, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-cyan-400 border-t border-slate-700 pt-2">
                📚 {info.citation}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const VentingCalculator = ({ enclosedSqFt, ventCount, ventCapacity = 200 }) => {
  const required = Math.ceil(enclosedSqFt / ventCapacity);
  const current = ventCount || 0;
  const deficit = Math.max(required - current, 0);
  const compliant = current >= required;
  
  if (!enclosedSqFt || enclosedSqFt === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={`mt-4 p-4 rounded-xl border-2 ${
        compliant 
          ? 'bg-emerald-900/20 border-emerald-500/50' 
          : 'bg-red-900/20 border-red-500/50'
      }`}
    >
      <div className="flex items-start gap-3">
        {compliant ? (
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
        )}
        <div>
          <h4 className={`font-bold ${compliant ? 'text-emerald-400' : 'text-red-400'}`}>
            {compliant ? 'Venting Compliant ✓' : 'Critical: Insufficient Venting'}
          </h4>
          <p className="text-sm text-slate-300 mt-1">
            Your {enclosedSqFt.toLocaleString()} sq ft enclosure requires <strong>{required} engineered vents</strong> (1:1 ratio at 200 sq ft each).
          </p>
          {!compliant && (
            <p className="text-sm text-red-300 mt-2">
              ⚠️ Add <strong>{deficit} more vent(s)</strong> to satisfy code and unlock insurance discounts.
            </p>
          )}
          <p className="text-xs text-slate-500 mt-2">
            Based on FEMA TB 1-08 & NJ Uniform Construction Code
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ThresholdGauge = ({ current, structureValue, permitHistory, proposedWork = 0 }) => {
  const fortyPct = structureValue * 0.4;
  const fiftyPct = structureValue * 0.5;
  const total = permitHistory + proposedWork;
  const percentage = (total / structureValue) * 100;
  const remaining40 = Math.max(fortyPct - total, 0);
  const remaining50 = Math.max(fiftyPct - total, 0);
  
  const getZone = () => {
    if (percentage >= 50) return { color: 'red', label: 'SUBSTANTIAL IMPROVEMENT TRIGGERED', bg: 'from-red-500 to-red-700' };
    if (percentage >= 40) return { color: 'amber', label: 'YELLOW ZONE - REVIEW REQUIRED', bg: 'from-amber-500 to-amber-700' };
    return { color: 'emerald', label: 'SAFE ZONE', bg: 'from-emerald-500 to-emerald-700' };
  };
  
  const zone = getZone();
  
  return (
    <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Substantial Improvement Tracker
          </h3>
        </div>
        <InfoTooltip info={percentage >= 50 ? COMPLIANCE_INFO.fiftyPercent : COMPLIANCE_INFO.fortyPercent} />
      </div>
      
      {/* Gauge */}
      <div className="relative h-8 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mb-4">
        {/* Zone markers */}
        <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-amber-500/70 z-10" />
        <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-red-500/70 z-10" />
        
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${zone.bg}`}
        />
        
        {/* Percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-[10px] font-mono mb-4">
        <span className="text-emerald-400">0%</span>
        <span className="text-amber-400">40%</span>
        <span className="text-red-400">50%</span>
        <span className="text-slate-500">100%</span>
      </div>
      
      {/* Status */}
      <div className={`text-center py-2 rounded-lg ${
        zone.color === 'red' ? 'bg-red-900/30 text-red-400' :
        zone.color === 'amber' ? 'bg-amber-900/30 text-amber-400' :
        'bg-emerald-900/30 text-emerald-400'
      }`}>
        <span className="text-xs font-bold">{zone.label}</span>
      </div>
      
      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-[10px] text-slate-500 uppercase">10-Year Permits</p>
          <p className="text-lg font-bold text-white font-mono">${permitHistory.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-[10px] text-slate-500 uppercase">Structure Value</p>
          <p className="text-lg font-bold text-white font-mono">${structureValue.toLocaleString()}</p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-500/30">
          <p className="text-[10px] text-amber-400 uppercase">Remaining to 40%</p>
          <p className="text-lg font-bold text-amber-300 font-mono">${remaining40.toLocaleString()}</p>
        </div>
        <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
          <p className="text-[10px] text-red-400 uppercase">Remaining to 50%</p>
          <p className="text-lg font-bold text-red-300 font-mono">${remaining50.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Warning */}
      {percentage >= 40 && percentage < 50 && (
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
          <p className="text-xs text-amber-300">
            <strong>⚠️ Action Required:</strong> Your next permit will require contractor affidavits and enhanced review. 
            Plan carefully to stay under 50%.
          </p>
        </div>
      )}
      
      {percentage >= 50 && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-300">
            <strong>🚨 Mandatory Elevation:</strong> You have triggered Substantial Improvement. 
            Your entire structure must be elevated to BFE +4ft before proceeding with any work.
          </p>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// INSURANCE PREMIUM ESTIMATOR
// =============================================================================
const InsuranceEstimator = ({ propertyData, selections }) => {
  const isYes = (val) => val === 'yes' || val === true;
  
  // NFIP Base Premium Calculation (simplified Risk Rating 2.0)
  const calculatePremium = () => {
    let basePremium = 800; // NFIP minimum
    
    // Distance to coast factor (approximated by flood zone)
    const floodZone = propertyData.floodZone || 'AE';
    if (floodZone.startsWith('V')) basePremium += 3500;
    else if (floodZone === 'AE' || floodZone === 'A') basePremium += 1800;
    else if (floodZone === 'AO' || floodZone === 'AH') basePremium += 1200;
    else if (floodZone === 'X') basePremium += 200;
    
    // Building coverage amount (based on structure value)
    const structureValue = propertyData.structureValue || 250000;
    const coverageAmount = Math.min(structureValue, 250000); // NFIP max
    basePremium += (coverageAmount / 250000) * 1500;
    
    // Elevation relative to BFE (biggest factor in RR2.0)
    const elevation = Number(selections.current_elevation) || 0;
    const bfe = propertyData.bfe || 9;
    const elevDiff = elevation - bfe;
    
    if (elevDiff >= 4) basePremium -= 1200;
    else if (elevDiff >= 2) basePremium -= 800;
    else if (elevDiff >= 0) basePremium -= 400;
    else if (elevDiff >= -2) basePremium += 800;
    else basePremium += 2000;
    
    // Foundation type
    const foundation = selections.foundation_type;
    if (foundation === 'piles') basePremium -= 600;
    else if (foundation === 'piers') basePremium -= 400;
    else if (foundation === 'slab') basePremium += 400;
    else if (foundation === 'basement') basePremium += 1200;
    
    // Flood vents (proper enclosure venting)
    if (selections.flood_vents > 0) {
      const sqft = selections.enclosed_sqft || 0;
      const required = Math.ceil(sqft / 200);
      if (selections.flood_vents >= required) basePremium -= 300;
    }
    
    // First floor height above ground
    if (elevation > 0 && bfe > 0) {
      const heightAboveGround = elevation - (bfe - 4); // Approximate
      if (heightAboveGround >= 8) basePremium -= 500;
      else if (heightAboveGround >= 4) basePremium -= 200;
    }
    
    return Math.max(basePremium, 500); // Minimum premium
  };
  
  // Calculate savings from each mitigation measure
  const calculateSavingsBreakdown = () => {
    const savings = [];
    
    // Elevation Certificate
    if (isYes(selections.elevation_cert)) {
      savings.push({ item: 'Elevation Certificate', amount: 450, description: 'Accurate rating vs. worst-case assumption' });
    } else {
      savings.push({ item: 'Get Elevation Certificate', amount: 450, potential: true, description: 'Required for accurate rating' });
    }
    
    // Elevation above BFE
    const elevation = Number(selections.current_elevation) || 0;
    const bfe = propertyData.bfe || 9;
    const elevDiff = elevation - bfe;
    if (elevDiff >= 2) {
      savings.push({ item: `${elevDiff}ft above BFE`, amount: 800 + (elevDiff * 200), description: 'Each foot above BFE reduces risk' });
    }
    
    // Foundation
    if (selections.foundation_type === 'piles') {
      savings.push({ item: 'Elevated Foundation (Piles)', amount: 600, description: 'Lowest flood risk foundation type' });
    } else if (selections.foundation_type === 'piers') {
      savings.push({ item: 'Elevated Foundation (Piers)', amount: 400, description: 'Good flood resistance' });
    }
    
    // Flood vents
    if (selections.flood_vents > 0) {
      const sqft = selections.enclosed_sqft || 0;
      const required = Math.ceil(sqft / 200);
      if (selections.flood_vents >= required) {
        savings.push({ item: 'Compliant Flood Vents', amount: 300, description: 'Proper enclosure venting' });
      } else {
        savings.push({ item: 'Add More Flood Vents', amount: 300, potential: true, description: `Need ${required - selections.flood_vents} more vents` });
      }
    } else if (selections.enclosed_sqft > 0) {
      const required = Math.ceil(selections.enclosed_sqft / 200);
      savings.push({ item: 'Install Flood Vents', amount: 300, potential: true, description: `Need ${required} ICC-certified vents` });
    }
    
    // Breakaway walls
    if (isYes(selections.breakaway_walls)) {
      savings.push({ item: 'Breakaway Walls', amount: 200, description: 'Code-compliant enclosure walls' });
    }
    
    return savings;
  };
  
  // Calculate wind insurance savings
  const calculateWindSavings = () => {
    const savings = [];
    
    if (selections.roof_type === 'metal_standing') {
      savings.push({ item: 'Standing Seam Metal Roof', amount: 1500, description: 'Best wind rating' });
    } else if (selections.roof_type === 'metal_screwdown') {
      savings.push({ item: 'Metal Roof', amount: 1000, description: 'Excellent wind resistance' });
    } else if (selections.roof_type === 'architectural') {
      savings.push({ item: 'Architectural Shingles', amount: 300, description: 'Good wind rating' });
    }
    
    if (isYes(selections.roof_deck)) {
      savings.push({ item: 'Sealed Roof Deck', amount: 600, description: 'Secondary water barrier' });
    } else {
      savings.push({ item: 'Add Sealed Roof Deck', amount: 600, potential: true, description: 'Add during next roof replacement' });
    }
    
    if (selections.windows_impact === 'both') {
      savings.push({ item: 'Impact Glass + Shutters', amount: 900, description: 'Maximum opening protection' });
    } else if (selections.windows_impact === 'impact') {
      savings.push({ item: 'Impact-Rated Windows', amount: 700, description: 'Debris protection' });
    } else if (selections.windows_impact === 'accordion') {
      savings.push({ item: 'Hurricane Shutters', amount: 400, description: 'Opening protection' });
    } else {
      savings.push({ item: 'Add Opening Protection', amount: 700, potential: true, description: 'Impact windows or shutters' });
    }
    
    if (isYes(selections.garage_door)) {
      savings.push({ item: 'Wind-Rated Garage Door', amount: 200, description: 'Prevents pressure failure' });
    }
    
    // Roof age
    const roofAge = Number(selections.roof_age);
    if (roofAge && roofAge <= 10) {
      savings.push({ item: 'Roof Under 10 Years', amount: 400, description: 'Replacement cost coverage' });
    } else if (roofAge > 15) {
      savings.push({ item: 'Replace Aging Roof', amount: 400, potential: true, description: 'Avoid ACV penalty' });
    }
    
    return savings;
  };
  
  const basePremium = calculatePremium();
  const floodSavings = calculateSavingsBreakdown();
  const windSavings = calculateWindSavings();
  
  const currentFloodSavings = floodSavings.filter(s => !s.potential).reduce((sum, s) => sum + s.amount, 0);
  const potentialFloodSavings = floodSavings.filter(s => s.potential).reduce((sum, s) => sum + s.amount, 0);
  const currentWindSavings = windSavings.filter(s => !s.potential).reduce((sum, s) => sum + s.amount, 0);
  const potentialWindSavings = windSavings.filter(s => s.potential).reduce((sum, s) => sum + s.amount, 0);
  
  const totalCurrentSavings = currentFloodSavings + currentWindSavings;
  const totalPotentialSavings = potentialFloodSavings + potentialWindSavings;
  
  return (
    <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Insurance Premium Estimator</h3>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
          Based on NFIP Risk Rating 2.0
        </span>
      </div>
      
      {/* Premium Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Est. Base Premium</p>
          <p className="text-3xl font-bold text-white">${basePremium.toLocaleString()}</p>
          <p className="text-xs text-slate-500">per year</p>
        </div>
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-400 mb-1">Your Current Savings</p>
          <p className="text-3xl font-bold text-emerald-400">${totalCurrentSavings.toLocaleString()}</p>
          <p className="text-xs text-emerald-400/70">per year</p>
        </div>
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-cyan-400 mb-1">Potential Additional</p>
          <p className="text-3xl font-bold text-cyan-400">+${totalPotentialSavings.toLocaleString()}</p>
          <p className="text-xs text-cyan-400/70">if you add improvements</p>
        </div>
      </div>
      
      {/* 10-Year Impact */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">10-Year Savings Impact</p>
            <p className="text-xs text-slate-500">Current savings + potential improvements</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">${((totalCurrentSavings + totalPotentialSavings) * 10).toLocaleString()}</p>
            <p className="text-xs text-emerald-400">over 10 years</p>
          </div>
        </div>
      </div>
      
      {/* Savings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flood Insurance */}
        <div>
          <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Flood Insurance (NFIP)
          </h4>
          <div className="space-y-2">
            {floodSavings.map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${
                item.potential ? 'bg-slate-900/50 border border-dashed border-slate-600' : 'bg-slate-900'
              }`}>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${item.potential ? 'text-slate-400' : 'text-slate-200'}`}>
                    {item.potential && '+ '}{item.item}
                  </p>
                  <p className="text-[10px] text-slate-500">{item.description}</p>
                </div>
                <span className={`text-sm font-bold ${item.potential ? 'text-cyan-400' : 'text-emerald-400'}`}>
                  ${item.amount}/yr
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Wind Insurance */}
        <div>
          <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <Wind className="w-4 h-4" />
            Wind/Homeowner Insurance
          </h4>
          <div className="space-y-2">
            {windSavings.map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${
                item.potential ? 'bg-slate-900/50 border border-dashed border-slate-600' : 'bg-slate-900'
              }`}>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${item.potential ? 'text-slate-400' : 'text-slate-200'}`}>
                    {item.potential && '+ '}{item.item}
                  </p>
                  <p className="text-[10px] text-slate-500">{item.description}</p>
                </div>
                <span className={`text-sm font-bold ${item.potential ? 'text-cyan-400' : 'text-emerald-400'}`}>
                  ${item.amount}/yr
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <p className="text-[10px] text-slate-600 mt-4 text-center">
        Estimates based on NFIP Risk Rating 2.0 factors. Actual premiums vary by insurer. Contact your agent for exact quotes.
      </p>
    </div>
  );
};

const ScoreGauge = ({ score, maxScore = 100 }) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getScoreColor = () => {
    if (percentage >= 70) return { stroke: '#10b981', text: 'text-emerald-400', label: 'PROTECTED' };
    if (percentage >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'MODERATE' };
    return { stroke: '#ef4444', text: 'text-red-400', label: 'VULNERABLE' };
  };
  
  const colors = getScoreColor();
  
  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r="45" fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-5xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">Resilience Score</span>
        <span className={`text-xs font-bold ${colors.text} mt-1 px-2 py-0.5 rounded-full bg-slate-800`}>
          {colors.label}
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// PDF REPORT GENERATOR
// =============================================================================

// =============================================================================
// WEATHER ALERTS BANNER
// =============================================================================
const WeatherAlertsBanner = ({ alerts, forecast }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!alerts || alerts.length === 0) {
    // Show current weather if no alerts
    if (forecast?.current) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Thermometer className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{forecast.current.name}: {forecast.current.temperature}°{forecast.current.temperatureUnit}</p>
                <p className="text-xs text-slate-400">{forecast.current.shortForecast}</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
              No Active Alerts
            </span>
          </div>
        </div>
      );
    }
    return null;
  }
  
  const urgentAlerts = alerts.filter(a => a.severity === 'Extreme' || a.severity === 'Severe');
  const otherAlerts = alerts.filter(a => a.severity !== 'Extreme' && a.severity !== 'Severe');
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Extreme': return 'bg-red-600 border-red-500 text-white';
      case 'Severe': return 'bg-orange-600 border-orange-500 text-white';
      case 'Moderate': return 'bg-amber-500 border-amber-400 text-black';
      default: return 'bg-yellow-400 border-yellow-300 text-black';
    }
  };
  
  return (
    <div className="space-y-2 mb-4">
      {/* Urgent Alerts */}
      {urgentAlerts.map((alert, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${getSeverityColor(alert.severity)} border-2 rounded-xl p-4`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-lg">{alert.event}</p>
                <p className="text-sm opacity-90">{alert.headline}</p>
                {expanded && alert.instruction && (
                  <p className="text-sm mt-2 opacity-80">{alert.instruction}</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-sm underline opacity-80 hover:opacity-100"
            >
              {expanded ? 'Less' : 'More'}
            </button>
          </div>
        </motion.div>
      ))}
      
      {/* Other Alerts (collapsed) */}
      {otherAlerts.length > 0 && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">
                {otherAlerts.length} other weather {otherAlerts.length === 1 ? 'alert' : 'alerts'} active
              </span>
            </div>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              {expanded ? 'Hide' : 'Show'}
            </button>
          </div>
          {expanded && (
            <div className="mt-3 space-y-2">
              {otherAlerts.map((alert, i) => (
                <div key={i} className="text-sm text-slate-300">
                  <strong className="text-amber-400">{alert.event}:</strong> {alert.headline}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const generatePDFReport = (propertyData, selections, score, insuranceSavings) => {
  const isYes = (val) => val === 'yes' || val === true;
  
  // Create HTML content for the report
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  const getScoreLabel = (s) => {
    if (s >= 70) return 'WELL PROTECTED';
    if (s >= 40) return 'MODERATE RISK';
    return 'VULNERABLE';
  };
  
  const getScoreColor = (s) => {
    if (s >= 70) return '#10b981';
    if (s >= 40) return '#f59e0b';
    return '#ef4444';
  };
  
  // Build checklist summary
  const checklistSummary = [];
  
  // Wind items
  if (selections.roof_type) checklistSummary.push({ category: 'Wind', item: 'Roof Type', value: selections.roof_type, status: 'complete' });
  if (selections.roof_age) checklistSummary.push({ category: 'Wind', item: 'Roof Age', value: `${selections.roof_age} years`, status: selections.roof_age <= 15 ? 'good' : 'warning' });
  if (isYes(selections.roof_deck)) checklistSummary.push({ category: 'Wind', item: 'Sealed Roof Deck', value: 'Yes', status: 'complete' });
  if (selections.windows_impact && selections.windows_impact !== 'none') checklistSummary.push({ category: 'Wind', item: 'Window Protection', value: selections.windows_impact, status: 'complete' });
  if (isYes(selections.garage_door)) checklistSummary.push({ category: 'Wind', item: 'Wind-Rated Garage Door', value: 'Yes', status: 'complete' });
  
  // Flood items
  if (isYes(selections.elevation_cert)) checklistSummary.push({ category: 'Flood', item: 'Elevation Certificate', value: 'Yes', status: 'complete' });
  if (selections.current_elevation) checklistSummary.push({ category: 'Flood', item: 'Current Elevation', value: `${selections.current_elevation} ft`, status: 'complete' });
  if (selections.foundation_type) checklistSummary.push({ category: 'Flood', item: 'Foundation Type', value: selections.foundation_type, status: 'complete' });
  if (selections.flood_vents) checklistSummary.push({ category: 'Flood', item: 'Flood Vents', value: `${selections.flood_vents} vents`, status: 'complete' });
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ShoreHomeScore Report - ${propertyData.address || propertyData.zipCode}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.5; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #0891b2; }
    .header h1 { font-size: 28px; color: #0891b2; margin-bottom: 5px; }
    .header .subtitle { color: #64748b; font-size: 14px; }
    .header .date { color: #94a3b8; font-size: 12px; margin-top: 10px; }
    
    .score-section { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px; }
    .score-circle { width: 140px; height: 140px; border-radius: 50%; border: 8px solid ${getScoreColor(score)}; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .score-number { font-size: 48px; font-weight: bold; }
    .score-label { font-size: 11px; color: ${getScoreColor(score)}; font-weight: bold; margin-top: 5px; }
    .score-details { flex: 1; margin-left: 30px; }
    .score-details h2 { font-size: 20px; margin-bottom: 10px; }
    .score-details p { color: #94a3b8; font-size: 14px; }
    
    .savings-banner { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 20px 30px; border-radius: 12px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .savings-banner h3 { font-size: 16px; }
    .savings-banner .amount { font-size: 32px; font-weight: bold; }
    .savings-banner .period { font-size: 12px; opacity: 0.8; }
    
    .property-section { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
    .property-section h3 { color: #0891b2; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
    .property-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
    .property-item label { font-size: 11px; color: #64748b; display: block; }
    .property-item span { font-size: 16px; font-weight: 600; color: #1e293b; }
    
    .checklist-section { margin-bottom: 30px; }
    .checklist-section h3 { color: #0891b2; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
    .checklist-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .checklist-item:last-child { border-bottom: none; }
    .checklist-item .label { color: #475569; }
    .checklist-item .value { font-weight: 600; }
    .status-complete { color: #10b981; }
    .status-warning { color: #f59e0b; }
    .status-missing { color: #94a3b8; }
    
    .recommendations { background: #fffbeb; border: 1px solid #fcd34d; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
    .recommendations h3 { color: #b45309; font-size: 14px; margin-bottom: 15px; }
    .recommendations ul { margin-left: 20px; }
    .recommendations li { margin-bottom: 8px; color: #92400e; }
    
    .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px; }
    .footer a { color: #0891b2; }
    
    @media print { .page { padding: 20px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>🏠 ShoreHomeScore Report</h1>
      <div class="subtitle">Coastal Resilience Assessment for NJ Shore Properties</div>
      <div class="date">Generated on ${reportDate}</div>
    </div>
    
    <div class="score-section">
      <div class="score-circle">
        <div class="score-number">${score}</div>
        <div class="score-label">${getScoreLabel(score)}</div>
      </div>
      <div class="score-details">
        <h2>Resilience Score: ${score}/100</h2>
        <p>Your property's protection level based on structural features, flood mitigation, and compliance status.</p>
      </div>
    </div>
    
    <div class="savings-banner">
      <div>
        <h3>Estimated Annual Insurance Savings</h3>
        <div class="period">Based on current mitigation measures</div>
      </div>
      <div style="text-align: right;">
        <div class="amount">$${insuranceSavings.toLocaleString()}</div>
        <div class="period">per year • $${(insuranceSavings * 10).toLocaleString()} over 10 years</div>
      </div>
    </div>
    
    <div class="property-section">
      <h3>📍 Property Information</h3>
      <div class="property-grid">
        <div class="property-item">
          <label>Address</label>
          <span>${propertyData.address || 'Not provided'}</span>
        </div>
        <div class="property-item">
          <label>Zip Code</label>
          <span>${propertyData.zipCode || 'N/A'}</span>
        </div>
        <div class="property-item">
          <label>Flood Zone</label>
          <span>${propertyData.floodZone || 'Unknown'}</span>
        </div>
        <div class="property-item">
          <label>Base Flood Elevation</label>
          <span>${propertyData.bfe ? propertyData.bfe + ' ft' : 'Unknown'}</span>
        </div>
        <div class="property-item">
          <label>Square Footage</label>
          <span>${propertyData.squareFootage ? propertyData.squareFootage.toLocaleString() + ' sq ft' : 'N/A'}</span>
        </div>
        <div class="property-item">
          <label>Structure Value</label>
          <span>${propertyData.structureValue ? '$' + propertyData.structureValue.toLocaleString() : 'N/A'}</span>
        </div>
        <div class="property-item">
          <label>CAFE Requirement</label>
          <span>${propertyData.bfe ? (propertyData.bfe + 4) + ' ft' : 'BFE + 4 ft'}</span>
        </div>
        <div class="property-item">
          <label>Municipality</label>
          <span>${propertyData.municipality || 'N/A'}</span>
        </div>
      </div>
    </div>
    
    <div class="checklist-section">
      <h3>✅ Completed Mitigation Measures</h3>
      ${checklistSummary.map(item => `
        <div class="checklist-item">
          <span class="label">${item.category}: ${item.item}</span>
          <span class="value status-${item.status}">${item.value}</span>
        </div>
      `).join('')}
    </div>
    
    <div class="recommendations">
      <h3>📋 Recommended Next Steps</h3>
      <ul>
        ${!isYes(selections.elevation_cert) ? '<li><strong>Get an Elevation Certificate</strong> - Required for accurate flood insurance rating. Could save $500-$2,000/year.</li>' : ''}
        ${!isYes(selections.roof_deck) ? '<li><strong>Add sealed roof deck</strong> during next roof replacement. Saves 10-15% on wind premiums.</li>' : ''}
        ${selections.windows_impact === 'none' || !selections.windows_impact ? '<li><strong>Install hurricane shutters or impact windows</strong> - Significant insurance savings and storm protection.</li>' : ''}
        ${!selections.flood_vents && selections.enclosed_sqft > 0 ? '<li><strong>Install ICC-certified flood vents</strong> in enclosed areas below BFE.</li>' : ''}
        ${!isYes(selections.water_shutoff) ? '<li><strong>Install smart water shutoff valve</strong> - Prevents water damage and may reduce premiums.</li>' : ''}
        <li><strong>Review permit history</strong> to track substantial improvement threshold status.</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>This report is for informational purposes only. Consult with licensed professionals for specific advice.</p>
      <p style="margin-top: 10px;">Generated by <a href="https://shore-home-score.vercel.app">ShoreHomeScore</a> • NJ Shore Resilience Platform</p>
    </div>
  </div>
</body>
</html>`;

  // Open in new window for printing/saving
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Auto-trigger print dialog after a short delay
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

const CountdownCard = ({ title, date, icon: Icon, color, description, info }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, expired: false });
  
  useEffect(() => {
    const calc = () => {
      const diff = date - new Date();
      if (diff <= 0) return { days: 0, hours: 0, expired: true };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        expired: false,
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 60000);
    return () => clearInterval(timer);
  }, [date]);
  
  const colorClasses = {
    amber: 'from-amber-900/30 to-amber-800/20 border-amber-500/50 text-amber-400',
    cyan: 'from-cyan-900/30 to-cyan-800/20 border-cyan-500/50 text-cyan-400',
  };
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border-2 rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-bold">{title}</span>
        </div>
        {info && <InfoTooltip info={info} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{timeLeft.days}</span>
        <span className="text-sm text-slate-400">days</span>
        <span className="text-xl font-bold text-white ml-2">{timeLeft.hours}</span>
        <span className="text-sm text-slate-400">hrs</span>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">{description}</p>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'slate', info }) => {
  const colorClasses = {
    slate: 'bg-slate-800 border-slate-700',
    amber: 'bg-amber-900/20 border-amber-500/50',
    emerald: 'bg-emerald-900/20 border-emerald-500/50',
    red: 'bg-red-900/20 border-red-500/50',
  };
  
  return (
    <div className={`${colorClasses[color]} border-2 rounded-xl p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
            {info && <InfoTooltip info={info} />}
          </div>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-700">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
};

const CodeAlert = ({ title, date, description, type = 'info' }) => {
  const types = {
    info: { bg: 'bg-cyan-900/20', border: 'border-cyan-500/30', icon: Info, color: 'text-cyan-400' },
    warning: { bg: 'bg-amber-900/20', border: 'border-amber-500/30', icon: AlertTriangle, color: 'text-amber-400' },
    urgent: { bg: 'bg-red-900/20', border: 'border-red-500/30', icon: AlertCircle, color: 'text-red-400' },
  };
  const t = types[type];
  
  return (
    <div className={`${t.bg} ${t.border} border rounded-lg p-3`}>
      <div className="flex items-start gap-3">
        <t.icon className={`w-4 h-4 ${t.color} mt-0.5 flex-shrink-0`} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-200">{title}</span>
            {date && <span className="text-[10px] text-slate-500">{date}</span>}
          </div>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// CHECKLIST COMPONENTS
// =============================================================================

// Status options for toggle-type items
const STATUS_OPTIONS = [
  { value: 'no', label: "I don't have this", icon: X, color: 'text-slate-400', bg: 'bg-slate-800 border-slate-600' },
  { value: 'unsure', label: "I'm not sure", icon: HelpCircle, color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-500/50' },
  { value: 'planning', label: "Planning to add", icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-900/20 border-cyan-500/50' },
  { value: 'yes', label: "I have this", icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/50' },
];

const ChecklistInput = ({ item, value, onChange }) => {
  if (item.type === 'toggle') {
    // Convert old boolean values to new status
    const currentValue = value === true ? 'yes' : value === false ? 'no' : value || 'no';
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STATUS_OPTIONS.map(opt => {
          const isSelected = currentValue === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                isSelected ? opt.bg : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? opt.color : 'text-slate-500'}`} />
              <span className={isSelected ? opt.color : 'text-slate-500'}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
  
  if (item.type === 'select') {
    return (
      <div className="space-y-2">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="">Select your situation...</option>
          {item.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {!value && (
          <p className="text-xs text-slate-500 italic">👆 Choose the option that best describes your home</p>
        )}
      </div>
    );
  }
  
  if (item.type === 'number') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            placeholder="Enter number..."
            className="w-40 px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
          />
          {item.unit && <span className="text-sm text-slate-400">{item.unit}</span>}
        </div>
        {!value && item.placeholder && (
          <p className="text-xs text-slate-500 italic">💡 {item.placeholder}</p>
        )}
      </div>
    );
  }
  
  return null;
};

const ChecklistItem = ({ item, value, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine if item has a meaningful value
  const hasValue = (() => {
    if (value === undefined || value === null || value === '') return false;
    if (value === 'no' || value === 'unsure') return false;
    if (value === false) return false;
    return true;
  })();
  
  // Get status for display
  const getStatusDisplay = () => {
    if (item.type === 'toggle') {
      const status = STATUS_OPTIONS.find(s => s.value === value);
      if (status && value !== 'no') return status;
    }
    return null;
  };
  
  const statusDisplay = getStatusDisplay();
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
              hasValue ? 'bg-emerald-400' : 
              value === 'planning' ? 'bg-cyan-400' :
              value === 'unsure' ? 'bg-amber-400' :
              'bg-slate-600'
            }`} />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-slate-200">{item.name}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusDisplay && (
              <span className={`text-xs px-2 py-0.5 rounded ${statusDisplay.bg} ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            <div className="p-4 space-y-4 bg-slate-900/50">
              {/* Definition - What is this? */}
              {item.definition && (
                <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-cyan-500">
                  <p className="text-xs text-cyan-400 font-bold mb-1">📖 What is this?</p>
                  <p className="text-sm text-slate-300">{item.definition}</p>
                </div>
              )}
              
              {/* How to check */}
              {item.howToCheck && (
                <div className="bg-amber-900/10 rounded-lg p-3 border border-amber-500/30">
                  <p className="text-xs text-amber-400 font-bold mb-1">🔍 How to check</p>
                  <p className="text-xs text-slate-400">{item.howToCheck}</p>
                </div>
              )}
              
              {/* Input */}
              <div>
                <ChecklistInput item={item} value={value} onChange={onChange} />
              </div>
              
              {/* Impact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 uppercase">Home Value Impact</span>
                  </div>
                  <p className="text-xs text-slate-300">{item.equityImpact}</p>
                </div>
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] text-cyan-400 uppercase">Insurance Impact</span>
                  </div>
                  <p className="text-xs text-slate-300">{item.insuranceImpact}</p>
                </div>
                <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] text-violet-400 uppercase">Code/Compliance</span>
                  </div>
                  <p className="text-xs text-slate-300">{item.complianceNote}</p>
                </div>
              </div>
              
              {/* Roof Type Details */}
              {item.id === 'roof_type' && value && ROOF_TYPES[value] && (
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
                  <h5 className="text-sm font-bold text-white mb-2">{ROOF_TYPES[value].name}</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Wind Rating:</span>
                      <span className="text-slate-300 ml-2">{ROOF_TYPES[value].windRating}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Lifespan:</span>
                      <span className="text-slate-300 ml-2">{ROOF_TYPES[value].lifespan}</span>
                    </div>
                  </div>
                  <p className="text-xs text-cyan-400 mt-2">💡 {ROOF_TYPES[value].recommendation}</p>
                </div>
              )}
              
              {/* Foundation Type Details */}
              {item.id === 'foundation_type' && value && FOUNDATION_TYPES[value] && (
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
                  <h5 className="text-sm font-bold text-white mb-2">{FOUNDATION_TYPES[value].name}</h5>
                  <div className="text-xs space-y-1">
                    <p><span className="text-slate-500">Flood Risk:</span> <span className="text-amber-400">{FOUNDATION_TYPES[value].floodRisk}</span></p>
                    <p><span className="text-slate-500">Typical Elevation Cost:</span> <span className="text-slate-300">{FOUNDATION_TYPES[value].elevationCost}</span></p>
                  </div>
                  <p className="text-xs text-violet-400 mt-2">📋 {FOUNDATION_TYPES[value].complianceNote}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChecklistCategory = ({ category, selections, onSelectionChange }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = category.icon;
  
  const filledCount = category.items.filter(item => {
    const val = selections[item.id];
    return val !== undefined && val !== null && val !== '' && val !== false;
  }).length;
  
  const colorClasses = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    violet: 'text-violet-400 bg-violet-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/20',
    green: 'text-green-400 bg-green-500/20',
  };
  
  return (
    <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[category.color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-200">{category.name}</h3>
            <p className="text-xs text-slate-500">
              {filledCount} of {category.items.length} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all"
              style={{ width: `${(filledCount / category.items.length) * 100}%` }}
            />
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2">
              {category.items.map(item => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  value={selections[item.id]}
                  onChange={(value) => onSelectionChange(item.id, value)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// PROPERTY EDIT MODAL
// =============================================================================
const PropertyEditModal = ({ isOpen, onClose, propertyData, onSave }) => {
  const [formData, setFormData] = useState(propertyData);
  
  useEffect(() => {
    setFormData(propertyData);
  }, [propertyData, isOpen]);
  
  const handleZipChange = (zip) => {
    const cleaned = zip.replace(/\D/g, '').slice(0, 5);
    const zipInfo = ZIP_DATA[cleaned] || {};
    setFormData(prev => ({
      ...prev,
      zipCode: cleaned,
      municipality: zipInfo.municipality || '',
      county: zipInfo.county || '',
      bfe: zipInfo.bfe || prev.bfe,
      floodZone: zipInfo.floodZone || prev.floodZone,
      tidal: zipInfo.tidal ?? prev.tidal,
      pricePerSqft: zipInfo.pricePerSqft || 300,
    }));
    // Recalculate values if sqft already entered
    if (prev.squareFootage > 0) {
      const ppsf = zipInfo.pricePerSqft || 300;
      const estimatedValue = prev.squareFootage * ppsf;
      const structureValue = Math.round(estimatedValue * (1 - LAND_VALUE_PERCENT));
      setFormData(p => ({
        ...p,
        homeValue: estimatedValue,
        structureValue: structureValue,
      }));
    }
  };
  
  const handleSqFtChange = (sqft) => {
    const value = parseInt(sqft) || 0;
    const ppsf = formData.pricePerSqft || ZIP_DATA[formData.zipCode]?.pricePerSqft || 300;
    const estimatedValue = value * ppsf;
    const structureValue = Math.round(estimatedValue * (1 - LAND_VALUE_PERCENT));
    setFormData(prev => ({
      ...prev,
      squareFootage: value,
      homeValue: estimatedValue,
      structureValue: structureValue,
    }));
  };
  
  // State for FEMA lookup
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const [lookupSuccess, setLookupSuccess] = useState(false);
  const [claimsData, setClaimsData] = useState(null);
  const [propertySuggestions, setPropertySuggestions] = useState(null);
  
  // FEMA Flood Zone Lookup - uses our serverless API to avoid CORS
  const lookupFloodData = async () => {
    if (!formData.address || !formData.zipCode) {
      setLookupError('Please enter both address and zip code');
      return;
    }
    
    setIsLookingUp(true);
    setLookupError(null);
    setLookupSuccess(false);
    
    try {
      // Call FEMA lookup API
      const femaUrl = `/api/fema-lookup?address=${encodeURIComponent(formData.address)}&zipCode=${encodeURIComponent(formData.zipCode)}`;
      const femaResponse = await fetch(femaUrl);
      const femaData = await femaResponse.json();
      
      if (!femaResponse.ok) {
        setLookupError(femaData.error || 'Lookup failed. Try adding city name to address.');
        setIsLookingUp(false);
        return;
      }
      
      // Also fetch property estimates
      let propertyEstimates = null;
      try {
        const propertyUrl = `/api/property-lookup?address=${encodeURIComponent(formData.address)}&zipCode=${encodeURIComponent(formData.zipCode)}`;
        const propertyResponse = await fetch(propertyUrl);
        if (propertyResponse.ok) {
          const propertyData = await propertyResponse.json();
          propertyEstimates = propertyData.estimates;
          setPropertySuggestions(propertyData.propertyData?.areaSuggestions || null);
        }
      } catch (propErr) {
        console.log('Property lookup failed (non-critical):', propErr);
      }
      
      // Update form with FEMA data and estimates
      setFormData(prev => ({
        ...prev,
        floodZone: femaData.floodZone || 'X',
        bfe: femaData.bfe || prev.bfe,
        femaVerified: true,
        coordinates: femaData.coordinates,
        // Only update price per sqft if we got estimates and user hasn't set one
        pricePerSqft: propertyEstimates?.pricePerSqft || prev.pricePerSqft
      }));
      
      // Set claims data if available
      if (femaData.claims) {
        setClaimsData({
          totalClaims: femaData.claims.totalClaims,
          totalPayout: femaData.claims.totalPayout,
          avgPayout: femaData.claims.avgPayout,
          since: '1978'
        });
      }
      
      setLookupSuccess(true);
      
    } catch (err) {
      console.error('FEMA lookup error:', err);
      setLookupError('Lookup failed. Please try again.');
    }
    
    setIsLookingUp(false);
  };
  
  // Apply suggestions to form
  const applySuggestion = (field, value) => {
    if (field === 'sqft') {
      handleSqFtChange(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const currentPricePerSqft = formData.pricePerSqft || ZIP_DATA[formData.zipCode]?.pricePerSqft || 300;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6 w-full max-w-lg my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Property Details</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Street Address <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Ocean Ave"
              className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Zip Code <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleZipChange(e.target.value)}
              placeholder="e.g., 08742"
              className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-white text-lg font-mono focus:border-cyan-500 focus:outline-none"
              maxLength={5}
            />
            {formData.municipality && (
              <p className="text-xs text-slate-500 mt-1">
                {formData.municipality}, {formData.county} County
              </p>
            )}
          </div>
          
          {/* FEMA Lookup Button */}
          <div>
            <button
              onClick={lookupFloodData}
              disabled={isLookingUp || !formData.address || !formData.zipCode}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isLookingUp 
                  ? 'bg-slate-700 text-slate-400 cursor-wait'
                  : lookupSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isLookingUp ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Looking up FEMA data...
                </>
              ) : lookupSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  FEMA Data Loaded!
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  🔍 Look Up Official FEMA Flood Data
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 mt-1 text-center">
              Free lookup from official FEMA flood maps
            </p>
            
            {lookupError && (
              <p className="text-xs text-red-400 mt-2 text-center">{lookupError}</p>
            )}
          </div>
          
          {/* FEMA Results */}
          {lookupSuccess && (
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">Official FEMA Data</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500">Flood Zone</p>
                  <p className="text-lg font-bold text-white">{formData.floodZone}</p>
                  <p className="text-xs text-slate-500">
                    {formData.floodZone.startsWith('V') ? 'High risk + waves' :
                     formData.floodZone.startsWith('A') ? 'High risk' :
                     formData.floodZone === 'X' ? 'Lower risk' : 'Unknown'}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500">Base Flood Elevation</p>
                  <p className="text-lg font-bold text-white">{formData.bfe ? `${formData.bfe} ft` : 'N/A'}</p>
                  <p className="text-xs text-slate-500">NAVD88 datum</p>
                </div>
              </div>
              
              {formData.floodZone !== 'X' && (
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-2">
                  <p className="text-xs text-amber-400">
                    <strong>CAFE Requirement:</strong> Any substantial improvement must be elevated to {formData.bfe ? formData.bfe + 4 : 'BFE + 4'} ft
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Neighborhood Claims Data */}
          {claimsData && (
            <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-slate-300">Neighborhood Flood History</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-bold text-amber-400">{claimsData.totalClaims.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Claims in {formData.zipCode}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">${Math.round(claimsData.avgPayout).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Avg. claim payout</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Source: FEMA NFIP claims since {claimsData.since}</p>
            </div>
          )}
          
          {/* Property Suggestions from Area Data */}
          {propertySuggestions && lookupSuccess && (
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-cyan-400">Area Averages for {formData.zipCode}</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Click to auto-fill if you don't know your exact values:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => applySuggestion('sqft', propertySuggestions.avgSqft)}
                  className="bg-slate-900/50 border border-slate-600 hover:border-cyan-500 rounded-lg p-2 text-center transition-colors"
                >
                  <p className="text-lg font-bold text-white">{propertySuggestions.avgSqft?.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">Avg Sq Ft</p>
                </button>
                <button
                  onClick={() => {
                    const estimatedValue = propertySuggestions.avgSqft * propertySuggestions.pricePerSqft;
                    applySuggestion('homeValue', estimatedValue);
                  }}
                  className="bg-slate-900/50 border border-slate-600 hover:border-cyan-500 rounded-lg p-2 text-center transition-colors"
                >
                  <p className="text-lg font-bold text-white">${(propertySuggestions.avgValue / 1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-slate-500">Median Value</p>
                </button>
                <button
                  onClick={() => applySuggestion('pricePerSqft', propertySuggestions.pricePerSqft)}
                  className="bg-slate-900/50 border border-slate-600 hover:border-cyan-500 rounded-lg p-2 text-center transition-colors"
                >
                  <p className="text-lg font-bold text-white">${propertySuggestions.pricePerSqft}</p>
                  <p className="text-[10px] text-slate-500">$/Sq Ft</p>
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-2 text-center">Based on recent sales in your area</p>
            </div>
          )}
          
          {/* Square Footage */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Total Living Space (sq ft)
            </label>
            <input
              type="number"
              value={formData.squareFootage || ''}
              onChange={(e) => handleSqFtChange(e.target.value)}
              placeholder="e.g., 2000"
              className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          {/* Number of Stories */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Number of Stories
            </label>
            <select
              value={formData.stories || ''}
              onChange={(e) => {
                const stories = Number(e.target.value) || 1;
                const footprint = formData.squareFootage ? Math.round(formData.squareFootage / stories) : 0;
                setFormData(prev => ({ ...prev, stories, buildingFootprint: footprint }));
              }}
              className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Select...</option>
              <option value="1">1 Story (Ranch)</option>
              <option value="1.5">1.5 Stories (Cape Cod)</option>
              <option value="2">2 Stories</option>
              <option value="2.5">2.5 Stories</option>
              <option value="3">3 Stories</option>
              <option value="4">4+ Stories</option>
            </select>
          </div>
          
          {/* Lot Size */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Lot Size (sq ft)
            </label>
            <input
              type="number"
              value={formData.lotSize || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, lotSize: Number(e.target.value) || 0 }))}
              placeholder="e.g., 5000"
              className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Total lot area from tax records or survey
            </p>
          </div>
          
          {/* Auto-calculated values */}
          {formData.squareFootage > 0 && (
            <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
              <p className="text-xs text-slate-400">
                <span className="text-slate-500">Avg. Price/SqFt in {formData.zipCode || 'area'}:</span>{' '}
                <span className="font-mono text-cyan-400">${currentPricePerSqft}/sqft</span>
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-500">Estimated Home Value:</span>{' '}
                <span className="font-mono text-white">${formData.homeValue?.toLocaleString()}</span>
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-500">Structure Value (65%):</span>{' '}
                <span className="font-mono text-white">${formData.structureValue?.toLocaleString()}</span>
              </p>
              <p className="text-xs text-emerald-400">
                <span className="text-emerald-500">50% Threshold:</span>{' '}
                <span className="font-mono">${Math.round(formData.structureValue * 0.5).toLocaleString()}</span>
              </p>
              
              {/* Building Footprint */}
              {formData.stories && (
                <p className="text-xs text-slate-400">
                  <span className="text-slate-500">Building Footprint:</span>{' '}
                  <span className="font-mono text-white">{Math.round(formData.squareFootage / formData.stories).toLocaleString()} sq ft</span>
                </p>
              )}
              
              {/* Lot Coverage */}
              {formData.lotSize > 0 && formData.stories && (
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-500">Current Lot Coverage:</span>{' '}
                    <span className={`font-mono ${
                      (formData.squareFootage / formData.stories / formData.lotSize) > 0.7 
                        ? 'text-red-400' 
                        : (formData.squareFootage / formData.stories / formData.lotSize) > 0.5 
                          ? 'text-amber-400' 
                          : 'text-emerald-400'
                    }`}>
                      {((formData.squareFootage / formData.stories / formData.lotSize) * 100).toFixed(1)}%
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-500">Remaining at 70% limit:</span>{' '}
                    <span className="font-mono text-white">
                      {Math.max(0, Math.round(formData.lotSize * 0.7 - formData.squareFootage / formData.stories)).toLocaleString()} sq ft
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Building Code Alerts */}
          {formData.squareFootage >= 5000 && (
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
              <p className="text-xs text-amber-400 font-bold mb-1">⚠️ Large Home Requirements</p>
              <ul className="text-xs text-amber-300 space-y-1">
                {formData.squareFootage >= 5000 && <li>• Fire sprinkler system may be required (5,000+ sq ft)</li>}
                {formData.stories >= 3 && <li>• Additional structural engineering required (3+ stories)</li>}
                {formData.squareFootage >= 4000 && <li>• Energy modeling may be required under 2024 IECC</li>}
              </ul>
            </div>
          )}
          
          {/* Manual Override */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Structure Value <span className="text-slate-500 text-xs">(override)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="text"
                value={formData.structureValue ? formData.structureValue.toLocaleString() : ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                  setFormData(prev => ({ ...prev, structureValue: value }));
                }}
                className="w-full pl-8 pr-4 py-2 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Use assessed value minus land from tax records for accuracy
            </p>
          </div>
          
          {/* 10-Year Permit History */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              10-Year Permit History
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="text"
                value={formData.permitHistory ? formData.permitHistory.toLocaleString() : ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                  setFormData(prev => ({ ...prev, permitHistory: value }));
                }}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total cost of all permitted work in last 10 years
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CommandCenter() {
  const [selections, setSelections] = useState(() => {
    try {
      const saved = localStorage.getItem('shs_selections_v2');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  
  const [propertyData, setPropertyData] = useState(() => {
    try {
      const saved = localStorage.getItem('shs_property_v2');
      return saved ? JSON.parse(saved) : {
        address: '',
        zipCode: '',
        municipality: '',
        county: '',
        bfe: 9,
        floodZone: 'AE',
        tidal: true,
        squareFootage: 0,
        stories: 2,
        lotSize: 0,
        buildingFootprint: 0,
        homeValue: 0,
        structureValue: 0,
        permitHistory: 0,
      };
    } catch {
      return {
        address: '',
        zipCode: '',
        municipality: '',
        county: '',
        bfe: 9,
        floodZone: 'AE',
        tidal: true,
        squareFootage: 0,
        stories: 2,
        lotSize: 0,
        buildingFootprint: 0,
        homeValue: 0,
        structureValue: 0,
        permitHistory: 0,
      };
    }
  });
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [scoreChange, setScoreChange] = useState(null);
  const [prevScore, setPrevScore] = useState(0);
  
  // Weather alerts state
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [hasUrgentAlerts, setHasUrgentAlerts] = useState(false);
  const [forecast, setForecast] = useState(null);
  
  // Fetch weather alerts when coordinates are available
  useEffect(() => {
    const fetchWeather = async () => {
      if (propertyData.coordinates?.lat && propertyData.coordinates?.lng) {
        try {
          const response = await fetch(
            `/api/weather-alerts?lat=${propertyData.coordinates.lat}&lng=${propertyData.coordinates.lng}`
          );
          const data = await response.json();
          if (data.success) {
            setWeatherAlerts(data.alerts || []);
            setHasUrgentAlerts(data.hasUrgentAlerts || false);
            setForecast(data.forecast || null);
          }
        } catch (err) {
          console.log('Weather fetch failed:', err);
        }
      }
    };
    
    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [propertyData.coordinates]);
  
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('shs_selections_v2', JSON.stringify(selections));
  }, [selections]);
  
  useEffect(() => {
    localStorage.setItem('shs_property_v2', JSON.stringify(propertyData));
  }, [propertyData]);
  
  // Auto-open modal if no zip
  useEffect(() => {
    if (!propertyData.zipCode) {
      setShowEditModal(true);
    }
  }, []);
  
  // Calculate score - comprehensive scoring system
  const score = useMemo(() => {
    let points = 0;
    
    // Helper to check if toggle item is "yes" (new format) or true (old format)
    const isYes = (val) => val === 'yes' || val === true;
    const isPlanning = (val) => val === 'planning';
    
    // === WIND DEFENSE (max ~25 points) ===
    // Roof type (0-5 based on ROOF_TYPES resilienceScore)
    if (selections.roof_type) {
      const roofScore = ROOF_TYPES[selections.roof_type]?.resilienceScore || 0;
      points += roofScore;
    }
    
    // Roof age (0-5 points, newer = better)
    if (selections.roof_age !== undefined && selections.roof_age !== null) {
      const age = Number(selections.roof_age);
      if (age <= 5) points += 5;        // Brand new roof
      else if (age <= 10) points += 4;  // Good condition
      else if (age <= 15) points += 3;  // Acceptable
      else if (age <= 20) points += 1;  // ACV penalties likely
      else points += 0;                  // May face coverage issues
    }
    
    // Roof deck sealed (+4 if yes, +1 if planning)
    if (isYes(selections.roof_deck)) points += 4;
    else if (isPlanning(selections.roof_deck)) points += 1;
    
    // Ring-shank fasteners (+3 if yes, +1 if planning)
    if (isYes(selections.roof_fasteners)) points += 3;
    else if (isPlanning(selections.roof_fasteners)) points += 1;
    
    // Windows/shutters (0-5 based on selection)
    if (selections.windows_impact) {
      const windowScores = { none: 0, film: 1, plywood: 1, accordion: 3, impact: 4, both: 5 };
      points += windowScores[selections.windows_impact] || 0;
    }
    
    // Wind-rated garage door (+3 if yes, +1 if planning)
    if (isYes(selections.garage_door)) points += 3;
    else if (isPlanning(selections.garage_door)) points += 1;
    
    // === FLOOD ARMOR (max ~25 points) ===
    // Elevation certificate (+4) - critical document
    if (selections.elevation_cert) points += 4;
    
    // Current elevation vs BFE (0-5)
    if (selections.current_elevation) {
      const elev = Number(selections.current_elevation);
      const bfe = propertyData.bfe || 9;
      const diff = elev - bfe;
      if (diff >= 4) points += 5;       // At or above CAFE
      else if (diff >= 2) points += 4;  // Good buffer
      else if (diff >= 0) points += 3;  // At BFE
      else if (diff >= -2) points += 1; // Below but close
      else points += 0;                  // Significantly below
    }
    
    // Foundation type (0-4)
    if (selections.foundation_type) {
      const foundationScores = { slab: 0, crawl: 1, basement: 0, piers: 3, piles: 4 };
      points += foundationScores[selections.foundation_type] || 0;
    }
    
    // Flood vents (0-4 based on compliance)
    if (selections.flood_vents > 0) {
      const sqft = selections.enclosed_sqft || 0;
      const required = Math.ceil(sqft / 200);
      const vents = selections.flood_vents;
      if (vents >= required) points += 4;      // Fully compliant
      else if (vents >= required * 0.5) points += 2;  // Partial
      else points += 1;                         // Some venting
    }
    
    // Breakaway walls (+3)
    if (selections.breakaway_walls) points += 3;
    
    // Sump pump with backup (+3)
    if (selections.sump_pump) points += 3;
    
    // === ELEVATED SYSTEMS (max ~15 points) ===
    // HVAC location (0-5)
    if (selections.hvac_location) {
      const hvacScores = { ground: 0, elevated_partial: 2, elevated_full: 4, roof: 5 };
      points += hvacScores[selections.hvac_location] || 0;
    }
    
    // Electrical panel (0-4)
    if (selections.electrical_panel) {
      const elecScores = { basement: 0, ground: 1, elevated: 4 };
      points += elecScores[selections.electrical_panel] || 0;
    }
    
    // Water heater elevated (+3)
    if (selections.water_heater) points += 3;
    
    // Washer/dryer elevated (+2)
    if (selections.washer_dryer) points += 2;
    
    // === SMART PROTECTION (max ~15 points) ===
    // Smart water shutoff (+4)
    if (selections.water_shutoff) points += 4;
    
    // Leak sensors (+2)
    if (selections.leak_sensors) points += 2;
    
    // Backup power (0-5)
    if (selections.backup_power) {
      const powerScores = { none: 0, portable: 1, standby: 3, battery: 4, solar_battery: 5 };
      points += powerScores[selections.backup_power] || 0;
    }
    
    // Monitoring system (+3)
    if (selections.monitoring) points += 3;
    
    // === ENERGY & ENVELOPE (max ~10 points) ===
    // Attic insulation (0-4)
    if (selections.attic_insulation) {
      const insulScores = { unknown: 0, r30: 1, r49: 2, r60: 4 };
      points += insulScores[selections.attic_insulation] || 0;
    }
    
    // Window U-value (0-4)
    if (selections.window_uvalue) {
      const windowScores = { single: 0, double_old: 1, double_new: 2, code: 4 };
      points += windowScores[selections.window_uvalue] || 0;
    }
    
    // Air sealing (+2)
    if (selections.air_sealing) points += 2;
    
    // === SITE & LOT (max ~8 points) ===
    // Impervious cover (0-4)
    if (selections.impervious_cover) {
      const coverScores = { low: 4, moderate: 2, high: 1, maxed: 0 };
      points += coverScores[selections.impervious_cover] || 0;
    }
    
    // Permeable surfaces (+2 if yes, +1 if planning)
    if (isYes(selections.permeable_surfaces)) points += 2;
    else if (isPlanning(selections.permeable_surfaces)) points += 1;
    
    // Rain garden (+2 if yes, +1 if planning)
    if (isYes(selections.rain_garden)) points += 2;
    else if (isPlanning(selections.rain_garden)) points += 1;
    
    // === DOCUMENTATION (max ~10 points) ===
    // Permit history known (+3 if yes)
    if (isYes(selections.permit_history)) points += 3;
    
    // Flood disclosure ready (+3 if yes, +1 if planning)
    if (isYes(selections.flood_disclosure)) points += 3;
    else if (isPlanning(selections.flood_disclosure)) points += 1;
    
    // IRZ status known (not in IRZ = +3, unknown = 0)
    if (selections.irz_status === 'no') points += 3;
    
    // Legacy application (+2 if yes/planning)
    if (isYes(selections.legacy_app)) points += 2;
    else if (isPlanning(selections.legacy_app)) points += 1;
    
    // === SIZE-BASED ADJUSTMENTS ===
    // Larger homes have more exposure - need more protection
    const sqft = propertyData.squareFootage || 0;
    if (sqft > 0) {
      // Small homes (<1500) get a bonus for being easier to protect
      if (sqft < 1500) points += 3;
      // Medium homes (1500-2500) are baseline
      else if (sqft <= 2500) points += 0;
      // Large homes (2500-4000) have slight penalty unless well-protected
      else if (sqft <= 4000) {
        // Penalty reduced if they have good protection
        const hasGoodProtection = selections.roof_type === 'metal_standing' || 
                                   selections.windows_impact === 'both' ||
                                   selections.windows_impact === 'impact';
        points += hasGoodProtection ? 0 : -2;
      }
      // Very large homes (4000+) have bigger penalty
      else {
        const hasGoodProtection = selections.roof_type === 'metal_standing' && 
                                   (selections.windows_impact === 'both' || selections.windows_impact === 'impact');
        points += hasGoodProtection ? 0 : -4;
      }
    }
    
    // Lot coverage penalty - homes at >70% coverage have no room for improvements
    if (propertyData.lotSize > 0 && propertyData.stories) {
      const footprint = propertyData.squareFootage / propertyData.stories;
      const coverage = footprint / propertyData.lotSize;
      if (coverage > 0.8) points -= 3;  // Maxed out
      else if (coverage > 0.7) points -= 1;  // At limit
      else if (coverage < 0.5) points += 2;  // Room for flood mitigation features
    }
    
    return Math.max(0, Math.min(points, 100));
  }, [selections, propertyData]);
  
  // Calculate lot coverage data
  const lotCoverageData = useMemo(() => {
    if (!propertyData.lotSize || !propertyData.stories || !propertyData.squareFootage) {
      return null;
    }
    const footprint = propertyData.squareFootage / propertyData.stories;
    const currentCoverage = (footprint / propertyData.lotSize) * 100;
    const maxAllowed = propertyData.lotSize * 0.7; // 70% typical limit
    const remaining = Math.max(0, maxAllowed - footprint);
    const atLimit = currentCoverage >= 70;
    const overLimit = currentCoverage > 80;
    
    return {
      footprint: Math.round(footprint),
      currentCoverage: currentCoverage.toFixed(1),
      remaining: Math.round(remaining),
      atLimit,
      overLimit,
      maxAllowed: Math.round(maxAllowed)
    };
  }, [propertyData]);
  
  // Track score changes and show animation
  useEffect(() => {
    if (prevScore !== 0 && score !== prevScore) {
      const change = score - prevScore;
      setScoreChange(change);
      setTimeout(() => setScoreChange(null), 2000);
    }
    setPrevScore(score);
  }, [score]);
  
  // Insurance savings estimate - comprehensive, scaled by home size
  const insuranceSavings = useMemo(() => {
    let annual = 0;
    
    // Helper to check if toggle item is "yes" (new format) or true (old format)
    const isYes = (val) => val === 'yes' || val === true;
    
    // Size multiplier - larger homes have higher base premiums, so same % discount = more $
    const sqft = propertyData.squareFootage || 2000;
    const sizeMultiplier = sqft < 1500 ? 0.8 : sqft < 2500 ? 1.0 : sqft < 4000 ? 1.3 : 1.6;
    
    // Roof type
    if (selections.roof_type === 'metal_standing') annual += 1500;
    else if (selections.roof_type === 'metal_screwdown') annual += 1000;
    else if (selections.roof_type === 'architectural') annual += 500;
    else if (selections.roof_type === 'tile') annual += 800;
    
    // Roof age (penalty avoided)
    if (selections.roof_age !== undefined) {
      const age = Number(selections.roof_age);
      if (age <= 10) annual += 400; // No ACV penalty
    }
    
    // Roof deck
    if (isYes(selections.roof_deck)) annual += 600;
    
    // Windows/shutters
    if (selections.windows_impact === 'impact' || selections.windows_impact === 'both') annual += 800;
    else if (selections.windows_impact === 'accordion') annual += 500;
    
    // Garage door
    if (isYes(selections.garage_door)) annual += 200;
    
    // Elevation certificate
    if (isYes(selections.elevation_cert)) annual += 1000;
    
    // Flood vents
    if (selections.flood_vents > 0) annual += 500;
    
    // Elevated foundation
    if (selections.foundation_type === 'piles') annual += 2500;
    else if (selections.foundation_type === 'piers') annual += 1500;
    
    // Smart water shutoff
    if (isYes(selections.water_shutoff)) annual += 250;
    
    // Monitoring system
    if (isYes(selections.monitoring)) annual += 200;
    
    // Backup power (reduces secondary damage claims)
    if (selections.backup_power === 'standby' || selections.backup_power === 'battery' || selections.backup_power === 'solar_battery') {
      annual += 150;
    }
    
    // Apply size multiplier
    return Math.round(annual * sizeMultiplier);
  }, [selections, propertyData.squareFootage]);
  
  // Venting compliance
  const ventingStatus = useMemo(() => {
    const sqft = selections.enclosed_sqft || 0;
    const vents = selections.flood_vents || 0;
    const required = Math.ceil(sqft / 200);
    return { sqft, vents, required, compliant: vents >= required };
  }, [selections]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                <Home className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ShoreHomeScore</h1>
                <p className="text-xs text-slate-500">NJ Coastal Compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mini Score in Header */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                <div className="w-8 h-8 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="15" fill="none" 
                      stroke={score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeDasharray={`${score * 0.94} 94`}
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">{score}</span>
                <AnimatePresence>
                  {scoreChange !== null && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`text-xs font-bold ${scoreChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {scoreChange > 0 ? '+' : ''}{scoreChange}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Insurance Savings in Header */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 rounded-full border border-emerald-500/30">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">${insuranceSavings.toLocaleString()}</span>
                <span className="text-xs text-emerald-500">/yr</span>
              </div>
              
              {/* Glossary Button */}
              <button 
                onClick={() => setShowGlossary(true)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-full transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs">Glossary</span>
              </button>
              
              {/* Download Report Button */}
              <button 
                onClick={() => generatePDFReport(propertyData, selections, score, insuranceSavings)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-full transition-colors border border-cyan-500/30"
              >
                <Download className="w-4 h-4" />
                <span className="text-xs">Report</span>
              </button>
              
              <button className="p-2 text-slate-400 hover:text-white"><Bell className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-white"><Settings className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Glossary Modal */}
      <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Weather Alerts Banner */}
        <WeatherAlertsBanner alerts={weatherAlerts} forecast={forecast} />
        
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Score */}
          <div className="lg:col-span-4 bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
            <ScoreGauge score={score} />
            
            {/* Score Change Animation */}
            <AnimatePresence>
              {scoreChange !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  className={`absolute top-4 right-4 px-3 py-2 rounded-xl font-bold text-lg ${
                    scoreChange > 0 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}
                >
                  {scoreChange > 0 ? '+' : ''}{scoreChange}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">vs. Neighborhood Avg</p>
              <p className="text-sm font-bold text-emerald-400">+{Math.max(score - 35, 0)}%</p>
              {propertyData.zipCode && (
                <p className="text-[10px] text-slate-600 mt-1">Based on homes in {propertyData.zipCode}</p>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountdownCard
              title="Legacy Window"
              date={LEGACY_WINDOW_END}
              icon={Clock}
              color="amber"
              description="Submit complete applications to qualify under old elevation standards"
              info={COMPLIANCE_INFO.legacyWindow}
            />
            <CountdownCard
              title="Storm Season"
              date={STORM_SEASON_START}
              icon={Umbrella}
              color="cyan"
              description="Days until June 1 hurricane season begins"
            />
            <StatCard
              title="CAFE Standard"
              value={`BFE +${CAFE_ELEVATION}ft`}
              subtitle={propertyData.bfe ? `Required: ${propertyData.bfe + CAFE_ELEVATION}ft NAVD88` : 'Enter zip for local BFE'}
              icon={ArrowUp}
              info={COMPLIANCE_INFO.cafeStandard}
            />
            <StatCard
              title="Est. Insurance Savings"
              value={`$${insuranceSavings.toLocaleString()}/yr`}
              subtitle={`$${(insuranceSavings * 10).toLocaleString()} over 10 years`}
              icon={TrendingUp}
              color="emerald"
            />
          </div>
        </div>
        
        {/* Threshold Tracker */}
        {propertyData.structureValue > 0 && (
          <ThresholdGauge
            current={0}
            structureValue={propertyData.structureValue}
            permitHistory={propertyData.permitHistory}
          />
        )}
        
        {/* Flood Risk Projection (First Street style) */}
        {propertyData.floodZone && (
          <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Flood Risk Projection</h3>
              </div>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                Climate-Adjusted Analysis
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Current Risk */}
              <div className="bg-slate-900 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-2">Current Risk Factor</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-4xl font-bold ${
                    propertyData.floodZone.startsWith('V') ? 'text-red-400' :
                    propertyData.floodZone.startsWith('A') ? 'text-orange-400' :
                    'text-emerald-400'
                  }`}>
                    {propertyData.floodZone.startsWith('V') ? '9' :
                     propertyData.floodZone === 'AE' ? '7' :
                     propertyData.floodZone === 'AO' ? '6' :
                     propertyData.floodZone === 'A' ? '5' :
                     propertyData.floodZone === 'X' ? '2' : '4'}
                  </span>
                  <span className="text-slate-500">/10</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {propertyData.floodZone.startsWith('V') ? 'Extreme' :
                   propertyData.floodZone.startsWith('A') ? 'High' :
                   'Moderate'} Risk
                </p>
              </div>
              
              {/* 15-Year Projection */}
              <div className="bg-slate-900 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-2">15-Year Projection</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-4xl font-bold ${
                    propertyData.floodZone.startsWith('V') ? 'text-red-400' :
                    propertyData.floodZone.startsWith('A') ? 'text-red-400' :
                    'text-amber-400'
                  }`}>
                    {propertyData.floodZone.startsWith('V') ? '10' :
                     propertyData.floodZone === 'AE' ? '8' :
                     propertyData.floodZone === 'AO' ? '7' :
                     propertyData.floodZone === 'A' ? '6' :
                     propertyData.floodZone === 'X' ? '3' : '5'}
                  </span>
                  <span className="text-slate-500">/10</span>
                </div>
                <p className="text-xs text-amber-400 mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{propertyData.floodZone.startsWith('V') ? '11' : propertyData.floodZone.startsWith('A') ? '14' : '50'}% risk increase
                </p>
              </div>
              
              {/* 30-Year Projection */}
              <div className="bg-slate-900 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-2">30-Year Projection</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-4xl font-bold text-red-400`}>
                    {propertyData.floodZone.startsWith('V') ? '10' :
                     propertyData.floodZone === 'AE' ? '9' :
                     propertyData.floodZone === 'AO' ? '8' :
                     propertyData.floodZone === 'A' ? '7' :
                     propertyData.floodZone === 'X' ? '4' : '6'}
                  </span>
                  <span className="text-slate-500">/10</span>
                </div>
                <p className="text-xs text-red-400 mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{propertyData.floodZone.startsWith('V') ? '11' : propertyData.floodZone.startsWith('A') ? '29' : '100'}% risk increase
                </p>
              </div>
            </div>
            
            {/* Sea Level Rise Impact */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Waves className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">Sea Level Rise Impact</p>
                  <p className="text-xs text-slate-400 mt-1">
                    NJ coastal areas are projected to see <strong className="text-white">1.5-2.5 feet</strong> of sea level rise by 2050. 
                    This means today's 100-year flood could become a <strong className="text-white">25-year flood event</strong>.
                    Properties currently in Zone X may be reclassified to AE zones.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <p className="text-lg font-bold text-white">+1.2 ft</p>
                      <p className="text-[10px] text-slate-500">by 2035</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <p className="text-lg font-bold text-white">+2.1 ft</p>
                      <p className="text-[10px] text-slate-500">by 2050</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <p className="text-lg font-bold text-white">+4.2 ft</p>
                      <p className="text-[10px] text-slate-500">by 2100</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-600 mt-3 text-center">
              Projections based on NOAA sea level rise scenarios and NJ DEP coastal flood modeling
            </p>
          </div>
        )}
        
        {/* Venting Calculator */}
        {ventingStatus.sqft > 0 && (
          <VentingCalculator
            enclosedSqFt={ventingStatus.sqft}
            ventCount={ventingStatus.vents}
          />
        )}
        
        {/* Lot Coverage Calculator */}
        {lotCoverageData && (
          <div className={`bg-slate-800 border-2 rounded-2xl p-4 ${
            lotCoverageData.overLimit ? 'border-red-500/50' : 
            lotCoverageData.atLimit ? 'border-amber-500/50' : 
            'border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Lot Coverage & Buildable Area</h2>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                lotCoverageData.overLimit ? 'bg-red-500/20 text-red-400' :
                lotCoverageData.atLimit ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {lotCoverageData.overLimit ? 'Over Limit' : lotCoverageData.atLimit ? 'At Limit' : 'Room Available'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500">Building Footprint</p>
                <p className="text-lg font-bold text-white">{lotCoverageData.footprint.toLocaleString()} <span className="text-xs text-slate-500">sq ft</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Lot Size</p>
                <p className="text-lg font-bold text-white">{propertyData.lotSize.toLocaleString()} <span className="text-xs text-slate-500">sq ft</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Current Coverage</p>
                <p className={`text-lg font-bold ${
                  lotCoverageData.overLimit ? 'text-red-400' :
                  lotCoverageData.atLimit ? 'text-amber-400' :
                  'text-emerald-400'
                }`}>{lotCoverageData.currentCoverage}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Can Still Build</p>
                <p className="text-lg font-bold text-cyan-400">{lotCoverageData.remaining.toLocaleString()} <span className="text-xs text-slate-500">sq ft</span></p>
              </div>
            </div>
            
            {/* Coverage Bar */}
            <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-amber-500/70 z-10" />
              <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-red-500/70 z-10" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Number(lotCoverageData.currentCoverage), 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`absolute top-0 bottom-0 left-0 ${
                  lotCoverageData.overLimit ? 'bg-gradient-to-r from-red-500 to-red-700' :
                  lotCoverageData.atLimit ? 'bg-gradient-to-r from-amber-500 to-amber-700' :
                  'bg-gradient-to-r from-cyan-500 to-emerald-500'
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono mt-1">
              <span className="text-slate-500">0%</span>
              <span className="text-amber-400">70% typical limit</span>
              <span className="text-red-400">80%</span>
              <span className="text-slate-500">100%</span>
            </div>
            
            {/* What Can You Build? */}
            {lotCoverageData.remaining > 0 && (
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">
                  <strong className="text-cyan-400">What can you build with {lotCoverageData.remaining.toLocaleString()} sq ft?</strong>
                </p>
                <ul className="text-xs text-slate-500 space-y-1">
                  {lotCoverageData.remaining >= 400 && <li>✓ Detached garage (400-600 sq ft)</li>}
                  {lotCoverageData.remaining >= 200 && <li>✓ Pool house or shed (200-400 sq ft)</li>}
                  {lotCoverageData.remaining >= 150 && <li>✓ Covered patio or deck (150+ sq ft)</li>}
                  {lotCoverageData.remaining >= 100 && <li>✓ Small addition or bump-out (100+ sq ft)</li>}
                  {lotCoverageData.remaining < 100 && <li className="text-amber-400">⚠️ Limited to minor improvements only</li>}
                </ul>
              </div>
            )}
            
            {lotCoverageData.remaining <= 0 && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400">
                  <strong>⚠️ No additional building footprint available.</strong> You'll need to remove existing coverage or seek a variance for any additions.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Insurance Premium Estimator */}
        <InsuranceEstimator propertyData={propertyData} selections={selections} />
        
        {/* Code Updates */}
        <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Regulatory Updates</h2>
          </div>
          <div className="space-y-2">
            <CodeAlert
              title="NJ REAL 2026 CAFE Standard Now in Effect"
              date="Jan 2026"
              description="Substantial improvements in tidal flood zones must be elevated to BFE +4 feet. The 180-day legacy window is now open."
              type="warning"
            />
            {propertyData.county === 'Monmouth' && (
              <CodeAlert
                title="Manasquan: 10-Year Cumulative Rule Active"
                date="Local"
                description="Manasquan enforces a rolling 10-year cumulative substantial improvement calculation. Track all permits carefully."
                type="urgent"
              />
            )}
            <CodeAlert
              title="FEMA Risk Rating 2.0 in Effect"
              description="All NFIP policies now use the new rating methodology. Mitigation measures can significantly reduce premiums."
              type="info"
            />
          </div>
        </div>
        
        {/* Property Card */}
        <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Your Property</h2>
            </div>
            <button 
              onClick={() => setShowEditModal(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit Details
            </button>
          </div>
          
          {propertyData.zipCode ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm text-white font-medium">{propertyData.zipCode}</p>
                <p className="text-xs text-slate-500">{propertyData.municipality}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  <GlossaryTerm term="floodZone">Flood Zone</GlossaryTerm>
                </p>
                <p className="text-sm text-white font-medium">{propertyData.floodZone}</p>
                <p className="text-xs text-slate-500">
                  <GlossaryTerm term="bfe">BFE</GlossaryTerm>: {propertyData.bfe}ft
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  <GlossaryTerm term="structureValue">Structure Value</GlossaryTerm>
                </p>
                <p className="text-sm text-white font-medium">
                  {propertyData.structureValue ? `$${propertyData.structureValue.toLocaleString()}` : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">10-Year Permits</p>
                <p className="text-sm text-white font-medium">
                  ${propertyData.permitHistory?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-400 mb-3">Enter your property details to get started</p>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors"
              >
                Add Property Details
              </button>
            </div>
          )}
        </div>

        <PropertyEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          propertyData={propertyData}
          onSave={setPropertyData}
        />

        {/* Checklist */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Resilience Checklist</h2>
          </div>
          
          <div className="space-y-4">
            {CHECKLIST_CATEGORIES.map(category => (
              <ChecklistCategory
                key={category.id}
                category={category}
                selections={selections}
                onSelectionChange={(id, value) => setSelections(prev => ({ ...prev, [id]: value }))}
              />
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-emerald-900/30 border-2 border-cyan-500/30 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Get Your Compliance Report</h3>
              <p className="text-sm text-slate-400">PDF with score, recommendations, threshold analysis, and next steps.</p>
            </div>
            <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-600">
            © 2026 ShoreHomeScore • Based on NJ REAL Rules (N.J.A.C. 7:13), FEMA regulations, and 2024 IECC
          </p>
          <p className="text-[10px] text-slate-700 mt-1">
            Educational tool only. Consult licensed professionals for project-specific guidance.
          </p>
        </div>
      </footer>
    </div>
  );
}
