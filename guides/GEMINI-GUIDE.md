# 🤖 Gemini AI API Setup for Automated Trading Signals

## What This Does
- Generates **5 realistic trading signals daily** automatically
- Uses Google's Gemini AI (smarter than ChatGPT for technical analysis)
- **100% FREE** (2 million tokens/month included)
- Updates your website via GitHub Actions at 6 AM UTC daily

---

## Step 1: Get Your Gemini API Key

### Create Google Account (if needed)
1. Visit: https://accounts.google.com
2. Create account or use existing Gmail

### Get API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Click **"Get API Key"**
3. Click **"Create API Key in New Project"**
4. Copy your key (starts with `AIza...`)

**⚠️ IMPORTANT:** Save this key securely! Don't share it publicly.

---

## Step 2: Add Key to GitHub Secrets

### Create GitHub Repository
If you haven't already:
1. Visit: https://github.com/new
2. Repository name: `xpert-hostinger`
3. Make it **Private**
4. Click **"Create repository"**

### Upload Your Code
```bash
cd c:\Users\USER\Projects\xpert-hostinger
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/xpert-hostinger.git
git push -u origin main
```

### Add Secrets
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

#### Secret 1: GEMINI_API_KEY
- **Name:** `GEMINI_API_KEY`
- **Value:** Your Gemini API key (AIza...)
- Click **"Add secret"**

#### Secret 2: HOSTINGER_HOST
- **Name:** `HOSTINGER_HOST`
- **Value:** `srv1.hostinger.com` (or your actual host)
- Click **"Add secret"**

#### Secret 3: HOSTINGER_USER
- **Name:** `HOSTINGER_USER`
- **Value:** `u404533250` (your cPanel username)
- Click **"Add secret"**

#### Secret 4: HOSTINGER_PASSWORD
- **Name:** `HOSTINGER_PASSWORD`
- **Value:** Your Hostinger cPanel password
- Click **"Add secret"**

#### Secret 5: SLACK_WEBHOOK (Optional)
- **Name:** `SLACK_WEBHOOK`
- **Value:** Your Slack webhook URL (if you use Slack)
- Click **"Add secret"**

---

## Step 3: Test Signal Generation Locally

### Install Node.js
1. Download: https://nodejs.org
2. Install LTS version
3. Verify installation:
```bash
node --version
npm --version
```

### Test Script
```bash
cd c:\Users\USER\Projects\xpert-hostinger

# Set environment variable (Windows)
set GEMINI_API_KEY=YOUR_KEY_HERE

# Run script
node scripts/generate-signals.js
```

**Expected Output:**
```
✅ Generated 5 signals
[
  {
    "pair": "EUR/USD",
    "direction": "buy",
    "entry": "1.0850",
    "tp": "1.0920",
    "sl": "1.0820",
    "analysis": "Bullish momentum on H4 chart",
    "time": "09:30 AM",
    "date": "2024-12-01"
  },
  ...
]
```

This creates `data/signals.json` file.

---

## Step 4: Enable GitHub Actions

### Push Workflow File
Your workflow file is already created at:
`.github/workflows/generate-signals.yml`

Push it to GitHub:
```bash
git add .github/workflows/generate-signals.yml
git commit -m "Add daily signal generation workflow"
git push
```

### Enable Actions
1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **"I understand my workflows, go ahead and enable them"**

### Test Workflow Manually
1. Click **"Generate Daily Trading Signals"**
2. Click **"Run workflow"** → **"Run workflow"**
3. Wait 1-2 minutes
4. Check if signals.json was created

---

## Step 5: Verify Automated Schedule

### Check Workflow Runs
1. Go to **Actions** tab
2. You should see workflow run at **6:00 AM UTC daily**
3. Click on any run to see details

### What Happens Daily:
1. **6:00 AM UTC** - Workflow triggers
2. Gemini AI generates 5 fresh signals
3. Signals uploaded to your Hostinger via SFTP
4. File saved as `/data/signals.json`
5. Your website automatically displays new signals

---

## Step 6: Display Signals on Website

### Add Signals Container to index.html

Find your signals section and add:

```html
<section id="signals">
    <h2>🔥 Today's Premium Signals</h2>
    <p class="section-subtitle">Updated Daily at 6 AM UTC</p>
    
    <!-- Countdown Timer -->
    <div style="text-align: center; margin: 2rem 0;">
        <strong>Next Update In:</strong>
        <span id="countdown" style="font-size: 2rem; color: var(--accent);">--:--:--</span>
    </div>
    
    <!-- Signals Container -->
    <div id="signals-container" class="signals-grid">
        <p>Loading signals...</p>
    </div>
    
    <div class="upgrade-cta">
        <h3>Want Full Signal Details?</h3>
        <p>Get Take Profit, Stop Loss, and real-time updates</p>
        <a href="#pricing" class="btn btn-primary">Upgrade to VIP - $29/month</a>
    </div>
</section>
```

### Add Required CSS

Already included in your `css/style.css`, but verify:

```css
.signals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.signal-card {
    background: var(--white);
    border: 2px solid var(--gray);
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 4px solid var(--accent);
}

.signal-pair {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--primary);
}

.signal-direction {
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
}

.signal-direction.buy {
    background: #d1fae5;
    color: #065f46;
}

.signal-direction.sell {
    background: #fee2e2;
    color: #991b1b;
}

.blurred {
    filter: blur(5px);
    user-select: none;
}
```

### Include Signal Script

In your `index.html`, add before `</body>`:

```html
<script src="js/signals.js"></script>
```

---

## Step 7: Customize Signal Generation

### Edit Prompt (Optional)

Open `scripts/generate-signals.js` and customize:

```javascript
const prompt = `You are a professional forex analyst with 10+ years experience.

Generate 5 HIGH-QUALITY trading signals for ${new Date().toLocaleDateString()}.

Requirements:
- Use REAL current market prices (check forex.com for reference)
- Focus on major pairs: EUR/USD, GBP/USD, USD/JPY, XAU/USD
- Include both BUY and SELL signals (mix them)
- Entry prices must be realistic
- TP: 30-100 pips profit
- SL: 20-50 pips risk
- Add brief technical analysis (support/resistance, trends)

Format as JSON array:
[{
  "pair": "EUR/USD",
  "direction": "buy",
  "entry": "1.0850",
  "tp": "1.0920",
  "sl": "1.0820",
  "analysis": "Bullish momentum above 200 EMA, targeting resistance at 1.0920"
}]

Current market date: ${new Date().toISOString().split('T')[0]}`;
```

### Change Schedule

Edit `.github/workflows/generate-signals.yml`:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'    # 6 AM UTC
    - cron: '0 18 * * *'   # 6 PM UTC (add second daily update)
```

---

## Step 8: Monitor API Usage

### Check Quota
1. Visit: https://makersuite.google.com/app/apikey
2. Click on your API key
3. View usage dashboard

### Free Tier Limits
- **Requests:** 60 per minute
- **Tokens:** 2 million per month
- **Cost:** $0 (100% FREE)

**Your usage:**
- 1 signal generation = ~2,000 tokens
- Daily = 2,000 tokens
- Monthly = 60,000 tokens
- **Well within free tier!**

---

## Step 9: Advanced Features

### Add More Currency Pairs

```javascript
const pairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY',
    'XAU/USD', 'GBP/JPY', 'USD/CAD',
    'AUD/USD', 'NZD/USD', 'EUR/GBP'
];

// Generate 10 signals instead of 5
const prompt = `Generate 10 signals from these pairs: ${pairs.join(', ')}`;
```

### Add Technical Indicators

```javascript
const prompt = `Generate signals with:
- RSI reading
- MACD status
- Moving average crossovers
- Support/resistance levels
- Risk-reward ratio`;
```

### Save Historical Signals

```javascript
// In generate-signals.js
const filename = `data/signals-${new Date().toISOString().split('T')[0]}.json`;
fs.writeFileSync(filename, JSON.stringify(enrichedSignals, null, 2));
```

---

## Troubleshooting

### Issue: "API key not valid"
**Fix:** 
1. Verify key is correct (no extra spaces)
2. Enable Generative Language API in Google Cloud Console
3. Wait 5 minutes for activation

### Issue: "Quota exceeded"
**Fix:** You hit the limit. Reset happens monthly or upgrade to paid tier.

### Issue: Signals not updating on website
**Fix:**
1. Check GitHub Actions log for errors
2. Verify SFTP credentials are correct
3. Ensure `data` folder exists on Hostinger
4. Check file permissions (755)

### Issue: GitHub Actions not running
**Fix:**
1. Enable Actions in repository settings
2. Check workflow file syntax (YAML is strict)
3. Verify all secrets are added
4. Try manual trigger first

---

## Alternative: Manual Signal Updates

If automation fails, you can generate signals manually:

```bash
# Windows
set GEMINI_API_KEY=your_key
node scripts/generate-signals.js

# Upload to Hostinger via FileZilla
# File: data/signals.json → /public_html/data/
```

---

## Bonus: Add Email Notifications

### Get Notified When Signals Generated

Add to workflow:

```yaml
- name: Send Email Notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: ✅ New Trading Signals Generated
    body: Check your website for fresh signals!
    to: your@email.com
    from: signals@xpertforextrad.eu
```

---

## Next Steps

After Gemini setup:
1. Setup **"TELEGRAM"** channel for instant alerts
2. Configure **"EMAIL"** sequences for conversions
3. Monitor performance and optimize prompts

Your site now has AUTOMATED daily signals! 🚀
