// UI helpers: smooth scroll and section animations

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initScrollAnimations() {
    var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initScrollAnimations();
    document.querySelectorAll('[data-copy]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var text = btn.getAttribute('data-copy');
            if (!text) return;
            navigator.clipboard && navigator.clipboard.writeText(text).then(function() {
                btn.textContent = 'Copied!';
                setTimeout(function(){ btn.textContent = 'Copy'; }, 1500);
            }).catch(function(){
                var temp = document.createElement('textarea');
                temp.value = text; document.body.appendChild(temp); temp.select();
                try { document.execCommand('copy'); } catch(e) {}
                document.body.removeChild(temp);
                btn.textContent = 'Copied!';
                setTimeout(function(){ btn.textContent = 'Copy'; }, 1500);
            });
        });
    });
});

// Simple client-side entitlements manager
window.entitlements = (function() {
    var KEY = 'xpert_entitlements';
    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e) { return []; }
    }
    function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
    function grant(id) {
        var list = load();
        if (list.indexOf(id) === -1) { list.push(id); save(list); }
    }
    function has(id) { return load().indexOf(id) !== -1; }
    function any(ids) { return ids.some(function(id){ return has(id); }); }
    return { load: load, grant: grant, has: has, any: any };
})();
