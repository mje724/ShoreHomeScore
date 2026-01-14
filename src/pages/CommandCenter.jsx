import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, Zap, FileText,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronDown, ChevronRight, ArrowUp,
  DollarSign, MapPin, X, HelpCircle,
  ArrowRight, Phone, Waves,
  Search, Star, Sparkles, Gift, Check
} from 'lucide-react';

// =============================================================================
// CONFIGURATION
// =============================================================================
const CAFE_ELEVATION = 4;

// NJ Shore ZIP code data - COMPREHENSIVE (100+ towns)
const ZIP_DATA = {
  // OCEAN COUNTY
  '08742': { municipality: 'Point Pleasant Beach', county: 'Ocean', bfe: 9, floodZone: 'AE', pricePerSqft: 450 },
  '08741': { municipality: 'Pine Beach', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 380 },
  '08740': { municipality: 'Ocean Gate', county: 'Ocean', bfe: 8, floodZone: 'AE', pricePerSqft: 360 },
  '08751': { municipality: 'Seaside Heights', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 380 },
  '08752': { municipality: 'Seaside Park', county: 'Ocean', bfe: 10, floodZone: 'AE', pricePerSqft: 400 },
  '08753': { municipality: 'Toms River', county: 'Ocean', bfe: 8, floodZone: 'AE', pricePerSqft: 350 },
  '08754': { municipality: 'Toms River South', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 340 },
  '08755': { municipality: 'Toms River North', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 360 },
  '08723': { municipality: 'Brick', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 400 },
  '08724': { municipality: 'Brick Laurelton', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 380 },
  '08735': { municipality: 'Lavallette', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 550 },
  '08738': { municipality: 'Mantoloking', county: 'Ocean', bfe: 11, floodZone: 'VE', pricePerSqft: 900 },
  '08739': { municipality: 'Normandy Beach', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 500 },
  '08732': { municipality: 'Island Heights', county: 'Ocean', bfe: 8, floodZone: 'AE', pricePerSqft: 420 },
  '08734': { municipality: 'Lanoka Harbor', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 350 },
  '08050': { municipality: 'Manahawkin', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 350 },
  '08721': { municipality: 'Bayville', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 380 },
  '08005': { municipality: 'Barnegat', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 320 },
  '08006': { municipality: 'Barnegat Light', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 700 },
  '08731': { municipality: 'Forked River', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 370 },
  '08087': { municipality: 'Tuckerton', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 340 },
  '08092': { municipality: 'West Creek', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 320 },
  '08008': { municipality: 'Long Beach Island', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 650 },
  '08048': { municipality: 'Loveladies', county: 'Ocean', bfe: 11, floodZone: 'VE', pricePerSqft: 800 },
  '08758': { municipality: 'Waretown', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 300 },
  '08759': { municipality: 'Stafford Township', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 320 },
  '08701': { municipality: 'Lakewood', county: 'Ocean', bfe: 5, floodZone: 'X', pricePerSqft: 280 },
  '08527': { municipality: 'Jackson', county: 'Ocean', bfe: 4, floodZone: 'X', pricePerSqft: 260 },
  // MONMOUTH COUNTY
  '07719': { municipality: 'Belmar', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 550 },
  '07717': { municipality: 'Avon-by-the-Sea', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 600 },
  '07718': { municipality: 'Belford', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 400 },
  '07720': { municipality: 'Bradley Beach', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 480 },
  '07750': { municipality: 'Monmouth Beach', county: 'Monmouth', bfe: 10, floodZone: 'VE', pricePerSqft: 700 },
  '07760': { municipality: 'Rumson', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 850 },
  '07762': { municipality: 'Spring Lake', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 750 },
  '07764': { municipality: 'West Long Branch', county: 'Monmouth', bfe: 7, floodZone: 'AE', pricePerSqft: 450 },
  '07740': { municipality: 'Long Branch', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 480 },
  '07753': { municipality: 'Neptune', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 380 },
  '07756': { municipality: 'Ocean Grove', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 450 },
  '07757': { municipality: 'Oceanport', county: 'Monmouth', bfe: 7, floodZone: 'AE', pricePerSqft: 420 },
  '07758': { municipality: 'Port Monmouth', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 350 },
  '07701': { municipality: 'Red Bank', county: 'Monmouth', bfe: 7, floodZone: 'AE', pricePerSqft: 450 },
  '07702': { municipality: 'Shrewsbury', county: 'Monmouth', bfe: 6, floodZone: 'AE', pricePerSqft: 480 },
  '07704': { municipality: 'Fair Haven', county: 'Monmouth', bfe: 7, floodZone: 'AE', pricePerSqft: 650 },
  '07716': { municipality: 'Atlantic Highlands', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 500 },
  '07732': { municipality: 'Highlands', county: 'Monmouth', bfe: 10, floodZone: 'VE', pricePerSqft: 420 },
  '07734': { municipality: 'Keansburg', county: 'Monmouth', bfe: 10, floodZone: 'VE', pricePerSqft: 300 },
  '07735': { municipality: 'Keyport', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 350 },
  '07737': { municipality: 'Leonardo', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 380 },
  '07738': { municipality: 'Lincroft', county: 'Monmouth', bfe: 5, floodZone: 'X', pricePerSqft: 450 },
  '07748': { municipality: 'Middletown', county: 'Monmouth', bfe: 6, floodZone: 'AE', pricePerSqft: 420 },
  '07752': { municipality: 'Navesink', county: 'Monmouth', bfe: 6, floodZone: 'AE', pricePerSqft: 550 },
  '07765': { municipality: 'Sea Bright', county: 'Monmouth', bfe: 11, floodZone: 'VE', pricePerSqft: 600 },
  '07723': { municipality: 'Deal', county: 'Monmouth', bfe: 10, floodZone: 'VE', pricePerSqft: 1200 },
  '07724': { municipality: 'Eatontown', county: 'Monmouth', bfe: 5, floodZone: 'X', pricePerSqft: 380 },
  '07730': { municipality: 'Hazlet', county: 'Monmouth', bfe: 6, floodZone: 'AE', pricePerSqft: 350 },
  '07712': { municipality: 'Asbury Park', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 420 },
  '07755': { municipality: 'Oakhurst', county: 'Monmouth', bfe: 7, floodZone: 'AE', pricePerSqft: 400 },
  '07763': { municipality: 'Spring Lake Heights', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 550 },
  '07728': { municipality: 'Freehold', county: 'Monmouth', bfe: 4, floodZone: 'X', pricePerSqft: 380 },
  '07731': { municipality: 'Howell', county: 'Monmouth', bfe: 4, floodZone: 'X', pricePerSqft: 350 },
  '07733': { municipality: 'Holmdel', county: 'Monmouth', bfe: 4, floodZone: 'X', pricePerSqft: 500 },
  '07739': { municipality: 'Little Silver', county: 'Monmouth', bfe: 7, floodZone: 'AE', pricePerSqft: 550 },
  '07746': { municipality: 'Marlboro', county: 'Monmouth', bfe: 4, floodZone: 'X', pricePerSqft: 420 },
  '07747': { municipality: 'Matawan', county: 'Monmouth', bfe: 6, floodZone: 'AE', pricePerSqft: 350 },
  '07754': { municipality: 'Neptune City', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 350 },
  // ATLANTIC COUNTY
  '08401': { municipality: 'Atlantic City', county: 'Atlantic', bfe: 9, floodZone: 'VE', pricePerSqft: 250 },
  '08402': { municipality: 'Margate', county: 'Atlantic', bfe: 9, floodZone: 'AE', pricePerSqft: 550 },
  '08403': { municipality: 'Longport', county: 'Atlantic', bfe: 10, floodZone: 'VE', pricePerSqft: 650 },
  '08406': { municipality: 'Ventnor', county: 'Atlantic', bfe: 9, floodZone: 'AE', pricePerSqft: 450 },
  '08203': { municipality: 'Brigantine', county: 'Atlantic', bfe: 10, floodZone: 'VE', pricePerSqft: 400 },
  '08201': { municipality: 'Absecon', county: 'Atlantic', bfe: 6, floodZone: 'AE', pricePerSqft: 280 },
  '08205': { municipality: 'Galloway', county: 'Atlantic', bfe: 5, floodZone: 'AE', pricePerSqft: 250 },
  '08221': { municipality: 'Linwood', county: 'Atlantic', bfe: 6, floodZone: 'AE', pricePerSqft: 320 },
  '08225': { municipality: 'Northfield', county: 'Atlantic', bfe: 5, floodZone: 'AE', pricePerSqft: 300 },
  '08232': { municipality: 'Pleasantville', county: 'Atlantic', bfe: 6, floodZone: 'AE', pricePerSqft: 220 },
  '08234': { municipality: 'Egg Harbor Township', county: 'Atlantic', bfe: 5, floodZone: 'AE', pricePerSqft: 250 },
  '08244': { municipality: 'Somers Point', county: 'Atlantic', bfe: 7, floodZone: 'AE', pricePerSqft: 350 },
  // CAPE MAY COUNTY
  '08204': { municipality: 'Cape May', county: 'Cape May', bfe: 10, floodZone: 'VE', pricePerSqft: 600 },
  '08210': { municipality: 'Cape May Court House', county: 'Cape May', bfe: 6, floodZone: 'AE', pricePerSqft: 320 },
  '08212': { municipality: 'Cape May Point', county: 'Cape May', bfe: 10, floodZone: 'VE', pricePerSqft: 700 },
  '08223': { municipality: 'Ocean City', county: 'Cape May', bfe: 9, floodZone: 'AE', pricePerSqft: 550 },
  '08226': { municipality: 'Ocean City South', county: 'Cape May', bfe: 9, floodZone: 'AE', pricePerSqft: 520 },
  '08243': { municipality: 'Sea Isle City', county: 'Cape May', bfe: 10, floodZone: 'VE', pricePerSqft: 550 },
  '08247': { municipality: 'Stone Harbor', county: 'Cape May', bfe: 10, floodZone: 'VE', pricePerSqft: 800 },
  '08248': { municipality: 'Strathmere', county: 'Cape May', bfe: 9, floodZone: 'VE', pricePerSqft: 450 },
  '08251': { municipality: 'Villas', county: 'Cape May', bfe: 7, floodZone: 'AE', pricePerSqft: 250 },
  '08252': { municipality: 'West Cape May', county: 'Cape May', bfe: 9, floodZone: 'AE', pricePerSqft: 550 },
  '08260': { municipality: 'Wildwood', county: 'Cape May', bfe: 9, floodZone: 'VE', pricePerSqft: 400 },
  '08257': { municipality: 'Wildwood Crest', county: 'Cape May', bfe: 9, floodZone: 'VE', pricePerSqft: 450 },
  '08202': { municipality: 'Avalon', county: 'Cape May', bfe: 10, floodZone: 'VE', pricePerSqft: 900 },
  '08242': { municipality: 'Rio Grande', county: 'Cape May', bfe: 6, floodZone: 'AE', pricePerSqft: 280 },
  '08246': { municipality: 'North Wildwood', county: 'Cape May', bfe: 9, floodZone: 'VE', pricePerSqft: 420 },
};

// =============================================================================
// CELEBRATION COMPONENT
// =============================================================================
const Confetti = ({ show }) => {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="text-6xl"
      >
        🎉
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// ADDRESS INPUT WITH AUTOCOMPLETE
// =============================================================================
const AddressInput = ({ value, onChange, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Simple NJ address suggestions based on input
  const handleInputChange = (inputValue) => {
    onChange(inputValue);
    
    // Show ZIP-based suggestions when typing
    if (inputValue.length > 2) {
      const matches = Object.entries(ZIP_DATA)
        .filter(([zip, data]) => 
          data.municipality.toLowerCase().includes(inputValue.toLowerCase()) ||
          zip.includes(inputValue)
        )
        .slice(0, 5)
        .map(([zip, data]) => ({
          display: `${data.municipality}, NJ ${zip}`,
          zip,
          municipality: data.municipality
        }));
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };
  
  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Enter your address or town..."
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-800 text-lg focus:border-cyan-500 focus:outline-none transition-all shadow-sm"
        />
      </div>
      
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
          >
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-cyan-50 transition-colors flex items-center gap-3 border-b border-slate-100 last:border-0"
              >
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span className="text-slate-700">{suggestion.display}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// PROGRESS RING
// =============================================================================
const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const getColor = () => {
    if (progress >= 70) return '#10b981';
    if (progress >= 40) return '#f59e0b';
    return '#06b6d4';
  };
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// =============================================================================
// QUESTION CARD - Friendly toggle
// =============================================================================
const QuestionCard = ({ question, description, value, onChange, impact, icon: Icon }) => {
  const isAnswered = value !== null && value !== undefined;
  const isYes = value === true;
  
  return (
    <motion.div
      layout
      className={`rounded-2xl border-2 p-4 transition-all ${
        isAnswered 
          ? isYes 
            ? 'bg-emerald-500/10 border-emerald-500/50' 
            : 'bg-slate-800/50 border-slate-600'
          : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
      }`}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={`p-2 rounded-xl ${isYes ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
            <Icon className={`w-5 h-5 ${isYes ? 'text-emerald-400' : 'text-slate-400'}`} />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-white text-base">{question}</h4>
          {description && (
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          )}
          {impact && isYes && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-emerald-400 mt-2 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              {impact}
            </motion.p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onChange(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isYes 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => onChange(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              value === false 
                ? 'bg-slate-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            No
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// INSIGHT CARD - Only shows when we have data
// =============================================================================
const InsightCard = ({ icon: Icon, title, value, subtitle, color = 'cyan', available = true }) => {
  if (!available) return null;
  
  const colors = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    red: 'from-red-500/20 to-rose-500/20 border-red-500/30',
  };
  
  const iconColors = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };
  
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${iconColors[color]}`} />
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};

// =============================================================================
// SAVINGS ITEM - Shows potential vs actual
// =============================================================================
const SavingsItem = ({ label, amount, achieved, description }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl ${
    achieved ? 'bg-emerald-500/10' : 'bg-slate-800/50'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        achieved ? 'bg-emerald-500' : 'bg-slate-700'
      }`}>
        {achieved ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <div className="w-2 h-2 bg-slate-500 rounded-full" />
        )}
      </div>
      <div>
        <p className={achieved ? 'text-emerald-400 font-medium' : 'text-slate-400'}>{label}</p>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
    </div>
    <span className={`font-bold ${achieved ? 'text-emerald-400' : 'text-slate-500'}`}>
      {achieved ? `+$${amount}` : `$${amount}`}
    </span>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CommandCenter() {
  // ===== STATE =====
  const [addressInput, setAddressInput] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Property data from lookup
  const [property, setProperty] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_property_v4');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  // User answers - only what they've actually told us
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_answers_v4');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [femaData, setFemaData] = useState(null);
  
  // ===== PERSISTENCE =====
  useEffect(() => {
    if (property) {
      localStorage.setItem('shs_property_v4', JSON.stringify(property));
    }
  }, [property]);
  
  useEffect(() => {
    localStorage.setItem('shs_answers_v4', JSON.stringify(answers));
  }, [answers]);
  
  // ===== HANDLERS =====
  const handleAddressSelect = (suggestion) => {
    setAddressInput(suggestion.display);
    lookupAddress(suggestion.municipality, suggestion.zip);
  };
  
  const lookupAddress = async (address, zip) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try FEMA API first
      const response = await fetch(
        `/api/fema-lookup?address=${encodeURIComponent(address)}&zipCode=${encodeURIComponent(zip)}`
      );
      
      const zipInfo = ZIP_DATA[zip] || {};
      
      if (response.ok) {
        const data = await response.json();
        setFemaData(data);
        setProperty({
          address: address,
          zipCode: zip,
          municipality: zipInfo.municipality || address,
          county: zipInfo.county || '',
          floodZone: data.floodZone || zipInfo.floodZone,
          bfe: data.bfe || zipInfo.bfe,
          coordinates: data.coordinates,
          femaVerified: true,
          claims: data.claims,
        });
      } else {
        // Fall back to ZIP data
        setProperty({
          address: address,
          zipCode: zip,
          municipality: zipInfo.municipality || address,
          county: zipInfo.county || '',
          floodZone: zipInfo.floodZone || null,
          bfe: zipInfo.bfe || null,
          femaVerified: false,
        });
      }
    } catch (err) {
      // Fall back to ZIP data on error
      const zipInfo = ZIP_DATA[zip] || {};
      setProperty({
        address: address,
        zipCode: zip,
        municipality: zipInfo.municipality || address,
        county: zipInfo.county || '',
        floodZone: zipInfo.floodZone || null,
        bfe: zipInfo.bfe || null,
        femaVerified: false,
      });
    }
    
    setIsLoading(false);
  };
  
  const handleManualLookup = () => {
    // Extract zip from input if present
    const zipMatch = addressInput.match(/\b\d{5}\b/);
    const zip = zipMatch ? zipMatch[0] : '';
    
    if (zip && ZIP_DATA[zip]) {
      lookupAddress(addressInput, zip);
    } else if (addressInput.length > 0) {
      setError("Please include a valid NJ shore zip code (e.g., 08742)");
    }
  };
  
  const updateAnswer = useCallback((key, value) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [key]: value };
      // Show confetti on first "yes" answer
      if (value === true && prev[key] !== true) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }
      return newAnswers;
    });
  }, []);
  
  const resetProperty = () => {
    setProperty(null);
    setAnswers({});
    setAddressInput('');
    localStorage.removeItem('shs_property_v4');
    localStorage.removeItem('shs_answers_v4');
  };
  
  // ===== COMPUTED VALUES =====
  
  // Count answered questions
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== null && answers[k] !== undefined).length;
  const totalQuestions = 8;
  
  // Progress percentage (based on answered questions, not score)
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  
  // Encouraging message based on progress
  const encouragement = useMemo(() => {
    if (answeredCount === 0) return { emoji: '👋', text: "Let's learn about your home!" };
    if (answeredCount < 3) return { emoji: '🌱', text: 'Great start! Keep going.' };
    if (answeredCount < 5) return { emoji: '💪', text: "You're doing great!" };
    if (answeredCount < totalQuestions) return { emoji: '🔥', text: 'Almost there!' };
    return { emoji: '🎉', text: 'Amazing! Full picture unlocked!' };
  }, [answeredCount]);
  
  // Only calculate score if we have enough answers
  const hasEnoughData = answeredCount >= 3;
  
  const score = useMemo(() => {
    if (!hasEnoughData) return null;
    
    let points = 0;
    
    if (answers.hasElevationCert === true) points += 15;
    if (answers.hasFloodVents === true) points += 12;
    if (answers.hasImpactWindows === true) points += 15;
    if (answers.hasRoofDeck === true) points += 10;
    if (answers.hasWaterShutoff === true) points += 8;
    if (answers.hasBackupPower === true) points += 8;
    if (answers.hasFloodInsurance === true) points += 12;
    if (answers.elevatedAboveBFE === true) points += 20;
    
    return points;
  }, [answers, hasEnoughData]);
  
  // Only show insurance savings for items they've confirmed
  const confirmedSavings = useMemo(() => {
    let total = 0;
    if (answers.hasElevationCert === true) total += 500;
    if (answers.hasFloodVents === true) total += 300;
    if (answers.hasImpactWindows === true) total += 500;
    if (answers.hasRoofDeck === true) total += 400;
    if (answers.hasWaterShutoff === true) total += 200;
    if (answers.elevatedAboveBFE === true) total += 800;
    return total;
  }, [answers]);
  
  // Potential savings (only for items they've said NO to, not unanswered)
  const potentialSavings = useMemo(() => {
    let total = 0;
    if (answers.hasElevationCert === false) total += 500;
    if (answers.hasFloodVents === false) total += 300;
    if (answers.hasImpactWindows === false) total += 500;
    if (answers.hasRoofDeck === false) total += 400;
    if (answers.hasWaterShutoff === false) total += 200;
    if (answers.elevatedAboveBFE === false) total += 800;
    return total;
  }, [answers]);
  
  // ===== RENDER: WELCOME SCREEN =====
  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Confetti show={showConfetti} />
        
        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Welcome Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6 border border-cyan-500/30">
              <Shield className="w-4 h-4" />
              NJ Shore Home Protection Tool
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome! Let's protect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                your shore home
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-lg mx-auto">
              We'll look up your property info and help you discover ways to save money and stay safe.
            </p>
          </motion.div>
          
          {/* Address Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-700 p-6 md:p-8"
          >
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Where's your shore home?
            </label>
            
            <AddressInput
              value={addressInput}
              onChange={setAddressInput}
              onSelect={handleAddressSelect}
            />
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}
            
            <button
              onClick={handleManualLookup}
              disabled={isLoading || !addressInput}
              className="w-full mt-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Looking up your property...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Get Started
                </>
              )}
            </button>
            
            <p className="text-xs text-slate-500 text-center mt-4">
              We'll pull official FEMA flood data for your address
            </p>
          </motion.div>
          
          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              100% Free
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" />
              Official FEMA Data
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Takes 2 Minutes
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // ===== RENDER: MAIN DASHBOARD =====
  return (
    <div className="min-h-screen bg-slate-900">
      <Confetti show={showConfetti} />
      
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
              <Home className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-white">{property.municipality || property.address}</h1>
              <p className="text-xs text-slate-400">{property.zipCode} • {property.county} County</p>
            </div>
          </div>
          
          <button
            onClick={resetProperty}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Change Address
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Progress & Encouragement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-3xl border border-slate-700 p-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ProgressRing progress={progress} />
            
            <div className="flex-1 text-center md:text-left">
              <div className="text-3xl mb-2">{encouragement.emoji}</div>
              <h2 className="text-xl font-bold text-white mb-1">{encouragement.text}</h2>
              <p className="text-slate-400">
                {answeredCount} of {totalQuestions} questions answered
              </p>
              
              {hasEnoughData && score !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30"
                >
                  <Star className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Protection Score: {score}/100</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* What We Know (from FEMA/ZIP lookup - no user input needed) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InsightCard
            icon={Waves}
            title="Flood Zone"
            value={property.floodZone || '—'}
            subtitle={property.femaVerified ? 'FEMA Verified' : 'From area data'}
            color={property.floodZone?.startsWith('V') ? 'red' : property.floodZone?.startsWith('A') ? 'amber' : 'cyan'}
            available={!!property.floodZone}
          />
          <InsightCard
            icon={ArrowUp}
            title="Base Flood Elev."
            value={property.bfe ? `${property.bfe} ft` : '—'}
            subtitle={property.bfe ? `CAFE: ${property.bfe + CAFE_ELEVATION} ft` : null}
            color="cyan"
            available={!!property.bfe}
          />
          <InsightCard
            icon={DollarSign}
            title="Your Savings"
            value={confirmedSavings > 0 ? `$${confirmedSavings.toLocaleString()}` : '—'}
            subtitle={confirmedSavings > 0 ? 'Per year' : 'Answer questions below'}
            color="emerald"
            available={confirmedSavings > 0}
          />
          <InsightCard
            icon={Gift}
            title="Available"
            value={potentialSavings > 0 ? `+$${potentialSavings.toLocaleString()}` : '—'}
            subtitle={potentialSavings > 0 ? 'Potential savings' : 'Keep answering!'}
            color="amber"
            available={potentialSavings > 0}
          />
        </div>
        
        {/* Neighborhood Claims - only if we have data */}
        {property.claims && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white">Your Neighborhood's History</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-amber-400">{property.claims.totalClaims?.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Flood claims filed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">${(property.claims.avgPayout || 45000).toLocaleString()}</p>
                <p className="text-sm text-slate-400">Average payout</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Questions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            Tell us about your home
          </h3>
          
          <div className="space-y-3">
            <QuestionCard
              icon={FileText}
              question="Do you have an Elevation Certificate?"
              description="An official document showing your home's height relative to flood levels"
              value={answers.hasElevationCert}
              onChange={(v) => updateAnswer('hasElevationCert', v)}
              impact="This typically saves $500+/year on flood insurance!"
            />
            
            <QuestionCard
              icon={ArrowUp}
              question="Is your lowest floor above the Base Flood Elevation?"
              description={property.bfe ? `Your BFE is ${property.bfe} ft. Is your first floor higher than this?` : "The level flood waters are expected to reach"}
              value={answers.elevatedAboveBFE}
              onChange={(v) => updateAnswer('elevatedAboveBFE', v)}
              impact="Elevation above BFE can save $800+/year!"
            />
            
            <QuestionCard
              icon={Droplets}
              question="Do you have flood vents installed?"
              description="Vents in foundation or garage walls that let water flow through"
              value={answers.hasFloodVents}
              onChange={(v) => updateAnswer('hasFloodVents', v)}
              impact="Proper venting saves around $300/year"
            />
            
            <QuestionCard
              icon={Wind}
              question="Do you have impact windows or hurricane shutters?"
              description="Windows rated to withstand hurricane-force winds and debris"
              value={answers.hasImpactWindows}
              onChange={(v) => updateAnswer('hasImpactWindows', v)}
              impact="Window protection saves up to $500/year on wind coverage"
            />
            
            <QuestionCard
              icon={Shield}
              question="Do you have a sealed roof deck?"
              description="A waterproof membrane under your shingles (secondary water barrier)"
              value={answers.hasRoofDeck}
              onChange={(v) => updateAnswer('hasRoofDeck', v)}
              impact="Sealed roof deck saves around $400/year"
            />
            
            <QuestionCard
              icon={Droplets}
              question="Do you have a smart water shutoff valve?"
              description="Automatically detects leaks and shuts off water supply"
              value={answers.hasWaterShutoff}
              onChange={(v) => updateAnswer('hasWaterShutoff', v)}
              impact="Smart shutoff saves ~$200/year + prevents damage"
            />
            
            <QuestionCard
              icon={Zap}
              question="Do you have backup power (generator or battery)?"
              description="Keeps critical systems running during outages"
              value={answers.hasBackupPower}
              onChange={(v) => updateAnswer('hasBackupPower', v)}
              impact="Backup power helps prevent secondary damage"
            />
            
            <QuestionCard
              icon={Shield}
              question="Do you have flood insurance?"
              description="NFIP or private flood insurance policy"
              value={answers.hasFloodInsurance}
              onChange={(v) => updateAnswer('hasFloodInsurance', v)}
              impact="You're protected! Smart move."
            />
          </div>
        </div>
        
        {/* Savings Breakdown - only shows items we know about */}
        {(confirmedSavings > 0 || potentialSavings > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 p-5"
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Your Insurance Savings
            </h3>
            
            <div className="space-y-2">
              {answers.hasElevationCert !== undefined && (
                <SavingsItem label="Elevation Certificate" amount={500} achieved={answers.hasElevationCert} />
              )}
              {answers.elevatedAboveBFE !== undefined && (
                <SavingsItem label="Elevated Above BFE" amount={800} achieved={answers.elevatedAboveBFE} />
              )}
              {answers.hasFloodVents !== undefined && (
                <SavingsItem label="Flood Vents" amount={300} achieved={answers.hasFloodVents} />
              )}
              {answers.hasImpactWindows !== undefined && (
                <SavingsItem label="Impact Windows/Shutters" amount={500} achieved={answers.hasImpactWindows} />
              )}
              {answers.hasRoofDeck !== undefined && (
                <SavingsItem label="Sealed Roof Deck" amount={400} achieved={answers.hasRoofDeck} />
              )}
              {answers.hasWaterShutoff !== undefined && (
                <SavingsItem label="Smart Water Shutoff" amount={200} achieved={answers.hasWaterShutoff} />
              )}
            </div>
            
            {confirmedSavings > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="font-bold text-white">Your Annual Savings</span>
                <span className="text-2xl font-bold text-emerald-400">${confirmedSavings.toLocaleString()}/yr</span>
              </div>
            )}
            
            {potentialSavings > 0 && (
              <div className="mt-2 flex justify-between items-center text-sm">
                <span className="text-slate-400">Still available with improvements</span>
                <span className="text-amber-400 font-bold">+${potentialSavings.toLocaleString()}/yr</span>
              </div>
            )}
          </motion.div>
        )}

        {/* CTA - only show when they have some engagement */}
        {answeredCount >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30 p-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Want Help Protecting Your Home?</h3>
                <p className="text-slate-400">
                  Connect with local contractors who specialize in shore home improvements.
                </p>
              </div>
              <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap">
                <Phone className="w-5 h-5" />
                Get Free Quotes
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-slate-500">
          <p>ShoreHomeScore • Helping NJ Shore Homeowners Stay Safe</p>
        </footer>
      </main>
    </div>
  );
}
