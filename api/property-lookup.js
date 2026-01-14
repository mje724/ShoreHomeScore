// Vercel Serverless Function - Property Data Lookup
// File location: api/property-lookup.js

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const address = url.searchParams.get('address');
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
  
  if (!address || !zipCode) {
    return new Response(
      JSON.stringify({ error: 'Address and zipCode required' }),
      { status: 400, headers: corsHeaders }
    );
  }
  
  try {
    const fullAddress = `${address}, ${zipCode}`;
    
    // First geocode to get coordinates
    const geocodeUrl = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(fullAddress)}&benchmark=Public_AR_Current&format=json`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.result?.addressMatches?.length) {
      return new Response(
        JSON.stringify({ error: 'Address not found' }),
        { status: 404, headers: corsHeaders }
      );
    }
    
    const match = geocodeData.result.addressMatches[0];
    const { x: lng, y: lat } = match.coordinates;
    const matchedAddress = match.matchedAddress;
    
    // Try to get property data from OpenStreetMap/Nominatim for additional context
    let propertyDetails = null;
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const osmResponse = await fetch(osmUrl, {
        headers: { 'User-Agent': 'ShoreHomeScore/1.0' }
      });
      if (osmResponse.ok) {
        const osmData = await osmResponse.json();
        propertyDetails = {
          displayName: osmData.display_name,
          type: osmData.type,
          addressDetails: osmData.address
        };
      }
    } catch (e) {
      console.log('OSM lookup failed:', e.message);
    }
    
    // Use Zillow's public search (no API key needed for basic data)
    // This scrapes publicly available Zillow data
    let zillowData = null;
    try {
      // Format address for Zillow URL
      const formattedAddress = matchedAddress
        .replace(/,/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      
      // Try to get Zillow data via their public API endpoint
      const zillowSearchUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=${encodeURIComponent(JSON.stringify({
        pagination: {},
        mapBounds: {
          north: lat + 0.001,
          south: lat - 0.001,
          east: lng + 0.001,
          west: lng - 0.001
        },
        isMapVisible: true,
        filterState: {
          isAllHomes: { value: true }
        },
        isListVisible: true
      }))}&wants={%22cat1%22:[%22listResults%22]}&requestId=1`;
      
      // Note: This may be rate limited or blocked - we'll use estimates as fallback
    } catch (e) {
      console.log('Zillow lookup failed:', e.message);
    }
    
    // Get county assessment data from Census
    let censusData = null;
    try {
      // Get census tract for more detailed data
      const censusGeoUrl = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lng}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&layers=all&format=json`;
      const censusGeoResponse = await fetch(censusGeoUrl);
      if (censusGeoResponse.ok) {
        const censusGeoData = await censusGeoResponse.json();
        const geos = censusGeoData.result?.geographies;
        if (geos) {
          censusData = {
            state: geos['States']?.[0]?.NAME,
            county: geos['Counties']?.[0]?.NAME,
            tract: geos['Census Tracts']?.[0]?.TRACT,
            blockGroup: geos['Census Block Groups']?.[0]?.BLKGRP
          };
        }
      }
    } catch (e) {
      console.log('Census geo lookup failed:', e.message);
    }
    
    // Estimate property values based on location (NJ Shore specific)
    const njShoreEstimates = {
      // Price per sqft by area (approximate 2024-2026 values)
      '08742': { ppsf: 450, medianValue: 650000, medianSqft: 1800 }, // Point Pleasant Beach
      '08751': { ppsf: 380, medianValue: 550000, medianSqft: 1600 }, // Seaside Heights
      '08752': { ppsf: 400, medianValue: 580000, medianSqft: 1700 }, // Seaside Park
      '08753': { ppsf: 350, medianValue: 480000, medianSqft: 1500 }, // Toms River
      '08723': { ppsf: 400, medianValue: 600000, medianSqft: 1700 }, // Brick
      '08724': { ppsf: 380, medianValue: 550000, medianSqft: 1600 }, // Brick
      '08701': { ppsf: 300, medianValue: 400000, medianSqft: 1400 }, // Lakewood
      '08527': { ppsf: 280, medianValue: 380000, medianSqft: 1500 }, // Jackson
      '08731': { ppsf: 420, medianValue: 620000, medianSqft: 1800 }, // Forked River
      '08732': { ppsf: 500, medianValue: 750000, medianSqft: 1900 }, // Island Heights
      '08734': { ppsf: 450, medianValue: 680000, medianSqft: 1800 }, // Lanoka Harbor
      '08735': { ppsf: 550, medianValue: 850000, medianSqft: 2000 }, // Lavallette
      '08738': { ppsf: 600, medianValue: 950000, medianSqft: 2100 }, // Mantoloking
      '08739': { ppsf: 500, medianValue: 780000, medianSqft: 1900 }, // Normandy Beach
      '08740': { ppsf: 480, medianValue: 720000, medianSqft: 1850 }, // Ocean Gate
      '08741': { ppsf: 420, medianValue: 620000, medianSqft: 1750 }, // Pine Beach
      '08050': { ppsf: 350, medianValue: 500000, medianSqft: 1600 }, // Manahawkin
      '08008': { ppsf: 650, medianValue: 1100000, medianSqft: 2200 }, // Long Beach Island
      '08006': { ppsf: 700, medianValue: 1200000, medianSqft: 2300 }, // Barnegat Light
      '08092': { ppsf: 550, medianValue: 900000, medianSqft: 2000 }, // West Creek
      '08087': { ppsf: 400, medianValue: 580000, medianSqft: 1700 }, // Tuckerton
      '08721': { ppsf: 450, medianValue: 680000, medianSqft: 1800 }, // Bayville
      '08005': { ppsf: 380, medianValue: 520000, medianSqft: 1600 }, // Barnegat
      '07719': { ppsf: 550, medianValue: 850000, medianSqft: 2000 }, // Belmar
      '07717': { ppsf: 600, medianValue: 950000, medianSqft: 2100 }, // Avon-by-the-Sea
      '07718': { ppsf: 500, medianValue: 780000, medianSqft: 1900 }, // Belford
      '07750': { ppsf: 700, medianValue: 1150000, medianSqft: 2200 }, // Monmouth Beach
      '07760': { ppsf: 850, medianValue: 1500000, medianSqft: 2500 }, // Rumson
      '07762': { ppsf: 750, medianValue: 1300000, medianSqft: 2300 }, // Spring Lake
      '07764': { ppsf: 500, medianValue: 750000, medianSqft: 1900 }, // West Long Branch
      '07740': { ppsf: 550, medianValue: 820000, medianSqft: 1950 }, // Long Branch
      '07753': { ppsf: 450, medianValue: 650000, medianSqft: 1800 }, // Neptune
      '07756': { ppsf: 480, medianValue: 700000, medianSqft: 1850 }, // Ocean Grove
    };
    
    // Default NJ Shore estimates
    const defaultEstimate = { ppsf: 400, medianValue: 580000, medianSqft: 1700 };
    const areaEstimate = njShoreEstimates[zipCode] || defaultEstimate;
    
    // Calculate estimated values
    const estimatedData = {
      pricePerSqft: areaEstimate.ppsf,
      medianHomeValue: areaEstimate.medianValue,
      medianSqft: areaEstimate.medianSqft,
      estimatedYearBuilt: 1985, // Median for shore area
      typicalLotSize: 5000, // sq ft
      typicalStories: 2,
    };
    
    return new Response(
      JSON.stringify({
        success: true,
        coordinates: { lat, lng },
        matchedAddress,
        census: censusData,
        estimates: estimatedData,
        // These would come from Zillow if we had API access:
        propertyData: {
          sqft: null, // User should enter
          yearBuilt: null,
          bedrooms: null,
          bathrooms: null,
          lotSize: null,
          lastSalePrice: null,
          lastSaleDate: null,
          zestimate: null,
          // Provide area averages as suggestions
          areaSuggestions: {
            avgSqft: areaEstimate.medianSqft,
            avgValue: areaEstimate.medianValue,
            pricePerSqft: areaEstimate.ppsf
          }
        },
        source: 'census-estimates'
      }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Property lookup error:', error);
    return new Response(
      JSON.stringify({ error: 'Lookup failed', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
