// /api/local-updates.js - Aggregates FEMA, state programs, and deadlines for NJ shore counties
// Returns relevant updates, grants, and programs for a specific county

export const config = {
  runtime: 'edge',
};

// Key dates and deadlines
const DEADLINES = {
  legacyWindow: {
    date: '2026-07-15',
    title: 'CAFE Legacy Window Closes',
    description: 'Last day to submit permit applications under previous elevation standards',
    urgent: true,
  },
  stormSeason: {
    date: '2026-06-01',
    title: 'Hurricane Season Begins',
    description: 'Atlantic hurricane season runs June 1 - November 30',
    urgent: false,
  },
  fmaSwiftCurrent: {
    date: '2025-05-31',
    title: 'FMA Swift Current Deadline',
    description: '$500M available for flood mitigation - applications closing',
    urgent: true,
    link: 'https://www.fema.gov/grants/mitigation/floods',
  },
};

// Active programs (manually maintained but sourced from official sites)
const PROGRAMS = {
  blueAcres: {
    id: 'blue-acres',
    title: 'Blue Acres Buyout Program',
    agency: 'NJ DEP',
    description: 'Voluntary buyout program for flood-prone properties at fair market value',
    eligibility: 'Properties in floodways, floodplains, or Disaster Risk Reduction Areas with flood history',
    funding: 'Pre-storm fair market value',
    status: 'accepting',
    link: 'https://dep.nj.gov/blueacres/',
    phone: '(609) 940-4140',
    forWhom: ['repetitive-loss', 'below-bfe', 've-zone'],
  },
  fmaSwiftCurrent: {
    id: 'fma-swift-current',
    title: 'FEMA Flood Mitigation Assistance - Swift Current',
    agency: 'FEMA',
    description: 'Grants for elevation, mitigation, or buyout of flood-damaged NFIP-insured properties',
    eligibility: 'NFIP-insured properties with repetitive or substantial flood damage',
    funding: 'Up to 100% for severe repetitive loss properties',
    status: 'accepting',
    link: 'https://www.fema.gov/grants/mitigation/floods',
    forWhom: ['repetitive-loss', 'nfip-insured', 'below-bfe'],
  },
  hmgpIda: {
    id: 'hmgp-ida',
    title: 'Hazard Mitigation Grant Program (Hurricane Ida)',
    agency: 'FEMA via NJ DCA',
    description: 'Post-disaster mitigation funding for elevation, floodproofing, and property acquisition',
    eligibility: 'Properties in Ida-declared disaster areas',
    funding: '75% federal / 25% local match (90% for repetitive loss)',
    status: 'limited',
    link: 'https://www.nj.gov/dca/ddrm/programs/mitigation.shtml',
    forWhom: ['ida-affected', 'repetitive-loss'],
  },
  elevationGrant: {
    id: 'elevation-grant',
    title: 'Home Elevation Assistance',
    agency: 'NJ DCA',
    description: 'Financial assistance to elevate homes above flood levels',
    eligibility: 'Homes in flood zones with history of flooding or below BFE',
    funding: 'Varies by program - covers construction and temporary relocation',
    status: 'accepting',
    link: 'https://www.nj.gov/dca/ddrm/programs/mitigation.shtml',
    forWhom: ['below-bfe', 'ae-zone', 've-zone'],
  },
};

// County-specific notes
const COUNTY_NOTES = {
  'Ocean': {
    crsClass: 7,
    crsDiscount: '15%',
    note: 'Ocean County communities participate in CRS - check your town for specific discounts',
    recentActivity: 'FEMA approved 4th batch of Ida buyouts (Feb 2025)',
  },
  'Monmouth': {
    crsClass: 6,
    crsDiscount: '20%',
    note: 'Several Monmouth towns have strong CRS ratings',
    recentActivity: 'Flood map updates proposed - comment period open',
  },
  'Atlantic': {
    crsClass: 5,
    crsDiscount: '25%',
    note: 'Atlantic City area has enhanced CRS discounts',
    recentActivity: 'Blue Acres active in multiple municipalities',
  },
  'Cape May': {
    crsClass: 6,
    crsDiscount: '20%',
    note: 'Cape May County active in flood mitigation programs',
    recentActivity: 'Stone Harbor, Avalon pursuing mitigation projects',
  },
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const county = searchParams.get('county') || 'Ocean';
  const zone = searchParams.get('zone') || 'AE';
  const belowBfe = searchParams.get('belowBfe') === 'true';
  const hasNfip = searchParams.get('hasNfip') === 'true';
  
  try {
    // Fetch recent NJ disaster declarations from OpenFEMA
    const femaUrl = `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state%20eq%20%27NJ%27&$orderby=declarationDate%20desc&$top=10`;
    
    let disasters = [];
    try {
      const femaRes = await fetch(femaUrl);
      const femaData = await femaRes.json();
      if (femaData.DisasterDeclarationsSummaries) {
        disasters = femaData.DisasterDeclarationsSummaries
          .filter(d => {
            // Filter to recent and relevant
            const declDate = new Date(d.declarationDate);
            const twoYearsAgo = new Date();
            twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
            return declDate > twoYearsAgo;
          })
          .map(d => ({
            number: d.disasterNumber,
            title: d.declarationTitle,
            type: d.declarationType,
            date: d.declarationDate,
            counties: d.designatedArea,
            programs: {
              ih: d.ihProgramDeclared,
              ia: d.iaProgramDeclared,
              pa: d.paProgramDeclared,
              hm: d.hmProgramDeclared,
            },
          }))
          .slice(0, 5);
      }
    } catch (e) {
      console.error('FEMA API error:', e);
    }
    
    // Calculate days to deadlines
    const now = new Date();
    const deadlinesWithDays = Object.entries(DEADLINES).map(([key, d]) => ({
      ...d,
      id: key,
      daysUntil: Math.ceil((new Date(d.date) - now) / (1000 * 60 * 60 * 24)),
    })).filter(d => d.daysUntil > 0).sort((a, b) => a.daysUntil - b.daysUntil);
    
    // Filter programs relevant to user's situation
    const userTags = [];
    if (belowBfe) userTags.push('below-bfe');
    if (hasNfip) userTags.push('nfip-insured');
    if (zone.startsWith('V')) userTags.push('ve-zone');
    if (zone.startsWith('A')) userTags.push('ae-zone');
    
    const relevantPrograms = Object.values(PROGRAMS).filter(p => {
      // Show all programs but mark relevance
      return p.status === 'accepting' || p.status === 'limited';
    }).map(p => ({
      ...p,
      relevant: p.forWhom.some(tag => userTags.includes(tag)),
      matchedTags: p.forWhom.filter(tag => userTags.includes(tag)),
    })).sort((a, b) => (b.relevant ? 1 : 0) - (a.relevant ? 1 : 0));
    
    // Get county-specific info
    const countyInfo = COUNTY_NOTES[county] || COUNTY_NOTES['Ocean'];
    
    // Build response
    return new Response(JSON.stringify({
      success: true,
      county,
      timestamp: new Date().toISOString(),
      
      // Summary counts for banner
      summary: {
        activePrograms: relevantPrograms.filter(p => p.relevant).length,
        totalPrograms: relevantPrograms.length,
        urgentDeadlines: deadlinesWithDays.filter(d => d.urgent && d.daysUntil < 180).length,
        recentDisasters: disasters.length,
      },
      
      // Detailed data
      deadlines: deadlinesWithDays,
      programs: relevantPrograms,
      disasters,
      countyInfo,
      
      // Contextual messages based on situation
      alerts: generateAlerts(userTags, countyInfo, deadlinesWithDays),
      
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('Local updates error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch updates',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function generateAlerts(userTags, countyInfo, deadlines) {
  const alerts = [];
  
  // Below BFE alert
  if (userTags.includes('below-bfe')) {
    alerts.push({
      type: 'opportunity',
      title: 'Elevation Assistance May Be Available',
      message: 'Properties below BFE may qualify for FEMA elevation grants covering up to 100% of costs.',
      action: 'Check FMA Swift Current eligibility',
      priority: 'high',
    });
  }
  
  // VE Zone alert
  if (userTags.includes('ve-zone')) {
    alerts.push({
      type: 'info',
      title: 'Blue Acres Active in Coastal Areas',
      message: 'The voluntary buyout program offers fair market value for high-risk properties.',
      action: 'Learn about Blue Acres',
      priority: 'medium',
    });
  }
  
  // Legacy window alert
  const legacyDeadline = deadlines.find(d => d.id === 'legacyWindow');
  if (legacyDeadline && legacyDeadline.daysUntil < 365) {
    alerts.push({
      type: 'deadline',
      title: `Legacy Window: ${legacyDeadline.daysUntil} Days`,
      message: 'Permits submitted before July 15, 2026 can use previous elevation standards.',
      action: 'Plan improvements now',
      priority: legacyDeadline.daysUntil < 180 ? 'high' : 'medium',
    });
  }
  
  // CRS discount alert
  if (countyInfo.crsDiscount) {
    alerts.push({
      type: 'savings',
      title: `CRS Discount: ${countyInfo.crsDiscount}`,
      message: countyInfo.note,
      action: 'Verify with your insurer',
      priority: 'low',
    });
  }
  
  return alerts.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority] - priority[b.priority];
  });
}
