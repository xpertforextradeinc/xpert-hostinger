# 🔧 Fix "Error Establishing Database Connection"

## The Problem

Your Hostinger hosting has WordPress installed by default, which requires a database. Your new static HTML site doesn't need WordPress or a database.

## Solution: Remove WordPress Files

You need to **delete the WordPress installation** and upload your static HTML files.

---

## Method 1: Via Hostinger File Manager (Easiest)

### Step 1: Delete WordPress Files
1. Login: https://hpanel.hostinger.com
2. Go to **Files** → **File Manager**
3. Navigate to: `/domains/xpertforextrad.eu/public_html`
4. **Select All** (Ctrl + A)
5. Click **Delete** → Confirm
6. Empty the `public_html` folder completely

### Step 2: Upload Your Files
1. Still in File Manager
2. Click **Upload** button
3. Navigate to your project folder: `c:\Users\USER\Projects\xpert-hostinger`
4. Select and upload ALL files:
   - `index.html`
   - `css/` folder
   - `js/` folder
   - `images/` folder
   - `pages/` folder
   - `components/` folder
5. Wait for upload to complete
6. Visit: https://xpertforextrad.eu

---

## Method 2: Via SFTP (Recommended)

### Step 1: Connect with SFTP
Already configured in `.vscode/sftp.json`:
- Host: 157.173.208.8
- Port: 65002
- User: u404533250

### Step 2: Delete WordPress
1. Press `Ctrl + Shift + P`
2. Type: `SFTP: List`
3. Navigate to remote `/domains/xpertforextrad.eu/public_html`
4. Delete all WordPress files (wp-admin, wp-content, wp-includes, etc.)

### Step 3: Upload Your Site
1. Press `Ctrl + Shift + P`
2. Type: `SFTP: Upload Folder`
3. Select your project folder
4. Done!

---

## Method 3: Via FileZilla

### Step 1: Download FileZilla
- Visit: https://filezilla-project.org
- Install FileZilla Client

### Step 2: Connect to Server
- Host: `sftp://157.173.208.8`
- Username: `u404533250`
- Password: `Change Kapacity$55`
- Port: `65002`
- Click **Quickconnect**

### Step 3: Clean and Upload
1. Navigate to: `/domains/xpertforextrad.eu/public_html`
2. Select all WordPress files (wp-admin, wp-content, etc.)
3. Right-click → **Delete**
4. Drag your project files from local to remote
5. Wait for upload

---

## What Files to Delete (WordPress)

Remove these WordPress files/folders:
```
❌ wp-admin/
❌ wp-content/
❌ wp-includes/
❌ index.php
❌ wp-config.php
❌ wp-login.php
❌ xmlrpc.php
❌ .htaccess (if exists)
❌ Any other WordPress files
```

Keep ONLY:
```
✅ index.html (your site)
✅ css/
✅ js/
✅ images/
✅ pages/
✅ components/
✅ data/
```

---

## After Cleaning

### Your File Structure Should Look Like:
```
public_html/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── payments.js
│   ├── tracking.js
│   ├── signals.js
│   └── mt5-api.js
├── images/
├── pages/
│   ├── forex-basics.html
│   └── risk-management.html
├── components/
└── data/
    └── .gitkeep
```

---

## Verify It Works

1. Visit: https://xpertforextrad.eu
2. You should see your **Xpert Forex Trade** homepage
3. No database error!
4. Check on mobile too

---

## If Still Shows Error

### Clear Browser Cache
- Press `Ctrl + F5` (hard refresh)
- Or use incognito mode

### Check .htaccess File
If you see `.htaccess` file in public_html:

**Option 1: Delete it**
```bash
# It's likely WordPress config
```

**Option 2: Replace with this:**
```apache
# Simple .htaccess for static site
DirectoryIndex index.html

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
</IfModule>
```

---

## Alternative: Fresh Domain Setup

If you want to start completely fresh:

### 1. Via Hostinger Control Panel
1. Login: https://hpanel.hostinger.com
2. Go to **Websites**
3. Find: xpertforextrad.eu
4. Click **Manage**
5. Scroll to **Advanced** → **Remove Website**
6. Confirm removal
7. Re-add domain as **Empty Template** (not WordPress)

### 2. Upload Your Files
Now upload via File Manager or SFTP as normal.

---

## Quick Command Line Fix (Advanced)

If you have SSH access:

```bash
# Connect via SSH
ssh u404533250@157.173.208.8 -p 65002

# Navigate to public_html
cd /domains/xpertforextrad.eu/public_html

# Remove all WordPress files
rm -rf wp-* xmlrpc.php

# Exit
exit
```

Then upload your files via SFTP.

---

## Why This Happens

Hostinger often installs WordPress by default when you create a website. Your new static HTML site doesn't need:
- ❌ WordPress
- ❌ PHP
- ❌ Database (MySQL)
- ❌ wp-config.php

It only needs:
- ✅ HTML files
- ✅ CSS files  
- ✅ JavaScript files
- ✅ Images

---

## Prevention for Future

When creating new sites on Hostinger:
1. Choose **"Empty Template"** NOT WordPress
2. Or manually delete WordPress before uploading
3. Static HTML sites are simpler and faster!

---

## Need Help?

If still having issues:
1. Screenshot the error
2. Check Hostinger error logs: Control Panel → Error Logs
3. Contact Hostinger support (24/7 live chat)
4. Or share the error here

---

**Your static site will load MUCH FASTER without WordPress! 🚀**
