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

// Threshold explanations
const COMPLIANCE_INFO = {
  fortyPercent: {
    title: '40% Yellow Zone',
    description: 'When cumulative improvements reach 40% of structure value, most NJ municipalities require a "Substantial Improvement" review. This typically means:',
    consequences: [
      'Signed Contractor Affidavits required for all work',
      'Detailed engineering review of proposed improvements',
      'Higher scrutiny on permit applications',
      'Warning that you are approaching mandatory elevation threshold'
    ],
    citation: 'N.J.A.C. 7:13 - NJ Flood Hazard Area Control Act'
  },
  fiftyPercent: {
    title: '50% Red Zone - Substantial Improvement',
    description: 'At 50%, your project legally triggers "Substantial Improvement" (SI) under FEMA and NJ REAL rules. This means:',
    consequences: [
      'MANDATORY elevation of entire structure to BFE + 4ft',
      'All mechanical systems must be elevated or protected',
      'Foundation must meet current V-zone or A-zone standards',
      'Cannot proceed with renovation until elevation complete',
      'Typical elevation cost: $150,000 - $400,000+'
    ],
    citation: 'FEMA 44 CFR 59.1 & N.J.A.C. 7:13-12.5'
  },
  cafeStandard: {
    title: 'CAFE +4ft Standard (2026)',
    description: 'The Climate-Adjusted Flood Elevation requires new construction and substantially improved structures in tidal areas to be elevated 4 feet above the current FEMA BFE.',
    consequences: [
      'Higher first-floor elevation than previous standards',
      'Increased construction costs but better long-term protection',
      'May qualify for significant flood insurance discounts',
      'Future-proofs against projected sea level rise'
    ],
    citation: 'NJ REAL Rules - Effective January 2026'
  },
  ventingRatio: {
    title: '1:1 Flood Venting Requirement',
    description: 'FEMA and NJ building codes require engineered flood openings in any enclosed area below BFE to allow floodwater to flow through.',
    consequences: [
      'Required: 1 square inch of opening per 1 square foot of enclosed area',
      'Non-engineered openings require 2x the area',
      'Insufficient venting = insurance penalties and code violations',
      'Proper venting can improve NFIP rating by 1+ classes'
    ],
    citation: 'FEMA TB 1-08 & NJ Uniform Construction Code'
  },
  legacyWindow: {
    title: 'July 2026 Legacy Window',
    description: 'Applications deemed "complete" by NJDEP within 180 days of NJ REAL rule adoption can be reviewed under OLD elevation standards.',
    consequences: [
      'Grandfathered projects may only need BFE (not BFE+4)',
      'Significant cost savings potential',
      'Deadline is firm - incomplete applications don\'t qualify',
      'Requires all supporting documents submitted'
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
// CHECKLIST CATEGORIES (Enhanced)
// =============================================================================
const CHECKLIST_CATEGORIES = [
  {
    id: 'wind',
    name: 'Wind Defense',
    icon: Wind,
    color: 'cyan',
    items: [
      {
        id: 'roof_type',
        name: 'Roof Type & Condition',
        type: 'select',
        options: Object.entries(ROOF_TYPES).map(([key, val]) => ({ 
          value: key, 
          label: val.name,
          score: val.resilienceScore 
        })),
        insuranceImpact: 'Varies by type - see details',
        equityImpact: '+$5,000 - $25,000 depending on upgrade',
        complianceNote: 'FORTIFIED certification requires architectural minimum'
      },
      {
        id: 'roof_age',
        name: 'Roof Age',
        type: 'number',
        unit: 'years',
        description: 'How old is your current roof?',
        insuranceImpact: 'Roofs 15+ years face ACV penalties reducing claim payouts',
        equityImpact: 'New roof adds $8,000-$20,000 in value',
        complianceNote: 'Insurance may deny coverage for roofs 20+ years'
      },
      {
        id: 'roof_deck',
        name: 'Sealed Roof Deck',
        type: 'toggle',
        description: 'Secondary water barrier under shingles (peel & stick or SWR)',
        insuranceImpact: '10-15% additional wind premium discount',
        equityImpact: '+$3,000 - $5,000 home value',
        complianceNote: 'Required for FORTIFIED Silver designation'
      },
      {
        id: 'roof_fasteners',
        name: 'Ring-Shank Nails / Stainless Fasteners',
        type: 'toggle',
        description: 'Enhanced fasteners that resist pull-through in high winds',
        insuranceImpact: 'Part of roof system discount package',
        equityImpact: '+$1,000 - $2,000 home value',
        complianceNote: 'Code requirement in high-velocity hurricane zones'
      },
      {
        id: 'windows_impact',
        name: 'Impact-Rated Windows or Shutters',
        type: 'select',
        options: [
          { value: 'none', label: 'Standard windows (no protection)', score: 0 },
          { value: 'film', label: 'Security film only', score: 1 },
          { value: 'plywood', label: 'Plywood shutters (temporary)', score: 1 },
          { value: 'accordion', label: 'Accordion/Roll-down shutters', score: 3 },
          { value: 'impact', label: 'Impact-rated glass', score: 4 },
          { value: 'both', label: 'Impact glass + shutters', score: 5 }
        ],
        insuranceImpact: '5-15% premium reduction depending on type',
        equityImpact: '+$5,000 - $20,000 home value',
        complianceNote: 'Required in V-zones and for FORTIFIED certification'
      },
      {
        id: 'garage_door',
        name: 'Wind-Rated Garage Door',
        type: 'toggle',
        description: 'Garage door rated for high wind pressure (check label for rating)',
        insuranceImpact: '2-5% premium reduction',
        equityImpact: '+$2,000 - $4,000 home value',
        complianceNote: 'Garage doors are #1 failure point in hurricanes'
      }
    ]
  },
  {
    id: 'flood',
    name: 'Flood Armor',
    icon: Droplets,
    color: 'blue',
    items: [
      {
        id: 'elevation_cert',
        name: 'Elevation Certificate',
        type: 'toggle',
        description: 'Official FEMA form documenting your home\'s elevation vs. BFE',
        insuranceImpact: 'Required for accurate NFIP rating - can save $500-$3,000/year',
        equityImpact: 'Required document for sale in flood zones',
        complianceNote: 'Mandatory for NJ REAL compliance. Get updated EC after any work.'
      },
      {
        id: 'current_elevation',
        name: 'Current First Floor Elevation',
        type: 'number',
        unit: 'ft NAVD88',
        description: 'Your lowest floor elevation from Elevation Certificate',
        insuranceImpact: 'Every foot above BFE = significant premium reduction',
        equityImpact: 'Homes at/above BFE worth 10-20% more than below',
        complianceNote: 'Must be BFE+4 for new construction/SI under 2026 rules'
      },
      {
        id: 'foundation_type',
        name: 'Foundation Type',
        type: 'select',
        options: Object.entries(FOUNDATION_TYPES).map(([key, val]) => ({
          value: key,
          label: val.name,
          risk: val.floodRisk
        })),
        insuranceImpact: 'Foundation type affects both premium and elevation costs',
        equityImpact: 'Elevated foundations command premium in flood zones',
        complianceNote: 'Determines complexity and cost of any required elevation'
      },
      {
        id: 'enclosed_sqft',
        name: 'Enclosed Area Below BFE (sq ft)',
        type: 'number',
        unit: 'sq ft',
        description: 'Garage, crawlspace, or any enclosed area below flood level',
        insuranceImpact: 'Enclosed areas require proper venting for NFIP compliance',
        equityImpact: 'Compliant enclosures protect property value',
        complianceNote: 'Triggers 1:1 venting ratio requirement'
      },
      {
        id: 'flood_vents',
        name: 'Engineered Flood Vents',
        type: 'number',
        unit: 'vents',
        description: 'Number of ICC-certified engineered flood vents installed',
        insuranceImpact: 'Proper venting can improve rating by 1+ classes',
        equityImpact: '+$2,000 - $5,000 home value',
        complianceNote: 'Each vent typically covers 200 sq ft. Check certification.'
      },
      {
        id: 'breakaway_walls',
        name: 'Breakaway Walls',
        type: 'toggle',
        description: 'Walls below BFE designed to break away without damaging structure',
        insuranceImpact: 'Required for compliant enclosures in V-zones',
        equityImpact: '+$5,000 - $10,000 home value',
        complianceNote: 'Code requirement for any walls below BFE in V-zones'
      },
      {
        id: 'sump_pump',
        name: 'Sump Pump with Battery Backup',
        type: 'toggle',
        description: 'Automatic pump with backup power to remove water during outages',
        insuranceImpact: 'Reduces claim frequency - some insurers offer discounts',
        equityImpact: '+$1,500 - $3,000 home value',
        complianceNote: 'Essential for any below-grade spaces'
      }
    ]
  },
  {
    id: 'systems',
    name: 'Elevated Mechanicals',
    icon: Zap,
    color: 'violet',
    items: [
      {
        id: 'hvac_location',
        name: 'HVAC Location',
        type: 'select',
        options: [
          { value: 'ground', label: 'Ground level / Below BFE', score: 0 },
          { value: 'elevated_partial', label: 'Elevated but below BFE+4', score: 2 },
          { value: 'elevated_full', label: 'At or above BFE+4', score: 4 },
          { value: 'roof', label: 'Roof-mounted', score: 5 }
        ],
        insuranceImpact: 'Elevated HVAC reduces contents damage claims significantly',
        equityImpact: '+$3,000 - $8,000 home value',
        complianceNote: '2026 CAFE requires HVAC at BFE+4 for substantial improvements'
      },
      {
        id: 'electrical_panel',
        name: 'Electrical Panel Location',
        type: 'select',
        options: [
          { value: 'basement', label: 'Basement / Below grade', score: 0 },
          { value: 'ground', label: 'Ground floor below BFE', score: 1 },
          { value: 'elevated', label: 'Elevated above BFE+4', score: 4 }
        ],
        insuranceImpact: 'Flood damage to electrical = total system replacement',
        equityImpact: '+$2,000 - $5,000 home value',
        complianceNote: 'Code requires elevation for new/replacement panels in flood zones'
      },
      {
        id: 'water_heater',
        name: 'Water Heater Elevated',
        type: 'toggle',
        description: 'Hot water heater raised above potential flood levels',
        insuranceImpact: 'Reduces contents claims',
        equityImpact: '+$1,000 - $2,000 home value',
        complianceNote: 'Simple, low-cost mitigation measure'
      },
      {
        id: 'washer_dryer',
        name: 'Washer/Dryer Elevated',
        type: 'toggle',
        description: 'Laundry appliances on upper floor or elevated platform',
        insuranceImpact: 'Reduces contents claims',
        equityImpact: '+$500 - $1,500 home value',
        complianceNote: 'Consider relocating to upper floor during renovation'
      }
    ]
  },
  {
    id: 'tech',
    name: 'Smart Protection',
    icon: Radio,
    color: 'emerald',
    items: [
      {
        id: 'water_shutoff',
        name: 'Smart Water Shutoff Valve',
        type: 'toggle',
        description: 'Automatic main shutoff when leak detected',
        insuranceImpact: '5-10% discount from many insurers',
        equityImpact: '+$2,000 - $4,000 home value',
        complianceNote: 'Prevents catastrophic water damage while away'
      },
      {
        id: 'leak_sensors',
        name: 'Water Leak Sensors',
        type: 'toggle',
        description: 'Smart sensors near water heater, washing machine, sinks',
        insuranceImpact: 'Often bundled with shutoff discount',
        equityImpact: '+$500 - $1,000 home value',
        complianceNote: 'Early detection prevents major damage'
      },
      {
        id: 'backup_power',
        name: 'Backup Power',
        type: 'select',
        options: [
          { value: 'none', label: 'None', score: 0 },
          { value: 'portable', label: 'Portable generator', score: 1 },
          { value: 'standby', label: 'Standby generator (auto-start)', score: 3 },
          { value: 'battery', label: 'Whole-home battery (Tesla, etc.)', score: 4 },
          { value: 'solar_battery', label: 'Solar + battery system', score: 5 }
        ],
        insuranceImpact: 'Reduces secondary damage from extended outages',
        equityImpact: '+$8,000 - $25,000 home value',
        complianceNote: 'Essential for keeping sump pumps running during storms'
      },
      {
        id: 'monitoring',
        name: 'Home Monitoring System',
        type: 'toggle',
        description: 'Security + environmental monitoring (water, temp, smoke)',
        insuranceImpact: '5-15% homeowner premium discount',
        equityImpact: '+$2,000 - $5,000 home value',
        complianceNote: 'Remote alerts allow faster response to issues'
      }
    ]
  },
  {
    id: 'thermal',
    name: 'Energy Code (2024 IECC)',
    icon: Thermometer,
    color: 'amber',
    items: [
      {
        id: 'attic_insulation',
        name: 'Attic Insulation R-Value',
        type: 'select',
        options: [
          { value: 'unknown', label: 'Unknown / Uninsulated', score: 0 },
          { value: 'r30', label: 'R-30 or less (below code)', score: 1 },
          { value: 'r49', label: 'R-49 (previous code)', score: 2 },
          { value: 'r60', label: 'R-60+ (2024 IECC compliant)', score: 4 }
        ],
        insuranceImpact: 'Reduces ice dam claims in winter',
        equityImpact: '+$3,000 - $6,000 home value',
        complianceNote: '2024 IECC requires R-60 ceiling insulation for NJ'
      },
      {
        id: 'window_uvalue',
        name: 'Window Performance',
        type: 'select',
        options: [
          { value: 'single', label: 'Single pane (very poor)', score: 0 },
          { value: 'double_old', label: 'Double pane (pre-2000)', score: 1 },
          { value: 'double_new', label: 'Double pane (U-0.35-0.40)', score: 2 },
          { value: 'code', label: 'High-performance (U≤0.30)', score: 4 }
        ],
        insuranceImpact: 'Indirect - reduces energy costs',
        equityImpact: '+$8,000 - $15,000 home value',
        complianceNote: '2024 IECC requires U-factor ≤0.30 for new windows'
      },
      {
        id: 'air_sealing',
        name: 'Air Sealing & Blower Door Test',
        type: 'toggle',
        description: 'Professional air sealing verified by pressure test',
        insuranceImpact: 'Reduces moisture/mold damage risk',
        equityImpact: '+$2,000 - $4,000 home value',
        complianceNote: '2024 IECC requires blower door testing for compliance'
      }
    ]
  },
  {
    id: 'site',
    name: 'Site & Lot',
    icon: Leaf,
    color: 'green',
    items: [
      {
        id: 'lot_sqft',
        name: 'Total Lot Size',
        type: 'number',
        unit: 'sq ft',
        description: 'Total lot area',
        insuranceImpact: 'Affects overall property valuation',
        equityImpact: 'Larger lots command premium',
        complianceNote: 'Used to calculate impervious cover limits'
      },
      {
        id: 'impervious_cover',
        name: 'Impervious Cover',
        type: 'select',
        options: [
          { value: 'low', label: 'Under 50% (good)', score: 4 },
          { value: 'moderate', label: '50-70%', score: 2 },
          { value: 'high', label: '70-85%', score: 1 },
          { value: 'maxed', label: 'Over 85% (at limit)', score: 0 }
        ],
        insuranceImpact: 'High runoff increases flood risk to neighbors',
        equityImpact: 'Headroom for additions/improvements',
        complianceNote: 'Many NJ shore towns limit to 70-80%'
      },
      {
        id: 'permeable_surfaces',
        name: 'Permeable Pavers/Surfaces',
        type: 'toggle',
        description: 'Driveway, patio, or walkways that allow water infiltration',
        insuranceImpact: 'May reduce flood risk to structure',
        equityImpact: '+$3,000 - $8,000 home value',
        complianceNote: 'Often receive credit toward impervious cover limits'
      },
      {
        id: 'rain_garden',
        name: 'Rain Garden / Bioswale',
        type: 'toggle',
        description: 'Planted depression that captures and filters stormwater',
        insuranceImpact: 'Demonstrates flood mitigation effort',
        equityImpact: '+$2,000 - $5,000 home value',
        complianceNote: 'May satisfy stormwater management requirements'
      }
    ]
  },
  {
    id: 'legal',
    name: 'Documentation & Compliance',
    icon: FileCheck,
    color: 'rose',
    items: [
      {
        id: 'permit_history',
        name: '10-Year Permit History Known',
        type: 'toggle',
        description: 'Have you obtained records of all permits in last 10 years?',
        insuranceImpact: 'Prevents surprise SI threshold issues',
        equityImpact: 'Protects renovation budget',
        complianceNote: 'Critical for towns with cumulative SI rules (Manasquan, etc.)'
      },
      {
        id: 'flood_disclosure',
        name: 'Flood Disclosure Forms Ready',
        type: 'toggle',
        description: 'NJ-mandated flood history disclosure for sale/rental',
        insuranceImpact: 'Required by law since March 2024',
        equityImpact: 'Avoid legal liability',
        complianceNote: 'Sellers must disclose all flood history and insurance claims'
      },
      {
        id: 'irz_status',
        name: 'Inundation Risk Zone (IRZ)',
        type: 'select',
        options: [
          { value: 'unknown', label: 'Unknown - need to check', score: 0 },
          { value: 'no', label: 'Not in IRZ', score: 3 },
          { value: 'yes', label: 'In IRZ - daily flooding projected by 2100', score: 0 }
        ],
        insuranceImpact: 'IRZ status may affect future insurability',
        equityImpact: 'Significant long-term value implications',
        complianceNote: 'Requires deed notice for any substantial work'
      },
      {
        id: 'legacy_app',
        name: 'Legacy Window Application',
        type: 'toggle',
        description: 'Planning to submit permit before July 2026 deadline?',
        insuranceImpact: 'Could lock in current (lower) elevation requirements',
        equityImpact: 'Potential savings of $50,000-$150,000',
        complianceNote: 'Application must be "complete" - not just submitted'
      }
    ]
  }
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

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
              <h4 className="font-bold text-white mb-2">{info.title}</h4>
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

const ChecklistInput = ({ item, value, onChange }) => {
  if (item.type === 'toggle') {
    return (
      <button
        onClick={() => onChange(!value)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          value 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
            : 'bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700'
        }`}
      >
        {value ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        {value ? 'Yes' : 'No'}
      </button>
    );
  }
  
  if (item.type === 'select') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
      >
        <option value="">Select...</option>
        {item.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  
  if (item.type === 'number') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder="0"
          className="w-32 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
        />
        {item.unit && <span className="text-sm text-slate-500">{item.unit}</span>}
      </div>
    );
  }
  
  return null;
};

const ChecklistItem = ({ item, value, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  
  const hasValue = value !== undefined && value !== null && value !== '' && value !== false;
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-2 h-2 rounded-full ${hasValue ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-slate-200">{item.name}</h4>
              {item.description && (
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
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
              {/* Input */}
              <div>
                <ChecklistInput item={item} value={value} onChange={onChange} />
              </div>
              
              {/* Impact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 uppercase">Equity Impact</span>
                  </div>
                  <p className="text-xs text-slate-300">{item.equityImpact}</p>
                </div>
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] text-cyan-400 uppercase">Insurance</span>
                  </div>
                  <p className="text-xs text-slate-300">{item.insuranceImpact}</p>
                </div>
                <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] text-violet-400 uppercase">Compliance</span>
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
                {formData.municipality}, {formData.county} County • BFE: {formData.bfe}ft • Zone: {formData.floodZone}
              </p>
            )}
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Address <span className="text-slate-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Ocean Ave"
              className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          {/* Square Footage */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Building Square Footage
            </label>
            <input
              type="number"
              value={formData.squareFootage || ''}
              onChange={(e) => handleSqFtChange(e.target.value)}
              placeholder="e.g., 2000"
              className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Used to estimate structure value and calculate thresholds
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
        homeValue: 0,
        structureValue: 0,
        permitHistory: 0,
      };
    }
  });
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [scoreChange, setScoreChange] = useState(null);
  const [prevScore, setPrevScore] = useState(0);
  
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
    
    // Roof deck sealed (+4)
    if (selections.roof_deck) points += 4;
    
    // Ring-shank fasteners (+3)
    if (selections.roof_fasteners) points += 3;
    
    // Windows/shutters (0-5 based on selection)
    if (selections.windows_impact) {
      const windowScores = { none: 0, film: 1, plywood: 1, accordion: 3, impact: 4, both: 5 };
      points += windowScores[selections.windows_impact] || 0;
    }
    
    // Wind-rated garage door (+3)
    if (selections.garage_door) points += 3;
    
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
    
    // Permeable surfaces (+2)
    if (selections.permeable_surfaces) points += 2;
    
    // Rain garden (+2)
    if (selections.rain_garden) points += 2;
    
    // === DOCUMENTATION (max ~10 points) ===
    // Permit history known (+3)
    if (selections.permit_history) points += 3;
    
    // Flood disclosure ready (+3)
    if (selections.flood_disclosure) points += 3;
    
    // IRZ status known (not in IRZ = +2)
    if (selections.irz_status === 'no') points += 2;
    
    // Legacy application (+2)
    if (selections.legacy_app) points += 2;
    
    return Math.min(points, 100);
  }, [selections, propertyData.bfe]);
  
  // Track score changes and show animation
  useEffect(() => {
    if (prevScore !== 0 && score !== prevScore) {
      const change = score - prevScore;
      setScoreChange(change);
      setTimeout(() => setScoreChange(null), 2000);
    }
    setPrevScore(score);
  }, [score]);
  
  // Insurance savings estimate - comprehensive
  const insuranceSavings = useMemo(() => {
    let annual = 0;
    
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
    if (selections.roof_deck) annual += 600;
    
    // Windows/shutters
    if (selections.windows_impact === 'impact' || selections.windows_impact === 'both') annual += 800;
    else if (selections.windows_impact === 'accordion') annual += 500;
    
    // Garage door
    if (selections.garage_door) annual += 200;
    
    // Elevation certificate
    if (selections.elevation_cert) annual += 1000;
    
    // Flood vents
    if (selections.flood_vents > 0) annual += 500;
    
    // Elevated foundation
    if (selections.foundation_type === 'piles') annual += 2500;
    else if (selections.foundation_type === 'piers') annual += 1500;
    
    // Smart water shutoff
    if (selections.water_shutoff) annual += 250;
    
    // Monitoring system
    if (selections.monitoring) annual += 200;
    
    // Backup power (reduces secondary damage claims)
    if (selections.backup_power === 'standby' || selections.backup_power === 'battery' || selections.backup_power === 'solar_battery') {
      annual += 150;
    }
    
    return annual;
  }, [selections]);
  
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
              
              <button className="p-2 text-slate-400 hover:text-white"><Bell className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-white"><Settings className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
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
        
        {/* Venting Calculator */}
        {ventingStatus.sqft > 0 && (
          <VentingCalculator
            enclosedSqFt={ventingStatus.sqft}
            ventCount={ventingStatus.vents}
          />
        )}
        
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
                <p className="text-xs text-slate-500">Flood Zone</p>
                <p className="text-sm text-white font-medium">{propertyData.floodZone}</p>
                <p className="text-xs text-slate-500">BFE: {propertyData.bfe}ft</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Structure Value</p>
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
