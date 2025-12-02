// Affiliate Click Tracking
// Track all affiliate link clicks for optimization

function trackAffiliate(broker) {
    const data = {
        broker: broker,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent
    };
    
    // Send to your analytics/webhook
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track-affiliate', JSON.stringify(data));
    }
    
    // Store locally for backup
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    clicks.push(data);
    localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
    
    // Google Analytics event (if using GA)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_click', {
            'broker': broker,
            'page': window.location.pathname
        });
    }
    
    // Facebook Pixel (if using)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', { broker: broker });
    }
    
    console.log('Affiliate click tracked:', broker);
}

// Auto-track all affiliate links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href*="exnesstrack"], a[href*="affiliate"]').forEach(link => {
        link.addEventListener('click', function() {
            trackAffiliate(this.dataset.broker || 'exness');
        });
    });
});
