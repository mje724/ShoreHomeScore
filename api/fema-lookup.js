// Vercel Serverless Function - handles FEMA lookups without CORS issues
// File location: api/fema-lookup.js

export const config = {
  runtime: 'edge', // Use edge runtime for better fetch support
};

export default async function handler(req) {
  // Parse URL parameters
  const url = new URL(req.url);
  const address = url.searchParams.get('address');
  const zipCode = url.searchParams.get('zipCode');
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  
  // Validate inputs
  if (!address || !zipCode) {
    return new Response(
      JSON.stringify({ error: 'Address and zipCode are required' }),
      { status: 400, headers: corsHeaders }
    );
  }
  
  try {
    // Build full address - if address already contains state/zip, use as-is
    // Otherwise append the zipCode
    const hasZipOrState = /\d{5}|,\s*NJ/i.test(address);
    const fullAddress = hasZipOrState ? address : `${address}, NJ ${zipCode}`;
    
    // Step 1: Geocode the address using Census Bureau
    const geocodeUrl = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(fullAddress)}&benchmark=Public_AR_Current&format=json`;
    
    console.log('Geocoding:', fullAddress);
    
    const geocodeResponse = await fetch(geocodeUrl);
    
    if (!geocodeResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Geocoding service unavailable' }),
        { status: 502, headers: corsHeaders }
      );
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.result?.addressMatches?.length) {
      return new Response(
        JSON.stringify({ error: 'Address not found. Try adding city name.' }),
        { status: 404, headers: corsHeaders }
      );
    }
    
    const { x: lng, y: lat } = geocodeData.result.addressMatches[0].coordinates;
    const matchedAddress = geocodeData.result.addressMatches[0].matchedAddress;
    
    console.log('Found coordinates:', lat, lng);
    
    // Step 2: Query FEMA NFHL for flood zone data (updated endpoint)
    const femaUrl = `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?where=1%3D1&geometry=${lng}%2C${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE%2CSTATIC_BFE%2CZONE_SUBTY&returnGeometry=false&f=json`;
    
    let floodZone = 'X';
    let bfe = null;
    let zoneSubtype = null;
    
    try {
      const femaResponse = await fetch(femaUrl);
      if (femaResponse.ok) {
        const femaData = await femaResponse.json();
        
        if (femaData.features?.length > 0) {
          const feature = femaData.features[0].attributes;
          floodZone = feature.FLD_ZONE || 'X';
          bfe = feature.STATIC_BFE || null;
          zoneSubtype = feature.ZONE_SUBTY || null;
        }
      }
    } catch (femaErr) {
      console.log('FEMA lookup failed, using defaults:', femaErr.message);
    }
    
    // Step 3: Get claims data from OpenFEMA (optional, don't fail if this fails)
    let claimsData = null;
    try {
      const claimsUrl = `https://www.fema.gov/api/open/v2/FimaNfipClaims?$filter=reportedZipcode%20eq%20%27${zipCode}%27&$inlinecount=allpages&$top=1`;
      const claimsResponse = await fetch(claimsUrl);
      
      if (claimsResponse.ok) {
        const claimsJson = await claimsResponse.json();
        const totalClaims = claimsJson.metadata?.count || 0;
        
        if (totalClaims > 0) {
          claimsData = {
            totalClaims,
            avgPayout: 45000 // Approximate average for NJ shore
          };
        }
      }
    } catch (claimsErr) {
      console.log('Claims lookup failed (non-critical):', claimsErr.message);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        coordinates: { lat, lng },
        matchedAddress,
        floodZone,
        bfe,
        zoneSubtype,
        claims: claimsData
      }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('FEMA lookup error:', error);
    return new Response(
      JSON.stringify({ error: 'Lookup failed', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
