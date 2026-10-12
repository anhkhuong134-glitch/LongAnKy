// Vercel Serverless Function to fetch live Google Docs content without CORS issues
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const DOC_ID = req.query?.docId || '1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y';
  const exportUrl = `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`;

  try {
    const response = await fetch(exportUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Google Docs export failed with status ${response.status}`
      });
    }

    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(text);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Lỗi kết nối tới Google Docs'
    });
  }
}
