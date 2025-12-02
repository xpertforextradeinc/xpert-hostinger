# 🚀 QUICK UPLOAD GUIDE - VS Code SFTP

## Step-by-Step Instructions

### 1️⃣ Install SFTP Extension (1 minute)

1. In VS Code, press `Ctrl + Shift + X`
2. In the search box, type: **SFTP**
3. Find "SFTP" by **Natizyskunk** (should be first result)
4. Click the blue **Install** button
5. Wait for installation to complete ✅

---

### 2️⃣ Delete WordPress Files (2 minutes)

Your server currently has WordPress installed. We need to remove it first.

1. Press `Ctrl + Shift + P` (Command Palette)
2. Type: **SFTP: List**
3. Press Enter
4. Navigate to: `/domains/xpertforextrad.eu/public_html`
5. Select these WordPress files/folders and delete:
   - `wp-admin/` folder
   - `wp-content/` folder  
   - `wp-includes/` folder
   - `index.php` file
   - `wp-config.php` file
   - Any other `wp-*` files
6. Right-click → **Delete**

**OR** delete all files:
- Select all files (Ctrl + A)
- Right-click → Delete
- Confirm

---

### 3️⃣ Upload Your Website (2 minutes)

1. Press `Ctrl + Shift + P`
2. Type: **SFTP: Upload Folder**
3. Press Enter
4. When prompted, select: **Your entire project folder**
5. Wait for upload (2-3 minutes)
6. You'll see upload progress in bottom-right corner

---

### 4️⃣ Verify Upload (30 seconds)

1. Open browser
2. Visit: **https://xpertforextrad.eu**
3. You should see your Xpert Forex Trade homepage! 🎉
4. Test on mobile too

---

## Your SFTP Configuration (Already Set Up!)

```json
{
    "name": "Hostinger",
    "host": "157.173.208.8",
    "port": 65002,
    "username": "u404533250",
    "password": "●●●●●●●●●●●●",
    "remotePath": "/domains/xpertforextrad.eu/public_html"
}
```

✅ Configuration file: `.vscode/sftp.json`

---

## Useful SFTP Commands

After installing the extension, press `Ctrl + Shift + P` and try:

| Command | What it does |
|---------|--------------|
| `SFTP: List` | Browse remote files |
| `SFTP: Upload Folder` | Upload entire project |
| `SFTP: Upload File` | Upload single file |
| `SFTP: Download Folder` | Download from server |
| `SFTP: Sync Local → Remote` | Update changed files only |
| `SFTP: Diff Local → Remote` | Compare local vs remote |

---

## Quick Tips

### Upload Single File
1. Right-click the file
2. Select **Upload** from context menu

### Upload Folder
1. Right-click the folder
2. Select **Upload Folder**

### Auto-Upload on Save (Optional)
Edit `.vscode/sftp.json`:
```json
"uploadOnSave": true
```

---

## Troubleshooting

### Issue: "Cannot connect"
**Solution:** Check your internet connection and try again

### Issue: "Permission denied"
**Solution:** 
1. Check password in `.vscode/sftp.json`
2. Verify server details are correct
3. Contact Hostinger support if still failing

### Issue: Files upload but site shows error
**Solution:** 
1. Make sure you deleted ALL WordPress files first
2. Clear browser cache (Ctrl + F5)
3. Check that `index.html` is in the root of `public_html`

### Issue: "Host key verification failed"
**Solution:** Add this to `.vscode/sftp.json`:
```json
"interactiveAuth": true
```

---

## After Upload Checklist

- [ ] Visit https://xpertforextrad.eu (should load)
- [ ] Test all navigation links
- [ ] Check CSS loads properly
- [ ] Test payment buttons (placeholder mode)
- [ ] Verify affiliate links work
- [ ] Test on mobile device
- [ ] Check on different browsers

---

## Next Steps After Upload

### 1. Add Your API Keys
- **Flutterwave:** Get key from https://dashboard.flutterwave.com
- **Gemini AI:** Get key from https://makersuite.google.com/app/apikey
- **Exness Affiliate:** Get link from https://one.exnesstrack.net

### 2. Setup Automation
- Push code to GitHub
- Add secrets for GitHub Actions
- Enable daily signal generation

### 3. Configure Revenue Streams
- Setup Telegram premium channel
- Configure email marketing
- Add MT5 account details

See **SETUP-GUIDE.md** for complete revenue strategy!

---

## Files Being Uploaded

✅ **Essential Files:**
- `index.html` - Homepage
- `css/style.css` - Styling
- `js/main.js` - Core functionality
- `js/payments.js` - Payment processing
- `js/tracking.js` - Affiliate tracking
- `js/signals.js` - Trading signals
- `js/mt5-api.js` - MT5 integration
- `pages/*.html` - Additional pages
- `images/*` - All images

❌ **Ignored Files (Won't Upload):**
- `.vscode/` - Editor settings
- `.git/` - Git history
- `.github/` - GitHub Actions
- `guides/` - Documentation
- `*.md` - Markdown files

---

## Upload Time Estimate

- Small project (<10 files): **30 seconds**
- Medium project (10-50 files): **1-2 minutes**
- Your project (~15-20 files): **2-3 minutes**

---

## Need Help?

**SFTP Extension Issues:**
- Documentation: https://github.com/Natizyskunk/vscode-sftp
- Restart VS Code if extension doesn't appear
- Check output console: View → Output → SFTP

**Server Issues:**
- Hostinger Support: https://www.hostinger.com/contact
- 24/7 Live Chat available
- Or email: support@hostinger.com

---

**You're about to go LIVE! 🚀💰**

Follow the 4 steps above and your forex trading site will be online in under 5 minutes!
