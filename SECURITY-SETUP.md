# Security Setup Guide

**Last Updated:** 2025-12-12

This guide provides comprehensive instructions for securely setting up and contributing to the Xpert Forex Trade Inc. project. Follow these guidelines to ensure proper security practices throughout development and deployment.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Getting API Keys](#getting-api-keys)
  - [Google Gemini AI](#google-gemini-ai)
  - [Flutterwave](#flutterwave)
  - [Paystack](#paystack)
  - [Exness](#exness)
  - [Slack](#slack)
- [GitHub Actions Setup](#github-actions-setup)
- [Security Best Practices](#security-best-practices)
- [Frontend vs Backend Security](#frontend-vs-backend-security)
- [Testing Configuration](#testing-configuration)
- [Support](#support)

---

## Quick Start

### Prerequisites
- Node.js v18+ installed
- Git installed and configured
- GitHub account with repository access
- Access to required third-party services

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xpertforextradeinc/xpert-hostinger.git
   cd xpert-hostinger
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment files:**
   ```bash
   # Backend environment file
   cp .env.example .env
   
   # Frontend environment file (if applicable)
   cp .env.local.example .env.local
   ```

4. **Configure your secrets** (see sections below)

5. **Verify setup:**
   ```bash
   npm run test
   ```

---

## Getting API Keys

### Google Gemini AI

Google Gemini is used for AI-powered trading insights and analysis.

1. **Visit Google AI Studio:**
   - Navigate to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy the generated API key

3. **Add to environment:**
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Important Notes:**
   - Keep your API key confidential
   - Monitor usage in Google Cloud Console
   - Set up billing alerts to avoid unexpected charges
   - Review [Gemini API pricing](https://ai.google.dev/pricing)

---

### Flutterwave

Flutterwave handles payment processing for African markets.

1. **Create Account:**
   - Visit [https://flutterwave.com/signup](https://flutterwave.com/signup)
   - Complete business verification

2. **Get API Keys:**
   - Log in to dashboard at [https://dashboard.flutterwave.com](https://dashboard.flutterwave.com)
   - Navigate to Settings → API
   - Copy both Test and Live keys

3. **Add to environment:**
   ```bash
   # Development
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxx
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxx
   
   # Production (GitHub Secrets only)
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxx
   FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxx
   ```

4. **Configure Webhooks:**
   - Settings → Webhooks
   - Add URL: `https://your-domain.com/api/webhooks/flutterwave`
   - Copy the webhook secret hash
   - Add to environment: `FLUTTERWAVE_WEBHOOK_SECRET=your_hash`

---

### Paystack

Paystack is an alternative payment processor.

1. **Create Account:**
   - Visit [https://paystack.com/signup](https://paystack.com/signup)
   - Complete KYC verification

2. **Get API Keys:**
   - Log in to [https://dashboard.paystack.com](https://dashboard.paystack.com)
   - Navigate to Settings → API Keys & Webhooks
   - Copy Test and Live keys

3. **Add to environment:**
   ```bash
   # Development
   PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxx
   PAYSTACK_SECRET_KEY=sk_test_xxxxxxxx
   
   # Production (GitHub Secrets only)
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxx
   PAYSTACK_SECRET_KEY=sk_live_xxxxxxxx
   ```

4. **Configure Webhooks:**
   - Settings → API Keys & Webhooks → Webhooks
   - Add URL: `https://your-domain.com/api/webhooks/paystack`
   - Add to environment: `PAYSTACK_WEBHOOK_SECRET=your_secret`

---

### Exness

Exness provides forex trading data and integrations.

1. **Create Trading Account:**
   - Visit [https://www.exness.com](https://www.exness.com)
   - Sign up for a trading account
   - Complete account verification

2. **Get API Credentials:**
   - Access Personal Area
   - Navigate to API section
   - Generate API credentials

3. **Add to environment:**
   ```bash
   EXNESS_API_KEY=your_api_key
   EXNESS_API_SECRET=your_api_secret
   EXNESS_ACCOUNT_ID=your_account_id
   ```

4. **Important Notes:**
   - Use demo account for development
   - Never commit live trading credentials
   - Implement proper risk management

---

### Slack

Slack is used for notifications and alerts.

1. **Create Slack App:**
   - Visit [https://api.slack.com/apps](https://api.slack.com/apps)
   - Click "Create New App"
   - Choose "From scratch"
   - Name your app and select workspace

2. **Configure Permissions:**
   - Navigate to OAuth & Permissions
   - Add Bot Token Scopes:
     - `chat:write`
     - `chat:write.public`
     - `files:write`
   - Install app to workspace

3. **Get Tokens:**
   - Copy Bot User OAuth Token
   - Copy Signing Secret from Basic Information

4. **Add to environment:**
   ```bash
   SLACK_BOT_TOKEN=xoxb-your-token
   SLACK_SIGNING_SECRET=your_signing_secret
   SLACK_CHANNEL_ID=C0123456789  # Your channel ID
   ```

5. **Configure Webhooks (Optional):**
   - Enable Incoming Webhooks
   - Add webhook URL to environment: `SLACK_WEBHOOK_URL=https://hooks.slack.com/...`

---

## GitHub Actions Setup

### Required Secrets

Add these secrets to your GitHub repository:

1. **Navigate to Repository Settings:**
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"

2. **Add Production Secrets:**
   ```
   GEMINI_API_KEY
   FLUTTERWAVE_PUBLIC_KEY
   FLUTTERWAVE_SECRET_KEY
   FLUTTERWAVE_WEBHOOK_SECRET
   PAYSTACK_PUBLIC_KEY
   PAYSTACK_SECRET_KEY
   PAYSTACK_WEBHOOK_SECRET
   EXNESS_API_KEY
   EXNESS_API_SECRET
   EXNESS_ACCOUNT_ID
   SLACK_BOT_TOKEN
   SLACK_SIGNING_SECRET
   SLACK_CHANNEL_ID
   DATABASE_URL
   JWT_SECRET
   ENCRYPTION_KEY
   ```

3. **Add Deployment Secrets:**
   ```
   HOSTINGER_FTP_HOST
   HOSTINGER_FTP_USERNAME
   HOSTINGER_FTP_PASSWORD
   HOSTINGER_SSH_KEY  # If using SSH
   ```

### Environment Variables

For non-sensitive configuration, use repository variables:

```
NODE_ENV=production
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com
LOG_LEVEL=info
```

### GitHub Actions Workflow

Example workflow snippet for secure deployments:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run security audit
        run: npm audit --audit-level=moderate
        
      - name: Run tests
        run: npm test
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          # Add other secrets as needed
          
      - name: Build
        run: npm run build
        
      - name: Deploy
        env:
          FTP_HOST: ${{ secrets.HOSTINGER_FTP_HOST }}
          FTP_USERNAME: ${{ secrets.HOSTINGER_FTP_USERNAME }}
          FTP_PASSWORD: ${{ secrets.HOSTINGER_FTP_PASSWORD }}
        run: npm run deploy
```

---

## Security Best Practices

### 1. Secret Management

**DO:**
- ✅ Store all secrets in environment variables or GitHub Secrets
- ✅ Use different keys for development, staging, and production
- ✅ Rotate API keys regularly (quarterly recommended)
- ✅ Use `.env.example` to document required variables (without values)
- ✅ Implement secret scanning in CI/CD pipelines

**DON'T:**
- ❌ Commit `.env` files to version control
- ❌ Share secrets via email, chat, or public channels
- ❌ Use production keys in development
- ❌ Hardcode secrets in source code
- ❌ Log sensitive information

### 2. Code Security

**Dependencies:**
```bash
# Regular security audits
npm audit
npm audit fix

# Use dependabot for automated updates
# Check .github/dependabot.yml
```

**Input Validation:**
```javascript
// Always validate and sanitize user input
const validator = require('validator');

function sanitizeInput(input) {
  return validator.escape(input.trim());
}
```

**SQL Injection Prevention:**
```javascript
// Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [userEmail]);
```

### 3. Authentication & Authorization

**JWT Best Practices:**
```javascript
// Use strong secrets
JWT_SECRET=<generate-with-openssl-rand-base64-64>

// Set appropriate expiration
const token = jwt.sign(payload, secret, { 
  expiresIn: '1h',
  algorithm: 'HS256'
});

// Validate on every request
middleware.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 4. HTTPS & SSL

- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Implement HSTS headers
- Use strong TLS configurations (TLS 1.2+)

### 5. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### 6. CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://your-domain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 7. Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet());

// Custom CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

### 8. Error Handling

```javascript
// Don't expose stack traces in production
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
    
  res.status(500).json({ error: message });
});
```

### 9. Logging & Monitoring

```javascript
// Log security events
logger.warn('Failed login attempt', {
  ip: req.ip,
  email: req.body.email,
  timestamp: new Date()
});

// Monitor for suspicious activity
// Set up alerts for:
// - Multiple failed login attempts
// - Unusual API usage patterns
// - Unauthorized access attempts
```

### 10. Data Encryption

```javascript
// Encrypt sensitive data at rest
const crypto = require('crypto');

function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## Frontend vs Backend Security

### Frontend Security

**Environment Variables:**
```bash
# Use NEXT_PUBLIC_ prefix for client-side variables
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx

# These are exposed to the browser - never put secrets here!
```

**Security Measures:**
- Only expose necessary public keys
- Implement client-side validation (but always validate server-side)
- Use Content Security Policy
- Sanitize user input before rendering
- Implement XSS protection
- Use HTTPS for all API calls

**Example React Component:**
```javascript
import DOMPurify from 'isomorphic-dompurify';

function UserComment({ comment }) {
  const sanitized = DOMPurify.sanitize(comment);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### Backend Security

**Environment Variables:**
```bash
# Backend secrets - NEVER expose to frontend
GEMINI_API_KEY=secret_key
FLUTTERWAVE_SECRET_KEY=secret_key
PAYSTACK_SECRET_KEY=secret_key
DATABASE_URL=postgresql://...
JWT_SECRET=secret
ENCRYPTION_KEY=secret
```

**Security Measures:**
- All secrets stay on the server
- Implement authentication middleware
- Use parameterized database queries
- Validate and sanitize all inputs
- Implement rate limiting
- Log security events
- Encrypt sensitive data

**API Endpoint Security:**
```javascript
// Protected endpoint example
router.post('/api/payment', 
  authenticate,           // Verify JWT
  authorize(['admin']),   // Check permissions
  validateInput,          // Validate request body
  async (req, res) => {
    // Process with backend secret keys
    const payment = await processPayment(
      req.body,
      process.env.PAYSTACK_SECRET_KEY
    );
    res.json(payment);
  }
);
```

---

## Testing Configuration

### Local Testing

1. **Create test environment file:**
   ```bash
   cp .env.example .env.test
   ```

2. **Use test API keys:**
   ```bash
   # .env.test
   NODE_ENV=test
   GEMINI_API_KEY=test_key
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
   PAYSTACK_PUBLIC_KEY=pk_test_xxx
   PAYSTACK_SECRET_KEY=sk_test_xxx
   DATABASE_URL=postgresql://localhost/test_db
   ```

3. **Run tests:**
   ```bash
   npm test
   npm run test:coverage
   ```

### Security Testing

**Dependency Scanning:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check outdated packages
npm outdated
```

**Static Code Analysis:**
```bash
# Install security linter
npm install --save-dev eslint-plugin-security

# Run security checks
npm run lint:security
```

**Secrets Scanning:**
```bash
# Install git-secrets
brew install git-secrets  # macOS
# or download from: https://github.com/awslabs/git-secrets

# Setup hooks
git secrets --install
git secrets --register-aws

# Scan repository
git secrets --scan
```

### CI/CD Testing

GitHub Actions automatically runs:
- Unit tests
- Integration tests
- Security audits
- Dependency checks
- Secrets scanning

---

## Support

### Getting Help

**Documentation:**
- [Project README](README.md)
- [API Documentation](docs/API.md)
- [Contributing Guidelines](CONTRIBUTING.md)

**Communication Channels:**
- **Slack:** [Join workspace](https://xpertforextrade.slack.com)
- **Email:** support@xpertforextrade.com
- **Issues:** [GitHub Issues](https://github.com/xpertforextradeinc/xpert-hostinger/issues)

### Reporting Security Vulnerabilities

**DO NOT** open public GitHub issues for security vulnerabilities.

Instead:
1. Email security@xpertforextrade.com
2. Include detailed description
3. Provide steps to reproduce
4. Wait for acknowledgment (within 48 hours)

### Security Incident Response

If you discover a security incident:
1. **Immediately** revoke compromised credentials
2. Notify the security team
3. Document what happened
4. Follow incident response procedures

### Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Hostinger Security Guidelines](https://www.hostinger.com/tutorials/security)

---

## Checklist for New Contributors

Before you start contributing, ensure you have:

- [ ] Cloned the repository
- [ ] Installed dependencies
- [ ] Created `.env` file with test credentials
- [ ] Obtained necessary API keys for development
- [ ] Read the security best practices
- [ ] Configured Git to prevent secret commits
- [ ] Run tests successfully
- [ ] Joined the Slack workspace
- [ ] Read CONTRIBUTING.md
- [ ] Understand frontend vs backend security

---

## License

This security setup guide is part of the Xpert Forex Trade Inc. project.
All rights reserved © 2025 Xpert Forex Trade Inc.

---

**Remember:** Security is everyone's responsibility. When in doubt, ask questions!
