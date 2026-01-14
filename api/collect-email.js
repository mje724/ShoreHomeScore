// Simple email collection endpoint
// Emails are logged and can be viewed in Vercel logs
// For production, connect to: Supabase, Vercel KV, or email service

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email, town, floodZone } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    // Log to Vercel logs (viewable in dashboard)
    console.log('=== NEW LEAD ===');
    console.log('Email:', email);
    console.log('Town:', town);
    console.log('Flood Zone:', floodZone);
    console.log('Timestamp:', new Date().toISOString());
    console.log('================');
    
    // Return success
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Email collection error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
