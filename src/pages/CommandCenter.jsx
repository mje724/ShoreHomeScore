import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Shield, Scale, ChevronDown, ChevronRight, Check, DollarSign, TrendingUp, MapPin, Search, HelpCircle, X, Target, CheckCircle, History, Phone, Globe, Landmark, Wind, Droplets, Zap, Cpu, Lock, Mail, Download, FileText, AlertTriangle } from 'lucide-react';

// ============================================================================
// TOWNS DATA
// ============================================================================
const TOWNS = [
  { name: 'Asbury Park', county: 'Monmouth', zip: '07712', zone: 'AE', bfe: 10 },
  { name: 'Atlantic City', county: 'Atlantic', zip: '08401', zone: 'VE', bfe: 11 },
  { name: 'Avalon', county: 'Cape May', zip: '08202', zone: 'VE', bfe: 11 },
  { name: 'Bay Head', county: 'Ocean', zip: '08742', zone: 'AE', bfe: 9 },
  { name: 'Beach Haven', county: 'Ocean', zip: '08008', zone: 'VE', bfe: 10 },
  { name: 'Belmar', county: 'Monmouth', zip: '07719', zone: 'AE', bfe: 10 },
  { name: 'Brick', county: 'Ocean', zip: '08723', zone: 'AE', bfe: 8 },
  { name: 'Brigantine', county: 'Atlantic', zip: '08203', zone: 'VE', bfe: 11 },
  { name: 'Cape May', county: 'Cape May', zip: '08204', zone: 'VE', bfe: 10 },
  { name: 'Long Beach Twp', county: 'Ocean', zip: '08008', zone: 'VE', bfe: 10 },
  { name: 'Long Branch', county: 'Monmouth', zip: '07740', zone: 'AE', bfe: 11 },
  { name: 'Mantoloking', county: 'Ocean', zip: '08738', zone: 'VE', bfe: 10 },
  { name: 'Margate', county: 'Atlantic', zip: '08402', zone: 'VE', bfe: 10 },
  { name: 'Ocean City', county: 'Cape May', zip: '08226', zone: 'AE', bfe: 9 },
  { name: 'Point Pleasant Beach', county: 'Ocean', zip: '08742', zone: 'AE', bfe: 9 },
  { name: 'Sea Bright', county: 'Monmouth', zip: '07760', zone: 'VE', bfe: 12 },
  { name: 'Sea Isle City', county: 'Cape May', zip: '08243', zone: 'VE', bfe: 10 },
  { name: 'Seaside Heights', county: 'Ocean', zip: '08751', zone: 'AE', bfe: 9 },
  { name: 'Ship Bottom', county: 'Ocean', zip: '08008', zone: 'VE', bfe: 10 },
  { name: 'Stone Harbor', county: 'Cape May', zip: '08247', zone: 'VE', bfe: 10 },
  { name: 'Toms River', county: 'Ocean', zip: '08753', zone: 'AE', bfe: 8 },
  { name: 'Wildwood', county: 'Cape May', zip: '08260', zone: 'VE', bfe: 9 },
];

// ============================================================================
// CHECKLIST CATEGORIES
// ============================================================================
const CATEGORIES = [
  {
    id: 'wind', name: 'Wind Defense', subtitle: 'Storm protection', icon: Wind, color: 'cyan',
    items: [
      { id: 'roofType', name: 'Roof Shingle Type', type: 'select', options: [
        { value: '3tab', label: '3-Tab Shingles', points: 0, insurance: 0, equity: 0 },
        { value: 'arch', label: 'Architectural', points: 15, insurance: -150, equity: 5000 },
        { value: 'metal', label: 'Standing Seam Metal', points: 25, insurance: -300, equity: 12000 },
      ], help: 'Architectural rated 110-130mph. Metal best for coastal.' },
      { id: 'roofAge', name: 'Roof Age', type: 'select', options: [
        { value: 'new', label: '0-5 years', points: 20, insurance: -200, equity: 8000 },
        { value: 'mid', label: '6-15 years', points: 10, insurance: 0, equity: 0 },
        { value: 'old', label: '15+ years', points: -10, insurance: 500, equity: -10000 },
      ], help: 'Roofs 15+ years face ACV penalties.' },
      { id: 'roofDeck', name: 'Sealed Roof Deck', type: 'toggle', points: 15, insurance: -150, equity: 4000, help: 'Membrane under shingles. Required for FORTIFIED.' },
      { id: 'windowProtection', name: 'Window Protection', type: 'select', options: [
        { value: 'none', label: 'Standard Windows', points: 0, insurance: 0, equity: 0 },
        { value: 'shutters', label: 'Storm Shutters', points: 10, insurance: -100, equity: 3000 },
        { value: 'impact', label: 'Impact Glass', points: 20, insurance: -250, equity: 10000 },
      ], help: 'Impact glass or shutters required in V-zones.' },
      { id: 'garageDoor', name: 'Wind-Rated Garage Door', type: 'toggle', points: 10, insurance: -75, equity: 2500, help: '#1 failure point in hurricanes.' },
    ]
  },
  {
    id: 'flood', name: 'Flood Armor', subtitle: 'Flood protection', icon: Droplets, color: 'blue',
    items: [
      { id: 'elevation', name: 'Elevation vs BFE', type: 'select', options: [
        { value: 'below', label: 'Below BFE', points: -20, insurance: 1500, equity: -25000 },
        { value: 'at', label: 'At BFE', points: 5, insurance: 0, equity: 0 },
        { value: 'above1', label: '1-2ft Above', points: 15, insurance: -400, equity: 10000 },
        { value: 'above3', label: '3-4ft Above', points: 25, insurance: -800, equity: 20000 },
      ], help: '#1 factor in flood insurance premium.' },
      { id: 'elevCert', name: 'Elevation Certificate', type: 'toggle', points: 10, insurance: -300, equity: 2000, help: 'Required for accurate NFIP rating. $300-600.' },
      { id: 'floodVents', name: 'Engineered Flood Vents', type: 'toggle', points: 10, insurance: -200, equity: 3000, help: 'Equalize water pressure. Required below BFE.' },
      { id: 'foundation', name: 'Foundation Type', type: 'select', options: [
        { value: 'basement', label: 'Basement', points: -15, insurance: 800, equity: -15000 },
        { value: 'slab', label: 'Slab on Grade', points: 0, insurance: 200, equity: 0 },
        { value: 'crawl', label: 'Crawl Space', points: 5, insurance: 0, equity: 2000 },
        { value: 'piles', label: 'Piles/Stilts', points: 20, insurance: -500, equity: 15000 },
      ], help: 'Piles required for new VE construction.' },
      { id: 'backflow', name: 'Sewer Backflow Valve', type: 'toggle', points: 5, insurance: -50, equity: 1000, help: 'Prevents sewage backup.' },
    ]
  },
  {
    id: 'systems', name: 'Vital Systems', subtitle: 'Mechanical & electrical', icon: Zap, color: 'amber',
    items: [
      { id: 'hvacLocation', name: 'HVAC Location', type: 'select', options: [
        { value: 'ground', label: 'Ground Level', points: -10, insurance: 300, equity: -5000 },
        { value: 'elevated', label: 'Above BFE', points: 15, insurance: -200, equity: 8000 },
        { value: 'roof', label: 'Roof Mounted', points: 20, insurance: -300, equity: 10000 },
      ], help: 'Must be above BFE+4ft under 2026 NJ REAL.' },
      { id: 'electricalPanel', name: 'Electrical Panel', type: 'select', options: [
        { value: 'below', label: 'Below BFE', points: -10, insurance: 200, equity: -3000 },
        { value: 'above', label: 'Above BFE', points: 10, insurance: -100, equity: 3000 },
      ], help: 'Elevating prevents major damage.' },
      { id: 'waterHeater', name: 'Water Heater Elevated', type: 'toggle', points: 5, insurance: -50, equity: 1000, help: 'Simple elevation prevents replacement.' },
      { id: 'generator', name: 'Backup Generator', type: 'toggle', points: 10, insurance: -50, equity: 5000, help: 'Island-mode for outages.' },
    ]
  },
  {
    id: 'tech', name: 'Smart Defense', subtitle: 'Technology', icon: Cpu, color: 'purple',
    items: [
      { id: 'waterShutoff', name: 'Smart Water Shutoff', type: 'toggle', points: 8, insurance: -100, equity: 2000, help: 'Auto shutoff prevents damage.' },
      { id: 'leakSensors', name: 'Leak Sensors', type: 'toggle', points: 5, insurance: -50, equity: 500, help: 'Early warning for intrusion.' },
      { id: 'floodMonitor', name: 'Flood Monitor', type: 'toggle', points: 5, insurance: 0, equity: 500, help: 'Track nearby water levels.' },
    ]
  },
  {
    id: 'legal', name: 'Legal Shield', subtitle: 'Compliance', icon: Scale, color: 'emerald',
    items: [
      { id: 'floodInsurance', name: 'Flood Insurance', type: 'select', options: [
        { value: 'none', label: 'None', points: -25, insurance: 2500, equity: -30000 },
        { value: 'nfip', label: 'NFIP', points: 15, insurance: 0, equity: 5000 },
        { value: 'private', label: 'Private', points: 15, insurance: -200, equity: 5000 },
        { value: 'both', label: 'NFIP + Excess', points: 20, insurance: 200, equity: 8000 },
      ], help: 'NFIP includes ICC ($30K). Private may be cheaper.' },
      { id: 'permitHistory', name: 'Permits Tracked', type: 'toggle', points: 5, insurance: 0, equity: 1000, help: 'Avoid 50% threshold surprise.' },
    ]
  },
];

// ============================================================================
// PROGRAMS DATA
// ============================================================================
const PROGRAMS = [
  { id: 'blue-acres', name: 'Blue Acres Buyout', agency: 'NJ DEP', desc: 'Voluntary buyout at pre-flood value.', elig: ['Flood-prone area', 'Municipality support'], funding: 'Pre-flood fair market value', timeline: '6-12 months', apply: 'dep.nj.gov/blueacres or (609) 940-4140', link: 'https://dep.nj.gov/blueacres', phone: '(609) 940-4140', tips: ['Use pre-flood photos', '700+ homes since Sandy'], tags: ['repetitive-loss', 've-zone'], status: 'accepting' },
  { id: 'swift', name: 'FMA Swift Current', agency: 'FEMA', desc: 'Fast-track mitigation for repetitive loss.', elig: ['Active NFIP policy', 'Repetitive damage'], funding: 'Up to 100% for severe RL', timeline: 'Expedited', apply: 'Local floodplain admin', link: 'https://www.fema.gov/grants/mitigation/floods', tips: ['Created after Ida'], tags: ['nfip-insured', 'repetitive-loss'], status: 'accepting' },
  { id: 'hmgp', name: 'HMGP Grants', agency: 'FEMA/NJ OEM', desc: 'Post-disaster elevation grants. 78% federal.', elig: ['Disaster-declared county'], funding: '75-90% federal', timeline: '1-3 years', apply: 'NJ OEM after disaster', link: 'https://www.nj.gov/njoem/mitigation/hazard.shtml', tags: ['disaster-declared'], status: 'limited' },
  { id: 'icc', name: 'ICC Coverage ($30K)', agency: 'NFIP', desc: 'Hidden $30K for compliance after substantial damage!', elig: ['NFIP policy', 'Substantial damage (≥50%)'], funding: 'Up to $30,000', timeline: 'File within 60 days', apply: 'File SEPARATELY from flood claim!', link: 'https://www.fema.gov/floodplain-management/financial-help/increased-cost-compliance', tips: ['SEPARATE from flood claim!', 'Only 7% use it!', 'Get 50% advance', 'Combine with HMGP'], tags: ['nfip-insured'], status: 'always' },
  { id: 'crs', name: 'CRS Discount', agency: 'NFIP', desc: 'Auto 5-45% premium discount.', elig: ['NFIP policy', 'CRS community'], funding: 'NJ: typically 15-20%', apply: 'Automatic', link: 'https://www.fema.gov/floodplain-management/community-rating-system', tags: ['nfip-insured'], status: 'auto' },
];

// ============================================================================
// HISTORICAL DATA
// ============================================================================
const DISASTERS = [
  { id: 'sandy', name: 'Hurricane Sandy', date: 'Oct 2012', decl: 'DR-4086', deaths: 37, loss: '$30B', counties: ['All'] },
  { id: 'ida', name: 'Hurricane Ida', date: 'Sep 2021', decl: 'DR-4614', deaths: 30, loss: '$2B+', counties: ['Bergen', 'Essex', 'Middlesex', 'Passaic'] },
  { id: 'irene', name: 'Hurricane Irene', date: 'Aug 2011', decl: 'DR-4021', deaths: 5, loss: '$1B+', counties: ['All'] },
];

const COUNTY_STATS = { 
  'Ocean': { d: 9, p: 55000, c: '$1.2B', r: 3200, crs: '15%' }, 
  'Monmouth': { d: 8, p: 32000, c: '$890M', r: 1800, crs: '20%' }, 
  'Atlantic': { d: 8, p: 28000, c: '$720M', r: 1500, crs: '20%' }, 
  'Cape May': { d: 7, p: 22000, c: '$650M', r: 1200, crs: '15%' } 
};

// ============================================================================
// VERCEL API ENDPOINT ($0, No Third Party)
// Emails log to Vercel Logs - view at vercel.com/dashboard → Logs → search "NEW LEAD"
// ============================================================================
const API_ENDPOINT = '/api/collect-email';

// ============================================================================
// UTILITY
// ============================================================================
const fmt = n => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${n}`;

// ============================================================================
// PDF REPORT GENERATOR
// ============================================================================
const generatePDFReport = (town, selections, score, totalIns, totalEq, catScores, actions) => {
  const legacy = Math.max(0, Math.ceil((new Date('2026-07-15') - new Date()) / 864e5));
  const cty = COUNTY_STATS[town.county];
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>ShoreHomeScore Report - ${town.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #334155; }
    .header h1 { font-size: 28px; color: #22d3ee; margin-bottom: 8px; }
    .header p { color: #94a3b8; }
    .score-section { display: flex; justify-content: center; gap: 30px; margin-bottom: 30px; }
    .score-box { text-align: center; padding: 20px 30px; background: #1e293b; border-radius: 12px; }
    .score-box .value { font-size: 42px; font-weight: bold; }
    .score-box .label { color: #94a3b8; font-size: 12px; margin-top: 4px; }
    .score-box.main .value { color: ${score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}; }
    .score-box.ins .value { color: ${totalIns > 0 ? '#ef4444' : '#10b981'}; }
    .score-box.eq .value { color: ${totalEq > 0 ? '#10b981' : '#ef4444'}; }
    .section { background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .section h2 { color: #22d3ee; font-size: 16px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #334155; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .stat { background: #0f172a; padding: 12px; border-radius: 8px; }
    .stat .label { color: #64748b; font-size: 11px; text-transform: uppercase; }
    .stat .value { color: #fff; font-size: 18px; font-weight: 600; margin-top: 4px; }
    .action { background: #0f172a; padding: 12px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; }
    .action .text { color: #e2e8f0; }
    .action .impact { color: #10b981; font-size: 12px; }
    .warning { background: #7c2d12; border: 1px solid #f97316; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .warning h3 { color: #f97316; margin-bottom: 5px; }
    .program { background: #0f172a; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
    .program .name { color: #22d3ee; font-weight: 600; }
    .program .funding { color: #94a3b8; font-size: 12px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 ShoreHomeScore Report</h1>
    <p>${town.name}, NJ ${town.zip} • ${town.county} County</p>
    <p style="margin-top: 8px; font-size: 12px;">Generated ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="score-section">
    <div class="score-box main"><div class="value">${score}</div><div class="label">Resilience Score</div></div>
    <div class="score-box ins"><div class="value">${totalIns > 0 ? '+' : ''}${fmt(Math.abs(totalIns))}</div><div class="label">Insurance/Year</div></div>
    <div class="score-box eq"><div class="value">${totalEq > 0 ? '+' : ''}${fmt(Math.abs(totalEq))}</div><div class="label">Property Value</div></div>
  </div>
  
  <div class="section">
    <h2>📍 Property Information</h2>
    <div class="grid">
      <div class="stat"><div class="label">Flood Zone</div><div class="value">${town.zone}</div></div>
      <div class="stat"><div class="label">Base Flood Elevation</div><div class="value">${town.bfe} ft</div></div>
      <div class="stat"><div class="label">2026 CAFE Requirement</div><div class="value">${town.bfe + 4} ft</div></div>
      <div class="stat"><div class="label">Legacy Window</div><div class="value">${legacy} days left</div></div>
      ${cty ? `<div class="stat"><div class="label">County CRS Discount</div><div class="value">${cty.crs}</div></div>` : ''}
      ${cty ? `<div class="stat"><div class="label">County Rep. Loss Props</div><div class="value">${cty.r.toLocaleString()}</div></div>` : ''}
    </div>
  </div>
  
  ${legacy < 180 ? `<div class="warning"><h3>⚠️ Legacy Window Closing</h3><p>Only ${legacy} days remain to complete work under old rules. After July 15, 2026, all construction must meet new +4ft elevation requirements.</p></div>` : ''}
  
  <div class="section">
    <h2>📊 Category Scores</h2>
    <div class="grid">
      ${CATEGORIES.map(cat => {
        const cs = catScores[cat.id] || { pts: 0, max: 1 };
        const pct = Math.round((cs.pts / Math.max(cs.max, 1)) * 100);
        return `<div class="stat"><div class="label">${cat.name}</div><div class="value">${pct}%</div></div>`;
      }).join('')}
    </div>
  </div>
  
  ${actions.length > 0 ? `
  <div class="section">
    <h2>🎯 Top Improvements</h2>
    ${actions.slice(0, 5).map(a => `<div class="action"><span class="text">${a.txt}</span><span class="impact">${a.ins ? fmt(Math.abs(a.ins)) + '/yr' : ''} ${a.eq ? fmt(Math.abs(a.eq)) : ''}</span></div>`).join('')}
  </div>` : ''}
  
  <div class="section">
    <h2>💰 Programs You May Qualify For</h2>
    ${PROGRAMS.slice(0, 4).map(p => `<div class="program"><div class="name">${p.name}</div><div class="funding">${p.funding}</div></div>`).join('')}
    <p style="margin-top: 12px; padding: 12px; background: #164e63; border-radius: 8px; color: #22d3ee;">
      <strong>💡 Don't Miss ICC!</strong> If you have NFIP insurance and suffer substantial damage, you have access to $30,000 in ICC funds - filed SEPARATELY from your flood damage claim!
    </p>
  </div>
  
  <div class="footer">
    <p>ShoreHomeScore • Educational information only • Consult licensed professionals</p>
    <p style="margin-top: 8px;">shorehomescore.com</p>
  </div>
</body>
</html>`;

  // Open in new window for printing/saving as PDF
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ShoreHomeScore() {
  const [town, setTown] = useState(null);
  const [selections, setSelections] = useState({});
  const [srch, setSrch] = useState('');
  const [dd, setDd] = useState(false);
  const [openCats, setOpenCats] = useState({});
  const [openSections, setOpenSections] = useState({ actions: true, programs: false, history: false, compliance: false });
  const [info, setInfo] = useState(null);
  const [modal, setModal] = useState(null);
  
  // EMAIL GATE STATE
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const ref = useRef(null);

  useEffect(() => { 
    const h = e => ref.current && !ref.current.contains(e.target) && setDd(false); 
    document.addEventListener('mousedown', h); 
    return () => document.removeEventListener('mousedown', h); 
  }, []);

  // Check localStorage for previous unlock
  useEffect(() => {
    const savedEmail = localStorage.getItem('shorehomescore_email');
    if (savedEmail) {
      setIsUnlocked(true);
      setEmail(savedEmail);
    }
  }, []);

  const towns = useMemo(() => !srch ? TOWNS : TOWNS.filter(t => t.name.toLowerCase().includes(srch.toLowerCase()) || t.zip.includes(srch)), [srch]);

  // Calculate score
  const { score, totalIns, totalEq, actions, catScores } = useMemo(() => {
    let pts = 0, ins = 0, eq = 0, maxPts = 0;
    const acts = [];
    const catS = {};

    CATEGORIES.forEach(cat => {
      let catPts = 0, catMax = 0;
      cat.items.forEach(item => {
        const val = selections[item.id];
        if (item.type === 'toggle') {
          catMax += item.points > 0 ? item.points : 0;
          if (val) { catPts += item.points; pts += item.points; ins += item.insurance || 0; eq += item.equity || 0; }
          else if (item.points > 5) { acts.push({ id: item.id, txt: `Add ${item.name}`, cat: cat.name, pts: item.points, ins: item.insurance, eq: item.equity }); }
        } else if (item.type === 'select' && item.options) {
          const best = Math.max(...item.options.map(o => o.points));
          catMax += best > 0 ? best : 0;
          if (val) {
            const opt = item.options.find(o => o.value === val);
            if (opt) { catPts += opt.points; pts += opt.points; ins += opt.insurance || 0; eq += opt.equity || 0;
              if (opt.points < best && best - opt.points > 5) {
                const better = item.options.find(o => o.points === best);
                acts.push({ id: item.id, txt: `Upgrade ${item.name} to ${better?.label}`, cat: cat.name, pts: best - opt.points, ins: (better?.insurance || 0) - (opt.insurance || 0), eq: (better?.equity || 0) - (opt.equity || 0) });
              }
            }
          }
        }
      });
      catS[cat.id] = { pts: catPts, max: catMax };
      maxPts += catMax;
    });

    return { score: maxPts > 0 ? Math.round((pts / maxPts) * 100) : 0, totalIns: ins, totalEq: eq, actions: acts.sort((a, b) => (b.pts || 0) - (a.pts || 0)).slice(0, 8), catScores: catS };
  }, [selections]);

  const legacy = Math.max(0, Math.ceil((new Date('2026-07-15') - new Date()) / 864e5));
  const cty = town ? COUNTY_STATS[town.county] : null;

  // Handle category click - check if unlocked
  const handleCategoryClick = (catId) => {
    if (!isUnlocked) {
      setShowEmailModal(true);
      return;
    }
    setOpenCats(p => ({ ...p, [catId]: !p[catId] }));
  };

  // Handle email submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setEmailSubmitting(true);
    setEmailError('');
    
    // Save to localStorage immediately (user always gets unlocked)
    localStorage.setItem('shorehomescore_email', email);
    localStorage.setItem('shorehomescore_town', town?.name || '');
    
    // Send to Vercel API (logs to Vercel Logs - won't block if fails)
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          town: town?.name || 'Unknown',
          county: town?.county || 'Unknown',
          zone: town?.zone || 'Unknown',
          timestamp: new Date().toISOString() 
        }),
      });
    } catch (err) {
      // Silent fail - user still gets unlocked, email logged to console as backup
      console.log('NEW LEAD (API failed, logged locally):', email, town?.name);
    }
    
    setIsUnlocked(true);
    setShowEmailModal(false);
    setEmailSubmitting(false);
    // Auto-open first category
    setOpenCats({ wind: true });
  };

  const updateSelection = (id, value) => setSelections(p => ({ ...p, [id]: value }));

  // Section component
  const Section = ({ id, icon: I, title, badge, children }) => (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <button onClick={() => setOpenSections(p => ({ ...p, [id]: !p[id] }))} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50">
        <div className="flex items-center gap-3"><I className="w-5 h-5 text-cyan-400" /><span className="font-bold text-white">{title}</span>{badge && <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-400">{badge}</span>}</div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openSections[id] ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>{openSections[id] && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="p-4 pt-0 border-t border-slate-700">{children}</div></motion.div>}</AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center"><Home className="w-5 h-5 text-slate-900" /></div>
            <div><h1 className="font-bold text-white">ShoreHomeScore</h1><p className="text-xs text-slate-500">NJ Flood Protection</p></div>
          </div>
          {town && <div className="flex items-center gap-3">
            <div className="text-right">
              <p className={`text-2xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}</p>
              <p className="text-xs text-slate-500">Score</p>
            </div>
          </div>}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Town Selector */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Select Your Town</h2>
          <div className="relative" ref={ref}>
            <button onClick={() => setDd(!dd)} className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl flex items-center justify-between hover:border-cyan-500/50">
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-cyan-400" /><span className={town ? 'text-white' : 'text-slate-500'}>{town ? `${town.name}, NJ` : 'Choose town...'}</span></div>
              <ChevronDown className={`w-5 h-5 text-slate-400 ${dd ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>{dd && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-30 overflow-hidden">
                <div className="p-2 border-b border-slate-700"><input value={srch} onChange={e => setSrch(e.target.value)} placeholder="Search..." className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" autoFocus /></div>
                <div className="max-h-64 overflow-y-auto">{towns.map(t => (
                  <button key={t.zip} onClick={() => { setTown(t); setDd(false); setSrch(''); }} className="w-full px-4 py-3 text-left hover:bg-slate-700 flex justify-between">
                    <div><p className="text-white font-medium">{t.name}</p><p className="text-xs text-slate-400">{t.county} • {t.zip}</p></div>
                    <div className="text-right"><p className={`text-xs font-medium ${t.zone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>{t.zone}</p><p className="text-xs text-slate-500">BFE: {t.bfe}ft</p></div>
                  </button>
                ))}</div>
              </motion.div>
            )}</AnimatePresence>
          </div>
          
          {/* Town Stats */}
          {town && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 grid grid-cols-4 gap-3">
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${town.zone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>{town.zone}</p>
                <p className="text-xs text-slate-500">Zone</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-white">{town.bfe}ft</p>
                <p className="text-xs text-slate-500">BFE</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-cyan-400">{town.bfe + 4}ft</p>
                <p className="text-xs text-slate-500">CAFE</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${legacy < 90 ? 'text-red-400' : 'text-amber-400'}`}>{legacy}</p>
                <p className="text-xs text-slate-500">Days</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Score Overview */}
        {town && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Resilience Score</h2>
                <p className="text-sm text-slate-400">{isUnlocked ? 'Based on your home features' : 'Unlock to customize'}</p>
              </div>
              <div className={`text-5xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-sm text-slate-400 mb-1"><DollarSign className="w-4 h-4 inline" /> Insurance</p>
                <p className={`text-xl font-bold ${totalIns > 0 ? 'text-red-400' : totalIns < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>{totalIns > 0 ? '+' : ''}{fmt(Math.abs(totalIns))}/yr</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-sm text-slate-400 mb-1"><TrendingUp className="w-4 h-4 inline" /> Value</p>
                <p className={`text-xl font-bold ${totalEq > 0 ? 'text-emerald-400' : totalEq < 0 ? 'text-red-400' : 'text-slate-400'}`}>{totalEq > 0 ? '+' : ''}{fmt(Math.abs(totalEq))}</p>
              </div>
            </div>
          </div>
        )}

        {/* Unlock Banner (when locked) */}
        {town && !isUnlocked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">🔓 Unlock Your Full Assessment</h3>
                <p className="text-sm text-slate-300">Enter your email to customize your resilience score and download your PDF report.</p>
              </div>
              <button onClick={() => setShowEmailModal(true)} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors whitespace-nowrap">
                Unlock Free
              </button>
            </div>
          </motion.div>
        )}

        {/* Checklist Categories */}
        {town && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Home Protection Checklist</h2>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const cs = catScores[cat.id] || { pts: 0, max: 1 };
              const pct = Math.round((cs.pts / Math.max(cs.max, 1)) * 100);
              
              return (
                <div key={cat.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <button onClick={() => handleCategoryClick(cat.id)} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${cat.color}-500/20`}><Icon className={`w-5 h-5 text-${cat.color}-400`} /></div>
                      <div className="text-left">
                        <p className="font-bold text-white">{cat.name}</p>
                        <p className="text-xs text-slate-400">{cat.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-sm font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-slate-400'}`}>{pct}%</p>
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full bg-${cat.color}-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      {isUnlocked ? (
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openCats[cat.id] ? 'rotate-180' : ''}`} />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openCats[cat.id] && isUnlocked && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 border-t border-slate-700 space-y-3">
                          {cat.items.map(item => (
                            <div key={item.id} className="bg-slate-900/50 rounded-lg p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-white font-medium">{item.name}</p>
                                    {item.help && <button onClick={() => setInfo(item.id)}><HelpCircle className="w-4 h-4 text-slate-500 hover:text-cyan-400" /></button>}
                                  </div>
                                  
                                  {item.type === 'toggle' ? (
                                    <div className="mt-2 flex items-center justify-between">
                                      <div className="flex gap-3 text-xs">
                                        {item.insurance && <span className={item.insurance < 0 ? 'text-emerald-400' : 'text-red-400'}>{item.insurance > 0 ? '+' : ''}{fmt(Math.abs(item.insurance))}/yr</span>}
                                        {item.equity && <span className={item.equity > 0 ? 'text-emerald-400' : 'text-red-400'}>{item.equity > 0 ? '+' : ''}{fmt(Math.abs(item.equity))}</span>}
                                      </div>
                                      <button onClick={() => updateSelection(item.id, !selections[item.id])} className={`w-12 h-6 rounded-full transition-colors ${selections[item.id] ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${selections[item.id] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {item.options.map(opt => {
                                        const sel = selections[item.id] === opt.value;
                                        return (
                                          <button key={opt.value} onClick={() => updateSelection(item.id, opt.value)} className={`p-2 rounded-lg border text-left text-xs transition-all ${sel ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-600 hover:border-slate-500'}`}>
                                            <p className={sel ? 'text-white font-medium' : 'text-slate-300'}>{opt.label}</p>
                                            <div className="flex gap-2 mt-1 text-[10px]">
                                              {opt.insurance !== 0 && <span className={opt.insurance < 0 ? 'text-emerald-400' : 'text-red-400'}>{opt.insurance > 0 ? '+' : ''}{fmt(Math.abs(opt.insurance))}</span>}
                                              {opt.equity !== 0 && <span className={opt.equity > 0 ? 'text-emerald-400' : 'text-red-400'}>{opt.equity > 0 ? '+' : ''}{fmt(Math.abs(opt.equity))}</span>}
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Sections (only when unlocked) */}
        {town && isUnlocked && (
          <div className="space-y-4">
            {actions.length > 0 && (
              <Section id="actions" icon={Target} title="Top Improvements" badge={actions.length}>
                <div className="space-y-2 mt-3">
                  {actions.map((a, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900/50 flex items-center justify-between">
                      <div><p className="text-white text-sm">{a.txt}</p><p className="text-xs text-slate-500">{a.cat}</p></div>
                      <div className="text-right text-xs">
                        {a.ins && <p className={a.ins < 0 ? 'text-emerald-400' : 'text-red-400'}>{a.ins > 0 ? '+' : ''}{fmt(Math.abs(a.ins))}/yr</p>}
                        {a.eq && <p className={a.eq > 0 ? 'text-emerald-400' : 'text-red-400'}>{a.eq > 0 ? '+' : ''}{fmt(Math.abs(a.eq))}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section id="programs" icon={Landmark} title="Programs & Grants" badge={PROGRAMS.length}>
              <div className="space-y-2 mt-3">
                {PROGRAMS.map(p => (
                  <button key={p.id} onClick={() => setModal(p)} className="w-full p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 text-left flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${p.status === 'always' ? 'bg-cyan-500/20 text-cyan-400' : p.status === 'auto' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{p.status === 'always' ? 'NFIP' : p.status.toUpperCase()}</span>
                        <span className="text-xs text-slate-500">{p.agency}</span>
                      </div>
                      <p className="text-white font-medium">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.funding}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                ))}
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mt-3">
                  <p className="text-cyan-400 font-medium text-sm">💡 Don't Miss ICC!</p>
                  <p className="text-xs text-slate-300">$30K hidden in NFIP. File SEPARATELY from flood claim!</p>
                </div>
              </div>
            </Section>

            <Section id="history" icon={History} title="Flood History" badge={cty ? `${cty.d} disasters` : ''}>
              <div className="space-y-3 mt-3">
                {cty && (
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-cyan-400 font-medium mb-2">{town.county} County</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-slate-500">Policies:</span> <span className="text-white">{cty.p.toLocaleString()}</span></div>
                      <div><span className="text-slate-500">Claims:</span> <span className="text-white">{cty.c}</span></div>
                      <div><span className="text-slate-500">Rep. Loss:</span> <span className="text-white">{cty.r.toLocaleString()}</span></div>
                      <div><span className="text-slate-500">CRS:</span> <span className="text-emerald-400">{cty.crs}</span></div>
                    </div>
                  </div>
                )}
                {DISASTERS.map(d => {
                  const aff = d.counties.includes('All') || d.counties.includes(town?.county);
                  return (
                    <div key={d.id} className={`p-3 rounded-lg border ${aff ? 'border-red-500/30 bg-red-500/5' : 'border-slate-700 bg-slate-900/30'}`}>
                      <p className="text-white font-medium">{d.name} {aff && <span className="text-xs bg-red-500/20 text-red-400 px-1 rounded">Affected</span>}</p>
                      <p className="text-xs text-slate-400">{d.date} • {d.loss}</p>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section id="compliance" icon={Scale} title="Compliance">
              <div className="space-y-3 mt-3">
                <div className={`p-4 rounded-lg border ${legacy < 90 ? 'border-red-500/50 bg-red-500/10' : 'border-amber-500/50 bg-amber-500/10'}`}>
                  <div className="flex justify-between">
                    <div><p className="text-white font-medium">Legacy Window</p><p className="text-xs text-slate-400">Complete under old rules</p></div>
                    <div className="text-right"><p className={`text-2xl font-bold ${legacy < 90 ? 'text-red-400' : 'text-amber-400'}`}>{legacy}</p><p className="text-xs text-slate-500">days</p></div>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-white font-medium">50% Rule</p>
                  <p className="text-sm text-slate-400">Improvements ≥50% of value = full compliance (elevation to BFE+4).</p>
                </div>
                {town?.zone?.startsWith('V') && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-medium">⚠️ VE Zone</p>
                    <ul className="text-sm text-slate-300 mt-2"><li>• Open foundation required</li><li>• Breakaway walls below BFE</li></ul>
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

        <p className="text-center text-xs text-slate-600 py-6">Educational info only. Consult professionals.</p>
      </main>

      {/* EMAIL MODAL */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEmailModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-800 border border-slate-600 rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Unlock Your Assessment</h3>
                <p className="text-slate-400 text-sm">Get personalized recommendations for your {town?.name || 'shore'} home</p>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none" required />
                  </div>
                  {emailError && <p className="text-red-400 text-sm mt-2">{emailError}</p>}
                </div>
                
                <button type="submit" disabled={emailSubmitting} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50">
                  {emailSubmitting ? 'Unlocking...' : 'Unlock Free Assessment'}
                </button>
              </form>
              
              <div className="mt-6 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center mb-3">What you'll get:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-emerald-400" />All 5 categories</div>
                  <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-emerald-400" />Real-time score</div>
                  <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-emerald-400" />PDF report</div>
                  <div className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-emerald-400" />Programs & grants</div>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 text-center mt-4">No spam. Just flood protection tips.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Program Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className="bg-slate-800 border border-slate-600 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between">
                <div><span className={`px-2 py-0.5 text-xs rounded ${modal.status === 'always' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{modal.status === 'always' ? 'NFIP' : modal.status.toUpperCase()}</span><h3 className="text-xl font-bold text-white mt-1">{modal.name}</h3></div>
                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">{modal.desc}</p>
                {modal.elig && <div><h4 className="text-cyan-400 font-medium mb-2">Eligibility</h4><ul>{modal.elig.map((e, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-emerald-400 mt-0.5" />{e}</li>)}</ul></div>}
                <div className="grid grid-cols-2 gap-4"><div className="bg-slate-900/50 rounded-lg p-3"><p className="text-xs text-slate-500">Funding</p><p className="text-sm text-white">{modal.funding}</p></div>{modal.timeline && <div className="bg-slate-900/50 rounded-lg p-3"><p className="text-xs text-slate-500">Timeline</p><p className="text-sm text-white">{modal.timeline}</p></div>}</div>
                {modal.tips?.length > 0 && <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3"><h4 className="text-amber-400 font-medium mb-2">💡 Tips</h4><ul>{modal.tips.map((t, i) => <li key={i} className="text-sm text-slate-300">• {t}</li>)}</ul></div>}
                {modal.apply && <div><h4 className="text-cyan-400 font-medium mb-2">How to Apply</h4><p className="text-sm text-slate-300">{modal.apply}</p></div>}
                <div className="flex gap-3">{modal.link && <a href={modal.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-900 font-medium rounded-lg"><Globe className="w-4 h-4" />Website</a>}{modal.phone && <a href={`tel:${modal.phone}`} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg"><Phone className="w-4 h-4" />{modal.phone}</a>}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Popups */}
      <AnimatePresence>
        {info && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setInfo(null)}>
            <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className="bg-slate-800 border border-slate-600 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between mb-4"><h3 className="font-bold text-white">{CATEGORIES.flatMap(c => c.items).find(i => i.id === info)?.name || info}</h3><button onClick={() => setInfo(null)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <p className="text-slate-300 text-sm">{CATEGORIES.flatMap(c => c.items).find(i => i.id === info)?.help}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Download Button (floating, only when unlocked) */}
      {isUnlocked && town && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => generatePDFReport(town, selections, score, totalIns, totalEq, catScores, actions)} className="fixed bottom-6 right-6 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-lg flex items-center gap-2 z-30">
          <Download className="w-5 h-5" />
          Download PDF
        </motion.button>
      )}
    </div>
  );
}
