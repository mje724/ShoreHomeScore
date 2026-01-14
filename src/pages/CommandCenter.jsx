import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, Zap, FileText,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronDown, ChevronRight, DollarSign, MapPin, X, HelpCircle,
  Waves, Star, Sparkles, Check, Bell, Calendar, Anchor,
  ArrowUp, Gauge, Battery, Eye, Lock, Unlock, Book,
  AlertCircle, Target, Building, Settings, Info,
  ThermometerSun, Percent, CloudRain, Menu
} from 'lucide-react';

// =============================================================================
// DATA
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

// Glossary terms
const GLOSSARY = {
  'BFE': { term: 'Base Flood Elevation', definition: 'The elevation at which there is a 1% chance of flooding in any given year. This is the baseline for measuring flood risk and insurance rates.' },
  'CAFE': { term: 'Coastal A Flood Elevation', definition: 'New Jersey requires new construction and substantial improvements to be built to BFE + 4 feet (freeboard) in flood zones. This is the CAFE standard.' },
  'VE Zone': { term: 'Velocity Zone', definition: 'High-risk coastal flood zone where wave action is expected. Stricter building requirements apply, including breakaway walls below BFE.' },
  'AE Zone': { term: 'A Elevation Zone', definition: 'High-risk flood zone where BFE has been determined. Flood insurance is required for federally-backed mortgages.' },
  'X Zone': { term: 'Minimal Risk Zone', definition: 'Area of moderate to low flood risk. Flood insurance is not required but recommended.' },
  '50% Rule': { term: 'Substantial Improvement Rule', definition: 'If cumulative improvements exceed 50% of the structure\'s market value within any 10-year period, the entire structure must be brought to current code (CAFE).' },
  'Elevation Certificate': { term: 'Elevation Certificate (EC)', definition: 'Official document prepared by a surveyor showing your structure\'s elevation relative to BFE. Required for accurate flood insurance rating.' },
  'Freeboard': { term: 'Freeboard', definition: 'Additional height above BFE required by local codes. NJ CAFE requires 4 feet of freeboard.' },
  'NFIP': { term: 'National Flood Insurance Program', definition: 'Federal program providing flood insurance to property owners. Maximum coverage is $250K for structure, $100K for contents.' },
  'Flood Vents': { term: 'Flood Vents', definition: 'Openings in foundation walls that allow floodwater to flow through enclosed areas, equalizing pressure and preventing structural damage.' },
  'Breakaway Walls': { term: 'Breakaway Walls', definition: 'Walls designed to collapse under flood forces without damaging the main structure. Required in VE zones below BFE.' },
  'Risk Rating 2.0': { term: 'Risk Rating 2.0', definition: 'FEMA\'s new flood insurance pricing methodology that considers more variables including flood frequency, distance to water, and replacement cost.' },
  'ICC': { term: 'Increased Cost of Compliance', definition: 'Up to $30,000 of NFIP coverage to help bring a flood-damaged building up to current codes.' },
  'CRS': { term: 'Community Rating System', definition: 'FEMA program that rewards communities for exceeding minimum floodplain management standards. Can provide 5-45% insurance discounts.' },
  'Substantial Damage': { term: 'Substantial Damage', definition: 'When repair costs exceed 50% of market value. Triggers requirement to bring entire structure to current code.' },
};

// Constants
const CAFE_ELEVATION = 4;
const LEGACY_WINDOW_END = new Date('2026-07-15');
const STORM_SEASON_START = new Date('2026-06-01');

// =============================================================================
// GLOSSARY MODAL
// =============================================================================
const GlossaryModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTerms = Object.entries(GLOSSARY).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Glossary</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-4 border-b border-slate-700">
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
          {filteredTerms.map(([key, { term, definition }]) => (
            <div key={key} className="bg-slate-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded">{key}</span>
                <span className="text-white font-medium">{term}</span>
              </div>
              <p className="text-sm text-slate-400">{definition}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// =============================================================================
// PDF REPORT GENERATOR
// =============================================================================
const generatePDFReport = (town, data, score, savings) => {
  const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>ShoreHomeScore Report - ${town.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #334155; }
    .header h1 { font-size: 28px; color: #22d3ee; margin-bottom: 8px; }
    .header p { color: #94a3b8; }
    .score-section { display: flex; justify-content: center; gap: 40px; margin-bottom: 40px; }
    .score-box { text-align: center; padding: 20px 40px; background: #1e293b; border-radius: 16px; }
    .score-box .value { font-size: 48px; font-weight: bold; }
    .score-box .label { color: #94a3b8; font-size: 14px; margin-top: 4px; }
    .score-box.score .value { color: ${score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}; }
    .score-box.savings .value { color: #10b981; }
    .section { background: #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    .section h2 { color: #22d3ee; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .section h2::before { content: ''; width: 4px; height: 20px; background: #22d3ee; border-radius: 2px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .item { background: #0f172a; padding: 12px 16px; border-radius: 8px; }
    .item .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; }
    .item .value { color: #fff; font-size: 18px; font-weight: 600; margin-top: 4px; }
    .checklist { list-style: none; }
    .checklist li { padding: 8px 0; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 12px; }
    .checklist li:last-child { border-bottom: none; }
    .check { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
    .check.yes { background: #10b981; color: white; }
    .check.no { background: #334155; color: #64748b; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #334155; color: #64748b; font-size: 12px; }
    @media print { body { background: white; color: #1e293b; } .section, .score-box { background: #f1f5f9; } .item { background: #e2e8f0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 ShoreHomeScore Report</h1>
    <p>${town.name}, ${town.county} County, NJ ${town.zip}</p>
    <p style="margin-top: 8px; font-size: 12px;">Generated ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="score-section">
    <div class="score-box score">
      <div class="value">${score}</div>
      <div class="label">Protection Score</div>
    </div>
    <div class="score-box savings">
      <div class="value">$${savings.toLocaleString()}</div>
      <div class="label">Annual Savings</div>
    </div>
  </div>
  
  <div class="section">
    <h2>Property Information</h2>
    <div class="grid">
      <div class="item">
        <div class="label">Flood Zone</div>
        <div class="value">${town.zone}</div>
      </div>
      <div class="item">
        <div class="label">Base Flood Elevation</div>
        <div class="value">${town.bfe} ft</div>
      </div>
      <div class="item">
        <div class="label">CAFE Requirement</div>
        <div class="value">${town.bfe + CAFE_ELEVATION} ft</div>
      </div>
      <div class="item">
        <div class="label">Risk Level</div>
        <div class="value">${town.zone.startsWith('V') ? 'Coastal High Risk' : town.zone.startsWith('A') ? 'High Risk' : 'Moderate'}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Protection Status</h2>
    <ul class="checklist">
      <li><span class="check ${data.elevationCert === 'yes' ? 'yes' : 'no'}">${data.elevationCert === 'yes' ? '✓' : '–'}</span> Elevation Certificate</li>
      <li><span class="check ${data.elevationVsBFE === 'above4' || data.elevationVsBFE === 'above2' ? 'yes' : 'no'}">${data.elevationVsBFE === 'above4' || data.elevationVsBFE === 'above2' ? '✓' : '–'}</span> Elevated Above BFE</li>
      <li><span class="check ${data.foundation === 'piles' || data.foundation === 'piers' ? 'yes' : 'no'}">${data.foundation === 'piles' || data.foundation === 'piers' ? '✓' : '–'}</span> Elevated Foundation</li>
      <li><span class="check ${data.floodVents === 'yes' ? 'yes' : 'no'}">${data.floodVents === 'yes' ? '✓' : '–'}</span> Flood Vents Installed</li>
      <li><span class="check ${data.roofType === 'metal' || data.roofType === 'tile' ? 'yes' : 'no'}">${data.roofType === 'metal' || data.roofType === 'tile' ? '✓' : '–'}</span> Wind-Resistant Roof</li>
      <li><span class="check ${data.windowProtection === 'impact' || data.windowProtection === 'shutters' ? 'yes' : 'no'}">${data.windowProtection === 'impact' || data.windowProtection === 'shutters' ? '✓' : '–'}</span> Window Protection</li>
    </ul>
  </div>
  
  <div class="section">
    <h2>Insurance Savings Breakdown</h2>
    <ul class="checklist">
      ${data.elevationCert === 'yes' ? '<li><span style="color:#10b981">+$500/yr</span> — Elevation Certificate</li>' : ''}
      ${data.elevationVsBFE === 'above4' ? '<li><span style="color:#10b981">+$1,200/yr</span> — 4+ ft Above BFE</li>' : ''}
      ${data.elevationVsBFE === 'above2' ? '<li><span style="color:#10b981">+$800/yr</span> — 2-4 ft Above BFE</li>' : ''}
      ${data.foundation === 'piles' ? '<li><span style="color:#10b981">+$600/yr</span> — Pile Foundation</li>' : ''}
      ${data.foundation === 'piers' ? '<li><span style="color:#10b981">+$400/yr</span> — Pier Foundation</li>' : ''}
      ${data.floodVents === 'yes' ? '<li><span style="color:#10b981">+$300/yr</span> — Flood Vents</li>' : ''}
      ${data.roofType === 'metal' ? '<li><span style="color:#10b981">+$600/yr</span> — Metal Roof</li>' : ''}
      ${data.windowProtection === 'impact' ? '<li><span style="color:#10b981">+$500/yr</span> — Impact Windows</li>' : ''}
      ${data.windowProtection === 'shutters' ? '<li><span style="color:#10b981">+$300/yr</span> — Hurricane Shutters</li>' : ''}
    </ul>
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155; display: flex; justify-content: space-between;">
      <span style="font-weight: bold;">Total Annual Savings</span>
      <span style="font-weight: bold; color: #10b981;">$${savings.toLocaleString()}/yr</span>
    </div>
    <div style="margin-top: 8px; display: flex; justify-content: space-between; color: #94a3b8;">
      <span>10-Year Impact</span>
      <span style="color: white;">$${(savings * 10).toLocaleString()}</span>
    </div>
  </div>
  
  <div class="footer">
    <p>ShoreHomeScore • NJ Shore Home Protection Dashboard</p>
    <p style="margin-top: 4px;">Data sources: FEMA, NOAA, NJ DEP • For informational purposes only</p>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(reportHTML);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};

// =============================================================================
// COMPONENTS
// =============================================================================

const ScoreBadge = ({ score, size = 'md' }) => {
  const color = score >= 70 ? 'emerald' : score >= 40 ? 'amber' : 'red';
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
  };
  const colors = {
    emerald: 'border-emerald-500 text-emerald-400',
    amber: 'border-amber-500 text-amber-400',
    red: 'border-red-500 text-red-400',
  };
  
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full border-4 flex items-center justify-center font-bold bg-slate-900`}>
      {score}
    </div>
  );
};

const ToggleItem = ({ label, description, value, onChange, options, savingsImpact }) => (
  <div className={`p-3 rounded-xl border transition-all ${
    value !== undefined ? 'bg-slate-800/80 border-slate-600' : 'bg-slate-800/40 border-slate-700'
  }`}>
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className="flex-1">
        <span className="text-sm font-medium text-white">{label}</span>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        {savingsImpact && value === options[0]?.value && (
          <p className="text-xs text-emerald-400 mt-1">💰 {savingsImpact}</p>
        )}
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5">
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

const CategorySection = ({ title, icon: Icon, color, children, badge }) => {
  const [isOpen, setIsOpen] = useState(true);
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    violet: 'text-violet-400 bg-violet-500/20',
    red: 'text-red-400 bg-red-500/20',
  };
  
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
          <span className="font-medium text-white">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">{badge}</span>
          )}
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
            <div className="p-4 pt-0 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, subtitle, color = 'cyan', onClick }) => {
  const colors = {
    cyan: 'border-cyan-500/30 hover:border-cyan-500/50',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/50',
    amber: 'border-amber-500/30 hover:border-amber-500/50',
    red: 'border-red-500/30 hover:border-red-500/50',
  };
  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    red: 'text-red-400 bg-red-500/20',
  };
  
  const Wrapper = onClick ? 'button' : 'div';
  
  return (
    <Wrapper 
      onClick={onClick}
      className={`bg-slate-800/50 border ${colors[color]} rounded-xl p-4 text-left transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${iconColors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs text-slate-400 uppercase">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </Wrapper>
  );
};

const AlertBanner = ({ type = 'info', title, description }) => {
  const styles = {
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    urgent: 'bg-red-500/10 border-red-500/30 text-red-400',
  };
  const icons = { info: Info, warning: AlertTriangle, urgent: AlertCircle };
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
      const saved = localStorage.getItem('shs_town_v7');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_data_v7');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [showGlossary, setShowGlossary] = useState(false);
  
  // Persistence
  useEffect(() => {
    if (town) localStorage.setItem('shs_town_v7', JSON.stringify(town));
  }, [town]);
  
  useEffect(() => {
    localStorage.setItem('shs_data_v7', JSON.stringify(data));
  }, [data]);
  
  // Tide data
  const [tideData, setTideData] = useState(null);
  
  useEffect(() => {
    if (town) {
      fetch(`/api/tides?county=${encodeURIComponent(town.county)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setTideData(data);
        })
        .catch(() => {});
    }
  }, [town]);
  
  // Update handler
  const update = useCallback((key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Calculations
  const answeredCount = Object.keys(data).filter(k => data[k] !== undefined).length;
  
  const score = useMemo(() => {
    let points = 0;
    // Flood protection (40 points)
    if (data.elevationCert === 'yes') points += 8;
    if (data.elevationVsBFE === 'above4') points += 12;
    else if (data.elevationVsBFE === 'above2') points += 8;
    else if (data.elevationVsBFE === 'at') points += 4;
    if (data.foundation === 'piles') points += 10;
    else if (data.foundation === 'piers') points += 7;
    else if (data.foundation === 'crawl') points += 4;
    if (data.floodVents === 'yes') points += 6;
    if (data.breakawayWalls === 'yes') points += 4;
    // Wind protection (35 points)
    if (data.roofType === 'metal') points += 12;
    else if (data.roofType === 'tile') points += 10;
    else if (data.roofType === 'architectural') points += 6;
    if (data.roofDeck === 'yes') points += 6;
    if (data.roofAge && data.roofAge <= 10) points += 5;
    if (data.windowProtection === 'impact') points += 10;
    else if (data.windowProtection === 'shutters') points += 7;
    else if (data.windowProtection === 'plywood') points += 3;
    if (data.garageDoor === 'yes') points += 4;
    // Smart & systems (15 points)
    if (data.waterShutoff === 'yes') points += 4;
    if (data.leakSensors === 'yes') points += 3;
    if (data.backupPower === 'generator' || data.backupPower === 'battery') points += 4;
    if (data.hvacElevated === 'yes') points += 2;
    if (data.electricalElevated === 'yes') points += 2;
    // Documentation (10 points)
    if (data.floodInsurance === 'yes' || data.floodInsurance === 'private') points += 6;
    if (data.windMitigation === 'yes') points += 4;
    
    return Math.min(points, 100);
  }, [data]);
  
  const savings = useMemo(() => {
    let total = 0;
    // Flood savings
    if (data.elevationCert === 'yes') total += 500;
    if (data.elevationVsBFE === 'above4') total += 1200;
    else if (data.elevationVsBFE === 'above2') total += 800;
    if (data.foundation === 'piles') total += 600;
    else if (data.foundation === 'piers') total += 400;
    if (data.floodVents === 'yes') total += 300;
    if (data.breakawayWalls === 'yes') total += 200;
    // Wind savings
    if (data.roofType === 'metal') total += 600;
    else if (data.roofType === 'tile') total += 400;
    if (data.roofDeck === 'yes') total += 400;
    if (data.roofAge && data.roofAge <= 10) total += 300;
    if (data.windowProtection === 'impact') total += 500;
    else if (data.windowProtection === 'shutters') total += 300;
    if (data.garageDoor === 'yes') total += 200;
    // Smart savings
    if (data.waterShutoff === 'yes') total += 200;
    
    return total;
  }, [data]);
  
  const riskLevel = town?.zone?.startsWith('V') ? 'high' : town?.zone?.startsWith('A') ? 'moderate' : 'low';
  const cafeRequired = town ? town.bfe + CAFE_ELEVATION : 0;
  const daysToLegacy = Math.max(0, Math.ceil((LEGACY_WINDOW_END - new Date()) / (1000 * 60 * 60 * 24)));
  const daysToStorm = Math.max(0, Math.ceil((STORM_SEASON_START - new Date()) / (1000 * 60 * 60 * 24)));

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
            <p className="text-slate-400">Your NJ shore home protection dashboard</p>
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
        </motion.div>
      </div>
    );
  }

  // ===========================================
  // RENDER: MAIN DASHBOARD
  // ===========================================
  return (
    <div className="min-h-screen bg-slate-900">
      <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
      
      {/* Sticky Header with Resilience Score & Savings */}
      <header className="bg-slate-800/95 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left: Location */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                <Home className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm">{town.name}</h1>
                <p className="text-xs text-slate-400">Zone {town.zone} • BFE {town.bfe}ft</p>
              </div>
            </div>
            
            {/* Center: Score & Savings */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-full border border-slate-600">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">Resilience</span>
                </div>
                <span className={`text-lg font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {score}
                </span>
              </div>
              
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">${savings.toLocaleString()}/yr</span>
              </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowGlossary(true)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                title="Glossary"
              >
                <Book className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </button>
              
              <button
                onClick={() => generatePDFReport(town, data, score, savings)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                title="Download Report"
              >
                <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </button>
              
              <button
                onClick={() => { setTown(null); localStorage.removeItem('shs_town_v7'); }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                title="Change Town"
              >
                <Settings className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard
            icon={Waves}
            label="Flood Zone"
            value={town.zone}
            subtitle={town.zone.startsWith('V') ? 'Coastal High Risk' : 'High Risk'}
            color={town.zone.startsWith('V') ? 'red' : 'amber'}
            onClick={() => setShowGlossary(true)}
          />
          <InfoCard
            icon={ArrowUp}
            label="CAFE Required"
            value={`${cafeRequired} ft`}
            subtitle={`BFE ${town.bfe}ft + 4ft`}
            color="cyan"
            onClick={() => setShowGlossary(true)}
          />
          <InfoCard
            icon={Clock}
            label="Legacy Window"
            value={`${daysToLegacy} days`}
            subtitle="Apply by July 15, 2026"
            color="amber"
          />
          {tideData?.current?.level !== null ? (
            <InfoCard
              icon={Anchor}
              label="Current Tide"
              value={`${tideData.current.levelFeet} ft`}
              subtitle={tideData.nextHighTide ? `Next high: ${tideData.nextHighTide.time?.split(' ')[1] || ''}` : tideData.station?.name}
              color="cyan"
            />
          ) : (
            <InfoCard
              icon={CloudRain}
              label="Storm Season"
              value={`${daysToStorm} days`}
              subtitle="Starts June 1"
              color="cyan"
            />
          )}
        </div>
        
        {/* Live Tide Banner */}
        {tideData?.current?.level !== null && (
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Anchor className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Live Water Level at {tideData.station?.name}</p>
                  <p className="text-xl font-bold text-white">{tideData.current.levelFeet} ft <span className="text-sm font-normal text-slate-400">NAVD88</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Your BFE: {town.bfe} ft</p>
                <p className={`text-sm font-bold ${parseFloat(tideData.current.levelFeet) < town.bfe ? 'text-emerald-400' : 'text-red-400'}`}>
                  {parseFloat(tideData.current.levelFeet) < town.bfe 
                    ? `${(town.bfe - parseFloat(tideData.current.levelFeet)).toFixed(1)} ft below BFE ✓` 
                    : `${(parseFloat(tideData.current.levelFeet) - town.bfe).toFixed(1)} ft ABOVE BFE ⚠️`}
                </p>
              </div>
            </div>
            {tideData.predictions?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-cyan-500/20 flex gap-4 overflow-x-auto">
                {tideData.predictions.slice(0, 4).map((pred, i) => (
                  <div key={i} className="text-center flex-shrink-0">
                    <p className={`text-xs ${pred.type === 'High' ? 'text-amber-400' : 'text-cyan-400'}`}>{pred.type}</p>
                    <p className="text-sm font-bold text-white">{pred.level?.toFixed(1)} ft</p>
                    <p className="text-xs text-slate-500">{pred.time?.split(' ')[1] || ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerts */}
        {town.zone.startsWith('V') && (
          <AlertBanner
            type="warning"
            title="Coastal High Hazard Zone (VE)"
            description="Wave action zone - breakaway walls required below BFE. Stricter building codes apply."
          />
        )}
        
        {data.elevationVsBFE === 'below' && (
          <AlertBanner
            type="urgent"
            title="Below Base Flood Elevation"
            description="Substantial improvements (>50% of value) will trigger CAFE compliance. Consider elevation planning."
          />
        )}

        {/* Categories */}
        <div className="space-y-3">
          
          {/* Flood Protection */}
          <CategorySection 
            title="Flood Protection" 
            icon={Droplets} 
            color="blue"
            badge={data.elevationCert === 'yes' || data.floodVents === 'yes' ? 'Active' : null}
          >
            <ToggleItem
              label="Elevation Certificate"
              description="Official document showing your home's elevation"
              value={data.elevationCert}
              onChange={(v) => update('elevationCert', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
              savingsImpact="+$500/yr"
            />
            <ToggleItem
              label="Elevation vs BFE"
              description={`Your BFE is ${town.bfe} ft`}
              value={data.elevationVsBFE}
              onChange={(v) => update('elevationVsBFE', v)}
              options={[
                { value: 'above4', label: '4+ ft above' },
                { value: 'above2', label: '2-4 ft above' },
                { value: 'at', label: 'At BFE' },
                { value: 'below', label: 'Below' },
                { value: 'unsure', label: 'Unsure' },
              ]}
              savingsImpact="+$1,200/yr"
            />
            <ToggleItem
              label="Foundation Type"
              value={data.foundation}
              onChange={(v) => update('foundation', v)}
              options={[
                { value: 'piles', label: 'Piles' },
                { value: 'piers', label: 'Piers' },
                { value: 'crawl', label: 'Crawl' },
                { value: 'slab', label: 'Slab' },
                { value: 'basement', label: 'Basement' },
              ]}
              savingsImpact="+$600/yr"
            />
            <ToggleItem
              label="Flood Vents"
              description="Openings that allow water to flow through"
              value={data.floodVents}
              onChange={(v) => update('floodVents', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
              savingsImpact="+$300/yr"
            />
            {town.zone.startsWith('V') && (
              <ToggleItem
                label="Breakaway Walls"
                description="Required in VE zones below BFE"
                value={data.breakawayWalls}
                onChange={(v) => update('breakawayWalls', v)}
                options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }]}
                savingsImpact="+$200/yr"
              />
            )}
            <ToggleItem
              label="HVAC Elevated Above BFE"
              value={data.hvacElevated}
              onChange={(v) => update('hvacElevated', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            />
            <ToggleItem
              label="Electrical Panel Elevated"
              value={data.electricalElevated}
              onChange={(v) => update('electricalElevated', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            />
          </CategorySection>

          {/* Wind Defense */}
          <CategorySection 
            title="Wind Defense" 
            icon={Wind} 
            color="cyan"
            badge={data.roofType === 'metal' || data.windowProtection === 'impact' ? 'Active' : null}
          >
            <ToggleItem
              label="Roof Type"
              value={data.roofType}
              onChange={(v) => update('roofType', v)}
              options={[
                { value: 'metal', label: 'Metal' },
                { value: 'tile', label: 'Tile' },
                { value: 'architectural', label: 'Arch. Shingle' },
                { value: '3tab', label: '3-Tab' },
                { value: 'flat', label: 'Flat' },
              ]}
              savingsImpact="+$600/yr"
            />
            <ToggleItem
              label="Sealed Roof Deck"
              description="Secondary water barrier under shingles"
              value={data.roofDeck}
              onChange={(v) => update('roofDeck', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
              savingsImpact="+$400/yr"
            />
            <ToggleItem
              label="Roof Age"
              value={data.roofAge}
              onChange={(v) => update('roofAge', v)}
              options={[
                { value: 5, label: '0-5 yrs' },
                { value: 10, label: '6-10' },
                { value: 15, label: '11-15' },
                { value: 20, label: '16-20' },
                { value: 25, label: '20+' },
              ]}
              savingsImpact="+$300/yr"
            />
            <ToggleItem
              label="Window Protection"
              value={data.windowProtection}
              onChange={(v) => update('windowProtection', v)}
              options={[
                { value: 'impact', label: 'Impact Glass' },
                { value: 'shutters', label: 'Shutters' },
                { value: 'plywood', label: 'Plywood' },
                { value: 'none', label: 'None' },
              ]}
              savingsImpact="+$500/yr"
            />
            <ToggleItem
              label="Wind-Rated Garage Door"
              value={data.garageDoor}
              onChange={(v) => update('garageDoor', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }]}
              savingsImpact="+$200/yr"
            />
          </CategorySection>

          {/* Smart Systems */}
          <CategorySection 
            title="Smart Systems" 
            icon={Zap} 
            color="emerald"
          >
            <ToggleItem
              label="Smart Water Shutoff"
              description="Auto-detects leaks and shuts off water"
              value={data.waterShutoff}
              onChange={(v) => update('waterShutoff', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              savingsImpact="+$200/yr"
            />
            <ToggleItem
              label="Leak Sensors"
              value={data.leakSensors}
              onChange={(v) => update('leakSensors', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            />
            <ToggleItem
              label="Backup Power"
              value={data.backupPower}
              onChange={(v) => update('backupPower', v)}
              options={[
                { value: 'generator', label: 'Generator' },
                { value: 'battery', label: 'Battery' },
                { value: 'portable', label: 'Portable' },
                { value: 'none', label: 'None' },
              ]}
            />
          </CategorySection>

          {/* Insurance & Documentation */}
          <CategorySection 
            title="Insurance & Documentation" 
            icon={FileText} 
            color="amber"
          >
            <ToggleItem
              label="Flood Insurance"
              value={data.floodInsurance}
              onChange={(v) => update('floodInsurance', v)}
              options={[
                { value: 'yes', label: 'NFIP' },
                { value: 'private', label: 'Private' },
                { value: 'no', label: 'None' },
              ]}
            />
            <ToggleItem
              label="Wind Mitigation Report"
              description="Professional inspection documenting wind features"
              value={data.windMitigation}
              onChange={(v) => update('windMitigation', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            />
            
            {/* Savings Summary */}
            <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
              <h4 className="font-medium text-white mb-3">Your Insurance Savings</h4>
              <div className="space-y-2 text-sm">
                {data.elevationCert === 'yes' && (
                  <div className="flex justify-between"><span className="text-slate-400">Elevation Certificate</span><span className="text-emerald-400">+$500</span></div>
                )}
                {data.elevationVsBFE === 'above4' && (
                  <div className="flex justify-between"><span className="text-slate-400">4+ ft Above BFE</span><span className="text-emerald-400">+$1,200</span></div>
                )}
                {data.elevationVsBFE === 'above2' && (
                  <div className="flex justify-between"><span className="text-slate-400">2-4 ft Above BFE</span><span className="text-emerald-400">+$800</span></div>
                )}
                {(data.foundation === 'piles' || data.foundation === 'piers') && (
                  <div className="flex justify-between"><span className="text-slate-400">Elevated Foundation</span><span className="text-emerald-400">+${data.foundation === 'piles' ? '600' : '400'}</span></div>
                )}
                {data.floodVents === 'yes' && (
                  <div className="flex justify-between"><span className="text-slate-400">Flood Vents</span><span className="text-emerald-400">+$300</span></div>
                )}
                {data.roofType === 'metal' && (
                  <div className="flex justify-between"><span className="text-slate-400">Metal Roof</span><span className="text-emerald-400">+$600</span></div>
                )}
                {data.roofDeck === 'yes' && (
                  <div className="flex justify-between"><span className="text-slate-400">Sealed Roof Deck</span><span className="text-emerald-400">+$400</span></div>
                )}
                {(data.windowProtection === 'impact' || data.windowProtection === 'shutters') && (
                  <div className="flex justify-between"><span className="text-slate-400">Window Protection</span><span className="text-emerald-400">+${data.windowProtection === 'impact' ? '500' : '300'}</span></div>
                )}
                {data.garageDoor === 'yes' && (
                  <div className="flex justify-between"><span className="text-slate-400">Wind-Rated Garage</span><span className="text-emerald-400">+$200</span></div>
                )}
                {data.waterShutoff === 'yes' && (
                  <div className="flex justify-between"><span className="text-slate-400">Smart Water Shutoff</span><span className="text-emerald-400">+$200</span></div>
                )}
                
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total Annual Savings</span>
                    <span className="text-emerald-400">${savings.toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between text-slate-500 mt-1">
                    <span>10-Year Impact</span>
                    <span className="text-white">${(savings * 10).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CategorySection>

          {/* Climate & Future Risk */}
          <CategorySection 
            title="Future Risk & Climate" 
            icon={TrendingUp} 
            color="violet"
          >
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                <p className="text-xl font-bold text-amber-400">{town.zone.startsWith('V') ? '9' : '7'}/10</p>
                <p className="text-xs text-slate-500">Current</p>
              </div>
              <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                <p className="text-xl font-bold text-orange-400">{town.zone.startsWith('V') ? '10' : '8'}/10</p>
                <p className="text-xs text-slate-500">15 Years</p>
              </div>
              <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                <p className="text-xl font-bold text-red-400">{town.zone.startsWith('V') ? '10' : '9'}/10</p>
                <p className="text-xs text-slate-500">30 Years</p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-sm text-slate-300">
                <strong className="text-blue-400">Sea Level Rise Projection:</strong> NJ coast expected to see 
                <strong className="text-white"> +1.5ft by 2050</strong> and <strong className="text-white">+4ft by 2100</strong>. 
                Today's 100-year flood may become a 25-year event.
              </p>
            </div>
          </CategorySection>

        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-slate-500">
          <p>ShoreHomeScore • NJ Shore Home Protection Dashboard</p>
          <p className="mt-1">Data: FEMA NFHL, NOAA, NJ DEP • For informational purposes only</p>
        </footer>
      </main>
    </div>
  );
}
