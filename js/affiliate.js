// Affiliate Link Tracking & Analytics
// Tracks clicks on Exness and Amazon affiliate links

// Track affiliate link clicks
function trackAffiliate(source) {
    // Log to console (can be replaced with Google Analytics)
    console.log(`Affiliate click: ${source}`);
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_click', {
            'event_category': 'Affiliate',
            'event_label': source,
            'value': 1
        });
    }
    
    // Send to Facebook Pixel if available
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: source,
            content_category: 'Affiliate Click'
        });
    }
    
    // Store in localStorage for conversion tracking
    localStorage.setItem('last_affiliate_click', JSON.stringify({
        source: source,
        timestamp: Date.now()
    }));
}

// Add UTM parameters to affiliate links
function addUTMParameters(url, campaign) {
    const utmParams = new URLSearchParams({
        utm_source: 'xpertforex',
        utm_medium: 'website',
        utm_campaign: campaign || 'direct'
    });
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${utmParams.toString()}`;
}

// Auto-track all affiliate links on page load
document.addEventListener('DOMContentLoaded', function() {
    // Track Exness links
    document.querySelectorAll('a[href*="exness"]').forEach(link => {
        link.addEventListener('click', function() {
            trackAffiliate('exness');
        });
    });
    
    // Track Amazon links
    document.querySelectorAll('a[href*="amazon"]').forEach(link => {
        link.addEventListener('click', function() {
            trackAffiliate('amazon');
        });
    });
    
    // Track VIP subscription clicks
    document.querySelectorAll('a[href="#vip"], button[onclick*="payWithFlutterwave"]').forEach(element => {
        element.addEventListener('click', function() {
            trackAffiliate('vip_subscription');
        });
    });
});

// Countdown timer for promo bar
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set countdown to 24 hours from now
    let endTime = localStorage.getItem('promo_end_time');
    if (!endTime) {
        endTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('promo_end_time', endTime);
    }
    
    function updateCountdown() {
        const now = Date.now();
        const remaining = endTime - now;
        
        if (remaining <= 0) {
            // Reset countdown
            endTime = Date.now() + (24 * 60 * 60 * 1000);
            localStorage.setItem('promo_end_time', endTime);
        }
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize countdown on page load
document.addEventListener('DOMContentLoaded', startCountdown);

// Email form submission handler
const emailForm = document.getElementById('email-form');
if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Send to your email marketing service (e.g., Mailchimp, ConvertKit)
        console.log('Email collected:', email);
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                'event_category': 'Email',
                'event_label': 'Newsletter'
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Newsletter Signup'
            });
        }
        
        // Show success message
        alert('✅ Success! Check your email for free signals.');
        this.reset();
    });
}
