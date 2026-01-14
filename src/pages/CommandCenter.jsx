import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Shield, Scale, ChevronDown, ChevronRight, Check, DollarSign, TrendingUp, MapPin, HelpCircle, X, Target, History, Phone, Globe, Landmark, Wind, Droplets, Zap, Cpu, Lock, Mail, Download, Info, AlertTriangle } from 'lucide-react';

// ============================================================================
// EDUCATIONAL CONTENT - Help text for everything
// ============================================================================
const HELP = {
  // Property stats
  zone: { title: 'Flood Zone', content: 'FEMA assigns flood zones based on risk. VE zones have the highest risk (coastal waves). AE zones have high risk (still water flooding). X zones have minimal risk. Your zone determines insurance requirements and building codes.' },
  bfe: { title: 'Base Flood Elevation (BFE)', content: 'The height floodwaters are expected to reach during a "100-year flood" (1% annual chance). This is measured in feet above sea level. Your home\'s elevation relative to BFE is the #1 factor in flood insurance cost.' },
  cafe: { title: 'Coastal A-Zone Flood Elevation (CAFE)', content: 'New Jersey\'s 2026 REAL rules require new construction and substantial improvements to be built to BFE + 4 feet. This "freeboard" provides extra protection as sea levels rise and storms intensify.' },
  legacy: { title: 'Legacy Window', content: 'Work permitted BEFORE January 2026 can be completed under OLD rules if finished by July 15, 2026. After that deadline, ALL work must meet the new +4ft elevation requirements. This is your window to complete projects affordably.' },
  score: { title: 'Resilience Score', content: 'Your score (0-100) measures how well-protected your home is against flood and wind damage. Higher scores = lower insurance costs, higher property value, and better protection. Based on your home\'s features and compliance.' },
  insurance: { title: 'Insurance Impact', content: 'Estimated annual change to your flood insurance premium based on your home\'s protection features. Negative numbers (green) = savings. Positive numbers (red) = higher costs. These are estimates - actual rates vary.' },
  equity: { title: 'Property Value Impact', content: 'Estimated change to your home\'s market value based on resilience features. Flood-protected homes sell for more and faster. Buyers increasingly check flood history before purchasing.' },
  
  // Categories
  wind: { title: 'Wind Defense', content: 'Protection against hurricane-force winds. The NJ shore regularly sees 100+ mph gusts during storms. Proper roof systems, impact windows, and reinforced garage doors prevent catastrophic damage.' },
  flood: { title: 'Flood Armor', content: 'Protection against flooding - the #1 cause of property damage at the shore. Elevation, flood vents, and proper foundation design can reduce flood damage by 90% and cut insurance costs dramatically.' },
  systems: { title: 'Vital Systems', content: 'Your home\'s mechanical and electrical systems (HVAC, electrical panel, water heater). When these flood, replacement costs $15,000-50,000+. Elevating them above flood level prevents total loss.' },
  tech: { title: 'Smart Defense', content: 'Technology that detects and prevents water damage. Smart shutoffs can stop a burst pipe in seconds. Leak sensors provide early warning. These qualify for insurance discounts at many carriers.' },
  legal: { title: 'Legal Shield', content: 'Documentation and insurance that protects you financially and legally. Proper flood insurance is often REQUIRED by mortgage lenders. Permit tracking prevents surprise compliance costs.' },
  
  // Checklist items
  roofType: { title: 'Roof Shingle Type', content: '3-Tab shingles are basic (60-80 mph rating). Architectural shingles are thicker with 110-130 mph rating - these are now standard for shore homes. Standing seam metal roofs offer the best protection (140+ mph) and last 50+ years.' },
  roofAge: { title: 'Roof Age', content: 'Roofs over 15 years old face "Actual Cash Value" (ACV) penalties from insurers. Instead of paying replacement cost, they pay depreciated value - often 40-60% less. A 20-year roof might only get $15K on a $35K claim.' },
  roofDeck: { title: 'Sealed Roof Deck', content: 'A peel-and-stick membrane installed UNDER your shingles. If wind rips off shingles, this barrier keeps water out. Required for FORTIFIED certification. Costs ~$1,500 extra during re-roof but prevents $50K+ in water damage.' },
  windowProtection: { title: 'Window Protection', content: 'Standard windows shatter in 70+ mph winds, allowing wind and rain inside. Storm shutters provide removable protection. Impact glass (like car windshields) won\'t shatter. Required in VE zones for new construction.' },
  garageDoor: { title: 'Garage Door', content: 'Garage doors are the #1 failure point in hurricanes. When they blow in, wind enters and can lift off your entire roof. Wind-rated doors have reinforced tracks and bracing. Cost: $1,500-3,000 for upgrade.' },
  elevation: { title: 'Elevation vs BFE', content: 'How high is your lowest floor compared to Base Flood Elevation? Every foot ABOVE BFE can save $500-1,000/year on flood insurance. Every foot BELOW adds $1,000-2,000/year. This is the single biggest factor in your premium.' },
  elevCert: { title: 'Elevation Certificate', content: 'An official FEMA form completed by a licensed surveyor ($300-600). Documents your home\'s exact elevation. REQUIRED for accurate NFIP rating. Without one, insurers assume worst-case and charge maximum rates. Often saves $500-2,000/year.' },
  floodVents: { title: 'Engineered Flood Vents', content: 'ICC-certified vents that let water flow through enclosed areas (garage, crawl space) during floods. This equalizes pressure so walls don\'t collapse. Required for enclosed areas below BFE. Cost: $150-300 per vent, need 1 per 200 sq ft.' },
  foundation: { title: 'Foundation Type', content: 'Basements are worst for floods (fill with water, mold issues). Slab-on-grade floods but dries. Crawl spaces allow inspection and venting. Piles/stilts are best - water flows underneath. VE zones REQUIRE open foundations.' },
  backflow: { title: 'Backflow Valve', content: 'During floods, sewage can back up through your drains into your home. A backflow preventer valve ($200-500 installed) blocks this. Essential for any home in a flood zone. Some towns now require them.' },
  hvacLocation: { title: 'HVAC Location', content: 'Ground-level AC units and furnaces are destroyed by flooding ($8,000-15,000 to replace). Elevated units (on platforms or roof) survive. 2026 NJ REAL rules require new HVAC to be above BFE+4ft.' },
  electricalPanel: { title: 'Electrical Panel Location', content: 'Flooded electrical panels are dangerous (shock risk) and expensive to replace ($2,000-5,000). Panels below BFE must be relocated during substantial improvements. Elevation cost: $1,500-3,000.' },
  waterHeater: { title: 'Water Heater', content: 'Water heaters cost $1,000-2,000 to replace. Elevating on a simple platform ($100-200) keeps them above minor floods. Electric models are safer than gas after flooding.' },
  generator: { title: 'Backup Generator', content: 'Shore storms often cause multi-day power outages. Generators keep sump pumps running (preventing basement flooding), preserve food, and maintain heating/cooling. Battery backup systems can also provide "island mode" power.' },
  waterShutoff: { title: 'Smart Water Shutoff', content: 'Automatically shuts off water when leaks are detected. Can prevent $10,000+ in water damage from burst pipes. Some insurers offer 5-10% discounts for these systems. Cost: $200-500 for DIY, $500-1,000 installed.' },
  leakSensors: { title: 'Leak Sensors', content: 'Small devices ($20-50 each) placed near water heaters, washing machines, under sinks. Alert your phone when water is detected. Early warning can be the difference between a wet floor and a destroyed basement.' },
  floodMonitor: { title: 'Flood Monitor', content: 'Sensors that monitor nearby water levels (streams, bays, storm drains). Provide early warning to evacuate or move valuables. Some connect to USGS gauges and send alerts when water rises.' },
  floodInsurance: { title: 'Flood Insurance Type', content: 'NFIP (federal) includes ICC coverage ($30K for compliance) and is accepted everywhere. Private flood may be 20-40% cheaper but verify ICC coverage. Many shore homeowners carry NFIP + private excess for full protection.' },
  permitHistory: { title: 'Permit Tracking', content: 'The "50% Rule": if cumulative improvements exceed 50% of home value, you must bring entire home up to current code (including elevation). Towns track this. Surprise threshold crossings have forced $100K+ elevation projects.' },
  
  // Programs
  icc: { title: 'ICC Coverage', content: 'Increased Cost of Compliance - a HIDDEN benefit in every NFIP policy! Pays up to $30,000 toward elevation or floodproofing after substantial damage. Must file SEPARATELY from your flood claim within 60 days. Only 7% of eligible homeowners use this!' },
  blueAcres: { title: 'Blue Acres', content: 'NJ\'s voluntary buyout program. State purchases flood-prone homes at pre-flood fair market value. Land becomes permanent open space. Over 700 families have used this since Sandy. Good option for repetitive loss properties.' },
  hmgp: { title: 'HMGP Grants', content: 'Hazard Mitigation Grant Program - federal money for elevation projects after declared disasters. Pays 75-90% of costs. NJ gets enhanced 90% federal share. Waitlists can be 1-3 years but worth applying.' },
  crs: { title: 'CRS Discount', content: 'Community Rating System - NFIP premium discounts for communities that exceed minimum standards. Most NJ shore towns earn 15-25% discounts. This is AUTOMATIC if you have NFIP insurance - verify with your agent.' },
};

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
      ]},
      { id: 'roofAge', name: 'Roof Age', type: 'select', options: [
        { value: 'new', label: '0-5 years', points: 20, insurance: -200, equity: 8000 },
        { value: 'mid', label: '6-15 years', points: 10, insurance: 0, equity: 0 },
        { value: 'old', label: '15+ years', points: -10, insurance: 500, equity: -10000 },
      ]},
      { id: 'roofDeck', name: 'Sealed Roof Deck', type: 'toggle', points: 15, insurance: -150, equity: 4000 },
      { id: 'windowProtection', name: 'Window Protection', type: 'select', options: [
        { value: 'none', label: 'Standard Windows', points: 0, insurance: 0, equity: 0 },
        { value: 'shutters', label: 'Storm Shutters', points: 10, insurance: -100, equity: 3000 },
        { value: 'impact', label: 'Impact Glass', points: 20, insurance: -250, equity: 10000 },
      ]},
      { id: 'garageDoor', name: 'Wind-Rated Garage Door', type: 'toggle', points: 10, insurance: -75, equity: 2500 },
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
      ]},
      { id: 'elevCert', name: 'Elevation Certificate', type: 'toggle', points: 10, insurance: -300, equity: 2000 },
      { id: 'floodVents', name: 'Engineered Flood Vents', type: 'toggle', points: 10, insurance: -200, equity: 3000 },
      { id: 'foundation', name: 'Foundation Type', type: 'select', options: [
        { value: 'basement', label: 'Basement', points: -15, insurance: 800, equity: -15000 },
        { value: 'slab', label: 'Slab on Grade', points: 0, insurance: 200, equity: 0 },
        { value: 'crawl', label: 'Crawl Space', points: 5, insurance: 0, equity: 2000 },
        { value: 'piles', label: 'Piles/Stilts', points: 20, insurance: -500, equity: 15000 },
      ]},
      { id: 'backflow', name: 'Sewer Backflow Valve', type: 'toggle', points: 5, insurance: -50, equity: 1000 },
    ]
  },
  {
    id: 'systems', name: 'Vital Systems', subtitle: 'Mechanical & electrical', icon: Zap, color: 'amber',
    items: [
      { id: 'hvacLocation', name: 'HVAC Location', type: 'select', options: [
        { value: 'ground', label: 'Ground Level', points: -10, insurance: 300, equity: -5000 },
        { value: 'elevated', label: 'Above BFE', points: 15, insurance: -200, equity: 8000 },
        { value: 'roof', label: 'Roof Mounted', points: 20, insurance: -300, equity: 10000 },
      ]},
      { id: 'electricalPanel', name: 'Electrical Panel', type: 'select', options: [
        { value: 'below', label: 'Below BFE', points: -10, insurance: 200, equity: -3000 },
        { value: 'above', label: 'Above BFE', points: 10, insurance: -100, equity: 3000 },
      ]},
      { id: 'waterHeater', name: 'Water Heater Elevated', type: 'toggle', points: 5, insurance: -50, equity: 1000 },
      { id: 'generator', name: 'Backup Generator', type: 'toggle', points: 10, insurance: -50, equity: 5000 },
    ]
  },
  {
    id: 'tech', name: 'Smart Defense', subtitle: 'Technology', icon: Cpu, color: 'purple',
    items: [
      { id: 'waterShutoff', name: 'Smart Water Shutoff', type: 'toggle', points: 8, insurance: -100, equity: 2000 },
      { id: 'leakSensors', name: 'Leak Sensors', type: 'toggle', points: 5, insurance: -50, equity: 500 },
      { id: 'floodMonitor', name: 'Flood Monitor', type: 'toggle', points: 5, insurance: 0, equity: 500 },
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
      ]},
      { id: 'permitHistory', name: 'Permits Tracked', type: 'toggle', points: 5, insurance: 0, equity: 1000 },
    ]
  },
];

// ============================================================================
// PROGRAMS DATA
// ============================================================================
const PROGRAMS = [
  { id: 'icc', name: 'ICC Coverage ($30K)', agency: 'NFIP', desc: 'Hidden $30K for compliance after substantial damage!', elig: ['NFIP policy', 'Substantial damage (≥50%)'], funding: 'Up to $30,000', timeline: 'File within 60 days', apply: 'File SEPARATELY from flood claim!', link: 'https://www.fema.gov/floodplain-management/financial-help/increased-cost-compliance', tips: ['SEPARATE from flood claim!', 'Only 7% use it!', 'Get 50% advance', 'Combine with HMGP'], status: 'always' },
  { id: 'blue-acres', name: 'Blue Acres Buyout', agency: 'NJ DEP', desc: 'Voluntary buyout at pre-flood value.', elig: ['Flood-prone area', 'Municipality support'], funding: 'Pre-flood fair market value', timeline: '6-12 months', apply: 'dep.nj.gov/blueacres', link: 'https://dep.nj.gov/blueacres', phone: '(609) 940-4140', tips: ['700+ homes since Sandy'], status: 'accepting' },
  { id: 'hmgp', name: 'HMGP Grants', agency: 'FEMA/NJ OEM', desc: 'Post-disaster elevation grants. 78% federal.', elig: ['Disaster-declared county'], funding: '75-90% federal', timeline: '1-3 years', apply: 'NJ OEM after disaster', link: 'https://www.nj.gov/njoem/mitigation/hazard.shtml', status: 'limited' },
  { id: 'crs', name: 'CRS Discount', agency: 'NFIP', desc: 'Auto 5-45% premium discount.', elig: ['NFIP policy', 'CRS community'], funding: 'NJ: typically 15-20%', apply: 'Automatic', link: 'https://www.fema.gov/floodplain-management/community-rating-system', status: 'auto' },
];

// ============================================================================
// HISTORICAL DATA
// ============================================================================
const DISASTERS = [
  { id: 'sandy', name: 'Hurricane Sandy', date: 'Oct 2012', loss: '$30B', counties: ['All'] },
  { id: 'ida', name: 'Hurricane Ida', date: 'Sep 2021', loss: '$2B+', counties: ['Bergen', 'Essex', 'Middlesex', 'Passaic'] },
  { id: 'irene', name: 'Hurricane Irene', date: 'Aug 2011', loss: '$1B+', counties: ['All'] },
];

const COUNTY_STATS = { 
  'Ocean': { d: 9, p: 55000, c: '$1.2B', r: 3200, crs: '15%' }, 
  'Monmouth': { d: 8, p: 32000, c: '$890M', r: 1800, crs: '20%' }, 
  'Atlantic': { d: 8, p: 28000, c: '$720M', r: 1500, crs: '20%' }, 
  'Cape May': { d: 7, p: 22000, c: '$650M', r: 1200, crs: '15%' } 
};

// ============================================================================
// API ENDPOINT
// ============================================================================
const API_ENDPOINT = '/api/collect-email';

// ============================================================================
// UTILITY
// ============================================================================
const fmt = n => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${n}`;

// ============================================================================
// PDF REPORT GENERATOR
// ============================================================================
const generatePDFReport = (town, address, selections, score, totalIns, totalEq, catScores, actions) => {
  const legacy = Math.max(0, Math.ceil((new Date('2026-07-15') - new Date()) / 864e5));
  const cty = COUNTY_STATS[town.county];
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>ShoreHomeScore Report - ${address || town.name}</title>
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
    .icc { background: #164e63; border: 1px solid #22d3ee; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .icc h3 { color: #22d3ee; margin-bottom: 5px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 ShoreHomeScore Report</h1>
    <p>${address || town.name + ', NJ'}</p>
    <p style="margin-top: 4px; font-size: 12px;">${town.county} County • Zone ${town.zone} • BFE ${town.bfe}ft</p>
    <p style="margin-top: 8px; font-size: 12px;">Generated ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="score-section">
    <div class="score-box main"><div class="value">${score}</div><div class="label">Resilience Score</div></div>
    <div class="score-box ins"><div class="value">${totalIns > 0 ? '+' : ''}${fmt(Math.abs(totalIns))}</div><div class="label">Insurance/Year</div></div>
    <div class="score-box eq"><div class="value">${totalEq > 0 ? '+' : ''}${fmt(Math.abs(totalEq))}</div><div class="label">Property Value</div></div>
  </div>
  
  ${legacy < 180 ? `<div class="warning"><h3>⚠️ Legacy Window: ${legacy} Days Left</h3><p>Work permitted before Jan 2026 must finish by July 15, 2026 to use old rules. After that, new +4ft elevation requirements apply to all projects.</p></div>` : ''}
  
  <div class="icc"><h3>💡 Don't Miss Your $30,000 ICC Benefit!</h3><p>If you have NFIP flood insurance and suffer substantial damage, you're entitled to up to $30,000 in ICC funds. File this SEPARATELY from your flood claim within 60 days. Only 7% of eligible homeowners use this benefit!</p></div>
  
  <div class="section">
    <h2>📍 Property Information</h2>
    <div class="grid">
      <div class="stat"><div class="label">Flood Zone</div><div class="value">${town.zone}</div></div>
      <div class="stat"><div class="label">Base Flood Elevation</div><div class="value">${town.bfe} ft</div></div>
      <div class="stat"><div class="label">2026 CAFE Requirement</div><div class="value">${town.bfe + 4} ft</div></div>
      <div class="stat"><div class="label">Legacy Window</div><div class="value">${legacy} days</div></div>
      ${cty ? `<div class="stat"><div class="label">County CRS Discount</div><div class="value">${cty.crs}</div></div>` : ''}
      ${cty ? `<div class="stat"><div class="label">Rep. Loss Properties</div><div class="value">${cty.r.toLocaleString()}</div></div>` : ''}
    </div>
  </div>
  
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
  
  <div class="footer">
    <p>ShoreHomeScore • Educational information only • Consult licensed professionals</p>
    <p style="margin-top: 8px;">shorehomescore.com</p>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ShoreHomeScore() {
  // Address & Town state
  const [address, setAddress] = useState('');
  const [town, setTown] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [showTownFallback, setShowTownFallback] = useState(false);
  
  // Assessment state
  const [selections, setSelections] = useState({});
  const [openCats, setOpenCats] = useState({});
  const [openSections, setOpenSections] = useState({ actions: true, programs: false, history: false, compliance: false });
  
  // UI state
  const [showHelp, setShowHelp] = useState(null);
  const [modal, setModal] = useState(null);
  const [srch, setSrch] = useState('');
  const [dd, setDd] = useState(false);
  
  // Email gate state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const inputRef = useRef(null);
  const ddRef = useRef(null);

  // Check localStorage for previous unlock
  useEffect(() => {
    const savedEmail = localStorage.getItem('shorehomescore_email');
    if (savedEmail) {
      setIsUnlocked(true);
      setEmail(savedEmail);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => { 
    const h = e => ddRef.current && !ddRef.current.contains(e.target) && setDd(false); 
    document.addEventListener('mousedown', h); 
    return () => document.removeEventListener('mousedown', h); 
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey || !inputRef.current) return;
    
    if (!window.google?.maps?.places) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }
    
    function initAutocomplete() {
      if (!inputRef.current || !window.google?.maps?.places) return;
      
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'address_components'],
          types: ['address'],
        });
        
        // Bias to NJ Shore area
        const njBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(39.3, -74.5),
          new window.google.maps.LatLng(40.5, -73.9)
        );
        autocomplete.setBounds(njBounds);
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place?.formatted_address) {
            setAddress(place.formatted_address);
            handleAddressLookup(place.formatted_address, place.address_components);
          }
        });
      } catch (e) {
        console.error('Autocomplete init failed:', e);
        setShowTownFallback(true);
      }
    }
  }, []);

  // Handle address lookup
  const handleAddressLookup = async (addr, components) => {
    setAddressLoading(true);
    setAddressError('');
    
    // Extract zip and city from components OR parse from address string
    let zip = '';
    let city = '';
    
    if (components) {
      components.forEach(c => {
        if (c.types.includes('postal_code')) zip = c.short_name;
        if (c.types.includes('locality')) city = c.long_name;
      });
    }
    
    // If no components, parse from address string
    if (!zip || !city) {
      // Try to extract zip code (5 digits)
      const zipMatch = addr.match(/\b(\d{5})\b/);
      if (zipMatch) zip = zipMatch[1];
      
      // Try to match town names in the address
      const addrLower = addr.toLowerCase();
      for (const t of TOWNS) {
        if (addrLower.includes(t.name.toLowerCase())) {
          city = t.name;
          if (!zip) zip = t.zip;
          break;
        }
      }
    }
    
    // Try to match town by zip first (most reliable)
    let matchedTown = TOWNS.find(t => t.zip === zip);
    
    // If no zip match, try by city name
    if (!matchedTown && city) {
      matchedTown = TOWNS.find(t => 
        t.name.toLowerCase() === city.toLowerCase() ||
        t.name.toLowerCase().includes(city.toLowerCase()) || 
        city.toLowerCase().includes(t.name.toLowerCase())
      );
    }
    
    // If still no match, try partial match on address
    if (!matchedTown) {
      const addrLower = addr.toLowerCase();
      matchedTown = TOWNS.find(t => addrLower.includes(t.name.toLowerCase()));
    }
    
    if (matchedTown) {
      // Use our verified town data (always reliable)
      setTown(matchedTown);
      setAddressLoading(false);
    } else {
      // Address not in our coverage area - show fallback
      setAddressError('This address isn\'t in our NJ shore coverage area yet. Please select the nearest town below.');
      setShowTownFallback(true);
      setAddressLoading(false);
    }
  };

  // Manual address submit
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      handleAddressLookup(address, null);
    }
  };

  // Town dropdown filter
  const filteredTowns = useMemo(() => 
    !srch ? TOWNS : TOWNS.filter(t => 
      t.name.toLowerCase().includes(srch.toLowerCase()) || t.zip.includes(srch)
    ), [srch]);

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

  // Handle category click
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
    
    localStorage.setItem('shorehomescore_email', email);
    localStorage.setItem('shorehomescore_town', town?.name || '');
    localStorage.setItem('shorehomescore_address', address || '');
    
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, address, town: town?.name, county: town?.county, zone: town?.zone, timestamp: new Date().toISOString() }),
      });
    } catch (err) {
      console.log('NEW LEAD (API failed):', email, town?.name);
    }
    
    setIsUnlocked(true);
    setShowEmailModal(false);
    setEmailSubmitting(false);
    setOpenCats({ wind: true });
  };

  const updateSelection = (id, value) => setSelections(p => ({ ...p, [id]: value }));

  // ============================================================================
  // COMPONENTS
  // ============================================================================
  
  // Help Button with tooltip
  const HelpButton = ({ helpKey, size = 'sm' }) => (
    <button onClick={(e) => { e.stopPropagation(); setShowHelp(helpKey); }} className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-slate-500 hover:text-cyan-400 transition-colors`}>
      <HelpCircle className="w-full h-full" />
    </button>
  );

  // Section component
  const Section = ({ id, icon: I, title, badge, helpKey, children }) => (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <button onClick={() => setOpenSections(p => ({ ...p, [id]: !p[id] }))} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50">
        <div className="flex items-center gap-3">
          <I className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-white">{title}</span>
          {helpKey && <HelpButton helpKey={helpKey} />}
          {badge && <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-400">{badge}</span>}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openSections[id] ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>{openSections[id] && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="p-4 pt-0 border-t border-slate-700">{children}</div></motion.div>}</AnimatePresence>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center"><Home className="w-5 h-5 text-slate-900" /></div>
            <div><h1 className="font-bold text-white">ShoreHomeScore</h1><p className="text-xs text-slate-500">NJ Flood Protection</p></div>
          </div>
          {town && <div className="flex items-center gap-2">
            <HelpButton helpKey="score" size="md" />
            <div className="text-right">
              <p className={`text-2xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}</p>
              <p className="text-xs text-slate-500">Score</p>
            </div>
          </div>}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Address Input */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-white">Enter Your Address</h2>
            <HelpButton helpKey="zone" />
          </div>
          
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Start typing your address..."
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none text-lg"
              />
              {addressLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}
            </div>
            
            {addressError && <p className="text-amber-400 text-sm">{addressError}</p>}
            
            {!town && !showTownFallback && (
              <button type="button" onClick={() => setShowTownFallback(true)} className="text-sm text-slate-400 hover:text-cyan-400">
                Or select your town from a list →
              </button>
            )}
          </form>
          
          {/* Town Fallback Dropdown */}
          {showTownFallback && !town && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Select your town:</p>
              <div className="relative" ref={ddRef}>
                <button onClick={() => setDd(!dd)} className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl flex items-center justify-between hover:border-cyan-500/50">
                  <span className="text-slate-500">Choose town...</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 ${dd ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>{dd && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-30 overflow-hidden">
                    <div className="p-2 border-b border-slate-700"><input value={srch} onChange={e => setSrch(e.target.value)} placeholder="Search..." className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" autoFocus /></div>
                    <div className="max-h-64 overflow-y-auto">{filteredTowns.map(t => (
                      <button key={t.zip} onClick={() => { setTown(t); setDd(false); setSrch(''); setAddress(`${t.name}, NJ ${t.zip}`); }} className="w-full px-4 py-3 text-left hover:bg-slate-700 flex justify-between">
                        <div><p className="text-white font-medium">{t.name}</p><p className="text-xs text-slate-400">{t.county} • {t.zip}</p></div>
                        <div className="text-right"><p className={`text-xs font-medium ${t.zone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>{t.zone}</p><p className="text-xs text-slate-500">BFE: {t.bfe}ft</p></div>
                      </button>
                    ))}</div>
                  </motion.div>
                )}</AnimatePresence>
              </div>
            </div>
          )}
          
          {/* Town Stats */}
          {town && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Property flood data:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={() => setShowHelp('zone')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900 group">
                  <p className={`text-xl font-bold ${town.zone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>{town.zone}</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">Zone <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-100" /></p>
                </button>
                <button onClick={() => setShowHelp('bfe')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900 group">
                  <p className="text-xl font-bold text-white">{town.bfe}ft</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">BFE <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-100" /></p>
                </button>
                <button onClick={() => setShowHelp('cafe')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900 group">
                  <p className="text-xl font-bold text-cyan-400">{town.bfe + 4}ft</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">CAFE <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-100" /></p>
                </button>
                <button onClick={() => setShowHelp('legacy')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900 group">
                  <p className={`text-xl font-bold ${legacy < 90 ? 'text-red-400' : 'text-amber-400'}`}>{legacy}</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">Days <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-100" /></p>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Score Overview */}
        {town && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Resilience Score</h2>
                <HelpButton helpKey="score" />
              </div>
              <div className={`text-5xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowHelp('insurance')} className="bg-slate-900/50 rounded-lg p-3 text-left hover:bg-slate-900 group">
                <p className="text-sm text-slate-400 mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4" /> Insurance <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-100" /></p>
                <p className={`text-xl font-bold ${totalIns > 0 ? 'text-red-400' : totalIns < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>{totalIns > 0 ? '+' : ''}{fmt(Math.abs(totalIns))}/yr</p>
              </button>
              <button onClick={() => setShowHelp('equity')} className="bg-slate-900/50 rounded-lg p-3 text-left hover:bg-slate-900 group">
                <p className="text-sm text-slate-400 mb-1 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Value <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-100" /></p>
                <p className={`text-xl font-bold ${totalEq > 0 ? 'text-emerald-400' : totalEq < 0 ? 'text-red-400' : 'text-slate-400'}`}>{totalEq > 0 ? '+' : ''}{fmt(Math.abs(totalEq))}</p>
              </button>
            </div>
          </div>
        )}

        {/* Unlock Banner */}
        {town && !isUnlocked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">🔓 Unlock Your Full Assessment</h3>
                <p className="text-sm text-slate-300">Enter your email to customize your score and download your PDF report.</p>
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
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{cat.name}</p>
                          <HelpButton helpKey={cat.id} />
                        </div>
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
                      {isUnlocked ? <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openCats[cat.id] ? 'rotate-180' : ''}`} /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openCats[cat.id] && isUnlocked && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 border-t border-slate-700 space-y-3">
                          {cat.items.map(item => (
                            <div key={item.id} className="bg-slate-900/50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-white font-medium">{item.name}</p>
                                <HelpButton helpKey={item.id} />
                              </div>
                              
                              {item.type === 'toggle' ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-3 text-xs">
                                    {item.insurance && <span className={item.insurance < 0 ? 'text-emerald-400' : 'text-red-400'}>{item.insurance > 0 ? '+' : ''}{fmt(Math.abs(item.insurance))}/yr</span>}
                                    {item.equity && <span className={item.equity > 0 ? 'text-emerald-400' : 'text-red-400'}>{item.equity > 0 ? '+' : ''}{fmt(Math.abs(item.equity))}</span>}
                                  </div>
                                  <button onClick={() => updateSelection(item.id, !selections[item.id])} className={`w-12 h-6 rounded-full transition-colors ${selections[item.id] ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${selections[item.id] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                  </button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

        {/* Results Sections (unlocked only) */}
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
                  <button onClick={() => setShowHelp('icc')} className="text-xs text-cyan-400 mt-1 flex items-center gap-1">Learn more <HelpCircle className="w-3 h-3" /></button>
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
                      <div className="flex items-center gap-1"><span className="text-slate-500">CRS:</span> <span className="text-emerald-400">{cty.crs}</span> <HelpButton helpKey="crs" /></div>
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

            <Section id="compliance" icon={Scale} title="Compliance" helpKey="legal">
              <div className="space-y-3 mt-3">
                <div className={`p-4 rounded-lg border ${legacy < 90 ? 'border-red-500/50 bg-red-500/10' : 'border-amber-500/50 bg-amber-500/10'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2"><p className="text-white font-medium">Legacy Window</p><HelpButton helpKey="legacy" /></div>
                      <p className="text-xs text-slate-400">Complete under old rules</p>
                    </div>
                    <div className="text-right"><p className={`text-2xl font-bold ${legacy < 90 ? 'text-red-400' : 'text-amber-400'}`}>{legacy}</p><p className="text-xs text-slate-500">days</p></div>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1"><p className="text-white font-medium">50% Rule</p><HelpButton helpKey="permitHistory" /></div>
                  <p className="text-sm text-slate-400">Improvements ≥50% of value = full compliance (elevation to BFE+4).</p>
                </div>
                {town?.zone?.startsWith('V') && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-medium">⚠️ VE Zone Requirements</p>
                    <ul className="text-sm text-slate-300 mt-2"><li>• Open foundation (piles) required</li><li>• Breakaway walls below BFE</li><li>• Impact windows required</li></ul>
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

        <p className="text-center text-xs text-slate-600 py-6">Educational information only. Consult licensed professionals for specific advice.</p>
      </main>

      {/* HELP MODAL */}
      <AnimatePresence>
        {showHelp && HELP[showHelp] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-800 border border-slate-600 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center"><Info className="w-5 h-5 text-cyan-400" /></div>
                  <h3 className="text-lg font-bold text-white">{HELP[showHelp].title}</h3>
                </div>
                <button onClick={() => setShowHelp(null)} className="p-1 hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <p className="text-slate-300 leading-relaxed">{HELP[showHelp].content}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMAIL MODAL */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEmailModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-800 border border-slate-600 rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Shield className="w-8 h-8 text-slate-900" /></div>
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

      {/* PROGRAM MODAL */}
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
                {modal.tips?.length > 0 && <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3"><h4 className="text-amber-400 font-medium mb-2">💡 Pro Tips</h4><ul>{modal.tips.map((t, i) => <li key={i} className="text-sm text-slate-300">• {t}</li>)}</ul></div>}
                {modal.apply && <div><h4 className="text-cyan-400 font-medium mb-2">How to Apply</h4><p className="text-sm text-slate-300">{modal.apply}</p></div>}
                <div className="flex gap-3">{modal.link && <a href={modal.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-900 font-medium rounded-lg"><Globe className="w-4 h-4" />Website</a>}{modal.phone && <a href={`tel:${modal.phone}`} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg"><Phone className="w-4 h-4" />{modal.phone}</a>}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Download Button */}
      {isUnlocked && town && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => generatePDFReport(town, address, selections, score, totalIns, totalEq, catScores, actions)} className="fixed bottom-6 right-6 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-lg flex items-center gap-2 z-30">
          <Download className="w-5 h-5" />
          Download PDF
        </motion.button>
      )}
    </div>
  );
}
