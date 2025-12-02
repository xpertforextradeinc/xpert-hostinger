# Trading Bot - Enhanced with MT5 Integration
import MetaTrader5 as mt5
import time
import requests
from datetime import datetime

# Configuration
SERVER_URL = "http://localhost:8080/event"
MT5_LOGIN = 123456789  # Your MT5 account number
MT5_PASSWORD = "YourPassword"  # Your MT5 password
MT5_SERVER = "Exness-MT5Real"  # Your broker server

def initialize_mt5():
    """Initialize MT5 connection"""
    if not mt5.initialize():
        print("❌ MT5 initialization failed")
        return False
    
    # Login to MT5 account
    if not mt5.login(MT5_LOGIN, MT5_PASSWORD, MT5_SERVER):
        print(f"❌ MT5 login failed: {mt5.last_error()}")
        mt5.shutdown()
        return False
    
    print("✅ Connected to MT5")
    return True

def get_account_info():
    """Get MT5 account information"""
    account_info = mt5.account_info()
    if account_info is None:
        return None
    
    return {
        "balance": account_info.balance,
        "equity": account_info.equity,
        "profit": account_info.profit,
        "margin": account_info.margin,
        "margin_free": account_info.margin_free
    }

def analyze_market(symbol="EURUSD"):
    """Simple market analysis - Replace with your strategy"""
    # Get last 100 bars
    rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M5, 0, 100)
    
    if rates is None or len(rates) == 0:
        return None
    
    # Simple moving average crossover strategy
    close_prices = [rate[4] for rate in rates]
    sma_fast = sum(close_prices[-10:]) / 10
    sma_slow = sum(close_prices[-50:]) / 50
    
    current_price = close_prices[-1]
    
    # Generate signal
    if sma_fast > sma_slow:
        return {
            "signal": "BUY",
            "pair": symbol,
            "entry": str(current_price),
            "sl": str(current_price - 0.0020),  # 20 pips SL
            "tp": str(current_price + 0.0040)   # 40 pips TP (1:2 RR)
        }
    elif sma_fast < sma_slow:
        return {
            "signal": "SELL",
            "pair": symbol,
            "entry": str(current_price),
            "sl": str(current_price + 0.0020),
            "tp": str(current_price - 0.0040)
        }
    
    return None

def send_signal(signal):
    """Send signal to Flask server"""
    try:
        response = requests.post(SERVER_URL, json=signal, timeout=5)
        if response.status_code == 200:
            print(f"✅ Signal sent: {signal['signal']} {signal['pair']}")
        else:
            print(f"⚠️ Server returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to send signal: {e}")

def main():
    print("🤖 Trading Bot Starting...")
    
    # Initialize MT5
    if not initialize_mt5():
        print("⚠️ Running without MT5 connection")
        mt5_connected = False
    else:
        mt5_connected = True
    
    print("📊 Bot is now analyzing markets...")
    print("🔄 Checking for signals every 30 seconds...")
    
    try:
        while True:
            if mt5_connected:
                # Get account info
                account = get_account_info()
                if account:
                    print(f"💰 Balance: ${account['balance']:.2f} | Profit: ${account['profit']:.2f}")
                
                # Analyze market
                signal = analyze_market("EURUSD")
                
                if signal:
                    send_signal(signal)
            else:
                # Demo mode - generate random signals
                import random
                signal = {
                    "signal": random.choice(["BUY", "SELL"]),
                    "pair": "EURUSD",
                    "entry": "1.0950",
                    "sl": "1.0920",
                    "tp": "1.1000"
                }
                send_signal(signal)
            
            # Wait 30 seconds before next analysis
            time.sleep(30)
            
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped by user")
    finally:
        if mt5_connected:
            mt5.shutdown()
            print("✅ MT5 connection closed")

if __name__ == "__main__":
    main()
