import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, FileText, AlertTriangle,
  CheckCircle, ChevronRight, ChevronDown, DollarSign, MapPin,
  X, HelpCircle, ArrowRight, ArrowLeft, Info, Clock, Target,
  Zap, TrendingUp, ExternalLink, Building, Search,
  Check, AlertCircle, Loader, Thermometer, TreePine, Scale,
  Cpu, Waves, Umbrella, Lock, Mail, Download
} from 'lucide-react';

// =============================================================================
// SHORE TOWNS DATA
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
// CATEGORIES WITH ITEMS - Each has toggles OR selectable options
// =============================================================================
const CATEGORIES = [
  {
    id: 'legalShield',
    name: 'Legal Shield',
    subtitle: 'Documentation',
    icon: Scale,
    color: 'purple',
    maxPoints: 500,
    items: [
      { id: 'elevationCert', label: 'Elevation Certificate', type: 'toggle', points: 150, helpText: 'Official document showing your home\'s elevation relative to BFE. Without one, insurers assume worst case and charge maximum rates.' },
      { id: 'preImprovementAppraisal', label: 'Pre-Improvement Appraisal', type: 'toggle', points: 100, helpText: 'Documented home value before renovations. Critical for 50% rule compliance - proves your starting point.' },
      { id: 'permitsCompleted', label: 'All Permits Closed', type: 'toggle', points: 100, helpText: 'All construction permits properly closed with final inspections. Open permits can delay sales and insurance claims.' },
      { id: 'floodZoneLOMA', label: 'Flood Zone LOMA', type: 'toggle', points: 75, helpText: 'Letter of Map Amendment - official FEMA determination that your property is actually in a lower-risk zone than mapped.' },
      { id: 'insuranceAudit', label: 'Insurance Coverage Audit', type: 'toggle', points: 75, helpText: 'Professional review ensuring your coverage matches your actual risk and home value. Often finds savings or gaps.' },
    ]
  },
  {
    id: 'vitalSystems',
    name: 'Vital Systems',
    subtitle: 'Equipment protection',
    icon: Zap,
    color: 'yellow',
    maxPoints: 600,
    items: [
      { 
        id: 'hvacLocation', 
        label: 'HVAC Location', 
        type: 'select',
        helpText: 'Location of your heating/cooling equipment. Ground-level units are destroyed in floods.',
        options: [
          { value: 'ground', label: 'Ground Level', sublabel: 'At risk of flood damage', points: 0 },
          { value: 'elevated', label: 'Elevated (+4ft)', sublabel: 'Protected from flooding', points: 300 },
        ]
      },
      { id: 'elevatedElectrical', label: 'Elevated Electrical Panel', type: 'toggle', points: 150, helpText: 'Main electrical panel raised above flood level. Prevents electrocution hazard and costly rewiring after floods.' },
      { id: 'elevatedWaterHeater', label: 'Elevated Water Heater', type: 'toggle', points: 75, helpText: 'Water heater raised above flood level or tankless unit mounted high on wall.' },
      { id: 'generatorSwitch', label: 'Generator Transfer Switch', type: 'toggle', points: 75, helpText: 'Safely connect a generator during power outages without backfeeding the grid.' },
    ]
  },
  {
    id: 'siteDefense',
    name: 'Site Defense',
    subtitle: 'Drainage & landscaping',
    icon: TreePine,
    color: 'green',
    maxPoints: 400,
    items: [
      { 
        id: 'drivewaySurface', 
        label: 'Driveway Surface', 
        type: 'select',
        helpText: 'Permeable surfaces let water drain into ground instead of running toward your home.',
        options: [
          { value: 'asphalt', label: 'Asphalt/Concrete', sublabel: 'Water runs off toward home', points: 0 },
          { value: 'permeable', label: 'Permeable Pavers', sublabel: 'Water drains into ground', points: 150 },
        ]
      },
      { id: 'rainGarden', label: 'Rain Garden', type: 'toggle', points: 100, helpText: 'Landscaped depression that collects and absorbs stormwater runoff.' },
      { id: 'frenchDrain', label: 'French Drain System', type: 'toggle', points: 75, helpText: 'Underground drainage that redirects water away from your foundation.' },
      { id: 'yardGrading', label: 'Proper Yard Grading', type: 'toggle', points: 75, helpText: 'Ground slopes away from foundation, directing water away from the home.' },
    ]
  },
  {
    id: 'thermalShield',
    name: 'Thermal Shield',
    subtitle: 'Energy efficiency',
    icon: Thermometer,
    color: 'orange',
    maxPoints: 500,
    items: [
      { id: 'atticInsulation', label: 'R-60 Attic Insulation', type: 'toggle', points: 150, helpText: 'High R-value attic insulation reduces energy costs and may qualify for utility rebates.' },
      { id: 'wallInsulation', label: 'Wall Insulation', type: 'toggle', points: 100, helpText: 'Insulated exterior walls improve energy efficiency and comfort.' },
      { id: 'continuousInsulation', label: 'Continuous Exterior Insulation', type: 'toggle', points: 150, helpText: 'Foam board or similar on exterior walls eliminates thermal bridging.' },
      { id: 'airSealing', label: 'Professional Air Sealing', type: 'toggle', points: 100, helpText: 'Sealing gaps and cracks throughout the home to prevent air leakage.' },
    ]
  },
  {
    id: 'activeDefense',
    name: 'Active Defense',
    subtitle: 'Smart technology',
    icon: Cpu,
    color: 'pink',
    maxPoints: 500,
    items: [
      { id: 'smartWaterShutoff', label: 'Smart Water Shutoff', type: 'toggle', points: 125, helpText: 'Automatically shuts off water when leak is detected. Can prevent catastrophic water damage.' },
      { id: 'leakSensors', label: 'Leak Sensors', type: 'toggle', points: 75, helpText: 'Sensors near water heater, washing machine, under sinks alert you to leaks early.' },
      { id: 'wholeBattery', label: 'Whole-Home Battery', type: 'toggle', points: 200, helpText: 'Battery backup system keeps critical systems running during outages.' },
      { id: 'floodMonitor', label: 'Flood Level Monitor', type: 'toggle', points: 100, helpText: 'Sensor that monitors nearby water levels and alerts you to rising flood risk.' },
    ]
  },
  {
    id: 'floodArmor',
    name: 'Flood Armor',
    subtitle: 'Flood protection',
    icon: Waves,
    color: 'cyan',
    maxPoints: 600,
    items: [
      { 
        id: 'foundationType', 
        label: 'Foundation Type', 
        type: 'select',
        helpText: 'Foundation determines how water interacts with your home during floods.',
        options: [
          { value: 'basement', label: 'Basement', sublabel: 'Highest flood risk', points: 0 },
          { value: 'slab', label: 'Slab on Grade', sublabel: 'Some flood exposure', points: 50 },
          { value: 'crawl', label: 'Crawl Space', sublabel: 'Moderate protection', points: 100 },
          { value: 'piles', label: 'Piles/Stilts', sublabel: 'Best flood protection', points: 200 },
        ]
      },
      { id: 'floodVents', label: 'Engineered Flood Vents', type: 'toggle', points: 150, helpText: 'ICC-certified vents that automatically allow water to flow through enclosed areas, equalizing pressure.' },
      { id: 'breakawayWalls', label: 'Breakaway Walls', type: 'toggle', points: 100, helpText: 'Walls designed to collapse under wave action without damaging main structure. Required in V zones.' },
      { id: 'floodResistantMaterials', label: 'Flood-Resistant Materials', type: 'toggle', points: 100, helpText: 'Concrete, tile, marine-grade plywood below flood level instead of drywall and carpet.' },
      { id: 'backflowValve', label: 'Sewer Backflow Valve', type: 'toggle', points: 50, helpText: 'Prevents sewage from backing up into your home during floods.' },
    ]
  },
  {
    id: 'windShield',
    name: 'Wind Shield',
    subtitle: 'Storm protection',
    icon: Wind,
    color: 'blue',
    maxPoints: 700,
    items: [
      { 
        id: 'roofType', 
        label: 'Roof Type', 
        type: 'select',
        helpText: 'Roof material significantly affects wind resistance and insurance premiums.',
        options: [
          { value: '3tab', label: '3-Tab Shingle', sublabel: 'Basic protection', points: 50 },
          { value: 'architectural', label: 'Architectural Shingle', sublabel: 'Good wind rating', points: 100 },
          { value: 'metal', label: 'Metal Standing Seam', sublabel: 'Excellent protection', points: 200 },
        ]
      },
      { 
        id: 'roofAge', 
        label: 'Roof Age', 
        type: 'select',
        helpText: 'Newer roofs have better wind resistance. Many insurers won\'t cover roofs over 15-20 years.',
        options: [
          { value: 'old', label: '15+ years', sublabel: 'May need replacement', points: 0 },
          { value: 'mid', label: '5-15 years', sublabel: 'Good condition', points: 75 },
          { value: 'new', label: 'Under 5 years', sublabel: 'Maximum credits', points: 150 },
        ]
      },
      { id: 'hipRoof', label: 'Hip Roof (4 slopes)', type: 'toggle', points: 100, helpText: 'Hip roofs perform significantly better in high winds than gable roofs.' },
      { id: 'impactWindows', label: 'Impact-Rated Windows', type: 'toggle', points: 150, helpText: 'Windows rated to withstand wind-borne debris. Major insurance credit.' },
      { id: 'reinforcedGarage', label: 'Reinforced Garage Door', type: 'toggle', points: 100, helpText: 'Wind-rated garage door prevents the most common point of structural failure.' },
    ]
  },
];

// =============================================================================
// EDUCATIONAL CONTENT
// =============================================================================
const EDUCATION = {
  floodZone: {
    VE: { name: 'VE - Coastal High Hazard', risk: 'high', description: 'Coastal area with wave action. Strictest building codes.', insurance: 'Required. Highest premiums.' },
    AE: { name: 'AE - High Risk', risk: 'high', description: 'High-risk flood area with established BFE.', insurance: 'Required for federally-backed mortgages.' },
    X: { name: 'X - Moderate/Low Risk', risk: 'low', description: 'Minimal flood hazard.', insurance: 'Not required but recommended.' },
  },
  programs: {
    blueAcres: { title: 'Blue Acres Buyout', agency: 'NJ DEP', description: 'Voluntary buyout of flood-prone homes.', link: 'https://dep.nj.gov/blueacres/' },
    fma: { title: 'Flood Mitigation Assistance', agency: 'FEMA', description: 'Grants for elevation and floodproofing.', link: 'https://www.fema.gov/grants/mitigation/floods' },
    hmgp: { title: 'Hazard Mitigation Grant', agency: 'FEMA', description: 'Post-disaster mitigation funding.', link: 'https://www.fema.gov/grants/mitigation/hazard-mitigation' },
  }
};

// Color mappings
const COLORS = {
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: 'bg-purple-500/30' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: 'bg-yellow-500/30' },
  green: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: 'bg-emerald-500/30' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: 'bg-orange-500/30' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', icon: 'bg-pink-500/30' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: 'bg-cyan-500/30' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'bg-blue-500/30' },
};

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
        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-4 text-slate-300">{children}</div>
      </motion.div>
    </div>
  );
};

// Toggle Switch
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-600'}`}
  >
    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

// Score Gauge
const ScoreGauge = ({ score, maxScore = 100 }) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const getColor = (p) => {
    if (p >= 70) return '#10b981';
    if (p >= 50) return '#22d3ee';
    if (p >= 30) return '#f59e0b';
    return '#ef4444';
  };
  const color = getColor(percentage);
  const radius = 85;
  const circumference = Math.PI * radius;
  const progress = (percentage / 100) * circumference;

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
          transition={{ duration: 0.5 }}
        />
        <text x={100} y={85} textAnchor="middle" className="text-4xl font-bold fill-white">{Math.round(score)}</text>
        <text x={100} y={108} textAnchor="middle" className="text-sm fill-slate-400">/ {maxScore}</text>
      </svg>
    </div>
  );
};

// =============================================================================
// MAIN APP
// =============================================================================
export default function ShoreHomeScore() {
  // Core state
  const [town, setTown] = useState(null);
  const [streetAddress, setStreetAddress] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  
  // All field values stored as object
  const [values, setValues] = useState({});
  
  // Email/unlock state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // UI state
  const [showTownSearch, setShowTownSearch] = useState(false);
  const [townSearchQuery, setTownSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [showInfo, setShowInfo] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);

  // Derived data
  const floodZone = propertyData?.floodZone || town?.zone || '--';
  const bfe = propertyData?.bfe || town?.bfe || null;
  const cafe = bfe ? bfe + 4 : null;
  
  // Legacy window
  const LEGACY_WINDOW_END = new Date('2026-07-15');
  const legacyDaysLeft = Math.max(0, Math.ceil((LEGACY_WINDOW_END - new Date()) / (1000 * 60 * 60 * 24)));

  // Filtered towns
  const filteredTowns = SHORE_TOWNS.filter(t =>
    t.name.toLowerCase().includes(townSearchQuery.toLowerCase())
  );

  // Calculate points per category
  const categoryScores = useMemo(() => {
    const scores = {};
    CATEGORIES.forEach(cat => {
      let earned = 0;
      cat.items.forEach(item => {
        if (item.type === 'toggle') {
          if (values[item.id]) earned += item.points;
        } else if (item.type === 'select') {
          const selected = values[item.id];
          const option = item.options?.find(o => o.value === selected);
          if (option) earned += option.points;
        }
      });
      scores[cat.id] = { earned, max: cat.maxPoints };
    });
    return scores;
  }, [values]);

  // Total score
  const totalScore = useMemo(() => {
    return Object.values(categoryScores).reduce((sum, cat) => sum + cat.earned, 0);
  }, [categoryScores]);

  const maxScore = useMemo(() => {
    return CATEGORIES.reduce((sum, cat) => sum + cat.maxPoints, 0);
  }, []);

  // Toggle category open/closed - requires unlock
  const toggleCategory = (catId) => {
    if (!isUnlocked) {
      setShowEmailModal(true);
      return;
    }
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Update a value - requires unlock
  const setValue = (id, val) => {
    if (!isUnlocked) {
      setShowEmailModal(true);
      return;
    }
    setValues(prev => ({ ...prev, [id]: val }));
  };
  
  // Handle email submit - sends to our API
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    // Send to our API (logs to Vercel dashboard)
    try {
      await fetch('/api/collect-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          town: town?.name || 'Unknown',
          floodZone: floodZone,
        }),
      });
    } catch (err) {
      // Don't block user if API fails
      console.error('Email API error:', err);
    }
    
    // Always unlock (don't lose user even if API fails)
    localStorage.setItem('shs_unlocked', 'true');
    localStorage.setItem('shs_email', email);
    setIsUnlocked(true);
    setShowEmailModal(false);
    setEmailError('');
  };
  
  // Check localStorage on mount for returning users
  React.useEffect(() => {
    const wasUnlocked = localStorage.getItem('shs_unlocked');
    if (wasUnlocked === 'true') {
      setIsUnlocked(true);
      setEmail(localStorage.getItem('shs_email') || '');
    }
  }, []);

  // Address lookup
  const lookupAddress = async () => {
    if (!town || !streetAddress.trim()) return;
    setAddressLoading(true);
    setAddressError(null);
    try {
      const fullAddress = `${streetAddress}, ${town.name}, NJ ${town.zip}`;
      const res = await fetch(`/api/fema-lookup?address=${encodeURIComponent(fullAddress)}`);
      const data = await res.json();
      if (data.success && data.floodZone) {
        setPropertyData({ address: data.matchedAddress || fullAddress, floodZone: data.floodZone, bfe: data.bfe > 0 ? data.bfe : null });
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
    setPropertyData(null);
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
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">{Math.round((totalScore / maxScore) * 100)}</p>
                  <p className="text-xs text-slate-400">/ 100</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        
        {/* Town Selection */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Select your town</label>
          <div className="relative">
            <button
              onClick={() => setShowTownSearch(!showTownSearch)}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-left flex items-center justify-between hover:border-slate-500"
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
                          <p className={`text-xs font-medium ${t.zone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>Zone {t.zone}</p>
                          <p className="text-xs text-slate-500">BFE {t.bfe} ft</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Property Stats */}
        {town && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400">Flood Zone</p>
                <button onClick={() => setShowInfo('floodZone')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className={`text-2xl font-bold ${floodZone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>{floodZone}</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400">BFE</p>
                <button onClick={() => setShowInfo('bfe')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-2xl font-bold text-white">{bfe || '--'} <span className="text-sm font-normal text-slate-400">ft</span></p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400">CAFE Req</p>
                <button onClick={() => setShowInfo('cafe')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-2xl font-bold text-white">{cafe || '--'} <span className="text-sm font-normal text-slate-400">ft</span></p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400">Legacy Window</p>
                <button onClick={() => setShowInfo('legacy')} className="p-1 hover:bg-slate-700 rounded">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-2xl font-bold text-amber-400">{legacyDaysLeft} <span className="text-sm font-normal text-slate-400">days</span></p>
            </div>
          </div>
        )}

        {/* Optional Address Lookup */}
        {town && (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <p className="text-sm text-slate-300 mb-2">
              Want exact flood data? <span className="text-slate-500">(optional)</span>
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
              <button onClick={lookupAddress} disabled={addressLoading} className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium">
                {addressLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Look Up'}
              </button>
            </div>
            {addressError && <p className="text-amber-400 text-xs mt-2">{addressError}</p>}
            {propertyData && <p className="text-emerald-400 text-xs mt-2">✓ Using exact data for {propertyData.address}</p>}
          </div>
        )}

        {/* Score Overview */}
        {town && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <ScoreGauge score={Math.round((totalScore / maxScore) * 100)} maxScore={100} />
              <div className="text-right">
                <p className="text-slate-400 text-sm mb-1">Resilience Score</p>
                <p className="text-3xl font-bold text-white">{Math.round((totalScore / maxScore) * 100)}<span className="text-lg text-slate-400">/100</span></p>
                <p className="text-slate-500 text-sm">{totalScore} of {maxScore} pts earned</p>
              </div>
            </div>
          </div>
        )}

        {/* Unlock Teaser - shows when locked */}
        {town && !isUnlocked && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Unlock Your Full Assessment</p>
                  <p className="text-sm text-slate-400">Enter your email to customize your resilience score</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-medium text-sm"
              >
                Unlock Free
              </button>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {town && CATEGORIES.map(cat => {
          const colors = COLORS[cat.color];
          const catScore = categoryScores[cat.id];
          const isOpen = openCategories[cat.id];
          const progressPercent = (catScore.earned / catScore.max) * 100;
          const Icon = cat.icon;

          return (
            <div key={cat.id} className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden ${!isUnlocked ? 'opacity-80' : ''}`}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-700/50 transition-colors"
              >
                <div className={`p-3 rounded-xl ${colors.icon}`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white">{cat.name}</p>
                  <p className="text-sm text-slate-400">{cat.subtitle}</p>
                </div>
                <div className="text-right mr-4">
                  <p className={`text-xl font-bold ${colors.text}`}>{catScore.earned}/{catScore.max}</p>
                  <p className="text-xs text-slate-400">points</p>
                </div>
                {!isUnlocked ? (
                  <Lock className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Progress Bar */}
              <div className="px-4 pb-2">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${colors.bg.replace('/20', '')}`}
                    style={{ backgroundColor: colors.text.replace('text-', '').includes('400') ? undefined : undefined }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Items */}
              <AnimatePresence>
                {isOpen && isUnlocked && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {cat.items.map(item => {
                        if (item.type === 'toggle') {
                          const isEnabled = !!values[item.id];
                          return (
                            <div key={item.id} className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-white font-medium">{item.label}</span>
                                <button onClick={() => setShowInfo(item.id)} className="p-1 hover:bg-slate-600 rounded">
                                  <HelpCircle className="w-4 h-4 text-slate-400" />
                                </button>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-300'}`}>
                                  +{item.points}
                                </span>
                              </div>
                              <Toggle enabled={isEnabled} onChange={(val) => setValue(item.id, val)} />
                            </div>
                          );
                        }

                        if (item.type === 'select') {
                          const selectedValue = values[item.id];
                          return (
                            <div key={item.id} className="space-y-2">
                              <div className="flex items-center gap-2 px-1">
                                <span className="text-slate-300 font-medium">{item.label}</span>
                                <button onClick={() => setShowInfo(item.id)} className="p-1 hover:bg-slate-600 rounded">
                                  <HelpCircle className="w-4 h-4 text-slate-400" />
                                </button>
                              </div>
                              {item.options.map(opt => {
                                const isSelected = selectedValue === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => setValue(item.id, opt.value)}
                                    className={`w-full p-4 rounded-xl text-left flex items-center justify-between transition-colors ${
                                      isSelected ? `${colors.border} border-2 ${colors.bg}` : 'bg-slate-700/50 border-2 border-transparent hover:border-slate-600'
                                    }`}
                                  >
                                    <div>
                                      <p className="text-white font-medium">{opt.label}</p>
                                      {opt.sublabel && <p className="text-sm text-slate-400">{opt.sublabel}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded text-sm font-medium ${isSelected ? `${colors.bg} ${colors.text}` : 'bg-slate-600 text-slate-300'}`}>
                                        +{opt.points}
                                      </span>
                                      {isSelected && <Check className={`w-5 h-5 ${colors.text}`} />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Compliance & Deadlines */}
        {town && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <button
              onClick={() => setOpenCategories(prev => ({ ...prev, compliance: !prev.compliance }))}
              className="w-full p-4 flex items-center gap-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="p-3 rounded-xl bg-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Compliance & Deadlines</p>
                <p className="text-sm text-slate-400">Critical rules and timelines</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openCategories.compliance ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {openCategories.compliance && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    {/* Legacy Window */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white">Legacy Window Deadline</p>
                            <button onClick={() => setShowInfo('legacy')} className="p-1 hover:bg-slate-700 rounded">
                              <HelpCircle className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-300">Permits submitted before <span className="text-amber-400 font-semibold">July 15, 2026</span> can use previous elevation standards.</p>
                          <p className="text-xs text-slate-400 mt-2">After this date, all new construction and substantial improvements must meet CAFE requirements (BFE + 4 ft).</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-3xl font-bold text-amber-400">{legacyDaysLeft}</p>
                          <p className="text-xs text-slate-400">days left</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 50% Rule */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white">50% Rule (Substantial Improvement)</p>
                        <button onClick={() => setShowInfo('fiftyPercent')} className="p-1 hover:bg-slate-700 rounded">
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-300">If improvements exceed <span className="text-red-400 font-semibold">50% of your home's market value</span> in any 10-year period, the entire structure must be brought up to current flood codes.</p>
                      <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-cyan-400">💡 Track improvement costs carefully. Get a pre-improvement appraisal before major renovations to establish baseline value.</p>
                      </div>
                    </div>
                    
                    {/* CAFE Requirements */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white">CAFE Requirements</p>
                        <button onClick={() => setShowInfo('cafe')} className="p-1 hover:bg-slate-700 rounded">
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-300">Coastal A Flood Elevation requires building to <span className="text-cyan-400 font-semibold">BFE + 4 feet</span> in NJ.</p>
                      <p className="text-sm text-slate-300 mt-2">Your CAFE requirement: <span className="text-white font-bold">{cafe || '--'} ft</span></p>
                    </div>
                    
                    {/* VE Zone Requirements - only show if VE zone */}
                    {floodZone.startsWith('V') && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-white">VE Zone Requirements</p>
                          <button onClick={() => setShowInfo('veZone')} className="p-1 hover:bg-slate-700 rounded">
                            <HelpCircle className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">Your property is in a Coastal High Hazard zone with additional requirements:</p>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li className="flex items-start gap-2"><span className="text-red-400">•</span> Breakaway walls required below BFE</li>
                          <li className="flex items-start gap-2"><span className="text-red-400">•</span> Open foundation (piles/piers) required for new construction</li>
                          <li className="flex items-start gap-2"><span className="text-red-400">•</span> No fill allowed for structural support</li>
                          <li className="flex items-start gap-2"><span className="text-red-400">•</span> All mechanical equipment must be elevated</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Permitting & Regulations */}
        {town && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <button
              onClick={() => setOpenCategories(prev => ({ ...prev, permits: !prev.permits }))}
              className="w-full p-4 flex items-center gap-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="p-3 rounded-xl bg-purple-500/30">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Permitting & Regulations</p>
                <p className="text-sm text-slate-400">What requires permits & common violations</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openCategories.permits ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {openCategories.permits && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    {/* What Needs Permits */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <p className="font-medium text-white mb-3">Work That Requires Permits</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Structural modifications</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Deck construction (new)</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Room additions</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Electrical panel upgrades</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> New HVAC installation</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Plumbing rough-in/rerouting</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Flood vent installation</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Foundation work</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Elevation projects</div>
                        <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-purple-400" /> Finishing basement/attic</div>
                      </div>
                      
                      <p className="font-medium text-white mt-4 mb-2">Typically NO Permit Needed</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2"><X className="w-4 h-4 text-slate-500" /> Roof replacement (same materials, no structural)</div>
                        <div className="flex items-center gap-2"><X className="w-4 h-4 text-slate-500" /> Siding replacement (like-for-like)</div>
                        <div className="flex items-center gap-2"><X className="w-4 h-4 text-slate-500" /> Interior painting/flooring</div>
                        <div className="flex items-center gap-2"><X className="w-4 h-4 text-slate-500" /> Replacing fixtures (same location)</div>
                        <div className="flex items-center gap-2"><X className="w-4 h-4 text-slate-500" /> Minor repairs under $5k</div>
                        <div className="flex items-center gap-2"><X className="w-4 h-4 text-slate-500" /> Landscaping (non-grading)</div>
                      </div>
                      <p className="text-xs text-amber-400 mt-3">⚠️ Always check with your local building department - rules vary by municipality</p>
                    </div>
                    
                    {/* Common Violations */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <p className="font-medium text-white mb-3">Common Violations & Penalties</p>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium">Unpermitted Work</p>
                            <p className="text-slate-400">Fines up to $1,000/day. Must be corrected or removed. Can block home sales.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium">Open Permits</p>
                            <p className="text-slate-400">Work started but never inspected. Shows on title search. Must close before selling.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium">Enclosing Below BFE</p>
                            <p className="text-slate-400">Converting flood-resistant areas to living space. Violates flood code and insurance policy.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium">Non-Compliant Flood Vents</p>
                            <p className="text-slate-400">Wrong size, wrong placement, or blocked vents. Must be 1 sq in per 1 sq ft of enclosed area.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* NJ Coastal Specific */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <p className="font-medium text-white">NJ Coastal Permits</p>
                        <button onClick={() => setShowInfo('cafra')} className="p-1 hover:bg-slate-700 rounded">
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium">CAFRA Permit</p>
                            <p className="text-slate-400">Coastal Area Facility Review Act - required for most development in coastal zones. Apply through NJ DEP.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium">Waterfront Development</p>
                            <p className="text-slate-400">Work within 500 ft of tidal waters requires additional state permits.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium">Dune Protection</p>
                            <p className="text-slate-400">Work on or near dunes requires special permits. Heavy fines for dune disturbance.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pro Tip */}
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-sm text-cyan-400">💡 <span className="font-medium">Pro Tip:</span> Before any project, visit your town's building department with your plans. A 15-minute conversation can save thousands in fines and delays.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Programs & Grants */}
        {town && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <button
              onClick={() => setOpenCategories(prev => ({ ...prev, programs: !prev.programs }))}
              className="w-full p-4 flex items-center gap-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="p-3 rounded-xl bg-emerald-500/30">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Programs & Grants</p>
                <p className="text-sm text-slate-400">Financial assistance for flood mitigation</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openCategories.programs ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {openCategories.programs && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    {/* Blue Acres */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white">Blue Acres Buyout Program</p>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">NJ DEP</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-2">Voluntary program that purchases flood-prone homes at pre-storm fair market value. Property is converted to open space.</p>
                          <div className="mt-3 space-y-1 text-sm">
                            <p className="text-slate-400"><span className="text-slate-300">Eligibility:</span> Properties in floodways, repetitive loss properties, or homes substantially damaged by storms.</p>
                            <p className="text-slate-400"><span className="text-slate-300">Funding:</span> 100% of fair market value (pre-storm for damaged properties)</p>
                            <p className="text-slate-400"><span className="text-slate-300">Timeline:</span> 12-24 months from application to closing</p>
                          </div>
                        </div>
                        <a href="https://dep.nj.gov/blueacres/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-1 whitespace-nowrap ml-4">
                          Apply <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    {/* FMA */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white">Flood Mitigation Assistance (FMA)</p>
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">FEMA</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-2">Grants to reduce or eliminate long-term risk of flood damage. Can fund elevation, floodproofing, or buyout.</p>
                          <div className="mt-3 space-y-1 text-sm">
                            <p className="text-slate-400"><span className="text-slate-300">Eligibility:</span> NFIP-insured properties. Priority for Severe Repetitive Loss (SRL) properties.</p>
                            <p className="text-slate-400"><span className="text-slate-300">Funding:</span> Up to 100% for SRL properties. 75% federal / 25% local for others.</p>
                            <p className="text-slate-400"><span className="text-slate-300">Uses:</span> Elevation, acquisition, dry floodproofing, mitigation reconstruction</p>
                          </div>
                        </div>
                        <a href="https://www.fema.gov/grants/mitigation/floods" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-1 whitespace-nowrap ml-4">
                          Learn More <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    {/* HMGP */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white">Hazard Mitigation Grant Program (HMGP)</p>
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">FEMA</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-2">Post-disaster funding to rebuild stronger. Available after Presidential disaster declarations.</p>
                          <div className="mt-3 space-y-1 text-sm">
                            <p className="text-slate-400"><span className="text-slate-300">Eligibility:</span> Properties in declared disaster areas. Must apply through your local/county OEM.</p>
                            <p className="text-slate-400"><span className="text-slate-300">Funding:</span> 75% federal / 25% local match</p>
                            <p className="text-slate-400"><span className="text-slate-300">Uses:</span> Elevation, acquisition, wind retrofit, safe rooms</p>
                          </div>
                        </div>
                        <a href="https://www.fema.gov/grants/mitigation/hazard-mitigation" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-1 whitespace-nowrap ml-4">
                          Learn More <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    {/* Swift Current */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white">Swift Current Program</p>
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">FEMA</span>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">New</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-2">Expedited version of FMA for faster delivery. Streamlined application and approval process.</p>
                          <div className="mt-3 space-y-1 text-sm">
                            <p className="text-slate-400"><span className="text-slate-300">Eligibility:</span> NFIP-insured properties with flood claims</p>
                            <p className="text-slate-400"><span className="text-slate-300">Funding:</span> Similar to FMA but faster disbursement</p>
                            <p className="text-slate-400"><span className="text-slate-300">Timeline:</span> Expedited 6-12 month process</p>
                          </div>
                        </div>
                        <a href="https://www.fema.gov/grants/mitigation/floods/swift-current" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-1 whitespace-nowrap ml-4">
                          Learn More <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    {/* NJ Programs */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <p className="font-medium text-white mb-3">Additional NJ Resources</p>
                      <div className="space-y-2 text-sm">
                        <a href="https://www.state.nj.us/dca/divisions/codes/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                          <span className="text-slate-300">NJ DCA Building Codes</span>
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </a>
                        <a href="https://dep.nj.gov/floods/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                          <span className="text-slate-300">NJ DEP Flood Info</span>
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </a>
                        <a href="https://www.nj.gov/dep/landuse/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                          <span className="text-slate-300">NJ Land Use Permits</span>
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* No town selected */}
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
      
      <InfoPopup title="Base Flood Elevation (BFE)" isOpen={showInfo === 'bfe'} onClose={() => setShowInfo(null)}>
        <p>The <span className="text-white font-medium">Base Flood Elevation</span> is the height floodwaters are expected to reach during a "base flood" (1% annual chance flood, also called a 100-year flood).</p>
        <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-cyan-400">💡 Your elevation relative to BFE is the #1 factor in your flood insurance premium. Each foot above BFE can save hundreds per year.</p>
        </div>
        <p className="mt-3 text-sm text-slate-400">BFE is shown on FEMA flood maps and your Elevation Certificate.</p>
      </InfoPopup>
      
      <InfoPopup title="CAFE Requirement" isOpen={showInfo === 'cafe'} onClose={() => setShowInfo(null)}>
        <p><span className="text-white font-medium">Coastal A Flood Elevation (CAFE)</span> is New Jersey's requirement that new construction and substantial improvements be built to <span className="text-cyan-400 font-medium">BFE + 4 feet</span>.</p>
        <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm">Your property:</p>
          <p className="text-lg font-bold text-white mt-1">BFE {bfe || '--'} ft + 4 ft = {cafe || '--'} ft required</p>
        </div>
        <p className="mt-3 text-sm text-slate-400">This "freeboard" provides extra safety margin and qualifies for better insurance rates.</p>
      </InfoPopup>
      
      <InfoPopup title="Legacy Window" isOpen={showInfo === 'legacy'} onClose={() => setShowInfo(null)}>
        <p>The <span className="text-white font-medium">Legacy Window</span> allows permits submitted before <span className="text-amber-400 font-medium">July 15, 2026</span> to use previous elevation standards.</p>
        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-2xl font-bold text-amber-400">{legacyDaysLeft} days remaining</p>
        </div>
        <p className="mt-3 text-sm text-slate-300">After this date, all new construction and substantial improvements must meet stricter CAFE requirements (BFE + 4 ft).</p>
        <p className="mt-2 text-sm text-cyan-400">💡 If you're planning major renovations, consider applying for permits before the deadline.</p>
      </InfoPopup>
      
      <InfoPopup title="50% Rule (Substantial Improvement)" isOpen={showInfo === 'fiftyPercent'} onClose={() => setShowInfo(null)}>
        <p>The <span className="text-white font-medium">50% Rule</span> states that if improvements to your home exceed 50% of its market value within any 10-year period, the <span className="text-red-400 font-medium">entire structure</span> must be brought up to current flood codes.</p>
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm font-medium text-white">This can trigger requirements to:</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            <li>• Elevate the entire structure</li>
            <li>• Replace foundation</li>
            <li>• Install flood vents</li>
            <li>• Relocate mechanical equipment</li>
          </ul>
        </div>
        <p className="mt-3 text-sm text-cyan-400">💡 Get a pre-improvement appraisal before major work to establish your baseline value. Track all improvement costs.</p>
      </InfoPopup>
      
      <InfoPopup title="VE Zone Requirements" isOpen={showInfo === 'veZone'} onClose={() => setShowInfo(null)}>
        <p><span className="text-white font-medium">VE Zones (Coastal High Hazard)</span> have the strictest building requirements due to wave action during storms.</p>
        <div className="mt-3 space-y-2">
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="font-medium text-white text-sm">Required in VE Zones:</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>• Open foundation (piles, piers, columns)</li>
              <li>• Breakaway walls below BFE</li>
              <li>• No fill for structural support</li>
              <li>• Bottom of lowest horizontal structural member at/above BFE</li>
              <li>• All mechanical equipment elevated</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-400">Non-compliance can void your flood insurance and result in fines.</p>
      </InfoPopup>
      
      <InfoPopup title="CAFRA Permits" isOpen={showInfo === 'cafra'} onClose={() => setShowInfo(null)}>
        <p><span className="text-white font-medium">CAFRA (Coastal Area Facility Review Act)</span> is New Jersey's law regulating development in coastal areas.</p>
        <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm font-medium text-white">CAFRA permits may be required for:</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            <li>• New construction</li>
            <li>• Additions and expansions</li>
            <li>• Reconstruction after damage</li>
            <li>• Development near wetlands</li>
            <li>• Work affecting dunes or beaches</li>
          </ul>
        </div>
        <p className="mt-3 text-sm text-slate-400">Apply through NJ DEP. Processing time varies from weeks to months depending on project scope.</p>
        <a href="https://www.nj.gov/dep/landuse/coastal.html" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 text-cyan-400 text-sm hover:underline">
          NJ DEP Coastal Permits <ExternalLink className="w-4 h-4" />
        </a>
      </InfoPopup>

      {/* Item-specific info popups */}
      {CATEGORIES.flatMap(cat => cat.items).map(item => (
        <InfoPopup key={item.id} title={item.label} isOpen={showInfo === item.id} onClose={() => setShowInfo(null)}>
          <p>{item.helpText}</p>
        </InfoPopup>
      ))}
      
      {/* Email Unlock Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-cyan-500/20 rounded-full">
                    <Shield className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Unlock Your Full Assessment</h3>
                <p className="text-slate-400 text-center text-sm mb-6">
                  Enter your email to customize your resilience score and see how each improvement impacts your property.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="your@email.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium transition-colors"
                  >
                    Unlock Free Assessment
                  </button>
                </form>
                
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-slate-500 text-center">You'll get access to:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>All 7 assessment categories</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Real-time score updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>PDF report download</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Deadline reminders</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 text-center mt-4">
                  No spam, ever. Just flood protection tips.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* PDF Download Button - shows when unlocked */}
      {isUnlocked && town && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium shadow-lg flex items-center gap-2 z-30"
          onClick={() => alert('PDF generation coming soon!')}
        >
          <Download className="w-5 h-5" />
          Download PDF
        </motion.button>
      )}
    </div>
  );
}
