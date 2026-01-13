import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, Shield, Droplets, Thermometer, Zap, FileCheck,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronRight, ChevronDown, Info, Lock, Award, Calendar,
  DollarSign, Building, Waves, Wind, Battery, Gauge,
  FileText, MapPin, ArrowRight, RefreshCw, X, Check, 
  AlertCircle, Target, Layers, Activity, LogOut, Menu
} from 'lucide-react';

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================
const CAFE_ELEVATION = 4;
const CUMULATIVE_YELLOW_THRESHOLD = 0.40;
const CUMULATIVE_RED_THRESHOLD = 0.50;
const LEGACY_WINDOW_END = new Date('2026-07-15');

const PHASES = [
  { id: 'planning', name: 'Phase 1: Planning', icon: FileCheck, color: 'cyan' },
  { id: 'foundation', name: 'Phase 2: Foundation', icon: Building, color: 'amber' },
  { id: 'shell', name: 'Phase 3: Shell/Dry-In', icon: Home, color: 'emerald' },
  { id: 'systems', name: 'Phase 4: Systems', icon: Zap, color: 'violet' },
  { id: 'finishes', name: 'Phase 5: Finishes', icon: Layers, color: 'rose' },
];

const BADGES = {
  cafeReady: { icon: '🛡️', name: '2026 Ready', desc: 'FFE meets +4ft CAFE standard' },
  disclosureReady: { icon: '📜', name: 'Disclosure Ready', desc: 'All NJ flood forms generated' },
  complianceGuard: { icon: '⚖️', name: 'Compliance Guard', desc: '>15% buffer on 50% cap' },
  fortified: { icon: '🏰', name: 'FORTIFIED', desc: 'IBHS FORTIFIED certification' },
  legacyLocked: { icon: '⏰', name: 'Legacy Locked', desc: 'Application under old standards' },
  gridIndependent: { icon: '🔋', name: 'Grid Independent', desc: 'Battery + solar ready' },
};

// =============================================================================
// SPATIAL HOME VISUALIZATION
// =============================================================================
const SpatialHomeVisualization = ({ selections, compliance, phase }) => {
  const [hoveredZone, setHoveredZone] = useState(null);

  const getZoneStatus = (zone) => {
    const statusMap = {
      roof: selections.fortifiedRoof ? 'complete' : selections.roofType === 'metal' ? 'partial' : 'pending',
      windows: selections.iecc2024Windows ? 'complete' : 'pending',
      foundation: compliance.cafeCompliant ? 'complete' : selections.elevatedFoundation ? 'partial' : 'pending',
      hvac: selections.elevatedHVAC ? 'complete' : 'pending',
      electrical: selections.elevatedElectrical ? 'complete' : 'pending',
      vents: selections.smartFloodVents ? 'complete' : 'pending',
      water: selections.smartWaterShutoff ? 'complete' : 'pending',
      solar: selections.solarReady ? 'complete' : 'pending',
      battery: selections.batteryBackup ? 'complete' : 'pending',
    };
    return statusMap[zone] || 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'from-emerald-400 to-emerald-600';
      case 'partial': return 'from-amber-400 to-amber-600';
      default: return 'from-slate-500 to-slate-700';
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-900/30 rounded-2xl overflow-hidden border-2 border-slate-700">
      {/* Ocean Background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 overflow-hidden">
        <motion.div
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-t from-cyan-600/40 via-cyan-500/20 to-transparent"
        />
      </div>

      {/* BFE Line */}
      <div className="absolute left-4 bottom-[28%] right-4 border-t-2 border-dashed border-cyan-400/60">
        <span className="absolute -top-6 left-0 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded">
          BFE (Base Flood Elevation)
        </span>
      </div>

      {/* CAFE +4ft Line */}
      <div className="absolute left-4 bottom-[45%] right-4 border-t-2 border-emerald-400/60">
        <span className="absolute -top-6 right-0 text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded">
          CAFE +4ft (2026 Required)
        </span>
      </div>

      {/* House Structure */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[15%] w-[70%] max-w-[400px]">
        {/* Foundation/Stilts */}
        <motion.div className="absolute -bottom-[60px] left-[10%] right-[10%] h-[80px] flex justify-around">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-4 bg-gradient-to-b ${getStatusColor(getZoneStatus('foundation'))} rounded-t shadow-lg`}
              style={{ height: compliance.cafeCompliant ? '100%' : '60%' }}
            />
          ))}
        </motion.div>

        {/* Main House Body */}
        <div className="relative bg-gradient-to-b from-slate-200 to-slate-300 rounded-t-lg shadow-2xl border-2 border-slate-400">
          {/* Roof */}
          <motion.div
            className={`absolute -top-16 left-[-10%] right-[-10%] h-20 bg-gradient-to-b ${getStatusColor(getZoneStatus('roof'))} shadow-lg`}
            style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
            onMouseEnter={() => setHoveredZone('roof')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {selections.solarReady && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded border border-blue-500" />
            )}
          </motion.div>

          {/* Windows */}
          <div className="p-4 min-h-[120px] grid grid-cols-2 gap-2">
            <motion.div
              className={`aspect-square bg-gradient-to-br ${getStatusColor(getZoneStatus('windows'))} rounded border-2 border-slate-500 flex items-center justify-center shadow-inner`}
              onMouseEnter={() => setHoveredZone('windows')}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <span className="text-[8px] text-white/80 font-mono">U≤0.30</span>
            </motion.div>
            <motion.div
              className={`aspect-square bg-gradient-to-br ${getStatusColor(getZoneStatus('windows'))} rounded border-2 border-slate-500 flex items-center justify-center shadow-inner`}
            >
              <span className="text-[8px] text-white/80 font-mono">IECC</span>
            </motion.div>

            {/* HVAC */}
            <motion.div
              className={`aspect-[2/1] col-span-2 bg-gradient-to-r ${getStatusColor(getZoneStatus('hvac'))} rounded flex items-center justify-center gap-2 shadow-lg`}
              onMouseEnter={() => setHoveredZone('hvac')}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <Thermometer className="w-3 h-3 text-white/80" />
              <span className="text-[8px] text-white/80 font-mono">HVAC +4ft</span>
            </motion.div>
          </div>

          {/* Smart Systems */}
          <div className="absolute -right-8 top-4 flex flex-col gap-2">
            <motion.div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getStatusColor(getZoneStatus('water'))} flex items-center justify-center shadow-lg`}
            >
              <Droplets className="w-3 h-3 text-white" />
            </motion.div>
            <motion.div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getStatusColor(getZoneStatus('battery'))} flex items-center justify-center shadow-lg`}
            >
              <Battery className="w-3 h-3 text-white" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hover Info */}
      <AnimatePresence>
        {hoveredZone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 max-w-[200px]"
          >
            <div className="text-xs font-bold text-slate-200 capitalize mb-1">
              {hoveredZone.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className={`text-[10px] font-mono ${
              getZoneStatus(hoveredZone) === 'complete' ? 'text-emerald-400' :
              getZoneStatus(hoveredZone) === 'partial' ? 'text-amber-400' : 'text-slate-400'
            }`}>
              Status: {getZoneStatus(hoveredZone).toUpperCase()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase Indicator */}
      <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-600 rounded-lg px-3 py-2">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Current Phase</div>
        <div className="text-sm font-bold text-slate-100">{PHASES[phase]?.name || 'Planning'}</div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPLIANCE GAUGE
// =============================================================================
const ComplianceGauge = ({ cumulative, threshold = 0.50, label = "Cumulative Improvement" }) => {
  const percentage = Math.min(cumulative * 100, 100);
  const yellowZone = CUMULATIVE_YELLOW_THRESHOLD * 100;
  const redZone = CUMULATIVE_RED_THRESHOLD * 100;
  
  const getZoneColor = () => {
    if (percentage >= redZone) return { bg: 'from-red-500 to-red-700', text: 'text-red-400' };
    if (percentage >= yellowZone) return { bg: 'from-amber-500 to-amber-700', text: 'text-amber-400' };
    return { bg: 'from-emerald-500 to-emerald-700', text: 'text-emerald-400' };
  };

  const colors = getZoneColor();
  const remaining = Math.max(threshold * 100 - percentage, 0);

  return (
    <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{label}</h3>
        <div className={`text-xs font-mono px-2 py-1 rounded ${colors.text} bg-slate-900`}>
          {remaining.toFixed(1)}% Buffer
        </div>
      </div>

      <div className="relative h-8 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
        <div className="absolute top-0 bottom-0 left-[40%] w-px bg-amber-500/50 z-10" />
        <div className="absolute top-0 bottom-0 left-[50%] w-px bg-red-500/50 z-10" />
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${colors.bg}`}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-[10px] font-mono">
        <span className="text-emerald-400">Safe</span>
        <span className="text-amber-400">40% Yellow</span>
        <span className="text-red-400">50% Red</span>
      </div>

      <AnimatePresence>
        {percentage >= redZone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-red-400">MANDATORY ELEVATION TRIGGERED</div>
                <div className="text-[10px] text-red-300/80 mt-1">
                  NJ REAL 2026 requires elevation to BFE +4ft when cumulative improvements exceed 50%.
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {percentage >= yellowZone && percentage < redZone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-400">CONTRACTOR AFFIDAVIT REQUIRED</div>
                <div className="text-[10px] text-amber-300/80 mt-1">
                  Projects in the 40-50% zone require signed contractor affidavits.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// LEGACY WINDOW COUNTDOWN
// =============================================================================
const LegacyWindowCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = LEGACY_WINDOW_END - now;
      
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, expired: true };
      }
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        expired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.expired) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 opacity-50">
        <div className="text-xs text-slate-500 uppercase tracking-wider">Legacy Window</div>
        <div className="text-sm text-slate-400 mt-1">Expired</div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border-2 border-amber-500/50 rounded-xl p-4"
      animate={{ borderColor: ['rgba(245, 158, 11, 0.5)', 'rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.5)'] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-amber-400" />
        <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">
          July 2026 Legacy Window
        </span>
      </div>
      <div className="flex gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-300 font-mono">{timeLeft.days}</div>
          <div className="text-[10px] text-amber-500">DAYS</div>
        </div>
        <div className="text-2xl text-amber-500">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-300 font-mono">{timeLeft.hours}</div>
          <div className="text-[10px] text-amber-500">HRS</div>
        </div>
        <div className="text-2xl text-amber-500">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-300 font-mono">{timeLeft.minutes}</div>
          <div className="text-[10px] text-amber-500">MIN</div>
        </div>
      </div>
      <p className="text-[10px] text-amber-400/70 mt-3">
        Submit complete applications before deadline to qualify under old elevation standards.
      </p>
    </motion.div>
  );
};

// =============================================================================
// PHASE PROGRESS TRACKER
// =============================================================================
const PhaseProgressTracker = ({ currentPhase, phaseCompletion }) => {
  return (
    <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
        GC Sequence Progress
      </h3>
      <div className="space-y-3">
        {PHASES.map((phase, index) => {
          const isActive = index === currentPhase;
          const isComplete = index < currentPhase;
          const isLocked = index > currentPhase && index === 4 && currentPhase < 2;
          const completion = phaseCompletion[phase.id] || 0;
          const Icon = phase.icon;

          return (
            <motion.div
              key={phase.id}
              className={`relative p-3 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-cyan-500 bg-cyan-900/20'
                  : isComplete
                  ? 'border-emerald-500/50 bg-emerald-900/10'
                  : isLocked
                  ? 'border-slate-700 bg-slate-900/50 opacity-50'
                  : 'border-slate-700 bg-slate-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isComplete ? 'bg-emerald-500' :
                  isActive ? 'bg-cyan-500' : 'bg-slate-700'
                }`}>
                  {isComplete ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Icon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${
                      isActive ? 'text-slate-100' : 'text-slate-400'
                    }`}>
                      {phase.name}
                    </span>
                    <span className={`text-xs font-mono ${
                      isComplete ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {isComplete ? '100%' : `${completion}%`}
                    </span>
                  </div>
                  {!isLocked && (
                    <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isComplete ? '100%' : `${completion}%` }}
                        className={`h-full rounded-full ${
                          isComplete ? 'bg-emerald-500' : 'bg-cyan-500'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isLocked && (
                <div className="text-[10px] text-slate-500 mt-2 ml-13">
                  🔒 Locked until Phase 3 "Dry-In" confirmed
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// BADGE DISPLAY
// =============================================================================
const BadgeDisplay = ({ earnedBadges }) => {
  return (
    <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
        Earned Badges
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(BADGES).map(([key, badge]) => {
          const earned = earnedBadges.includes(key);
          return (
            <motion.div
              key={key}
              className={`relative p-3 rounded-xl text-center transition-all ${
                earned
                  ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/20 border-2 border-amber-500/50'
                  : 'bg-slate-900/50 border-2 border-slate-700 opacity-40'
              }`}
              whileHover={earned ? { scale: 1.05 } : {}}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className={`text-xs font-bold ${earned ? 'text-amber-300' : 'text-slate-600'}`}>
                {badge.name}
              </div>
              {earned && (
                <div className="text-[8px] text-amber-500/70 mt-1">{badge.desc}</div>
              )}
              {!earned && (
                <Lock className="absolute top-2 right-2 w-3 h-3 text-slate-600" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================
export default function Dashboard2026() {
  const navigate = useNavigate();

  // Property Data State
  const [propertyData, setPropertyData] = useState({
    address: '',
    zipCode: '08742',
    municipality: 'Point Pleasant Beach',
    county: 'Ocean',
    marketValue: 650000,
    structureValue: 450000,
    currentFFE: 8,
    bfe: 9,
    floodZone: 'AE',
    isTidal: true,
    inIRZ: false,
    yearBuilt: 1985,
  });

  // Permit History State
  const [permitHistory, setPermitHistory] = useState([
    { id: 1, description: 'Kitchen Renovation', cost: 45000, date: '2022-06-15' },
    { id: 2, description: 'New Windows', cost: 28000, date: '2023-03-20' },
    { id: 3, description: 'HVAC Replacement', cost: 18000, date: '2024-01-10' },
  ]);

  // Selections State
  const [selections, setSelections] = useState({
    elevationCert: true,
    permitAudit: true,
    legacyApplication: false,
    elevatedFoundation: false,
    smartFloodVents: false,
    breakawayWalls: false,
    fortifiedRoof: false,
    roofType: 'architectural',
    iecc2024Windows: false,
    continuousInsulation: false,
    elevatedHVAC: false,
    elevatedElectrical: false,
    smartWaterShutoff: true,
    floodResistantMaterials: false,
    elevatedAppliances: false,
    solarReady: false,
    batteryBackup: false,
  });

  const [currentPhase, setCurrentPhase] = useState(0);

  // Calculate Compliance
  const compliance = useMemo(() => {
    const tenYearTotal = permitHistory.reduce((sum, p) => sum + p.cost, 0);
    const cumulativePct = tenYearTotal / propertyData.structureValue;
    const cafeRequired = propertyData.bfe + CAFE_ELEVATION;
    const cafeCompliant = propertyData.currentFFE >= cafeRequired;
    const bufferRemaining = CUMULATIVE_RED_THRESHOLD - cumulativePct;
    
    return {
      tenYearTotal,
      cumulativePct,
      cafeRequired,
      cafeCompliant,
      bufferRemaining,
      affidavitRequired: cumulativePct >= CUMULATIVE_YELLOW_THRESHOLD,
      elevationRequired: cumulativePct >= CUMULATIVE_RED_THRESHOLD,
    };
  }, [permitHistory, propertyData]);

  // Earned Badges
  const earnedBadges = useMemo(() => {
    const badges = [];
    if (compliance.cafeCompliant) badges.push('cafeReady');
    if (selections.elevationCert && selections.permitAudit) badges.push('disclosureReady');
    if (compliance.bufferRemaining > 0.15) badges.push('complianceGuard');
    if (selections.fortifiedRoof) badges.push('fortified');
    if (selections.legacyApplication) badges.push('legacyLocked');
    if (selections.solarReady && selections.batteryBackup) badges.push('gridIndependent');
    return badges;
  }, [compliance, selections]);

  // Phase Completion
  const phaseCompletion = useMemo(() => ({
    planning: ((selections.elevationCert ? 33 : 0) + (selections.permitAudit ? 33 : 0) + (selections.legacyApplication ? 34 : 0)),
    foundation: ((selections.elevatedFoundation ? 40 : 0) + (selections.smartFloodVents ? 30 : 0) + (selections.breakawayWalls ? 30 : 0)),
    shell: ((selections.fortifiedRoof ? 40 : 0) + (selections.iecc2024Windows ? 35 : 0) + (selections.continuousInsulation ? 25 : 0)),
    systems: ((selections.elevatedHVAC ? 35 : 0) + (selections.elevatedElectrical ? 35 : 0) + (selections.smartWaterShutoff ? 30 : 0)),
    finishes: ((selections.floodResistantMaterials ? 50 : 0) + (selections.elevatedAppliances ? 50 : 0)),
  }), [selections]);

  // Master Score
  const masterScore = useMemo(() => {
    const phaseScores = Object.values(phaseCompletion);
    const total = phaseScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / phaseScores.length);
  }, [phaseCompletion]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b-2 border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                  whileHover={{ rotate: 5 }}
                >
                  <Home className="w-6 h-6 text-slate-900" />
                </motion.div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-100">ShoreHomeScore</h1>
                <p className="text-xs text-cyan-400 font-mono">2026 Coastal Asset Architect</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <LegacyWindowCountdown />
              </div>
              
              {/* Master Score Gauge */}
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-800" />
                  <motion.circle
                    cx="32" cy="32" r="28" fill="none" stroke="url(#scoreGrad)" strokeWidth="4" strokeLinecap="round"
                    initial={{ strokeDasharray: "0 176" }}
                    animate={{ strokeDasharray: `${masterScore * 1.76} 176` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-bold text-slate-100">{masterScore}</span>
                </div>
              </div>

              <Link to="/dashboard" className="text-slate-400 hover:text-slate-200 text-sm">
                Classic View
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <SpatialHomeVisualization
              selections={selections}
              compliance={compliance}
              phase={currentPhase}
            />

            <ComplianceGauge
              cumulative={compliance.cumulativePct}
              threshold={CUMULATIVE_RED_THRESHOLD}
              label="10-Year Cumulative Improvement"
            />

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Market Value', value: `$${(propertyData.marketValue/1000).toFixed(0)}K`, color: 'text-slate-200' },
                { label: 'CAFE Required', value: `${compliance.cafeRequired}ft`, color: 'text-emerald-400' },
                { label: '10-Year Permits', value: `$${(compliance.tenYearTotal/1000).toFixed(0)}K`, color: 'text-amber-400' },
                { label: '40% Threshold', value: `$${(propertyData.structureValue * 0.4 / 1000).toFixed(0)}K`, color: 'text-cyan-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                  <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <PhaseProgressTracker currentPhase={currentPhase} phaseCompletion={phaseCompletion} />
            <BadgeDisplay earnedBadges={earnedBadges} />

            {/* Quick Actions */}
            <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/checklist" className="flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  <span className="text-sm text-slate-200">Edit Checklist</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link to="/documents" className="flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  <span className="text-sm text-slate-200">Document Vault</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link to="/contractors" className="flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  <span className="text-sm text-slate-200">Find Contractors</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-slate-800 mt-12 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xs text-slate-600">
              © 2026 ShoreHomeScore | NJ REAL Rules (N.J.A.C. 7:13) | CAFE +4ft Standard | IECC 2024
            </p>
            <p className="text-[10px] text-slate-700 mt-2">
              Educational tool only. Consult licensed professionals for project-specific guidance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
