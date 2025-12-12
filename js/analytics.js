// Affiliate Link Tracking & Analytics
// Tracks clicks on Exness and Amazon affiliate links

function trackAffiliate(source) {
    console.log('Affiliate click: ' + source);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_click', {
            event_category: 'Affiliate',
            event_label: source,
            value: 1
        });
    }
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', { content_name: source, content_category: 'Affiliate Click' });
    }
    localStorage.setItem('last_affiliate_click', JSON.stringify({ source: source, timestamp: Date.now() }));
}

function addUTMParameters(url, campaign) {
    var utmParams = new URLSearchParams({ utm_source: 'xpertforex', utm_medium: 'website', utm_campaign: campaign || 'direct' });
    var separator = url.indexOf('?') !== -1 ? '&' : '?';
    return url + separator + utmParams.toString();
}

function getQueryParam(name) {
    var m = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return m ? decodeURIComponent(m[1]) : null;
}

function getSiteCampaign() {
    var fromParam = getQueryParam('campaign');
    if (fromParam) { try { localStorage.setItem('campaign_code', fromParam); } catch(e) {} }
    var fromStorage = null;
    try { fromStorage = localStorage.getItem('campaign_code'); } catch(e) {}
    var fromWindow = (typeof window !== 'undefined' && window.CAMPAIGN_CODE) ? window.CAMPAIGN_CODE : null;
    return fromParam || fromWindow || fromStorage || null;
}

function addAmazonTag(url, tag) {
    if (!tag) return url;
    try {
        var u = new URL(url, location.origin);
        if (!u.hostname.includes('amazon')) return url;
        if (!u.searchParams.get('tag')) u.searchParams.set('tag', tag);
        return u.toString();
    } catch(e) { return url + (url.indexOf('?') !== -1 ? '&' : '?') + 'tag=' + encodeURIComponent(tag); }
}

document.addEventListener('DOMContentLoaded', function() {
    var siteCampaign = getSiteCampaign();
    document.querySelectorAll('a[href*="exness"]').forEach(function(link) {
        var campaign = link.getAttribute('data-campaign') || siteCampaign || 'direct';
        link.href = addUTMParameters(link.href, campaign);
        link.addEventListener('click', function() { trackAffiliate('exness'); });
    });
    var amazonTag = (typeof window !== 'undefined' && window.AMAZON_ASSOCIATE_TAG) ? window.AMAZON_ASSOCIATE_TAG : null;
    document.querySelectorAll('a[href*="amazon"]').forEach(function(link) {
        if (amazonTag) link.href = addAmazonTag(link.href, amazonTag);
        link.addEventListener('click', function() { trackAffiliate('amazon'); });
    });
    document.querySelectorAll('a[href="#vip"], button[onclick*="payWithFlutterwave"]').forEach(function(element) {
        element.addEventListener('click', function() { trackAffiliate('vip_subscription'); });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var emailForm = document.getElementById('email-form');
    if (!emailForm) return;
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = this.querySelector('input[type="email"]').value;
        console.log('Email collected:', email);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', { event_category: 'Email', event_label: 'Newsletter' });
        }
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', { content_name: 'Newsletter Signup' });
        }
        alert('✅ Success! Check your email for free signals.');
        this.reset();
    });
});
