/**
 * Lightweight MCP Server for Xpert Hostinger
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const Redis = require('ioredis');

let db, redis;

// Initialize MySQL + Redis connections
async function initConnections() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    redis = new Redis(process.env.REDIS_URL);

    console.error('✅ Connected to MySQL and Redis');
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

      case 'cache-data':
        return await cacheData(params);

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
    entry: 1.0850,
    tp: 1.0900,
    sl: 1.0800,
    timestamp: new Date().toISOString()
  };

  return { success: true, data: signal };
}

// Get account balance
async function getBalance() {
  try {
    const [rows] = await db.execute('SELECT balance FROM accounts LIMIT 1');
    return { success: true, balance: rows[0]?.balance || 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Cache market data
async function cacheData({ key, value, ttl }) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl || 3600);
    return { success: true, message: `Cached ${key}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// STDIO interface
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

// Start server
initConnections().then(() => {
  console.error('🚀 Xpert Hostinger MCP Server running...');
});
