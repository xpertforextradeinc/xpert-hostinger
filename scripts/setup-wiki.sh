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

echo "✅ Home.md created"

# Add all files
git add .

# Commit
git commit -m "docs: initialize wiki with Home page"

# Push to GitHub
git push origin master

# Cleanup
cd ..
rm -rf xpert-hostinger.wiki

echo "✅ Wiki setup complete!"
echo "🌐 Visit: https://github.com/xpertforextradeinc/xpert-hostinger/wiki"
