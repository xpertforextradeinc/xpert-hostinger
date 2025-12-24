#!/bin/bash

set -e

echo "🚀 Setting up Xpert Forex Trade Wiki..."

# Clone the wiki repository
echo "📥 Cloning wiki repository..."
git clone https://github.com/xpertforextradeinc/xpert-hostinger.wiki.git
cd xpert-hostinger.wiki

# Create Home.md
echo "📄 Creating Home.md..."
cat > Home.md << 'EOF'
# 📊 Xpert Forex Trade Wiki

**Professional Forex Trading Signals & Education Platform**

Welcome to the official documentation for the Xpert Forex Trade platform — your hub for trading signals, educational content, and affiliate monetization. 

---

## 🚀 Quick Navigation

| Section | Description |
|---------|-------------|
| **[Getting Started](./Getting-Started)** | Contributor onboarding & setup |
| **[API Integration](./API-Integration)** | Exness, Flutterwave, Paystack, Slack |
| **[Deployment Guide](./Deployment)** | GitHub Actions, Pages, Hostinger |
| **[Code Standards](./Code-Standards)** | Style guide & best practices |
| **[Troubleshooting](./Troubleshooting)** | Common issues & solutions |
| **[Contributing](./Contributing)** | How to contribute to the project |

---

## 🎯 Platform Overview

**Tech Stack:**
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (optional)
- **Hosting:** Hostinger, GitHub Pages
- **Automation:** GitHub Actions, Slack API
- **Monetization:** Exness affiliate, Amazon Associates
- **Payment:** Flutterwave, Paystack

**Key Features:**
- Real-time Forex trading signals
- Educational content automation
- Affiliate link tracking
- Contributor dashboard
- Social media caption rotators
- Ad campaign integration

---

## 📂 Repository Structure

```
xpert-hostinger/
├── assets/              # Images, fonts, branding
├── scripts/             # Automation scripts
├── workflows/           # GitHub Actions
├── templates/           # Reusable HTML components
├── docs/                # Additional documentation
├── .env.example         # Environment variable template
└── README.md
```

---

## 🔗 External Links

- **Live Site:** [xpertforextrad.eu](https://xpertforextrad.eu)
- **Repository:** [xpertforextradeinc/xpert-hostinger](https://github.com/xpertforextradeinc/xpert-hostinger)
- **Issues:** [Report bugs](https://github.com/xpertforextradeinc/xpert-hostinger/issues)
- **Discussions:** [Community forum](https://github.com/xpertforextradeinc/xpert-hostinger/discussions)

---

**Need help?** Join our Slack workspace or open an [issue](https://github.com/xpertforextradeinc/xpert-hostinger/issues/new).
EOF

# Create Getting-Started.md
echo "📄 Creating Getting-Started.md..."
cat > Getting-Started.md << 'EOF'
# 🚀 Getting Started

**Onboarding guide for contributors and developers**

---

## ✅ Prerequisites

- **Git** installed ([Download](https://git-scm.com/))
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **GitHub account** with access to the repo
- **Code editor** (VS Code recommended)

---

## 📥 Clone the Repository

```bash
git clone https://github.com/xpertforextradeinc/xpert-hostinger.git
cd xpert-hostinger
```

---

## 🔧 Environment Setup

### 1. Copy environment template

```bash
cp .env.example .env
```

### 2. Configure API keys

Edit `.env` with your credentials:

```bash
# Exness Affiliate
EXNESS_AFFILIATE_ID=your_affiliate_id

# Slack Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Gemini Content API
GEMINI_API_KEY=your_gemini_api_key

# Payment Gateways
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_key
PAYSTACK_PUBLIC_KEY=your_paystack_key

# Amazon Associates
AMAZON_TRACKING_ID=your_amazon_tracking_id
```

---

## 📦 Install Dependencies

```bash
npm install
```

**For Python scripts:**

```bash
pip install -r requirements.txt
```

---

## 🏃 Run Locally

```bash
npm start
# or
python -m http.server 8000
```

Visit: `http://localhost:8000`

---

## 🔄 Branching Strategy

| Branch | Purpose |
|--------|---------|
| `master` | Production-ready code |
| `develop` | Integration branch |
| `feature/*` | New features |
| `bugfix/*` | Bug fixes |
| `hotfix/*` | Urgent production fixes |

**Create a feature branch:**

```bash
git checkout -b feature/your-feature-name
```

---

## 📤 Submit Changes

```bash
# Stage changes
git add .

# Commit with semantic message
git commit -m "feat: add trading signal widget"

# Push to your branch
git push origin feature/your-feature-name
```

**Open a Pull Request** from GitHub UI.

---

## 📚 Next Steps

- Read **[Code Standards](./Code-Standards)** for style guide
- Check **[API Integration](./API-Integration)** for external services
- Review **[Deployment](./Deployment)** for publishing workflows

---

**Questions?** Open a [discussion](https://github.com/xpertforextradeinc/xpert-hostinger/discussions).
EOF

# Create API-Integration.md
echo "📄 Creating API-Integration.md..."
cat > API-Integration.md << 'EOF'
# 🔌 API Integration

**Guide for integrating external services**

---

## 📡 Available APIs

| Service | Purpose | Docs |
|---------|---------|------|
| **Exness** | Affiliate tracking | [API Docs](https://exness.com/partners/) |
| **Flutterwave** | Payment processing | [API Docs](https://developer.flutterwave.com/) |
| **Paystack** | Payment processing | [API Docs](https://paystack.com/docs/api/) |
| **Slack** | Notifications | [API Docs](https://api.slack.com/) |
| **Gemini** | Content generation | [API Docs](https://ai.google.dev/docs) |
| **Amazon Associates** | Affiliate links | [API Docs](https://affiliate-program.amazon.com/) |

---

## 🏦 Exness Affiliate API

**Purpose:** Track affiliate conversions and commissions

### Example: Generate affiliate link

```javascript
const exnessAffiliateLink = (campaignId) => {
  const affiliateId = process.env.EXNESS_AFFILIATE_ID;
  return `https://one.exness-track.com/a/${affiliateId}?campaign=${campaignId}`;
};

console.log(exnessAffiliateLink('forex-signals-2025'));
```

**Environment Variable:**

```bash
EXNESS_AFFILIATE_ID=your_affiliate_id
```

---

## 💳 Flutterwave Integration

**Purpose:** Accept payments for premium signals

### Example: Initialize payment

```javascript
const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

const payload = {
  tx_ref: `txn-${Date.now()}`,
  amount: 50,
  currency: 'USD',
  redirect_url: 'https://xpertforextrad.eu/verify',
  customer: {
    email: 'user@example.com',
    name: 'John Trader'
  },
  customizations: {
    title: 'Premium Forex Signals',
    description: 'Monthly subscription'
  }
};

flw.Charge.card(payload).then(console.log);
```

**Environment Variables:**

```bash
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxx
```

---

## 🔔 Slack Notifications

**Purpose:** Real-time alerts for trades, errors, and events

### Example: Send trade signal alert

```javascript
const axios = require('axios');

const sendSlackAlert = async (message) => {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: message,
    username: 'Xpert Forex Bot',
    icon_emoji: ':chart_with_upwards_trend:'
  });
};

sendSlackAlert('🚀 New trade signal: BUY EUR/USD @ 1.0850');
```

**Environment Variable:**

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

## 🤖 Gemini Content API

**Purpose:** Auto-generate educational content

### Example: Generate trading tip

```python
import os
import google.generativeai as genai

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

model = genai.GenerativeModel('gemini-pro')
response = model.generate_content('Write a 50-word Forex trading tip for beginners')

print(response.text)
```

**Environment Variable:**

```bash
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🛒 Amazon Associates

**Purpose:** Monetize via book/course recommendations

### Example: Generate product link

```javascript
const amazonLink = (asin, tag) => {
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
};

console.log(amazonLink('B08N5WRWNW', 'xpertforex-20'));
// Output: https://www.amazon.com/dp/B08N5WRWNW?tag=xpertforex-20
```

**Environment Variable:**

```bash
AMAZON_TRACKING_ID=xpertforex-20
```

---

## 🔒 Security Best Practices

✅ **Never commit API keys to Git**  
✅ **Use GitHub Actions secrets for CI/CD**  
✅ **Rotate keys quarterly**  
✅ **Validate webhook signatures**  
✅ **Log all API errors to Slack**

---

**Next:** Check [Deployment Guide](./Deployment) for automation setup.
EOF

echo "✅ Wiki pages 1-3 created successfully!"
echo "📤 Committing and pushing to GitHub..."

git add .
git commit -m "docs: initialize comprehensive wiki structure"
git push origin master

cd ..
rm -rf xpert-hostinger.wiki

echo "✅ Wiki setup complete!"
echo "🌐 Visit: https://github.com/xpertforextradeinc/xpert-hostinger/wiki"
