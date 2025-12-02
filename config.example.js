# Production Configuration
# Copy this to config.js after deployment

// For PRODUCTION deployment, update these URLs:
// 1. If using Cloud Run: https://bot-server-xxxxx-uc.a.run.app
// 2. If using ngrok: https://xxxx-xx-xxx.ngrok-free.app
// 3. If using local (testing only): http://localhost:8080

// TEMPORARY: Keep using localhost for testing
const BOT_API_URL = 'http://localhost:8080';

// When ready for production:
// const BOT_API_URL = 'https://your-deployed-bot-url.com';

// Payment Keys (Replace with your actual keys)
const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK-xxxxxxxxxxxxxxxxxxxx-X';

// Analytics IDs (Replace with your actual IDs)
const GOOGLE_ADSENSE_ID = 'ca-pub-XXXXXXXXXX';
const FACEBOOK_PIXEL_ID = 'YOUR_PIXEL_ID';

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BOT_API_URL, FLUTTERWAVE_PUBLIC_KEY };
}
