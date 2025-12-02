const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'GBP/JPY'];

async function generateSignals() {
    const prompt = `You are a professional forex analyst. Generate 5 realistic trading signals for today. 

For each signal provide:
- Currency pair
- Direction (buy or sell)  
- Entry price (realistic current market level)
- Take profit (30-100 pips)
- Stop loss (20-50 pips)
- Brief analysis (1 sentence)

Format as JSON array:
[{"pair": "EUR/USD", "direction": "buy", "entry": "1.0850", "tp": "1.0920", "sl": "1.0820", "analysis": "Bullish momentum on H4 chart"}]

Make signals realistic for current market conditions. Current date: ${new Date().toISOString().split('T')[0]}`;

    try {
        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const signals = JSON.parse(jsonMatch[0]);
            
            // Add timestamp
            const enrichedSignals = signals.map(s => ({
                ...s,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toISOString().split('T')[0]
            }));
            
            // Save to file
            fs.mkdirSync('data', { recursive: true });
            fs.writeFileSync('data/signals.json', JSON.stringify(enrichedSignals, null, 2));
            
            console.log('✅ Generated', enrichedSignals.length, 'signals');
            console.log(enrichedSignals);
        }
    } catch (error) {
        console.error('Error generating signals:', error);
        process.exit(1);
    }
}

generateSignals();
