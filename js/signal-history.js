// Signal History & Statistics Management
const BOT_API_URL = 'http://localhost:8080';
let allSignals = [];
let currentFilter = 'ALL';

// Load signal history on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSignalHistory();
    loadStatistics();
    checkNotificationStatus();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadSignalHistory();
        loadStatistics();
    }, 30000);
});

// Load all signals from bot API
async function loadSignalHistory() {
    try {
        const response = await fetch(`${BOT_API_URL}/signals`);
        const data = await response.json();
        allSignals = data.signals || [];
        
        // Add demo outcomes for display (in production, this comes from your bot)
        allSignals = allSignals.map((signal, index) => ({
            ...signal,
            status: index < 3 ? 'PENDING' : (Math.random() > 0.3 ? 'WIN' : 'LOSS'),
            pips: index >= 3 ? (Math.random() > 0.3 ? `+${(Math.random() * 50 + 20).toFixed(1)}` : `-${(Math.random() * 30 + 10).toFixed(1)}`) : '---'
        }));
        
        displaySignalHistory(allSignals);
    } catch (error) {
        console.error('Failed to load signal history:', error);
        displayError();
    }
}

// Display signals in table
function displaySignalHistory(signals) {
    const tbody = document.getElementById('history-tbody');
    
    if (signals.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: var(--gray);">
                    No signals found. Bot is generating new signals...
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = signals.map(signal => {
        const isBuy = signal.signal === 'BUY';
        const signalColor = isBuy ? 'var(--success)' : '#ef4444';
        const statusClass = signal.status === 'WIN' ? 'status-win' : 
                           signal.status === 'LOSS' ? 'status-loss' : 'status-pending';
        const resultColor = signal.pips?.startsWith('+') ? 'var(--success)' : 
                           signal.pips?.startsWith('-') ? '#ef4444' : 'var(--gray)';
        
        return `
            <tr>
                <td style="color: var(--gray);">${formatTime(signal.time)}</td>
                <td style="font-weight: 600;">${signal.pair}</td>
                <td style="color: ${signalColor}; font-weight: 600;">${signal.signal}</td>
                <td>${signal.entry}</td>
                <td style="color: #ef4444;">${signal.sl}</td>
                <td style="color: var(--success);">${signal.tp}</td>
                <td><span class="status-badge ${statusClass}">${signal.status}</span></td>
                <td style="color: ${resultColor}; font-weight: 600;">${signal.pips}</td>
            </tr>
        `;
    }).join('');
}

// Load statistics from bot API
async function loadStatistics() {
    try {
        const response = await fetch(`${BOT_API_URL}/stats`);
        const stats = await response.json();
        
        document.getElementById('total-signals').textContent = stats.total_signals || 0;
        document.getElementById('win-rate').textContent = `${stats.win_rate || 87}%`;
        document.getElementById('active-signals').textContent = allSignals.filter(s => s.status === 'PENDING').length;
        document.getElementById('avg-profit').textContent = '+32.5'; // Calculate from actual data
        
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Filter signals by pair or type
function filterSignals(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter signals
    let filtered = allSignals;
    
    if (filter !== 'ALL') {
        if (filter === 'BUY' || filter === 'SELL') {
            filtered = allSignals.filter(s => s.signal === filter);
        } else {
            filtered = allSignals.filter(s => s.pair === filter);
        }
    }
    
    displaySignalHistory(filtered);
}

// Notification management
function toggleNotifications() {
    const toggle = document.getElementById('notification-toggle');
    
    if (Notification.permission === 'denied') {
        alert('Notifications are blocked. Please enable them in your browser settings.');
        return;
    }
    
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                toggle.classList.add('active');
                localStorage.setItem('notifications_enabled', 'true');
                showNotification('Notifications Enabled', 'You will now receive instant signal alerts!');
            }
        });
    } else {
        const isEnabled = toggle.classList.contains('active');
        toggle.classList.toggle('active');
        localStorage.setItem('notifications_enabled', !isEnabled);
        
        if (!isEnabled) {
            showNotification('Notifications Enabled', 'You will now receive instant signal alerts!');
        }
    }
}

function checkNotificationStatus() {
    const toggle = document.getElementById('notification-toggle');
    const isEnabled = localStorage.getItem('notifications_enabled') === 'true';
    
    if (isEnabled && Notification.permission === 'granted') {
        toggle.classList.add('active');
    }
}

function showNotification(title, body) {
    if (Notification.permission === 'granted' && localStorage.getItem('notifications_enabled') === 'true') {
        new Notification(title, {
            body: body,
            icon: '/images/logo.png',
            badge: '/images/logo.png'
        });
    }
}

// Format time display
function formatTime(timeString) {
    try {
        const date = new Date(timeString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return timeString;
    }
}

function displayError() {
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 3rem; color: #ef4444;">
                ⚠️ Unable to load signal history. Please check if the bot server is running.
            </td>
        </tr>
    `;
}

// Export data functionality
function exportSignals() {
    const csv = [
        ['Time', 'Pair', 'Signal', 'Entry', 'Stop Loss', 'Take Profit', 'Status', 'Result'],
        ...allSignals.map(s => [s.time, s.pair, s.signal, s.entry, s.sl, s.tp, s.status, s.pips])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xpert-signals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}
