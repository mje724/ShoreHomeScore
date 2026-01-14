import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Shield, Droplets, Wind, Zap, FileText,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Download,
  ChevronDown, ChevronRight, DollarSign, MapPin, X, HelpCircle,
  Waves, Star, Sparkles, Check, Bell, Calendar, Anchor,
  ArrowUp, Gauge, Battery, Eye, Lock, Unlock, Book,
  AlertCircle, Target, Building, Settings, Info,
  ThermometerSun, Percent, CloudRain, Menu, Search
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

// Glossary
const GLOSSARY = {
  'BFE': { term: 'Base Flood Elevation', definition: 'The elevation at which there is a 1% chance of flooding in any given year. This is the baseline for measuring flood risk and insurance rates.' },
  'CAFE': { term: 'Coastal A Flood Elevation', definition: 'New Jersey requires new construction and substantial improvements to be built to BFE + 4 feet (freeboard) in flood zones.' },
  'VE Zone': { term: 'Velocity Zone', definition: 'High-risk coastal flood zone where wave action is expected. Stricter building requirements apply.' },
  'AE Zone': { term: 'A Elevation Zone', definition: 'High-risk flood zone where BFE has been determined. Flood insurance required for federally-backed mortgages.' },
  '50% Rule': { term: 'Substantial Improvement Rule', definition: 'If improvements exceed 50% of structure value within 10 years, entire structure must meet current code.' },
  'Elevation Certificate': { term: 'Elevation Certificate (EC)', definition: 'Official document showing your structure\'s elevation relative to BFE.' },
  'NFIP': { term: 'National Flood Insurance Program', definition: 'Federal flood insurance program. Max coverage: $250K structure, $100K contents.' },
  'Flood Vents': { term: 'Flood Vents', definition: 'Openings allowing floodwater to flow through enclosed areas, equalizing pressure.' },
  'Breakaway Walls': { term: 'Breakaway Walls', definition: 'Walls designed to collapse under flood forces without damaging main structure.' },
  'Risk Rating 2.0': { term: 'Risk Rating 2.0', definition: 'FEMA\'s new pricing methodology considering flood frequency, distance to water, replacement cost.' },
};

// Insurance Savings Data - Based on typical NFIP and private insurer discount patterns
// Source: FEMA guidance, industry standards - these are estimates, actual savings vary by policy
const SAVINGS_DATA = {
  elevationCert: { savings: 500, note: 'Allows accurate rating vs worst-case assumption' },
  elevationAbove4: { savings: 1200, note: 'Significant premium reduction for freeboard' },
  elevationAbove2: { savings: 800, note: 'Premium reduction for elevation above BFE' },
  foundationPiles: { savings: 600, note: 'Preferred foundation type for flood zones' },
  foundationPiers: { savings: 400, note: 'Better than slab for flood zones' },
  floodVents: { savings: 300, note: 'Required for enclosures below BFE' },
  breakawayWalls: { savings: 200, note: 'Required in VE zones' },
  roofMetal: { savings: 600, note: 'Wind mitigation credit' },
  roofDeck: { savings: 400, note: 'Secondary water barrier credit' },
  windowsImpact: { savings: 500, note: 'Opening protection credit' },
  windowsShutters: { savings: 300, note: 'Opening protection credit' },
  garageDoor: { savings: 200, note: 'Wind mitigation credit' },
  waterShutoff: { savings: 200, note: 'Some insurers offer smart home discount' },
};

const CAFE_ELEVATION = 4;
const LEGACY_WINDOW_END = new Date('2026-07-15');
const STORM_SEASON_START = new Date('2026-06-01');

// =============================================================================
// SCORE GAUGE COMPONENT (Credit Score Style)
// =============================================================================
const ResilienceGauge = ({ score, size = 'large' }) => {
  const sizes = {
    small: { width: 80, height: 50, stroke: 8, fontSize: 'text-lg' },
    medium: { width: 140, height: 85, stroke: 12, fontSize: 'text-3xl' },
    large: { width: 220, height: 130, stroke: 16, fontSize: 'text-5xl' },
  };
  const s = sizes[size];
  
  const getColor = (score) => {
    if (score >= 80) return { color: '#10b981', label: 'Excellent', bg: 'from-emerald-500/20' };
    if (score >= 60) return { color: '#22d3ee', label: 'Good', bg: 'from-cyan-500/20' };
    if (score >= 40) return { color: '#f59e0b', label: 'Fair', bg: 'from-amber-500/20' };
    return { color: '#ef4444', label: 'Needs Work', bg: 'from-red-500/20' };
  };
  
  const { color, label, bg } = getColor(score);
  const radius = (s.width - s.stroke) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={s.width} height={s.height} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${s.stroke/2} ${s.height} A ${radius} ${radius} 0 0 1 ${s.width - s.stroke/2} ${s.height}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth={s.stroke}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={`M ${s.stroke/2} ${s.height} A ${radius} ${radius} 0 0 1 ${s.width - s.stroke/2} ${s.height}`}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Score text */}
        <text
          x={s.width / 2}
          y={s.height - 10}
          textAnchor="middle"
          className={`${s.fontSize} font-bold fill-white`}
        >
          {score}
        </text>
      </svg>
      {size !== 'small' && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium" style={{ color }}>{label}</p>
          <p className="text-xs text-slate-500">Resilience Score</p>
        </div>
      )}
    </div>
  );
};

// Mini score for nav
const MiniScore = ({ score }) => {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#22d3ee' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-700/50 rounded-full border border-slate-600">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-bold text-white">{score}</span>
    </div>
  );
};

// =============================================================================
// GLOSSARY MODAL
// =============================================================================
const GlossaryModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const filtered = Object.entries(GLOSSARY).filter(([k, v]) =>
    k.toLowerCase().includes(search.toLowerCase()) ||
    v.term.toLowerCase().includes(search.toLowerCase())
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500"
          />
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-3">
          {filtered.map(([key, { term, definition }]) => (
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
// PROGRAMS MODAL
// =============================================================================
const ProgramsModal = ({ isOpen, onClose, updates, county }) => {
  if (!isOpen || !updates) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Programs & Updates</h2>
            <span className="text-xs text-slate-400">{county} County</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[70vh] p-4 space-y-4">
          {/* Deadlines */}
          {updates.deadlines?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">⏰ Key Deadlines</h3>
              <div className="space-y-2">
                {updates.deadlines.slice(0, 3).map(d => (
                  <div key={d.id} className={`p-3 rounded-xl border ${d.urgent ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-700/30 border-slate-600'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{d.title}</p>
                        <p className="text-sm text-slate-400 mt-1">{d.description}</p>
                      </div>
                      <span className={`text-sm font-bold ${d.daysUntil < 90 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {d.daysUntil} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Programs */}
          {updates.programs?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">💰 Available Programs</h3>
              <div className="space-y-2">
                {updates.programs.map(p => (
                  <div key={p.id} className={`p-4 rounded-xl border ${p.relevant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-700/30 border-slate-600'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{p.title}</p>
                          {p.relevant && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">May Apply</span>}
                        </div>
                        <p className="text-xs text-cyan-400 mt-1">{p.agency}</p>
                        <p className="text-sm text-slate-400 mt-2">{p.description}</p>
                        <p className="text-sm text-slate-300 mt-2"><span className="text-slate-500">Funding:</span> {p.funding}</p>
                      </div>
                    </div>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" 
                         className="inline-flex items-center gap-1 mt-3 text-sm text-cyan-400 hover:text-cyan-300">
                        Learn more →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* County Info */}
          {updates.countyInfo && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">📍 {county} County Info</h3>
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4">
                {updates.countyInfo.crsDiscount && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">CRS Flood Insurance Discount</span>
                    <span className="text-emerald-400 font-bold">{updates.countyInfo.crsDiscount}</span>
                  </div>
                )}
                {updates.countyInfo.note && (
                  <p className="text-sm text-slate-400">{updates.countyInfo.note}</p>
                )}
                {updates.countyInfo.recentActivity && (
                  <p className="text-sm text-cyan-400 mt-2">📰 {updates.countyInfo.recentActivity}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Recent Disasters */}
          {updates.disasters?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">🌀 Recent Declarations</h3>
              <div className="space-y-2">
                {updates.disasters.slice(0, 3).map(d => (
                  <div key={d.number} className="bg-slate-700/30 border border-slate-600 rounded-xl p-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">DR-{d.number}</span>
                      <span className="text-xs text-slate-500">{new Date(d.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-400">{d.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <p className="text-xs text-slate-500 text-center">
            Data from FEMA OpenAPI, NJ DEP, NJ DCA • Updated hourly
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// =============================================================================
// UPDATES BANNER
// =============================================================================
const UpdatesBanner = ({ updates, onViewAll }) => {
  if (!updates || !updates.summary) return null;
  
  const { activePrograms, urgentDeadlines } = updates.summary;
  const topAlert = updates.alerts?.[0];
  
  if (activePrograms === 0 && urgentDeadlines === 0) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-emerald-500/10 border border-amber-500/30 rounded-xl p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-white">
              {activePrograms} program{activePrograms !== 1 ? 's' : ''} may apply to you
            </p>
            {topAlert && (
              <p className="text-sm text-slate-400 mt-0.5">{topAlert.message}</p>
            )}
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          View Programs
        </button>
      </div>
    </motion.div>
  );
};

// =============================================================================
// CONTEXTUAL PROGRAM HINT
// =============================================================================
const ProgramHint = ({ program, show }) => {
  if (!show || !program) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
    >
      <p className="text-xs text-emerald-400 font-medium">💰 {program.title}</p>
      <p className="text-xs text-slate-300 mt-1">{program.funding}</p>
      {program.link && (
        <a href={program.link} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline">
          Learn more →
        </a>
      )}
    </motion.div>
  );
};

// =============================================================================
// PDF REPORT
// =============================================================================
const generatePDF = (property, town, data, score, savings, localUpdates) => {
  // Build programs section if available
  let programsHtml = '';
  if (localUpdates?.programs?.filter(p => p.relevant).length > 0) {
    const relevantPrograms = localUpdates.programs.filter(p => p.relevant);
    programsHtml = `
<div class="section"><h2>💰 Programs You May Qualify For</h2>
<ul class="checklist">
${relevantPrograms.map(p => `<li><span>${p.title}</span><span style="color:#22d3ee">${p.agency}</span></li>`).join('')}
</ul>
<p style="color:#94a3b8;font-size:11px;margin-top:12px">Visit ShoreHomeScore.com for links and eligibility details</p>
</div>`;
  }
  
  const html = `<!DOCTYPE html>
<html><head><title>ShoreHomeScore Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:40px}
.header{text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #334155}
.header h1{font-size:24px;color:#22d3ee}
.address{font-size:14px;color:#94a3b8;margin-top:8px}
.score-section{display:flex;justify-content:center;gap:40px;margin:30px 0}
.score-box{text-align:center;padding:20px 40px;background:#1e293b;border-radius:16px}
.score-box .value{font-size:48px;font-weight:bold}
.score-box .label{color:#94a3b8;font-size:12px;margin-top:4px}
.section{background:#1e293b;border-radius:12px;padding:20px;margin-bottom:16px}
.section h2{color:#22d3ee;font-size:16px;margin-bottom:12px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.item{background:#0f172a;padding:12px;border-radius:8px}
.item .label{color:#94a3b8;font-size:11px;text-transform:uppercase}
.item .value{color:#fff;font-size:16px;font-weight:600}
.checklist{list-style:none}
.checklist li{padding:8px 0;border-bottom:1px solid #334155;display:flex;justify-content:space-between}
.check{color:#10b981}.nocheck{color:#64748b}
.footer{text-align:center;margin-top:30px;color:#64748b;font-size:11px}
</style></head><body>
<div class="header">
<h1>🏠 ShoreHomeScore Report</h1>
<p class="address">${property.address || town.name + ', NJ ' + town.zip}</p>
<p style="font-size:11px;color:#64748b;margin-top:4px">Generated ${new Date().toLocaleDateString()}</p>
</div>
<div class="score-section">
<div class="score-box"><div class="value" style="color:${score >= 60 ? '#10b981' : '#f59e0b'}">${score}</div><div class="label">Resilience Score</div></div>
<div class="score-box"><div class="value" style="color:#10b981">$${savings.toLocaleString()}</div><div class="label">Annual Savings</div></div>
</div>
<div class="section"><h2>Property Details</h2>
<div class="grid">
<div class="item"><div class="label">Flood Zone</div><div class="value">${property.floodZone || town.zone}</div></div>
<div class="item"><div class="label">Base Flood Elevation</div><div class="value">${property.bfe || town.bfe} ft</div></div>
<div class="item"><div class="label">CAFE Requirement</div><div class="value">${(property.bfe || town.bfe) + CAFE_ELEVATION} ft</div></div>
<div class="item"><div class="label">County</div><div class="value">${town.county}</div></div>
</div></div>
<div class="section"><h2>Protection Status</h2>
<ul class="checklist">
<li><span>Elevation Certificate</span><span class="${data.elevationCert === 'yes' ? 'check' : 'nocheck'}">${data.elevationCert === 'yes' ? '✓ Yes' : '✗ No'}</span></li>
<li><span>Above BFE</span><span class="${data.elevationVsBFE?.includes('above') ? 'check' : 'nocheck'}">${data.elevationVsBFE || 'Unknown'}</span></li>
<li><span>Foundation</span><span>${data.foundation || 'Unknown'}</span></li>
<li><span>Flood Vents</span><span class="${data.floodVents === 'yes' ? 'check' : 'nocheck'}">${data.floodVents === 'yes' ? '✓ Yes' : '✗ No'}</span></li>
<li><span>Roof Type</span><span>${data.roofType || 'Unknown'}</span></li>
<li><span>Window Protection</span><span>${data.windowProtection || 'None'}</span></li>
</ul></div>
<div class="section"><h2>Insurance Savings</h2>
<ul class="checklist">
${data.elevationCert === 'yes' ? '<li><span>Elevation Certificate</span><span class="check">+$500/yr</span></li>' : ''}
${data.elevationVsBFE === 'above4' ? '<li><span>4+ ft Above BFE</span><span class="check">+$1,200/yr</span></li>' : ''}
${data.elevationVsBFE === 'above2' ? '<li><span>2-4 ft Above BFE</span><span class="check">+$800/yr</span></li>' : ''}
${data.foundation === 'piles' ? '<li><span>Pile Foundation</span><span class="check">+$600/yr</span></li>' : ''}
${data.floodVents === 'yes' ? '<li><span>Flood Vents</span><span class="check">+$300/yr</span></li>' : ''}
${data.roofType === 'metal' ? '<li><span>Metal Roof</span><span class="check">+$600/yr</span></li>' : ''}
${data.windowProtection === 'impact' ? '<li><span>Impact Windows</span><span class="check">+$500/yr</span></li>' : ''}
<li style="border-top:2px solid #334155;margin-top:8px;padding-top:12px"><span><strong>Total Annual Savings</strong></span><span style="color:#10b981;font-weight:bold">$${savings.toLocaleString()}/yr</span></li>
<li><span>10-Year Impact</span><span style="color:#fff">$${(savings * 10).toLocaleString()}</span></li>
</ul></div>
${programsHtml}
<div class="footer"><p>ShoreHomeScore • Data: FEMA, NOAA, NJ DEP • For informational purposes only</p></div>
</body></html>`;
  
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

// =============================================================================
// TOGGLE ITEM WITH ROI
// =============================================================================
const ToggleItem = ({ label, description, value, onChange, options, savingsImpact, potentialSavings, info }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className={`p-3 rounded-xl border transition-all ${
      value !== undefined ? 'bg-slate-800/80 border-slate-600' : 'bg-slate-800/40 border-slate-700'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{label}</span>
            {info && (
              <button onClick={() => setShowInfo(!showInfo)} className="p-0.5 hover:bg-slate-700 rounded">
                <Info className={`w-3.5 h-3.5 ${showInfo ? 'text-cyan-400' : 'text-slate-500'}`} />
              </button>
            )}
          </div>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          
          {/* Show savings when they have the feature */}
          {savingsImpact && value === options[0]?.value && (
            <p className="text-xs text-emerald-400 mt-1">💰 {savingsImpact}</p>
          )}
          
          {/* Show potential savings when they DON'T have the feature */}
          {potentialSavings && value !== undefined && value !== options[0]?.value && value !== 'unsure' && (
            <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-400">💡 Potential savings: <span className="font-bold">${potentialSavings}/yr</span> if you add this</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Info Popup */}
      <AnimatePresence>
        {showInfo && info && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-sm">
              {info.why && (
                <div className="mb-2">
                  <p className="text-cyan-400 font-medium text-xs uppercase tracking-wider mb-1">Why it matters</p>
                  <p className="text-slate-300">{info.why}</p>
                </div>
              )}
              {info.howToSpot && (
                <div className="mb-2">
                  <p className="text-amber-400 font-medium text-xs uppercase tracking-wider mb-1">🔍 How to spot it</p>
                  <p className="text-slate-300">{info.howToSpot}</p>
                </div>
              )}
              {info.tip && (
                <div>
                  <p className="text-emerald-400 font-medium text-xs uppercase tracking-wider mb-1">💡 Pro tip</p>
                  <p className="text-slate-300">{info.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === opt.value ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// CATEGORY SECTION
// =============================================================================
const CategorySection = ({ title, icon: Icon, color, children, badge }) => {
  const [isOpen, setIsOpen] = useState(true);
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    violet: 'text-violet-400 bg-violet-500/20',
  };
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors[color]}`}><Icon className="w-5 h-5" /></div>
          <span className="font-medium text-white">{title}</span>
          {badge && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">{badge}</span>}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 pt-0 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// INFO CARD
// =============================================================================
const InfoCard = ({ icon: Icon, label, value, subtitle, color = 'cyan', tooltip }) => {
  const [showTip, setShowTip] = useState(false);
  const colors = {
    cyan: 'border-cyan-500/30', emerald: 'border-emerald-500/30',
    amber: 'border-amber-500/30', red: 'border-red-500/30',
  };
  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-500/20', emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20', red: 'text-red-400 bg-red-500/20',
  };
  
  return (
    <div className={`relative bg-slate-800/50 border ${colors[color]} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${iconColors[color]}`}><Icon className="w-4 h-4" /></div>
          <span className="text-xs text-slate-400 uppercase">{label}</span>
        </div>
        {tooltip && (
          <button onClick={() => setShowTip(!showTip)} className="p-1 hover:bg-slate-700 rounded">
            <Info className={`w-3 h-3 ${showTip ? 'text-cyan-400' : 'text-slate-500'}`} />
          </button>
        )}
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      <AnimatePresence>
        {showTip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute left-0 right-0 top-full mt-2 p-3 bg-slate-800 border border-cyan-500/30 rounded-lg shadow-xl z-20 text-sm"
          >
            <p className="text-slate-300">{tooltip}</p>
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
  // State
  const [town, setTown] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_town_v8');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  const [property, setProperty] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_property_v8');
      return saved ? JSON.parse(saved) : { address: '' };
    }
    return { address: '' };
  });
  
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shs_data_v8');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [showGlossary, setShowGlossary] = useState(false);
  const [showPrograms, setShowPrograms] = useState(false);
  const [tideData, setTideData] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [femaData, setFemaData] = useState(null);
  const [localUpdates, setLocalUpdates] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Persistence
  useEffect(() => {
    if (town) localStorage.setItem('shs_town_v8', JSON.stringify(town));
  }, [town]);
  
  useEffect(() => {
    if (property) localStorage.setItem('shs_property_v8', JSON.stringify(property));
  }, [property]);
  
  useEffect(() => {
    localStorage.setItem('shs_data_v8', JSON.stringify(data));
  }, [data]);
  
  // Fetch APIs when town changes
  useEffect(() => {
    if (!town) return;
    
    // Fetch tides
    fetch(`/api/tides?county=${encodeURIComponent(town.county)}`)
      .then(r => r.json())
      .then(d => { if (d.success) setTideData(d); })
      .catch(() => {});
    
    // Fetch weather alerts
    fetch(`/api/weather-alerts?zip=${town.zip}`)
      .then(r => r.json())
      .then(d => { if (d.alerts) setWeatherAlerts(d.alerts); })
      .catch(() => {});
    
    // Fetch local updates (programs, grants, deadlines)
    const belowBfe = data.elevationVsBFE === 'below';
    const hasNfip = data.floodInsurance === 'yes';
    fetch(`/api/local-updates?county=${encodeURIComponent(town.county)}&zone=${town.zone}&belowBfe=${belowBfe}&hasNfip=${hasNfip}`)
      .then(r => r.json())
      .then(d => { if (d.success) setLocalUpdates(d); })
      .catch(() => {});
  }, [town, data.elevationVsBFE, data.floodInsurance]);
  
  // Fetch FEMA data when address changes
  const lookupAddress = async () => {
    if (!property.address || !town) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/fema-lookup?address=${encodeURIComponent(property.address)}&zipCode=${town.zip}`);
      const d = await res.json();
      if (d.floodZone) {
        setFemaData(d);
        setProperty(prev => ({
          ...prev,
          floodZone: d.floodZone,
          bfe: d.bfe || town.bfe,
        }));
      }
    } catch (e) {
      console.error('FEMA lookup failed:', e);
    }
    setLoading(false);
  };
  
  const update = useCallback((key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Score calculation
  const score = useMemo(() => {
    let pts = 0;
    if (data.elevationCert === 'yes') pts += 8;
    if (data.elevationVsBFE === 'above4') pts += 12;
    else if (data.elevationVsBFE === 'above2') pts += 8;
    else if (data.elevationVsBFE === 'at') pts += 4;
    if (data.foundation === 'piles') pts += 10;
    else if (data.foundation === 'piers') pts += 7;
    else if (data.foundation === 'crawl') pts += 4;
    if (data.floodVents === 'yes') pts += 6;
    if (data.breakawayWalls === 'yes') pts += 4;
    if (data.roofType === 'metal') pts += 12;
    else if (data.roofType === 'tile') pts += 10;
    else if (data.roofType === 'architectural') pts += 6;
    if (data.roofDeck === 'yes') pts += 6;
    if (data.roofAge && data.roofAge <= 10) pts += 5;
    if (data.windowProtection === 'impact') pts += 10;
    else if (data.windowProtection === 'shutters') pts += 7;
    else if (data.windowProtection === 'plywood') pts += 3;
    if (data.garageDoor === 'yes') pts += 4;
    if (data.waterShutoff === 'yes') pts += 4;
    if (data.leakSensors === 'yes') pts += 3;
    if (data.backupPower === 'generator' || data.backupPower === 'battery') pts += 4;
    if (data.hvacElevated === 'yes') pts += 2;
    if (data.electricalElevated === 'yes') pts += 2;
    if (data.floodInsurance === 'yes' || data.floodInsurance === 'private') pts += 6;
    if (data.windMitigation === 'yes') pts += 4;
    return Math.min(pts, 100);
  }, [data]);
  
  // Savings calculation
  const savings = useMemo(() => {
    let t = 0;
    if (data.elevationCert === 'yes') t += 500;
    if (data.elevationVsBFE === 'above4') t += 1200;
    else if (data.elevationVsBFE === 'above2') t += 800;
    if (data.foundation === 'piles') t += 600;
    else if (data.foundation === 'piers') t += 400;
    if (data.floodVents === 'yes') t += 300;
    if (data.breakawayWalls === 'yes') t += 200;
    if (data.roofType === 'metal') t += 600;
    else if (data.roofType === 'tile') t += 400;
    if (data.roofDeck === 'yes') t += 400;
    if (data.roofAge && data.roofAge <= 10) t += 300;
    if (data.windowProtection === 'impact') t += 500;
    else if (data.windowProtection === 'shutters') t += 300;
    if (data.garageDoor === 'yes') t += 200;
    if (data.waterShutoff === 'yes') t += 200;
    return t;
  }, [data]);
  
  const effectiveBfe = property.bfe || town?.bfe || 0;
  const cafeRequired = effectiveBfe + CAFE_ELEVATION;
  const daysToLegacy = Math.max(0, Math.ceil((LEGACY_WINDOW_END - new Date()) / (1000 * 60 * 60 * 24)));
  const daysToStorm = Math.max(0, Math.ceil((STORM_SEASON_START - new Date()) / (1000 * 60 * 60 * 24)));

  // ===========================================
  // WELCOME SCREEN
  // ===========================================
  if (!town) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-4 border border-cyan-500/30">
              <Shield className="w-4 h-4" /> ShoreHomeScore
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
  // MAIN DASHBOARD
  // ===========================================
  return (
    <div className="min-h-screen bg-slate-900">
      <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
      <ProgramsModal isOpen={showPrograms} onClose={() => setShowPrograms(false)} updates={localUpdates} county={town.county} />
      
      {/* Sticky Header */}
      <header className="bg-slate-800/95 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                <Home className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm">{town.name}</h1>
                <p className="text-xs text-slate-400">{property.address || `Zone ${property.floodZone || town.zone}`}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MiniScore score={score} />
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">${savings.toLocaleString()}</span>
              </div>
              {localUpdates?.summary?.activePrograms > 0 && (
                <button onClick={() => setShowPrograms(true)} className="p-2 hover:bg-slate-700 rounded-lg relative">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    {localUpdates.summary.activePrograms}
                  </span>
                </button>
              )}
              <button onClick={() => setShowGlossary(true)} className="p-2 hover:bg-slate-700 rounded-lg">
                <Book className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => generatePDF(property, town, data, score, savings, localUpdates)} className="p-2 hover:bg-slate-700 rounded-lg">
                <Download className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => { setTown(null); setProperty({ address: '' }); localStorage.removeItem('shs_town_v8'); }} className="p-2 hover:bg-slate-700 rounded-lg">
                <Settings className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Score + Address Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Big Score */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col items-center justify-center">
            <ResilienceGauge score={score} size="large" />
          </div>
          
          {/* Address + Quick Stats */}
          <div className="lg:col-span-2 space-y-4">
            {/* Address Input */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Address (for personalized report)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="123 Ocean Ave..."
                  value={property.address}
                  onChange={(e) => setProperty(prev => ({ ...prev, address: e.target.value }))}
                  className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={lookupAddress}
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  {loading ? 'Looking up...' : 'Lookup'}
                </button>
              </div>
              {femaData && (
                <p className="text-xs text-emerald-400 mt-2">✓ FEMA data loaded: Zone {femaData.floodZone}, BFE {femaData.bfe}ft</p>
              )}
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon={Waves}
                label="Flood Zone"
                value={property.floodZone || town.zone}
                subtitle={town.zone.startsWith('V') ? 'Coastal High Risk' : 'High Risk'}
                color={town.zone.startsWith('V') ? 'red' : 'amber'}
                tooltip="Your FEMA flood zone determines building requirements and insurance rates."
              />
              <InfoCard
                icon={ArrowUp}
                label="CAFE Required"
                value={`${cafeRequired} ft`}
                subtitle={`BFE ${effectiveBfe}ft + 4ft`}
                color="cyan"
                tooltip="Coastal A Flood Elevation - NJ requires new construction to be this high."
              />
              <InfoCard
                icon={Clock}
                label="Legacy Window"
                value={`${daysToLegacy} days`}
                subtitle="Apply by July 15, 2026"
                color="amber"
                tooltip="Permits submitted before this date can use previous elevation standards."
              />
              {tideData && tideData.current && tideData.current.level !== null ? (
                <InfoCard
                  icon={Anchor}
                  label="Current Tide"
                  value={`${tideData.current.levelFeet} ft`}
                  subtitle={`${(effectiveBfe - parseFloat(tideData.current.levelFeet)).toFixed(1)}ft below BFE`}
                  color="cyan"
                  tooltip={`Live water level at ${tideData.station?.name}. Compare to your BFE to understand current flood margin.`}
                />
              ) : (
                <InfoCard
                  icon={CloudRain}
                  label="Storm Season"
                  value={`${daysToStorm} days`}
                  subtitle="Starts June 1"
                  color="cyan"
                  tooltip="Hurricane season runs June 1 - November 30. Prepare before it starts."
                />
              )}
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-bold text-red-400">Active Weather Alert</span>
            </div>
            {weatherAlerts.slice(0, 2).map((alert, i) => (
              <p key={i} className="text-sm text-slate-300">{alert.headline || alert.event}</p>
            ))}
          </div>
        )}

        {/* Local Updates Banner */}
        <UpdatesBanner updates={localUpdates} onViewAll={() => setShowPrograms(true)} />

        {/* Categories */}
        <div className="space-y-3">
          
          <CategorySection title="Flood Protection" icon={Droplets} color="blue">
            <ToggleItem
              label="Elevation Certificate"
              description="Official document showing your home's elevation"
              value={data.elevationCert}
              onChange={(v) => update('elevationCert', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
              savingsImpact="+$500/yr savings"
              potentialSavings={500}
              info={{
                why: "This is THE most important flood document. Insurance companies use it to calculate your premium.",
                howToSpot: "Look for 'FEMA Form 086-0-33' or ask your mortgage company - they may have a copy from closing.",
                tip: "A licensed surveyor can create one - costs vary by area but typically $300-600. Often pays for itself in year one through insurance savings."
              }}
            />
            <ToggleItem
              label="Elevation vs BFE"
              description={`Your BFE is ${effectiveBfe} ft`}
              value={data.elevationVsBFE}
              onChange={(v) => update('elevationVsBFE', v)}
              options={[
                { value: 'above4', label: '4+ ft above' },
                { value: 'above2', label: '2-4 ft above' },
                { value: 'at', label: 'At BFE' },
                { value: 'below', label: 'Below' },
                { value: 'unsure', label: 'Unsure' },
              ]}
              savingsImpact="+$1,200/yr savings"
              info={{
                why: "Elevation is the #1 factor in flood insurance. Each foot above BFE saves hundreds.",
                howToSpot: "Check your Elevation Certificate or count steps from ground to front door (each step ≈ 7-8 inches).",
                tip: "CAFE requires BFE + 4ft. If you're at or above this, you're in great shape!"
              }}
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
              savingsImpact="+$600/yr savings"
              info={{
                why: "Elevated foundations let water flow under. Slab/basement trap water and suffer most damage.",
                howToSpot: "PILES: Round poles into ground. PIERS: Concrete blocks on footings. CRAWL: Short enclosed area. SLAB: Flat concrete on ground.",
                tip: "In VE zones, pile foundations are required. They also allow easier future elevation."
              }}
            />
            <ToggleItem
              label="Flood Vents"
              description="Openings that allow water to flow through"
              value={data.floodVents}
              onChange={(v) => update('floodVents', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
              savingsImpact="+$300/yr savings"
              potentialSavings={300}
              info={{
                why: "Vents equalize water pressure during floods. Without them, pressure can collapse walls.",
                howToSpot: "Look at garage/crawlspace walls near ground for rectangular or circular vents with louvers.",
                tip: "Need 1 sq inch per 1 sq foot of enclosed area. 500 sq ft garage needs ~4 standard vents."
              }}
            />
            <ToggleItem
              label="HVAC Elevated"
              value={data.hvacElevated}
              onChange={(v) => update('hvacElevated', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              info={{
                why: "HVAC costs $5-15K to replace and is destroyed by saltwater. Elevation protects this investment.",
                howToSpot: "Find outdoor AC condenser and indoor air handler. Are they on raised platforms or roof?",
                tip: "Relocating HVAC higher protects a major investment. Get quotes from local HVAC contractors."
              }}
            />
            <ToggleItem
              label="Electrical Panel Elevated"
              value={data.electricalElevated}
              onChange={(v) => update('electricalElevated', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              info={{
                why: "Flooded panels are dangerous and delay power restoration after floods.",
                howToSpot: "Find your breaker panel (gray metal box). Is it in garage at ground level or higher up?",
                tip: "Panels should be 1+ ft above BFE. An electrician can assess relocation options."
              }}
            />
          </CategorySection>

          <CategorySection title="Wind Defense" icon={Wind} color="cyan">
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
              savingsImpact="+$600/yr savings"
              potentialSavings={600}
              info={{
                why: "Metal roofs handle 180mph winds. 3-tab shingles often fail at 60-70mph.",
                howToSpot: "METAL: Long vertical panels with raised seams. TILE: Clay/concrete curves. ARCHITECTURAL: Thick dimensional shingles.",
                tip: "Metal costs more upfront but lasts 50+ years vs 20-25 for shingles, and offers significant insurance savings."
              }}
            />
            <ToggleItem
              label="Sealed Roof Deck"
              description="Secondary water barrier under shingles"
              value={data.roofDeck}
              onChange={(v) => update('roofDeck', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]}
              savingsImpact="+$400/yr savings"
              potentialSavings={400}
              info={{
                why: "If shingles blow off, sealed deck prevents water intrusion. It's your backup.",
                howToSpot: "Check roofing contract for 'peel and stick underlayment' or 'self-adhering membrane'.",
                tip: "Adding sealed deck during roof replacement is relatively inexpensive vs. the protection it provides."
              }}
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
              savingsImpact="+$300/yr savings"
              info={{
                why: "Older roofs fail more often. Many insurers won't cover roofs over 15-20 years.",
                howToSpot: "Check purchase docs, permits, or look for date on attic side of roof deck.",
                tip: "If roof is 15+ years, get it inspected to know where you stand."
              }}
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
              savingsImpact="+$500/yr savings"
              potentialSavings={500}
              info={{
                why: "Broken windows let wind in, pressurizing house and often blowing off roof.",
                howToSpot: "IMPACT: Small etched label in corner. SHUTTERS: Accordion, roll-down, or panels beside windows.",
                tip: "Impact windows add home value and reduce noise. Get quotes from window contractors for your specific situation."
              }}
            />
            <ToggleItem
              label="Wind-Rated Garage Door"
              value={data.garageDoor}
              onChange={(v) => update('garageDoor', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }]}
              savingsImpact="+$200/yr savings"
              potentialSavings={200}
              info={{
                why: "Garage door is largest opening. Failure lets wind pressurize and damage structure.",
                howToSpot: "Look for wind rating label inside door, or reinforcement bars across back.",
                tip: "If you have a standard door, bracing kits can significantly improve wind resistance without full replacement."
              }}
            />
          </CategorySection>

          <CategorySection title="Smart Systems" icon={Zap} color="emerald">
            <ToggleItem
              label="Smart Water Shutoff"
              description="Auto-detects leaks and shuts off water"
              value={data.waterShutoff}
              onChange={(v) => update('waterShutoff', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              savingsImpact="+$200/yr savings"
              potentialSavings={200}
              info={{
                why: "Prevents catastrophic water damage by auto-cutting supply when leak detected.",
                howToSpot: "Look at main water line where it enters house for motorized valve with WiFi.",
                tip: "Some insurers offer discounts for smart water systems. Especially valuable for vacation homes that sit empty."
              }}
            />
            <ToggleItem
              label="Leak Sensors"
              value={data.leakSensors}
              onChange={(v) => update('leakSensors', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              info={{
                why: "Alerts you immediately via phone so you can act before major damage.",
                howToSpot: "Small pucks near water heater, washing machine, dishwasher, under sinks.",
                tip: "Basic sensors cost $20-40 each. Put near any water source."
              }}
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
              info={{
                why: "Outages can last weeks. Without power, sump pumps stop and food spoils.",
                howToSpot: "GENERATOR: Large unit outside with transfer switch. BATTERY: Wall-mounted like Powerwall. PORTABLE: In garage/shed.",
                tip: "Whole-home generator ($5-15K) starts automatically. Portable ($500-1,500) runs essentials."
              }}
            />
          </CategorySection>

          <CategorySection title="Insurance & Documentation" icon={FileText} color="amber">
            <ToggleItem
              label="Flood Insurance"
              value={data.floodInsurance}
              onChange={(v) => update('floodInsurance', v)}
              options={[{ value: 'yes', label: 'NFIP' }, { value: 'private', label: 'Private' }, { value: 'no', label: 'None' }]}
              info={{
                why: "Homeowners insurance does NOT cover floods. You need separate policy.",
                howToSpot: "Check insurance docs for separate 'flood insurance' policy.",
                tip: "NFIP max is $250K structure. Consider 'excess flood' if home worth more."
              }}
            />
            <ToggleItem
              label="Wind Mitigation Report"
              description="Professional inspection documenting wind features"
              value={data.windMitigation}
              onChange={(v) => update('windMitigation', v)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              info={{
                why: "Documents your wind features for insurance credit. Without it, you may not get discounts.",
                howToSpot: "2-4 page form from licensed inspector with photos of roof, connections, windows.",
                tip: "Costs $75-150 and can save hundreds or thousands per year."
              }}
            />
            
            {/* Savings Summary */}
            <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
              <h4 className="font-medium text-white mb-3">Your Insurance Savings</h4>
              <div className="space-y-2 text-sm">
                {data.elevationCert === 'yes' && <div className="flex justify-between"><span className="text-slate-400">Elevation Certificate</span><span className="text-emerald-400">+$500</span></div>}
                {data.elevationVsBFE === 'above4' && <div className="flex justify-between"><span className="text-slate-400">4+ ft Above BFE</span><span className="text-emerald-400">+$1,200</span></div>}
                {data.elevationVsBFE === 'above2' && <div className="flex justify-between"><span className="text-slate-400">2-4 ft Above BFE</span><span className="text-emerald-400">+$800</span></div>}
                {(data.foundation === 'piles' || data.foundation === 'piers') && <div className="flex justify-between"><span className="text-slate-400">Elevated Foundation</span><span className="text-emerald-400">+${data.foundation === 'piles' ? '600' : '400'}</span></div>}
                {data.floodVents === 'yes' && <div className="flex justify-between"><span className="text-slate-400">Flood Vents</span><span className="text-emerald-400">+$300</span></div>}
                {data.roofType === 'metal' && <div className="flex justify-between"><span className="text-slate-400">Metal Roof</span><span className="text-emerald-400">+$600</span></div>}
                {data.roofDeck === 'yes' && <div className="flex justify-between"><span className="text-slate-400">Sealed Roof Deck</span><span className="text-emerald-400">+$400</span></div>}
                {(data.windowProtection === 'impact' || data.windowProtection === 'shutters') && <div className="flex justify-between"><span className="text-slate-400">Window Protection</span><span className="text-emerald-400">+${data.windowProtection === 'impact' ? '500' : '300'}</span></div>}
                {data.garageDoor === 'yes' && <div className="flex justify-between"><span className="text-slate-400">Wind-Rated Garage</span><span className="text-emerald-400">+$200</span></div>}
                {data.waterShutoff === 'yes' && <div className="flex justify-between"><span className="text-slate-400">Smart Water Shutoff</span><span className="text-emerald-400">+$200</span></div>}
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <div className="flex justify-between font-bold"><span className="text-white">Total Annual</span><span className="text-emerald-400">${savings.toLocaleString()}/yr</span></div>
                  <div className="flex justify-between text-slate-500 mt-1"><span>10-Year Impact</span><span className="text-white">${(savings * 10).toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </CategorySection>

        </div>

        <footer className="text-center py-6 text-sm text-slate-500 space-y-2">
          <p className="font-medium text-slate-400">ShoreHomeScore</p>
          <p>Flood data: FEMA National Flood Hazard Layer • Tides: NOAA CO-OPS • Weather: National Weather Service</p>
          <p className="text-xs">Insurance savings estimates based on typical NFIP and private insurer discount patterns. Actual savings vary by policy and carrier. Consult your insurance agent for specific quotes.</p>
        </footer>
      </main>
    </div>
  );
}
