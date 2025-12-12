// Live Trading Bot Integration
// Connects to your local Flask server at localhost:8080

var BOT_API_URL = (typeof window !== 'undefined' && window.BOT_API_URL) ? window.BOT_API_URL : null;

async function fetchLiveSignals() {
    if (!BOT_API_URL) { loadSignals(); return; }
    try {
        var response = await fetch(BOT_API_URL + '/signals');
        var signals = await response.json();
        displayLiveSignals(signals);
    } catch (error) {
        console.log('Bot offline - using sample data');
        loadSignals();
    }
}

function displayLiveSignals(data) {
    var container = document.getElementById('signals-container');
    if (!container) return;
    var signals = data.signals || [];
    if (signals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray)">No signals available yet. Bot is warming up...</p>';
        return;
    }
    container.innerHTML = signals.slice(0, 6).map(function(signal) {
        var isBuy = signal.signal === 'BUY';
        var signalColor = isBuy ? 'var(--success)' : '#ef4444';
        var timeAgo = getTimeAgo(signal.time);
        return (
            '<div class="signal-card live">' +
            '<div class="live-indicator">🟢 LIVE</div>' +
            '<h3 style="color: ' + signalColor + '; margin-bottom: 0.5rem;">' + signal.pair + ' - ' + signal.signal + '</h3>' +
            '<div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin: 1rem 0;">' +
            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">' +
            '<div><p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Entry</p><p style="margin: 0.25rem 0 0 0; font-weight: 600;">' + signal.entry + '</p></div>' +
            '<div><p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Stop Loss</p><p style="margin: 0.25rem 0 0 0; font-weight: 600; color: #ef4444;">' + signal.sl + '</p></div>' +
            '<div><p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Take Profit</p><p style="margin: 0.25rem 0 0 0; font-weight: 600; color: ' + signalColor + ';">' + signal.tp + '</p></div>' +
            '<div><p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Risk/Reward</p><p style="margin: 0.25rem 0 0 0; font-weight: 600; color: var(--accent);">1:2</p></div>' +
            '</div></div>' +
            '<div class="signal-meta"><span style="color: var(--success); font-weight: 600;">● ACTIVE</span><span style="color: var(--gray);">' + timeAgo + '</span></div>' +
            '</div>'
        );
    }).join('');
}

function getTimeAgo(timeString) {
    try {
        var signalTime = new Date(timeString);
        var now = new Date();
        var diffMs = now - signalTime;
        var diffMins = Math.floor(diffMs / 60000);
        var diffHours = Math.floor(diffMins / 60);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return diffMins + 'm ago';
        if (diffHours < 24) return diffHours + 'h ago';
        return signalTime.toLocaleDateString();
    } catch (e) { return 'Recently'; }
}

function connectToBotWebSocket() {
    if (!BOT_API_URL) return;
    var wsUrl = BOT_API_URL.replace('http', 'ws') + '/stream';
    var ws = new WebSocket(wsUrl);
    ws.onmessage = function(event) {
        var signal = JSON.parse(event.data);
        console.log('Real-time signal:', signal);
        if (Notification.permission === 'granted') {
            new Notification('New ' + signal.signal + ' Signal', { body: (signal.pair || 'EUR/USD') + ' - ' + signal.signal, icon: '/images/logo.png' });
        }
        fetchLiveSignals();
    };
    ws.onerror = function() { console.log('WebSocket connection failed'); };
}

setInterval(fetchLiveSignals, 10000);

var lastSignalCount = 0;
async function checkForNewSignals() {
    if (!BOT_API_URL) return;
    try {
        var response = await fetch(BOT_API_URL + '/signals');
        var data = await response.json();
        var currentCount = (data.signals && data.signals.length) || 0;
        if (currentCount > lastSignalCount && lastSignalCount > 0) {
            var newSignal = data.signals[data.signals.length - 1];
            sendSignalNotification(newSignal);
        }
        lastSignalCount = currentCount;
    } catch (error) { console.log('Notification check failed'); }
}

function sendSignalNotification(signal) {
    var notificationsEnabled = localStorage.getItem('notifications_enabled') === 'true';
    if (Notification.permission === 'granted' && notificationsEnabled) {
        var isBuy = signal.signal === 'BUY';
        new Notification('🚀 New ' + signal.signal + ' Signal!', { body: signal.pair + ' @ ' + signal.entry + '\nTP: ' + signal.tp + ' | SL: ' + signal.sl, icon: '/images/logo.png', badge: '/images/logo.png', tag: 'signal-' + Date.now(), requireInteraction: false });
        playNotificationSound();
    }
}

function playNotificationSound() {
    try {
        var audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyCzvLGbS0GJHPI8N2JQAkaZrnt559MEBJP');
        audio.volume = 0.3;
        audio.play().catch(function() {});
    } catch (error) {}
}

setInterval(checkForNewSignals, 15000);

document.addEventListener('DOMContentLoaded', function() {
    fetchLiveSignals();
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(function() {
            if (confirm('Enable notifications to get instant alerts for new trading signals?')) {
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        localStorage.setItem('notifications_enabled', 'true');
                        new Notification('Notifications Enabled! 🎉', { body: "You'll now receive instant signal alerts", icon: '/images/logo.png' });
                    }
                });
            }
        }, 3000);
    }
    checkForNewSignals();
});
