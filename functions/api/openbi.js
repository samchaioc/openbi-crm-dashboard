// OpenBI API - Cloudflare Pages Function
// 代理請求到 Google Sheets CSV，避免 CORS 問題

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  // Index Sheet URL
  const INDEX_URL = 'https://docs.google.com/spreadsheets/d/1Gu-Z1V_3sfOE6pWIGd8Hlg--RfWkBlLhDikQmU1g1Pk/export?format=csv';
  
  try {
    if (action === 'index') {
      const indexData = await getIndexData(INDEX_URL);
      return jsonResponse({ success: true, data: indexData });
      
    } else if (action === 'month') {
      const year = url.searchParams.get('year');
      const month = url.searchParams.get('month');
      
      if (!year || !month) {
        return jsonResponse({ success: false, error: 'Missing year or month' }, 400);
      }
      
      const index = await getIndexData(INDEX_URL);
      const item = index.find(i => i.year === year && i.month === month);
      
      if (!item || !item.url) {
        return jsonResponse({ success: false, error: 'Month not found' }, 404);
      }
      
      const monthData = await getMonthData(item.url, year, month);
      return jsonResponse({ success: true, data: monthData });
      
    } else if (action === 'all') {
      const allData = await getAllData(INDEX_URL);
      return jsonResponse({ success: true, data: allData });
      
    } else {
      return jsonResponse({ success: false, error: 'Unknown action' }, 400);
    }
    
  } catch (error) {
    console.error('Error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// 獲取 Index 數據
async function getIndexData(indexUrl) {
  const response = await fetch(indexUrl);
  const csv = await response.text();
  const rows = parseCSV(csv);
  
  const months = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[0] && row[1]) {
      months.push({
        year: row[0].toString(),
        month: row[1].toString(),
        url: row[2] ? row[2].toString() : ''
      });
    }
  }
  
  return months;
}

// 獲取月份數據
async function getMonthData(monthUrl, year, month) {
  const response = await fetch(monthUrl);
  const csv = await response.text();
  const rows = parseCSV(csv);
  
  return parseMonthCSV(rows, year, month);
}

// 解析月份 CSV
function parseMonthCSV(rows, year, month) {
  if (rows.length < 5) {
    throw new Error('Invalid month data format');
  }
  
  const storeRow = rows[1]; // Row 2: Store names
  const headerRow = rows[3]; // Row 4: Headers
  
  // Find Nett columns for each store
  const storeNettMap = {};
  let currentStore = null;
  
  for (let i = 0; i < storeRow.length; i++) {
    const cell = storeRow[i];
    if (cell && cell.toString().startsWith('SALES ')) {
      currentStore = cell.toString().replace('SALES ', '');
    }
    if (currentStore && headerRow[i] === 'Nett') {
      if (!storeNettMap[currentStore]) {
        storeNettMap[currentStore] = [];
      }
      storeNettMap[currentStore].push(i);
    }
  }
  
  // Calculate totals
  const stores = {};
  let total = 0;
  
  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    for (const [store, indices] of Object.entries(storeNettMap)) {
      indices.forEach(idx => {
        const val = parseFloat(row[idx]) || 0;
        stores[store] = (stores[store] || 0) + val;
        total += val;
      });
    }
  }
  
  return {
    year: year,
    month: month,
    total: total,
    stores: stores
  };
}

// 獲取所有數據
async function getAllData(indexUrl) {
  const index = await getIndexData(indexUrl);
  const allMonths = [];
  
  for (const item of index) {
    if (!item.url) continue;
    try {
      const monthData = await getMonthData(item.url, item.year, item.month);
      allMonths.push(monthData);
    } catch (e) {
      console.log('Failed to load month:', item.year + '-' + item.month);
    }
  }
  
  // Calculate totals
  let grandTotal = 0;
  const storeTotals = {};
  
  allMonths.forEach(m => {
    grandTotal += m.total;
    for (const [store, sales] of Object.entries(m.stores)) {
      storeTotals[store] = (storeTotals[store] || 0) + sales;
    }
  });
  
  return {
    months: allMonths,
    total: grandTotal,
    stores: storeTotals
  };
}

// CSV Parser
function parseCSV(csv) {
  const rows = [];
  const lines = csv.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    row.push(cell.trim());
    rows.push(row);
  }
  
  return rows;
}

// JSON Response helper
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
