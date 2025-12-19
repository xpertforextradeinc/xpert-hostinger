# Xpert Hostinger - Forex Trading Platform

Welcome to **Xpert Hostinger**, a comprehensive forex trading platform designed to deliver advanced trading tools, real-time market data, and secure transaction processing for traders worldwide.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Quick Start Guide](#quick-start-guide)
- [Core Features](#core-features)
- [API Endpoints](#api-endpoints)
- [Development Guidelines](#development-guidelines)
- [Security Best Practices](#security-best-practices)
- [Database Schema](#database-schema)
- [Documentation Links](#documentation-links)
- [Troubleshooting](#troubleshooting)
- [Maintenance Procedures](#maintenance-procedures)
- [Deployment Checklist](#deployment-checklist)
- [Version History](#version-history)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Project Overview

**Xpert Hostinger** is a full-stack forex trading application built with modern web technologies. It provides traders with:

- **Real-time Market Data**: Live currency pair quotes and historical charts
- **Secure Trading**: End-to-end encrypted transactions with multi-factor authentication
- **Portfolio Management**: Track positions, manage risk, and monitor performance
- **Advanced Analytics**: Technical indicators, market sentiment analysis, and predictive models
- **24/7 Support**: Comprehensive documentation and responsive support systems

### Key Statistics

- **Supported Currency Pairs**: 100+
- **Update Frequency**: Real-time (sub-second)
- **Transaction Volume Capacity**: 10,000+ concurrent traders
- **Uptime SLA**: 99.9%
- **Data Centers**: Multiple regions (US, EU, APAC)

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js, Python (FastAPI) |
| **Database** | PostgreSQL, Redis |
| **Infrastructure** | Docker, Kubernetes, AWS |
| **Messaging** | RabbitMQ, WebSocket |
| **Monitoring** | Prometheus, Grafana, ELK Stack |

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** v18.0.0 or higher
- **Python** 3.9+
- **Docker** 20.10+
- **Git** 2.30+
- **PostgreSQL** 13+
- **Redis** 6.0+

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/xpertforextradeinc/xpert-hostinger.git
cd xpert-hostinger
```

#### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
# or
yarn install
```

**Backend:**
```bash
cd backend
npm install
pip install -r requirements.txt
```

#### 3. Environment Configuration

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/xpert_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
API_KEY=your_api_key_here
ENCRYPTION_KEY=your_encryption_key_here
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

#### 4. Database Setup

```bash
cd backend
npm run db:migrate
npm run db:seed
```

#### 5. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm start
# Application runs on http://localhost:3000
```

#### 6. Verify Installation

Visit `http://localhost:3000` in your browser. You should see the login page.

---

## ✨ Core Features

### 1. Trading Engine
- **Market Orders**: Execute buy/sell orders instantly at current market prices
- **Limit Orders**: Set specific entry and exit prices
- **Stop Loss & Take Profit**: Automated risk management
- **Position Sizing**: Calculated based on account balance and risk tolerance

```javascript
// Example: Create a market order
POST /api/trades/market-order
{
  "pair": "EUR/USD",
  "type": "buy",
  "volume": 1.0,
  "leverage": 1:50
}
```

### 2. Real-time Price Feeds
- WebSocket connections for live market data
- Multiple data sources for redundancy
- Bid/ask spread optimization
- Historical candle data (OHLCV)

### 3. Account Management
- Multi-currency wallets
- Deposit and withdrawal processing
- Transaction history and reporting
- Account verification and KYC compliance

### 4. Analytics Dashboard
- Portfolio overview and performance metrics
- Equity curve and drawdown analysis
- Risk metrics (Sharpe ratio, Sortino ratio)
- Trade statistics and win rate analysis

### 5. Notification System
- Email alerts for trade executions
- SMS notifications for significant events
- In-app push notifications
- Customizable alert preferences

### 6. Admin Panel
- User management and compliance
- Market monitoring and control
- Financial reporting and auditing
- System health monitoring

---

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - User login
POST   /api/auth/logout             - User logout
POST   /api/auth/refresh-token      - Refresh JWT token
POST   /api/auth/2fa/setup          - Enable two-factor authentication
POST   /api/auth/2fa/verify         - Verify 2FA code
POST   /api/auth/password-reset     - Initiate password reset
```

### Trading Endpoints

```
POST   /api/trades/market-order     - Create market order
POST   /api/trades/limit-order      - Create limit order
GET    /api/trades/active           - Get active positions
GET    /api/trades/:id              - Get trade details
PATCH  /api/trades/:id              - Modify trade (SL/TP)
DELETE /api/trades/:id              - Close/cancel trade
GET    /api/trades/history          - Get closed trades
```

### Market Data Endpoints

```
GET    /api/market/pairs            - List available pairs
GET    /api/market/price/:pair      - Get current price
GET    /api/market/candles/:pair    - Get OHLCV data
GET    /api/market/spread/:pair     - Get bid/ask spread
GET    /api/market/economic-calendar - Get economic events
```

### Account Endpoints

```
GET    /api/account/profile         - Get user profile
PATCH  /api/account/profile         - Update profile
GET    /api/account/balance         - Get account balance
GET    /api/account/equity          - Get account equity
GET    /api/account/transactions    - Get transaction history
POST   /api/account/deposit         - Create deposit request
POST   /api/account/withdrawal      - Create withdrawal request
```

### Analytics Endpoints

```
GET    /api/analytics/dashboard     - Get dashboard metrics
GET    /api/analytics/performance   - Get performance statistics
GET    /api/analytics/risk-metrics  - Get risk analysis
GET    /api/analytics/equity-curve  - Get equity curve data
```

### Admin Endpoints

```
GET    /api/admin/users             - List all users
GET    /api/admin/users/:id         - Get user details
PATCH  /api/admin/users/:id         - Update user status
GET    /api/admin/system/health     - System health status
GET    /api/admin/system/logs       - System logs
```

### WebSocket Connections

```
ws://api.xpert-hostinger.com/ws/prices/:pair
  - Real-time price updates
  
ws://api.xpert-hostinger.com/ws/trades
  - Order and position updates
  
ws://api.xpert-hostinger.com/ws/notifications
  - User notifications
```

---

## 👨‍💻 Development Guidelines

### Code Structure

```
xpert-hostinger/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── store/            # Redux state management
│   │   ├── styles/           # Global styles
│   │   ├── utils/            # Utility functions
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   ├── validators/       # Input validation
│   │   └── app.js
│   ├── migrations/           # Database migrations
│   ├── seeds/               # Database seeds
│   └── package.json
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
└── docs/                      # Documentation
```

### Coding Standards

#### JavaScript/TypeScript

```javascript
// Use const/let, not var
const userId = getUserId();

// Use arrow functions
const calculateProfit = (entry, exit) => (exit - entry) * volume;

// Use async/await
async function fetchMarketData() {
  try {
    const data = await api.get('/market/data');
    return data;
  } catch (error) {
    logger.error('Failed to fetch market data', error);
    throw error;
  }
}

// Use destructuring
const { pair, volume, leverage } = orderData;

// Use template literals
const message = `Order created: ${pair} at ${price}`;
```

#### Python

```python
# Use type hints
from typing import List, Dict, Optional

def calculate_position_size(
    account_balance: float,
    risk_percent: float,
    stop_loss_pips: int
) -> float:
    """Calculate position size based on risk management."""
    return (account_balance * risk_percent) / (stop_loss_pips * 10)

# Use docstrings
def process_order(order_data: Dict) -> Dict:
    """
    Process a trading order.
    
    Args:
        order_data: Order details including pair, volume, and type
        
    Returns:
        Confirmation with order ID and execution price
    """
    pass
```

### Git Workflow

#### Branch Naming Convention

```
feature/description        # New features
bugfix/description         # Bug fixes
hotfix/description         # Production hotfixes
refactor/description       # Code refactoring
docs/description           # Documentation updates
test/description           # Test additions
```

#### Commit Message Format

```
[TYPE] Brief description (50 chars max)

Detailed explanation of changes (if needed)
- Point 1
- Point 2

Related issues: #123, #456
```

#### Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes with meaningful commits
3. Push to your branch
4. Create a Pull Request with:
   - Clear description of changes
   - Related issue numbers
   - Screenshots (if UI changes)
   - Test coverage confirmation
5. Request review from team members
6. Address review comments
7. Merge after approval (squash commits)

### Testing Requirements

#### Unit Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

#### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

#### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

**Minimum Coverage Requirements:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

### Code Review Checklist

- [ ] Code follows style guide
- [ ] No hardcoded values/secrets
- [ ] Error handling implemented
- [ ] Unit tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes to APIs
- [ ] Performance impact assessed
- [ ] Security implications reviewed

---

## 🔐 Security Best Practices

### Authentication & Authorization

#### JWT Token Management

```javascript
// Token payload should be minimal
const tokenPayload = {
  userId: user.id,
  email: user.email,
  role: user.role,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600
};

// Token rotation after 1 hour
const refreshToken = generateRefreshToken(userId);
```

#### Two-Factor Authentication (2FA)

- Implement TOTP (Time-based One-Time Password)
- Use authenticator apps (Google Authenticator, Authy)
- Backup codes for account recovery
- Enforce 2FA for admin accounts

```javascript
// Example 2FA setup
POST /api/auth/2fa/setup
Response: {
  secret: "JBSWY3DPEBLW64TMMQ",
  qrCode: "data:image/png;base64,...",
  backupCodes: ["XXXX-XXXX", "YYYY-YYYY", ...]
}
```

### Data Protection

#### Encryption

```javascript
// Encrypt sensitive data at rest
const encrypted = encrypt(sensitiveData, ENCRYPTION_KEY);

// Use HTTPS for all communications
// TLS 1.3 minimum

// Hash passwords with bcrypt
const hashedPassword = await bcrypt.hash(password, 10);
```

#### Database Security

```sql
-- Use parameterized queries to prevent SQL injection
SELECT * FROM users WHERE id = $1 AND email = $2;

-- Implement row-level security (RLS)
ALTER TABLE user_positions ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY user_positions_isolation ON user_positions
  USING (user_id = current_user_id());
```

### API Security

#### Rate Limiting

```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

#### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://xpert-hostinger.com',
    'https://app.xpert-hostinger.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Input Validation

```javascript
// Validate and sanitize all inputs
const { body, validationResult } = require('express-validator');

const tradeValidator = [
  body('pair').isString().isLength({ min: 6, max: 7 }),
  body('volume').isFloat({ min: 0.01 }).toFloat(),
  body('leverage').isInt({ min: 1, max: 500 }),
];

app.post('/api/trades', tradeValidator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process trade
});
```

### Infrastructure Security

#### Environment Variables

```bash
# Never commit .env files
# Use `.env.example` as template
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<generate-random-64-char-string>
ENCRYPTION_KEY=<generate-random-32-char-string>
API_KEY=<generate-random-key>
```

#### Secrets Management

- Use AWS Secrets Manager or HashiCorp Vault
- Rotate secrets regularly (every 90 days)
- Audit all secret access
- Enable versioning

#### Logging & Monitoring

```javascript
// Never log sensitive data
logger.info('User login attempt', { userId, timestamp });
// ❌ DON'T: logger.info('Login attempt', { password, token });

// Monitor failed login attempts
if (!isValidPassword) {
  failedAttempts[userId]++;
  if (failedAttempts[userId] >= 5) {
    lockAccount(userId);
    sendSecurityAlert(userId);
  }
}
```

### Compliance

- **KYC (Know Your Customer)**: Implement identity verification
- **AML (Anti-Money Laundering)**: Monitor suspicious transactions
- **GDPR**: Handle user data responsibly
- **PCI-DSS**: Secure payment processing
- **SOC 2**: Maintain security standards

---

## 📊 Database Schema

### Core Tables

#### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  country VARCHAR(100),
  
  -- Account Status
  status ENUM('pending', 'active', 'suspended', 'closed') DEFAULT 'pending',
  kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  kyc_verified_at TIMESTAMP,
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  last_login TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

#### accounts

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  account_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Balance
  balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
  equity DECIMAL(18, 2) NOT NULL DEFAULT 0,
  used_margin DECIMAL(18, 2) DEFAULT 0,
  free_margin DECIMAL(18, 2) DEFAULT 0,
  
  -- Settings
  leverage INT DEFAULT 1,
  currency VARCHAR(3) DEFAULT 'USD',
  account_type ENUM('demo', 'live') DEFAULT 'demo',
  
  -- Tracking
  total_deposit DECIMAL(18, 2) DEFAULT 0,
  total_withdrawal DECIMAL(18, 2) DEFAULT 0,
  total_profit_loss DECIMAL(18, 2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
```

#### positions

```sql
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id),
  pair VARCHAR(7) NOT NULL,
  
  -- Order Details
  type ENUM('buy', 'sell') NOT NULL,
  entry_price DECIMAL(10, 5) NOT NULL,
  volume DECIMAL(10, 2) NOT NULL,
  leverage INT DEFAULT 1,
  
  -- Risk Management
  stop_loss DECIMAL(10, 5),
  take_profit DECIMAL(10, 5),
  
  -- Status
  status ENUM('open', 'closed', 'pending') DEFAULT 'open',
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP,
  
  -- P&L
  exit_price DECIMAL(10, 5),
  profit_loss DECIMAL(18, 2),
  profit_loss_pips INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_positions_account_id ON positions(account_id);
CREATE INDEX idx_positions_pair ON positions(pair);
CREATE INDEX idx_positions_status ON positions(status);
```

#### transactions

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id),
  
  -- Transaction Info
  type ENUM('deposit', 'withdrawal', 'trade', 'commission', 'bonus') NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  
  -- Status
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  
  -- Payment Method
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  
  -- Metadata
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_type ON transactions(type);
```

#### market_data

```sql
CREATE TABLE market_data (
  id BIGSERIAL PRIMARY KEY,
  pair VARCHAR(7) NOT NULL,
  
  -- OHLCV
  open DECIMAL(10, 5) NOT NULL,
  high DECIMAL(10, 5) NOT NULL,
  low DECIMAL(10, 5) NOT NULL,
  close DECIMAL(10, 5) NOT NULL,
  volume BIGINT,
  
  -- Metadata
  timeframe VARCHAR(5) NOT NULL, -- '1m', '5m', '1h', '1d'
  timestamp TIMESTAMP NOT NULL,
  
  UNIQUE(pair, timeframe, timestamp)
);

CREATE INDEX idx_market_data_pair_time ON market_data(pair, timestamp DESC);
CREATE INDEX idx_market_data_timeframe ON market_data(timeframe);
```

#### audit_logs

```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  
  -- Action Details
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

### Relationships Diagram

```
users
  ├── accounts (1:N)
  │   ├── positions (1:N)
  │   ├── transactions (1:N)
  │   └── market_data (N:M)
  └── audit_logs (1:N)
```

---

## 📚 Documentation Links

### Internal Documentation

- [**API Documentation**](./docs/API.md) - Complete API reference
- [**Database Guide**](./docs/DATABASE.md) - Schema and queries
- [**Architecture Overview**](./docs/ARCHITECTURE.md) - System design
- [**Deployment Guide**](./docs/DEPLOYMENT.md) - Production setup
- [**Configuration Guide**](./docs/CONFIGURATION.md) - Environment setup
- [**Contributing Guide**](./CONTRIBUTING.md) - Contribution guidelines

### External Resources

- [**Official Website**](https://xpert-hostinger.com)
- [**User Documentation**](https://docs.xpert-hostinger.com)
- [**API Reference**](https://api.xpert-hostinger.com/docs)
- [**Status Page**](https://status.xpert-hostinger.com)
- [**Community Forum**](https://community.xpert-hostinger.com)

### Technical Resources

- [React Documentation](https://react.dev)
- [Node.js Documentation](https://nodejs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Verify DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql -U postgres -d xpert_db -h localhost
```

#### 2. Redis Connection Error

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solution**:
```bash
# Check Redis status
redis-cli ping

# Start Redis
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:latest
```

#### 3. Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

#### 4. JWT Token Expired

**Problem**: `401 Unauthorized - Token expired`

**Solution**:
```javascript
// Use refresh token endpoint
POST /api/auth/refresh-token
{
  "refreshToken": "eyJhbGc..."
}

// Response: new access token
```

#### 5. CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
```javascript
// Update CORS in backend/src/app.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Restart backend
npm run dev
```

#### 6. Memory Leak in Production

**Problem**: `FATAL ERROR: CALL_AND_RETRY_LAST`

**Solution**:
```bash
# Check memory usage
node --max-old-space-size=4096 server.js

# Use memory profiling
clinic doctor -- npm start

# Check for unresolved promises
```

#### 7. Slow API Responses

**Problem**: Queries taking >1000ms

**Solution**:
```bash
# Check database logs
tail -f /var/log/postgresql/postgresql.log

# Enable query logging in .env
LOG_SLOW_QUERIES=true
SLOW_QUERY_THRESHOLD=500

# Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM positions WHERE pair = 'EUR/USD';

# Add missing indexes
CREATE INDEX idx_positions_pair_status ON positions(pair, status);
```

#### 8. WebSocket Connection Fails

**Problem**: `WebSocket connection failed`

**Solution**:
```bash
# Check WebSocket server
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:5000/ws

# Verify firewall rules
sudo ufw allow 5000

# Check WebSocket config
grep -r "websocket" backend/src/config.js
```

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run dev

# Run with specific debug namespace
DEBUG=xpert:* npm run dev

# Browser DevTools
F12 → Console tab for frontend logs
```

### Log Files Location

```
Backend Logs:  ./backend/logs/
Frontend Logs: Browser DevTools Console
Database Logs: /var/log/postgresql/
System Logs:   /var/log/syslog
```

---

## 🛠️ Maintenance Procedures

### Daily Maintenance

```bash
# Check system health
./scripts/health-check.sh

# Monitor error logs
tail -f logs/error.log

# Verify backup completion
ls -lh backups/
```

### Weekly Maintenance

```bash
# Database optimization
./scripts/db-optimize.sh

# Cache cleanup
redis-cli FLUSHDB

# Analyze performance metrics
./scripts/performance-report.sh

# Security scan
npm audit
pip check
```

### Monthly Maintenance

```bash
# Update dependencies
npm update
pip install --upgrade -r requirements.txt

# Database maintenance
./scripts/db-maintenance.sh

# Log rotation
logrotate /etc/logrotate.d/xpert-hostinger

# Security audit
./scripts/security-audit.sh
```

### Scheduled Tasks (Cron Jobs)

```cron
# Update market data every minute
* * * * * /app/scripts/update-market-data.sh

# Daily backup at 02:00 UTC
0 2 * * * /app/scripts/backup.sh

# Weekly cleanup at Sunday 03:00 UTC
0 3 * * 0 /app/scripts/cleanup.sh

# Monthly report generation at 1st of month, 04:00 UTC
0 4 1 * * /app/scripts/generate-report.sh

# Monitor disk space every 6 hours
0 */6 * * * /app/scripts/check-disk-space.sh
```

### Database Maintenance

#### Backup Procedures

```bash
# Daily backup
pg_dump xpert_db > backups/xpert_db_$(date +%Y%m%d).sql.gz

# Backup with compression
pg_dump --format=custom xpert_db > backups/xpert_db.dump

# Restore from backup
pg_restore -d xpert_db backups/xpert_db.dump

# Backup retention: keep last 30 days
find backups/ -name "*.sql.gz" -mtime +30 -delete
```

#### Index Maintenance

```sql
-- Analyze query performance
ANALYZE;

-- Reindex fragmented indexes
REINDEX INDEX CONCURRENTLY idx_positions_pair;

-- Check index bloat
SELECT schemaname, tablename, indexname, idx_blks_read, idx_blks_hit
FROM pg_stat_user_indexes
ORDER BY idx_blks_read DESC;
```

#### Vacuum and Autovacuum

```sql
-- Manual vacuum (recommended weekly)
VACUUM ANALYZE;

-- Check autovacuum configuration
SHOW autovacuum;
SHOW autovacuum_analyze_threshold;
SHOW autovacuum_vacuum_threshold;

-- Monitor vacuum runs
SELECT relname, last_vacuum, last_autovacuum, last_analyze
FROM pg_stat_user_tables
ORDER BY last_autovacuum DESC;
```

### Certificate Renewal

```bash
# Check SSL certificate expiration
openssl s_client -connect api.xpert-hostinger.com:443 -showcerts | grep "Not After"

# Renew Let's Encrypt certificate
certbot renew --force-renewal

# Test renewal process
certbot renew --dry-run
```

### Performance Optimization

#### Database Query Optimization

```sql
-- Identify slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Use EXPLAIN to analyze queries
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM positions WHERE pair = 'EUR/USD';

-- Add appropriate indexes
CREATE INDEX idx_positions_pair_status ON positions(pair, status)
WHERE status = 'open';
```

#### Redis Cache Optimization

```bash
# Monitor Redis memory
INFO memory

# Optimize Redis config
maxmemory 2gb
maxmemory-policy allkeys-lru

# Clear old cache entries
FLUSHALL

# Monitor Redis hit rate
INFO stats
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Code reviewed and tested
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage > 80%
- [ ] No security vulnerabilities (npm audit, OWASP scan)
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Documentation updated
- [ ] Performance tested and acceptable
- [ ] Rollback plan documented
- [ ] Team notified of deployment

### Deployment Steps

#### 1. Prepare Release

```bash
# Pull latest code
git pull origin main

# Run tests
npm test
npm run test:integration

# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

#### 2. Database Migration

```bash
# Test migration in staging
npm run db:migrate --env=staging

# Create backup before production migration
pg_dump xpert_db > backups/pre-deployment-backup.sql.gz

# Run migration in production
npm run db:migrate --env=production
```

#### 3. Deploy Services

```bash
# Deploy using Docker
docker-compose -f docker/docker-compose.yml up -d

# Or using Kubernetes
kubectl apply -f k8s/deployment.yaml

# Monitor deployment
kubectl rollout status deployment/xpert-backend
kubectl rollout status deployment/xpert-frontend
```

#### 4. Verify Deployment

```bash
# Health check
curl -s http://localhost:5000/health | jq .

# Run smoke tests
npm run test:smoke

# Monitor logs
docker logs xpert-backend
kubectl logs deployment/xpert-backend
```

#### 5. Post-Deployment

```bash
# Monitor performance metrics
# - Response times
# - Error rates
# - CPU/Memory usage

# Check user-facing functionality
# - Login flow
# - Trading functionality
# - Notifications

# Monitor for errors
tail -f logs/error.log
tail -f logs/access.log
```

### Post-Deployment Verification

- [ ] Application responding normally
- [ ] Database queries executing efficiently
- [ ] No increase in error rates
- [ ] Performance metrics within acceptable range
- [ ] Alerts and monitoring active
- [ ] Notifications working correctly
- [ ] Users able to trade without issues
- [ ] Admin panel functioning properly

### Rollback Procedure

```bash
# If issues detected, rollback to previous version
git revert HEAD

# Revert database (if applicable)
pg_restore -d xpert_db backups/pre-deployment-backup.sql.gz

# Restart services
docker-compose restart
# or
kubectl rollout undo deployment/xpert-backend
```

---

## 📝 Version History

### Version 2.5.0 (Current Release - 2025-12-19)

**Features:**
- Advanced technical analysis indicators (RSI, MACD, Bollinger Bands)
- Social trading integration
- Mobile app support
- WebSocket optimization for real-time data

**Improvements:**
- 35% faster order execution
- Reduced API latency by 40%
- Enhanced dashboard UI/UX
- Improved error messages

**Fixes:**
- Fixed memory leak in WebSocket connections
- Resolved race condition in order processing
- Fixed timezone handling for market hours

**Security:**
- Updated dependencies to latest versions
- Enhanced password hashing algorithm
- Added rate limiting for API endpoints

---

### Version 2.4.0 (2025-10-15)

**Features:**
- Risk calculator tool
- Economic calendar integration
- Email notifications for trades
- Two-factor authentication

**Improvements:**
- Optimized database queries
- Improved portfolio analytics
- Enhanced security audit logging

**Fixes:**
- Fixed equity calculation issues
- Resolved WebSocket reconnection problems

---

### Version 2.3.0 (2025-07-20)

**Features:**
- Demo account functionality
- Trade history export (CSV/PDF)
- Account statements

**Improvements:**
- Better handling of network disconnections
- Improved UI responsiveness

---

### Version 2.2.0 (2025-05-10)

**Features:**
- Multiple account support
- Portfolio management improvements
- Basic analytics dashboard

---

### Version 2.1.0 (2025-02-01)

**Features:**
- KYC verification system
- Withdrawal functionality
- User profile management

---

### Version 2.0.0 (2024-12-01)

**Major Release - Complete Platform Redesign**
- New modern UI
- Improved backend architecture
- PostgreSQL migration
- WebSocket implementation

---

### Version 1.0.0 (2024-01-15)

**Initial Release**
- Basic trading functionality
- User authentication
- Market data integration

---

## 🙏 Acknowledgments

### Contributors

We would like to thank all contributors who have helped build and improve Xpert Hostinger:

- **Development Team**: Core platform development and maintenance
- **QA Team**: Comprehensive testing and bug reports
- **Security Team**: Security audits and vulnerability assessments
- **DevOps Team**: Infrastructure and deployment management
- **Product Team**: Requirements gathering and roadmap planning

### Technologies Used

- [React.js](https://react.dev) - Frontend framework
- [Node.js](https://nodejs.org) - Backend runtime
- [Express.js](https://expressjs.com) - Web framework
- [PostgreSQL](https://www.postgresql.org) - Database
- [Redis](https://redis.io) - Caching layer
- [Docker](https://www.docker.com) - Containerization
- [Kubernetes](https://kubernetes.io) - Orchestration
- [Tailwind CSS](https://tailwindcss.com) - CSS framework

### Libraries and Dependencies

- **Authentication**: jsonwebtoken, bcrypt
- **Validation**: joi, express-validator
- **Real-time**: socket.io, ws
- **Database**: pg, sequelize
- **Testing**: Jest, Mocha, Chai
- **Monitoring**: Prometheus, Grafana
- **Logging**: Winston, Morgan

### Community

Special thanks to:
- Open source community for tools and libraries
- Users providing feedback and suggestions
- Community members reporting issues and helping others

### Support

For questions or issues:
- 📧 **Email**: support@xpert-hostinger.com
- 💬 **Discord**: [Join our community](https://discord.gg/xpert-hostinger)
- 📖 **Docs**: https://docs.xpert-hostinger.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/xpertforextradeinc/xpert-hostinger/issues)

---

## 📄 License

This project is proprietary software owned by Xpert Forex Trade Inc. All rights reserved.

For licensing inquiries, contact: legal@xpert-hostinger.com

---

## 🔗 Useful Links

- [Main Repository](https://github.com/xpertforextradeinc/xpert-hostinger)
- [Company Website](https://xpertforextradeinc.com)
- [Trading Platform](https://app.xpert-hostinger.com)
- [API Docs](https://api.xpert-hostinger.com/docs)
- [Status Page](https://status.xpert-hostinger.com)

---

**Last Updated**: December 19, 2025 (UTC)

**Maintained By**: Xpert Forex Trade Inc. Development Team

**Contact**: dev@xpertforextradeinc.com
