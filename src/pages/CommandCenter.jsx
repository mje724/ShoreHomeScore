import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, Zap, FileText,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronDown, ChevronRight, DollarSign, MapPin, X, HelpCircle,
  Phone, Waves, Star, Sparkles, Check, Bell, Calendar,
  ArrowUp, Gauge, Battery, Radio, Leaf, Scale, Building,
  AlertCircle, Target, Eye, Lock, Unlock
} from 'lucide-react';

// =============================================================================
// SHORE TOWNS DATA
// =============================================================================
const SHORE_TOWNS = [
  // OCEAN COUNTY
  { zip: '08742', name: 'Point Pleasant Beach', county: 'Ocean', bfe: 9, zone: 'AE' },
  { zip: '08741', name: 'Pine Beach', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08740', name: 'Ocean Gate', county: 'Ocean', bfe: 8, zone: 'AE' },
  { zip: '08751', name: 'Seaside Heights', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08752', name: 'Seaside Park', county: 'Ocean', bfe: 10, zone: 'AE' },
  { zip: '08753', name: 'Toms River', county: 'Ocean', bfe: 8, zone: 'AE' },
  { zip: '08723', name: 'Brick', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08735', name: 'Lavallette', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08738', name: 'Mantoloking', county: 'Ocean', bfe: 11, zone: 'VE' },
  { zip: '08739', name: 'Normandy Beach', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08732', name: 'Island Heights', county: 'Ocean', bfe: 8, zone: 'AE' },
  { zip: '08734', name: 'Lanoka Harbor', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08050', name: 'Manahawkin', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08721', name: 'Bayville', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08005', name: 'Barnegat', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08006', name: 'Barnegat Light', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08731', name: 'Forked River', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08087', name: 'Tuckerton', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08008', name: 'Beach Haven (LBI)', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08758', name: 'Waretown', county: 'Ocean', bfe: 6, zone: 'AE' },
  // MONMOUTH COUNTY
  { zip: '07719', name: 'Belmar', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07717', name: 'Avon-by-the-Sea', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07720', name: 'Bradley Beach', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07750', name: 'Monmouth Beach', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07760', name: 'Rumson', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07762', name: 'Spring Lake', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07763', name: 'Spring Lake Heights', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07740', name: 'Long Branch', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07753', name: 'Neptune', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07756', name: 'Ocean Grove', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07716', name: 'Atlantic Highlands', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07732', name: 'Highlands', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07734', name: 'Keansburg', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07765', name: 'Sea Bright', county: 'Monmouth', bfe: 11, zone: 'VE' },
  { zip: '07723', name: 'Deal', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07712', name: 'Asbury Park', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07701', name: 'Red Bank', county: 'Monmouth', bfe: 7, zone: 'AE' },
  { zip: '07704', name: 'Fair Haven', county: 'Monmouth', bfe: 7, zone: 'AE' },
  { zip: '07739', name: 'Little Silver', county: 'Monmouth', bfe: 7, zone: 'AE' },
  // ATLANTIC COUNTY
  { zip: '08401', name: 'Atlantic City', county: 'Atlantic', bfe: 9, zone: 'VE' },
  { zip: '08402', name: 'Margate', county: 'Atlantic', bfe: 9, zone: 'AE' },
  { zip: '08403', name: 'Longport', county: 'Atlantic', bfe: 10, zone: 'VE' },
  { zip: '08406', name: 'Ventnor', county: 'Atlantic', bfe: 9, zone: 'AE' },
  { zip: '08203', name: 'Brigantine', county: 'Atlantic', bfe: 10, zone: 'VE' },
  { zip: '08244', name: 'Somers Point', county: 'Atlantic', bfe: 7, zone: 'AE' },
  // CAPE MAY COUNTY
  { zip: '08204', name: 'Cape May', county: 'Cape May', bfe: 10, zone: 'VE' },
  { zip: '08212', name: 'Cape May Point', county: 'Cape May', bfe: 10, zone: 'VE' },
  { zip: '08223', name: 'Ocean City', county: 'Cape May', bfe: 9, zone: 'AE' },
  { zip: '08243', name: 'Sea Isle City', county: 'Cape May', bfe: 10, zone: 'VE' },
  { zip: '08247', name: 'Stone Harbor', county: 'Cape May', bfe: 10, zone: 'VE' },
  { zip: '08202', name: 'Avalon', county: 'Cape May', bfe: 10, zone: 'VE' },
  { zip: '08260', name: 'Wildwood', county: 'Cape May', bfe: 9, zone: 'VE' },
  { zip: '08257', name: 'Wildwood Crest', county: 'Cape May', bfe: 9, zone: 'VE' },
  { zip: '08246', name: 'North Wildwood', county: 'Cape May', bfe: 9, zone: 'VE' },
].sort((a, b) => a.name.localeCompare(b.name));

const TOWNS_BY_COUNTY = SHORE_TOWNS.reduce((acc, town) => {
  if (!acc[town.county]) acc[town.county] = [];
  acc[town.county].push(town);
  return acc;
}, {});

// Constants
const CAFE_ELEVATION = 4;
const LEGACY_WINDOW_END = new Date('2026-07-15');
const STORM_SEASON_START = new Date('2026-06-01');

// =============================================================================
// REUSABLE COMPONENTS
// =============================================================================

const ProgressRing = ({ progress, size = 120 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const color = progress >= 70 ? '#10b981' : progress >= 40 ? '#f59e0b' : '#ef4444';
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{Math.round(progress)}</span>
        <span className="text-xs text-slate-400">/ 100</span>
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate, label, icon: Icon, color }) => {
  const now = new Date();
  const diff = targetDate - now;
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  
  const colors = {
    amber: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    cyan: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
    red: 'bg-red-500/20 border-red-500/50 text-red-400',
  };
  
  return (
    <div className={`${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{days} days</p>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, subtitle, color = 'cyan', locked = false }) => {
  const colors = {
    cyan: 'border-cyan-500/30',
    emerald: 'border-emerald-500/30',
    amber: 'border-amber-500/30',
    red: 'border-red-500/30',
  };
  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    red: 'text-red-400 bg-red-500/20',
  };
  
  if (locked) {
    return (
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 opacity-50">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-500">{label}</span>
        </div>
        <p className="text-lg text-slate-600">Answer questions to unlock</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-slate-800/50 border ${colors[color]} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${iconColors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs text-slate-400 uppercase">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const KeyQuestion = ({ question, description, value, onChange, options, icon: Icon }) => {
  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      value !== undefined ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-800/30 border-slate-700'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${value !== undefined ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
            <Icon className={`w-5 h-5 ${value !== undefined ? 'text-emerald-400' : 'text-slate-400'}`} />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-white">{question}</h4>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === opt.value 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ExpandableSection = ({ title, icon: Icon, children, color = 'cyan', locked = false, progress = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    violet: 'text-violet-400 bg-violet-500/20',
  };
  
  if (locked) {
    return (
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 opacity-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700 rounded-lg">
            <Lock className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1">
            <span className="font-medium text-slate-500">{title}</span>
            <p className="text-xs text-slate-600">Complete the 6 key questions to unlock</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-medium text-white">{title}</span>
            {progress > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 h-1.5 bg-slate-700 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-slate-500">{progress}%</span>
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
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
};

const DetailItem = ({ label, value, onChange, options, description }) => (
  <div className="py-3 border-b border-slate-700 last:border-0">
    <div className="flex items-center justify-between mb-2">
      <div>
        <span className="text-sm text-slate-300">{label}</span>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            value === opt.value 
              ? 'bg-cyan-500 text-white' 
              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const AlertBanner = ({ title, description, type = 'info' }) => {
  const styles = {
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    urgent: 'bg-red-500/10 border-red-500/30 text-red-400',
  };
  const icons = { info: Bell, warning: AlertTriangle, urgent: AlertCircle };
  const Icon = icons[type];
  
  return (
    <div className={`${styles[type]} border rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm opacity-80 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CommandCenter() {
  // State
  const [town, setTown] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_town_v6');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  const [keyAnswers, setKeyAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_key_v6');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [detailAnswers, setDetailAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_detail_v6');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Persistence
  useEffect(() => {
    if (town) localStorage.setItem('shs_town_v6', JSON.stringify(town));
  }, [town]);
  
  useEffect(() => {
    localStorage.setItem('shs_key_v6', JSON.stringify(keyAnswers));
  }, [keyAnswers]);
  
  useEffect(() => {
    localStorage.setItem('shs_detail_v6', JSON.stringify(detailAnswers));
  }, [detailAnswers]);
  
  // Handlers
  const updateKey = useCallback((key, value) => {
    setKeyAnswers(prev => ({ ...prev, [key]: value }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 800);
  }, []);
  
  const updateDetail = useCallback((key, value) => {
    setDetailAnswers(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Calculations
  const keyCount = Object.keys(keyAnswers).filter(k => keyAnswers[k] !== undefined).length;
  const dashboardUnlocked = keyCount >= 6;
  
  // Score calculation based on all answers
  const score = useMemo(() => {
    let points = 0;
    
    // Key questions (60 points max)
    if (keyAnswers.elevationCert === 'yes') points += 10;
    if (keyAnswers.elevationVsBFE === 'above4') points += 15;
    else if (keyAnswers.elevationVsBFE === 'above2') points += 10;
    else if (keyAnswers.elevationVsBFE === 'at') points += 5;
    
    if (keyAnswers.foundation === 'piles') points += 12;
    else if (keyAnswers.foundation === 'piers') points += 8;
    else if (keyAnswers.foundation === 'crawl') points += 4;
    
    if (keyAnswers.floodVents === 'yes') points += 8;
    
    if (keyAnswers.roofType === 'metal') points += 10;
    else if (keyAnswers.roofType === 'architectural') points += 6;
    else if (keyAnswers.roofType === 'tile') points += 7;
    
    if (keyAnswers.windowProtection === 'impact') points += 10;
    else if (keyAnswers.windowProtection === 'shutters') points += 7;
    else if (keyAnswers.windowProtection === 'plywood') points += 3;
    
    // Detail questions (40 points max)
    if (detailAnswers.roofDeck === 'yes') points += 5;
    if (detailAnswers.roofAge && detailAnswers.roofAge <= 10) points += 5;
    if (detailAnswers.garageWindRated === 'yes') points += 4;
    if (detailAnswers.waterShutoff === 'yes') points += 4;
    if (detailAnswers.backupPower === 'generator' || detailAnswers.backupPower === 'battery') points += 4;
    if (detailAnswers.leakSensors === 'yes') points += 3;
    if (detailAnswers.hvacElevated === 'yes') points += 4;
    if (detailAnswers.electricalElevated === 'yes') points += 4;
    if (detailAnswers.floodInsurance === 'yes') points += 5;
    if (detailAnswers.breakawayWalls === 'yes') points += 4;
    
    return Math.min(points, 100);
  }, [keyAnswers, detailAnswers]);
  
  // Insurance savings
  const savings = useMemo(() => {
    let total = 0;
    if (keyAnswers.elevationCert === 'yes') total += 500;
    if (keyAnswers.elevationVsBFE === 'above4') total += 1200;
    else if (keyAnswers.elevationVsBFE === 'above2') total += 800;
    if (keyAnswers.foundation === 'piles') total += 600;
    else if (keyAnswers.foundation === 'piers') total += 400;
    if (keyAnswers.floodVents === 'yes') total += 300;
    if (keyAnswers.roofType === 'metal') total += 600;
    if (keyAnswers.windowProtection === 'impact') total += 500;
    else if (keyAnswers.windowProtection === 'shutters') total += 300;
    if (detailAnswers.roofDeck === 'yes') total += 400;
    if (detailAnswers.waterShutoff === 'yes') total += 200;
    return total;
  }, [keyAnswers, detailAnswers]);
  
  // CAFE requirement
  const cafeRequired = town ? town.bfe + CAFE_ELEVATION : 0;
  
  // Risk level
  const riskLevel = useMemo(() => {
    if (!town) return { label: 'Unknown', color: 'slate' };
    if (town.zone.startsWith('V')) return { label: 'Coastal High Risk', color: 'red' };
    if (town.zone.startsWith('A')) return { label: 'High Risk', color: 'amber' };
    return { label: 'Moderate', color: 'cyan' };
  }, [town]);

  // ===========================================
  // RENDER: TOWN SELECTION
  // ===========================================
  if (!town) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-4 border border-cyan-500/30">
              <Shield className="w-4 h-4" />
              ShoreHomeScore
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome! 👋</h1>
            <p className="text-slate-400">Your personal NJ shore home protection dashboard</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">Select your town</label>
            <div className="relative">
              <select
                onChange={(e) => {
                  const t = SHORE_TOWNS.find(x => x.zip === e.target.value);
                  if (t) setTown(t);
                }}
                defaultValue=""
                className="w-full px-4 py-4 bg-slate-900 border-2 border-slate-600 rounded-xl text-white appearance-none cursor-pointer focus:border-cyan-500 focus:outline-none"
              >
                <option value="" disabled>Choose your town...</option>
                {Object.entries(TOWNS_BY_COUNTY).map(([county, towns]) => (
                  <optgroup key={county} label={`── ${county} County ──`}>
                    {towns.sort((a,b) => a.name.localeCompare(b.name)).map(t => (
                      <option key={t.zip} value={t.zip}>{t.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="mt-6 flex justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-500" /> 5 min setup</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-cyan-500" /> FEMA data</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===========================================
  // RENDER: MAIN DASHBOARD
  // ===========================================
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} className="text-5xl">✨</motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Home className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-white">{town.name}</h1>
              <p className="text-xs text-slate-400">{town.county} County • Zone {town.zone}</p>
            </div>
          </div>
          <button onClick={() => { setTown(null); localStorage.removeItem('shs_town_v6'); }}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-700">
            Change
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Top Section: Score + Key Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Score Card */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col items-center">
            <ProgressRing progress={dashboardUnlocked ? score : 0} />
            <p className="mt-3 text-sm text-slate-400">
              {dashboardUnlocked ? (
                score >= 70 ? 'Well Protected' : score >= 40 ? 'Moderate' : 'Needs Attention'
              ) : (
                `Answer ${6 - keyCount} more to unlock`
              )}
            </p>
            {dashboardUnlocked && savings > 0 && (
              <div className="mt-3 px-3 py-1.5 bg-emerald-500/20 rounded-full">
                <span className="text-emerald-400 text-sm font-bold">${savings.toLocaleString()}/yr savings</span>
              </div>
            )}
          </div>
          
          {/* Key Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <MetricCard icon={Waves} label="Flood Zone" value={town.zone} subtitle={riskLevel.label} color={riskLevel.color} />
            <MetricCard icon={ArrowUp} label="Base Flood Elev." value={`${town.bfe} ft`} subtitle={`CAFE: ${cafeRequired} ft`} color="cyan" />
            <CountdownTimer targetDate={LEGACY_WINDOW_END} label="Legacy Window" icon={Clock} color="amber" />
            <CountdownTimer targetDate={STORM_SEASON_START} label="Storm Season" icon={AlertTriangle} color="cyan" />
          </div>
        </div>

        {/* 6 Key Questions */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-white">6 Key Questions</h2>
            </div>
            <span className="text-sm text-slate-400">{keyCount}/6 answered</span>
          </div>
          
          {!dashboardUnlocked && (
            <p className="text-sm text-slate-400 mb-4">
              Answer these to unlock your personalized dashboard and see your real score.
            </p>
          )}
          
          <div className="space-y-3">
            <KeyQuestion
              icon={FileText}
              question="Do you have an Elevation Certificate?"
              description="Official document showing your home's elevation"
              value={keyAnswers.elevationCert}
              onChange={(v) => updateKey('elevationCert', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Not sure' }]}
            />
            
            <KeyQuestion
              icon={ArrowUp}
              question="How high is your lowest floor relative to BFE?"
              description={`Your Base Flood Elevation is ${town.bfe} ft`}
              value={keyAnswers.elevationVsBFE}
              onChange={(v) => updateKey('elevationVsBFE', v)}
              options={[
                { value: 'above4', label: '4+ ft above' },
                { value: 'above2', label: '2-4 ft above' },
                { value: 'at', label: 'At BFE' },
                { value: 'below', label: 'Below BFE' },
                { value: 'unsure', label: 'Not sure' },
              ]}
            />
            
            <KeyQuestion
              icon={Building}
              question="What type of foundation?"
              value={keyAnswers.foundation}
              onChange={(v) => updateKey('foundation', v)}
              options={[
                { value: 'piles', label: 'Piles/Stilts' },
                { value: 'piers', label: 'Piers' },
                { value: 'crawl', label: 'Crawlspace' },
                { value: 'slab', label: 'Slab' },
                { value: 'basement', label: 'Basement' },
              ]}
            />
            
            <KeyQuestion
              icon={Droplets}
              question="Do you have flood vents?"
              description="Vents in enclosed areas below BFE that let water flow through"
              value={keyAnswers.floodVents}
              onChange={(v) => updateKey('floodVents', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Not sure' }]}
            />
            
            <KeyQuestion
              icon={Home}
              question="What type of roof?"
              value={keyAnswers.roofType}
              onChange={(v) => updateKey('roofType', v)}
              options={[
                { value: 'metal', label: 'Metal Standing Seam' },
                { value: 'architectural', label: 'Architectural Shingle' },
                { value: 'tile', label: 'Tile/Slate' },
                { value: '3tab', label: '3-Tab Shingle' },
                { value: 'flat', label: 'Flat/Rolled' },
              ]}
            />
            
            <KeyQuestion
              icon={Wind}
              question="Window protection?"
              value={keyAnswers.windowProtection}
              onChange={(v) => updateKey('windowProtection', v)}
              options={[
                { value: 'impact', label: 'Impact Glass' },
                { value: 'shutters', label: 'Hurricane Shutters' },
                { value: 'plywood', label: 'Plywood Ready' },
                { value: 'none', label: 'None' },
              ]}
            />
          </div>
        </div>

        {/* Dashboard Unlocked Content */}
        {dashboardUnlocked ? (
          <>
            {/* Alerts */}
            {town.zone.startsWith('V') && (
              <AlertBanner
                type="warning"
                title="Coastal High Hazard Zone (VE)"
                description="Your property is in a VE zone with wave action. Structures must meet stricter building codes including breakaway wall requirements."
              />
            )}
            
            {keyAnswers.elevationVsBFE === 'below' && (
              <AlertBanner
                type="urgent"
                title="Below Base Flood Elevation"
                description="Your home is below BFE. Any substantial improvement (>50% of structure value) will require elevation to CAFE standard."
              />
            )}

            {/* Detailed Categories */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-400" />
                Detailed Protection Analysis
              </h2>
              
              <ExpandableSection title="Wind Defense" icon={Wind} color="cyan" progress={40}>
                <div className="space-y-1">
                  <DetailItem
                    label="Sealed Roof Deck"
                    description="Waterproof membrane under shingles"
                    value={detailAnswers.roofDeck}
                    onChange={(v) => updateDetail('roofDeck', v)}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
                  />
                  <DetailItem
                    label="Roof Age (years)"
                    value={detailAnswers.roofAge}
                    onChange={(v) => updateDetail('roofAge', v)}
                    options={[{ value: 5, label: '0-5' }, { value: 10, label: '6-10' }, { value: 15, label: '11-15' }, { value: 20, label: '16-20' }, { value: 25, label: '20+' }]}
                  />
                  <DetailItem
                    label="Wind-Rated Garage Door"
                    value={detailAnswers.garageWindRated}
                    onChange={(v) => updateDetail('garageWindRated', v)}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }]}
                  />
                </div>
              </ExpandableSection>
              
              <ExpandableSection title="Flood Protection" icon={Droplets} color="blue" progress={60}>
                <div className="space-y-1">
                  <DetailItem
                    label="Breakaway Walls"
                    description="Walls designed to break away in flood"
                    value={detailAnswers.breakawayWalls}
                    onChange={(v) => updateDetail('breakawayWalls', v)}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
                  />
                  <DetailItem
                    label="Flood Insurance"
                    value={detailAnswers.floodInsurance}
                    onChange={(v) => updateDetail('floodInsurance', v)}
                    options={[{ value: 'yes', label: 'NFIP' }, { value: 'private', label: 'Private' }, { value: 'no', label: 'None' }]}
                  />
                  <DetailItem
                    label="HVAC Elevated"
                    description="Above BFE level"
                    value={detailAnswers.hvacElevated}
                    onChange={(v) => updateDetail('hvacElevated', v)}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                  />
                  <DetailItem
                    label="Electrical Panel Elevated"
                    value={detailAnswers.electricalElevated}
                    onChange={(v) => updateDetail('electricalElevated', v)}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                  />
                </div>
              </ExpandableSection>
              
              <ExpandableSection title="Smart Protection" icon={Zap} color="emerald" progress={20}>
                <div className="space-y-1">
                  <DetailItem
                    label="Smart Water Shutoff"
                    value={detailAnswers.waterShutoff}
                    onChange={(v) => updateDetail('waterShutoff', v)}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                  />
                  <DetailItem
                    label="Leak Sensors"
                    value={detailAnswers.leakSensors}
                    onChange={(v) => updateDetail('leakSensors', v)}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                  />
                  <DetailItem
                    label="Backup Power"
                    value={detailAnswers.backupPower}
                    onChange={(v) => updateDetail('backupPower', v)}
                    options={[{ value: 'generator', label: 'Generator' }, { value: 'battery', label: 'Battery' }, { value: 'portable', label: 'Portable' }, { value: 'none', label: 'None' }]}
                  />
                </div>
              </ExpandableSection>
              
              <ExpandableSection title="Insurance & Compliance" icon={FileText} color="amber" progress={30}>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Your Insurance Savings Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    {keyAnswers.elevationCert === 'yes' && (
                      <div className="flex justify-between"><span className="text-slate-400">Elevation Certificate</span><span className="text-emerald-400">+$500/yr</span></div>
                    )}
                    {(keyAnswers.elevationVsBFE === 'above4' || keyAnswers.elevationVsBFE === 'above2') && (
                      <div className="flex justify-between"><span className="text-slate-400">Elevation Above BFE</span><span className="text-emerald-400">+${keyAnswers.elevationVsBFE === 'above4' ? '1,200' : '800'}/yr</span></div>
                    )}
                    {(keyAnswers.foundation === 'piles' || keyAnswers.foundation === 'piers') && (
                      <div className="flex justify-between"><span className="text-slate-400">Elevated Foundation</span><span className="text-emerald-400">+${keyAnswers.foundation === 'piles' ? '600' : '400'}/yr</span></div>
                    )}
                    {keyAnswers.floodVents === 'yes' && (
                      <div className="flex justify-between"><span className="text-slate-400">Flood Vents</span><span className="text-emerald-400">+$300/yr</span></div>
                    )}
                    {keyAnswers.roofType === 'metal' && (
                      <div className="flex justify-between"><span className="text-slate-400">Metal Roof</span><span className="text-emerald-400">+$600/yr</span></div>
                    )}
                    {(keyAnswers.windowProtection === 'impact' || keyAnswers.windowProtection === 'shutters') && (
                      <div className="flex justify-between"><span className="text-slate-400">Window Protection</span><span className="text-emerald-400">+${keyAnswers.windowProtection === 'impact' ? '500' : '300'}/yr</span></div>
                    )}
                    <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between font-bold">
                      <span className="text-white">Total Annual Savings</span>
                      <span className="text-emerald-400">${savings.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>10-Year Impact</span>
                      <span className="text-white">${(savings * 10).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </ExpandableSection>
            </div>

            {/* Future Risk */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Future Flood Risk</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-400">{town.zone.startsWith('V') ? '9' : '7'}/10</p>
                  <p className="text-xs text-slate-500">Current</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-orange-400">{town.zone.startsWith('V') ? '10' : '8'}/10</p>
                  <p className="text-xs text-slate-500">15 Years</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-red-400">{town.zone.startsWith('V') ? '10' : '9'}/10</p>
                  <p className="text-xs text-slate-500">30 Years</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Sea level rise projections: <strong className="text-white">+1.5ft by 2050</strong>. 
                Today's 100-year flood may become a 25-year event.
              </p>
            </div>
          </>
        ) : (
          /* Locked state */
          <div className="space-y-3">
            <ExpandableSection title="Wind Defense" icon={Wind} locked />
            <ExpandableSection title="Flood Protection" icon={Droplets} locked />
            <ExpandableSection title="Smart Protection" icon={Zap} locked />
            <ExpandableSection title="Insurance & Compliance" icon={FileText} locked />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-slate-500">
          <p>ShoreHomeScore • Your NJ Shore Home Protection Dashboard</p>
          <p className="mt-1">Data from FEMA, NOAA, NJ DEP</p>
        </footer>
      </main>
    </div>
  );
}
