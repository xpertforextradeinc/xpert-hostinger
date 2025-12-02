# Trading Bot Setup & Deployment

## 🚀 Quick Start (Local Testing)

### 1. Install Dependencies
```powershell
cd C:\Users\USER\Projects\xpert-hostinger\scripts
pip install -r requirements.txt
```

### 2. Start the Bot Server
```powershell
python bot-server.py
```
Server will run at: `http://localhost:8080`

### 3. Start the Trading Bot
```powershell
# Edit mt5-bot.py with your MT5 credentials first
python mt5-bot.py
```

### 4. Test the Website
Open `index.html` in your browser - signals will update automatically!

---

## 🌐 Deploy to Production (Hostinger)

### Option 1: Deploy Bot to Cloud (Recommended)

**Use Google Cloud Run (Free tier):**

```powershell
# 1. Build Docker image
cd C:\Users\USER\Projects\xpert-hostinger\scripts
docker build -t gcr.io/xpert-forex-trade/bot-server .

# 2. Push to Google Container Registry
docker push gcr.io/xpert-forex-trade/bot-server

# 3. Deploy to Cloud Run
gcloud run deploy bot-server \
  --image gcr.io/xpert-forex-trade/bot-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Your bot will get a URL like: `https://bot-server-xxxxx-uc.a.run.app`

**Update website to use production URL:**
- Edit `js/bot-integration.js`
- Change `BOT_API_URL` to your Cloud Run URL

### Option 2: Run Bot on Your PC (Simple)

**Keep bot running 24/7 on your computer:**

```powershell
# Create Windows scheduled task
$action = New-ScheduledTaskAction -Execute "python" -Argument "C:\Users\USER\Projects\xpert-hostinger\scripts\mt5-bot.py"
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "ForexTradingBot" -Description "Xpert Forex Trading Bot"
```

**Port forwarding (if you want website to access local bot):**
- Use ngrok: `ngrok http 8080`
- Update `BOT_API_URL` with ngrok URL

### Option 3: Deploy Both Bot & Website to VPS

**Use your Hostinger VPS or similar:**

```bash
# SSH to your server
ssh u404533250@157.173.208.8

# Install Python
sudo apt update
sudo apt install python3 python3-pip

# Upload bot files
scp -r scripts/ u404533250@157.173.208.8:/home/u404533250/bot/

# Run with supervisor (keeps bot running)
sudo apt install supervisor
```

---

## 🔧 Configuration

### MT5 Credentials (mt5-bot.py)
```python
MT5_LOGIN = 123456789       # Your MT5 account
MT5_PASSWORD = "password"    # Your password
MT5_SERVER = "Exness-MT5Real"
```

### Update Website API URL (js/bot-integration.js)
```javascript
const BOT_API_URL = 'https://your-bot-url.com';  // Production URL
```

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/signals` | GET | Get last 10 signals |
| `/stats` | GET | Get trading statistics |
| `/health` | GET | Check bot status |
| `/event` | POST | Receive new signals (internal) |

---

## 🧪 Testing

**Test signal generation:**
```powershell
# Send test signal
curl -X POST http://localhost:8080/event -H "Content-Type: application/json" -d '{"signal":"BUY","pair":"EURUSD","entry":"1.0950"}'

# Get signals
curl http://localhost:8080/signals
```

**Test website integration:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Should see: "Real-time signal: {signal: 'BUY', ...}"

---

## 🐛 Troubleshooting

**Bot won't connect to MT5:**
- Ensure MT5 is installed and running
- Check login credentials
- Enable algorithmic trading in MT5 (Tools > Options > Expert Advisors)

**Website can't reach bot:**
- Check CORS is enabled in bot-server.py
- Verify bot is running: http://localhost:8080/health
- Check browser console for errors

**Signals not updating:**
- Refresh the page
- Check Network tab in DevTools
- Ensure bot-integration.js is loaded

---

## 💡 Pro Tips

1. **Use WebSocket** for instant updates (upgrade from polling)
2. **Add authentication** to protect your API endpoints
3. **Store signals in database** (PostgreSQL/MySQL) instead of memory
4. **Add email alerts** when high-confidence signals appear
5. **Create admin dashboard** to control bot from website

---

## 📈 Next Steps

1. ✅ Test locally with sample signals
2. ✅ Connect MT5 for real signals
3. ⏳ Deploy bot to Cloud Run
4. ⏳ Update website with production URL
5. ⏳ Add paid VIP features (full signal details)

**Ready to go live!** 🚀
