// /api/tides.js - NOAA Tides & Currents API
// Returns real-time water levels and predictions for NJ shore stations

export const config = {
  runtime: 'edge',
};

// NJ Shore tide stations
const NJ_STATIONS = {
  'sandy-hook': { id: '8531680', name: 'Sandy Hook', county: 'Monmouth' },
  'atlantic-city': { id: '8534720', name: 'Atlantic City', county: 'Atlantic' },
  'cape-may': { id: '8536110', name: 'Cape May', county: 'Cape May' },
  'barnegat': { id: '8533615', name: 'Barnegat Inlet', county: 'Ocean' },
  'beach-haven': { id: '8534319', name: 'Beach Haven (LBI)', county: 'Ocean' },
};

// Map counties to nearest station
const COUNTY_STATION_MAP = {
  'Monmouth': 'sandy-hook',
  'Ocean': 'barnegat',
  'Atlantic': 'atlantic-city',
  'Cape May': 'cape-may',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const county = searchParams.get('county') || 'Ocean';
  
  // Get nearest station for county
  const stationKey = COUNTY_STATION_MAP[county] || 'barnegat';
  const station = NJ_STATIONS[stationKey];
  
  try {
    const now = new Date();
    const beginDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get current water level
    const waterLevelUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?` +
      `date=latest&station=${station.id}&product=water_level&datum=NAVD&units=english&time_zone=lst_ldt&format=json`;
    
    // Get tide predictions for next 24 hours
    const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, '');
    const predictionsUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?` +
      `begin_date=${beginDate}&end_date=${endDate}&station=${station.id}&product=predictions&datum=NAVD&units=english&time_zone=lst_ldt&format=json&interval=hilo`;
    
    const [waterLevelRes, predictionsRes] = await Promise.all([
      fetch(waterLevelUrl),
      fetch(predictionsUrl),
    ]);
    
    const waterLevelData = await waterLevelRes.json();
    const predictionsData = await predictionsRes.json();
    
    // Parse current water level
    let currentLevel = null;
    let currentTime = null;
    if (waterLevelData.data && waterLevelData.data.length > 0) {
      currentLevel = parseFloat(waterLevelData.data[0].v);
      currentTime = waterLevelData.data[0].t;
    }
    
    // Parse predictions (high/low tides)
    const predictions = [];
    if (predictionsData.predictions) {
      for (const pred of predictionsData.predictions.slice(0, 6)) {
        predictions.push({
          time: pred.t,
          level: parseFloat(pred.v),
          type: pred.type === 'H' ? 'High' : 'Low',
        });
      }
    }
    
    // Find next high tide
    const nextHigh = predictions.find(p => p.type === 'High');
    
    return new Response(JSON.stringify({
      success: true,
      station: {
        id: station.id,
        name: station.name,
        county: station.county,
      },
      current: {
        level: currentLevel,
        time: currentTime,
        levelFeet: currentLevel ? currentLevel.toFixed(2) : null,
      },
      predictions: predictions,
      nextHighTide: nextHigh || null,
      datum: 'NAVD88',
      note: 'Water levels in feet relative to NAVD88 datum',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=300', // Cache for 5 minutes
      },
    });
    
  } catch (error) {
    console.error('Tides API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch tide data',
      station: station,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
