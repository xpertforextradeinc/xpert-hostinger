#!/usr/bin/env python3
"""
Gemini API Trading Signal Generator for Forex Pairs
Generates trading signals using Google Gemini API based on market analysis
"""

import os
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any
import google.generativeai as genai

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ForexSignalGenerator:
    """Generate Forex trading signals using Gemini API"""
    
    # Popular Forex pairs
    FOREX_PAIRS = [
        'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD',
        'NZD/USD', 'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
        'AUD/JPY', 'EUR/AUD', 'EUR/CAD', 'GBP/CAD', 'AUD/CAD'
    ]
    
    SIGNAL_TYPES = ['BUY', 'SELL', 'HOLD']
    TIMEFRAMES = ['1M', '5M', '15M', '1H', '4H', '1D', '1W']
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Forex Signal Generator
        
        Args:
            api_key: Google Gemini API key (defaults to GEMINI_API_KEY env variable)
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini API initialized successfully")
    
    def generate_signal(self, pair: str, timeframe: str = '1H',
                       market_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate a trading signal for a Forex pair using Gemini API
        
        Args:
            pair: Forex pair (e.g., 'EUR/USD')
            timeframe: Timeframe for analysis (default: '1H')
            market_data: Optional market data dictionary
        
        Returns:
            Dictionary containing signal, confidence, and analysis
        """
        if pair not in self.FOREX_PAIRS:
            logger.warning(f"Pair {pair} not in standard list, proceeding anyway")
        
        if timeframe not in self.TIMEFRAMES:
            logger.warning(f"Timeframe {timeframe} not standard, using as-is")
        
        # Prepare market data context
        market_context = self._prepare_market_context(pair, timeframe, market_data)
        
        # Create prompt for Gemini
        prompt = self._create_analysis_prompt(pair, timeframe, market_context)
        
        try:
            # Get response from Gemini API
            response = self.model.generate_content(prompt)
            
            # Parse the response
            signal_data = self._parse_gemini_response(
                pair, timeframe, response.text
            )
            
            logger.info(f"Generated signal for {pair} ({timeframe}): {signal_data['signal']}")
            return signal_data
            
        except Exception as e:
            logger.error(f"Error generating signal for {pair}: {str(e)}")
            return self._error_response(pair, timeframe, str(e))
    
    def generate_batch_signals(self, pairs: Optional[list] = None,
                              timeframe: str = '1H') -> list:
        """
        Generate signals for multiple Forex pairs
        
        Args:
            pairs: List of pairs to analyze (defaults to top pairs)
            timeframe: Timeframe for analysis
        
        Returns:
            List of signal dictionaries
        """
        pairs_to_analyze = pairs or self.FOREX_PAIRS[:5]  # Default to top 5
        signals = []
        
        logger.info(f"Generating batch signals for {len(pairs_to_analyze)} pairs")
        
        for pair in pairs_to_analyze:
            signal = self.generate_signal(pair, timeframe)
            signals.append(signal)
        
        return signals
    
    def analyze_pair(self, pair: str, timeframe: str = '1H',
                    include_sentiment: bool = True) -> Dict[str, Any]:
        """
        Comprehensive analysis of a Forex pair
        
        Args:
            pair: Forex pair to analyze
            timeframe: Timeframe for analysis
            include_sentiment: Include sentiment analysis
        
        Returns:
            Detailed analysis dictionary
        """
        prompt = f"""
        Analyze the Forex pair {pair} on the {timeframe} timeframe.
        
        Provide a detailed technical analysis including:
        1. Trend direction (Uptrend/Downtrend/Sideways)
        2. Key support and resistance levels
        3. Momentum indicators assessment
        4. Entry and exit points
        5. Risk/Reward ratio
        {"6. Market sentiment analysis" if include_sentiment else ""}
        
        Format the response as a structured JSON object with these fields:
        - signal: BUY/SELL/HOLD
        - confidence: 0-100
        - trend: Uptrend/Downtrend/Sideways
        - support: float
        - resistance: float
        - entry_point: float
        - take_profit: float
        - stop_loss: float
        - risk_reward_ratio: float
        - analysis: string with detailed explanation
        """
        
        try:
            response = self.model.generate_content(prompt)
            analysis = self._parse_gemini_response(pair, timeframe, response.text)
            logger.info(f"Completed analysis for {pair}")
            return analysis
        except Exception as e:
            logger.error(f"Error analyzing {pair}: {str(e)}")
            return self._error_response(pair, timeframe, str(e))
    
    def _prepare_market_context(self, pair: str, timeframe: str,
                               market_data: Optional[Dict[str, Any]]) -> str:
        """Prepare market context for the prompt"""
        context = f"Pair: {pair}, Timeframe: {timeframe}"
        
        if market_data:
            context += f"\nRecent Data: {json.dumps(market_data, indent=2)}"
        
        return context
    
    def _create_analysis_prompt(self, pair: str, timeframe: str,
                               market_context: str) -> str:
        """Create the analysis prompt for Gemini"""
        return f"""
        You are an expert Forex trader. Analyze the following Forex pair and provide a trading signal.
        
        {market_context}
        
        Based on technical analysis principles, provide:
        1. A clear trading signal: BUY, SELL, or HOLD
        2. Confidence level (0-100)
        3. Brief technical analysis
        4. Key support/resistance levels
        5. Suggested entry and exit points
        
        Respond in JSON format with these exact fields:
        {{
            "pair": "{pair}",
            "timeframe": "{timeframe}",
            "signal": "BUY/SELL/HOLD",
            "confidence": <0-100>,
            "analysis": "<brief technical explanation>",
            "support": <price level>,
            "resistance": <price level>,
            "entry_point": <suggested entry>,
            "take_profit": <tp level>,
            "stop_loss": <sl level>,
            "timestamp": "<ISO format timestamp>"
        }}
        """
    
    def _parse_gemini_response(self, pair: str, timeframe: str,
                              response_text: str) -> Dict[str, Any]:
        """Parse Gemini API response"""
        try:
            # Try to extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                signal_data = json.loads(json_str)
            else:
                # Fallback parsing
                signal_data = self._fallback_parse(pair, timeframe, response_text)
            
            # Validate signal field
            if 'signal' not in signal_data:
                signal_data['signal'] = 'HOLD'
            
            # Ensure required fields
            signal_data.setdefault('pair', pair)
            signal_data.setdefault('timeframe', timeframe)
            signal_data.setdefault('timestamp', datetime.utcnow().isoformat())
            signal_data.setdefault('confidence', 50)
            
            return signal_data
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}")
            return self._error_response(pair, timeframe, "JSON parsing error")
    
    def _fallback_parse(self, pair: str, timeframe: str,
                       response_text: str) -> Dict[str, Any]:
        """Fallback parsing for non-JSON responses"""
        signal = 'HOLD'
        confidence = 50
        
        text_upper = response_text.upper()
        if 'BUY' in text_upper:
            signal = 'BUY'
            confidence = 65
        elif 'SELL' in text_upper:
            signal = 'SELL'
            confidence = 65
        
        return {
            'pair': pair,
            'timeframe': timeframe,
            'signal': signal,
            'confidence': confidence,
            'analysis': response_text[:200],
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def _error_response(self, pair: str, timeframe: str,
                       error: str) -> Dict[str, Any]:
        """Generate error response"""
        return {
            'pair': pair,
            'timeframe': timeframe,
            'signal': 'HOLD',
            'confidence': 0,
            'error': error,
            'analysis': f"Error generating signal: {error}",
            'timestamp': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def validate_pair(pair: str) -> bool:
        """Validate Forex pair format"""
        parts = pair.split('/')
        return len(parts) == 2 and len(parts[0]) == 3 and len(parts[1]) == 3


def main():
    """Main function demonstrating the signal generator"""
    import sys
    
    # Initialize generator
    try:
        generator = ForexSignalGenerator()
    except ValueError as e:
        logger.error(f"Initialization error: {str(e)}")
        sys.exit(1)
    
    # Example: Generate signal for a single pair
    logger.info("=" * 60)
    logger.info("Single Pair Analysis")
    logger.info("=" * 60)
    
    signal = generator.generate_signal('EUR/USD', '1H')
    print(json.dumps(signal, indent=2))
    
    # Example: Generate batch signals
    logger.info("\n" + "=" * 60)
    logger.info("Batch Signal Generation")
    logger.info("=" * 60)
    
    batch_signals = generator.generate_batch_signals(
        pairs=['EUR/USD', 'GBP/USD', 'USD/JPY'],
        timeframe='4H'
    )
    
    for signal in batch_signals:
        print(f"\n{signal.get('pair')} - Signal: {signal.get('signal')} "
              f"(Confidence: {signal.get('confidence')}%)")
    
    # Example: Comprehensive analysis
    logger.info("\n" + "=" * 60)
    logger.info("Comprehensive Analysis")
    logger.info("=" * 60)
    
    analysis = generator.analyze_pair('GBP/USD', '1D')
    print(json.dumps(analysis, indent=2))


if __name__ == '__main__':
    main()
