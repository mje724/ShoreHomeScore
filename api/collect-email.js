// /api/collect-email.js
// Place this file in your project's /api folder
// Emails are logged to Vercel Logs - view at vercel.com/dashboard → Logs → search "NEW LEAD"

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, town, county, zone, timestamp } = req.body;

    // Log to Vercel Logs (this is how you collect emails - $0, no third party!)
    console.log('========== NEW LEAD ==========');
    console.log('Email:', email);
    console.log('Town:', town);
    console.log('County:', county);
    console.log('Flood Zone:', zone);
    console.log('Timestamp:', timestamp);
    console.log('===============================');

    // Return success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email collection error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
