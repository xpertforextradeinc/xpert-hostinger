// Lightweight MCP Server for Xpert Hostinger
require('dotenv').config();
const mysql = require('mysql2/promise');

let db;

// Initialize MySQL connection
async function initConnections() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not found in . env');
      return;
    }

    db = await mysql.createConnection(dbUrl);
    console.error('✅ Connected to MySQL');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

// MCP Protocol Handler (stdio)
async function handleRequest(request) {
  try {
    const { method, params } = JSON.parse(request);

    switch (method) {
      case 'generate-signals':
        return await generateSignals(params);
      
      case 'get-balance':  
        return await getBalance();
      
      case 'ping':
        return { success: true, message: 'pong' };
      
      default:
        return { error: `Unknown method: ${method}` };
    }
  } catch (error) {
    return { error: error.message };
  }
}

// Generate trading signals
async function generateSignals({ pair, timeframe }) {
  const signal = {
    pair: pair || 'EUR/USD',
    timeframe: timeframe || '1H',
    signal: 'BUY',
    entry: 1. 0850,
    tp: 1.0900,
    sl: 1.0800,
    timestamp: new Date().toISOString()
  };
  return { success: true, data: signal };
}

// Get account balance
async function getBalance() {
  try {
    if (!db) {
      return { success: false, error: 'Database not connected' };
    }
    const [rows] = await db.execute('SELECT balance FROM accounts LIMIT 1');
    return { success: true, balance: rows[0]?.balance || 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Stdio interface
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  const lines = chunk.trim().split('\n');
  for (const line of lines) {
    if (line) {
      const response = await handleRequest(line);
      console.log(JSON.stringify(response));
    }
  }
});

// Start
initConnections().then(() => {
  console.error('🚀 Xpert Hostinger MCP Server running...');
});