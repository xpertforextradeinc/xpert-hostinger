# 📤 Complete Hostinger Upload Guide

## Method 1: SFTP Upload via VS Code (Recommended)

### Step 1: Install SFTP Extension
1. Open VS Code
2. Press `Ctrl + Shift + X` to open Extensions
3. Search for "SFTP" by Natizyskunk
4. Click **Install**

### Step 2: Configure SFTP
You already have `.vscode/sftp.json` configured. Update it with your details:

```json
{
    "name": "Hostinger",
    "host": "srv1.hostinger.com",
    "protocol": "sftp",
    "port": 65002,
    "username": "u404533250",
    "password": "YOUR_PASSWORD_HERE",
    "remotePath": "/domains/xpertforextrad.eu/public_html",
    "uploadOnSave": false,
    "useTempFile": false,
    "openSsh": false
}
```

### Step 3: Upload Files
1. Press `Ctrl + Shift + P`
2. Type: `SFTP: Upload Folder`
3. Select your project folder
4. Wait for upload to complete (2-3 minutes)

### Step 4: Verify Upload
1. Visit: https://xpertforextrad.eu
2. Check if site loads correctly
3. Test payment buttons
4. Verify affiliate links work

---

## Method 2: FileZilla (Alternative)

### Step 1: Download FileZilla
- Visit: https://filezilla-project.org
- Download FileZilla Client
- Install on your computer

### Step 2: Connect to Hostinger
- **Host:** srv1.hostinger.com
- **Username:** u404533250
- **Password:** [Your cPanel password]
- **Port:** 65002
- Click **Quickconnect**

### Step 3: Navigate to Directory
1. On remote side, navigate to: `/domains/xpertforextrad.eu/public_html`
2. On local side, open your project folder
3. Drag and drop all files from local to remote
4. Overwrite when prompted

---

## Method 3: Hostinger File Manager (Easiest)

### Step 1: Access File Manager
1. Login to Hostinger: https://hpanel.hostinger.com
2. Go to **Files** → **File Manager**
3. Navigate to: `public_html`

### Step 2: Upload via Browser
1. Click **Upload** button
2. Select all your project files
3. Drag and drop into browser
4. Wait for upload to complete

⚠️ **Note:** This method is slower for multiple files

---

## Post-Upload Checklist

### 1. Test Payment Integration
- [ ] Click "Get VIP Signals" button
- [ ] Verify Flutterwave modal opens
- [ ] Test with test card (use Flutterwave test mode)

### 2. Test Affiliate Tracking
- [ ] Click Exness affiliate link
- [ ] Open browser console (F12)
- [ ] Verify "Affiliate click tracked" message appears

### 3. Test Signals Display
- [ ] Check if signals container shows
- [ ] Verify countdown timer works
- [ ] Test on mobile device

### 4. Check All Pages
- [ ] Homepage loads correctly
- [ ] Forex Basics page works
- [ ] Risk Management page works
- [ ] All CSS styles applied
- [ ] All images load

### 5. Test on Multiple Devices
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile Chrome
- [ ] Mobile Safari
- [ ] Tablet view

---

## Common Issues & Fixes

### Issue: "Permission Denied"
**Fix:** Set folder permissions to 755
```bash
chmod 755 -R /domains/xpertforextrad.eu/public_html
```

### Issue: CSS Not Loading
**Fix:** Clear browser cache (Ctrl + F5)

### Issue: JS Files Not Working
**Fix:** Check file paths are correct (case-sensitive)

### Issue: Images Not Showing
**Fix:** Verify images folder uploaded correctly

---

## Quick Upload Commands

### Using Git + SSH (Advanced)
```bash
# Initialize git in your project
git init
git add .
git commit -m "Initial commit"

# Add remote (if you have SSH access)
git remote add hostinger ssh://u404533250@srv1.hostinger.com:65002/domains/xpertforextrad.eu/public_html

# Push files
git push hostinger main
```

### Using SCP Command
```bash
scp -P 65002 -r * u404533250@srv1.hostinger.com:/domains/xpertforextrad.eu/public_html/
```

---

## Files That Must Be Uploaded

### Essential Files
```
✅ index.html
✅ css/style.css
✅ js/main.js
✅ js/payments.js
✅ js/tracking.js
✅ js/signals.js
✅ images/* (all images)
✅ pages/* (all HTML pages)
✅ data/.gitkeep
```

### Optional Files (Don't Upload)
```
❌ .git/
❌ .vscode/
❌ .github/
❌ node_modules/
❌ README.md
❌ SETUP-GUIDE.md
❌ guides/
```

---

## Need Help?

If upload fails, check:
1. Hostinger account is active
2. Domain is properly connected
3. SSL certificate is installed
4. File permissions are correct

**Support Contact:**
- Hostinger Support: https://www.hostinger.com/contact
- Live Chat: Available 24/7

---

## Next Step After Upload

Once uploaded, proceed to:
- **"EXNESS"** guide to setup affiliate program
- **"GEMINI"** guide to get API keys
- **"TELEGRAM"** guide for premium channel
