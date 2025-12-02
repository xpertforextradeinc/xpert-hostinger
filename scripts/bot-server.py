from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Store recent signals in memory
recent_signals = []
MAX_SIGNALS = 50

# Add some demo signals on startup
demo_signals = [
    {"signal": "BUY", "pair": "EUR/USD", "entry": "1.0950", "sl": "1.0920", "tp": "1.1000", "time": "2025-12-01 08:30:00"},
    {"signal": "SELL", "pair": "GBP/USD", "entry": "1.2680", "sl": "1.2710", "tp": "1.2630", "time": "2025-12-01 09:15:00"},
    {"signal": "BUY", "pair": "USD/JPY", "entry": "149.80", "sl": "149.50", "tp": "150.20", "time": "2025-12-01 10:00:00"},
    {"signal": "SELL", "pair": "AUD/USD", "entry": "0.6520", "sl": "0.6545", "tp": "0.6480", "time": "2025-12-01 11:30:00"},
    {"signal": "BUY", "pair": "EUR/GBP", "entry": "0.8340", "sl": "0.8315", "tp": "0.8380", "time": "2025-12-01 12:45:00"},
]
recent_signals.extend(demo_signals)

@app.route("/", methods=["GET"])
def home():
    """API Homepage"""
    return jsonify({
        "name": "Xpert Forex Trade - Trading Bot API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "/signals": "GET - Get last 10 trading signals",
            "/stats": "GET - Get trading statistics",
            "/health": "GET - Health check",
            "/event": "POST - Submit new signal (internal)"
        },
        "signals_count": len(recent_signals),
        "documentation": "Visit http://localhost:8080/signals to see signals"
    }), 200

@app.route("/event", methods=["POST"])
def event():
    data = request.json
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Add timestamp to signal
    signal_data = {
        "signal": data.get("signal", "BUY"),
        "pair": data.get("pair", "EUR/USD"),
        "entry": data.get("entry", "Market"),
        "sl": data.get("sl", "Pending"),
        "tp": data.get("tp", "Pending"),
        "time": timestamp
    }
    
    # Store signal
    recent_signals.append(signal_data)
    
    # Keep only last 50 signals
    if len(recent_signals) > MAX_SIGNALS:
        recent_signals.pop(0)
    
    print(f"Received signal: {signal_data}")
    return {"status": "ok", "received": signal_data}, 200

@app.route("/signals", methods=["GET"])
def get_signals():
    """Return last 10 signals for website display"""
    return jsonify({
        "signals": recent_signals[-10:],
        "total": len(recent_signals)
    }), 200

@app.route("/stats", methods=["GET"])
def get_stats():
    """Calculate trading statistics"""
    if not recent_signals:
        return jsonify({
            "total_signals": 0,
            "buy_signals": 0,
            "sell_signals": 0,
            "win_rate": 0
        }), 200
    
    buy_count = sum(1 for s in recent_signals if s["signal"] == "BUY")
    sell_count = sum(1 for s in recent_signals if s["signal"] == "SELL")
    
    return jsonify({
        "total_signals": len(recent_signals),
        "buy_signals": buy_count,
        "sell_signals": sell_count,
        "win_rate": 87,  # Replace with actual calculation
        "last_updated": recent_signals[-1]["time"] if recent_signals else None
    }), 200

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "signals_count": len(recent_signals),
        "timestamp": datetime.now().isoformat()
    }), 200

if __name__ == "__main__":
    print("🚀 Trading Bot API Server Starting...")
    print("📊 Access signals at: http://localhost:8080/signals")
    print("📈 View stats at: http://localhost:8080/stats")
    app.run(host="0.0.0.0", port=8080, debug=False)
