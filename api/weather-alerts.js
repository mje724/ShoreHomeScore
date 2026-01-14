// Vercel Serverless Function - NOAA Weather Alerts
// File location: api/weather-alerts.js

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const zipCode = url.searchParams.get('zipCode');
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  
  try {
    let alerts = [];
    let forecast = null;
    
    // If we have coordinates, get point-specific data
    if (lat && lng) {
      // Step 1: Get the NWS grid point for this location
      const pointUrl = `https://api.weather.gov/points/${lat},${lng}`;
      const pointResponse = await fetch(pointUrl, {
        headers: { 'User-Agent': 'ShoreHomeScore (contact@shorehomescore.com)' }
      });
      
      if (pointResponse.ok) {
        const pointData = await pointResponse.json();
        const forecastUrl = pointData.properties?.forecast;
        const county = pointData.properties?.county;
        const forecastZone = pointData.properties?.forecastZone;
        
        // Get forecast
        if (forecastUrl) {
          try {
            const forecastResponse = await fetch(forecastUrl, {
              headers: { 'User-Agent': 'ShoreHomeScore (contact@shorehomescore.com)' }
            });
            if (forecastResponse.ok) {
              const forecastData = await forecastResponse.json();
              const periods = forecastData.properties?.periods || [];
              if (periods.length > 0) {
                forecast = {
                  current: periods[0],
                  upcoming: periods.slice(1, 4)
                };
              }
            }
          } catch (e) {
            console.log('Forecast fetch failed:', e.message);
          }
        }
        
        // Get alerts for this zone
        if (forecastZone) {
          const zoneId = forecastZone.split('/').pop();
          const alertsUrl = `https://api.weather.gov/alerts/active?zone=${zoneId}`;
          try {
            const alertsResponse = await fetch(alertsUrl, {
              headers: { 'User-Agent': 'ShoreHomeScore (contact@shorehomescore.com)' }
            });
            if (alertsResponse.ok) {
              const alertsData = await alertsResponse.json();
              alerts = (alertsData.features || []).map(f => ({
                event: f.properties.event,
                headline: f.properties.headline,
                severity: f.properties.severity,
                urgency: f.properties.urgency,
                description: f.properties.description?.substring(0, 500),
                instruction: f.properties.instruction?.substring(0, 300),
                expires: f.properties.expires,
                effective: f.properties.effective
              }));
            }
          } catch (e) {
            console.log('Alerts fetch failed:', e.message);
          }
        }
      }
    }
    
    // Also check for state-wide severe alerts (NJ)
    try {
      const stateAlertsUrl = 'https://api.weather.gov/alerts/active?area=NJ&severity=Severe,Extreme';
      const stateResponse = await fetch(stateAlertsUrl, {
        headers: { 'User-Agent': 'ShoreHomeScore (contact@shorehomescore.com)' }
      });
      
      if (stateResponse.ok) {
        const stateData = await stateResponse.json();
        const severeAlerts = (stateData.features || [])
          .filter(f => ['Hurricane', 'Tropical Storm', 'Storm Surge', 'Tsunami', 'Extreme Wind'].some(
            term => f.properties.event?.includes(term)
          ))
          .map(f => ({
            event: f.properties.event,
            headline: f.properties.headline,
            severity: f.properties.severity,
            urgency: f.properties.urgency,
            stateWide: true
          }));
        
        // Add state-wide alerts if not already included
        severeAlerts.forEach(sa => {
          if (!alerts.find(a => a.event === sa.event)) {
            alerts.push(sa);
          }
        });
      }
    } catch (e) {
      console.log('State alerts fetch failed:', e.message);
    }
    
    // Sort alerts by severity
    const severityOrder = { Extreme: 0, Severe: 1, Moderate: 2, Minor: 3, Unknown: 4 };
    alerts.sort((a, b) => (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4));
    
    return new Response(
      JSON.stringify({
        success: true,
        alerts,
        alertCount: alerts.length,
        forecast,
        hasUrgentAlerts: alerts.some(a => a.severity === 'Extreme' || a.severity === 'Severe')
      }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Weather API error:', error);
    return new Response(
      JSON.stringify({ error: 'Weather lookup failed', alerts: [], alertCount: 0 }),
      { status: 200, headers: corsHeaders } // Return 200 with empty data so app doesn't break
    );
  }
}
