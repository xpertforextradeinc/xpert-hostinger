// Xpert Forex Trade - Main JavaScript


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
    initSmoothScroll();
    trackAffiliateClicks();
    initScrollAnimations();
    console.log('Xpert Forex Trade - Website initialized');
});
