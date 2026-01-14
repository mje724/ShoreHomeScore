import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Shield, Scale, ChevronDown, ChevronRight, Check, DollarSign, TrendingUp, MapPin, Search, HelpCircle, X, Target, CheckCircle, History, Phone, Globe, Landmark } from 'lucide-react';

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
  { name: 'Pt Pleasant Beach', county: 'Ocean', zip: '08742', zone: 'AE', bfe: 9 },
  { name: 'Sea Bright', county: 'Monmouth', zip: '07760', zone: 'VE', bfe: 12 },
  { name: 'Sea Isle City', county: 'Cape May', zip: '08243', zone: 'VE', bfe: 10 },
  { name: 'Seaside Heights', county: 'Ocean', zip: '08751', zone: 'AE', bfe: 9 },
  { name: 'Ship Bottom', county: 'Ocean', zip: '08008', zone: 'VE', bfe: 10 },
  { name: 'Stone Harbor', county: 'Cape May', zip: '08247', zone: 'VE', bfe: 10 },
  { name: 'Toms River', county: 'Ocean', zip: '08753', zone: 'AE', bfe: 8 },
  { name: 'Wildwood', county: 'Cape May', zip: '08260', zone: 'VE', bfe: 9 },
];

const PROGRAMS = [
  { id: 'blue-acres', name: 'Blue Acres Buyout', agency: 'NJ DEP', desc: 'Voluntary buyout at pre-flood value. Land becomes open space.', elig: ['Flood-prone area', 'Municipality support', 'Voluntary'], funding: 'Pre-flood fair market value', timeline: '6-12 months', apply: 'dep.nj.gov/blueacres or (609) 940-4140', link: 'https://dep.nj.gov/blueacres', phone: '(609) 940-4140', tips: ['Use pre-flood photos', 'Can appeal offer', '700+ homes since Sandy'], tags: ['repetitive-loss', 've-zone'], status: 'accepting' },
  { id: 'swift', name: 'FMA Swift Current', agency: 'FEMA', desc: 'Fast-track mitigation for NFIP-insured repetitive loss properties.', elig: ['Active NFIP policy', 'Repetitive/substantial damage'], funding: 'Up to 100% for severe repetitive loss', timeline: 'Expedited', apply: 'Local floodplain administrator', link: 'https://www.fema.gov/grants/mitigation/floods', tips: ['Created after Ida'], tags: ['nfip-insured', 'repetitive-loss'], status: 'accepting' },
  { id: 'hmgp', name: 'HMGP Grants', agency: 'FEMA/NJ OEM', desc: 'Post-disaster elevation grants. NJ gets 78% federal share.', elig: ['Disaster-declared county', 'Cost-effective'], funding: '75-90% federal', timeline: '1-3 years', apply: 'NJ OEM after disaster', link: 'https://www.nj.gov/njoem/mitigation/hazard.shtml', tags: ['disaster-declared'], status: 'limited' },
  { id: 'icc', name: 'ICC Coverage ($30K)', agency: 'NFIP', desc: 'Hidden benefit in NFIP policies! Up to $30K for compliance after substantial damage.', elig: ['NFIP policy', 'Substantial damage (≥50%)', 'OR repetitive loss'], funding: 'Up to $30,000', timeline: 'File within 60 days', apply: 'File SEPARATELY from flood claim!', link: 'https://www.fema.gov/floodplain-management/financial-help/increased-cost-compliance', tips: ['SEPARATE from flood claim!', 'Only 7% use it - dont miss out!', 'Get 50% advance ($15K)', 'Combine with HMGP'], tags: ['nfip-insured', 'substantial-damage'], status: 'always' },
  { id: 'crs', name: 'CRS Discount', agency: 'NFIP', desc: 'Automatic 5-45% premium discount in participating communities.', elig: ['NFIP policy', 'CRS community'], funding: 'NJ: typically 15-20%', apply: 'Automatic - verify with agent', link: 'https://www.fema.gov/floodplain-management/community-rating-system', tags: ['nfip-insured'], status: 'auto' },
];

const DISASTERS = [
  { id: 'sandy', name: 'Hurricane Sandy', date: 'Oct 2012', decl: 'DR-4086', desc: '9ft surge, $30B damage, 365K homes.', deaths: 37, loss: '$30B', surge: '8.9ft', counties: ['All 21'] },
  { id: 'ida', name: 'Hurricane Ida', date: 'Sep 2021', decl: 'DR-4614', desc: '10+ inches rain, catastrophic inland flooding.', deaths: 30, loss: '$2B+', rain: '10.5in', counties: ['Bergen', 'Essex', 'Middlesex', 'Morris', 'Passaic', 'Union'] },
  { id: 'irene', name: 'Hurricane Irene', date: 'Aug 2011', decl: 'DR-4021', desc: 'First NJ landfall since 1903.', deaths: 5, loss: '$1B+', counties: ['All 21'] },
];

const COUNTY = { 'Ocean': { d: 9, p: 55000, c: '$1.2B', r: 3200, crs: '15%' }, 'Monmouth': { d: 8, p: 32000, c: '$890M', r: 1800, crs: '20%' }, 'Atlantic': { d: 8, p: 28000, c: '$720M', r: 1500, crs: '20%' }, 'Cape May': { d: 7, p: 22000, c: '$650M', r: 1200, crs: '15%' } };

const QS = [
  { id: 'elev', q: 'Lowest floor vs BFE?', help: 'Elevation Certificate confirms this.', opts: [{ v: 'above', l: 'Above', e: '✓' }, { v: 'at', l: 'At BFE', e: '~' }, { v: 'below', l: 'Below', e: '⚠' }, { v: 'unk', l: 'Unknown', e: '?' }], fx: { above: { s: 20, i: -800, eq: 15000, t: 'pos' }, at: { s: 10, i: -200, eq: 5000, t: 'neu' }, below: { s: -10, i: 1200, eq: -20000, t: 'neg', act: { txt: 'Get Elevation Cert + explore elevation', p: 'high' } }, unk: { s: 0, i: 0, eq: 0, t: 'warn', act: { txt: 'Get Elevation Certificate ($300-600)', p: 'high' } } } },
  { id: 'vents', q: 'Flood vents installed?', help: 'Allow water through to reduce pressure.', opts: [{ v: 'eng', l: 'Engineered', e: '✓' }, { v: 'std', l: 'Standard', e: '~' }, { v: 'none', l: 'None', e: '✗' }, { v: 'elev', l: 'Fully elevated', e: '✓' }], fx: { eng: { s: 15, i: -400, eq: 8000, t: 'pos' }, std: { s: 10, i: -200, eq: 4000, t: 'neu' }, none: { s: -5, i: 400, eq: -5000, t: 'neg', act: { txt: 'Install flood vents ($200-500 each)', p: 'med' } }, elev: { s: 15, i: -400, eq: 10000, t: 'pos' } } },
  { id: 'cert', q: 'Have Elevation Certificate?', help: 'Official surveyor document.', opts: [{ v: 'good', l: 'Yes, above BFE', e: '✓' }, { v: 'bad', l: 'Yes, at/below', e: '~' }, { v: 'no', l: 'No', e: '✗' }], fx: { good: { s: 15, i: -600, eq: 5000, t: 'pos' }, bad: { s: 5, i: 0, eq: 0, t: 'neu', act: { txt: 'Consider elevation', p: 'med' } }, no: { s: -5, i: 300, eq: -2000, t: 'warn', act: { txt: 'Get Elevation Cert - may cut premium!', p: 'high' } } } },
  { id: 'hist', q: 'Property flood history?', help: '2+ floods = repetitive loss.', opts: [{ v: 'never', l: 'Never', e: '✓' }, { v: 'once', l: 'Once', e: '~' }, { v: 'mult', l: '2+ times', e: '⚠' }, { v: 'unk', l: 'Unknown', e: '?' }], fx: { never: { s: 10, i: -200, eq: 5000, t: 'pos' }, once: { s: 0, i: 200, eq: -5000, t: 'neu' }, mult: { s: -15, i: 800, eq: -15000, t: 'neg', act: { txt: 'Qualify for Blue Acres, Swift Current, ICC!', p: 'high' } }, unk: { s: 0, i: 0, eq: 0, t: 'warn', act: { txt: 'Check flood history', p: 'med' } } } },
  { id: 'ins', q: 'Flood insurance type?', help: 'NFIP includes ICC coverage.', opts: [{ v: 'nfip', l: 'NFIP', e: '🏛' }, { v: 'priv', l: 'Private', e: '🏢' }, { v: 'both', l: 'Both', e: '✓' }, { v: 'none', l: 'None', e: '⚠' }], fx: { nfip: { s: 10, i: 0, eq: 0, t: 'pos', act: { txt: 'Compare rates but keep ICC', p: 'low' } }, priv: { s: 10, i: 0, eq: 0, t: 'pos', act: { txt: 'Verify ICC-equivalent', p: 'med' } }, both: { s: 15, i: 0, eq: 5000, t: 'pos' }, none: { s: -20, i: 2000, eq: -30000, t: 'neg', act: { txt: 'GET FLOOD INSURANCE!', p: 'crit' } } } },
];

const fmt = n => n >= 1e6 ? `\$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `\$${(n/1e3).toFixed(0)}K` : `\$${n}`;

export default function App() {
  const [town, setTown] = useState(null);
  const [ans, setAns] = useState({});
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState(null);
  const [srch, setSrch] = useState('');
  const [dd, setDd] = useState(false);
  const [secs, setSecs] = useState({ act: true, prog: true, hist: false, comp: false, tips: false });
  const [modal, setModal] = useState(null);
  const ref = useRef(null);

  useEffect(() => { const h = e => ref.current && !ref.current.contains(e.target) && setDd(false); document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);

  const towns = useMemo(() => !srch ? TOWNS : TOWNS.filter(t => t.name.toLowerCase().includes(srch.toLowerCase()) || t.zip.includes(srch)), [srch]);

  const { score, ins, eq, actions } = useMemo(() => {
    let b = 50, i = 0, e = 0, a = [];
    Object.entries(ans).forEach(([k, v]) => { const q = QS.find(x => x.id === k); if (q?.fx[v]) { const f = q.fx[v]; b += f.s; i += f.i; e += f.eq; if (f.act) a.push({ id: k, ...f.act, type: f.t }); } });
    return { score: Math.max(0, Math.min(100, b)), ins: i, eq: e, actions: a.sort((x, y) => ({ crit: 0, high: 1, med: 2, low: 3 }[x.p] || 3) - ({ crit: 0, high: 1, med: 2, low: 3 }[y.p] || 3)) };
  }, [ans]);

  const legacy = Math.max(0, Math.ceil((new Date('2026-07-15') - new Date()) / 864e5));
  const progs = useMemo(() => { const t = []; if (ans.hist === 'mult') t.push('repetitive-loss'); if (ans.elev === 'below') t.push('substantial-damage'); if (ans.ins === 'nfip') t.push('nfip-insured'); if (town?.zone?.startsWith('V')) t.push('ve-zone'); return PROGRAMS.filter(p => p.status === 'always' || p.status === 'auto' || p.tags.some(x => t.includes(x))); }, [ans, town]);
  const cty = town ? COUNTY[town.county] : null;

  const Popup = ({ title, children }) => info === title && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setInfo(null)}><motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className="bg-slate-800 border border-slate-600 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}><div className="flex justify-between mb-4"><h3 className="font-bold text-white">{title}</h3><button onClick={() => setInfo(null)}><X className="w-5 h-5 text-slate-400" /></button></div><div className="text-slate-300 text-sm">{children}</div></motion.div></motion.div>;

  const Sec = ({ id, icon: I, title, badge, children }) => <div className="bg-slate-800 rounded-xl border border-slate-700"><button onClick={() => setSecs(p => ({ ...p, [id]: !p[id] }))} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50"><div className="flex items-center gap-3"><I className="w-5 h-5 text-cyan-400" /><span className="font-bold text-white">{title}</span>{badge && <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-400">{badge}</span>}</div><ChevronDown className={`w-5 h-5 text-slate-400 ${secs[id] ? 'rotate-180' : ''}`} /></button><AnimatePresence>{secs[id] && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="p-4 pt-0 border-t border-slate-700">{children}</div></motion.div>}</AnimatePresence></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800"><div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center"><Home className="w-5 h-5 text-slate-900" /></div><div><h1 className="font-bold text-white">ShoreHomeScore</h1><p className="text-xs text-slate-500">NJ Flood Protection</p></div></div>{town && Object.keys(ans).length > 0 && <div className={`text-2xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}</div>}</div></header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Select Your Town</h2>
          <div className="relative" ref={ref}>
            <button onClick={() => setDd(!dd)} className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl flex items-center justify-between hover:border-cyan-500/50"><div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-cyan-400" /><span className={town ? 'text-white' : 'text-slate-500'}>{town ? `${town.name}, NJ` : 'Choose...'}</span></div><ChevronDown className={`w-5 h-5 text-slate-400 ${dd ? 'rotate-180' : ''}`} /></button>
            <AnimatePresence>{dd && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-30 overflow-hidden">
              <div className="p-2 border-b border-slate-700"><input value={srch} onChange={e => setSrch(e.target.value)} placeholder="Search..." className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" autoFocus /></div>
              <div className="max-h-64 overflow-y-auto">{towns.map(t => <button key={t.zip} onClick={() => { setTown(t); setDd(false); setSrch(''); }} className="w-full px-4 py-3 text-left hover:bg-slate-700 flex justify-between"><div><p className="text-white font-medium">{t.name}</p><p className="text-xs text-slate-400">{t.county} • {t.zip}</p></div><div className="text-right"><p className={`text-xs font-medium ${t.zone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>{t.zone}</p><p className="text-xs text-slate-500">BFE: {t.bfe}ft</p></div></button>)}</div>
            </motion.div>}</AnimatePresence>
          </div>
          {town && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 grid grid-cols-4 gap-3">
            <button onClick={() => setInfo('zone')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900"><p className={`text-lg font-bold ${town.zone.startsWith('V') ? 'text-red-400' : 'text-amber-400'}`}>{town.zone}</p><p className="text-xs text-slate-500">Zone <HelpCircle className="w-3 h-3 inline" /></p></button>
            <button onClick={() => setInfo('bfe')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900"><p className="text-lg font-bold text-white">{town.bfe}ft</p><p className="text-xs text-slate-500">BFE <HelpCircle className="w-3 h-3 inline" /></p></button>
            <button onClick={() => setInfo('cafe')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900"><p className="text-lg font-bold text-cyan-400">{town.bfe + 4}ft</p><p className="text-xs text-slate-500">CAFE <HelpCircle className="w-3 h-3 inline" /></p></button>
            <button onClick={() => setInfo('legacy')} className="bg-slate-900/50 rounded-lg p-3 text-center hover:bg-slate-900"><p className={`text-lg font-bold ${legacy < 90 ? 'text-red-400' : 'text-amber-400'}`}>{legacy}</p><p className="text-xs text-slate-500">Days <HelpCircle className="w-3 h-3 inline" /></p></button>
          </motion.div>}
        </div>

        {town && <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex justify-between mb-4"><h2 className="text-lg font-bold text-white">Assessment</h2><span className="text-sm text-slate-400">{Object.keys(ans).length}/{QS.length}</span></div>
          {step < QS.length ? <div>
            <div className="flex gap-1 mb-4">{QS.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-cyan-500' : i === step ? 'bg-cyan-500/50' : 'bg-slate-700'}`} />)}</div>
            <p className="text-white font-medium mb-3">{QS[step].q} <button onClick={() => setInfo(`q${step}`)}><HelpCircle className="w-4 h-4 text-slate-400 inline" /></button></p>
            <div className="grid grid-cols-2 gap-2 mb-4">{QS[step].opts.map(o => { const sel = ans[QS[step].id] === o.v; const f = QS[step].fx[o.v]; return <button key={o.v} onClick={() => setAns(p => ({ ...p, [QS[step].id]: o.v }))} className={`p-3 rounded-xl border text-left ${sel ? (f.t === 'pos' ? 'border-emerald-500 bg-emerald-500/10' : f.t === 'neg' ? 'border-red-500 bg-red-500/10' : 'border-amber-500 bg-amber-500/10') : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'}`}><span className="text-lg mr-2">{o.e}</span><span className={sel ? 'text-white' : 'text-slate-300'}>{o.l}</span>{sel && <div className="mt-2 flex gap-2 text-xs">{f.i !== 0 && <span className={f.i > 0 ? 'text-red-400' : 'text-emerald-400'}>{f.i > 0 ? '+' : ''}{fmt(Math.abs(f.i))}/yr</span>}{f.eq !== 0 && <span className={f.eq > 0 ? 'text-emerald-400' : 'text-red-400'}>{f.eq > 0 ? '+' : ''}{fmt(Math.abs(f.eq))}</span>}</div>}</button>; })}</div>
            <div className="flex justify-between"><button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0} className="text-sm text-slate-400 disabled:opacity-50">← Back</button>{ans[QS[step].id] && step < QS.length - 1 && <button onClick={() => setStep(p => p + 1)} className="text-sm text-cyan-400">Next →</button>}{step === QS.length - 1 && ans[QS[step].id] && <button onClick={() => setStep(QS.length)} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-lg font-medium">Results</button>}</div>
          </div> : <div className="text-center py-4"><CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" /><p className="text-white">Complete!</p><button onClick={() => setStep(0)} className="text-cyan-400 text-sm mt-2">Retake</button></div>}
        </div>}

        {town && step >= QS.length && <>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6"><div className="flex justify-between"><div><h2 className="text-lg font-bold text-white">Resilience Score</h2><p className="text-sm text-slate-400">{Object.keys(ans).length} factors</p></div><div className={`text-5xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}</div></div><div className="mt-4 grid grid-cols-2 gap-4"><div className="bg-slate-900/50 rounded-lg p-3"><p className="text-sm text-slate-400 mb-1"><DollarSign className="w-4 h-4 inline" /> Insurance</p><p className={`text-xl font-bold ${ins > 0 ? 'text-red-400' : ins < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>{ins > 0 ? '+' : ''}{fmt(Math.abs(ins))}/yr</p></div><div className="bg-slate-900/50 rounded-lg p-3"><p className="text-sm text-slate-400 mb-1"><TrendingUp className="w-4 h-4 inline" /> Value</p><p className={`text-xl font-bold ${eq > 0 ? 'text-emerald-400' : eq < 0 ? 'text-red-400' : 'text-slate-400'}`}>{eq > 0 ? '+' : ''}{fmt(Math.abs(eq))}</p></div></div></div>

          {actions.length > 0 && <Sec id="act" icon={Target} title="Actions" badge={actions.length}><div className="space-y-3 mt-3">{actions.map((a, i) => <div key={i} className={`p-4 rounded-xl border ${a.p === 'crit' ? 'border-red-500/50 bg-red-500/10' : a.p === 'high' ? 'border-amber-500/50 bg-amber-500/10' : 'border-slate-600 bg-slate-900/50'}`}><div className="flex items-start gap-3"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${a.p === 'crit' ? 'bg-red-500' : a.p === 'high' ? 'bg-amber-500 text-slate-900' : 'bg-slate-600'}`}>{i + 1}</div><p className="text-white flex-1">{a.txt}</p><span className={`px-2 py-0.5 text-xs rounded ${a.p === 'crit' ? 'bg-red-500/20 text-red-400' : a.p === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{a.p}</span></div></div>)}</div></Sec>}

          <Sec id="prog" icon={Landmark} title="Programs & Grants" badge={progs.length}><div className="space-y-3 mt-3"><p className="text-sm text-slate-400">You may qualify for:</p>{progs.map(p => <button key={p.id} onClick={() => setModal(p)} className="w-full p-4 rounded-xl border border-slate-600 bg-slate-900/50 hover:border-cyan-500/50 text-left"><div className="flex justify-between"><div><div className="flex items-center gap-2 mb-1"><span className={`px-2 py-0.5 text-xs rounded ${p.status === 'always' ? 'bg-cyan-500/20 text-cyan-400' : p.status === 'auto' ? 'bg-purple-500/20 text-purple-400' : p.status === 'accepting' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{p.status === 'always' ? 'NFIP' : p.status.toUpperCase()}</span><span className="text-xs text-slate-500">{p.agency}</span></div><p className="text-white font-medium">{p.name}</p><p className="text-sm text-slate-400">{p.funding}</p></div><ChevronRight className="w-5 h-5 text-slate-400" /></div></button>)}<div className="pt-3 border-t border-slate-700"><div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3"><p className="text-cyan-400 font-medium">💡 Don't Miss ICC!</p><p className="text-xs text-slate-300">$30K hidden in your NFIP policy. File SEPARATELY from flood claim!</p></div></div></div></Sec>

          <Sec id="hist" icon={History} title="Flood History" badge={cty ? `${cty.d} disasters` : ''}><div className="space-y-4 mt-3">{cty && <div className="bg-slate-900/50 rounded-xl p-4"><h4 className="text-cyan-400 font-medium mb-3">{town.county} County</h4><div className="grid grid-cols-2 gap-3"><div><p className="text-xs text-slate-500">Policies</p><p className="text-white">{cty.p.toLocaleString()}</p></div><div><p className="text-xs text-slate-500">Claims</p><p className="text-white">{cty.c}</p></div><div><p className="text-xs text-slate-500">Rep. Loss</p><p className="text-white">{cty.r.toLocaleString()}</p></div><div><p className="text-xs text-slate-500">CRS</p><p className="text-emerald-400">{cty.crs}</p></div></div></div>}<h4 className="text-white font-medium">Major Disasters</h4><div className="space-y-2">{DISASTERS.map(d => { const aff = d.counties.includes(town?.county) || d.counties.includes('All 21'); return <div key={d.id} className={`p-3 rounded-lg border ${aff ? 'border-red-500/30 bg-red-500/5' : 'border-slate-700 bg-slate-900/30'}`}><div className="flex justify-between"><div><p className="text-white font-medium">{d.name} {aff && <span className="text-xs bg-red-500/20 text-red-400 px-1 rounded">Affected</span>}</p><p className="text-xs text-slate-400">{d.date}</p></div></div></div>; })}</div></div></Sec>

          <Sec id="comp" icon={Scale} title="Compliance"><div className="space-y-4 mt-3"><div className={`p-4 rounded-xl border ${legacy < 90 ? 'border-red-500/50 bg-red-500/10' : 'border-amber-500/50 bg-amber-500/10'}`}><div className="flex justify-between"><div><p className="text-white font-medium">Legacy Window</p><p className="text-sm text-slate-400">Complete work under old rules</p></div><div className="text-right"><p className={`text-2xl font-bold ${legacy < 90 ? 'text-red-400' : 'text-amber-400'}`}>{legacy}</p><p className="text-xs text-slate-500">days</p></div></div></div><div className="bg-slate-900/50 rounded-xl p-4"><p className="text-white font-medium mb-2">50% Rule</p><p className="text-sm text-slate-400">Improvements ≥50% of value = full compliance required.</p></div>{town?.zone?.startsWith('V') && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"><p className="text-red-400 font-medium">⚠️ VE Zone</p><ul className="text-sm text-slate-300 mt-2"><li>• Open foundation required</li><li>• Breakaway walls below BFE</li></ul></div>}</div></Sec>

          <Sec id="tips" icon={Shield} title="Insurance Tips"><div className="space-y-3 mt-3"><div className="bg-slate-900/50 rounded-lg p-4"><p className="text-cyan-400 font-medium">📋 Get Elevation Certificate</p><p className="text-sm text-slate-400">$300-600. May save $500-2000/yr.</p></div><div className="bg-slate-900/50 rounded-lg p-4"><p className="text-cyan-400 font-medium">🔄 Compare NFIP vs Private</p><p className="text-sm text-slate-400">Private may save 20-40% but verify ICC coverage.</p></div>{cty?.crs && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4"><p className="text-emerald-400">✓ {town.county} CRS: {cty.crs}</p><p className="text-sm text-slate-400">Auto discount on NFIP.</p></div>}</div></Sec>
        </>}
        <p className="text-center text-xs text-slate-600 py-6">Educational info only. Consult professionals.</p>
      </main>

      <AnimatePresence>{modal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}><motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className="bg-slate-800 border border-slate-600 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between"><div><span className={`px-2 py-0.5 text-xs rounded ${modal.status === 'always' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{modal.status === 'always' ? 'NFIP BENEFIT' : modal.status.toUpperCase()}</span><h3 className="text-xl font-bold text-white mt-1">{modal.name}</h3></div><button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400" /></button></div>
        <div className="p-4 space-y-4"><p className="text-slate-300">{modal.desc}</p>{modal.elig && <div><h4 className="text-cyan-400 font-medium mb-2">Eligibility</h4><ul>{modal.elig.map((e, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-emerald-400 mt-0.5" />{e}</li>)}</ul></div>}<div className="grid grid-cols-2 gap-4"><div className="bg-slate-900/50 rounded-lg p-3"><p className="text-xs text-slate-500">Funding</p><p className="text-sm text-white">{modal.funding}</p></div>{modal.timeline && <div className="bg-slate-900/50 rounded-lg p-3"><p className="text-xs text-slate-500">Timeline</p><p className="text-sm text-white">{modal.timeline}</p></div>}</div>{modal.tips?.length > 0 && <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3"><h4 className="text-amber-400 font-medium mb-2">💡 Tips</h4><ul>{modal.tips.map((t, i) => <li key={i} className="text-sm text-slate-300">• {t}</li>)}</ul></div>}{modal.apply && <div><h4 className="text-cyan-400 font-medium mb-2">How to Apply</h4><p className="text-sm text-slate-300">{modal.apply}</p></div>}<div className="flex gap-3">{modal.link && <a href={modal.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-900 font-medium rounded-lg"><Globe className="w-4 h-4" />Website</a>}{modal.phone && <a href={`tel:${modal.phone}`} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg"><Phone className="w-4 h-4" />{modal.phone}</a>}</div></div>
      </motion.div></motion.div>}</AnimatePresence>

      <Popup title="zone">{town && <><p className="font-medium text-white">{town.zone} Zone</p><p className="mt-2">{town.zone.startsWith('V') ? 'Coastal high hazard with wave action. Highest risk.' : town.zone === 'AE' ? 'Special flood hazard area. 1% annual flood chance.' : 'Moderate/minimal risk.'}</p></>}</Popup>
      <Popup title="bfe"><p>Base Flood Elevation - expected height of 100-year flood. Your elevation vs BFE is #1 premium factor.</p></Popup>
      <Popup title="cafe"><p>NJ CAFE adds 4ft above BFE for new construction (2026 NJ REAL rules).</p></Popup>
      <Popup title="legacy"><p>Work permitted before Jan 2026 must finish by July 15, 2026 under old rules.</p><p className="text-2xl font-bold text-amber-400 mt-3">{legacy} days left</p></Popup>
      {QS.map((q, i) => <Popup key={i} title={`q${i}`}><p>{q.help}</p></Popup>)}
    </div>
  );
}
