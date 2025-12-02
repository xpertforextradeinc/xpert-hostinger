# Xpert Forex Trade Website

Professional forex trading signals and education platform with affiliate monetization.

## Features

- 📊 Live trading signals display
- 📚 Educational content (Forex basics, risk management)
- 💰 Broker affiliate integration (Exness)
- 🛍️ Amazon affiliate product recommendations
- 📱 Fully responsive design
- ⚡ Fast loading and SEO optimized

## Setup Instructions

### 1. Update Affiliate Links

Replace placeholder links in the following files with your actual affiliate links:

**In `index.html`:**
- Replace `YOUR_EXNESS_AFFILIATE_LINK` with your Exness affiliate URL
- Replace `YOUR_AMAZON_AFFILIATE_LINK` with your Amazon affiliate URL

**In `pages/forex-basics.html` and `pages/risk-management.html`:**
- Replace `YOUR_EXNESS_AFFILIATE_LINK` with your Exness affiliate URL

### 2. Add Broker Logo

- Download the Exness logo
- Save it as `images/exness-logo.png`
- Or update the image path in `index.html`

### 3. Deploy to Hostinger

The SFTP configuration in `.vscode/sftp.json` is already set up:

```json
{
    "name": "Xpert Forex Trade",
    "host": "157.173.208.8",
    "protocol": "sftp",
    "port": 65002,
    "username": "u404533250",
    "remotePath": "/home/u404533250/domains/",
    "uploadOnSave": true
}
```

**To deploy:**
1. Save any file to trigger automatic upload (if using VS Code SFTP extension)
2. Or manually upload all files via FTP client to your domain folder

### 4. Customize Content

**Trading Signals:**
- Edit `js/main.js` - Update the `sampleSignals` array with your signals
- Or integrate with an API to fetch live signals

**Branding:**
- Update "Xpert Forex Trade" text throughout the site
- Modify colors in `css/style.css` (CSS variables at the top)

**Educational Content:**
- Add more articles in the `pages/` folder
- Link them from the homepage education section

## File Structure

```
xpert-hostinger/
├── index.html              # Homepage
├── css/
│   └── style.css          # All styles
├── js/
│   └── main.js            # Trading signals & interactions
├── pages/
│   ├── forex-basics.html  # Educational content
│   └── risk-management.html
├── images/                 # Store images here
│   └── exness-logo.png    # Add broker logo
├── .vscode/
│   └── sftp.json          # SFTP deployment config
└── README.md              # This file
```

## Monetization Strategy

1. **Exness Affiliate** - Primary revenue from broker sign-ups
2. **Amazon Affiliate** - Secondary revenue from trading tools/books
3. **Future:** Premium signals subscription, courses, etc.

## SEO Tips

- Add Google Analytics tracking code
- Submit sitemap to Google Search Console
- Create blog posts with long-tail keywords
- Build backlinks from forex forums/communities
- Add schema markup for articles

## Security Notes

⚠️ **Important:** Your SFTP credentials are stored in `sftp.json`. Consider:
- Adding `.vscode/sftp.json` to `.gitignore` if using version control
- Never commit passwords to public repositories
- Use environment variables for sensitive data in production

## Support

For questions about forex trading or website setup:
- Email: contact@xpertforextrade.com
- Update contact information in footer

## License

© 2025 Xpert Forex Trade. All rights reserved.

---

**Disclaimer:** Trading involves risk. Past performance is not indicative of future results. This website is for educational purposes only.
