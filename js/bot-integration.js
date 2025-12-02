// Live Trading Bot Integration
// Connects to your local Flask server at localhost:8080

const BOT_API_URL = 'http://localhost:8080'; // Change to your deployed URL

// Fetch live signals from your trading bot
async function fetchLiveSignals() {
    try {
        const response = await fetch(`${BOT_API_URL}/signals`);
        const signals = await response.json();
        displayLiveSignals(signals);
    } catch (error) {
        console.log('Bot offline - using sample data');
        // Fallback to sample signals if bot is offline
        loadSignals();
    }
}

// Display live signals from bot
function displayLiveSignals(data) {
    const container = document.getElementById('signals-container');
    if (!container) return;
    
    const signals = data.signals || [];
    
    if (signals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray)">No signals available yet. Bot is warming up...</p>';
        return;
    }
    
    container.innerHTML = signals.slice(0, 6).map(signal => {
        const isBuy = signal.signal === 'BUY';
        const signalColor = isBuy ? 'var(--success)' : '#ef4444';
        const timeAgo = getTimeAgo(signal.time);
        
        return `
        <div class="signal-card live">
            <div class="live-indicator">🟢 LIVE</div>
            <h3 style="color: ${signalColor}; margin-bottom: 0.5rem;">
                ${signal.pair} - ${signal.signal}
            </h3>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Entry</p>
                        <p style="margin: 0.25rem 0 0 0; font-weight: 600;">${signal.entry}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Stop Loss</p>
                        <p style="margin: 0.25rem 0 0 0; font-weight: 600; color: #ef4444;">${signal.sl}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Take Profit</p>
                        <p style="margin: 0.25rem 0 0 0; font-weight: 600; color: ${signalColor};">${signal.tp}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem; margin: 0;">Risk/Reward</p>
                        <p style="margin: 0.25rem 0 0 0; font-weight: 600; color: var(--accent);">1:2</p>
                    </div>
                </div>
            </div>
            <div class="signal-meta">
                <span style="color: var(--success); font-weight: 600;">● ACTIVE</span>
                <span style="color: var(--gray);">${timeAgo}</span>
            </div>
        </div>
        `;
    }).join('');
    
    console.log(`✅ Displaying ${signals.length} live signals from bot`);
}

// Calculate time ago
function getTimeAgo(timeString) {
    try {
        const signalTime = new Date(timeString);
        const now = new Date();
        const diffMs = now - signalTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return signalTime.toLocaleDateString();
    } catch {
        return 'Recently';
    }
}

// Connect to bot WebSocket for real-time updates
function connectToBotWebSocket() {
    // If you add WebSocket support to your Flask bot
    const ws = new WebSocket('ws://localhost:8080/stream');
    
    ws.onmessage = (event) => {
        const signal = JSON.parse(event.data);
        console.log('Real-time signal:', signal);
        
        // Show notification
        if (Notification.permission === 'granted') {
            new Notification(`New ${signal.signal} Signal`, {
                body: `${signal.pair || 'EUR/USD'} - ${signal.signal}`,
                icon: '/images/logo.png'
            });
        }
        
        // Update display
        fetchLiveSignals();
    };
    
    ws.onerror = () => {
        console.log('WebSocket connection failed');
    };
}

// Auto-refresh signals every 10 seconds
setInterval(fetchLiveSignals, 10000);

// Listen for new signals and send notifications
let lastSignalCount = 0;

async function checkForNewSignals() {
    try {
        const response = await fetch(`${BOT_API_URL}/signals`);
        const data = await response.json();
        const currentCount = data.signals?.length || 0;
        
        if (currentCount > lastSignalCount && lastSignalCount > 0) {
            const newSignal = data.signals[data.signals.length - 1];
            sendSignalNotification(newSignal);
        }
        
        lastSignalCount = currentCount;
    } catch (error) {
        console.log('Notification check failed');
    }
}

function sendSignalNotification(signal) {
    const notificationsEnabled = localStorage.getItem('notifications_enabled') === 'true';
    
    if (Notification.permission === 'granted' && notificationsEnabled) {
        const isBuy = signal.signal === 'BUY';
        new Notification(`🚀 New ${signal.signal} Signal!`, {
            body: `${signal.pair} @ ${signal.entry}\nTP: ${signal.tp} | SL: ${signal.sl}`,
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            tag: 'signal-' + Date.now(),
            requireInteraction: false
        });
        
        // Play notification sound (optional)
        playNotificationSound();
    }
}

function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyCzvLGbS0GJHPI8N2JQAkaZrnt559MEBJP');
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } catch (error) {
        // Silent fail if audio not supported
    }
}

// Check for new signals every 15 seconds
setInterval(checkForNewSignals, 15000);

// Try to fetch live signals on load
document.addEventListener('DOMContentLoaded', () => {
    fetchLiveSignals();
    
    // Request notification permission on first visit
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
            if (confirm('Enable notifications to get instant alerts for new trading signals?')) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        localStorage.setItem('notifications_enabled', 'true');
                        new Notification('Notifications Enabled! 🎉', {
                            body: 'You\'ll now receive instant signal alerts',
                            icon: '/images/logo.png'
                        });
                    }
                });
            }
        }, 3000);
    }
    
    // Initialize notification check
    checkForNewSignals();
});
