// Vercel Serverless Function - handles FEMA lookups without CORS issues
// File location: api/fema-lookup.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { address, zipCode } = req.query;
  
  if (!address || !zipCode) {
    return res.status(400).json({ error: 'Address and zipCode are required' });
  }
  
  try {
    const fullAddress = `${address}, ${zipCode}`;
    
    // Step 1: Geocode the address
    const geocodeUrl = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(fullAddress)}&benchmark=Public_AR_Current&format=json`;
    
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.result?.addressMatches?.length) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    const { x: lng, y: lat } = geocodeData.result.addressMatches[0].coordinates;
    const matchedAddress = geocodeData.result.addressMatches[0].matchedAddress;
    
    // Step 2: Query FEMA NFHL
    const femaUrl = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?where=1%3D1&geometry=${lng}%2C${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE%2CSTATIC_BFE%2CDEPTH%2CZONE_SUBTY&returnGeometry=false&f=json`;
    
    const femaResponse = await fetch(femaUrl);
    const femaData = await femaResponse.json();
    
    let floodZone = 'X';
    let bfe = null;
    let zoneSubtype = null;
    
    if (femaData.features?.length > 0) {
      const feature = femaData.features[0].attributes;
      floodZone = feature.FLD_ZONE || 'X';
      bfe = feature.STATIC_BFE || null;
      zoneSubtype = feature.ZONE_SUBTY || null;
    }
    
    // Step 3: Get claims data from OpenFEMA
    let claimsData = null;
    try {
      const claimsUrl = `https://www.fema.gov/api/open/v2/FimaNfipClaims?$filter=reportedZipcode%20eq%20%27${zipCode}%27&$top=1000`;
      const claimsResponse = await fetch(claimsUrl);
      const claimsJson = await claimsResponse.json();
      
      if (claimsJson.FimaNfipClaims?.length > 0) {
        const claims = claimsJson.FimaNfipClaims;
        const totalClaims = claims.length;
        const totalPayout = claims.reduce((sum, c) => 
          sum + (c.amountPaidOnBuildingClaim || 0) + (c.amountPaidOnContentsClaim || 0), 0
        );
        
        claimsData = {
          totalClaims,
          totalPayout,
          avgPayout: totalClaims > 0 ? Math.round(totalPayout / totalClaims) : 0
        };
      }
    } catch (claimsErr) {
      console.log('Claims lookup failed:', claimsErr);
    }
    
    return res.status(200).json({
      success: true,
      coordinates: { lat, lng },
      matchedAddress,
      floodZone,
      bfe,
      zoneSubtype,
      claims: claimsData
    });
    
  } catch (error) {
    console.error('FEMA lookup error:', error);
    return res.status(500).json({ error: 'Lookup failed', details: error.message });
  }
}
