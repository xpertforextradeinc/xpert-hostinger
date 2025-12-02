# Deploy to Hostinger - Production Deployment Guide

## 🚀 Quick Deploy Checklist

### 1. Update Production URLs

**Edit `js/bot-integration.js` and `js/signal-history.js`:**
```javascript
// Change from:
const BOT_API_URL = 'http://localhost:8080';

// To your production URL (choose one):
const BOT_API_URL = 'https://api.xpertforextrad.eu';  // Subdomain
// OR
const BOT_API_URL = 'https://xpertforextrad.eu/api';  // Path-based
```

### 2. Add Production Keys

**Edit `index.html`:**
- Replace `ca-pub-XXXXXXXXXX` with your Google AdSense ID
- Replace `YOUR_PIXEL_ID` with your Facebook Pixel ID

**Edit `js/payments.js`:**
- Replace `FLWPUBK-xxxxxxxxxxxxxxxxxxxx-X` with your Flutterwave public key

### 3. Deploy Bot to Production

Choose your deployment method:

---

## Option A: Google Cloud Run (Recommended - Free Tier)

### Setup:
```powershell
# 1. Install Google Cloud SDK if not already installed
# Download from: https://cloud.google.com/sdk/docs/install

# 2. Authenticate
gcloud auth login
gcloud config set project xpert-forex-trade

# 3. Build and deploy
cd C:\Users\USER\Projects\xpert-hostinger\scripts
gcloud builds submit --tag gcr.io/xpert-forex-trade/bot-server
gcloud run deploy bot-server `
  --image gcr.io/xpert-forex-trade/bot-server `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1
```

### After Deploy:
You'll get a URL like: `https://bot-server-xxxxx-uc.a.run.app`

Update your website files:
```javascript
const BOT_API_URL = 'https://bot-server-xxxxx-uc.a.run.app';
```

---

## Option B: Deploy to Hostinger VPS

### Prerequisites:
Your Hostinger account needs Python support (VPS/Business plan)

### Steps:
```powershell
# 1. Upload bot files via SFTP
# Files already auto-upload via VS Code SFTP extension
# Just make sure scripts/ folder is uploaded

# 2. SSH to your server
ssh u404533250@157.173.208.8

# 3. Install Python and dependencies
cd /home/u404533250/bot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Run bot with supervisor (keeps it running)
sudo nano /etc/supervisor/conf.d/bot-server.conf
```

**Supervisor config:**
```ini
[program:bot-server]
command=/home/u404533250/bot/venv/bin/python /home/u404533250/bot/bot-server.py
directory=/home/u404533250/bot
user=u404533250
autostart=true
autorestart=true
stderr_logfile=/var/log/bot-server.err.log
stdout_logfile=/var/log/bot-server.out.log
```

```bash
# Start supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start bot-server
```

### Update NGINX for API subdomain:
```bash
sudo nano /etc/nginx/sites-available/api.xpertforextrad.eu
```

```nginx
server {
    listen 80;
    server_name api.xpertforextrad.eu;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header Access-Control-Allow-Origin *;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/api.xpertforextrad.eu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Option C: Keep Bot on Your PC (Simple)

### Run 24/7 on Windows:

**Create PowerShell script: `start-bot.ps1`**
```powershell
cd C:\Users\USER\Projects\xpert-hostinger\scripts
python bot-server.py
```

**Create Windows Task Scheduler:**
```powershell
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\Users\USER\Projects\xpert-hostinger\scripts\start-bot.ps1"
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -LogonType S4U
Register-ScheduledTask -TaskName "XpertForexBot" -Action $action -Trigger $trigger -Principal $principal -Description "Xpert Forex Trading Bot Server"
```

**Expose via ngrok (temporary URL):**
```powershell
# Install ngrok: https://ngrok.com/download
ngrok http 8080
```
You'll get: `https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app`

Update website:
```javascript
const BOT_API_URL = 'https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app';
```

---

## 4. Upload Website to Hostinger

### Via VS Code SFTP (Automatic):
- Files auto-upload on save
- Check `.vscode/sftp.json` is configured
- Save any file to trigger upload

### Manual Upload via FileZilla:
```
Host: 157.173.208.8
Port: 65002
Username: u404533250
Password: [your password]

Upload to: /home/u404533250/domains/xpertforextrad.eu/public_html/
```

Upload these files:
- ✅ index.html
- ✅ signals-history.html
- ✅ css/style.css
- ✅ js/*.js (all JavaScript files)
- ✅ pages/*.html
- ✅ images/ (if you have logos)

---

## 5. Testing Production Site

### Check List:
```powershell
# Test bot API
curl https://your-bot-url.com/health
curl https://your-bot-url.com/signals

# Test website
Start-Process https://xpertforextrad.eu
Start-Process https://xpertforextrad.eu/signals-history.html
```

### Browser Testing:
1. Visit https://xpertforextrad.eu
2. Check signals load (should see 🟢 LIVE indicators)
3. Click "History" in navigation
4. Enable notifications
5. Verify filters work
6. Check mobile responsive design

---

## 6. Post-Deployment Tasks

### Analytics Setup:
1. **Google Analytics:** Add tracking code to all pages
2. **Google Search Console:** Submit sitemap.xml
3. **Facebook Pixel:** Verify events firing

### SEO Optimization:
```powershell
# Create sitemap.xml
@"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://xpertforextrad.eu/</loc><priority>1.0</priority></url>
  <url><loc>https://xpertforextrad.eu/signals-history.html</loc><priority>0.8</priority></url>
  <url><loc>https://xpertforextrad.eu/pages/forex-basics.html</loc><priority>0.7</priority></url>
  <url><loc>https://xpertforextrad.eu/pages/risk-management.html</loc><priority>0.7</priority></url>
</urlset>
"@ | Out-File -FilePath sitemap.xml
```

### Monitor Performance:
- Google Lighthouse (aim for 90+ score)
- GTmetrix for speed analysis
- Uptime monitoring (UptimeRobot.com)

---

## 7. Connect Your Real MT5 Bot

**Edit `scripts/mt5-bot.py`:**
```python
MT5_LOGIN = 123456789  # Your actual MT5 account
MT5_PASSWORD = "YourPassword"
MT5_SERVER = "Exness-MT5Real"
```

**Run both servers:**
```powershell
# Terminal 1: Bot server
python bot-server.py

# Terminal 2: MT5 trading bot
python mt5-bot.py
```

---

## 🎯 Recommended: Option A (Google Cloud Run)

**Why:**
- ✅ Free tier (2M requests/month)
- ✅ Auto-scaling
- ✅ HTTPS included
- ✅ No server management
- ✅ Global CDN

**Cost:** $0 for your traffic volume

---

## 📞 Support

**If you get stuck:**
1. Check bot server logs
2. Verify CORS headers in responses
3. Test API endpoints with curl
4. Check browser console for errors

**Ready to deploy?** Choose your option and let me know if you need help!
