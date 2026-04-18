// Cloudflare Pages Function - Google Sheets CSV Proxy
// 簡單代理，不解析數據

export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const sheetUrl = searchParams.get('url');
  
  if (!sheetUrl) {
    return new Response('Missing url parameter', { 
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  try {
    const response = await fetch(sheetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenBI/1.0)'
      }
    });
    
    if (!response.ok) {
      return new Response(`Sheet fetch failed: ${response.status}`, { 
        status: 500 
      });
    }
    
    const data = await response.text();
    
    return new Response(data, {
      headers: {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=300'
      },
    });
    
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
