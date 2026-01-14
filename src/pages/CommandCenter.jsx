import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, Zap,
  AlertTriangle, CheckCircle, Clock, TrendingUp,
  ChevronDown, DollarSign, MapPin, X, HelpCircle,
  Phone, Waves, Star, Sparkles, Check
} from 'lucide-react';

// =============================================================================
// ALL NJ SHORE TOWNS - Organized by County
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
  { zip: '08724', name: 'Brick (Laurelton)', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08735', name: 'Lavallette', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08738', name: 'Mantoloking', county: 'Ocean', bfe: 11, zone: 'VE' },
  { zip: '08739', name: 'Normandy Beach', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08732', name: 'Island Heights', county: 'Ocean', bfe: 8, zone: 'AE' },
  { zip: '08734', name: 'Lanoka Harbor', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08050', name: 'Manahawkin', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08721', name: 'Bayville', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08005', name: 'Barnegat', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08006', name: 'Barnegat Light (LBI)', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08731', name: 'Forked River', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08087', name: 'Tuckerton', county: 'Ocean', bfe: 7, zone: 'AE' },
  { zip: '08092', name: 'West Creek', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08008', name: 'Beach Haven (LBI)', county: 'Ocean', bfe: 10, zone: 'VE' },
  { zip: '08758', name: 'Waretown', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08759', name: 'Stafford Township', county: 'Ocean', bfe: 6, zone: 'AE' },
  { zip: '08701', name: 'Lakewood', county: 'Ocean', bfe: 5, zone: 'X' },
  // MONMOUTH COUNTY
  { zip: '07719', name: 'Belmar', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07717', name: 'Avon-by-the-Sea', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07720', name: 'Bradley Beach', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07750', name: 'Monmouth Beach', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07760', name: 'Rumson', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07762', name: 'Spring Lake', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07763', name: 'Spring Lake Heights', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07764', name: 'West Long Branch', county: 'Monmouth', bfe: 7, zone: 'AE' },
  { zip: '07740', name: 'Long Branch', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07753', name: 'Neptune', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07756', name: 'Ocean Grove', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07757', name: 'Oceanport', county: 'Monmouth', bfe: 7, zone: 'AE' },
  { zip: '07716', name: 'Atlantic Highlands', county: 'Monmouth', bfe: 8, zone: 'AE' },
  { zip: '07732', name: 'Highlands', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07734', name: 'Keansburg', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07735', name: 'Keyport', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07765', name: 'Sea Bright', county: 'Monmouth', bfe: 11, zone: 'VE' },
  { zip: '07723', name: 'Deal', county: 'Monmouth', bfe: 10, zone: 'VE' },
  { zip: '07712', name: 'Asbury Park', county: 'Monmouth', bfe: 9, zone: 'AE' },
  { zip: '07701', name: 'Red Bank', county: 'Monmouth', bfe: 7, zone: 'AE' },
  { zip: '07704', name: 'Fair Haven', county: 'Monmouth', bfe: 7, zone: 'AE' },
  { zip: '07739', name: 'Little Silver', county: 'Monmouth', bfe: 7, zone: 'AE' },
  { zip: '07748', name: 'Middletown', county: 'Monmouth', bfe: 6, zone: 'AE' },
  { zip: '07747', name: 'Matawan', county: 'Monmouth', bfe: 6, zone: 'AE' },
  // ATLANTIC COUNTY
  { zip: '08401', name: 'Atlantic City', county: 'Atlantic', bfe: 9, zone: 'VE' },
  { zip: '08402', name: 'Margate', county: 'Atlantic', bfe: 9, zone: 'AE' },
  { zip: '08403', name: 'Longport', county: 'Atlantic', bfe: 10, zone: 'VE' },
  { zip: '08406', name: 'Ventnor', county: 'Atlantic', bfe: 9, zone: 'AE' },
  { zip: '08203', name: 'Brigantine', county: 'Atlantic', bfe: 10, zone: 'VE' },
  { zip: '08201', name: 'Absecon', county: 'Atlantic', bfe: 6, zone: 'AE' },
  { zip: '08244', name: 'Somers Point', county: 'Atlantic', bfe: 7, zone: 'AE' },
  { zip: '08234', name: 'Egg Harbor Township', county: 'Atlantic', bfe: 5, zone: 'AE' },
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
  { zip: '08252', name: 'West Cape May', county: 'Cape May', bfe: 9, zone: 'AE' },
  { zip: '08210', name: 'Cape May Court House', county: 'Cape May', bfe: 6, zone: 'AE' },
].sort((a, b) => a.name.localeCompare(b.name));

// Group towns by county for dropdown
const TOWNS_BY_COUNTY = SHORE_TOWNS.reduce((acc, town) => {
  if (!acc[town.county]) acc[town.county] = [];
  acc[town.county].push(town);
  return acc;
}, {});

// =============================================================================
// COMPONENTS
// =============================================================================

const ProgressRing = ({ progress, size = 100 }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={progress >= 60 ? '#10b981' : progress >= 30 ? '#f59e0b' : '#06b6d4'}
          strokeWidth={strokeWidth} strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, description, value, onChange, reward }) => (
  <div className={`p-4 rounded-xl border-2 transition-all ${
    value === true ? 'bg-emerald-500/10 border-emerald-500/50' :
    value === false ? 'bg-slate-800/50 border-slate-600' :
    'bg-slate-800/30 border-slate-700 hover:border-slate-600'
  }`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h4 className="font-medium text-white">{question}</h4>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        {value === true && reward && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-emerald-400 mt-2 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" /> {reward}
          </motion.p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            value === true ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >Yes</button>
        <button
          onClick={() => onChange(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            value === false ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >No</button>
      </div>
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, label, value, subtitle, color = 'cyan' }) => {
  const colors = {
    cyan: 'border-cyan-500/30 text-cyan-400',
    emerald: 'border-emerald-500/30 text-emerald-400',
    amber: 'border-amber-500/30 text-amber-400',
    red: 'border-red-500/30 text-red-400',
  };
  
  return (
    <div className={`bg-slate-800/50 rounded-xl p-4 border ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${colors[color].split(' ')[1]}`} />
        <span className="text-xs text-slate-400 uppercase">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const SavingsRow = ({ label, amount, achieved }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${achieved ? 'bg-emerald-500/10' : 'bg-slate-800/30'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${achieved ? 'bg-emerald-500' : 'bg-slate-700'}`}>
        {achieved ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-500 rounded-full" />}
      </div>
      <span className={achieved ? 'text-emerald-400' : 'text-slate-400'}>{label}</span>
    </div>
    <span className={`font-bold ${achieved ? 'text-emerald-400' : 'text-slate-500'}`}>
      ${amount}/yr
    </span>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CommandCenter() {
  const [selectedTown, setSelectedTown] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_town_v5');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_answers_v5');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Save to localStorage
  useEffect(() => {
    if (selectedTown) localStorage.setItem('shs_town_v5', JSON.stringify(selectedTown));
  }, [selectedTown]);
  
  useEffect(() => {
    localStorage.setItem('shs_answers_v5', JSON.stringify(answers));
  }, [answers]);
  
  const updateAnswer = useCallback((key, value) => {
    setAnswers(prev => {
      if (value === true && prev[key] !== true) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }
      return { ...prev, [key]: value };
    });
  }, []);
  
  const handleTownSelect = (e) => {
    const zip = e.target.value;
    const town = SHORE_TOWNS.find(t => t.zip === zip);
    if (town) setSelectedTown(town);
  };
  
  // Calculations
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined).length;
  const totalQuestions = 6;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  
  const savings = useMemo(() => {
    let total = 0;
    if (answers.hasElevationCert) total += 500;
    if (answers.hasFloodVents) total += 300;
    if (answers.hasImpactWindows) total += 500;
    if (answers.hasRoofDeck) total += 400;
    if (answers.hasWaterShutoff) total += 200;
    if (answers.isElevated) total += 800;
    return total;
  }, [answers]);
  
  const potential = useMemo(() => {
    let total = 0;
    if (answers.hasElevationCert === false) total += 500;
    if (answers.hasFloodVents === false) total += 300;
    if (answers.hasImpactWindows === false) total += 500;
    if (answers.hasRoofDeck === false) total += 400;
    if (answers.hasWaterShutoff === false) total += 200;
    if (answers.isElevated === false) total += 800;
    return total;
  }, [answers]);

  // ===================
  // WELCOME SCREEN
  // ===================
  if (!selectedTown) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-4 border border-cyan-500/30">
              <Shield className="w-4 h-4" />
              NJ Shore Home Protection
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome! 👋
            </h1>
            <p className="text-slate-400">
              Let's see how protected your shore home is and find ways to save money.
            </p>
          </div>
          
          {/* Town Selector */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Where's your shore home?
            </label>
            
            <div className="relative">
              <select
                onChange={handleTownSelect}
                defaultValue=""
                className="w-full px-4 py-4 bg-slate-900 border-2 border-slate-600 rounded-xl text-white text-lg appearance-none cursor-pointer focus:border-cyan-500 focus:outline-none"
              >
                <option value="" disabled>Select your town...</option>
                {Object.entries(TOWNS_BY_COUNTY).map(([county, towns]) => (
                  <optgroup key={county} label={`── ${county} County ──`}>
                    {towns.sort((a,b) => a.name.localeCompare(b.name)).map(town => (
                      <option key={town.zip} value={town.zip}>
                        {town.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            
            <p className="text-xs text-slate-500 text-center mt-4">
              We'll show you flood zone info and insurance savings opportunities
            </p>
          </div>
          
          {/* Trust badges */}
          <div className="mt-6 flex justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Free
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-500" />
              2 min
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-cyan-500" />
              FEMA data
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===================
  // MAIN DASHBOARD
  // ===================
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              className="text-6xl"
            >🎉</motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Home className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-white">{selectedTown.name}</h1>
              <p className="text-xs text-slate-400">{selectedTown.county} County</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedTown(null);
              localStorage.removeItem('shs_town_v5');
            }}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-700"
          >
            Change
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Section */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-6">
            <ProgressRing progress={progress} />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                {progress === 0 ? "Let's get started! 👋" :
                 progress < 50 ? "Making progress! 💪" :
                 progress < 100 ? "Almost there! 🔥" :
                 "All done! 🎉"}
              </h2>
              <p className="text-slate-400">
                {answeredCount} of {totalQuestions} questions answered
              </p>
              {savings > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">${savings.toLocaleString()}/yr in savings</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Info from Town Data */}
        <div className="grid grid-cols-2 gap-4">
          <InfoCard
            icon={Waves}
            label="Flood Zone"
            value={selectedTown.zone}
            subtitle={selectedTown.zone.startsWith('V') ? 'Coastal High Risk' : selectedTown.zone.startsWith('A') ? 'High Risk' : 'Moderate Risk'}
            color={selectedTown.zone.startsWith('V') ? 'red' : selectedTown.zone.startsWith('A') ? 'amber' : 'cyan'}
          />
          <InfoCard
            icon={TrendingUp}
            label="Base Flood Elevation"
            value={`${selectedTown.bfe} ft`}
            subtitle={`CAFE requires ${selectedTown.bfe + 4} ft`}
            color="cyan"
          />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            Tell us about your home
          </h3>
          
          <div className="space-y-3">
            <QuestionCard
              question="Do you have an Elevation Certificate?"
              description="Document showing your home's height relative to flood level"
              value={answers.hasElevationCert}
              onChange={(v) => updateAnswer('hasElevationCert', v)}
              reward="Nice! This typically saves $500/year"
            />
            
            <QuestionCard
              question="Is your home elevated above the Base Flood Elevation?"
              description={`Is your first floor higher than ${selectedTown.bfe} feet?`}
              value={answers.isElevated}
              onChange={(v) => updateAnswer('isElevated', v)}
              reward="Great! Elevation can save $800+/year"
            />
            
            <QuestionCard
              question="Do you have flood vents installed?"
              description="Vents in foundation or garage that let water flow through"
              value={answers.hasFloodVents}
              onChange={(v) => updateAnswer('hasFloodVents', v)}
              reward="Perfect! Saves around $300/year"
            />
            
            <QuestionCard
              question="Do you have impact windows or hurricane shutters?"
              description="Windows rated to withstand storms and debris"
              value={answers.hasImpactWindows}
              onChange={(v) => updateAnswer('hasImpactWindows', v)}
              reward="Excellent! Up to $500/year savings"
            />
            
            <QuestionCard
              question="Do you have a sealed roof deck?"
              description="Waterproof barrier under shingles"
              value={answers.hasRoofDeck}
              onChange={(v) => updateAnswer('hasRoofDeck', v)}
              reward="Smart! About $400/year savings"
            />
            
            <QuestionCard
              question="Do you have a smart water shutoff?"
              description="Auto-detects leaks and shuts off water"
              value={answers.hasWaterShutoff}
              onChange={(v) => updateAnswer('hasWaterShutoff', v)}
              reward="Nice! ~$200/year + prevents damage"
            />
          </div>
        </div>

        {/* Savings Summary - only show if they've answered something */}
        {answeredCount > 0 && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Insurance Savings Breakdown
            </h3>
            
            <div className="space-y-2">
              {answers.hasElevationCert !== undefined && (
                <SavingsRow label="Elevation Certificate" amount={500} achieved={answers.hasElevationCert} />
              )}
              {answers.isElevated !== undefined && (
                <SavingsRow label="Elevated Above BFE" amount={800} achieved={answers.isElevated} />
              )}
              {answers.hasFloodVents !== undefined && (
                <SavingsRow label="Flood Vents" amount={300} achieved={answers.hasFloodVents} />
              )}
              {answers.hasImpactWindows !== undefined && (
                <SavingsRow label="Impact Windows/Shutters" amount={500} achieved={answers.hasImpactWindows} />
              )}
              {answers.hasRoofDeck !== undefined && (
                <SavingsRow label="Sealed Roof Deck" amount={400} achieved={answers.hasRoofDeck} />
              )}
              {answers.hasWaterShutoff !== undefined && (
                <SavingsRow label="Smart Water Shutoff" amount={200} achieved={answers.hasWaterShutoff} />
              )}
            </div>
            
            {savings > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
                <span className="font-bold text-white">Your Annual Savings</span>
                <span className="text-xl font-bold text-emerald-400">${savings.toLocaleString()}/yr</span>
              </div>
            )}
            
            {potential > 0 && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-400">Available with improvements</span>
                <span className="text-amber-400 font-bold">+${potential.toLocaleString()}/yr</span>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        {answeredCount >= 2 && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-1">Ready to improve your home?</h3>
                <p className="text-sm text-slate-400">Connect with local contractors who specialize in shore homes</p>
              </div>
              <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl flex items-center gap-2 whitespace-nowrap">
                <Phone className="w-5 h-5" />
                Get Free Quotes
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-4 text-sm text-slate-500">
          ShoreHomeScore • Helping NJ Shore Homeowners
        </footer>
      </main>
    </div>
  );
}
