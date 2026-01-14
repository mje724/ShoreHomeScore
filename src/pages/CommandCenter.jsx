import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, FileText, AlertTriangle,
  CheckCircle, ChevronRight, ChevronDown, DollarSign, MapPin,
  X, HelpCircle, ArrowRight, ArrowLeft, Info, Clock, Target,
  Zap, TrendingUp, ExternalLink, Mail, Lock, Building, Search,
  Check, AlertCircle, Loader
} from 'lucide-react';

// =============================================================================
// SHORE TOWNS DATA - Our source of truth
// =============================================================================
const SHORE_TOWNS = [
  { name: 'Asbury Park', zip: '07712', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Atlantic City', zip: '08401', county: 'Atlantic', bfe: 9, zone: 'VE' },
  { name: 'Avalon', zip: '08202', county: 'Cape May', bfe: 10, zone: 'VE' },
  { name: 'Avon-by-the-Sea', zip: '07717', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Barnegat', zip: '08005', county: 'Ocean', bfe: 6, zone: 'AE' },
  { name: 'Barnegat Light', zip: '08006', county: 'Ocean', bfe: 10, zone: 'VE' },
  { name: 'Bay Head', zip: '08742', county: 'Ocean', bfe: 9, zone: 'AE' },
  { name: 'Beach Haven', zip: '08008', county: 'Ocean', bfe: 10, zone: 'VE' },
  { name: 'Belmar', zip: '07719', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Bradley Beach', zip: '07720', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Brick', zip: '08723', county: 'Ocean', bfe: 7, zone: 'AE' },
  { name: 'Brigantine', zip: '08203', county: 'Atlantic', bfe: 9, zone: 'VE' },
  { name: 'Cape May', zip: '08204', county: 'Cape May', bfe: 10, zone: 'VE' },
  { name: 'Cape May Point', zip: '08212', county: 'Cape May', bfe: 11, zone: 'VE' },
  { name: 'Deal', zip: '07723', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { name: 'Highlands', zip: '07732', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { name: 'Island Heights', zip: '08732', county: 'Ocean', bfe: 8, zone: 'AE' },
  { name: 'Keansburg', zip: '07734', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { name: 'Lavallette', zip: '08735', county: 'Ocean', bfe: 10, zone: 'VE' },
  { name: 'Little Egg Harbor', zip: '08087', county: 'Ocean', bfe: 7, zone: 'AE' },
  { name: 'Long Beach Island', zip: '08008', county: 'Ocean', bfe: 10, zone: 'VE' },
  { name: 'Long Branch', zip: '07740', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Longport', zip: '08403', county: 'Atlantic', bfe: 9, zone: 'VE' },
  { name: 'Manasquan', zip: '08736', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Mantoloking', zip: '08738', county: 'Ocean', bfe: 11, zone: 'VE' },
  { name: 'Margate City', zip: '08402', county: 'Atlantic', bfe: 8, zone: 'AE' },
  { name: 'Monmouth Beach', zip: '07750', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { name: 'Neptune', zip: '07753', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { name: 'North Wildwood', zip: '08260', county: 'Cape May', bfe: 10, zone: 'VE' },
  { name: 'Ocean City', zip: '08226', county: 'Cape May', bfe: 9, zone: 'AE' },
  { name: 'Ocean Grove', zip: '07756', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Point Pleasant', zip: '08742', county: 'Ocean', bfe: 9, zone: 'AE' },
  { name: 'Point Pleasant Beach', zip: '08742', county: 'Ocean', bfe: 9, zone: 'AE' },
  { name: 'Rumson', zip: '07760', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { name: 'Sea Bright', zip: '07760', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { name: 'Sea Girt', zip: '08750', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Sea Isle City', zip: '08243', county: 'Cape May', bfe: 9, zone: 'VE' },
  { name: 'Seaside Heights', zip: '08751', county: 'Ocean', bfe: 10, zone: 'VE' },
  { name: 'Seaside Park', zip: '08752', county: 'Ocean', bfe: 10, zone: 'AE' },
  { name: 'Ship Bottom', zip: '08008', county: 'Ocean', bfe: 10, zone: 'VE' },
  { name: 'Spring Lake', zip: '07762', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { name: 'Spring Lake Heights', zip: '07762', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { name: 'Stone Harbor', zip: '08247', county: 'Cape May', bfe: 10, zone: 'VE' },
  { name: 'Surf City', zip: '08008', county: 'Ocean', bfe: 10, zone: 'VE' },
  { name: 'Toms River', zip: '08753', county: 'Ocean', bfe: 8, zone: 'AE' },
  { name: 'Tuckerton', zip: '08087', county: 'Ocean', bfe: 7, zone: 'AE' },
  { name: 'Ventnor City', zip: '08406', county: 'Atlantic', bfe: 8, zone: 'AE' },
  { name: 'Waretown', zip: '08758', county: 'Ocean', bfe: 6, zone: 'AE' },
  { name: 'West Wildwood', zip: '08260', county: 'Cape May', bfe: 8, zone: 'AE' },
  { name: 'Wildwood', zip: '08260', county: 'Cape May', bfe: 10, zone: 'VE' },
  { name: 'Wildwood Crest', zip: '08260', county: 'Cape May', bfe: 10, zone: 'VE' },
].sort((a, b) => a.name.localeCompare(b.name));

// =============================================================================
// EDUCATIONAL CONTENT
// =============================================================================
const EDUCATION = {
  floodZone: {
    VE: { name: 'VE - Coastal High Hazard', risk: 'high', description: 'Coastal area with wave action. Strictest building codes.', insurance: 'Required. Highest premiums.' },
    AE: { name: 'AE - High Risk', risk: 'high', description: 'High-risk flood area with established Base Flood Elevation.', insurance: 'Required for federally-backed mortgages.' },
    AO: { name: 'AO - Shallow Flooding', risk: 'moderate', description: 'Areas with 1-3 feet shallow flooding.', insurance: 'Required.' },
    X: { name: 'X - Moderate/Low Risk', risk: 'low', description: 'Minimal flood hazard area.', insurance: 'Not required but recommended.' },
  },
  bfe: {
    title: 'Base Flood Elevation (BFE)',
    description: 'The height floodwaters are expected to reach during a major flood. Your elevation relative to BFE is the #1 factor in flood insurance cost.',
  },
  cafe: {
    title: 'CAFE Requirement',
    description: 'NJ requires new construction to be BFE + 4 feet. This extra height provides safety margin and better insurance rates.',
  },
  legacy: {
    title: 'Legacy Window',
    description: 'Permits submitted before July 15, 2026 can use previous elevation standards. After that, stricter CAFE rules apply.',
  },
  programs: {
    blueAcres: { title: 'Blue Acres Buyout', agency: 'NJ DEP', description: 'Voluntary buyout of flood-prone homes at fair market value.', eligibility: 'Flood-prone properties with repetitive damage.', link: 'https://dep.nj.gov/blueacres/' },
    fma: { title: 'Flood Mitigation Assistance', agency: 'FEMA', description: 'Grants for elevation, floodproofing, or acquisition.', eligibility: 'NFIP-insured properties.', link: 'https://www.fema.gov/grants/mitigation/floods' },
    hmgp: { title: 'Hazard Mitigation Grant Program', agency: 'FEMA', description: 'Post-disaster mitigation funding.', eligibility: 'Properties in declared disaster areas.', link: 'https://www.fema.gov/grants/mitigation/hazard-mitigation' },
  }
};

// =============================================================================
// ASSESSMENT QUESTIONS
// =============================================================================
const QUESTIONS = [
  {
    id: 'elevationCert',
    question: 'Do you have an Elevation Certificate?',
    helpText: 'Official document showing your home\'s elevation vs flood level. Without one, insurers assume worst case.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      yes: { type: 'positive', title: 'Great! Your insurer can rate you accurately.', action: null },
      no: { type: 'negative', title: 'You\'re likely overpaying $500+/year.', action: { text: 'Get an Elevation Certificate', cost: '$300-600', savings: '~$500/yr', payback: 'Year 1' } },
      unsure: { type: 'warning', title: 'Check with your insurance agent - they may have one on file.', action: { text: 'Contact your insurance agent', cost: 'Free' } },
    },
    scoring: { yes: 15, no: 0, unsure: 5 },
    savingsImpact: { yes: 500, no: 0, unsure: 0 },
  },
  {
    id: 'elevationVsBFE',
    question: 'How high is your lowest floor compared to the Base Flood Elevation?',
    helpText: 'This is the #1 factor in your flood insurance premium. Each foot above BFE saves hundreds per year.',
    options: [
      { value: 'above4', label: '4+ feet above BFE' },
      { value: 'above2', label: '2-4 feet above' },
      { value: 'at', label: 'At or near BFE' },
      { value: 'below', label: 'Below BFE' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      above4: { type: 'positive', title: 'Excellent! You meet CAFE requirements and get the best rates.', action: null },
      above2: { type: 'positive', title: 'Good elevation with favorable insurance rates.', action: null },
      at: { type: 'warning', title: 'Meets minimum standard. Moderate rates.', action: { text: 'Consider elevation when renovating', note: 'May qualify for elevation grants' } },
      below: { type: 'negative', title: 'Higher flood risk and insurance costs.', action: { text: 'Explore elevation grants', note: 'FMA grants cover up to 100%' } },
      unsure: { type: 'warning', title: 'An Elevation Certificate will tell you exactly.', action: { text: 'Get an Elevation Certificate', cost: '$300-600' } },
    },
    scoring: { above4: 20, above2: 15, at: 8, below: 0, unsure: 5 },
    savingsImpact: { above4: 1200, above2: 800, at: 300, below: 0, unsure: 0 },
  },
  {
    id: 'foundation',
    question: 'What type of foundation does your home have?',
    helpText: 'Foundation type affects how water interacts with your home during floods.',
    options: [
      { value: 'piles', label: 'Piles/Stilts' },
      { value: 'piers', label: 'Piers' },
      { value: 'crawl', label: 'Crawl Space' },
      { value: 'slab', label: 'Slab' },
      { value: 'basement', label: 'Basement' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      piles: { type: 'positive', title: 'Ideal for flood zones. Water flows underneath.', action: null },
      piers: { type: 'positive', title: 'Good flood resistance.', action: null },
      crawl: { type: 'warning', title: 'Needs proper flood vents.', action: { text: 'Verify flood vents are installed', note: '1 sq in per 1 sq ft of enclosed area' } },
      slab: { type: 'warning', title: 'Limited flood resistance.', action: { text: 'Consider barriers for major renovations' } },
      basement: { type: 'negative', title: 'Highest risk. Limited coverage available.', action: { text: 'Relocate mechanicals above flood level' } },
      unsure: { type: 'warning', title: 'Check how your home meets the ground.', action: null },
    },
    scoring: { piles: 15, piers: 12, crawl: 8, slab: 4, basement: 0, unsure: 4 },
    savingsImpact: { piles: 600, piers: 400, crawl: 200, slab: 0, basement: 0, unsure: 0 },
  },
  {
    id: 'roofType',
    question: 'What type of roof do you have?',
    helpText: 'Roof type affects wind insurance premiums significantly.',
    options: [
      { value: 'metal', label: 'Metal' },
      { value: 'tile', label: 'Tile' },
      { value: 'shingle_new', label: 'Shingle (under 10 yrs)' },
      { value: 'shingle_old', label: 'Shingle (10+ yrs)' },
      { value: 'unsure', label: 'Not Sure' },
    ],
    effects: {
      metal: { type: 'positive', title: 'Best wind protection. Maximum insurance credits.', action: null },
      tile: { type: 'positive', title: 'Good wind resistance and longevity.', action: null },
      shingle_new: { type: 'positive', title: 'Good protection while newer.', action: null },
      shingle_old: { type: 'warning', title: 'May be nearing end of life.', action: { text: 'Get roof inspection', note: 'Consider metal when replacing' } },
      unsure: { type: 'warning', title: 'Check your records or have it inspected.', action: null },
    },
    scoring: { metal: 15, tile: 12, shingle_new: 10, shingle_old: 5, unsure: 5 },
    savingsImpact: { metal: 600, tile: 400, shingle_new: 300, shingle_old: 100, unsure: 0 },
  },
  {
    id: 'improvements',
    question: 'Planning any renovations in the next 12 months?',
    helpText: 'Major renovations can trigger the 50% rule, requiring full flood code compliance.',
    options: [
      { value: 'major', label: 'Yes, major ($50k+)' },
      { value: 'moderate', label: 'Yes, moderate ($10-50k)' },
      { value: 'minor', label: 'Minor/maintenance only' },
      { value: 'none', label: 'No plans' },
    ],
    effects: {
      major: { type: 'warning', title: '⚠️ Check the 50% rule before starting!', action: { text: 'Consult building department first', note: 'Legacy window ends July 2026', urgent: true } },
      moderate: { type: 'info', title: 'Track costs carefully toward 50% threshold.', action: { text: 'Keep records of all improvement costs' } },
      minor: { type: 'positive', title: 'Routine maintenance keeps you protected.', action: null },
      none: { type: 'positive', title: 'Good time to review your documentation.', action: null },
    },
    scoring: { major: 0, moderate: 0, minor: 0, none: 0 },
    savingsImpact: { major: 0, moderate: 0, minor: 0, none: 0 },
  },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

// Info Popup
const InfoPopup = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
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
        <div className="p-4 text-slate-300 space-y-3">{children}</div>
      </motion.div>
    </div>
  );
};

// Score Gauge
const ScoreGauge = ({ score }) => {
  const getColor = (s) => {
    if (s >= 70) return { color: '#10b981', label: 'Well Protected' };
    if (s >= 50) return { color: '#22d3ee', label: 'Moderate' };
    if (s >= 30) return { color: '#f59e0b', label: 'Needs Attention' };
    return { color: '#ef4444', label: 'At Risk' };
  };
  const { color, label } = getColor(score);
  const radius = 85;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={200} height={120} className="overflow-visible">
        <path d="M 15 110 A 85 85 0 0 1 185 110" fill="none" stroke="#1e293b" strokeWidth={14} strokeLinecap="round" />
        <motion.path
          d="M 15 110 A 85 85 0 0 1 185 110"
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <text x={100} y={95} textAnchor="middle" className="text-4xl font-bold fill-white">{score}</text>
      </svg>
      <p className="text-sm font-medium mt-1" style={{ color }}>{label}</p>
      <p className="text-xs text-slate-500">Resilience Score</p>
    </div>
  );
};

// Effect Card
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl border ${colors[effect.type]}`}>
      <div className="flex items-start gap-3">
        {icons[effect.type]}
        <div className="flex-1">
          <p className="font-medium text-white">{effect.title}</p>
          {effect.action && (
            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-white font-medium">→ {effect.action.text}</p>
              {effect.action.cost && (
                <p className="text-xs text-slate-400 mt-1">
                  Cost: {effect.action.cost}
                  {effect.action.savings && ` • Saves: ${effect.action.savings}`}
                  {effect.action.payback && ` • ${effect.action.payback}`}
                </p>
              )}
              {effect.action.note && <p className="text-xs text-cyan-400 mt-1">{effect.action.note}</p>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Collapsible Section
const CollapsibleSection = ({ icon: Icon, title, badge, isOpen, onToggle, children }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
    <button onClick={onToggle} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-cyan-400" />
        <span className="font-bold text-white">{title}</span>
        {badge && <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">{badge}</span>}
      </div>
      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-slate-700">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// =============================================================================
// MAIN APP
// =============================================================================
export default function ShoreHomeScore() {
  // Core state
  const [town, setTown] = useState(null);
  const [streetAddress, setStreetAddress] = useState('');
  const [propertyData, setPropertyData] = useState(null); // From FEMA lookup (optional)
  const [answers, setAnswers] = useState({});
  
  // UI state
  const [showTownSearch, setShowTownSearch] = useState(false);
  const [townSearchQuery, setTownSearchQuery] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showInfo, setShowInfo] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [openSections, setOpenSections] = useState({ actions: true, programs: true, compliance: false, insurance: false });

  // Derived data - uses FEMA data if available, otherwise town defaults
  const floodZone = propertyData?.floodZone || town?.zone || '--';
  const bfe = propertyData?.bfe || town?.bfe || null;
  const cafe = bfe ? bfe + 4 : null;
  
  // Legacy window
  const LEGACY_WINDOW_END = new Date('2026-07-15');
  const legacyDaysLeft = Math.max(0, Math.ceil((LEGACY_WINDOW_END - new Date()) / (1000 * 60 * 60 * 24)));

  // Filtered towns for search
  const filteredTowns = SHORE_TOWNS.filter(t =>
    t.name.toLowerCase().includes(townSearchQuery.toLowerCase())
  );

  // Score calculation
  const score = useMemo(() => {
    let total = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      if (answer && q.scoring[answer]) total += q.scoring[answer];
    });
    if (floodZone === 'X') total += 15;
    else if (floodZone === 'AE') total += 5;
    return Math.min(Math.round(total), 100);
  }, [answers, floodZone]);

  // Savings calculation
  const savings = useMemo(() => {
    let total = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      if (answer && q.savingsImpact[answer]) total += q.savingsImpact[answer];
    });
    return total;
  }, [answers]);

  // Action items from answers
  const actionItems = useMemo(() => {
    return QUESTIONS
      .filter(q => answers[q.id] && q.effects[answers[q.id]]?.action)
      .map(q => ({ id: q.id, ...q.effects[answers[q.id]].action, type: q.effects[answers[q.id]].type }));
  }, [answers]);

  // Address lookup (optional)
  const lookupAddress = async () => {
    if (!town || !streetAddress.trim()) return;
    setAddressLoading(true);
    setAddressError(null);
    
    try {
      const fullAddress = `${streetAddress}, ${town.name}, NJ ${town.zip}`;
      const res = await fetch(`/api/fema-lookup?address=${encodeURIComponent(fullAddress)}`);
      const data = await res.json();
      
      if (data.success && data.floodZone) {
        setPropertyData({
          address: data.matchedAddress || fullAddress,
          floodZone: data.floodZone,
          bfe: data.bfe > 0 ? data.bfe : null,
        });
      } else {
        setAddressError('Could not find exact data. Using town defaults.');
      }
    } catch (e) {
      setAddressError('Lookup failed. Using town defaults.');
    }
    setAddressLoading(false);
  };

  // Select town
  const selectTown = (t) => {
    setTown(t);
    setShowTownSearch(false);
    setTownSearchQuery('');
    setPropertyData(null); // Clear FEMA data, will use town defaults
  };

  // ===========================================
  // RENDER
  // ===========================================
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="font-bold text-white">ShoreHomeScore</h1>
                {town && <p className="text-xs text-slate-400">{town.name}, NJ</p>}
              </div>
            </div>
            {town && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-slate-700 rounded-full">
                  <span className="text-sm font-bold text-white">{score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                {savings > 0 && (
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-500/20 rounded-full">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">${savings.toLocaleString()}/yr</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Town Selection */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Select your town</label>
          <div className="relative">
            <button
              onClick={() => setShowTownSearch(!showTownSearch)}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-left flex items-center justify-between hover:border-slate-500 transition-colors"
            >
              <span className={town ? 'text-white' : 'text-slate-500'}>
                {town ? `${town.name}, NJ ${town.zip}` : 'Choose a town...'}
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showTownSearch ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showTownSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-30 overflow-hidden"
                >
                  <div className="p-2 border-b border-slate-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={townSearchQuery}
                        onChange={(e) => setTownSearchQuery(e.target.value)}
                        placeholder="Search towns..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredTowns.map((t) => (
                      <button
                        key={t.name + t.zip}
                        onClick={() => selectTown(t)}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center justify-between ${town?.name === t.name ? 'bg-cyan-500/10' : ''}`}
                      >
                        <div>
                          <p className="text-white font-medium">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.county} County • {t.zip}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${t.zone.startsWith('V') ? 'text-red-400' : t.zone === 'AE' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            Zone {t.zone}
                          </p>
                          <p className="text-xs text-slate-500">BFE {t.bfe} ft</p>
                        </div>
                      </button>
                    ))}
                    {filteredTowns.length === 0 && (
                      <p className="px-4 py-3 text-slate-400 text-sm">No towns found</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Property Stats - Only show if town selected */}
        {town && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400 uppercase">Flood Zone</p>
                <button onClick={() => setShowInfo('floodZone')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className={`text-2xl font-bold ${floodZone.startsWith('V') ? 'text-red-400' : floodZone === 'AE' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {floodZone}
              </p>
              {propertyData && <p className="text-xs text-cyan-400 mt-1">Exact</p>}
              {!propertyData && town && <p className="text-xs text-slate-500 mt-1">Town typical</p>}
            </div>
            
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400 uppercase">BFE</p>
                <button onClick={() => setShowInfo('bfe')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-2xl font-bold text-white">{bfe || '--'} <span className="text-sm font-normal text-slate-400">ft</span></p>
            </div>
            
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400 uppercase">CAFE Req</p>
                <button onClick={() => setShowInfo('cafe')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-2xl font-bold text-white">{cafe || '--'} <span className="text-sm font-normal text-slate-400">ft</span></p>
            </div>
            
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400 uppercase">Legacy</p>
                <button onClick={() => setShowInfo('legacy')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-2xl font-bold text-amber-400">{legacyDaysLeft} <span className="text-sm font-normal text-slate-400">days</span></p>
            </div>
          </motion.div>
        )}

        {/* Optional Address Lookup */}
        {town && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"
          >
            <p className="text-sm text-slate-300 mb-2">
              Want exact data for your property? <span className="text-slate-500">(optional)</span>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && lookupAddress()}
                placeholder="Street address (e.g., 123 Ocean Ave)"
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm"
              />
              <button
                onClick={lookupAddress}
                disabled={addressLoading || !streetAddress.trim()}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-slate-700 text-cyan-400 disabled:text-slate-500 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {addressLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Look Up
              </button>
            </div>
            {addressError && <p className="text-amber-400 text-xs mt-2">{addressError}</p>}
            {propertyData && <p className="text-emerald-400 text-xs mt-2">✓ Using exact data for {propertyData.address}</p>}
          </motion.div>
        )}

        {/* Score + Assessment */}
        {town && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center">
              <ScoreGauge score={score} />
              {savings > 0 && (
                <p className="text-emerald-400 font-medium mt-3">${savings.toLocaleString()}/yr savings</p>
              )}
            </div>
            
            <div className="md:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="font-bold text-white mb-4">Quick Assessment</h2>
              
              {/* Current Question */}
              {currentQuestion < QUESTIONS.length ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-400">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
                    <button onClick={() => setShowInfo(`q-${currentQuestion}`)} className="p-1 hover:bg-slate-700 rounded">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                  <p className="text-white font-medium mb-3">{QUESTIONS[currentQuestion].question}</p>
                  <div className="flex flex-wrap gap-2">
                    {QUESTIONS[currentQuestion].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, [QUESTIONS[currentQuestion].id]: opt.value }));
                          if (currentQuestion < QUESTIONS.length - 1) {
                            setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          answers[QUESTIONS[currentQuestion].id] === opt.value
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Effect feedback */}
                  {answers[QUESTIONS[currentQuestion].id] && (
                    <EffectCard effect={QUESTIONS[currentQuestion].effects[answers[QUESTIONS[currentQuestion].id]]} />
                  )}
                  
                  {/* Navigation */}
                  <div className="flex justify-between mt-4 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestion === 0}
                      className="text-sm text-slate-400 hover:text-white disabled:opacity-50"
                    >
                      ← Back
                    </button>
                    {answers[QUESTIONS[currentQuestion].id] && currentQuestion < QUESTIONS.length - 1 && (
                      <button
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        Next →
                      </button>
                    )}
                    {currentQuestion === QUESTIONS.length - 1 && answers[QUESTIONS[currentQuestion].id] && (
                      <button
                        onClick={() => setCurrentQuestion(QUESTIONS.length)}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-sm font-medium"
                      >
                        See Full Results
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-medium">Assessment Complete!</p>
                  <p className="text-slate-400 text-sm mt-1">See your full results below</p>
                  <button
                    onClick={() => setCurrentQuestion(0)}
                    className="text-cyan-400 text-sm mt-3 hover:underline"
                  >
                    Retake Assessment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Sections - Show when assessment complete */}
        {town && currentQuestion >= QUESTIONS.length && (
          <>
            {/* Action Items */}
            {actionItems.length > 0 && (
              <CollapsibleSection
                icon={Target}
                title="Recommended Actions"
                badge={`${actionItems.length} items`}
                isOpen={openSections.actions}
                onToggle={() => setOpenSections(prev => ({ ...prev, actions: !prev.actions }))}
              >
                <div className="space-y-3 mt-3">
                  {actionItems.map((item) => (
                    <div key={item.id} className={`p-4 rounded-xl border ${
                      item.type === 'negative' ? 'border-red-500/30 bg-red-500/5' :
                      item.type === 'warning' ? 'border-amber-500/30 bg-amber-500/5' :
                      'border-slate-600 bg-slate-700/30'
                    }`}>
                      <p className="font-medium text-white">{item.text}</p>
                      {item.cost && (
                        <p className="text-sm text-slate-400 mt-1">
                          Cost: {item.cost}
                          {item.savings && <span className="text-emerald-400"> → Saves: {item.savings}</span>}
                        </p>
                      )}
                      {item.note && <p className="text-sm text-cyan-400 mt-1">💡 {item.note}</p>}
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Programs */}
            <CollapsibleSection
              icon={DollarSign}
              title="Programs & Grants"
              badge="3 programs"
              isOpen={openSections.programs}
              onToggle={() => setOpenSections(prev => ({ ...prev, programs: !prev.programs }))}
            >
              <div className="space-y-3 mt-3">
                {Object.entries(EDUCATION.programs).map(([key, prog]) => (
                  <div key={key} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{prog.title}</p>
                        <p className="text-xs text-cyan-400">{prog.agency}</p>
                        <p className="text-sm text-slate-400 mt-2">{prog.description}</p>
                        {prog.eligibility && <p className="text-sm text-slate-300 mt-1">Eligibility: {prog.eligibility}</p>}
                      </div>
                      <a href={prog.link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm whitespace-nowrap flex items-center gap-1">
                        Learn More <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Compliance */}
            <CollapsibleSection
              icon={FileText}
              title="Compliance & Deadlines"
              isOpen={openSections.compliance}
              onToggle={() => setOpenSections(prev => ({ ...prev, compliance: !prev.compliance }))}
            >
              <div className="space-y-3 mt-3">
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                  <p className="font-medium text-white mb-2">⏰ Legacy Window</p>
                  <p className="text-sm text-slate-300">Permits before <span className="text-amber-400 font-medium">July 15, 2026</span> can use previous standards.</p>
                  <p className="text-2xl font-bold text-amber-400 mt-2">{legacyDaysLeft} days left</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-600 bg-slate-700/30">
                  <p className="font-medium text-white mb-2">⚠️ 50% Rule</p>
                  <p className="text-sm text-slate-300">If improvements exceed 50% of home value in 10 years, full flood code compliance is required.</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Insurance Tips */}
            <CollapsibleSection
              icon={Shield}
              title="Insurance Tips"
              isOpen={openSections.insurance}
              onToggle={() => setOpenSections(prev => ({ ...prev, insurance: !prev.insurance }))}
            >
              <div className="space-y-3 mt-3">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                  <p className="font-medium text-white mb-3">Ways to Lower Your Premium</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300"><CheckCircle className="w-4 h-4 text-emerald-400 inline mr-2" />Get an Elevation Certificate</p>
                    <p className="text-slate-300"><CheckCircle className="w-4 h-4 text-emerald-400 inline mr-2" />Elevate above BFE</p>
                    <p className="text-slate-300"><CheckCircle className="w-4 h-4 text-emerald-400 inline mr-2" />Install flood vents</p>
                    <p className="text-slate-300"><CheckCircle className="w-4 h-4 text-emerald-400 inline mr-2" />Shop private insurers</p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}

        {/* No town selected state */}
        {!town && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Select a town above to get started</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6 text-sm text-slate-500">
          <p>ShoreHomeScore • Data from FEMA NFHL</p>
          <p className="mt-1">For informational purposes only.</p>
        </div>
      </main>

      {/* Info Popups */}
      <InfoPopup title="Flood Zone" isOpen={showInfo === 'floodZone'} onClose={() => setShowInfo(null)}>
        {EDUCATION.floodZone[floodZone] && (
          <>
            <p className="font-medium text-white">{EDUCATION.floodZone[floodZone].name}</p>
            <p className="mt-2">{EDUCATION.floodZone[floodZone].description}</p>
            <p className="mt-2 text-cyan-400">{EDUCATION.floodZone[floodZone].insurance}</p>
          </>
        )}
      </InfoPopup>
      
      <InfoPopup title="Base Flood Elevation" isOpen={showInfo === 'bfe'} onClose={() => setShowInfo(null)}>
        <p>{EDUCATION.bfe.description}</p>
      </InfoPopup>
      
      <InfoPopup title="CAFE Requirement" isOpen={showInfo === 'cafe'} onClose={() => setShowInfo(null)}>
        <p>{EDUCATION.cafe.description}</p>
      </InfoPopup>
      
      <InfoPopup title="Legacy Window" isOpen={showInfo === 'legacy'} onClose={() => setShowInfo(null)}>
        <p>{EDUCATION.legacy.description}</p>
        <p className="text-2xl font-bold text-amber-400 mt-3">{legacyDaysLeft} days remaining</p>
      </InfoPopup>
      
      {QUESTIONS.map((q, i) => (
        <InfoPopup key={q.id} title={q.question} isOpen={showInfo === `q-${i}`} onClose={() => setShowInfo(null)}>
          <p>{q.helpText}</p>
        </InfoPopup>
      ))}
    </div>
  );
}
