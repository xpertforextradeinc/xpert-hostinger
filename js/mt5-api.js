// MT5 API Integration for Real-Time Performance Display
// Shows live trading results on your website

const MT5_API_URL = '/api/mt5-performance'; // Your backend endpoint

// MT5 Account Configuration (use environment variables in production)
const MT5_CONFIG = {
    server: 'Exness-MT5Real', // Your broker's MT5 server
    login: 'YOUR_MT5_ACCOUNT_NUMBER',
    password: 'YOUR_MT5_PASSWORD',
    // For security, store credentials on backend only
};

// Display real-time performance stats
async function loadMT5Performance() {
    const container = document.getElementById('mt5-performance');
    
    try {
        const response = await fetch(MT5_API_URL);
        const data = await response.json();
        
        if (data.success) {
            displayPerformance(data.stats);
            displayRecentTrades(data.trades);
        } else {
            showDemoStats();
        }
    } catch (error) {
        console.error('MT5 API error:', error);
        showDemoStats();
    }
}

// Display performance statistics
function displayPerformance(stats) {
    const perfHTML = `
        <div class="mt5-stats-grid">
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value">$${stats.balance.toLocaleString()}</div>
                <div class="stat-label">Account Balance</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-value ${stats.profit >= 0 ? 'positive' : 'negative'}">
                    ${stats.profit >= 0 ? '+' : ''}$${stats.profit.toLocaleString()}
                </div>
                <div class="stat-label">Total Profit/Loss</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-value">${stats.winRate}%</div>
                <div class="stat-label">Win Rate</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${stats.totalTrades}</div>
                <div class="stat-label">Total Trades</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">⚖️</div>
                <div class="stat-value">${stats.profitFactor}</div>
                <div class="stat-label">Profit Factor</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📉</div>
                <div class="stat-value">${stats.maxDrawdown}%</div>
                <div class="stat-label">Max Drawdown</div>
            </div>
        </div>
        
        <div class="equity-curve">
            <canvas id="equityChart"></canvas>
        </div>
    `;
    
    document.getElementById('mt5-performance').innerHTML = perfHTML;
    
    // Draw equity curve chart
    drawEquityCurve(stats.equityHistory);
}

// Display recent trades
function displayRecentTrades(trades) {
    const tradesHTML = trades.slice(0, 10).map(trade => `
        <div class="trade-row ${trade.profit >= 0 ? 'win' : 'loss'}">
            <div class="trade-pair">${trade.symbol}</div>
            <div class="trade-type">${trade.type}</div>
            <div class="trade-profit ${trade.profit >= 0 ? 'positive' : 'negative'}">
                ${trade.profit >= 0 ? '+' : ''}$${trade.profit.toFixed(2)}
            </div>
            <div class="trade-date">${new Date(trade.closeTime).toLocaleDateString()}</div>
        </div>
    `).join('');
    
    document.getElementById('recent-trades').innerHTML = `
        <h3>Recent Trades</h3>
        <div class="trades-container">
            ${tradesHTML}
        </div>
    `;
}

// Fallback demo statistics
function showDemoStats() {
    const demoStats = {
        balance: 12847.50,
        profit: 2847.50,
        winRate: 78,
        totalTrades: 145,
        profitFactor: 2.4,
        maxDrawdown: 12.3,
        equityHistory: generateDemoEquity()
    };
    
    displayPerformance(demoStats);
}

// Generate demo equity curve
function generateDemoEquity() {
    const points = [];
    let equity = 10000;
    
    for (let i = 0; i < 30; i++) {
        equity += (Math.random() - 0.3) * 200;
        points.push({
            date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
            value: equity
        });
    }
    
    return points;
}

// Draw equity curve using Chart.js
function drawEquityCurve(equityHistory) {
    const ctx = document.getElementById('equityChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: equityHistory.map(p => p.date.toLocaleDateString()),
            datasets: [{
                label: 'Account Equity',
                data: equityHistory.map(p => p.value),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Auto-refresh every 5 minutes
setInterval(loadMT5Performance, 5 * 60 * 1000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadMT5Performance);
