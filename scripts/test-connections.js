require('dotenv').config();
const mysql = require('mysql2/promise');
const { createClient } = require('redis');

async function testMySQL() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const [rows] = await connection.query('SELECT NOW()');
    console.log('✅ MySQL connected, current time:', rows);
    await connection.end();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
  }
}

async function testRedis() {
  try {
    const client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.error('Redis error:', err));
    await client.connect();
    await client.set('test', 'Hello Luckman 🚀');
    const value = await client.get('test');
    console.log('✅ Redis connected, value:', value);
    await client.disconnect();
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
}

(async () => {
  await testMySQL();
  await testRedis();
})();
