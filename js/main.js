// Xpert Forex Trade - Main JavaScript

// Sample trading signals data
const sampleSignals = [
    {
        pair: 'EUR/USD',
        action: 'BUY',
        entry: '1.0850',
        stopLoss: '1.0820',
        takeProfit: '1.0900',
        status: 'active',
        time: '2 hours ago'
    },
    {
        pair: 'GBP/USD',
        action: 'SELL',
        entry: '1.2650',
        stopLoss: '1.2680',
        takeProfit: '1.2600',
        status: 'active',
        time: '4 hours ago'
    },
    {
        pair: 'USD/JPY',
        action: 'BUY',
        entry: '149.50',
        stopLoss: '149.20',
        takeProfit: '150.00',
        status: 'pending',
        time: '1 hour ago'
    }
];

// Load trading signals
function loadSignals() {
    const container = document.getElementById('signals-container');
    
    if (!container) return;
    
    // Clear loading message
    container.innerHTML = '';
    
    // Generate signal cards
    sampleSignals.forEach(signal => {
        const signalCard = createSignalCard(signal);
        container.appendChild(signalCard);
    });
}

// Create signal card element
function createSignalCard(signal) {
    const card = document.createElement('div');
    card.className = 'signal-card';
    
    const actionColor = signal.action === 'BUY' ? 'var(--success)' : 'var(--danger)';
    
    card.innerHTML = `
        <h3 style="color: ${actionColor}">${signal.pair} - ${signal.action}</h3>
        <div style="margin: 1rem 0;">
            <p><strong>Entry:</strong> ${signal.entry}</p>
            <p><strong>Stop Loss:</strong> ${signal.stopLoss}</p>
            <p><strong>Take Profit:</strong> ${signal.takeProfit}</p>
        </div>
        <div class="signal-meta">
            <span class="status" style="color: ${signal.status === 'active' ? 'var(--success)' : 'var(--warning)'}">
                ${signal.status.toUpperCase()}
            </span>
            <span>${signal.time}</span>
        </div>
    `;
    
    return card;
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Track affiliate link clicks (optional analytics)
function trackAffiliateClicks() {
    document.querySelectorAll('a[href*="YOUR_EXNESS_AFFILIATE_LINK"], a[href*="YOUR_AMAZON_AFFILIATE_LINK"]').forEach(link => {
        link.addEventListener('click', function() {
            console.log('Affiliate link clicked:', this.href);
            // Add your analytics tracking here (e.g., Google Analytics)
        });
    });
}

// Add animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadSignals();
    initSmoothScroll();
    trackAffiliateClicks();
    initScrollAnimations();
    
    console.log('Xpert Forex Trade - Website initialized');
});

// Optional: Auto-refresh signals every 5 minutes
setInterval(function() {
    console.log('Refreshing signals...');
    loadSignals();
}, 300000); // 300000ms = 5 minutes
