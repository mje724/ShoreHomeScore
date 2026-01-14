import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, Zap,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronDown, ChevronRight, Info,
  DollarSign, MapPin, Bell, X, HelpCircle,
  ArrowRight, Phone, FileText, Waves, Thermometer,
  CheckSquare, AlertCircle, ArrowUp, Search, 
  Calendar, Users, ExternalLink, Star, Target
} from 'lucide-react';

// =============================================================================
// CONFIGURATION
// =============================================================================
const CAFE_ELEVATION = 4;
const LAND_VALUE_PERCENT = 0.35;
const LEGACY_WINDOW_END = new Date('2026-07-15');

// NJ Shore ZIP code data
const ZIP_DATA = {
  '08742': { municipality: 'Point Pleasant Beach', county: 'Ocean', bfe: 9, floodZone: 'AE', pricePerSqft: 450 },
  '08751': { municipality: 'Seaside Heights', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 380 },
  '08752': { municipality: 'Seaside Park', county: 'Ocean', bfe: 10, floodZone: 'AE', pricePerSqft: 400 },
  '08753': { municipality: 'Toms River', county: 'Ocean', bfe: 8, floodZone: 'AE', pricePerSqft: 350 },
  '08723': { municipality: 'Brick', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 400 },
  '08735': { municipality: 'Lavallette', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 550 },
  '08738': { municipality: 'Mantoloking', county: 'Ocean', bfe: 11, floodZone: 'VE', pricePerSqft: 600 },
  '08008': { municipality: 'Long Beach Island', county: 'Ocean', bfe: 10, floodZone: 'VE', pricePerSqft: 650 },
  '07719': { municipality: 'Belmar', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 550 },
  '07750': { municipality: 'Monmouth Beach', county: 'Monmouth', bfe: 10, floodZone: 'VE', pricePerSqft: 700 },
  '07762': { municipality: 'Spring Lake', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 750 },
  '08050': { municipality: 'Manahawkin', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 350 },
  '08721': { municipality: 'Bayville', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 380 },
  '08005': { municipality: 'Barnegat', county: 'Ocean', bfe: 6, floodZone: 'AE', pricePerSqft: 320 },
  '08731': { municipality: 'Forked River', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 370 },
  '08087': { municipality: 'Tuckerton', county: 'Ocean', bfe: 7, floodZone: 'AE', pricePerSqft: 340 },
  '07740': { municipality: 'Long Branch', county: 'Monmouth', bfe: 9, floodZone: 'AE', pricePerSqft: 480 },
  '07760': { municipality: 'Rumson', county: 'Monmouth', bfe: 8, floodZone: 'AE', pricePerSqft: 850 },
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

// Weather Alert Banner - only shows when there are alerts
const WeatherBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;
  
  const severe = alerts.find(a => a.severity === 'Severe' || a.severity === 'Extreme');
  if (!severe) return null;
  
  return (
    <motion.div 
      initial={{ y: -100 }} 
      animate={{ y: 0 }}
      className="bg-red-600 text-white px-4 py-3"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <span className="font-bold">{severe.event}:</span> {severe.headline}
        </div>
      </div>
    </motion.div>
  );
};

// Simple score display
const ScoreDisplay = ({ score, label }) => {
  const getColor = () => {
    if (score >= 70) return { ring: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (score >= 40) return { ring: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-500' };
    return { ring: 'border-red-500', text: 'text-red-400', bg: 'bg-red-500' };
  };
  const colors = getColor();
  
  return (
    <div className="text-center">
      <div className={`w-32 h-32 mx-auto rounded-full border-8 ${colors.ring} flex items-center justify-center bg-slate-900`}>
        <span className="text-4xl font-bold text-white">{score}</span>
      </div>
      <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-bold ${colors.bg} text-white`}>
        {label}
      </div>
    </div>
  );
};

// Action item component
const ActionItem = ({ number, title, description, impact, status, onClick }) => {
  const statusStyles = {
    complete: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
    priority: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    optional: 'bg-slate-700/50 border-slate-600 text-slate-400',
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 ${statusStyles[status]} transition-all`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          status === 'complete' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
        }`}>
          {status === 'complete' ? <CheckCircle className="w-5 h-5" /> : number}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white text-base">{title}</h4>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
          {impact && (
            <p className="text-sm mt-2 font-medium text-emerald-400">{impact}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500" />
      </div>
    </motion.button>
  );
};

// Info card for key metrics
const MetricCard = ({ icon: Icon, label, value, subtext, color = 'cyan' }) => {
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    red: 'text-red-400 bg-red-500/20',
  };
  
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
};

// Expandable section
const ExpandableSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700 rounded-lg">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-bold text-white">{title}</span>
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

// Quick checklist toggle
const QuickToggle = ({ label, value, onChange, description }) => (
  <button
    onClick={() => onChange(!value)}
    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
      value 
        ? 'bg-emerald-500/20 border-emerald-500/50' 
        : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
        value ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'
      }`}>
        {value && <CheckCircle className="w-4 h-4 text-white" />}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${value ? 'text-emerald-400' : 'text-slate-300'}`}>{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  </button>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CommandCenter() {
  // Core state
  const [currentView, setCurrentView] = useState('entry'); // entry, results
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Property data
  const [propertyData, setPropertyData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_property_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.zipCode) return { ...parsed, view: 'results' };
        return parsed;
      }
    }
    return { address: '', zipCode: '' };
  });
  
  // Checklist answers
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_answers_v3');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // API data
  const [femaData, setFemaData] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [claimsData, setClaimsData] = useState(null);
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('shs_property_v3', JSON.stringify(propertyData));
  }, [propertyData]);
  
  useEffect(() => {
    localStorage.setItem('shs_answers_v3', JSON.stringify(answers));
  }, [answers]);
  
  // Auto-show results if we have data
  useEffect(() => {
    if (propertyData.zipCode && propertyData.floodZone) {
      setCurrentView('results');
    }
  }, []);
  
  // Fetch weather when we have coordinates
  useEffect(() => {
    if (propertyData.coordinates) {
      fetch(`/api/weather-alerts?lat=${propertyData.coordinates.lat}&lng=${propertyData.coordinates.lng}`)
        .then(r => r.json())
        .then(data => {
          if (data.alerts) setWeatherAlerts(data.alerts);
        })
        .catch(() => {});
    }
  }, [propertyData.coordinates]);

  // Look up property data
  const lookupProperty = async () => {
    if (!propertyData.address || !propertyData.zipCode) {
      setError('Please enter your address and zip code');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call FEMA API
      const response = await fetch(
        `/api/fema-lookup?address=${encodeURIComponent(propertyData.address)}&zipCode=${encodeURIComponent(propertyData.zipCode)}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Could not find that address');
      }
      
      // Get ZIP data for additional info
      const zipInfo = ZIP_DATA[propertyData.zipCode] || {};
      
      // Update property data
      setPropertyData(prev => ({
        ...prev,
        floodZone: data.floodZone || zipInfo.floodZone || 'AE',
        bfe: data.bfe || zipInfo.bfe || 9,
        municipality: zipInfo.municipality || '',
        county: zipInfo.county || '',
        coordinates: data.coordinates,
        femaVerified: true,
        pricePerSqft: zipInfo.pricePerSqft || 400,
      }));
      
      setFemaData(data);
      
      if (data.claims) {
        setClaimsData(data.claims);
      }
      
      setCurrentView('results');
      
    } catch (err) {
      setError(err.message || 'Lookup failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Calculate resilience score
  const score = useMemo(() => {
    let points = 0;
    const maxPoints = 100;
    
    // Elevation Certificate (15 points)
    if (answers.hasElevationCert) points += 15;
    
    // Elevation above BFE (20 points)
    if (answers.feetAboveBFE >= 4) points += 20;
    else if (answers.feetAboveBFE >= 2) points += 15;
    else if (answers.feetAboveBFE >= 0) points += 10;
    else if (answers.feetAboveBFE !== undefined) points += 5;
    
    // Foundation type (10 points)
    if (answers.foundationType === 'piles') points += 10;
    else if (answers.foundationType === 'piers') points += 8;
    else if (answers.foundationType === 'crawl') points += 5;
    
    // Flood vents (10 points)
    if (answers.hasFloodVents) points += 10;
    
    // Roof protection (15 points)
    if (answers.roofType === 'metal') points += 10;
    else if (answers.roofType === 'architectural') points += 6;
    else if (answers.roofType === 'standard') points += 3;
    
    if (answers.hasRoofDeck) points += 5;
    
    // Window protection (10 points)
    if (answers.windowProtection === 'impact') points += 10;
    else if (answers.windowProtection === 'shutters') points += 7;
    else if (answers.windowProtection === 'plywood') points += 3;
    
    // Smart protection (10 points)
    if (answers.hasWaterShutoff) points += 5;
    if (answers.hasBackupPower) points += 5;
    
    // Bonus for documentation (10 points)
    if (answers.knowsPermitHistory) points += 5;
    if (answers.hasFloodInsurance) points += 5;
    
    return Math.min(points, maxPoints);
  }, [answers]);

  // Score label
  const scoreLabel = useMemo(() => {
    if (score >= 70) return 'Well Protected';
    if (score >= 40) return 'Moderate Risk';
    return 'Vulnerable';
  }, [score]);

  // Insurance savings estimate
  const insuranceSavings = useMemo(() => {
    let savings = 0;
    
    if (answers.hasElevationCert) savings += 500;
    if (answers.feetAboveBFE >= 2) savings += 800;
    if (answers.hasFloodVents) savings += 300;
    if (answers.foundationType === 'piles' || answers.foundationType === 'piers') savings += 400;
    if (answers.roofType === 'metal') savings += 600;
    if (answers.hasRoofDeck) savings += 400;
    if (answers.windowProtection === 'impact') savings += 500;
    if (answers.hasWaterShutoff) savings += 200;
    
    return savings;
  }, [answers]);

  // Potential additional savings
  const potentialSavings = useMemo(() => {
    let potential = 0;
    
    if (!answers.hasElevationCert) potential += 500;
    if (!answers.feetAboveBFE || answers.feetAboveBFE < 2) potential += 800;
    if (!answers.hasFloodVents) potential += 300;
    if (!answers.hasRoofDeck) potential += 400;
    if (!answers.windowProtection || answers.windowProtection === 'none') potential += 500;
    if (!answers.hasWaterShutoff) potential += 200;
    
    return potential;
  }, [answers]);

  // Priority actions
  const priorityActions = useMemo(() => {
    const actions = [];
    
    if (!answers.hasElevationCert) {
      actions.push({
        id: 'elevation-cert',
        title: 'Get an Elevation Certificate',
        description: 'This document shows exactly how high your home sits relative to flood levels. Required for accurate insurance rating.',
        impact: 'Could save $500+/year on flood insurance',
        status: 'priority',
      });
    }
    
    if (!answers.hasFloodVents && propertyData.floodZone?.startsWith('A') || propertyData.floodZone?.startsWith('V')) {
      actions.push({
        id: 'flood-vents',
        title: 'Install Flood Vents',
        description: 'Allow water to flow through enclosed areas, reducing pressure on walls during floods.',
        impact: 'Up to $300/year insurance savings',
        status: 'priority',
      });
    }
    
    if (!answers.windowProtection || answers.windowProtection === 'none') {
      actions.push({
        id: 'windows',
        title: 'Add Window Protection',
        description: 'Impact windows or hurricane shutters protect against wind-borne debris.',
        impact: 'Up to $500/year insurance savings',
        status: 'priority',
      });
    }
    
    if (!answers.hasRoofDeck) {
      actions.push({
        id: 'roof-deck',
        title: 'Seal Your Roof Deck',
        description: 'A secondary water barrier under shingles prevents leaks if shingles blow off.',
        impact: 'Up to $400/year insurance savings',
        status: 'optional',
      });
    }
    
    if (!answers.hasWaterShutoff) {
      actions.push({
        id: 'water-shutoff',
        title: 'Install Smart Water Shutoff',
        description: 'Automatically detects leaks and shuts off water to prevent damage.',
        impact: 'Up to $200/year + prevents water damage',
        status: 'optional',
      });
    }
    
    // Mark completed items
    if (answers.hasElevationCert) {
      actions.push({
        id: 'elevation-cert-done',
        title: 'Elevation Certificate',
        description: 'You have this important document.',
        status: 'complete',
      });
    }
    
    return actions.slice(0, 5); // Show top 5
  }, [answers, propertyData]);

  // Days until legacy window closes
  const daysUntilLegacy = useMemo(() => {
    const now = new Date();
    const diff = LEGACY_WINDOW_END - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  // Risk level based on flood zone
  const riskLevel = useMemo(() => {
    const zone = propertyData.floodZone;
    if (!zone) return { level: 'Unknown', color: 'slate' };
    if (zone.startsWith('V')) return { level: 'High Risk (Coastal)', color: 'red' };
    if (zone.startsWith('A')) return { level: 'High Risk (Flood)', color: 'amber' };
    if (zone === 'X') return { level: 'Moderate Risk', color: 'emerald' };
    return { level: 'Unknown', color: 'slate' };
  }, [propertyData.floodZone]);

  // =============================================================================
  // RENDER: ADDRESS ENTRY VIEW
  // =============================================================================
  if (currentView === 'entry') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <WeatherBanner alerts={weatherAlerts} />
        
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              NJ Shore Resilience Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Is Your Shore Home <span className="text-cyan-400">Protected?</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg mx-auto">
              Get your personalized resilience score and discover how to protect your investment from storms and floods.
            </p>
          </div>
          
          {/* Address Entry Card */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={propertyData.address || ''}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Ocean Ave"
                  className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-white text-lg focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={propertyData.zipCode || ''}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, zipCode: e.target.value.slice(0, 5) }))}
                  placeholder="08742"
                  maxLength={5}
                  className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-white text-lg font-mono focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <button
                onClick={lookupProperty}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Your Property...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Get My Resilience Score
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-slate-500 text-center mt-4">
              We'll look up your official FEMA flood zone data and provide personalized recommendations.
            </p>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Free to use
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" />
              Official FEMA data
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Results in seconds
            </div>
          </div>
          
          {/* Legacy window alert */}
          {daysUntilLegacy > 0 && daysUntilLegacy < 180 && (
            <div className="mt-8 p-4 bg-amber-500/20 border border-amber-500/50 rounded-xl">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-400">Legacy Window Closing: {daysUntilLegacy} days left</p>
                  <p className="text-sm text-slate-400 mt-1">
                    New NJ CAFE rules require homes to be elevated higher. Apply before July 15, 2026 to use current standards.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDER: RESULTS VIEW
  // =============================================================================
  return (
    <div className="min-h-screen bg-slate-900">
      <WeatherBanner alerts={weatherAlerts} />
      
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">ShoreHomeScore</h1>
              <p className="text-xs text-slate-400">{propertyData.address || propertyData.zipCode}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">${insuranceSavings.toLocaleString()}/yr saved</span>
            </div>
            
            <button
              onClick={() => setCurrentView('entry')}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Change Address
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Top Section: Score + Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Card */}
          <div className="lg:col-span-1 bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <ScoreDisplay score={score} label={scoreLabel} />
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Your Score</span>
                <span className="text-white font-bold">{score}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Answer more questions below to improve accuracy
              </p>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <MetricCard
              icon={Waves}
              label="Flood Zone"
              value={propertyData.floodZone || 'Unknown'}
              subtext={riskLevel.level}
              color={riskLevel.color}
            />
            <MetricCard
              icon={ArrowUp}
              label="Base Flood Elevation"
              value={propertyData.bfe ? `${propertyData.bfe} ft` : 'Unknown'}
              subtext={propertyData.bfe ? `CAFE requires ${propertyData.bfe + 4} ft` : 'Look up your BFE'}
              color="cyan"
            />
            <MetricCard
              icon={DollarSign}
              label="Current Savings"
              value={`$${insuranceSavings.toLocaleString()}`}
              subtext="Estimated annual insurance savings"
              color="emerald"
            />
            <MetricCard
              icon={TrendingUp}
              label="Potential Savings"
              value={`+$${potentialSavings.toLocaleString()}`}
              subtext="Available with improvements"
              color="amber"
            />
          </div>
        </div>

        {/* Neighborhood Context */}
        {claimsData && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Your Neighborhood's Flood History</h3>
                <p className="text-sm text-slate-400">{propertyData.zipCode} • {propertyData.municipality}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                <p className="text-2xl font-bold text-amber-400">{claimsData.totalClaims?.toLocaleString() || '—'}</p>
                <p className="text-xs text-slate-500">Total Claims Filed</p>
              </div>
              <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                <p className="text-2xl font-bold text-white">${(claimsData.avgPayout || 45000).toLocaleString()}</p>
                <p className="text-xs text-slate-500">Avg Claim Payout</p>
              </div>
              <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                <p className="text-2xl font-bold text-cyan-400">{propertyData.bfe || '—'} ft</p>
                <p className="text-xs text-slate-500">Base Flood Elevation</p>
              </div>
              <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                <p className="text-2xl font-bold text-red-400">{propertyData.bfe ? propertyData.bfe + 4 : '—'} ft</p>
                <p className="text-xs text-slate-500">CAFE Requirement</p>
              </div>
            </div>
          </div>
        )}

        {/* Priority Actions */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Your Action Plan</h3>
                <p className="text-sm text-slate-400">Prioritized steps to protect your home</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {priorityActions.map((action, i) => (
              <ActionItem
                key={action.id}
                number={i + 1}
                {...action}
              />
            ))}
          </div>
        </div>

        {/* Quick Assessment */}
        <ExpandableSection title="Quick Home Assessment" icon={Home} defaultOpen={true}>
          <p className="text-sm text-slate-400 mb-4">
            Answer these questions to get a more accurate score and personalized recommendations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <QuickToggle
              label="I have an Elevation Certificate"
              description="Official document showing your home's elevation"
              value={answers.hasElevationCert}
              onChange={(v) => setAnswers(prev => ({ ...prev, hasElevationCert: v }))}
            />
            <QuickToggle
              label="I have flood vents installed"
              description="Vents in foundation/garage walls"
              value={answers.hasFloodVents}
              onChange={(v) => setAnswers(prev => ({ ...prev, hasFloodVents: v }))}
            />
            <QuickToggle
              label="I have a sealed roof deck"
              description="Waterproof membrane under shingles"
              value={answers.hasRoofDeck}
              onChange={(v) => setAnswers(prev => ({ ...prev, hasRoofDeck: v }))}
            />
            <QuickToggle
              label="I have impact windows or shutters"
              description="Hurricane-rated window protection"
              value={answers.windowProtection === 'impact' || answers.windowProtection === 'shutters'}
              onChange={(v) => setAnswers(prev => ({ ...prev, windowProtection: v ? 'impact' : 'none' }))}
            />
            <QuickToggle
              label="I have a smart water shutoff"
              description="Auto leak detection system"
              value={answers.hasWaterShutoff}
              onChange={(v) => setAnswers(prev => ({ ...prev, hasWaterShutoff: v }))}
            />
            <QuickToggle
              label="I have flood insurance"
              description="NFIP or private flood policy"
              value={answers.hasFloodInsurance}
              onChange={(v) => setAnswers(prev => ({ ...prev, hasFloodInsurance: v }))}
            />
          </div>
          
          {/* Elevation question */}
          <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              How high is your lowest floor above the Base Flood Elevation (BFE)?
            </label>
            <select
              value={answers.feetAboveBFE ?? ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, feetAboveBFE: e.target.value ? Number(e.target.value) : undefined }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
            >
              <option value="">I'm not sure</option>
              <option value="-2">2+ feet below BFE</option>
              <option value="-1">1 foot below BFE</option>
              <option value="0">At BFE (same level)</option>
              <option value="1">1 foot above BFE</option>
              <option value="2">2 feet above BFE</option>
              <option value="3">3 feet above BFE</option>
              <option value="4">4+ feet above BFE (meets CAFE)</option>
            </select>
          </div>
        </ExpandableSection>

        {/* Insurance Breakdown */}
        <ExpandableSection title="Insurance Savings Breakdown" icon={DollarSign}>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Elevation Certificate</span>
              <span className={answers.hasElevationCert ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {answers.hasElevationCert ? '+$500/yr' : '$500/yr available'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Elevation Above BFE</span>
              <span className={answers.feetAboveBFE >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {answers.feetAboveBFE >= 2 ? '+$800/yr' : '$800/yr available'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Flood Vents</span>
              <span className={answers.hasFloodVents ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {answers.hasFloodVents ? '+$300/yr' : '$300/yr available'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Sealed Roof Deck</span>
              <span className={answers.hasRoofDeck ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {answers.hasRoofDeck ? '+$400/yr' : '$400/yr available'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Impact Windows/Shutters</span>
              <span className={answers.windowProtection === 'impact' || answers.windowProtection === 'shutters' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {answers.windowProtection === 'impact' || answers.windowProtection === 'shutters' ? '+$500/yr' : '$500/yr available'}
              </span>
            </div>
            
            <div className="border-t border-slate-700 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total Annual Savings</span>
                <span className="text-emerald-400 font-bold text-xl">${insuranceSavings.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-400">10-Year Impact</span>
                <span className="text-white font-bold">${(insuranceSavings * 10).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* Future Risk */}
        <ExpandableSection title="Future Flood Risk" icon={Waves}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
              <p className="text-3xl font-bold text-amber-400">
                {propertyData.floodZone?.startsWith('V') ? '9' : propertyData.floodZone?.startsWith('A') ? '7' : '3'}/10
              </p>
              <p className="text-xs text-slate-500 mt-1">Current Risk</p>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
              <p className="text-3xl font-bold text-orange-400">
                {propertyData.floodZone?.startsWith('V') ? '10' : propertyData.floodZone?.startsWith('A') ? '8' : '5'}/10
              </p>
              <p className="text-xs text-slate-500 mt-1">15-Year Projection</p>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
              <p className="text-3xl font-bold text-red-400">
                {propertyData.floodZone?.startsWith('V') ? '10' : propertyData.floodZone?.startsWith('A') ? '9' : '6'}/10
              </p>
              <p className="text-xs text-slate-500 mt-1">30-Year Projection</p>
            </div>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-sm text-slate-300">
              <strong className="text-blue-400">Sea Level Rise:</strong> NJ coastal areas are projected to see 
              <strong className="text-white"> 1.5-2.5 feet</strong> of sea level rise by 2050. Properties in Zone X today 
              may be reclassified to AE zones.
            </p>
          </div>
        </ExpandableSection>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Ready to Protect Your Home?</h3>
              <p className="text-slate-400">
                Get quotes from licensed NJ Shore contractors who specialize in flood mitigation, elevation, and storm hardening.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Get Free Quotes
              </button>
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-slate-500">
          <p>ShoreHomeScore • NJ Shore Resilience Assessment Tool</p>
          <p className="mt-1">Data from FEMA, NOAA, and NJ DEP • For informational purposes only</p>
        </footer>
      </main>
    </div>
  );
}
