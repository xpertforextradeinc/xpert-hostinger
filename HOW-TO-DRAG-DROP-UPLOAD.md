# 🖱️ HOW TO DRAG & DROP FILES TO HOSTINGER

## Quick Answer: 3 Ways to Drag & Drop

---

## Method 1: Hostinger File Manager (Easiest - Pure Drag & Drop)

### Step-by-Step with Drag & Drop:

**1. Login to Hostinger**
- Open your browser
- Go to: https://hpanel.hostinger.com
- Enter your login credentials

**2. Open File Manager**
- Click on **"Files"** in the left sidebar
- Click on **"File Manager"** button
- A new browser tab will open

**3. Navigate to Upload Location**
- You'll see folders on the left side
- Click: **domains** folder
- Click: **xpertforextrad.eu** folder  
- Click: **public_html** folder
- This is where your website files go!

**4. Open Your Files on Computer**
- Open File Explorer (Windows) or Finder (Mac)
- Navigate to: `[Your project folder location]` (e.g., `C:\Users\YourName\Projects\xpert-hostinger\`)
- You should see your project files (index.html, css folder, js folder, etc.)

**5. DRAG & DROP! 🎯**
- **Arrange windows side-by-side:**
  - Hostinger File Manager on LEFT half of screen
  - Your File Explorer on RIGHT half of screen
  
- **Select files to upload:**
  - In File Explorer, hold `Ctrl` and click each file/folder:
    - ✅ index.html
    - ✅ css (folder)
    - ✅ js (folder)
    - ✅ pages (folder)
    - ✅ images (folder, if you have one)
    - ✅ data (folder)
    - ✅ robots.txt
    - ✅ sitemap.xml
  
- **Drag them over:**
  - Click and HOLD on the selected files
  - Drag your mouse to the Hostinger File Manager window
  - Release the mouse button when you see the upload indicator
  
- **Wait for upload:**
  - You'll see an upload progress bar
  - Wait 2-5 minutes depending on file sizes
  - ✅ Done when progress bar completes!

**6. Verify Upload**
- In File Manager, you should now see all your files
- Visit: https://xpertforextrad.eu
- Your website should be live!

---

## Method 2: FileZilla Drag & Drop (Desktop App)

### Step-by-Step:

**1. Download & Install FileZilla**
- Visit: https://filezilla-project.org
- Download FileZilla Client (FREE)
- Install on your computer

**2. Connect to Hostinger**
- Open FileZilla
- Enter these details at the top:
  - **Host:** `sftp://157.173.208.8`
  - **Username:** `u404533250`
  - **Password:** `Change Kapacity$55`
  - **Port:** `65002`
- Click **Quickconnect**

**3. Navigate on Server (Right Side)**
- On the RIGHT side (Remote site), navigate to:
  - Click: **domains**
  - Click: **xpertforextrad.eu**
  - Click: **public_html**

**4. Open Your Files (Left Side)**
- On the LEFT side (Local site), navigate to:
  - `C:\Users\USER\Projects\xpert-hostinger\`

**5. DRAG & DROP! 🎯**
- Select files on LEFT (your computer)
- Hold `Ctrl` and click to select multiple files:
  - index.html
  - css folder
  - js folder
  - pages folder
  - etc.
- **Drag from LEFT to RIGHT**
- Drop them in the public_html folder
- Upload starts automatically!
- ✅ Done when transfer queue is empty!

---

## Method 3: VS Code SFTP Drag & Drop (For Coders)

### Step-by-Step:

**1. Install SFTP Extension**
- In VS Code, press `Ctrl + Shift + X`
- Search: "SFTP" by Natizyskunk
- Click **Install**

**2. Browse Remote Files**
- Press `Ctrl + Shift + P`
- Type: `SFTP: List`
- Press Enter
- Navigate to: `/domains/xpertforextrad.eu/public_html`

**3. Upload with Right-Click (Alternative to Drag)**
- In VS Code's Explorer (left sidebar)
- Right-click on **index.html**
- Select **"Upload"** from menu
- File uploads to server!

**4. Upload Entire Folder**
- Right-click on your project folder root
- Select **"Upload Folder"**
- All files upload automatically!

---

## Visual Guide: What "Drag & Drop" Means

```
┌─────────────────────────┐      ┌─────────────────────────┐
│   YOUR COMPUTER         │      │   HOSTINGER SERVER      │
│   (File Explorer)       │      │   (File Manager)        │
│                         │      │                         │
│  📄 index.html          │──────│  📁 public_html/        │
│  📁 css/                │ DRAG │     (drop here)         │
│  📁 js/                 │ ───► │                         │
│  📁 pages/              │      │                         │
│  📁 images/             │      │                         │
│                         │      │                         │
└─────────────────────────┘      └─────────────────────────┘
    ↑ Click and hold                  ↑ Release mouse here
    ↑ Move mouse →→→→→→→→→→→→→→→→→→→↑
```

---

## Tips for Successful Drag & Drop

### ✅ DO:
- Select multiple files with `Ctrl + Click`
- Make sure both windows are visible side-by-side
- Wait for upload to complete before closing
- Check File Manager to confirm files are there

### ❌ DON'T:
- Don't drag folders that aren't needed (.git, .github, .vscode)
- Don't close browser during upload
- Don't drag the entire project folder (only the contents)
- Don't upload .md files (documentation files)

---

## What to Do If Drag & Drop Doesn't Work

### Issue: Can't drag files into browser
**Solution:** Your browser might not support drag & drop upload
- Try Chrome or Firefox (best support)
- Use the **"Upload"** button instead of drag & drop
- Or use FileZilla instead (Method 2)

### Issue: Files don't upload
**Solution:**
- Check your internet connection
- Try uploading smaller batches (5 files at a time)
- Use FileZilla as alternative

### Issue: Can't select multiple files
**Solution:**
- Hold `Ctrl` key while clicking each file
- Or click first file, hold `Shift`, click last file (selects range)

---

## Quick Comparison: Which Method for Drag & Drop?

| Method | Ease | Speed | Best For |
|--------|------|-------|----------|
| **Hostinger File Manager** | ⭐⭐⭐⭐⭐ Easiest | Medium | Beginners, one-time uploads |
| **FileZilla** | ⭐⭐⭐⭐ Easy | Fast | Multiple uploads, batch files |
| **VS Code SFTP** | ⭐⭐⭐ Moderate | Fast | Developers, auto-sync |

---

## After Upload Checklist

- [ ] Visit https://xpertforextrad.eu
- [ ] Check homepage loads
- [ ] Click navigation links
- [ ] Test on mobile device
- [ ] Verify CSS styling works
- [ ] Check images load

---

## Still Confused? Watch Your Mouse Movement:

**The Motion:**
1. Move cursor over file → `index.html`
2. Click and HOLD left mouse button (don't release!)
3. While holding, move mouse to Hostinger window
4. Release mouse button over the upload area
5. ✅ File uploads!

**It's like moving files between folders on your computer, but one folder is online!**

---

## Need More Help?

- **Hostinger Support:** https://www.hostinger.com/contact (24/7 Live Chat)
- **FileZilla Guide:** https://wiki.filezilla-project.org/FileZilla_Client_Tutorial
- **Video Tutorial:** Search YouTube for "Hostinger File Manager drag and drop"

---

**You've got this! Just click, hold, drag, and release! 🎯**
