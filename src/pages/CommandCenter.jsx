import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, FileText, AlertTriangle,
  CheckCircle, ChevronRight, ChevronDown, DollarSign, MapPin,
  X, HelpCircle, ArrowRight, ArrowLeft, Info, Clock, Target,
  Zap, TrendingUp, ExternalLink, Mail, Lock, Building, Search,
  Check, AlertCircle, Loader
} from 'lucide-react';

// =============================================================================
// EDUCATIONAL CONTENT - The heart of the app
// =============================================================================

const EDUCATION = {
  // Flood Zones
  floodZone: {
    title: 'Flood Zone',
    description: 'FEMA-designated area indicating flood risk level',
    zones: {
      'VE': {
        name: 'VE - Coastal High Risk',
        risk: 'high',
        description: 'Coastal area with wave action. Highest risk zone.',
        requirements: 'Strictest building codes. Breakaway walls required below BFE. Elevated foundation mandatory.',
        insurance: 'Flood insurance required. Highest premiums.',
      },
      'AE': {
        name: 'AE - High Risk',
        risk: 'high',
        description: 'High-risk flood area with determined Base Flood Elevation.',
        requirements: 'Must build to BFE or higher. Flood vents required for enclosed areas.',
        insurance: 'Flood insurance required for federally-backed mortgages.',
      },
      'AO': {
        name: 'AO - Shallow Flooding',
        risk: 'high',
        description: 'Areas of shallow flooding, typically 1-3 feet.',
        requirements: 'Specific drainage requirements apply.',
        insurance: 'Flood insurance required.',
      },
      'X': {
        name: 'X - Moderate/Low Risk',
        risk: 'low',
        description: 'Area of minimal or moderate flood hazard.',
        requirements: 'Standard building codes apply.',
        insurance: 'Flood insurance not required but recommended.',
      },
    }
  },
  
  // BFE
  bfe: {
    title: 'Base Flood Elevation (BFE)',
    description: 'The elevation floodwaters are expected to reach during a "100-year flood" (1% annual chance).',
    impact: 'Your home\'s elevation relative to BFE is the #1 factor in flood insurance pricing.',
    tip: 'Each foot above BFE can save hundreds per year on insurance.',
  },
  
  // CAFE
  cafe: {
    title: 'Coastal A Flood Elevation (CAFE)',
    description: 'New Jersey requires new construction and substantial improvements to be built to BFE + 4 feet.',
    impact: 'This "freeboard" provides extra safety margin and better insurance rates.',
    deadline: 'Legacy window: Permits submitted before July 15, 2026 may use previous standards.',
  },
  
  // 50% Rule
  fiftyPercentRule: {
    title: '50% Rule (Substantial Improvement)',
    description: 'If improvements exceed 50% of your home\'s market value within any 10-year period, the ENTIRE structure must be brought up to current flood codes.',
    impact: 'Can trigger mandatory elevation, new foundation, or other costly upgrades.',
    tip: 'Track your improvement costs. Stay informed before starting major projects.',
  },
  
  // Elevation Certificate
  elevationCert: {
    title: 'Elevation Certificate',
    description: 'Official document prepared by a licensed surveyor showing your home\'s elevation relative to the Base Flood Elevation.',
    whyItMatters: 'Without one, insurance companies assume worst-case scenario and charge maximum rates.',
    impact: {
      hasIt: 'Accurate insurance rating. Often significant savings.',
      noHasIt: 'Likely overpaying $500+/year on flood insurance.',
    },
    howToGet: 'Hire a licensed surveyor. Typical cost: $300-600. Usually pays for itself in Year 1.',
  },
  
  // Foundation Types
  foundation: {
    title: 'Foundation Type',
    description: 'How your home connects to the ground affects flood risk and insurance.',
    types: {
      piles: {
        name: 'Piles/Stilts',
        description: 'Deep posts driven into ground. Home elevated above flood level.',
        floodPerformance: 'Best - water flows underneath',
        insuranceImpact: 'Lowest flood premiums',
      },
      piers: {
        name: 'Piers',
        description: 'Concrete blocks on footings supporting the structure.',
        floodPerformance: 'Good - allows water flow',
        insuranceImpact: 'Lower premiums',
      },
      crawl: {
        name: 'Crawl Space',
        description: 'Short enclosed area beneath home.',
        floodPerformance: 'Moderate - needs flood vents',
        insuranceImpact: 'Moderate premiums',
      },
      slab: {
        name: 'Slab',
        description: 'Concrete pad directly on ground.',
        floodPerformance: 'Poor - traps water',
        insuranceImpact: 'Higher premiums',
      },
      basement: {
        name: 'Basement',
        description: 'Below-grade living or storage space.',
        floodPerformance: 'Worst - collects water',
        insuranceImpact: 'Highest premiums, limited coverage',
      },
    }
  },
  
  // Roof Types
  roof: {
    title: 'Roof Type',
    description: 'Your roof is your first defense against wind and rain.',
    types: {
      metal: {
        name: 'Metal Standing Seam',
        windRating: 'Up to 180 mph',
        lifespan: '40-70 years',
        insuranceImpact: 'Best wind credits',
      },
      tile: {
        name: 'Tile (Clay/Concrete)',
        windRating: 'Up to 150 mph',
        lifespan: '50+ years',
        insuranceImpact: 'Good wind credits',
      },
      architectural: {
        name: 'Architectural Shingle',
        windRating: 'Up to 130 mph',
        lifespan: '25-30 years',
        insuranceImpact: 'Moderate credits',
      },
      '3tab': {
        name: '3-Tab Shingle',
        windRating: '60-70 mph',
        lifespan: '15-20 years',
        insuranceImpact: 'Minimal credits',
      },
    }
  },
  
  // Programs
  programs: {
    blueAcres: {
      title: 'Blue Acres Buyout Program',
      agency: 'NJ DEP',
      description: 'Voluntary program that purchases flood-prone homes at fair market value.',
      eligibility: 'Properties in floodways or with repetitive flood damage.',
      link: 'https://dep.nj.gov/blueacres/',
    },
    fma: {
      title: 'Flood Mitigation Assistance (FMA)',
      agency: 'FEMA',
      description: 'Grants for elevation, floodproofing, or buyout of flood-damaged properties.',
      eligibility: 'NFIP-insured properties with flood history.',
      funding: 'Up to 100% for severe repetitive loss properties.',
      link: 'https://www.fema.gov/grants/mitigation/floods',
    },
    hmgp: {
      title: 'Hazard Mitigation Grant Program',
      agency: 'FEMA',
      description: 'Post-disaster funding for mitigation projects.',
      eligibility: 'Properties in declared disaster areas.',
      link: 'https://www.fema.gov/grants/mitigation/hazard-mitigation',
    },
  }
};

// =============================================================================
// ASSESSMENT QUESTIONS - With full cause/effect
// =============================================================================

const QUESTIONS = [
  {
    id: 'elevationCert',
    question: 'Do you have an Elevation Certificate?',
    helpText: EDUCATION.elevationCert.description,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      yes: {
        type: 'positive',
        title: 'Great! This is your most important flood document.',
        insurance: 'Your insurer can rate your policy accurately - you\'re likely getting proper rates.',
        compliance: 'You have documentation needed for any permitted work.',
        action: null,
      },
      no: {
        type: 'negative',
        title: 'You\'re likely overpaying on flood insurance.',
        insurance: 'Without proof of elevation, insurers assume worst-case. Typically $500+/year extra.',
        compliance: 'You\'ll need one before any permitted improvements.',
        action: {
          text: 'Get an Elevation Certificate',
          cost: '$300-600',
          savings: '~$500/year',
          payback: 'Usually Year 1',
        },
      },
      unsure: {
        type: 'warning',
        title: 'Check your closing documents or ask your insurance agent.',
        insurance: 'If you have one, your insurer should have a copy on file.',
        compliance: 'Your mortgage company may also have a copy.',
        action: {
          text: 'Contact your insurance agent to check',
          cost: 'Free',
        },
      },
    },
    scoring: { yes: 15, no: 0, unsure: 5 },
    savingsImpact: { yes: 500, no: 0, unsure: 0 },
  },
  {
    id: 'elevationVsBFE',
    question: 'How high is your lowest floor compared to the Base Flood Elevation?',
    helpText: 'The BFE is the expected flood level. Your elevation relative to it is the biggest factor in flood insurance cost.',
    options: [
      { value: 'above4', label: '4+ feet above BFE' },
      { value: 'above2', label: '2-4 feet above BFE' },
      { value: 'at', label: 'At or near BFE' },
      { value: 'below', label: 'Below BFE' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      above4: {
        type: 'positive',
        title: 'Excellent! You meet or exceed CAFE requirements.',
        insurance: 'You qualify for the best flood insurance rates.',
        compliance: 'Your home meets current NJ standards for new construction.',
        action: null,
      },
      above2: {
        type: 'positive',
        title: 'Good elevation with solid flood protection.',
        insurance: 'You\'re getting favorable rates, though not the lowest possible.',
        compliance: 'Above minimum requirements.',
        action: null,
      },
      at: {
        type: 'warning',
        title: 'You\'re at the minimum standard.',
        insurance: 'Moderate rates. Room for improvement.',
        compliance: 'Meets minimum but not CAFE freeboard requirement.',
        action: {
          text: 'Consider elevation if doing major renovations',
          note: 'May qualify for FEMA elevation grants',
        },
      },
      below: {
        type: 'negative',
        title: 'Higher flood risk and insurance costs.',
        insurance: 'Significantly higher premiums. Each foot below BFE increases cost.',
        compliance: 'Major renovations will trigger requirement to elevate.',
        action: {
          text: 'Explore elevation options and grant programs',
          note: 'FMA grants can cover up to 100% for qualifying properties',
        },
      },
      unsure: {
        type: 'warning',
        title: 'Your Elevation Certificate will show this.',
        insurance: 'This is the #1 factor in your flood insurance cost.',
        action: {
          text: 'Get an Elevation Certificate to find out',
          cost: '$300-600',
        },
      },
    },
    scoring: { above4: 20, above2: 15, at: 8, below: 0, unsure: 5 },
    savingsImpact: { above4: 1200, above2: 800, at: 300, below: 0, unsure: 0 },
  },
  {
    id: 'foundation',
    question: 'What type of foundation does your home have?',
    helpText: EDUCATION.foundation.description,
    options: [
      { value: 'piles', label: 'Piles/Stilts' },
      { value: 'piers', label: 'Piers' },
      { value: 'crawl', label: 'Crawl Space' },
      { value: 'slab', label: 'Slab' },
      { value: 'basement', label: 'Basement' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      piles: {
        type: 'positive',
        title: 'Ideal foundation for flood zones.',
        insurance: 'Best rates - water flows underneath without structural damage.',
        compliance: 'Required for new construction in VE zones.',
        action: null,
      },
      piers: {
        type: 'positive',
        title: 'Good flood-resistant foundation.',
        insurance: 'Favorable rates due to elevated structure.',
        compliance: 'Acceptable in most flood zones.',
        action: null,
      },
      crawl: {
        type: 'warning',
        title: 'Acceptable if properly vented.',
        insurance: 'Moderate rates. Flood vents can improve rating.',
        compliance: 'Must have proper flood vents in flood zones.',
        action: {
          text: 'Ensure you have adequate flood vents',
          note: 'Need 1 sq inch per 1 sq foot of enclosed area',
        },
      },
      slab: {
        type: 'warning',
        title: 'Common but less flood-resistant.',
        insurance: 'Higher premiums due to flood exposure.',
        compliance: 'May need modifications if substantially improved.',
        action: {
          text: 'Consider flood barriers or elevation for major renovations',
        },
      },
      basement: {
        type: 'negative',
        title: 'Highest flood risk foundation type.',
        insurance: 'Highest premiums. Contents coverage limited below ground.',
        compliance: 'Basements not permitted in new construction in V zones.',
        action: {
          text: 'Consider converting to storage only, no mechanicals',
          note: 'Relocate HVAC, electrical, valuables above flood level',
        },
      },
      unsure: {
        type: 'warning',
        title: 'Look at how your home meets the ground.',
        insurance: 'Foundation type affects your insurance rating.',
        action: {
          text: 'Check your property records or ask a contractor',
        },
      },
    },
    scoring: { piles: 15, piers: 12, crawl: 8, slab: 4, basement: 0, unsure: 4 },
    savingsImpact: { piles: 600, piers: 400, crawl: 200, slab: 0, basement: 0, unsure: 0 },
  },
  {
    id: 'roofType',
    question: 'What type of roof do you have and how old is it?',
    helpText: 'Your roof protects against wind damage - the other major shore home risk.',
    options: [
      { value: 'metal_new', label: 'Metal (under 15 years)' },
      { value: 'metal_old', label: 'Metal (15+ years)' },
      { value: 'shingle_new', label: 'Shingle (under 10 years)' },
      { value: 'shingle_old', label: 'Shingle (10+ years)' },
      { value: 'tile', label: 'Tile' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      metal_new: {
        type: 'positive',
        title: 'Best wind protection available.',
        insurance: 'Maximum wind mitigation credits. Up to 180mph rating.',
        compliance: 'Exceeds all wind code requirements.',
        action: null,
      },
      metal_old: {
        type: 'positive',
        title: 'Excellent protection, monitor for wear.',
        insurance: 'Still qualifies for wind credits.',
        compliance: 'Good standing.',
        action: {
          text: 'Have roof inspected if over 20 years',
        },
      },
      shingle_new: {
        type: 'positive',
        title: 'Good protection, standard choice.',
        insurance: 'Moderate wind credits if architectural shingles.',
        compliance: 'Meets code requirements.',
        action: null,
      },
      shingle_old: {
        type: 'warning',
        title: 'May be nearing end of useful life.',
        insurance: 'Some insurers won\'t cover roofs over 15-20 years.',
        compliance: 'May need replacement before selling.',
        action: {
          text: 'Get roof inspection, plan for replacement',
          note: 'Consider upgrade to metal when replacing',
        },
      },
      tile: {
        type: 'positive',
        title: 'Durable with good wind resistance.',
        insurance: 'Good wind credits. Long lifespan.',
        compliance: 'Exceeds most requirements.',
        action: null,
      },
      unsure: {
        type: 'warning',
        title: 'Roof type affects your wind insurance significantly.',
        insurance: 'Could be missing credits you deserve.',
        action: {
          text: 'Check your records or have a roofer assess',
        },
      },
    },
    scoring: { metal_new: 15, metal_old: 12, shingle_new: 10, shingle_old: 5, tile: 12, unsure: 5 },
    savingsImpact: { metal_new: 600, metal_old: 500, shingle_new: 300, shingle_old: 100, tile: 400, unsure: 0 },
  },
  {
    id: 'improvements',
    question: 'Are you planning any home improvements in the next 12 months?',
    helpText: 'Major improvements can trigger the 50% rule, requiring full code compliance.',
    options: [
      { value: 'major', label: 'Yes, major renovation ($50k+)' },
      { value: 'moderate', label: 'Yes, moderate updates ($10-50k)' },
      { value: 'minor', label: 'Minor repairs only' },
      { value: 'none', label: 'No plans' },
    ],
    effects: {
      major: {
        type: 'warning',
        title: 'Important: Check the 50% rule before starting.',
        insurance: 'Good time to add mitigation features for credits.',
        compliance: 'If total improvements exceed 50% of home value in 10 years, full code compliance required.',
        action: {
          text: 'Consult building department BEFORE starting work',
          note: 'Legacy window ends July 2026 - permits before then use previous standards',
          urgent: true,
        },
      },
      moderate: {
        type: 'info',
        title: 'Track your improvement costs carefully.',
        insurance: 'Opportunity to add mitigation features.',
        compliance: 'Cumulative improvements count toward 50% threshold.',
        action: {
          text: 'Keep records of all improvement costs',
          note: 'Consider adding flood vents, upgrading electrical panel placement',
        },
      },
      minor: {
        type: 'positive',
        title: 'Routine maintenance keeps your home protected.',
        insurance: 'No impact expected.',
        compliance: 'Minor repairs typically don\'t require permits.',
        action: null,
      },
      none: {
        type: 'positive',
        title: 'Good to know your current status.',
        insurance: 'Focus on documentation like Elevation Certificate if missing.',
        compliance: 'No immediate concerns.',
        action: null,
      },
    },
    scoring: { major: 0, moderate: 0, minor: 0, none: 0 },
    savingsImpact: { major: 0, moderate: 0, minor: 0, none: 0 },
  },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

// Info Popup Component
const InfoPopup = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-4 text-slate-300 space-y-3">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Effect Card - Shows cause/effect after selection
const EffectCard = ({ effect }) => {
  if (!effect) return null;
  
  const colors = {
    positive: 'border-emerald-500/50 bg-emerald-500/10',
    negative: 'border-red-500/50 bg-red-500/10',
    warning: 'border-amber-500/50 bg-amber-500/10',
    info: 'border-cyan-500/50 bg-cyan-500/10',
  };
  
  const icons = {
    positive: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    negative: <AlertTriangle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 p-4 rounded-xl border ${colors[effect.type]}`}
    >
      <div className="flex items-start gap-3">
        {icons[effect.type]}
        <div className="flex-1">
          <p className="font-medium text-white mb-2">{effect.title}</p>
          
          {effect.insurance && (
            <div className="mb-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">💰 Insurance Impact</p>
              <p className="text-sm text-slate-300">{effect.insurance}</p>
            </div>
          )}
          
          {effect.compliance && (
            <div className="mb-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">📋 Compliance</p>
              <p className="text-sm text-slate-300">{effect.compliance}</p>
            </div>
          )}
          
          {effect.action && (
            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">✅ Recommended Action</p>
              <p className="text-sm text-white font-medium">{effect.action.text}</p>
              {effect.action.cost && (
                <p className="text-xs text-slate-400 mt-1">
                  Cost: {effect.action.cost}
                  {effect.action.savings && ` → Saves: ${effect.action.savings}`}
                  {effect.action.payback && ` (${effect.action.payback})`}
                </p>
              )}
              {effect.action.note && (
                <p className="text-xs text-cyan-400 mt-1">{effect.action.note}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Score Gauge
const ScoreGauge = ({ score, size = 'large' }) => {
  const sizes = {
    small: { width: 100, height: 60, stroke: 10, fontSize: 'text-xl' },
    large: { width: 200, height: 120, stroke: 14, fontSize: 'text-4xl' },
  };
  const s = sizes[size];
  
  const getColor = (score) => {
    if (score >= 70) return { color: '#10b981', label: 'Well Protected' };
    if (score >= 50) return { color: '#22d3ee', label: 'Moderate' };
    if (score >= 30) return { color: '#f59e0b', label: 'Needs Attention' };
    return { color: '#ef4444', label: 'At Risk' };
  };
  
  const { color, label } = getColor(score);
  const radius = (s.width - s.stroke) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={s.width} height={s.height} className="overflow-visible">
        <path
          d={`M ${s.stroke/2} ${s.height} A ${radius} ${radius} 0 0 1 ${s.width - s.stroke/2} ${s.height}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth={s.stroke}
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${s.stroke/2} ${s.height} A ${radius} ${radius} 0 0 1 ${s.width - s.stroke/2} ${s.height}`}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <text
          x={s.width / 2}
          y={s.height - 8}
          textAnchor="middle"
          className={`${s.fontSize} font-bold fill-white`}
        >
          {score}
        </text>
      </svg>
      <p className="text-sm font-medium mt-2" style={{ color }}>{label}</p>
      <p className="text-xs text-slate-500">Resilience Score</p>
    </div>
  );
};

// =============================================================================
// SHORE TOWNS DATA
// =============================================================================
const SHORE_TOWNS = [
  { name: 'Asbury Park', zip: '07712', county: 'Monmouth' },
  { name: 'Atlantic City', zip: '08401', county: 'Atlantic' },
  { name: 'Avalon', zip: '08202', county: 'Cape May' },
  { name: 'Avon-by-the-Sea', zip: '07717', county: 'Monmouth' },
  { name: 'Barnegat', zip: '08005', county: 'Ocean' },
  { name: 'Barnegat Light', zip: '08006', county: 'Ocean' },
  { name: 'Bay Head', zip: '08742', county: 'Ocean' },
  { name: 'Beach Haven', zip: '08008', county: 'Ocean' },
  { name: 'Belmar', zip: '07719', county: 'Monmouth' },
  { name: 'Bradley Beach', zip: '07720', county: 'Monmouth' },
  { name: 'Brick', zip: '08723', county: 'Ocean' },
  { name: 'Brigantine', zip: '08203', county: 'Atlantic' },
  { name: 'Cape May', zip: '08204', county: 'Cape May' },
  { name: 'Cape May Point', zip: '08212', county: 'Cape May' },
  { name: 'Deal', zip: '07723', county: 'Monmouth' },
  { name: 'Highlands', zip: '07732', county: 'Monmouth' },
  { name: 'Island Heights', zip: '08732', county: 'Ocean' },
  { name: 'Keansburg', zip: '07734', county: 'Monmouth' },
  { name: 'Lavallette', zip: '08735', county: 'Ocean' },
  { name: 'Little Egg Harbor', zip: '08087', county: 'Ocean' },
  { name: 'Long Beach Township', zip: '08008', county: 'Ocean' },
  { name: 'Long Branch', zip: '07740', county: 'Monmouth' },
  { name: 'Longport', zip: '08403', county: 'Atlantic' },
  { name: 'Manasquan', zip: '08736', county: 'Monmouth' },
  { name: 'Mantoloking', zip: '08738', county: 'Ocean' },
  { name: 'Margate City', zip: '08402', county: 'Atlantic' },
  { name: 'Monmouth Beach', zip: '07750', county: 'Monmouth' },
  { name: 'Neptune', zip: '07753', county: 'Monmouth' },
  { name: 'North Wildwood', zip: '08260', county: 'Cape May' },
  { name: 'Ocean City', zip: '08226', county: 'Cape May' },
  { name: 'Ocean Gate', zip: '08740', county: 'Ocean' },
  { name: 'Ocean Grove', zip: '07756', county: 'Monmouth' },
  { name: 'Pine Beach', zip: '08741', county: 'Ocean' },
  { name: 'Point Pleasant', zip: '08742', county: 'Ocean' },
  { name: 'Point Pleasant Beach', zip: '08742', county: 'Ocean' },
  { name: 'Rumson', zip: '07760', county: 'Monmouth' },
  { name: 'Sea Bright', zip: '07760', county: 'Monmouth' },
  { name: 'Sea Girt', zip: '08750', county: 'Monmouth' },
  { name: 'Sea Isle City', zip: '08243', county: 'Cape May' },
  { name: 'Seaside Heights', zip: '08751', county: 'Ocean' },
  { name: 'Seaside Park', zip: '08752', county: 'Ocean' },
  { name: 'Ship Bottom', zip: '08008', county: 'Ocean' },
  { name: 'Spring Lake', zip: '07762', county: 'Monmouth' },
  { name: 'Spring Lake Heights', zip: '07762', county: 'Monmouth' },
  { name: 'Stone Harbor', zip: '08247', county: 'Cape May' },
  { name: 'Surf City', zip: '08008', county: 'Ocean' },
  { name: 'Toms River', zip: '08753', county: 'Ocean' },
  { name: 'Tuckerton', zip: '08087', county: 'Ocean' },
  { name: 'Ventnor City', zip: '08406', county: 'Atlantic' },
  { name: 'West Wildwood', zip: '08260', county: 'Cape May' },
  { name: 'Wildwood', zip: '08260', county: 'Cape May' },
  { name: 'Wildwood Crest', zip: '08260', county: 'Cape May' },
].sort((a, b) => a.name.localeCompare(b.name));

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

export default function ShoreHomeScore() {
  // App state
  const [step, setStep] = useState('landing'); // landing, assessment, results, dashboard
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Property data
  const [selectedTown, setSelectedTown] = useState(null);
  const [streetAddress, setStreetAddress] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Assessment answers
  const [answers, setAnswers] = useState({});
  
  // UI state
  const [showInfo, setShowInfo] = useState(null);
  const [townSearch, setTownSearch] = useState('');
  const [showTownDropdown, setShowTownDropdown] = useState(false);
  const [openSections, setOpenSections] = useState({
    actions: true,
    programs: true,
    compliance: false,
    insurance: false,
  });
  
  // Legacy window calculation
  const LEGACY_WINDOW_END = new Date('2026-07-15');
  const legacyDaysLeft = Math.max(0, Math.ceil((LEGACY_WINDOW_END - new Date()) / (1000 * 60 * 60 * 24)));
  
  // Filter towns based on search
  const filteredTowns = SHORE_TOWNS.filter(t => 
    t.name.toLowerCase().includes(townSearch.toLowerCase())
  );
  
  // Lookup address
  const lookupAddress = async () => {
    if (!selectedTown || !streetAddress.trim()) {
      setError('Please select a town and enter your street address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const fullAddress = `${streetAddress}, ${selectedTown.name}, NJ ${selectedTown.zip}`;
    
    try {
      const res = await fetch(`/api/fema-lookup?address=${encodeURIComponent(fullAddress)}&zipCode=${selectedTown.zip}`);
      const data = await res.json();
      
      if (data.success) {
        setPropertyData({
          address: data.matchedAddress || fullAddress,
          coordinates: data.coordinates,
          floodZone: data.floodZone,
          bfe: data.bfe && data.bfe > 0 ? data.bfe : null,
          zoneSubtype: data.zoneSubtype,
          town: selectedTown,
        });
        setStep('assessment');
      } else {
        setError('Could not find that address. Please check the street address and try again.');
      }
    } catch (e) {
      setError('Unable to look up address. Please try again.');
    }
    
    setLoading(false);
  };
  
  // Calculate score
  const score = useMemo(() => {
    let total = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      if (answer && q.scoring[answer]) {
        total += q.scoring[answer];
      }
    });
    // Add points for good flood zone
    if (propertyData?.floodZone === 'X') total += 15;
    else if (propertyData?.floodZone === 'AE') total += 5;
    
    return Math.min(Math.round(total), 100);
  }, [answers, propertyData]);
  
  // Calculate savings
  const potentialSavings = useMemo(() => {
    let total = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      if (answer && q.savingsImpact[answer]) {
        total += q.savingsImpact[answer];
      }
    });
    return total;
  }, [answers]);
  
  // Calculate missed savings
  const missedSavings = useMemo(() => {
    let total = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      const maxSavings = Math.max(...Object.values(q.savingsImpact));
      const currentSavings = answer ? (q.savingsImpact[answer] || 0) : 0;
      total += maxSavings - currentSavings;
    });
    return total;
  }, [answers]);

  // ===========================================
  // LANDING PAGE
  // ===========================================
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6 border border-cyan-500/30">
              <Shield className="w-4 h-4" />
              ShoreHomeScore
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Is Your Shore Home Protected?
            </h1>
            <p className="text-slate-400 text-lg">
              Find out your flood zone, compliance status, and insurance savings potential in 2 minutes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6"
          >
            {/* Town Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select your town
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedTown ? selectedTown.name : townSearch}
                  onChange={(e) => {
                    setTownSearch(e.target.value);
                    setSelectedTown(null);
                    setShowTownDropdown(true);
                  }}
                  onFocus={() => setShowTownDropdown(true)}
                  placeholder="Search NJ Shore towns..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                
                {/* Town Dropdown */}
                <AnimatePresence>
                  {showTownDropdown && filteredTowns.length > 0 && !selectedTown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl max-h-64 overflow-y-auto"
                    >
                      {filteredTowns.slice(0, 10).map(town => (
                        <button
                          key={`${town.name}-${town.zip}`}
                          onClick={() => {
                            setSelectedTown(town);
                            setTownSearch('');
                            setShowTownDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-slate-700 text-white flex items-center justify-between border-b border-slate-700 last:border-0"
                        >
                          <span>{town.name}</span>
                          <span className="text-xs text-slate-400">{town.county} County</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {selectedTown && (
                <p className="text-xs text-cyan-400 mt-2">
                  ✓ {selectedTown.name}, NJ {selectedTown.zip} ({selectedTown.county} County)
                </p>
              )}
            </div>
            
            {/* Street Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Street address
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && lookupAddress()}
                placeholder="123 Ocean Ave"
                disabled={!selectedTown}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            {/* Submit Button */}
            <button
              onClick={lookupAddress}
              disabled={loading || !selectedTown || !streetAddress.trim()}
              className="w-full px-6 py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Looking up flood data...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check My Property
                </>
              )}
            </button>
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            {[
              { icon: MapPin, label: 'FEMA Flood Data' },
              { icon: DollarSign, label: 'Insurance Impact' },
              { icon: FileText, label: 'Compliance Check' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-slate-400">
                <Icon className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                <p className="text-xs">{label}</p>
              </div>
            ))}
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-slate-600 text-xs mt-8"
          >
            Covering 50+ NJ Shore communities • Powered by FEMA NFHL
          </motion.p>
        </div>
      </div>
    );
  }

  // ===========================================
  // ASSESSMENT PAGE
  // ===========================================
  if (step === 'assessment') {
    const question = QUESTIONS[currentQuestion];
    const answer = answers[question.id];
    const effect = answer ? question.effects[answer] : null;
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header with property info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{propertyData?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  propertyData?.floodZone?.startsWith('V') ? 'bg-red-500/20 text-red-400' :
                  propertyData?.floodZone?.startsWith('A') ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  Zone {propertyData?.floodZone}
                </span>
                <button
                  onClick={() => setShowInfo('floodZone')}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </p>
          </div>
          
          {/* Question Card */}
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{question.question}</h2>
              <button
                onClick={() => setShowInfo(question.id)}
                className="p-2 hover:bg-slate-700 rounded-lg flex-shrink-0"
              >
                <HelpCircle className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
            
            <p className="text-slate-400 text-sm mb-6">{question.helpText}</p>
            
            {/* Options */}
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnswers(prev => ({ ...prev, [question.id]: option.value }))}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    answer === option.value
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {answer === option.value && <Check className="w-5 h-5 text-cyan-400" />}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Effect Card */}
            <AnimatePresence>
              {effect && <EffectCard effect={effect} />}
            </AnimatePresence>
          </motion.div>
          
          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(prev => prev - 1);
                } else {
                  setStep('landing');
                  setPropertyData(null);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <button
              onClick={() => {
                if (currentQuestion < QUESTIONS.length - 1) {
                  setCurrentQuestion(prev => prev + 1);
                } else {
                  setStep('results');
                }
              }}
              disabled={!answer}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-xl font-medium transition-colors"
            >
              {currentQuestion < QUESTIONS.length - 1 ? 'Next' : 'See Results'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Info Popup for Flood Zone */}
        <InfoPopup
          title="Flood Zone Explained"
          isOpen={showInfo === 'floodZone'}
          onClose={() => setShowInfo(null)}
        >
          {propertyData?.floodZone && EDUCATION.floodZone.zones[propertyData.floodZone] && (
            <>
              <p className="font-medium text-white">
                {EDUCATION.floodZone.zones[propertyData.floodZone].name}
              </p>
              <p>{EDUCATION.floodZone.zones[propertyData.floodZone].description}</p>
              <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase mb-1">Requirements</p>
                <p className="text-sm">{EDUCATION.floodZone.zones[propertyData.floodZone].requirements}</p>
              </div>
              <div className="mt-2 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase mb-1">Insurance</p>
                <p className="text-sm">{EDUCATION.floodZone.zones[propertyData.floodZone].insurance}</p>
              </div>
            </>
          )}
        </InfoPopup>
        
        {/* Info Popup for Questions */}
        <InfoPopup
          title={question.question}
          isOpen={showInfo === question.id}
          onClose={() => setShowInfo(null)}
        >
          <p>{question.helpText}</p>
          {question.id === 'elevationCert' && (
            <>
              <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase mb-1">Why It Matters</p>
                <p className="text-sm">{EDUCATION.elevationCert.whyItMatters}</p>
              </div>
              <div className="mt-2 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase mb-1">How to Get One</p>
                <p className="text-sm">{EDUCATION.elevationCert.howToGet}</p>
              </div>
            </>
          )}
          {question.id === 'improvements' && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-400 uppercase mb-1">⚠️ 50% Rule Warning</p>
              <p className="text-sm">{EDUCATION.fiftyPercentRule.description}</p>
            </div>
          )}
        </InfoPopup>
      </div>
    );
  }

  // ===========================================
  // RESULTS PAGE
  // ===========================================
  if (step === 'results') {
    const actionItems = QUESTIONS
      .filter(q => answers[q.id] && q.effects[answers[q.id]]?.action)
      .map(q => ({
        question: q.question,
        ...q.effects[answers[q.id]].action,
        type: q.effects[answers[q.id]].type,
      }));
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>{propertyData?.address}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Your Results</h1>
          </div>
          
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              <ScoreGauge score={score} />
              
              <div className="text-center md:text-left">
                <div className="mb-4">
                  <p className="text-slate-400 text-sm">Current Savings</p>
                  <p className="text-3xl font-bold text-emerald-400">${potentialSavings.toLocaleString()}/yr</p>
                </div>
                {missedSavings > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm">Potential Additional Savings</p>
                    <p className="text-2xl font-bold text-amber-400">+${missedSavings.toLocaleString()}/yr</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Property Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6"
          >
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              Property Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Flood Zone</p>
                <p className="text-lg font-bold text-white">{propertyData?.floodZone}</p>
              </div>
              {propertyData?.bfe && (
                <div>
                  <p className="text-xs text-slate-400 uppercase">Base Flood Elevation</p>
                  <p className="text-lg font-bold text-white">{propertyData.bfe} ft</p>
                </div>
              )}
              {propertyData?.bfe && (
                <div>
                  <p className="text-xs text-slate-400 uppercase">CAFE Requirement</p>
                  <p className="text-lg font-bold text-white">{propertyData.bfe + 4} ft</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 uppercase">Legacy Window</p>
                <p className="text-lg font-bold text-amber-400">{legacyDaysLeft} days left</p>
              </div>
            </div>
          </motion.div>
          
          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6"
          >
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Recommended Actions
            </h2>
            <div className="space-y-3">
              {QUESTIONS.map((q, i) => {
                const answer = answers[q.id];
                const effect = answer ? q.effects[answer] : null;
                if (!effect?.action) return null;
                
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      effect.type === 'negative' ? 'border-red-500/30 bg-red-500/5' :
                      effect.type === 'warning' ? 'border-amber-500/30 bg-amber-500/5' :
                      'border-slate-600 bg-slate-700/30'
                    }`}
                  >
                    <p className="font-medium text-white">{effect.action.text}</p>
                    {effect.action.cost && (
                      <p className="text-sm text-slate-400 mt-1">
                        Cost: {effect.action.cost}
                        {effect.action.savings && ` → Saves: ${effect.action.savings}`}
                      </p>
                    )}
                    {effect.action.note && (
                      <p className="text-sm text-cyan-400 mt-1">{effect.action.note}</p>
                    )}
                  </div>
                );
              })}
              
              {QUESTIONS.every(q => !answers[q.id] || !q.effects[answers[q.id]]?.action) && (
                <p className="text-slate-400 text-center py-4">
                  Great job! No immediate actions needed.
                </p>
              )}
            </div>
          </motion.div>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => setStep('dashboard')}
              className="flex-1 px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              View Full Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowInfo('save')}
              className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Lock className="w-5 h-5" />
              Save Report
            </button>
          </motion.div>
          
          <p className="text-center text-slate-500 text-sm mt-4">
            Dashboard access is free. Account required to save or export report.
          </p>
        </div>
        
        {/* Save Modal */}
        <InfoPopup
          title="Save Your Report"
          isOpen={showInfo === 'save'}
          onClose={() => setShowInfo(null)}
        >
          <p>Create a free account to:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Save your property assessment</li>
            <li>Download a PDF report</li>
            <li>Get deadline reminders</li>
            <li>Connect with contractors</li>
          </ul>
          <div className="mt-4 space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500"
            />
            <button className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium">
              Create Account
            </button>
          </div>
        </InfoPopup>
      </div>
    );
  }

  // ===========================================
  // DASHBOARD PAGE
  // ===========================================
  if (step === 'dashboard') {
    const toggleSection = (key) => {
      setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    // Collapsible Section Component
    const CollapsibleSection = ({ id, icon: Icon, title, badge, children }) => (
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white">{title}</span>
            {badge && (
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                {badge}
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openSections[id] ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {openSections[id] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 border-t border-slate-700">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

    // Get action items from answers
    const actionItems = QUESTIONS
      .filter(q => answers[q.id] && q.effects[answers[q.id]]?.action)
      .map(q => ({
        id: q.id,
        ...q.effects[answers[q.id]].action,
        type: q.effects[answers[q.id]].type,
      }));
    
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Sticky Header */}
        <header className="bg-slate-800/95 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setStep('results')}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-300" />
                </button>
                <div>
                  <h1 className="font-bold text-white text-sm">{propertyData?.address}</h1>
                  <p className="text-xs text-slate-400">Zone {propertyData?.floodZone} • BFE {propertyData?.bfe || '--'} ft</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-slate-700 rounded-full">
                  <span className="text-sm font-bold text-white">{score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 rounded-full">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">${potentialSavings.toLocaleString()}/yr</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center">
              <ScoreGauge score={score} />
            </div>
            <div className="md:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="font-bold text-white mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 uppercase">Flood Zone</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-white">{propertyData?.floodZone}</p>
                    <button onClick={() => setShowInfo('floodZone')} className="p-1 hover:bg-slate-600 rounded">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 uppercase">CAFE Required</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-white">{propertyData?.bfe ? `${propertyData.bfe + 4} ft` : '--'}</p>
                    <button onClick={() => setShowInfo('cafe')} className="p-1 hover:bg-slate-600 rounded">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 uppercase">Est. Annual Savings</p>
                  <p className="text-xl font-bold text-emerald-400">${potentialSavings.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 uppercase">Legacy Window</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-amber-400">{legacyDaysLeft} days</p>
                    <button onClick={() => setShowInfo('legacy')} className="p-1 hover:bg-slate-600 rounded">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Items */}
          {actionItems.length > 0 && (
            <CollapsibleSection 
              id="actions" 
              icon={Target} 
              title="Recommended Actions" 
              badge={`${actionItems.length} items`}
            >
              <div className="space-y-3 mt-3">
                {actionItems.map((item, i) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border ${
                      item.type === 'negative' ? 'border-red-500/30 bg-red-500/5' :
                      item.type === 'warning' ? 'border-amber-500/30 bg-amber-500/5' :
                      'border-slate-600 bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">{item.text}</p>
                        {item.cost && (
                          <p className="text-sm text-slate-400 mt-1">
                            💰 Cost: {item.cost}
                            {item.savings && <span className="text-emerald-400"> → Saves: {item.savings}</span>}
                            {item.payback && <span className="text-slate-500"> ({item.payback})</span>}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-sm text-cyan-400 mt-2">💡 {item.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}
          
          {/* Programs & Grants */}
          <CollapsibleSection 
            id="programs" 
            icon={DollarSign} 
            title="Programs & Grants You May Qualify For"
            badge="3 programs"
          >
            <div className="space-y-3 mt-3">
              {Object.entries(EDUCATION.programs).map(([key, program]) => (
                <div key={key} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{program.title}</p>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          {program.agency}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">{program.description}</p>
                      {program.eligibility && (
                        <p className="text-sm text-slate-300 mt-2">
                          <span className="text-slate-500">Eligibility:</span> {program.eligibility}
                        </p>
                      )}
                      {program.funding && (
                        <p className="text-sm text-emerald-400 mt-1">
                          <span className="text-slate-500">Funding:</span> {program.funding}
                        </p>
                      )}
                    </div>
                    <a
                      href={program.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium flex items-center gap-1 whitespace-nowrap"
                    >
                      Learn More
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
          
          {/* Compliance & Deadlines */}
          <CollapsibleSection 
            id="compliance" 
            icon={FileText} 
            title="Compliance & Deadlines"
          >
            <div className="space-y-3 mt-3">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <p className="font-medium text-white">Legacy Window Deadline</p>
                </div>
                <p className="text-sm text-slate-300">
                  Permits submitted before <span className="text-amber-400 font-medium">July 15, 2026</span> may use previous elevation standards.
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  After this date, all new construction and substantial improvements must meet CAFE requirements (BFE + 4 ft).
                </p>
                <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-400">{legacyDaysLeft} days remaining</p>
                </div>
              </div>
              
              <div className="p-4 rounded-xl border border-slate-600 bg-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="font-medium text-white">50% Rule (Substantial Improvement)</p>
                </div>
                <p className="text-sm text-slate-300">
                  If improvements exceed 50% of your home's market value in any 10-year period, the <span className="text-white font-medium">entire structure</span> must be brought up to current flood codes.
                </p>
                <p className="text-sm text-cyan-400 mt-2">
                  💡 Track your improvement costs carefully before starting major projects.
                </p>
              </div>
              
              {propertyData?.floodZone?.startsWith('V') && (
                <div className="p-4 rounded-xl border border-slate-600 bg-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <p className="font-medium text-white">VE Zone Requirements</p>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Breakaway walls required below BFE</li>
                    <li>• Open foundation (piles/piers) required</li>
                    <li>• No obstructions below elevated floor</li>
                    <li>• Mechanical equipment must be elevated</li>
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleSection>
          
          {/* Insurance Tips */}
          <CollapsibleSection 
            id="insurance" 
            icon={Shield} 
            title="Insurance Savings Tips"
          >
            <div className="space-y-3 mt-3">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <p className="font-medium text-white mb-2">Ways to Lower Your Premium</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300"><span className="text-white">Get an Elevation Certificate</span> - Often saves $500+/year</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300"><span className="text-white">Elevate above BFE</span> - Each foot above saves hundreds</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300"><span className="text-white">Install flood vents</span> - Required for compliance, saves on premiums</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300"><span className="text-white">Shop private insurers</span> - May offer better rates than NFIP</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl border border-slate-600 bg-slate-700/30">
                <p className="font-medium text-white mb-2">NFIP vs Private Insurance</p>
                <p className="text-sm text-slate-300">
                  The National Flood Insurance Program (NFIP) is government-backed, but private insurers may offer competitive rates, especially for lower-risk properties.
                </p>
                <p className="text-sm text-cyan-400 mt-2">
                  💡 Get quotes from both to compare coverage and cost.
                </p>
              </div>
            </div>
          </CollapsibleSection>
          
          {/* Save CTA */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white">Save Your Assessment</p>
                <p className="text-sm text-slate-400">Create a free account to save your data and get deadline reminders</p>
              </div>
              <button
                onClick={() => setShowInfo('save')}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium whitespace-nowrap"
              >
                Save & Get Report
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center py-6 text-sm text-slate-500">
            <p>ShoreHomeScore • Flood data from FEMA NFHL</p>
            <p className="mt-1">For informational purposes only. Consult professionals for specific advice.</p>
          </div>
        </main>
        
        {/* Info Popups */}
        <InfoPopup
          title="Flood Zone Explained"
          isOpen={showInfo === 'floodZone'}
          onClose={() => setShowInfo(null)}
        >
          {propertyData?.floodZone && EDUCATION.floodZone.zones[propertyData.floodZone] && (
            <>
              <p className="font-medium text-white">
                {EDUCATION.floodZone.zones[propertyData.floodZone].name}
              </p>
              <p className="mt-2">{EDUCATION.floodZone.zones[propertyData.floodZone].description}</p>
              <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase mb-1">Requirements</p>
                <p className="text-sm">{EDUCATION.floodZone.zones[propertyData.floodZone].requirements}</p>
              </div>
              <div className="mt-2 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase mb-1">Insurance</p>
                <p className="text-sm">{EDUCATION.floodZone.zones[propertyData.floodZone].insurance}</p>
              </div>
            </>
          )}
        </InfoPopup>
        
        <InfoPopup
          title="CAFE Requirement"
          isOpen={showInfo === 'cafe'}
          onClose={() => setShowInfo(null)}
        >
          <p>{EDUCATION.cafe.description}</p>
          <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 uppercase mb-1">Impact</p>
            <p className="text-sm">{EDUCATION.cafe.impact}</p>
          </div>
          <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-400 uppercase mb-1">Deadline</p>
            <p className="text-sm">{EDUCATION.cafe.deadline}</p>
          </div>
        </InfoPopup>
        
        <InfoPopup
          title="Legacy Window"
          isOpen={showInfo === 'legacy'}
          onClose={() => setShowInfo(null)}
        >
          <p>The legacy window allows permits submitted before July 15, 2026 to use previous elevation standards.</p>
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-2xl font-bold text-amber-400">{legacyDaysLeft} days remaining</p>
          </div>
          <p className="mt-3 text-sm">After this date, all new construction and substantial improvements must meet CAFE requirements (BFE + 4 ft).</p>
          <p className="mt-2 text-sm text-cyan-400">💡 If you're planning major renovations, consider applying for permits before the deadline.</p>
        </InfoPopup>
        
        <InfoPopup
          title="Save Your Report"
          isOpen={showInfo === 'save'}
          onClose={() => setShowInfo(null)}
        >
          <p>Create a free account to:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Save your property assessment</li>
            <li>Download a PDF report</li>
            <li>Get deadline reminders</li>
            <li>Connect with contractors</li>
          </ul>
          <div className="mt-4 space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500"
            />
            <button className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium">
              Create Account
            </button>
          </div>
        </InfoPopup>
      </div>
    );
  }

  return null;
}
