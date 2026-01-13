import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, Shield, Droplets, Thermometer, Zap, FileCheck,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronDown, ChevronRight, Info, Award, Calendar,
  DollarSign, Building, Wind, Battery, Gauge, MapPin,
  FileText, Bell, Users, CheckSquare, Square, CircleDot,
  AlertCircle, ArrowUp, Umbrella, Scale, Leaf, Radio,
  X, Menu, LogOut, Settings, HelpCircle
} from 'lucide-react';

// =============================================================================
// CONFIGURATION
// =============================================================================
const LEGACY_WINDOW_END = new Date('2026-07-15');
const STORM_SEASON_START = new Date('2026-06-01');

const CHECKLIST_CATEGORIES = [
  {
    id: 'wind',
    name: 'Wind Defense',
    icon: Wind,
    color: 'cyan',
    items: [
      {
        id: 'roof_type',
        name: 'Impact-Resistant Roof',
        description: 'Architectural shingles or metal roofing rated for high winds',
        insuranceImpact: 'Up to 25% premium reduction',
        equityImpact: '+$8,000 - $15,000 home value',
        complianceNote: 'Required for FORTIFIED certification',
        options: ['3-tab shingles', 'Architectural shingles', 'Metal roof', 'Tile roof'],
      },
      {
        id: 'roof_deck',
        name: 'Sealed Roof Deck',
        description: 'Secondary water barrier under shingles prevents leaks if shingles blow off',
        insuranceImpact: '10-15% additional discount',
        equityImpact: '+$3,000 - $5,000 home value',
        complianceNote: 'FORTIFIED Silver requirement',
      },
      {
        id: 'fasteners',
        name: 'Ring-Shank or Stainless Fasteners',
        description: 'Corrosion-resistant nails that hold better in high winds',
        insuranceImpact: 'Part of roof system discount',
        equityImpact: '+$1,000 - $2,000 home value',
        complianceNote: 'Recommended for coastal zones',
      },
      {
        id: 'windows',
        name: 'Impact-Rated Windows/Shutters',
        description: 'Windows rated for windborne debris or hurricane shutters',
        insuranceImpact: '5-10% premium reduction',
        equityImpact: '+$5,000 - $12,000 home value',
        complianceNote: 'Required in V-zones',
      },
      {
        id: 'garage_door',
        name: 'Wind-Rated Garage Door',
        description: 'Reinforced garage door rated for high wind pressure',
        insuranceImpact: '2-5% premium reduction',
        equityImpact: '+$2,000 - $4,000 home value',
        complianceNote: 'Critical weak point in storms',
      },
    ],
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
        description: 'Official survey documenting your home\'s elevation relative to flood levels',
        insuranceImpact: 'Required for accurate NFIP pricing - can save $1,000+/year',
        equityImpact: 'Required for sale in flood zones',
        complianceNote: 'Mandatory for NJ REAL compliance',
      },
      {
        id: 'flood_vents',
        name: 'Engineered Flood Vents',
        description: 'ICC-certified vents that let water flow through foundation',
        insuranceImpact: 'Up to 1 rating class improvement',
        equityImpact: '+$2,000 - $5,000 home value',
        complianceNote: '1 sq inch per 1 sq ft of enclosed area',
      },
      {
        id: 'elevated_foundation',
        name: 'Elevated Foundation',
        description: 'Home raised on piers, piles, or extended foundation',
        insuranceImpact: 'Major premium reduction - often 50%+',
        equityImpact: '+$30,000 - $80,000 home value',
        complianceNote: 'Required at 50% substantial improvement',
      },
      {
        id: 'breakaway_walls',
        name: 'Breakaway Walls',
        description: 'Walls below BFE designed to break away in floods without damaging structure',
        insuranceImpact: 'Part of compliant elevation discount',
        equityImpact: '+$5,000 - $10,000 home value',
        complianceNote: 'Required in V-zones below BFE',
      },
      {
        id: 'sump_pump',
        name: 'Sump Pump with Battery Backup',
        description: 'Removes water from basement/crawlspace even during power outage',
        insuranceImpact: 'Reduces claim likelihood',
        equityImpact: '+$1,500 - $3,000 home value',
        complianceNote: 'Recommended for all flood zones',
      },
    ],
  },
  {
    id: 'systems',
    name: 'Elevated Systems',
    icon: Zap,
    color: 'violet',
    items: [
      {
        id: 'hvac_elevated',
        name: 'HVAC Above BFE +4ft',
        description: 'Heating/cooling equipment elevated above flood levels',
        insuranceImpact: 'Reduces contents damage claims',
        equityImpact: '+$3,000 - $8,000 home value',
        complianceNote: 'Required under 2026 CAFE standard',
      },
      {
        id: 'electrical_elevated',
        name: 'Electrical Panel Above BFE +4ft',
        description: 'Main electrical panel and wiring elevated above flood levels',
        insuranceImpact: 'Reduces recovery time and costs',
        equityImpact: '+$2,000 - $5,000 home value',
        complianceNote: 'Required under 2026 CAFE standard',
      },
      {
        id: 'water_heater',
        name: 'Water Heater Elevated',
        description: 'Hot water heater raised above potential flood levels',
        insuranceImpact: 'Reduces contents claims',
        equityImpact: '+$1,000 - $2,000 home value',
        complianceNote: 'Recommended for all flood zones',
      },
      {
        id: 'washer_dryer',
        name: 'Washer/Dryer Elevated',
        description: 'Laundry appliances on upper floor or elevated platform',
        insuranceImpact: 'Reduces contents claims',
        equityImpact: '+$500 - $1,500 home value',
        complianceNote: 'Simple protection measure',
      },
    ],
  },
  {
    id: 'tech',
    name: 'Smart Protection',
    icon: Radio,
    color: 'emerald',
    items: [
      {
        id: 'water_shutoff',
        name: 'Smart Water Shutoff',
        description: 'Automatic valve that shuts water when leak detected',
        insuranceImpact: '5-10% discount from many insurers',
        equityImpact: '+$2,000 - $4,000 home value',
        complianceNote: 'Prevents catastrophic water damage',
      },
      {
        id: 'leak_sensors',
        name: 'Water Leak Sensors',
        description: 'Sensors in key areas that alert you to leaks',
        insuranceImpact: 'Often bundled with shutoff discount',
        equityImpact: '+$500 - $1,000 home value',
        complianceNote: 'Place near water heater, washing machine, sinks',
      },
      {
        id: 'battery_backup',
        name: 'Whole-Home Battery Backup',
        description: 'Battery system that powers home during outages',
        insuranceImpact: 'Reduces secondary damage from outages',
        equityImpact: '+$10,000 - $20,000 home value',
        complianceNote: 'Keeps sump pumps running during storms',
      },
      {
        id: 'generator',
        name: 'Standby Generator',
        description: 'Automatic generator that kicks in during power outages',
        insuranceImpact: 'Reduces secondary damage claims',
        equityImpact: '+$8,000 - $15,000 home value',
        complianceNote: 'Essential for medical equipment users',
      },
      {
        id: 'smart_monitor',
        name: 'Home Monitoring System',
        description: 'Security and environmental monitoring with alerts',
        insuranceImpact: '5-15% homeowner discount',
        equityImpact: '+$2,000 - $5,000 home value',
        complianceNote: 'Monitors for intrusion, fire, water, temperature',
      },
    ],
  },
  {
    id: 'thermal',
    name: 'Energy & Envelope',
    icon: Thermometer,
    color: 'amber',
    items: [
      {
        id: 'insulation_attic',
        name: 'R-60 Attic Insulation',
        description: 'High-performance insulation meeting 2024 IECC standards',
        insuranceImpact: 'Reduces ice dam claims in winter',
        equityImpact: '+$3,000 - $6,000 home value',
        complianceNote: '2024 IECC requirement for NJ',
      },
      {
        id: 'insulation_walls',
        name: 'Continuous Exterior Insulation',
        description: 'Insulation wrap on exterior of walls eliminating thermal bridges',
        insuranceImpact: 'Reduces moisture/mold claims',
        equityImpact: '+$5,000 - $10,000 home value',
        complianceNote: '2024 IECC requirement for major renovations',
      },
      {
        id: 'windows_energy',
        name: 'IECC 2024 Windows (U≤0.30)',
        description: 'High-performance windows meeting latest energy code',
        insuranceImpact: 'Indirect - reduces energy costs',
        equityImpact: '+$8,000 - $15,000 home value',
        complianceNote: 'Required for new windows in renovations',
      },
      {
        id: 'air_sealing',
        name: 'Air Sealing & Blower Door Test',
        description: 'Sealing air leaks verified by pressure test',
        insuranceImpact: 'Reduces moisture damage risk',
        equityImpact: '+$2,000 - $4,000 home value',
        complianceNote: '2024 IECC requires testing',
      },
    ],
  },
  {
    id: 'legal',
    name: 'Documentation & Compliance',
    icon: FileCheck,
    color: 'rose',
    items: [
      {
        id: 'permit_audit',
        name: '10-Year Permit Audit',
        description: 'Review of all permits to calculate cumulative improvement %',
        insuranceImpact: 'Prevents surprise elevation requirements',
        equityImpact: 'Protects renovation budget',
        complianceNote: 'Critical for 40%/50% threshold tracking',
      },
      {
        id: 'flood_disclosure',
        name: 'Flood Disclosure Forms',
        description: 'NJ-required disclosure of flood history for sale/rental',
        insuranceImpact: 'Required by law since March 2024',
        equityImpact: 'Avoid legal liability',
        complianceNote: 'Mandatory for all sales/rentals in NJ',
      },
      {
        id: 'deed_notice',
        name: 'IRZ Deed Notice',
        description: 'Recorded notice if property is in Inundation Risk Zone',
        insuranceImpact: 'May affect future insurability',
        equityImpact: 'Buyer disclosure requirement',
        complianceNote: 'Required for IRZ properties under REAL 2026',
      },
      {
        id: 'legacy_app',
        name: 'Legacy Window Application',
        description: 'Application submitted before July 2026 for old elevation rules',
        insuranceImpact: 'Locks in current requirements',
        equityImpact: 'Could save $50K+ in elevation costs',
        complianceNote: 'Deadline: July 15, 2026',
      },
    ],
  },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const ScoreGauge = ({ score, maxScore = 100, size = 'large' }) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getScoreColor = () => {
    if (percentage >= 70) return { stroke: '#10b981', text: 'text-emerald-400', label: 'PROTECTED' };
    if (percentage >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'MODERATE' };
    return { stroke: '#ef4444', text: 'text-red-400', label: 'VULNERABLE' };
  };
  
  const colors = getScoreColor();
  const dims = size === 'large' ? 'w-48 h-48' : 'w-24 h-24';
  const textSize = size === 'large' ? 'text-5xl' : 'text-2xl';
  
  return (
    <div className={`relative ${dims}`}>
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
          className={`${textSize} font-bold text-white`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        {size === 'large' && (
          <>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Resilience Score</span>
            <span className={`text-xs font-bold ${colors.text} mt-1 px-2 py-0.5 rounded-full bg-slate-800`}>
              {colors.label}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const CountdownCard = ({ title, date, icon: Icon, color, description }) => {
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
    rose: 'from-rose-900/30 to-rose-800/20 border-rose-500/50 text-rose-400',
  };
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border-2 rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider font-bold">{title}</span>
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

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'slate', alert = false }) => {
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
          <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${alert ? 'bg-amber-500/20' : 'bg-slate-700'}`}>
            <Icon className={`w-5 h-5 ${alert ? 'text-amber-400' : 'text-slate-400'}`} />
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

const ChecklistItem = ({ item, status, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  
  const statusOptions = [
    { value: 'none', label: 'Not yet', icon: Square, color: 'text-slate-500' },
    { value: 'have', label: 'I have this', icon: CheckSquare, color: 'text-emerald-400' },
    { value: 'planning', label: 'Planning', icon: CircleDot, color: 'text-amber-400' },
  ];
  
  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0];
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIdx = statusOptions.findIndex(s => s.value === status);
                const nextIdx = (currentIdx + 1) % statusOptions.length;
                onStatusChange(statusOptions[nextIdx].value);
              }}
              className={`p-1 rounded transition-colors ${currentStatus.color}`}
            >
              <currentStatus.icon className="w-5 h-5" />
            </button>
            <div>
              <h4 className="text-sm font-medium text-slate-200">{item.name}</h4>
              <p className="text-xs text-slate-500">{item.description}</p>
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
            <div className="p-4 space-y-3 bg-slate-900/50">
              {/* Status Selector */}
              <div className="flex gap-2">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onStatusChange(opt.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      status === opt.value 
                        ? 'bg-slate-700 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <opt.icon className="w-3 h-3" />
                    {opt.label}
                  </button>
                ))}
              </div>
              
              {/* Impact Info */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChecklistCategory = ({ category, selections, onSelectionChange }) => {
  const [expanded, setExpanded] = useState(true);
  const Icon = category.icon;
  
  const completedCount = category.items.filter(item => selections[item.id] === 'have').length;
  const plannedCount = category.items.filter(item => selections[item.id] === 'planning').length;
  
  const colorClasses = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    violet: 'text-violet-400 bg-violet-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/20',
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
              {completedCount} complete • {plannedCount} planned • {category.items.length - completedCount - plannedCount} remaining
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
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
                  status={selections[item.id] || 'none'}
                  onStatusChange={(value) => onSelectionChange(item.id, value)}
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
// MAIN COMPONENT
// =============================================================================
export default function CommandCenter() {
  const navigate = useNavigate();
  
  // State
  const [selections, setSelections] = useState({});
  const [propertyData, setPropertyData] = useState({
    address: '301 W 6th St',
    zipCode: '08742',
    municipality: 'Point Pleasant Beach',
    county: 'Ocean',
    homeValue: 650000,
    structureValue: 455000,
    permitHistory: 91000, // 10-year total
  });
  
  // Calculations
  const score = useMemo(() => {
    let points = 0;
    const maxPoints = 100;
    
    Object.entries(selections).forEach(([id, status]) => {
      if (status === 'have') points += 4;
      else if (status === 'planning') points += 1;
    });
    
    return Math.min(points, maxPoints);
  }, [selections]);
  
  const thresholdData = useMemo(() => {
    const fortyPct = propertyData.structureValue * 0.4;
    const fiftyPct = propertyData.structureValue * 0.5;
    const currentPct = (propertyData.permitHistory / propertyData.structureValue) * 100;
    const remaining = fortyPct - propertyData.permitHistory;
    
    return {
      fortyPct,
      fiftyPct,
      currentPct: currentPct.toFixed(1),
      remaining: Math.max(remaining, 0),
      inYellow: currentPct >= 40 && currentPct < 50,
      inRed: currentPct >= 50,
    };
  }, [propertyData]);
  
  const insuranceSavings = useMemo(() => {
    let annual = 0;
    if (selections.roof_type === 'have') annual += 800;
    if (selections.roof_deck === 'have') annual += 400;
    if (selections.windows === 'have') annual += 300;
    if (selections.elevation_cert === 'have') annual += 1200;
    if (selections.flood_vents === 'have') annual += 500;
    if (selections.elevated_foundation === 'have') annual += 2000;
    if (selections.water_shutoff === 'have') annual += 200;
    if (selections.smart_monitor === 'have') annual += 150;
    return annual;
  }, [selections]);
  
  const handleSelectionChange = (itemId, value) => {
    setSelections(prev => ({ ...prev, [itemId]: value }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                <Home className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ShoreHomeScore</h1>
                <p className="text-xs text-slate-500">NJ Coastal Resilience</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Score Gauge */}
          <div className="lg:col-span-4 bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 flex flex-col items-center">
            <ScoreGauge score={score} />
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">vs. Neighborhood Avg</p>
              <p className="text-sm font-bold text-emerald-400">+12%</p>
              <p className="text-[10px] text-slate-600 mt-1">Based on 150 homes in {propertyData.zipCode}</p>
            </div>
          </div>
          
          {/* Countdowns & Key Stats */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountdownCard
              title="Legacy Window"
              date={LEGACY_WINDOW_END}
              icon={Clock}
              color="amber"
              description="Submit applications before deadline to qualify under old elevation standards"
            />
            <CountdownCard
              title="Storm Season"
              date={STORM_SEASON_START}
              icon={Umbrella}
              color="cyan"
              description="Days until June 1 hurricane season begins"
            />
            <StatCard
              title="40% Threshold"
              value={`$${(thresholdData.remaining / 1000).toFixed(0)}K`}
              subtitle="Remaining before affidavit required"
              icon={AlertTriangle}
              color={thresholdData.inYellow ? 'amber' : thresholdData.inRed ? 'red' : 'slate'}
              alert={thresholdData.inYellow || thresholdData.inRed}
            />
            <StatCard
              title="Insurance Savings"
              value={`$${insuranceSavings.toLocaleString()}/yr`}
              subtitle={`$${(insuranceSavings * 10).toLocaleString()} over 10 years`}
              icon={TrendingUp}
              color="emerald"
            />
          </div>
        </div>
        
        {/* Code Updates */}
        <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Code & Regulatory Updates</h2>
          </div>
          <div className="space-y-2">
            <CodeAlert
              title="NJ REAL 2026 CAFE Standard Now in Effect"
              date="Jan 2026"
              description="New construction and substantial improvements in tidal flood zones must now be elevated to BFE +4 feet. The original +5ft proposal was reduced to +4ft in the final rule."
              type="warning"
            />
            <CodeAlert
              title="Ocean County Permit Fee Increase"
              date="Mar 2026"
              description="Building permit fees increasing 15% effective March 1. Consider submitting applications before deadline for current rates."
              type="info"
            />
            <CodeAlert
              title="FEMA Risk Rating 2.0 Phase 2"
              date="Apr 2026"
              description="All NFIP policies will transition to new rating methodology. Homes with mitigation measures may see reduced premiums."
              type="info"
            />
          </div>
        </div>
        
        {/* Property Summary */}
        <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Your Property</h2>
            </div>
            <button className="text-xs text-cyan-400 hover:text-cyan-300">Edit Details</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500">Address</p>
              <p className="text-sm text-white font-medium">{propertyData.address}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Municipality</p>
              <p className="text-sm text-white font-medium">{propertyData.municipality}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Home Value</p>
              <p className="text-sm text-white font-medium">${(propertyData.homeValue / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">10-Year Permits</p>
              <p className="text-sm text-white font-medium">${(propertyData.permitHistory / 1000).toFixed(0)}K ({thresholdData.currentPct}%)</p>
            </div>
          </div>
        </div>

        {/* Checklist Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Resilience Checklist</h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-emerald-400" /> I have this
              </span>
              <span className="flex items-center gap-1">
                <CircleDot className="w-3 h-3 text-amber-400" /> Planning
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {CHECKLIST_CATEGORIES.map(category => (
              <ChecklistCategory
                key={category.id}
                category={category}
                selections={selections}
                onSelectionChange={handleSelectionChange}
              />
            ))}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-emerald-900/30 border-2 border-cyan-500/30 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Ready for your personalized report?</h3>
              <p className="text-sm text-slate-400">Get a detailed PDF with your score, recommendations, and next steps.</p>
            </div>
            <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-600">
            © 2026 ShoreHomeScore • NJ REAL Rules (N.J.A.C. 7:13) • Educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
